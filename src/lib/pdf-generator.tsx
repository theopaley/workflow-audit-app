import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { AnalysisResult, AreaResult, StackAction } from "./ai-analysis";
import type { SurveyAnswers } from "@/types/survey";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Use built-in Helvetica to avoid network fetches at render time.
Font.registerHyphenationCallback((word) => [word]);

// ─── Palette ─────────────────────────────────────────────────────────────────

const COVER_BG   = "#0F172A"; // near-black navy for dark cover
const COVER_MUTED = "#94A3B8"; // slate-400 — readable on dark

const C = {
  indigo: "#4F46E5",
  indigoLight: "#EEF2FF",
  indigoMid: "#818CF8",
  body: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  white: "#FFFFFF",
  red: "#DC2626",
  redLight: "#FEF2F2",
  amber: "#D97706",
  amberLight: "#FFFBEB",
  green: "#059669",
  greenLight: "#ECFDF5",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

/** Full comma-formatted currency, e.g. $1,234,567 */
function formatCurrencyFull(n: number): string {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function scoreColor(score: number): string {
  if (score >= 70) return C.green;
  if (score >= 50) return C.amber;
  return C.red;
}

function scoreBackground(score: number): string {
  if (score >= 70) return C.greenLight;
  if (score >= 50) return C.amberLight;
  return C.redLight;
}

const STACK_ACTION_COLORS: Record<NonNullable<StackAction>, { bg: string; text: string }> = {
  CONFIGURE: { bg: "#EFF6FF", text: "#1D4ED8" },
  CONNECT:   { bg: "#F0FDF4", text: "#15803D" },
  REPLACE:   { bg: "#FFF7ED", text: "#C2410C" },
  DEPLOY:    { bg: C.indigoLight, text: C.indigo },
};

const TODAY = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Pages
  page: {
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    paddingHorizontal: 56,
    paddingVertical: 56,
  },
  coverPage: {
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    paddingHorizontal: 56,
    paddingVertical: 72,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  coverPageDark: {
    backgroundColor: COVER_BG,
    fontFamily: "Helvetica",
    paddingHorizontal: 56,
    paddingVertical: 72,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  // Typography
  wordmark: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: C.indigo,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  coverEyebrow: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COVER_MUTED,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  coverBusiness: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    marginTop: 10,
    lineHeight: 1.2,
  },
  coverDate: {
    fontSize: 11,
    color: COVER_MUTED,
    marginTop: 6,
  },
  coverStatement: {
    fontSize: 17,
    fontFamily: "Times-Roman",
    color: "#CBD5E1",
    lineHeight: 1.65,
    marginTop: 24,
  },
  coverStatementAmount: {
    fontSize: 17,
    fontFamily: "Times-Bold",
    color: C.white,
  },
  coverScoreLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COVER_MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  coverScoreValue: {
    fontSize: 72,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1,
  },
  coverScoreOutOf: {
    fontSize: 18,
    color: COVER_MUTED,
    marginLeft: 4,
  },
  coverLeakageLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COVER_MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  coverLeakageValue: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: C.red,
    lineHeight: 1,
  },
  coverLeakageSub: {
    fontSize: 11,
    color: COVER_MUTED,
    marginTop: 3,
  },

  // Section headings
  pageTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: C.body,
    marginBottom: 6,
  },
  pageTitleAccent: {
    color: C.indigo,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: C.indigo,
    marginBottom: 20,
    width: 40,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.indigo,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 16,
  },

  // Body text
  body: {
    fontSize: 10,
    color: C.body,
    lineHeight: 1.65,
  },
  muted: {
    fontSize: 9,
    color: C.muted,
    lineHeight: 1.5,
  },

  // Priority cards
  priorityCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
  },
  priorityNumber: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: C.indigo,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  priorityNumberText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.white,
  },
  priorityHeadline: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.body,
    marginBottom: 4,
    flex: 1,
  },
  priorityArea: {
    fontSize: 9,
    color: C.indigo,
    fontFamily: "Helvetica-Bold",
    backgroundColor: C.indigoLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
  },
  tag: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
  },
  firstStepLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 3,
  },

  // Area finding cards
  findingCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 16,
    marginBottom: 14,
  },
  findingHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  findingAreaName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: C.body,
    flex: 1,
    marginRight: 12,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreBadgeText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  stackBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginTop: 10,
  },
  stackBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  findingSubLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 2,
  },
  toolText: {
    fontSize: 9,
    color: C.indigo,
    fontFamily: "Helvetica-Bold",
  },

  // Closing page
  closingHeading: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: C.body,
    marginBottom: 12,
    lineHeight: 1.2,
  },
  closingAccent: {
    color: C.indigo,
  },
  ctaButton: {
    backgroundColor: C.indigo,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignSelf: "flex-start",
    marginTop: 28,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: C.white,
  },
  ctaUrl: {
    fontSize: 9,
    color: C.muted,
    marginTop: 8,
  },

  // Layout utilities
  row: { display: "flex", flexDirection: "row", alignItems: "center" },
  spacer: { flex: 1 },
  mt4:  { marginTop: 4 },
  mt8:  { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt20: { marginTop: 20 },
  mt32: { marginTop: 32 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: C.muted,
  },
});

