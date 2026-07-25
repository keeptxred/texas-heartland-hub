import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPinned, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { getExploreLanding } from "@/services/explore/public.functions";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/explore/")({
  loader: () => getExploreLanding(),
  head: () => {
    const seo = buildSeo({
      title: "Explore Texas | Parks, Lakes, Trails & Historic Places",
      description:
        "Discover published Texas parks, lakes, campgrounds, trails, wildlife areas, historic sites, and communities, then build a practical trip.",
      path: "/explore",
      type: "website",
      keywords: "Explore Texas, Texas parks, Texas lakes, Texas camping, Texas trip planner",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: ExploreLanding,
});

function ExploreLanding() {
  const data = Route.useLoaderData();
  const sections = [
    ["Featured destinations", data.featured.items],
    ["Popular lakes", data.lakes.items],
    ["Texas parks", data.parks.items],
    ["Camping destinations", data.camping.items],
    ["Family-friendly Texas", data.family.items],
  ] as const;
  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Explore Texas
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">
            Find your next Texas adventure.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Search verified destination records, compare places, explore nearby options, and build a
            day trip or multi-day itinerary.
          </p>
          <form action="/explore/search" className="mt-8 flex max-w-2xl gap-2" role="search">
            <label htmlFor="explore-home-search" className="sr-only">
              Search Texas destinations
            </label>
            <input
              id="explore-home-search"
              name="q"
              className="h-12 flex-1 rounded-md border bg-background px-4"
              placeholder="Search lakes, parks, trails, cities…"
            />
            <Button type="submit" size="lg">
              <Search aria-hidden="true" /> Search
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/explore/search" search={{ page: 1, pageSize: 24, sort: "relevance" }}>
                <MapPinned />
                Browse all
              </Link>
            </Button>
            <Button asChild>
              <Link to="/explore/trip-planner">
                <RouteIcon />
                Plan a trip
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        {sections.map(
          ([title, items]) =>
            items.length > 0 && (
              <section key={title} aria-labelledby={title.replaceAll(" ", "-")}>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <h2 id={title.replaceAll(" ", "-")} className="font-display text-3xl md:text-4xl">
                    {title}
                  </h2>
                  <Link
                    to="/explore/search"
                    search={{ page: 1, pageSize: 24, sort: "relevance" }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <EntityGrid items={items} />
              </section>
            ),
        )}
        {!data.featured.items.length && (
          <section className="rounded-lg border border-dashed p-10 text-center">
            <h2 className="font-display text-3xl">Destination records are being prepared</h2>
            <p className="mt-2 text-muted-foreground">
              Published Explore Texas destinations will appear here automatically after editorial
              review.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
