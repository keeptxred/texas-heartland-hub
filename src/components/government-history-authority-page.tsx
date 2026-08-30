import type { GovernmentHistoryAuthorityPage as GovernmentHistoryPageData, GovernmentHistoryLink } from "@/data/texas-government-history-authority";

const SITE_URL = "https://keeptxred.com";
const POLICING_COMPARISON_LINK: GovernmentHistoryLink = {
  href: "/news/texas-policing-agencies-compared",
  label: "Texas policing agencies compared",
  description: "Compare city police, sheriffs, constables, DPS, Texas Rangers, school police, university police and specialized Texas peace officers.",
};

const POLICING_RELATED_SLUGS = new Set([
  "texas-county-government-history",
  "county-sheriff-history",
  "justice-of-the-peace-constable-history",
]);

export function getGovernmentHistoryRelatedLinks(page: GovernmentHistoryPageData) {
  if (!POLICING_RELATED_SLUGS.has(page.slug) || page.relatedLinks.some((link) => link.href === POLICING_COMPARISON_LINK.href)) {
    return page.relatedLinks;
  }
  return [...page.relatedLinks, POLICING_COMPARISON_LINK];
}

export function governmentHistoryAuthorityHead(page: GovernmentHistoryPageData) {
  const canonical = `${SITE_URL}/texas-government/${page.slug}`;
  const breadcrumbItems = [
    { name: "Home", item: SITE_URL },
    { name: "Texas Government", item: `${SITE_URL}/texas-government` },
    { name: page.title, item: canonical },
  ];

  return {
    meta: [
      { title: page.seoTitle },
      { name: "description", content: page.description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: page.seoTitle },
      { property: "og:description", content: page.description },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: page.title,
          description: page.description,
          url: canonical,
          dateModified: page.reviewed,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: page.sources.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.href })),
          isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.item,
          })),
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }).replace(/</g, "\\u003c"),
      },
    ],
  };
}

export function GovernmentHistoryAuthorityPage({ page }: { page: GovernmentHistoryPageData }) {
  const relatedLinks = getGovernmentHistoryRelatedLinks(page);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <a href="/" className="hover:text-primary">Home</a><span aria-hidden="true"> / </span>
        <a href="/texas-government" className="hover:text-primary">Texas Government</a><span aria-hidden="true"> / </span>
        <span aria-current="page">{page.title}</span>
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{page.eyebrow}</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">{page.title}</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">{page.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/texas-government" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Texas government hub</a>
          <a href="/texas-legislature" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas Legislature</a>
          <a href="/elections/2026" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Election Central</a>
          <a href="/texas-courts" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas courts</a>
        </div>
      </header>

      <section className="mt-10 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby={`${page.slug}-short-answer`}>
        <h2 id={`${page.slug}-short-answer`} className="text-2xl font-bold">The short answer</h2>
        <p className="mt-4 leading-8 text-foreground/90">{page.shortAnswer}</p>
      </section>

      <section className="mt-10" aria-labelledby={`${page.slug}-timeline`}>
        <h2 id={`${page.slug}-timeline`} className="text-3xl font-bold">Key timeline</h2>
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b bg-muted/40 text-sm"><tr><th className="px-5 py-4 font-bold">Period</th><th className="px-5 py-4 font-bold">Milestone</th><th className="px-5 py-4 font-bold">Why it mattered</th></tr></thead>
            <tbody>{page.timeline.map((item) => <tr key={`${item.year}-${item.event}`} className="border-b align-top last:border-b-0"><td className="px-5 py-4 font-bold text-primary">{item.year}</td><td className="px-5 py-4 font-semibold">{item.event}</td><td className="px-5 py-4 leading-7 text-muted-foreground">{item.meaning}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <article className="mt-12 space-y-8">
        {page.sections.map((section) => <section key={section.heading} className="rounded-xl border bg-card p-6 md:p-8"><h2 className="text-3xl font-bold">{section.heading}</h2><div className="mt-4 space-y-4 leading-8 text-foreground/90">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}
      </article>

      <section className="mt-12" aria-labelledby={`${page.slug}-related`}>
        <h2 id={`${page.slug}-related`} className="text-3xl font-bold">Continue through the Texas government authority network</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">{relatedLinks.map((link) => <a key={link.href} href={link.href} className="rounded-xl border bg-card p-5 transition-colors hover:border-primary"><h3 className="font-bold text-primary">{link.label} →</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{link.description}</p></a>)}</div>
      </section>

      <section className="mt-12 rounded-2xl border bg-muted/20 p-6 md:p-8" aria-labelledby={`${page.slug}-faq`}>
        <h2 id={`${page.slug}-faq`} className="text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-6">{page.faqs.map((faq) => <div key={faq.question}><h3 className="text-lg font-bold">{faq.question}</h3><p className="mt-2 leading-7 text-foreground/90">{faq.answer}</p></div>)}</div>
      </section>

      <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8" aria-labelledby={`${page.slug}-sources`}>
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Primary and institutional sources</p><h2 id={`${page.slug}-sources`} className="mt-2 text-3xl font-bold">Sources and further reading</h2></div><p className="text-sm text-muted-foreground">Reviewed {page.reviewed}</p></div>
        <ul className="mt-6 space-y-3">{page.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a></li>)}</ul>
      </section>
    </main>
  );
}
