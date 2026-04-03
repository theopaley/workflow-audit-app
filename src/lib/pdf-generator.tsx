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
  Path,
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

interface AreaStat { stat: string; source: string }

const STATS: Record<string, AreaStat> = {
  lead_followup: {
    stat: "Businesses that follow up within 5 minutes are 100x more likely to convert than those who wait 30 minutes. The average service business takes 42+ hours to respond.",
    source: "Harvard Business Review",
  },
  lead_capture: {
    stat: "Businesses that track lead sources grow 2x faster than those that don't. Yet 61% of small businesses have no system for capturing where their leads come from.",
    source: "HubSpot / Salesforce SMB Report",
  },
  scheduling: {
    stat: "The average no-show rate across service businesses is 19% — costing small businesses $26,000/year in lost revenue. Automated reminders reduce no-shows by 30–40%.",
    source: "10to8 / Financesonline",
  },
  proposals: {
    stat: "50% of the time, the first company to send a quote wins the job — yet most service businesses are still quoting manually, days after the request.",
    source: "Industry research",
  },
  onboarding: {
    stat: "A structured onboarding process improves customer retention by 50%. Customers who feel confused or ignored in the first 30 days are 3x more likely to churn.",
    source: "Wyzowl / Bain & Company",
  },
  project_mgmt: {
    stat: "Businesses that standardize their project management processes complete jobs 28% faster and report 33% fewer costly errors.",
    source: "McKinsey / Asana State of Work Report",
  },
  invoicing: {
    stat: "56% of small businesses are owed money from unpaid invoices, averaging $17,500 each. Businesses with high overdue invoice volume are 1.4x more likely to report cash flow problems.",
    source: "QuickBooks 2025",
  },
  communication: {
    stat: "53% of people will switch to a competitor if response time is too slow. 78% of customers buy from the first business that responds — regardless of price.",
    source: "Verse.ai / LeadConnect",
  },
  reviews: {
    stat: "89% of consumers read reviews before deciding. A single star increase = 5–9% revenue lift. Google's top 3 results earn 126% more traffic than everyone below them.",
    source: "Harvard Business Review / SOCi",
  },
  reengagement: {
    stat: "An existing customer has a 60–70% chance of buying again vs. 1–3% for a brand new prospect. 73% of businesses have no structured plan to re-engage past clients.",
    source: "Adobe / Bain & Company",
  },
  referrals: {
    stat: "83% of happy customers are willing to refer — but only 29% ever do. For 82% of small businesses, referrals are the #1 source of new clients.",
    source: "Texas Tech / Nielsen",
  },
  business_visibility: {
    stat: "Only 23% of small business owners review performance data weekly. Businesses that track key metrics monthly grow revenue 30% faster than those flying blind.",
    source: "Clutch SMB Survey / Dun & Bradstreet",
  },
};

function getStatForArea(areaId: string): AreaStat | null {
  const id = areaId.toLowerCase().replace(/[^a-z]/g, "");
  if (id.includes("followup") || id.includes("follow")) return STATS.lead_followup;
  if (id.includes("capture") || id.includes("leadcap"))  return STATS.lead_capture;
  if (id.includes("schedul") || id.includes("appoint"))  return STATS.scheduling;
  if (id.includes("propos")  || id.includes("quot"))     return STATS.proposals;
  if (id.includes("onboard"))                            return STATS.onboarding;
  if (id.includes("project") || id.includes("job"))      return STATS.project_mgmt;
  if (id.includes("invoic")  || id.includes("payment"))  return STATS.invoicing;
  if (id.includes("commun"))                             return STATS.communication;
  if (id.includes("review")  || id.includes("reput"))    return STATS.reviews;
  if (id.includes("reengage") || id.includes("reengag") || id.includes("engage")) return STATS.reengagement;
  if (id.includes("referral") || id.includes("refer"))   return STATS.referrals;
  if (id.includes("visib") || id.includes("report") || id.includes("analyt")) return STATS.business_visibility;
  return null;
}

// ─── Recommended platforms (static right column) ──────────────────────────────

