import { createFileRoute } from "@tanstack/react-router";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const TITLE = "Texas Policy Trackers | Taxes, Border, Energy, Elections & More";
const DESCRIPTION = "Keep TX Red's permanent Texas policy trackers connect the daily news to laws, agencies, bills, official data, editorial positions, and the questions that keep shaping Texas.";

export const Route = createFileRoute("/policy")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/policy" });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/policy", type: "CollectionPage" })) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Texas Policy Trackers", numberOfItems: ALL_POLICY_TRACKERS.length, itemListElement: ALL_POLICY_TRACKERS.map((tracker, index) => ({ "@type": "ListItem", position: index + 1, name: tracker.title, url: `${SITE_URL}/policy/${tracker.slug}` })) }) },
      ],
    };
  },
  component: PolicyHub,
});

function PolicyHub() {
  return (
    <main className="bg-background">
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Keep TX Red Policy Desk</p>
          <h1 className="mt-4 max-w-5xl font-display text-5xl leading-none tracking-tight md:text-7xl">Texas Policy Trackers</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">The permanent layer beneath the headlines: what Texas law says, who controls the issue, what changed, what KTR believes, and what to watch next.</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">These pages are designed to survive individual news cycles. They connect current reporting to statutes, agencies, bills, official data, Election Central, The Texas Case, and KTR's reference library.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ALL_POLICY_TRACKERS.map((tracker) => (
            <a key={tracker.slug} href={`/policy/${tracker.slug}`} className="group flex h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary hover:shadow-md">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Permanent tracker</p>
              <h2 className="mt-2 font-display text-2xl leading-tight tracking-tight group-hover:text-primary">{tracker.shortTitle}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{tracker.description}</p>
              <div className="mt-5 flex items-center justify-between gap-3 text-xs"><span className="font-bold text-primary">Open tracker →</span><span className="text-muted-foreground">Reviewed {tracker.updated}</span></div>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/25">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <h2 className="font-display text-3xl tracking-tight">Three layers, one issue</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <a href="/texas-case" className="rounded-xl border bg-background p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">Editorial</p><h3 className="mt-2 font-semibold">The Texas Case</h3><p className="mt-2 text-sm text-muted-foreground">What KTR believes and why.</p></a>
            <a href="/policy" className="rounded-xl border bg-background p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">Policy</p><h3 className="mt-2 font-semibold">Policy Trackers</h3><p className="mt-2 text-sm text-muted-foreground">Current law, institutions, facts, disputes, and changes.</p></a>
            <a href="/texas-political-reference" className="rounded-xl border bg-background p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">Search intent</p><h3 className="mt-2 font-semibold">Political Reference</h3><p className="mt-2 text-sm text-muted-foreground">Direct answers to the political questions Texans search for.</p></a>
          </div>
        </div>
      </section>
    </main>
  );
}
