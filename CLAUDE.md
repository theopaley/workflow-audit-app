# WorkflowAudit — Project Reference

## What We Are Building

WorkflowAudit is an AI-powered workflow audit tool for small businesses (5–25 employees). Business owners complete a guided survey, receive AI analysis of their workflows, and get a branded PDF report emailed to them and our team.

## Core User Flow

1. **Landing page** — brief value proposition, CTA to start the audit
2. **Survey** — Typeform-style, one question at a time (smooth transitions, progress indicator)
3. **Processing screen** — "Analyzing your workflows…" while AI runs
4. **Results preview** — brief on-screen summary
5. **PDF report** — full detailed report generated and emailed automatically

## Survey Structure

The survey covers **12 workflow areas**. For each area:
- **Q1 (Software)**: "Which software/platforms do you use for [area]?" (multi-select + free text)
- **Q2–Q4**: Three targeted questions about how that workflow is running (pain points, frequency of issues, manual steps, etc.)

**The 12 Workflow Areas:**
1. Sales & CRM
2. Marketing & Lead Generation
3. Finance & Accounting
4. HR & People Management
5. Project Management & Task Tracking
6. Customer Support
7. Inventory & Supply Chain
8. Internal Communication & Collaboration
9. Reporting & Analytics
10. Legal & Compliance
11. IT & Security
12. Onboarding (Clients or Employees)

**Total questions: ~48–52** (4 per area + intro questions for name, business type, team size, etc.)

## AI Analysis

- Model: `claude-sonnet-4-6` (default to latest capable model)
- After survey completion, all answers are sent to Claude via the Anthropic SDK
- Claude identifies: broken workflows, inefficiencies, integration gaps, quick wins, and long-term recommendations
- Output is structured JSON used to populate the PDF report sections

## PDF Report

- Generated server-side using `@react-pdf/renderer`
- Sections:
  - Executive Summary
  - Overall Workflow Health Score (0–100)
  - Per-area breakdown (score, identified issues, recommendations)
  - Priority action items (top 3–5)
  - Software stack map
  - Next steps / CTA
- Branded design: professional, clean, suitable for sharing with stakeholders

## Email Delivery

- Library: `resend`
- Two emails sent on report completion:
  1. **To the business owner** — personalized, includes PDF attachment and key takeaways
  2. **To our team** — internal notification with PDF and full survey answers for follow-up

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic SDK (`@anthropic-ai/sdk`), model `claude-sonnet-4-6` |
| PDF | `@react-pdf/renderer` |
| Email | `resend` |
| Deployment | (TBD — likely Vercel) |

## Project Structure

```
src/
  app/
    page.tsx                  # Landing page
    audit/
      page.tsx                # Survey shell (loads question components)
    processing/
      page.tsx                # "Analyzing..." loading screen
    results/
      page.tsx                # On-screen results summary
    api/
      analyze/
        route.ts              # POST: send answers to Claude, get structured analysis
      generate-report/
        route.ts              # POST: generate PDF from analysis
      send-report/
        route.ts              # POST: email report to owner + team
  components/
    survey/                   # Survey UI components (question types, progress bar, transitions)
    report/                   # React PDF components for the report
    ui/                       # Shared UI primitives
  lib/
    survey-config.ts          # The 12 areas, questions, answer options
    ai-analysis.ts            # Claude prompt + response parsing
    pdf-generator.ts          # PDF assembly logic
    email.ts                  # Resend email templates
  types/
    survey.ts                 # TypeScript types for answers, analysis, report
```

## Environment Variables Required

```
ANTHROPIC_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
TEAM_NOTIFICATION_EMAIL=
```

## Report Creative Direction

**Arc's brief:** make the business owner feel seen, not evaluated. The report language must create urgency without shame. Written for a business owner reading alone at their kitchen table at 10pm.

## Design Principles

- **One question at a time** — clean, focused UI like Typeform. Keyboard navigable (Enter to advance).
- **Fast and smooth** — animated transitions between questions, instant feedback on selection
- **Mobile-first** — survey must work perfectly on phone
- **Professional PDF** — report should look like it came from a consulting firm
- **No login required** — frictionless, just enter email to receive the report

## Key Business Logic

- Survey answers are stored in client-side state (React) during the survey, then POSTed to the API on completion
- AI analysis runs server-side to protect API keys
- PDF is generated server-side and streamed/attached to emails
- If AI or email fails, log the error and store answers so we can retry manually

## What NOT to Build (Scope Limits for Now)

- No user accounts or authentication
- No database (answers are processed in-flight, not stored long-term)
- No dashboard or saved reports
- No payment/pricing gate on the survey itself
