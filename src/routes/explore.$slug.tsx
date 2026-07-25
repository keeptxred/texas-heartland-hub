import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ExternalLink, Printer, Route as RouteIcon } from "lucide-react";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { ExploreMap } from "@/components/explore/ExploreMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getExploreEntity, getExploreSlugTarget } from "@/services/explore/public.functions";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/$slug")({
  loader: async ({ params }) => {
    const entity = await getExploreEntity({ data: { slug: params.slug } });
    if (!entity) {
      const target = await getExploreSlugTarget({ data: { slug: params.slug } });
      if (target)
        throw redirect({ to: "/explore/$slug", params: { slug: target }, statusCode: 301 });
      throw notFound();
    }
    return entity;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const seo = buildSeo({
      title: `${loaderData.name} | Explore Texas`,
      description:
        loaderData.summary ||
        `Visitor information, activities, amenities, map, and official sources for ${loaderData.name}, Texas.`,
      path: `/explore/${loaderData.slug}`,
      image: loaderData.heroImageUrl || undefined,
      imageAlt: loaderData.heroImageAlt || loaderData.name,
      type: "article",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: ExploreEntityPage,
});

function JsonValue({ value }: { value: unknown }) {
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number") return <p>{String(value)}</p>;
  if (Array.isArray(value))
    return (
      <ul className="list-disc pl-5">
        {value.map((item, index) => (
          <li key={index}>{typeof item === "object" ? JSON.stringify(item) : String(item)}</li>
        ))}
      </ul>
    );
  if (typeof value === "object")
    return (
      <dl className="grid gap-2 sm:grid-cols-2">
        {Object.entries(value as Record<string, unknown>).map(
          ([key, item]) =>
            item != null && (
              <div key={key}>
                <dt className="font-semibold capitalize">{key.replaceAll("_", " ")}</dt>
                <dd className="text-muted-foreground">
                  <JsonValue value={item} />
                </dd>
              </div>
            ),
        )}
      </dl>
    );
  return null;
}

function ExploreEntityPage() {
  const entity = Route.useLoaderData();
  const placeSchema = {
    "@context": "https://schema.org",
    "@type": schemaType(entity.entityType),
    name: entity.name,
    description: entity.summary || undefined,
    image: entity.heroImageUrl || undefined,
    url: `https://www.keeptxred.com/explore/${entity.slug}`,
    geo:
      entity.latitude != null && entity.longitude != null
        ? {
            "@type": "GeoCoordinates",
            latitude: entity.latitude,
            longitude: entity.longitude,
          }
        : undefined,
    sameAs: entity.officialUrl ? [entity.officialUrl] : undefined,
  };
  const details = [
    ["Hours", entity.hours],
    ["Fees", entity.fees],
    ["Regulations", entity.regulations],
    ["Seasonal guidance", entity.seasonalGuidance],
  ] as const;
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema).replace(/</g, "\\u003c") }}
      />
      {entity.heroImageUrl && (
        <img
          src={entity.heroImageUrl}
          alt={entity.heroImageAlt || entity.name}
          width={1600}
          height={800}
          className="max-h-[34rem] w-full object-cover"
        />
      )}
      <article className="mx-auto max-w-6xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link to="/explore" className="hover:underline">
            Explore Texas
          </Link>{" "}
          / {entity.entityType.replaceAll("_", " ")} / {entity.name}
        </nav>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <Badge>{entity.entityType.replaceAll("_", " ")}</Badge>
            <h1 className="mt-3 font-display text-5xl leading-none md:text-7xl">{entity.name}</h1>
            {(entity.city || entity.county || entity.region) && (
              <p className="mt-3 text-lg text-muted-foreground">
                {[entity.city, entity.county && `${entity.county} County`, entity.region]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            {entity.summary && <p className="mt-6 text-xl leading-8">{entity.summary}</p>}
            {entity.description && (
              <div className="mt-8 whitespace-pre-line font-serif text-lg leading-8">
                {entity.description}
              </div>
            )}
            {entity.observations.length > 0 && (
              <section className="mt-10" aria-labelledby="current-conditions">
                <h2 id="current-conditions" className="font-display text-3xl">
                  Current conditions and advisories
                </h2>
                <div className="mt-4 space-y-3">
                  {entity.observations.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-primary/30 bg-primary/5 p-4"
                    >
                      <Badge variant="outline">{item.severity || item.observationType}</Badge>
                      <h3 className="mt-2 font-semibold">{item.title}</h3>
                      {item.description && <p className="mt-1 text-sm">{item.description}</p>}
                      {item.sourceUrl && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-sm text-primary hover:underline"
                        >
                          Observation source
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {Object.keys(entity.profile).length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-3xl">Visitor details</h2>
                <div className="mt-4">
                  <JsonValue value={entity.profile} />
                </div>
              </section>
            )}
            {details.map(
              ([title, value]) =>
                value != null && (
                  <section className="mt-10" key={title}>
                    <h2 className="font-display text-3xl">{title}</h2>
                    <div className="mt-4">
                      <JsonValue value={value} />
                    </div>
                  </section>
                ),
            )}
            {(entity.activities.length > 0 || entity.amenities.length > 0) && (
              <section className="mt-10 grid gap-8 sm:grid-cols-2">
                {entity.activities.length > 0 && (
                  <div>
                    <h2 className="font-display text-3xl">Activities</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entity.activities.map((item) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {entity.amenities.length > 0 && (
                  <div>
                    <h2 className="font-display text-3xl">Amenities</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entity.amenities.map((item) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
          <aside className="space-y-5">
            <ExploreMap entity={entity} />
            <div className="rounded-lg border p-5">
              <h2 className="font-semibold">Plan your visit</h2>
              <div className="mt-4 grid gap-2">
                <Button asChild>
                  <Link to="/explore/trip-planner" search={{ destination: entity.slug }}>
                    <RouteIcon />
                    Add to a trip
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer />
                  Print
                </Button>
                {entity.officialUrl && (
                  <Button asChild variant="outline">
                    <a href={entity.officialUrl} target="_blank" rel="noreferrer">
                      Official website <ExternalLink />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            {(entity.sourceName || entity.sourceUrl || entity.sourceUpdatedAt) && (
              <div className="rounded-lg border p-5 text-sm">
                <h2 className="font-semibold">Source and freshness</h2>
                {entity.sourceName && <p className="mt-2">{entity.sourceName}</p>}
                {entity.sourceUpdatedAt && (
                  <p className="text-muted-foreground">
                    Source updated {new Date(entity.sourceUpdatedAt).toLocaleDateString()}
                  </p>
                )}
                {entity.sourceUrl && (
                  <a
                    href={entity.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    View source
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>
        {entity.nearby.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-4xl">Nearby destinations</h2>
            <EntityGrid items={entity.nearby} />
          </section>
        )}
        {entity.related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-4xl">Related destinations</h2>
            <EntityGrid items={entity.related} />
          </section>
        )}
      </article>
    </main>
  );
}

function schemaType(type: string): string {
  if (type === "lake") return "BodyOfWater";
  if (type === "park") return "Park";
  if (type === "campground") return "Campground";
  if (type === "business") return "LocalBusiness";
  if (type === "city") return "City";
  return "TouristAttraction";
}
