"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  QUESTIONS,
  AREAS,
  Question,
  SKIP_RULES,
  SKIPPED_VALUE,
} from "@/lib/survey-config";
import type { SurveyAnswers } from "@/types/survey";

// ─── Constants ────────────────────────────────────────────────────────────────

const NONE_OPTION = "None";
const NONE_VALUE = "NONE: No software in place";

const SCALE_LABELS: Record<number, string> = {
  1: "No system in place",
  2: "Struggles regularly",
  3: "Works but needs improvement",
  4: "Pretty solid with minor gaps",
  5: "Strong system in place",
};

// ─── Skip logic ───────────────────────────────────────────────────────────────

function getSkippedQuestionIds(
  questionId: string,
  answer: string | string[],
  currentIndex: number
): string[] {
  const rule = SKIP_RULES[questionId];
  if (!rule) return [];

  let triggered = false;
  if (Array.isArray(answer)) {
    if (rule.mode === "only") {
      triggered =
        answer.length > 0 && answer.every((v) => rule.triggers.includes(v));
    } else if (rule.mode === "unless") {
      // Skip when the answer does NOT match any trigger
      triggered = !answer.some((v) => rule.triggers.includes(v));
    } else {
      triggered = answer.some((v) => rule.triggers.includes(v));
    }
  } else {
    if (rule.mode === "unless") {
      triggered = !rule.triggers.includes(answer);
    } else {
      triggered = rule.triggers.includes(answer);
    }
  }

  if (!triggered) return [];

  // Targeted skip — return only the specified question IDs
  if (rule.targetIds) return rule.targetIds;

  const currentQuestion = QUESTIONS[currentIndex];
  if (!currentQuestion.areaId) return [];

  return QUESTIONS.slice(currentIndex + 1)
    .filter((q) => q.areaId === currentQuestion.areaId)
    .map((q) => q.id);
}

