import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPinned, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntityGrid } from "@/components/explore/EntityGrid";
import { getFeaturedCaverns } from "@/services/explore/cavern.functions";
import { getExploreLanding } from "@/services/explore/public.functions";
import { buildSeo } from "@/lib/seo";
import { geographyPath } from "@/lib/explore/geography-pages";

export const Route = createFileRoute("/explore/")({
  loader: async () => {
    const [landing, caverns] = await Promise.all([getExploreLanding(), getFeaturedCaverns()]);
    return { ...landing, caverns };
  },
  head: () => {
    const seo = buildSeo({
      title: "Explore Texas | Parks, Lakes, Caverns, Trails & Historic Places",
      description:
        "Discover published Texas parks, lakes, caverns, campgrounds, trails, wildlife areas, historic sites, and communities, then build a practical trip.",
      path: "/explore",
      type: "website",
      keywords:
        "Explore Texas, Texas parks, Texas lakes, Texas caverns, Texas caves, Texas camping, Texas trip planner",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: ExploreLanding,
});

function ExploreLanding() {
  const data = Route.useLoaderData();
  const destinationCount = data.featured.total;
  const sections = [
    {
      title: "Featured destinations",
      items: data.featured.items,
      search: { page: 1, pageSize: 24, sort: "relevance" as const },
    },
    {
      title: "Texas caverns and caves",
      items: data.caverns.items,
      href: "/explore/caverns" as const,
    },
    {
      title: "Popular lakes",
      items: data.lakes.items,
      search: { types: ["lake"], page: 1, pageSize: 24, sort: "relevance" as const },
    },
    {
      title: "Texas parks",
      items: data.parks.items,
      href: "/explore/texas-state-parks-guide" as const,
    },
    {
      title: "Camping destinations",
      items: data.camping.items,
      search: { activities: ["camping"], page: 1, pageSize: 24, sort: "relevance" as const },
    },
    {
      title: "Family-friendly Texas",
      items: data.family.items,
      search: { familyFriendly: true, page: 1, pageSize: 24, sort: "relevance" as const },
    },
  ];
  const regions = data.featured.facets.regions.slice(0, 12);
  const counties = data.featured.facets.counties.slice(0, 18);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Explore Texas",
    url: "https://keeptxred.com/explore",
    description:
      "Texas destination guides for parks, lakes, caverns, trails, wildlife areas, historic places, and communities.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: destinationCount,
      itemListElement: data.featured.items.map((item: any, index: number) => ({
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
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Explore Texas
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl leading-none md:text-7xl">
            Find your next Texas adventure.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Search {destinationCount.toLocaleString("en-US")} verified destination records, compare
            places, explore nearby options, and build a day trip or multi-day itinerary.
          </p>
          <form action="/explore/search" className="mt-8 flex max-w-2xl gap-2" role="search">
            <label htmlFor="explore-home-search" className="sr-only">
              Search Texas destinations
            </label>
            <input
              id="explore-home-search"
              name="q"
              className="h-12 flex-1 rounded-md border bg-background px-4"
              placeholder="Search lakes, parks, caverns, trails, cities…"
            />
            <Button type="submit" size="lg">
              <Search aria-hidden="true" /> Search
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/explore/search" search={{ page: 1, pageSize: 24, sort: "relevance" }}>
                <MapPinned />
                Browse all {destinationCount.toLocaleString("en-US")}
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
        <section aria-labelledby="plan-texas-adventure" className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="plan-texas-adventure" className="font-display text-3xl md:text-4xl">
              Plan a Texas trip by place and experience
            </h2>
            <div className="mt-4 space-y-4 font-serif text-lg leading-8">
              <p>
                Texas stretches from Gulf Coast beaches and Piney Woods forests to Hill Country
                rivers, Panhandle canyons, and the mountains of Big Bend. Explore Texas connects
                those landscapes through destination guides that make it easier to compare
                activities, amenities, access, and nearby stops before you travel.
              </p>
              <p>
                Browse by region for a multi-day route, use county guides to find places near a
                specific community, or start with an experience such as camping, hiking, paddling,
                wildlife watching, cavern tours, and Texas history. Always confirm current hours,
                fees, reservations, closures, and weather with the destination’s official source.
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/20 p-6">
            <h2 className="font-display text-2xl">Build a better itinerary</h2>
            <ol className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
              <li>
                <strong className="text-foreground">1. Choose an anchor.</strong> Start with a park,
                lake, cavern, historic place, or community.
              </li>
              <li>
                <strong className="text-foreground">2. Follow geographic links.</strong> Open its
                county and region guides to find compatible stops.
              </li>
              <li>
                <strong className="text-foreground">3. Verify conditions.</strong> Check official
                access, reservations, weather, water levels, and seasonal rules.
              </li>
            </ol>
          </div>
        </section>

        <section aria-labelledby="seasonal-guides" className="grid gap-6 md:grid-cols-3">
          <Link
            to="/explore/texas-wildflower-seasons"
            className="group overflow-hidden rounded-xl border bg-background transition-colors hover:border-primary"
          >
            <img
              src="/images/explore/texas-wildflower-guide-hero.svg"
              alt="Texas hills, bluebonnets, Indian paintbrush, and a spring road"
              className="aspect-[16/9] w-full object-cover"
              width="1600"
              height="900"
              loading="lazy"
            />
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Seasonal guide</p>
              <h2 id="seasonal-guides" className="mt-2 font-display text-3xl group-hover:text-primary">
                Texas wildflower seasons
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Plan around bluebonnet timing, regional bloom windows, scenic drives, photography,
                and responsible wildflower viewing.
              </p>
            </div>
          </Link>
          <Link
            to="/explore/texas-state-parks-guide"
            className="group rounded-xl border bg-muted/20 p-7 transition-colors hover:border-primary"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Planning guide</p>
            <h2 className="mt-2 font-display text-3xl group-hover:text-primary">Texas state parks</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Compare regions, seasons, camping styles, reservation needs, and nearby Explore Texas
              destinations.
            </p>
          </Link>
          <Link
            to="/explore/texas-scenic-drives"
            className="group overflow-hidden rounded-xl border bg-background transition-colors hover:border-primary"
          >
            <img
              src="/images/explore/texas-scenic-drives-hero.svg"
              alt="Texas highway through wildflowers, hills, and desert scenery"
              className="aspect-[16/9] w-full object-cover"
              width="1600"
              height="1000"
              loading="lazy"
            />
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Road-trip guide</p>
              <h2 className="mt-2 font-display text-3xl group-hover:text-primary">Texas scenic drives</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Build Hill Country, Big Bend, canyon, Piney Woods, and Gulf Coast road trips around
                real destinations and the right season.
              </p>
            </div>
          </Link>
        </section>

        {regions.length > 0 && (
          <section aria-labelledby="explore-regions">
            <h2 id="explore-regions" className="font-display text-3xl md:text-4xl">
              Explore Texas by region
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((region: string) => (
                <Link
                  key={region}
                  to={geographyPath("region", region)}
                  className="rounded-lg border p-4 font-semibold transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  {region}
                </Link>
              ))}
            </div>
          </section>
        )}

        {counties.length > 0 && (
          <section aria-labelledby="explore-counties">
            <h2 id="explore-counties" className="font-display text-3xl md:text-4xl">
              Explore Texas by county
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find parks, waterways, heritage sites, and attractions across Texas counties.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {counties.map((county: string) => (
                <Link
                  key={county}
                  to={geographyPath("county", county)}
                  className="rounded-full border px-4 py-2 text-sm hover:border-primary hover:text-primary"
                >
                  {county} County
                </Link>
              ))}
            </div>
          </section>
        )}

        {sections.map(
          ({ title, items, search, href }) =>
            items.length > 0 && (
              <section key={title} aria-labelledby={title.replaceAll(" ", "-")}>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <h2 id={title.replaceAll(" ", "-")} className="font-display text-3xl md:text-4xl">
                    {title}
                  </h2>
                  {href ? (
                    <Link to={href} className="text-sm font-semibold text-primary hover:underline">
                      Explore the guide
                    </Link>
                  ) : (
                    <Link
                      to="/explore/search"
                      search={search!}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      View all
                    </Link>
                  )}
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