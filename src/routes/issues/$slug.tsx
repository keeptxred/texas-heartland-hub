import { createFileRoute, notFound } from "@tanstack/react-router";
import { issueGuideBySlug, type IssueGuide } from "@/data/issue-guides";
import { relatedPolicyTrackersForIssueGuide } from "@/lib/issue-policy-links";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";

const SITE_URL = "https://keeptxred.com";

const CATEGORY_HUBS: Record<string, Array<{ label: string; href: string }>> = {
  "Energy & Environment": [
    { label: "Texas Energy", href: "/texas-energy" },
    { label: "Texas Legislature", href: "/texas-legislature" },
  ],
  "Border Security & Immigration": [
    { label: "Texas Border Security", href: "/texas-border-security" },
    { label: "Texas Government", href: "/texas-government" },
  ],
  "Economy & Fiscal Policy": [
    { label: "Texas Economy", href: "/texas-economy" },
    { label: "Texas Business", href: "/texas-business" },
  ],
  "Education & Parental Rights": [
    { label: "Texas Legislature", href: "/texas-legislature" },
    { label: "Texas Laws", href: "/laws" },
  ],
  "Constitutional Rights & Law Enforcement": [
    { label: "Texas Law Enforcement", href: "/texas-law-enforcement" },
    { label: "Texas Laws", href: "/laws" },
  ],
  "Election Integrity & Governance": [
    { label: "Election Central", href: "/elections" },
    { label: "Texas Government", href: "/texas-government" },
  ],
  "Healthcare, Social Issues & Rural Life": [
    { label: "Texas Agriculture", href: "/texas-agriculture" },
    { label: "Texas Government", href: "/texas-government" },
  ],
};

const GUIDE_TOOL_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  "texas-property-tax-relief": [
    { label: "Texas spending-growth calculator", href: "/tools/texas-spending-growth-cap" },
    { label: "Texas policy tools", href: "/tools" },
  ],
  "texas-economy-no-income-tax": [
    { label: "Texas spending-growth calculator", href: "/tools/texas-spending-growth-cap" },
    { label: "Texas tax-structure comparison", href: "/tools/texas-tax-structure-comparison" },
    { label: "Texas Rainy Day Fund explorer", href: "/tools/texas-rainy-day-fund" },
    { label: "Texas budget headroom calculator", href: "/tools/texas-budget-headroom" },
    { label: "All Texas policy tools", href: "/tools" },
  ],
  "texas-election-law": [
    { label: "Election Central", href: "/elections" },
    { label: "Bill finder", href: "/civic-tools/bill-finder" },
  ],
  "texas-school-choice-esas": [{ label: "Bill finder", href: "/civic-tools/bill-finder" }],
  "texas-dei-higher-education": [{ label: "Bill finder", href: "/civic-tools/bill-finder" }],
  "texas-medical-transition-minors-law": [{ label: "Texas law finder", href: "/civic-tools/texas-law-finder" }],
  "texas-state-federal-power": [{ label: "Government authority finder", href: "/civic-tools/government-authority-finder" }],
  "texas-abortion-law-pro-life-policy": [
    { label: "Texas law finder", href: "/civic-tools/texas-law-finder" },
    { label: "Bill finder", href: "/civic-tools/bill-finder" },
  ],
  "texas-bail-criminal-justice": [
    { label: "Texas law finder", href: "/civic-tools/texas-law-finder" },
    { label: "Government authority finder", href: "/civic-tools/government-authority-finder" },
  ],
  "texas-rural-healthcare": [
    { label: "Government authority finder", href: "/civic-tools/government-authority-finder" },
    { label: "Texas law finder", href: "/civic-tools/texas-law-finder" },
  ],
  "texas-local-preemption-home-rule": [
    { label: "Government authority finder", href: "/civic-tools/government-authority-finder" },
    { label: "Bill finder", href: "/civic-tools/bill-finder" },
  ],
};

const GUIDE_AUTHORITY_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  "texas-local-government-handbook": [
    { label: "Texas county government history", href: "/texas-government/texas-county-government-history" },
    { label: "Commissioners court history and powers", href: "/texas-government/commissioners-court-history" },
    { label: "Texas county judge", href: "/texas-government/county-judge-history" },
    { label: "Texas county sheriff", href: "/texas-government/county-sheriff-history" },
    { label: "County and district clerks", href: "/texas-government/county-district-clerk-history" },
    { label: "Justices of the peace and constables", href: "/texas-government/justice-of-the-peace-constable-history" },
  ],
};

export const Route = createFileRoute("/issues/$slug")({
  loader: ({ params }): IssueGuide => {
    const guide = issueGuideBySlug[params.slug];
    if (!guide) throw notFound();
    return guide;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Texas Policy Guide Not Found | Keep TX Red" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }
    const guide = loaderData;
    const title = `${guide.title} | Keep TX Red`;
    const description = guide.dek;
    const pageUrl = `${SITE_URL}/issues/${guide.slug}`;
    const robots = isIssueGuideIndexable(guide)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: robots },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.dek,
          url: pageUrl,
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          about: guide.category,
          isPartOf: { "@type": "CollectionPage", name: "Texas Issues & Policy Guides", url: `${SITE_URL}/issues` },
        }),
      }],
    };
  },
  component: IssueGuidePage,
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="font-display text-5xl">Guide not found</h1>
      <p className="mt-4 text-muted-foreground">This Texas policy guide is not available.</p>
      <a href="/issues" className="mt-6 inline-block font-semibold text-primary underline">Browse Texas issue guides</a>
    </main>
  ),
});

