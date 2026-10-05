import { Link } from "@tanstack/react-router";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";
import type { SearchRecoveryAuthorityGuide } from "@/data/search-recovery-authority";
import { buildSeo, SITE_URL } from "@/lib/seo";

const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;

export function searchRecoveryAuthorityPath(slug: string) {
  return `/texas-government/reference/${slug}`;
}

export function searchRecoveryAuthorityHead(guide: SearchRecoveryAuthorityGuide) {
  const path = searchRecoveryAuthorityPath(guide.slug);
  const canonical = `${SITE_URL}${path}`;
  const seo = buildSeo({
    title: guide.title,
    description: guide.dek,
    path,
    type: "article",
    imageAlt: guide.title,
  });

  return {
    meta: [
      ...seo.meta.filter((item) => item.name !== "robots"),
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
    ],
    links: seo.links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${canonical}#article`,
          headline: guide.title,
          description: guide.dek,
          datePublished: guide.updated,
          dateModified: guide.updated,
          mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          isBasedOn: guide.sources.map((source) => source.url),
          inLanguage: "en-US",
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Texas Government", item: `${SITE_URL}/texas-government` },
            { "@type": "ListItem", position: 3, name: guide.title, item: canonical },
          ],
        }).replace(/</g, "\\u003c"),
      },
    ],
  };
}

export function SearchRecoveryAuthorityPage({ guide }: { guide: SearchRecoveryAuthorityGuide }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / Reference
      </nav>

      <header className="mt-6 border-b pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{guide.eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{guide.title}</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">{guide.dek}</p>
        <p className="mt-4 text-sm text-muted-foreground">Last verified: <time dateTime={guide.updated}>September 28, 2026</time></p>
      </header>

      <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 md:p-8" aria-labelledby="key-findings">
        <h2 id="key-findings" className="text-2xl font-bold">Key points</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {guide.keyTakeaways.map((item) => (
            <li key={item} className="rounded-lg border bg-card p-4 text-sm leading-6">• {item}</li>
          ))}
        </ul>
      </section>

      {guide.snapshot?.length ? (
        <section className="mt-8" aria-labelledby="data-snapshot">
          <h2 id="data-snapshot" className="text-2xl font-bold">Official-data snapshot</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guide.snapshot.map((item) => (
              <div key={item.label} className="rounded-xl border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-primary">{item.value}</p>
                {item.note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10 space-y-10">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="border-b pb-2 text-3xl font-bold tracking-tight">{section.heading}</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-foreground/95">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.bullets?.length ? (
              <ul className="mt-5 space-y-3">
                {section.bullets.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6"><span className="font-bold text-primary">•</span><span>{item}</span></li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="border-b pb-2 text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-5 space-y-6">
          {guide.faq.map((item) => (
            <div key={item.q}>
              <h3 className="text-lg font-bold">{item.q}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <CitationTrustPanel
        className="mt-12"
        sources={guide.sources}
        methodology={guide.methodology}
        lastVerified="September 28, 2026"
        title="Primary sources and methodology"
      />

      <section className="mt-10 rounded-2xl border bg-muted/20 p-6" aria-labelledby="continue-research">
        <h2 id="continue-research" className="text-2xl font-bold">Continue your Texas research</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Connect this source-first guide to KeepTXRed's core Texas legislative and legal reference hubs.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-md border bg-card px-4 py-2 text-sm font-semibold text-primary hover:border-primary">Texas bill search →</Link>
          <Link to="/texas-legislature" className="rounded-md border bg-card px-4 py-2 text-sm font-semibold text-primary hover:border-primary">Texas Legislature →</Link>
          <Link to="/laws" className="rounded-md border bg-card px-4 py-2 text-sm font-semibold text-primary hover:border-primary">Texas laws →</Link>
          {guide.related.map((item) => (
            <a key={item.href} href={item.href} className="rounded-md border bg-card px-4 py-2 text-sm font-semibold text-primary hover:border-primary">{item.label} →</a>
          ))}
        </div>
      </section>
    </main>
  );
}
