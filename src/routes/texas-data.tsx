import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Clock3, Database, Flame, Search, Sparkles } from "lucide-react";
import { TEXAS_DATASETS } from "@/data/texas-data-center";
import { SharedResourceSearch } from "@/shared/texas-platform/search";
import {
  NEW_RESOURCES,
  POPULAR_RESOURCES,
  TEXAS_ASSISTANT_EXAMPLES,
  TRENDING_RESOURCES,
  browseResourcesForOwner,
  featuredResourcesForOwner,
  resourceHubCategoriesForOwner,
  type ResourceHubLink,
} from "@/shared/texas-platform/resource-hub";

const canonical = "https://keeptxred.com/texas-data";
const SITE_OWNER = "keeptxred" as const;
const RECENT_STORAGE_KEY = "texas-resource-history";

export const Route = createFileRoute("/texas-data")({
  head: () => ({
    meta: [
      { title: "Texas Resources: Guides, Tools & Trusted Information" },
      { name: "description", content: "Search and browse practical Texas guides, calculators, laws, bills, representatives, elections and trusted resources from one place." },
      { property: "og:title", content: "Texas Resources — Keep TX Red" },
      { property: "og:description", content: "A single starting point for practical Texas guides, calculators, government information and resources." },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["WebPage", "CollectionPage"],
            name: "Texas Resources",
            description: "A searchable hub for practical Texas guides, calculators, laws, bills, representatives, elections and trusted resources.",
            url: canonical,
            potentialAction: {
              "@type": "SearchAction",
              target: "https://keeptxred.com/texas-resources?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com" },
              { "@type": "ListItem", position: 2, name: "Texas Living", item: "https://keeptxred.com/texas-living" },
              { "@type": "ListItem", position: 3, name: "Texas Resources", item: canonical },
            ],
          },
        ],
      }).replace(/</g, "\\u003c"),
    }],
  }),
  component: TexasResources,
});

function readRecentlyViewed(): ResourceHubLink[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(RECENT_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter((item): item is ResourceHubLink => Boolean(item && typeof item.label === "string" && typeof item.href === "string"))
      .slice(0, 3);
  } catch {
    return [];
  }
}

function ResourceList({ title, icon: Icon, resources }: { title: string; icon: typeof Clock3; resources: ResourceHubLink[] }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2"><Icon className="size-5 text-primary" /><h3 className="font-display text-2xl">{title}</h3></div>
      <div className="mt-4 space-y-2">
        {resources.map((resource) => (
          <a key={`${title}-${resource.href}`} href={resource.href} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">
            {resource.label}<ArrowRight className="size-4" />
          </a>
        ))}
      </div>
    </div>
  );
}

