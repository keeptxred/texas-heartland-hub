import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ALL_TEXAS_POLITICAL_FIGURES, texasPoliticalFigureBySlug } from "@/data/texas-political-figures-all";
import { politicalFigureHeroBySlug } from "@/data/texas-political-figure-heroes";
import { politicalFigureAuthoritySourcesBySlug } from "@/data/texas-political-figure-authority-sources";

const SITE_URL = "https://keeptxred.com";
const FIGURE_PREFIX = "/texas-politics/figures/";

type SourceLink = { href: string; label: string };

function sourcesForFigure(figure: { slug: string; sources?: SourceLink[] }): SourceLink[] {
  const combined = [...(figure.sources ?? []), ...politicalFigureAuthoritySourcesBySlug(figure.slug)];
  return combined.filter((source, index) => combined.findIndex((candidate) => candidate.href === source.href) === index);
}

export const Route = createFileRoute("/texas-politics/figures_/$figureSlug")({
  beforeLoad: ({ params }) => {
    if (!texasPoliticalFigureBySlug(params.figureSlug)) throw notFound();
  },
  head: ({ params }) => {
    const figure = texasPoliticalFigureBySlug(params.figureSlug);
    if (!figure) return { meta: [{ name: "robots", content: "noindex, follow" }] };
    const hero = politicalFigureHeroBySlug(figure.slug);
    const sources = sourcesForFigure(figure);
    const canonical = `${SITE_URL}/texas-politics/figures/${figure.slug}`;
    const title = `${figure.name}: Texas Political Profile & Legacy | KeepTXRed`;
    return {
      meta: [
        { title },
        { name: "description", content: figure.description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: figure.description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "profile" },
        { property: "og:site_name", content: "Keep TX Red" },
        ...(hero ? [
          { property: "og:image", content: hero.src },
          { property: "og:image:alt", content: hero.alt },
        ] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: figure.description },
        ...(hero ? [
          { name: "twitter:image", content: hero.src },
          { name: "twitter:image:alt", content: hero.alt },
        ] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: title,
          description: figure.description,
          url: canonical,
          ...(hero ? { image: hero.src } : {}),
          ...(sources.length ? {
            citation: sources.map((source) => ({
              "@type": "CreativeWork",
              name: source.label,
              url: source.href,
            })),
          } : {}),
          mainEntity: {
            "@type": "Person",
            name: figure.name,
            description: figure.description,
            ...(hero ? { image: hero.src } : {}),
          },
          isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
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
  const hero = politicalFigureHeroBySlug(figure.slug);
  const sources = sourcesForFigure(figure);

  const linkedPeerSlugs = new Set(
    figure.relatedLinks
      .filter((link) => link.href.startsWith(FIGURE_PREFIX))
      .map((link) => link.href.slice(FIGURE_PREFIX.length))
      .filter(Boolean),
  );
  const linkedPeers = ALL_TEXAS_POLITICAL_FIGURES.filter(
    (item) => item.slug !== figure.slug && linkedPeerSlugs.has(item.slug),
  );
  const sameCategoryPeers = figure.category
    ? ALL_TEXAS_POLITICAL_FIGURES.filter(
        (item) => item.slug !== figure.slug && item.category === figure.category && !linkedPeerSlugs.has(item.slug),
      )
    : [];
  const sameKickerPeers = ALL_TEXAS_POLITICAL_FIGURES.filter(
    (item) => item.slug !== figure.slug && item.kicker === figure.kicker && !linkedPeerSlugs.has(item.slug),
  );
  const broadFallbackPeers = ALL_TEXAS_POLITICAL_FIGURES.filter(
    (item) => item.slug !== figure.slug && !linkedPeerSlugs.has(item.slug),
  );
  const peers = [...linkedPeers, ...sameCategoryPeers, ...sameKickerPeers, ...broadFallbackPeers]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.slug === item.slug) === index)
    .slice(0, 4);
  const moreFiguresHeading = figure.category ? `More from ${figure.category}` : "More Texas political figures";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-politics">Texas Politics</Link> / <a href="/texas-politics/figures">Political Figures</a> / {figure.name}
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{figure.kicker}</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">{figure.name}</h1>
        <p className="mt-4 text-lg font-semibold">{figure.texasRole}</p>
        <p className="mt-1 text-sm text-muted-foreground">{figure.years}</p>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{figure.description}</p>
        {hero ? (
          <figure className="mt-7 overflow-hidden rounded-xl border bg-muted/20">
            <img src={hero.src} alt={hero.alt} className="max-h-[560px] w-full object-contain" loading="eager" fetchPriority="high" />
            <figcaption className="border-t px-4 py-3 text-xs leading-5 text-muted-foreground">
              {hero.alt}. <a href={hero.sourcePage} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{hero.credit} ↗</a>
            </figcaption>
          </figure>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
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

      {sources.length ? (
        <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8" aria-labelledby="profile-sources">
          <h2 id="profile-sources" className="text-2xl font-bold">Institutional sources and records</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">These official and institutional references provide rosters, service history and political context for the profile. When a figure has profile-specific source material, those links are included alongside the broader institutional records.</p>
          <ul className="mt-5 space-y-3">
            {sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.label} ↗</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <aside className="mt-12 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby="figure-context">
        <h2 id="figure-context" className="text-2xl font-bold">Keep the biography connected to current Texas politics</h2>
        <p className="mt-3 leading-7 text-muted-foreground">Evergreen profiles explain career, offices, political coalitions and durable controversies. For current races, ballot status, polling and results, use Election Central. For the constitutional powers of a Texas office, use the Texas Government authority guides.</p>
        <div className="mt-5 flex flex-wrap gap-3"><a href="/elections" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Texas Election Central</a><a href="/texas-government" className="rounded-md border bg-card px-4 py-2 text-sm font-bold hover:border-primary">Texas Government</a></div>
      </aside>

      <section className="mt-12" aria-labelledby="more-figures">
        <h2 id="more-figures" className="text-2xl font-bold">{moreFiguresHeading}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Related profiles are prioritized first, followed by leaders from the same political or institutional category.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {peers.map((peer) => <a key={peer.slug} href={`/texas-politics/figures/${peer.slug}`} className="rounded-xl border bg-card p-5 hover:border-primary"><p className="text-xs font-bold uppercase tracking-wide text-primary">{peer.kicker}</p><h3 className="mt-2 text-xl font-bold">{peer.name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{peer.description}</p></a>)}
        </div>
      </section>
    </main>
  );
}
