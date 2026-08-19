import { Link } from "@tanstack/react-router";
import { getTexasCasePosition } from "@/data/texas-case-all";
import type { TexasCaseFacts } from "@/data/texas-case-facts";
import { buildSeo, SITE_URL } from "@/lib/seo";

export function texasCaseFactsHead(facts: TexasCaseFacts) {
  const path = `/texas-case/facts/${facts.slug}`;
  const url = `${SITE_URL}${path}`;
  const seo = buildSeo({
    title: facts.title,
    description: facts.dek,
    path,
    type: "article",
    publishedTime: `${facts.reviewed}T12:00:00-05:00`,
    modifiedTime: `${facts.reviewed}T12:00:00-05:00`,
    section: "Texas Policy Facts",
    author: "Keep TX Red Reference Desk",
  });
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: facts.title,
    description: facts.dek,
    datePublished: facts.reviewed,
    dateModified: facts.reviewed,
    articleSection: "Texas Policy Facts",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "Keep TX Red Reference Desk", url: `${SITE_URL}/about` },
    publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
    inLanguage: "en-US",
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "The Texas Case", item: `${SITE_URL}/texas-case` },
      { "@type": "ListItem", position: 3, name: "Facts & Framework", item: `${SITE_URL}/texas-case/facts` },
      { "@type": "ListItem", position: 4, name: facts.title, item: url },
    ],
  };
  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [articleJsonLd, breadcrumbJsonLd].map((value) => ({ type: "application/ld+json", children: JSON.stringify(value) })),
  };
}

export function TexasCaseFactsPage({ facts }: { facts: TexasCaseFacts }) {
  const position = getTexasCasePosition(facts.slug);
  if (!position) return null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <a href="/texas-case" className="hover:text-primary">The Texas Case</a>
        <span className="mx-2">/</span>
        <a href="/texas-case/facts" className="hover:text-primary">Facts & Framework</a>
      </nav>

      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Reference · Facts & Framework</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">{facts.title}</h1>
      <p className="mt-5 font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">{facts.dek}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-border py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Keep TX Red Reference Desk</span>
        <span>•</span>
        <span>Reviewed <time dateTime={facts.reviewed}>{new Date(`${facts.reviewed}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></span>
      </div>

      <section className="mt-8 rounded-xl border bg-muted/20 p-5 md:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Purpose</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">Facts first</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">This page is the factual companion to a separately labeled KTR editorial position. It summarizes the legal and administrative framework, identifies questions worth verifying, and links to primary sources. It does not ask the reader to adopt KTR's editorial conclusion.</p>
      </section>

      <div className="mt-9 space-y-5 font-serif text-base leading-8 text-foreground/95 md:text-[17px]">
        {facts.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>

      <section className="mt-11">
        <h2 className="border-b border-border pb-2 font-display text-3xl tracking-tight">How to analyze the issue</h2>
        <ul className="mt-5 space-y-3 text-base leading-7">
          {facts.framework.map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{item}</span></li>)}
        </ul>
      </section>

      <section className="mt-11">
        <h2 className="border-b border-border pb-2 font-display text-3xl tracking-tight">Key questions to keep checking</h2>
        <ol className="mt-5 space-y-4 text-base leading-7">
          {facts.keyQuestions.map((question, index) => <li key={question} className="flex gap-3"><span className="font-bold text-primary">{index + 1}.</span><span>{question}</span></li>)}
        </ol>
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Primary sources</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">Start with the official record</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {position.sources.map((source) => (
            <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a></li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href={`/texas-case/${facts.slug}`} className="rounded-xl border bg-card p-5 transition hover:border-primary">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Separate editorial</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">Read KTR's position</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">The opinion page states KTR's conclusion and argument. This facts page remains the reference layer underneath it.</p>
        </a>
        <a href="/texas-case/facts" className="rounded-xl border bg-card p-5 transition hover:border-primary">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Reference library</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">Browse all Facts & Framework pages</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Compare the legal and administrative frameworks behind all of The Texas Case topics.</p>
        </a>
      </section>

      <aside className="mt-10 border-t border-border pt-6 text-xs leading-6 text-muted-foreground">
        <strong className="text-foreground">Reference standard:</strong> Laws, agency roles, court rulings, eligibility rules, and program details can change. Follow the linked primary sources for the current controlling record and treat this page as an orientation layer rather than legal advice.
      </aside>
    </article>
  );
}
