import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { SharedEntityCard } from "@/shared/texas-platform/entity-components";
import { entitiesForSite, type SharedEntityType } from "@/shared/texas-platform/entities";
import { SharedResourceSearch } from "@/shared/texas-platform/search";

const SITE = "keeptxred" as const;
const TYPE_ORDER: SharedEntityType[] = [
  "calculator",
  "guide",
  "representative",
  "bill",
  "committee",
  "city",
  "county",
  "park",
  "school-district",
  "agency",
  "resource",
];

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

function TexasResourcesPage() {
  const entities = entitiesForSite(SITE);
  const groups = TYPE_ORDER.map((type) => ({
    type,
    entities: entities.filter((entity) => entity.type === type),
  })).filter((group) => group.entities.length > 0);

  return (
    <main>
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Texas Living</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl tracking-tight sm:text-6xl">Browse all Texas resources</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary-foreground/80">
            Search and browse practical tools, guides, representatives, legislation and connected Texas information from one place.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <Link to="/">Home</Link><span className="mx-2">/</span><Link to="/texas-living">Texas Living</Link><span className="mx-2">/</span><span>All Resources</span>
        </nav>

        <SharedResourceSearch site={SITE} title="Search all Texas resources" />

        <div className="mt-14 space-y-14">
          {groups.map((group) => (
            <section key={group.type} id={group.type} className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-3xl">{TYPE_LABELS[group.type]}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{group.entities.length} available</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.entities.slice(0, 18).map((entity) => (
                  <SharedEntityCard key={entity.id} entity={entity} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/texas-resources")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Resources: Guides, Tools, Bills & Representatives",
      description: "Browse Texas guides, calculators, representatives, legislation and practical resources from one searchable directory.",
      path: "/texas-resources",
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
          name: "Texas Resources",
          url: `${SITE_URL}/texas-resources`,
          isPartOf: { "@type": "WebSite", url: SITE_URL },
        }).replace(/</g, "\\u003c"),
      }],
    };
  },
  component: TexasResourcesPage,
});