// ─── Shared components ────────────────────────────────────────────────────────

function PageFooter({ page, businessName }: { page: number; businessName: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>WorkflowAudit — {businessName}</Text>
      <Text style={s.footerText}>{page}</Text>
    </View>
  );
}

function EffortTag({ label, value }: { label: string; value: string }) {
  const color = value === "Low" ? C.green : value === "Medium" ? C.amber : C.red;
  const bg   = value === "Low" ? C.greenLight : value === "Medium" ? C.amberLight : C.redLight;
  return (
    <View style={[s.tag, { backgroundColor: bg }]}>
      <Text style={[s.tag, { color, margin: 0, padding: 0, fontFamily: "Helvetica-Bold" }]}>
        {label}: {value}
      </Text>
    </View>
  );
}

function StackBadge({ action }: { action: NonNullable<StackAction> }) {
  const cfg = STACK_ACTION_COLORS[action];
  return (
    <View style={[s.stackBadge, { backgroundColor: cfg.bg }]}>
      <Text style={[s.stackBadgeText, { color: cfg.text }]}>{action}</Text>
    </View>
  );
}

// ─── Page 1: Cover ────────────────────────────────────────────────────────────

function CoverPage({
  result,
  businessDescription,
}: {
  result: AnalysisResult;
  businessDescription: string;
}) {
  const name = businessDescription || result.businessName;
  const annualFormatted = formatCurrencyFull(result.totalAnnualLeakage);

  return (
    <Page size="A4" style={s.coverPageDark}>
      {/* Top — eyebrow + title + statement */}
      <View>
        <Text style={s.coverEyebrow}>WorkflowAudit™ — Confidential AI Readiness Report</Text>
        <Text style={s.coverBusiness}>{name}</Text>
        <Text style={s.coverDate}>Generated {TODAY}</Text>

        <Text style={s.coverStatement}>
          {"Based on your audit, "}
          <Text style={{ fontFamily: "Times-Bold", color: C.white }}>{name}</Text>
          {" is losing an estimated "}
          <Text style={s.coverStatementAmount}>{annualFormatted}</Text>
          {" every year to workflow gaps that AI can fix. Here's exactly where it's going — and how to get it back."}
        </Text>
      </View>

      {/* Middle — score + leakage */}
      <View>
        <View style={[s.row, { alignItems: "flex-end", marginBottom: 32 }]}>
          {/* Score */}
          <View style={{ marginRight: 48 }}>
            <Text style={s.coverScoreLabel}>Workflow Health Score</Text>
            <View style={s.row}>
              <Text style={[s.coverScoreValue, { color: scoreColor(result.overallScore) }]}>
                {result.overallScore}
              </Text>
              <Text style={[s.coverScoreOutOf, { marginTop: 46 }]}> / 100</Text>
            </View>
          </View>

          {/* Leakage */}
          {result.totalMonthlyLeakage > 0 && (
            <View>
              <Text style={s.coverLeakageLabel}>Est. Monthly Leakage</Text>
              <Text style={s.coverLeakageValue}>
                {formatCurrency(result.totalMonthlyLeakage)}/mo
              </Text>
              <Text style={s.coverLeakageSub}>
                {formatCurrency(result.totalAnnualLeakage)} per year
              </Text>
            </View>
          )}
        </View>

        {/* Divider rule */}
        <View style={{ height: 1, backgroundColor: "#1E293B" }} />
      </View>

      {/* Bottom — prepared for */}
      <View>
        <Text style={[s.muted, { color: COVER_MUTED }]}>Prepared for</Text>
        <Text style={[s.body, { fontFamily: "Helvetica-Bold", marginTop: 2, color: C.white }]}>
          {result.ownerName}
        </Text>
        <Text style={[s.muted, { marginTop: 2, color: COVER_MUTED }]}>{result.recommendedTier}</Text>
      </View>
    </Page>
  );
}

