import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./ai-prompt";
import { getLeakageRange } from "./leakage-range";
import type { SurveyAnswers } from "@/types/survey";
import type { VerticalConfig, VerticalArea } from "@/lib/verticals/types";

// ─── Response types ───────────────────────────────────────────────────────────

export type Grade = "Red" | "Amber" | "Green";
export type Effort = "Low" | "Medium" | "High";
export type StackAction = "CONFIGURE" | "CONNECT" | "REPLACE" | "DEPLOY" | null;

export interface AreaResult {
  id: string;
  name: string;
  score: number;
  grade: Grade;
  scoreReasoning: string;
  stat?: string;
  monthlyLeakage: number;
  leakageExplanation: string;
  recommendation: string;
  priority: 1 | 2 | 3 | null;
  stackAction: StackAction;
  stackReasoning: string;
  replacementTool: string;
}

export interface Priority {
  areaName: string;
  headline: string;
  effort: Effort;
  impact: Effort;
  firstStep: string;
}

export interface StackSummary {
  configureCount: number;
  connectCount: number;
  replaceCount: number;
  deployCount: number;
  estimatedImplementationHours: number;
  topStackIssue: string;
}

export interface AnalysisResult {
  businessName: string;
  ownerName: string;
  overallScore: number;
  overallGrade: Grade;
  reportOpening: string;
  monthlyRevenue: number;
  totalMonthlyLeakage: number;
  totalAnnualLeakage: number;
  visibilityMultiplier: number;
  recommendedTier: string;
  stackSummary: StackSummary;
  areas: AreaResult[];
  topThreePriorities: Priority[];
  closingPoints?: string[];
}

// ─── Vertical leakage rate section ───────────────────────────────────────────

/**
 * Builds a structured leakage rate override block from a vertical config's
 * workflowAreas and leakageFormula.  This section is appended to the system
 * prompt so Claude uses the vertical-specific rates instead of the universal
 * percentages defined in the base prompt.
 */

/**
 * Builds a section mapping each area to its locked industryBenchmarkStat so
 * the AI copies it verbatim into the `stat` field instead of inventing its own.
 */
function buildLockedStatSection(workflowAreas: VerticalArea[]): string {
  const lines: string[] = [
    "LOCKED BENCHMARK STATS — for each area below, copy the stat text EXACTLY into the area's \"stat\" field in your JSON output. Do not paraphrase, shorten, or swap stats between areas.",
    "",
  ];
  for (const area of workflowAreas) {
    lines.push(`AREA: ${area.name} (${area.id})`);
    lines.push(`STAT: ${area.industryBenchmarkStat}`);
    lines.push("");
  }
  return lines.join("\n");
}

