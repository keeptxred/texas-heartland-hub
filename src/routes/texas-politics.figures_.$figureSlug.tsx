import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TEXAS_POLITICAL_FIGURES, texasPoliticalFigureBySlug } from "@/data/texas-political-figures-all";

const SITE_URL = "https://keeptxred.com";
const categoryAnchor = (category?: string) => category?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "";

export const Route = createFileRoute("/texas-politics/figures_/$figureSlug")({
  beforeLoad: ({ params }) => {
    if (!texasPoliticalFigureBySlug(params.figureSlug)) throw notFound();
  },
  head: ({ params }) => {
    const figure = texasPoliticalFigureBySlug(params.figureSlug);
    if (!figure) return { meta: [{ name: "robots", content: "noindex, follow" }] };
    const canonical = `${SITE_URL}/texas-politics/figures/${figure.slug}`;
    const title = `${figure.name}: Texas Political Profile & Legacy | KeepTXRed`;
    const keywords = figure.seoKeywords?.join(", ");
    return {
      meta: [
        { title },
        { name: "description", content: figure.description },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: figure.description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "profile" },
        { property: "og:site_name", content: "Keep TX Red" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: figure.description },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ProfilePage",
              "@id": `${canonical}#profile`,
              name: title,
              description: figure.description,
              url: canonical,
              mainEntity: { "@id": `${canonical}#person` },
              isPartOf: { "@type": "CollectionPage", name: "Texas Political Figures", url: `${SITE_URL}/texas-politics/figures` },
            },
            {
              "@type": "Person",
              "@id": `${canonical}#person`,
              name: figure.name,
              ...(figure.aliases?.length ? { alternateName: figure.aliases } : {}),
              description: figure.description,
              url: canonical,
              ...(figure.seoKeywords?.length ? { knowsAbout: figure.seoKeywords } : {}),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Texas Politics", item: `${SITE_URL}/texas-politics` },
                { "@type": "ListItem", position: 3, name: "Political Figures", item: `${SITE_URL}/texas-politics/figures` },
                { "@type": "ListItem", position: 4, name: figure.name, item: canonical },
              ],
            },
          ],
        }).replace(/</g, "\\u003c"),
      }],
    };
  },
  component: PoliticalFigurePage,
});

function PoliticalFigurePage() {
  const { figureSlug } = Route.useParams();
  const figure = texasPoliticalFigureBySlug(figureSlug);
  if (!figure) return null;

  const explicitPeers = (figure.relatedFigureSlugs ?? [])
    .map((slug) => texasPoliticalFigureBySlug(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item) && item.slug !== figure.slug);
  const categoryPeers = TEXAS_POLITICAL_FIGURES.filter((item) => item.slug !== figure.slug && item.category === figure.category);
  const fallbackPeers = TEXAS_POLITICAL_FIGURES.filter((item) => item.slug !== figure.slug);
  const peers = [...explicitPeers, ...categoryPeers, ...fallbackPeers]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.slug === item.slug) === index)
    .slice(0, 6);
  const categoryHref = figure.category ? `/texas-politics/figures#${categoryAnchor(figure.category)}` : "/texas-politics/figures";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-politics">Texas Politics</Link> / <a href="/texas-politics/figures">Political Figures</a> / {figure.name}
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        {figure.category ? <a href={categoryHref} className="text-xs font-bold uppercase tracking-[0.18em] text-primary hover:underline">{figure.category}</a> : null}
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">{figure.kicker}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">{figure.name}</h1>
        <p className="mt-4 text-lg font-semibold">{figure.texasRole}</p>
        <p className="mt-1 text-sm text-muted-foreground">{figure.years}</p>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{figure.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={categoryHref} className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">More in this political group</a>
          {figure.relatedLinks.map((link) => <a key={link.href} href={link.href} className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">{link.label}</a>)}
        </div>
      </header>

      <article className="mt-10 space-y-10">
        {figure.sections.map((section) => (
          <section key={section.heading} className="rounded-xl border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-bold md:text-3xl">{section.heading}</h2>
            <p className="mt-4 text-base leading-8 text-foreground/90">{section.body}</p>
          </section>
        ))}
      </article>

      <aside className="mt-12 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby="figure-context">
        <h2 id="figure-context" className="text-2xl font-bold">Connect the biography to current Texas politics</h2>
        <p className="mt-3 leading-7 text-muted-foreground">This authority page holds durable career, institutional and historical context. Use Election Central for current candidacy, ballot status, polling and results; Texas Government for the legal powers of statewide offices; and the Texas Legislature hub for current chambers, sessions and bills.</p>
        <div className="mt-5 flex flex-wrap gap-3"><a href="/elections" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Texas Election Central</a><a href="/texas-government" className="rounded-md border bg-card px-4 py-2 text-sm font-bold hover:border-primary">Texas Government</a><a href="/texas-legislature" className="rounded-md border bg-card px-4 py-2 text-sm font-bold hover:border-primary">Texas Legislature</a></div>
      </aside>

      <section className="mt-12" aria-labelledby="more-figures">
        <h2 id="more-figures" className="text-2xl font-bold">More {figure.category ?? "Texas political"} figures</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {peers.map((peer) => <a key={peer.slug} href={`/texas-politics/figures/${peer.slug}`} className="rounded-xl border bg-card p-5 hover:border-primary"><p className="text-xs font-bold uppercase tracking-wide text-primary">{peer.kicker}</p><h3 className="mt-2 text-xl font-bold">{peer.name}</h3><p className="mt-2 text-sm font-semibold">{peer.texasRole}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{peer.description}</p></a>)}
        </div>
      </section>
    </main>
  );
}
