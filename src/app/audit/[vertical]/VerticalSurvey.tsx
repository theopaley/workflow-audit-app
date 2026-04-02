"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QUESTIONS, SKIPPED_VALUE } from "@/lib/survey-config";
import type { Question } from "@/lib/survey-config";
import type { VerticalConfig } from "@/lib/verticals/types";
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

// Questions pulled verbatim from the base survey
const BASE_INTRO_IDS = [
  "intro_name",
  "intro_company_name",
  "intro_business",
  "intro_size",
  "intro_email",
];

const FIN_IDS = [
  "fin_avg_sale",
  "fin_monthly_leads",
  "fin_close_rate",
  "fin_monthly_revenue",
  "financial_platform",
];

// ─── Dynamic option resolution ────────────────────────────────────────────────

const RECURRING_SERVICE_TYPES = new Set([
  "Cleaning or Janitorial Services",
  "Pool, Pressure Washing, or Specialty Exterior",
  "Landscaping, Lawn Care, or Tree Service",
]);

/**
 * Returns the question with any dynamic fields resolved against current answers:
 *   1. dynamicOptions / dynamicMidpoints — tier-based option substitution
 *      driven by a named source question answer (e.g. fin_avg_sale tiers).
 *   2. recurringVariant — vocabulary swap applied when the owner selected a
 *      recurring service type (Cleaning, Pool, Landscaping).
 * Falls back to the base question unchanged when no conditions are met.
 */
function resolveQuestion(q: Question, answers: SurveyAnswers): Question {
  let resolved = q;

  // 1. Dynamic options (tier-based)
  if (q.dynamicOptionsSource && q.dynamicOptions) {
    const sourceAnswer = answers[q.dynamicOptionsSource];
    // Multi-select sources store an array — use the first selected value.
    const sourceKey = Array.isArray(sourceAnswer) ? sourceAnswer[0] : sourceAnswer;
    if (typeof sourceKey === "string") {
      const options = q.dynamicOptions[sourceKey];
      if (options) {
        const midpoints = q.dynamicMidpoints?.[sourceKey];
        resolved = { ...resolved, options, ...(midpoints !== undefined ? { midpoints } : {}) };
      }
    }
  }

  // 2. Recurring vocabulary swap
  if (q.recurringVariant) {
    const serviceType = answers.hs_service_type;
    if (typeof serviceType === "string" && RECURRING_SERVICE_TYPES.has(serviceType)) {
      resolved = { ...resolved, ...q.recurringVariant };
    }
  }

  return resolved;
}

// ─── Question assembly ────────────────────────────────────────────────────────

function buildQuestions(config: VerticalConfig): Question[] {
  const baseIndex = new Map(QUESTIONS.map((q) => [q.id, q]));
  const baseAndFinIds = new Set([...BASE_INTRO_IDS, ...FIN_IDS]);
  const skipSet = new Set(config.skipQuestions ?? []);

  const applyOverride = (q: Question): Question => {
    const override = config.introQuestions?.[q.id];
    if (!override) return q;
    return { ...q, ...override } as Question;
  };

  const result: Question[] = [];

  // 1. Base intro questions, with vertical additions injected at the intro_business
  //    position (regardless of whether intro_business itself is skipped).
  for (const id of BASE_INTRO_IDS) {
    if (!skipSet.has(id)) {
      const q = baseIndex.get(id);
      if (q) result.push(applyOverride(q));
    }

    if (id === "intro_business") {
      // Inject any new questions whose IDs are not in the base or financial sets
      for (const [newId, partial] of Object.entries(config.introQuestions ?? {})) {
        if (!baseAndFinIds.has(newId) && partial?.id) {
          result.push(partial as Question);
        }
      }
    }
  }

  // 2. Financial baseline questions with label overrides applied
  for (const id of FIN_IDS) {
    const q = baseIndex.get(id);
    if (!q) continue;
    result.push(applyOverride(q));
  }

  // 3. Workflow area questions — software Q generated from softwareOptions + area.questions
  for (const area of config.workflowAreas) {
    result.push({
      id: `${area.id}_software`,
      areaId: area.id,
      type: "multi",
      question: `Which software do you use for ${area.name}?`,
      options: area.softwareOptions,
    });
    for (const q of area.questions) {
      result.push(q);
    }
  }

  return result;
}

// ─── Skip logic ───────────────────────────────────────────────────────────────
//
// Vertical skip rule: if a software question (id ends with _software) has only
// "None" selected, all remaining questions in that area are skipped.

