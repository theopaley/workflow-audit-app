import type { VerticalConfig } from "./types";

export const professionalServicesConfig: VerticalConfig = {
  verticalId: "professional-services",
  displayName: "Professional Services Audit",

  skipQuestions: ["intro_business", "financial_platform"],

  // ─── Intro question overrides ────────────────────────────────────────────────
  introQuestions: {
    fin_avg_sale: {
      question: "Average engagement or project value",
      options: [
        "Under $1,000",
        "$1,000–$2,500",
        "$2,500–$5,000",
        "$5,000–$10,000",
        "$10,000–$25,000",
        "$25,000–$50,000",
        "$50,000–$100,000",
        "Over $100,000",
        "I'm not sure",
        "Enter exact amount",
      ],
      midpoints: {
        "Under $1,000": 600,
        "$1,000–$2,500": 1750,
        "$2,500–$5,000": 3750,
        "$5,000–$10,000": 7500,
        "$10,000–$25,000": 17500,
        "$25,000–$50,000": 37500,
        "$50,000–$100,000": 75000,
        "Over $100,000": 150000,
        "I'm not sure": 10000,
        "Enter exact amount": 0,
      },
    },
    fin_close_rate: {
      question: "Proposal-to-engagement conversion rate",
    },
    fin_monthly_leads: {
      question: "New prospect inquiries per month",
    },
    fin_monthly_revenue: {
      question: "Average monthly revenue",
    },
    // ── New questions — injected at the intro_business position ─────────────────
    ps_firm_type: {
      id: "ps_firm_type",
      areaId: null,
      type: "single",
      question: "Which best describes your firm or practice?",
      options: [
        "Accounting, tax, or financial advisory",
        "Legal services",
        "Business or management consulting",
        "Marketing, PR, or creative agency",
        "IT consulting or managed services",
        "HR, recruiting, or executive search",
        "Coaching or advisory services",
        "Architecture, engineering, or design",
        "Other professional services",
      ],
    },
    ps_billing_model: {
      id: "ps_billing_model",
      areaId: null,
      type: "single",
      question: "Which best describes how you bill clients?",
      options: [
        "Project-based — clients pay per engagement or deliverable",
        "Hourly — clients pay for time billed",
        "Retainer — clients pay a fixed monthly fee for ongoing access or services",
        "Mixed — a combination of project, hourly, and retainer work",
      ],
    },
  },

  // ─── Workflow areas ──────────────────────────────────────────────────────────
  workflowAreas: [
    // ── 1. Lead Capture & Inquiry Response ────────────────────────────────────
    {
      id: "ps_lead_capture",
      name: "Lead Capture & Inquiry Response",
      leakageType: "lead-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "78% of professional services buyers hire the first firm that responds with a substantive answer — not the firm with the best credentials or the lowest fee. Yet the average professional services firm takes over 48 hours to respond to a new inquiry. In a market where trust is built in the first interaction, slow response signals that the prospect's business isn't a priority. — Hinge Research Institute 2024 High Growth Study / Lead Response Management Study",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "Pipedrive",
        "Zoho CRM",
        "Clio Grow",
        "Lawmatics",
        "LinkedIn",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_lead_capture_q1",
          areaId: "ps_lead_capture",
          type: "single",
          question:
            "When a new prospect reaches out — through your website, a referral, LinkedIn, or any other channel — how quickly do they typically hear back?",
          options: [
            "Days later — whenever someone gets to it",
            "Within the same business day",
            "Within a few hours",
            "Within minutes — an automated system acknowledges every inquiry immediately and sets expectations for next steps",
          ],
        },
        {
          id: "ps_lead_capture_q2",
          areaId: "ps_lead_capture",
          type: "single",
          question: "Where do most of your new client inquiries come from?",
          options: [
            "Referrals and word of mouth — almost entirely relationship-driven",
            "My professional network and COI partners",
            "Inbound — website, Google, LinkedIn, or content marketing",
            "I'm not sure — we don't track lead sources",
            "Multiple channels — inquiries come from several places and we track each one",
          ],
        },
        {
          id: "ps_lead_capture_q3",
          areaId: "ps_lead_capture",
          type: "single",
          question:
            "Do you track every prospect inquiry — where it came from, what they need, and whether it converted?",
          options: [
            "No — inquiries come in through email, phone, and referrals and we don't log them formally",
            "I keep rough notes but nothing systematic",
            "Mostly tracked but inconsistently",
            "Yes — every inquiry is in our CRM with full source tracking and current status",
          ],
        },
        {
          id: "ps_lead_capture_q4",
          areaId: "ps_lead_capture",
          type: "single",
          question:
            "Can prospects book a consultation or discovery call directly from your website — without email back-and-forth?",
          options: [
            "No — they have to call or email and we coordinate a time",
            "We have a contact form but no direct scheduling",
            "We have a booking link but it's not prominently featured",
            "Yes — one-click scheduling for consultations is prominent on our website, email signature, and LinkedIn",
          ],
        },
        {
          id: "ps_lead_capture_q5",
          areaId: "ps_lead_capture",
          type: "single",
          question:
            "When a prospect inquires outside business hours, what happens?",
          options: [
            "Nothing — it waits until we're back in the office",
            "Someone might see it and respond but it's not guaranteed",
            "We have an informal process for urgent inquiries",
            "An automated response acknowledges them immediately and books a next step",
          ],
        },
      ],
    },

    // ── 2. Proposal & Engagement Conversion ───────────────────────────────────
    {
      id: "ps_proposal",
      name: "Prospect Nurture & Proposal Follow-Up",
      leakageType: "lead-based",
      leakageRate: 0.15,
      industryBenchmarkStat:
        "The average professional services firm converts 25-35% of proposals into signed engagements. Top-performing firms convert at 50-65% — not because their proposals are better designed, but because they follow up systematically and present options rather than a single take-it-or-leave-it quote. 60% of lost proposals are lost to inaction, not to a competitor. The prospect just never got around to saying yes. — RainToday 2024 Benchmark Report on Professional Services Development / Hinge Research Institute",
      softwareOptions: [
        "PandaDoc",
        "Proposify",
        "HoneyBook",
        "Qwilr",
        "HubSpot",
        "GoHighLevel (GHL)",
        "DocuSign",
        "Clio",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_proposal_q1",
          areaId: "ps_proposal",
          type: "single",
          question:
            "When a prospect asks for a proposal, how long does it typically take to deliver?",
          options: [
            "A week or more — proposals take time to build from scratch",
            "Several days",
            "Within 48 hours",
            "Within 24 hours — we have templated proposals that can be customized quickly",
          ],
        },
        {
          id: "ps_proposal_q2",
          areaId: "ps_proposal",
          type: "single",
          question:
            "After sending a proposal, do you have a structured follow-up process to move it to a decision?",
          options: [
            "No — we send it and wait to hear back",
            "We check in once or twice",
            "We have a loose follow-up process",
            "Yes — every proposal triggers a defined follow-up sequence with specific touchpoints and timelines",
          ],
        },
        {
          id: "ps_proposal_q3",
          areaId: "ps_proposal",
          type: "single",
          question:
            "Do you present multiple engagement options in your proposals — e.g. different scope tiers or pricing levels?",
          options: [
            "No — one scope, one price, take it or leave it",
            "Occasionally for larger engagements",
            "Sometimes — it depends on the prospect",
            "Yes — every proposal includes tiered options so the prospect can choose the level of engagement that fits",
          ],
        },
        {
          id: "ps_proposal_q4",
          areaId: "ps_proposal",
          type: "single",
          question:
            "Do you track your proposal-to-engagement conversion rate — and do you know why you win and lose?",
          options: [
            "No — I don't track this",
            "I have a rough sense but nothing calculated",
            "I track it occasionally",
            "Yes — I know my conversion rate and I document win/loss reasons to improve my process",
          ],
        },
        {
          id: "ps_proposal_q5",
          areaId: "ps_proposal",
          type: "single",
          question:
            "When a prospect declines a proposal, do you have a process to stay in touch for future needs?",
          options: [
            "No — a declined proposal is a dead lead",
            "I might follow up once or twice eventually",
            "I put a reminder to check in later",
            "Yes — declined prospects enter an automated nurture sequence so we're top-of-mind when their need returns",
          ],
        },
      ],
    },

    // ── 3. New Client Onboarding ──────────────────────────────────────────────
    {
      id: "ps_onboarding",
      name: "New Client Onboarding & Engagement Launch",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "The first 30 days of a professional services engagement set the tone for the entire relationship. Firms with a structured onboarding process — documented kickoff, clear deliverable timeline, named point of contact, and proactive check-ins — retain first-year clients at 2x the rate of firms that sign the engagement letter and dive straight into the work. The client's first experience after signing predicts their lifetime value. — SPI Research 2024 Professional Services Maturity Benchmark / Hinge Research Institute",
      softwareOptions: [
        "HubSpot",
        "Monday.com",
        "Asana",
        "ClickUp",
        "GoHighLevel (GHL)",
        "HoneyBook",
        "Dubsado",
        "Clio",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_onboarding_q1",
          areaId: "ps_onboarding",
          type: "single",
          question:
            "When a new client signs an engagement letter, what do they experience in the first week?",
          options: [
            "We start the work — no formal onboarding process",
            "A welcome email with basic logistics",
            "A kickoff call and some initial documentation",
            "A structured onboarding experience — welcome package, kickoff meeting, deliverable timeline, named contacts, and proactive check-ins on a defined schedule",
          ],
        },
        {
          id: "ps_onboarding_q2",
          areaId: "ps_onboarding",
          type: "single",
          question:
            "Does every new client have a named point of contact who is responsible for their experience — and does the client know who it is?",
          options: [
            "Not always — the client works with whoever is available",
            "Technically yes but it's not made explicit",
            "Yes but handoffs between team members are sometimes unclear",
            "Yes — every client has a named lead, is introduced to them personally, and knows exactly how to reach them",
          ],
        },
        {
          id: "ps_onboarding_q3",
          areaId: "ps_onboarding",
          type: "single",
          question:
            "Do new clients receive a clear project timeline or scope document in the first week — not just the engagement letter?",
          options: [
            "No — the engagement letter is all they get until work begins",
            "Verbally — we discuss timelines but don't document them",
            "Usually — but it depends on who's managing the engagement",
            "Yes — every new client receives a documented timeline, milestone schedule, and clear expectations before work begins",
          ],
        },
        {
          id: "ps_onboarding_q4",
          areaId: "ps_onboarding",
          type: "single",
          question:
            "How consistent is the new client experience when your team is busy versus when you have more bandwidth?",
          options: [
            "It varies a lot depending on workload",
            "We try to be consistent but things slip when we're slammed",
            "Mostly consistent for most clients",
            "Fully consistent — onboarding is systematized and runs the same way regardless of team workload",
          ],
        },
        {
          id: "ps_onboarding_q5",
          areaId: "ps_onboarding",
          type: "single",
          question:
            "Do you collect structured feedback from new clients in the first 30 days — a quick check-in on how the experience is going?",
          options: [
            "No — we assume no news is good news",
            "Informally — if something comes up in conversation",
            "For larger engagements sometimes",
            "Yes — every new client receives a structured 30-day check-in to surface issues early and confirm expectations are being met",
          ],
        },
      ],
    },

    // ── 4. Scope Management & Change Orders ───────────────────────────────────
    {
      id: "ps_scope",
      name: "Service Delivery & Scope Management",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "Professional services firms lose an average of 11-15% of project value to scope creep — work delivered but never billed. The root cause is rarely a bad client; it's an unclear scope boundary and no documented change order process. Firms with a formal change order workflow recover 90% of out-of-scope work. Firms without one absorb it silently and wonder why margins are thin. — SPI Research 2024 Professional Services Maturity Benchmark / Deltek Clarity Report",
      softwareOptions: [
        "Monday.com",
        "Asana",
        "ClickUp",
        "Harvest",
        "Toggl",
        "Karbon",
        "Clio",
        "FreshBooks",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_scope_q1",
          areaId: "ps_scope",
          type: "single",
          question:
            "When a client asks for work that's outside the original scope, how does your team handle it?",
          options: [
            "We usually just do it — it's easier than having the conversation",
            "It depends on who's managing the project — some push back, some don't",
            "We flag it but don't always formalize a change order",
            "Every out-of-scope request triggers a documented change order with clear pricing and timeline impact before work begins",
          ],
        },
        {
          id: "ps_scope_q2",
          areaId: "ps_scope",
          type: "single",
          question:
            "Do your engagement letters or SOWs clearly define what's included — and, just as importantly, what's not?",
          options: [
            "Not really — our scope language is vague",
            "Generally yes, but exclusions are unclear",
            "Mostly clear for larger engagements",
            "Yes — every engagement has a detailed scope with explicit inclusions and exclusions that the client reviews before signing",
          ],
        },
        {
          id: "ps_scope_q3",
          areaId: "ps_scope",
          type: "single",
          question:
            "What percentage of your engagements would you estimate involve some amount of unbilled scope creep?",
          options: [
            "More than half — scope creep is a constant problem",
            "Around 30-50%",
            "Around 10-30%",
            "I'm not sure — we don't track this",
            "Under 10% — we have a process that catches scope creep before it becomes unbilled work",
          ],
        },
        {
          id: "ps_scope_q4",
          areaId: "ps_scope",
          type: "single",
          question:
            "Do you track project profitability at the engagement level — actual hours and costs versus what was scoped and billed?",
          options: [
            "No — we don't track this at the project level",
            "We have a rough sense for larger projects",
            "We track it for some engagements",
            "Yes — every engagement has a profitability calculation comparing estimated versus actual effort and revenue",
          ],
        },
        {
          id: "ps_scope_q5",
          areaId: "ps_scope",
          type: "single",
          question:
            "When a project is running over budget or behind schedule, how quickly does your team identify it?",
          options: [
            "Usually after the project is done — when we calculate the margin",
            "When it becomes obvious — often too late to correct",
            "We catch it eventually but not consistently early",
            "Immediately — project dashboards surface budget and schedule variances in real time",
          ],
        },
      ],
    },

    // ── 5. Time Tracking & Utilization ────────────────────────────────────────
    {
      id: "ps_expansion",
      name: "Engagement Expansion & Cross-Sell",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "The average professional services firm has a billable utilization rate of 60-68%. Top-performing firms operate at 75-85%. Every 5-percentage-point improvement in utilization adds 10-15% to the bottom line without adding a single new client. Most firms don't know their utilization rate — they bill what they remember, not what they actually worked. — SPI Research 2024 Professional Services Maturity Benchmark / Toggl 2024 Time Tracking Insights Report",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "Pipedrive",
        "Karbon",
        "Monday.com",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_expansion_q1",
          areaId: "ps_expansion",
          type: "single",
          question:
            "How does your team track billable time — and how consistently is it captured?",
          options: [
            "We don't track time formally — we bill by project or estimate hours after the fact",
            "We track time but entries are often late, incomplete, or estimated at the end of the week",
            "Most team members track time daily but there are gaps",
            "Time is tracked in real-time — every billable minute is captured as it happens, and entries are reviewed weekly",
          ],
        },
        {
          id: "ps_expansion_q2",
          areaId: "ps_expansion",
          type: "single",
          question:
            "Do you know your firm's current billable utilization rate — what percentage of available hours are billed to clients?",
          options: [
            "No — I've never calculated this",
            "I have a rough sense but nothing precise",
            "I calculate it occasionally",
            "Yes — I track utilization by team member and by practice area, and I know how it trends over time",
          ],
        },
        {
          id: "ps_expansion_q3",
          areaId: "ps_expansion",
          type: "single",
          question:
            "How much billable time do you estimate goes unrecorded each week — work that was done but never logged?",
          options: [
            "A significant amount — 5+ hours per person per week is probably lost",
            "A few hours per person — quick calls, emails, and small tasks slip through",
            "Minimal — most work is captured",
            "Nearly zero — our time tracking process catches everything, including short tasks and communications",
          ],
        },
        {
          id: "ps_expansion_q4",
          areaId: "ps_expansion",
          type: "single",
          question:
            "Do you review time entries before invoicing — to catch missed entries, incorrect codes, or unbilled work?",
          options: [
            "No — whatever is in the system goes on the invoice",
            "Occasionally for large invoices",
            "We review most invoices but not systematically",
            "Yes — every invoice is reviewed against project scope and time entries before it goes out",
          ],
        },
        {
          id: "ps_expansion_q5",
          areaId: "ps_expansion",
          type: "single",
          question:
            "Do you use time data to improve pricing, scoping, and resource allocation — or just for invoicing?",
          options: [
            "Just for invoicing — we don't analyze time data",
            "Occasionally — we look at it when pricing feels off",
            "We reference it for pricing but not systematically",
            "Yes — historical time data directly informs how we scope, price, and staff every new engagement",
          ],
        },
      ],
    },

    // ── 6. Client Retention & Account Growth ──────────────────────────────────
    {
      id: "ps_retention",
      name: "Client Retention & Relationship Management",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "It costs 5-7x more to acquire a new professional services client than to retain an existing one. Yet most firms have no formal retention process — the relationship depends entirely on the individual managing the account. When that person leaves, the client often follows. Firms with a systematic account management process retain clients at 85-90%. Firms without one average 65-70%. — Hinge Research Institute 2024 High Growth Study / SPI Research Professional Services Benchmark",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "Pipedrive",
        "Monday.com",
        "Clio",
        "HoneyBook",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_retention_q1",
          areaId: "ps_retention",
          type: "single",
          question:
            "Do you have a structured process to identify and pursue additional engagement opportunities within existing client accounts?",
          options: [
            "No — additional work comes when clients ask for it",
            "We mention other services informally when it comes up",
            "We review accounts for expansion opportunities occasionally",
            "Yes — every client account has a documented growth plan, and we systematically present additional services at the right moments",
          ],
        },
        {
          id: "ps_retention_q2",
          areaId: "ps_retention",
          type: "single",
          question:
            "Do your existing clients receive regular touchpoints from your firm — not just around active engagements or invoice time?",
          options: [
            "Rarely or never — we reach out when there's work to do or a bill to send",
            "Occasionally around holidays or firm news",
            "A few times a year with relevant updates or insights",
            "Consistently — a regular cadence of value-driven communication runs to our full client base year-round",
          ],
        },
        {
          id: "ps_retention_q3",
          areaId: "ps_retention",
          type: "single",
          question:
            "Do you conduct annual or semi-annual account reviews with key clients — a structured conversation about their needs, satisfaction, and upcoming plans?",
          options: [
            "No — we review accounts informally when something comes up",
            "For our very largest clients only",
            "For clients above a certain revenue threshold",
            "Yes — every client above a defined threshold receives a structured review on the calendar",
          ],
        },
        {
          id: "ps_retention_q4",
          areaId: "ps_retention",
          type: "single",
          question:
            "When a key client contact leaves their organization, do you have a process to protect the relationship?",
          options: [
            "No — we find out when they stop calling",
            "We try to reach out to the replacement but it's not systematic",
            "We have a loose transition process for large accounts",
            "Yes — key contact changes trigger an immediate outreach and onboarding process for the successor",
          ],
        },
        {
          id: "ps_retention_q5",
          areaId: "ps_retention",
          type: "single",
          question:
            "What percentage of your revenue comes from clients you've served for more than two years?",
          options: [
            "Less than 30% — most revenue comes from newer clients",
            "30-50%",
            "50-70%",
            "Over 70% — long-term client relationships are the foundation of our revenue",
          ],
        },
      ],
    },

    // ── 7. Invoicing & Collections ────────────────────────────────────────────
    {
      id: "ps_retainer",
      name: "Retainer & Recurring Revenue Development",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "Professional services firms carry an average of 45-60 days in outstanding receivables. The industry benchmark for top-performing firms is under 30 days. Every $100,000 in annual revenue at 60 DSO versus 30 DSO means $8,200 in cash permanently tied up. Beyond the cash flow impact, late invoicing signals that your work isn't a priority — if you don't bill promptly, clients assume the work wasn't important enough to track. — Deltek 2024 Clarity Report / QuickBooks 2024 Cash Flow Survey",
      softwareOptions: [
        "QuickBooks",
        "FreshBooks",
        "Xero",
        "Clio",
        "HoneyBook",
        "Harvest",
        "Stripe",
        "Square",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_retainer_q1",
          areaId: "ps_retainer",
          type: "single",
          question:
            "How quickly after completing work or reaching a billing milestone do invoices go out?",
          options: [
            "Weeks later — invoicing piles up until someone gets to it",
            "Within a week or two",
            "Within a few days of milestone completion",
            "Immediately — invoices are generated and sent automatically upon milestone completion or at the scheduled billing date",
          ],
        },
        {
          id: "ps_retainer_q2",
          areaId: "ps_retainer",
          type: "single",
          question:
            "When an invoice goes past due, is there an automated follow-up process — or does someone have to remember to chase it?",
          options: [
            "Someone has to notice and follow up manually",
            "We send a reminder when we remember",
            "We have a process but it's inconsistent",
            "Yes — automated payment reminders go out on a defined schedule, escalating in urgency",
          ],
        },
        {
          id: "ps_retainer_q3",
          areaId: "ps_retainer",
          type: "single",
          question:
            "Do you know your current average days to payment — how long it takes clients to pay after invoicing?",
          options: [
            "No — I don't track this",
            "I have a rough sense from my bank account",
            "I check it occasionally",
            "Yes — I track DSO (days sales outstanding) monthly and I know whether it's improving or getting worse",
          ],
        },
        {
          id: "ps_retainer_q4",
          areaId: "ps_retainer",
          type: "single",
          question:
            "Do clients have easy ways to pay — online payment, credit card, ACH — or do they have to mail a check?",
          options: [
            "Checks only — we don't accept electronic payment",
            "We accept electronic payment but don't make it easy or prominent",
            "Online payment is available on invoices",
            "Yes — every invoice includes a one-click payment link and we offer multiple payment methods",
          ],
        },
        {
          id: "ps_retainer_q5",
          areaId: "ps_retainer",
          type: "single",
          question:
            "Do you collect a retainer deposit or upfront payment before beginning new engagements?",
          options: [
            "No — we invoice after the work is done",
            "For some engagements but not consistently",
            "For most new clients",
            "Yes — every new engagement requires a retainer or upfront payment before work begins, no exceptions",
          ],
        },
      ],
    },

    // ── 8. Client Communication & Reporting ───────────────────────────────────
    {
      id: "ps_communication",
      name: "Client Communication & Proactive Outreach",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "The number one reason professional services clients switch firms is not poor work quality — it's feeling uninformed. 72% of clients who leave cite lack of proactive communication as a primary factor. Clients don't expect perfection. They expect to know what's happening, when, and why. Firms that deliver structured, proactive status updates retain clients at 2x the rate of firms that only communicate when asked. — Hinge Research Institute 2024 / BTI Consulting Client Service A-Team Report",
      softwareOptions: [
        "HubSpot",
        "GoHighLevel (GHL)",
        "Slack",
        "Microsoft Teams",
        "Monday.com",
        "Asana",
        "Clio",
        "Email (Gmail / Outlook)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_communication_q1",
          areaId: "ps_communication",
          type: "single",
          question:
            "Do clients receive regular, proactive status updates on their engagements — or do they have to ask?",
          options: [
            "They have to ask — we update when clients reach out",
            "We send updates when there's something significant to report",
            "We try to update regularly but it's inconsistent",
            "Yes — every active engagement has a defined communication cadence with structured status updates on a predictable schedule",
          ],
        },
        {
          id: "ps_communication_q2",
          areaId: "ps_communication",
          type: "single",
          question:
            "When a client sends a question or request, how quickly do they get a response?",
          options: [
            "It depends — sometimes same day, sometimes several days",
            "Within a business day",
            "Within a few hours",
            "Within the hour — and they know exactly how to reach us for urgent matters",
          ],
        },
        {
          id: "ps_communication_q3",
          areaId: "ps_communication",
          type: "single",
          question:
            "Do you share proactive insights with clients — relevant industry changes, regulatory updates, or opportunities that affect their business?",
          options: [
            "No — communication is focused on active work only",
            "Occasionally when something major comes up",
            "We try to share relevant insights but it's not systematic",
            "Yes — clients receive regular, relevant content that positions us as a trusted advisor, not just a service provider",
          ],
        },
        {
          id: "ps_communication_q4",
          areaId: "ps_communication",
          type: "single",
          question:
            "Do clients have a clear escalation path — if they're unhappy, do they know who to contact and what to expect?",
          options: [
            "Not formally — they'd have to figure it out",
            "They can call anyone at the firm",
            "They know their primary contact but escalation isn't documented",
            "Yes — every client knows their team, the escalation path, and our response commitments",
          ],
        },
        {
          id: "ps_communication_q5",
          areaId: "ps_communication",
          type: "single",
          question:
            "At the end of an engagement, do clients receive a summary of what was accomplished — outcomes, deliverables, and recommended next steps?",
          options: [
            "No — the work ends and we move on",
            "A brief verbal recap",
            "For larger engagements sometimes",
            "Yes — every engagement concludes with a documented summary and clear next-step recommendations",
          ],
        },
      ],
    },

    // ── 9. Reviews & Professional Reputation ──────────────────────────────────
    {
      id: "ps_reviews",
      name: "Reviews & Thought Leadership",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "79% of B2B buyers check online reviews before engaging a professional services firm — even when they received a direct referral. Firms with 40+ Google reviews and active LinkedIn thought leadership generate 3x more inbound inquiries than firms with minimal online presence. In professional services, your reputation is your pipeline. If it's not visible online, it doesn't exist to the prospects searching for you. — BrightLocal 2024 Consumer Review Survey / Hinge Research Institute Visible Firm Study",
      softwareOptions: [
        "Google Business Profile",
        "LinkedIn",
        "Birdeye",
        "Podium",
        "Clutch",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_reviews_q1",
          areaId: "ps_reviews",
          type: "single",
          question:
            "How do you currently ask satisfied clients for reviews or testimonials?",
          options: [
            "We don't — we hope happy clients will leave reviews on their own",
            "We ask verbally when it comes up",
            "We send a request to some clients after a positive outcome",
            "An automated review request goes out to every client at the right moment — after a successful deliverable, a won case, or a positive quarterly review",
          ],
        },
        {
          id: "ps_reviews_q2",
          areaId: "ps_reviews",
          type: "single",
          question:
            "How many new Google reviews has your firm received in the last 90 days?",
          options: [
            "0 to 2",
            "3 to 6",
            "7 to 12",
            "I'm not sure — I don't track this",
            "13 or more",
          ],
        },
        {
          id: "ps_reviews_q3",
          areaId: "ps_reviews",
          type: "single",
          question:
            "Is your LinkedIn presence active and professional — do you or your team post regularly with content that demonstrates expertise?",
          options: [
            "LinkedIn profiles exist but are outdated or minimal",
            "Basic profiles — nothing that demonstrates thought leadership",
            "Decent profiles but posting is inconsistent",
            "Yes — active LinkedIn presence with regular content that positions us as experts in our space",
          ],
        },
        {
          id: "ps_reviews_q4",
          areaId: "ps_reviews",
          type: "single",
          question:
            "Do you collect and publish case studies or client success stories — with measurable outcomes?",
          options: [
            "No — we don't have documented case studies",
            "A few old ones on our website",
            "We create them occasionally",
            "Yes — we systematically document and publish case studies and use them in proposals, content, and sales conversations",
          ],
        },
        {
          id: "ps_reviews_q5",
          areaId: "ps_reviews",
          type: "single",
          question:
            "Do you respond to every online review — positive and negative — in a timely and professional manner?",
          options: [
            "Rarely or never",
            "We respond to negative reviews when we see them",
            "We respond to most reviews when we remember",
            "Yes — every review gets a thoughtful, professional response within 48 hours",
          ],
        },
      ],
    },

    // ── 10. Referral & COI Network ────────────────────────────────────────────
    {
      id: "ps_referral",
      name: "Referral & Center of Influence Development",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "In professional services, referrals from Centers of Influence — accountants referring to lawyers, lawyers referring to financial advisors, consultants referring to IT firms — close at 3-5x the rate of cold inquiries and have 25% higher lifetime value. Yet only 12% of professional services firms have a formal COI partnership program. The highest-quality lead source in the industry is the most underutilized. — RainToday 2024 Benchmark Report / Hinge Research Institute Referral Marketing Study",
      softwareOptions: [
        "HubSpot",
        "GoHighLevel (GHL)",
        "Salesforce",
        "LinkedIn",
        "Pipedrive",
        "ReferralHero",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_referral_q1",
          areaId: "ps_referral",
          type: "single",
          question:
            "Do you have formal referral partnerships with complementary professionals — accountants, lawyers, bankers, or consultants who serve the same clients you target?",
          options: [
            "No — referrals happen informally when someone thinks of me",
            "I have informal relationships with a few professionals",
            "Some partnerships but they're not structured or actively maintained",
            "Yes — I have documented COI partnerships with regular touchpoints, mutual referral expectations, and tracking",
          ],
        },
        {
          id: "ps_referral_q2",
          areaId: "ps_referral",
          type: "single",
          question:
            "Do you have a formal process to ask every satisfied client for referrals — or does it happen organically?",
          options: [
            "Entirely organic — we never formally ask",
            "We mention it occasionally but nothing systematic",
            "We ask most satisfied clients but the ask is informal",
            "Yes — every strong client relationship includes a structured referral ask at the right moment, and we track referral activity",
          ],
        },
        {
          id: "ps_referral_q3",
          areaId: "ps_referral",
          type: "single",
          question:
            "Do you know which clients and COI partners are your top referral sources — and do you treat them differently?",
          options: [
            "No — referrals come in and I don't know who sent them",
            "I have a rough idea of a few top referrers",
            "I track it manually sometimes",
            "Yes — referral sources are tracked in our CRM and top referrers receive systematic appreciation and recognition",
          ],
        },
        {
          id: "ps_referral_q4",
          areaId: "ps_referral",
          type: "single",
          question:
            "When a referred prospect contacts you, is there a fast, high-priority process to follow up?",
          options: [
            "They get the same treatment as any other inquiry",
            "We try to prioritize them but it's not formalized",
            "We flag referrals and follow up quickly",
            "Yes — referred prospects trigger an immediate, high-priority response with messaging that acknowledges the referral and the referring party",
          ],
        },
        {
          id: "ps_referral_q5",
          areaId: "ps_referral",
          type: "single",
          question:
            "What percentage of your new engagements currently come from referrals or COI introductions?",
          options: [
            "Less than 30% — most new business comes from other channels",
            "30-50%",
            "50-70%",
            "Over 70% — referrals and COI partnerships drive the majority of our new business",
          ],
        },
      ],
    },

    // ── 11. Lapsed Client Reactivation ────────────────────────────────────────
    {
      id: "ps_reactivation",
      name: "Lost Client Win-Back",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "The average professional services firm has a lapsed client database 2-3x the size of its active client roster. These are clients who engaged once or twice and then went quiet — not because they were dissatisfied, but because no one followed up. Win-back outreach to lapsed professional services clients produces engagement rates of 15-25% — dramatically higher than cold outreach — because trust has already been established. — Hinge Research Institute / RainToday Professional Services Development Benchmark",
      softwareOptions: [
        "HubSpot",
        "GoHighLevel (GHL)",
        "Salesforce",
        "Mailchimp",
        "ActiveCampaign",
        "Pipedrive",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_reactivation_q1",
          areaId: "ps_reactivation",
          type: "single",
          question:
            "When a client engagement ends and no new project is immediately on the horizon, do you have a process to stay in touch?",
          options: [
            "No — when the engagement ends, contact ends",
            "We might reach out occasionally but nothing systematic",
            "We send a check-in email once or twice",
            "Yes — every completed engagement triggers an automated stay-in-touch sequence with value-driven touchpoints over 12+ months",
          ],
        },
        {
          id: "ps_reactivation_q2",
          areaId: "ps_reactivation",
          type: "single",
          question:
            "Do you know the size of your lapsed client database — clients who engaged in the past but haven't worked with you in 12+ months?",
          options: [
            "No — I have no visibility into this",
            "I have a rough sense but haven't quantified it",
            "I've looked at it but don't act on it systematically",
            "Yes — I know exactly how many lapsed clients I have and I actively work to re-engage them",
          ],
        },
        {
          id: "ps_reactivation_q3",
          areaId: "ps_reactivation",
          type: "single",
          question:
            "When you reach back out to a lapsed client, do you have something relevant to offer — a regulatory change, a new service, a relevant case study?",
          options: [
            "Not really — we just ask if they need anything",
            "We try to have a reason but it's improvised",
            "We time outreach around seasonal needs or regulatory deadlines",
            "Yes — every re-engagement outreach is strategically timed with a specific, relevant reason that's valuable to the client",
          ],
        },
        {
          id: "ps_reactivation_q4",
          areaId: "ps_reactivation",
          type: "single",
          question:
            "Do you track why clients go inactive — and use that data to improve retention?",
          options: [
            "No — clients just stop calling and I'm not sure why",
            "I have a general sense but nothing data-driven",
            "I note the reason when I find out",
            "Yes — every lapsed client has a documented reason, and I review the data regularly to identify patterns",
          ],
        },
        {
          id: "ps_reactivation_q5",
          areaId: "ps_reactivation",
          type: "single",
          question:
            "Have you successfully re-engaged any lapsed clients in the last 12 months?",
          options: [
            "No — once they go quiet, they stay quiet",
            "Once or twice by accident",
            "A few — when I happened to follow up at the right time",
            "Yes — lapsed client reactivation is a regular, systematic part of our business development",
          ],
        },
      ],
    },

    // ── 12. Business Visibility & Reporting ───────────────────────────────────
    {
      id: "ps_reporting",
      name: "Business Visibility & Reporting",
      leakageType: "multiplier",
      leakageRate: 0.40,
      industryBenchmarkStat:
        "Professional services firms that track utilization, realization, pipeline value, and client lifetime value simultaneously grow 2-3x faster than firms flying blind. With an average engagement value of $5,000-$50,000 and client relationships lasting 3-7 years, the difference between an 85% retention rate and a 70% retention rate is hundreds of thousands of dollars — invisible without the right dashboard. — SPI Research 2024 Professional Services Maturity Benchmark / Deltek 2024 Clarity Report",
      softwareOptions: [
        "QuickBooks",
        "Xero",
        "HubSpot",
        "Salesforce",
        "Harvest",
        "Databox",
        "Monday.com",
        "Google Sheets / Excel",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ps_reporting_q1",
          areaId: "ps_reporting",
          type: "single",
          question:
            "Do you have real-time visibility into your key business metrics — pipeline value, utilization rate, revenue per client, outstanding receivables — without digging through reports?",
          options: [
            "No — I check the bank account and review financials quarterly",
            "I can pull reports but they're often outdated or incomplete",
            "Reasonably good visibility with some gaps",
            "Yes — a live dashboard shows every key metric at any moment",
          ],
        },
        {
          id: "ps_reporting_q2",
          areaId: "ps_reporting",
          type: "single",
          question:
            "Do you review your business metrics on a regular schedule — weekly, not just monthly or quarterly?",
          options: [
            "Rarely — I review when something feels off or at tax time",
            "Monthly or so",
            "Weekly — I look at the key numbers",
            "Yes — weekly metric review is a locked ritual with a defined format and action items",
          ],
        },
        {
          id: "ps_reporting_q3",
          areaId: "ps_reporting",
          type: "single",
          question:
            "Do you know your average client lifetime value — the total revenue a client generates over their entire relationship with your firm?",
          options: [
            "No — I've never calculated this",
            "I have a rough idea",
            "I've calculated it once or twice",
            "Yes — I know it precisely and I use it to make decisions about acquisition spend, retention investment, and client tiering",
          ],
        },
        {
          id: "ps_reporting_q4",
          areaId: "ps_reporting",
          type: "single",
          question:
            "Can you identify which services are most profitable — and which are consuming resources without delivering adequate margin?",
          options: [
            "No — I don't track profitability by service line",
            "A general sense but nothing data-driven",
            "I review it occasionally for major service lines",
            "Yes — I track profitability by service line and use it to guide pricing, staffing, and strategic focus",
          ],
        },
        {
          id: "ps_reporting_q5",
          areaId: "ps_reporting",
          type: "single",
          question:
            "If your new client pipeline dried up today, would you know — or would you feel it in the revenue number three months from now?",
          options: [
            "I'd feel it months later — I have no forward visibility",
            "I'd have a general sense something was off",
            "I'd notice within a few weeks",
            "I'd know immediately — I track pipeline, proposal activity, and lead flow weekly",
          ],
        },
      ],
    },
  ],

  // ─── Leakage formula lookup ───────────────────────────────────────────────────
  leakageFormula: {
    ps_lead_capture:    0.20,
    ps_proposal:        0.15,
    ps_onboarding:      0.06,
    ps_scope:           0.08,
    ps_expansion:   0.07,
    ps_retention:       0.10,
    ps_retainer:       0.10,
    ps_communication:   0.10,
    ps_reviews:         0.06,
    ps_referral:        0.10,
    ps_reactivation:    0.07,
    ps_reporting:       0.40,
  },

  // ─── AI prompt additions ──────────────────────────────────────────────────────
  aiPromptAdditions: `VERTICAL CONTEXT: Professional Services Firm

This audit is for a professional services firm — accounting, legal, consulting, agency, IT services, coaching, or similar knowledge-work business. Use the following terminology and context throughout all findings and recommendations.

TERMINOLOGY — use these consistently:
- "clients" — not "customers" or "members"
- "engagement" — not "job," "project," or "deal" for a defined scope of work
- "proposal" or "SOW" — the document that defines scope, timeline, and pricing
- "retainer" — a fixed recurring fee for ongoing access or services
- "scope creep" — work performed beyond the original engagement boundaries without a change order
- "utilization" or "utilization rate" — percentage of available hours billed to clients
- "realization rate" — percentage of billed hours that actually get paid
- "DSO" (days sales outstanding) — average time between invoicing and payment
- "COI" (Center of Influence) — a professional who refers clients to you: accountants, lawyers, bankers, financial advisors, consultants
- "book of business" — total client portfolio
- "engagement letter" or "SOW" — the signed agreement defining scope
- "avg_job_value" in formulas = average engagement or project value
- "close_rate" in formulas = proposal-to-engagement conversion rate

COI FRAMING — this is load-bearing, use it throughout:
Centers of Influence are the single most underutilized growth lever in professional services. Accountants refer to lawyers. Lawyers refer to financial advisors. Consultants refer to IT firms. These relationships produce the highest-quality leads in the industry — prospects who arrive pre-sold on trust, convert at 3-5x the rate of cold inquiries, and stay longer. Yet only 12% of professional services firms have a formal COI program. Every recommendation involving business development should reference the COI opportunity: "Your COI network is the highest-quality lead source you have — and it's almost certainly underutilized."

BILLING MODEL CONTEXT (use ps_billing_model answer to adapt tone and recommendations):
- "Project-based — clients pay per engagement or deliverable" -> emphasize scope management, change order processes, project profitability tracking, and proposal conversion. Scope creep is the primary margin killer. The recommendation should orient toward tighter scoping, documented change orders, and proposal follow-up systems.
- "Hourly — clients pay for time billed" -> emphasize time tracking discipline, utilization rate, billable hour capture, and realization rate. Every unrecorded hour is lost revenue. The recommendation should orient toward real-time time tracking, weekly time entry review, and utilization dashboards.
- "Retainer — clients pay a fixed monthly fee for ongoing access or services" -> emphasize client retention, value demonstration, account expansion, and churn prevention. The recommendation should orient toward structured account reviews, proactive communication cadences, and upsell/cross-sell processes.
- "Mixed — a combination of project, hourly, and retainer work" -> blend the above contextually based on which areas score lowest. Reference the complexity of managing multiple billing models as a visibility challenge.

FIRM TYPE VOCABULARY (use ps_firm_type answer to adapt tone):
- "Accounting, tax, or financial advisory" -> use "practice," "returns," "engagements," "compliance deadlines," "busy season," "tax planning"
- "Legal services" -> use "practice," "matters," "cases," "filings," "billable hours," "client intake"
- "Business or management consulting" -> use "firm," "engagements," "deliverables," "strategic advisory," "implementation"
- "Marketing, PR, or creative agency" -> use "agency," "campaigns," "retainers," "creative briefs," "client work," "deliverables"
- "IT consulting or managed services" -> use "MSP," "managed services," "SLAs," "tickets," "monthly recurring revenue," "stack"
- "HR, recruiting, or executive search" -> use "firm," "placements," "searches," "candidates," "retained search," "contingency"
- "Coaching or advisory services" -> use "practice," "clients," "sessions," "programs," "packages"
- "Architecture, engineering, or design" -> use "firm," "projects," "drawings," "submittals," "design phases," "construction admin"

PAIN POINT CONTEXT:
- Scope creep is the silent margin killer. Most professional services firms absorb 11-15% of project value in unbilled work because they lack a documented change order process. The work gets done, the client is happy, but the firm never bills for it.
- Utilization is the most important number most firm owners don't know. Every 5-point improvement in utilization adds 10-15% to the bottom line. Most firms operate at 60-68% when they should be at 75-85%.
- The COI referral network is the highest-quality lead source in professional services — and the most underutilized. Only 12% of firms have a formal program.
- Client communication failures drive more churn than service quality failures. 72% of clients who leave a professional services firm cite lack of proactive communication, not poor work.
- Lapsed clients are warm prospects hiding in plain sight. A client who engaged 12-18 months ago and went quiet is far more likely to re-engage than a cold prospect is to engage for the first time.

COMPETITIVE CONTEXT:
- Professional services firms compete on trust, expertise, and responsiveness — not on price. Recommendations should orient toward demonstrating value, building relationships, and systematizing the client experience.
- The firms growing fastest are not the ones with the most expertise — they're the ones with the most systematic approach to business development, client retention, and operational visibility.
- Small firms' advantage over large firms is agility, personal attention, and relationship depth. Recommendations should lean into these strengths.

PRIORITY ORDERING:
For professional services, weight these areas more heavily in Priority Actions:
1. Client Retention & Account Growth — always top priority if score below 70 (retention is 5-7x cheaper than acquisition)
2. Referral & COI Network — second priority (highest-quality lead source in the industry)
3. Invoicing & Collections — third priority (direct cash flow impact)
4. Scope Management & Change Orders — fourth priority (margin protection)`,
};
