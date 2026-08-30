import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getAgencyAuthorityProfile } from "@/data/agency-authority";
import { getExtraAgencyAuthorityProfile } from "@/data/agency-authority-extra";
import { upgradeAgencyAuthorityProfile } from "@/data/agency-authority-upgrades";
import { getAgencyAuthoritySupplement } from "@/data/agency-authority-supplements";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { isAgencyAuthorityIndexable } from "@/lib/agency-authority-indexability";
import { getAgencyRelatedAuthorityLinks } from "@/lib/agency-related-authority";

export const Route = createFileRoute("/texas-government/agencies/$agencySlug")({
  loader: ({ params }) => {
    const baseProfile = getAgencyAuthorityProfile(params.agencySlug) ?? getExtraAgencyAuthorityProfile(params.agencySlug);
    if (!baseProfile) throw notFound();
    return upgradeAgencyAuthorityProfile(baseProfile);
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ name: "robots", content: "noindex,follow" }] };
    const path = `/texas-government/agencies/${loaderData.slug}`;
    const seo = buildSeo({
      title: `${loaderData.name}: Authority, Responsibilities & Oversight`,
      description: loaderData.dek,
      path,
      type: "article",
      publishedTime: `${loaderData.reviewed}T12:00:00-05:00`,
      modifiedTime: `${loaderData.reviewed}T12:00:00-05:00`,
      section: "Texas Government Authority",
      author: "Keep TX Red Government Desk",
    });
    const robots = isAgencyAuthorityIndexable(loaderData)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    const canonical = `${SITE_URL}${path}`;
    return {
      meta: seo.meta.map((item) => item.name === "robots" ? { ...item, content: robots } : item),
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "@id": `${canonical}#article`,
                headline: `${loaderData.name}: Authority, Responsibilities & Oversight`,
                description: loaderData.dek,
                datePublished: loaderData.reviewed,
                dateModified: loaderData.reviewed,
                author: { "@type": "Organization", name: "Keep TX Red Government Desk", url: `${SITE_URL}/about` },
                publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
                mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
                about: { "@type": "GovernmentOrganization", name: loaderData.name, url: loaderData.sources[0]?.url },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "Texas Government", item: `${SITE_URL}/texas-government` },
                  { "@type": "ListItem", position: 3, name: "Agencies", item: `${SITE_URL}/texas-government/agencies` },
                  { "@type": "ListItem", position: 4, name: loaderData.shortName, item: canonical },
                ],
              },
            ],
          }).replace(/</g, "\\u003c"),
        },
      ],
    };
  },
  component: AgencyAuthorityPage,
});

function AgencyAuthorityPage() {
  const profile = Route.useLoaderData();
  const supplements = getAgencyAuthoritySupplement(profile.slug);
  const relatedLinks = getAgencyRelatedAuthorityLinks(profile.slug, profile.related);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / <Link to="/texas-government/agencies">Agencies</Link> / {profile.shortName}
      </nav>

      <header className="mt-6 border-b pb-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Permanent government authority profile</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">{profile.name}</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-muted-foreground">{profile.dek}</p>
        <p className="mt-5 text-xs text-muted-foreground">Reviewed {new Date(`${profile.reviewed}T12:00:00-05:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </header>

      <section className="mt-8 border-l-4 border-primary bg-primary/5 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p>
        <p className="mt-3 text-base font-semibold leading-7">{profile.quickAnswer}</p>
      </section>

      <section className="mt-10">
        <h2 className="border-b pb-2 font-display text-3xl tracking-tight">Where its authority comes from</h2>
        <p className="mt-5 font-serif text-[17px] leading-8">{profile.authority}</p>
        {supplements.length ? <div className="mt-5 space-y-4">{supplements.map((item) => <p key={item} className="font-serif text-[17px] leading-8">{item}</p>)}</div> : null}
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-2xl tracking-tight">What it controls</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6">{profile.responsibilities.map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{item}</span></li>)}</ul>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-2xl tracking-tight">What it does not control</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6">{profile.notResponsibleFor.map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">•</span><span>{item}</span></li>)}</ul>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-muted/20 p-6">
          <h2 className="font-display text-2xl tracking-tight">Programs and functions</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6">{profile.programs.map((item) => <li key={item}>• {item}</li>)}</ul>
        </div>
        <div className="rounded-xl border bg-muted/20 p-6">
          <h2 className="font-display text-2xl tracking-tight">How it is accountable</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6">{profile.accountability.map((item) => <li key={item}>• {item}</li>)}</ul>
        </div>
      </section>

      <section className="mt-10 rounded-xl border p-6">
        <h2 className="font-display text-2xl tracking-tight">Related KTR authority pages</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{relatedLinks.map((item) => <a key={item.href} href={item.href} className="rounded-lg border p-4 text-sm font-semibold text-primary hover:border-primary">{item.label} →</a>)}</div>
      </section>

      <section className="mt-10 border-t pt-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">Primary record</p>
        <h2 className="mt-2 font-display text-2xl tracking-tight">Official sources</h2>
        <ul className="mt-4 space-y-3 text-sm">{profile.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">{source.label}</a>{source.primary ? <span className="ml-2 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Primary</span> : null}</li>)}</ul>
      </section>

      <aside className="mt-10 border-t pt-6 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">Authority standard:</strong> This page separates statutory or institutional authority from political claims about the agency. Current disputes and proposals belong in linked policy, bill, law and newsroom pages; the controlling official sources remain linked above.</aside>
    </main>
  );
}
