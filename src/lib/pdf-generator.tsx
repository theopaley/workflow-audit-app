import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Circle,
} from "@react-pdf/renderer";
import type { AnalysisResult, AreaResult, StackAction } from "./ai-analysis";
import type { SurveyAnswers } from "@/types/survey";

// ─── Fonts ────────────────────────────────────────────────────────────────────
Font.registerHyphenationCallback((word) => [word]);

// ─── Color system ─────────────────────────────────────────────────────────────

const C = {
  ink:         "#1a1a1a",
  inkLight:    "#4a4a4a",
  inkMuted:    "#8a8a8a",
  paper:       "#ffffff",
  white:       "#ffffff",
  accent:      "#c8402e",
  accentLight: "#f5e8e6",
  gold:        "#b8860b",
  goldLight:   "#faf5e4",
  green:       "#2a6b3c",
  greenLight:  "#e8f4ec",
  border:      "#ddd9d2",
  warn:        "#e07b20",
  warnLight:   "#fef3e8",
  coverBg:     "#1a1a1a",
};

// ─── Stack action config ──────────────────────────────────────────────────────

const STACK_ACTION_CONFIG: Record<
  NonNullable<StackAction>,
  { bg: string; text: string; label: string }
> = {
  CONFIGURE: { bg: C.warnLight,   text: C.warn,   label: "Configure" },
  CONNECT:   { bg: C.greenLight,  text: C.green,  label: "Connect"   },
  REPLACE:   { bg: C.warnLight,   text: C.warn,   label: "Replace"   },
  DEPLOY:    { bg: C.accentLight, text: C.accent, label: "Deploy"    },
};

// ─── Industry stats ───────────────────────────────────────────────────────────

const INDUSTRY_STATS: Record<string, { stat: string; source: string }> = {
  lead_followup: {
    stat: "Businesses that follow up within 5 minutes are 100x more likely to convert than those who wait 30 minutes. The average service business takes 42+ hours to respond.",
    source: "Harvard Business Review",
  },
  scheduling: {
    stat: "The average no-show rate across service businesses is 19% — costing small businesses $26,000/year in lost revenue. Automated reminders reduce no-shows by 30–40%.",
    source: "10to8 / Financesonline",
  },
  reviews: {
    stat: "89% of consumers read reviews before deciding. A single star increase = 5–9% revenue lift. Google's top 3 results earn 126% more traffic than everyone below them.",
    source: "Harvard Business Review / SOCi",
  },
  referrals: {
    stat: "83% of happy customers are willing to refer — but only 29% ever do. For 82% of small businesses, referrals are the #1 source of new clients.",
    source: "Texas Tech / Nielsen",
  },
  invoicing: {
    stat: "56% of small businesses are owed money from unpaid invoices, averaging $17,500 each. Businesses with high overdue invoice volume are 1.4x more likely to report cash flow problems.",
    source: "QuickBooks 2025",
  },
  proposals: {
    stat: "50% of the time, the first company to send a quote wins the job — yet most service businesses are still quoting manually, days after the request.",
    source: "Industry research",
  },
  reengagement: {
    stat: "An existing customer has a 60–70% chance of buying again vs. 1–3% for a brand new prospect. 73% of businesses have no structured plan to re-engage past clients.",
    source: "Adobe / Bain & Company",
  },
  communication: {
    stat: "53% of people will switch to a competitor if response time is too slow. 78% of customers buy from the first business that responds — regardless of price.",
    source: "Verse.ai / LeadConnect",
  },
  lead_capture: {
    stat: "Businesses that track lead sources grow 2x faster than those that don't. Yet 61% of small businesses have no system for capturing where their leads come from.",
    source: "HubSpot / Salesforce SMB Report",
  },
  onboarding: {
    stat: "A structured onboarding process improves customer retention by 50%. Customers who feel confused or ignored in the first 30 days are 3x more likely to churn.",
    source: "Wyzowl / Bain & Company",
  },
  project_mgmt: {
    stat: "Businesses using dedicated job management software report 23% higher on-time completion rates and spend 40% less time on administrative coordination.",
    source: "Jobber / ServiceTitan Industry Report",
  },
  reporting: {
    stat: "Only 23% of small business owners review performance data weekly. Businesses that track key metrics monthly grow revenue 30% faster than those flying blind.",
    source: "Clutch SMB Survey / Dun & Bradstreet",
  },
};

