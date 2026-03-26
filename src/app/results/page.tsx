"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnalysisResult } from "@/lib/ai-analysis";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Status = "Critical" | "Needs Improvement" | "Healthy";

import type { StackAction } from "@/lib/ai-analysis";

const STACK_ACTION_CONFIG: Record<NonNullable<StackAction>, { color: string; bg: string; border: string; label: string }> = {
  DEPLOY:    { color: "text-red-700",     bg: "bg-red-50",     border: "border-red-100",     label: "Deploy"    },
  REPLACE:   { color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-100",  label: "Replace"   },
  CONNECT:   { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-100",   label: "Connect"   },
  CONFIGURE: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100", label: "Configure" },
};

const STATUS_CONFIG: Record<Status, { color: string; bg: string; dot: string; label: string }> = {
  Critical: {
    color: "text-red-700",
    bg: "bg-red-50 border-red-100",
    dot: "bg-red-500",
    label: "Critical",
  },
  "Needs Improvement": {
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-100",
    dot: "bg-amber-400",
    label: "Needs Improvement",
  },
  Healthy: {
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-100",
    dot: "bg-emerald-500",
    label: "Healthy",
  },
};

function gradeToStatus(grade: string): Status {
  if (grade === "Green") return "Healthy";
  if (grade === "Amber") return "Needs Improvement";
  return "Critical";
}

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function scoreColor(score: number) {
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function scoreRingColor(score: number) {
  if (score >= 70) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <svg width="144" height="144" viewBox="0 0 144 144">
      <circle cx="72" cy="72" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle
        cx="72"
        cy="72"
        r={r}
        fill="none"
        stroke={scoreRingColor(score)}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 72 72)"
      />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [revenueLabel, setRevenueLabel] = useState<string>("");
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("auditResult");
      if (!raw) {
        router.push("/audit");
        return;
      }
      const parsed = JSON.parse(raw) as AnalysisResult;
      setResult(parsed);

      try {
        const answersRaw = sessionStorage.getItem("auditAnswers");
        if (answersRaw) {
          const answers = JSON.parse(answersRaw) as Record<string, unknown>;
          const label = answers["fin_monthly_revenue_label"];
          if (label) setRevenueLabel(String(label).replace("/month", "").trim());
        }
      } catch {
        // revenue label is cosmetic — silently skip if unavailable
      }
    } catch {
      router.push("/audit");
    }
  }, [router]);

  const downloadPdf = async () => {
    if (!result) return;
    setPdfState("loading");
    try {
      const answersRaw = sessionStorage.getItem("auditAnswers");
      const auditAnswers = answersRaw ? JSON.parse(answersRaw) : {};
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditResult: result, auditAnswers }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "workflowaudit-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setPdfState("idle");
    } catch (err) {
      console.error("[download-report]", err);
      setPdfState("error");
    }
  };

  // Render nothing while reading sessionStorage (avoids flash of empty content)
  if (!result) return null;

  const criticalCount = result.areas.filter((a) => a.grade === "Red").length;
  const needsCount = result.areas.filter((a) => a.grade === "Amber").length;
  const healthyCount = result.areas.filter((a) => a.grade === "Green").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Nav */}
      <header className="border-b border-slate-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-base font-semibold tracking-tight text-slate-900">
            RevRep.ai Workflow Audit
          </span>
          <Link
            href="/"
            className="text-sm text-slate-400 transition-colors hover:text-slate-600"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">

        {/* Email confirmation banner */}
        <div className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-indigo-600">
              <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
              <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-indigo-900">Your full PDF report is on its way</p>
            <p className="mt-0.5 text-sm text-indigo-700">
              We've emailed your complete Workflow Audit Report — including detailed findings, scores for every area, and your full action plan. Check your inbox.
            </p>
          </div>
        </div>

        {/* Score card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="mb-1 text-2xl font-bold text-slate-900">Your Workflow Health Score</h1>
          <p className="mb-8 text-slate-500">
            {revenueLabel
              ? `You've built a business generating ${revenueLabel} in monthly revenue. Here's how your workflows measure up.`
              : "Based on your responses across all 12 workflow areas."}
          </p>

          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            {/* Ring + leakage */}
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div className="relative">
                <ScoreRing score={result.overallScore} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${scoreColor(result.overallScore)}`}>
                    {result.overallScore}
                  </span>
                  <span className="text-xs font-medium text-slate-400">/ 100</span>
                </div>
              </div>
              {result.totalMonthlyLeakage > 0 && (
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                    Est. Monthly Leakage
                  </p>
                  <p className={`text-2xl font-bold ${scoreColor(result.overallScore)}`}>
                    {formatCurrency(result.totalMonthlyLeakage)}<span className="text-sm font-medium text-slate-400"> /mo</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatCurrency(result.totalAnnualLeakage)} per year
                  </p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-1 flex-col gap-4">
              <p className="text-slate-600 leading-relaxed">
                {result.reportOpening}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {criticalCount} Critical
                </div>
                <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  {needsCount} Needs Improvement
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {healthyCount} Healthy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://cal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-lg"
          >
            Book a Free Strategy Call
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </a>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={downloadPdf}
              disabled={pdfState === "loading"}
              className="inline-flex items-center gap-2 rounded-full border-2 border-indigo-600 px-8 py-4 text-base font-semibold text-indigo-600 transition-all hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pdfState === "loading" ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating report...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                  </svg>
                  Download Report
                </>
              )}
            </button>
            {pdfState === "error" && (
              <p className="text-xs text-red-500">PDF generation failed — please try again.</p>
            )}
          </div>
        </div>

        {/* Priority fixes */}
        <div>
          <h2 className="mb-5 text-xl font-bold text-slate-900">Top 3 Priority Fixes</h2>
          <div className="space-y-4">
            {result.topThreePriorities.map((priority, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                        {priority.areaName}
                      </span>
                      <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                        {priority.effort} effort
                      </span>
                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                        {priority.impact} impact
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">{priority.headline}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{priority.firstStep}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Area breakdown */}
        <div>
          <h2 className="mb-5 text-xl font-bold text-slate-900">All 12 Workflow Areas</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.areas.map((area) => {
              const status = gradeToStatus(area.grade);
              const cfg = STATUS_CONFIG[status];
              return (
                <div
                  key={area.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight">{area.name}</h3>
                    <span
                      className={`shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                  {/* Score bar */}
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${area.score}%`,
                          backgroundColor: scoreRingColor(area.score),
                        }}
                      />
                    </div>
                    <span className={`w-7 text-right text-xs font-bold ${scoreColor(area.score)}`}>
                      {area.score}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">{area.scoreReasoning}</p>

                  {/* Stack action */}
                  {area.stackAction && (() => {
                    const sa = STACK_ACTION_CONFIG[area.stackAction];
                    return (
                      <div className={`mt-3 rounded-xl border p-3 ${sa.bg} ${sa.border}`}>
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sa.bg} ${sa.border} ${sa.color}`}>
                            {sa.label}
                          </span>
                          {area.replacementTool && (
                            <span className="text-[10px] font-medium text-slate-500">
                              Recommended: {area.replacementTool}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs leading-relaxed ${sa.color}`}>{area.stackReasoning}</p>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stack summary */}
        {(() => {
          const ss = result.stackSummary;
          const replaceAreas = result.areas.filter((a) => a.stackAction === "REPLACE" || a.stackAction === "DEPLOY");
          const configureAreas = result.areas.filter((a) => a.stackAction === "CONFIGURE" || a.stackAction === "CONNECT");
          return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="mb-1 text-xl font-bold text-slate-900">Your Technology Stack</h2>
              <p className="mb-6 text-sm text-slate-500">
                Based on the tools you described and how each area is performing.
              </p>

              {/* Action count pills */}
              <div className="mb-6 flex flex-wrap gap-2">
                {ss.configureCount > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    Configure {ss.configureCount}
                  </span>
                )}
                {ss.connectCount > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    Connect {ss.connectCount}
                  </span>
                )}
                {ss.replaceCount > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
                    Replace {ss.replaceCount}
                  </span>
                )}
                {ss.deployCount > 0 && (
                  <span className="flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                    Deploy {ss.deployCount}
                  </span>
                )}
                <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                  ~{ss.estimatedImplementationHours}h to implement
                </span>
              </div>

              {/* Two column grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Left — platforms to optimise (Configure / Connect) */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Platforms You Have
                  </p>
                  {configureAreas.length === 0 ? (
                    <p className="text-xs text-slate-400">No existing platforms flagged for optimisation.</p>
                  ) : (
                    <div className="space-y-2">
                      {configureAreas.map((area) => {
                        const sa = STACK_ACTION_CONFIG[area.stackAction!];
                        return (
                          <div
                            key={area.id}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                          >
                            <span className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sa.bg} ${sa.border} ${sa.color}`}>
                              {sa.label}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800">{area.name}</p>
                              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{area.stackReasoning}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right — platforms we recommend (Replace / Deploy) */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Platforms We Recommend
                  </p>
                  {replaceAreas.length === 0 ? (
                    <p className="text-xs text-slate-400">No replacement tools flagged — focus on optimising what you have.</p>
                  ) : (
                    <div className="space-y-2">
                      {replaceAreas.map((area) => {
                        const sa = STACK_ACTION_CONFIG[area.stackAction!];
                        return (
                          <div
                            key={area.id}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                          >
                            <span className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sa.bg} ${sa.border} ${sa.color}`}>
                              {sa.label}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800">{area.name}</p>
                              {area.replacementTool && (
                                <p className="mt-0.5 text-[11px] font-medium text-indigo-600">
                                  Recommended: {area.replacementTool}
                                </p>
                              )}
                              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{area.stackReasoning}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {ss.topStackIssue && (
                <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-700">Top issue: </span>{ss.topStackIssue}
                </p>
              )}
            </div>
          );
        })()}

        {/* Team follow-up banner */}
        <div className="rounded-2xl bg-slate-900 px-8 py-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-indigo-400">
              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mb-4 text-xl font-bold text-white">
            Our team has been notified and will be in touch shortly
          </h2>
          <ul className="mx-auto max-w-md space-y-2 text-left">
            {(result.closingPoints ?? []).map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between text-sm text-slate-400">
          <span>WorkflowAudit</span>
          <Link href="/" className="transition-colors hover:text-slate-600">
            Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
