import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";
import {
  SharedJourneyCard,
  SharedResourceCard,
  SharedTopicCard,
} from "@/shared/texas-platform/components";
import {
  journeysForSite,
  resolveResources,
  resourcesForSite,
  topicsForSite,
} from "@/shared/texas-platform/registry";
import { SharedResourceSearch } from "@/shared/texas-platform/search";

const SITE = "keeptxred" as const;
const journeys = journeysForSite(SITE);
const topics = topicsForSite(SITE);
const allResources = resourcesForSite(SITE);
const essentials = allResources.filter((resource) => resource.featured).slice(0, 5);
const popularResources = allResources.filter((resource) => resource.featured).slice(0, 6);

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
            <a href="#resource-search" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Search Texas Resources</a>
            <a href="#what-brings-you-here" className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold hover:bg-white/10">Choose What You Need</a>
            <Link to="/texas-resources" className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold hover:bg-white/10">Browse Everything</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><span>Texas Living</span></nav>

        <div id="resource-search" className="scroll-mt-24">
          <SharedResourceSearch site={SITE} />
        </div>

        <section id="what-brings-you-here" className="mt-16 scroll-mt-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start with your goal</p>
          <h2 className="mt-2 font-display text-4xl">What brings you here today?</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Choose the task closest to what you need. Each path opens a complete journey with practical resources and related next steps.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => <SharedJourneyCard key={journey.id} journey={journey} />)}
          </div>
        </section>

        <section id="texas-essentials" className="mt-16 scroll-mt-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Quick access</p>
          <h2 className="mt-2 font-display text-4xl">Texas Essentials</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Go directly to the shared resources people use most when making decisions about life in Texas.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {essentials.map((resource) => <SharedResourceCard key={resource.id} resource={resource} cta="Start here" />)}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border bg-muted/20 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Popular resources</p>
          <h2 className="mt-2 font-display text-4xl">Useful tools and answers</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Start with practical calculators, lookups and government resources already available through the shared platform.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularResources.map((resource) => <SharedResourceCard key={resource.id} resource={resource} />)}
          </div>
          <Link to="/texas-resources" className="mt-7 inline-flex rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary hover:text-primary">
            Browse the complete resource directory →
          </Link>
        </section>

        <section id="browse-by-topic" className="mt-16 scroll-mt-24">
          <h2 className="font-display text-4xl">Browse by Topic</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">Choose a broader topic to find useful guides, tools and official resources.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {topics.map((topic) => {
              const resources = resolveResources(topic.resourceIds, SITE);
              return resources.length ? <SharedTopicCard key={topic.id} topic={topic} resources={resources} /> : null;
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
