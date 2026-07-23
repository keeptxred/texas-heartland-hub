import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCalculatorBySlug } from "@/data/calculators";
import { CITY_RELOCATION_PATH, RELOCATION_CITIES, getRelocationCityBySlug } from "@/data/relocationCities";
import { RELOCATION_LAUNCH_PATH, getLaunchCountyBySlug } from "@/data/relocationLaunch";

const BASE_URL = "https://www.keeptxred.com";

// The checked-in route tree is refreshed by the TanStack build plugin.
// @ts-expect-error new file route is not present in the pre-build generated route tree
export const Route = createFileRoute("/texas-relocation/cities/$city")({
  loader: ({ params }) => {
    const routeParams = params as unknown as { city: string };
    const city = getRelocationCityBySlug(routeParams.city);
    if (!city) throw notFound();
    const county = getLaunchCountyBySlug(city.parentCountySlug);
    if (!county) throw notFound();
    return { city, county };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { city } = loaderData;
    const url = `${BASE_URL}${CITY_RELOCATION_PATH}/${city.slug}`;
    const title = `${city.name} Relocation Guide | Costs, County & Moving Tools`;
    const description = `Plan a move to ${city.name}, Texas with its parent county guide, official city sources, and calculators for housing, cost of living, and commuting.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description,
          url,
          about: { "@type": "City", name: city.name, containedInPlace: { "@type": "State", name: "Texas" } },
          citation: [city.officialCityUrl],
        }),
      }],
    };
  },
  component: CityRelocationHub,
});

function CityRelocationHub() {
  const { city, county } = Route.useLoaderData();
  const siblingCities = RELOCATION_CITIES.filter((candidate) => candidate.metro === city.metro && candidate.slug !== city.slug);

  return (
    <main>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <a href={CITY_RELOCATION_PATH} className="text-xs font-bold uppercase tracking-widest text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Texas city guides</a>
          <h1 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">Moving to {city.name}, Texas</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/75">A practical research hub for the {city.metro} area. Replace planning estimates with address-specific tax, insurance, utility, school, housing, and commute information before making a decision.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Plan the full monthly cost</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">A city name does not identify the exact taxing units, school assignment, utility provider, flood exposure, commute, or insurance cost for a property. Use these tools for comparisons, then verify the exact address.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {city.calculatorPaths.map((path) => {
              const calculator = getCalculatorBySlug(path);
              return (
                <a key={path} href={path} className="border border-border bg-card p-5 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  <h3 className="font-display text-xl">{calculator?.title ?? "Texas planning calculator"}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{calculator?.description ?? "Compare Texas relocation costs with transparent inputs."}</p>
                </a>
              );
            })}
          </div>
        </div>

        <aside aria-label={`${city.name} official and county sources`} className="space-y-5">
          <div className="border border-border bg-muted p-5">
            <h2 className="font-display text-xl">Local relationship</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="font-semibold">Metro</dt><dd className="text-muted-foreground">{city.metro}</dd></div>
              <div><dt className="font-semibold">Launch county</dt><dd className="text-muted-foreground">{county.name}</dd></div>
              <div><dt className="font-semibold">Data policy</dt><dd className="text-muted-foreground">Official links plus planning context; no local estimate is presented as exact.</dd></div>
            </dl>
          </div>
          <div className="border border-border bg-card p-5">
            <h2 className="font-display text-xl">Official sources</h2>
            <div className="mt-4 space-y-3 text-sm">
              <a href={city.officialCityUrl} target="_blank" rel="noreferrer" className="block font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Official City of {city.name} website</a>
              <a href={`${RELOCATION_LAUNCH_PATH}/${county.slug}`} className="block font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Open {county.name} relocation guide</a>
            </div>
          </div>
        </aside>
      </section>

      <section aria-labelledby="verify-heading" className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 id="verify-heading" className="font-display text-3xl tracking-tight">Verify before choosing an address</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["Exact taxing units and exemptions", "Insurance and flood exposure", "Utility provider and all-in rates", "Commute time, tolls, and vehicle cost"].map((item) => (
              <div key={item} className="border border-border bg-card p-4 text-sm font-semibold">{item}</div>
            ))}
          </div>
        </div>
      </section>

      {siblingCities.length > 0 && (
        <nav aria-label={`Other ${city.metro} city guides`} className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-3xl tracking-tight">Compare nearby launch cities</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {siblingCities.map((candidate) => (
              <a key={candidate.slug} href={`${CITY_RELOCATION_PATH}/${candidate.slug}`} className="border border-border bg-card px-4 py-3 text-sm font-semibold hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{candidate.name}</a>
            ))}
          </div>
        </nav>
      )}
    </main>
  );
}
