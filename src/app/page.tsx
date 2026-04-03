import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Answer Questions About Your Business",
    description:
      "Tell us how you handle leads, quoting, scheduling, team communication, invoicing, and follow-up. Takes about 10 minutes.",
  },
  {
    number: "02",
    title: "AI Analyzes Your Workflows",
    description:
      "Our AI reviews your answers, calculates your revenue leakage across every workflow area, and identifies your highest-impact fixes.",
  },
  {
    number: "03",
    title: "Get Your Free Report",
    description:
      "Receive a PDF report with your exact leakage figure, a score for each workflow area, and a prioritized list of what to fix first.",
  },
];

const areas = [
  "Lead Capture & Response Time",
  "Estimating & Quoting",
  "Scheduling & Dispatch",
  "Team & Crew Communication",
  "Customer Onboarding & Prep",
  "Job Completion & Handoff",
  "Invoicing & Payment Collection",
  "Customer Communication & Updates",
  "Reviews & Reputation",
  "Re-engagement & Follow-up",
  "Referral Management",
  "Business Visibility & Reporting",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="border-b border-slate-100 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            RevRep.ai Workflow Audit
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/audit"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              Start Free Audit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-600">
            Free for service businesses with 5–25 employees
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            See Exactly Where Your Business Is{" "}
            <span className="text-indigo-600">Losing Money</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-xl leading-relaxed text-slate-500">
            WorkflowAudit analyzes how your team handles leads, quotes,
            scheduling, invoicing, and follow-up — and shows you the dollar
            figure slipping through the cracks. Free for service businesses with
            5–25 employees.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 hover:shadow-indigo-300 active:scale-95"
          >
            Get My Free Audit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            No account required · Takes about 10 minutes · PDF report emailed to you
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Built for service-based businesses with 5–25 employees
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
              How it works
            </h2>
            <p className="text-lg text-slate-500">
              Three steps to know exactly what your business is losing — and how to fix it.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-4 text-4xl font-bold text-indigo-100">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat callout */}
      <section className="border-t border-slate-100 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-2xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-3xl">
            &ldquo;Service businesses lose an average of{" "}
            <span className="text-indigo-600">23% of potential revenue</span> to
            slow follow-up, scheduling gaps, and missed invoices.&rdquo;
          </p>
        </div>
      </section>

      {/* Coverage */}
      <section className="border-t border-slate-100 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
              Every part of your operation, covered.
            </h2>
            <p className="text-lg text-slate-500">
              The audit spans 12 workflow areas built for service businesses — so nothing gets missed.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {areas.map((area) => (
              <div
                key={area}
                className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-slate-100 bg-indigo-600 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">
            Ready to see what your business is losing?
          </h2>
          <p className="mb-8 text-lg text-indigo-200">
            Get your free, personalized workflow audit in under 10 minutes. No
            consultants. No sales calls. Just clear answers.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 active:scale-95"
          >
            Get My Free Audit
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-sm text-slate-400">
          <span>WorkflowAudit</span>
          <span>Free for service businesses · No account required</span>
        </div>
      </footer>
    </div>
  );
}
