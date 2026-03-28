export const maxDuration = 300;

import { NextRequest, NextResponse } from "next/server";
import { analyzeWorkflows } from "@/lib/ai-analysis";
import { verticalRegistry } from "@/lib/verticals";
import type { SurveyAnswers } from "@/types/survey";

export async function POST(req: NextRequest) {
  // Fail fast with a clear message if the API key is missing — avoids a
  // confusing Anthropic SDK error surfacing as a generic 500.
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[/api/analyze] ANTHROPIC_API_KEY is not set");
    return NextResponse.json(
      { error: "Server configuration error: AI service not configured" },
      { status: 500 }
    );
  }

  let answers: SurveyAnswers;

  try {
    answers = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body — expected JSON" },
      { status: 400 }
    );
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json(
      { error: "Request body must be a survey answers object" },
      { status: 400 }
    );
  }

  // If the payload carries a verticalId (set by VerticalSurvey on submit),
  // resolve the matching config so analyzeWorkflows can override the leakage
  // rates and inject the vertical-specific AI prompt additions.
  const verticalId =
    typeof answers.verticalId === "string" ? answers.verticalId : undefined;
  const verticalConfig = verticalId ? verticalRegistry[verticalId] : undefined;

  try {
    const result = await analyzeWorkflows(answers, verticalConfig);
    return NextResponse.json(result);
  } catch (err) {
    // Log the full error object so Vercel logs capture status codes, error
    // types, and stack traces — not just the message string.
    console.error("[/api/analyze] Analysis failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Analysis failed", detail: message },
      { status: 500 }
    );
  }
}
