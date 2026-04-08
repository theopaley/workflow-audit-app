"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { verticalRegistry } from "@/lib/verticals";

const FALLBACK_AREAS = [
  "Lead Capture & Response Time",
  "Lead Follow-Up & CRM",
  "Scheduling & Booking",
  "Proposals & Quoting",
  "Customer Onboarding",
  "Job & Project Management",
  "Invoicing & Payments",
  "Customer Communication",
  "Reviews & Reputation",
  "Re-engagement & Retention",
  "Referral Management",
  "Business Visibility & Reporting",
];

const AREA_INTERVAL = 7000; // ms between area completions

export default function ProcessingPage() {
  const router = useRouter();
  const [completedCount, setCompletedCount] = useState(0);
  const [apiDone, setApiDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [areaNames, setAreaNames] = useState<string[]>(FALLBACK_AREAS);
  const apiDoneRef = useRef(false);
  const redirectScheduled = useRef(false);

  const handleRetry = useCallback(() => {
    setCompletedCount(0);
    setApiDone(false);
    apiDoneRef.current = false;
    redirectScheduled.current = false;
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  // ── Fire the API call on mount and on each retry ──────────────────────────
  useEffect(() => {
    let raw: string | null = null;

    try {
      raw = sessionStorage.getItem("auditAnswers");
    } catch {
      setError("Unable to read your survey answers. Please complete the survey and try again.");
      return;
    }

    if (!raw) {
      setError("No survey answers found. Please complete the survey first.");
      return;
    }

    let answers: Record<string, unknown>;
    try {
      answers = JSON.parse(raw);
    } catch {
      setError("Your survey answers appear to be corrupted. Please complete the survey again.");
      return;
    }

    // Resolve area names from the vertical config
    const vid = typeof answers.verticalId === "string" ? answers.verticalId : undefined;
    const vConfig = vid ? verticalRegistry[vid] : undefined;
    if (vConfig) {
      setAreaNames(vConfig.workflowAreas.map((a) => a.name));
    }

    // Step 1: AI analysis
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().catch(() => ({})).then((body) => {
            throw new Error(body?.detail ?? body?.error ?? `Analysis failed (${res.status})`);
          });
        }
        return res.json().catch(() => {
          throw new Error("The analysis service returned an unexpected response. Please try again.");
        });
      })
      .then((result) => {
        sessionStorage.setItem("auditResult", JSON.stringify(result));

        apiDoneRef.current = true;
        setApiDone(true);

        // Background: generate PDF then send email (silent failures acceptable)
        ;(async () => {
          try {
            const pdfRes = await fetch("/api/generate-report", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ auditResult: result, auditAnswers: answers }),
            });
            if (!pdfRes.ok) return;

            const pdfArrayBuffer = await pdfRes.arrayBuffer();
            const uint8 = new Uint8Array(pdfArrayBuffer);
            const chunks: string[] = [];
            const chunkSize = 32768;
            for (let i = 0; i < uint8.length; i += chunkSize) {
              chunks.push(String.fromCharCode(...Array.from(uint8.subarray(i, i + chunkSize))));
            }
            const pdfBase64 = btoa(chunks.join(""));

            await fetch("/api/send-report", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answers, result, pdf: pdfBase64 }),
            });
          } catch {
            // silent — user is already on the results page
          }
        })();
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
        console.error("[processing] failed:", message);
        setError(message);
      });
  }, [retryCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Area-by-area animation timer ──────────────────────────────────────────
  useEffect(() => {
    if (error) return;
    // Stop advancing once all 12 areas are done + the "building report" step
    if (completedCount > areaNames.length) return;

    const timer = setInterval(() => {
      setCompletedCount((c) => {
        const next = c + 1;
        // Once we finish the last area, advance one more to show "Building report"
        if (next > areaNames.length + 1) {
          clearInterval(timer);
          return c;
        }
        return next;
      });
    }, AREA_INTERVAL);

    return () => clearInterval(timer);
  }, [error, areaNames.length, completedCount]);

  // ── Redirect when API is done and current area animation finishes ─────────
  useEffect(() => {
    if (!apiDone || redirectScheduled.current) return;
    // Wait for current area to finish before redirecting
    if (completedCount >= 1) {
      redirectScheduled.current = true;
      // Small delay so the user sees the last completed checkmark
      const timer = setTimeout(() => router.push("/results"), 800);
      return () => clearTimeout(timer);
    }
  }, [apiDone, completedCount, router]);

  // ── Error state ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <span className="text-base font-semibold tracking-tight text-slate-900">
            RevRep.ai Workflow Audit
          </span>
        </div>
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-red-500">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            Something went wrong
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-slate-500">{error}</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
              </svg>
              Try Again
            </button>
            <button
              onClick={() => router.push("/audit")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-800"
            >
              Back to survey
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal processing state — area-by-area checklist ──────────────────────
  const analyzedCount = Math.min(completedCount, areaNames.length);
  const showBuildingReport = completedCount > areaNames.length;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <span className="text-base font-semibold tracking-tight text-slate-900">
          RevRep.ai Workflow Audit
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Top section */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
              Analyzing your business...
            </h1>
            <p className="text-base text-slate-500">
              We're reviewing each workflow area and calculating your revenue leakage.
            </p>
          </div>

          {/* Area checklist */}
          <div className="mb-8">
            {areaNames.map((name, i) => {
              const isCompleted = i < completedCount;
              const isCurrent = i === completedCount && !showBuildingReport;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 border-b border-slate-100 py-3 transition-all duration-500 ${
                    isCompleted
                      ? "text-slate-900"
                      : isCurrent
                      ? "text-indigo-600"
                      : "text-slate-400"
                  }`}
                >
                  {/* Status icon */}
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {isCompleted ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 text-indigo-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : isCurrent ? (
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                      </span>
                    ) : (
                      <span className="h-3 w-3 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                  {/* Area name */}
                  <span className={`text-sm ${isCompleted || isCurrent ? "font-medium" : ""}`}>
                    {name}
                  </span>
                </div>
              );
            })}

            {/* Building report row */}
            <div
              className={`flex items-center gap-3 py-3 transition-all duration-500 ${
                showBuildingReport ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {showBuildingReport ? (
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                  </span>
                ) : (
                  <span className="h-3 w-3 rounded-full border-2 border-slate-300" />
                )}
              </div>
              <span className={`text-sm ${showBuildingReport ? "font-medium" : ""}`}>
                Building your personalized report...
              </span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="text-center">
            <p className="text-sm text-slate-500">
              {analyzedCount < areaNames.length
                ? `Area ${analyzedCount + 1} of ${areaNames.length} analyzing`
                : showBuildingReport
                ? "Finalizing your report..."
                : `${areaNames.length} of ${areaNames.length} areas analyzed`}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              This usually takes 1–2 minutes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
