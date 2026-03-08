export type QuestionType = "text" | "single" | "multi" | "scale";

// ─── Skip Rules ───────────────────────────────────────────────────────────────
// When a question's answer matches a skip trigger, all remaining questions in
// that workflow area are skipped and recorded as "SKIPPED: No system in place".
//
// mode "any"  — skip if the answer includes any of the trigger strings
// mode "only" — skip if the ONLY selected values are from the trigger list
//               (used for multi-select software questions where picking
//               "Nothing / Manual" alongside real tools should not trigger a skip)
// mode "unless" — skip if the answer does NOT match any of the trigger strings

export type SkipMode = "any" | "only" | "unless";

export interface SkipRule {
  triggers: string[];
  mode: SkipMode;
  /** When provided, skip exactly these question IDs instead of all remaining
   *  questions in the area. Used for conditional follow-up questions. */
  targetIds?: string[];
}

export const SKIP_RULES: Record<string, SkipRule> = {
  // Lead Capture (software) — no software → skip workflow questions
  lead_capture_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Lead Capture — show follow-up Q2b ONLY when owner doesn't know what % are followed up;
  // skip it silently for all other answers
  lead_capture_q2: {
    triggers: ["Honestly, we're not sure — it's hard to track"],
    mode: "unless",
    targetIds: ["lead_capture_q2b"],
  },

  // Lead Follow Up (software) — no software → skip workflow questions
  lead_followup_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Lead Follow Up — deals go cold very often AND owner admits they lose business
  lead_followup_q2: {
    triggers: ["Very often — we lose business because of it"],
    mode: "any",
  },

  // Appointment Scheduling (software) — no software → skip workflow questions
  scheduling_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Proposals & Quoting (software) — no software / don't send proposals → skip section
  proposals_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Customer Onboarding (software) — no software → skip workflow questions
  onboarding_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Job & Project Management (software) — no software → skip workflow questions
  project_mgmt_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Invoicing & Payments (software) — no software → skip workflow questions
  invoicing_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Customer Communication (software) — no software → skip workflow questions
  communication_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Customer Communication — no centralized system exists
  communication_q2: {
    triggers: ["Most of it — we have no real centralized system"],
    mode: "any",
  },

  // Reviews & Reputation (software) — no software → skip workflow questions
  reviews_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Re-engagement (software) — no software → skip workflow questions
  reengagement_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },

  // Referral Management (software) — only word-of-mouth / no software selected
  referrals_software: {
    triggers: ["Word of mouth only", "None — We don't use any software for this"],
    mode: "only",
  },

  // Referral Management (Q1) — owner hasn't thought about referrals
  referrals_q1: {
    triggers: ["We don't get referrals / haven't thought about it"],
    mode: "any",
  },

  // Reporting & Analytics (software) — no software → skip workflow questions
  reporting_software: {
    triggers: ["None — We don't use any software for this"],
    mode: "only",
  },
};

export const SKIPPED_VALUE = "SKIPPED: No system in place";

// ─── Shared glossary definitions ─────────────────────────────────────────────

const G: Record<string, string> = {
  CRM: "Customer Relationship Management — software that keeps all your leads, deals, and customer history in one place so nothing falls through the cracks.",
  "automated sequences":
    "Pre-written messages that send automatically at the right time — no one has to remember to follow up manually.",
  "no-shows": "Clients who book an appointment but don't show up and don't cancel in advance.",
  segmentation:
    "Grouping your customers by shared traits — like what they bought or how long ago — so you can send each group a relevant message instead of one generic blast.",
  "key business metrics":
    "The most important numbers that show how your business is performing — things like monthly revenue, close rate, and how many new customers you're getting. Also called KPIs (Key Performance Indicators).",
};

