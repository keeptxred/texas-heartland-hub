import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Calculator,
  Compass,
  Home,
  Landmark,
  MapPinned,
  Scale,
  Search,
  Truck,
  WalletCards,
} from "lucide-react";
import { buildSeo, SITE_URL } from "@/lib/seo";

const essentials = [
  { title: "Property Taxes", description: "Estimate your taxes and find practical homeowner guidance.", to: "/tax-calculator", icon: Home },
  { title: "Find My Representative", description: "Identify the elected officials who represent your area.", to: "/find-representative", icon: Landmark },
  { title: "Moving to Texas", description: "Plan your move, compare costs and prepare for settling in.", to: "/moving-to-texas", icon: Truck },
  { title: "Calculators & Tools", description: "Use Texas-focused tools for housing, salary, budgeting and utilities.", to: "/texas-financial-tools", icon: Calculator },
  { title: "Texas Laws", description: "Understand important laws and what they mean for everyday life.", to: "/laws", icon: Scale },
] as const;

const categories = [
  {
    title: "Home & Property",
    description: "Understand property taxes, homestead exemptions, homeownership costs, insurance and utilities.",
    icon: Home,
    cta: "Explore Home & Property",
    links: [["Property Tax Calculator", "/tax-calculator"], ["Homestead Resources", "/property-taxes"], ["Homeownership Tools", "/texas-financial-tools"]],
  },
  {
    title: "Money & Taxes",
    description: "Make informed decisions about salary, housing, household budgets and everyday expenses.",
    icon: WalletCards,
    cta: "Find Money Tools",
    links: [["Texas Financial Tools", "/texas-financial-tools"], ["Salary Calculator", "/texas-salary-calculator"], ["Budget Planner", "/texas-budget-planner"]],
  },
  {
    title: "Government & Elections",
    description: "Find representatives, follow legislation, understand elections and connect with Texas government.",
    icon: Landmark,
    cta: "Find Government Resources",
    links: [["Find Your Representative", "/find-representative"], ["Texas Bills", "/bills"], ["Texas Elections", "/elections"], ["Texas Legislature", "/texas-legislature"]],
  },
  {
    title: "Texas Laws",
    description: "Read plain-English explanations of important Texas laws, policies and resident responsibilities.",
    icon: Scale,
    cta: "Understand Texas Laws",
    links: [["Texas Laws", "/laws"], ["Texas Laws Explained", "/texas-laws"], ["Texas Law and Policy", "/texas-law-policy"]],
  },
  {
    title: "Cities & Counties",
    description: "Explore information about Texas communities, counties, districts and local government.",
    icon: MapPinned,
    cta: "Explore Communities",
    links: [["County Elections", "/county-elections"], ["District Information", "/elections/districts"], ["Explore Texas Communities", "/explore"]],
  },
  {
    title: "Moving to Texas",
    description: "Plan your move, compare communities and prepare for the costs and decisions ahead.",
    icon: Truck,
    cta: "Start Planning Your Move",
    links: [["Moving to Texas Guide", "/moving-to-texas"], ["Cost of Living Calculator", "/texas-cost-of-living-calculator"], ["Moving Cost Calculator", "/texas-moving-cost-calculator"]],
  },
  {
    title: "Calculators & Tools",
    description: "Use practical tools for property taxes, mortgages, salaries, utilities and cost of living.",
    icon: Calculator,
    cta: "Use the Tools",
    links: [["All Texas Tools", "/texas-financial-tools"], ["Property Tax Tools", "/tax-calculator"], ["Utility Cost Calculator", "/texas-utility-cost-calculator"]],
  },
  {
    title: "Explore Texas",
    description: "Discover Texas destinations, communities, parks and places worth knowing about.",
    icon: Compass,
    cta: "Explore Texas",
    links: [["Explore Texas", "/explore"], ["Texas Communities", "/explore"], ["Trip Planner", "/explore/trip-planner"]],
  },
] as const;

const referenceCards = [
  {
    title: "Compare Texas",
    description: "Compare Texas communities, counties and topics using clear information, maps and side-by-side views.",
    icon: Building2,
    to: "/texas-data",
    cta: "Start Comparing",
  },
  {
    title: "Explore History",
    description: "See how Texas has changed over time through historical information, major events and long-term trends.",
    icon: Compass,
    to: "/texas-data",
    cta: "Explore History",
  },
  {
    title: "Helpful Guides",
    description: "Browse trusted guides, calculators and official resources for taxes, moving, voting and everyday life.",
    icon: Calculator,
    to: "/texas-financial-tools",
    cta: "View Guides",
  },
  {
    title: "Related Resources",
    description: "Move easily between representatives, bills, laws, counties, cities, maps and connected topics.",
    icon: Search,
    to: "/texas-living#browse-by-topic",
    cta: "Browse Resources",
  },
] as const;

function TexasLivingPage() {
  return (
    <main>
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Texas Living</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl tracking-tight sm:text-6xl">Helping Texans make smarter everyday decisions.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary-foreground/80">
            Find practical information about Texas—from property taxes and elections to cities, counties, schools and cost of living. Explore trusted guides, interactive tools, calculators and official resources designed to help Texans and future Texans quickly find reliable answers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#browse-by-topic" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Browse by Topic</a>
            <a href="#texas-essentials" className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold hover:bg-white/10">Texas Essentials</a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><span>Texas Living</span></nav>

        <section id="texas-essentials" className="scroll-mt-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start Here</p>
          <h2 className="mt-2 font-display text-4xl">Texas Essentials</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Go directly to the resources people use most when making decisions about life in Texas.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {essentials.map(({ title, description, to, icon: Icon }) => (
              <Link key={to} to={to} className="rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                <Icon className="size-6 text-primary" />
                <h2 className="mt-4 text-lg font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <span className="mt-4 block text-sm font-semibold text-primary">Start here →</span>
              </Link>
            ))}
          </div>
        </section>

        <section id="browse-by-topic" className="mt-16 scroll-mt-24">
          <h2 className="font-display text-4xl">Browse by Topic</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Choose what you are trying to accomplish and move directly to the most useful guides, tools and official resources.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {categories.map(({ title, description, icon: Icon, links, cta }) => (
              <section key={title} className="flex min-h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary">
                <Icon className="size-7 text-primary" />
                <h2 className="mt-4 font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {links.map(([label, to]) => <Link key={`${title}-${to}-${label}`} to={to} className="rounded-full border px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary">{label}</Link>)}
                </div>
                <Link to={links[0][1]} className="mt-auto pt-6 text-sm font-bold text-primary hover:underline">{cta} →</Link>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-4xl">More Ways to Explore</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Compare places, understand changes over time and discover connected information without navigating technical data pages.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {referenceCards.map(({ title, description, icon: Icon, to, cta }) => (
              <Link key={title} to={to} className="rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                <Icon className="size-6 text-primary" />
                <h2 className="mt-4 font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <span className="mt-5 block text-sm font-bold text-primary">{cta} →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/texas-living")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Living: Guides, Calculators & Everyday Resources",
      description: "Trusted Texas guides, calculators, government resources and community information for living, working, moving and owning property in Texas.",
      path: "/texas-living",
      type: "website",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [{ type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": ["WebPage", "CollectionPage"], name: "Texas Living", description: "Trusted guides, calculators and practical resources for making everyday decisions in Texas.", url: `${SITE_URL}/texas-living` },
          { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Texas Living", item: `${SITE_URL}/texas-living` }] },
        ],
      }).replace(/</g, "\\u003c") }],
    };
  },
  component: TexasLivingPage,
});