function buildLeakageRateSection(
  workflowAreas: VerticalArea[],
  leakageFormula: Record<string, number>
): string {
  const leadBased = workflowAreas.filter((a) => a.leakageType === "lead-based");
  const revBased = workflowAreas.filter((a) => a.leakageType === "revenue-based");
  const multiplier = workflowAreas.filter((a) => a.leakageType === "multiplier");

  const lines: string[] = [
    "VERTICAL LEAKAGE RATES — use these rates instead of the universal rates in the LEAKAGE FORMULAS section above. The calculation structure (lead-based vs revenue-based, CAP rules, output format) is unchanged; only the percentages differ.",
    "",
  ];

  if (leadBased.length > 0) {
    lines.push(
      "Lead-based (calculated from lead volume and average job value):"
    );
    for (const area of leadBased) {
      const rate = leakageFormula[area.id] ?? 0;
      lines.push(`  • ${area.name} (${area.id}): monthly_leads × avg_job_value × ${rate}`);
    }
    lines.push("");
  }

  if (revBased.length > 0) {
    lines.push(
      "Revenue-based (calculated as a percentage of monthly revenue):"
    );
    for (const area of revBased) {
      const rate = leakageFormula[area.id] ?? 0;
      lines.push(`  • ${area.name} (${area.id}): monthly_revenue × ${rate}`);
    }
    lines.push("");
  }

  if (multiplier.length > 0) {
    lines.push(
      "Multiplier areas (amplify the summed leakage of all other areas):"
    );
    for (const area of multiplier) {
      const increment = leakageFormula[area.id] ?? 0;
      const highX = (1 + increment).toFixed(2);
      const midX = (1 + increment / 2).toFixed(2);
      // Be explicit about the per-card monthlyLeakage formula so the model
      // does not misread the multiplier as applying only to totalMonthlyLeakage
      // while leaving this area's own monthlyLeakage at 0.
      lines.push(
        `  • ${area.name} (${area.id}):
    - score < 40:  set this area's monthlyLeakage = baseLeakageTotal × ${increment.toFixed(2)}  (total leakage becomes ${highX}× of base)
    - score 40–69: set this area's monthlyLeakage = baseLeakageTotal × ${(increment / 2).toFixed(2)}  (total leakage becomes ${midX}× of base)
    - score 70+:   set this area's monthlyLeakage = 0`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Property-maintenance leakage formula overrides ──────────────────────────
//
// Areas 1 (pm_lead_capture) and 2 (pm_service_agreement) use an LTV multiplier
// (× 18 months) instead of a single-job value.  Area 10 (pm_retention_churn)
// uses a churn-based formula.  Neither can be expressed by the generic
// buildLeakageRateSection() output, so we inject explicit override instructions
// that appear after the standard rate section and take precedence.

const PROPERTY_MAINTENANCE_LEAKAGE_OVERRIDE = `
PROPERTY-MAINTENANCE LEAKAGE FORMULA OVERRIDES — these three area IDs use formulas that differ from the standard section above. Apply them exactly for these IDs only; all other areas use the rates listed above.

Note: avg_visit_value = answers.fin_avg_sale_value (same field — renamed for clarity in this vertical).

AREA: pm_lead_capture (Lead Capture)
Formula: monthly_leads × 0.20 × avg_visit_value × 18
Rationale: Lost leads in a recurring business represent lost LTV, not a single visit. The ×18 factor represents an 18-month average customer lifetime for a property maintenance account.
leakageExplanation format: "Out of your estimated [monthly_leads] leads per month, roughly [N] never get captured or followed up before going cold. At $[avg_visit_value] per visit with an 18-month average client lifetime, each lost lead represents $[avg_visit_value × 18] in LTV — that's [N] lost accounts × $[LTV] = $[raw_estimate] raw estimate."

AREA: pm_service_agreement (Service Agreement & Proposal)
Formula: monthly_leads × close_rate × 0.12 × avg_visit_value × 18
Rationale: These are leads who reached the proposal stage but didn't convert. Each lost proposal is a lost recurring account — apply the same LTV multiplier.
leakageExplanation format: "Of the roughly [monthly_leads × close_rate] leads who reach the proposal stage each month, about [N] fall through due to friction or slow follow-up. At $[avg_visit_value] per visit × 18-month LTV = $[LTV] per account — that's [N] lost accounts × $[LTV] = $[raw_estimate] raw estimate."

AREA: pm_retention_churn (Retention & Churn Prevention)
Formula (churn-based):
  estimated_active_accounts = monthly_revenue / avg_visit_value
  assumed_monthly_churn_rate = 0.05
  lost_accounts_per_month = estimated_active_accounts × 0.05
  monthly_leakage = lost_accounts_per_month × avg_visit_value × 12
  Fallback if avg_visit_value is unavailable: monthly_revenue × 0.20
Rationale: 5% monthly churn is the industry average for recurring property services. Each cancelled account loses 12 months of future visits at their average visit value.
leakageExplanation format: "With an estimated [estimated_active_accounts] active accounts and a 5% industry-average monthly churn rate, roughly [lost_accounts_per_month] accounts cancel each month. At $[avg_visit_value] per visit × 12 annual visits, each cancellation costs $[avg_visit_value × 12] per year — that's [lost_accounts_per_month] accounts × $[annual_value] = $[monthly_leakage] monthly raw estimate."

The 40% monthly revenue cap still applies as the ceiling on total leakage across all areas.
`;

// ─── Med-spa leakage formula overrides ───────────────────────────────────────
//
// Areas 1 (hw_lead_capture) and 2 (hw_lead_nurture) use a conditional LTV
// multiplier (× 8) when the practice runs memberships or a mixed model.
// This cannot be expressed by the generic buildLeakageRateSection() output, so
// we inject an explicit override block that takes precedence for those two areas.

const MED_SPA_LEAKAGE_OVERRIDE = `
MED-SPA LEAKAGE FORMULA OVERRIDES — Areas 1 and 2 use a conditional LTV multiplier that depends on the hw_revenue_model answer. Apply the correct formula for these IDs; all other areas use the standard rates listed above.

Note: avg_treatment_value = answers.fin_avg_sale_value (same field — relabeled for this vertical).

AREA: hw_lead_capture (Lead Capture & Response Time)
Base formula: monthly_leads × 0.20 × avg_treatment_value
LTV-adjusted formula (use when hw_revenue_model = "Primarily memberships or prepaid packages — clients commit upfront" OR "Mixed — roughly split between memberships and one-time treatments"):
  monthly_leads × 0.20 × avg_treatment_value × 8
Rationale: In a membership-based practice, each lost lead represents lost LTV, not a single treatment. The ×8 factor represents 8 treatments over the average client lifetime for an aesthetic membership client.
leakageExplanation format (LTV model): "Out of your estimated [monthly_leads] leads per month, roughly [N] never get captured or followed up before going cold. At $[avg_treatment_value] per treatment × 8 visits over the average client lifetime, each lost lead represents $[avg_treatment_value × 8] in LTV — that's [N] lost leads × $[LTV] = $[raw_estimate] raw estimate."
leakageExplanation format (one-time model): "Out of your estimated [monthly_leads] leads per month, roughly [N] are lost before ever becoming clients. At $[avg_treatment_value] per treatment, that's [N] × $[avg_treatment_value] = $[raw_estimate] raw estimate."

AREA: hw_lead_nurture (Lead Nurture & Consultation Booking)
Base formula: monthly_leads × 0.15 × avg_treatment_value
LTV-adjusted formula (use when hw_revenue_model = "Primarily memberships or prepaid packages — clients commit upfront" OR "Mixed — roughly split between memberships and one-time treatments"):
  monthly_leads × 0.15 × avg_treatment_value × 8
Rationale: Same LTV logic — a nurtured lead who eventually converts represents a membership lifetime, not a single visit.
leakageExplanation format (LTV model): "Of the roughly [monthly_leads] leads in your pipeline, about [N] drop off during nurture before ever booking a consultation. At $[avg_treatment_value] × 8-visit lifetime value = $[LTV] per client — that's [N] lost leads × $[LTV] = $[raw_estimate] raw estimate."
leakageExplanation format (one-time model): "Of the roughly [monthly_leads] leads in your pipeline, about [N] drop off during nurture before booking. At $[avg_treatment_value] per treatment, that's [N] × $[avg_treatment_value] = $[raw_estimate] raw estimate."

The 40% monthly revenue cap still applies as the ceiling on total leakage across all areas.
`;

// ─── Fitness-wellness leakage formula overrides ─────────────────────────────
//
// Areas 1 (fw_lead_capture) and 2 (fw_trial_conversion) use an LTV multiplier
// (× 18 months) representing average member lifetime.  Area 2 also uses
// close_rate.  Neither can be expressed by the generic buildLeakageRateSection()
// output, so we inject explicit override instructions.

const FITNESS_WELLNESS_LEAKAGE_OVERRIDE = `
FITNESS & WELLNESS LEAKAGE FORMULA OVERRIDES — these two area IDs use formulas that differ from the standard section above. Apply them exactly for these IDs only; all other areas use the rates listed above.

Note: avg_membership_value = answers.fin_avg_sale_value (same field — renamed for clarity in this vertical).

AREA: fw_lead_capture (Lead Capture & Response Time)
Formula: monthly_leads × 0.20 × avg_membership_value × 18
Rationale: Lost leads in a membership business represent lost LTV, not a single month of dues. The ×18 factor represents an 18-month average member lifetime.
leakageExplanation format: "Out of your estimated [monthly_leads] prospects per month, roughly [N] never get captured or followed up before going cold. At $[avg_membership_value]/month with an 18-month average member lifetime, each lost lead represents $[avg_membership_value × 18] in LTV — that's [N] lost members × $[LTV] = $[raw_estimate] raw estimate."

AREA: fw_trial_conversion (Trial-to-Member Conversion)
Formula: monthly_leads × close_rate × 0.18 × avg_membership_value × 18
Rationale: These are prospects who visited for a trial but didn't convert to a paying membership. Each lost conversion is a lost recurring member — apply the same LTV multiplier.
leakageExplanation format: "Of the roughly [monthly_leads × close_rate] prospects who visit for a trial each month, about [N] don't convert due to weak follow-up or no structured conversion process. At $[avg_membership_value]/month × 18-month LTV = $[LTV] per member — that's [N] lost members × $[LTV] = $[raw_estimate] raw estimate."

The 40% monthly revenue cap still applies as the ceiling on total leakage across all areas.
`;

// ─── Anthropic client (module-scoped — reused across requests) ────────────────

const client = new Anthropic();

// ─── Analysis function ────────────────────────────────────────────────────────

/**
 * Sends survey answers to Claude and returns the structured audit analysis.
 * Must be called server-side only — requires ANTHROPIC_API_KEY env var.
 *
 * Pass a VerticalConfig when the answers came from a vertical survey.  This
 * causes the system prompt to include (a) the vertical's leakage rate
 * overrides derived from config.leakageFormula, and (b) the vertical's
 * narrative additions from config.aiPromptAdditions.
 *
 * Pass verticalId to enable vertical-specific formula injection (e.g.
 * LTV-based and churn-based formulas for property-maintenance).
 */
export async function analyzeWorkflows(
  answers: SurveyAnswers,
  verticalConfig?: VerticalConfig,
  verticalId?: string
): Promise<AnalysisResult> {

  // Build vertical-specific additions: leakage rate overrides first (structured,
  // machine-generated from leakageFormula), followed by the narrative additions
  // from the vertical config.  Both are appended under a single labeled section.
  let additions: string | undefined;
  if (verticalConfig) {
    const rateSection = buildLeakageRateSection(
      verticalConfig.workflowAreas,
      verticalConfig.leakageFormula
    );

    // Some verticals use non-standard formula types (LTV-based, churn-based,
    // or conditional multipliers) that the generic rate section cannot express.
    // Inject an explicit override block so Claude uses the correct formulas
    // regardless of what the generic section says about those areas.
    const formulaOverride =
      verticalId === "property-maintenance"
        ? PROPERTY_MAINTENANCE_LEAKAGE_OVERRIDE
        : verticalId === "med-spa"
        ? MED_SPA_LEAKAGE_OVERRIDE
        : verticalId === "fitness-wellness"
        ? FITNESS_WELLNESS_LEAKAGE_OVERRIDE
        : "";

    const lockedStats = buildLockedStatSection(verticalConfig.workflowAreas);

    const parts = [rateSection, formulaOverride, lockedStats, verticalConfig.aiPromptAdditions]
      .filter(Boolean)
      .join("\n");
    additions = parts || undefined;
  }

  const systemPrompt = buildSystemPrompt(additions, verticalConfig?.displayName);

  const unknownInputs: string[] = [];
  if (answers.fin_monthly_leads === "I honestly don't know") unknownInputs.push("monthly_leads (defaulted to 20 — owner does not know their lead volume)");
  if (answers.fin_avg_sale === "I'm not sure") unknownInputs.push("avg_job_value (defaulted to 5000 — owner does not know their average sale)");
  if (answers.fin_close_rate === "I honestly don't know") unknownInputs.push("close_rate (defaulted to 0.20 — owner does not know their close rate)");
  if (answers.fin_monthly_revenue === "I honestly don't know") unknownInputs.push("monthly_revenue (defaulted — owner does not know their monthly revenue)");

  const unknownNote = unknownInputs.length > 0
    ? `\n\nIMPORTANT — the following financial inputs are estimates because the owner said they don't know:\n${unknownInputs.map(s => `- ${s}`).join("\n")}\nWhen writing leakageExplanation for these areas, say "We've estimated X as a conservative baseline since you weren't sure of the exact figure" instead of stating it as a fact the owner provided.`
    : "";

  // Strip empty, skipped, and unknown-sentinel values before sending to the AI.
  // "I honestly don't know" / "I'm not sure" answers are already captured in
  // unknownNote above — sending them again in the payload wastes tokens.
  const UNKNOWN_SENTINELS = new Set(["I honestly don't know", "I'm not sure"]);
  const trimmedAnswers = Object.fromEntries(
    Object.entries(answers).filter(([, v]) => {
      if (v === null || v === undefined) return false;
      if (Array.isArray(v)) return v.length > 0 && v.some((s) => String(s).trim().length > 0);
      if (typeof v === "string") return v.trim().length > 0 && !UNKNOWN_SENTINELS.has(v);
      return true;
    })
  );

  // When a vertical config is present, build a pre-filled area scaffold so the
  // AI receives the exact id+name pairs as non-overridable values.  This prevents
  // the AI from hallucinating area names or reordering areas.
  let areaScaffold = "";
  if (verticalConfig) {
    const scaffold = verticalConfig.workflowAreas.map((a) => ({
      id: a.id,
      name: a.name,
    }));
    areaScaffold = `\n\nIMPORTANT — Your response MUST use these exact area objects in this exact order. The "id" and "name" fields below are pre-filled and MUST NOT be changed:\n${JSON.stringify(scaffold, null, 2)}`;
  }

  const userMessage = `Here are the survey responses for this workflow audit:

${JSON.stringify(trimmedAnswers, null, 2)}

Please analyse these responses thoroughly and return the complete audit report as a single valid JSON object. CRITICAL: Output raw JSON only. Do NOT use markdown code fences. Do NOT wrap in backticks. Do NOT write \`\`\`json or \`\`\`. Your response must start with { and end with } and contain nothing else. Any markdown formatting will cause a system failure.${unknownNote}${areaScaffold}`;

  // Call the API and attempt to parse the response as JSON. Returns the parsed
  // result or throws with the raw response for diagnostics.
  const callAndParse = async (): Promise<AnalysisResult> => {
    const stream = client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 6000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    let message: Awaited<ReturnType<typeof stream.finalMessage>>;
    try {
      message = await stream.finalMessage();
    } catch (err) {
      console.error("[ai-analysis] Anthropic API call failed:", err);
      throw err;
    }

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    if (!raw.trim()) {
      throw new Error("AI analysis returned no text content");
    }

    // Three-step JSON extraction — catches every fence variation.
    // Step 1: Try raw trimmed response directly.
    const trimmed = raw.trim();
    try {
      return JSON.parse(trimmed) as AnalysisResult;
    } catch { /* fall through */ }

    // Step 2: Strip ALL markdown fences globally and retry.
    const stripped = trimmed.replace(/```(?:json)?\s*/g, "").trim();
    try {
      return JSON.parse(stripped) as AnalysisResult;
    } catch { /* fall through */ }

    // Step 3: Extract outermost JSON object by braces.
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const extracted = trimmed.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(extracted) as AnalysisResult;
      } catch { /* fall through */ }
    }

    // All three steps failed — throw for retry.
    throw new Error(
      `Failed to parse AI response as JSON. Raw response:\n${raw.slice(0, 500)}`
    );
  };

  // Attempt with one automatic retry on JSON parse failure.
  let result: AnalysisResult;
  try {
    result = await callAndParse();
  } catch (firstErr) {
    console.warn(
      "[ai-analysis] First attempt failed, retrying once:",
      firstErr instanceof Error ? firstErr.message.slice(0, 200) : firstErr
    );
    result = await callAndParse();
  }

  // Programmatic cap enforcement — the AI prompt instructs a 40% cap but
  // LLMs can exceed it.  Enforce it here so the report never overstates.
  const monthlyRevenue = Number(answers.fin_monthly_revenue_value) || 0;
  if (monthlyRevenue > 0) {
    const capAmount = Math.round(monthlyRevenue * 0.40);
    if (result.totalMonthlyLeakage > capAmount) {
      const scaleFactor = capAmount / result.totalMonthlyLeakage;
      result.areas = result.areas.map((area: AreaResult) => ({
        ...area,
        monthlyLeakage: Math.round((area.monthlyLeakage ?? 0) * scaleFactor),
      }));
      // Remainder adjustment — add any rounding difference to the largest area
      const scaledTotal = result.areas.reduce((sum: number, a: AreaResult) => sum + (a.monthlyLeakage ?? 0), 0);
      const remainder = capAmount - scaledTotal;
      if (remainder !== 0) {
        const largestArea = result.areas.reduce((max: AreaResult, a: AreaResult) =>
          (a.monthlyLeakage ?? 0) > (max.monthlyLeakage ?? 0) ? a : max
        );
        largestArea.monthlyLeakage = (largestArea.monthlyLeakage ?? 0) + remainder;
      }
      result.totalMonthlyLeakage = capAmount;
    }
  }

  // Append our calculated leakage sentence to the AI's reportOpening.
  if (result.reportOpening && typeof result.reportOpening === 'string') {
    const range = getLeakageRange(result.totalMonthlyLeakage);
    const ourSentence = `Every month these gaps stay open costs you ${range.displayFull}. Here's exactly where it's going.`;

    const sentences = result.reportOpening
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    const cleaned = sentences
      .filter(s => {
        if (/here'?s exactly where it'?s going/i.test(s)) return false;
        if (/every month these gaps/i.test(s)) return false;
        const isValidation = /roughly|around|that'?s not luck|that'?s execution|that'?s solid|that'?s impressive|that'?s real/i.test(s);
        if (!isValidation && /\$[\d,]+/.test(s) && /cost(?:s|ing)?\s+you|costing|losing|leakage/i.test(s)) return false;
        return true;
      })
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const opening = cleaned.endsWith('.') ? cleaned : cleaned + '.';
    result.reportOpening = opening + ' ' + ourSentence;
  }

  return result;
}
