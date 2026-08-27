import { createFileRoute, Link } from "@tanstack/react-router";
import { TEXAS_POLITICAL_FIGURES, TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS } from "@/data/texas-political-figures-all";
import type { PoliticalFigureCategory } from "@/data/texas-political-figure-builder";

const SITE_URL = "https://keeptxred.com";
const TITLE = "100 Texas Republican & Conservative Leaders: Profiles & History | KeepTXRed";
const DESCRIPTION = "Explore 100 major Texas Republican and conservative leaders across statewide government, Congress, the Legislature, courts, Reconstruction history and grassroots party building.";
const CATEGORY_ORDER: PoliticalFigureCategory[] = [
  "Statewide executive leaders",
  "U.S. senators",
  "Texas judicial leaders",
  "Current U.S. representatives",
  "Historical U.S. House leaders",
  "Texas legislative leaders",
  "Reconstruction and early GOP leaders",
  "Party organizers and conservative activists",
];
const categoryAnchor = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const Route = createFileRoute("/texas-politics/figures")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "Texas Republican leaders, Texas conservative leaders, Texas political history, Texas politicians, Texas GOP history, Texas political figures" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/texas-politics/figures` },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/texas-politics/figures` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/texas-politics/figures#collection`,
            name: TITLE,
            description: DESCRIPTION,
            url: `${SITE_URL}/texas-politics/figures`,
            about: ["Texas politics", "Republican Party of Texas", "Conservative political history"],
            mainEntity: { "@id": `${SITE_URL}/texas-politics/figures#list` },
            isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
          },
          {
            "@type": "ItemList",
            "@id": `${SITE_URL}/texas-politics/figures#list`,
            name: "Texas Republican and conservative political figure profiles",
            numberOfItems: TEXAS_POLITICAL_FIGURES.length,
            itemListElement: TEXAS_POLITICAL_FIGURES.map((figure, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: figure.name,
              url: `${SITE_URL}/texas-politics/figures/${figure.slug}`,
            })),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Texas Politics", item: `${SITE_URL}/texas-politics` },
              { "@type": "ListItem", position: 3, name: "Political Figures", item: `${SITE_URL}/texas-politics/figures` },
            ],
          },
        ],
      }).replace(/</g, "\\u003c"),
    }],
  }),
  component: TexasPoliticalFiguresHub,
});

function TexasPoliticalFiguresHub() {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    figures: TEXAS_POLITICAL_FIGURES.filter((figure) => figure.category === category),
  })).filter((group) => group.figures.length > 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/texas-politics">Texas Politics</Link> / Political Figures</nav>
      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas Republican and conservative political history</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">100 Texas Republican & Conservative Leaders</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">The core collection covers all {TEXAS_REPUBLICAN_CONSERVATIVE_LEADER_TARGETS.length} leaders in the historical list—from Reconstruction-era Black Republican pioneers and early party builders to governors, judges, congressional leaders and today's Texas lawmakers. Existing KeepTXRed authority profiles remain in the collection where they add closely related context.</p>
        <p className="mt-4 max-w-4xl leading-7 text-muted-foreground">These are evergreen authority pages, not thin campaign bios. Each profile separates durable career history and institutional power from changing committee assignments, candidacy status, polling and other live election details.</p>
        <div className="mt-6 flex flex-wrap gap-3"><a href="/elections" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Current elections</a><a href="/texas-government" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Government powers</a><a href="/texas-legislature" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas Legislature</a><a href="/texas-law-policy" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas law & policy</a></div>
      </header>

      <nav className="mt-8 rounded-xl border bg-muted/30 p-5" aria-label="Political figure categories">
        <p className="text-sm font-bold">Jump to a group</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {grouped.map(({ category, figures }) => <a key={category} href={`#${categoryAnchor(category)}`} className="rounded-full border bg-card px-3 py-1.5 text-sm hover:border-primary">{category} ({figures.length})</a>)}
        </div>
      </nav>

      {grouped.map(({ category, figures }) => (
        <section key={category} id={categoryAnchor(category)} className="mt-12 scroll-mt-24" aria-labelledby={`${categoryAnchor(category)}-heading`}>
          <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Political figure collection</p><h2 id={`${categoryAnchor(category)}-heading`} className="mt-1 text-3xl font-bold">{category}</h2></div>
            <a href="#top" className="text-sm font-semibold text-primary">Back to top ↑</a>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {figures.map((figure) => (
              <a key={figure.slug} href={`/texas-politics/figures/${figure.slug}`} className="group rounded-xl border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{figure.kicker}</p>
                <h3 className="mt-3 text-2xl font-bold group-hover:text-primary">{figure.name}</h3>
                <p className="mt-2 text-sm font-semibold">{figure.texasRole}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{figure.description}</p>
                <span className="mt-5 inline-flex text-sm font-bold text-primary">Read full profile →</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-12 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <h2 className="text-2xl font-bold">How this authority cluster connects to live KTR coverage</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">Career history belongs here. Election Central carries verified candidates, districts, polls and results; Texas Government explains formal office powers; the Legislature hub tracks current chambers and sessions; and Texas Law & Policy covers the issues these leaders shaped. That separation keeps old biographies useful without letting changing political facts make them stale.</p>
      </section>
    </main>
  );
}
