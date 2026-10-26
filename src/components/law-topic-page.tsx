import { Link } from "@tanstack/react-router";
import { LegalHelpResources } from "@/components/laws/legal-help-resources";
import type { LawTopic } from "@/data/law-topics";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { publicSupportingGuidesForAuthority } from "@/lib/law-authority-crosslinks";
import { publicEditorialArticlesForLawTopic } from "@/lib/editorial-law-authority-links";

export function lawTopicHead(topic: LawTopic) {
  const path = `/laws/topic/${topic.slug}`;
  const url = `${SITE_URL}${path}`;
  const seo = buildSeo({ title: topic.title, description: topic.dek, path, type: "article", publishedTime: topic.published ? `${topic.published}T12:00:00-05:00` : undefined, modifiedTime: `${topic.updated}T12:00:00-05:00`, section: "Texas Law Library", author: "Keep TX Red Law Desk" });
  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: topic.title, description: topic.dek, ...(topic.published ? { datePublished: topic.published } : {}), dateModified: topic.updated, articleSection: "Texas Law Library", citation: topic.sources.map((source) => source.url), isPartOf: { "@type": "CollectionPage", "@id": `${SITE_URL}/laws/topics` }, mainEntityOfPage: { "@type": "WebPage", "@id": url }, author: { "@type": "Organization", name: "Keep TX Red Law Desk", url: `${SITE_URL}/about` }, publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Texas Laws", item: `${SITE_URL}/laws` }, { "@type": "ListItem", position: 3, name: "Law Topics", item: `${SITE_URL}/laws/topics` }, { "@type": "ListItem", position: 4, name: topic.title, item: url }] }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: topic.questions.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }) },
    ],
  };
}

