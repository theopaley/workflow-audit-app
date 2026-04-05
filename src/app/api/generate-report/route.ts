export const maxDuration = 300;

import { NextRequest, NextResponse } from "next/server";
import { generateAuditPDF } from "@/lib/pdf-generator";
import { verticalRegistry } from "@/lib/verticals";
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

  // If the payload originated from a vertical survey, replace every area's
  // AI-generated stat with the locked industryBenchmarkStat string from the
  // vertical config.  These strings are authoritative and must appear verbatim.
  const verticalId =
    typeof auditAnswers.verticalId === "string"
      ? auditAnswers.verticalId
      : undefined;
  const verticalConfig = verticalId ? verticalRegistry[verticalId] : undefined;

  if (verticalConfig) {
    // Build ID-based lookups for locked names and stats — bulletproof against
    // AI hallucinating area names since we match on the area ID.
    const nameById = new Map<string, string>();
    const statById = new Map<string, string>();
    for (const area of verticalConfig.workflowAreas) {
      nameById.set(area.id, area.name);
      statById.set(area.id, area.industryBenchmarkStat);
    }

    auditResult = {
      ...auditResult,
      areas: auditResult.areas.map((area) => {
        const lockedName = nameById.get(area.id);
        const lockedStat = statById.get(area.id);
        return {
          ...area,
          ...(lockedName ? { name: lockedName } : {}),
          ...(lockedStat ? { stat: lockedStat } : {}),
        };
      }),
    };
  }

  let pdfStream: ReadableStream;
  try {
    pdfStream = await generateAuditPDF(auditResult, auditAnswers);
  } catch (err) {
    console.error("[generate-report] PDF generation failed:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }

  return new NextResponse(pdfStream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="workflowaudit-report.pdf"',
    },
  });
}
