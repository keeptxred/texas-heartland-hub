import { createFileRoute, Link } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";

const sections = [
  {
    title: "Moving Checklist",
    description:
      "Start with a personalized timeline for the steps that become urgent before and immediately after your move.",
    resources: [
      ["Interactive Moving Checklist", "/moving-to-texas-checklist"],
      ["Moving to Texas Guide", "/texas/moving-to-texas-2026"],
      ["Register to Vote", "/register-to-vote"],
      ["Texas Laws", "/laws"],
    ],
  },
  {
    title: "Vehicle and Driver License",
    description:
      "Estimate registration costs, find your county office, open official forms, and track the 30-day and 90-day deadlines.",
    resources: [["Vehicle Registration Estimator and Office Finder", "/find-my-dmv"]],
  },
  {
    title: "Financial Planning",
    description:
      "Compare income, living costs, moving expenses, and the monthly budget you may need after relocating.",
    resources: [
      ["Texas Moving Cost Calculator", "/texas-moving-cost-calculator"],
      ["Texas Cost of Living Calculator", "/texas-cost-of-living-calculator"],
      ["Texas Salary Comparison by City", "/texas-salary-comparison-by-city"],
      ["Texas Salary Calculator", "/texas-salary-calculator"],
      ["Texas Budget Planner", "/texas-budget-planner"],
    ],
  },
  {
    title: "Finding a Home",
    description:
      "Estimate affordability, compare renting with buying, and understand the cash required to purchase a Texas home.",
    resources: [
      ["Texas Rent vs Buy Calculator", "/texas-rent-vs-buy-calculator"],
      ["Texas Home Affordability Calculator", "/texas-home-affordability-calculator"],
      ["Texas Mortgage Calculator", "/texas-mortgage-calculator"],
      ["Texas Down Payment Calculator", "/texas-down-payment-calculator"],
      ["Texas Closing Cost Calculator", "/texas-closing-cost-calculator"],
      ["Texas Down Payment Assistance Calculator", "/texas-down-payment-assistance-calculator"],
    ],
  },
  {
    title: "Cities and Communities",
    description: "Explore individual Texas cities and communities before choosing where to settle.",
    resources: [
      ["Houston", "/houston"],
      ["Dallas–Fort Worth", "/dallas-fort-worth"],
      ["San Antonio", "/san-antonio"],
      ["Austin", "/austin"],
      ["El Paso", "/el-paso"],
    ],
  },
  {
    title: "Texas Economy and News",
    description:
      "Follow statewide business, economic, and community developments that may shape your move.",
    resources: [
      ["Texas Business and Economy", "/texas-business"],
      ["Latest Texas News", "/texas-news"],
    ],
  },
  {
    title: "Schools",
    description:
      "Find the public school district that serves a Texas address and follow education coverage.",
    resources: [
      ["Find My School District", "/find-my-school-district"],
      ["Texas Education News", "/texas-news/education"],
    ],
  },
  {
    title: "Utilities",
    description:
      "Estimate recurring electricity, water, gas, internet, and trash costs for a Texas household.",
    resources: [
      ["Texas Utility Cost Calculator", "/texas-utility-cost-calculator"],
      ["Texas Budget Planner", "/texas-budget-planner"],
    ],
  },
] as const;

function MovingToTexasPage() {
  return (
    <main>
      <HubBreadcrumbs current="Moving to Texas" />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Texas relocation resource center
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            Moving to Texas
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Plan your move with practical calculators, Texas guides, and step-by-step resources for
            comparing costs, choosing a home, and getting settled.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/texas-financial-tools"
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              View all Texas tools
            </Link>
            <Link
              to="/texas-moving-cost-calculator"
              className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              Estimate moving costs
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold">Start with where you are in the journey</h2>
          <p className="mt-3 text-muted-foreground">
            Choose a section below instead of searching through every calculator and guide on the
            site.
          </p>
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
                  <a
                    key={to}
                    href={to}
                    className="rounded-xl border bg-card p-5 font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {title}
                    <span className="mt-3 block text-sm font-medium text-primary">
                      Open resource →
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">Continue your Texas journey</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Already here? Find property-tax, homeownership, utility, government, voting, and
            lifestyle resources in the resident hub.
          </p>
          <Link
            to="/living-in-texas"
            className="mt-5 inline-block font-semibold text-primary hover:underline"
          >
            Explore Living in Texas →
          </Link>
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/moving-to-texas")({
  head: () => ({
    meta: [
      { title: "Moving to Texas: Calculators, Costs & Relocation Resources | Keep TX Red" },
      {
        name: "description",
        content:
          "Plan a move to Texas with cost-of-living, salary, moving-cost, mortgage, affordability, down-payment, and closing-cost tools plus practical Texas guides.",
      },
    ],
    links: [{ rel: "canonical", href: "/moving-to-texas" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.keeptxred.com/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Moving to Texas",
              item: "https://www.keeptxred.com/moving-to-texas",
            },
          ],
        }),
      },
    ],
  }),
  component: MovingToTexasPage,
});
