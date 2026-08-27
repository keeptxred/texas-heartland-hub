import { createFileRoute, Link } from "@tanstack/react-router";
import {
  POLITICAL_SEARCH_GUIDES,
  POLITICAL_SEARCH_GUIDE_CATEGORY_LABELS,
  type PoliticalSearchGuideCategory,
} from "@/data/political-search-guides";
import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const TITLE = "Texas Political Reference | Races, Maps, Voter Trends & Policy";
const DESCRIPTION = "Keep TX Red's permanent reference library for high-profile Texas races, redistricting, voter trends, policy questions, campaign finance, PACs, grassroots events, and political search topics.";
const CATEGORY_ORDER: PoliticalSearchGuideCategory[] = ["races", "redistricting", "demographics", "issues", "grassroots"];
const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;
const INDEXABLE_POLITICAL_SEARCH_GUIDES = POLITICAL_SEARCH_GUIDES.filter(isPoliticalReferenceIndexable);

export const Route = createFileRoute("/texas-political-reference")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/texas-political-reference" });
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Texas Political Reference",
      numberOfItems: INDEXABLE_POLITICAL_SEARCH_GUIDES.length,
      itemListElement: INDEXABLE_POLITICAL_SEARCH_GUIDES.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        url: `${SITE_URL}/texas-political-reference/${guide.slug}`,
      })),
    };
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/texas-political-reference", type: "CollectionPage" })) },
        { type: "application/ld+json", children: JSON.stringify(itemList) },
      ],
    };
  },
  component: TexasPoliticalReferenceHub,
});

function TexasPoliticalReferenceHub() {
  return (
    <main className="bg-background">
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Keep TX Red Reference Desk</p>
          <h1 className="mt-4 max-w-5xl font-display text-5xl leading-none tracking-tight md:text-7xl">Texas Political Reference</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">Permanent Texas political reference, connected to verified election, government, legal and evidence layers.</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">Reference detail guides appear here only after they meet KTR's source, depth and freshness standards. Use Election Central and the permanent authority libraries below while additional reference guides remain under review.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <a href="/elections/2026" className="rounded-xl border bg-card p-5 transition hover:border-primary">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Live election layer</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">2026 Election Central</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Verified races, candidates, polls, dates, forecasts, voting information, and results.</p>
          </a>
          <a href="/texas-case" className="rounded-xl border bg-card p-5 transition hover:border-primary">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Separate editorial layer</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">The Texas Case</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">KTR's explicitly labeled editorial positions on the principles and policies shaping Texas.</p>
          </a>
          <a href="/texas-case/facts" className="rounded-xl border bg-card p-5 transition hover:border-primary">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Evidence layer</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">Facts & Framework</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Legal and administrative starting points underneath KTR's permanent editorial positions.</p>
          </a>
        </div>
      </section>

      {INDEXABLE_POLITICAL_SEARCH_GUIDES.length > 0 ? CATEGORY_ORDER.map((category) => {
        const guides = INDEXABLE_POLITICAL_SEARCH_GUIDES.filter((guide) => guide.category === category);
        if (guides.length === 0) return null;
        return (
          <section key={category} className="mx-auto max-w-[1180px] px-6 py-10 first:pt-4">
            <div className="mb-6 border-b pb-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Published reference guides</p>
              <h2 className="mt-2 font-display text-4xl tracking-tight">{POLITICAL_SEARCH_GUIDE_CATEGORY_LABELS[category]}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <a key={guide.slug} href={`/texas-political-reference/${guide.slug}`} className="group flex h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary hover:shadow-md">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Search: {guide.searchQuery}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight group-hover:text-primary">{guide.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{guide.dek}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-primary">Read reference →</span>
                    <span className="text-muted-foreground">Updated {guide.updated}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      }) : (
        <section className="mx-auto max-w-[1180px] px-6 py-10">
          <div className="rounded-xl border bg-muted/20 p-6">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Reference review in progress</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">Detail guides are being held to the publication gate</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">No political-reference detail guide currently clears the full indexability standard. KTR keeps those URLs out of public discovery until their source depth, factual context and current-status coverage are strong enough for search.</p>
          </div>
        </section>
      )}

      <section className="mt-8 border-t bg-muted/25">
        <div className="mx-auto max-w-[1180px] px-6 py-14 md:flex md:items-center md:justify-between md:gap-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Go deeper</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">From a search question to the underlying record</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Use KTR's permanent government products to inspect legislation, laws, officeholders, and election records behind these topics.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
            <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary">Bills</Link>
            <Link to="/laws" className="rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary">Laws</Link>
            <Link to="/representatives" className="rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary">Officials</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
