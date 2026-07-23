import { createFileRoute } from "@tanstack/react-router";
import { CITY_COMPARISON_PATH, CITY_RELOCATION_PATH, RELOCATION_CITIES } from "@/data/relocationCities";
import { RELOCATION_LAUNCH_PATH } from "@/data/relocationLaunch";

const BASE_URL = "https://www.keeptxred.com";

// The checked-in route tree is refreshed by the TanStack build plugin.
// @ts-expect-error new file route is not present in the pre-build generated route tree
export const Route = createFileRoute("/texas-relocation/cities")({
  head: () => ({
    meta: [
      { title: "Texas City Relocation Guides | Compare Costs and Plan a Move" },
      { name: "description", content: "Explore practical relocation guides for ten Texas cities with parent county links, official municipal sources, and transparent planning calculators." },
      { property: "og:title", content: "Texas City Relocation Guides" },
      { property: "og:description", content: "Compare Texas cities and connect local research with county guides and relocation calculators." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}${CITY_RELOCATION_PATH}` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}${CITY_RELOCATION_PATH}` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Texas City Relocation Guides",
        url: `${BASE_URL}${CITY_RELOCATION_PATH}`,
        hasPart: RELOCATION_CITIES.map((city) => ({
          "@type": "WebPage",
          name: `${city.name} Relocation Guide`,
          url: `${BASE_URL}${CITY_RELOCATION_PATH}/${city.slug}`,
        })),
      }),
    }],
  }),
  component: CityDirectoryPage,
});

function CityDirectoryPage() {
  return (
    <main>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <a href={RELOCATION_LAUNCH_PATH} className="text-xs font-bold uppercase tracking-widest text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Texas relocation center</a>
          <h1 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">Texas City Relocation Guides</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/75">Start with a city, connect it to the correct county, and use transparent calculators before replacing estimates with address-specific quotes and official local records.</p>
          <a href={CITY_COMPARISON_PATH} className="mt-7 inline-block border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Compare Texas cities</a>
        </div>
      </section>

      <section aria-labelledby="city-directory-heading" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="city-directory-heading" className="font-display text-3xl tracking-tight">Initial city coverage</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RELOCATION_CITIES.map((city) => (
            <article key={city.slug} className="border border-border bg-card p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{city.metro} area</p>
              <h3 className="mt-2 font-display text-2xl">{city.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Review the parent county, official city resources, housing and commute tools, and the local questions to verify before moving.</p>
              <a href={`${CITY_RELOCATION_PATH}/${city.slug}`} className="mt-5 inline-block font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Open {city.name} guide</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