export interface Question {
  id: string;
  areaId: string | null;
  type: QuestionType;
  question: string;
  placeholder?: string;
  options?: string[];
  scaleMin?: string;
  scaleMax?: string;
  /** Maps each option string to its internal numeric midpoint value.
   *  When present, the survey page stores an additional `{id}_value` answer
   *  containing the numeric string so the AI can use it directly. */
  midpoints?: Record<string, number>;
  /** Plain-English definitions for jargon terms in this question.
   *  Rendered as hoverable "?" tooltip chips below the question text. */
  glossary?: Record<string, string>;
}

export interface Area {
  id: string;
  name: string;
}

export const AREAS: Area[] = [
  { id: "lead_capture", name: "Lead Capture" },
  { id: "lead_followup", name: "Lead Follow Up / CRM" },
  { id: "scheduling", name: "Appointment Scheduling" },
  { id: "proposals", name: "Proposals & Quoting" },
  { id: "onboarding", name: "Customer Onboarding" },
  { id: "project_mgmt", name: "Job & Project Management" },
  { id: "invoicing", name: "Invoicing & Payments" },
  { id: "communication", name: "Customer Communication" },
  { id: "reviews", name: "Reviews & Reputation" },
  { id: "reengagement", name: "Re-engagement" },
  { id: "referrals", name: "Referral Management" },
  { id: "reporting", name: "Reporting & Analytics" },
];

