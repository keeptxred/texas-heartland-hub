import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database } from "lucide-react";
import { TEXAS_DATASETS } from "@/data/texas-data-center";
import { SharedResourceSearch } from "@/shared/texas-platform/search";
import {
  FEATURED_RESOURCES,
  RESOURCE_HUB_CATEGORIES,
} from "@/shared/texas-platform/resource-hub";

const canonical = "https://keeptxred.com/texas-data";

export const Route = createFileRoute("/texas-data")({
  head: () => ({
    meta: [
      { title: "Texas Resources: Guides, Tools & Trusted Information" },
      { name: "description", content: "Search and browse practical Texas guides, calculators, cities, counties, laws, bills, representatives and trusted resources from one place." },
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
            description: "A searchable hub for practical Texas guides, calculators, government information, cities, counties and trusted resources.",
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
          {
            "@type": "ItemList",
            name: "Texas resource categories",
            itemListElement: RESOURCE_HUB_CATEGORIES.map((category, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: category.title,
              url: `https://keeptxred.com${category.exploreHref}`,
            })),
          },
        ],
      }).replace(/</g, "\\u003c"),
    }],
  }),
  component: TexasResources,
});

function TexasResources() {
  return (
    <main>
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Resources</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Texas Resources</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary-foreground/80">
            Find practical information about Texas—from property taxes and elections to cities, counties, schools, and cost of living. Our guides, calculators, and interactive resources are designed to help Texans and future Texans quickly find reliable answers.
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
          description="Search everything from property taxes, Houston and homestead exemptions to representatives, school districts, Texas laws, bills, cities and calculators."
        />

        <section className="mt-14" aria-labelledby="resource-categories-title">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Browse by need</p>
            <h2 id="resource-categories-title" className="mt-2 font-display text-4xl">Start with a topic</h2>
            <p className="mt-3 text-muted-foreground">Each section brings the most useful guides, tools and related information together so you do not have to guess where to look.</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {RESOURCE_HUB_CATEGORIES.map(({ id, icon: Icon, title, description, links, exploreHref }) => (
              <article key={id} className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="size-7" /></div>
                  <div>
                    <h3 className="font-display text-3xl">{title}</h3>
                    <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {links.map((link) => (
                    <a key={`${id}-${link.href}`} href={link.href} className="rounded-lg border bg-background px-3 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">
                      {link.label}
                    </a>
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
            <p className="mt-3 text-muted-foreground">Go directly to the tools and guides visitors use most often.</p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_RESOURCES.map(({ title, description, href, icon: Icon }) => (
              <a key={title} href={href} className="group rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm">
                <Icon className="size-6 text-primary" />
                <h3 className="mt-4 font-display text-2xl group-hover:text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">Open resource <ArrowRight className="size-4" /></span>
              </a>
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