// ─── Page 2: Executive Summary ────────────────────────────────────────────────

function ExecutiveSummaryPage({ result }: { result: AnalysisResult }) {
  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionLabel}>Executive Summary</Text>
      <Text style={s.pageTitle}>What we found</Text>
      <View style={s.sectionDivider} />

      <Text style={s.body}>{result.reportOpening}</Text>

      <View style={s.mt32}>
        <Text style={[s.sectionLabel, { marginBottom: 12 }]}>Top 3 Priority Fixes</Text>
        {result.topThreePriorities.map((p, i) => (
          <View key={i} style={s.priorityCard} wrap={false}>
            <View style={s.row}>
              <View style={s.priorityNumber}>
                <Text style={s.priorityNumberText}>{i + 1}</Text>
              </View>
              <Text style={s.priorityHeadline}>{p.headline}</Text>
            </View>
            <View style={[s.row, s.mt8]}>
              <View style={s.priorityArea}>
                <Text style={{ fontSize: 9, color: C.indigo, fontFamily: "Helvetica-Bold" }}>
                  {p.areaName}
                </Text>
              </View>
              <EffortTag label="Effort" value={p.effort} />
              <EffortTag label="Impact" value={p.impact} />
            </View>
            <Text style={s.firstStepLabel}>First step</Text>
            <Text style={s.body}>{p.firstStep}</Text>
          </View>
        ))}
      </View>

      <PageFooter page={2} businessName={result.businessName} />
    </Page>
  );
}

// ─── Page 3+: Findings ────────────────────────────────────────────────────────

