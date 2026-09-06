import { Link } from "@tanstack/react-router";
import type { TexasDataSet } from "@/data/texas-data-catalog";
import { PropertyTaxDataPanel } from "@/components/property-tax-data-panel";
import { StateBudgetDataPanel } from "@/components/state-budget-data-panel";
import { ElectionTurnoutHistoryPanel } from "@/components/election-turnout-history-panel";
import { ErcotEnergyMetricsPanel } from "@/components/ercot-energy-metrics-panel";
import { buildSeo, SITE_URL } from "@/lib/seo";

export function texasDataHead(dataset: TexasDataSet) {
  const path = `/data/${dataset.slug}`;
  const url = `${SITE_URL}${path}`;
  const seo = buildSeo({ title: dataset.title, description: dataset.dek, path, type: "article", publishedTime: `${dataset.updated}T12:00:00-05:00`, modifiedTime: `${dataset.updated}T12:00:00-05:00`, section: "Texas Data Center", author: "Keep TX Red Data Desk" });
  return { meta: seo.meta, links: seo.links, scripts: [
    { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: dataset.title, description: dataset.dek, datePublished: dataset.updated, dateModified: dataset.updated, articleSection: "Texas Data Center", mainEntityOfPage: { "@type": "WebPage", "@id": url }, author: { "@type": "Organization", name: "Keep TX Red Data Desk", url: `${SITE_URL}/about` }, publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL } }) },
    { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Texas Data Center", item: `${SITE_URL}/data` }, { "@type": "ListItem", position: 3, name: dataset.title, item: url }] }) },
  ] };
}

export function TexasDataPage({ dataset }: { dataset: TexasDataSet }) {
  return <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
    <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><a href="/data">Texas Data Center</a></nav>
    <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Keep TX Red Data Center</p>
    <h1 className="mt-3 font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">{dataset.title}</h1>
    <p className="mt-5 font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">{dataset.dek}</p>
    <div className="mt-6 border-y py-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Keep TX Red Data Desk</span><span className="mx-2">•</span>Source map reviewed {new Date(`${dataset.updated}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>

    <section className="mt-8 border-l-4 border-primary bg-primary/5 p-6"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p><p className="mt-3 text-base font-semibold leading-7">{dataset.quickAnswer}</p></section>

    {dataset.slug === "property-tax" ? <PropertyTaxDataPanel /> : null}
    {dataset.slug === "state-budget-spending" ? <StateBudgetDataPanel /> : null}
    {dataset.slug === "elections-results" ? <ElectionTurnoutHistoryPanel /> : null}
    {dataset.slug === "energy-grid" ? <ErcotEnergyMetricsPanel /> : null}

    <section className="mt-10"><h2 className="border-b pb-2 font-display text-3xl tracking-tight">What the official data can show</h2><ul className="mt-5 space-y-3 text-base leading-7">{dataset.whatAvailable.map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{item}</span></li>)}</ul></section>

    <section className="mt-11"><h2 className="border-b pb-2 font-display text-3xl tracking-tight">Methodology and cautions</h2><div className="mt-5 space-y-5 font-serif text-base leading-8 md:text-[17px]">{dataset.methodology.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>

    <section className="mt-11 rounded-xl border bg-card p-6"><h2 className="font-display text-2xl tracking-tight">How KTR can use this dataset</h2><ul className="mt-4 space-y-3 text-sm leading-6">{dataset.useCases.map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{item}</span></li>)}</ul></section>

    <section className="mt-12 border-t pt-8"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Source directory</p><h2 className="mt-2 font-display text-2xl tracking-tight">Official datasets</h2><div className="mt-5 space-y-4">{dataset.sources.map((source) => <div key={source.url} className="rounded-lg border bg-card p-5"><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a><p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{source.publisher}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{source.scope}</p></div>)}</div></section>

    <section className="mt-10 rounded-xl border bg-muted/20 p-6"><h2 className="font-display text-2xl tracking-tight">Related permanent KTR coverage</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{dataset.related.map((item) => <a key={item.href} href={item.href} className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">{item.label} →</a>)}</div></section>

    <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Data standard:</strong> KTR distinguishes raw official records, estimates, forecasts, polls, models, and editorial analysis. The source directory above identifies the authoritative starting point; any KTR chart or derived dataset should preserve source date, methodology, and transformation notes.</aside>
  </article>;
}