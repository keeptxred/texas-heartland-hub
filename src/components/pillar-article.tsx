import { Link } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";

export type PillarSection = { heading?: string; paragraphs: string[] };
export type PillarLink = { to: string; label: string; description: string };

export type PillarArticleProps = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  image: string;
  imageAlt: string;
  publishedISO: string;
  updatedISO: string;
  intro: string;
  sections: PillarSection[];
  keyTakeaways: string[];
  faq: { q: string; a: string }[];
  related: PillarLink[];
};

export function buildPillarHead(p: PillarArticleProps) {
  const path = `/texas/${p.slug.replace(/^texas\//, "")}`;
  const seo = buildSeo({
    title: p.metaTitle,
    description: p.metaDescription,
    path,
    image: p.image,
    imageAlt: p.imageAlt,
    type: "article",
    publishedTime: p.publishedISO,
    modifiedTime: p.updatedISO,
    section: "Texas",
    author: "Keep Texas Red Editorial Staff",
    keywords: p.focusKeyword,
  });
  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.metaDescription,
          image: [seo.image],
          datePublished: p.publishedISO,
          dateModified: p.updatedISO,
          author: { "@type": "Organization", name: "Keep Texas Red Editorial Staff" },
          publisher: {
            "@type": "NewsMediaOrganization",
            name: "Keep TX Red",
            url: "https://www.keeptxred.com/",
            logo: { "@type": "ImageObject", url: "https://www.keeptxred.com/favicon.ico" },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": seo.url },
          keywords: p.focusKeyword,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.keeptxred.com/" },
            { "@type": "ListItem", position: 2, name: "Texas Pillar Hub", item: "https://www.keeptxred.com/texas" },
            { "@type": "ListItem", position: 3, name: p.title, item: seo.url },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: p.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  };
}

export function PillarArticle(p: PillarArticleProps) {
  const updated = new Date(p.updatedISO).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/texas" className="hover:text-primary">Texas</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Pillar</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Texas Pillar Guide</span>
      <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight mt-3">{p.title}</h1>
      <p className="mt-3 text-xs text-muted-foreground">
        By Keep Texas Red Editorial Staff · Last updated {updated}
      </p>

      <div className="mt-6 aspect-[16/9] overflow-hidden border border-foreground/10 bg-muted">
        <img
          src={p.image}
          alt={p.imageAlt}
          width={1024}
          height={576}
          fetchPriority="high"
          className="size-full object-cover"
        />
      </div>

      <p className="mt-8 font-serif text-lg md:text-xl leading-relaxed text-foreground">{p.intro}</p>

      {p.sections.map((s, i) => (
        <section key={i} className="mt-10">
          {s.heading ? (
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">
              {s.heading}
            </h2>
          ) : null}
          {s.paragraphs.map((par, j) => (
            <p key={j} className="font-serif text-base md:text-lg leading-relaxed text-foreground mb-4">
              {par}
            </p>
          ))}
        </section>
      ))}

      <aside className="mt-12 border-2 border-primary bg-primary/5 p-6">
        <h2 className="font-display text-xl tracking-tight mb-3">Key Takeaways</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-foreground">
          {p.keyTakeaways.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      </aside>

      <section className="mt-12">
        <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">
          Frequently Asked Questions
        </h2>
        <div className="space-y-5">
          {p.faq.map((f, i) => (
            <div key={i}>
              <h3 className="font-serif font-bold text-base md:text-lg">{f.q}</h3>
              <p className="mt-1 font-serif text-base leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4 border-b border-border pb-2">
          Related Texas Guides
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {p.related.map((r) => (
            <a
              key={r.to}
              href={r.to}
              className="group block border-2 border-foreground/10 bg-card p-5 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <h3 className="font-display text-lg tracking-tight group-hover:text-primary">{r.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{r.description}</p>
              <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">
                Read →
              </span>
            </a>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs text-muted-foreground italic">
        Editorial note: Keep Texas Red is an independent Texas-focused publisher. This guide is informational and reflects
        publicly available policy and economic context as of the last updated date above.
      </p>
    </article>
  );
}