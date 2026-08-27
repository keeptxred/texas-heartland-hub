import { createFileRoute, Link } from "@tanstack/react-router";
import { ALL_TEXAS_POLITICAL_FIGURES } from "@/data/texas-political-figures-all";
import { politicalFigureHeroBySlug } from "@/data/texas-political-figure-heroes";

const SITE_URL = "https://keeptxred.com";
const TITLE = "Texas Political Figures: Leaders, Careers & Political Legacy | KeepTXRed";
const DESCRIPTION = "Evergreen profiles of major Texas Republican and conservative political figures, plus the earlier Reconstruction leaders who shaped the state's Republican Party, with career history, institutional context and authoritative sources.";

export const Route = createFileRoute("/texas-politics/figures")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/texas-politics/figures` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/texas-politics/figures` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/texas-politics/figures`,
        hasPart: ALL_TEXAS_POLITICAL_FIGURES.map((figure) => {
          const hero = politicalFigureHeroBySlug(figure.slug);
          return {
            "@type": "ProfilePage",
            name: figure.name,
            url: `${SITE_URL}/texas-politics/figures/${figure.slug}`,
            ...(hero ? { image: hero.src } : {}),
          };
        }),
      }).replace(/</g, "\\u003c"),
    }],
  }),
  component: TexasPoliticalFiguresHub,
});

function TexasPoliticalFiguresHub() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/texas-politics">Texas Politics</Link> / Political Figures</nav>
      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Evergreen Texas political history</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">Texas Political Figures: Careers, Power and Political Legacy</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">These are not thin campaign bios. Each profile explains how the person rose, what office or organizational power they held, the durable arguments around their record, and how their career fits the larger transformation of Texas politics. The library reaches back to Reconstruction so the state's Republican history is not treated as if it began with the modern conservative realignment.</p>
        <div className="mt-6 flex flex-wrap gap-3"><a href="/texas-politics/how-texas-became-republican" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">How Texas became Republican</a><a href="/texas-politics/reconstruction-republicans" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Republicans during Reconstruction</a><a href="/elections" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Current elections</a><a href="/texas-government" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Government powers</a><a href="/texas-law-policy" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas law & policy</a></div>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Texas political figure profiles">
        {ALL_TEXAS_POLITICAL_FIGURES.map((figure) => {
          const hero = politicalFigureHeroBySlug(figure.slug);
          return (
            <a key={figure.slug} href={`/texas-politics/figures/${figure.slug}`} className="group overflow-hidden rounded-xl border bg-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-sm">
              {hero ? <img src={hero.src} alt={hero.alt} className="h-52 w-full object-cover object-top" loading="lazy" /> : null}
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{figure.kicker}</p>
                <h2 className="mt-3 text-2xl font-bold group-hover:text-primary">{figure.name}</h2>
                <p className="mt-2 text-sm font-semibold">{figure.texasRole}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{figure.description}</p>
                <span className="mt-5 inline-flex text-sm font-bold text-primary">Read full profile →</span>
              </div>
            </a>
          );
        })}
      </section>

      <section className="mt-12 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <h2 className="text-2xl font-bold">Why KeepTXRed separates profiles from live election pages</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">A person's career history should not become wrong every time a filing status, poll or office changes. These pages hold the durable biography and institutional context. Election Central remains the source for verified current candidates, race pages, polls and results, while Texas Government explains the legal powers of the office itself.</p>
      </section>
    </main>
  );
}
