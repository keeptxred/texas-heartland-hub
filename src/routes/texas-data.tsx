import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Database, Download, History, Landmark, MapPinned } from "lucide-react";
import { TEXAS_DATASETS } from "@/data/texas-data-center";

const canonical = "https://keeptxred.com/texas-data";

export const Route = createFileRoute("/texas-data")({
  head: () => ({
    meta: [
      { title: "Texas Data Center: Rankings, Charts & Historical Trends" },
      { name: "description", content: "Explore original Texas rankings, charts, historical trends, county comparisons, legislative data and downloadable datasets." },
      { property: "og:title", content: "Texas Data Center — Keep TX Red" },
      { property: "og:description", content: "Original Texas datasets with rankings, charts, historical trends and downloads." },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": ["WebPage", "CollectionPage"], name: "Texas Data Center", description: "Original Texas rankings, charts, historical trends and downloadable datasets.", url: canonical }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com" }, { "@type": "ListItem", position: 2, name: "Texas Data Center", item: canonical }] }, { "@type": "ItemList", name: "Published Texas datasets", itemListElement: TEXAS_DATASETS.map((dataset, index) => ({ "@type": "ListItem", position: index + 1, name: dataset.title, url: `${canonical}/${dataset.slug}` })) }] }).replace(/</g, "\\u003c") }],
  }),
  component: TexasDataCenter,
});

const FEATURES = [
  { icon: BarChart3, title: "Rankings", text: "Sortable comparisons using clearly defined metrics." },
  { icon: History, title: "Historical trends", text: "Track major changes across years without mixing incompatible data." },
  { icon: Download, title: "Downloadable data", text: "Export published tables as clean CSV files." },
  { icon: MapPinned, title: "Texas cross-links", text: "Move from data to counties, representatives, bills and laws." },
];

function TexasDataCenter() {
  return <div>
    <section className="border-b bg-secondary text-secondary-foreground"><div className="mx-auto max-w-6xl px-4 py-16 sm:py-20"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">KeepTXRed original data</p><h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Texas Data Center</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-secondary-foreground/80">Explore sourced Texas datasets through rankings, visual comparisons, historical trends and downloadable tables. Every published dataset includes its source, year, methodology and limitations.</p></div></section>
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><span>Texas Data Center</span></nav>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{FEATURES.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-xl border bg-card p-5"><Icon className="size-6 text-primary" /><h2 className="mt-4 font-display text-2xl">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</section>
      <section className="mt-14"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Published datasets</p><h2 className="mt-2 font-display text-4xl">Texas rankings and trends</h2></div><span className="rounded-full bg-muted px-3 py-1 text-sm">{TEXAS_DATASETS.length} datasets</span></div><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{TEXAS_DATASETS.map((dataset) => <Link key={dataset.slug} to="/texas-data/$datasetSlug" params={{ datasetSlug: dataset.slug }} className="group rounded-xl border bg-card p-6 transition hover:border-primary"><div className="flex items-center justify-between"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{dataset.category}</span><Database className="size-5 text-muted-foreground" /></div><h3 className="mt-5 font-display text-2xl">{dataset.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{dataset.description}</p><div className="mt-5 border-t pt-4 text-sm font-semibold text-primary">View dataset →</div></Link>)}</div></section>
      <section className="mt-14 grid gap-6 rounded-xl border bg-muted/20 p-7 md:grid-cols-2"><div><Landmark className="size-7 text-primary" /><h2 className="mt-4 font-display text-3xl">Connected Texas information</h2><p className="mt-3 leading-7 text-muted-foreground">Move directly from each dataset to related counties, representatives, bills, laws and legislative coverage.</p></div><div className="grid grid-cols-2 gap-3 text-sm font-semibold"><Link to="/county-elections" className="rounded-lg border bg-background p-4">County data</Link><Link to="/representatives" className="rounded-lg border bg-background p-4">Representatives</Link><Link to="/bills" className="rounded-lg border bg-background p-4">Texas bills</Link><Link to="/texas-legislature" className="rounded-lg border bg-background p-4">Legislature</Link></div></section>
    </div>
  </div>;
}
