import type { VerticalConfig } from "./types";

// ─── Job value tiers ─────────────────────────────────────────────────────────
// Three option + midpoint sets for fin_avg_sale, selected dynamically based on
// the service type the owner chose in hs_service_type.

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

const MID_TICKET_OPTIONS = [
  "Under $200",
  "$200–$350",
  "$350–$500",
  "$500–$750",
  "$750–$1,000",
  "$1,000–$1,500",
  "$1,500–$2,000",
  "$2,000–$3,000",
  "$3,000–$4,500",
  "$4,500–$6,500",
  "$6,500–$9,000",
  "$9,000–$12,000",
  "$12,000–$16,000",
  "$16,000–$22,000",
  "$22,000–$30,000",
  "Over $30,000",
  "I'm not sure",
  "Enter exact amount",
];
const MID_TICKET_MIDPOINTS: Record<string, number> = {
  "Under $200": 150,
  "$200–$350": 275,
  "$350–$500": 425,
  "$500–$750": 625,
  "$750–$1,000": 875,
  "$1,000–$1,500": 1250,
  "$1,500–$2,000": 1750,
  "$2,000–$3,000": 2500,
  "$3,000–$4,500": 3750,
  "$4,500–$6,500": 5500,
  "$6,500–$9,000": 7750,
  "$9,000–$12,000": 10500,
  "$12,000–$16,000": 14000,
  "$16,000–$22,000": 19000,
  "$22,000–$30,000": 26000,
  "Over $30,000": 40000,
  "I'm not sure": 2000,
  "Enter exact amount": 0,
};

const HIGH_TICKET_OPTIONS = [
  "Under $1,000",
  "$1,000–$2,000",
  "$2,000–$3,500",
  "$3,500–$5,000",
  "$5,000–$7,000",
  "$7,000–$9,500",
  "$9,500–$13,000",
  "$13,000–$17,000",
  "$17,000–$22,000",
  "$22,000–$28,000",
  "$28,000–$35,000",
  "$35,000–$45,000",
  "$45,000–$57,000",
  "$57,000–$70,000",
  "$70,000–$90,000",
  "$90,000–$120,000",
  "Over $120,000",
  "I'm not sure",
  "Enter exact amount",
];
const HIGH_TICKET_MIDPOINTS: Record<string, number> = {
  "Under $1,000": 750,
  "$1,000–$2,000": 1500,
  "$2,000–$3,500": 2750,
  "$3,500–$5,000": 4250,
  "$5,000–$7,000": 6000,
  "$7,000–$9,500": 8250,
  "$9,500–$13,000": 11250,
  "$13,000–$17,000": 15000,
  "$17,000–$22,000": 19500,
  "$22,000–$28,000": 25000,
  "$28,000–$35,000": 31500,
  "$35,000–$45,000": 40000,
  "$45,000–$57,000": 51000,
  "$57,000–$70,000": 63500,
  "$70,000–$90,000": 80000,
  "$90,000–$120,000": 105000,
  "Over $120,000": 150000,
  "I'm not sure": 8000,
  "Enter exact amount": 0,
};

