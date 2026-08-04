import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, BookOpen, Database, History, Landmark, MapPinned } from "lucide-react";
import { TEXAS_DATASETS } from "@/data/texas-data-center";

const canonical = "https://keeptxred.com/texas-data";

export const Route = createFileRoute("/texas-data")({
  head: () => ({
    meta: [
      { title: "Texas Resources: Guides, Tools & Trusted Information" },
      { name: "description", content: "Find practical Texas information, guides, calculators, community comparisons, county information, election resources and trusted reference tools." },
      { property: "og:title", content: "Texas Resources — Keep TX Red" },
      { property: "og:description", content: "Practical Texas guides, calculators and interactive resources for residents and future Texans." },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": ["WebPage", "CollectionPage"], name: "Texas Resources", description: "Practical Texas guides, calculators, interactive resources, community comparisons and trusted reference information.", url: canonical }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com" }, { "@type": "ListItem", position: 2, name: "Texas Resources", item: canonical }] }, { "@type": "ItemList", name: "Texas resources", itemListElement: TEXAS_DATASETS.map((dataset, index) => ({ "@type": "ListItem", position: index + 1, name: dataset.title, url: `${canonical}/${dataset.slug}` })) }] }).replace(/</g, "\\u003c") }],
  }),
  component: TexasResources,
});

const FEATURES = [
  { icon: BarChart3, title: "Compare Texas", text: "Compare Texas communities and topics using clearly explained information." },
  { icon: History, title: "Explore History", text: "See how Texas has changed over time through easy-to-understand comparisons." },
  { icon: BookOpen, title: "Helpful Guides", text: "Find practical guides and trusted information that help you make informed decisions." },
  { icon: MapPinned, title: "Related Resources", text: "Move easily between counties, representatives, bills, laws and other useful Texas resources." },
];

function TexasResources() {
  return <div>
    <section className="border-b bg-secondary text-secondary-foreground"><div className="mx-auto max-w-6xl px-4 py-16 sm:py-20"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Resources</p><h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Texas Resources</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-secondary-foreground/80">Find practical information about Texas—from property taxes and elections to cities, counties, schools, and cost of living. Our guides, calculators, and interactive resources are designed to help Texans and future Texans quickly find reliable answers.</p></div></section>
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><span>Texas Resources</span></nav>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{FEATURES.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-xl border bg-card p-5"><Icon className="size-6 text-primary" /><h2 className="mt-4 font-display text-2xl">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</section>
      <section className="mt-14"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Resources</p><h2 className="mt-2 font-display text-4xl">Browse by Topic</h2></div><span className="rounded-full bg-muted px-3 py-1 text-sm">{TEXAS_DATASETS.length} resources</span></div><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{TEXAS_DATASETS.map((dataset) => <Link key={dataset.slug} to="/texas-data/$datasetSlug" params={{ datasetSlug: dataset.slug }} className="group rounded-xl border bg-card p-6 transition hover:border-primary"><div className="flex items-center justify-between"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{dataset.category}</span><Database className="size-5 text-muted-foreground" /></div><h3 className="mt-5 font-display text-2xl">{dataset.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{dataset.description}</p><div className="mt-5 border-t pt-4 text-sm font-semibold text-primary">Explore resource →</div></Link>)}</div></section>
      <section className="mt-14 grid gap-6 rounded-xl border bg-muted/20 p-7 md:grid-cols-2"><div><Landmark className="size-7 text-primary" /><h2 className="mt-4 font-display text-3xl">More Texas information</h2><p className="mt-3 leading-7 text-muted-foreground">Continue from these resources to related counties, representatives, bills, laws and legislative coverage.</p></div><div className="grid grid-cols-2 gap-3 text-sm font-semibold"><Link to="/county-elections" className="rounded-lg border bg-background p-4">County information</Link><Link to="/representatives" className="rounded-lg border bg-background p-4">Representatives</Link><a href="/bills" className="rounded-lg border bg-background p-4">Texas bills</a><Link to="/texas-legislature" className="rounded-lg border bg-background p-4">Legislature</Link></div></section>
    </div>
  </div>;
}