function TexasResources() {
  const categories = useMemo(() => resourceHubCategoriesForOwner(SITE_OWNER), []);
  const featuredResources = useMemo(() => featuredResourcesForOwner(SITE_OWNER), []);
  const browseResources = useMemo(() => browseResourcesForOwner(SITE_OWNER), []);
  const [recentlyViewed, setRecentlyViewed] = useState<ResourceHubLink[]>([]);
  const [question, setQuestion] = useState("");

  useEffect(() => setRecentlyViewed(readRecentlyViewed()), []);

  function askTexas(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = question.trim();
    if (!normalized || typeof window === "undefined") return;
    window.location.assign(`/texas-resources?q=${encodeURIComponent(normalized)}`);
  }

  return (
    <main>
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Resources</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Texas Resources</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary-foreground/80">
            Find practical information about Texas—from laws and elections to representatives, bills and useful calculators. Start with a question, browse a topic or open one of the resources Texans use most.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <Link to="/">Home</Link><span className="mx-2">/</span><Link to="/texas-living">Texas Living</Link><span className="mx-2">/</span><span>Texas Resources</span>
        </nav>

        <SharedResourceSearch
          site="keeptxred"
          title="What are you looking for?"
          description="Search calculators, representatives, bills, laws, elections, guides and other Texas resources from one place."
        />

        <section className="mt-8" aria-labelledby="browse-texas-title">
          <h2 id="browse-texas-title" className="font-display text-2xl">Browse Texas</h2>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {browseResources.map(({ label, href, icon: Icon }) => (
              <a key={href} href={href} className="inline-flex shrink-0 items-center gap-2 rounded-full border bg-card px-4 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary">
                <Icon className="size-4" />{label}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="resource-categories-title">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Browse by need</p>
            <h2 id="resource-categories-title" className="mt-2 font-display text-4xl">Start with a topic</h2>
            <p className="mt-3 text-muted-foreground">Keep TX Red focuses on Texas government, elections, laws, representatives and legislation. General living resources use the same shared platform and can move to TexasDefined without rebuilding this page.</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {categories.map(({ id, icon: Icon, title, description, links, exploreHref }) => (
              <article key={id} className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="size-7" /></div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-3xl">{title}</h3>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{links.length} resources</span>
                    </div>
                    <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {links.map((link) => (
                    <a key={`${id}-${link.href}`} href={link.href} className="rounded-lg border bg-background px-3 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">{link.label}</a>
                  ))}
                </div>
                <a href={exploreHref} className="mt-6 inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90">
                  Explore {title}<ArrowRight className="size-4" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="featured-resources-title">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Popular starting points</p>
            <h2 id="featured-resources-title" className="mt-2 font-display text-4xl">Featured resources</h2>
            <p className="mt-3 text-muted-foreground">Go directly to the Keep TX Red tools and guides visitors use most often.</p>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredResources.map(({ title, description, href, icon: Icon }) => (
              <a key={title} href={href} className="group rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm">
                <Icon className="size-6 text-primary" />
                <h3 className="mt-4 font-display text-2xl group-hover:text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">Open resource <ArrowRight className="size-4" /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="continue-exploring-title">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Personalized discovery</p>
            <h2 id="continue-exploring-title" className="mt-2 font-display text-4xl">Continue exploring</h2>
            <p className="mt-3 text-muted-foreground">Return to something you viewed or see what is popular, trending and newly available.</p>
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ResourceList title="Recently viewed" icon={Clock3} resources={recentlyViewed.length ? recentlyViewed : POPULAR_RESOURCES.slice(0, 3)} />
            <ResourceList title="Popular today" icon={Flame} resources={POPULAR_RESOURCES} />
            <ResourceList title="Trending resources" icon={Sparkles} resources={TRENDING_RESOURCES} />
            <ResourceList title="New resources" icon={Database} resources={NEW_RESOURCES} />
          </div>
        </section>

        <section className="mt-16 rounded-2xl border bg-secondary p-7 text-secondary-foreground sm:p-10" aria-labelledby="ask-texas-title">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary"><Sparkles className="size-5" /><p className="text-xs font-bold uppercase tracking-[0.18em]">Natural-language search</p></div>
            <h2 id="ask-texas-title" className="mt-3 font-display text-4xl">Ask anything about Texas</h2>
            <p className="mt-3 leading-7 text-secondary-foreground/75">Write your question naturally. We will search the shared Texas resource system for the most relevant guides, calculators, bills, representatives and laws.</p>
          </div>
          <form onSubmit={askTexas} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="texas-question" className="sr-only">Ask a Texas question</label>
            <input id="texas-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="How can we help?" className="min-h-12 flex-1 rounded-lg border bg-background px-4 text-foreground outline-none ring-primary focus:ring-2" />
            <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-bold text-primary-foreground"><Search className="size-4" />Find answers</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {TEXAS_ASSISTANT_EXAMPLES.map((example) => (
              <button key={example} type="button" onClick={() => setQuestion(example)} className="rounded-full border border-secondary-foreground/25 px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary">{example}</button>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="published-resources-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Published resources</p>
              <h2 id="published-resources-title" className="mt-2 font-display text-4xl">Browse current topics</h2>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-sm">{TEXAS_DATASETS.length} resources</span>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TEXAS_DATASETS.map((dataset) => (
              <Link key={dataset.slug} to="/texas-data/$datasetSlug" params={{ datasetSlug: dataset.slug }} className="group rounded-xl border bg-card p-6 transition hover:border-primary">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{dataset.category}</span>
                  <Database className="size-5 text-muted-foreground" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{dataset.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{dataset.description}</p>
                <div className="mt-5 border-t pt-4 text-sm font-semibold text-primary">Explore resource →</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
