import type { VerticalConfig } from "./types";

export const commercialInsuranceConfig: VerticalConfig = {
  verticalId: "commercial-insurance",
  displayName: "Commercial Insurance Audit",

  skipQuestions: ["intro_business", "financial_platform"],

  // ─── Intro question overrides ────────────────────────────────────────────────
  introQuestions: {
    fin_avg_sale: {
      question: "Average annual commission per account",
      options: [
        "Under $500",
        "$500–$1,000",
        "$1,000–$2,500",
        "$2,500–$5,000",
        "$5,000–$10,000",
        "$10,000–$20,000",
        "$20,000–$40,000",
        "$40,000–$75,000",
        "Over $75,000",
        "I'm not sure",
        "Enter exact amount",
      ],
      midpoints: {
        "Under $500":          350,
        "$500–$1,000":         750,
        "$1,000–$2,500":      1750,
        "$2,500–$5,000":      3750,
        "$5,000–$10,000":     7500,
        "$10,000–$20,000":   15000,
        "$20,000–$40,000":   30000,
        "$40,000–$75,000":   57500,
        "Over $75,000":     100000,
        "I'm not sure":       5000,
        "Enter exact amount":    0,
      },
    },
    fin_close_rate: {
      question: "Quote-to-bind conversion rate",
    },
    fin_monthly_leads: {
      question: "New prospects quoted per month",
    },
    fin_monthly_revenue: {
      question: "Average monthly commission income",
    },
    // ── New question — injected at the intro_business position ─────────────────
    ci_lines_focus: {
      id: "ci_lines_focus",
      areaId: null,
      type: "single",
      question: "Which best describes your primary book of business?",
      options: [
        "Commercial P&C — general liability, property, commercial auto, workers comp",
        "Professional liability & specialty — E&O, D&O, cyber, EPLI",
        "Employee benefits — group health, dental, vision, life",
        "Full commercial — P&C plus benefits plus specialty",
        "Construction & contractor specialty",
        "Other commercial niche",
      ],
    },
  },

  // ─── Workflow areas ──────────────────────────────────────────────────────────
  workflowAreas: [
    // ── 1. Lead Capture & Pipeline Management ─────────────────────────────────
    {
      id: "ci_lead_capture",
      name: "Lead Capture & Pipeline Management",
      leakageType: "lead-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "Commercial insurance prospects typically request quotes from 3-5 brokers simultaneously. The broker who responds with a complete, professional quote first wins the submission more than 60% of the time — not the broker with the lowest premium. Speed and professionalism at the quote stage set the tone for the entire relationship.",
      softwareOptions: [
        "Applied Epic",
        "Vertafore AMS360",
        "AgencyZoom",
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "EZLynx",
        "Hawksoft",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_lead_capture_q1",
          areaId: "ci_lead_capture",
          type: "single",
          question:
            "When a new commercial prospect requests a quote, how quickly do you typically respond with an acknowledgment?",
          options: [
            "Hours later or the next day — whenever I can get to it",
            "Within the hour if I'm not with a client",
            "Within a few minutes — I try to respond fast",
            "Instantly — an automated system acknowledges every submission immediately",
          ],
        },
        {
          id: "ci_lead_capture_q2",
          areaId: "ci_lead_capture",
          type: "single",
          question: "Where do most of your new commercial prospects come from?",
          options: [
            "Referrals from existing clients or professional contacts — it's mostly word of mouth",
            "Direct outreach — I prospect and cold contact",
            "Inbound — my website, LinkedIn, or Google",
            "Multiple channels — leads come from several different places",
          ],
        },
        {
          id: "ci_lead_capture_q3",
          areaId: "ci_lead_capture",
          type: "single",
          question:
            "Do you track every prospect in your pipeline — where they came from, what you quoted, and where they are in the decision process?",
          options: [
            "No — I manage it mentally or in email",
            "I keep rough notes but nothing systematic",
            "I track it in a spreadsheet but not consistently",
            "Yes — every prospect is in my CRM with full history, quoted lines, and current status",
          ],
        },
        {
          id: "ci_lead_capture_q4",
          areaId: "ci_lead_capture",
          type: "single",
          question:
            "When a prospect submits an application or requests a quote, how organized and professional is their initial experience with your agency?",
          options: [
            "Informal — they email or call and we work it out",
            "Somewhat structured but still manual",
            "Professional — we have a process but it involves a lot of back-and-forth",
            "Fully systematized — intake, acknowledgment, timeline, and next steps are all automated",
          ],
        },
        {
          id: "ci_lead_capture_q5",
          areaId: "ci_lead_capture",
          type: "single",
          question:
            "Do you know your quote-to-bind conversion rate — and how it compares to agency benchmarks?",
          options: [
            "No — I don't track this",
            "I have a rough idea",
            "I calculate it sometimes",
            "Yes — I know exactly and I use it to identify where prospects are falling off",
          ],
        },
      ],
    },

    // ── 2. Prospect Nurture & Follow-Up ───────────────────────────────────────
    {
      id: "ci_prospect_nurture",
      name: "Prospect Nurture & Follow-Up",
      leakageType: "lead-based",
      leakageRate: 0.15,
      industryBenchmarkStat:
        "The average commercial insurance sales cycle is 90-180 days. Most brokers follow up 2-3 times after a quote and then move on. But research shows that 80% of commercial insurance sales require 5 or more follow-up touchpoints. The broker who stays consistent and adds value between touchpoints wins the account — not the broker who quoted the lowest premium.",
      softwareOptions: [
        "AgencyZoom",
        "HubSpot",
        "GoHighLevel (GHL)",
        "Salesforce",
        "Mailchimp",
        "ActiveCampaign",
        "Applied Epic",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_prospect_nurture_q1",
          areaId: "ci_prospect_nurture",
          type: "single",
          question:
            "When a prospect receives your quote but doesn't bind right away, what happens?",
          options: [
            "They go cold — I move on to active prospects",
            "I follow up once or twice, then stop",
            "I check in a few times but it's inconsistent",
            "They enter a structured follow-up sequence that runs until they bind or formally decline",
          ],
        },
        {
          id: "ci_prospect_nurture_q2",
          areaId: "ci_prospect_nurture",
          type: "single",
          question:
            "How long do you actively pursue a commercial prospect after quoting them?",
          options: [
            "A few weeks — if they don't respond I stop",
            "A month or two",
            "Through their current policy renewal date",
            "As long as it takes — I have sequences that run until they're ready to move",
          ],
        },
        {
          id: "ci_prospect_nurture_q3",
          areaId: "ci_prospect_nurture",
          type: "single",
          question:
            "Do prospects receive anything of value between your initial quote and their renewal decision — market insights, coverage education, risk management content?",
          options: [
            "No — they only hear from us when we follow up to ask if they're ready",
            "Occasionally — I share things manually when I think of it",
            "I have some content I send but it's not systematic",
            "Yes — an automated educational sequence runs and positions me as an advisor, not just a price quote",
          ],
        },
        {
          id: "ci_prospect_nurture_q4",
          areaId: "ci_prospect_nurture",
          type: "single",
          question:
            "When a prospect chooses a competitor, do you have a process to stay in touch for their next renewal cycle?",
          options: [
            "No — a lost quote is a dead lead",
            "I might reach out occasionally but nothing formal",
            "I put a reminder to contact them at their next renewal",
            "Yes — lost quotes automatically enter a long-term nurture sequence timed to their renewal date",
          ],
        },
        {
          id: "ci_prospect_nurture_q5",
          areaId: "ci_prospect_nurture",
          type: "single",
          question:
            "Do you know the total estimated annual premium value of every active prospect in your pipeline right now?",
          options: [
            "No — I have no forward visibility into pipeline value",
            "I have a general sense but nothing calculated",
            "I estimate it occasionally",
            "Yes — my pipeline value is tracked in real time and I review it weekly",
          ],
        },
      ],
    },

    // ── 3. New Client Onboarding ───────────────────────────────────────────────
    {
      id: "ci_onboarding",
      name: "New Client Onboarding",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "The first 90 days of a commercial insurance relationship determine whether a client stays for 1 year or 10. Brokers who conduct a structured coverage review, set clear service expectations, and deliver a professional welcome experience in the first 90 days retain first-year clients at 2x the rate of brokers who bind the policy and move on.",
      softwareOptions: [
        "Applied Epic",
        "Vertafore AMS360",
        "AgencyZoom",
        "GoHighLevel (GHL)",
        "HubSpot",
        "DocuSign",
        "Zywave",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_onboarding_q1",
          areaId: "ci_onboarding",
          type: "single",
          question:
            "When a new commercial client binds coverage with you, what do they receive in the first 48 hours?",
          options: [
            "Their policy documents — that's it",
            "A confirmation email with their policy basics",
            "A welcome email with their coverage summary and contact info",
            "A full welcome package — coverage overview, service team introduction, claims process, what to expect at renewal, and how to reach us",
          ],
        },
        {
          id: "ci_onboarding_q2",
          areaId: "ci_onboarding",
          type: "single",
          question:
            "Do new clients receive a structured coverage review in the first 90 days — a documented look at their full exposure and any gaps in their current program?",
          options: [
            "No — we bound what they asked for and moved on",
            "Informally — if coverage gaps come up in conversation",
            "I try to schedule a review call but it doesn't always happen",
            "Yes — every new client gets a formal 90-day coverage review, documented and on the calendar at binding",
          ],
        },
        {
          id: "ci_onboarding_q3",
          areaId: "ci_onboarding",
          type: "single",
          question:
            "Do new clients understand exactly how to reach you, what your service standards are, and what happens when they have a claim?",
          options: [
            "Not formally — they figure it out as they go",
            "I explain it verbally at binding",
            "I send them basic contact information",
            "Yes — every new client receives a written service guide covering all of this before their first policy term begins",
          ],
        },
        {
          id: "ci_onboarding_q4",
          areaId: "ci_onboarding",
          type: "single",
          question:
            "How consistent is the onboarding experience when you're busy versus when you have more bandwidth?",
          options: [
            "It varies a lot depending on my workload",
            "I try to be consistent but things get rushed",
            "Mostly consistent — a few steps slip when it's busy",
            "Fully consistent — onboarding is systematized and runs the same way regardless of my schedule",
          ],
        },
        {
          id: "ci_onboarding_q5",
          areaId: "ci_onboarding",
          type: "single",
          question:
            "Do you track first-year retention separately — and do you know whether new clients are more likely to leave than tenured accounts?",
          options: [
            "No — I don't break out retention by client tenure",
            "I have a general sense but nothing tracked",
            "I review it occasionally",
            "Yes — I track first-year retention specifically and I have a process to protect those accounts",
          ],
        },
      ],
    },

    // ── 4. Renewal Management ─────────────────────────────────────────────────
    {
      id: "ci_renewal",
      name: "Renewal Management",
      leakageType: "revenue-based",
      leakageRate: 0.15,
      industryBenchmarkStat:
        "Clients who hear from their broker before their renewal notice arrives are 80% more likely to stay. The standard best practice is a proactive outreach 90 days before renewal — enough lead time to market the account, address concerns, and present options before the client starts shopping. Most brokers start the conversation at 30 days. By then, the client is already comparing.",
      softwareOptions: [
        "Applied Epic",
        "Vertafore AMS360",
        "EZLynx",
        "AgencyZoom",
        "Zywave",
        "HawkSoft",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_renewal_q1",
          areaId: "ci_renewal",
          type: "single",
          question:
            "How far in advance of a renewal do you proactively reach out to a commercial client?",
          options: [
            "When the renewal notice arrives — usually 30 days or less",
            "About 45-60 days out",
            "About 90 days out — enough time to market the account properly",
            "90+ days — we have a systematic renewal calendar that triggers outreach automatically",
          ],
        },
        {
          id: "ci_renewal_q2",
          areaId: "ci_renewal",
          type: "single",
          question:
            "What does your renewal process look like for a typical commercial account?",
          options: [
            "We send the renewal, they sign, done — unless they have questions",
            "We reach out to confirm nothing has changed",
            "We do a coverage review and present the renewal terms",
            "We conduct a full renewal meeting — coverage review, exposure update, market options, and a stewardship report — for every account",
          ],
        },
        {
          id: "ci_renewal_q3",
          areaId: "ci_renewal",
          type: "single",
          question:
            "Do you have full visibility into every account renewing in the next 90 days — right now, without digging?",
          options: [
            "No — renewals come up when they come up",
            "I check my AMS periodically",
            "I have a report but I don't review it consistently",
            "Yes — I have a live renewal calendar and I review accounts 90+ days out as a standard practice",
          ],
        },
        {
          id: "ci_renewal_q4",
          areaId: "ci_renewal",
          type: "single",
          question:
            "When a carrier increases a premium significantly at renewal, do you proactively market the account to alternatives — or wait for the client to ask?",
          options: [
            "I wait for the client to raise the issue",
            "I mention it but don't always have time to market it",
            "I market significant increases when I catch them",
            "Yes — any material rate change triggers automatic remarketing before the client ever sees the renewal",
          ],
        },
        {
          id: "ci_renewal_q5",
          areaId: "ci_renewal",
          type: "single",
          question:
            "Do clients receive a stewardship report at renewal — a documented summary of what you've done for them, claims activity, coverage changes, and market conditions?",
          options: [
            "No — renewal is transactional, we don't produce reports",
            "For large accounts only",
            "For most accounts but it's inconsistent",
            "Yes — every account receives a professional stewardship report at renewal regardless of size",
          ],
        },
      ],
    },

    // ── 5. Account Rounding & Cross-Sell ──────────────────────────────────────
    {
      id: "ci_account_rounding",
      name: "Account Rounding & Cross-Sell",
      leakageType: "revenue-based",
      leakageRate: 0.12,
      industryBenchmarkStat:
        "Clients with 1.8 or more policies at a single agency have a 95% retention rate — compared to 67% for single-policy clients. Every line of coverage a competitor holds on your account is a door they can walk through at renewal. Account rounding is not just a revenue play — it is the most powerful retention strategy in commercial insurance.",
      softwareOptions: [
        "Applied Epic",
        "Vertafore AMS360",
        "AgencyZoom",
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "Zywave",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_account_rounding_q1",
          areaId: "ci_account_rounding",
          type: "single",
          question:
            "Do you have a systematic process to identify coverage gaps and cross-sell opportunities in your existing book?",
          options: [
            "No — cross-sell happens organically if clients ask",
            "I identify opportunities occasionally during conversations",
            "I review accounts for cross-sell when I think of it",
            "Yes — every account has a documented coverage map and gaps are flagged for systematic follow-up",
          ],
        },
        {
          id: "ci_account_rounding_q2",
          areaId: "ci_account_rounding",
          type: "single",
          question:
            "What percentage of your commercial clients have two or more lines of coverage with your agency?",
          options: [
            "Less than 25% — most clients have only one line with me",
            "25-50%",
            "50-75%",
            "Over 75% — account rounding is a core part of how I manage my book",
          ],
        },
        {
          id: "ci_account_rounding_q3",
          areaId: "ci_account_rounding",
          type: "single",
          question:
            "When you win a new commercial account on one line, is there a structured process to present additional lines within the first 90 days?",
          options: [
            "No — I focus on the line I wrote and hope they bring more business",
            "I mention other lines informally if it comes up",
            "I try to have a coverage conversation early but it's not systematic",
            "Yes — every new account triggers a 90-day account rounding outreach sequence",
          ],
        },
        {
          id: "ci_account_rounding_q4",
          areaId: "ci_account_rounding",
          type: "single",
          question:
            "Do you know which competitors currently hold other lines on your accounts — and do you have a plan to move those lines?",
          options: [
            "No — I don't know what else they have or who's writing it",
            "I know for some accounts but not systematically",
            "I ask during renewal conversations",
            "Yes — I document the full coverage picture for every account and have a strategy to round each one",
          ],
        },
        {
          id: "ci_account_rounding_q5",
          areaId: "ci_account_rounding",
          type: "single",
          question:
            "When a client's business changes — they hire employees, buy a vehicle, add a location — does that trigger an automatic coverage review?",
          options: [
            "No — they're expected to notify me of changes",
            "I find out eventually but not systematically",
            "I ask about changes at renewal",
            "Yes — mid-term business changes trigger an automatic coverage review outreach",
          ],
        },
      ],
    },

    // ── 6. Claims Advocacy & Mid-Term Service ─────────────────────────────────
    {
      id: "ci_claims",
      name: "Claims Advocacy & Mid-Term Service",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "How a broker handles a claim is the single most powerful retention moment in a commercial relationship. A client who experiences a claim and feels abandoned by their broker is 4x more likely to move their account at the next renewal. A client who feels their broker went to bat for them — followed up, communicated clearly, and advocated with the carrier — is 3x more likely to consolidate additional lines.",
      softwareOptions: [
        "Applied Epic",
        "Vertafore AMS360",
        "HawkSoft",
        "EZLynx",
        "Zywave",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_claims_q1",
          areaId: "ci_claims",
          type: "single",
          question:
            "When a commercial client files a claim, what is your involvement after the initial report?",
          options: [
            "Minimal — I report it and the carrier takes over",
            "I check in if the client reaches out",
            "I follow up periodically on major claims",
            "I actively advocate throughout the claims process — carrier follow-up, status updates to the client, and escalation when needed",
          ],
        },
        {
          id: "ci_claims_q2",
          areaId: "ci_claims",
          type: "single",
          question:
            "Do clients receive proactive communication from you during an open claim — not just from the carrier?",
          options: [
            "No — the carrier handles claims communication",
            "Occasionally on large claims",
            "For most significant claims",
            "Yes — every open claim triggers regular check-ins from our agency until it closes",
          ],
        },
        {
          id: "ci_claims_q3",
          areaId: "ci_claims",
          type: "single",
          question:
            "When a claim is denied or disputed, do you have a process to advocate for the client with the carrier?",
          options: [
            "Not really — I pass along whatever the carrier says",
            "I help if the client pushes back",
            "I advocate on significant denials",
            "Yes — disputed claims trigger a structured advocacy process — carrier escalation, documentation review, and clear communication to the client throughout",
          ],
        },
        {
          id: "ci_claims_q4",
          areaId: "ci_claims",
          type: "single",
          question:
            "After a claim closes, do you conduct a review with the client — what happened, what it means for their coverage, and whether any adjustments are needed?",
          options: [
            "No — closed claims are done",
            "For large claims occasionally",
            "For most claims if I remember",
            "Yes — every closed claim triggers a post-claim coverage review",
          ],
        },
        {
          id: "ci_claims_q5",
          areaId: "ci_claims",
          type: "single",
          question:
            "Do you track claims history by account and use it proactively — to identify accounts with loss trends, coverage gaps, or risk management opportunities?",
          options: [
            "No — claims data sits in the AMS but I don't analyze it",
            "I review it when an account is up for renewal",
            "I check it periodically",
            "Yes — claims data is reviewed regularly and used to proactively engage accounts with risk management guidance",
          ],
        },
      ],
    },

    // ── 7. Client Communication & Stewardship ─────────────────────────────────
    {
      id: "ci_communication",
      name: "Client Communication & Stewardship",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "81% of commercial insurance clients who switch brokers do so because of lack of regular, meaningful communication — not because of price, not because of a bad claim experience. They felt forgotten. In an industry where the broker's value is invisible until something goes wrong, consistent communication is the only way to make that value visible year-round.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "HubSpot",
        "Mailchimp",
        "AgencyZoom",
        "Zywave",
        "Applied Epic",
        "ActiveCampaign",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_communication_q1",
          areaId: "ci_communication",
          type: "single",
          question:
            "How often do commercial clients hear from you outside of the renewal process?",
          options: [
            "Rarely — contact is mostly renewal-driven",
            "A few times a year around major events",
            "Quarterly or so — market updates, risk management tips",
            "Consistently — a regular cadence of value-driven communication runs year-round regardless of renewal timing",
          ],
        },
        {
          id: "ci_communication_q2",
          areaId: "ci_communication",
          type: "single",
          question:
            "Do you send clients proactive market updates — when carrier appetites shift, when rates are hardening in their industry, when new coverage options become available?",
          options: [
            "No — clients hear about market changes when their renewal comes up",
            "Occasionally when something major happens",
            "For major accounts I stay on top of it",
            "Yes — market intelligence goes out to relevant clients automatically as conditions change",
          ],
        },
        {
          id: "ci_communication_q3",
          areaId: "ci_communication",
          type: "single",
          question:
            "Do commercial clients receive industry-specific risk management content — OSHA updates, compliance changes, loss prevention guidance relevant to their business?",
          options: [
            "No — our communication is focused on policy and renewal",
            "Occasionally when I come across something relevant",
            "For some clients, manually",
            "Yes — clients receive regular, industry-relevant content that makes us a trusted advisor, not just a policy vendor",
          ],
        },
        {
          id: "ci_communication_q4",
          areaId: "ci_communication",
          type: "single",
          question:
            "When a client has a question or needs a certificate of insurance outside business hours, how do they get it?",
          options: [
            "They wait until we're open",
            "They can email and someone follows up",
            "We have a basic after-hours process for urgent requests",
            "Clients can access certificates and policy documents 24/7 through a self-service portal",
          ],
        },
        {
          id: "ci_communication_q5",
          areaId: "ci_communication",
          type: "single",
          question:
            "Do your top accounts receive a formal mid-year stewardship touchpoint — not just the renewal call?",
          options: [
            "No — stewardship happens at renewal only",
            "For our very largest accounts sometimes",
            "For accounts over a certain premium threshold",
            "Yes — every account receives at least one mid-year touchpoint, documented and on the calendar",
          ],
        },
      ],
    },

    // ── 8. Reviews & Professional Reputation ──────────────────────────────────
    {
      id: "ci_reviews",
      name: "Reviews & Professional Reputation",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "Brokerages with 50 or more positive Google reviews generate 35% more inbound leads than those without active reputation management. Commercial insurance buyers — particularly business owners researching brokers for the first time — read reviews before they make contact. A thin or absent review profile hands those prospects to a competitor before the first conversation.",
      softwareOptions: [
        "Google Business Profile",
        "LinkedIn",
        "Birdeye",
        "Podium",
        "NiceJob",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_reviews_q1",
          areaId: "ci_reviews",
          type: "single",
          question:
            "How do you currently ask satisfied commercial clients for reviews?",
          options: [
            "I don't — I hope happy clients leave reviews on their own",
            "I ask verbally when it comes up",
            "I ask some clients via email after a good interaction",
            "An automated review request goes out to every satisfied client at the right moment",
          ],
        },
        {
          id: "ci_reviews_q2",
          areaId: "ci_reviews",
          type: "single",
          question:
            "How many new Google reviews has your agency received in the last 90 days?",
          options: [
            "0 to 2",
            "3 to 6",
            "7 to 12",
            "13 or more",
          ],
        },
        {
          id: "ci_reviews_q3",
          areaId: "ci_reviews",
          type: "single",
          question:
            "Is your LinkedIn presence current, professional, and actively used to demonstrate expertise?",
          options: [
            "My LinkedIn profile exists but is outdated or minimal",
            "Basic profile — nothing that demonstrates expertise",
            "Decent profile but I don't post consistently",
            "Yes — I post regularly, my profile is polished, and I'm recognized as an expert in my niche",
          ],
        },
        {
          id: "ci_reviews_q4",
          areaId: "ci_reviews",
          type: "single",
          question: "Do you respond to every online review — positive and negative?",
          options: [
            "No — I rarely respond",
            "I respond to negative reviews when I see them",
            "I respond to most reviews when I remember",
            "Yes — every review gets a professional response within 24 hours",
          ],
        },
        {
          id: "ci_reviews_q5",
          areaId: "ci_reviews",
          type: "single",
          question:
            "Does your agency have a documented process to gather and publicize client testimonials — on your website, LinkedIn, and marketing materials?",
          options: [
            "No — testimonials happen if a client volunteers them",
            "I have a few testimonials but nothing systematic",
            "I ask for testimonials occasionally",
            "Yes — every strong client relationship is an opportunity to capture a testimonial, and I have a process to gather and use them",
          ],
        },
      ],
    },

    // ── 9. Referral & Strategic Partnerships ──────────────────────────────────
    {
      id: "ci_referral",
      name: "Referral & Strategic Partnerships",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "Strategic referral partnerships with accountants, attorneys, bankers, and financial advisors generate leads with 3x higher close rates than any other marketing channel for commercial brokers. These partners are already trusted advisors to the same business owners you want to reach — and most brokers have no formal partnership program whatsoever.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "HubSpot",
        "AgencyZoom",
        "Salesforce",
        "LinkedIn",
        "ReferralHero",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_referral_q1",
          areaId: "ci_referral",
          type: "single",
          question:
            "Do you have formal referral partnerships with accountants, attorneys, bankers, or financial advisors who serve the same commercial clients you target?",
          options: [
            "No — referrals happen organically when someone thinks of me",
            "I have informal relationships with a few people",
            "I have some partnerships but they're not structured or active",
            "Yes — I have documented referral agreements with professional partners and I nurture those relationships systematically",
          ],
        },
        {
          id: "ci_referral_q2",
          areaId: "ci_referral",
          type: "single",
          question:
            "Do you have a structured process to ask every satisfied commercial client for referrals — or does it happen by accident?",
          options: [
            "Entirely by accident — I never formally ask",
            "I mention it occasionally but nothing systematic",
            "I ask most satisfied clients but the ask is informal",
            "Yes — every strong client relationship includes a formal referral ask, and I track referral activity by client",
          ],
        },
        {
          id: "ci_referral_q3",
          areaId: "ci_referral",
          type: "single",
          question:
            "Do you know which clients and partners are your top referral sources — and do you treat them differently?",
          options: [
            "No — referrals show up and I don't know who sent them",
            "I have a rough idea of a few good sources",
            "I track it manually sometimes",
            "Yes — referral sources are tracked in my CRM and my top referrers receive systematic appreciation and recognition",
          ],
        },
        {
          id: "ci_referral_q4",
          areaId: "ci_referral",
          type: "single",
          question:
            "Do you provide referral partners with anything that makes it easy for them to refer you — an introduction deck, a one-pager, a clear description of your ideal client?",
          options: [
            "No — they'd have to explain us from memory",
            "I've told them what I do verbally",
            "I have some materials but they're not current or prominent",
            "Yes — every referral partner has current, professional materials that make it easy to introduce me to their clients",
          ],
        },
        {
          id: "ci_referral_q5",
          areaId: "ci_referral",
          type: "single",
          question:
            "What percentage of your new commercial accounts currently come from referrals or strategic partnerships?",
          options: [
            "Less than 20% — most new business comes from cold outreach or marketing",
            "20-40%",
            "40-60%",
            "Over 60% — referrals and partnerships drive most of my new business growth",
          ],
        },
      ],
    },

    // ── 10. Lost Account Win-Back ─────────────────────────────────────────────
    {
      id: "ci_winback",
      name: "Lost Account Win-Back",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "The average commercial insurance agency loses 16% of its book annually. Most treat lost accounts as dead leads. But a business that moved to a competitor 12-18 months ago is already past the honeymoon period — and if their new broker hasn't delivered, they're receptive. Win-back campaigns on lost commercial accounts consistently outperform cold prospecting on both cost and conversion rate.",
      softwareOptions: [
        "Applied Epic",
        "AgencyZoom",
        "HubSpot",
        "GoHighLevel (GHL)",
        "Salesforce",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_winback_q1",
          areaId: "ci_winback",
          type: "single",
          question:
            "When a commercial account leaves for a competitor, do you have a process to stay in contact and pursue them at their next renewal?",
          options: [
            "No — a lost account is a lost account",
            "I might reach out occasionally but nothing formal",
            "I put a note to follow up at their next renewal",
            "Yes — every lost account enters an automated win-back sequence timed to their next renewal cycle",
          ],
        },
        {
          id: "ci_winback_q2",
          areaId: "ci_winback",
          type: "single",
          question:
            "Do you document why accounts leave — and do you use that information to improve your retention process?",
          options: [
            "No — I don't formally track reasons for loss",
            "I have a general sense of why accounts leave",
            "I note the reason informally when I find out",
            "Yes — every lost account has a documented reason for loss, and I review that data quarterly to identify patterns",
          ],
        },
        {
          id: "ci_winback_q3",
          areaId: "ci_winback",
          type: "single",
          question:
            "Do you know the total annual premium value of accounts you've lost in the last 24 months?",
          options: [
            "No — I don't track this",
            "I have a rough idea",
            "I've calculated it once or twice",
            "Yes — I know exactly and I use it to prioritize my win-back efforts",
          ],
        },
        {
          id: "ci_winback_q4",
          areaId: "ci_winback",
          type: "single",
          question:
            "When you reach back out to a lost account, do you have something new to offer — better market access, improved service model, new coverage options?",
          options: [
            "Not really — I just ask if they're happy with their current broker",
            "I try to have a reason to reach out",
            "I position new market options when I have them",
            "Yes — every win-back outreach is strategically timed and comes with a specific, relevant reason to reconsider",
          ],
        },
        {
          id: "ci_winback_q5",
          areaId: "ci_winback",
          type: "single",
          question:
            "Have you successfully rewritten any accounts in the last 12 months that previously left your agency?",
          options: [
            "No — once they leave, they stay gone",
            "Once or twice by accident",
            "A few — when I happened to follow up at the right time",
            "Yes — win-back is a regular part of my new business strategy and I have a process for it",
          ],
        },
      ],
    },

    // ── 11. Specialty Lines & Account Expansion ───────────────────────────────
    {
      id: "ci_specialty",
      name: "Specialty Lines & Account Expansion",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "Brokers who bundle commercial P&C with employee benefits see 23% higher client retention and 18% more revenue per account. Beyond benefits, the fastest-growing commercial lines — cyber liability, EPLI, management liability — are being written by competitors on accounts where the P&C broker never had the conversation. Every specialty line a competitor holds is an open door at renewal.",
      softwareOptions: [
        "Applied Epic",
        "Vertafore AMS360",
        "Zywave",
        "AgencyZoom",
        "HubSpot",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_specialty_q1",
          areaId: "ci_specialty",
          type: "single",
          question:
            "Do you proactively present cyber liability coverage to every commercial client — or only when they ask?",
          options: [
            "I don't bring it up unless they ask",
            "I mention it occasionally when it seems relevant",
            "I present it to most clients but not systematically",
            "Yes — cyber is part of every coverage conversation, and I have a standard presentation for it",
          ],
        },
        {
          id: "ci_specialty_q2",
          areaId: "ci_specialty",
          type: "single",
          question:
            "Do you know which of your commercial accounts currently have umbrella or excess liability coverage — and who is writing it?",
          options: [
            "No — I don't track this",
            "I know for some accounts but not systematically",
            "I check at renewal",
            "Yes — umbrella and excess coverage is documented for every account in my book",
          ],
        },
        {
          id: "ci_specialty_q3",
          areaId: "ci_specialty",
          type: "single",
          question:
            "Do you offer employee benefits alongside commercial P&C — or do those go to a separate benefits broker?",
          options: [
            "Benefits always go to someone else — I don't offer them",
            "I try to write benefits sometimes but it's not a priority",
            "I write benefits for some accounts",
            "Yes — I actively pursue benefits on every commercial P&C account and have a benefits capability or partnership to support it",
          ],
        },
        {
          id: "ci_specialty_q4",
          areaId: "ci_specialty",
          type: "single",
          question:
            "When a commercial client's business grows — more employees, more revenue, new contracts — do you proactively review their coverage for new exposures?",
          options: [
            "No — they're expected to notify me when things change",
            "I find out at renewal",
            "I try to stay on top of it for larger accounts",
            "Yes — any known business change triggers an automatic coverage review outreach",
          ],
        },
        {
          id: "ci_specialty_q5",
          areaId: "ci_specialty",
          type: "single",
          question:
            "Do you track which specialty lines — EPLI, D&O, professional liability, management liability — your competitors are writing on your accounts?",
          options: [
            "No — I don't know what competitors hold on my accounts",
            "I have a rough sense for a few accounts",
            "I ask about it at renewal",
            "Yes — I document the full competitive picture for every account and have a plan to consolidate lines",
          ],
        },
      ],
    },

    // ── 12. Business Visibility & Reporting ───────────────────────────────────
    {
      id: "ci_reporting",
      name: "Business Visibility & Reporting",
      leakageType: "multiplier",
      leakageRate: 0.40,
      industryBenchmarkStat:
        "Agencies with structured pipeline management grow revenue at 18% annually versus 12% for those without it. In commercial lines, where 80% of revenue renews automatically every year, the difference between a thriving book and a shrinking one is almost entirely visible in the data — retention rate, renewal calendar, pipeline value, and cross-sell ratio — if you know where to look.",
      softwareOptions: [
        "Applied Epic",
        "Vertafore AMS360",
        "AgencyZoom",
        "EZLynx",
        "HawkSoft",
        "Databox",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "ci_reporting_q1",
          areaId: "ci_reporting",
          type: "single",
          question:
            "Do you have full visibility into your renewal calendar — every account renewing in the next 90 days, with their premium, their risk level, and their current status?",
          options: [
            "No — renewals surface as they come up",
            "I check my AMS periodically but not systematically",
            "I review a renewal report monthly",
            "Yes — I have a live 90-day renewal calendar that I review weekly and act on proactively",
          ],
        },
        {
          id: "ci_reporting_q2",
          areaId: "ci_reporting",
          type: "single",
          question:
            "Do you know your agency's current retention rate — and how it's trending compared to last year?",
          options: [
            "No — I don't track this formally",
            "I have a rough sense but nothing calculated",
            "I calculate it at year end",
            "Yes — I track retention rate monthly by premium volume and by account count",
          ],
        },
        {
          id: "ci_reporting_q3",
          areaId: "ci_reporting",
          type: "single",
          question:
            "Do you know your quote-to-bind ratio — and whether it's improving or declining?",
          options: [
            "No — I don't track this",
            "I have a rough idea",
            "I calculate it occasionally",
            "Yes — I track it monthly by producer and by line of business",
          ],
        },
        {
          id: "ci_reporting_q4",
          areaId: "ci_reporting",
          type: "single",
          question:
            "Do you know your average policies per account — and whether your book is getting more or less rounded over time?",
          options: [
            "No — I don't track this",
            "I have a general sense",
            "I review it occasionally",
            "Yes — I track policies per account and I have a target I'm actively working toward",
          ],
        },
        {
          id: "ci_reporting_q5",
          areaId: "ci_reporting",
          type: "single",
          question:
            "If your top 10 accounts all renewed with a competitor next month, would you know it was coming — or would it be a surprise?",
          options: [
            "It would be a complete surprise — I have no early warning system",
            "I'd have a general sense for some of them",
            "I'd probably catch it during renewal prep",
            "I'd know months in advance — I track engagement, communication gaps, and renewal risk for every significant account",
          ],
        },
      ],
    },
  ],

  // ─── Leakage formula lookup ───────────────────────────────────────────────────
  leakageFormula: {
    ci_lead_capture:       0.20,
    ci_prospect_nurture:   0.15,
    ci_onboarding:         0.05,
    ci_renewal:            0.15,
    ci_account_rounding:   0.12,
    ci_claims:             0.06,
    ci_communication:      0.05,
    ci_reviews:            0.06,
    ci_referral:           0.08,
    ci_winback:            0.07,
    ci_specialty:          0.10,
    ci_reporting:          0.40,
  },

  // ─── AI prompt additions ──────────────────────────────────────────────────────
  aiPromptAdditions: `VERTICAL CONTEXT: Commercial Lines Insurance Brokerage

This audit is for a commercial insurance broker or agency. Use the following terminology and context throughout all findings and recommendations.

TERMINOLOGY — use these consistently:
- "accounts" or "clients" — not "customers"
- "commission" — not "revenue" or "income" where possible
- "premium" — the policy cost paid by the client; "commission" is what the broker earns
- "bind" or "bound" — not "close" for completing a sale
- "renewal" — the annual policy renewal; the most critical retention moment
- "book of business" — the broker's total client portfolio
- "account rounding" — adding lines of coverage to existing accounts
- "lines" — types of coverage (GL, auto, workers comp, umbrella, cyber, etc.)
- "carrier" — the insurance company; not "provider" or "vendor"
- "submission" — a prospect application sent to carriers for quoting
- "stewardship" or "stewardship report" — the annual value summary for commercial clients
- "producer" — the sales person; not "agent" or "rep" in larger agency context
- "CSR" — Client Service Representative; the service/retention team member
- "AMS" — Agency Management System; the core operational platform
- "avg_job_value" in formulas = average annual commission per account

PAIN POINT CONTEXT:
- The commercial lines retention problem is almost entirely behavioral, not competitive. 81% of clients who switch brokers do so because of lack of communication — not price, not a bad claim. The broker who communicates consistently wins the renewal without a fight.
- The renewal process starts 90 days out, not 30. Brokers who reach out at 30 days are already behind — the client has often started shopping. 90-day proactive outreach is the industry best practice for a reason.
- Account rounding is the most underutilized retention tool in commercial lines. A client with 1 line has a 67% retention rate. A client with 1.8+ lines has a 95% retention rate. Every line a competitor holds is a risk.
- Lost accounts are warm prospects 12-18 months later. The average business owner's honeymoon with a new broker ends at the first renewal. A structured win-back process targeting lost accounts at their renewal dates consistently outperforms cold prospecting.
- Referral partnerships with accountants, attorneys, and bankers are the highest-quality lead source in commercial lines. These partners are already trusted by the same business owners the broker wants to reach. Most brokers have no formal program.

COMPETITIVE CONTEXT:
- Commercial brokers compete with national brokerages (Marsh, Gallagher, USI), regional independents, and direct carrier programs for mid-market and small commercial accounts.
- The independent broker's advantage is market access, objectivity, and relationship. Recommendations should lean into these — not features that nationals do better.
- Cyber, EPLI, and specialty lines are being written by focused specialty brokers who approach P&C accounts from the specialty angle. Account rounding is both offensive and defensive.

LINES FOCUS VOCABULARY (use ci_lines_focus answer to adapt tone):
- "Commercial P&C — general liability, property, commercial auto, workers comp" -> use "GL," "property," "workers comp," "commercial auto," "BOP"
- "Professional liability & specialty — E&O, D&O, cyber, EPLI" -> use "E&O," "D&O," "management liability," "cyber"
- "Employee benefits — group health, dental, vision, life" -> use "group health," "dental," "vision," "stop loss," "voluntary benefits"
- "Full commercial — P&C plus benefits plus specialty" -> use all of the above contextually
- "Construction & contractor specialty" -> use "builder's risk," "contractor's liability," "wrap-up," "bonding"

PRIORITY ORDERING:
For commercial insurance, weight these areas more heavily in Priority Actions:
1. Renewal Management — always the top priority if score is below 70 (80% of book revenue renews annually)
2. Account Rounding — second priority (drives both retention and revenue)
3. Specialty Lines & Account Expansion — third priority (fastest-growing competitive threat)
4. Lead Capture & Pipeline Management — fourth priority (new business)`,
};