function FindingCard({ area }: { area: AreaResult }) {
  const action = area.stackAction;
  return (
    <View style={s.findingCard} wrap={false}>
      <View style={s.findingHeader}>
        <Text style={s.findingAreaName}>{area.name}</Text>
        <View style={[s.scoreBadge, { backgroundColor: scoreBackground(area.score) }]}>
          <Text style={[s.scoreBadgeText, { color: scoreColor(area.score) }]}>
            {area.score} / 100
          </Text>
        </View>
      </View>

      <Text style={s.body}>{area.scoreReasoning}</Text>

      {area.monthlyLeakage > 0 && (
        <View style={s.mt8}>
          <Text style={s.findingSubLabel}>Estimated leakage</Text>
          <Text style={[s.body, { color: C.red }]}>
            {formatCurrency(area.monthlyLeakage)}/mo — {area.leakageExplanation}
          </Text>
        </View>
      )}

      <View style={s.mt8}>
        <Text style={s.findingSubLabel}>What to do</Text>
        <Text style={s.body}>{area.empower}</Text>
      </View>

      {action && (
        <View style={[s.row, s.mt8, { flexWrap: "wrap" }]}>
          <StackBadge action={action} />
          {area.replacementTool ? (
            <View style={{ flex: 1 }}>
              <Text style={s.toolText}>{area.replacementTool}</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Text style={s.muted}>{area.stackReasoning}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function FindingsPage({ result }: { result: AnalysisResult }) {
  const flaggedAreas = result.areas.filter((a) => a.score < 70);
  const redAreas   = flaggedAreas.filter((a) => a.grade === "Red");
  const amberAreas = flaggedAreas.filter((a) => a.grade === "Amber");

  return (
    <Page size="A4" style={s.page}>
      <Text style={s.sectionLabel}>Findings</Text>
      <Text style={s.pageTitle}>Areas below the threshold</Text>
      <View style={s.sectionDivider} />

      {redAreas.length > 0 && (
        <View style={s.mt8}>
          <Text style={[s.muted, { marginBottom: 10, fontFamily: "Helvetica-Bold", color: C.red }]}>
            Critical — Score below 50
          </Text>
          {redAreas.map((area) => (
            <FindingCard key={area.id} area={area} />
          ))}
        </View>
      )}

      {amberAreas.length > 0 && (
        <View style={redAreas.length > 0 ? s.mt20 : s.mt8}>
          <Text style={[s.muted, { marginBottom: 10, fontFamily: "Helvetica-Bold", color: C.amber }]}>
            Needs Improvement — Score 50–69
          </Text>
          {amberAreas.map((area) => (
            <FindingCard key={area.id} area={area} />
          ))}
        </View>
      )}

      <PageFooter page={3} businessName={result.businessName} />
    </Page>
  );
}

// ─── Page 4: Closing ─────────────────────────────────────────────────────────

function ClosingPage({ result }: { result: AnalysisResult }) {
  const encouragement = result.closingPoints[0] ?? "Your business has everything it needs to run better — the systems just need to catch up with the team.";

  return (
    <Page size="A4" style={s.coverPage}>
      <View>
        <Text style={s.wordmark}>WorkflowAudit</Text>
      </View>

      <View>
        <Text style={s.closingHeading}>
          Ready to{"\n"}
          <Text style={s.closingAccent}>fix this?</Text>
        </Text>
        <View style={{ height: 2, backgroundColor: C.indigo, width: 40, marginBottom: 20 }} />
        <Text style={[s.body, { maxWidth: 360 }]}>{encouragement}</Text>

        <View style={s.ctaButton}>
          <Text style={s.ctaText}>Book a Free Strategy Call</Text>
        </View>
        <Text style={s.ctaUrl}>https://workflow-audit-app.vercel.app</Text>
      </View>

      <View>
        <View style={{ height: 1, backgroundColor: C.border, marginBottom: 16 }} />
        <Text style={s.muted}>
          {result.tierRationale}
        </Text>
        <Text style={[s.muted, { marginTop: 6 }]}>
          Recommended: {result.recommendedTier}
        </Text>
      </View>
    </Page>
  );
}

// ─── Root document ────────────────────────────────────────────────────────────

interface AuditReportDocumentProps {
  result: AnalysisResult;
  answers: SurveyAnswers;
}

export function AuditReportDocument({ result, answers }: AuditReportDocumentProps) {
  const companyName =
    typeof answers.intro_company_name === "string" && answers.intro_company_name.trim()
      ? answers.intro_company_name.trim()
      : result.businessName;

  return (
    <Document
      title={`WorkflowAudit — ${companyName}`}
      author="WorkflowAudit"
      subject="Workflow Audit Report"
    >
      <CoverPage result={result} businessDescription={companyName} />
      <ExecutiveSummaryPage result={result} />
      <FindingsPage result={result} />
      <ClosingPage result={result} />
    </Document>
  );
}

// ─── PDF generation helper (server-side) ─────────────────────────────────────

/**
 * Renders the report to a Buffer. Call this server-side only.
 * Returns a Uint8Array suitable for attaching to an email or streaming as a download.
 */
export async function generateAuditPDF(
  result: AnalysisResult,
  answers: SurveyAnswers
): Promise<Uint8Array> {
  const { renderToBuffer } = await import("@react-pdf/renderer");
  return renderToBuffer(<AuditReportDocument result={result} answers={answers} />);
}
