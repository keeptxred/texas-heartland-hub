import { createFileRoute, Link } from "@tanstack/react-router";

const tools = [
  ["Texas Mortgage Calculator", "/texas-mortgage-calculator", "Estimate monthly payments and compare interest-rate scenarios."],
  ["Texas Home Affordability Calculator", "/texas-home-affordability-calculator", "Estimate a comfortable Texas home-price range."],
  ["Texas Down Payment Calculator", "/texas-down-payment-calculator", "Compare down-payment targets and cash requirements."],
  ["Texas Closing Cost Calculator", "/texas-closing-cost-calculator", "Estimate buyer and seller closing costs."],
  ["Texas Home Equity Growth Calculator", "/texas-home-equity-growth-calculator", "Project appreciation, loan paydown, and future equity."],
  ["Texas Mortgage Payoff Calculator", "/texas-mortgage-payoff-calculator", "See how extra payments can shorten your loan."],
  ["Texas Homeownership Cost Calculator", "/texas-homeownership-cost-calculator", "Estimate the full monthly and annual cost of owning a home."],
  ["Texas Refinance Savings Calculator", "/texas-refinance-savings-calculator", "Compare refinance savings, costs, and break-even timing."],
  ["Texas Home Equity Calculator", "/texas-home-equity-calculator", "Estimate current equity and available borrowing room."],
  ["Texas Rent vs Buy Calculator", "/texas-rent-vs-buy-calculator", "Compare renting and buying over time."],
  ["Texas Cost of Living Calculator", "/texas-cost-of-living-calculator", "Compare household costs across Texas cities."],
  ["Texas Salary Calculator", "/texas-salary-calculator", "Estimate Texas take-home pay and household affordability."],
  ["Texas Budget Planner", "/texas-budget-planner", "Build a monthly household budget and financial-health score."],
  ["Texas Home Insurance Calculator", "/texas-home-insurance-calculator", "Estimate annual and monthly homeowners insurance costs."],
  ["Texas Utility Cost Calculator", "/texas-utility-cost-calculator", "Estimate electricity, water, gas, internet, and trash costs."],
  ["Texas Moving Cost Calculator", "/texas-moving-cost-calculator", "Estimate transportation, labor, travel, packing, and setup costs."],
  ["Texas Property Tax Increase Calculator", "/texas-property-tax-increase-calculator", "Estimate the effect of appraisal and combined tax-rate changes."],
  ["Texas Down Payment Assistance Calculator", "/texas-down-payment-assistance-calculator", "Estimate potential assistance and remaining cash needs."],
  ["Texas Salary Comparison by City", "/texas-salary-comparison-by-city", "Compare cost-adjusted salary and purchasing power when moving to a Texas city."],
] as const;

function TexasFinancialToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-700">Keep TX Red Tools</p>
        <h1 className="text-4xl font-bold tracking-tight">Texas Financial Tools</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Free calculators for Texas homebuyers, homeowners, renters, workers, and families.
        </p>
      </header>
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tools.map(([title, to, description]) => (
          <Link key={to} to={to} className="rounded-xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-red-700">Open calculator →</span>
          </Link>
        ))}
      </section>
      <p className="mt-10 text-sm text-muted-foreground">
        Estimates are educational and may not reflect lender, tax, insurance, appraisal, program, provider, or local-district requirements.
      </p>
    </main>
  );
}

export const Route = createFileRoute("/texas-financial-tools")({
  component: TexasFinancialToolsPage,
});
