import { createFileRoute } from "@tanstack/react-router";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const ALL_DATA_SETS = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
const INDEXABLE_DATA_SETS = ALL_DATA_SETS.filter(isDataDetailIndexable);
const TITLE = "Texas Data Center | Taxes, Budget, Elections, Energy & More";
const DESCRIPTION = "Keep TX Red's permanent directory of authoritative Texas datasets for property taxes, state spending, elections, demographics, energy, water, public safety, contracts, and agency rules.";

export const Route = createFileRoute("/data")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/data" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify(webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/data", type: "CollectionPage" })) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Texas Data Center", numberOfItems: INDEXABLE_DATA_SETS.length, itemListElement: INDEXABLE_DATA_SETS.map((dataset, index) => ({ "@type": "ListItem", position: index + 1, name: dataset.title, url: `${SITE_URL}/data/${dataset.slug}` })) }) },
    ] };
  },
  component: DataHub,
});

function DataHub() {
  return <main className="bg-background">
    <section className="border-b bg-secondary text-secondary-foreground"><div className="mx-auto max-w-[1180px] px-6 py-16 md:py-20"><p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Keep TX Red Data Desk</p><h1 className="mt-4 max-w-5xl font-display text-5xl leading-none tracking-tight md:text-7xl">Texas Data Center</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">The official records beneath KTR's arguments: where the data comes from, what it actually measures, and what it cannot prove by itself.</p><p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">This layer maps authoritative sources and methodology for data and accountability reporting, including Texas Contract Watch and Texas Rule Watch, without manufacturing numbers or hiding source limitations.</p></div></section>
    <section className="mx-auto max-w-[1180px] px-6 py-12"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{INDEXABLE_DATA_SETS.map((dataset) => <a key={dataset.slug} href={`/data/${dataset.slug}`} className="group flex h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary hover:shadow-md"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Official-source data map</p><h2 className="mt-2 font-display text-2xl leading-tight tracking-tight group-hover:text-primary">{dataset.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{dataset.dek}</p><span className="mt-5 text-xs font-bold text-primary">Open data guide →</span></a>)}</div></section>
    <section className="border-t bg-muted/25"><div className="mx-auto max-w-[1180px] px-6 py-12"><h2 className="font-display text-3xl tracking-tight">The KTR evidence chain</h2><div className="mt-6 grid gap-4 md:grid-cols-4"><a href="/data" className="rounded-xl border bg-background p-5"><strong>Data</strong><p className="mt-2 text-sm text-muted-foreground">What the records measure.</p></a><a href="/laws/topics" className="rounded-xl border bg-background p-5"><strong>Law</strong><p className="mt-2 text-sm text-muted-foreground">What the statutes authorize.</p></a><a href="/policy" className="rounded-xl border bg-background p-5"><strong>Policy</strong><p className="mt-2 text-sm text-muted-foreground">What government is doing.</p></a><a href="/texas-case" className="rounded-xl border bg-background p-5"><strong>Editorial</strong><p className="mt-2 text-sm text-muted-foreground">What KTR believes Texas should do.</p></a></div></div></section>
  </main>;
}
