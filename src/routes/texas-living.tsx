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
  type LucideIcon,
} from "lucide-react";
import { buildSeo, SITE_URL } from "@/lib/seo";
import {
  journeysForSite,
  resolveResources,
  resourcesForSite,
  topicsForSite,
  type SharedResource,
} from "@/shared/texas-platform/registry";

const SITE = "keeptxred" as const;

const ICONS: Record<SharedResource["icon"], LucideIcon> = {
  home: Home,
  landmark: Landmark,
  truck: Truck,
  calculator: Calculator,
  scale: Scale,
  wallet: WalletCards,
  map: MapPinned,
  compass: Compass,
  building: Building2,
  search: Search,
};

const journeys = journeysForSite(SITE);
const topics = topicsForSite(SITE);
const allResources = resourcesForSite(SITE);
const essentials = allResources.filter((resource) => resource.featured).slice(0, 5);
const popularResources = allResources.filter((resource) => resource.featured).slice(0, 6);

function ResourceCard({ resource, cta = "Open resource" }: { resource: SharedResource; cta?: string }) {
  const Icon = ICONS[resource.icon];
  return (
    <Link to={resource.route} className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
      <Icon className="size-6 text-primary" />
      <h2 className="mt-4 text-lg font-bold">{resource.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
      <span className="mt-4 block text-sm font-semibold text-primary group-hover:underline">{cta} →</span>
    </Link>
  );
}

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
            <a href="#what-brings-you-here" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Choose What You Need</a>
            <a href="#texas-essentials" className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold hover:bg-white/10">Texas Essentials</a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><span>Texas Living</span></nav>

        <section id="what-brings-you-here" className="scroll-mt-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start with your goal</p>
          <h2 className="mt-2 font-display text-4xl">What brings you here today?</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Choose the task closest to what you need. Each path starts with useful shared resources and leads to related next steps.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => {
              const resources = resolveResources(journey.resourceIds, SITE);
              const first = resources[0];
              if (!first) return null;
              const Icon = ICONS[journey.icon];
              return (
                <Link key={journey.id} to={first.route} className="group rounded-xl border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
                  <Icon className="size-7 text-primary" />
                  <h2 className="mt-4 text-xl font-bold">{journey.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{journey.description}</p>
                  <span className="mt-5 block text-sm font-bold text-primary group-hover:underline">Start this journey →</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="texas-essentials" className="mt-16 scroll-mt-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Quick access</p>
          <h2 className="mt-2 font-display text-4xl">Texas Essentials</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Go directly to the shared resources people use most when making decisions about life in Texas.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {essentials.map((resource) => <ResourceCard key={resource.id} resource={resource} cta="Start here" />)}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border bg-muted/20 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Popular resources</p>
          <h2 className="mt-2 font-display text-4xl">Useful tools and answers</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Start with practical calculators, lookups and government resources already available through the shared platform.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
        </section>

        <section id="browse-by-topic" className="mt-16 scroll-mt-24">
          <h2 className="font-display text-4xl">Browse by Topic</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Choose a broader topic to find useful guides, tools and official resources.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {topics.map((topic) => {
              const resources = resolveResources(topic.resourceIds, SITE);
              const Icon = ICONS[topic.icon];
              if (!resources.length) return null;
              return (
                <section key={topic.id} className="flex min-h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary">
                  <Icon className="size-7 text-primary" />
                  <h2 className="mt-4 font-display text-2xl">{topic.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{topic.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {resources.map((resource) => <Link key={`${topic.id}-${resource.id}`} to={resource.route} className="rounded-full border px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary">{resource.title}</Link>)}
                  </div>
                  <Link to={resources[0].route} className="mt-auto pt-6 text-sm font-bold text-primary hover:underline">{topic.cta} →</Link>
                </section>
              );
            })}
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