const RECOMMENDED_PLATFORMS = [
  {
    name: "GoHighLevel (GHL)",
    description:
      "Your automation backbone. Connects lead intake, follow-up, review requests, referral campaigns into one system.",
    actionText: "Core to your entire implementation",
  },
  {
    name: "ElevenLabs Voice Agent",
    description:
      "AI receptionist answering every inbound call 24/7. Books appointments, qualifies leads, routes urgent jobs.",
    actionText: "Highest-impact addition for lead capture",
  },
  {
    name: "SMS / 2-Way Texting",
    description:
      "98% of texts read within 3 minutes. Built into GHL — minimal setup required.",
    actionText: "Built into GHL — minimal setup required",
  },
  {
    name: "Reporting Dashboard",
    description:
      "Tracks lead response time, review velocity, no-show rate, referral volume.",
    actionText: "Built during implementation — no extra tools needed",
  },
];

// ─── Platform helpers ─────────────────────────────────────────────────────────

interface PlatformEntry {
  name: string;
  badge: "Deploy" | "Configure" | "Automate";
  description: string;
  actionText: string;
}

const BADGE_CONFIG: Record<PlatformEntry["badge"], { bg: string; text: string }> = {
  Deploy:    { bg: C.accentLight, text: C.accent },
  Configure: { bg: C.warnLight,   text: C.warn   },
  Automate:  { bg: C.greenLight,  text: C.green  },
};

// Badge priority for Jobber consolidation (higher = worse)
const BADGE_PRIORITY: Record<PlatformEntry["badge"], number> = {
  Deploy: 3, Configure: 2, Automate: 1,
};

function resolveAreaBadge(area: AreaResult, isGap: boolean): PlatformEntry["badge"] {
  if (isGap) return "Deploy";
  if (area.score >= 70) return "Automate";
  if (area.stackAction === "DEPLOY") return "Deploy";
  return "Configure"; // CONFIGURE, CONNECT, REPLACE, null
}

function findSoftwareAnswer(answers: SurveyAnswers, areaId: string): string {
  // Try exact match first
  if (answers[`${areaId}_software`]) return answers[`${areaId}_software`] as string;

  // Try normalized match — strip non-alphanumeric and compare
  const normalizedId = areaId.toLowerCase().replace(/[^a-z]/g, '');
  for (const key of Object.keys(answers)) {
    if (!key.endsWith('_software')) continue;
    const normalizedKey = key.replace('_software', '').toLowerCase().replace(/[^a-z]/g, '');
    if (normalizedKey.includes(normalizedId) || normalizedId.includes(normalizedKey)) {
      return answers[key] as string;
    }
  }
  return '';
}

function buildLeftColumnCards(
  result: AnalysisResult,
  answers: SurveyAnswers
): PlatformEntry[] {
  // Collect every individual tool mention across all flagged areas, tracking
  // the badge and action text for each occurrence.
  const toolMap = new Map<
    string,
    { badge: PlatformEntry["badge"]; actionText: string }[]
  >();

  for (const area of result.areas) {
    // Only show cards for flagged areas
    if (area.score >= 70) continue;

    const raw = findSoftwareAnswer(answers, area.id);

    // Parse tools: handle array or comma-separated string
    const rawList: string[] = Array.isArray(raw)
      ? raw
      : typeof raw === "string"
      ? raw.split(",").map((s) => s.trim())
      : [];

    // Filter out NONE, SKIPPED, empty strings, and "Other"
    const tools = rawList.filter((p) => {
      const lower = p.toLowerCase();
      return (
        p.length > 0 &&
        !lower.startsWith("none") &&
        !lower.startsWith("skipped") &&
        p !== "Other"
      );
    });

    const badge = resolveAreaBadge(area, false);
    const rawAction =
      badge === "Deploy" ? (area.recommendation ?? area.stackReasoning) : area.stackReasoning;
    const actionText =
      badge === "Deploy"
        ? `Deploy — ${rawAction.split(". ")[0]}`
        : `Configure — ${rawAction.split(". ")[0]}`;

    for (const tool of tools) {
      if (!toolMap.has(tool)) toolMap.set(tool, []);
      toolMap.get(tool)!.push({ badge, actionText });
    }
  }

  // Deduplicate: one card per unique platform name. When a platform appears
  // across multiple areas, use the worst badge and a consolidated description.
  const entries: PlatformEntry[] = [];
  for (const [name, occurrences] of toolMap) {
    const worstBadge = occurrences.reduce<PlatformEntry["badge"]>(
      (w, o) => (BADGE_PRIORITY[o.badge] > BADGE_PRIORITY[w] ? o.badge : w),
      "Automate"
    );

    if (occurrences.length > 1) {
      entries.push({
        name,
        badge: worstBadge,
        description:
          `You're using ${name} across ${occurrences.length} workflow areas — consolidate configuration to get more from it.`,
        actionText:
          worstBadge === "Deploy"
            ? `Deploy ${name} fully across all areas`
            : `Configure automation across all ${name} modules`,
      });
    } else {
      const { actionText } = occurrences[0];
      entries.push({
        name,
        badge: worstBadge,
        description:
          worstBadge === "Deploy"
            ? "Full deployment needed — not yet active"
            : "Platform exists but needs setup or optimization",
        actionText,
      });
    }
  }

  return entries;
}