function IssueGuidePage() {
  const guide = Route.useLoaderData();
  const slug = guide.slug;
  const toolLinks = [...(guide.toolLinks ?? []), ...(GUIDE_TOOL_LINKS[slug] ?? [])]
    .filter((link, index, links) => links.findIndex((candidate) => candidate.href === link.href) === index);
  const authorityLinks = GUIDE_AUTHORITY_LINKS[slug] ?? [];
  const hubLinks = CATEGORY_HUBS[guide.category] ?? [];
  const policyTrackers = relatedPolicyTrackersForIssueGuide(guide);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0">
          <nav className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" aria-label="Breadcrumb">
            <a href="/issues" className="hover:text-primary">Texas Issues</a> <span aria-hidden="true">/</span> {guide.category}
          </nav>
          <header className="mt-5">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ {guide.category}</span>
            <h1 className="mt-2 font-display text-4xl leading-[0.95] tracking-tight md:text-6xl">{guide.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{guide.dek}</p>
          </header>

          <section className="mt-8 border-l-4 border-primary bg-muted/40 p-5" aria-labelledby="quick-answer">
            <h2 id="quick-answer" className="font-display text-2xl tracking-tight">Quick Answer</h2>
            <p className="mt-2 leading-relaxed">{guide.quickAnswer}</p>
          </section>

          <div className="mt-10 space-y-10">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-3xl tracking-tight">{section.heading}</h2>
                <div className="mt-3 space-y-4 text-base leading-7 text-muted-foreground">
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>

          {toolLinks.length ? (
            <section className="mt-12 border-y py-7">
              <h2 className="font-display text-3xl tracking-tight">Related KTR tools</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {toolLinks.map((link) => (
                  <a key={link.href} href={link.href} className="border px-4 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary">{link.label} →</a>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-12" aria-labelledby="primary-sources">
            <h2 id="primary-sources" className="font-display text-3xl tracking-tight">Primary sources</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use these official sources to check the law, agency responsibility, or bill text behind this guide. Links to legislation point to official Texas Legislature Online or government sources.</p>
            <ul className="mt-4 space-y-3">
              {guide.sources.map((source) => (
                <li key={source.url} className="border-l-2 pl-4">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2">{source.label}</a>
                  {source.note ? <p className="mt-1 text-sm text-muted-foreground">{source.note}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="space-y-7 lg:sticky lg:top-24 lg:self-start">
          {authorityLinks.length ? (
            <section className="border border-primary/30 bg-primary/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Institutional authority layer</p>
              <h2 className="mt-1 font-display text-2xl tracking-tight">Local government authority</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Go deeper on the constitutional history, legal boundaries and election structure of Texas county and precinct offices.</p>
              <div className="mt-4 space-y-3">
                {authorityLinks.map((link) => (
                  <a key={link.href} href={link.href} className="block border-b pb-3 text-sm font-semibold last:border-0 last:pb-0 hover:text-primary">{link.label} →</a>
                ))}
              </div>
              <a href="/texas-government" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Texas government authority hub →</a>
            </section>
          ) : null}

          {policyTrackers.length ? (
            <section className="border border-primary/30 bg-primary/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Current-status layer</p>
              <h2 className="mt-1 font-display text-2xl tracking-tight">Related policy trackers</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Move from this durable explainer into narrower trackers for current law, implementation, litigation and official data.</p>
              <div className="mt-4 space-y-3">
                {policyTrackers.map((tracker) => (
                  <a key={tracker.slug} href={`/policy/${tracker.slug}`} className="block border-b pb-3 text-sm font-semibold last:border-0 last:pb-0 hover:text-primary">
                    {tracker.shortTitle} →
                  </a>
                ))}
              </div>
              <a href="/policy" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">All policy trackers →</a>
            </section>
          ) : null}

          <section className="border p-5">
            <h2 className="font-display text-2xl tracking-tight">Related issue guides</h2>
            <div className="mt-4 space-y-4">
              {guide.relatedSlugs.map((relatedSlug) => {
                const related = issueGuideBySlug[relatedSlug];
                if (!related || !isIssueGuideIndexable(related)) return null;
                return (
                  <a key={relatedSlug} href={`/issues/${relatedSlug}`} className="block border-b pb-4 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{related.category}</span>
                    <span className="mt-1 block font-semibold leading-snug hover:text-primary">{related.title}</span>
                  </a>
                );
              })}
            </div>
          </section>

          {hubLinks.length ? (
            <section className="border p-5">
              <h2 className="font-display text-2xl tracking-tight">Explore this topic</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Move between this evergreen explainer and KTR's broader reporting, government, law and election resources.</p>
              <div className="mt-4 space-y-3">
                {hubLinks.map((link) => <a key={link.href} href={link.href} className="block text-sm font-semibold text-primary hover:underline">{link.label} →</a>)}
                <a href="/topics" className="block text-sm font-semibold text-primary hover:underline">All coverage topics →</a>
                <a href="/civic-tools" className="block text-sm font-semibold text-primary hover:underline">Civic tools →</a>
                <a href="/tools" className="block text-sm font-semibold text-primary hover:underline">Policy tools →</a>
              </div>
            </section>
          ) : null}

          <section className="border p-5">
            <h2 className="font-display text-2xl tracking-tight">Follow the live story</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Evergreen guides explain the rules. KTR news coverage tracks new bills, lawsuits, agency actions, elections and political fights as they happen.</p>
            <a href="/news" className="mt-4 inline-block text-sm font-semibold text-primary">Latest Texas news →</a>
          </section>
        </aside>
      </div>
    </main>
  );
}