export const homeServicesConfig: VerticalConfig = {
  verticalId: "home-services",
  displayName: "Home Services Audit",

  // ─── Skip base intro questions not relevant to home services ────────────────
  // intro_business is replaced by hs_service_type (more specific).
  // intro_size is replaced by hs_admin_count + hs_field_count (split by role).
  skipQuestions: ["intro_business", "intro_size"],

  // ─── Intro question overrides ────────────────────────────────────────────────
  introQuestions: {
    // Reframe "sale/transaction" as "job" and use service-type-specific ranges.
    fin_avg_sale: {
      question:
        "What is the average value of a single job or service call for your business?",
      dynamicOptionsSource: "hs_service_type",
      dynamicOptions: {
        "HVAC, Plumbing, or Electrical":               MID_TICKET_OPTIONS,
        "Painting, Flooring, or Interior Work":        MID_TICKET_OPTIONS,
        "Roofing, Siding, or Exterior Work":           HIGH_TICKET_OPTIONS,
        "Remodeling or General Contracting":           HIGH_TICKET_OPTIONS,
        "Other specialty or high-value work":          HIGH_TICKET_OPTIONS,
        "Other home services":                         MID_TICKET_OPTIONS,
      },
      dynamicMidpoints: {
        "HVAC, Plumbing, or Electrical":               MID_TICKET_MIDPOINTS,
        "Painting, Flooring, or Interior Work":        MID_TICKET_MIDPOINTS,
        "Roofing, Siding, or Exterior Work":           HIGH_TICKET_MIDPOINTS,
        "Remodeling or General Contracting":           HIGH_TICKET_MIDPOINTS,
        "Other specialty or high-value work":          HIGH_TICKET_MIDPOINTS,
        "Other home services":                         MID_TICKET_MIDPOINTS,
      },
    },
    // Reframe "leads/inquiries" as "estimates" for home services close rate
    fin_close_rate: {
      question:
        "Out of every 10 estimates you send, roughly how many become booked jobs?",
    },
    // ── New questions — inserted at the intro_business position ─────────────
    // The VerticalSurvey shell injects all non-base keys here after
    // (or in place of) intro_business in the question sequence.
    hs_service_type: {
      id: "hs_service_type",
      areaId: null,
      type: "single",
      question: "What type of home service work do you do?",
      options: [
        "HVAC, Plumbing, or Electrical",
        "Painting, Flooring, or Interior Work",
        "Roofing, Siding, or Exterior Work",
        "Remodeling or General Contracting",
        "Other specialty or high-value work",
        "Other home services",
      ],
      allowOtherInput: true,
    },
    hs_admin_count: {
      id: "hs_admin_count",
      areaId: null,
      type: "single",
      question: "How many office or admin staff do you have?",
      options: ["Just me", "1–2", "3–5", "6–10", "More than 10"],
    },
    hs_field_count: {
      id: "hs_field_count",
      areaId: null,
      type: "single",
      question: "How many field technicians or crew members do you have?",
      options: ["Just me", "1–2", "3–5", "6–10", "11–20", "More than 20"],
    },
  },

  // ─── Workflow areas ──────────────────────────────────────────────────────────
  workflowAreas: [
    // ── 1. Lead Capture & Response Time ────────────────────────────────────────
    {
      id: "hs_lead_capture",
      name: "Lead Capture & Response Time",
      leakageType: "lead-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "78% of home service customers choose the first company to respond to their inquiry. The average home service business takes over 24 hours to respond to a new web lead — by which time most customers have already hired someone else.",
      softwareOptions: [
        "Angi (Angie's List)",
        "Calendly",
        "Facebook Lead Ads",
        "FieldPulse",
        "GoHighLevel",
        "Google Ads",
        "Gravity Forms",
        "HomeAdvisor",
        "Housecall Pro",
        "Jobber",
        "JotForm",
        "ServiceTitan",
        "Thumbtack",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_lead_capture_q1",
          areaId: "hs_lead_capture",
          type: "single",
          question:
            "How quickly does a new lead or inquiry typically get a response from your team?",
          options: [
            "Often the next day or later — or never",
            "Same day, but it takes several hours",
            "Within an hour or two",
            "Within minutes — we respond immediately or automation handles it",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_lead_capture_q2",
          areaId: "hs_lead_capture",
          type: "single",
          question:
            "What percentage of inbound leads do you believe your team actually follows up on?",
          options: [
            "Honestly, we're not sure — it's hard to track",
            "About half",
            "Around 75–90%",
            "Close to 100% — we don't miss leads",
          ],
        },
        {
          id: "hs_lead_capture_q3",
          areaId: "hs_lead_capture",
          type: "single",
          question:
            "When a new lead comes in after hours or over the weekend, what happens?",
          options: [
            "Nothing — it sits until someone sees it during business hours",
            "Someone eventually sees it, but response is delayed",
            "We get notified and try to respond, but it's not consistent",
            "Automation or an answering service responds immediately",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_lead_capture_q4",
          areaId: "hs_lead_capture",
          type: "scale",
          question:
            "How clearly do you know which sources — Google, Angi, referrals, yard signs — are generating your best leads?",
          scaleMin: "No idea — it all blurs together",
          scaleMax: "Very clearly — we track source and quality",
        },
      ],
    },

    // ── 2. Estimate & Quoting ───────────────────────────────────────────────────
    {
      id: "hs_estimate_quoting",
      name: "Estimate & Quoting",
      recurringName: "Service Agreements & Pricing",
      leakageType: "lead-based",
      leakageRate: 0.12,
      industryBenchmarkStat:
        "Home service businesses without automated quote follow-up convert an average of 20–25% of estimates into booked jobs. Businesses with structured follow-up sequences convert 40–50% of the same leads — without acquiring a single additional lead.",
      softwareOptions: [
        "Better Proposals",
        "FieldEdge",
        "FieldPulse",
        "GoHighLevel",
        "HoneyBook",
        "Housecall Pro",
        "Jobber",
        "mHelpDesk",
        "PandaDoc",
        "Proposify",
        "QuoteIQ",
        "ResponsiBid",
        "ServiceTitan",
        "Workiz",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_estimate_quoting_q1",
          areaId: "hs_estimate_quoting",
          type: "single",
          question:
            "How long does it typically take to get an estimate to a prospect after first contact?",
          recurringVariant: {
            question:
              "How long does it typically take to send a service agreement or pricing proposal to a new prospect?",
          },
          options: [
            "More than a week",
            "3–5 business days",
            "1–2 days",
            "Same day — we turn estimates around fast",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_estimate_quoting_q2",
          areaId: "hs_estimate_quoting",
          type: "single",
          question:
            "Do you follow up on estimates that have been sent but not yet accepted?",
          recurringVariant: {
            question:
              "Do you follow up with prospects who have received your pricing but haven't signed up yet?",
          },
          options: [
            "Never — we send the estimate and wait",
            "Occasionally — when we think of it",
            "Usually — someone follows up manually after a few days",
            "Always — we have a structured follow-up sequence",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_estimate_quoting_q3",
          areaId: "hs_estimate_quoting",
          type: "single",
          question:
            "How much time does it take your team to prepare a typical estimate?",
          recurringVariant: {
            question:
              "How much time does it take your team to prepare a service agreement or pricing proposal?",
          },
          options: [
            "Half a day or more — it's very manual",
            "A few hours",
            "About 30–60 minutes",
            "Very little — templates or software handles it",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_estimate_quoting_q4",
          areaId: "hs_estimate_quoting",
          type: "scale",
          question:
            "How professional and consistent are your estimates compared to competitors a homeowner might be comparing you against?",
          scaleMin: "Basic and inconsistent — Word docs or verbal quotes",
          scaleMax: "Polished and on-brand every time",
          allowDontKnow: true,
          recurringVariant: {
            question:
              "How professional and consistent is your service agreement process compared to competitors a homeowner might be comparing you against?",
          },
        },
      ],
    },

    // ── 3. Job Scheduling & Dispatch ───────────────────────────────────────────
    {
      id: "hs_scheduling_dispatch",
      name: "Job Scheduling & Dispatch",
      recurringName: "Route & Schedule Management",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "Scheduling inefficiencies — gaps, double-bookings, poor routing — cost the average field service company 12–15% of total available work hours per month. Most owners feel this as stress, not as a number they can fix.",
      softwareOptions: [
        "FieldEdge",
        "FieldPulse",
        "Google Calendar",
        "GoHighLevel",
        "Housecall Pro",
        "Jobber",
        "Kickserv",
        "mHelpDesk",
        "Microsoft Outlook Calendar",
        "ServiceFusion",
        "ServiceTitan",
        "Workiz",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_scheduling_dispatch_q1",
          areaId: "hs_scheduling_dispatch",
          type: "single",
          question:
            "How often do scheduling gaps, double-bookings, or routing inefficiencies cost your team billable time?",
          recurringVariant: {
            question:
              "How often do route gaps, missed visits, or scheduling conflicts cost your team billable time?",
          },
          options: [
            "Very often — it's a constant source of lost time and stress",
            "Regularly — it's a known problem",
            "Occasionally — a few times a month",
            "Rarely — our schedule runs smoothly",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_scheduling_dispatch_q2",
          areaId: "hs_scheduling_dispatch",
          type: "single",
          question:
            "How do customers currently book appointments with your business?",
          options: [
            "Phone or text only — fully manual",
            "Mostly phone, with some email back-and-forth",
            "We use a shared calendar, but customers can't self-book",
            "Customers can self-book online — it's mostly automated",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_scheduling_dispatch_q3",
          areaId: "hs_scheduling_dispatch",
          type: "single",
          question:
            "How often do no-shows or last-minute cancellations disrupt your day and cost you revenue?",
          recurringVariant: {
            question:
              "How often do missed visits or last-minute cancellations disrupt your day and cost you revenue?",
          },
          options: [
            "Very often — it's a major revenue problem",
            "Regularly — at least a few times a week",
            "Occasionally — a few times a month",
            "Rarely — we have reminders and deposits in place",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_scheduling_dispatch_q4",
          areaId: "hs_scheduling_dispatch",
          type: "scale",
          question:
            "How efficiently are your crews or technicians routed — do they spend most of their day working or driving?",
          scaleMin: "Lots of windshield time — routing is inefficient",
          scaleMax: "Tightly optimised — maximum jobs completed per day",
          recurringVariant: {
            question:
              "How efficiently is your weekly route structured — are you maximizing stops per day?",
            scaleMin: "Inefficient — too much drive time between stops",
            scaleMax: "Tightly optimised — maximum stops completed per day",
          },
        },
      ],
    },

    // ── 4. Technician / Crew Communication ─────────────────────────────────────
    {
      id: "hs_crew_communication",
      name: "Technician / Crew Communication",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "Field service companies using digital job communication tools — rather than calls and texts — complete 23% more jobs per technician per month and report 37% fewer job errors and callbacks.",
      softwareOptions: [
        "Connecteam",
        "FieldEdge",
        "FieldPulse",
        "GoHighLevel",
        "Housecall Pro",
        "Jobber",
        "ServiceTitan",
        "Slack",
        "Text / SMS",
        "Workiz",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_crew_communication_q2",
          areaId: "hs_crew_communication",
          type: "single",
          question:
            "How often do jobs require rework or callbacks because a technician had the wrong information going in?",
          options: [
            "Very often — miscommunication is a real cost for us",
            "Regularly — it happens at least a few times a week",
            "Occasionally — a few times a month",
            "Rarely — our crew always arrives with the right information",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_crew_communication_q3",
          areaId: "hs_crew_communication",
          type: "single",
          question:
            "When a job scope changes mid-visit — extra work, different parts needed, time overrun — how is that communicated and approved?",
          options: [
            "It's ad hoc — the tech handles it however they see fit",
            "Usually a phone call to the office, but not always",
            "We have a rough process but it's not consistently followed",
            "Clear process — changes are documented, priced, and approved before proceeding",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_crew_communication_q4",
          areaId: "hs_crew_communication",
          type: "scale",
          question:
            "How clearly does every technician or crew member know exactly what each day's jobs require before they leave in the morning?",
          scaleMin: "Often unclear — lots of back-and-forth calls during the day",
          scaleMax: "Always clear — full job details ready before they leave",
        },
      ],
    },

    // ── 5. Customer Onboarding & Prep ───────────────────────────────────────────
    {
      id: "hs_customer_prep",
      name: "Customer Onboarding & Prep",
      recurringName: "Client Onboarding & Service Setup",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "No-shows and same-day cancellations average 8–12% industry-wide for home service appointments. Businesses with automated day-before reminders reduce no-shows by up to 70%.",
      softwareOptions: [
        "Calendly",
        "FieldPulse",
        "GoHighLevel",
        "Google Forms",
        "Housecall Pro",
        "Jobber",
        "ServiceTitan",
        "Text Message",
        "Workiz",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_customer_prep_q1",
          areaId: "hs_customer_prep",
          type: "single",
          question:
            "What does a customer receive between booking and the day of the job?",
          recurringVariant: {
            question:
              "What does a customer receive when they first sign up for recurring service?",
          },
          options: [
            "Nothing — they just wait",
            "A confirmation only",
            "A confirmation plus one reminder",
            "A full sequence: confirmation, prep instructions, day-before reminder, and arrival window",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_customer_prep_q2",
          areaId: "hs_customer_prep",
          type: "single",
          question:
            "How often do you lose a job or arrive on-site to a problem because the customer wasn't properly prepared?",
          options: [
            "Often — access issues, unprepared sites, and cancellations are common",
            "Regularly — it happens at least a few times a week",
            "Occasionally — a few times a month",
            "Rarely — our prep process prevents most surprises",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_customer_prep_q3",
          areaId: "hs_customer_prep",
          type: "single",
          question:
            "How consistent is the pre-job experience — does every customer get the same quality of communication and preparation?",
          recurringVariant: {
            question:
              "How consistent is the onboarding experience — does every customer get the same quality of communication and preparation?",
          },
          options: [
            "Completely inconsistent — it depends on who booked them",
            "Quite variable — some customers are well-prepared, others not at all",
            "Mostly consistent with some gaps",
            "Very consistent — every customer gets the same process",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_customer_prep_q4",
          areaId: "hs_customer_prep",
          type: "scale",
          question:
            "How clearly do customers know what to expect — timing, what to prepare, who is coming — before your team shows up?",
          scaleMin: "Often confused — we get a lot of calls the day before",
          scaleMax: "Completely clear from the moment they book",
        },
      ],
    },

    // ── 6. Job Completion & Sign-off ────────────────────────────────────────────
    {
      id: "hs_job_completion",
      name: "Job Completion & Sign-off",
      recurringName: "Service Quality & Check-ins",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "Only 12% of home service businesses have a consistent process to present additional work at job completion. Those that do generate 22% more revenue per job on average — from customers who were already sold and already on site.",
      softwareOptions: [
        "DocuSign",
        "FieldEdge",
        "FieldPulse",
        "GoHighLevel",
        "Housecall Pro",
        "Jobber",
        "mHelpDesk",
        "ServiceTitan",
        "Workiz",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_job_completion_q1",
          areaId: "hs_job_completion",
          type: "single",
          question:
            "When a job is finished, do your technicians walk the customer through the completed work and get a formal sign-off?",
          recurringVariant: {
            question:
              "Do your technicians or crew check in with the customer periodically to confirm satisfaction with the ongoing service?",
          },
          options: [
            "Rarely or never — they finish and leave",
            "Occasionally — when the customer is home and asks",
            "Usually — most techs do a walkthrough",
            "Always — sign-off is a required step in our process",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_job_completion_q2",
          areaId: "hs_job_completion",
          type: "single",
          question:
            "Do your technicians present additional recommended work or service opportunities at the end of a job?",
          recurringVariant: {
            question:
              "Do your technicians flag and follow up on additional service opportunities they spot during visits?",
          },
          options: [
            "Never — we do the job and go",
            "Occasionally — if they notice something obvious",
            "Often — but it's not structured or consistent",
            "Always — presenting additional work is a standard part of job close",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_job_completion_q3",
          areaId: "hs_job_completion",
          type: "single",
          question:
            "How quickly does a completed job get fully closed out in your system — notes, photos, paperwork — after the technician leaves the site?",
          options: [
            "Often hours or days later — it piles up",
            "End of day, usually",
            "Within an hour or two of leaving",
            "Before they leave — closed out on-site every time",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_job_completion_q4",
          areaId: "hs_job_completion",
          type: "scale",
          question:
            "How professional and consistent is the experience a customer has in the final 15 minutes of a job?",
          scaleMin: "Inconsistent — fully depends on the individual technician",
          scaleMax: "Always professional — same great experience every time",
          recurringVariant: {
            question:
              "How professional and consistent is the experience a customer has during ongoing service visits?",
          },
        },
      ],
    },

    // ── 7. Invoicing & Payment Collection ──────────────────────────────────────
    {
      id: "hs_invoicing_payment",
      name: "Invoicing & Payment Collection",
      leakageType: "revenue-based",
      leakageRate: 0.09,
      industryBenchmarkStat:
        "The average home service business takes 11 days after job completion to send an invoice. Businesses that invoice same-day get paid 3x faster and reduce uncollected revenue by 60%.",
      softwareOptions: [
        "FreshBooks",
        "GoHighLevel",
        "Housecall Pro",
        "Jobber",
        "PayPal",
        "QuickBooks",
        "ServiceTitan",
        "Square",
        "Stripe",
        "Venmo Business",
        "Wave",
        "Xero",
        "Zelle Business",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_invoicing_payment_q0",
          areaId: "hs_invoicing_payment",
          type: "single",
          question: "How do you typically bill your customers?",
          options: [
            "Per job — each completed job gets its own invoice",
            "Monthly — customers are billed on a set date each month",
            "Both — depends on the customer or service type",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_invoicing_payment_q1",
          areaId: "hs_invoicing_payment",
          type: "single",
          question:
            "How quickly after job completion do you typically send the invoice?",
          skipIf: {
            questionId: "hs_invoicing_payment_q0",
            answer: "Monthly — customers are billed on a set date each month",
          },
          options: [
            "Days or weeks later — it piles up",
            "End of week, in a batch",
            "Monthly on a set date — all customers billed together",
            "End of day",
            "It varies — depends on the job size or type",
            "Same day — invoices go out before the tech leaves or immediately after",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_invoicing_payment_q2",
          areaId: "hs_invoicing_payment",
          type: "single",
          question:
            "How often do invoices go unpaid past their due date because of a process gap — not just a difficult client?",
          options: [
            "Very often — outstanding invoices are a constant cash flow problem",
            "Regularly — late payments are common",
            "Occasionally — a few per month",
            "Rarely — our invoicing and follow-up is tight",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_invoicing_payment_q3",
          areaId: "hs_invoicing_payment",
          type: "single",
          question:
            "How much time does your team spend each month chasing late payments or correcting invoicing errors?",
          options: [
            "More than 10 hours",
            "5–10 hours",
            "2–5 hours",
            "Under 2 hours — it's mostly automated",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_invoicing_payment_q4",
          areaId: "hs_invoicing_payment",
          type: "scale",
          question:
            "How confident are you in the real-time accuracy of your outstanding invoices and cash position?",
          scaleMin: "Not confident — it's murky",
          scaleMax: "Very confident — always accurate and up to date",
        },
      ],
    },

    // ── 8. Customer Communication & Updates ────────────────────────────────────
    {
      id: "hs_customer_updates",
      name: "Customer Communication & Updates",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "41% of home service customers say they would switch to a competitor if they received better communication. The number one reason customers don't call back is not price — it's that they felt uninformed during the job.",
      softwareOptions: [
        "Birdeye",
        "Broadly",
        "Email",
        "GoHighLevel",
        "Housecall Pro",
        "Jobber",
        "Podium",
        "ServiceTitan",
        "Text Message",
        "Workiz",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_customer_updates_q1",
          areaId: "hs_customer_updates",
          type: "single",
          question:
            "How often do customer messages, questions, or complaints get missed or fall through the cracks?",
          options: [
            "Very often — messages are constantly lost or delayed",
            "Regularly — it's an ongoing problem",
            "Occasionally — a few times a month",
            "Rarely — we have a solid system for handling customer messages",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_customer_updates_q2",
          areaId: "hs_customer_updates",
          type: "single",
          question:
            "Do customers receive real-time updates on the day of their job — confirmation, tech on the way, arrival window?",
          options: [
            "No — they just wait and wonder",
            "Only if they call us to ask",
            "Usually — we try to reach out, but it's not always consistent",
            "Yes — automated updates go out at every stage of the day",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_customer_updates_q3",
          areaId: "hs_customer_updates",
          type: "single",
          question:
            "How much customer communication happens outside your main system — on personal phones, personal email, or WhatsApp?",
          options: [
            "Most of it — there's no central system",
            "A lot — more than half",
            "Some — maybe 20–30% is off-channel",
            "Very little — almost everything goes through official channels",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_customer_updates_q4",
          areaId: "hs_customer_updates",
          type: "scale",
          question:
            "How professional and consistent is your team's communication with customers from booking through job completion?",
          scaleMin: "Inconsistent — very person-dependent",
          scaleMax: "Consistently professional at every touchpoint",
        },
      ],
    },

    // ── 9. Reviews & Reputation ─────────────────────────────────────────────────
    {
      id: "hs_reviews_reputation",
      name: "Reviews & Reputation",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "93% of consumers read online reviews before hiring a home service contractor. Businesses with 50 or more Google reviews convert 270% more inquiries than businesses with fewer than 10.",
      softwareOptions: [
        "Birdeye",
        "Broadly",
        "GoHighLevel",
        "Google Business Profile",
        "Grade.us",
        "NiceJob",
        "Podium",
        "ReviewBuzz",
        "ReviewTrackers",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_reviews_reputation_q1",
          areaId: "hs_reviews_reputation",
          type: "single",
          question:
            "How often do you proactively ask satisfied customers to leave a review immediately after job completion?",
          options: [
            "Rarely or never — we hope they'll leave one on their own",
            "Occasionally — when we think of it",
            "Often — but not consistently after every job",
            "Always — asking for a review is built into our job completion process",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reviews_reputation_q2",
          areaId: "hs_reviews_reputation",
          type: "single",
          question:
            "How quickly does your team respond to negative reviews or public complaints?",
          options: [
            "We rarely or never respond to reviews",
            "Within a week",
            "Within a day or two",
            "Within hours — we monitor and respond quickly",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reviews_reputation_q3",
          areaId: "hs_reviews_reputation",
          type: "single",
          question:
            "How does your current volume and rating of Google reviews compare to your main local competitors?",
          options: [
            "They have significantly more and better reviews than we do",
            "We're behind — fewer reviews or lower ratings",
            "About the same",
            "We're ahead — more reviews and stronger ratings than most local competitors",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reviews_reputation_q4",
          areaId: "hs_reviews_reputation",
          type: "scale",
          question:
            "How actively managed is your online reputation — Google, Yelp, Facebook — right now?",
          scaleMin: "Completely unmanaged — we never look at it",
          scaleMax: "Proactively managed — a real competitive asset",
        },
      ],
    },

    // ── 10. Re-engagement & Maintenance Reminders ──────────────────────────────
    {
      id: "hs_reengagement",
      name: "Re-engagement & Maintenance Reminders",
      leakageType: "revenue-based",
      leakageRate: 0.12,
      industryBenchmarkStat:
        "The average home service business loses 25–40% of its existing customers each year — not because of bad service, but because no one reached out first. A customer who hasn't heard from you in 90 days is already comparison shopping.",
      softwareOptions: [
        "ActiveCampaign",
        "Constant Contact",
        "GoHighLevel",
        "Housecall Pro",
        "Jobber",
        "Klaviyo",
        "Mailchimp",
        "ServiceTitan",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_reengagement_q1",
          areaId: "hs_reengagement",
          type: "single",
          question:
            "How often do you proactively reach out to past customers for maintenance reminders, seasonal services, or check-ins?",
          options: [
            "Never — we have no re-engagement process",
            "Rarely — only when we think of it",
            "Occasionally — we run ad hoc campaigns",
            "Regularly — we have automated sequences that run without us",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reengagement_q2",
          areaId: "hs_reengagement",
          type: "single",
          question:
            "Do you have a way to identify which past customers are overdue for a service or haven't booked in a while?",
          options: [
            "No — we have no way to see this",
            "We could pull it manually, but no one does",
            "Loosely — we have some data but it's not easy to act on",
            "Yes — we can segment customers by service history and trigger outreach",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reengagement_q3",
          areaId: "hs_reengagement",
          type: "single",
          question:
            "When you reach out to past customers, is the message tailored to their service history or generic?",
          options: [
            "We don't reach out",
            "Same generic message to everyone",
            "Partially tailored — we try, but it's mostly generic",
            "Always personalised to their job history or last service type",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reengagement_q4",
          areaId: "hs_reengagement",
          type: "scale",
          question:
            "How effectively are you turning one-time customers into repeat business?",
          scaleMin: "Not at all — every job is a one-off",
          scaleMax: "Very effectively — repeat bookings are a major revenue stream",
        },
      ],
    },

    // ── 11. Referral Management ─────────────────────────────────────────────────
    {
      id: "hs_referrals",
      name: "Referral Management",
      leakageType: "revenue-based",
      leakageRate: 0.11,
      industryBenchmarkStat:
        "Referred customers close at 4x the rate of cold leads and spend 13% more on average. 83% of home service businesses have no formal referral ask process — they rely entirely on customers referring spontaneously.",
      softwareOptions: [
        "Ambassador",
        "Friendbuy",
        "GoHighLevel",
        "Jobber",
        "Referral Factory",
        "ReferralRock",
        "ServiceTitan",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_referrals_q1",
          areaId: "hs_referrals",
          type: "single",
          question:
            "Do you have a formal process for asking satisfied customers to refer friends, family, or neighbours?",
          options: [
            "No — we've never really thought about it",
            "Purely organic — we rely on customers referring without being asked",
            "Semi-formal — we ask occasionally, but it's not structured",
            "Formal program — with a clear ask, incentives, and a defined process",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_referrals_q2",
          areaId: "hs_referrals",
          type: "single",
          question:
            "Do you have a way to track which new customers came through referrals and who sent them?",
          options: [
            "No — we have no way to trace this",
            "Referrals come in but we rarely know who sent them",
            "Loosely — we ask but don't record it formally",
            "Yes — it's tracked in our system and we follow up with the referrer",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_referrals_q3",
          areaId: "hs_referrals",
          type: "single",
          question:
            "Do you have anything in place to thank or reward customers who refer new business to you?",
          options: [
            "Nothing — referrers get no acknowledgement",
            "We say thank you verbally, but nothing formal",
            "Sometimes — a gift card or discount if we remember",
            "Always — we have a structured incentive or loyalty reward for referrers",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_referrals_q4",
          areaId: "hs_referrals",
          type: "scale",
          question:
            "How much of your new business currently comes from referrals?",
          scaleMin: "Almost none — we don't rely on referrals",
          scaleMax: "The majority — referrals are our best growth channel",
        },
      ],
    },

    // ── 12. Business Visibility & Reporting ────────────────────────────────────
    {
      id: "hs_reporting",
      name: "Business Visibility & Reporting",
      // This area acts as a multiplier: weak visibility amplifies all other leakage.
      // leakageRate of 0.40 represents the 1.4x amplification when no system is in place.
      leakageType: "multiplier",
      leakageRate: 0.40,
      industryBenchmarkStat:
        "Home service business owners who review KPIs weekly grow revenue 2.4x faster than those who check metrics monthly or less. Without a reporting system, problems like falling close rates or rising no-shows go undetected for months — each one compounding the next.",
      softwareOptions: [
        "Databox",
        "FieldPulse",
        "GoHighLevel",
        "Google Analytics",
        "Housecall Pro",
        "Jobber",
        "Klipfolio",
        "Looker Studio",
        "Power BI",
        "QuickBooks",
        "ServiceTitan",
        "Spreadsheets only",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hs_reporting_q1",
          areaId: "hs_reporting",
          type: "single",
          question:
            "How often do you review key performance metrics — revenue, close rate, job count, no-show rate — for your business?",
          options: [
            "Rarely or never — I mostly operate on gut feel",
            "Monthly — usually when taxes or bills come up",
            "Weekly — I check in regularly",
            "Daily or in real time — I have a dashboard I trust",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reporting_q2",
          areaId: "hs_reporting",
          type: "single",
          question:
            "How often do business decisions get delayed or made poorly because the right data isn't available or isn't trusted?",
          options: [
            "Very often — we mostly run on instinct",
            "Regularly — data gaps slow us down often",
            "Occasionally — a few times a month",
            "Rarely — we have good visibility into our numbers",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reporting_q3",
          areaId: "hs_reporting",
          type: "single",
          question:
            "How much manual work goes into producing your regular reports — pulling data from different tools, formatting spreadsheets, copy-pasting?",
          options: [
            "Reports are almost entirely manual or we don't produce them",
            "Many hours a month — it's a real burden",
            "A few hours a month",
            "Very little — it's mostly automated",
            "I honestly don't know",
          ],
        },
        {
          id: "hs_reporting_q4",
          areaId: "hs_reporting",
          type: "scale",
          question:
            "How confident are you that your key numbers — revenue, average job value, close rate, technician performance — are accurate and up to date at any given moment?",
          scaleMin: "Not confident — I'm often working with stale or incomplete data",
          scaleMax: "Very confident — real-time and reliable",
          glossary: {
            "key business metrics":
              "The numbers that drive your business: jobs booked, average job value, estimate conversion rate, no-show rate, and which technicians are performing. Also called KPIs.",
          },
        },
      ],
    },
  ],

  // ─── Leakage formula ─────────────────────────────────────────────────────────
  // lead-based rates are applied against (monthly_leads × avg_job_value).
  // revenue-based rates are applied directly against monthly_revenue.
  // hs_estimate_quoting is lead-based but is additionally multiplied by close_rate
  // to avoid double-counting with hs_lead_capture.
  // hs_reporting is a multiplier: 1.4 when no system (40% amplification of all
  // other calculated leakage), 1.2 when inconsistent (20% amplification).
  leakageFormula: {
    hs_lead_capture: 0.20,
    hs_estimate_quoting: 0.12,
    hs_scheduling_dispatch: 0.08,
    hs_crew_communication: 0.05,
    hs_customer_prep: 0.05,
    hs_job_completion: 0.07,
    hs_invoicing_payment: 0.09,
    hs_customer_updates: 0.06,
    hs_reviews_reputation: 0.10,
    hs_reengagement: 0.12,
    hs_referrals: 0.11,
    // Stored as the incremental amplification fraction (1.4x → 0.40, 1.2x → 0.20).
    // The AI analysis layer reads this field to determine how much to scale
    // the total leakage estimate depending on the owner's reporting score.
    hs_reporting: 0.40,
  },

  // ─── AI prompt additions ─────────────────────────────────────────────────────
  aiPromptAdditions: `
VERTICAL CONTEXT: Home Services

This audit is for an owner-operated home service business (5–25 employees). All analysis, framing, and recommendations must use home services terminology throughout.

TERMINOLOGY SUBSTITUTIONS — apply these consistently in all output:
- "sale" or "transaction" → "job"
- "close rate" → "estimate-to-job conversion rate"
- "onboarding" (client) → "pre-job prep"
- "upsell" → "additional work"
- "re-engagement campaign" → "maintenance reminder campaign"
- "dispatch" → "routing or crew deployment"

REPORT VOICE:
- Write to a business owner sitting alone at night, not a boardroom executive.
- Use plain language. Avoid jargon unless defined.
- Lead with what it costs them in dollars, not what they're doing wrong.
- Frame every problem as solvable with a specific system change, not a mindset change.
- In the Priority Actions section, anchor recommendations to the highest-leakage areas first.
- Use phrases like "your crew", "your techs", "your jobs", "your homeowners" — not "the technicians", "the clients", "the transactions".

STACK RECOMMENDATION RULES — HOME SERVICES:

GHL IS THE BRAIN, JOBBER/HOUSECALL PRO ARE THE HANDS. These are complementary tools, not competing ones. Never recommend GHL as a replacement for Jobber or Housecall Pro. Never recommend Jobber or Housecall Pro as a replacement for GHL.

- GHL owns: Lead capture, follow-up sequences, CRM pipeline, review requests, re-engagement campaigns, referral programs, reporting dashboards, automated SMS/email communication
- Jobber/Housecall Pro owns: Job scheduling, dispatch, field crew communication, job completion, on-site invoicing, change orders, route management
- When a client has NOTHING → recommend BOTH: deploy Jobber/Housecall Pro for field ops AND deploy GHL for automation and growth
- When a client has Jobber/Housecall Pro but no GHL → recommend adding GHL as the automation layer that "connects to Jobber"
- When a client has GHL but no field service tool → recommend adding Jobber or Housecall Pro as the field operations layer
- NEVER position GHL as a CRM to home service business owners — they think of Jobber as their CRM. Position GHL as "the automation and growth engine that connects to Jobber"

CONFIGURE PATTERN — JOBBER AND HOUSECALL PRO:
If a client lists Jobber or Housecall Pro AND scores poorly on any of the following areas, the stack action MUST be CONFIGURE, never DEPLOY or REPLACE:
- Job Scheduling & Dispatch — Jobber/HCP has full scheduling capability; poor score = not configured
- Technician/Crew Communication — Jobber/HCP has mobile job details; poor score = not using the app
- Job Completion & Sign-off — Jobber/HCP has digital sign-off; poor score = not using it
- Invoicing & Payment Collection — Jobber/HCP has same-day invoicing; poor score = process issue not tool issue
- Customer Onboarding & Prep — Jobber/HCP has automated reminders; poor score = not set up

stackReasoning for these must say: "You already have [Jobber/Housecall Pro] — this is a configuration issue, not a missing tool. The fix is setting up [specific feature] inside your existing platform."

CONFIGURE PATTERN — SERVICETITAN:
ServiceTitan is the most powerful field service platform available — it handles everything from lead capture through invoicing. If a client lists ServiceTitan AND scores poorly on ANY area, the stack action MUST be CONFIGURE, never DEPLOY or REPLACE. ServiceTitan almost certainly has the capability for whatever is missing — the issue is always configuration, not tool gaps.

When writing stackReasoning for a CONFIGURE action on ServiceTitan, be specific about the feature:
- ServiceTitan + poor reviews → "ServiceTitan has automated review request workflows built in. The fix is setting up post-job review requests to fire automatically after job completion."
- ServiceTitan + poor re-engagement → "ServiceTitan has maintenance reminder campaigns. Set up annual service reminder sequences for every closed job to drive repeat business."
- ServiceTitan + poor reporting → "ServiceTitan has a full reporting dashboard. The fix is setting up your KPI dashboard and scheduling weekly report reviews."
- ServiceTitan + poor referrals → "ServiceTitan has referral tracking. Set up post-job referral asks to fire automatically to satisfied customers."

Never say "deploy GoHighLevel" when a client has ServiceTitan — GHL adds almost no value on top of a properly configured ServiceTitan. The recommendation should always be to configure what they already have.

OPERATIONAL REALITY — HOME SERVICES TRADE-SPECIFIC:

PAINTING & DRYWALL:
- Estimate follow-up is the #1 leakage point — painters send quotes and never follow up. The average painting estimate takes 3-5 follow-up touches before a decision. Most painters follow up once or not at all.
- Project communication: clients want to know when the crew is arriving, what rooms are being done today, and when to expect completion. No-shows and surprise schedule changes are the #1 complaint.
- Color approval and change orders: undocumented color changes and scope additions are the primary cause of disputes and unpaid invoices in painting.
- Deposit collection before starting is standard in painting — owners who don't collect deposits have higher cancellation rates and cash flow problems.
- Punch list sign-off: jobs that end without a formal client walk-through generate more disputes and negative reviews than any other failure.
- When writing findings for a painting contractor: reference estimates, color approvals, crew arrival windows, punch lists, and deposit collection — not generic "no scheduling system" language.

HVAC:
- Seasonal demand creates massive lead spikes in summer (cooling) and winter (heating) — owners without a lead capture system lose jobs to whoever answers the phone first.
- Maintenance agreements are the recurring revenue model in HVAC — converting one-time repair customers into annual maintenance plan members is the highest-LTV activity in the business.
- Equipment replacement upsell: technicians who identify aging systems and present replacement options systematically generate 3-5x more revenue per visit than those who just fix the immediate problem.
- After-hours emergency calls are a primary acquisition channel — the owner who answers at 11pm wins the customer for life.
- Review timing: the best moment to ask for a review is immediately after a successful repair when the customer's relief is highest.
- When writing findings for an HVAC company: reference maintenance agreements, seasonal demand, emergency response time, and equipment replacement upsell — not generic service language.

PLUMBING & ELECTRICAL:
- Emergency calls dominate new customer acquisition — response time is the primary selection criteria.
- Upsell during service visits: plumbers who present water heater replacements, fixture upgrades, or whole-home assessments during routine visits generate significantly more revenue per truck roll.
- When writing findings for a plumber or electrician: reference emergency response, upsell opportunities during visits, and permit coordination — not generic service language.
- Always use "service call" not "job" or "appointment" for plumbing visits
- "repair" should appear in plumbing findings — water heater repair, pipe repair, drain repair
- When writing findings for a plumber: reference service calls, emergency repairs, repair quotes, and repair upsells specifically
`,
};
