import type { VerticalConfig } from "./types";

// ─── Commission tiers ─────────────────────────────────────────────────────────
// Four option + midpoint sets for fin_avg_sale, selected dynamically based on
// the practice focus the agent chose in re_focus_type.

const RESIDENTIAL_COMMISSION_OPTIONS = [
  "Under $3,000",
  "$3,000–$5,000",
  "$5,000–$7,500",
  "$7,500–$10,000",
  "$10,000–$13,000",
  "$13,000–$17,000",
  "$17,000–$22,000",
  "$22,000–$28,000",
  "$28,000–$35,000",
  "$35,000–$45,000",
  "Over $45,000",
  "I'm not sure",
  "Enter exact amount",
];
const RESIDENTIAL_COMMISSION_MIDPOINTS: Record<string, number> = {
  "Under $3,000":       2000,
  "$3,000–$5,000":      4000,
  "$5,000–$7,500":      6250,
  "$7,500–$10,000":     8750,
  "$10,000–$13,000":   11500,
  "$13,000–$17,000":   15000,
  "$17,000–$22,000":   19500,
  "$22,000–$28,000":   25000,
  "$28,000–$35,000":   31500,
  "$35,000–$45,000":   40000,
  "Over $45,000":      55000,
  "I'm not sure":      10000,
  "Enter exact amount":    0,
};

const LUXURY_COMMISSION_OPTIONS = [
  "Under $10,000",
  "$10,000–$15,000",
  "$15,000–$22,000",
  "$22,000–$30,000",
  "$30,000–$40,000",
  "$40,000–$55,000",
  "$55,000–$75,000",
  "$75,000–$100,000",
  "$100,000–$135,000",
  "Over $135,000",
  "I'm not sure",
  "Enter exact amount",
];
const LUXURY_COMMISSION_MIDPOINTS: Record<string, number> = {
  "Under $10,000":       7500,
  "$10,000–$15,000":    12500,
  "$15,000–$22,000":    18500,
  "$22,000–$30,000":    26000,
  "$30,000–$40,000":    35000,
  "$40,000–$55,000":    47500,
  "$55,000–$75,000":    65000,
  "$75,000–$100,000":   87500,
  "$100,000–$135,000": 117500,
  "Over $135,000":     160000,
  "I'm not sure":       50000,
  "Enter exact amount":     0,
};

const COMMERCIAL_COMMISSION_OPTIONS = [
  "Under $5,000",
  "$5,000–$10,000",
  "$10,000–$18,000",
  "$18,000–$28,000",
  "$28,000–$40,000",
  "$40,000–$60,000",
  "$60,000–$90,000",
  "$90,000–$130,000",
  "$130,000–$180,000",
  "Over $180,000",
  "I'm not sure",
  "Enter exact amount",
];
const COMMERCIAL_COMMISSION_MIDPOINTS: Record<string, number> = {
  "Under $5,000":        3500,
  "$5,000–$10,000":      7500,
  "$10,000–$18,000":    14000,
  "$18,000–$28,000":    23000,
  "$28,000–$40,000":    34000,
  "$40,000–$60,000":    50000,
  "$60,000–$90,000":    75000,
  "$90,000–$130,000":  110000,
  "$130,000–$180,000": 155000,
  "Over $180,000":     220000,
  "I'm not sure":       50000,
  "Enter exact amount":     0,
};

const INVESTING_COMMISSION_OPTIONS = [
  "Under $2,000",
  "$2,000–$4,000",
  "$4,000–$6,500",
  "$6,500–$9,000",
  "$9,000–$12,000",
  "$12,000–$16,000",
  "$16,000–$22,000",
  "$22,000–$30,000",
  "Over $30,000",
  "I'm not sure",
  "Enter exact amount",
];
const INVESTING_COMMISSION_MIDPOINTS: Record<string, number> = {
  "Under $2,000":       1500,
  "$2,000–$4,000":      3000,
  "$4,000–$6,500":      5250,
  "$6,500–$9,000":      7750,
  "$9,000–$12,000":    10500,
  "$12,000–$16,000":   14000,
  "$16,000–$22,000":   19000,
  "$22,000–$30,000":   26000,
  "Over $30,000":      38000,
  "I'm not sure":      12000,
  "Enter exact amount":    0,
};

