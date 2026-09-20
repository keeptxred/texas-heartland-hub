import { Link } from "@tanstack/react-router";
import type { LawTopic } from "@/data/law-topics";
import { buildSeo, SITE_URL } from "@/lib/seo";

export function lawTopicHead(topic: LawTopic) {
  const path = `/laws/topic/${topic.slug}`;
  const url = `${SITE_URL}${path}`;
  const seo = buildSeo({ title: topic.title, description: topic.dek, path, type: "article", publishedTime: `${topic.updated}T12:00:00-05:00`, modifiedTime: `${topic.updated}T12:00:00-05:00`, section: "Texas Law Library", author: "Keep TX Red Law Desk" });
  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: topic.title, description: topic.dek, datePublished: topic.updated, dateModified: topic.updated, articleSection: "Texas Law Library", mainEntityOfPage: { "@type": "WebPage", "@id": url }, author: { "@type": "Organization", name: "Keep TX Red Law Desk", url: `${SITE_URL}/about` }, publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Texas Laws", item: `${SITE_URL}/laws` }, { "@type": "ListItem", position: 3, name: "Law Topics", item: `${SITE_URL}/laws/topics` }, { "@type": "ListItem", position: 4, name: topic.title, item: url }] }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: topic.questions.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }) },
    ],
  };
}

export function LawTopicPage({ topic }: { topic: LawTopic }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"><Link to="/">Home</Link><span className="mx-2">/</span><Link to="/laws">Texas Laws</Link><span className="mx-2">/</span><a href="/laws/topics">Law Topics</a></nav>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Texas Law Library</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">{topic.title}</h1>
      <p className="mt-5 font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">{topic.dek}</p>
      <div className="mt-6 border-y py-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Keep TX Red Law Desk</span><span className="mx-2">•</span>Reviewed {new Date(`${topic.updated}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>

      <section className="mt-8 border-l-4 border-primary bg-primary/5 p-6"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p><p className="mt-3 text-base font-semibold leading-7">{topic.quickAnswer}</p></section>

      <section className="mt-10"><h2 className="border-b pb-2 font-display text-3xl tracking-tight">Who this law can affect</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{topic.appliesTo.map((item) => <div key={item} className="rounded-lg border bg-card p-4 text-sm font-semibold">{item}</div>)}</div></section>

      <section className="mt-11"><h2 className="border-b pb-2 font-display text-3xl tracking-tight">Legal framework</h2><div className="mt-5 space-y-5 font-serif text-base leading-8 md:text-[17px]">{topic.framework.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>

      <section className="mt-11 rounded-xl border bg-card p-6"><h2 className="font-display text-2xl tracking-tight">Key rules to know</h2><ul className="mt-4 space-y-3 text-sm leading-6">{topic.keyRules.map((rule) => <li key={rule} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{rule}</span></li>)}</ul></section>

      <section className="mt-11"><h2 className="border-b pb-2 font-display text-3xl tracking-tight">Common questions</h2><div className="mt-5 space-y-5">{topic.questions.map((item) => <div key={item.q}><h3 className="font-semibold">{item.q}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.a}</p></div>)}</div></section>

      <section className="mt-12 border-t pt-8"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Primary law</p><h2 className="mt-2 font-display text-2xl tracking-tight">Official sources</h2><ul className="mt-4 space-y-3 text-sm">{topic.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a>{source.note ? <span className="ml-2 text-muted-foreground">— {source.note}</span> : null}</li>)}</ul></section>

      <section className="mt-10 rounded-xl border bg-muted/20 p-6"><h2 className="font-display text-2xl tracking-tight">Related KTR coverage</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{topic.related.map((item) => <a key={item.href} href={item.href} className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">{item.label} →</a>)}</div></section>

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Legal-information standard:</strong> This page explains the statutory framework and is not legal advice. Statutes, court decisions, agency rules, and facts can change the result in an individual matter. Use the linked official law and qualified counsel for case-specific advice.</aside>
    </article>
  );
}