// ─── Hardcoded area tool chips ────────────────────────────────────────────────

const AREA_CHIPS: Record<string, string> = {
  scheduling:   "Jobber scheduling with GoHighLevel calendar integration",
  proposals:    "Jobber proposal templates with standardized configurations",
  project_mgmt: "Jobber with standardized job templates and task dependencies",
  invoicing:    "Jobber automated payment reminders with milestone-based billing",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrencyFull(n: number): string {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const TODAY = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});


function getScoreInterpretation(score: number): string {
  if (score <= 30) return "This score indicates your business has significant AI readiness gaps across most core workflow areas.";
  if (score <= 60) return "This score indicates your business has some foundational systems in place but critical gaps remain.";
  if (score <= 80) return "This score indicates your business is partially AI-ready with a few key areas to tighten up.";
  return "This score indicates your business is well-positioned to deploy AI across your operations.";
}

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
    backgroundColor: C.accent,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 16,
  },
  leakageBannerLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#f5a098",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  leakageBannerValue: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    lineHeight: 1,
  },
  leakageBannerSub: {
    fontSize: 11,
    color: "#f5a098",
    marginTop: 5,
  },
  scoreInterpretation: {
    fontSize: 10,
    color: C.inkMuted,
    lineHeight: 1.5,
    marginTop: 8,
    maxWidth: 200,
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
    alignItems: "flex-start",
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
    flexWrap: "wrap",
  },
  findingLeakage: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: C.accent,
  },

  // ── Stat callout ──
  statCallout: {
    backgroundColor: "#000000",
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
    borderLeftStyle: "solid",
    borderRadius: 4,
    padding: 14,
    marginBottom: 14,
  },
  statCalloutLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.accent,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  statCalloutText: {
    fontSize: 13,
    color: "#ffffff",
    lineHeight: 1.5,
    marginBottom: 3,
  },
  statCalloutSource: {
    fontSize: 10,
    color: "#999999",
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
  closingBulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  closingBulletDot: {
    fontSize: 13,
    color: C.accent,
    marginRight: 10,
    lineHeight: 1.5,
  },
  closingBulletText: {
    fontSize: 13,
    color: "#8e8e8e",
    lineHeight: 1.5,
    flex: 1,
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

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(score: number): string {
  const cx = 50, cy = 50, r = 38;
  const startAngle = -90;
  const endAngle = -90 + (score / 100) * 360;
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = score > 50 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function ScoreRing({ score }: { score: number }) {
  const arcColor = score >= 70 ? "#2a6b3c" : score >= 40 ? "#e07b20" : "#c8402e";

  return (
    <View style={{ width: 110, height: 110, position: "relative" }}>
      <Svg width="110" height="110" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="38" fill="none" stroke="#333333" strokeWidth="6" />
        <Path d={describeArc(score)} stroke={arcColor} strokeWidth="6" fill="none" />
      </Svg>
      {/* Score number — absolute, centered on top of the SVG */}
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

function PageFooter({ businessName }: { businessName: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>RevRep — {businessName}</Text>
      <Text
        style={s.footerText}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
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

      {/* Bottom — score ring + interpretation + full-width leakage banner */}
      <View>
        {/* Score ring + plain-language interpretation */}
        <View>
          <Text style={s.scoreLabel}>Workflow Health Score</Text>
          <ScoreRing score={result.overallScore} />
          <Text style={s.scoreInterpretation}>
            {getScoreInterpretation(result.overallScore)}
          </Text>
        </View>

        {/* Full-width leakage banner */}
        {result.totalMonthlyLeakage > 0 && (
          <View style={s.leakageBanner}>
            <Text style={s.leakageBannerLabel}>
              Estimated Monthly Revenue Leakage
            </Text>
            <Text style={s.leakageBannerValue}>
              {`${formatCurrencyFull(result.totalMonthlyLeakage)} per month`}
            </Text>
            <Text style={s.leakageBannerSub}>
              {`· ${formatCurrencyFull(result.totalAnnualLeakage)} per year`}
            </Text>
          </View>
        )}
      </View>
    </Page>
  );
}

// ─── Page 2: Findings ─────────────────────────────────────────────────────────

function FindingCard({ area, displayLeakage, verticalId }: { area: AreaResult; displayLeakage: number; verticalId?: string }) {
  const action    = area.stackAction;
  const actionCfg = action ? STACK_ACTION_CONFIG[action] : null;
  const isBizVis  = area.name.toLowerCase().startsWith("business visibility");

  // For universal surveys (no verticalId), fall back to the curated static
  // table which includes source citations.  For vertical surveys the locked
  // industryBenchmarkStat strings are already in area.stat and carry no
  // separate source line, so staticStat is intentionally null.
  const staticStat = verticalId ? null : getStatForArea(area.id);
  const statText   = area.stat || staticStat?.stat || null;
  const statSource = staticStat?.source ?? null;

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
        {(isBizVis ? displayLeakage > 0 : area.monthlyLeakage > 0) && (
          <Text style={s.findingLeakage}>
            {formatCurrency(displayLeakage)}/mo
          </Text>
        )}
      </View>

      {/* Body */}
      <View style={s.findingCardBody}>
        {/* 1. Industry stat callout */}
        {statText && area.score < 70 && (() => {
          // Detect inline citations at the end of vertical stat strings.
          // Pattern: body text followed by " — Source Name" at the end.
          const citationMatch = !statSource ? statText.match(/^([\s\S]+)\s— ([^—]+)$/) : null;
          const body = citationMatch ? citationMatch[1] : statText;
          const inlineCitation = citationMatch ? citationMatch[2] : null;
          return (
            <View style={s.statCallout}>
              <Text style={s.statCalloutLabel}>Industry Data</Text>
              <Text style={s.statCalloutText}>{body}</Text>
              {statSource && (
                <Text style={s.statCalloutSource}>— {statSource}</Text>
              )}
              {inlineCitation && (
                <Text style={s.statCalloutSource}>— {inlineCitation}</Text>
              )}
            </View>
          );
        })()}

        {/* 2. Your result */}
        <View>
          <Text style={s.yourResultLabel}>Your Result</Text>
          <Text style={s.findingBodyMuted}>{area.scoreReasoning}</Text>
        </View>

        {/* 3. Leakage explanation */}
        {(isBizVis ? displayLeakage > 0 : area.monthlyLeakage > 0) && (area.leakageExplanation || isBizVis) && (
          <View style={s.mt12}>
            <Text style={s.yourResultLabel}>How We Calculated This</Text>
            <Text style={s.findingBodyMuted}>{`${
              isBizVis
                ? `Every other gap in this report costs you money. Without a reporting system, those problems go undetected longer — which means each one costs more than our conservative estimates suggest. We apply a compounding factor to reflect that reality. On top of that, flying blind on metrics like lead sources, conversion rates, and project profitability has its own direct cost in slow decisions and missed opportunities.${area.monthlyLeakage > 0 ? ` Combined, that\u2019s ${formatCurrency(area.monthlyLeakage)} per month before applying your revenue cap.` : ""}`
                : area.leakageExplanation
            } Adjusted to ${formatCurrency(displayLeakage)}/mo after applying your revenue cap.`}</Text>
          </View>
        )}

        {/* 4. What to do */}
        <View style={s.mt12}>
          <Text style={s.whatToDoLabel}>What To Do</Text>
          <Text style={s.findingBodyDark}>{area.recommendation}</Text>
        </View>

        {/* 5. Tool chips */}
        {(AREA_CHIPS[area.id] ?? area.replacementTool) && (
          <View style={s.toolChipsRow}>
            <View style={s.toolChip}>
              <Text style={s.toolChipText}>
                {AREA_CHIPS[area.id] ?? area.replacementTool}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function FindingsPage({ result, scaleFactor, verticalId }: { result: AnalysisResult; scaleFactor: number; verticalId?: string }) {
  const flaggedAreas = result.areas.filter((a) => a.score < 70);
  const rawScaled = flaggedAreas.map((a) => Math.round(a.monthlyLeakage * scaleFactor));
  const scaledSum = rawScaled.reduce((s, v) => s + v, 0);
  const remainder = Math.round(result.totalMonthlyLeakage) - scaledSum;

  // Prefer allocating the rounding remainder to Business Visibility when its
  // rawScaled is 0 (AI returned monthlyLeakage=0 for that area) so its card
  // still shows a dollar amount derived from the cover-page total.
  const bizVisIdx = flaggedAreas.findIndex((a) =>
    a.name.toLowerCase().startsWith("business visibility")
  );
  const fallbackIdx =
    bizVisIdx !== -1 && rawScaled[bizVisIdx] === 0
      ? bizVisIdx
      : rawScaled.indexOf(Math.max(...rawScaled));
  const displayValues = rawScaled.map((v, i) => i === fallbackIdx ? v + remainder : v);

  // Cap Business Visibility to the highest single-area value among all other
  // cards. BizVis is a multiplier on the rest of the report — letting it dwarf
  // every other card makes the report read as though visibility is the only
  // problem. If the cap reduces BizVis, redistribute the excess to the largest
  // other card so the card sum still equals result.totalMonthlyLeakage.
  if (bizVisIdx !== -1 && displayValues.length > 1) {
    const otherMax = Math.max(...displayValues.filter((_, i) => i !== bizVisIdx));
    if (displayValues[bizVisIdx] > otherMax) {
      const excess = displayValues[bizVisIdx] - otherMax;
      displayValues[bizVisIdx] = otherMax;
      const largestOtherIdx = displayValues.reduce(
        (best, v, i) => (i !== bizVisIdx && v >= (displayValues[best] ?? 0) ? i : best),
        displayValues.findIndex((_, i) => i !== bizVisIdx)
      );
      if (largestOtherIdx !== -1) displayValues[largestOtherIdx] += excess;
    }
  }

  // Fallback: if the AI returned monthlyLeakage=0 for the BizVis area and the
  // remainder rounded to 0, displayValues[bizVisIdx] is still 0. This causes
  // the "How We Calculated This" section to be suppressed. Steal 10% from the
  // largest other card so the BizVis card always shows a non-zero amount.
  if (bizVisIdx !== -1 && displayValues[bizVisIdx] <= 0 && displayValues.length > 1) {
    const largestOtherIdx = displayValues.reduce(
      (best, v, i) => (i !== bizVisIdx && v > displayValues[best] ? i : best),
      displayValues.findIndex((_, i) => i !== bizVisIdx)
    );
    if (largestOtherIdx !== -1 && displayValues[largestOtherIdx] > 0) {
      const steal = Math.max(1, Math.round(displayValues[largestOtherIdx] * 0.10));
      displayValues[bizVisIdx] = steal;
      displayValues[largestOtherIdx] -= steal;
    }
  }

  return (
    <Page size="A4" style={s.paperPage}>
      <View style={s.sectionRow}>
        <Text style={s.sectionTitle}>Your Findings</Text>
        <View style={s.sectionRule} />
      </View>

      <View style={{ marginBottom: 20, padding: 14, backgroundColor: '#f7f4ef', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#1a1a1a', borderLeftStyle: 'solid' }}>
        <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1a1a1a', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>How We Calculate Leakage</Text>
        <Text style={{ fontSize: 11, color: '#4a4a4a', lineHeight: 1.6 }}>Every number in this report is based on your answers — your revenue, lead volume, close rate, and average job value. We apply industry-researched benchmarks to each workflow area, then cap the total at 40% of your monthly revenue to keep estimates conservative. Each card shows what fixing that area is conservatively worth to your business.</Text>
      </View>

      {flaggedAreas.map((area, index) => (
        <FindingCard key={area.id} area={area} displayLeakage={displayValues[index]} verticalId={verticalId} />
      ))}

      <PageFooter businessName={result.businessName} />
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
        const badgeCfg = BADGE_CONFIG[card.badge];
        return (
          <View key={i} style={s.platformCard} wrap={false}>
            <View style={s.platformCardRow}>
              <Text style={s.platformCardName}>{card.name}</Text>
              <View style={[s.statusBadge, { backgroundColor: badgeCfg.bg }]}>
                <Text style={[s.statusBadgeText, { color: badgeCfg.text }]}>
                  {card.badge}
                </Text>
              </View>
            </View>
            <Text style={s.platformCardDesc}>{card.description}</Text>
            <Text style={[s.platformCardAction, { color: badgeCfg.text }]}>
              {card.actionText}
            </Text>
          </View>
        );
      })}

      {/* Section 2 — recommended additions */}
      <View wrap={false}>
        <Text style={[s.colHeader, { marginTop: 20, marginBottom: 10 }]}>
          Platforms We Recommend Adding
        </Text>
        {RECOMMENDED_PLATFORMS.map((rec, i) => (
          <View key={i} style={s.platformCard}>
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
      </View>

      <PageFooter businessName={result.businessName} />
    </Page>
  );
}

// ─── Page 4: Closing CTA ──────────────────────────────────────────────────────

function ClosingPage({ result }: { result: AnalysisResult }) {
  const topPriorityArea =
    result.topThreePriorities?.[0]?.areaName ??
    result.areas.find((a) => a.priority === 1)?.name ??
    "your highest-impact workflow";

  const bullets = [
    "Fully deployed in 2 hours — not weeks",
    "Flat monthly fee — no long-term contract",
    "Managed by RevRep — you just approve the work",
  ];

  return (
    <Page size="A4" style={s.coverPage}>
      {/* Eyebrow */}
      <View>
        <Text style={s.coverEyebrow}>RevRep — Confidential</Text>
      </View>

      {/* Main content */}
      <View>
        <Text style={s.closingHeading}>
          Meet your first{"\n"}digital employee
        </Text>
        <Text style={s.closingSubtext}>
          {`Based on your audit, the first system we'd bring in handles ${topPriorityArea}. This isn't software you manage — it's an AI employee that runs the workflow for you, reports to you weekly, and costs less than minimum wage.`}
        </Text>

        {/* Bullet points */}
        <View style={{ marginBottom: 32 }}>
          {bullets.map((bullet) => (
            <View key={bullet} style={s.closingBulletRow}>
              <Text style={s.closingBulletDot}>-</Text>
              <Text style={s.closingBulletText}>{bullet}</Text>
            </View>
          ))}
        </View>

        <View style={s.ctaButton}>
          <Text style={s.ctaText}>Meet Your New Hire</Text>
        </View>
        <Text style={s.ctaUrl}>https://workflow-audit-app.vercel.app</Text>
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

  const cardTotal = result.areas
    .filter((a: AreaResult) => a.score < 70)
    .reduce((sum: number, a: AreaResult) => sum + (a.monthlyLeakage ?? 0), 0);
  const scaleFactor = cardTotal > 0 ? result.totalMonthlyLeakage / cardTotal : 1;

  return (
    <Document
      title={`RevRep Audit — ${companyName}`}
      author="RevRep"
      subject="AI Readiness Audit Report"
    >
      <CoverPage result={result} businessName={companyName} />
      <FindingsPage result={result} scaleFactor={scaleFactor} verticalId={typeof answers.verticalId === "string" ? answers.verticalId : undefined} />
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
): Promise<ReadableStream> {
  const { renderToStream } = await import("@react-pdf/renderer");
  const nodeStream = await renderToStream(
    <AuditReportDocument result={result} answers={answers} />
  );
  // Wrap the Node.js stream in a Web ReadableStream without relying on
  // Readable.toWeb(), which requires the exact stream.Readable type that
  // @react-pdf/renderer's NodeJS.ReadableStream does not satisfy.
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err: Error) => controller.error(err));
    },
  });
}