export const realEstateConfig: VerticalConfig = {
  verticalId: "real-estate",
  displayName: "Real Estate Audit",

  // intro_business is replaced by re_focus_type (more specific to RE practice type).
  skipQuestions: ["intro_business"],

  // ─── Intro question overrides ────────────────────────────────────────────────
  introQuestions: {
    fin_avg_sale: {
      question: "What is your average commission per transaction?",
      options: RESIDENTIAL_COMMISSION_OPTIONS,
      dynamicOptionsSource: "re_focus_type",
      dynamicOptions: {
        "Residential sales — buyers and sellers": RESIDENTIAL_COMMISSION_OPTIONS,
        "Luxury or high-end residential":         LUXURY_COMMISSION_OPTIONS,
        "Commercial real estate":                 COMMERCIAL_COMMISSION_OPTIONS,
        "Property management":                    INVESTING_COMMISSION_OPTIONS,
        "Real estate investing / wholesaling":    INVESTING_COMMISSION_OPTIONS,
        "Mixed — I do several of these":          RESIDENTIAL_COMMISSION_OPTIONS,
      },
      dynamicMidpoints: {
        "Residential sales — buyers and sellers": RESIDENTIAL_COMMISSION_MIDPOINTS,
        "Luxury or high-end residential":         LUXURY_COMMISSION_MIDPOINTS,
        "Commercial real estate":                 COMMERCIAL_COMMISSION_MIDPOINTS,
        "Property management":                    INVESTING_COMMISSION_MIDPOINTS,
        "Real estate investing / wholesaling":    INVESTING_COMMISSION_MIDPOINTS,
        "Mixed — I do several of these":          RESIDENTIAL_COMMISSION_MIDPOINTS,
      },
    },
    fin_close_rate: {
      question: "Out of every 10 leads, roughly how many become closed transactions?",
    },
    fin_monthly_leads: {
      question: "How many new leads do you receive per month across all sources?",
    },
    fin_monthly_revenue: {
      question: "What is your average monthly commission income?",
    },
    intro_size: {
      question: "How would you describe the size of your real estate practice?",
      options: [
        "Solo agent — just me",
        "Me plus an assistant or transaction coordinator",
        "Small team — 2 to 5 agents",
        "Mid-size team — 6 to 15 agents",
        "Large team or brokerage — 16 or more agents",
      ],
    },
    // ── New question — injected at the intro_business position ─────────────────
    re_focus_type: {
      id: "re_focus_type",
      areaId: null,
      type: "multi",
      question: "Which best describes your real estate focus?",
      options: [
        "Residential sales — buyers and sellers",
        "Luxury or high-end residential",
        "Commercial real estate",
        "Property management",
        "Real estate investing / wholesaling",
        "Mixed — I do several of these",
      ],
    },
  },

  // ─── Workflow areas ──────────────────────────────────────────────────────────
  workflowAreas: [
    // ── 1. Lead Capture & Response Time ──────────────────────────────────────────
    {
      id: "re_lead_capture",
      name: "Lead Capture & Response Time",
      leakageType: "lead-based",
      leakageRate: 0.25,
      industryBenchmarkStat:
        "47% of buyers and 59% of sellers hire the first agent they speak with — decisions that often happen before the first conversation based on online presence and response speed. Agents who respond within 5 minutes are dramatically more likely to make meaningful contact than those who wait an hour or more. — Zillow 2025 Consumer Housing Trends Report",
      softwareOptions: [
        "Follow Up Boss",
        "LionDesk",
        "KVCore",
        "BoomTown",
        "HubSpot",
        "GoHighLevel (GHL)",
        "Zillow Premier Agent",
        "Realtor.com Connections",
        "Real Geeks",
        "Sierra Interactive",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_lead_capture_q1",
          areaId: "re_lead_capture",
          type: "single",
          question:
            "When a new lead comes in — from Zillow, Realtor.com, your website, or anywhere else — how quickly do you typically respond?",
          options: [
            "Hours later or the next day — whenever I can get to it",
            "Within the hour if I'm not with a client",
            "Within a few minutes — I try to be fast",
            "Instantly — an automated system responds immediately, even when I'm busy",
          ],
        },
        {
          id: "re_lead_capture_q2",
          areaId: "re_lead_capture",
          type: "single",
          question: "How do most of your new leads reach you?",
          options: [
            "Phone calls to my cell",
            "Online inquiry forms — Zillow, Realtor.com, my website",
            "Referrals from past clients or my network",
            "Multiple channels — leads come from several different places",
          ],
        },
        {
          id: "re_lead_capture_q3",
          areaId: "re_lead_capture",
          type: "single",
          question:
            "When a lead comes in while you're showing a property or in a closing, what happens?",
          options: [
            "It waits until I'm free — sometimes hours",
            "Voicemail — I call back when I can",
            "My assistant or team member handles it",
            "An automated system responds immediately and keeps them engaged",
          ],
        },
        {
          id: "re_lead_capture_q4",
          areaId: "re_lead_capture",
          type: "single",
          question:
            "Do you track every lead — where it came from, what happened with it, and where it is in your pipeline right now?",
          options: [
            "No — leads come in through different places and I lose track",
            "I have a rough idea but nothing formal",
            "Mostly — I track some sources but not all",
            "Yes — every lead is in my CRM with full history and current status",
          ],
        },
        {
          id: "re_lead_capture_q5",
          areaId: "re_lead_capture",
          type: "single",
          question:
            "What percentage of your leads actually hear back from you within 5 minutes of reaching out?",
          options: [
            "Very few — I respond when I can",
            "Maybe a quarter of them",
            "About half",
            "Almost all — I have a system that ensures fast response",
          ],
        },
      ],
    },

    // ── 2. Lead Nurture & Follow-Up ───────────────────────────────────────────────
    {
      id: "re_lead_nurture",
      name: "Lead Nurture & Follow-Up",
      leakageType: "lead-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "The average real estate lead takes 6–18 months from first contact to transaction. 70% of agents follow up fewer than 3 times before giving up. The agents who close the most business are almost never the ones who generated the most leads — they're the ones who followed up longest. — NAR 2025 Profile of Home Buyers and Sellers",
      softwareOptions: [
        "Follow Up Boss",
        "LionDesk",
        "KVCore",
        "BoomTown",
        "HubSpot",
        "GoHighLevel (GHL)",
        "Mailchimp",
        "ActiveCampaign",
        "Real Geeks",
        "Sierra Interactive",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_lead_nurture_q1",
          areaId: "re_lead_nurture",
          type: "single",
          question:
            "When a lead isn't ready to buy or sell right now, what happens to them?",
          options: [
            "They go cold — I move on to active clients",
            "I check in occasionally when I think of it",
            "I have a loose follow-up system but it's inconsistent",
            "They enter a long-term nurture sequence that runs automatically until they're ready",
          ],
        },
        {
          id: "re_lead_nurture_q2",
          areaId: "re_lead_nurture",
          type: "single",
          question:
            "How long do you actively follow up with a lead before moving on?",
          options: [
            "A few weeks — if they don't respond, I stop",
            "A couple of months",
            "Six months or so",
            "As long as it takes — I have automated sequences that run for years if needed",
          ],
        },
        {
          id: "re_lead_nurture_q3",
          areaId: "re_lead_nurture",
          type: "single",
          question:
            "Do you have different follow-up sequences for buyers vs. sellers vs. investors?",
          options: [
            "No — everyone gets the same follow-up, or none at all",
            "I adjust my approach manually but have no formal sequences",
            "I have loose templates I reuse",
            "Yes — fully separate automated sequences tailored to each type",
          ],
        },
        {
          id: "re_lead_nurture_q4",
          areaId: "re_lead_nurture",
          type: "single",
          question:
            "When a lead goes cold after an initial conversation, do you have a reactivation process?",
          options: [
            "No — if they go quiet, I consider them lost",
            "I try to check in occasionally but it's informal",
            "I have a loose win-back approach",
            "Yes — an automated reactivation sequence fires after a defined period of silence",
          ],
        },
        {
          id: "re_lead_nurture_q5",
          areaId: "re_lead_nurture",
          type: "single",
          question:
            "Do you know which leads in your database are most likely to transact in the next 90 days?",
          options: [
            "No — I have no visibility into lead readiness",
            "I have a general sense based on conversations",
            "I track some signals manually",
            "Yes — my CRM scores or flags leads based on behavior and engagement",
          ],
        },
      ],
    },

    // ── 3. Buyer & Seller Onboarding ──────────────────────────────────────────────
    {
      id: "re_buyer_seller_onboarding",
      name: "Buyer & Seller Onboarding",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "Clients who receive a structured, documented onboarding experience are 40% less likely to work with another agent mid-process and 60% more likely to leave a positive review. The onboarding experience sets the tone for the entire relationship. — NAR Profile of Home Buyers and Sellers / Real Estate Coach Research",
      softwareOptions: [
        "Follow Up Boss",
        "KVCore",
        "HubSpot",
        "GoHighLevel (GHL)",
        "Dotloop",
        "DocuSign",
        "Canva",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_buyer_seller_onboarding_q1",
          areaId: "re_buyer_seller_onboarding",
          type: "single",
          question:
            "When a new buyer or seller client signs on with you, what do they receive from you?",
          options: [
            "A conversation — I explain what happens next verbally",
            "A quick email with some basics",
            "A welcome packet or email with key information",
            "A full onboarding sequence — welcome, process overview, timeline, what to expect at each stage, and who to contact",
          ],
        },
        {
          id: "re_buyer_seller_onboarding_q2",
          areaId: "re_buyer_seller_onboarding",
          type: "single",
          question:
            "Do buyers and sellers understand exactly what the process looks like — every step, every milestone, every expected timeline?",
          options: [
            "Not really — they learn as we go",
            "I explain the basics upfront but not in detail",
            "I give them a good overview at the start",
            "Yes — they receive a complete process map before we start and updates at every milestone",
          ],
        },
        {
          id: "re_buyer_seller_onboarding_q3",
          areaId: "re_buyer_seller_onboarding",
          type: "single",
          question:
            "When a client has a question between your conversations, do they know how to reach you and how quickly to expect a response?",
          options: [
            "Not formally — they just call or text and hope for a quick response",
            "They have my cell and I respond when I can",
            "They know my general availability",
            "Yes — they have a clear communication protocol and get automated acknowledgment of every message",
          ],
        },
        {
          id: "re_buyer_seller_onboarding_q4",
          areaId: "re_buyer_seller_onboarding",
          type: "single",
          question:
            "Do new clients receive a consistent, professional experience regardless of how busy you are?",
          options: [
            "It depends on my workload — busy times mean less attention",
            "I try to be consistent but it varies",
            "Mostly consistent — a few things slip when I'm slammed",
            "Yes — the onboarding process is automated and consistent regardless of my schedule",
          ],
        },
        {
          id: "re_buyer_seller_onboarding_q5",
          areaId: "re_buyer_seller_onboarding",
          type: "single",
          question:
            "Do sellers understand exactly how you'll market their listing, what you'll do week by week, and how you'll communicate results?",
          options: [
            "Not really — I explain the basics but not in detail",
            "I give them a general overview",
            "I walk them through my marketing plan at the listing presentation",
            "Yes — they receive a complete written marketing plan with weekly reporting commitments",
          ],
        },
      ],
    },

    // ── 4. Showing Scheduling & Management ────────────────────────────────────────
    {
      id: "re_showing_scheduling",
      name: "Showing Scheduling & Management",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "No-show rates for real estate showings average 15–20% industry-wide. Agents who send automated day-before and day-of reminders reduce no-shows by up to 65% — recovering hours of lost time and keeping buyer momentum from stalling. — ShowingTime Industry Research",
      softwareOptions: [
        "Calendly",
        "ShowingTime",
        "BrokerBay",
        "Follow Up Boss",
        "KVCore",
        "Google Calendar",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_showing_scheduling_q1",
          areaId: "re_showing_scheduling",
          type: "single",
          question: "How do buyers currently schedule showings with you?",
          options: [
            "They call or text and I coordinate manually",
            "I use a basic calendar tool and confirm by phone or text",
            "I use a showing service or scheduling software",
            "Online self-scheduling — buyers pick a time and it's confirmed automatically",
          ],
        },
        {
          id: "re_showing_scheduling_q2",
          areaId: "re_showing_scheduling",
          type: "single",
          question:
            "What percentage of scheduled showings result in no-shows or last-minute cancellations without notice?",
          options: [
            "A lot — more than 20%",
            "Some — around 10–20%",
            "A few — under 10%",
            "Very rare — I have a confirmation and reminder system that virtually eliminates them",
          ],
        },
        {
          id: "re_showing_scheduling_q3",
          areaId: "re_showing_scheduling",
          type: "single",
          question: "Do buyers receive automated reminders before showings?",
          options: [
            "No — they're expected to remember",
            "I remind them manually when I remember",
            "I send a reminder the day before",
            "Yes — automated reminders go out at set intervals without me doing anything",
          ],
        },
        {
          id: "re_showing_scheduling_q4",
          areaId: "re_showing_scheduling",
          type: "single",
          question:
            "After a showing, do you have a systematic process to capture buyer feedback?",
          options: [
            "No — I ask verbally if I remember",
            "I follow up by text or phone sometimes",
            "I have a loose follow-up system",
            "Yes — an automated feedback request goes out to every buyer after every showing",
          ],
        },
        {
          id: "re_showing_scheduling_q5",
          areaId: "re_showing_scheduling",
          type: "single",
          question:
            "Do you have visibility into which properties a buyer has seen, what their feedback was, and where they are in their decision process?",
          options: [
            "Not really — I track it mentally or in notes",
            "I keep rough notes but nothing systematic",
            "I track it in a spreadsheet or CRM but not consistently",
            "Yes — every showing, every feedback, and every buyer status is tracked in real time",
          ],
        },
      ],
    },

    // ── 5. Offer & Contract Management ───────────────────────────────────────────
    {
      id: "re_offer_contract",
      name: "Offer & Contract Management",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "Communication breakdowns during the offer and negotiation phase are the leading cause of deals falling apart before contract. Agents who provide systematic updates at every development report 30% higher contract-to-close ratios and dramatically higher client satisfaction scores. — NAR Transaction Research / Real Estate Coach Data",
      softwareOptions: [
        "Dotloop",
        "DocuSign",
        "Authentisign",
        "Skyslope",
        "Follow Up Boss",
        "GoHighLevel (GHL)",
        "zipForm",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_offer_contract_q1",
          areaId: "re_offer_contract",
          type: "single",
          question:
            "When you submit or receive an offer, how do you keep your client informed throughout the negotiation?",
          options: [
            "Phone calls when there's news — they wait otherwise",
            "I update them when I can but communication can lag",
            "I try to communicate at every development",
            "Systematic updates at every stage — they always know exactly where things stand",
          ],
        },
        {
          id: "re_offer_contract_q2",
          areaId: "re_offer_contract",
          type: "single",
          question:
            "Do you have a process to present multiple offer scenarios to buyers or sellers — not just the headline number but net proceeds, contingencies, and risk?",
          options: [
            "No — I walk them through the numbers and share my take, but there's no formal process",
            "I explain the key points verbally",
            "I walk through the main terms in detail",
            "Yes — I have a formal comparative presentation that helps clients make informed decisions",
          ],
        },
        {
          id: "re_offer_contract_q3",
          areaId: "re_offer_contract",
          type: "single",
          question:
            "When a deal falls through — inspection issues, financing falling apart, seller rejecting — do you have a systematic process to re-engage and keep the client moving forward?",
          options: [
            "Not really — I regroup and start over informally",
            "I check in and encourage them",
            "I have a loose process for getting back on track",
            "Yes — a re-engagement sequence fires automatically when a deal collapses to keep momentum",
          ],
        },
        {
          id: "re_offer_contract_q4",
          areaId: "re_offer_contract",
          type: "single",
          question:
            "Do you track every active offer — its status, contingency deadlines, and next required actions — in one place?",
          options: [
            "No — I manage it mentally or in email",
            "I use notes or a spreadsheet but it's not systematic",
            "I track it in my CRM but not consistently",
            "Yes — every offer has a status and every deadline is tracked with automated reminders",
          ],
        },
        {
          id: "re_offer_contract_q5",
          areaId: "re_offer_contract",
          type: "single",
          question:
            "When negotiations get complex, do clients feel informed and confident — or anxious and in the dark?",
          options: [
            "Often anxious — I'm moving fast and communication can slip",
            "Mostly informed but sometimes gaps",
            "Generally well informed",
            "Always informed — systematic communication eliminates anxiety",
          ],
        },
      ],
    },

    // ── 6. Transaction Coordination ───────────────────────────────────────────────
    {
      id: "re_transaction_coord",
      name: "Transaction Coordination",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "The average real estate transaction has 180+ individual tasks from contract to close. Agents who manage this manually miss an average of 12–18% of key milestones. A missed deadline in real estate doesn't just cause stress — it can kill the deal and the commission. — Real Estate Transaction Management Research",
      softwareOptions: [
        "Dotloop",
        "Skyslope",
        "Transaction Desk",
        "Brokermint",
        "Follow Up Boss",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_transaction_coord_q1",
          areaId: "re_transaction_coord",
          type: "single",
          question:
            "Once a contract is signed, how do you manage all the moving parts — inspections, appraisals, financing, title, closing?",
          options: [
            "In my head and email — I track it myself",
            "A spreadsheet or checklist I manage manually",
            "I use transaction management software but manage it myself",
            "A transaction coordinator — human or automated — manages the timeline and I supervise",
          ],
        },
        {
          id: "re_transaction_coord_q2",
          areaId: "re_transaction_coord",
          type: "single",
          question:
            "Do all parties — buyers, sellers, lenders, title, attorneys — know what they need to do and by when at every stage of the transaction?",
          options: [
            "Not always — communication gaps happen",
            "Mostly — but I have to chase people sometimes",
            "Generally yes — I stay on top of it",
            "Yes — automated updates and reminders go to every party at every milestone",
          ],
        },
        {
          id: "re_transaction_coord_q3",
          areaId: "re_transaction_coord",
          type: "single",
          question:
            "How often do transactions have close call moments — missed deadlines, last-minute scrambles, or near-falls — that could have been avoided with better coordination?",
          options: [
            "Frequently — it's stressful almost every time",
            "Sometimes — a few times a month",
            "Occasionally — maybe once a quarter",
            "Rarely — our process is tight and problems are caught early",
          ],
        },
        {
          id: "re_transaction_coord_q4",
          areaId: "re_transaction_coord",
          type: "single",
          question:
            "Do you have a written timeline and checklist for every transaction that every party can reference?",
          options: [
            "No — it's managed verbally and by email",
            "I have a general checklist I use informally",
            "I have a checklist I share with clients",
            "Yes — every transaction has a shared timeline with automated milestone tracking",
          ],
        },
        {
          id: "re_transaction_coord_q5",
          areaId: "re_transaction_coord",
          type: "single",
          question:
            "When a transaction closes, does anything trigger automatically — review request, referral ask, post-close follow-up?",
          options: [
            "Nothing — I handle it manually when I remember",
            "I try to follow up but it's inconsistent",
            "A few things are manual but I usually get to them",
            "Yes — closing triggers an automated post-close sequence without me doing anything",
          ],
        },
      ],
    },

    // ── 7. Client Communication ───────────────────────────────────────────────────
    {
      id: "re_client_communication",
      name: "Client Communication",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "The number one complaint from real estate clients — cited in 74% of negative reviews — is not hearing from their agent often enough. Poor communication costs more referrals than poor performance. Clients forgive mistakes. They don't forgive silence. — NAR Profile of Home Buyers and Sellers, Negative Review Analysis",
      softwareOptions: [
        "Follow Up Boss",
        "GoHighLevel (GHL)",
        "KVCore",
        "BoomTown",
        "Mailchimp",
        "ActiveCampaign",
        "Email",
        "Text Message",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_client_communication_q1",
          areaId: "re_client_communication",
          type: "single",
          question:
            "How do you handle client messages and questions that come in outside business hours?",
          options: [
            "They wait until I'm available — sometimes the next day",
            "I check and respond when I can",
            "I have someone who covers after hours sometimes",
            "An automated system acknowledges every message immediately and I follow up during business hours",
          ],
        },
        {
          id: "re_client_communication_q2",
          areaId: "re_client_communication",
          type: "single",
          question:
            "Do buyers and sellers receive consistent communication throughout the process — or does it depend on how busy you are?",
          options: [
            "It depends heavily on my workload",
            "I try to be consistent but it varies",
            "Mostly consistent — a few things slip when I'm busy",
            "Fully consistent — communication is automated at every milestone regardless of my schedule",
          ],
        },
        {
          id: "re_client_communication_q3",
          areaId: "re_client_communication",
          type: "single",
          question:
            "Do you communicate market updates, relevant listings, or neighborhood news to your database on a regular schedule?",
          options: [
            "No — I reach out when I have something to sell",
            "Occasionally — when I think of it",
            "Monthly or so — I send some market updates",
            "Yes — a regular automated content sequence keeps me top of mind with my entire database",
          ],
        },
        {
          id: "re_client_communication_q4",
          areaId: "re_client_communication",
          type: "single",
          question:
            "When a client doesn't hear from you for a while, do they feel forgotten?",
          options: [
            "Probably — I know I go quiet during busy periods",
            "Sometimes — I try to check in but it slips",
            "Rarely — I make an effort to stay in touch",
            "Never — automated touchpoints keep me present even when I'm slammed",
          ],
        },
        {
          id: "re_client_communication_q5",
          areaId: "re_client_communication",
          type: "single",
          question:
            "Can clients reach you 24/7 for urgent questions — or do they have to wait?",
          options: [
            "Business hours only — and I sometimes miss things even then",
            "I try to be available but no formal system",
            "After-hours messages get a response first thing in the morning",
            "Yes — an AI handles after-hours inquiries and urgent questions around the clock",
          ],
        },
      ],
    },

    // ── 8. Reviews & Reputation ───────────────────────────────────────────────────
    {
      id: "re_reviews_reputation",
      name: "Reviews & Reputation",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "86% of buyers and sellers check online reviews before choosing a real estate agent. Agents with 20 or more reviews close 3x more inbound leads than agents with fewer than 5. One closing per month with a systematic review request program generates 12 new reviews per year — compounding every year you run it. — BrightLocal Consumer Review Survey 2024",
      softwareOptions: [
        "Google Business Profile",
        "Zillow",
        "Realtor.com",
        "Birdeye",
        "Podium",
        "NiceJob",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_reviews_reputation_q1",
          areaId: "re_reviews_reputation",
          type: "single",
          question:
            "How do you currently ask clients for reviews after a closing?",
          options: [
            "I don't — I hope they leave them on their own",
            "I ask verbally at closing if I remember",
            "I send a text or email sometimes after close",
            "An automated review request goes out to every client at the right moment after every closing",
          ],
        },
        {
          id: "re_reviews_reputation_q2",
          areaId: "re_reviews_reputation",
          type: "single",
          question:
            "How quickly after closing does a review request go out?",
          options: [
            "It doesn't — or only when I remember weeks later",
            "A few days after closing when I think of it",
            "Within 24–48 hours",
            "Within hours of closing — automatically",
          ],
        },
        {
          id: "re_reviews_reputation_q3",
          areaId: "re_reviews_reputation",
          type: "single",
          question:
            "How many new Google or Zillow reviews have you received in the last 90 days?",
          options: [
            "0 to 2",
            "3 to 6",
            "7 to 12",
            "13 or more",
          ],
        },
        {
          id: "re_reviews_reputation_q4",
          areaId: "re_reviews_reputation",
          type: "single",
          question: "Do you respond to every review — positive and negative?",
          options: [
            "No — I rarely respond",
            "I respond to negative reviews when I see them",
            "I respond to most reviews when I remember",
            "Yes — every review gets a response within 24 hours",
          ],
        },
        {
          id: "re_reviews_reputation_q5",
          areaId: "re_reviews_reputation",
          type: "single",
          question:
            "Are you actively building your review count on the platforms where buyers and sellers actually look — Google, Zillow, Realtor.com?",
          options: [
            "Not really — I have whatever reviews I have",
            "Just Google",
            "Google and Zillow",
            "Yes — I actively manage and build reviews on all major platforms",
          ],
        },
      ],
    },

    // ── 9. Referral & Sphere of Influence Management ──────────────────────────────
    {
      id: "re_referral_sphere",
      name: "Referral & Sphere of Influence",
      leakageType: "revenue-based",
      leakageRate: 0.15,
      industryBenchmarkStat:
        "88% of buyers say they would use their agent again or refer them — but only 12% actually do. The gap isn't caused by bad service. It's caused by silence. 91% of agents never contact past clients after closing. The agents who build referral-driven businesses average 12+ touchpoints per year with their sphere. — NAR 2025 Profile of Home Buyers and Sellers",
      softwareOptions: [
        "Follow Up Boss",
        "GoHighLevel (GHL)",
        "LionDesk",
        "KVCore",
        "Mailchimp",
        "BombBomb",
        "ReferralHero",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_referral_sphere_q1",
          areaId: "re_referral_sphere",
          type: "single",
          question:
            "Do you have a formal process to ask every satisfied client for a referral — or does it happen organically?",
          options: [
            "Entirely organic — I never formally ask",
            "I mention it occasionally but nothing is systematic",
            "I ask most clients but it's informal",
            "Yes — every closing includes a structured referral ask, and my database gets regular referral-focused touches",
          ],
        },
        {
          id: "re_referral_sphere_q2",
          areaId: "re_referral_sphere",
          type: "single",
          question:
            "How often do you reach out to your sphere of influence — past clients, family, friends, colleagues — just to stay top of mind?",
          options: [
            "Rarely — mostly when I have something to sell",
            "A few times a year",
            "Monthly or so",
            "Consistently — automated touchpoints keep me in front of my sphere on a regular schedule",
          ],
        },
        {
          id: "re_referral_sphere_q3",
          areaId: "re_referral_sphere",
          type: "single",
          question:
            "Do you know which people in your database have referred business to you — and do you treat them differently?",
          options: [
            "No — referrals just show up and I don't know who sent them",
            "I have a rough idea of my top referrers",
            "I track it manually",
            "Yes — referral sources are tracked and top referrers get special attention and recognition",
          ],
        },
        {
          id: "re_referral_sphere_q4",
          areaId: "re_referral_sphere",
          type: "single",
          question:
            "Do past clients remember your name when their friends and family need a real estate agent — or have they forgotten you?",
          options: [
            "Honestly — probably forgotten after a year or two",
            "Some remember, some don't",
            "Most remember — I stay somewhat in touch",
            "Yes — systematic touchpoints ensure I'm the first name they think of",
          ],
        },
        {
          id: "re_referral_sphere_q5",
          areaId: "re_referral_sphere",
          type: "single",
          question:
            "What percentage of your business currently comes from referrals and repeat clients?",
          options: [
            "Less than 20% — I depend heavily on lead platforms",
            "20–40%",
            "40–60%",
            "Over 60% — referrals and repeat business drive most of my production",
          ],
        },
      ],
    },

    // ── 10. Listing Marketing & Syndication ───────────────────────────────────────
    {
      id: "re_listing_marketing",
      name: "Listing Marketing & Syndication",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "Listings with professional photos sell 32% faster and for up to 11% more than comparable listings with amateur photography. Sellers who receive weekly marketing activity reports are 47% more likely to refer their agent — regardless of how the sale went. — Redfin Listing Performance Research / NAR Profile of Home Buyers and Sellers",
      softwareOptions: [
        "MLS",
        "Zillow",
        "Realtor.com",
        "Canva",
        "BombBomb",
        "Mailchimp",
        "GoHighLevel (GHL)",
        "BoxBrownie",
        "Matterport",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_listing_marketing_q1",
          areaId: "re_listing_marketing",
          type: "single",
          question:
            "When you take a new listing, how quickly does it go live across all major platforms — MLS, Zillow, Realtor.com, your website, and social media?",
          options: [
            "A few days — I manage it manually and it takes time",
            "Within a day or two",
            "Same day — I have a process but it's mostly manual",
            "Within hours — an automated syndication system handles distribution immediately",
          ],
        },
        {
          id: "re_listing_marketing_q2",
          areaId: "re_listing_marketing",
          type: "single",
          question:
            "Does every listing get a full marketing package — professional photos, a compelling description, a property website, social media posts, and email to your database?",
          options: [
            "Basic MLS listing only — no extras",
            "Photos and MLS — limited extras",
            "Most of the above — I do what I can",
            "Yes — every listing gets the full package, deployed systematically",
          ],
        },
        {
          id: "re_listing_marketing_q3",
          areaId: "re_listing_marketing",
          type: "single",
          question:
            "Do sellers receive regular marketing activity reports — how many views, how many showings, what the market feedback is?",
          options: [
            "No — they hear from me when there's news",
            "I update them when I think of it",
            "Weekly check-in calls",
            "Yes — automated weekly reports go out to every seller showing full marketing activity",
          ],
        },
        {
          id: "re_listing_marketing_q4",
          areaId: "re_listing_marketing",
          type: "single",
          question:
            "Do you have a social media content engine that promotes your listings — or do you post manually when you remember?",
          options: [
            "No social media presence for listings",
            "I post occasionally when I remember",
            "I post most listings but it's manual and inconsistent",
            "Yes — every listing is automatically promoted across my social channels with a consistent cadence",
          ],
        },
        {
          id: "re_listing_marketing_q5",
          areaId: "re_listing_marketing",
          type: "single",
          question:
            "When a listing gets price-reduced or has a status change, does your marketing automatically update across all platforms?",
          options: [
            "No — I update things manually and sometimes things slip",
            "I try to update promptly but it's manual",
            "I have a process but it takes time",
            "Yes — status changes trigger automatic updates across all platforms immediately",
          ],
        },
      ],
    },

    // ── 11. Post-Close Follow-Up ──────────────────────────────────────────────────
    {
      id: "re_post_close",
      name: "Post-Close Follow-Up",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "Acquiring a new real estate client costs 5–7x more than retaining a past one. The average homeowner moves every 7 years. An agent with 100 past clients who runs a systematic post-close follow-up program has a pipeline of 14–15 transactions per year — without spending a dollar on lead generation. — NAR Profile of Home Buyers and Sellers (median homeowner tenure: 10 years)",
      softwareOptions: [
        "Follow Up Boss",
        "GoHighLevel (GHL)",
        "LionDesk",
        "KVCore",
        "Mailchimp",
        "BombBomb",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_post_close_q1",
          areaId: "re_post_close",
          type: "single",
          question:
            "After a closing, how long before you reach out to a past client again?",
          options: [
            "Rarely — unless they reach out first",
            "Maybe around the holidays",
            "A few times a year informally",
            "On a defined schedule — move-in anniversary, market updates, seasonal check-ins — all automated",
          ],
        },
        {
          id: "re_post_close_q2",
          areaId: "re_post_close",
          type: "single",
          question: "Do past clients hear from you on their move-in anniversary?",
          options: [
            "No",
            "I try to remember but it slips",
            "Sometimes — if I have a reminder set",
            "Yes — every past client gets an anniversary message automatically",
          ],
        },
        {
          id: "re_post_close_q3",
          areaId: "re_post_close",
          type: "single",
          question:
            "Do you send past clients relevant market updates — what their home is worth now, what's happening in their neighborhood?",
          options: [
            "No — I don't have a system for this",
            "Occasionally when I think of it",
            "A few times a year",
            "Yes — automated market updates go to every past client on a regular schedule",
          ],
        },
        {
          id: "re_post_close_q4",
          areaId: "re_post_close",
          type: "single",
          question:
            "When a past client is ready to move again — upgrade, downsize, invest — are you the first agent they think of?",
          options: [
            "Honestly, probably not if it's been more than a year",
            "Some of them — the ones I've stayed in touch with",
            "Most of them — I make an effort to stay in touch",
            "Yes — systematic touchpoints make sure I'm top of mind when they're ready",
          ],
        },
        {
          id: "re_post_close_q5",
          areaId: "re_post_close",
          type: "single",
          question:
            "Do past clients refer their friends and family to you — or do they have to be reminded you're still in real estate?",
          options: [
            "They often don't know I'm still active — I've lost touch",
            "Some refer me but it's inconsistent",
            "I get referrals from most past clients eventually",
            "Yes — regular touchpoints keep me top of mind and referrals flow consistently",
          ],
        },
      ],
    },

    // ── 12. Business Visibility & Reporting ───────────────────────────────────────
    {
      id: "re_reporting",
      name: "Business Visibility & Reporting",
      leakageType: "multiplier",
      leakageRate: 0.4,
      industryBenchmarkStat:
        "Real estate agents who track their lead sources, conversion rates, and pipeline value close 2.8x more transactions per year than those who don't. Without visibility into your numbers, you can't see problems coming — you can only feel them when the commission checks stop arriving. — Real Estate CRM & Analytics Research",
      softwareOptions: [
        "Follow Up Boss",
        "KVCore",
        "BoomTown",
        "CoStar",
        "Google Analytics",
        "Databox",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "re_reporting_q1",
          areaId: "re_reporting",
          type: "single",
          question:
            "Do you know which lead sources — Zillow, referrals, your website, social media — are producing your actual closings?",
          options: [
            "No — I have no idea which sources produce transactions",
            "I have a rough sense but nothing tracked",
            "I track some sources manually",
            "Yes — I can see exactly which channels produce leads and which produce closed transactions",
          ],
        },
        {
          id: "re_reporting_q2",
          areaId: "re_reporting",
          type: "single",
          question:
            "Do you review your business metrics — GCI, conversion rates, average days to close, pipeline value — on a regular schedule?",
          options: [
            "Rarely or never",
            "Once in a while when something feels off",
            "Monthly — I check the basics",
            "Weekly — I have a dashboard and review it consistently",
          ],
        },
        {
          id: "re_reporting_q3",
          areaId: "re_reporting",
          type: "single",
          question:
            "Do you know your lead-to-close conversion rate — how many leads it takes to produce one transaction?",
          options: [
            "No — I don't track this",
            "I have a rough idea",
            "I calculate it sometimes",
            "Yes — I know exactly and I use it to forecast my pipeline",
          ],
        },
        {
          id: "re_reporting_q4",
          areaId: "re_reporting",
          type: "single",
          question:
            "If your pipeline dried up right now, would you know — or would you feel it months later when closings stop?",
          options: [
            "I'd feel it months later — I have no forward visibility",
            "I'd have a general sense but no real data",
            "I'd notice within a few weeks",
            "I'd know immediately — I review pipeline value and velocity regularly",
          ],
        },
        {
          id: "re_reporting_q5",
          areaId: "re_reporting",
          type: "single",
          question:
            "Do you have a way to catch problems early — dropping conversion rates, leads going cold, referral activity declining — before they show up as lost income?",
          options: [
            "No — problems show up as lost income months later",
            "I notice things when they're already bad",
            "I check in periodically and catch some things",
            "Yes — I track leading indicators and catch problems before they compound",
          ],
        },
      ],
    },
  ],

  // ─── Leakage formula lookup ───────────────────────────────────────────────────
  leakageFormula: {
    re_lead_capture:             0.25,
    re_lead_nurture:             0.20,
    re_buyer_seller_onboarding:  0.05,
    re_showing_scheduling:       0.07,
    re_offer_contract:           0.06,
    re_transaction_coord:        0.07,
    re_client_communication:     0.05,
    re_reviews_reputation:       0.08,
    re_referral_sphere:          0.15,
    re_listing_marketing:        0.07,
    re_post_close:               0.10,
    re_reporting:                0.40,
  },

  // ─── AI prompt additions ──────────────────────────────────────────────────────
  aiPromptAdditions: `VERTICAL CONTEXT: Real Estate — Agent / Broker Practice

This audit is for a real estate agent or broker. All analysis, framing, and recommendations must reflect the economics and vocabulary of a real estate practice.

TERMINOLOGY — use these consistently:
- "transactions" or "closings" — not "jobs" or "projects"
- "commission" or "GCI" (Gross Commission Income) — not "revenue" where avoidable
- "leads" — not "inquiries" or "prospects"
- "clients" — not "customers"
- "listings" — not "products" or "inventory"
- "sphere of influence" or "SOI" — agents know this term well, use it
- "pipeline" — not "funnel"
- "contract to close" — not "job completion"
- "showing" — not "appointment" for property visits
- "avg_job_value" in formulas = average commission per transaction
- "commission" — always use when referencing agent income. "Your commission on this transaction" not "your revenue"

PAIN POINT CONTEXT:
- Speed of response is the single most important competitive variable in real estate. Leads simultaneously reach out to multiple agents — the first responder wins the majority of the time. Frame lead capture issues around this urgency.
- Most agents have 200+ people in their sphere who would refer business if asked systematically. This is almost always the largest untapped revenue source in the practice.
- The average lead takes 6–18 months to transact. Agents who abandon leads after 3 follow-ups leave the majority of their potential business on the table.
- Past clients are the highest-converting, lowest-cost lead source in real estate. Most agents lose them to competitors through pure neglect, not dissatisfaction.
- Communication is the product. Clients are making the largest financial decision of their lives. The agent who communicates best wins the referral, not the agent who negotiates best.

COMPETITIVE CONTEXT:
- Agents compete with Zillow Flex, Realtor.com Connections, team lead distribution, and referral networks.
- Agents who depend entirely on paid lead platforms without building owned channels (sphere, referrals, post-close) are renting their business from Zillow.
- Recommendations should address building owned lead sources alongside any platform-based tactics.

PRIORITY ORDERING:
Weight these areas more heavily in Priority Actions:
1. Lead Capture & Response Time — always top priority if score is below 70. Speed of response is the single largest lever in real estate.
2. Referral & Sphere of Influence — almost always the highest-ROI area. Past clients and SOI are the cheapest leads available.
3. Post-Close Follow-Up — directly feeds referrals. Neglected past clients are the most common revenue leak in the practice.
4. Lead Nurture & Follow-Up — most agents abandon leads too early. Long-term nurture is where transactions are won.

STACK RECOMMENDATION RULES:
- GoHighLevel is the automation and communication layer — CRM, lead follow-up, nurture sequences, review requests, referral campaigns, post-close sequences.
- Transaction management (Dotloop, Skyslope) and showing management (ShowingTime, BrokerBay) are specialized tools. Never recommend GHL as a replacement for these.
- Follow Up Boss is the most common real estate CRM. If a client has it and scores poorly, the issue is CONFIGURE not REPLACE.
- KVCore, BoomTown, and Sierra Interactive are full platform solutions (IDX + CRM + leads). If a client has one and scores poorly, CONFIGURE.
- Recommending a new platform to a client with an existing real estate CRM should be a last resort — data migration is painful in real estate.

CONFIGURE PATTERN — REAL ESTATE CRMs:
If a client lists Follow Up Boss, KVCore, BoomTown, LionDesk, Real Geeks, or Sierra Interactive AND scores poorly on lead capture, lead nurture, or client communication — the stack action MUST be CONFIGURE, not REPLACE or DEPLOY. These platforms are capable. Poor scores mean the platform is not being used, not that it's the wrong tool.

SUB-TYPE VOCABULARY — MANDATORY ENFORCEMENT BASED ON re_focus_type:
Use the re_focus_type answer to adapt tone and examples. Generic residential vocabulary applied to non-residential brokers is unacceptable.

- "Residential sales — buyers and sellers" → "buyers," "sellers," "listings," "showings," "transactions"
- "Luxury or high-end residential" → "high-net-worth clients," "private listings," "exclusive representation," "white-glove service"
- "Commercial real estate" → "tenants," "landlords," "investors," "lease," "cap rate," "NOI"
- "Property management" → "tenants," "owners," "vacancy," "lease renewals," "maintenance coordination"
- "Real estate investing / wholesaling" → "deals," "investors," "ARV," "assignment," "off-market"
- "Mixed" → use residential framing as the default, acknowledge breadth

COMMERCIAL REAL ESTATE — MANDATORY when re_focus_type is "Commercial real estate":
Commercial brokerage is fundamentally different from residential. Generic residential language ("buyer," "seller," "showing," "listing agent") applied to a commercial broker is incorrect and unacceptable.
- The report MUST use "tenant," "landlord," "investor," and "lease" — at least three of these four terms must appear by name across the findings.
- The report MUST reference at least one of: "cap rate," "NOI," "LOI," or "due diligence" by name in at least one finding — these are the language commercial brokers actually use to describe their work.
- "Tenant representation" and "investment sales" are the two dominant commercial transaction types. If the owner mentions either in their business description, the report MUST reference that specific transaction type by name in at least one finding.
- Property tours replace "showings" — when re_focus_type is commercial, prefer "property tour" over "showing."
- "Listing" in commercial context means a property representation engagement, not an MLS listing. Frame accordingly.

SIGNAL-DRIVEN ENFORCEMENT — READ THE BUSINESS DESCRIPTION CAREFULLY:
- If the owner mentions "tenant representation" or "tenant rep" in their business description, the report MUST reference tenant representation by name in at least one finding and reference landlord/owner relationships in the deal flow.
- If the owner mentions "investment sales," "investors," or "investment property" in their business description, the report MUST reference investor relationships, deal sourcing, and underwriting (cap rate, NOI) by name in at least one finding.
- If the owner mentions "industrial," "retail," "office," or other commercial property types, the report MUST reference those property type categories specifically rather than generic "properties."

If a stated focus from the business description is not reflected in the report's vocabulary and recommendations, the report is incomplete and incorrect.`,
};
