import type { VerticalConfig } from "./types";

export const fitnessWellnessConfig: VerticalConfig = {
  verticalId: "fitness-wellness",
  displayName: "Fitness & Wellness Audit",

  skipQuestions: ["intro_business", "financial_platform"],

  // ─── Intro question overrides ────────────────────────────────────────────────
  introQuestions: {
    fin_avg_sale: {
      question: "Average monthly membership or package value",
      options: [
        "Under $30",
        "$30–$50",
        "$50–$75",
        "$75–$100",
        "$100–$150",
        "$150–$200",
        "$200–$300",
        "Over $300",
        "I'm not sure",
        "Enter exact amount",
      ],
      midpoints: {
        "Under $30": 20,
        "$30–$50": 40,
        "$50–$75": 62,
        "$75–$100": 87,
        "$100–$150": 125,
        "$150–$200": 175,
        "$200–$300": 250,
        "Over $300": 400,
        "I'm not sure": 100,
        "Enter exact amount": 0,
      },
    },
    fin_close_rate: {
      question: "Trial-to-member conversion rate",
    },
    fin_monthly_leads: {
      question: "New prospects or trial members per month",
    },
    fin_monthly_revenue: {
      question: "Average monthly revenue",
    },
    // ── New question — injected at the intro_business position ─────────────────
    fw_facility_type: {
      id: "fw_facility_type",
      areaId: null,
      type: "single",
      question: "Which best describes your facility?",
      options: [
        "Gym or fitness center",
        "Boutique studio",
        "Personal training studio",
        "CrossFit or functional fitness affiliate",
        "Martial arts, boxing, or MMA gym",
        "Wellness center",
        "Mixed — multiple formats or modalities",
      ],
    },
  },

  // ─── Workflow areas ──────────────────────────────────────────────────────────
  workflowAreas: [
    // ── 1. Lead Capture & Response Time ───────────────────────────────────────
    {
      id: "fw_lead_capture",
      name: "Lead Capture & Response Time",
      leakageType: "lead-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "82% of fitness prospects visit or contact multiple gyms before choosing one. The facility that responds first wins the visit more than 50% of the time — not the one with the best equipment or the lowest price. Yet the average gym takes over 24 hours to respond to a web inquiry. By then, the prospect has already walked into a competitor. — IHRSA 2024 Health Club Consumer Report / Lead Response Management Study",
      softwareOptions: [
        "Mindbody",
        "Club OS",
        "Zen Planner",
        "Wodify",
        "GoHighLevel (GHL)",
        "HubSpot",
        "GymSales",
        "Glofox",
        "PushPress",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_lead_capture_q1",
          areaId: "fw_lead_capture",
          type: "single",
          question:
            "When a new prospect reaches out — through your website, social media, Google, or a walk-in — how quickly do they typically hear back?",
          options: [
            "Hours later or the next day — whenever someone gets to it",
            "Within the hour if we're not busy with members",
            "Within a few minutes — we prioritize fast response",
            "Instantly — an automated system acknowledges every inquiry immediately and sets up next steps",
          ],
        },
        {
          id: "fw_lead_capture_q2",
          areaId: "fw_lead_capture",
          type: "single",
          question: "Where do most of your new prospects come from?",
          options: [
            "Walk-ins and word of mouth — almost entirely organic",
            "Social media — Instagram, Facebook, TikTok",
            "Google search and our website",
            "I'm not sure — we don't track lead sources",
            "Multiple channels — leads come from several different places and we track each one",
          ],
        },
        {
          id: "fw_lead_capture_q3",
          areaId: "fw_lead_capture",
          type: "single",
          question:
            "Do you track every prospect — where they came from, what they asked about, and whether they converted?",
          options: [
            "No — prospects come in and we don't log them formally",
            "I keep rough notes but nothing systematic",
            "Mostly tracked but inconsistently",
            "Yes — every prospect is in our CRM with full source tracking and current status",
          ],
        },
        {
          id: "fw_lead_capture_q4",
          areaId: "fw_lead_capture",
          type: "single",
          question:
            "Can prospects book a tour, trial class, or consultation directly from your website or social media — without calling or emailing?",
          options: [
            "No — they have to call, DM, or walk in",
            "We have a contact form but no direct booking",
            "We have online booking but it's not prominently featured",
            "Yes — one-click booking for tours, trials, and consultations is prominent across all channels",
          ],
        },
        {
          id: "fw_lead_capture_q5",
          areaId: "fw_lead_capture",
          type: "single",
          question:
            "When a prospect inquires after hours or on weekends, what happens?",
          options: [
            "Nothing — it waits until we're open",
            "Someone might see it and respond but it's not guaranteed",
            "We have an informal after-hours process",
            "An automated response acknowledges them immediately and books a next step",
          ],
        },
      ],
    },

    // ── 2. Trial-to-Member Conversion ─────────────────────────────────────────
    {
      id: "fw_trial_conversion",
      name: "Trial-to-Member Conversion",
      leakageType: "lead-based",
      leakageRate: 0.18,
      industryBenchmarkStat:
        "The average gym converts only 20-30% of trial visitors into paying members. Top-performing facilities with a structured trial experience and systematic follow-up convert at 50-60%. The difference is not the facility — it's the process. A trial member who leaves without a follow-up call within 24 hours is 80% less likely to join than one who receives a personal check-in. — IHRSA 2024 Profiles of Success / ClubReady Conversion Benchmark Data",
      softwareOptions: [
        "Club OS",
        "GymSales",
        "Mindbody",
        "Zen Planner",
        "Wodify",
        "GoHighLevel (GHL)",
        "Glofox",
        "PushPress",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_trial_conversion_q1",
          areaId: "fw_trial_conversion",
          type: "single",
          question:
            "When a prospect comes in for a trial class, free session, or tour, do they experience a structured process designed to convert them?",
          options: [
            "No — they try the class and we hope they sign up",
            "We give them a tour and explain pricing",
            "We have a loose process but it varies by staff member",
            "Yes — every trial follows a documented sequence: welcome, guided experience, needs assessment, membership presentation, and scheduled follow-up",
          ],
        },
        {
          id: "fw_trial_conversion_q2",
          areaId: "fw_trial_conversion",
          type: "single",
          question:
            "After a prospect completes a trial visit and doesn't sign up on the spot, what happens?",
          options: [
            "Nothing — we assume they'll come back if they're interested",
            "We follow up once or twice, then stop",
            "We try to follow up but it's inconsistent",
            "They enter an automated follow-up sequence that runs until they join or formally decline",
          ],
        },
        {
          id: "fw_trial_conversion_q3",
          areaId: "fw_trial_conversion",
          type: "single",
          question:
            "Do you track your trial-to-member conversion rate — and do you know how it compares to industry benchmarks?",
          options: [
            "No — I don't track this",
            "I have a rough sense but nothing calculated",
            "I calculate it sometimes",
            "Yes — I know exactly and I use it to improve our conversion process",
          ],
        },
        {
          id: "fw_trial_conversion_q4",
          areaId: "fw_trial_conversion",
          type: "single",
          question:
            "Does every prospect who visits receive a personalized follow-up — not just a generic email?",
          options: [
            "No — we send the same thing to everyone, if anything",
            "A generic follow-up email goes out",
            "We try to personalize but it's not consistent",
            "Yes — every follow-up references their specific goals, the class they tried, and a clear next step",
          ],
        },
        {
          id: "fw_trial_conversion_q5",
          areaId: "fw_trial_conversion",
          type: "single",
          question:
            "Do you present membership options during the trial visit — or wait for the prospect to ask about pricing?",
          options: [
            "We wait — we don't want to be pushy",
            "We mention pricing if they ask",
            "We discuss options but it's not structured",
            "Yes — every trial includes a natural transition to a membership conversation with clear options presented",
          ],
        },
      ],
    },

    // ── 3. New Member Onboarding ──────────────────────────────────────────────
    {
      id: "fw_onboarding",
      name: "New Member Onboarding",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "Members who complete a structured onboarding program in their first 30 days are 75% more likely to still be active at 12 months. The first 30 days determine whether a new member builds a habit or becomes a ghost member — someone who pays but never shows up, and eventually cancels. Most gyms do nothing after the signup. — IHRSA 2024 Member Retention Report / Les Mills 2023 Global Consumer Fitness Survey",
      softwareOptions: [
        "Mindbody",
        "Zen Planner",
        "Wodify",
        "Club OS",
        "GoHighLevel (GHL)",
        "Glofox",
        "PushPress",
        "Trainerize",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_onboarding_q1",
          areaId: "fw_onboarding",
          type: "single",
          question:
            "When a new member signs up, what do they experience in their first week?",
          options: [
            "They get access and figure it out themselves",
            "A welcome email with basic information",
            "An intro session or orientation",
            "A structured onboarding program — welcome, goal setting, intro sessions, check-ins, and a clear path to their first milestone",
          ],
        },
        {
          id: "fw_onboarding_q2",
          areaId: "fw_onboarding",
          type: "single",
          question:
            "Does every new member have a named staff contact — someone who checks in on them during their first 30 days?",
          options: [
            "No — new members are on their own after signup",
            "Informally — if a trainer notices them",
            "We try to assign someone but it's inconsistent",
            "Yes — every new member has a named point of contact who reaches out during the first 30 days on a defined schedule",
          ],
        },
        {
          id: "fw_onboarding_q3",
          areaId: "fw_onboarding",
          type: "single",
          question:
            "Do you track how often new members visit in their first 30 days — and intervene if they stop showing up?",
          options: [
            "No — we don't monitor new member attendance",
            "We notice if they're around but don't track formally",
            "We track it loosely",
            "Yes — attendance is monitored automatically and a low-visit alert triggers a personal outreach within the first 30 days",
          ],
        },
        {
          id: "fw_onboarding_q4",
          areaId: "fw_onboarding",
          type: "single",
          question:
            "Do new members set specific goals during onboarding — and does your team reference those goals in follow-ups?",
          options: [
            "No — we don't collect goals formally",
            "We ask about goals verbally but don't document them",
            "Goals are documented but rarely referenced",
            "Yes — every new member sets documented goals and our team uses them to personalize check-ins and progress updates",
          ],
        },
        {
          id: "fw_onboarding_q5",
          areaId: "fw_onboarding",
          type: "single",
          question:
            "How consistent is the new member experience when you're busy versus when you have more time?",
          options: [
            "It varies a lot depending on how busy we are",
            "We try to be consistent but things slip when it's crowded",
            "Mostly consistent for most members",
            "Fully consistent — onboarding is systematized and runs the same way regardless of staff workload",
          ],
        },
      ],
    },

    // ── 4. Member Retention & Churn Prevention ────────────────────────────────
    {
      id: "fw_retention",
      name: "Member Retention & Churn Prevention",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "The average gym loses 30-50% of its members every year. Most cancellations are predictable weeks in advance — declining visit frequency is the single strongest predictor of churn. Members who drop from 3 visits per week to 1 cancel within 60 days at a rate of 70%. Yet most facilities have no early warning system and only learn about churn when the cancellation request arrives. — IHRSA 2024 Member Retention Report / Retention Guru Fitness Industry Benchmark",
      softwareOptions: [
        "Mindbody",
        "Zen Planner",
        "Club OS",
        "Wodify",
        "Glofox",
        "PushPress",
        "GoHighLevel (GHL)",
        "UpLaunch",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_retention_q1",
          areaId: "fw_retention",
          type: "single",
          question:
            "Do you monitor member visit frequency — and does a decline in attendance automatically trigger outreach?",
          options: [
            "No — we don't track individual attendance patterns",
            "We notice when regulars disappear but don't act systematically",
            "We run attendance reports occasionally",
            "Yes — declining attendance triggers an automatic personal outreach before the member considers cancelling",
          ],
        },
        {
          id: "fw_retention_q2",
          areaId: "fw_retention",
          type: "single",
          question:
            "When a member requests to cancel, do you have a structured save process — or do you just process the cancellation?",
          options: [
            "We process it — if they want to leave, they leave",
            "We ask why informally but don't have a process",
            "We try to offer alternatives but it varies by staff",
            "Yes — every cancellation request triggers a documented save conversation with specific retention offers based on the reason for leaving",
          ],
        },
        {
          id: "fw_retention_q3",
          areaId: "fw_retention",
          type: "single",
          question:
            "Do you know your current monthly churn rate — and how it compares to industry benchmarks?",
          options: [
            "No — I don't track this formally",
            "I have a rough sense from billing",
            "I calculate it occasionally",
            "Yes — I track churn monthly and I know whether it's improving or getting worse",
          ],
        },
        {
          id: "fw_retention_q4",
          areaId: "fw_retention",
          type: "single",
          question:
            "Do members receive regular check-ins or milestone celebrations — not just billing reminders?",
          options: [
            "No — members hear from us only when payment is due",
            "Occasionally — around holidays or promotions",
            "We try to recognize milestones but it's manual and inconsistent",
            "Yes — automated milestone celebrations, anniversary messages, and progress check-ins run for every member",
          ],
        },
        {
          id: "fw_retention_q5",
          areaId: "fw_retention",
          type: "single",
          question:
            "What percentage of your members would you classify as 'ghost members' — they're still paying but haven't visited in 30+ days?",
          options: [
            "More than 30% — a significant portion of our members rarely show up",
            "20-30%",
            "10-20%",
            "I'm not sure — we don't track this",
            "Under 10% — we actively engage inactive members before they become ghosts",
          ],
        },
      ],
    },

    // ── 5. Class & Session Scheduling ─────────────────────────────────────────
    {
      id: "fw_scheduling",
      name: "Class & Session Scheduling",
      leakageType: "revenue-based",
      leakageRate: 0.09,
      industryBenchmarkStat:
        "No-shows and late cancellations cost the average boutique studio $15,000-$30,000 per year in lost revenue. Facilities that require advance booking, charge for no-shows, and send automated reminders reduce no-show rates by up to 60%. Every empty spot in a class or session that could have been filled is revenue that's gone forever. — Mindbody 2024 Fitness Industry Trends Report / ClassPass Scheduling Benchmark Data",
      softwareOptions: [
        "Mindbody",
        "Zen Planner",
        "Wodify",
        "Glofox",
        "PushPress",
        "Acuity Scheduling",
        "Calendly",
        "WellnessLiving",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_scheduling_q1",
          areaId: "fw_scheduling",
          type: "single",
          question: "How do members currently book classes, sessions, or appointments?",
          options: [
            "Walk-in only — no advance booking required",
            "Phone or text to reserve a spot",
            "Online booking is available but not widely used",
            "Online booking is the standard — members self-schedule through an app or website with real-time availability",
          ],
        },
        {
          id: "fw_scheduling_q2",
          areaId: "fw_scheduling",
          type: "single",
          question:
            "What is your approximate no-show and late cancellation rate for classes or sessions?",
          options: [
            "High — more than 20% of reserved spots go unused",
            "Moderate — around 10-20%",
            "Low — under 10%",
            "I'm not sure — we don't track this",
            "Very low — under 5%, and we have a system that keeps it there",
          ],
        },
        {
          id: "fw_scheduling_q3",
          areaId: "fw_scheduling",
          type: "single",
          question:
            "Do members receive automated reminders before their booked class or session?",
          options: [
            "No — they're expected to remember on their own",
            "We send a reminder sometimes but it's manual",
            "Automated reminders go out but only for some class types",
            "Yes — every booking triggers automated reminders via text and email with a simple cancel/reschedule option",
          ],
        },
        {
          id: "fw_scheduling_q4",
          areaId: "fw_scheduling",
          type: "single",
          question:
            "When a member cancels, does the system automatically open the spot and notify the waitlist?",
          options: [
            "No — cancelled spots sit empty unless someone calls",
            "We try to fill spots manually when we notice cancellations",
            "We have a waitlist but notifications are manual",
            "Yes — cancellations instantly open the spot and the next person on the waitlist is notified automatically",
          ],
        },
        {
          id: "fw_scheduling_q5",
          areaId: "fw_scheduling",
          type: "single",
          question:
            "Do you enforce a no-show or late cancellation policy — with a fee or a consequence?",
          options: [
            "No — no consequences for no-shows",
            "We have a policy on paper but don't enforce it",
            "We enforce it inconsistently",
            "Yes — a clear no-show policy is enforced automatically through our booking system",
          ],
        },
      ],
    },

    // ── 6. Revenue Optimization & Upsell ──────────────────────────────────────
    {
      id: "fw_revenue_optimization",
      name: "Revenue Optimization & Upsell",
      leakageType: "revenue-based",
      leakageRate: 0.12,
      industryBenchmarkStat:
        "Top-performing fitness facilities generate 30-40% of revenue from secondary sources — personal training, nutrition coaching, retail, specialty programs, and premium upgrades. The average gym relies almost entirely on membership dues. Facilities with a systematic upsell process increase revenue per member by 35% without acquiring a single new member. — IHRSA 2024 Profiles of Success / ClubReady Revenue Benchmark Data",
      softwareOptions: [
        "Mindbody",
        "Zen Planner",
        "Wodify",
        "Glofox",
        "PushPress",
        "Trainerize",
        "GoHighLevel (GHL)",
        "Square",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_revenue_optimization_q1",
          areaId: "fw_revenue_optimization",
          type: "single",
          question:
            "Do you have a systematic process to present personal training, nutrition coaching, or premium programs to existing members?",
          options: [
            "No — we offer them if members ask",
            "We mention it occasionally in conversations",
            "We try to present add-ons at certain milestones",
            "Yes — every member receives a systematic, personalized presentation of relevant add-on services at the right moment",
          ],
        },
        {
          id: "fw_revenue_optimization_q2",
          areaId: "fw_revenue_optimization",
          type: "single",
          question:
            "What percentage of your total revenue comes from sources beyond base membership dues — PT, retail, specialty classes, workshops?",
          options: [
            "Less than 10% — almost all revenue is membership dues",
            "10-20%",
            "20-30%",
            "Over 30% — secondary revenue is a core part of our business model",
          ],
        },
        {
          id: "fw_revenue_optimization_q3",
          areaId: "fw_revenue_optimization",
          type: "single",
          question:
            "Do you offer tiered membership levels — and do you have a process to upgrade members to higher tiers?",
          options: [
            "No — one membership option for everyone",
            "We have tiers but don't actively promote upgrades",
            "We present upgrade options occasionally",
            "Yes — we have defined tiers and a systematic upgrade path that's presented at the right moments based on member behavior",
          ],
        },
        {
          id: "fw_revenue_optimization_q4",
          areaId: "fw_revenue_optimization",
          type: "single",
          question:
            "Do you sell retail products — supplements, apparel, equipment — and is there a process to recommend them?",
          options: [
            "No retail or very minimal",
            "We have products available but staff don't actively recommend them",
            "Staff recommend products when it comes up naturally",
            "Yes — retail recommendations are integrated into the member experience and staff are trained to present them contextually",
          ],
        },
        {
          id: "fw_revenue_optimization_q5",
          areaId: "fw_revenue_optimization",
          type: "single",
          question:
            "Do you run workshops, challenges, or specialty programs — and do they generate meaningful revenue?",
          options: [
            "No — we don't offer these",
            "Occasionally but they're not a consistent revenue source",
            "We run them regularly but promotion is inconsistent",
            "Yes — we run regular programs with systematic promotion, and they're a significant revenue contributor",
          ],
        },
      ],
    },

    // ── 7. Member Communication & Engagement ──────────────────────────────────
    {
      id: "fw_communication",
      name: "Member Communication & Engagement",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "Members who feel a personal connection to their gym are 4.5x less likely to cancel. The single biggest driver of that connection is not the facility or the equipment — it's consistent, value-driven communication between visits. Most gyms only reach out when payment fails or a promotion is running. Members who receive regular non-sales communication retain at 2x the rate. — Les Mills 2023 Global Consumer Fitness Survey / IHRSA Member Experience Research",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Mailchimp",
        "Klaviyo",
        "Mindbody",
        "Zen Planner",
        "Wodify",
        "ActiveCampaign",
        "Email (Gmail / Outlook)",
        "SMS / Text Message",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_communication_q1",
          areaId: "fw_communication",
          type: "single",
          question:
            "How often do members hear from you when there's no payment due, no promotion, and no class to sell?",
          options: [
            "Rarely or never — we communicate when we have something to sell or collect",
            "Occasionally around holidays or major events",
            "A few times a year with tips, updates, or community content",
            "Consistently — a regular cadence of value-driven content goes to our full member base year-round",
          ],
        },
        {
          id: "fw_communication_q2",
          areaId: "fw_communication",
          type: "single",
          question:
            "Do members receive personalized content based on their goals, class preferences, or visit history — or does everyone get the same message?",
          options: [
            "Everyone gets the same blast — if they get anything at all",
            "We segment by membership type but not by behavior",
            "Some personalization but it's manual and inconsistent",
            "Yes — communication is segmented by member behavior, goals, and engagement level automatically",
          ],
        },
        {
          id: "fw_communication_q3",
          areaId: "fw_communication",
          type: "single",
          question:
            "Do you share member success stories, transformations, or community highlights — and do members know about each other's wins?",
          options: [
            "No — we don't share member stories",
            "Occasionally on social media when something comes up",
            "We try to highlight members but it's not systematic",
            "Yes — member spotlights, transformations, and community highlights are a regular, systematic part of our communication",
          ],
        },
        {
          id: "fw_communication_q4",
          areaId: "fw_communication",
          type: "single",
          question:
            "When a member has a complaint, question, or concern, how quickly do they get a response?",
          options: [
            "It depends — whenever someone sees the message",
            "Same day or next day",
            "Within a few hours during business hours",
            "Within the hour — and they know exactly how to reach us for urgent issues",
          ],
        },
        {
          id: "fw_communication_q5",
          areaId: "fw_communication",
          type: "single",
          question:
            "Do you use an app, portal, or community platform to stay connected with members between visits?",
          options: [
            "No — our only touchpoint is when they're physically in the facility",
            "We have social media but nothing member-specific",
            "We have an app or group but engagement is low",
            "Yes — members use a dedicated app or platform to book, track progress, connect with staff, and engage with the community",
          ],
        },
      ],
    },

    // ── 8. Reviews & Reputation ───────────────────────────────────────────────
    {
      id: "fw_reviews",
      name: "Reviews & Online Reputation",
      leakageType: "revenue-based",
      leakageRate: 0.09,
      industryBenchmarkStat:
        "90% of prospective gym members read online reviews before visiting a facility. Gyms with 50+ Google reviews and a 4.5+ rating generate 3x more inbound leads than those with fewer than 10 reviews. Every month without a steady stream of new reviews is a month where your competitors' review profiles are pulling prospects away from yours. — BrightLocal 2024 Consumer Review Survey / Podium 2024 Fitness Industry Review Report",
      softwareOptions: [
        "Google Business Profile",
        "Birdeye",
        "Podium",
        "NiceJob",
        "Yelp",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_reviews_q1",
          areaId: "fw_reviews",
          type: "single",
          question: "How do you currently ask members for reviews?",
          options: [
            "We don't — we hope satisfied members leave reviews on their own",
            "We ask verbally when we remember",
            "We send a request to some members via text or email",
            "An automated review request goes out to every member at the right moment — after a milestone, a great class, or a positive interaction",
          ],
        },
        {
          id: "fw_reviews_q2",
          areaId: "fw_reviews",
          type: "single",
          question: "How many new Google reviews has your facility received in the last 90 days?",
          options: [
            "0 to 3",
            "4 to 8",
            "9 to 15",
            "I'm not sure — I don't track this",
            "16 or more",
          ],
        },
        {
          id: "fw_reviews_q3",
          areaId: "fw_reviews",
          type: "single",
          question: "Do you respond to every online review — positive and negative?",
          options: [
            "Rarely or never",
            "We respond to negative reviews when we see them",
            "We respond to most reviews when we remember",
            "Yes — every review gets a professional, personalized response within 24 hours",
          ],
        },
        {
          id: "fw_reviews_q4",
          areaId: "fw_reviews",
          type: "single",
          question:
            "Is your Google Business Profile fully optimized — photos, hours, services, posts, and Q&A all current?",
          options: [
            "No — it's basic and outdated",
            "Partially set up but not maintained",
            "Mostly complete but we don't post regularly",
            "Yes — fully optimized and updated regularly with fresh photos, posts, and accurate information",
          ],
        },
        {
          id: "fw_reviews_q5",
          areaId: "fw_reviews",
          type: "single",
          question:
            "Do you actively collect and display member testimonials and transformation stories on your website and social media?",
          options: [
            "No — testimonials happen if a member volunteers them",
            "We have a few on our website but they're old",
            "We collect them occasionally",
            "Yes — we have a systematic process to gather, permission, and showcase member stories across all channels",
          ],
        },
      ],
    },

    // ── 9. Referral Programs ──────────────────────────────────────────────────
    {
      id: "fw_referral",
      name: "Referral Programs",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "Referred members stay 18% longer and have a 37% higher lifetime value than members acquired through paid advertising. Yet only 14% of fitness facilities have a structured referral program. The gym's best salespeople are already inside the building — every satisfied member is a potential referral source who just needs to be asked. — IHRSA 2024 Member Retention Report / ReferralCandy Fitness Industry Analysis",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "ReferralHero",
        "Mindbody",
        "Zen Planner",
        "Wodify",
        "Glofox",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_referral_q1",
          areaId: "fw_referral",
          type: "single",
          question:
            "Do you have a formal referral program — with a clear incentive and a process to ask every satisfied member?",
          options: [
            "No — referrals happen organically if members bring friends",
            "We have an informal bring-a-friend offer",
            "We have a program but it's not consistently promoted",
            "Yes — a structured referral program with clear incentives, systematic asks at the right moments, and tracking of every referral",
          ],
        },
        {
          id: "fw_referral_q2",
          areaId: "fw_referral",
          type: "single",
          question:
            "When a member refers someone, is there a fast, high-priority process to follow up with that prospect?",
          options: [
            "They get the same treatment as any walk-in",
            "We try to prioritize them but it's not formal",
            "We flag referrals and follow up within a day",
            "Yes — referred prospects receive a priority follow-up sequence with specific messaging that acknowledges the referral and the referring member",
          ],
        },
        {
          id: "fw_referral_q3",
          areaId: "fw_referral",
          type: "single",
          question:
            "Do you know which members are your top referral sources — and do you recognize or reward them?",
          options: [
            "No — referrals come in and we don't track who sent them",
            "I have a rough idea of a few active referrers",
            "I track it manually sometimes",
            "Yes — referral sources are tracked and top referrers receive systematic recognition and rewards",
          ],
        },
        {
          id: "fw_referral_q4",
          areaId: "fw_referral",
          type: "single",
          question:
            "Do you run bring-a-friend events, buddy workouts, or community events designed to generate referrals?",
          options: [
            "No — we don't run referral-specific events",
            "Occasionally — once or twice a year",
            "A few times a year but attendance varies",
            "Yes — regular referral events are on the calendar with promotion sequences that drive attendance",
          ],
        },
        {
          id: "fw_referral_q5",
          areaId: "fw_referral",
          type: "single",
          question:
            "What percentage of your new members currently come from referrals?",
          options: [
            "Less than 20% — most new members come from ads or walk-ins",
            "20-40%",
            "40-60%",
            "I'm not sure — we don't track this",
            "Over 60% — referrals are our primary source of new members",
          ],
        },
      ],
    },

    // ── 10. Lapsed Member Reactivation ────────────────────────────────────────
    {
      id: "fw_reactivation",
      name: "Lapsed Member Reactivation",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "The average gym has a lapsed member database 2-3x the size of its active membership. These are people who already joined once — they know you, they chose you, and they had a reason for joining. Win-back campaigns targeting lapsed gym members consistently produce 15-25% reactivation rates at a fraction of new member acquisition cost. Most facilities never reach out after cancellation. — IHRSA 2024 Member Retention Report / UpLaunch Fitness CRM Benchmark Data",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Club OS",
        "Mindbody",
        "Zen Planner",
        "Mailchimp",
        "ActiveCampaign",
        "Klaviyo",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_reactivation_q1",
          areaId: "fw_reactivation",
          type: "single",
          question:
            "When a member cancels, do you have a process to stay in touch and invite them back?",
          options: [
            "No — cancelled members are gone",
            "We might reach out occasionally but nothing systematic",
            "We send a win-back email once or twice",
            "Yes — every cancelled member enters an automated win-back sequence with strategically timed offers over 12+ months",
          ],
        },
        {
          id: "fw_reactivation_q2",
          areaId: "fw_reactivation",
          type: "single",
          question:
            "Do you know the size of your lapsed member database — former members who cancelled in the last 24 months?",
          options: [
            "No — I have no visibility into this",
            "I have a rough sense but haven't quantified it",
            "I've looked at it but don't act on it systematically",
            "Yes — I know exactly how many lapsed members I have and I actively work to bring them back",
          ],
        },
        {
          id: "fw_reactivation_q3",
          areaId: "fw_reactivation",
          type: "single",
          question:
            "Do you document why members cancel — and use that data to improve retention and win-back efforts?",
          options: [
            "No — they cancel and we don't ask why",
            "We ask informally when we find out",
            "We note the reason but don't analyze patterns",
            "Yes — every cancellation has a documented reason, and we review the data regularly to identify trends",
          ],
        },
        {
          id: "fw_reactivation_q4",
          areaId: "fw_reactivation",
          type: "single",
          question:
            "When you reach back out to a lapsed member, do you have a compelling reason — a new class, a special offer, a facility improvement?",
          options: [
            "Not really — we just ask if they want to come back",
            "We try to have a reason but it's improvised",
            "We time outreach around New Year's or seasonal promotions",
            "Yes — every win-back outreach is strategically timed with a specific, relevant reason to return",
          ],
        },
        {
          id: "fw_reactivation_q5",
          areaId: "fw_reactivation",
          type: "single",
          question:
            "Have you successfully reactivated any lapsed members in the last 12 months?",
          options: [
            "No — once they cancel, they stay gone",
            "Once or twice by accident",
            "A few — when they happened to respond to a promotion",
            "Yes — lapsed member reactivation is a regular, systematic part of our growth strategy",
          ],
        },
      ],
    },

    // ── 11. Staff Productivity & Training ─────────────────────────────────────
    {
      id: "fw_staff",
      name: "Staff Productivity & Training",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "In the fitness industry, front desk staff and trainers are the first and most frequent touchpoints for members. Facilities where staff follow a documented sales and service process retain members at 40% higher rates and generate 25% more secondary revenue than facilities where staff wing it. The difference between a great gym experience and a mediocre one is almost entirely behavioral — and behavior can be systematized. — IHRSA 2024 Profiles of Success / ACE Industry Insights Report",
      softwareOptions: [
        "Mindbody",
        "Zen Planner",
        "Wodify",
        "Deputy",
        "Homebase",
        "When I Work",
        "Trainerize",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_staff_q1",
          areaId: "fw_staff",
          type: "single",
          question:
            "Do your front desk staff follow a documented process for greeting prospects, handling inquiries, and presenting membership options?",
          options: [
            "No — everyone does it differently",
            "Some informal guidance but nothing documented",
            "Documented but not consistently followed",
            "Yes — a clear, documented process that every staff member follows for every prospect interaction",
          ],
        },
        {
          id: "fw_staff_q2",
          areaId: "fw_staff",
          type: "single",
          question:
            "Do trainers and instructors receive training on member engagement, upselling, and retention — or just fitness certifications?",
          options: [
            "Fitness certifications only — no business training",
            "Informal guidance on member interaction",
            "Some training but it's not structured or ongoing",
            "Yes — regular, structured training on member engagement, sales conversations, and retention behavior",
          ],
        },
        {
          id: "fw_staff_q3",
          areaId: "fw_staff",
          type: "single",
          question:
            "Do you track staff performance metrics — tours given, trials converted, PT sessions sold, member check-ins completed?",
          options: [
            "No — we don't track individual staff performance",
            "We have a general sense but nothing data-driven",
            "We track some metrics for some staff",
            "Yes — every staff member has documented KPIs and we review performance regularly",
          ],
        },
        {
          id: "fw_staff_q4",
          areaId: "fw_staff",
          type: "single",
          question:
            "How do you handle staff scheduling — is it efficient or does it create gaps in coverage?",
          options: [
            "Manual scheduling — we often have too many or too few staff on the floor",
            "Basic scheduling tool but coverage gaps happen",
            "Decent scheduling but it's not optimized for peak times",
            "Scheduling is optimized for peak traffic times and coverage is consistent",
          ],
        },
        {
          id: "fw_staff_q5",
          areaId: "fw_staff",
          type: "single",
          question:
            "When a staff member leaves, do you have a documented onboarding process for their replacement — or does tribal knowledge walk out the door?",
          options: [
            "Tribal knowledge — new hires learn by watching",
            "Informal training from existing staff",
            "Some documentation but onboarding is inconsistent",
            "Yes — a complete onboarding playbook that gets every new hire up to standard quickly regardless of who trains them",
          ],
        },
      ],
    },

    // ── 12. Business Visibility & Reporting ───────────────────────────────────
    {
      id: "fw_reporting",
      name: "Business Visibility & Reporting",
      leakageType: "multiplier",
      leakageRate: 0.40,
      industryBenchmarkStat:
        "Gym owners who track lead source, conversion rate, member lifetime value, and churn rate simultaneously grow revenue 2-3x faster than those flying blind. With the average member worth $500-1,500 per year and the average facility losing 30-50% of its base annually, the difference between an 85% retention rate and a 70% retention rate is tens of thousands of dollars — invisible without the right dashboard. — IHRSA 2024 Profiles of Success / ClubReady Revenue Benchmark Data",
      softwareOptions: [
        "Mindbody",
        "Zen Planner",
        "Wodify",
        "Glofox",
        "PushPress",
        "Databox",
        "GoHighLevel (GHL)",
        "Google Sheets / Excel",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "fw_reporting_q1",
          areaId: "fw_reporting",
          type: "single",
          question:
            "Do you have real-time visibility into your key business metrics — active members, monthly revenue, churn rate, lead conversion — without having to dig through reports?",
          options: [
            "No — I check the bank account and hope for the best",
            "I can pull reports but they're often outdated or incomplete",
            "Reasonably good visibility with some gaps",
            "Yes — a live dashboard shows every key metric at any moment",
          ],
        },
        {
          id: "fw_reporting_q2",
          areaId: "fw_reporting",
          type: "single",
          question:
            "Do you review your business metrics on a regular schedule — weekly, not just monthly or quarterly?",
          options: [
            "Rarely — I review when something feels off",
            "Monthly or so",
            "Weekly — I look at the key numbers",
            "Yes — weekly metric review is a locked ritual with a defined format and action items",
          ],
        },
        {
          id: "fw_reporting_q3",
          areaId: "fw_reporting",
          type: "single",
          question:
            "Do you know your member lifetime value — what the average member is worth over their entire relationship with your facility?",
          options: [
            "No — I've never calculated this",
            "I have a rough idea",
            "I've calculated it once or twice",
            "Yes — I know it precisely and I use it to make decisions about acquisition spend and retention investment",
          ],
        },
        {
          id: "fw_reporting_q4",
          areaId: "fw_reporting",
          type: "single",
          question:
            "Can you identify which lead sources produce the most members — and which produce the most long-term members?",
          options: [
            "No — I have no idea which channels actually work",
            "A general sense but nothing data-driven",
            "I track lead sources but not long-term retention by source",
            "Yes — I know exactly which channels produce high-LTV members and I allocate marketing spend accordingly",
          ],
        },
        {
          id: "fw_reporting_q5",
          areaId: "fw_reporting",
          type: "single",
          question:
            "If your new member flow dried up today, would you know — or would you feel it in the revenue number three months from now?",
          options: [
            "I'd feel it months later — I have no forward visibility",
            "I'd have a general sense something was off",
            "I'd notice within a few weeks",
            "I'd know immediately — I track lead flow, trial bookings, and conversion weekly",
          ],
        },
      ],
    },
  ],

  // ─── Leakage formula lookup ───────────────────────────────────────────────────
  leakageFormula: {
    fw_lead_capture:          0.20,
    fw_trial_conversion:      0.18,
    fw_onboarding:            0.08,
    fw_retention:             0.10,
    fw_scheduling:            0.09,
    fw_revenue_optimization:  0.12,
    fw_communication:         0.08,
    fw_reviews:               0.09,
    fw_referral:              0.06,
    fw_reactivation:          0.08,
    fw_staff:                 0.06,
    fw_reporting:             0.40,
  },

  // ─── AI prompt additions ──────────────────────────────────────────────────────
  aiPromptAdditions: `VERTICAL CONTEXT: Fitness & Wellness Facility

This audit is for a gym, studio, or fitness/wellness facility. Use the following terminology and context throughout all findings and recommendations.

TERMINOLOGY — use these consistently:
- "members" — not "customers" or "clients" (except for PT clients specifically)
- "membership" — not "subscription" or "plan"
- "facility" — the physical gym, studio, or center
- "ghost member" — a member who is still paying but hasn't visited in 30+ days. This is the central concept: ghost members are the single biggest source of hidden churn
- "churn" or "attrition" — members who cancel
- "trial" or "trial visit" — a prospect's first visit before joining
- "conversion" — turning a trial visitor into a paying member
- "LTV" (lifetime value) — the total revenue a member generates over their entire relationship
- "secondary revenue" — personal training, nutrition coaching, retail, specialty programs — anything beyond base dues
- "avg_job_value" in formulas = average monthly membership or package value
- "close_rate" in formulas = trial-to-member conversion rate

GHOST MEMBER FRAMING — this is load-bearing, use it throughout:
Ghost members are the hidden tax on every fitness business. They signed up with good intentions, stopped coming, and are now paying for something they don't use. They feel guilty every time they see the charge on their statement. They are the most likely to cancel at the next trigger — a New Year's resolution to cut expenses, a credit card update prompt, or a friend who mentions another gym. Every ghost member is a cancellation waiting to happen.
The audit should frame retention problems through this lens: "How many of your current members are actually using your facility — and how many are ghosts who will cancel the moment something reminds them to?" Ghost member percentage is the most important number most gym owners don't know.

FACILITY TYPE VOCABULARY (use fw_facility_type answer to adapt tone):
- "Gym or fitness center" -> use "gym," "floor," "equipment," "general membership"
- "Boutique studio" -> use "studio," "class packs," "community," "boutique experience"
- "Personal training studio" -> use "clients," "sessions," "trainer-client relationship," "program design"
- "CrossFit or functional fitness affiliate" -> use "box," "WOD," "community," "affiliate," "coach"
- "Martial arts, boxing, or MMA gym" -> use "academy," "students," "belt progression," "training partners"
- "Wellness center" -> use "center," "modalities," "practitioners," "holistic"
- "Mixed — multiple formats or modalities" -> use terms contextually based on the services described

PAIN POINT CONTEXT:
- Ghost members are the biggest hidden cost in fitness. A gym with 500 members and 30% ghost rate has 150 people paying who will cancel within 6 months. At $75/month, that's $11,250/month in revenue that's already lost — the owner just doesn't know it yet.
- The trial-to-member conversion gap is where most growth dies. The average gym converts 20-30% of trials. Top facilities convert 50-60%. The difference is not the facility — it's the follow-up process.
- Secondary revenue (PT, nutrition, retail, specialty programs) is the fastest path to growth without new members. Most facilities leave this entirely to chance.
- Lapsed member databases are gold mines. A former member who cancelled 6-12 months ago is 5x more likely to rejoin than a cold prospect is to join for the first time.
- Review velocity is a competitive moat. A gym with 200 reviews beats a gym with 20 reviews in local search — even if the 20-review gym has a higher rating.

COMPETITIVE CONTEXT:
- Fitness facilities compete with other local gyms, boutique studios, home fitness (Peloton, Apple Fitness+), outdoor fitness, and the option to do nothing.
- The independent gym's advantage is community, personal connection, and accountability. Recommendations should lean into these — not features that big-box chains or digital platforms do better.
- Retention is the primary battleground. Acquiring a new member costs 5-7x more than retaining an existing one.

PRIORITY ORDERING:
For fitness & wellness, weight these areas more heavily in Priority Actions:
1. Member Retention & Churn Prevention — always top priority if score below 70 (churn is the primary revenue killer)
2. Trial-to-Member Conversion — second priority (the growth bottleneck)
3. Lapsed Member Reactivation — third priority (warm prospects at near-zero acquisition cost)
4. Revenue Optimization & Upsell — fourth priority (grow revenue without new members)`,
};
