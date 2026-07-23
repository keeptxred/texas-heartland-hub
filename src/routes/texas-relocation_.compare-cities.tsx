import { createFileRoute } from "@tanstack/react-router";
import {
  CITY_COMPARISON_PATH,
  CITY_RELOCATION_PATH,
  RELOCATION_CITIES,
} from "@/data/relocationCities";
import { RELOCATION_LAUNCH_PATH } from "@/data/relocationLaunch";

const BASE_URL = "https://www.keeptxred.com";
const COMPARISON_CALCULATOR_PATH = "/tools/texas-cost-of-living-comparison";

const SUGGESTED_PAIRS = [
  ["houston", "dallas"],
  ["austin", "san-antonio"],
  ["plano", "frisco"],
  ["houston", "katy"],
  ["austin", "georgetown"],
  ["dallas", "fort-worth"],
] as const;

// The checked-in route tree is refreshed by the TanStack build plugin.
// @ts-expect-error new file route is not present in the pre-build generated route tree
export const Route = createFileRoute("/texas-relocation/compare-cities")({
  head: () => ({
    meta: [
      { title: "Compare Texas Cities | Relocation Costs and Research Guides" },
      {
        name: "description",
        content:
          "Compare Texas cities using transparent cost-of-living, housing, commute, county, and official-source research before choosing an address.",
      },
      { property: "og:title", content: "Compare Texas Cities" },
      {
        property: "og:description",
        content:
          "Use consistent assumptions, city guides, county sources, and Texas relocation calculators to compare possible moves.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${BASE_URL}${CITY_COMPARISON_PATH}` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}${CITY_COMPARISON_PATH}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Compare Texas Cities",
          description:
            "A transparent Texas city comparison starting point using official local research and user-controlled calculator inputs.",
          url: `${BASE_URL}${CITY_COMPARISON_PATH}`,
          hasPart: SUGGESTED_PAIRS.map(([leftSlug, rightSlug]) => {
            const left = RELOCATION_CITIES.find((city) => city.slug === leftSlug);
            const right = RELOCATION_CITIES.find((city) => city.slug === rightSlug);
            return {
              "@type": "WebPageElement",
              name: `${left?.name ?? leftSlug} versus ${right?.name ?? rightSlug}`,
            };
          }),
        }),
      },
    ],
  }),
  component: CompareCitiesPage,
});

function CompareCitiesPage() {
  return (
    <main>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <a
            href={CITY_RELOCATION_PATH}
            className="text-xs font-bold uppercase tracking-widest text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Texas city guides
          </a>
          <h1 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
            Compare Texas Cities
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-white/75">
            Compare the same categories, time period, household assumptions, and commute pattern for every city. Then replace planning estimates with address-specific records and quotes.
          </p>
          <a
            href={COMPARISON_CALCULATOR_PATH}
            className="mt-7 inline-block border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Open cost-of-living comparison
          </a>
        </div>
      </section>

      <section aria-labelledby="comparison-method-heading" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="comparison-method-heading" className="font-display text-3xl tracking-tight">
          Use one comparison method
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Housing", "Use the same down payment, loan term, rent standard, home size, and maintenance assumptions."],
            ["Taxes and insurance", "Verify the exact address, taxing units, exemptions, flood exposure, and current insurance quote."],
            ["Utilities", "Compare the same electricity usage tier and include water, sewer, trash, internet, and recurring fees."],
            ["Transportation", "Model actual work locations, tolls, mileage, parking, vehicle wear, and travel time."],
          ].map(([heading, body]) => (
            <article key={heading} className="border border-border bg-card p-5">
              <h3 className="font-display text-xl">{heading}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="suggested-pairs-heading" className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 id="suggested-pairs-heading" className="font-display text-3xl tracking-tight">
            Suggested city pairs
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SUGGESTED_PAIRS.map(([leftSlug, rightSlug]) => {
              const left = RELOCATION_CITIES.find((city) => city.slug === leftSlug);
              const right = RELOCATION_CITIES.find((city) => city.slug === rightSlug);
              if (!left || !right) return null;
              return (
                <article key={`${left.slug}-${right.slug}`} className="border border-border bg-card p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {left.metro === right.metro ? `${left.metro} comparison` : "Cross-metro comparison"}
                  </p>
                  <h3 className="mt-2 font-display text-2xl">
                    {left.name} vs. {right.name}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <a
                      href={`${CITY_RELOCATION_PATH}/${left.slug}`}
                      className="font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {left.name} guide
                    </a>
                    <a
                      href={`${CITY_RELOCATION_PATH}/${right.slug}`}
                      className="font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                      {right.name} guide
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="research-next-heading" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="research-next-heading" className="font-display text-3xl tracking-tight">
          Continue the research
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <a href={CITY_RELOCATION_PATH} className="border border-border bg-card p-6 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            <h3 className="font-display text-xl">Browse city guides</h3>
            <p className="mt-2 text-sm text-muted-foreground">Review official city links, parent counties, calculators, and nearby launch cities.</p>
          </a>
          <a href={RELOCATION_LAUNCH_PATH} className="border border-border bg-card p-6 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            <h3 className="font-display text-xl">Open relocation center</h3>
            <p className="mt-2 text-sm text-muted-foreground">Use county hubs, evergreen guides, and the full Texas calculator collection.</p>
          </a>
          <a href={COMPARISON_CALCULATOR_PATH} className="border border-border bg-card p-6 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            <h3 className="font-display text-xl">Run the calculator</h3>
            <p className="mt-2 text-sm text-muted-foreground">Control the assumptions and compare recurring monthly costs consistently.</p>
          </a>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          City comparisons are general planning tools, not address-level findings. Verify current taxes, exemptions, schools, utilities, insurance, flood information, housing terms, and commute conditions before making a financial decision.
        </p>
      </section>
    </main>
  );
}
