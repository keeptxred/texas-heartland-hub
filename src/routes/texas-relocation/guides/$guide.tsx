import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCalculatorBySlug } from "@/data/calculators";
import {
  LAUNCH_COUNTIES,
  RELOCATION_LAUNCH_PATH,
  getLaunchGuideBySlug,
} from "@/data/relocationLaunch";

const BASE_URL = "https://www.keeptxred.com";

const GUIDE_SECTIONS: Record<string, { heading: string; body: string }[]> = {
  "texas-property-tax-guide": [
    { heading: "Start with the exact taxing units", body: "A Texas property-tax bill can include county, city, school district, hospital, college, emergency-services, MUD, PID, and other local charges. Confirm the taxing units for the specific address before relying on an estimate." },
    { heading: "Separate market value from taxable value", body: "Appraisal value, homestead caps, exemptions, and local-option exemptions can produce different taxable values for different taxing units. Use the appraisal notice and tax statement as the controlling local documents." },
    { heading: "Review exemptions and deadlines", body: "Eligible homeowners should confirm residence-homestead, age-65, disability, and disabled-veteran rules with the appraisal district. Filing requirements and protest deadlines should be verified locally each year." },
  ],
  "moving-to-texas-guide": [
    { heading: "Build a complete arrival budget", body: "Include moving costs, deposits, utility setup, vehicle registration, insurance changes, temporary lodging, first-month housing, and an emergency reserve rather than comparing rent or mortgage payments alone." },
    { heading: "Compare counties before neighborhoods", body: "County-level differences affect appraisal administration, flood resources, courts, roads, public services, and some fees. After selecting a county, compare the exact city, school district, commute, and utility territory." },
    { heading: "Verify time-sensitive requirements", body: "Vehicle, driver-license, voter-registration, school-enrollment, and utility requirements can change. Confirm current instructions with the responsible Texas or local agency before acting." },
  ],
  "texas-cost-of-living-guide": [
    { heading: "Compare the full monthly budget", body: "Housing is only one part of a Texas cost comparison. Include property taxes or rent, insurance, electricity, water, transportation, tolls, childcare, healthcare, internet, and recurring neighborhood fees." },
    { heading: "Model seasonal utility costs", body: "Texas electricity use can vary sharply by season and home characteristics. Compare Electricity Facts Label all-in prices at the same usage tier and retain a summer reserve in the monthly budget." },
    { heading: "Use local inputs instead of statewide averages", body: "Costs differ across metros, counties, cities, utility territories, and individual properties. Treat broad averages as screening tools and replace them with quotes and official local records before making a decision." },
  ],
  "choosing-a-texas-county": [
    { heading: "Define the daily travel area", body: "Start with employment locations, school or childcare needs, medical access, and likely commute corridors. A lower housing price can be offset by tolls, fuel, time, and vehicle wear." },
    { heading: "Check address-level risks", body: "Flood exposure, drainage, insurance availability, taxing units, utilities, and school assignments are address-specific. County pages should be the beginning of due diligence, not the final answer." },
    { heading: "Compare public sources consistently", body: "Use the same period and definition when comparing housing, population, crime, schools, and taxes. Reporting coverage and boundaries can differ, so document the source and effective date for every major comparison." },
  ],
};

type Calculator = NonNullable<ReturnType<typeof getCalculatorBySlug>>;

export const Route = createFileRoute("/texas-relocation/guides/$guide")({
  loader: ({ params }) => {
    const guide = getLaunchGuideBySlug(params.guide);
    if (!guide) throw notFound();
    return guide;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `${BASE_URL}${RELOCATION_LAUNCH_PATH}/guides/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} | Keep TX Red` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: loaderData.title,
          description: loaderData.description,
          url,
          publisher: { "@type": "Organization", name: "Keep TX Red", url: BASE_URL },
        }),
      }],
    };
  },
  component: RelocationGuidePage,
});

function RelocationGuidePage() {
  const guide = Route.useLoaderData();
  const sections = GUIDE_SECTIONS[guide.slug] ?? [];
  const calculators = guide.relatedCalculatorPaths
    .map((path: string) => getCalculatorBySlug(path))
    .filter((calculator): calculator is Calculator => Boolean(calculator));

  return (
    <main>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <a href={RELOCATION_LAUNCH_PATH} className="text-xs font-bold uppercase tracking-widest text-accent">Texas relocation center</a>
          <h1 className="mt-3 font-display text-4xl tracking-tight md:text-6xl">{guide.title}</h1>
          <p className="mt-5 max-w-3xl text-white/75">{guide.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12" aria-labelledby="guide-sections-heading">
        <h2 id="guide-sections-heading" className="sr-only">Planning topics</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <article key={section.heading} className="border border-border bg-card p-6">
              <h3 className="font-display text-2xl">{section.heading}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>

        <section className="mt-12" aria-labelledby="planning-tools-heading">
          <h2 id="planning-tools-heading" className="font-display text-3xl">Use these planning tools</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {calculators.map((calculator) => (
              <a key={calculator.slug} href={calculator.slug} className="border border-border bg-card p-5 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <h3 className="font-display text-xl">{calculator.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{calculator.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12 border border-border bg-muted p-6" aria-labelledby="county-guides-heading">
          <h2 id="county-guides-heading" className="font-display text-2xl">Explore the initial county guides</h2>
          <nav aria-label="Texas county relocation guides" className="mt-4 flex flex-wrap gap-3">
            {LAUNCH_COUNTIES.map((county) => (
              <a key={county.slug} href={`${RELOCATION_LAUNCH_PATH}/${county.slug}`} className="border border-border bg-background px-3 py-2 text-sm hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {county.name}
              </a>
            ))}
          </nav>
        </section>

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">This guide is for general planning and education. Verify current legal, tax, insurance, school, utility, and property information with the responsible agency or qualified professional before making a financial decision.</p>
      </section>
    </main>
  );
}
