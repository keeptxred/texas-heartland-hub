import { createFileRoute, Link } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";

const sections = [
  {
    title: "Property Taxes",
    description:
      "Estimate Texas property taxes and understand how appraisal and tax-rate changes affect a household.",
    resources: [
      ["Texas Property Tax Calculator", "/tax-calculator"],
      ["Texas Property Tax Increase Calculator", "/texas-property-tax-increase-calculator"],
    ],
  },
  {
    title: "Homeownership",
    description:
      "Estimate ongoing ownership costs, equity growth, refinancing, and mortgage payoff options.",
    resources: [
      ["Texas Homeownership Cost Calculator", "/texas-homeownership-cost-calculator"],
      ["Texas Home Equity Calculator", "/texas-home-equity-calculator"],
      ["Texas Home Equity Growth Calculator", "/texas-home-equity-growth-calculator"],
      ["Texas Mortgage Payoff Calculator", "/texas-mortgage-payoff-calculator"],
      ["Texas Refinance Savings Calculator", "/texas-refinance-savings-calculator"],
    ],
  },
  {
    title: "Insurance",
    description: "Estimate the cost of homeowners and optional flood coverage.",
    resources: [["Texas Home Insurance Calculator", "/texas-home-insurance-calculator"]],
  },
  {
    title: "Utilities",
    description: "Plan a practical household budget and estimate recurring utility expenses.",
    resources: [
      ["Texas Budget Planner", "/texas-budget-planner"],
      ["Texas Utility Cost Calculator", "/texas-utility-cost-calculator"],
      ["Texas Salary Calculator", "/texas-salary-calculator"],
      ["Texas Cost of Living Calculator", "/texas-cost-of-living-calculator"],
    ],
  },
  {
    title: "Government Resources",
    description: "Find representatives, contact legislators, and understand Texas government.",
    resources: [
      ["Find Your Representative", "/find-representative"],
      ["Texas Representatives", "/representatives"],
      ["Contact Legislators", "/contact-legislators"],
      ["Texas Politics", "/texas-politics"],
    ],
  },
  {
    title: "Voting",
    description: "Register, find voting information, and follow Texas elections.",
    resources: [
      ["Texas Elections", "/elections"],
      ["Register to Vote", "/register-to-vote"],
      ["Voting Locations", "/voting-locations"],
      ["County Elections", "/county-elections"],
    ],
  },
  {
    title: "Texas Laws",
    description: "Understand current laws, policy, and important rules for Texas residents.",
    resources: [
      ["Texas Laws", "/laws"],
      ["Texas Laws Explained", "/texas-laws"],
      ["Laws You Should Know", "/laws-to-know"],
      ["Texas Law and Policy", "/texas-law-policy"],
    ],
  },
  {
    title: "Lifestyle",
    description:
      "Follow the news, business, sports, and culture that shape everyday life across Texas.",
    resources: [
      ["Texas News", "/texas-news"],
      ["Texas Business", "/texas-business"],
      ["Texas Sports", "/texas-sports"],
      ["Non-Political Texas News", "/news/non-political"],
      ["Keep TX Red Shop", "/shop"],
    ],
  },
] as const;

function LivingInTexasPage() {
  return (
    <main>
      <HubBreadcrumbs current="Living in Texas" />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Texas resident resource center
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            Living in Texas
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Practical tools and trusted resources for Texas homeowners, renters, families, voters,
            and residents trying to make informed decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/tax-calculator"
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Calculate property taxes
            </Link>
            <Link
              to="/texas-financial-tools"
              className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              View all Texas tools
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold">Resources for everyday life in Texas</h2>
          <p className="mt-3 text-muted-foreground">
            Start with the topic you need and move directly to the most relevant tools and guides.
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
                  <Link
                    key={to}
                    to={to}
                    className="rounded-xl border bg-card p-5 font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {title}
                    <span className="mt-3 block text-sm font-medium text-primary">
                      Open resource →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">Planning a move instead?</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Use the relocation hub for financial planning, home search, community comparisons,
            schools, utilities, and settling-in resources.
          </p>
          <Link
            to="/moving-to-texas"
            className="mt-5 inline-block font-semibold text-primary hover:underline"
          >
            Explore Moving to Texas →
          </Link>
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/living-in-texas")({
  head: () => ({
    meta: [
      {
        title: "Living in Texas: Property Taxes, Homeownership & Resident Resources | Keep TX Red",
      },
      {
        name: "description",
        content:
          "Texas resident resources for property taxes, homeownership, insurance, utilities, household budgeting, state laws, elections, and everyday life.",
      },
    ],
    links: [{ rel: "canonical", href: "/living-in-texas" }],
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
              name: "Living in Texas",
              item: "https://www.keeptxred.com/living-in-texas",
            },
          ],
        }),
      },
    ],
  }),
  component: LivingInTexasPage,
});
