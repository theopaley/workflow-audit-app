"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnalysisResult } from "@/lib/ai-analysis";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Status = "Critical" | "Needs Improvement" | "Healthy";

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
            WorkflowAudit
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
        <div className="flex justify-center">
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
                </div>
              );
            })}
          </div>
        </div>

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
            {result.closingPoints.map((point, i) => (
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
