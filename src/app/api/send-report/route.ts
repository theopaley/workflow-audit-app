import { NextRequest, NextResponse } from "next/server";
import { sendReportEmails } from "@/lib/email";
import type { AnalysisResult } from "@/lib/ai-analysis";
import type { SurveyAnswers } from "@/types/survey";

export async function POST(req: NextRequest) {
  let answers: SurveyAnswers;
  let result: AnalysisResult;
  let pdfBase64: string;

  try {
    const body = await req.json();
    answers = body.answers;
    result = body.result;
    pdfBase64 = body.pdf;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!answers || !result || !pdfBase64) {
    return NextResponse.json(
      { error: "answers, result, and pdf are required" },
      { status: 400 }
    );
  }

  const pdfBuffer = Buffer.from(pdfBase64, "base64");

  try {
    await sendReportEmails(result, answers, pdfBuffer);
  } catch (err) {
    console.error("[send-report] Email delivery failed:", err);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