export function LawTopicPage({ topic }: { topic: LawTopic }) {
  const supportingGuides = publicSupportingGuidesForAuthority(topic.slug);
  const editorials = publicEditorialArticlesForLawTopic(topic.slug);
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <Link to="/" className="inline-flex min-h-11 items-center rounded px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Home</Link>
        <span className="mx-1" aria-hidden="true">/</span>
        <Link to="/laws" className="inline-flex min-h-11 items-center rounded px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Texas Laws</Link>
        <span className="mx-1" aria-hidden="true">/</span>
        <a href="/laws/topics" className="inline-flex min-h-11 items-center rounded px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Law Topics</a>
      </nav>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Texas Law Library</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">{topic.title}</h1>
      <p className="mt-5 font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">{topic.dek}</p>
      <div className="mt-6 border-y py-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Keep TX Red Law Desk</span><span className="mx-2">•</span>Reviewed {new Date(`${topic.updated}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>

      <nav aria-label="Related Texas law resources" className="mt-7 flex flex-wrap gap-3 text-sm">
        <Link to="/laws" className="inline-flex min-h-11 items-center rounded-lg border px-4 py-2 font-semibold hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Texas laws hub</Link>
        <Link to="/laws/topics" className="inline-flex min-h-11 items-center rounded-lg border px-4 py-2 font-semibold hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">All law topics</Link>
        <a href="/civic-tools/texas-law-finder" className="inline-flex min-h-11 items-center rounded-lg border px-4 py-2 font-semibold hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Texas law finder</a>
        <a href="https://statutes.capitol.texas.gov/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg border px-4 py-2 font-semibold hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Official Texas statutes ↗</a>
      </nav>
      <aside className="mt-7 border-l-4 border-border bg-muted/20 p-5 text-sm leading-7 text-muted-foreground" aria-label="Understanding legal status">
        <strong className="text-foreground">How to use this guide:</strong> A bill is a proposal until enacted. A statute, agency rule, court decision, and local ordinance may have different effective dates and scopes. Refer to the official sources below for controlling language, and check the individual law's effective date before relying on a summary.
      </aside>

      <nav aria-label="On this page" className="mt-8 rounded-xl border bg-card p-5">
        <h2 className="font-display text-xl tracking-tight">On this page</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {[
            ["Quick answer", "#law-quick-answer"],
            ["Who this affects", "#law-who-affected"],
            ["Legal framework", "#law-framework"],
            ["Key rules", "#law-key-rules"],
            ["Common questions", "#law-questions"],
            ["Official sources", "#law-sources"],
            ["Related guides", "#law-related"],
          ].map(([name, href]) => (
            <li key={href}><a href={href} className="inline-flex min-h-11 items-center rounded px-3 py-2 font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{name} →</a></li>
          ))}
        </ul>
      </nav>

      <section id="law-quick-answer" className="mt-8 scroll-mt-24 border-l-4 border-primary bg-primary/5 p-6"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p><p className="mt-3 text-base font-semibold leading-7">{topic.quickAnswer}</p></section>

      <section id="law-who-affected" className="mt-10 scroll-mt-24"><h2 className="border-b pb-2 font-display text-3xl tracking-tight">Who this law can affect</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{topic.appliesTo.map((item) => <div key={item} className="rounded-lg border bg-card p-4 text-sm font-semibold">{item}</div>)}</div></section>

      <section id="law-framework" className="mt-11 scroll-mt-24"><h2 className="border-b pb-2 font-display text-3xl tracking-tight">Legal framework</h2><div className="mt-5 space-y-5 font-serif text-base leading-8 md:text-[17px]">{topic.framework.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>

      <section id="law-key-rules" className="mt-11 scroll-mt-24 rounded-xl border bg-card p-6"><h2 className="font-display text-2xl tracking-tight">Key rules to know</h2><ul className="mt-4 space-y-3 text-sm leading-6">{topic.keyRules.map((rule) => <li key={rule} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{rule}</span></li>)}</ul></section>

      <section id="law-questions" className="mt-11 scroll-mt-24"><h2 className="border-b pb-2 font-display text-3xl tracking-tight">Common questions</h2><div className="mt-5 space-y-5">{topic.questions.map((item) => <div key={item.q}><h3 className="font-semibold">{item.q}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.a}</p></div>)}</div></section>

      <section id="law-sources" className="mt-12 scroll-mt-24 border-t pt-8"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Primary law</p><h2 className="mt-2 font-display text-2xl tracking-tight">Official sources</h2><ul className="mt-4 space-y-3 text-sm">{topic.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded px-2 py-2 font-semibold text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{source.label}</a>{source.note ? <span className="ml-2 text-muted-foreground">— {source.note}</span> : null}</li>)}</ul></section>

      {supportingGuides.length > 0 ? (
        <section className="mt-12 border-t pt-8" aria-labelledby="law-supporting-guides-heading">
          <h2 id="law-supporting-guides-heading" className="font-display text-2xl tracking-tight">Explore detailed guides on this law</h2>
          <p className="mt-2 text-sm text-muted-foreground">These individual guides meet the site's verified law-reference and publication requirements. Refer back to the official law above for controlling text.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {supportingGuides.map((guide) => (
              <a key={guide.slug} href={guide.href} className="rounded-lg border bg-card p-4 hover:border-primary hover:bg-primary/5">
                <span className="text-sm font-semibold text-primary">{guide.title} →</span>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">{guide.description}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {editorials.length > 0 ? (
        <section className="mt-10 border-t pt-8" aria-labelledby="law-editorial-coverage-heading">
          <h2 id="law-editorial-coverage-heading" className="font-display text-2xl tracking-tight">Related Texas law reporting and explainers</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Editorial explanations provide historical and policy context. Confirm current legal requirements using the official source material above.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {editorials.map((item) => (
              <a key={item.slug} href={item.href} className="rounded-lg border bg-card p-4 hover:border-primary hover:bg-primary/5">
                <span className="text-sm font-semibold text-primary">{item.title} →</span>
                <span className="mt-2 block text-xs leading-5 text-muted-foreground">{item.dek}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section id="law-related" className="mt-10 scroll-mt-24 rounded-xl border bg-muted/20 p-6"><h2 className="font-display text-2xl tracking-tight">Related KTR coverage</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{topic.related.map((item) => <a key={item.href} href={item.href} className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">{item.label} →</a>)}</div></section>

      <LegalHelpResources />

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Legal-information standard:</strong> This page explains the statutory framework and is not legal advice. Statutes, court decisions, agency rules, and facts can change the result in an individual matter. Use the linked official law and qualified counsel for case-specific advice.</aside>
    </article>
  );
}
