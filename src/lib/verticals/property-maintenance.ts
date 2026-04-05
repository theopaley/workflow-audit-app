import type { VerticalConfig } from "./types";

// ─── Job value tier ───────────────────────────────────────────────────────────
// Property maintenance services are recurring low-ticket visits.
// All visit values use the LOW_TICKET option set.

const LOW_TICKET_OPTIONS = [
  "Under $75",
  "$75–$100",
  "$100–$150",
  "$150–$200",
  "$200–$275",
  "$275–$350",
  "$350–$450",
  "$450–$575",
  "$575–$700",
  "$700–$900",
  "$900–$1,200",
  "$1,200–$1,600",
  "$1,600–$2,200",
  "$2,200–$3,000",
  "$3,000–$5,000",
  "Over $5,000",
  "I'm not sure",
  "Enter exact amount",
];

const LOW_TICKET_MIDPOINTS: Record<string, number> = {
  "Under $75": 50,
  "$75–$100": 87,
  "$100–$150": 125,
  "$150–$200": 175,
  "$200–$275": 237,
  "$275–$350": 312,
  "$350–$450": 400,
  "$450–$575": 512,
  "$575–$700": 637,
  "$700–$900": 800,
  "$900–$1,200": 1050,
  "$1,200–$1,600": 1400,
  "$1,600–$2,200": 1900,
  "$2,200–$3,000": 2600,
  "$3,000–$5,000": 4000,
  "Over $5,000": 6500,
  "I'm not sure": 300,
  "Enter exact amount": 0,
};

