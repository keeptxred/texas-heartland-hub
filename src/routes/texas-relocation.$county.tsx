import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCalculatorBySlug } from "@/data/calculators";
import { LAUNCH_GUIDES, RELOCATION_LAUNCH_PATH, getLaunchCountyBySlug } from "@/data/relocationLaunch";

const BASE_URL = "https://www.keeptxred.com";

// The checked-in route tree is refreshed by the TanStack build plugin.
// @ts-expect-error new file route is not present in the pre-build generated route tree
export const Route = createFileRoute("/texas-relocation/$county")({
  loader: ({ params }) => {
    const routeParams = params as unknown as { county: string };
    const county = getLaunchCountyBySlug(routeParams.county);
    if (!county) throw notFound();
    return county;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `${BASE_URL}${RELOCATION_LAUNCH_PATH}/${loaderData.slug}`;
    const title = `${loaderData.name} Relocation Guide | Taxes, Housing & Moving Tools`;
    const description = `Plan a move to ${loaderData.name} in the ${loaderData.metro} area with official county sources and calculators for property taxes, mortgages, and cost of living.`;
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
          about: { "@type": "AdministrativeArea", name: loaderData.name, containedInPlace: { "@type": "State", name: "Texas" } },
          citation: [loaderData.officialCountyUrl, loaderData.appraisalDistrictUrl],
        }),
      }],
    };
  },
  component: CountyRelocationHub,
});

function CountyRelocationHub() {
  const county = Route.useLoaderData();
  return (
    <main>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <a className="text-xs font-bold uppercase tracking-widest text-accent" href={RELOCATION_LAUNCH_PATH}>← Texas relocation center</a>
          <h1 className="mt-4 font-display text-5xl leading-none tracking-tight md:text-6xl">{county.name.toUpperCase()} RELOCATION GUIDE</h1>
          <p className="mt-5 max-w-3xl text-lg text-white/75">A practical starting point for moving to the {county.metro} area. Verify parcel-specific taxes, taxing units, exemptions, insurance, utilities, commute, and school information before making a financial decision.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Plan with exact local information</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{county.name} includes multiple cities, school districts, and special taxing districts. County-wide averages cannot produce an exact property-tax bill. Use the appraisal district and county links to identify the property’s actual jurisdictions, then enter those values below.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {county.calculatorPaths.map((path: string) => {
              const calculator = getCalculatorBySlug(path);
              return <a key={path} href={path} className="border border-border bg-card p-5 hover:border-primary">
                <h3 className="font-display text-xl">{calculator?.title ?? "Texas planning calculator"}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{calculator?.description ?? "Use exact local inputs to estimate your Texas relocation costs."}</p>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Open calculator →</span>
              </a>;
            })}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="border border-border bg-muted p-5">
            <h2 className="font-display text-xl">County snapshot</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="font-semibold">Metro area</dt><dd className="text-muted-foreground">{county.metro}</dd></div>
              <div><dt className="font-semibold">County seat</dt><dd className="text-muted-foreground">{county.countySeat}</dd></div>
              <div><dt className="font-semibold">Tax-rate policy</dt><dd className="text-muted-foreground">Exact local entry required; no stale county average is preloaded.</dd></div>
            </dl>
          </div>
          <div className="border border-border bg-card p-5">
            <h2 className="font-display text-xl">Official sources</h2>
            <div className="mt-4 space-y-3 text-sm">
              <a className="block font-semibold text-primary underline" href={county.officialCountyUrl} target="_blank" rel="noreferrer">Official {county.name} website</a>
              <a className="block font-semibold text-primary underline" href={county.appraisalDistrictUrl} target="_blank" rel="noreferrer">County appraisal district</a>
            </div>
          </div>
        </aside>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-3xl tracking-tight">Recommended research checklist</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["Confirm exact taxing units and exemptions", "Compare insurance and flood exposure", "Price electricity and utility service", "Test commute costs and travel time"].map((item) => <div key={item} className="border border-border bg-card p-4 text-sm font-semibold">{item}</div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-3xl tracking-tight">Related Texas relocation guides</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {LAUNCH_GUIDES.map((guide) => <article key={guide.slug} className="border-l-4 border-primary bg-muted p-5">
            <h3 className="font-display text-xl">{guide.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{guide.description}</p>
          </article>)}
        </div>
      </section>
    </main>
  );
}
