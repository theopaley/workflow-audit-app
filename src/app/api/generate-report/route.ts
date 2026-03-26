export const maxDuration = 60;

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
    // Build name-based lookup (lowercased + trimmed) — AI area IDs are
    // normalised and never match the hs_* prefixed config IDs, so ID
    // matching is intentionally omitted here.
    const statByName = new Map<string, string>();
    for (const area of verticalConfig.workflowAreas) {
      statByName.set(area.name.toLowerCase().trim(), area.industryBenchmarkStat);
    }

    // Returns the locked stat for an AI-produced area name using:
    //   1. Exact match (lowercased + trimmed)
    //   2. Fuzzy fallback — any word ≥4 chars from either name appears in the other
    const findLockedStat = (aiName: string): string | undefined => {
      const norm = aiName.toLowerCase().trim();

      if (statByName.has(norm)) return statByName.get(norm);

      for (const [configName, stat] of statByName) {
        const configWords = configName.split(/\W+/).filter((w) => w.length >= 4);
        const aiWords = norm.split(/\W+/).filter((w) => w.length >= 4);
        const matched =
          configWords.some((w) => norm.includes(w)) ||
          aiWords.some((w) => configName.includes(w));
        if (matched) return stat;
      }

      return undefined;
    };

    auditResult = {
      ...auditResult,
      areas: auditResult.areas.map((area) => {
        const lockedStat = findLockedStat(area.name);
        if (!lockedStat) return area;
        return { ...area, stat: lockedStat };
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
