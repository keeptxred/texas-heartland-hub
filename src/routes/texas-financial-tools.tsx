import { createFileRoute, Link } from "@tanstack/react-router";

const groups = [
  {
    title: "Buying a home",
    description: "Estimate affordability, monthly payments, upfront cash, and possible assistance.",
    tools: [
      ["Texas Mortgage Calculator", "/texas-mortgage-calculator", "Estimate monthly payments and compare interest-rate scenarios."],
      ["Texas Home Affordability Calculator", "/texas-home-affordability-calculator", "Estimate a comfortable Texas home-price range."],
      ["Texas Down Payment Calculator", "/texas-down-payment-calculator", "Compare down-payment targets and cash requirements."],
      ["Texas Down Payment Assistance Calculator", "/texas-down-payment-assistance-calculator", "Estimate illustrative assistance and remaining cash needs."],
      ["Texas Closing Cost Calculator", "/texas-closing-cost-calculator", "Estimate buyer and seller closing costs."],
    ],
  },
  {
    title: "Owning a home",
    description: "Plan ongoing costs, equity, taxes, insurance, refinancing, and payoff strategies.",
    tools: [
      ["Texas Homeownership Cost Calculator", "/texas-homeownership-cost-calculator", "Estimate the full monthly and annual cost of owning a home."],
      ["Texas Home Equity Calculator", "/texas-home-equity-calculator", "Estimate current equity and available borrowing room."],
      ["Texas Home Equity Growth Calculator", "/texas-home-equity-growth-calculator", "Project appreciation, loan paydown, and future equity."],
      ["Texas Mortgage Payoff Calculator", "/texas-mortgage-payoff-calculator", "See how extra payments can shorten your loan."],
      ["Texas Refinance Savings Calculator", "/texas-refinance-savings-calculator", "Compare refinance savings, costs, and break-even timing."],
      ["Texas Property Tax Increase Calculator", "/texas-property-tax-increase-calculator", "Estimate appraisal-cap and tax-rate changes."],
      ["Texas Home Insurance Calculator", "/texas-home-insurance-calculator", "Estimate homeowners and optional flood coverage costs."],
      ["Texas Utility Cost Calculator", "/texas-utility-cost-calculator", "Estimate seasonal electricity, water, gas, internet, and trash costs."],
    ],
  },
  {
    title: "Moving and comparing",
    description: "Compare locations, relocation costs, rent-versus-buy decisions, and purchasing power.",
    tools: [
      ["Texas Moving Cost Calculator", "/texas-moving-cost-calculator", "Estimate low, expected, and high relocation costs."],
      ["Texas Cost of Living Calculator", "/texas-cost-of-living-calculator", "Compare household costs across Texas cities."],
      ["Texas Salary Comparison by City", "/texas-salary-comparison-by-city", "Compare cost-adjusted salary and purchasing power."],
      ["Texas Rent vs Buy Calculator", "/texas-rent-vs-buy-calculator", "Compare renting and buying over time."],
    ],
  },
  {
    title: "Household finances",
    description: "Understand take-home pay and build a practical monthly plan.",
    tools: [
      ["Texas Salary Calculator", "/texas-salary-calculator", "Estimate Texas take-home pay and household affordability."],
      ["Texas Budget Planner", "/texas-budget-planner", "Build a monthly household budget and financial-health score."],
    ],
  },
] as const;

const starts = [
  ["I am buying a home", "/texas-home-affordability-calculator"],
  ["I already own a home", "/texas-homeownership-cost-calculator"],
  ["I am moving to Texas", "/texas-moving-cost-calculator"],
  ["I am comparing a job offer", "/texas-salary-comparison-by-city"],
  ["I need a household budget", "/texas-budget-planner"],
] as const;

function TexasFinancialToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700">Keep TX Red Tools</p>
        <h1 className="text-4xl font-bold tracking-tight">Texas Financial Tools</h1>
        <p className="mt-4 text-lg text-muted-foreground">Free calculators organized around the decisions Texas homebuyers, homeowners, renters, workers, and families actually make.</p>
      </header>

      <section className="mb-12 rounded-2xl border bg-gray-50 p-6">
        <h2 className="text-2xl font-bold">Start with your goal</h2>
        <p className="mt-2 text-sm text-gray-600">Choose the closest situation and we will send you to the best starting calculator.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {starts.map(([label, to]) => (
            <Link key={to} to={to} className="rounded-xl border bg-white p-4 font-semibold text-red-700 transition hover:-translate-y-0.5 hover:shadow-sm">{label} →</Link>
          ))}
        </div>
      </section>

      <div className="space-y-12">
        {groups.map((group) => (
          <section key={group.title} aria-labelledby={group.title.replaceAll(" ", "-").toLowerCase()}>
            <div className="mb-5 max-w-3xl">
              <h2 id={group.title.replaceAll(" ", "-").toLowerCase()} className="text-2xl font-bold">{group.title}</h2>
              <p className="mt-1 text-gray-600">{group.description}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {group.tools.map(([title, to, description]) => (
                <Link key={to} to={to} className="rounded-xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-700">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-red-700">Open calculator →</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="mt-12 rounded-xl border p-5 text-sm text-gray-600">
        <h2 className="font-semibold text-gray-900">How to interpret these tools</h2>
        <p className="mt-2">Inputs and saved scenarios stay in your browser unless a page explicitly says otherwise. Default values are illustrative Texas estimates, not quotes or official eligibility decisions. Each calculator identifies its assumptions, model version, last review date, and limitations.</p>
      </aside>
    </main>
  );
}

export const Route = createFileRoute("/texas-financial-tools")({ component: TexasFinancialToolsPage });
