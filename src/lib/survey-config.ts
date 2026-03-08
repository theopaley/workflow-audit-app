export type QuestionType = "text" | "single" | "multi" | "scale";

// ─── Skip Rules ───────────────────────────────────────────────────────────────
// When a question's answer matches a skip trigger, all remaining questions in
// that workflow area are skipped and recorded as "SKIPPED: No system in place".
//
// mode "any"  — skip if the answer includes any of the trigger strings
// mode "only" — skip if the ONLY selected values are from the trigger list
//               (used for multi-select software questions where picking
//               "Nothing / Manual" alongside real tools should not trigger a skip)

export type SkipMode = "any" | "only" | "unless";

export interface SkipRule {
  triggers: string[];
  mode: SkipMode;
  /** When provided, skip exactly these question IDs instead of all remaining
   *  questions in the area. Used for conditional follow-up questions. */
  targetIds?: string[];
}

export const SKIP_RULES: Record<string, SkipRule> = {
  // Lead Capture — show follow-up Q2b ONLY when owner doesn't know what % are followed up;
  // skip it silently for all other answers
  lead_capture_q2: {
    triggers: ["Honestly, we're not sure — it's hard to track"],
    mode: "unless",
    targetIds: ["lead_capture_q2b"],
  },

  // Lead Follow Up — deals go cold very often AND owner admits they lose business
  lead_followup_q2: {
    triggers: ["Very often — we lose business because of it"],
    mode: "any",
  },

  // Customer Communication — no centralized system exists
  communication_q2: {
    triggers: ["Most of it — we have no real centralized system"],
    mode: "any",
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

};

export const SKIPPED_VALUE = "SKIPPED: No system in place";

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
      "Within minutes — it's automated",
      "Within a few hours",
      "Same day, but manually",
      "It varies — sometimes days later",
    ],
  },
  {
    id: "lead_capture_q2",
    areaId: "lead_capture",
    type: "single",
    question: "What percentage of your inbound leads do you believe are actually followed up on?",
    options: [
      "Close to 100% — we don't miss leads",
      "Around 75–90%",
      "About half",
      "Honestly, we're not sure — it's hard to track",
    ],
  },
  {
    id: "lead_capture_q2b",
    areaId: "lead_capture",
    type: "single",
    question: "What makes it hard to track where your leads come from?",
    options: [
      "Too many different sources",
      "No one owns it",
      "We don't have a CRM or system",
      "We're too busy to track it",
      "We never set it up properly",
    ],
  },
  {
    id: "lead_capture_q3",
    areaId: "lead_capture",
    type: "single",
    question: "Do you know which marketing channels or sources are generating your best leads?",
    options: [
      "Yes — we track source and quality clearly",
      "Somewhat — we know roughly where leads come from",
      "Not really — we don't track lead source well",
      "No — all leads go into the same bucket",
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
  },
  {
    id: "lead_followup_q1",
    areaId: "lead_followup",
    type: "single",
    question: "How much of your follow-up process is automated versus done manually?",
    options: [
      "Mostly automated — sequences run without us",
      "About half and half",
      "Mostly manual — someone has to remember to do it",
      "Completely manual — nothing is automated",
    ],
  },
  {
    id: "lead_followup_q2",
    areaId: "lead_followup",
    type: "single",
    question: "How often do deals go cold because of a missed or delayed follow-up?",
    options: [
      "Rarely — our follow-up is tight",
      "Occasionally — a few times a month",
      "Regularly — it's a known problem",
      "Very often — we lose business because of it",
    ],
  },
  {
    id: "lead_followup_q3",
    areaId: "lead_followup",
    type: "scale",
    question: "How organized and up-to-date is your CRM or lead tracking system right now?",
    scaleMin: "A mess — outdated and incomplete",
    scaleMax: "Pristine — always accurate",
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
      "Zero — clients book themselves online",
      "One or two — quick and easy",
      "Three to five — some back and forth",
      "Many — it's a whole process",
    ],
  },
  {
    id: "scheduling_q2",
    areaId: "scheduling",
    type: "single",
    question: "How often do no-shows or last-minute cancellations disrupt your schedule?",
    options: [
      "Rarely — we have reminders and deposits in place",
      "Occasionally — a few times a month",
      "Regularly — it's a real problem",
      "Very often — it costs us significant time and revenue",
    ],
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
      "Same day — we can turn them around fast",
      "1–2 days",
      "3–5 days",
      "More than a week",
    ],
  },
  {
    id: "proposals_q2",
    areaId: "proposals",
    type: "single",
    question: "How much time does your team spend manually creating or customizing each proposal?",
    options: [
      "Very little — we have templates that do the heavy lifting",
      "About 30–60 minutes per proposal",
      "A few hours per proposal",
      "Half a day or more — it's very time-consuming",
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
      "Google Drive",
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
      "Very consistent — we follow the same process every time",
      "Mostly consistent with some variation",
      "Quite inconsistent — it depends on who handles it",
      "Every onboarding is different / fully ad hoc",
    ],
  },
  {
    id: "onboarding_q2",
    areaId: "onboarding",
    type: "single",
    question: "How much senior team time is required to onboard each new client?",
    options: [
      "Very little — the process is largely self-serve",
      "A few hours",
      "Half a day to a full day",
      "Multiple days of senior team involvement",
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
      "Rarely — we hit our deadlines consistently",
      "Occasionally — a few times a month",
      "Regularly — it's a known issue",
      "Very often — missed deadlines are common",
    ],
  },
  {
    id: "project_mgmt_q2",
    areaId: "project_mgmt",
    type: "single",
    question: "How much time per week does your team spend chasing status updates or sitting in progress meetings that a better system could eliminate?",
    options: [
      "Very little — our system handles it",
      "A few hours a week",
      "Half a day or more per week",
      "It's one of our biggest time drains",
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
      "Rarely — our invoicing and follow-up is tight",
      "Occasionally — a few per month",
      "Regularly — late payments are common",
      "Very often — cash flow is a constant concern",
    ],
  },
  {
    id: "invoicing_q2",
    areaId: "invoicing",
    type: "single",
    question: "How much time does your team spend each month chasing late payments or correcting invoicing errors?",
    options: [
      "Under 2 hours",
      "2–5 hours",
      "5–10 hours",
      "More than 10 hours",
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
      "Rarely — we have a solid shared system",
      "Occasionally — a few times a month",
      "Regularly — it's an ongoing problem",
      "Very often — messages fall through the cracks constantly",
    ],
  },
  {
    id: "communication_q2",
    areaId: "communication",
    type: "single",
    question: "How much customer communication happens outside your main tools — e.g., on personal phones, personal email, or WhatsApp?",
    options: [
      "Very little — almost everything goes through official channels",
      "Some — maybe 20–30% is off-channel",
      "A lot — more than half",
      "Most of it — we have no real centralized system",
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
      "Always — it's built into our process",
      "Often — but not consistently",
      "Occasionally — when we remember",
      "Rarely or never",
    ],
  },
  {
    id: "reviews_q2",
    areaId: "reviews",
    type: "single",
    question: "How quickly does your team respond to negative reviews or public complaints?",
    options: [
      "Within hours — we monitor reviews closely",
      "Within a day or two",
      "Within a week",
      "We rarely or never respond to reviews",
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
      "Regularly — we have automated re-engagement sequences",
      "Occasionally — we do ad hoc campaigns",
      "Rarely — only when we think of it",
      "Never — we have no re-engagement process",
    ],
  },
  {
    id: "reengagement_q2",
    areaId: "reengagement",
    type: "single",
    question: "When you reach out to past customers, do you tailor the message or send the same thing to everyone?",
    options: [
      "Always tailored — we segment by customer type, history, or behaviour",
      "Partially — some segmentation but mostly generic",
      "Same message to everyone",
      "We don't have a defined message — it's different every time",
    ],
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
      "Formal program — with incentives and a clear process",
      "Semi-formal — we ask, but it's not structured",
      "Purely organic — we never actively ask",
      "We don't get referrals / haven't thought about it",
    ],
  },
  {
    id: "referrals_q2",
    areaId: "referrals",
    type: "single",
    question: "Do you have a way to track which new customers came through referrals and who sent them?",
    options: [
      "Yes — it's tracked in our CRM or a dedicated system",
      "Loosely — we ask but don't record it formally",
      "No — we have no way to trace referral sources",
      "Referrals come in but we often don't know who sent them",
    ],
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
      "Rarely — we have good visibility into our numbers",
      "Occasionally — a few times a month",
      "Regularly — data gaps slow us down often",
      "Very often — we mostly operate on gut feel",
    ],
  },
  {
    id: "reporting_q2",
    areaId: "reporting",
    type: "single",
    question: "How much manual work goes into producing your regular reports — pulling data, formatting, copy-pasting across tools?",
    options: [
      "Very little — mostly automated",
      "A few hours a month",
      "Many hours a month — it's a real burden",
      "Reports are almost entirely manual or we don't produce them",
    ],
  },
  {
    id: "reporting_q3",
    areaId: "reporting",
    type: "scale",
    question: "How confident are you that your key business metrics are accurate and up to date at any given moment?",
    scaleMin: "Not confident — we're often working with stale data",
    scaleMax: "Very confident — real-time and reliable",
  },
];
