import { createFileRoute, Link } from "@tanstack/react-router";

const sections = [
  {
    title: "Homeownership and property taxes",
    description: "Estimate the ongoing costs of owning a Texas home and understand taxes, insurance, equity, refinancing, and payoff options.",
    resources: [
      ["Texas Property Tax Calculator", "/tax-calculator"],
      ["Texas Property Tax Increase Calculator", "/texas-property-tax-increase-calculator"],
      ["Texas Homeownership Cost Calculator", "/texas-homeownership-cost-calculator"],
      ["Texas Home Insurance Calculator", "/texas-home-insurance-calculator"],
      ["Texas Home Equity Calculator", "/texas-home-equity-calculator"],
      ["Texas Home Equity Growth Calculator", "/texas-home-equity-growth-calculator"],
      ["Texas Mortgage Payoff Calculator", "/texas-mortgage-payoff-calculator"],
      ["Texas Refinance Savings Calculator", "/texas-refinance-savings-calculator"],
    ],
  },
  {
    title: "Household costs",
    description: "Plan a practical household budget and estimate recurring utility expenses.",
    resources: [
      ["Texas Budget Planner", "/texas-budget-planner"],
      ["Texas Utility Cost Calculator", "/texas-utility-cost-calculator"],
      ["Texas Salary Calculator", "/texas-salary-calculator"],
      ["Texas Cost of Living Calculator", "/texas-cost-of-living-calculator"],
    ],
  },
  {
    title: "Texas government and civic life",
    description: "Find current information about Texas laws, elections, politics, government, and statewide developments.",
    resources: [
      ["Texas Laws", "/laws"],
      ["Texas Elections", "/elections"],
      ["Texas Politics", "/texas-politics"],
      ["Texas News", "/texas-news"],
      ["Texas Business", "/texas-business"],
      ["Non-Political Texas News", "/news/non-political"],
    ],
  },
] as const;

function LivingInTexasPage() {
  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas resident resource center</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Living in Texas</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Practical tools and trusted resources for Texas homeowners, renters, families, voters, and residents trying to make informed decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tax-calculator" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Calculate property taxes</Link>
            <Link to="/texas-financial-tools" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">View all Texas tools</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold">Resources for everyday life in Texas</h2>
          <p className="mt-3 text-muted-foreground">Start with the topic you need and move directly to the most relevant tools and guides.</p>
        </div>
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="mb-5 max-w-3xl">
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <p className="mt-2 text-muted-foreground">{section.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.resources.map(([title, to]) => (
                  <Link key={to} to={to} className="rounded-xl border bg-card p-5 font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary">
                    {title}
                    <span className="mt-3 block text-sm font-medium text-primary">Open resource →</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          <div><h2 className="font-bold">Coming next: save on homeownership</h2><p className="mt-2 text-sm text-muted-foreground">Homestead-exemption and property-tax protest savings tools.</p></div>
          <div><h2 className="font-bold">Coming next: manage household costs</h2><p className="mt-2 text-sm text-muted-foreground">Electricity-plan, water-cost, internet, solar, and pool-ownership tools.</p></div>
          <div><h2 className="font-bold">Coming next: Texas life</h2><p className="mt-2 text-sm text-muted-foreground">State services, licensing, parks, hunting, fishing, recreation, and seasonal guides.</p></div>
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/living-in-texas")({
  head: () => ({
    meta: [
      { title: "Living in Texas: Property Taxes, Homeownership & Resident Resources | Keep TX Red" },
      { name: "description", content: "Texas resident resources for property taxes, homeownership, insurance, utilities, household budgeting, state laws, elections, and everyday life." },
    ],
    links: [{ rel: "canonical", href: "/living-in-texas" }],
  }),
  component: LivingInTexasPage,
});