// ─── Recommended platforms (static right column) ──────────────────────────────

const RECOMMENDED_PLATFORMS = [
  {
    name: "GoHighLevel (GHL)",
    description:
      "Your automation backbone. Connects lead intake, follow-up, review requests, referral campaigns into one system.",
    actionText: "→ Core to your entire implementation",
  },
  {
    name: "ElevenLabs Voice Agent",
    description:
      "AI receptionist answering every inbound call 24/7. Books appointments, qualifies leads, routes urgent jobs.",
    actionText: "→ Highest-impact addition for lead capture",
  },
  {
    name: "SMS / 2-Way Texting",
    description:
      "98% of texts read within 3 minutes. Built into GHL — minimal setup required.",
    actionText: "→ Built into GHL — minimal setup required",
  },
  {
    name: "Reporting Dashboard",
    description:
      "Tracks lead response time, review velocity, no-show rate, referral volume.",
    actionText: "→ Built during implementation — no extra tools needed",
  },
];

// ─── Platform helpers ─────────────────────────────────────────────────────────

interface PlatformEntry {
  name: string;
  status: "Well Set Up" | "Underutilized" | "Gap";
  description: string;
  actionText: string;
}

function getStackDescription(action: StackAction): string {
  switch (action) {
    case "CONFIGURE": return "In your stack — needs configuration";
    case "CONNECT":   return "Needs integration with other tools";
    case "REPLACE":   return "Candidate for replacement";
    case "DEPLOY":    return "Ready for additional automation";
    default:          return "Currently in use";
  }
}

function buildLeftColumnCards(
  result: AnalysisResult,
  answers: SurveyAnswers
): PlatformEntry[] {
  const entries: PlatformEntry[] = [];

  for (const area of result.areas) {
    const raw = answers[`${area.id}_software`];
    const selected: string[] = Array.isArray(raw)
      ? raw
      : typeof raw === "string"
      ? [raw]
      : [];

    const hasNone = selected.some((p) => p.toLowerCase().startsWith("none"));
    const platforms = selected.filter(
      (p) => !p.toLowerCase().startsWith("none") && p !== "Other"
    );

    if (hasNone || platforms.length === 0) {
      // Always show gap areas regardless of score
      entries.push({
        name: area.name,
        status: "Gap",
        description: "No platform in use for this workflow area",
        actionText: area.empower,
      });
    } else if (area.score < 70) {
      // Only show platforms for underperforming areas
      const description = getStackDescription(area.stackAction);
      const actionText = area.replacementTool
        ? `Replace with: ${area.replacementTool}`
        : area.stackReasoning;

      for (const platform of platforms) {
        entries.push({ name: platform, status: "Underutilized", description, actionText });
      }
    }
    // score >= 70 with real platforms: intentionally omitted
  }

  return entries;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function formatCurrencyFull(n: number): string {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const TODAY = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const CIRC = 2 * Math.PI * 40; // SVG circle circumference for r=40

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // ── Pages ──
  coverPage: {
    backgroundColor: C.coverBg,
    fontFamily: "Helvetica",
    paddingHorizontal: 56,
    paddingTop: 64,
    paddingBottom: 48,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  paperPage: {
    backgroundColor: C.paper,
    fontFamily: "Helvetica",
    paddingHorizontal: 48,
    paddingTop: 48,
    paddingBottom: 64,
  },
  whitePage: {
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    paddingHorizontal: 48,
    paddingTop: 48,
    paddingBottom: 64,
  },

  // ── Cover ──
  coverEyebrow: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.inkMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  coverName: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    lineHeight: 1.2,
    marginBottom: 10,
  },
  coverSubtitle: {
    fontSize: 18,
    color: "#8e8e8e",
    lineHeight: 1.4,
    marginBottom: 20,
  },
  coverRule: {
    height: 1,
    backgroundColor: "#363636",
    marginBottom: 24,
  },
  coverStatement: {
    fontSize: 18,
    fontFamily: "Times-Roman",
    color: "#bebebe",
    lineHeight: 1.65,
  },
  coverStatementBold: {
    fontSize: 18,
    fontFamily: "Times-Bold",
    color: C.white,
  },

  // ── Cover bottom ──
  scoreLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  leakageBanner: {
    flex: 1,
    backgroundColor: C.accent,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginLeft: 20,
    justifyContent: "center",
  },
  leakageBannerLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#f5a098",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  leakageBannerValue: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    lineHeight: 1,
  },
  leakageBannerSub: {
    fontSize: 10,
    color: "#f5a098",
    marginTop: 4,
  },

  // ── Section header ──
  sectionRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    marginRight: 16,
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  introText: {
    fontSize: 12,
    color: C.inkLight,
    lineHeight: 1.6,
    marginBottom: 20,
  },

  // ── Finding cards ──
  findingCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: C.white,
  },
  findingCardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    borderBottomStyle: "solid",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  findingCardBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 12,
  },
  actionBadgeText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  findingAreaName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    flex: 1,
  },
  findingLeakage: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.accent,
  },

  // ── Stat callout ──
  statCallout: {
    backgroundColor: C.goldLight,
    borderLeftWidth: 3,
    borderLeftColor: C.gold,
    borderLeftStyle: "solid",
    borderRadius: 4,
    padding: 14,
    marginBottom: 14,
  },
  statCalloutLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.gold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statCalloutText: {
    fontSize: 13,
    color: C.ink,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  statCalloutSource: {
    fontSize: 10,
    color: C.inkMuted,
    fontFamily: "Helvetica-Oblique",
  },

  // ── Finding body ──
  yourResultLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.accent,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  whatToDoLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.green,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  findingBodyMuted: {
    fontSize: 13,
    color: C.inkLight,
    lineHeight: 1.55,
  },
  findingBodyDark: {
    fontSize: 13,
    color: C.ink,
    lineHeight: 1.55,
  },

  // ── Tool chips ──
  toolChipsRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  toolChip: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginTop: 4,
  },
  toolChipText: {
    fontSize: 11,
    color: C.inkLight,
  },

  // ── Platform stack ──
  twoCol: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  colHeader: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  platformCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
    backgroundColor: C.white,
  },
  platformCardRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  platformCardName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    flex: 1,
    marginRight: 6,
  },
  platformCardDesc: {
    fontSize: 11,
    color: C.inkMuted,
    lineHeight: 1.4,
    marginBottom: 3,
  },
  platformCardAction: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.green,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },

  // ── Closing ──
  closingHeading: {
    fontSize: 40,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    lineHeight: 1.2,
    marginBottom: 16,
  },
  closingSubtext: {
    fontSize: 14,
    color: "#8e8e8e",
    lineHeight: 1.6,
    marginBottom: 32,
    maxWidth: 380,
  },
  ctaButton: {
    backgroundColor: C.accent,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  ctaText: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: C.white,
  },
  ctaUrl: {
    fontSize: 9,
    color: C.inkMuted,
  },

  // ── Utilities ──
  row: { display: "flex", flexDirection: "row", alignItems: "center" },
  mt8:  { marginTop: 8  },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: C.inkMuted,
  },
});

