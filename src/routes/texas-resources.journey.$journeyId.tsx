import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { collectionItemList, rankCollectionEntities } from "@/shared/texas-platform/collection-ranking";
import { SharedEntityCard } from "@/shared/texas-platform/entity-components";
import { entitiesForSite } from "@/shared/texas-platform/entities";
import { journeysForSite } from "@/shared/texas-platform/registry";

const SITE = "keeptxred" as const;

export const Route = createFileRoute("/texas-resources/journey/$journeyId")({
  loader: ({ params }) => {
    const journey = journeysForSite(SITE).find((item) => item.id === params.journeyId);
    if (!journey) throw notFound();
    const entities = rankCollectionEntities(
      entitiesForSite(SITE).filter((entity) => entity.journeys.includes(journey.id)),
      journey.resourceIds,
    );
    return { journey, entities };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const path = `/texas-resources/journey/${params.journeyId}`;
    const seo = buildSeo({
      title: `${loaderData.journey.title}: Texas Checklist, Tools & Resources`,
      description: loaderData.journey.description,
      path,
      type: "website",
    });
    const canonical = `${SITE_URL}${path}`;
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: loaderData.journey.title,
              description: loaderData.journey.description,
              url: canonical,
              isPartOf: { "@type": "CollectionPage", url: `${SITE_URL}/texas-living` },
              mainEntity: { "@id": `${canonical}#resources` },
            },
            { "@id": `${canonical}#resources`, ...collectionItemList(loaderData.entities, SITE_URL) },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Texas Living", item: `${SITE_URL}/texas-living` },
                { "@type": "ListItem", position: 3, name: loaderData.journey.title, item: canonical },
              ],
            },
          ],
        }).replace(/</g, "\\u003c"),
      }],
    };
  },
  component: JourneyResourcePage,
});

function JourneyResourcePage() {
  const { journey, entities } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/">Home</Link><span className="mx-2">/</span><Link to="/texas-living">Texas Living</Link><span className="mx-2">/</span><Link to="/texas-resources">Resources</Link><span className="mx-2">/</span><span>{journey.title}</span>
      </nav>
      <header className="mt-8 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start with your goal</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">{journey.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{journey.description}</p>
      </header>
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">Recommended next steps</h2>
          <span className="text-sm text-muted-foreground">{entities.length} resources</span>
        </div>
        {entities.length ? (
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entities.map((entity, index) => (
              <li key={entity.id} className="relative">
                <span className="absolute right-4 top-4 z-10 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">Step {index + 1}</span>
                <SharedEntityCard entity={entity} cta={index === 0 ? "Start here" : "Continue"} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed p-6 text-muted-foreground">More resources are being connected to this journey.</p>
        )}
      </section>
      <div className="mt-12 flex flex-wrap gap-3 border-t pt-8">
        <Link to="/texas-resources" className="rounded-md border px-4 py-2.5 text-sm font-bold hover:border-primary hover:text-primary">Browse all resources</Link>
        <Link to="/texas-living" className="rounded-md border px-4 py-2.5 text-sm font-bold hover:border-primary hover:text-primary">Back to Texas Living</Link>
      </div>
    </main>
  );
}