function getSkippedIds(
  questionId: string,
  answer: string | string[],
  questions: Question[],
  currentIndex: number
): string[] {
  if (questionId.endsWith("_software") && Array.isArray(answer)) {
    if (answer.length === 1 && answer[0] === NONE_OPTION) {
      const areaId = questions[currentIndex].areaId;
      if (!areaId) return [];
      return questions
        .slice(currentIndex + 1)
        .filter((q) => q.areaId === areaId)
        .map((q) => q.id);
    }
  }
  return [];
}

function getNextAreaIndex(
  currentAreaId: string,
  currentIndex: number,
  questions: Question[]
): number {
  for (let i = currentIndex + 1; i < questions.length; i++) {
    if (questions[i].areaId !== currentAreaId) return i;
  }
  return questions.length;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AreaBadge({
  areaId,
  areaNames,
}: {
  areaId: string | null;
  areaNames: Map<string, string>;
}) {
  if (!areaId) return null;
  const name = areaNames.get(areaId);
  if (!name) return null;
  return (
    <span className="inline-block rounded-full border border-indigo-300 bg-indigo-100 px-3 py-1 text-sm font-bold uppercase tracking-widest text-indigo-700">
      {name}
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
  otherText,
  onOtherChange,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  otherText?: string;
  onOtherChange?: (v: string) => void;
}) {
  const otherInputRef = useRef<HTMLInputElement>(null);
  const showOtherInput =
    !!question.allowOtherInput && value.startsWith("Other") && !!onOtherChange;

  useEffect(() => {
    if (showOtherInput) {
      setTimeout(() => otherInputRef.current?.focus(), 50);
    }
  }, [showOtherInput]);

  const twoCol = TWO_COL_SINGLE.has(question.id);
  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-slate-400">Select one</p>
      <div className={twoCol ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
        {question.options?.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-all ${
              value === opt
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {question.allowOtherInput && onOtherChange && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            showOtherInput ? "mt-4 max-h-24 opacity-100" : "max-h-0 opacity-0"
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
              value={otherText ?? ""}
              onChange={(e) => onOtherChange(e.target.value)}
              placeholder="Please describe your service type"
              className="flex-1 bg-transparent text-sm font-medium text-indigo-900 placeholder-indigo-300 outline-none"
            />
          </div>
        </div>
      )}
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
        {question.options?.map((opt) => {
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
      onChange(value.includes(NONE_OPTION) ? [] : [NONE_OPTION]);
      return;
    }
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
            I honestly don&apos;t know
          </button>
        )}
      </div>
    </div>
  );
}

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
          <span className="text-amber-300">{areaName}</span> flagged as a critical
          gap — moving on
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  config: VerticalConfig;
}

export default function VerticalSurvey({ config }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const allQuestions = useMemo(() => buildQuestions(config), [config]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  const prefillApplied = useRef(false);
  useEffect(() => {
    if (prefillApplied.current) return;
    const raw = searchParams.get("prefill");
    if (!raw) return;
    try {
      const rawPrefill: SurveyAnswers = JSON.parse(decodeURIComponent(raw));
      prefillApplied.current = true;

      // The universal survey records the business description under 'intro_business'.
      // Some verticals skip that question and replace it with a vertical-specific one
      // (e.g. 'hs_service_type' in home-services). If 'intro_business' is in the
      // prefill but is NOT one of this vertical's questions (meaning it was replaced),
      // carry the value forward under the replacement question's ID so the skip-past
      // logic below treats it as already answered and doesn't re-show the question.
      const mappedPrefill: SurveyAnswers = { ...rawPrefill };
      const allQIdSet = new Set(allQuestions.map((q) => q.id));
      const baseFinIdSet = new Set([...BASE_INTRO_IDS, ...FIN_IDS]);

      if ("intro_business" in rawPrefill && !allQIdSet.has("intro_business")) {
        // The replacement is the first question in allQuestions whose ID is not
        // in the base/financial set — i.e. the first vertical-injected intro question.
        const replacementQ = allQuestions.find((q) => !baseFinIdSet.has(q.id));
        if (replacementQ && !(replacementQ.id in mappedPrefill)) {
          // Prefer the classify API's serviceType (already in prefill as hs_service_type
          // with a valid option value) over the raw intro_business free text. Only fall
          // back to the free text if the prefill somehow lacks the service type entirely.
          mappedPrefill[replacementQ.id] = rawPrefill["intro_business"];
        }
      }

      // Injected non-base questions pre-answered by the classify API (e.g.
      // re_focus_type for real-estate) would otherwise be silently skipped.
      // Only keep a classify-injected answer if that question ID is referenced
      // as a dynamicOptionsSource by another intro override — e.g. hs_service_type
      // drives fin_avg_sale tier selection and must stay. Questions with no
      // downstream dependency are cleared so the user sees and confirms them.
      const dynamicSourceIds = new Set(
        Object.values(config.introQuestions ?? {})
          .map((q) => (q as Partial<Question>).dynamicOptionsSource)
          .filter((id): id is string => typeof id === "string")
      );
      for (const key of Object.keys(mappedPrefill)) {
        if (!baseFinIdSet.has(key) && !dynamicSourceIds.has(key) && allQIdSet.has(key)) {
          delete mappedPrefill[key];
        }
      }

      setAnswers(mappedPrefill);
      // Land on the first question whose ID is not present in the (mapped) prefill.
      const firstUnanswered = allQuestions.findIndex((q) => !(q.id in mappedPrefill));
      if (firstUnanswered > 0) setIndex(firstUnanswered);
    } catch {
      // Ignore malformed prefill — start survey from the beginning
    }
  }, [searchParams, allQuestions]);

  const areaNames = useMemo(() => {
    const serviceType = answers.hs_service_type;
    const recurring =
      typeof serviceType === "string" && RECURRING_SERVICE_TYPES.has(serviceType);
    const map = new Map<string, string>();
    for (const area of config.workflowAreas) {
      map.set(area.id, recurring && area.recurringName ? area.recurringName : area.name);
    }
    return map;
  }, [config.workflowAreas, answers.hs_service_type]);
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [skipToast, setSkipToast] = useState<{
    areaName: string;
    visible: boolean;
  } | null>(null);
  const [finAvgSaleCustom, setFinAvgSaleCustom] = useState("");
  const [emailError, setEmailError] = useState("");
  const skipToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  const question = allQuestions[index];
  // Question with dynamic options resolved against current answers (e.g. fin_avg_sale
  // picks the tier-appropriate ranges based on the hs_service_type answer).
  const resolvedQuestion = resolveQuestion(question, answers);
  const total = allQuestions.length;
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
    if (question.type === "single") {
      if (typeof currentValue !== "string" || currentValue.length === 0) return false;
      if (
        question.allowOtherInput &&
        currentValue.startsWith("Other") &&
        otherText.trim().length === 0
      )
        return false;
      return true;
    }
    if (question.type === "multi") {
      if (multiValue.length === 0) return false;
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

  const showSkipToast = useCallback(
    (areaId: string) => {
      const name = areaNames.get(areaId);
      if (!name) return;
      if (skipToastTimer.current) clearTimeout(skipToastTimer.current);
      setSkipToast({ areaName: name, visible: true });
      skipToastTimer.current = setTimeout(() => {
        setSkipToast((prev) => (prev ? { ...prev, visible: false } : null));
      }, 3000);
    },
    [areaNames]
  );

  const transition = useCallback((newIndex: number, dir: "forward" | "back") => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setIndex(newIndex);
      setAnimating(false);
      window.scrollTo(0, 0);
    }, 220);
  }, []);

  /** Merge "Other" free-text, convert lone None to canonical string, add verticalId. */
  const buildFinalAnswers = useCallback(
    (base: SurveyAnswers): SurveyAnswers => {
      const final: SurveyAnswers = { ...base };

      Object.entries(final).forEach(([qId, val]) => {
        if (Array.isArray(val)) {
          if (val.length === 1 && val[0] === NONE_OPTION) {
            final[qId] = NONE_VALUE;
            return;
          }
          const text = otherTexts[qId];
          if (text?.trim() && val.includes("Other")) {
            final[qId] = val.map((v) =>
              v === "Other" ? `Other: ${text.trim()}` : v
            );
          }
        } else if (typeof val === "string") {
          const q = allQuestions.find((aq) => aq.id === qId);
          if (q?.allowOtherInput && val.startsWith("Other")) {
            const text = otherTexts[qId];
            if (text?.trim()) final[qId] = `Other: ${text.trim()}`;
          }
        }
      });

      // Downstream pipeline (AI analysis, PDF, email) reads verticalId to
      // apply vertical-specific prompt additions and terminology.
      final.verticalId = config.verticalId;

      return final;
    },
    [otherTexts, config.verticalId, allQuestions]
  );

  const advance = useCallback(() => {
    if (!canAdvance()) return;

    if (question.id === "intro_email") {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue.trim());
      if (!valid) {
        setEmailError(
          "Please enter a valid email address — we'll send your report here."
        );
        return;
      }
      setEmailError("");
    }

    const answer = answers[question.id];
    const skippedIds = getSkippedIds(question.id, answer, allQuestions, index);

    if (skippedIds.length > 0) {
      const skippedAnswers: SurveyAnswers = {};
      skippedIds.forEach((id) => {
        skippedAnswers[id] = SKIPPED_VALUE;
      });

      const updatedAnswers = { ...answers, ...skippedAnswers };
      setAnswers(updatedAnswers);

      if (question.areaId) {
        showSkipToast(question.areaId);
        const nextIndex = getNextAreaIndex(
          question.areaId,
          index,
          allQuestions
        );
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

    // Auto-skip questions that are pre-marked SKIPPED_VALUE or whose skipIf
    // condition is satisfied by a previously-recorded answer.
    let nextIdx = index + 1;
    while (nextIdx < total) {
      const nextQ = allQuestions[nextIdx];
      const preSkipped = answers[nextQ.id] === SKIPPED_VALUE;
      const condSkipped =
        nextQ.skipIf != null &&
        answers[nextQ.skipIf.questionId] === nextQ.skipIf.answer;
      if (!preSkipped && !condSkipped) break;
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
    allQuestions,
  ]);

  const back = () => {
    if (index === 0) return;
    let prevIdx = index - 1;
    while (prevIdx > 0 && answers[allQuestions[prevIdx].id] === SKIPPED_VALUE) {
      prevIdx--;
    }
    transition(prevIdx, "back");
  };

  // Enter key advances (except on text inputs where it submits the input itself)
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
      // For questions with midpoints, store a numeric sibling key for the AI
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

  const handleFinAvgSaleSelect = useCallback(
    (opt: string) => {
      const finQBase = allQuestions.find((q) => q.id === "fin_avg_sale");
      setAnswers((prev) => {
        if (opt === "Enter exact amount") {
          return {
            ...prev,
            fin_avg_sale: "custom",
            fin_avg_sale_value: "",
            fin_avg_sale_label: "custom",
          };
        }
        const next: SurveyAnswers = { ...prev, fin_avg_sale: opt };
        // Resolve dynamic midpoints inside the functional updater so we always
        // use the tier that matches the currently-answered hs_service_type.
        const finQ = finQBase ? resolveQuestion(finQBase, prev) : null;
        if (finQ?.midpoints) {
          const midpoint = finQ.midpoints[opt];
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
    },
    [allQuestions]
  );

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
          {config.verticalId === "home-services"
            ? "RevRep.ai — Home Services Audit"
            : "RevRep.ai Workflow Audit"}
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
              <AreaBadge areaId={resolvedQuestion.areaId} areaNames={areaNames} />
            </div>

            {/* Question text */}
            <h2 className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
              {resolvedQuestion.question}
            </h2>

            {/* Glossary tooltips */}
            {resolvedQuestion.glossary && (
              <GlossaryTooltips glossary={resolvedQuestion.glossary} />
            )}

            {/* Input */}
            {resolvedQuestion.type === "text" && (
              <>
                <TextInput
                  question={resolvedQuestion}
                  value={textValue}
                  onChange={setAnswer}
                  onSubmit={advance}
                />
                {resolvedQuestion.id === "intro_email" && emailError && (
                  <p className="mt-2 text-sm text-red-500">{emailError}</p>
                )}
              </>
            )}
            {resolvedQuestion.type === "single" && resolvedQuestion.id !== "fin_avg_sale" && (
              <SingleSelect
                question={resolvedQuestion}
                value={textValue}
                onChange={setAnswer}
                otherText={resolvedQuestion.allowOtherInput ? otherText : undefined}
                onOtherChange={resolvedQuestion.allowOtherInput ? setOtherText : undefined}
              />
            )}
            {resolvedQuestion.id === "fin_avg_sale" && (
              <FinAvgSaleSelect
                question={resolvedQuestion}
                value={textValue}
                customInputValue={finAvgSaleCustom}
                onSelect={handleFinAvgSaleSelect}
                onCustomInput={handleFinAvgSaleCustomInput}
              />
            )}
            {resolvedQuestion.type === "multi" && (
              <MultiSelect
                question={resolvedQuestion}
                value={multiValue}
                otherText={otherText}
                onChange={setAnswer}
                onOtherChange={setOtherText}
              />
            )}
            {resolvedQuestion.type === "scale" && (
              <ScaleInput
                question={resolvedQuestion}
                value={textValue}
                onChange={setAnswer}
              />
            )}
          </div>

          {/* Navigation */}
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
