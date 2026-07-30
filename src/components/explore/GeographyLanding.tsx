import { Link } from "@tanstack/react-router";
import { Compass, MapPinned, Route as RouteIcon } from "lucide-react";
import { EntityGrid } from "./EntityGrid";
import { Button } from "@/components/ui/button";
import { geographyPath } from "@/lib/explore/geography-pages";
import type { ExploreGeographyPage } from "@/types/explore/public";

const searchDefaults = { page: 1, pageSize: 24, sort: "relevance" as const };

export function GeographyLanding({ data }: { data: ExploreGeographyPage }) {
  const label = data.kind === "county" ? `${data.name} County` : data.name;
  const otherKind = data.kind === "county" ? "region" : "county";
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Things to do in ${label}, Texas`,
    url: `https://keeptxred.com${geographyPath(data.kind, data.name)}`,
    about:
      data.kind === "county"
        ? { "@type": "AdministrativeArea", name: `${label}, Texas` }
        : { "@type": "Place", name: `${label}, Texas` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.total,
      itemListElement: data.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `https://keeptxred.com/explore/${item.slug}`,
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Explore Texas",
        item: "https://keeptxred.com/explore",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label,
        item: `https://keeptxred.com${geographyPath(data.kind, data.name)}`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([collectionSchema, breadcrumbSchema]).replace(/</g, "\\u003c"),
        }}
      />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/explore" className="hover:text-primary hover:underline">
              Explore Texas
            </Link>{" "}
            / {label}
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Texas {data.kind} guide
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">
            Things to do in {label}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Plan a trip around {data.total.toLocaleString("en-US")} published destinations in{" "}
            {label}. Compare parks, waterways, historic places, trails, caverns, wildlife areas, and
            visitor attractions, then connect the places that fit your route.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link
                to="/explore/search"
                search={{
                  ...searchDefaults,
                  [data.kind === "county" ? "counties" : "regions"]: [data.name],
                }}
              >
                <MapPinned /> Filter all results
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore/trip-planner">
                <RouteIcon /> Build a trip
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <section
          aria-labelledby="geography-overview"
          className="grid gap-8 lg:grid-cols-[1fr_340px]"
        >
          <div>
            <h2 id="geography-overview" className="font-display text-3xl md:text-4xl">
              Explore {label}
            </h2>
            <div className="mt-4 space-y-4 font-serif text-lg leading-8">
              <p>
                Use this guide as a starting point for discovering public lands, natural features,
                heritage sites, and visitor attractions across {label}. Each destination page brings
                together location details, activities, amenities, current source information, and
                nearby stops so you can build a realistic itinerary instead of a disconnected list.
              </p>
              <p>
                Before leaving, confirm operating hours, reservations, fees, weather, water
                conditions, closures, and access rules with the destination’s official source.
                Distances and services can vary considerably across Texas, so allow extra time
                between remote stops.
              </p>
            </div>
          </div>
          <aside className="rounded-lg border p-5">
            <Compass className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-semibold">What you can find</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {data.typeCounts.slice(0, 8).map(({ type, count }) => (
                <div key={type} className="flex justify-between gap-4 border-b pb-2 last:border-0">
                  <dt className="capitalize">{type.replaceAll("_", " ")}</dt>
                  <dd className="font-semibold">{count.toLocaleString("en-US")}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        {data.activities.length > 0 && (
          <section aria-labelledby="popular-activities">
            <h2 id="popular-activities" className="font-display text-3xl">
              Popular activities in {label}
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {data.activities.map((activity) => (
                <Link
                  key={activity}
                  to="/explore/search"
                  search={{
                    ...searchDefaults,
                    activities: [activity],
                    [data.kind === "county" ? "counties" : "regions"]: [data.name],
                  }}
                  className="rounded-full border px-4 py-2 text-sm capitalize hover:border-primary hover:text-primary"
                >
                  {activity}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="destinations-in-area">
          <h2 id="destinations-in-area" className="font-display text-3xl md:text-4xl">
            Destinations in {label}
          </h2>
          <p className="mb-6 mt-2 text-muted-foreground">
            Open a guide for visitor information, things to do, maps, planning notes, and related
            places.
          </p>
          <EntityGrid items={data.items} />
        </section>

        {data.nearbyGeographies.length > 0 && (
          <section aria-labelledby="related-geographies">
            <h2 id="related-geographies" className="font-display text-3xl">
              Explore by {otherKind}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.nearbyGeographies.map(({ name, count }) => (
                <Link
                  key={name}
                  to={geographyPath(otherKind, name)}
                  className="rounded-lg border p-4 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <span className="font-semibold">
                    {otherKind === "county" ? `${name} County` : name}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {count} destination{count === 1 ? "" : "s"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
