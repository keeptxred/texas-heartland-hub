import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { collectionItemList, rankCollectionEntities } from "@/shared/texas-platform/collection-ranking";
import { SharedEntityCard } from "@/shared/texas-platform/entity-components";
import { entitiesForSite, type SharedEntityType } from "@/shared/texas-platform/entities";
import { topicsForSite } from "@/shared/texas-platform/registry";

const SITE = "keeptxred" as const;
const TYPE_LABELS: Partial<Record<SharedEntityType, string>> = {
  calculator: "Calculators & Tools",
  guide: "Guides",
  representative: "Representatives",
  bill: "Bills",
  committee: "Committees",
  city: "Cities",
  county: "Counties",
  park: "Parks",
  "school-district": "School Districts",
  agency: "Agencies",
  resource: "More Resources",
};

export const Route = createFileRoute("/texas-resources/topic/$topicId")({
  loader: ({ params }) => {
    const topic = topicsForSite(SITE).find((item) => item.id === params.topicId);
    if (!topic) throw notFound();
    const entities = rankCollectionEntities(
      entitiesForSite(SITE).filter((entity) => entity.topics.includes(topic.id)),
      topic.resourceIds,
    );
    const groups = Object.entries(
      entities.reduce<Record<string, typeof entities>>((result, entity) => {
        (result[entity.type] ??= []).push(entity);
        return result;
      }, {}),
    );
    return { topic, entities, groups };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const path = `/texas-resources/topic/${params.topicId}`;
    const seo = buildSeo({
      title: `${loaderData.topic.title}: Texas Guides, Tools & Resources`,
      description: loaderData.topic.description,
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
              name: loaderData.topic.title,
              description: loaderData.topic.description,
              url: canonical,
              isPartOf: { "@type": "CollectionPage", url: `${SITE_URL}/texas-resources` },
              mainEntity: { "@id": `${canonical}#resources` },
            },
            { "@id": `${canonical}#resources`, ...collectionItemList(loaderData.entities, SITE_URL) },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Texas Living", item: `${SITE_URL}/texas-living` },
                { "@type": "ListItem", position: 3, name: "Resources", item: `${SITE_URL}/texas-resources` },
                { "@type": "ListItem", position: 4, name: loaderData.topic.title, item: canonical },
              ],
            },
          ],
        }).replace(/</g, "\\u003c"),
      }],
    };
  },
  component: TopicResourcePage,
});

function TopicResourcePage() {
  const { topic, entities, groups } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/">Home</Link><span className="mx-2">/</span><Link to="/texas-living">Texas Living</Link><span className="mx-2">/</span><Link to="/texas-resources">Resources</Link><span className="mx-2">/</span><span>{topic.title}</span>
      </nav>
      <header className="mt-8 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Browse by topic</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">{topic.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{topic.description}</p>
      </header>
      {entities.length ? (
        <div className="mt-10 space-y-12">
          {groups.map(([type, groupEntities]) => (
            <section key={type}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-display text-3xl">{TYPE_LABELS[type as SharedEntityType] ?? "Resources"}</h2>
                <span className="text-sm text-muted-foreground">{groupEntities.length} available</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupEntities.map((entity) => <SharedEntityCard key={entity.id} entity={entity} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-xl border border-dashed p-6 text-muted-foreground">More resources are being connected to this topic.</p>
      )}
      <div className="mt-12 flex flex-wrap gap-3 border-t pt-8">
        <Link to="/texas-resources" className="rounded-md border px-4 py-2.5 text-sm font-bold hover:border-primary hover:text-primary">Browse all resources</Link>
        <Link to="/texas-living" className="rounded-md border px-4 py-2.5 text-sm font-bold hover:border-primary hover:text-primary">Back to Texas Living</Link>
      </div>
    </main>
  );
}