function getNextAreaIndex(currentAreaId: string, currentIndex: number): number {
  for (let i = currentIndex + 1; i < QUESTIONS.length; i++) {
    if (QUESTIONS[i].areaId !== currentAreaId) return i;
  }
  return QUESTIONS.length;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AreaBadge({ areaId }: { areaId: string | null }) {
  if (!areaId) return null;
  const area = AREAS.find((a) => a.id === areaId);
  if (!area) return null;
  return (
    <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-500">
      {area.name}
    </span>
  );
}

function TextInput({
  question,
  value,
  onChange,
  onSubmit,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-8">
      <input
        autoFocus
        type={question.id === "intro_email" ? "email" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onSubmit()}
        placeholder={question.placeholder}
        className="w-full border-b-2 border-slate-200 bg-transparent pb-3 text-xl text-slate-900 placeholder-slate-300 outline-none transition-colors focus:border-indigo-500"
      />
      <p className="mt-3 text-sm text-slate-400">Press Enter or click Continue</p>
    </div>
  );
}

const TWO_COL_SINGLE = new Set(["fin_monthly_revenue"]);

function SingleSelect({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  const twoCol = TWO_COL_SINGLE.has(question.id);
  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-slate-400">Select one</p>
      <div className={twoCol ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
        {question.options?.map((opt, i) => {
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all ${
                value === opt
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-current text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FinAvgSaleSelect({
  question,
  value,
  customInputValue,
  onSelect,
  onCustomInput,
}: {
  question: Question;
  value: string;
  customInputValue: string;
  onSelect: (opt: string) => void;
  onCustomInput: (numericStr: string) => void;
}) {
  const customInputRef = useRef<HTMLInputElement>(null);
  const isCustom = value === "custom";

  useEffect(() => {
    if (isCustom) {
      setTimeout(() => customInputRef.current?.focus(), 50);
    }
  }, [isCustom]);

  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-slate-400">Select one</p>
      <div className="grid grid-cols-2 gap-3">
        {question.options?.map((opt, i) => {
          const isCustomOpt = opt === "Enter exact amount";
          const selected = isCustomOpt ? isCustom : value === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all ${
                selected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-current text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isCustom ? "mt-4 max-h-32 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-xl border-2 border-indigo-300 bg-indigo-50 px-4 py-3">
          <label className="mb-2 block text-sm font-medium text-indigo-700">
            Enter your average job value in dollars:
          </label>
          <input
            ref={customInputRef}
            type="number"
            min="0"
            value={customInputValue}
            onChange={(e) => onCustomInput(e.target.value)}
            placeholder="e.g. 8500"
            className="w-full bg-transparent text-base font-medium text-indigo-900 placeholder-indigo-300 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function MultiSelect({
  question,
  value,
  otherText,
  onChange,
  onOtherChange,
}: {
  question: Question;
  value: string[];
  otherText: string;
  onChange: (v: string[]) => void;
  onOtherChange: (v: string) => void;
}) {
  const otherInputRef = useRef<HTMLInputElement>(null);
  const otherSelected = value.includes("Other");

  const toggle = (opt: string) => {
    if (opt === NONE_OPTION) {
      // None is mutually exclusive — deselect everything else
      onChange(value.includes(NONE_OPTION) ? [] : [NONE_OPTION]);
      return;
    }
    // Selecting any real option deselects None
    const withoutNone = value.filter((v) => v !== NONE_OPTION);
    onChange(
      withoutNone.includes(opt)
        ? withoutNone.filter((v) => v !== opt)
        : [...withoutNone, opt]
    );
  };

  useEffect(() => {
    if (otherSelected) {
      setTimeout(() => otherInputRef.current?.focus(), 50);
    }
  }, [otherSelected]);

  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-slate-400">Select all that apply</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options?.map((opt) => {
          const selected = value.includes(opt);
          const isNone = opt === NONE_OPTION;
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                selected
                  ? isNone
                    ? "border-amber-400 bg-amber-50 text-amber-800"
                    : "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  selected
                    ? isNone
                      ? "border-amber-400 bg-amber-400"
                      : "border-indigo-500 bg-indigo-500"
                    : "border-slate-300"
                }`}
              >
                {selected && (
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3 text-white">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* "Other" free-text — slides in when Other is selected */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          otherSelected ? "mt-4 max-h-24 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-xl border-2 border-indigo-300 bg-indigo-50 px-4 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0 text-indigo-400"
          >
            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
          </svg>
          <input
            ref={otherInputRef}
            type="text"
            value={otherText}
            onChange={(e) => onOtherChange(e.target.value)}
            placeholder="Which software do you use?"
            className="flex-1 bg-transparent text-sm font-medium text-indigo-900 placeholder-indigo-300 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function ScaleInput({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  const idk = "I honestly don't know";
  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-slate-400">Select one</p>
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === String(n);
          return (
            <button
              key={n}
              onClick={() => onChange(String(n))}
              className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all ${
                selected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-current text-sm font-bold">
                {n}
              </span>
              {SCALE_LABELS[n]}
            </button>
          );
        })}
        {question.allowDontKnow && (
          <button
            onClick={() => onChange(idk)}
            className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all ${
              value === idk
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-current text-xs font-bold">
              ?
            </span>
            I honestly don&apos;t know
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Glossary tooltips ────────────────────────────────────────────────────────

function GlossaryTooltips({ glossary }: { glossary: Record<string, string> }) {
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const entries = Object.entries(glossary);
  if (entries.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {entries.map(([term, definition]) => (
        <div key={term} className="relative">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            onMouseEnter={() => setOpenTerm(term)}
            onMouseLeave={() => setOpenTerm(null)}
            onClick={() => setOpenTerm(openTerm === term ? null : term)}
          >
            {term}
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold leading-none text-slate-500">
              ?
            </span>
          </button>
          {openTerm === term && (
            <div className="absolute bottom-full left-0 z-10 mb-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
              <p className="mb-1 text-xs font-semibold text-slate-800">{term}</p>
              <p className="text-xs leading-relaxed text-slate-600">{definition}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Skip toast ───────────────────────────────────────────────────────────────

function SkipToast({
  areaName,
  visible,
}: {
  areaName: string;
  visible: boolean;
}) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 rounded-full bg-slate-900 px-5 py-3 shadow-xl">
        <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
        <span className="text-sm font-medium text-white">
          <span className="text-amber-300">{areaName}</span> flagged as a critical gap — moving on
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [skipToast, setSkipToast] = useState<{ areaName: string; visible: boolean } | null>(null);
  const [finAvgSaleCustom, setFinAvgSaleCustom] = useState("");
  const [emailError, setEmailError] = useState("");
  const skipToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  const question = QUESTIONS[index];
  const total = QUESTIONS.length;
  const progress = Math.round((index / total) * 100);

  const currentValue = answers[question.id];
  const textValue = typeof currentValue === "string" ? currentValue : "";
  const multiValue = Array.isArray(currentValue) ? currentValue : [];
  const otherText = otherTexts[question.id] ?? "";

  const canAdvance = useCallback(() => {
    if (question.id === "fin_avg_sale" && currentValue === "custom") {
      const num = Number(finAvgSaleCustom);
      return finAvgSaleCustom.trim().length > 0 && !isNaN(num) && num > 0;
    }
    if (question.type === "text") return textValue.trim().length > 0;
    if (question.type === "single")
      return typeof currentValue === "string" && currentValue.length > 0;
    if (question.type === "multi") {
      if (multiValue.length === 0) return false;
      // If Other is selected (but not None), require the free-text field
      if (
        multiValue.includes("Other") &&
        !multiValue.includes(NONE_OPTION) &&
        otherText.trim().length === 0
      )
        return false;
      return true;
    }
    if (question.type === "scale")
      return typeof currentValue === "string" && currentValue.length > 0;
    return false;
  }, [question, textValue, currentValue, multiValue, otherText, finAvgSaleCustom]);

  const showSkipToast = useCallback((areaId: string) => {
    const area = AREAS.find((a) => a.id === areaId);
    if (!area) return;
    if (skipToastTimer.current) clearTimeout(skipToastTimer.current);
    setSkipToast({ areaName: area.name, visible: true });
    skipToastTimer.current = setTimeout(() => {
      setSkipToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, 3000);
  }, []);

  const transition = useCallback(
    (newIndex: number, dir: "forward" | "back") => {
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setIndex(newIndex);
        setAnimating(false);
        window.scrollTo(0, 0);
      }, 220);
    },
    []
  );

  /** Build final answers: merge "Other" free-text, convert lone None to NONE_VALUE. */
  const buildFinalAnswers = useCallback(
    (base: SurveyAnswers): SurveyAnswers => {
      const final: SurveyAnswers = { ...base };

      Object.entries(final).forEach(([qId, val]) => {
        if (Array.isArray(val)) {
          // Convert lone None selection to canonical string
          if (val.length === 1 && val[0] === NONE_OPTION) {
            final[qId] = NONE_VALUE;
            return;
          }
          // Merge "Other" free-text
          const text = otherTexts[qId];
          if (text?.trim() && val.includes("Other")) {
            final[qId] = val.map((v) =>
              v === "Other" ? `Other: ${text.trim()}` : v
            );
          }
        }
      });

      return final;
    },
    [otherTexts]
  );

  const advance = useCallback(() => {
    if (!canAdvance()) return;

    if (question.id === "intro_email") {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue.trim());
      if (!valid) {
        setEmailError("Please enter a valid email address — we'll send your report here.");
        return;
      }
      setEmailError("");
    }

    const answer = answers[question.id];
    const skippedIds = getSkippedQuestionIds(question.id, answer, index);

    if (skippedIds.length > 0) {
      const skippedAnswers: SurveyAnswers = {};
      skippedIds.forEach((id) => {
        skippedAnswers[id] = SKIPPED_VALUE;
      });

      const updatedAnswers = { ...answers, ...skippedAnswers };
      setAnswers(updatedAnswers);

      const rule = SKIP_RULES[question.id];

      if (rule?.targetIds) {
        // Targeted conditional skip — mark targets as SKIPPED_VALUE then step
        // forward one question.  The normal-advance auto-skip below handles
        // jumping over any SKIPPED_VALUE question when we eventually reach it,
        // so intermediate questions between here and the target still appear.
        const nextIndex = index + 1;
        if (nextIndex >= total) {
          sessionStorage.setItem(
            "auditAnswers",
            JSON.stringify(buildFinalAnswers(updatedAnswers))
          );
          router.push("/processing");
          return;
        }
        transition(nextIndex, "forward");
        return;
      }

      // Area-level skip — show toast and jump to next area
      if (question.areaId) {
        showSkipToast(question.areaId);
        const nextIndex = getNextAreaIndex(question.areaId, index);
        if (nextIndex >= total) {
          sessionStorage.setItem(
            "auditAnswers",
            JSON.stringify(buildFinalAnswers(updatedAnswers))
          );
          router.push("/processing");
          return;
        }
        transition(nextIndex, "forward");
        return;
      }
    }

    if (index === total - 1) {
      sessionStorage.setItem(
        "auditAnswers",
        JSON.stringify(buildFinalAnswers(answers))
      );
      router.push("/processing");
      return;
    }

    // Auto-skip any questions pre-marked SKIPPED_VALUE by a targetIds rule
    let nextIdx = index + 1;
    while (nextIdx < total && answers[QUESTIONS[nextIdx].id] === SKIPPED_VALUE) {
      nextIdx++;
    }
    if (nextIdx >= total) {
      sessionStorage.setItem(
        "auditAnswers",
        JSON.stringify(buildFinalAnswers(answers))
      );
      router.push("/processing");
      return;
    }
    transition(nextIdx, "forward");
  }, [
    index,
    total,
    answers,
    question,
    textValue,
    canAdvance,
    transition,
    router,
    showSkipToast,
    buildFinalAnswers,
  ]);

  const back = () => {
    if (index === 0) return;
    // Skip back over any questions pre-marked SKIPPED_VALUE
    let prevIdx = index - 1;
    while (prevIdx > 0 && answers[QUESTIONS[prevIdx].id] === SKIPPED_VALUE) {
      prevIdx--;
    }
    transition(prevIdx, "back");
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && question.type !== "text") {
        advance();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advance, question.type]);

  useEffect(() => {
    return () => {
      if (skipToastTimer.current) clearTimeout(skipToastTimer.current);
    };
  }, []);

  const setAnswer = (val: string | string[]) => {
    if (question.id === "intro_email") setEmailError("");
    setAnswers((prev) => {
      const next: SurveyAnswers = { ...prev, [question.id]: val };
      // For financial baseline questions, also store the numeric midpoint
      // under a sibling key so the AI can use it directly in calculations.
      if (question.midpoints && typeof val === "string") {
        const midpoint = question.midpoints[val];
        if (midpoint !== undefined) {
          next[`${question.id}_value`] = String(midpoint);
          next[`${question.id}_label`] = val;
        }
      }
      return next;
    });
    setTimeout(() => {
      continueRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);
  };

  const setOtherText = (val: string) => {
    setOtherTexts((prev) => ({ ...prev, [question.id]: val }));
  };

  const handleFinAvgSaleSelect = useCallback((opt: string) => {
    setAnswers((prev) => {
      const q = QUESTIONS.find((q) => q.id === "fin_avg_sale")!;
      if (opt === "Enter exact amount") {
        return { ...prev, fin_avg_sale: "custom", fin_avg_sale_value: "", fin_avg_sale_label: "custom" };
      }
      const next: SurveyAnswers = { ...prev, fin_avg_sale: opt };
      if (q.midpoints) {
        const midpoint = q.midpoints[opt];
        if (midpoint !== undefined) {
          next["fin_avg_sale_value"] = String(midpoint);
          next["fin_avg_sale_label"] = opt;
        }
      }
      return next;
    });
    if (opt === "Enter exact amount") setFinAvgSaleCustom("");
    setTimeout(() => {
      continueRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);
  }, []);

  const handleFinAvgSaleCustomInput = useCallback((numericStr: string) => {
    setFinAvgSaleCustom(numericStr);
    setAnswers((prev) => ({ ...prev, fin_avg_sale_value: numericStr }));
  }, []);

  const slideClass = animating
    ? direction === "forward"
      ? "opacity-0 translate-y-4"
      : "opacity-0 -translate-y-4"
    : "opacity-100 translate-y-0";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <span className="text-base font-semibold tracking-tight text-slate-900">
          RevRep.ai Workflow Audit
        </span>
        <span className="text-sm text-slate-400">
          {index + 1} / {total}
        </span>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full bg-slate-100">
        <div
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question area */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <div className={`transition-all duration-200 ease-out ${slideClass}`}>
            {/* Area badge */}
            <div className="mb-4 h-7">
              <AreaBadge areaId={question.areaId} />
            </div>

            {/* Question text */}
            <h2 className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
              {question.question}
            </h2>

            {/* Glossary tooltips */}
            {question.glossary && <GlossaryTooltips glossary={question.glossary} />}

            {/* Input */}
            {question.type === "text" && (
              <>
                <TextInput
                  question={question}
                  value={textValue}
                  onChange={setAnswer}
                  onSubmit={advance}
                />
                {question.id === "intro_email" && emailError && (
                  <p className="mt-2 text-sm text-red-500">{emailError}</p>
                )}
              </>
            )}
            {question.type === "single" && question.id !== "fin_avg_sale" && (
              <SingleSelect
                question={question}
                value={textValue}
                onChange={setAnswer}
              />
            )}
            {question.id === "fin_avg_sale" && (
              <FinAvgSaleSelect
                question={question}
                value={textValue}
                customInputValue={finAvgSaleCustom}
                onSelect={handleFinAvgSaleSelect}
                onCustomInput={handleFinAvgSaleCustomInput}
              />
            )}
            {question.type === "multi" && (
              <MultiSelect
                question={question}
                value={multiValue}
                otherText={otherText}
                onChange={setAnswer}
                onOtherChange={setOtherText}
              />
            )}
            {question.type === "scale" && (
              <ScaleInput
                question={question}
                value={textValue}
                onChange={setAnswer}
              />
            )}
          </div>

          {/* Navigation — shown for all question types */}
          <div className="mt-10 flex items-center gap-4">
            {index > 0 && (
              <button
                onClick={back}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>
            )}
            <button
              ref={continueRef}
              onClick={advance}
              disabled={!canAdvance()}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {index === total - 1 ? "Submit" : "Continue"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Skip toast */}
      {skipToast && (
        <SkipToast areaName={skipToast.areaName} visible={skipToast.visible} />
      )}
    </div>
  );
}
