import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Complete the Audit Survey",
    description:
      "Answer 12 short sections covering every key area of your business — from sales and finance to HR and IT. Takes about 10 minutes.",
  },
  {
    number: "02",
    title: "AI Analyzes Your Workflows",
    description:
      "Our AI reviews your answers to identify broken processes, inefficiencies, integration gaps, and quick wins across your entire operation.",
  },
  {
    number: "03",
    title: "Receive Your Custom Report",
    description:
      "Get a branded PDF report emailed directly to you — with a health score for each workflow area, priority fixes, and a clear action plan.",
  },
];

const areas = [
  "Sales & CRM",
  "Marketing",
  "Finance & Accounting",
  "HR & People",
  "Project Management",
  "Customer Support",
  "Inventory & Supply Chain",
  "Internal Communication",
  "Reporting & Analytics",
  "Legal & Compliance",
  "IT & Security",
  "Client Onboarding",
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
              href="/home-services"
              className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500"
            >
              Home Services
            </Link>
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
            Free for businesses with 5–25 employees
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Find and fix the workflows{" "}
            <span className="text-indigo-600">holding your business back</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-xl leading-relaxed text-slate-500">
            WorkflowAudit identifies exactly where your team is losing time,
            money, and momentum — then delivers a prioritized action plan to fix
            it.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 hover:shadow-indigo-300 active:scale-95"
          >
            Get Your Free Workflow Audit
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
            Currently optimized for service-based businesses with 5–25 employees
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
              Three steps to a clearer, more efficient business.
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

      {/* Coverage */}
      <section className="border-t border-slate-100 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
              Every corner of your business, covered
            </h2>
            <p className="text-lg text-slate-500">
              The audit spans 12 workflow areas — so nothing gets missed.
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
            Ready to see what's slowing you down?
          </h2>
          <p className="mb-8 text-lg text-indigo-200">
            Get your free, personalized workflow audit in under 10 minutes. No
            consultants. No sales calls. Just clear answers.
          </p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 active:scale-95"
          >
            Get Your Free Workflow Audit
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
          <span>Free for small businesses · No account required</span>
        </div>
      </footer>
    </div>
  );
}
