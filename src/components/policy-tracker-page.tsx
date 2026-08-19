import { Link } from "@tanstack/react-router";
import type { PolicyTracker } from "@/data/policy-trackers";
import { POLITICAL_SEARCH_GUIDES } from "@/data/political-search-guides";
import { buildSeo, SITE_URL } from "@/lib/seo";

function relatedGuides(tracker: PolicyTracker) {
  const keywords = tracker.keywords.map((keyword) => keyword.toLowerCase());
  return POLITICAL_SEARCH_GUIDES
    .map((guide) => {
      const text = `${guide.searchQuery} ${guide.title} ${guide.dek} ${guide.quickAnswer}`.toLowerCase();
      const score = keywords.reduce((total, keyword) => total + (text.includes(keyword) ? (keyword.includes(" ") ? 3 : 1) : 0), 0);
      return { guide, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ guide }) => guide);
}

export function policyTrackerHead(tracker: PolicyTracker) {
  const path = `/policy/${tracker.slug}`;
  const url = `${SITE_URL}${path}`;
  const seo = buildSeo({
    title: tracker.title,
    description: tracker.description,
    path,
    type: "article",
    publishedTime: `${tracker.updated}T12:00:00-05:00`,
    modifiedTime: `${tracker.updated}T12:00:00-05:00`,
    section: "Texas Policy Trackers",
    author: "Keep TX Red Policy Desk",
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
          "@id": `${url}#article`,
          headline: tracker.title,
          description: tracker.description,
          datePublished: tracker.updated,
          dateModified: tracker.updated,
          articleSection: "Texas Policy Trackers",
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          author: { "@type": "Organization", name: "Keep TX Red Policy Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          inLanguage: "en-US",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Texas Politics", item: `${SITE_URL}/texas-politics` },
            { "@type": "ListItem", position: 3, name: "Policy Trackers", item: `${SITE_URL}/policy` },
            { "@type": "ListItem", position: 4, name: tracker.shortTitle, item: url },
          ],
        }),
      },
    ],
  };
}

export function PolicyTrackerPage({ tracker }: { tracker: PolicyTracker }) {
  const guides = relatedGuides(tracker);
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link><span className="mx-2">/</span>
        <Link to="/texas-politics" className="hover:text-primary">Texas Politics</Link><span className="mx-2">/</span>
        <a href="/policy" className="hover:text-primary">Policy Trackers</a>
      </nav>

      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Permanent Texas Policy Tracker</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">{tracker.title}</h1>
      <p className="mt-5 font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">{tracker.description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Keep TX Red Policy Desk</span><span>•</span>
        <span>Reviewed <time dateTime={tracker.updated}>{new Date(`${tracker.updated}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></span>
      </div>

      <section className="mt-8 border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p>
        <p className="mt-3 text-base font-semibold leading-7">{tracker.quickAnswer}</p>
      </section>

      <section className="mt-7 rounded-xl border bg-muted/20 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Current policy status</p>
        <p className="mt-2 text-sm leading-7">{tracker.currentStatus}</p>
      </section>

      <section className="mt-10">
        <h2 className="border-b pb-2 font-display text-3xl tracking-tight">Key facts</h2>
        <ul className="mt-5 space-y-3 text-base leading-7">
          {tracker.keyFacts.map((fact) => <li key={fact} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{fact}</span></li>)}
        </ul>
      </section>

      <section className="mt-11">
        <h2 className="border-b pb-2 font-display text-3xl tracking-tight">How to read this issue</h2>
        <div className="mt-5 space-y-5 font-serif text-base leading-8 md:text-[17px]">{tracker.context.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className="mt-11 rounded-xl border bg-card p-6">
        <h2 className="font-display text-2xl tracking-tight">What KTR is watching</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6">{tracker.watchFor.map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{item}</span></li>)}</ul>
      </section>

      <section className="mt-12 border-t pt-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Primary record</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">Official sources</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {tracker.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a>{source.primary ? <span className="ml-2 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Primary</span> : null}</li>)}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="font-display text-2xl tracking-tight">Permanent KTR context</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tracker.related.map((item) => <a key={item.href} href={item.href} className="rounded-lg border p-4 text-sm font-semibold text-primary hover:border-primary">{item.label} →</a>)}
        </div>
      </section>

      {guides.length > 0 ? <section className="mt-10 rounded-xl border bg-muted/20 p-6">
        <h2 className="font-display text-2xl tracking-tight">Related political reference guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{guides.map((guide) => <a key={guide.slug} href={`/texas-political-reference/${guide.slug}`} className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">{guide.title} →</a>)}</div>
      </section> : null}

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Tracker standard:</strong> KTR's editorial position is labeled separately under The Texas Case. This page is the permanent factual and institutional layer: controlling law, government responsibility, official data, current disputes, and what changes next.</aside>
    </article>
  );
}
