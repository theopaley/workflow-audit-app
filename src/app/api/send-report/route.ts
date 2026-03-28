export const maxDuration = 300;

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
  console.log("[send-report] PDF buffer size:", pdfBuffer.byteLength, "bytes");
  console.log("[send-report] Business:", result.businessName, "| Owner:", result.ownerName);

  try {
    await sendReportEmails(result, answers, pdfBuffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[send-report] Email delivery failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  console.log("[send-report] Done");
  return NextResponse.json({ ok: true });
}
