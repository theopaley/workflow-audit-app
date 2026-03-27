import type { Question } from "@/lib/survey-config";

/**
 * Per-area configuration for a vertical.
 * `questions` covers Q2–Q4 (the workflow-health questions).
 * Q1 (software) is derived from `softwareOptions`.
 */
export interface VerticalArea {
  id: string;
  name: string;
  /** Alternative area name shown when the owner selected a recurring service type. */
  recurringName?: string;
  /** Human-readable label for what leaks in this area (e.g. "missed leads"). */
  leakageType: string;
  /** Fraction of revenue/leads/etc. estimated to leak through this area (0–1). */
  leakageRate: number;
  /** Cited stat used in the report to frame the industry context. */
  industryBenchmarkStat: string;
  questions: Question[];
  softwareOptions: string[];
}

/**
 * Overrides or additions to the shared intro question set.
 * Keys match intro question IDs (e.g. "intro_business").
 * Values are partial Question objects — only the fields that differ from the
 * base question need to be supplied.
 */
export type IntroQuestionOverrides = Partial<Record<string, Partial<Question>>>;

/**
 * Top-level config for a single vertical.
 * One file per vertical lives in src/lib/verticals/{slug}.ts and must satisfy
 * this type.
 */
export interface VerticalConfig {
  /** URL-safe identifier that matches the registry key and the [vertical] slug. */
  verticalId: string;
  /** Human-readable name shown in the survey header and report. */
  displayName: string;
  /**
   * Optional overrides to the shared intro questions.
   * Use this to change placeholder text, question wording, or answer options
   * for questions that exist in the base set.
   * Add new keys here to inject extra intro questions unique to this vertical.
   */
  introQuestions?: IntroQuestionOverrides;
  /**
   * IDs of base intro questions to omit from this vertical's survey.
   * Use when a standard intro question is irrelevant or replaced by a
   * vertical-specific equivalent injected via introQuestions.
   */
  skipQuestions?: string[];
  workflowAreas: VerticalArea[];
  /**
   * Maps each area id to the leakage rate used in the financial calculation.
   * Typically mirrors VerticalArea.leakageRate but kept as a flat lookup for
   * the AI analysis layer.
   */
  leakageFormula: Record<string, number>;
  /**
   * Extra context injected into the AI system prompt for this vertical.
   * Use this to provide industry-specific framing, terminology, or benchmarks.
   */
  aiPromptAdditions: string;
}
