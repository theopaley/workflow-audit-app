import Anthropic from "@anthropic-ai/sdk";
import { WORKFLOW_AUDIT_SYSTEM_PROMPT } from "./ai-prompt";
import type { SurveyAnswers } from "@/types/survey";

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

// ─── Analysis function ────────────────────────────────────────────────────────

/**
 * Sends survey answers to Claude and returns the structured audit analysis.
 * Must be called server-side only — requires ANTHROPIC_API_KEY env var.
 */
export async function analyzeWorkflows(
  answers: SurveyAnswers
): Promise<AnalysisResult> {
  const client = new Anthropic();

  const unknownInputs: string[] = [];
  if (answers.fin_monthly_leads === "I honestly don't know") unknownInputs.push("monthly_leads (defaulted to 20 — owner does not know their lead volume)");
  if (answers.fin_avg_sale === "I'm not sure") unknownInputs.push("avg_job_value (defaulted to 5000 — owner does not know their average sale)");
  if (answers.fin_close_rate === "I honestly don't know") unknownInputs.push("close_rate (defaulted to 0.20 — owner does not know their close rate)");
  if (answers.fin_monthly_revenue === "I honestly don't know") unknownInputs.push("monthly_revenue (defaulted — owner does not know their monthly revenue)");

  const unknownNote = unknownInputs.length > 0
    ? `\n\nIMPORTANT — the following financial inputs are estimates because the owner said they don't know:\n${unknownInputs.map(s => `- ${s}`).join("\n")}\nWhen writing leakageExplanation for these areas, say "We've estimated X as a conservative baseline since you weren't sure of the exact figure" instead of stating it as a fact the owner provided.`
    : "";

  const userMessage = `Here are the survey responses for this workflow audit:

${JSON.stringify(answers, null, 2)}

Please analyse these responses thoroughly and return the complete audit report as a single valid JSON object. Do not include any text before or after the JSON.${unknownNote}`;

  // Stream the response — output can be large (12 areas × multiple text fields)
  const stream = client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: WORKFLOW_AUDIT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const message = await stream.finalMessage();

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("AI analysis returned no text content");
  }

  const raw = textBlock.text.trim();

  // Strip markdown code fences if Claude wraps the JSON in ```json ... ```
  const fenceMatch = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const jsonStr = fenceMatch ? fenceMatch[1] : raw;

  let result: AnalysisResult;
  try {
    result = JSON.parse(jsonStr) as AnalysisResult;
  } catch {
    throw new Error(
      `Failed to parse AI response as JSON. Raw response:\n${raw.slice(0, 500)}`
    );
  }

  return result;
}
