import { Link } from "@tanstack/react-router";
import type { PolicyTracker } from "@/data/policy-trackers";
import { POLITICAL_SEARCH_GUIDES } from "@/data/political-search-guides";
import { relatedIssueGuidesForTracker } from "@/lib/issue-policy-links";
import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { texasDefinedPolicyHandoffFor } from "@/lib/texasdefined-policy-handoffs";

const POLICY_REVIEW_DAYS = 30;
const PERMANENT_HREF_ALIASES: Record<string, string> = {
  "/texas-case/secure-border": "/texas-case/secure-texas-border",
  "/texas-case/facts/secure-border": "/texas-case/facts/secure-texas-border",
  "/texas-case/gun-rights": "/texas-case/gun-rights-over-gun-control",
  "/texas-case/facts/gun-rights": "/texas-case/facts/gun-rights-over-gun-control",
  "/texas-case/protecting-unborn-life": "/texas-case/protect-unborn-life",
  "/texas-case/facts/protecting-unborn-life": "/texas-case/facts/protect-unborn-life",
  "/laws/texas-gun-laws-explained": "/news/texas-gun-laws-explained",
  "/laws/texas-property-tax-laws-explained": "/news/texas-property-tax-laws-explained",
  "/laws/texas-election-laws-explained": "/news/texas-election-laws-explained",
  "/laws/texas-new-laws-2026": "/news/texas-new-laws-2026",
  "/laws/texas-constitution": "/laws",
};

function canonicalPermanentHref(href: string) {
  return PERMANENT_HREF_ALIASES[href] ?? href;
}

function relatedGuides(tracker: PolicyTracker) {
  const keywords = tracker.keywords.map((keyword) => keyword.toLowerCase());
  return POLITICAL_SEARCH_GUIDES
    .filter(isPoliticalReferenceIndexable)
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

function policyIsStale(tracker: PolicyTracker) {
  const reviewed = new Date(`${tracker.updated}T23:59:59-05:00`).getTime();
  return Date.now() - reviewed > POLICY_REVIEW_DAYS * 86_400_000;
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
  const broaderIssueGuides = relatedIssueGuidesForTracker(tracker);
  const practicalCompanion = texasDefinedPolicyHandoffFor(tracker.slug);
  const stale = policyIsStale(tracker);
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

      {stale ? <aside className="mt-5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-6"><strong>Freshness notice:</strong> This tracker has passed KTR's {POLICY_REVIEW_DAYS}-day policy review window. Use the official sources below for the latest controlling law, agency action, or data while the Policy Desk refreshes the page.</aside> : null}

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

      {practicalCompanion ? <section className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">TexasDefined practical companion</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">How this reaches everyday Texas life</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{practicalCompanion.description}</p>
        <a href={practicalCompanion.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-lg border bg-background px-4 py-3 text-sm font-semibold text-primary hover:border-primary">{practicalCompanion.label} →</a>
      </section> : null}

      {broaderIssueGuides.length > 0 ? <section className="mt-10 rounded-xl border bg-primary/5 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Broader evergreen context</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">Related Texas issue guides</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Use these guides for the durable legal, institutional and policy framework behind this narrower tracker.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {broaderIssueGuides.map((guide) => <a key={guide.slug} href={`/issues/${guide.slug}`} className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary">{guide.title} →</a>)}
        </div>
      </section> : null}

      <section className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="font-display text-2xl tracking-tight">Permanent KTR context</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tracker.related.map((item) => {
            const href = canonicalPermanentHref(item.href);
            return <a key={`${item.label}-${href}`} href={href} className="rounded-lg border p-4 text-sm font-semibold text-primary hover:border-primary">{item.label} →</a>;
          })}
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
