"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const MESSAGES = [
  "Analyzing your workflow data...",
  "Scoring your 12 workflow areas...",
  "Calculating revenue leakage...",
  "Identifying your top priorities...",
  "Generating your PDF report...",
  "Sending your report...",
  "Your audit is ready!",
];

const MESSAGE_DURATION = 2600; // ms per message

export default function ProcessingPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [animationDone, setAnimationDone] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);
  const [apiDone, setApiDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    setMessageIndex(0);
    setVisible(true);
    setAnimationDone(false);
    setPdfDone(false);
    setApiDone(false);
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

    let answers: unknown;
    try {
      answers = JSON.parse(raw);
    } catch {
      setError("Your survey answers appear to be corrupted. Please complete the survey again.");
      return;
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
      .then(async (result) => {
        sessionStorage.setItem("auditResult", JSON.stringify(result));

        // Step 2: generate PDF
        const pdfRes = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auditResult: result, auditAnswers: answers }),
        });
        if (!pdfRes.ok) {
          const body = await pdfRes.json().catch(() => ({}));
          throw new Error(body?.error ?? `PDF generation failed (${pdfRes.status})`);
        }

        const pdfArrayBuffer = await pdfRes.arrayBuffer();
        const uint8 = new Uint8Array(pdfArrayBuffer);
        const chunks: string[] = [];
        const chunkSize = 32768;
        for (let i = 0; i < uint8.length; i += chunkSize) {
          chunks.push(String.fromCharCode(...Array.from(uint8.subarray(i, i + chunkSize))));
        }
        const pdfBase64 = btoa(chunks.join(""));

        // PDF is ready — advance message to "Sending your report..."
        setPdfDone(true);

        // Step 3: send emails
        const sendRes = await fetch("/api/send-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, result, pdf: pdfBase64 }),
        });
        if (!sendRes.ok) {
          const body = await sendRes.json().catch(() => ({}));
          throw new Error(body?.error ?? `Email delivery failed (${sendRes.status})`);
        }

        // Step 4: all done
        setApiDone(true);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
        console.error("[processing] failed:", message);
        setError(message);
      });
  }, [retryCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigate when both animation and API have finished ───────────────────────
  useEffect(() => {
    if (animationDone && apiDone) {
      router.push("/results");
    }
  }, [animationDone, apiDone, router]);

  // ── Animation ─────────────────────────────────────────────────────────────
  // Messages 0–3 cycle on the timer.
  // Message 4 ("Generating your PDF report...") holds until pdfDone.
  // Message 5 ("Sending your report...") holds until apiDone.
  // Message 6 ("Your audit is ready!") shows then navigates.
  const HOLD_PDF_INDEX  = MESSAGES.length - 3; // index 4
  const HOLD_SEND_INDEX = MESSAGES.length - 2; // index 5
  const READY_INDEX     = MESSAGES.length - 1; // index 6

  useEffect(() => {
    if (error) return;

    // "Your audit is ready!" — wait briefly then navigate
    if (messageIndex >= READY_INDEX) {
      const timer = setTimeout(() => setAnimationDone(true), MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }

    // "Sending your report..." — hold until email send completes
    if (messageIndex >= HOLD_SEND_INDEX) {
      if (!apiDone) return;
      const fadeOut = setTimeout(() => setVisible(false), 300);
      const swap = setTimeout(() => {
        setMessageIndex(READY_INDEX);
        setVisible(true);
      }, 700);
      return () => { clearTimeout(fadeOut); clearTimeout(swap); };
    }

    // "Generating your PDF report..." — hold until PDF generation completes
    if (messageIndex >= HOLD_PDF_INDEX) {
      if (!pdfDone) return;
      const fadeOut = setTimeout(() => setVisible(false), 300);
      const swap = setTimeout(() => {
        setMessageIndex(HOLD_SEND_INDEX);
        setVisible(true);
      }, 700);
      return () => { clearTimeout(fadeOut); clearTimeout(swap); };
    }

    // Normal cycle for messages 0–3
    const fadeOut = setTimeout(() => setVisible(false), MESSAGE_DURATION - 400);
    const swap = setTimeout(() => {
      setMessageIndex((i) => i + 1);
      setVisible(true);
    }, MESSAGE_DURATION);
    return () => { clearTimeout(fadeOut); clearTimeout(swap); };
  }, [messageIndex, error, pdfDone, apiDone]);

  const progress = Math.round(((messageIndex + 1) / MESSAGES.length) * 100);

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

  // ── Normal processing state (animation unchanged) ─────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      {/* Wordmark */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center border-b border-slate-100 px-6 py-4">
        <span className="text-base font-semibold tracking-tight text-slate-900">
          RevRep.ai Workflow Audit
        </span>
      </div>

      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* Spinner */}
        <div className="relative mb-12 flex h-24 w-24 items-center justify-center">
          {/* Outer ring */}
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 96 96"
          >
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="6"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="#6366f1"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Pulsing inner dot */}
          <span className="relative flex h-10 w-10 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-200 opacity-60" />
            <span className="relative inline-flex h-5 w-5 rounded-full bg-indigo-500" />
          </span>
        </div>

        {/* Status message */}
        <div className="h-12 flex items-center justify-center">
          <p
            className={`text-2xl font-semibold text-slate-800 transition-all duration-300 ease-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {MESSAGES[messageIndex]}
          </p>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          This usually takes 1–3 minutes
        </p>

        {/* Progress dots */}
        <div className="mt-10 flex gap-2">
          {MESSAGES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < messageIndex
                  ? "w-4 bg-indigo-400"
                  : i === messageIndex
                  ? "w-6 bg-indigo-600"
                  : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
