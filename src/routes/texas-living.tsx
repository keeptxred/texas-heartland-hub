import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Calculator, Home, Landmark, MapPinned, Scale, Truck, WalletCards } from "lucide-react";
import { buildSeo, SITE_URL } from "@/lib/seo";

const categories = [
  {
    title: "Home & Property",
    description: "Understand property taxes, homestead exemptions, homeownership costs and utilities.",
    icon: Home,
    links: [["Property Tax Calculator", "/tax-calculator"], ["Homestead Resources", "/property-taxes"], ["Homeownership Tools", "/texas-financial-tools"]],
  },
  {
    title: "Moving to Texas",
    description: "Plan your move, compare communities and prepare for the cost of settling in Texas.",
    icon: Truck,
    links: [["Moving to Texas Guide", "/moving-to-texas"], ["Cost of Living Calculator", "/texas-cost-of-living-calculator"], ["Explore Texas", "/explore"]],
  },
  {
    title: "Money",
    description: "Use practical calculators for salary, housing, budgeting and everyday expenses.",
    icon: WalletCards,
    links: [["Texas Financial Tools", "/texas-financial-tools"], ["Salary Calculator", "/texas-salary-calculator"], ["Budget Planner", "/texas-budget-planner"]],
  },
  {
    title: "Government Services",
    description: "Find representatives, follow legislation and connect with Texas government resources.",
    icon: Landmark,
    links: [["Find Your Representative", "/find-representative"], ["Texas Representatives", "/representatives"], ["Texas Bills", "/bills"], ["Texas Elections", "/elections"]],
  },
  {
    title: "Communities",
    description: "Browse information about Texas cities, counties, districts and local communities.",
    icon: MapPinned,
    links: [["County Elections", "/county-elections"], ["District Information", "/elections/districts"], ["Explore Texas Communities", "/explore"]],
  },
  {
    title: "Texas Laws",
    description: "Read practical explanations of important Texas laws, policies and resident responsibilities.",
    icon: Scale,
    links: [["Texas Laws", "/laws"], ["Texas Laws Explained", "/texas-laws"], ["Texas Law and Policy", "/texas-law-policy"]],
  },
  {
    title: "Calculators & Tools",
    description: "Open the complete collection of calculators, comparisons and decision-making tools.",
    icon: Calculator,
    links: [["All Texas Tools", "/texas-financial-tools"], ["Property Tax Tools", "/tax-calculator"], ["Utility Cost Calculator", "/texas-utility-cost-calculator"]],
  },
  {
    title: "Texas Rankings & Reference",
    description: "Explore sourced comparisons, rankings, trends and downloadable reference tables.",
    icon: Building2,
    links: [["Browse Texas Rankings", "/texas-data"], ["Texas Legislature", "/texas-legislature"], ["Texas Politics", "/texas-politics"]],
  },
] as const;

function TexasLivingPage() {
  return (
    <main>
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Practical Texas resources</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Texas Living</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary-foreground/80">
            Everything you need to live, work, move and thrive in Texas. Explore practical guides, calculators, government resources and local information designed to help Texans and those planning to call Texas home.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><span>Texas Living</span></nav>
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Resources</p>
          <h2 className="mt-2 font-display text-4xl">Browse by Topic</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Choose a topic to find the most useful guides, calculators and official resources without sorting through technical data.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {categories.map(({ title, description, icon: Icon, links }) => (
              <section key={title} className="rounded-xl border bg-card p-6">
                <Icon className="size-7 text-primary" />
                <h2 className="mt-4 font-display text-2xl">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {links.map(([label, to]) => <Link key={to} to={to} className="rounded-full border px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary">{label}</Link>)}
                </div>
              </section>
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
      title: "Texas Living: Guides, Calculators & Resident Resources",
      description: "Practical Texas guides, calculators, government resources and local information for living, working, moving and owning property in Texas.",
      path: "/texas-living",
      type: "website",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [{ type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": ["WebPage", "CollectionPage"], name: "Texas Living", description: "Practical guides, calculators and resources for living in Texas.", url: `${SITE_URL}/texas-living` },
          { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Texas Living", item: `${SITE_URL}/texas-living` }] },
        ],
      }).replace(/</g, "\\u003c") }],
    };
  },
  component: TexasLivingPage,
});
