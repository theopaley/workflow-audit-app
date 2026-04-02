import type { VerticalConfig } from "./types";

export const medSpaConfig: VerticalConfig = {
  verticalId: "med-spa",
  displayName: "Med Spa Audit",

  skipQuestions: ["intro_business"],

  // ─── Intro question overrides ────────────────────────────────────────────────
  introQuestions: {
    fin_avg_sale: {
      question: "Average revenue per treatment",
    },
    fin_close_rate: {
      question: "Consultation-to-booking conversion rate",
    },
    fin_monthly_leads: {
      question: "New consultation requests per month",
    },
    fin_monthly_revenue: {
      question: "Average monthly revenue",
    },
    // ── New questions — injected at the intro_business position ────────────────
    hw_service_focus: {
      id: "hw_service_focus",
      areaId: null,
      type: "single",
      question: "Which best describes your primary services?",
      options: [
        "Injectables — Botox, fillers, neurotoxins",
        "Laser & energy treatments — laser resurfacing, IPL, body contouring",
        "Regenerative & wellness — IV therapy, PRP, hormone therapy, peptides",
        "Full-service aesthetics — injectables plus laser plus skincare",
        "Skincare & facial treatments — HydraFacial, microneedling, chemical peels",
      ],
    },
    hw_revenue_model: {
      id: "hw_revenue_model",
      areaId: null,
      type: "single",
      question: "How does most of your revenue come in?",
      options: [
        "Primarily one-time treatments — clients pay per visit",
        "Primarily memberships or prepaid packages — clients commit upfront",
        "Mixed — roughly split between memberships and one-time treatments",
      ],
    },
  },

  // ─── Workflow areas ──────────────────────────────────────────────────────────
  workflowAreas: [
    // ── 1. Lead Capture & Response Time ──────────────────────────────────────────
    {
      id: "hw_lead_capture",
      name: "Lead Capture & Response Time",
      leakageType: "lead-based",
      leakageRate: 0.20,
      industryBenchmarkStat:
        "New med spa leads are simultaneously researching 3-5 other practices. The practice that responds within 5 minutes is 21x more likely to convert that lead than one that responds within 30 minutes. Most practices respond in hours — or not at all. The first call wins.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "HubSpot",
        "Zenoti",
        "AestheticsPro",
        "Boulevard (BLVD)",
        "Jane App",
        "Mindbody",
        "Podium",
        "Instagram / Facebook DMs",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_lead_capture_q1",
          areaId: "hw_lead_capture",
          type: "single",
          question:
            "When someone reaches out to book a consultation — through your website, Instagram, Google, or anywhere else — how quickly do they typically hear back?",
          options: [
            "Hours later or the next day — whenever I can get to it",
            "Within the hour if I'm not with a client",
            "Within a few minutes — I try to be fast",
            "Instantly — an automated system responds immediately, even when I'm in treatment",
          ],
        },
        {
          id: "hw_lead_capture_q2",
          areaId: "hw_lead_capture",
          type: "single",
          question: "Where do most of your new consultation requests come from?",
          options: [
            "Word of mouth — I rely on referrals",
            "Social media — Instagram, TikTok, Facebook",
            "Google search and my website",
            "Multiple channels — leads come from several different places",
          ],
        },
        {
          id: "hw_lead_capture_q3",
          areaId: "hw_lead_capture",
          type: "single",
          question:
            "When a new lead comes in while you're in the middle of treating a client, what happens?",
          options: [
            "It waits until I'm free — sometimes hours",
            "My front desk takes a message and I follow up later",
            "My front desk handles the initial response",
            "An automated system responds immediately and keeps them engaged until I'm available",
          ],
        },
        {
          id: "hw_lead_capture_q4",
          areaId: "hw_lead_capture",
          type: "single",
          question:
            "Do you track every inquiry — where it came from, whether they booked, and why they didn't?",
          options: [
            "No — inquiries come in from different places and I lose track",
            "I have a rough idea but nothing formal",
            "Mostly — I track some sources but not all",
            "Yes — every inquiry is in my CRM with full source tracking and outcome history",
          ],
        },
        {
          id: "hw_lead_capture_q5",
          areaId: "hw_lead_capture",
          type: "single",
          question:
            "Can prospective clients book a consultation online at any hour — or do they have to call during business hours?",
          options: [
            "Phone or DM only — they wait until we're open",
            "We have a contact form but someone has to follow up",
            "We have online booking but it's not prominently featured",
            "Yes — 24/7 online booking with instant confirmation",
          ],
        },
      ],
    },

    // ── 2. Lead Nurture & Consultation Booking ────────────────────────────────────
    {
      id: "hw_lead_nurture",
      name: "Lead Nurture & Consultation Booking",
      leakageType: "lead-based",
      leakageRate: 0.15,
      industryBenchmarkStat:
        "70% of new med spa leads are not ready to book on first contact — they're researching, comparing, and building trust. Practices that nurture these leads with educational content and consistent follow-up convert them at 3x the rate of practices that only pursue hot leads. Most practices abandon a lead after 2 follow-ups. The average conversion happens at follow-up 5-7.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "HubSpot",
        "Mailchimp",
        "Klaviyo",
        "ActiveCampaign",
        "Zenoti",
        "AestheticsPro",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_lead_nurture_q1",
          areaId: "hw_lead_nurture",
          type: "single",
          question:
            "When someone inquires about a treatment but doesn't book right away, what happens to them?",
          options: [
            "They go cold — I move on to clients who are ready",
            "I follow up once or twice, then stop",
            "I have a loose follow-up process but it's inconsistent",
            "They enter an automated nurture sequence that runs until they book or opt out",
          ],
        },
        {
          id: "hw_lead_nurture_q2",
          areaId: "hw_lead_nurture",
          type: "single",
          question:
            "Do prospects receive educational content about your treatments — what to expect, how it works, why your practice is different — before they ever come in?",
          options: [
            "No — they only hear from us when we're following up to book",
            "Occasionally — I share things manually when I think of it",
            "I have some content I send but it's not systematic",
            "Yes — an automated pre-consultation sequence educates and builds trust automatically",
          ],
        },
        {
          id: "hw_lead_nurture_q3",
          areaId: "hw_lead_nurture",
          type: "single",
          question:
            "How long do you actively follow up with a prospect before moving on?",
          options: [
            "A week or two — if they don't book, I stop",
            "A month or so",
            "A few months",
            "As long as it takes — I have sequences that run until they're ready",
          ],
        },
        {
          id: "hw_lead_nurture_q4",
          areaId: "hw_lead_nurture",
          type: "single",
          question:
            "Do prospects who filled out a form or sent a DM but never booked receive any follow-up at all?",
          options: [
            "No — if they don't book, they disappear into the void",
            "I manually reach out to some of them",
            "I try to follow up but it's inconsistent",
            "Yes — unbooked leads enter an automated follow-up sequence immediately",
          ],
        },
        {
          id: "hw_lead_nurture_q5",
          areaId: "hw_lead_nurture",
          type: "single",
          question:
            "Do you know which leads in your pipeline are most likely to book in the next 30 days?",
          options: [
            "No — I have no visibility into prospect readiness",
            "I have a general sense based on recent conversations",
            "I track it manually but not consistently",
            "Yes — my CRM scores or flags leads based on engagement and behavior",
          ],
        },
      ],
    },

    // ── 3. New Client Consultation & Onboarding ───────────────────────────────────
    {
      id: "hw_consultation_onboarding",
      name: "New Client Consultation & Onboarding",
      leakageType: "revenue-based",
      leakageRate: 0.06,
      industryBenchmarkStat:
        "The consultation is the highest-leverage moment in a med spa client relationship. Practices with a structured, documented consultation process convert first-time visitors to multi-treatment clients at 2.5x the rate of practices that consult informally. A client who understands their full treatment plan on day one spends 40% more in their first year.",
      softwareOptions: [
        "Zenoti",
        "AestheticsPro",
        "PatientNow",
        "Aesthetic Record",
        "Jane App",
        "Boulevard (BLVD)",
        "GoHighLevel (GHL)",
        "TouchMD",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_consultation_onboarding_q1",
          areaId: "hw_consultation_onboarding",
          type: "single",
          question:
            "When a new client comes in for a consultation, what do they experience?",
          options: [
            "A conversation — I assess them and tell them what I can do",
            "A structured conversation with some written takeaways",
            "A thorough consultation with a treatment overview",
            "A full, documented consultation — intake, assessment, personalized treatment plan, and education — every time, for every client",
          ],
        },
        {
          id: "hw_consultation_onboarding_q2",
          areaId: "hw_consultation_onboarding",
          type: "single",
          question:
            "Does every new client leave their first consultation with a written treatment plan — a roadmap of what you recommend and why?",
          options: [
            "No — recommendations are verbal",
            "I email some clients a summary if I remember",
            "I provide a general overview in writing",
            "Yes — every client receives a documented, personalized treatment plan before they leave",
          ],
        },
        {
          id: "hw_consultation_onboarding_q3",
          areaId: "hw_consultation_onboarding",
          type: "single",
          question:
            "How consistent is the new client experience when you're busy versus when you have more time?",
          options: [
            "It varies a lot depending on how slammed we are",
            "I try to be consistent but things get rushed",
            "Mostly consistent — a few things slip when it's busy",
            "Fully consistent — the consultation process is systematized regardless of schedule",
          ],
        },
        {
          id: "hw_consultation_onboarding_q4",
          areaId: "hw_consultation_onboarding",
          type: "single",
          question:
            "Do new clients receive a welcome sequence after their first visit — follow-up care instructions, what to expect, next steps?",
          options: [
            "No — they leave and we hope they rebook",
            "I follow up manually when I remember",
            "I send a basic follow-up email",
            "Yes — an automated post-visit sequence goes out to every new client with care instructions and next-step guidance",
          ],
        },
        {
          id: "hw_consultation_onboarding_q5",
          areaId: "hw_consultation_onboarding",
          type: "single",
          question:
            "What percentage of new consultation clients book a treatment — either that day or within two weeks?",
          options: [
            "Less than 30% — many consultations don't convert",
            "30-50%",
            "50-70%",
            "Over 70% — we have a strong consultation-to-booking process",
          ],
        },
      ],
    },

    // ── 4. Treatment Scheduling & No-Show Management ──────────────────────────────
    {
      id: "hw_scheduling_noshow",
      name: "Treatment Scheduling & No-Show Management",
      leakageType: "revenue-based",
      leakageRate: 0.09,
      industryBenchmarkStat:
        "The average med spa loses 22% of its appointments to cancellations, and no-shows can account for up to 14% of daily revenue. Practices that require a deposit at booking and send automated reminders reduce no-show rates by up to 75% — recovering tens of thousands of dollars in previously lost provider time every year.",
      softwareOptions: [
        "Zenoti",
        "Boulevard (BLVD)",
        "Jane App",
        "AestheticsPro",
        "Mindbody",
        "Vagaro",
        "Acuity Scheduling",
        "Calendly",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_scheduling_noshow_q1",
          areaId: "hw_scheduling_noshow",
          type: "single",
          question: "How do clients currently book treatments with you?",
          options: [
            "Phone calls during business hours — we schedule manually",
            "Phone plus a basic online booking option",
            "Online booking available but we still take most calls",
            "Fully online — clients self-schedule 24/7 with instant confirmation",
          ],
        },
        {
          id: "hw_scheduling_noshow_q2",
          areaId: "hw_scheduling_noshow",
          type: "single",
          question:
            "Do you require a deposit or card on file to hold a treatment appointment?",
          options: [
            "No — clients book without any financial commitment",
            "We ask for deposits for new clients only",
            "We have a deposit policy but enforce it inconsistently",
            "Yes — every appointment requires a card on file or deposit at booking",
          ],
        },
        {
          id: "hw_scheduling_noshow_q3",
          areaId: "hw_scheduling_noshow",
          type: "single",
          question:
            "What is your approximate no-show and last-minute cancellation rate?",
          options: [
            "High — more than 20% of appointments are missed or cancelled",
            "Moderate — around 10-20%",
            "Low — under 10%",
            "Very low — under 5%, and we have a system that keeps it there",
          ],
        },
        {
          id: "hw_scheduling_noshow_q4",
          areaId: "hw_scheduling_noshow",
          type: "single",
          question: "Do clients receive automated reminders before their appointments?",
          options: [
            "No — they're expected to remember",
            "I remind some clients manually when I think of it",
            "We send a single reminder the day before",
            "Yes — automated multi-touch reminders go out at set intervals without anyone doing anything",
          ],
        },
        {
          id: "hw_scheduling_noshow_q5",
          areaId: "hw_scheduling_noshow",
          type: "single",
          question:
            "When a client cancels last-minute or no-shows, do you have a process to fill that slot?",
          options: [
            "No — the slot sits empty and we lose the revenue",
            "We call a few people but it's rarely filled",
            "We have a loose waitlist but it's not systematic",
            "Yes — an automated waitlist notification fills last-minute openings quickly",
          ],
        },
      ],
    },

    // ── 5. Membership & Package Sales ────────────────────────────────────────────
    {
      id: "hw_membership_packages",
      name: "Membership & Package Sales",
      leakageType: "revenue-based",
      leakageRate: 0.12,
      industryBenchmarkStat:
        "Med spa membership clients spend up to 35% more per visit than non-members and visit 2x as often. Practices with active membership programs saw a 24% increase in membership sales in 2024 alone. Yet most practices leave this entirely to chance — waiting for clients to ask rather than presenting it as the natural next step after every treatment.",
      softwareOptions: [
        "Zenoti",
        "Boulevard (BLVD)",
        "AestheticsPro",
        "Jane App",
        "Mindbody",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_membership_packages_q1",
          areaId: "hw_membership_packages",
          type: "single",
          question: "Do you have a formal membership or monthly subscription program?",
          options: [
            "No — every client pays per treatment",
            "We offer packages but no recurring membership",
            "We have a membership but it's informal and not actively sold",
            "Yes — we have a structured membership program that we present to every eligible client",
          ],
        },
        {
          id: "hw_membership_packages_q2",
          areaId: "hw_membership_packages",
          type: "single",
          question: "When and how do you present membership to new clients?",
          options: [
            "We don't — clients ask about it if they're interested",
            "We mention it sometimes but it's not systematic",
            "We present it at checkout after a treatment",
            "We present it as part of the treatment plan during the consultation — before the first treatment",
          ],
        },
        {
          id: "hw_membership_packages_q3",
          areaId: "hw_membership_packages",
          type: "single",
          question:
            "Do you have a process to convert your most loyal one-time clients to members?",
          options: [
            "No — if they want a membership they'll ask",
            "We occasionally mention it to regulars",
            "We identify them but the ask is informal",
            "Yes — we have an automated sequence that identifies high-visit clients and presents membership at the right moment",
          ],
        },
        {
          id: "hw_membership_packages_q4",
          areaId: "hw_membership_packages",
          type: "single",
          question: "How do you handle membership renewals and churn?",
          options: [
            "We don't track it — memberships lapse and we don't follow up",
            "We notice when members stop coming but rarely reach out",
            "We follow up manually when we remember",
            "We have an automated renewal and retention sequence that catches at-risk members before they lapse",
          ],
        },
        {
          id: "hw_membership_packages_q5",
          areaId: "hw_membership_packages",
          type: "single",
          question:
            "What percentage of your active clients are on a membership or prepaid package?",
          options: [
            "Less than 10% — almost everyone pays per treatment",
            "10-25%",
            "25-50%",
            "Over 50% — memberships are a core part of our business model",
          ],
        },
      ],
    },

    // ── 6. Treatment Retention & Rebooking ───────────────────────────────────────
    {
      id: "hw_treatment_retention",
      name: "Treatment Retention & Rebooking",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "Botox wears off in 3-4 months. Fillers in 6-12 months. Every client who walks out without their next appointment already booked is a retention risk. Industry data shows that clients who rebook before leaving are 70% more likely to return than clients who say 'I'll call.' Most practices let them call — and most of them don't.",
      softwareOptions: [
        "Aesthetic Record",
        "PatientNow",
        "Nextech",
        "Zenoti",
        "AestheticsPro",
        "Boulevard (BLVD)",
        "TouchMD",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_treatment_retention_q1",
          areaId: "hw_treatment_retention",
          type: "single",
          question:
            "When a treatment is complete, what happens before the client leaves?",
          options: [
            "They pay and leave — rebooking is up to them",
            "I mention they should come back in a few months",
            "I suggest a timeframe and they sometimes book at the desk",
            "Every client is walked to the front desk and offered their next appointment before they leave",
          ],
        },
        {
          id: "hw_treatment_retention_q2",
          areaId: "hw_treatment_retention",
          type: "single",
          question:
            "Do clients receive a treatment reminder when they're due for their next Botox, filler, or maintenance appointment?",
          options: [
            "No — it's up to them to remember and reach out",
            "We reach out to some clients manually when we think of it",
            "We send reminders but inconsistently",
            "Yes — automated reminders go out at the right interval for every client's specific treatment cycle",
          ],
        },
        {
          id: "hw_treatment_retention_q3",
          areaId: "hw_treatment_retention",
          type: "single",
          question:
            "Do you track which clients are overdue for their maintenance treatments?",
          options: [
            "No — we have no visibility into who's due",
            "We notice when regulars stop coming in",
            "We check periodically but it's not systematic",
            "Yes — our system flags every client who's overdue based on their treatment history",
          ],
        },
        {
          id: "hw_treatment_retention_q4",
          areaId: "hw_treatment_retention",
          type: "single",
          question:
            "After a treatment, do clients receive follow-up care instructions and a check-in to see how they're feeling?",
          options: [
            "No — post-treatment care is covered verbally in the room",
            "We email care instructions to some clients",
            "We send care instructions to everyone",
            "Yes — automated post-treatment follow-up goes out with care instructions and a satisfaction check-in",
          ],
        },
        {
          id: "hw_treatment_retention_q5",
          areaId: "hw_treatment_retention",
          type: "single",
          question:
            "Do you have documented treatment plans for each client — what they've had, what you've recommended, what's next?",
          options: [
            "No — it lives in my head or rough notes",
            "I keep informal notes but nothing structured",
            "I document it but inconsistently",
            "Yes — every client has a documented treatment plan that any provider can reference",
          ],
        },
      ],
    },

    // ── 7. Client Communication ───────────────────────────────────────────────────
    {
      id: "hw_client_communication",
      name: "Client Communication",
      leakageType: "revenue-based",
      leakageRate: 0.05,
      industryBenchmarkStat:
        "The number one reason med spa clients leave for a competitor is not price and not results — it's feeling forgotten between visits. With Botox clients visiting every 3-4 months, practices have a 90-120 day window of silence between appointments. The practices that fill that silence with value-driven communication retain clients at 2x the rate of those that only reach out when it's time to rebook.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Mailchimp",
        "Klaviyo",
        "Zenoti",
        "Boulevard (BLVD)",
        "Podium",
        "ActiveCampaign",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_client_communication_q1",
          areaId: "hw_client_communication",
          type: "single",
          question:
            "How do clients reach you with questions or concerns between appointments?",
          options: [
            "Phone calls during business hours — they wait if we're busy or closed",
            "Phone and email — responses whenever someone gets to it",
            "Multiple channels with a loose monitoring process",
            "All channels monitored with automated acknowledgment and clear response time commitments",
          ],
        },
        {
          id: "hw_client_communication_q2",
          areaId: "hw_client_communication",
          type: "single",
          question:
            "Do clients hear from you between appointments — not to sell, just to add value?",
          options: [
            "No — we only reach out to remind them to rebook",
            "Occasionally — around promotions or special offers",
            "Sometimes — we share content when we think of it",
            "Yes — a regular automated sequence keeps us top of mind with educational content and genuine touchpoints",
          ],
        },
        {
          id: "hw_client_communication_q3",
          areaId: "hw_client_communication",
          type: "single",
          question:
            "When a client messages outside business hours, what happens?",
          options: [
            "They wait until we open the next day",
            "Someone checks occasionally after hours",
            "After-hours messages get a response first thing in the morning",
            "An automated system acknowledges every message immediately with a clear response timeline",
          ],
        },
        {
          id: "hw_client_communication_q4",
          areaId: "hw_client_communication",
          type: "single",
          question:
            "Do clients receive personalized communication — based on their specific treatments, their goals, and where they are in their journey?",
          options: [
            "No — everyone gets the same generic messages",
            "Some personalization when I do it manually",
            "Basic segmentation — we separate members from non-members",
            "Yes — communication is segmented and personalized by treatment history, membership status, and client goals",
          ],
        },
        {
          id: "hw_client_communication_q5",
          areaId: "hw_client_communication",
          type: "single",
          question:
            "Do you communicate with your full client database on a regular schedule — not just active clients?",
          options: [
            "No — we only communicate with clients who are actively booking",
            "Occasionally — around holidays or promotions",
            "Monthly or so — basic email updates",
            "Yes — our full database receives consistent, value-driven communication on a regular schedule",
          ],
        },
      ],
    },

    // ── 8. Reviews & Reputation ───────────────────────────────────────────────────
    {
      id: "hw_reviews_reputation",
      name: "Reviews & Reputation",
      leakageType: "revenue-based",
      leakageRate: 0.07,
      industryBenchmarkStat:
        "86% of new med spa clients check online reviews before booking a consultation. Practices with 50 or more Google reviews convert inbound leads at 3x the rate of practices with fewer than 10. The barrier to leaving a review is low — the barrier to asking consistently is entirely behavioral, and almost every practice fails it.",
      softwareOptions: [
        "Google Business Profile",
        "Birdeye",
        "Podium",
        "NiceJob",
        "RealSelf",
        "Yelp",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_reviews_reputation_q1",
          areaId: "hw_reviews_reputation",
          type: "single",
          question: "How do you currently ask clients for reviews after a treatment?",
          options: [
            "We don't — we hope satisfied clients leave reviews on their own",
            "We ask verbally at checkout when we remember",
            "We send a follow-up text or email sometimes",
            "An automated review request goes out to every client at the right moment after every appointment",
          ],
        },
        {
          id: "hw_reviews_reputation_q2",
          areaId: "hw_reviews_reputation",
          type: "single",
          question: "How quickly after a treatment does your review request go out?",
          options: [
            "It doesn't — or only when we remember weeks later",
            "A few days after the appointment when I think of it",
            "Within 24-48 hours",
            "Within hours of the appointment — automatically",
          ],
        },
        {
          id: "hw_reviews_reputation_q3",
          areaId: "hw_reviews_reputation",
          type: "single",
          question: "How many new Google reviews have you received in the last 90 days?",
          options: [
            "0 to 3",
            "4 to 8",
            "9 to 15",
            "16 or more",
          ],
        },
        {
          id: "hw_reviews_reputation_q4",
          areaId: "hw_reviews_reputation",
          type: "single",
          question: "Do you respond to every review — positive and negative?",
          options: [
            "No — I rarely respond",
            "I respond to negative reviews when I see them",
            "I respond to most reviews when I remember",
            "Yes — every review gets a professional response within 24 hours",
          ],
        },
        {
          id: "hw_reviews_reputation_q5",
          areaId: "hw_reviews_reputation",
          type: "single",
          question:
            "Are you actively building your before-and-after portfolio — with client consent — as social proof?",
          options: [
            "No — I don't have a systematic process for this",
            "I post occasionally when a client volunteers",
            "I ask most satisfied clients but it's informal",
            "Yes — every successful treatment outcome is an opportunity, and I have a systematic process to capture and share results",
          ],
        },
      ],
    },

    // ── 9. Referral Management ────────────────────────────────────────────────────
    {
      id: "hw_referral",
      name: "Referral Management",
      leakageType: "revenue-based",
      leakageRate: 0.10,
      industryBenchmarkStat:
        "80% of med spas say word-of-mouth is their biggest source of new clients. Only 3% have a structured referral program. The gap between those two numbers is the single most actionable growth opportunity in the business. A referred client arrives pre-sold, converts at higher rates, and has a higher lifetime value than any paid lead source.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "ReferralHero",
        "Birdeye",
        "Zenoti",
        "Jane App",
        "Boulevard (BLVD)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_referral_q1",
          areaId: "hw_referral",
          type: "single",
          question:
            "Do you have a formal process to ask every satisfied client for a referral?",
          options: [
            "No — referrals happen organically if they happen at all",
            "I mention it occasionally but nothing is systematic",
            "I ask most clients but the ask is informal",
            "Yes — every client relationship includes a structured referral ask, and we have a program with clear incentives",
          ],
        },
        {
          id: "hw_referral_q2",
          areaId: "hw_referral",
          type: "single",
          question:
            "When a client refers someone, do both the referrer and the new client receive a meaningful reward automatically?",
          options: [
            "No — we thank them but there's no formal reward",
            "We offer something but it's inconsistent",
            "We have a reward but it's not automated or well-promoted",
            "Yes — both parties receive an automatic reward and we actively promote the program",
          ],
        },
        {
          id: "hw_referral_q3",
          areaId: "hw_referral",
          type: "single",
          question: "Do you know which clients are your top referral sources?",
          options: [
            "No — referrals show up and I don't know who sent them",
            "I have a rough idea of a few good referrers",
            "I track it manually sometimes",
            "Yes — referral sources are tracked in my CRM and top referrers receive special recognition",
          ],
        },
        {
          id: "hw_referral_q4",
          areaId: "hw_referral",
          type: "single",
          question:
            "Does your referral program make it effortless for clients to refer — with a link, a card, or a code they can share immediately?",
          options: [
            "No — they'd have to explain us verbally to a friend",
            "We have referral cards at the front desk",
            "We have something but it's not prominently used",
            "Yes — clients can share a referral link via text in seconds, and it's prompted at every visit",
          ],
        },
        {
          id: "hw_referral_q5",
          areaId: "hw_referral",
          type: "single",
          question:
            "What percentage of your new clients currently come from referrals?",
          options: [
            "Less than 20% — most new clients come from paid ads or Google",
            "20-40%",
            "40-60%",
            "Over 60% — referrals are the primary driver of new client growth",
          ],
        },
      ],
    },

    // ── 10. Re-engagement & Win-Back ──────────────────────────────────────────────
    {
      id: "hw_reengagement",
      name: "Re-engagement & Win-Back",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "The average med spa loses 50-60% of clients annually — not because those clients are dissatisfied, but because no one followed up. A client who visited 6 months ago and hasn't rebooked is not a lost client — they're a warm prospect sitting in your database waiting to be asked. Win-back campaigns consistently produce 20-35% reactivation rates at near-zero acquisition cost.",
      softwareOptions: [
        "GoHighLevel (GHL)",
        "Mailchimp",
        "Klaviyo",
        "Zenoti",
        "AestheticsPro",
        "Boulevard (BLVD)",
        "ActiveCampaign",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_reengagement_q1",
          areaId: "hw_reengagement",
          type: "single",
          question:
            "How long does a client go without visiting before you proactively reach out?",
          options: [
            "We don't reach out — if they don't book, we assume they moved on",
            "6 months or more — when I finally notice they've been gone a while",
            "3-4 months — when they're overdue for their treatment cycle",
            "60-90 days — an automated flag triggers a win-back sequence before they go fully cold",
          ],
        },
        {
          id: "hw_reengagement_q2",
          areaId: "hw_reengagement",
          type: "single",
          question: "Do you have an automated win-back sequence for lapsed clients?",
          options: [
            "No — lapsed clients just disappear",
            "I manually reach out to a few people occasionally",
            "I have something but it's inconsistent",
            "Yes — clients who haven't booked in 60-90 days automatically enter a win-back sequence",
          ],
        },
        {
          id: "hw_reengagement_q3",
          areaId: "hw_reengagement",
          type: "single",
          question:
            "When a lapsed client does come back, do you know why they left and what to say to welcome them?",
          options: [
            "No — we treat them like a new client",
            "I have a general sense but nothing documented",
            "I try to personalize based on what I remember",
            "Yes — their full history is in the system and the re-engagement is personalized to their treatments and last visit",
          ],
        },
        {
          id: "hw_reengagement_q4",
          areaId: "hw_reengagement",
          type: "single",
          question:
            "Do you run seasonal or event-based re-engagement campaigns to your full database?",
          options: [
            "No — we don't have a campaign infrastructure",
            "Occasionally around major holidays",
            "A few times a year — inconsistently",
            "Yes — regular campaigns go out to the full database with timely, relevant offers",
          ],
        },
        {
          id: "hw_reengagement_q5",
          areaId: "hw_reengagement",
          type: "single",
          question:
            "Do you know the size of your dormant client database — people who have visited at least once but haven't been back in 6+ months?",
          options: [
            "No — I have no visibility into this",
            "I have a rough sense but haven't quantified it",
            "I've looked at it but don't act on it regularly",
            "Yes — I know exactly how many dormant clients I have and I actively work to reactivate them",
          ],
        },
      ],
    },

    // ── 11. Retail & Add-On Revenue ───────────────────────────────────────────────
    {
      id: "hw_retail_addon",
      name: "Retail & Add-On Revenue",
      leakageType: "revenue-based",
      leakageRate: 0.08,
      industryBenchmarkStat:
        "Successful med spas generate 10-15% of total revenue from retail skincare sales — revenue that requires no additional treatment rooms, no additional provider time, and no additional clients. The average practice leaves this entirely to chance, with staff recommending products 'when it comes up.' A systematic retail process increases average ticket by $60-120 per visit.",
      softwareOptions: [
        "Zenoti",
        "Boulevard (BLVD)",
        "AestheticsPro",
        "Jane App",
        "Square",
        "Shopify",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_retail_addon_q1",
          areaId: "hw_retail_addon",
          type: "single",
          question:
            "Does every client receive a personalized skincare recommendation at the end of their treatment?",
          options: [
            "No — we have retail products but staff don't consistently recommend them",
            "Occasionally — when a client asks or when the provider thinks of it",
            "Most of the time — but it's not systematic",
            "Yes — every treatment ends with a documented skincare recommendation tied to the client's treatment and goals",
          ],
        },
        {
          id: "hw_retail_addon_q2",
          areaId: "hw_retail_addon",
          type: "single",
          question:
            "Are your staff trained and confident recommending retail products — or does it feel like selling?",
          options: [
            "Staff don't recommend products — it feels too pushy",
            "Some staff recommend products but it's inconsistent",
            "Most staff recommend products but confidence varies",
            "Yes — staff are trained on clinical rationale and present retail as part of the treatment outcome, not a sale",
          ],
        },
        {
          id: "hw_retail_addon_q3",
          areaId: "hw_retail_addon",
          type: "single",
          question:
            "What percentage of your clients purchase a retail product on the same visit as a treatment?",
          options: [
            "Less than 10% — most clients don't buy retail",
            "10-20%",
            "20-35%",
            "Over 35% — retail is a consistent part of the client visit",
          ],
        },
        {
          id: "hw_retail_addon_q4",
          areaId: "hw_retail_addon",
          type: "single",
          question:
            "Do you offer add-on treatments at the point of service — complementary services that pair with what the client already booked?",
          options: [
            "No — clients get what they booked, nothing more",
            "I suggest add-ons occasionally when it seems relevant",
            "We have a loose add-on menu but it's not consistently presented",
            "Yes — every provider is trained to present relevant add-ons and the process is systematized",
          ],
        },
        {
          id: "hw_retail_addon_q5",
          areaId: "hw_retail_addon",
          type: "single",
          question:
            "Do you track your retail-to-service revenue ratio — and do you have a target for it?",
          options: [
            "No — I have no visibility into retail performance",
            "I see total retail revenue but don't analyze the ratio",
            "I review it occasionally",
            "Yes — I track the ratio by provider and by month, and I have a target we work toward",
          ],
        },
      ],
    },

    // ── 12. Business Visibility & Reporting ───────────────────────────────────────
    {
      id: "hw_reporting",
      name: "Business Visibility & Reporting",
      leakageType: "multiplier",
      leakageRate: 0.40,
      industryBenchmarkStat:
        "Med spa owners who track lead source, conversion rate, provider utilization, and client lifetime value simultaneously grow 2.8x faster than those flying blind. With an average treatment value of $536 and clients returning 3-4 times per year, the difference between an 85% booked schedule and a 70% booked schedule is tens of thousands of dollars in annual revenue — invisible without the right dashboard.",
      softwareOptions: [
        "Zenoti",
        "AestheticsPro",
        "Boulevard (BLVD)",
        "PatientNow",
        "Google Analytics",
        "Databox",
        "GoHighLevel (GHL)",
        "None",
        "Other",
      ],
      questions: [
        {
          id: "hw_reporting_q1",
          areaId: "hw_reporting",
          type: "single",
          question:
            "Do you know which marketing channels — Google, Instagram, referrals, Yelp — are producing your actual booked appointments?",
          options: [
            "No — I don't track where clients come from",
            "I have a rough sense but nothing tracked",
            "I track some sources manually",
            "Yes — I can see exactly which channels produce consultations and which produce treatments",
          ],
        },
        {
          id: "hw_reporting_q2",
          areaId: "hw_reporting",
          type: "single",
          question:
            "Do you review your key business metrics — revenue, average ticket, provider utilization, membership count — on a regular schedule?",
          options: [
            "Rarely or never",
            "Once in a while when something feels off",
            "Monthly — I check the basics",
            "Weekly — I have a dashboard and review it consistently",
          ],
        },
        {
          id: "hw_reporting_q3",
          areaId: "hw_reporting",
          type: "single",
          question:
            "Do you know your consultation-to-booking conversion rate — and how it compares to industry benchmarks?",
          options: [
            "No — I don't track this",
            "I have a rough idea",
            "I calculate it sometimes",
            "Yes — I know exactly and I use it to identify where consultations are falling through",
          ],
        },
        {
          id: "hw_reporting_q4",
          areaId: "hw_reporting",
          type: "single",
          question:
            "If your new lead flow dried up tomorrow, would you know — or would you feel it months later when revenue drops?",
          options: [
            "I'd feel it months later — I have no forward visibility",
            "I'd have a general sense but no real data",
            "I'd notice within a few weeks",
            "I'd know immediately — I track pipeline and leading indicators regularly",
          ],
        },
        {
          id: "hw_reporting_q5",
          areaId: "hw_reporting",
          type: "single",
          question:
            "Do you track provider performance individually — revenue per provider, utilization rate, average ticket — or just total practice revenue?",
          options: [
            "Total practice revenue only — I don't break it down by provider",
            "I have a rough sense of who's busiest",
            "I review provider revenue occasionally",
            "Yes — every provider's performance is tracked individually and reviewed regularly",
          ],
        },
      ],
    },
  ],

  // ─── Leakage formula lookup ───────────────────────────────────────────────────
  leakageFormula: {
    hw_lead_capture:              0.20,
    hw_lead_nurture:              0.15,
    hw_consultation_onboarding:   0.06,
    hw_scheduling_noshow:         0.09,
    hw_membership_packages:       0.12,
    hw_treatment_retention:       0.10,
    hw_client_communication:      0.05,
    hw_reviews_reputation:        0.07,
    hw_referral:                  0.10,
    hw_reengagement:              0.08,
    hw_retail_addon:              0.08,
    hw_reporting:                 0.40,
  },

  // ─── AI prompt additions ──────────────────────────────────────────────────────
  aiPromptAdditions: `VERTICAL CONTEXT: Medical Spa / Aesthetic Practice

This audit is for a medical spa or aesthetic practice. Use the following terminology and context throughout all findings and recommendations.

TERMINOLOGY — use these consistently:
- "clients" or "patients" — both are used in med spa, mirror what the owner uses
- "treatments" or "appointments" — not "jobs" or "services"
- "consultation" — not "estimate" or "assessment"
- "provider" or "injector" — not "technician" or "staff"
- "treatment plan" — not "proposal" or "quote"
- "booking" — not "scheduling" where possible
- "membership" — always use this term when discussing recurring revenue models
- "aesthetic goals" — not "requirements" or "needs"
- "maintenance cycle" — for describing injectable return frequency
- "before and after" — as a trust and social proof mechanism
- "treatment outcomes" — not "results" where clinical language adds authority
- "avg_job_value" in formulas = average revenue per treatment

PAIN POINT CONTEXT:
- The no-show problem is both a revenue and a relationship problem. An empty treatment room is a provider who isn't earning. Automated deposits and reminders are the standard fix — the data shows 75% reduction in no-shows.
- Memberships are the single highest-leverage revenue lever in a med spa. A client on a $199/month membership who visits 4x/year spends $2,400+ annually. The same client on pay-per-visit spends 30-35% less and churns faster.
- The gap between visits is where clients leave. With 90-120 days between Botox appointments, a practice that communicates nothing between visits is invisible. The practice that sends educational content, check-ins, and relevant offers during that gap owns the relationship.
- Most med spa growth happens inside the existing client database, not from new leads. Win-back, referral, and re-engagement campaigns consistently outperform paid acquisition on ROI.
- Retail is clinical, not commercial. A client who uses medical-grade skincare between treatments has better outcomes and higher retention. Staff who present retail as a clinical recommendation — not a sale — convert at 2-3x the rate of those who don't.

REVENUE MODEL CONTEXT (use hw_revenue_model answer to frame findings):
- If primarily one-time: frame leakage around converting to membership and increasing rebooking rate
- If primarily membership: frame leakage around membership churn, tier upgrades, and retention
- If mixed: balance both — protect membership base while converting one-time clients

SERVICE FOCUS VOCABULARY (use hw_service_focus answer to adapt tone):
- "Injectables — Botox, fillers, neurotoxins" -> use "Botox," "filler," "neurotoxin," "maintenance cycle," "unit pricing"
- "Laser & energy treatments — laser resurfacing, IPL, body contouring" -> use "treatment series," "package," "downtime," "skin health journey"
- "Regenerative & wellness — IV therapy, PRP, hormone therapy, peptides" -> use "protocol," "optimization," "biomarkers," "wellness journey"
- "Full-service aesthetics — injectables plus laser plus skincare" -> use all of the above contextually
- "Skincare & facial treatments — HydraFacial, microneedling, chemical peels" -> use "skin health," "protocol," "series," "home care"

COMPETITIVE CONTEXT:
- Med spas compete intensely on proximity and price. The practices that win long-term compete on relationship — communication, personalization, and trust.
- Groupon and discount platforms attract price-sensitive clients with low lifetime value. Recommendations should orient away from discounting and toward membership and relationship value.
- Before-and-after content, client testimonials, and Google reviews are the primary trust signals for new client acquisition in this vertical.

LTV MULTIPLIER INSTRUCTIONS:
hw_revenue_model answer determines leakage formula for Areas 1 and 2:
- "Primarily memberships or prepaid packages — clients commit upfront" OR "Mixed — roughly split between memberships and one-time treatments" -> multiply Area 1 and Area 2 raw leakage by 8 before applying the revenue cap
- "Primarily one-time treatments — clients pay per visit" -> standard formula, no multiplier
Always explain the LTV multiplier in the leakage calculation explanation: "At [avg treatment value] per treatment x 8 visits over the average client lifetime..."`,
};