export const propertyMaintenanceConfig: VerticalConfig = {
  verticalId: "property-maintenance",
  displayName: "Property Maintenance Audit",

  // intro_business is replaced by pm_service_type (more specific service type).
  skipQuestions: ["intro_business"],

  // ─── Intro question overrides ─────────────────────────────────────────────
  introQuestions: {
    // Reframe financial baseline questions for recurring service context
    fin_avg_sale: {
      question: "What is the average value of a single service visit?",
      options: LOW_TICKET_OPTIONS,
      midpoints: LOW_TICKET_MIDPOINTS,
    },
    fin_close_rate: {
      question:
        "Out of every 10 prospects you quote, roughly how many sign up for service?",
    },
    fin_monthly_leads: {
      question:
        "Roughly how many new service inquiries or quote requests do you receive each month?",
    },
    fin_monthly_revenue: {
      question: "What is your approximate monthly recurring service revenue?",
    },

    // ── New questions — injected at the intro_business position ──────────────
    pm_service_type: {
      id: "pm_service_type",
      areaId: null,
      type: "single",
      question: "What type of recurring property service do you provide?",
      allowOtherInput: true,
      options: [
        "Lawn Care or Landscaping Maintenance",
        "Pool Cleaning and Maintenance",
        "Pest Control or Mosquito/Tick Treatment",
        "Recurring Cleaning or Janitorial",
        "Irrigation Maintenance",
        "Tree Care or Arborist Services",
        "Other recurring property service",
      ],
    },
    pm_route_size: {
      id: "pm_route_size",
      areaId: null,
      type: "single",
      question:
        "Roughly how many active recurring accounts do you currently service?",
      options: [
        "Fewer than 10",
        "10–20",
        "20–35",
        "35–50",
        "50–75",
        "75–125",
        "125–200",
        "More than 200",
      ],
    },
  },

  // ─── Workflow areas ───────────────────────────────────────────────────────
  workflowAreas: [
    // ── 1. Lead Capture & Response Time ──────────────────────────────────────
    {
      id: "pm_lead_capture",
      name: "Lead Capture & Response Time",
      leakageType: "lead-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "78% of property service customers choose the first company to respond to their inquiry. Route-based businesses are especially vulnerable to slow response — a prospect who doesn't hear back within the hour has usually already booked with a competitor by the time you call.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Jobber",
        "Service Autopilot",
        "FieldRoutes",
        "Real Green",
        "Aspire",
        "YardBook",
        "Google Business Profile",
        "Nextdoor",
        "Angi",
        "Thumbtack",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_lead_capture_q1",
          areaId: "pm_lead_capture",
          type: "single",
          question:
            "When a new prospect reaches out for a quote or service inquiry, how quickly do you typically respond?",
          options: [
            "Often the next day or later — whenever I get a chance",
            "Same day but it takes several hours",
            "Within an hour or two",
            "Within minutes — automation handles it immediately",
          ],
        },
        {
          id: "pm_lead_capture_q2",
          areaId: "pm_lead_capture",
          type: "single",
          question:
            "When a new inquiry comes in while you're on a route, what happens?",
          options: [
            "It waits until I'm back in the office or done for the day",
            "Voicemail — I call back when I can",
            "Someone on my team picks it up",
            "An automated system responds immediately and books a quote or call",
          ],
        },
        {
          id: "pm_lead_capture_q3",
          areaId: "pm_lead_capture",
          type: "single",
          question:
            "Do you know which sources — Google, Nextdoor, referrals, door hangers — are producing your best new accounts?",
          options: [
            "No — leads come in and I don't track where from",
            "Rough idea but nothing formal",
            "I track some sources manually",
            "Yes — every inquiry source is tracked and I know which ones convert",
          ],
        },
        {
          id: "pm_lead_capture_q4",
          areaId: "pm_lead_capture",
          type: "single",
          question:
            "What percentage of new inquiries do you believe actually get followed up on?",
          options: [
            "Honestly not sure — hard to track",
            "About half",
            "Around 75–90%",
            "Close to 100% — nothing falls through",
          ],
        },
      ],
    },

    // ── 2. Service Agreement & Pricing ───────────────────────────────────────
    {
      id: "pm_service_agreement",
      name: "Service Agreement & Pricing",
      leakageType: "lead-based",
      leakageRate: 0.12,
      industryBenchmarkStat:
        "Property maintenance businesses with formal service agreements and automated follow-up sequences convert 40–50% of prospects into recurring accounts. Those without a structured process convert 20–25% of the same prospects — leaving half their potential recurring revenue unsigned.",
      softwareOptions: [
        "Jobber",
        "Service Autopilot",
        "FieldRoutes",
        "Real Green",
        "Aspire",
        "YardBook",
        "GoHighLevel (GHL)",
        "PandaDoc",
        "DocuSign",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_service_agreement_q1",
          areaId: "pm_service_agreement",
          type: "single",
          question: "How do you typically present pricing to a new prospect?",
          options: [
            "Verbally over the phone — no written proposal",
            "A quick text or email with a number",
            "A basic written quote",
            "A formal service agreement with clear terms, pricing, and digital sign-off",
          ],
        },
        {
          id: "pm_service_agreement_q2",
          areaId: "pm_service_agreement",
          type: "single",
          question:
            "How quickly after a prospect inquiry does your service agreement or pricing go out?",
          options: [
            "A few days — whenever I get to it",
            "Same day if I can, but it sometimes slips",
            "Within a few hours",
            "Same day every time — it's a hard rule",
          ],
        },
        {
          id: "pm_service_agreement_q3",
          areaId: "pm_service_agreement",
          type: "single",
          question:
            "When a prospect receives your pricing and doesn't respond, what happens?",
          options: [
            "Nothing — I wait for them to call back",
            "I follow up once if I remember",
            "Loose follow-up, not consistent",
            "A structured follow-up sequence fires automatically",
          ],
        },
        {
          id: "pm_service_agreement_q4",
          areaId: "pm_service_agreement",
          type: "single",
          question:
            "Do your service agreements clearly define the service scope, visit frequency, cancellation terms, and payment schedule?",
          options: [
            "No — it's mostly verbal or a basic price quote",
            "Some details but not comprehensive",
            "Most terms are covered",
            "Yes — fully detailed agreement with digital acceptance",
          ],
        },
      ],
    },

    // ── 3. Route & Schedule Management ───────────────────────────────────────
    {
      id: "pm_route_schedule",
      name: "Route & Schedule Management",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "Route inefficiency costs the average property maintenance business 12–15% of available service hours per month in windshield time. Optimized routing typically adds 2–4 additional stops per technician per day — without adding a single new account.",
      softwareOptions: [
        "Service Autopilot",
        "FieldRoutes",
        "Real Green",
        "Aspire",
        "Jobber",
        "YardBook",
        "Skimmer",
        "GorillaDesk",
        "Google Calendar",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_route_schedule_q1",
          areaId: "pm_route_schedule",
          type: "single",
          question:
            "How efficiently is your weekly route structured — are you maximizing stops per day or spending a lot of time driving between accounts?",
          options: [
            "Lots of drive time — routing is inefficient",
            "Some inefficiency but manageable",
            "Mostly efficient — we try to cluster by area",
            "Tightly optimized — maximum stops per route day",
          ],
        },
        {
          id: "pm_route_schedule_q2",
          areaId: "pm_route_schedule",
          type: "single",
          question:
            "When a client cancels or skips a visit, what happens to that slot?",
          options: [
            "It stays empty — we lose the revenue",
            "We try to fill it informally",
            "We have a short list of clients to call",
            "A system automatically offers the slot or adjusts the route",
          ],
        },
        {
          id: "pm_route_schedule_q3",
          areaId: "pm_route_schedule",
          type: "single",
          question: "How far ahead is your route scheduled?",
          options: [
            "Day to day — rarely more than a day ahead",
            "A few days out",
            "One to two weeks",
            "Two or more weeks — strong forward visibility",
          ],
        },
        {
          id: "pm_route_schedule_q4",
          areaId: "pm_route_schedule",
          type: "single",
          question:
            "Do clients receive automated reminders before their service visit?",
          options: [
            "No — they just expect us to show up",
            "We notify them manually when we remember",
            "Usually — but it's not consistent",
            "Yes — automated day-before notifications go out for every visit",
          ],
        },
        {
          id: "pm_route_schedule_q5",
          areaId: "pm_route_schedule",
          type: "single",
          question:
            "When weather, equipment issues, or staffing problems force a schedule change, how do clients find out?",
          options: [
            "They don't — they just notice we didn't show up",
            "We call when we can but it's chaotic",
            "We try to notify but it's inconsistent",
            "Automated notifications go out immediately when a visit is rescheduled",
          ],
        },
      ],
    },

    // ── 4. Field Team Communication ───────────────────────────────────────────
    {
      id: "pm_field_team",
      name: "Field Team Communication",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "Field service companies using digital job communication tools complete 23% more stops per technician per day and report 37% fewer client complaints and callbacks. Most of that gain comes from eliminating the pre-visit phone calls that break route momentum.",
      softwareOptions: [
        "Service Autopilot",
        "FieldRoutes",
        "Jobber",
        "Real Green",
        "Aspire",
        "Skimmer",
        "GorillaDesk",
        "Connecteam",
        "Slack",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_field_team_q1",
          areaId: "pm_field_team",
          type: "single",
          question:
            "How do your technicians know the details of each stop — client notes, gate codes, pet warnings, special instructions — before they arrive?",
          options: [
            "They don't — they figure it out on site",
            "I tell them verbally or by text",
            "Notes are in a shared document somewhere",
            "All account details are in the field software — pushed to them automatically before each stop",
          ],
        },
        {
          id: "pm_field_team_q2",
          areaId: "pm_field_team",
          type: "single",
          question:
            "When a technician spots a problem at a property — damage, pest activity, irrigation issue — how does that get communicated and acted on?",
          options: [
            "Phone call to me — I handle it",
            "It gets noted but not always acted on",
            "Loose process — depends on the tech",
            "Documented in the job record immediately with photos — triggers a follow-up automatically",
          ],
        },
        {
          id: "pm_field_team_q3",
          areaId: "pm_field_team",
          type: "single",
          question:
            "How much time per day do your technicians spend calling or texting the office for information they should already have?",
          options: [
            "A lot — back-and-forth calls are constant",
            "Several times a day",
            "Occasionally — a few times",
            "Rarely — they have everything they need before they leave",
          ],
        },
        {
          id: "pm_field_team_q4",
          areaId: "pm_field_team",
          type: "single",
          question:
            "Do your technicians have a standard checklist or service protocol for each visit type?",
          options: [
            "No — it's based on experience and assumption",
            "Informal standards but nothing documented",
            "Checklists exist but aren't always used",
            "Yes — every visit type has a protocol pushed to the tech automatically",
          ],
        },
      ],
    },

    // ── 5. Client Onboarding & Service Setup ──────────────────────────────────
    {
      id: "pm_client_onboarding",
      name: "Client Onboarding & Service Setup",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "Recurring service clients who receive a structured onboarding experience in their first 30 days have a 40% lower early cancellation rate. The first 90 days are the highest-risk period for churn in route-based businesses — a strong onboarding process is the single most cost-effective retention tool available.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Jobber",
        "Service Autopilot",
        "FieldRoutes",
        "Skimmer",
        "Google Forms",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_client_onboarding_q1",
          areaId: "pm_client_onboarding",
          type: "single",
          question: "When a new client signs up, what do they receive from you?",
          options: [
            "Nothing formal — they just wait for the first visit",
            "A confirmation call or text",
            "A welcome email with basic details",
            "A complete onboarding sequence — welcome, what to expect, prep instructions, first visit confirmation, and who to contact",
          ],
        },
        {
          id: "pm_client_onboarding_q2",
          areaId: "pm_client_onboarding",
          type: "single",
          question:
            "Do new clients know exactly what to expect — visit frequency, what day, what the tech will do, how to communicate issues?",
          options: [
            "Not really — they learn as we go",
            "I explain the basics when they sign up",
            "I send a summary of the key details",
            "Yes — every new client gets a complete service overview before the first visit",
          ],
        },
        {
          id: "pm_client_onboarding_q3",
          areaId: "pm_client_onboarding",
          type: "single",
          question:
            "Do you collect all the account-specific details you need — gate codes, pet information, preferred visit days, property notes — at sign-up?",
          options: [
            "No — we discover these things on the first visit or when problems arise",
            "I ask some questions but not systematically",
            "I have a rough intake process",
            "Yes — a complete account setup form captures everything before the first visit",
          ],
        },
        {
          id: "pm_client_onboarding_q4",
          areaId: "pm_client_onboarding",
          type: "single",
          question:
            "Is the new client onboarding experience consistent — does every client get the same quality of communication regardless of how busy you are?",
          options: [
            "Completely inconsistent — depends on the week",
            "Variable — busy periods mean gaps",
            "Mostly consistent with some variation",
            "Always consistent — the process is automated and runs regardless of my schedule",
          ],
        },
      ],
    },

    // ── 6. Service Quality & Visit Completion ─────────────────────────────────
    {
      id: "pm_service_quality",
      name: "Service Quality & Visit Completion",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "The average property maintenance client who cancels has had 2–3 unsatisfactory visits before pulling the trigger. Businesses that run automated post-visit satisfaction checks catch and resolve problems before cancellation 60% of the time — converting what would have been a churned account into a retained one.",
      softwareOptions: [
        "Service Autopilot",
        "FieldRoutes",
        "Jobber",
        "Real Green",
        "Skimmer",
        "GorillaDesk",
        "Aspire",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_service_quality_q1",
          areaId: "pm_service_quality",
          type: "single",
          question:
            "After a service visit, do clients receive any confirmation that the work was done?",
          options: [
            "No — they just see the results when they get home",
            "We knock or call if they're home",
            "We leave a door hanger or send a text manually",
            "An automated visit completion notification goes out after every stop",
          ],
        },
        {
          id: "pm_service_quality_q2",
          areaId: "pm_service_quality",
          type: "single",
          question:
            "Do your technicians document each visit — photos, service notes, any issues spotted?",
          options: [
            "Rarely — it's mostly undocumented",
            "Sometimes on problem visits",
            "Usually but not systematically",
            "Yes — every visit is documented with notes and photos in the account record",
          ],
        },
        {
          id: "pm_service_quality_q3",
          areaId: "pm_service_quality",
          type: "single",
          question:
            "Is there a consistent process for identifying and presenting additional services or upgrades at the point of service?",
          options: [
            "No — it depends on the tech",
            "Occasionally if something obvious comes up",
            "Informally — some techs do it, some don't",
            "Yes — every visit includes a structured opportunity to flag and present additional services",
          ],
        },
        {
          id: "pm_service_quality_q4",
          areaId: "pm_service_quality",
          type: "single",
          question:
            "When a client is unhappy with a visit, how do you find out?",
          options: [
            "When they cancel — usually after several bad visits",
            "They call or text to complain",
            "We check in after visits and catch some issues",
            "Automated satisfaction checks go out after every visit — problems are caught and addressed before they become cancellations",
          ],
        },
      ],
    },

    // ── 7. Invoicing & Payment Collection ────────────────────────────────────
    {
      id: "pm_invoicing_payment",
      name: "Invoicing & Payment Collection",
      leakageType: "revenue-based",
      leakageRate: 0.09,
      industryBenchmarkStat:
        "Failed payments are the leading cause of involuntary churn in subscription and recurring service businesses — accounting for 20–40% of all cancellations. Businesses with automated payment retry and client notification sequences recover 70% of failed payments without any manual intervention.",
      softwareOptions: [
        "QuickBooks",
        "Jobber",
        "Service Autopilot",
        "FieldRoutes",
        "Real Green",
        "Stripe",
        "Square",
        "GoCardless",
        "PaySimple",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_invoicing_payment_q1",
          areaId: "pm_invoicing_payment",
          type: "single",
          question: "How do you bill your recurring clients?",
          options: [
            "I invoice after each visit manually",
            "End of month batch — I send all invoices at once",
            "Auto-pay — clients are charged on a set schedule automatically",
            "A mix — some auto-pay, some manual",
          ],
        },
        {
          id: "pm_invoicing_payment_q2",
          areaId: "pm_invoicing_payment",
          type: "single",
          question:
            "What percentage of your recurring revenue is collected automatically without any manual follow-up?",
          options: [
            "Very little — most clients pay when invoiced manually",
            "About a quarter",
            "About half",
            "Most — 75% or more is on auto-pay or automated billing",
          ],
        },
        {
          id: "pm_invoicing_payment_q3",
          areaId: "pm_invoicing_payment",
          type: "single",
          question: "When a recurring payment fails, what happens?",
          options: [
            "Nothing automated — I notice when the account goes past due",
            "I get notified and follow up manually",
            "An automated reminder goes to the client",
            "An automated retry and client notification sequence fires immediately",
          ],
        },
        {
          id: "pm_invoicing_payment_q4",
          areaId: "pm_invoicing_payment",
          type: "single",
          question:
            "How much time per month does your team spend chasing late payments or correcting billing errors?",
          options: [
            "More than 10 hours",
            "5–10 hours",
            "2–5 hours",
            "Under 2 hours — it's mostly automated",
          ],
        },
        {
          id: "pm_invoicing_payment_q5",
          areaId: "pm_invoicing_payment",
          type: "single",
          question:
            "Do clients have an easy way to update their payment method or manage their billing without calling you?",
          options: [
            "No — they have to call or email",
            "I handle it manually when they ask",
            "Basic self-service for some things",
            "Yes — a client portal or automated link handles payment updates without my involvement",
          ],
        },
      ],
    },

    // ── 8. Client Communication & Updates ────────────────────────────────────
    {
      id: "pm_client_communication",
      name: "Client Communication & Updates",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "The number one reason property maintenance clients switch providers is not price and not service quality — it's feeling forgotten. Clients who receive regular communication beyond invoices have a 35% lower annual churn rate than clients who only hear from their provider when something goes wrong.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Jobber",
        "Service Autopilot",
        "Podium",
        "Birdeye",
        "Mailchimp",
        "Text Message",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_client_communication_q1",
          areaId: "pm_client_communication",
          type: "single",
          question:
            "How often do clients hear from you between service visits — not counting invoices?",
          options: [
            "Never — only when there's a problem",
            "Occasionally when I think of it",
            "Seasonally — I send something a few times a year",
            "Regularly — automated touchpoints keep me top of mind on a consistent schedule",
          ],
        },
        {
          id: "pm_client_communication_q2",
          areaId: "pm_client_communication",
          type: "single",
          question:
            "When your team is running late or needs to reschedule, how does the client find out?",
          options: [
            "They don't — they call or just wait",
            "We call when we realize we're behind",
            "Someone notifies them but not always in time",
            "Automated notification goes out immediately when the schedule changes",
          ],
        },
        {
          id: "pm_client_communication_q3",
          areaId: "pm_client_communication",
          type: "single",
          question:
            "Do clients have a clear, easy way to reach you with questions or concerns outside of business hours?",
          options: [
            "No — they call my cell or just wait",
            "I check messages when I can",
            "After-hours messages get a response first thing in the morning",
            "Yes — an AI handles after-hours messages and urgent requests",
          ],
        },
        {
          id: "pm_client_communication_q4",
          areaId: "pm_client_communication",
          type: "single",
          question:
            "Do long-term clients feel valued — or do they feel like just another stop on the route?",
          options: [
            "Probably just another stop — communication is minimal",
            "Some clients feel valued, others don't",
            "Most feel valued — I make an effort",
            "Yes — automated touchpoints make every client feel like a priority",
          ],
        },
      ],
    },

    // ── 9. Reviews & Reputation ───────────────────────────────────────────────
    {
      id: "pm_reviews_reputation",
      name: "Reviews & Reputation",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "For route-based property maintenance businesses, Nextdoor is the single most valuable review and referral platform — more than Google in most markets. 63% of homeowners say they've hired a local service provider based on a Nextdoor recommendation. A business with 20+ Nextdoor recommendations in a neighborhood dominates that neighborhood's market.",
      softwareOptions: [
        "Google Business Profile",
        "Nextdoor",
        "GoHighLevel (GHL)",
        "Birdeye",
        "Podium",
        "NiceJob",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_reviews_reputation_q1",
          areaId: "pm_reviews_reputation",
          type: "single",
          question: "How do you currently ask clients for Google reviews?",
          options: [
            "I don't — I hope satisfied clients leave them on their own",
            "I ask verbally sometimes",
            "I send a text or email occasionally",
            "An automated review request goes out to every client at the right moment — always",
          ],
        },
        {
          id: "pm_reviews_reputation_q2",
          areaId: "pm_reviews_reputation",
          type: "single",
          question:
            "How quickly after a visit or service milestone does a review request go out?",
          options: [
            "It doesn't — or only when I remember",
            "A few days later when I think of it",
            "Within 24–48 hours",
            "Within hours — automatically triggered",
          ],
        },
        {
          id: "pm_reviews_reputation_q3",
          areaId: "pm_reviews_reputation",
          type: "single",
          question:
            "How many new Google reviews have you received in the last 90 days?",
          options: ["0 to 2", "3 to 7", "8 to 15", "16 or more"],
        },
        {
          id: "pm_reviews_reputation_q4",
          areaId: "pm_reviews_reputation",
          type: "single",
          question:
            "Are you actively building your presence on Nextdoor — where your target clients are asking for neighbor recommendations?",
          options: [
            "No — I'm not active on Nextdoor at all",
            "I have a profile but rarely post",
            "I'm somewhat active",
            "Yes — Nextdoor is a primary platform and I actively manage my presence there",
          ],
        },
      ],
    },

    // ── 10. Retention & Churn Prevention ─────────────────────────────────────
    {
      id: "pm_retention_churn",
      name: "Retention & Churn Prevention",
      leakageType: "churn-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "The average route-based service business loses 25–40% of its client base every year — almost entirely through preventable churn. A 5% monthly churn rate sounds small. It means replacing your entire client base every 20 months just to stay flat. A single percentage point reduction in monthly churn adds more annual revenue than doubling your lead volume.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Service Autopilot",
        "FieldRoutes",
        "Jobber",
        "Mailchimp",
        "ActiveCampaign",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_retention_churn_q1",
          areaId: "pm_retention_churn",
          type: "single",
          question:
            "Do you know your monthly cancellation rate — what percentage of active accounts cancel each month?",
          options: [
            "No — I notice when revenue drops",
            "Rough idea but no real number",
            "I track it manually sometimes",
            "Yes — I monitor churn rate and review it regularly",
          ],
        },
        {
          id: "pm_retention_churn_q2",
          areaId: "pm_retention_churn",
          type: "single",
          question:
            "When a client cancels, do you have a process to try to save the relationship before they're gone?",
          options: [
            "No — if they cancel, they're gone",
            "I call to ask why but it's informal",
            "I have a loose save process",
            "Yes — a structured save sequence fires immediately when a cancellation is received",
          ],
        },
        {
          id: "pm_retention_churn_q3",
          areaId: "pm_retention_churn",
          type: "single",
          question:
            "When a client goes quiet — stops responding, skips a payment, complains once — do you have a system to flag them as at-risk before they cancel?",
          options: [
            "No — cancellations come as a surprise",
            "I notice some signals but react too late",
            "I try to catch at-risk clients but it's informal",
            "Yes — at-risk signals trigger an automated check-in sequence before the client cancels",
          ],
        },
        {
          id: "pm_retention_churn_q4",
          areaId: "pm_retention_churn",
          type: "single",
          question:
            "Do you have a win-back process for clients who have already cancelled?",
          options: [
            "No — once they're gone, they're gone",
            "I call occasionally if I think of it",
            "I have a loose win-back approach",
            "Yes — an automated win-back sequence fires after a defined period of inactivity",
          ],
        },
        {
          id: "pm_retention_churn_q5",
          areaId: "pm_retention_churn",
          type: "single",
          question:
            "Do you run seasonal re-activation campaigns for dormant accounts?",
          options: [
            "No — seasonal clients just return when they need us",
            "I try to reach out but it's inconsistent",
            "I send something out at the start of each season",
            "Yes — automated seasonal campaigns go out to every dormant account before peak season",
          ],
        },
      ],
    },

    // ── 11. Referral Management ───────────────────────────────────────────────
    {
      id: "pm_referral_management",
      name: "Referral Management",
      leakageType: "revenue-based",
      leakageRate: 0.11,
      industryBenchmarkStat:
        "Referred clients in route-based businesses have a 37% longer average lifespan than non-referred clients — they stay longer, complain less, and refer others themselves. A systematic referral program in a property maintenance business doesn't just add accounts; it adds better accounts.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Jobber",
        "Service Autopilot",
        "ReferralHero",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_referral_management_q1",
          areaId: "pm_referral_management",
          type: "single",
          question:
            "Do you have a formal process to ask satisfied clients for referrals?",
          options: [
            "Never — word of mouth just happens",
            "I mention it occasionally but nothing formal",
            "A loose referral ask I make sometimes",
            "Yes — every satisfied client gets a structured referral ask, automatically",
          ],
        },
        {
          id: "pm_referral_management_q2",
          areaId: "pm_referral_management",
          type: "single",
          question:
            "Do you actively encourage clients to recommend you on Nextdoor and in neighborhood groups?",
          options: [
            "No — I've never asked for this",
            "Occasionally — when it comes up",
            "I ask some clients who seem engaged",
            "Yes — asking for Nextdoor recommendations is part of my process",
          ],
        },
        {
          id: "pm_referral_management_q3",
          areaId: "pm_referral_management",
          type: "single",
          question:
            "When a client refers someone who signs up, do they know you received the referral and appreciate it?",
          options: [
            "No — it's invisible to them",
            "I try to thank them personally when I remember",
            "I usually thank them",
            "Yes — a systematic thank-you process closes the loop every time",
          ],
        },
        {
          id: "pm_referral_management_q4",
          areaId: "pm_referral_management",
          type: "single",
          question:
            "Do you track which clients are your best referral sources?",
          options: [
            "No — referrals just show up",
            "Rough idea of my top referrers",
            "I track it manually sometimes",
            "Yes — referral sources are tracked and top referrers get special recognition",
          ],
        },
      ],
    },

    // ── 12. Business Visibility & Reporting ───────────────────────────────────
    {
      id: "pm_business_visibility",
      name: "Business Visibility & Reporting",
      leakageType: "multiplier",
      leakageRate: 1.4,
      industryBenchmarkStat:
        "Route-based business owners who track churn rate and route efficiency weekly grow revenue 2.3x faster than those who track only total revenue. The difference is early detection — catching a client retention problem in month one costs a fraction of what it costs in month six when you've lost 15 accounts you didn't notice leaving.",
      softwareOptions: [
        "Service Autopilot",
        "FieldRoutes",
        "Real Green",
        "Jobber",
        "GoHighLevel (GHL)",
        "QuickBooks",
        "Databox",
        "Google Looker Studio",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "pm_business_visibility_q1",
          areaId: "pm_business_visibility",
          type: "single",
          question:
            "Do you know your monthly churn rate — what percentage of active accounts you lose each month?",
          options: [
            "No — I track revenue but not churn",
            "Rough idea but no real number",
            "I calculate it occasionally",
            "Yes — churn rate is a metric I review regularly",
          ],
        },
        {
          id: "pm_business_visibility_q2",
          areaId: "pm_business_visibility",
          type: "single",
          question:
            "Do you know your route efficiency — stops per day per tech, drive time percentage, revenue per route hour?",
          options: [
            "No — I don't track this",
            "Rough sense but no real data",
            "I track some route metrics manually",
            "Yes — route efficiency metrics are tracked and I use them to optimize",
          ],
        },
        {
          id: "pm_business_visibility_q3",
          areaId: "pm_business_visibility",
          type: "single",
          question:
            "Do you review your business numbers — active accounts, churn rate, average account value, route revenue — on a regular schedule?",
          options: [
            "Rarely or never",
            "Monthly — when something feels off",
            "Weekly — I check the basics",
            "Daily or in real time — I have a dashboard I trust",
          ],
        },
        {
          id: "pm_business_visibility_q4",
          areaId: "pm_business_visibility",
          type: "single",
          question:
            "If you lost 10 accounts this week, would you know — or would you feel it in next month's revenue?",
          options: [
            "I'd feel it next month",
            "I'd have a vague sense something was off",
            "I'd notice within a week or two",
            "I'd know immediately — account changes are tracked in real time",
          ],
        },
        {
          id: "pm_business_visibility_q5",
          areaId: "pm_business_visibility",
          type: "single",
          question:
            "Do you have a way to catch problems early — rising churn, dropping route efficiency, slow payments — before they compound?",
          options: [
            "No — problems show up as revenue loss",
            "I notice when they're already bad",
            "I check periodically and catch some things",
            "Yes — I track leading indicators and act before problems compound",
          ],
        },
      ],
    },
  ],

  // ─── Leakage formula lookup (used by the AI analysis layer) ──────────────
  leakageFormula: {
    pm_lead_capture: 0.20,
    pm_service_agreement: 0.12,
    pm_route_schedule: 0.08,
    pm_field_team: 0.05,
    pm_client_onboarding: 0.05,
    pm_service_quality: 0.07,
    pm_invoicing_payment: 0.09,
    pm_client_communication: 0.06,
    pm_reviews_reputation: 0.10,
    pm_retention_churn: 0.20,
    pm_referral_management: 0.11,
    pm_business_visibility: 1.4,
  },

  // ─── AI prompt additions ──────────────────────────────────────────────────
  aiPromptAdditions: `VERTICAL CONTEXT: Property Maintenance — Recurring Route-Based Services

This audit is for a recurring route-based property service business. All analysis, framing, and recommendations must reflect the economics and vocabulary of recurring service businesses.

CORE BUSINESS MODEL CONTEXT:
This is NOT a project-based business. Revenue is recurring. The client relationship continues indefinitely until cancelled. Every lost client is a permanent monthly revenue hole, not a one-time lost job. The core business problem is retention and route efficiency — not lead volume or close rate. Frame every finding through this lens.

TERMINOLOGY — use these consistently:
- "accounts" or "clients" not "customers"
- "visits" or "service calls" not "jobs"
- "service agreements" or "proposals" not "estimates"
- "churn" or "cancellation rate" not "customer loss"
- "route" or "schedule" not "calendar"
- "monthly recurring revenue" or "MRR" not "monthly revenue" where appropriate
- "active accounts" not "customer count"
- "at-risk accounts" not "unhappy customers"

LEAKAGE FRAMING FOR RECURRING BUSINESSES:
- Lost leads are lost customer relationships, not lost single visits. Apply LTV framing.
- Churn is compounding. A 5% monthly churn rate = 46% annual account loss. Always annualize.
- Re-engagement leakage is the highest-priority area for most route-based businesses.
- Route inefficiency is a direct revenue cost — drive time is unbillable time.

PRIORITY ORDERING:
For property maintenance businesses, weight these areas more heavily in Priority Actions:
1. Retention & Churn Prevention — always the top priority if score is below 70
2. Lead Capture & Response Time — second priority (LTV makes each lost lead high cost)
3. Route & Schedule Management — third priority (direct revenue impact)
4. Invoicing & Payment Collection — fourth priority (failed payments = involuntary churn)

STACK RECOMMENDATION RULES:
- GoHighLevel is the automation and communication layer — CRM, follow-up, re-engagement, referrals
- Service Autopilot, FieldRoutes, Real Green, or Jobber is the route management layer — scheduling, dispatch, invoicing, client records
- These are complementary, not competing. Never recommend GHL as a replacement for route management software.
- Nextdoor is a PRIMARY platform recommendation for this vertical — not optional
- When a client has route management software but poor scores: CONFIGURE action — they have the tool, not the setup

CONFIGURE PATTERN — ROUTE MANAGEMENT SOFTWARE:
If a client lists Service Autopilot, FieldRoutes, Real Green, Jobber, or Skimmer AND scores poorly on scheduling, crew communication, invoicing, or client communication — the stack action MUST be CONFIGURE, not REPLACE or DEPLOY. These platforms have full capability for these functions. Poor scores mean configuration gaps, not missing tools.

stackReasoning: "You already have [platform] — this is a configuration issue, not a missing tool. The fix is setting up [specific feature] inside your existing platform."`,
};
