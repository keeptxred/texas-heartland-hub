import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { SharedEntityCard } from "@/shared/texas-platform/entity-components";
import { entitiesForSite, type SharedEntityType } from "@/shared/texas-platform/entities";

const SITE = "keeptxred" as const;

const TYPE_LABELS: Record<SharedEntityType, string> = {
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

function isEntityType(value: string): value is SharedEntityType {
  return value in TYPE_LABELS;
}

export const Route = createFileRoute("/texas-resources/type/$type")({
  loader: ({ params }) => {
    if (!isEntityType(params.type)) throw notFound();
    const entities = entitiesForSite(SITE)
      .filter((entity) => entity.type === params.type)
      .sort((a, b) => a.title.localeCompare(b.title));
    if (!entities.length) throw notFound();
    return { type: params.type, label: TYPE_LABELS[params.type], entities };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const path = `/texas-resources/type/${params.type}`;
    const description = `Browse all ${loaderData.label.toLowerCase()} available in the KeepTXRed Texas resource directory.`;
    const seo = buildSeo({
      title: `${loaderData.label}: Texas Resource Directory`,
      description,
      path,
      type: "website",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: loaderData.label,
          description,
          url: `${SITE_URL}${path}`,
          numberOfItems: loaderData.entities.length,
          isPartOf: { "@type": "CollectionPage", url: `${SITE_URL}/texas-resources` },
        }).replace(/</g, "\\u003c"),
      }],
    };
  },
  component: ResourceTypePage,
});

function ResourceTypePage() {
  const { label, entities } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/">Home</Link><span className="mx-2">/</span><Link to="/texas-living">Texas Living</Link><span className="mx-2">/</span><Link to="/texas-resources">Resources</Link><span className="mx-2">/</span><span>{label}</span>
      </nav>
      <header className="mt-8 max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas resource directory</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">{label}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Browse all {entities.length} available entries in this section.</p>
      </header>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => <SharedEntityCard key={entity.id} entity={entity} />)}
      </div>
    </main>
  );
}
