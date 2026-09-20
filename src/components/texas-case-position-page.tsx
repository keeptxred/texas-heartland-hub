import { Link } from "@tanstack/react-router";
import type { TexasCasePosition } from "@/data/texas-case";
import { buildSeo, PUBLISHER_LOGO, SITE_URL } from "@/lib/seo";

export function texasCasePositionHead(position: TexasCasePosition) {
  const path = `/texas-case/${position.slug}`;
  const seo = buildSeo({
    title: position.title,
    description: position.dek,
    path,
    type: "article",
    publishedTime: `${position.updated}T12:00:00-05:00`,
    modifiedTime: `${position.updated}T12:00:00-05:00`,
    section: "The Texas Case",
    author: "Keep TX Red Editorial Desk",
  });
  const url = `${SITE_URL}${path}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "OpinionNewsArticle",
    "@id": `${url}#article`,
    headline: position.title,
    description: position.dek,
    datePublished: position.updated,
    dateModified: position.updated,
    articleSection: "The Texas Case",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Keep TX Red",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
    },
    inLanguage: "en-US",
    about: position.keyPoints.map((name) => ({ "@type": "Thing", name })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "The Texas Case", item: `${SITE_URL}/texas-case` },
      { "@type": "ListItem", position: 3, name: position.shortTitle, item: url },
    ],
  };
  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [articleJsonLd, breadcrumbJsonLd].map((value) => ({
      type: "application/ld+json",
      children: JSON.stringify(value),
    })),
  };
}

export function TexasCasePositionPage({ position }: { position: TexasCasePosition }) {
  const words = [
    position.stance,
    ...position.keyPoints,
    ...position.intro,
    ...position.sections.flatMap((section) => [
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
    ]),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(5, Math.round(words / 230));

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <a href="/texas-case" className="hover:text-primary">The Texas Case</a>
        <span className="mx-2">/</span>
        <span className="text-primary">{position.shortTitle}</span>
      </nav>

      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">★ Editorial Position · The Texas Case</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">{position.title}</h1>
      <p className="mt-5 font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">{position.dek}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-border py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Keep TX Red Editorial Desk</span>
        <span>•</span>
        <span>Updated <time dateTime={position.updated}>{new Date(`${position.updated}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></span>
        <span>•</span>
        <span>About {readingMinutes} min read</span>
      </div>

      <aside className="mt-6 rounded-xl border bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Separate factual companion</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Want the legal and administrative framework without KTR's editorial conclusion?</p>
        </div>
        <a href={`/texas-case/facts/${position.slug}`} className="mt-3 inline-flex shrink-0 rounded-md border px-4 py-2.5 text-sm font-bold text-primary hover:border-primary sm:mt-0">Facts & Framework →</a>
      </aside>

      <section className="mt-8 border-l-4 border-primary bg-primary/5 p-5 md:p-6" aria-labelledby="ktr-position">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">KTR position</p>
        <h2 id="ktr-position" className="mt-2 font-display text-2xl tracking-tight">What we believe</h2>
        <p className="mt-3 text-base font-semibold leading-7">{position.stance}</p>
      </section>

      <section className="mt-8 rounded-xl border bg-muted/20 p-5 md:p-6" aria-labelledby="key-points">
        <h2 id="key-points" className="font-display text-2xl tracking-tight">The case in brief</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6">
          {position.keyPoints.map((point) => (
            <li key={point} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{point}</span></li>
          ))}
        </ul>
      </section>

      <div className="mt-9 space-y-5 font-serif text-base leading-8 text-foreground/95 md:text-[17px]">
        {position.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>

      {position.sections.map((section) => (
        <section key={section.heading} className="mt-11">
          <h2 className="border-b border-border pb-2 font-display text-3xl tracking-tight">{section.heading}</h2>
          {section.paragraphs?.length ? (
            <div className="mt-5 space-y-5 font-serif text-base leading-8 text-foreground/95 md:text-[17px]">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          ) : null}
          {section.bullets?.length ? (
            <ul className="mt-5 space-y-3 text-base leading-7">
              {section.bullets.map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{item}</span></li>)}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="mt-12 border-t border-border pt-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Evidence layer</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">Primary sources and legal starting points</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">This is an editorial argument, not a substitute for the underlying law or official record. KTR links the position to primary sources so readers can verify the factual framework independently.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {position.sources.map((source) => (
            <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a></li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="font-display text-2xl tracking-tight">Follow the facts behind the argument</h2>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
          <a href={`/texas-case/facts/${position.slug}`} className="text-primary hover:underline">Facts & Framework →</a>
          {position.related.map((item) => <a key={item.href} href={item.href} className="text-primary hover:underline">{item.label} →</a>)}
        </div>
      </section>

      <aside className="mt-10 border-t border-border pt-6 text-xs leading-6 text-muted-foreground">
        <strong className="text-foreground">Editorial transparency:</strong> The Texas Case is where Keep TX Red states its editorial positions. News reporting and reference pages should still distinguish verified facts, official records, analysis, and opinion. A point of view does not excuse factual errors.
      </aside>
    </article>
  );
}
