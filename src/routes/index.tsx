import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Texas News, Politics & Policy Updates — Keep TX Red" },
      { name: "description", content: "Independent coverage of Texas government, elections, economy, and statewide issues — politics, policy, and the stories shaping the Lone Star State." },
      { property: "og:title", content: "Texas News, Politics & Policy Updates That Matter" },
      { property: "og:description", content: "Independent coverage of Texas government, elections, economy, and statewide issues." },
      { property: "og:url", content: "/" },
      { property: "og:image", content: heroFlag },
      { name: "twitter:image", content: heroFlag },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Keep TX Red",
          url: "https://www.keeptxred.com/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.keeptxred.com/news?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Keep TX Red",
          url: "https://www.keeptxred.com/",
          logo: "https://www.keeptxred.com/favicon.ico",
        }),
      },
    ],
  }),
  component: Index,
});

const HUB_CARDS = [
  {
    to: "/texas-politics" as const,
    eyebrow: "Politics",
    title: "Texas Politics",
    desc: "Elections, the Legislature, the Governor's office, and the voting fights that shape the state.",
  },
  {
    to: "/texas-economy" as const,
    eyebrow: "Economy",
    title: "Texas Economy",
    desc: "Energy, jobs, business growth, property taxes, and the state budget.",
  },
  {
    to: "/texas-law-policy" as const,
    eyebrow: "Law & Policy",
    title: "Texas Law & Policy",
    desc: "Border policy, education, public safety, and the legal updates Texans actually feel.",
  },
];

function Index() {
  const sorted = ARTICLES.filter((a) => isPublished(a)).sort(sortByDateDesc);
  const latest = sorted.slice(0, 9);

  return (
    <>
      {/* HERO */}
      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroFlag}
            alt="Texas Lone Star flag waving at sunset"
            width={1024}
            height={1280}
            fetchPriority="high"
            className="size-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1 mb-5">
            ★ Independent Texas Voice
          </span>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl">
            TEXAS NEWS, POLITICS &amp; <span className="text-primary">POLICY UPDATES</span> THAT MATTER
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-white/80 leading-relaxed">
            Independent coverage of Texas government, elections, economy, and statewide issues.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/news"
              className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              Read Latest Articles
            </Link>
            <Link
              to="/hubs"
              className="border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Explore Texas Topics →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED HUB SECTIONS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="border-b-2 border-foreground pb-3 mb-8">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Topic Hubs</span>
          <h2 className="font-display text-4xl tracking-tight mt-1">Explore Texas by Topic</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {HUB_CARDS.map((h) => (
            <Link
              key={h.to}
              to={h.to}
              className="group block border-2 border-foreground/10 bg-card p-7 hover:border-primary transition-colors"
            >
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ {h.eyebrow}</span>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight mt-2 group-hover:underline underline-offset-4">{h.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
              <span className="mt-5 inline-block text-xs font-bold uppercase tracking-widest text-primary">Open Hub →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST ARTICLES */}
      <section className="mx-auto max-w-6xl px-4 py-16 border-t border-border">
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Newsroom</span>
            <h2 className="font-display text-4xl tracking-tight mt-1">Latest Articles</h2>
          </div>
          <Link to="/news" className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest.map((a) => (
            <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
                <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{a.category}</span>
              <h3 className="font-serif text-base font-bold mt-1 leading-snug group-hover:underline underline-offset-4">{a.title}</h3>
              <p className="mt-1 text-[11px] text-muted-foreground italic">{a.author} • {a.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="bg-secondary text-secondary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">★ About Keep TX Red</span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-3 leading-tight">
            Independent Texas reporting — <span className="text-primary">unfiltered.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-white/75 leading-relaxed">
            Keep TX Red is an independent Texas-focused news and analysis platform covering politics, policy, economy, and statewide developments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/about" className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-primary/90">
              Our Story
            </Link>
            <Link to="/contact" className="border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-white/10">
              Contact the Newsroom →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