// ─── Score ring (SVG) ─────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const dash = CIRC * (score / 100);
  const gap  = CIRC - dash;

  return (
    <View style={{ width: 110, height: 110, position: "relative" }}>
      <Svg width="110" height="110" viewBox="0 0 100 100">
        {/* Track */}
        <Circle cx="50" cy="50" r="40" fill="none" stroke="#2e2e2e" strokeWidth="8" />
        {/* Arc */}
        <Circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={C.accent}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          transform="rotate(-90, 50, 50)"
        />
      </Svg>
      {/* Centered score text overlaid on SVG */}
      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 26, fontFamily: "Helvetica-Bold", color: C.white, lineHeight: 1 }}>
          {score}
        </Text>
        <Text style={{ fontSize: 9, color: C.inkMuted, marginTop: 2 }}>/100</Text>
      </View>
    </View>
  );
}

// ─── Page footer ──────────────────────────────────────────────────────────────

function PageFooter({ page, businessName }: { page: number; businessName: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>RevRep — {businessName}</Text>
      <Text style={s.footerText}>{page}</Text>
    </View>
  );
}

// ─── Page 1: Cover ────────────────────────────────────────────────────────────

function CoverPage({
  result,
  businessName,
}: {
  result: AnalysisResult;
  businessName: string;
}) {
  const annualFormatted = formatCurrencyFull(result.totalAnnualLeakage);

  return (
    <Page size="A4" style={s.coverPage}>
      {/* Top — eyebrow, name, subtitle, rule, statement */}
      <View>
        <Text style={s.coverEyebrow}>
          Presented by RevRep — Confidential AI Readiness Report
        </Text>
        <Text style={s.coverName}>{businessName}</Text>
        <Text style={s.coverSubtitle}>
          Your personalized workflow assessment &amp; action plan
        </Text>
        <View style={s.coverRule} />
        <Text style={s.coverStatement}>
          {"Based on your audit, "}
          <Text style={{ fontFamily: "Times-Bold", color: C.white }}>{businessName}</Text>
          {" is losing an estimated "}
          <Text style={s.coverStatementBold}>{annualFormatted}</Text>
          {" every year to workflow gaps that AI can fix. Here's exactly where it's going — and how to get it back."}
        </Text>
      </View>

      {/* Bottom — score ring + leakage banner */}
      <View>
        <View style={s.row}>
          {/* Score ring */}
          <View>
            <Text style={s.scoreLabel}>Workflow Health Score</Text>
            <ScoreRing score={result.overallScore} />
          </View>

          {/* Leakage banner */}
          {result.totalMonthlyLeakage > 0 && (
            <View style={s.leakageBanner}>
              <Text style={s.leakageBannerLabel}>Est. Monthly Leakage</Text>
              <Text style={s.leakageBannerValue}>
                {formatCurrency(result.totalMonthlyLeakage)}/mo
              </Text>
              <Text style={s.leakageBannerSub}>
                {formatCurrencyFull(result.totalAnnualLeakage)} per year
              </Text>
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}

// ─── Page 2: Findings ─────────────────────────────────────────────────────────

function FindingCard({ area }: { area: AreaResult }) {
  const action    = area.stackAction;
  const actionCfg = action ? STACK_ACTION_CONFIG[action] : null;
  const stat      = INDUSTRY_STATS[area.id];

  return (
    <View style={s.findingCard} wrap={false}>
      {/* Header */}
      <View style={s.findingCardHeader}>
        {actionCfg && (
          <View style={[s.actionBadge, { backgroundColor: actionCfg.bg }]}>
            <Text style={[s.actionBadgeText, { color: actionCfg.text }]}>
              {actionCfg.label}
            </Text>
          </View>
        )}
        <Text style={s.findingAreaName}>{area.name}</Text>
        {area.monthlyLeakage > 0 && (
          <Text style={s.findingLeakage}>
            {formatCurrency(area.monthlyLeakage)}/mo
          </Text>
        )}
      </View>

      {/* Body */}
      <View style={s.findingCardBody}>
        {/* 1. Industry stat callout */}
        {stat && area.score < 70 && (
          <View style={s.statCallout}>
            <Text style={s.statCalloutLabel}>Industry Data</Text>
            <Text style={s.statCalloutText}>{stat.stat}</Text>
            <Text style={s.statCalloutSource}>— {stat.source}</Text>
          </View>
        )}

        {/* 2. Your result */}
        <View>
          <Text style={s.yourResultLabel}>Your Result</Text>
          <Text style={s.findingBodyMuted}>{area.scoreReasoning}</Text>
        </View>

        {/* 3. What to do */}
        <View style={s.mt12}>
          <Text style={s.whatToDoLabel}>What To Do</Text>
          <Text style={s.findingBodyDark}>{area.empower}</Text>
        </View>

        {/* 4. Tool chips */}
        {area.replacementTool && (
          <View style={s.toolChipsRow}>
            <View style={s.toolChip}>
              <Text style={s.toolChipText}>{area.replacementTool}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function FindingsPage({ result }: { result: AnalysisResult }) {
  const flaggedAreas = result.areas.filter((a) => a.score < 70);

  return (
    <Page size="A4" style={s.paperPage}>
      <View style={s.sectionRow}>
        <Text style={s.sectionTitle}>Your Findings</Text>
        <View style={s.sectionRule} />
      </View>

      {flaggedAreas.map((area) => (
        <FindingCard key={area.id} area={area} />
      ))}

      <PageFooter page={2} businessName={result.businessName} />
    </Page>
  );
}

// ─── Page 3: Technology Stack ─────────────────────────────────────────────────

function PlatformPage({
  result,
  answers,
}: {
  result: AnalysisResult;
  answers: SurveyAnswers;
}) {
  const leftCards = buildLeftColumnCards(result, answers);

  return (
    <Page size="A4" style={s.whitePage}>
      <View style={s.sectionRow}>
        <Text style={s.sectionTitle}>Your Technology Stack</Text>
        <View style={s.sectionRule} />
      </View>

      <Text style={s.introText}>
        Based on your audit responses, here's an honest look at the tools
        you're already running — and what we recommend adding.
      </Text>

      {/* Section 1 — existing platforms */}
      <Text style={[s.colHeader, { marginBottom: 10 }]}>Platforms You Already Have</Text>
      {leftCards.map((card, i) => {
        const statusColor =
          card.status === "Underutilized" ? C.gold : C.accent;
        const statusBg =
          card.status === "Underutilized" ? C.goldLight : C.accentLight;

        return (
          <View key={i} style={s.platformCard} wrap={false}>
            <View style={s.platformCardRow}>
              <Text style={s.platformCardName}>{card.name}</Text>
              <View style={[s.statusBadge, { backgroundColor: statusBg }]}>
                <Text style={[s.statusBadgeText, { color: statusColor }]}>
                  {card.status}
                </Text>
              </View>
            </View>
            <Text style={s.platformCardDesc}>{card.description}</Text>
            <Text style={s.platformCardAction}>{card.actionText}</Text>
          </View>
        );
      })}

      {/* Section 2 — recommended additions */}
      <Text style={[s.colHeader, { marginTop: 20, marginBottom: 10 }]}>
        Platforms We Recommend Adding
      </Text>
      {RECOMMENDED_PLATFORMS.map((rec, i) => (
        <View key={i} style={s.platformCard} wrap={false}>
          <View style={s.platformCardRow}>
            <Text style={s.platformCardName}>{rec.name}</Text>
            <View style={[s.statusBadge, { backgroundColor: C.greenLight }]}>
              <Text style={[s.statusBadgeText, { color: C.green }]}>Recommended</Text>
            </View>
          </View>
          <Text style={s.platformCardDesc}>{rec.description}</Text>
          <Text style={s.platformCardAction}>{rec.actionText}</Text>
        </View>
      ))}

      <PageFooter page={3} businessName={result.businessName} />
    </Page>
  );
}

// ─── Page 4: Closing CTA ──────────────────────────────────────────────────────

function ClosingPage({ result }: { result: AnalysisResult }) {
  const encouragement =
    result.closingPoints?.[0] ??
    "Your business has everything it needs to run better — the systems just need to catch up with the team.";

  return (
    <Page size="A4" style={s.coverPage}>
      {/* Eyebrow */}
      <View>
        <Text style={s.coverEyebrow}>RevRep — Confidential</Text>
      </View>

      {/* Main content */}
      <View>
        <Text style={s.closingHeading}>
          Ready to{"\n"}fix this?
        </Text>
        <Text style={s.closingSubtext}>{encouragement}</Text>
        <View style={s.ctaButton}>
          <Text style={s.ctaText}>Schedule Your Implementation Call →</Text>
        </View>
        <Text style={s.ctaUrl}>https://workflow-audit-app.vercel.app</Text>
      </View>

      {/* Footer strip */}
      <View>
        <View style={{ height: 1, backgroundColor: "#2e2e2e", marginBottom: 12 }} />
        <Text style={[s.footerText, { color: "#4e4e4e" }]}>
          {result.tierRationale}
        </Text>
        <Text style={[s.footerText, { color: "#4e4e4e", marginTop: 4 }]}>
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
    typeof answers.intro_company_name === "string" &&
    answers.intro_company_name.trim()
      ? answers.intro_company_name.trim()
      : result.businessName;

  return (
    <Document
      title={`RevRep Audit — ${companyName}`}
      author="RevRep"
      subject="AI Readiness Audit Report"
    >
      <CoverPage result={result} businessName={companyName} />
      <FindingsPage result={result} />
      <PlatformPage result={result} answers={answers} />
      <ClosingPage result={result} />
    </Document>
  );
}

// ─── PDF generation helper (server-side only) ─────────────────────────────────

/**
 * Renders the report to a Buffer. Must be called server-side — requires
 * ANTHROPIC_API_KEY to have run first. Returns a Uint8Array for email
 * attachment or streaming download.
 */
export async function generateAuditPDF(
  result: AnalysisResult,
  answers: SurveyAnswers
): Promise<Uint8Array> {
  const { renderToBuffer } = await import("@react-pdf/renderer");
  return renderToBuffer(<AuditReportDocument result={result} answers={answers} />);
}