export const QUESTIONS: Question[] = [
  // ─── Intro ───────────────────────────────────────────────────────────────────
  {
    id: "intro_name",
    areaId: null,
    type: "text",
    question: "What's your name?",
    placeholder: "Your full name",
  },
  {
    id: "intro_business",
    areaId: null,
    type: "text",
    question: "What does your business do?",
    placeholder: "e.g. We run a boutique marketing agency",
  },
  {
    id: "intro_size",
    areaId: null,
    type: "single",
    question: "How many people are on your team?",
    options: ["5–9", "10–14", "15–19", "20–25"],
  },
  {
    id: "intro_email",
    areaId: null,
    type: "text",
    question: "What email should we send the report to?",
    placeholder: "you@company.com",
  },

  // ─── Financial Baseline ───────────────────────────────────────────────────────
  {
    id: "fin_avg_sale",
    areaId: null,
    type: "single",
    question: "What is the average value of a single sale, job, or transaction for your business?",
    options: [
      "Under $500",
      "$500–$1,500",
      "$1,500–$5,000",
      "$5,000–$15,000",
      "$15,000–$50,000",
      "Over $50,000",
    ],
    midpoints: {
      "Under $500": 300,
      "$500–$1,500": 1000,
      "$1,500–$5,000": 3000,
      "$5,000–$15,000": 10000,
      "$15,000–$50,000": 30000,
      "Over $50,000": 60000,
    },
  },
  {
    id: "fin_monthly_leads",
    areaId: null,
    type: "single",
    question: "Roughly how many new leads, inquiries, or potential customers contact your business each month?",
    options: [
      "Fewer than 10",
      "10–30",
      "30–75",
      "75–150",
      "150–300",
      "More than 300",
    ],
    midpoints: {
      "Fewer than 10": 6,
      "10–30": 20,
      "30–75": 50,
      "75–150": 110,
      "150–300": 220,
      "More than 300": 400,
    },
  },
  {
    id: "fin_close_rate",
    areaId: null,
    type: "single",
    question: "Out of every 10 leads or inquiries you receive, roughly how many become paying customers?",
    options: [
      "1–2 out of 10 (10–20%)",
      "3–4 out of 10 (30–40%)",
      "5–6 out of 10 (50–60%)",
      "7–8 out of 10 (70–80%)",
      "9–10 out of 10 (90%+)",
      "I honestly don't know",
    ],
    midpoints: {
      "1–2 out of 10 (10–20%)": 0.15,
      "3–4 out of 10 (30–40%)": 0.35,
      "5–6 out of 10 (50–60%)": 0.55,
      "7–8 out of 10 (70–80%)": 0.75,
      "9–10 out of 10 (90%+)": 0.95,
      "I honestly don't know": 0.35,
    },
  },
  {
    id: "fin_monthly_revenue",
    areaId: null,
    type: "single",
    question: "What is your business's approximate monthly revenue?",
    options: [
      "Under $25,000/month",
      "$25,000–$75,000/month",
      "$75,000–$150,000/month",
      "$150,000–$400,000/month",
      "$400,000–$1M/month",
      "Over $1M/month",
    ],
    midpoints: {
      "Under $25,000/month": 15000,
      "$25,000–$75,000/month": 50000,
      "$75,000–$150,000/month": 110000,
      "$150,000–$400,000/month": 275000,
      "$400,000–$1M/month": 700000,
      "Over $1M/month": 1500000,
    },
  },

  // ─── 1. Lead Capture ─────────────────────────────────────────────────────────
  {
    id: "lead_capture_software",
    areaId: "lead_capture",
    type: "multi",
    question: "Which software do you use for Lead Capture?",
    options: [
      "GoHighLevel",
      "HubSpot",
      "Typeform",
      "Jotform",
      "Gravity Forms",
      "Facebook Lead Ads",
      "Google Ads",
      "Calendly",
      "Intercom",
      "Drift",
      "Unbounce",
      "ClickFunnels",
      "WordPress forms",
      "LinkedIn Lead Gen",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "lead_capture_q1",
    areaId: "lead_capture",
    type: "single",
    question: "How quickly does a new lead typically get contacted after they submit a form or inquiry?",
    options: [
      "It varies — sometimes days later",
      "Same day, but manually",
      "Within a few hours",
      "Within minutes — it's automated",
      "I honestly don't know",
    ],
  },
  {
    id: "lead_capture_q2",
    areaId: "lead_capture",
    type: "single",
    question: "What percentage of your inbound leads do you believe are actually followed up on?",
    options: [
      "Honestly, we're not sure — it's hard to track",
      "About half",
      "Around 75–90%",
      "Close to 100% — we don't miss leads",
    ],
  },
  {
    id: "lead_capture_q2b",
    areaId: "lead_capture",
    type: "multi",
    question: "What makes it hard to track where your leads come from?",
    options: [
      "Too many different sources",
      "No one owns it",
      "We don't have a CRM or system",
      "We're too busy to track it",
      "We never set it up properly",
    ],
    glossary: { CRM: G.CRM },
  },
  {
    id: "lead_capture_q3",
    areaId: "lead_capture",
    type: "single",
    question: "Do you know which marketing channels or sources are generating your best leads?",
    options: [
      "No — all leads go into the same bucket",
      "Not really — we don't track lead source well",
      "Somewhat — we know roughly where leads come from",
      "Yes — we track source and quality clearly",
      "I honestly don't know",
    ],
  },

  // ─── 2. Lead Follow Up / CRM ─────────────────────────────────────────────────
  {
    id: "lead_followup_software",
    areaId: "lead_followup",
    type: "multi",
    question: "Which software do you use for Lead Follow Up & CRM?",
    options: [
      "GoHighLevel",
      "HubSpot",
      "Salesforce",
      "Zoho CRM",
      "Pipedrive",
      "ActiveCampaign",
      "Keap (Infusionsoft)",
      "Freshsales",
      "Monday CRM",
      "Copper",
      "Capsule",
      "Close CRM",
      "Zendesk Sell",
      "Microsoft Dynamics",
      "Spreadsheets",
      "None — We don't use any software for this",
      "Other",
    ],
    glossary: { CRM: G.CRM },
  },
  {
    id: "lead_followup_q1",
    areaId: "lead_followup",
    type: "single",
    question: "How much of your follow-up process is automated versus done manually?",
    options: [
      "Completely manual — nothing is automated",
      "Mostly manual — someone has to remember to do it",
      "About half and half",
      "Mostly automated — sequences run without us",
      "I honestly don't know",
    ],
    glossary: { "automated sequences": G["automated sequences"] },
  },
  {
    id: "lead_followup_q2",
    areaId: "lead_followup",
    type: "single",
    question: "How often do deals go cold because of a missed or delayed follow-up?",
    options: [
      "Very often — we lose business because of it",
      "Regularly — it's a known problem",
      "Occasionally — a few times a month",
      "Rarely — our follow-up is tight",
      "I honestly don't know",
    ],
  },
  {
    id: "lead_followup_q3",
    areaId: "lead_followup",
    type: "scale",
    question: "How organized and up-to-date is your CRM or lead tracking system right now?",
    scaleMin: "A mess — outdated and incomplete",
    scaleMax: "Pristine — always accurate",
    glossary: { CRM: G.CRM },
  },

  // ─── 3. Appointment Scheduling ───────────────────────────────────────────────
  {
    id: "scheduling_software",
    areaId: "scheduling",
    type: "multi",
    question: "Which software do you use for Appointment Scheduling?",
    options: [
      "GoHighLevel",
      "Calendly",
      "Acuity Scheduling",
      "Google Calendar",
      "Microsoft Outlook Calendar",
      "HubSpot Meetings",
      "Square Appointments",
      "Setmore",
      "SimplyBook",
      "10to8",
      "Booksy",
      "ServiceTitan",
      "Jobber",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "scheduling_q1",
    areaId: "scheduling",
    type: "single",
    question: "How many back-and-forth messages does it typically take to book an appointment?",
    options: [
      "Many — it's a whole process",
      "Three to five — some back and forth",
      "One or two — quick and easy",
      "Zero — clients book themselves online",
      "I honestly don't know",
    ],
  },
  {
    id: "scheduling_q2",
    areaId: "scheduling",
    type: "single",
    question: "How often do no-shows or last-minute cancellations disrupt your schedule?",
    options: [
      "Very often — it costs us significant time and revenue",
      "Regularly — it's a real problem",
      "Occasionally — a few times a month",
      "Rarely — we have reminders and deposits in place",
      "I honestly don't know",
    ],
    glossary: { "no-shows": G["no-shows"] },
  },
  {
    id: "scheduling_q3",
    areaId: "scheduling",
    type: "scale",
    question: "How smooth and professional is the booking experience for your clients?",
    scaleMin: "Clunky and confusing",
    scaleMax: "Seamless and impressive",
  },

  // ─── 4. Proposals & Quoting ──────────────────────────────────────────────────
  {
    id: "proposals_software",
    areaId: "proposals",
    type: "multi",
    question: "Which software do you use for Proposals & Quoting?",
    options: [
      "GoHighLevel",
      "PandaDoc",
      "DocuSign",
      "HoneyBook",
      "Proposify",
      "Better Proposals",
      "Jobber",
      "ServiceTitan",
      "QuickBooks",
      "FreshBooks",
      "Bidsketch",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "proposals_q1",
    areaId: "proposals",
    type: "single",
    question: "How long does it typically take to get a proposal out after an initial conversation?",
    options: [
      "More than a week",
      "3–5 days",
      "1–2 days",
      "Same day — we can turn them around fast",
      "I honestly don't know",
    ],
  },
  {
    id: "proposals_q2",
    areaId: "proposals",
    type: "single",
    question: "How much time does your team spend manually creating or customizing each proposal?",
    options: [
      "Half a day or more — it's very time-consuming",
      "A few hours per proposal",
      "About 30–60 minutes per proposal",
      "Very little — we have templates that do the heavy lifting",
      "I honestly don't know",
    ],
  },
  {
    id: "proposals_q3",
    areaId: "proposals",
    type: "scale",
    question: "How professional and consistent are your proposals compared to competitors?",
    scaleMin: "Basic and inconsistent",
    scaleMax: "Polished and on-brand every time",
  },

  // ─── 5. Customer Onboarding ──────────────────────────────────────────────────
  {
    id: "onboarding_software",
    areaId: "onboarding",
    type: "multi",
    question: "Which software do you use for Customer Onboarding?",
    options: [
      "GoHighLevel",
      "HubSpot",
      "Monday.com",
      "Asana",
      "Notion",
      "Google Forms",
      "Trello",
      "ClickUp",
      "Dubsado",
      "HoneyBook",
      "Paperbell",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "onboarding_q1",
    areaId: "onboarding",
    type: "single",
    question: "How consistent is your onboarding experience — does every new client get the same quality process?",
    options: [
      "Every onboarding is different / fully ad hoc",
      "Quite inconsistent — it depends on who handles it",
      "Mostly consistent with some variation",
      "Very consistent — we follow the same process every time",
      "I honestly don't know",
    ],
  },
  {
    id: "onboarding_q2",
    areaId: "onboarding",
    type: "single",
    question: "How much senior team time is required to onboard each new client?",
    options: [
      "Multiple days of senior team involvement",
      "Half a day to a full day",
      "A few hours",
      "Very little — the process is largely self-serve",
      "I honestly don't know",
    ],
  },
  {
    id: "onboarding_q3",
    areaId: "onboarding",
    type: "scale",
    question: "How clearly do new clients know exactly what to expect and what happens next after signing?",
    scaleMin: "They're often confused",
    scaleMax: "Completely clear from day one",
  },

  // ─── 6. Job & Project Management ─────────────────────────────────────────────
  {
    id: "project_mgmt_software",
    areaId: "project_mgmt",
    type: "multi",
    question: "Which software do you use for Job & Project Management?",
    options: [
      "GoHighLevel",
      "Jobber",
      "ServiceTitan",
      "Asana",
      "Monday.com",
      "Trello",
      "ClickUp",
      "Basecamp",
      "Notion",
      "Wrike",
      "Smartsheet",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "project_mgmt_q1",
    areaId: "project_mgmt",
    type: "single",
    question: "How often do jobs or projects miss deadlines due to unclear ownership or process breakdowns?",
    options: [
      "Very often — missed deadlines are common",
      "Regularly — it's a known issue",
      "Occasionally — a few times a month",
      "Rarely — we hit our deadlines consistently",
      "I honestly don't know",
    ],
  },
  {
    id: "project_mgmt_q2",
    areaId: "project_mgmt",
    type: "single",
    question: "How much time per week does your team spend chasing status updates or sitting in progress meetings that a better system could eliminate?",
    options: [
      "It's one of our biggest time drains",
      "Half a day or more per week",
      "A few hours a week",
      "Very little — our system handles it",
      "I honestly don't know",
    ],
  },
  {
    id: "project_mgmt_q3",
    areaId: "project_mgmt",
    type: "scale",
    question: "How clearly does every team member know what they're responsible for on any given day?",
    scaleMin: "Very unclear — lots of confusion",
    scaleMax: "Crystal clear — everyone knows their role",
  },

  // ─── 7. Invoicing & Payments ─────────────────────────────────────────────────
  {
    id: "invoicing_software",
    areaId: "invoicing",
    type: "multi",
    question: "Which software do you use for Invoicing & Payments?",
    options: [
      "GoHighLevel",
      "QuickBooks",
      "FreshBooks",
      "Wave",
      "Xero",
      "Square",
      "Stripe",
      "PayPal",
      "HoneyBook",
      "Jobber",
      "ServiceTitan",
      "Venmo Business",
      "Zelle Business",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "invoicing_q1",
    areaId: "invoicing",
    type: "single",
    question: "How often do invoices go unpaid past their due date because of a process gap (not just a difficult client)?",
    options: [
      "Very often — cash flow is a constant concern",
      "Regularly — late payments are common",
      "Occasionally — a few per month",
      "Rarely — our invoicing and follow-up is tight",
      "I honestly don't know",
    ],
  },
  {
    id: "invoicing_q2",
    areaId: "invoicing",
    type: "single",
    question: "How much time does your team spend each month chasing late payments or correcting invoicing errors?",
    options: [
      "More than 10 hours",
      "5–10 hours",
      "2–5 hours",
      "Under 2 hours",
      "I honestly don't know",
    ],
  },
  {
    id: "invoicing_q3",
    areaId: "invoicing",
    type: "scale",
    question: "How confident are you in the real-time accuracy of your cash flow and outstanding invoices?",
    scaleMin: "Not confident — it's murky",
    scaleMax: "Very confident — always accurate",
  },

  // ─── 8. Customer Communication ───────────────────────────────────────────────
  {
    id: "communication_software",
    areaId: "communication",
    type: "multi",
    question: "Which software do you use for Customer Communication?",
    options: [
      "GoHighLevel",
      "Gmail",
      "Outlook",
      "Slack",
      "Microsoft Teams",
      "SMS / Text message",
      "Intercom",
      "Zendesk",
      "Freshdesk",
      "HubSpot",
      "Front",
      "Podium",
      "Birdeye",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "communication_q1",
    areaId: "communication",
    type: "single",
    question: "How often do customer messages get missed, delayed, or lost between team members?",
    options: [
      "Very often — messages fall through the cracks constantly",
      "Regularly — it's an ongoing problem",
      "Occasionally — a few times a month",
      "Rarely — we have a solid shared system",
      "I honestly don't know",
    ],
  },
  {
    id: "communication_q2",
    areaId: "communication",
    type: "single",
    question: "How much customer communication happens outside your main tools — e.g., on personal phones, personal email, or WhatsApp?",
    options: [
      "Most of it — we have no real centralized system",
      "A lot — more than half",
      "Some — maybe 20–30% is off-channel",
      "Very little — almost everything goes through official channels",
      "I honestly don't know",
    ],
  },
  {
    id: "communication_q3",
    areaId: "communication",
    type: "scale",
    question: "How professional and consistent is your team's communication with customers?",
    scaleMin: "Inconsistent — very person-dependent",
    scaleMax: "Consistently professional across the board",
  },

  // ─── 9. Reviews & Reputation ─────────────────────────────────────────────────
  {
    id: "reviews_software",
    areaId: "reviews",
    type: "multi",
    question: "Which software do you use for Reviews & Reputation Management?",
    options: [
      "GoHighLevel",
      "Birdeye",
      "Podium",
      "Google Business Profile",
      "Yelp",
      "Trustpilot",
      "ReviewTrackers",
      "NiceJob",
      "Grade.us",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "reviews_q1",
    areaId: "reviews",
    type: "single",
    question: "How often do you proactively ask satisfied customers to leave a review?",
    options: [
      "Rarely or never",
      "Occasionally — when we remember",
      "Often — but not consistently",
      "Always — it's built into our process",
      "I honestly don't know",
    ],
  },
  {
    id: "reviews_q2",
    areaId: "reviews",
    type: "single",
    question: "How quickly does your team respond to negative reviews or public complaints?",
    options: [
      "We rarely or never respond to reviews",
      "Within a week",
      "Within a day or two",
      "Within hours — we monitor reviews closely",
      "I honestly don't know",
    ],
  },
  {
    id: "reviews_q3",
    areaId: "reviews",
    type: "scale",
    question: "How actively managed is your online reputation right now?",
    scaleMin: "Completely unmanaged",
    scaleMax: "Proactively managed — a real asset",
  },

  // ─── 10. Re-engagement ────────────────────────────────────────────────────────
  {
    id: "reengagement_software",
    areaId: "reengagement",
    type: "multi",
    question: "Which software do you use for Re-engagement & Email Marketing?",
    options: [
      "GoHighLevel",
      "Klaviyo",
      "ActiveCampaign",
      "Mailchimp",
      "Constant Contact",
      "HubSpot",
      "Drip",
      "ConvertKit",
      "Brevo (Sendinblue)",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "reengagement_q1",
    areaId: "reengagement",
    type: "single",
    question: "How often do you follow up with past customers who haven't bought or used your service recently?",
    options: [
      "Never — we have no re-engagement process",
      "Rarely — only when we think of it",
      "Occasionally — we do ad hoc campaigns",
      "Regularly — we have automated re-engagement sequences",
      "I honestly don't know",
    ],
  },
  {
    id: "reengagement_q2",
    areaId: "reengagement",
    type: "single",
    question: "When you reach out to past customers, do you tailor the message or send the same thing to everyone?",
    options: [
      "We don't have a defined message — it's different every time",
      "Same message to everyone",
      "Partially — some segmentation but mostly generic",
      "Always tailored — we segment by customer type, history, or behaviour",
      "I honestly don't know",
    ],
    glossary: { segmentation: G.segmentation },
  },
  {
    id: "reengagement_q3",
    areaId: "reengagement",
    type: "scale",
    question: "How effectively are you turning past customers into repeat business?",
    scaleMin: "Not at all — it's left to chance",
    scaleMax: "Very effectively — repeat revenue is strong",
  },

  // ─── 11. Referral Management ──────────────────────────────────────────────────
  {
    id: "referrals_software",
    areaId: "referrals",
    type: "multi",
    question: "Which software do you use for Referral Management?",
    options: [
      "GoHighLevel",
      "ReferralHero",
      "ReferralRock",
      "Friendbuy",
      "Referral Factory",
      "Ambassador",
      "Word of mouth only",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "referrals_q1",
    areaId: "referrals",
    type: "single",
    question: "Do you have a formal referral program, or does referral business happen organically?",
    options: [
      "We don't get referrals / haven't thought about it",
      "Purely organic — we never actively ask",
      "Semi-formal — we ask, but it's not structured",
      "Formal program — with incentives and a clear process",
      "I honestly don't know",
    ],
  },
  {
    id: "referrals_q2",
    areaId: "referrals",
    type: "single",
    question: "Do you have a way to track which new customers came through referrals and who sent them?",
    options: [
      "No — we have no way to trace referral sources",
      "Referrals come in but we often don't know who sent them",
      "Loosely — we ask but don't record it formally",
      "Yes — it's tracked in our CRM or a dedicated system",
      "I honestly don't know",
    ],
    glossary: { CRM: G.CRM },
  },
  {
    id: "referrals_q3",
    areaId: "referrals",
    type: "scale",
    question: "How much of your new business currently comes from referrals?",
    scaleMin: "Almost none",
    scaleMax: "The majority of our new business",
  },

  // ─── 12. Reporting & Analytics ────────────────────────────────────────────────
  {
    id: "reporting_software",
    areaId: "reporting",
    type: "multi",
    question: "Which software do you use for Reporting & Analytics?",
    options: [
      "GoHighLevel",
      "Google Analytics",
      "HubSpot",
      "QuickBooks",
      "Looker Studio",
      "Databox",
      "Klipfolio",
      "Power BI",
      "Spreadsheets only",
      "None — We don't use any software for this",
      "Other",
    ],
  },
  {
    id: "reporting_q1",
    areaId: "reporting",
    type: "single",
    question: "How often do business decisions get delayed because the right data isn't available or isn't trusted?",
    options: [
      "Very often — we mostly operate on gut feel",
      "Regularly — data gaps slow us down often",
      "Occasionally — a few times a month",
      "Rarely — we have good visibility into our numbers",
      "I honestly don't know",
    ],
  },
  {
    id: "reporting_q2",
    areaId: "reporting",
    type: "single",
    question: "How much manual work goes into producing your regular reports — pulling data, formatting, copy-pasting across tools?",
    options: [
      "Reports are almost entirely manual or we don't produce them",
      "Many hours a month — it's a real burden",
      "A few hours a month",
      "Very little — mostly automated",
      "I honestly don't know",
    ],
  },
  {
    id: "reporting_q3",
    areaId: "reporting",
    type: "scale",
    question: "How confident are you that your key business metrics are accurate and up to date at any given moment?",
    scaleMin: "Not confident — we're often working with stale data",
    scaleMax: "Very confident — real-time and reliable",
    glossary: { "key business metrics": G["key business metrics"] },
  },
];
