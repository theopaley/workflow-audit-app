import Anthropic from "@anthropic-ai/sdk";
import { WORKFLOW_AUDIT_SYSTEM_PROMPT } from "./ai-prompt";
import type { SurveyAnswers } from "@/types/survey";

// ─── Response types ───────────────────────────────────────────────────────────

export type Grade = "Red" | "Amber" | "Green";
export type Effort = "Low" | "Medium" | "High";

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
}

export interface Priority {
  areaName: string;
  headline: string;
  effort: Effort;
  impact: Effort;
  firstStep: string;
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
  areas: AreaResult[];
  topThreePriorities: Priority[];
  closingMessage: string;
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

  const userMessage = `Here are the survey responses for this workflow audit:

${JSON.stringify(answers, null, 2)}

Please analyse these responses thoroughly and return the complete audit report as a single valid JSON object. Do not include any text before or after the JSON.`;

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
