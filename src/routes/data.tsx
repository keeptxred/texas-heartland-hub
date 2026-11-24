import { createFileRoute } from "@tanstack/react-router";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const ALL_DATA_SETS = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
const INDEXABLE_DATA_SETS = ALL_DATA_SETS.filter(isDataDetailIndexable);
const SOURCE_PATHS = [
  { title: "Property taxes and school district rates", answer: "For a specific home, use the local appraisal district and adopted taxing-unit rates. For statewide comparisons, the Comptroller reports values, rates and levies. TEA's maximum compressed school tax rate is only one part of the adopted school rate.", source: "Texas Comptroller — tax rates and levies", url: "https://comptroller.texas.gov/taxes/property-tax/rates/", related: "2026 school tax lookup and estimator", href: "/news/isd-tax-burdens" },
  { title: "State budget, expenditures and bill costs", answer: "Start with the General Appropriations Act for spending authority, then examine actual expenditures and the relevant fiscal period. A fiscal note estimates a bill's fiscal impact; it is neither proof of passage nor an actual payment.", source: "Legislative Budget Board — budget information", url: "https://lbb.texas.gov/budget.aspx", related: "How to read a Texas fiscal note", href: "/texas-government/reference/texas-bill-fiscal-notes" },
  { title: "Texas election returns and registration", answer: "Identify the election date, office, geography and reporting stage. The Secretary of State maintains statewide results and registration history. Local canvasses may come from counties or the subdivision that held the election.", source: "Secretary of State — election results and data", url: "https://www.sos.state.tx.us/elections/historical/index.shtml", related: "County election offices", href: "/county-elections" },
  { title: "Electricity supply, demand and reliability", answer: "ERCOT publishes grid conditions, demand forecasts and historical system information. Record the observation timestamp and units; an hourly forecast is not actual load, and ERCOT data does not describe every electric system in Texas.", source: "ERCOT — grid information", url: "https://www.ercot.com/gridinfo", related: "Texas grid and ERCOT explained", href: "/news/texas-grid-ercot-explained" },
];
const TITLE = "Texas Data Center | Taxes, Budget, Elections, Energy & More";
const DESCRIPTION = "Keep TX Red's permanent directory of authoritative Texas datasets for property taxes, state spending, elections, demographics, energy, water, public safety, contracts, and agency rules.";

export const Route = createFileRoute("/data")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/data" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify(webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/data", type: "CollectionPage" })) },
      ...(INDEXABLE_DATA_SETS.length > 0 ? [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Reviewed Texas data guides", numberOfItems: INDEXABLE_DATA_SETS.length, itemListElement: INDEXABLE_DATA_SETS.map((dataset, index) => ({ "@type": "ListItem", position: index + 1, name: dataset.title, url: `${SITE_URL}/data/${dataset.slug}` })) }) }] : []),
    ] };
  },
  component: DataHub,
});

function DataHub() {
  return <main className="bg-background">
    <section className="border-b bg-secondary text-secondary-foreground"><div className="mx-auto max-w-[1180px] px-6 py-16 md:py-20"><p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Keep TX Red Data Desk</p><h1 className="mt-4 max-w-5xl font-display text-5xl leading-none tracking-tight md:text-7xl">Texas Data Center</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">Find official Texas public records, understand what each dataset measures and check its limitations before drawing conclusions.</p><p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">This directory connects readers to primary public records and separately reviewed reference guides. It does not claim to host a live copy of every underlying dataset.</p></div></section>
    <section className="mx-auto max-w-[1180px] px-6 py-12" aria-labelledby="official-data-start">
      <h2 id="official-data-start" className="font-display text-3xl">Where to find Texas public data</h2>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">Choose the record that answers your question. Statewide tables are useful for comparisons, while the responsible local office often holds the controlling record for an individual property, election or decision.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">{SOURCE_PATHS.map(item => <article key={item.title} className="rounded-xl border bg-card p-6"><h3 className="font-display text-2xl">{item.title}</h3><p className="mt-3 leading-7">{item.answer}</p><a className="mt-4 block font-semibold text-primary underline" href={item.url}>{item.source}</a><a className="mt-2 block text-sm font-semibold text-primary underline" href={item.href}>{item.related}</a></article>)}</div>
      <h2 className="mt-10 font-display text-3xl">Before comparing two figures</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7">
        <li>Record the publisher, report or table name, data year, release date and geographic unit.</li>
        <li>Match the definitions and denominators. A tax rate, actual tax levy and taxable value are different measures; election turnout depends on the population used in the denominator.</li>
        <li>Distinguish estimates and forecasts from final records. Check revisions, methodology notes and whether the reporting periods align.</li>
        <li>Keep the original source link and the date accessed. A chart without the underlying data cannot establish causation or a change in law.</li>
      </ol>
      <p className="mt-4 text-sm text-muted-foreground">Source directory reviewed November 24, 2026. See <a href="/editorial-standards" className="font-semibold text-primary underline">editorial standards</a> for attribution and corrections.</p>
    </section>
    {INDEXABLE_DATA_SETS.length > 0 ? <section className="mx-auto max-w-[1180px] px-6 py-12"><h2 className="mb-6 font-display text-3xl">Reviewed data guides</h2><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{INDEXABLE_DATA_SETS.map((dataset) => <a key={dataset.slug} href={`/data/${dataset.slug}`} className="group flex h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary hover:shadow-md"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Official-source data map</p><h3 className="mt-2 font-display text-2xl leading-tight tracking-tight group-hover:text-primary">{dataset.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{dataset.dek}</p><span className="mt-5 text-xs font-bold text-primary">Open data guide →</span></a> )}</div></section> : null}
    <section className="border-t bg-muted/25"><div className="mx-auto max-w-[1180px] px-6 py-12"><h2 className="font-display text-3xl tracking-tight">The KTR evidence chain</h2><div className="mt-6 grid gap-4 md:grid-cols-4"><a href="/citation-guide" className="rounded-xl border bg-background p-5"><strong>Data sources</strong><p className="mt-2 text-sm text-muted-foreground">What the records measure.</p></a><a href="/laws/topics" className="rounded-xl border bg-background p-5"><strong>Law</strong><p className="mt-2 text-sm text-muted-foreground">What the statutes authorize.</p></a><a href="/policy" className="rounded-xl border bg-background p-5"><strong>Policy</strong><p className="mt-2 text-sm text-muted-foreground">What government is doing.</p></a><a href="/texas-case" className="rounded-xl border bg-background p-5"><strong>Editorial</strong><p className="mt-2 text-sm text-muted-foreground">What KTR believes Texas should do.</p></a></div></div></section>
  </main>;
}
