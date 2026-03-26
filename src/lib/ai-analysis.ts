import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./ai-prompt";
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
  stat: string;
  monthlyLeakage: number;
  leakageExplanation: string;
  normalize: string;
  reframe: string;
  empower: string;
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
  tierRationale: string;
  stackSummary: StackSummary;
  areas: AreaResult[];
  topThreePriorities: Priority[];
  closingPoints: string[];
}

// ─── Vertical leakage rate section ───────────────────────────────────────────

/**
 * Builds a structured leakage rate override block from a vertical config's
 * workflowAreas and leakageFormula.  This section is appended to the system
 * prompt so Claude uses the vertical-specific rates instead of the universal
 * percentages defined in the base prompt.
 */
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
      lines.push(
        `  • ${area.name} (${area.id}): ${highX}× when score < 40 | ${midX}× when score 40–69 | 1.00× when score 70+`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

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
 */
export async function analyzeWorkflows(
  answers: SurveyAnswers,
  verticalConfig?: VerticalConfig
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
    additions = verticalConfig.aiPromptAdditions
      ? `${rateSection}\n${verticalConfig.aiPromptAdditions}`
      : rateSection;
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

  const userMessage = `Here are the survey responses for this workflow audit:

${JSON.stringify(trimmedAnswers, null, 2)}

Please analyse these responses thoroughly and return the complete audit report as a single valid JSON object. Do not include any text before or after the JSON.${unknownNote}`;

  // Use the SDK's stream().finalMessage() pattern — stream() keeps the SSE
  // connection alive (beating the Vercel timeout) while finalMessage() waits
  // for the guaranteed-complete response before resolving.
  const stream = client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const message = await stream.finalMessage();
  const raw = message.content[0].type === "text" ? message.content[0].text : "";

  if (!raw.trim()) {
    throw new Error("AI analysis returned no text content");
  }

  // Strip markdown code fences if Claude wraps the JSON in ```json ... ```
  const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  let result: AnalysisResult;
  try {
    result = JSON.parse(clean) as AnalysisResult;
  } catch {
    throw new Error(
      `Failed to parse AI response as JSON. Raw response:\n${raw.slice(0, 500)}`
    );
  }

  return result;
}
