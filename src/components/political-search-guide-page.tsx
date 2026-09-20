import { Link } from "@tanstack/react-router";
import type { PoliticalSearchGuide, PoliticalSearchGuideCategory } from "@/data/political-search-guides";
import { POLITICAL_SEARCH_GUIDE_CATEGORY_LABELS } from "@/data/political-search-guides";
import { getGovernmentGraphLinks } from "@/lib/government-graph";
import { buildSeo, SITE_URL } from "@/lib/seo";

const REFRESH_DAYS: Record<PoliticalSearchGuideCategory, number> = {
  races: 7,
  redistricting: 14,
  demographics: 90,
  issues: 30,
  grassroots: 7,
};

function guideIsStale(guide: PoliticalSearchGuide) {
  const reviewed = new Date(`${guide.updated}T23:59:59-05:00`).getTime();
  return Date.now() - reviewed > REFRESH_DAYS[guide.category] * 86_400_000;
}

export function politicalSearchGuideHead(guide: PoliticalSearchGuide) {
  const path = `/texas-political-reference/${guide.slug}`;
  const url = `${SITE_URL}${path}`;
  const seo = buildSeo({
    title: guide.title,
    description: guide.dek,
    path,
    type: "article",
    publishedTime: `${guide.updated}T12:00:00-05:00`,
    modifiedTime: `${guide.updated}T12:00:00-05:00`,
    section: "Texas Political Reference",
    author: "Keep TX Red Reference Desk",
  });
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: guide.title,
    description: guide.dek,
    datePublished: guide.updated,
    dateModified: guide.updated,
    articleSection: POLITICAL_SEARCH_GUIDE_CATEGORY_LABELS[guide.category],
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
      { "@type": "ListItem", position: 2, name: "Texas Politics", item: `${SITE_URL}/texas-politics` },
      { "@type": "ListItem", position: 3, name: "Texas Political Reference", item: `${SITE_URL}/texas-political-reference` },
      { "@type": "ListItem", position: 4, name: guide.title, item: url },
    ],
  };
  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [articleJsonLd, breadcrumbJsonLd].map((value) => ({ type: "application/ld+json", children: JSON.stringify(value) })),
  };
}

export function PoliticalSearchGuidePage({ guide }: { guide: PoliticalSearchGuide }) {
  const graphText = [guide.searchQuery, guide.title, guide.dek, guide.quickAnswer, ...guide.keyFacts, ...guide.context].join(" ");
  const graphLinks = getGovernmentGraphLinks(graphText, 6, [
    `/texas-political-reference/${guide.slug}`,
    ...guide.related.map((item) => item.href),
  ]);
  const stale = guideIsStale(guide);

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/texas-politics" className="hover:text-primary">Texas Politics</Link>
        <span className="mx-2">/</span>
        <a href="/texas-political-reference" className="hover:text-primary">Political Reference</a>
      </nav>

      <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-primary">Texas Political Reference · {POLITICAL_SEARCH_GUIDE_CATEGORY_LABELS[guide.category]}</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.03] tracking-tight md:text-6xl">{guide.title}</h1>
      <p className="mt-5 font-serif text-lg italic leading-snug text-muted-foreground md:text-xl">{guide.dek}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-border py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Keep TX Red Reference Desk</span>
        <span>•</span>
        <span>Reviewed <time dateTime={guide.updated}>{new Date(`${guide.updated}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></span>
      </div>

      {stale ? (
        <aside className="mt-5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-6">
          <strong>Freshness notice:</strong> This is a time-sensitive reference page and has passed KTR's normal {REFRESH_DAYS[guide.category]}-day review window. Verify candidate status, polls, fundraising, court orders, maps, or event dates with the primary sources below while the Reference Desk refreshes the page.
        </aside>
      ) : null}

      <section className="mt-8 border-l-4 border-primary bg-primary/5 p-5 md:p-6" aria-labelledby="quick-answer">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p>
        <h2 id="quick-answer" className="mt-2 font-display text-2xl tracking-tight">What to know</h2>
        <p className="mt-3 text-base font-semibold leading-7">{guide.quickAnswer}</p>
      </section>

      <section className="mt-7 rounded-xl border bg-muted/20 p-5 md:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Current status</p>
        <p className="mt-2 text-sm leading-7">{guide.status}</p>
      </section>

      <section className="mt-10">
        <h2 className="border-b border-border pb-2 font-display text-3xl tracking-tight">Key facts</h2>
        <ul className="mt-5 space-y-3 text-base leading-7">
          {guide.keyFacts.map((fact) => <li key={fact} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{fact}</span></li>)}
        </ul>
      </section>

      <section className="mt-11">
        <h2 className="border-b border-border pb-2 font-display text-3xl tracking-tight">Context</h2>
        <div className="mt-5 space-y-5 font-serif text-base leading-8 text-foreground/95 md:text-[17px]">
          {guide.context.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="mt-11 rounded-xl border bg-card p-6">
        <h2 className="font-display text-2xl tracking-tight">What to watch next</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6">
          {guide.watchFor.map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{item}</span></li>)}
        </ul>
      </section>

      {graphLinks.length > 0 ? (
        <section className="mt-10 rounded-xl border border-primary/25 bg-primary/5 p-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Government Graph</p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">Follow this issue into KTR's permanent coverage</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">This search question is connected to the policy, law, government, election, or legislative pages below. Those pages persist after the daily headline changes.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {graphLinks.map((node) => <a key={node.href} href={node.href} className="rounded-lg border bg-background p-4 text-sm font-semibold hover:border-primary hover:text-primary"><span className="block text-[9px] uppercase tracking-wider text-muted-foreground">{node.kind}</span><span className="mt-1 block">{node.label} →</span></a>)}
          </div>
        </section>
      ) : null}

      <section className="mt-12 border-t border-border pt-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Sources</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">Verify the record</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">For election results, maps, laws, campaign finance, and government data, primary public records take precedence. Supporting reporting is used for context and should not substitute for the controlling official record.</p>
        <ul className="mt-4 space-y-3 text-sm">
          {guide.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a>
              {source.primary ? <span className="ml-2 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Primary</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border bg-card p-6">
        <h2 className="font-display text-2xl tracking-tight">Related Keep TX Red resources</h2>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
          {guide.related.map((item) => <a key={item.href} href={item.href} className="text-primary hover:underline">{item.label} →</a>)}
        </div>
      </section>

      <aside className="mt-10 border-t border-border pt-6 text-xs leading-6 text-muted-foreground">
        <strong className="text-foreground">Reference standard:</strong> Polls, campaign finance, candidates, court orders, maps, event schedules, and officeholder status can change. This page answers the search query <span className="font-semibold text-foreground">“{guide.searchQuery}”</span> using dated sources and does not treat a poll, party target list, campaign claim, fundraising total, or endorsement as a prediction or candidate ranking.
      </aside>
    </article>
  );
}
