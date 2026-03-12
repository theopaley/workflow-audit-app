import { NextRequest, NextResponse } from "next/server";
import { generateAuditPDF } from "@/lib/pdf-generator";
import type { AnalysisResult } from "@/lib/ai-analysis";
import type { SurveyAnswers } from "@/types/survey";

export async function POST(req: NextRequest) {
  let auditResult: AnalysisResult;
  let auditAnswers: SurveyAnswers;

  try {
    const body = await req.json();
    auditResult = body.auditResult;
    auditAnswers = body.auditAnswers;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!auditResult || !auditAnswers) {
    return NextResponse.json(
      { error: "Both auditResult and auditAnswers are required" },
      { status: 400 }
    );
  }

  let pdf: Uint8Array;
  try {
    pdf = await generateAuditPDF(auditResult, auditAnswers);
  } catch (err) {
    console.error("[generate-report] PDF generation failed:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="workflowaudit-report.pdf"',
      "Content-Length": String(pdf.byteLength),
    },
  });
}
