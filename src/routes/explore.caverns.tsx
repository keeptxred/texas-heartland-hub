import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, MapPinned, Ticket } from "lucide-react";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { Button } from "@/components/ui/button";
import { getCavernLanding } from "@/services/explore/cavern.functions";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/caverns")({
  loader: () => getCavernLanding(),
  head: () => {
    const seo = buildSeo({
      title: "Texas Caverns and Caves | Tours, Tickets & Visitor Guides",
      description:
        "Explore Texas caverns and caves with guided-tour details, reservation guidance, accessibility information, maps, nearby attractions, and practical visitor tips.",
      path: "/explore/caverns",
      type: "website",
      keywords:
        "Texas caverns, Texas caves, caves in Texas, cavern tours Texas, guided cave tours, Texas underground attractions",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasCavernsPage,
});

const searchDefaults = { page: 1, pageSize: 24, sort: "relevance" as const };

function TexasCavernsPage() {
  const data = Route.useLoaderData();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Texas Caverns and Caves",
    description:
      "Visitor guides for commercial caverns and public cave attractions across Texas.",
    url: "https://keeptxred.com/explore/caverns",
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

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/explore" className="hover:text-primary hover:underline">
              Explore Texas
            </Link>{" "}
            / Texas caverns and caves
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Underground Texas
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">
            Texas caverns and caves
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Compare {data.total.toLocaleString("en-US")} published cavern destinations, review guided-tour
            requirements, check reservation guidance, and plan an underground Texas day trip with nearby
            attractions.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link
                to="/explore/search"
                search={{ ...searchDefaults, types: ["cavern"] }}
              >
                <MapPinned /> Browse cavern results
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore/trip-planner">
                <Compass /> Build a Texas trip
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <section aria-labelledby="cavern-planning">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border p-5">
              <Ticket className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl">Reserve ahead</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                {data.reservationRecommendedCount.toLocaleString("en-US")} listed destinations recommend
                advance reservations. Weekend, holiday, and school-break tours can fill quickly.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <Compass className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl">Prepare for cave conditions</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Wear closed-toe shoes with dependable traction. Underground routes may include stairs,
                slopes, narrow passages, damp surfaces, and cooler temperatures.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <MapPinned className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl">Check access details</h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Accessibility, pet, service-animal, and photography policies vary by cavern. Review each
                visitor guide and confirm current rules with the operator before traveling.
              </p>
            </div>
          </div>
        </section>

        {data.regions.length > 0 && (
          <section aria-labelledby="cavern-regions">
            <h2 id="cavern-regions" className="font-display text-3xl md:text-4xl">
              Explore caverns by Texas region
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {data.regions.map((region) => (
                <Link
                  key={region}
                  to="/explore/search"
                  search={{ ...searchDefaults, types: ["cavern"], regions: [region] }}
                  className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  {region} caverns
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="all-texas-caverns">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="all-texas-caverns" className="font-display text-3xl md:text-4xl">
                All Texas cavern guides
              </h2>
              <p className="mt-2 text-muted-foreground">
                Open a destination guide for tour length, admission, accessibility, pet rules,
                photography guidance, maps, and nearby places.
              </p>
            </div>
            <Link
              to="/explore/search"
              search={{ ...searchDefaults, types: ["cavern"] }}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Search and filter caverns
            </Link>
          </div>
          <EntityGrid items={data.items} />
        </section>
      </div>
    </main>
  );
}
