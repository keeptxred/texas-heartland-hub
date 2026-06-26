import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { ARTICLES } from "@/data/articles";
import { TaxCalculator } from "@/components/tax-calculator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Keep TX Red — Texas Conservative News & Tax Tools" },
      { name: "description", content: "Conservative Texas political news, election coverage, and a property tax calculator by county with school district rates. Defending the Lone Star State." },
      { property: "og:title", content: "Keep TX Red — Defending the Lone Star State" },
      { property: "og:description", content: "Texas conservative news, election coverage, and property tax tools." },
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

function Index() {
  const featured = ARTICLES.find((a) => a.featured)!;
  const rest = ARTICLES.filter((a) => !a.featured).slice(0, 4);

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
          <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-tight max-w-3xl">
            DEFEND THE <br />
            <span className="text-primary">LONE STAR</span> STATE
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg text-white/80 leading-relaxed">
            Reporting the hard truths from Austin to the border. Conservative news, election intelligence, and the tools Texas taxpayers need to fight back.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/news"
              className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              Read the News
            </Link>
            <Link
              to="/tax-calculator"
              className="border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Tax Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* TOP STORIES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between border-b-2 border-foreground pb-3 mb-8">
          <h2 className="font-display text-4xl tracking-tight">Top Stories</h2>
          <Link to="/news" className="text-xs font-semibold uppercase tracking-widest text-primary hover:underline">
            View All →
          </Link>
        </div>

        <article className="mb-12">
          <div className="aspect-[16/9] overflow-hidden mb-5 bg-muted">
            <img src={featured.image} alt={featured.title} loading="lazy" className="size-full object-cover" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{featured.category}</span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold mt-2 leading-tight">{featured.title}</h3>
          <p className="mt-3 text-muted-foreground text-base max-w-3xl">{featured.dek}</p>
          <p className="mt-3 text-xs text-muted-foreground italic">{featured.author} • {featured.date}</p>
        </article>

        <div className="grid md:grid-cols-2 gap-8">
          {rest.map((a) => (
            <article key={a.slug} className="grid grid-cols-[110px_1fr] gap-4 group">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{a.category}</span>
                <h4 className="font-serif text-base font-bold mt-1 leading-tight group-hover:underline underline-offset-4">{a.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-1 italic">{a.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TAX CALCULATOR PREVIEW */}
      <section className="bg-secondary/5 border-y border-border py-16">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Taxpayer Tools</span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-2 leading-none">
              Know What You Owe. <br />
              <span className="text-primary">Fight What You Don't.</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Texas has no state income tax — but property taxes are among the highest in the nation, and your school district levy alone often dwarfs every other line item. Run the numbers for your county and ISD.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex gap-2"><span className="text-primary font-bold">★</span> 10 major Texas counties</li>
              <li className="flex gap-2"><span className="text-primary font-bold">★</span> Real ISD rates including M&amp;O and I&amp;S</li>
              <li className="flex gap-2"><span className="text-primary font-bold">★</span> Homestead exemption applied automatically</li>
              <li className="flex gap-2"><span className="text-primary font-bold">★</span> County, city, ISD, and special district breakdown</li>
            </ul>
          </div>
          <TaxCalculator />
        </div>
      </section>

      {/* ELECTIONS STRIP */}
      <section className="bg-secondary text-secondary-foreground py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">Election Pulse</span>
              <h2 className="font-display text-4xl tracking-tight mt-1">2026 Watch</h2>
            </div>
            <Link to="/elections" className="text-xs font-semibold uppercase tracking-widest text-accent hover:underline">
              Full Coverage →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Days to Primary", value: "142" },
              { label: "Republican Generic Ballot", value: "+8.4" },
              { label: "TX House Seats at Risk", value: "6" },
            ].map((s) => (
              <div key={s.label} className="border border-white/10 p-6">
                <div className="font-display text-5xl text-primary leading-none">{s.value}</div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
