import type { VerticalConfig } from "./types";

export const b2bSalesConfig: VerticalConfig = {
  verticalId: "b2b-sales",
  displayName: "B2B Sales Audit",

  skipQuestions: ["intro_business", "financial_platform"],

  // ─── Intro question overrides ────────────────────────────────────────────────
  introQuestions: {
    fin_avg_sale: {
      question: "Average order or deal value",
    },
    fin_close_rate: {
      question: "Lead-to-close conversion rate",
    },
    fin_monthly_leads: {
      question: "New prospects contacted per month",
    },
    fin_monthly_revenue: {
      question: "Average monthly revenue",
    },
    // ── New question — injected at the intro_business position ─────────────────
    bs_sales_model: {
      id: "bs_sales_model",
      areaId: null,
      type: "single",
      question: "Which best describes how your sales team operates?",
      options: [
        "Field sales — reps visit prospects and clients in person",
        "Inside sales — reps sell primarily by phone, email, and video",
        "Hybrid — a mix of in-person and remote selling",
        "Owner-led — I personally handle most or all of the selling",
        "Channel/distributor — we sell through partners or reps who represent us",
      ],
    },
  },

  // ─── Workflow areas ──────────────────────────────────────────────────────────
  workflowAreas: [
    // ── 1. Lead Capture & Response Speed ──────────────────────────────────────
    {
      id: "bs_lead_capture",
      name: "Lead Capture & Response Speed",
      leakageType: "lead-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "50% of B2B buyers go with the vendor who responds first — not the one with the best product or the lowest price. The first response sets the tone for the entire relationship. Yet the average B2B response time to an inbound inquiry is over 47 hours. The company that responds in minutes wins the meeting. The company that responds in days loses to someone who did.",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "Pipedrive",
        "Zoho CRM",
        "Monday.com",
        "Close CRM",
        "LinkedIn Sales Navigator",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_lead_capture_q1",
          areaId: "bs_lead_capture",
          type: "single",
          question:
            "When a new prospect reaches out — through your website, LinkedIn, a referral, or anywhere else — how quickly do they typically hear back?",
          options: [
            "Hours later or the next day — whenever someone gets to it",
            "Within the hour if we're not in meetings",
            "Within a few minutes — we try to be fast",
            "Instantly — an automated system acknowledges every inquiry immediately",
          ],
        },
        {
          id: "bs_lead_capture_q2",
          areaId: "bs_lead_capture",
          type: "single",
          question: "Where do most of your new prospects come from?",
          options: [
            "Referrals and word of mouth — almost entirely relationship-driven",
            "Outbound — we prospect and reach out cold",
            "Inbound — website, LinkedIn, Google",
            "Events and trade shows",
            "Multiple channels — leads come from several different places",
          ],
        },
        {
          id: "bs_lead_capture_q3",
          areaId: "bs_lead_capture",
          type: "single",
          question:
            "Do you track every new prospect — where they came from, what they were pitched, and where they are in your pipeline?",
          options: [
            "No — leads come in through different people and channels and we lose track",
            "I have a rough idea but nothing formal",
            "Mostly tracked but inconsistently",
            "Yes — every prospect is in our CRM with full source tracking and current status",
          ],
        },
        {
          id: "bs_lead_capture_q4",
          areaId: "bs_lead_capture",
          type: "single",
          question:
            "When a prospect reaches out after hours or on weekends, what happens?",
          options: [
            "They wait until the next business day",
            "Someone might see it and respond but it's not guaranteed",
            "We have an informal after-hours process",
            "An automated response acknowledges them immediately and sets expectations for follow-up",
          ],
        },
        {
          id: "bs_lead_capture_q5",
          areaId: "bs_lead_capture",
          type: "single",
          question:
            "Can prospects book a meeting or call directly from your website or email signature — without back-and-forth scheduling?",
          options: [
            "No — they have to call or email and we coordinate manually",
            "We have a contact form but no direct booking",
            "We have a booking link but it's not prominently used",
            "Yes — one-click scheduling is prominent and used consistently by our team",
          ],
        },
      ],
    },

    // ── 2. Outbound Prospecting & Pipeline Building ───────────────────────────
    {
      id: "bs_prospecting",
      name: "Outbound Prospecting & Pipeline Building",
      leakageType: "lead-based",
      leakageRate: 0.15,
      industryBenchmarkStat:
        "69-83% of B2B sales opportunities are reactive and buyer-led — meaning most sales teams are waiting for prospects to come to them rather than proactively building pipeline. Companies with a structured outbound prospecting process generate 18% more revenue than those without one. The reps who fill their own pipeline consistently outperform those who rely on inbound alone.",
      softwareOptions: [
        "LinkedIn Sales Navigator",
        "Apollo.io",
        "ZoomInfo",
        "HubSpot Sequences",
        "Outreach",
        "Salesloft",
        "GoHighLevel (GHL)",
        "Clay",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_prospecting_q1",
          areaId: "bs_prospecting",
          type: "single",
          question:
            "Do your reps have a documented, consistent process for outbound prospecting — or does each rep do their own thing?",
          options: [
            "No process — everyone prospects differently, or nobody prospects at all",
            "Some informal guidance but nothing documented",
            "We have a loose process but adherence is inconsistent",
            "Yes — a documented outbound sequence that every rep follows",
          ],
        },
        {
          id: "bs_prospecting_q2",
          areaId: "bs_prospecting",
          type: "single",
          question:
            "Do you have a clearly defined ideal customer profile — the exact type of business most likely to buy from you?",
          options: [
            "Not really — we go after anyone who might buy",
            "A general sense but nothing documented",
            "Documented but not actively used to filter prospects",
            "Yes — a specific ICP that guides all prospecting activity and is updated regularly",
          ],
        },
        {
          id: "bs_prospecting_q3",
          areaId: "bs_prospecting",
          type: "single",
          question:
            "How many new prospects does each rep add to the pipeline in a typical week?",
          options: [
            "Fewer than 5 — prospecting is sporadic",
            "5-10",
            "10-20",
            "20 or more — we have a structured prospecting cadence that produces consistent pipeline",
          ],
        },
        {
          id: "bs_prospecting_q4",
          areaId: "bs_prospecting",
          type: "single",
          question:
            "Do your reps use LinkedIn actively for prospecting — connecting, engaging, and building relationships with target accounts?",
          options: [
            "No — we don't use LinkedIn for sales",
            "Occasionally and informally",
            "Some reps use it but it's not systematic",
            "Yes — LinkedIn is a core prospecting channel with a documented approach",
          ],
        },
        {
          id: "bs_prospecting_q5",
          areaId: "bs_prospecting",
          type: "single",
          question:
            "Do you know your pipeline coverage ratio — how much total pipeline value you have relative to your monthly revenue target?",
          options: [
            "No — we have no visibility into total pipeline value",
            "I have a rough sense",
            "I check it occasionally",
            "Yes — pipeline coverage is tracked and reviewed weekly",
          ],
        },
      ],
    },

    // ── 3. Lead Nurture & Multi-Touch Follow-Up ───────────────────────────────
    {
      id: "bs_followup",
      name: "Lead Nurture & Multi-Touch Follow-Up",
      leakageType: "lead-based",
      leakageRate: 0.18,
      industryBenchmarkStat:
        "80% of B2B sales require 5 or more follow-up touchpoints to close. 48% of salespeople never make a single follow-up attempt after first contact. That gap — between what it takes to close and what most reps actually do — is where the majority of B2B sales revenue is lost. The deals aren't dying because the prospect said no. They're dying because nobody followed up.",
      softwareOptions: [
        "HubSpot",
        "Outreach",
        "Salesloft",
        "GoHighLevel (GHL)",
        "Apollo.io",
        "Mailchimp",
        "ActiveCampaign",
        "Close CRM",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_followup_q1",
          areaId: "bs_followup",
          type: "single",
          question:
            "When a prospect doesn't respond to an initial outreach, what happens?",
          options: [
            "Nothing — if they don't respond, we move on",
            "One or two more attempts, then we stop",
            "We follow up a few times over a couple of weeks",
            "They enter an automated multi-touch sequence that runs until they respond or opt out",
          ],
        },
        {
          id: "bs_followup_q2",
          areaId: "bs_followup",
          type: "single",
          question:
            "How many follow-up touchpoints does a prospect receive before your team marks them as dead?",
          options: [
            "One or two — we don't want to be annoying",
            "Three to four",
            "Five to seven",
            "Eight or more — we follow up persistently across multiple channels until we get a clear response",
          ],
        },
        {
          id: "bs_followup_q3",
          areaId: "bs_followup",
          type: "single",
          question:
            "Do your follow-up touchpoints add value — relevant content, industry insights, case studies — or are they just 'checking in'?",
          options: [
            "Mostly just checking in — \"following up to see if you had a chance to review...\"",
            "Occasional value but mostly check-ins",
            "We try to add value but it's inconsistent",
            "Yes — every touchpoint in our sequence has a specific value-add tied to the prospect's likely concerns",
          ],
        },
        {
          id: "bs_followup_q4",
          areaId: "bs_followup",
          type: "single",
          question:
            "Do your reps follow up across multiple channels — email, phone, LinkedIn — or primarily just email?",
          options: [
            "Email only",
            "Email and occasional phone calls",
            "Email and phone, sometimes LinkedIn",
            "Structured multi-channel sequences — email, phone, LinkedIn, and direct mail for high-value prospects",
          ],
        },
        {
          id: "bs_followup_q5",
          areaId: "bs_followup",
          type: "single",
          question:
            "When a prospect goes cold after an initial meeting or demo, do you have a re-engagement process?",
          options: [
            "No — if they go cold, they're gone",
            "The rep might reach out again eventually",
            "We have a loose win-back approach",
            "Yes — prospects who go cold after a meeting enter an automated re-engagement sequence automatically",
          ],
        },
      ],
    },

    // ── 4. Sales Process & Deal Management ────────────────────────────────────
    {
      id: "bs_sales_process",
      name: "Sales Process & Deal Management",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "B2B companies with a documented, consistently executed sales process generate 28% higher revenue than those without one. Yet most SMB sales teams have no formal process — every rep handles deals differently, there are no clear stage definitions, and deals stall or die for reasons the owner can't see until it's too late. A repeatable sales process is not a constraint on good salespeople — it's what separates a business from a group of individuals doing their own thing.",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "Pipedrive",
        "GoHighLevel (GHL)",
        "Close CRM",
        "Monday.com",
        "Zoho CRM",
        "PandaDoc",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_sales_process_q1",
          areaId: "bs_sales_process",
          type: "single",
          question:
            "Do you have a documented sales process — defined stages, clear criteria for moving deals forward, and consistent execution across your team?",
          options: [
            "No process — every rep handles deals their own way",
            "We have a general approach but nothing documented",
            "Documented but not consistently followed",
            "Yes — a defined process with clear stage criteria that every rep follows",
          ],
        },
        {
          id: "bs_sales_process_q2",
          areaId: "bs_sales_process",
          type: "single",
          question:
            "Do you know where deals are most likely to stall or die in your pipeline?",
          options: [
            "No — deals just go quiet and I'm not sure why",
            "A general sense but nothing data-driven",
            "I track it for larger deals",
            "Yes — we track stage conversion rates and know exactly where the biggest drop-offs happen",
          ],
        },
        {
          id: "bs_sales_process_q3",
          areaId: "bs_sales_process",
          type: "single",
          question:
            "When a prospect requests a proposal, how long does it typically take to deliver?",
          options: [
            "Several days — proposals take time to build from scratch",
            "48-72 hours",
            "Same day or next day",
            "Within hours — we have templated proposals that can be customized quickly",
          ],
        },
        {
          id: "bs_sales_process_q4",
          areaId: "bs_sales_process",
          type: "single",
          question:
            "After sending a proposal, do you have a structured follow-up process to move it to a decision?",
          options: [
            "No — we send the proposal and wait to hear back",
            "We check in once or twice",
            "We have a loose follow-up process",
            "Yes — every proposal triggers an automated follow-up sequence with specific touchpoints and timelines",
          ],
        },
        {
          id: "bs_sales_process_q5",
          areaId: "bs_sales_process",
          type: "single",
          question:
            "Do you track win/loss reasons — and use that data to improve your pitch, your ICP, or your process?",
          options: [
            "No — we don't formally track why we win or lose",
            "We have a general sense but nothing documented",
            "We track it for large deals",
            "Yes — every won and lost deal has a documented reason, and we review the data regularly",
          ],
        },
      ],
    },

    // ── 5. New Account Onboarding & First Purchase Success ────────────────────
    {
      id: "bs_onboarding",
      name: "New Account Onboarding & First Purchase Success",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "In B2B sales, the first 90 days after a new account signs on determines whether they become a long-term client or a one-time buyer. Companies that deliver a structured, high-touch onboarding experience see 2x higher second-order rates and 40% higher retention than those who close the deal and move on. The sale isn't done when the contract is signed — it's done when the client gets their first result.",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "Pipedrive",
        "Gainsight",
        "ChurnZero",
        "Monday.com",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_onboarding_q1",
          areaId: "bs_onboarding",
          type: "single",
          question:
            "When a new account signs on or places their first order, what do they experience from your team?",
          options: [
            "The order is fulfilled and we wait for the next one",
            "A brief thank you and delivery confirmation",
            "A welcome message and basic onboarding information",
            "A structured onboarding experience — welcome, setup support, success check-in, and a clear path to their next order or milestone",
          ],
        },
        {
          id: "bs_onboarding_q2",
          areaId: "bs_onboarding",
          type: "single",
          question:
            "Does every new account have a named point of contact at your company — someone they know to call?",
          options: [
            "Not always — new accounts get whoever is available",
            "Technically yes but it's not made clear to the client",
            "Yes but transitions happen without proper handoffs",
            "Yes — every new account has a named contact, is introduced to them personally, and knows exactly how to reach them",
          ],
        },
        {
          id: "bs_onboarding_q3",
          areaId: "bs_onboarding",
          type: "single",
          question:
            "Do new accounts receive proactive follow-up after their first purchase to ensure they're getting value?",
          options: [
            "No — if there's a problem, they'll let us know",
            "Informally — we check in if we happen to talk to them",
            "We send a follow-up email",
            "Yes — every first order triggers an automated check-in sequence to confirm satisfaction and identify the next opportunity",
          ],
        },
        {
          id: "bs_onboarding_q4",
          areaId: "bs_onboarding",
          type: "single",
          question:
            "How consistent is the new account experience when your team is busy versus when they have more bandwidth?",
          options: [
            "It varies a lot depending on workload",
            "We try to be consistent but it slips when we're slammed",
            "Mostly consistent for larger accounts",
            "Fully consistent — onboarding is systematized and runs the same way regardless of team workload",
          ],
        },
        {
          id: "bs_onboarding_q5",
          areaId: "bs_onboarding",
          type: "single",
          question:
            "Do you track first-order-to-second-order conversion rate — the percentage of new accounts that place a second order?",
          options: [
            "No — I don't track this",
            "I have a rough sense",
            "I check it occasionally",
            "Yes — I know this number and I have a process specifically designed to improve it",
          ],
        },
      ],
    },

    // ── 6. Account Expansion & Upsell/Cross-Sell ──────────────────────────────
    {
      id: "bs_expansion",
      name: "Account Expansion & Upsell/Cross-Sell",
      leakageType: "revenue-based",
      leakageRate: 0.12,
      industryBenchmarkStat:
        "Upselling contributes 21% of company revenue and cross-selling another 21% — yet most B2B sales teams have no systematic process to identify or pursue expansion within existing accounts. It costs 5-7x more to acquire a new customer than to sell more to an existing one. The most reliable growth path in B2B sales isn't more leads — it's deeper penetration of the accounts you already have.",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "Gainsight",
        "GoHighLevel (GHL)",
        "Pipedrive",
        "ChurnZero",
        "Monday.com",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_expansion_q1",
          areaId: "bs_expansion",
          type: "single",
          question:
            "Do you have a systematic process to identify upsell and cross-sell opportunities within your existing account base?",
          options: [
            "No — expansion happens organically when clients ask",
            "We mention other products occasionally in conversations",
            "We review accounts for expansion opportunities at renewal or reorder",
            "Yes — every account has a documented expansion map and opportunities are pursued systematically",
          ],
        },
        {
          id: "bs_expansion_q2",
          areaId: "bs_expansion",
          type: "single",
          question:
            "What percentage of your existing accounts currently buy more than one product or service from you?",
          options: [
            "Less than 20% — most accounts buy only one thing",
            "20-40%",
            "40-60%",
            "Over 60% — account expansion is a core part of how we grow revenue",
          ],
        },
        {
          id: "bs_expansion_q3",
          areaId: "bs_expansion",
          type: "single",
          question:
            "When you win a new account, is there a process to present additional products or services within the first 90 days?",
          options: [
            "No — we focus on delivering what they bought and hope they ask for more",
            "We mention other offerings informally",
            "We try to have an expansion conversation early but it's not systematic",
            "Yes — every new account triggers a 90-day expansion outreach sequence",
          ],
        },
        {
          id: "bs_expansion_q4",
          areaId: "bs_expansion",
          type: "single",
          question:
            "Do your reps know the full product or service portfolio well enough to identify expansion opportunities in every account?",
          options: [
            "Not really — reps tend to sell what they know and ignore the rest",
            "Some reps do but it's inconsistent",
            "Most reps have a working knowledge of the full portfolio",
            "Yes — every rep is trained on the full portfolio and is accountable for expansion metrics",
          ],
        },
        {
          id: "bs_expansion_q5",
          areaId: "bs_expansion",
          type: "single",
          question:
            "When a client's business grows or changes, does that trigger a proactive conversation about additional needs?",
          options: [
            "No — we wait for them to bring it up",
            "Sometimes — if we happen to hear about a change",
            "We try to stay informed for larger accounts",
            "Yes — account changes trigger an automatic expansion review outreach",
          ],
        },
      ],
    },

    // ── 7. Lapsed Account Reactivation ────────────────────────────────────────
    {
      id: "bs_lapsed",
      name: "Lapsed Account Reactivation",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "The average B2B company has 20-40% of its customer database classified as 'lapsed' — accounts that bought once or twice and then went quiet. These accounts already know you, already trusted you enough to buy, and are often more receptive than cold prospects. Win-back campaigns targeting lapsed B2B accounts consistently outperform cold outreach by 3-5x on conversion rate, at a fraction of the acquisition cost.",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "Pipedrive",
        "Klaviyo",
        "ActiveCampaign",
        "Close CRM",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_lapsed_q1",
          areaId: "bs_lapsed",
          type: "single",
          question:
            "Do you have a process to identify and systematically reach out to accounts that have gone quiet?",
          options: [
            "No — if they stop ordering, we assume they moved on",
            "We notice when big accounts go quiet but rarely act on it",
            "We reach out occasionally when we remember",
            "Yes — accounts that haven't ordered in a defined period automatically enter a win-back sequence",
          ],
        },
        {
          id: "bs_lapsed_q2",
          areaId: "bs_lapsed",
          type: "single",
          question:
            "Do you know the size of your lapsed account database — accounts that bought at least once but haven't ordered in 6+ months?",
          options: [
            "No — I have no visibility into this",
            "I have a rough sense but haven't quantified it",
            "I've looked at it but don't act on it systematically",
            "Yes — I know exactly how many lapsed accounts I have and what they're worth, and I actively work to reactivate them",
          ],
        },
        {
          id: "bs_lapsed_q3",
          areaId: "bs_lapsed",
          type: "single",
          question:
            "When you reach back out to a lapsed account, do you have a compelling reason to re-engage — new products, better pricing, a relevant case study?",
          options: [
            "Not really — we just ask if they need anything",
            "We try to have a reason but it's improvised",
            "We bring new products or offers when we have them",
            "Yes — every win-back outreach is strategically timed and comes with a specific, relevant reason to reconnect",
          ],
        },
        {
          id: "bs_lapsed_q4",
          areaId: "bs_lapsed",
          type: "single",
          question:
            "Do you know why accounts typically go lapsed — is it price, service, competition, or just being forgotten?",
          options: [
            "No — accounts just stop ordering and I'm not sure why",
            "I have a general sense but nothing data-driven",
            "I ask when I find out an account left",
            "Yes — we track lapse reasons and use that data to improve our retention and win-back approach",
          ],
        },
        {
          id: "bs_lapsed_q5",
          areaId: "bs_lapsed",
          type: "single",
          question:
            "Have you successfully reactivated any lapsed accounts in the last 12 months?",
          options: [
            "No — once accounts go quiet, they stay quiet",
            "Once or twice by accident",
            "A few — when I happened to follow up at the right time",
            "Yes — lapsed account reactivation is a regular part of our sales activity with a defined process",
          ],
        },
      ],
    },

    // ── 8. Rep Productivity & Selling Time ────────────────────────────────────
    {
      id: "bs_productivity",
      name: "Rep Productivity & Selling Time",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "The average B2B sales rep spends only 28% of their time actually selling. The other 72% goes to data entry, scheduling, proposal building, internal meetings, and administrative tasks. For a rep earning $80,000 a year, that means you're paying $57,600 annually for work that has nothing to do with selling. Automating even half of the non-selling work recovers more revenue than hiring another rep.",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "Gong",
        "Chorus",
        "Calendly",
        "GoHighLevel (GHL)",
        "Outreach",
        "Salesloft",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_productivity_q1",
          areaId: "bs_productivity",
          type: "single",
          question:
            "How much of your reps' time do you estimate goes to actual selling — conversations, demos, and follow-ups — versus administrative work?",
          options: [
            "Less than 25% — most of the day is admin, scheduling, and data entry",
            "Around 25-40%",
            "Around 40-60%",
            "Over 60% — we've systematically removed admin burden so reps spend most of their time selling",
          ],
        },
        {
          id: "bs_productivity_q2",
          areaId: "bs_productivity",
          type: "single",
          question:
            "Do your reps manually enter call notes, activity logs, and deal updates into your CRM — or is that automated?",
          options: [
            "Mostly manual — reps spend significant time on CRM data entry",
            "Partially automated but still a lot of manual work",
            "Mostly automated with some manual input",
            "Fully automated — calls, emails, and activities are logged automatically without rep involvement",
          ],
        },
        {
          id: "bs_productivity_q3",
          areaId: "bs_productivity",
          type: "single",
          question:
            "How does your team handle meeting scheduling with prospects?",
          options: [
            "Back-and-forth email to find a time — it takes multiple exchanges",
            "We use a basic calendar tool but reps still manage it manually",
            "Booking links are available but not consistently used",
            "Every rep has a booking link in every outreach — prospects book directly with zero back-and-forth",
          ],
        },
        {
          id: "bs_productivity_q4",
          areaId: "bs_productivity",
          type: "single",
          question:
            "Do reps build proposals and quotes from scratch each time — or from templates?",
          options: [
            "From scratch — every proposal takes significant time to build",
            "Loose templates that still require heavy customization",
            "Good templates that can be customized quickly",
            "Automated — proposals are generated from a template in minutes with pre-approved content blocks",
          ],
        },
        {
          id: "bs_productivity_q5",
          areaId: "bs_productivity",
          type: "single",
          question:
            "Do you have visibility into how each rep is spending their time — calls made, meetings held, activities completed — without having to ask them?",
          options: [
            "No — I rely on what reps tell me in meetings",
            "Some visibility through CRM but it's incomplete",
            "Good visibility for most metrics",
            "Full visibility — dashboards show every rep's activity in real time without manual reporting",
          ],
        },
      ],
    },

    // ── 9. Client Communication & Retention ───────────────────────────────────
    {
      id: "bs_client_communication",
      name: "Client Communication & Retention",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "B2B clients who feel forgotten between orders are 4x more likely to switch vendors at their next purchase decision. In most B2B sales organizations, the only time clients hear from their rep is when the rep needs something — a renewal, a reorder, or a referral. Clients who receive consistent, value-driven communication between transactions are 60% more likely to expand their account and 40% more likely to refer.",
      softwareOptions: [
        "HubSpot",
        "GoHighLevel (GHL)",
        "Mailchimp",
        "Klaviyo",
        "Salesforce",
        "ActiveCampaign",
        "Gong",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_client_communication_q1",
          areaId: "bs_client_communication",
          type: "single",
          question:
            "How often do existing accounts hear from your team when there is no immediate transaction — no renewal due, no reorder, nothing to sell?",
          options: [
            "Rarely or never — we reach out when we have something to sell",
            "Occasionally around holidays or major news",
            "A few times a year with market updates or relevant content",
            "Consistently — a regular cadence of value-driven communication runs to our full account base year-round",
          ],
        },
        {
          id: "bs_client_communication_q2",
          areaId: "bs_client_communication",
          type: "single",
          question:
            "When a client has a question, complaint, or request, how quickly do they get a response?",
          options: [
            "Same day or next day — whenever someone gets to it",
            "Within a few hours during business hours",
            "Within an hour — we prioritize client responsiveness",
            "Immediately — automated acknowledgment goes out instantly and we follow up within the hour",
          ],
        },
        {
          id: "bs_client_communication_q3",
          areaId: "bs_client_communication",
          type: "single",
          question:
            "Do you proactively share relevant industry news, product updates, or insights that help your clients' businesses — not just promotions?",
          options: [
            "No — our communication is focused on our products and promotions",
            "Occasionally when something major comes up",
            "Periodically — we try to add value but it's not systematic",
            "Yes — clients receive regular, relevant content that makes us a trusted advisor, not just a vendor",
          ],
        },
        {
          id: "bs_client_communication_q4",
          areaId: "bs_client_communication",
          type: "single",
          question:
            "Do your top accounts receive regular business reviews — a structured conversation about performance, results, and upcoming needs?",
          options: [
            "No — we review accounts informally when something comes up",
            "For our very largest accounts only",
            "For accounts above a certain revenue threshold",
            "Yes — every account above a defined threshold receives a quarterly business review on the calendar",
          ],
        },
        {
          id: "bs_client_communication_q5",
          areaId: "bs_client_communication",
          type: "single",
          question:
            "Do clients know their rep's name, direct line, and how to reach them for urgent issues?",
          options: [
            "Not always — service requests go to a general inbox or main number",
            "Most clients know their rep but communication protocols aren't formalized",
            "Yes, for active accounts",
            "Yes — every account has a named rep with direct contact info, and that's reinforced regularly",
          ],
        },
      ],
    },

    // ── 10. Referrals & Network Development ───────────────────────────────────
    {
      id: "bs_referral",
      name: "Referrals & Network Development",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "84% of B2B buyers begin their purchase process with a referral. Referral-sourced leads convert at 3-5x the rate of cold outreach and have a 16% higher lifetime value. Yet most B2B sales organizations have no formal referral program — referrals happen by accident, not by design. A single satisfied client who refers consistently is worth more than most paid lead sources combined.",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "GoHighLevel (GHL)",
        "ReferralHero",
        "PartnerStack",
        "LinkedIn",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_referral_q1",
          areaId: "bs_referral",
          type: "single",
          question:
            "Do you have a formal process to ask satisfied clients for referrals — or does it happen organically?",
          options: [
            "Entirely organic — we never formally ask",
            "We mention it occasionally but nothing systematic",
            "We ask most satisfied clients but the ask is informal",
            "Yes — every strong account relationship includes a structured referral ask, and we track referral activity",
          ],
        },
        {
          id: "bs_referral_q2",
          areaId: "bs_referral",
          type: "single",
          question:
            "Do you have formal referral partnerships with complementary businesses — vendors, associations, or service providers who serve the same clients you target?",
          options: [
            "No — referrals happen from clients only and informally",
            "I have informal relationships with a few people",
            "Some partnerships but they're not structured or active",
            "Yes — I have documented referral agreements with partner businesses and I nurture those relationships systematically",
          ],
        },
        {
          id: "bs_referral_q3",
          areaId: "bs_referral",
          type: "single",
          question:
            "Do you know which clients and partners are your top referral sources?",
          options: [
            "No — referrals show up and I don't know who sent them",
            "I have a rough idea of a few top referrers",
            "I track it manually sometimes",
            "Yes — referral sources are tracked in our CRM and top referrers get systematic appreciation and recognition",
          ],
        },
        {
          id: "bs_referral_q4",
          areaId: "bs_referral",
          type: "single",
          question:
            "When a referral comes in, is there a fast, professional process to follow up and convert them?",
          options: [
            "They get the same treatment as any other cold lead",
            "We try to prioritize them but it's not formalized",
            "We flag referrals and follow up quickly",
            "Yes — referral leads trigger an immediate, high-priority follow-up sequence with specific messaging that acknowledges the referral",
          ],
        },
        {
          id: "bs_referral_q5",
          areaId: "bs_referral",
          type: "single",
          question:
            "What percentage of your new business currently comes from referrals?",
          options: [
            "Less than 20% — most new business comes from outbound or marketing",
            "20-40%",
            "40-60%",
            "Over 60% — referrals are the primary driver of new business",
          ],
        },
      ],
    },

    // ── 11. Events & Trade Show Follow-Up ─────────────────────────────────────
    //
    // bs_events_q1 is a gateway question. If the user selects "No — we don't
    // attend events", all remaining questions in the area (q2–q5) are skipped
    // via skipIf. The software selector is shown first (standard engine order)
    // and cannot be skipped retroactively — but if the user picked "None" there,
    // the standard skip logic already bypasses q1–q5 anyway.
    {
      id: "bs_events",
      name: "Events & Trade Show Follow-Up",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "81% of trade show and industry event attendees have buying authority — making events one of the highest-quality lead sources in B2B sales. Yet 80% of event leads never receive a single follow-up. The average cost per event lead is $112. Losing 4 out of 5 leads to poor follow-up processes means most companies are spending thousands of dollars to collect business cards that never turn into conversations.",
      softwareOptions: [
        "HubSpot",
        "GoHighLevel (GHL)",
        "Salesforce",
        "Cvent",
        "Bizzabo",
        "LinkedIn",
        "Exhibitor lead capture app (badge scan)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_events_q1",
          areaId: "bs_events",
          type: "single",
          question:
            "Does your team attend trade shows, industry events, or conferences to generate new business?",
          options: [
            "No — we don't attend events",
            "Occasionally — once or twice a year",
            "Regularly — events are an important part of our pipeline",
            "Yes — events are a primary lead source and we have a defined strategy for each one",
          ],
        },
        {
          id: "bs_events_q2",
          areaId: "bs_events",
          type: "single",
          question:
            "When your team collects contacts at an event, how quickly does follow-up happen?",
          skipIf: {
            questionId: "bs_events_q1",
            answer: "No — we don't attend events",
          },
          options: [
            "Days or weeks later — when someone gets around to it",
            "Within a week — we try to follow up before it goes cold",
            "Within 48 hours for hot leads",
            "Within 24 hours — every event contact enters an automated follow-up sequence before we're home from the event",
          ],
        },
        {
          id: "bs_events_q3",
          areaId: "bs_events",
          type: "single",
          question:
            "Do event leads enter a structured nurture sequence — or do they get a single follow-up email and then go cold?",
          skipIf: {
            questionId: "bs_events_q1",
            answer: "No — we don't attend events",
          },
          options: [
            "Single email or no follow-up at all",
            "A couple of follow-ups, then they go cold",
            "A few touchpoints over a few weeks",
            "A full multi-touch sequence with multiple channels over 60-90 days",
          ],
        },
        {
          id: "bs_events_q4",
          areaId: "bs_events",
          type: "single",
          question:
            "Do you track ROI from events — how many leads generated, how many converted, and what revenue came from each event?",
          skipIf: {
            questionId: "bs_events_q1",
            answer: "No — we don't attend events",
          },
          options: [
            "No — we go to events and hope for the best",
            "General sense of whether an event was worthwhile",
            "We track leads but not conversion or revenue",
            "Yes — every event has a documented ROI: leads, conversions, and revenue attributed",
          ],
        },
        {
          id: "bs_events_q5",
          areaId: "bs_events",
          type: "single",
          question:
            "Before attending an event, do you pre-book meetings with target prospects attending — or do you rely on walk-up conversations?",
          skipIf: {
            questionId: "bs_events_q1",
            answer: "No — we don't attend events",
          },
          options: [
            "Entirely walk-up — we meet whoever we meet",
            "Occasionally try to pre-book but it's not systematic",
            "We pre-book for our best target accounts",
            "Yes — every event includes a pre-event outreach campaign to book meetings in advance with priority targets",
          ],
        },
      ],
    },

    // ── 12. Business Visibility & Reporting ───────────────────────────────────
    {
      id: "bs_reporting",
      name: "Business Visibility & Reporting",
      leakageType: "multiplier",
      leakageRate: 0.40,
      industryBenchmarkStat:
        "B2B companies with optimized sales pipelines achieve 5-10% higher revenue growth than peers — not because they have better products or more leads, but because they can see problems early and act on them. 82% of B2B organizations report significant revenue leakage in their sales processes. Most of that leakage is invisible to leadership until it shows up as a missed quarter. Visibility doesn't just help you manage — it helps you grow.",
      softwareOptions: [
        "HubSpot",
        "Salesforce",
        "Pipedrive",
        "Gong",
        "Clari",
        "Databox",
        "GoHighLevel (GHL)",
        "Google Sheets / Excel",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "bs_reporting_q1",
          areaId: "bs_reporting",
          type: "single",
          question:
            "Do you have real-time visibility into total pipeline value, stage distribution, and expected close dates — without having to ask your reps?",
          options: [
            "No — I rely on what reps tell me in meetings",
            "I can pull a CRM report but it's often incomplete or outdated",
            "Reasonably good visibility with some gaps",
            "Yes — a live dashboard shows total pipeline, stage breakdown, and forecast at any moment",
          ],
        },
        {
          id: "bs_reporting_q2",
          areaId: "bs_reporting",
          type: "single",
          question:
            "Do you review pipeline health and rep activity on a regular schedule — weekly, not just monthly?",
          options: [
            "Rarely — we review when something feels off",
            "Monthly or so",
            "Weekly — I review pipeline and rep activity consistently",
            "Yes — weekly pipeline review is a locked ritual with a defined format and follow-up actions",
          ],
        },
        {
          id: "bs_reporting_q3",
          areaId: "bs_reporting",
          type: "single",
          question:
            "Do you know your average sales cycle length — from first contact to closed deal?",
          options: [
            "No — I don't track this",
            "I have a rough idea",
            "I calculate it occasionally",
            "Yes — I know it precisely and I use it to forecast revenue and spot stalled deals",
          ],
        },
        {
          id: "bs_reporting_q4",
          areaId: "bs_reporting",
          type: "single",
          question:
            "Can you identify which reps are performing well and which are struggling — based on data, not just gut feel?",
          options: [
            "Not really — I go by feel and rep self-reporting",
            "Some data but incomplete",
            "Good visibility for most metrics",
            "Yes — rep-level dashboards show activity, conversion rates, and revenue contribution in real time",
          ],
        },
        {
          id: "bs_reporting_q5",
          areaId: "bs_reporting",
          type: "single",
          question:
            "If your pipeline dried up today, would you know — or would you feel it in the revenue number three months from now?",
          options: [
            "I'd feel it three months from now — I have no forward visibility",
            "I'd have a general sense something was off",
            "I'd notice within a few weeks",
            "I'd know immediately — pipeline coverage and velocity are reviewed weekly",
          ],
        },
      ],
    },
  ],

  // ─── Leakage formula lookup ───────────────────────────────────────────────────
  leakageFormula: {
    bs_lead_capture:          0.20,
    bs_prospecting:           0.15,
    bs_followup:              0.18,
    bs_sales_process:         0.07,
    bs_onboarding:            0.06,
    bs_expansion:             0.12,
    bs_lapsed:                0.10,
    bs_productivity:          0.08,
    bs_client_communication:  0.06,
    bs_referral:              0.08,
    bs_events:                0.07,
    bs_reporting:             0.40,
  },

  // ─── AI prompt additions ──────────────────────────────────────────────────────
  aiPromptAdditions: `VERTICAL CONTEXT: B2B Sales Organization

This audit is for a B2B sales organization. Use the following terminology and context throughout all findings and recommendations.

TERMINOLOGY — use these consistently:
- "prospects" or "leads" — for people not yet customers
- "accounts" or "clients" — for existing customers
- "pipeline" — the collection of active deals being worked
- "close" or "convert" — not "complete" or "finish" for winning a deal
- "quota" — the rep's revenue target
- "deal" or "opportunity" — not "job" or "project" for an active sales effort
- "ICP" (Ideal Customer Profile) — the definition of the perfect prospect
- "cadence" or "sequence" — for structured follow-up processes
- "win rate" — the percentage of deals that close
- "sales cycle" — time from first contact to close
- "land and expand" — the strategy of winning a small initial deal and growing it
- "rep" or "AE" (Account Executive) — for sales team members
- "lapsed account" or "dormant account" — for accounts that haven't bought recently
- "avg_job_value" in formulas = average order or deal value

PAIN POINT CONTEXT:
- The follow-up gap is the single biggest leakage in B2B sales. 48% of reps never follow up after first contact. 80% of sales require 5+ touches. The deals are there — they're just dying from neglect.
- Reps spend only 28% of their time selling. Every hour recovered from admin work is an hour that can go toward revenue. Automation of scheduling, data entry, and proposal generation is a direct revenue investment.
- The lapsed account database is almost always underutilized. Accounts that bought once and went quiet are warm prospects who already trusted the company enough to buy. Win-back campaigns on this database are among the highest-ROI activities in sales.
- Account expansion is cheaper and faster than new customer acquisition. Selling more to existing accounts should be the primary growth strategy before investing in new lead generation.
- Response speed is a competitive differentiator, not just a courtesy. 50% of buyers go with the first vendor to respond. An automated response in minutes beats a thoughtful response in hours.

SALES MODEL VOCABULARY (use bs_sales_model answer to adapt tone):
- "Field sales — reps visit prospects and clients in person" -> use "territory," "in-person visits," "on-site demos," "travel," "route"
- "Inside sales — reps sell primarily by phone, email, and video" -> use "call volume," "video demos," "email sequences," "dial targets"
- "Hybrid — a mix of in-person and remote selling" -> use both contextually
- "Owner-led — I personally handle most or all of the selling" -> use "your time," "bandwidth," "personal capacity," "wearing multiple hats"
- "Channel/distributor — we sell through partners or reps who represent us" -> use "partner reps," "channel partners," "co-selling," "distributor relationships"

COMPETITIVE CONTEXT:
- SMB B2B sales organizations are often being outcompeted not by better products but by better follow-up processes. A competitor with an automated 8-touch sequence will consistently beat a rep who sends one email.
- The fastest-growing B2B sales organizations are systematizing what top reps do naturally — persistent follow-up, timely proposals, consistent check-ins — and making it the floor for every rep, not just the ceiling for the best one.
- Recommendations should orient toward building a repeatable system, not relying on individual rep heroics.

PRIORITY ORDERING:
For B2B sales, weight these areas more heavily in Priority Actions:
1. Lead Nurture & Multi-Touch Follow-Up — always top priority if score below 70 (biggest addressable leakage in B2B sales)
2. Account Expansion & Upsell/Cross-Sell — second priority (highest ROI growth path)
3. Lapsed Account Reactivation — third priority (warm prospects at near-zero acquisition cost)
4. Lead Capture & Response Speed — fourth priority (winner-take-all dynamic)`,
};
