import { createFileRoute } from "@tanstack/react-router";
import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { POLICY_TRACKERS_WAVE2 } from "@/data/policy-trackers-wave2";
import { POLICY_TRACKERS_WAVE3 } from "@/data/policy-trackers-wave3";
import { POLICY_TRACKERS_WAVE4 } from "@/data/policy-trackers-wave4";
import { POLICY_TRACKERS_WAVE5 } from "@/data/policy-trackers-wave5";
import { POLICY_TRACKERS_WAVE6 } from "@/data/policy-trackers-wave6";
import { POLICY_TRACKERS_WAVE7 } from "@/data/policy-trackers-wave7";
import { POLICY_TRACKERS_WAVE8 } from "@/data/policy-trackers-wave8";
import { POLICY_TRACKERS_WAVE9 } from "@/data/policy-trackers-wave9";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const TITLE = "Texas Policy Trackers | Taxes, Border, Energy, Elections & More";
const DESCRIPTION = "Keep TX Red's permanent Texas policy trackers connect the daily news to laws, agencies, bills, official data, editorial positions, and the questions that keep shaping Texas.";
const ALL_POLICY_TRACKERS = [...POLICY_TRACKERS, ...POLICY_TRACKERS_WAVE2, ...POLICY_TRACKERS_WAVE3, ...POLICY_TRACKERS_WAVE4, ...POLICY_TRACKERS_WAVE5, ...POLICY_TRACKERS_WAVE6, ...POLICY_TRACKERS_WAVE7, ...POLICY_TRACKERS_WAVE8, ...POLICY_TRACKERS_WAVE9];

const AUTHORITY_LAYERS = [
  { href: "/issues", eyebrow: "Evergreen context", title: "Issue Guides", text: "Broad, source-first explanations of the durable Texas policy framework behind recurring headlines." },
  { href: "/policy", eyebrow: "Current status", title: "Policy Trackers", text: "Narrower laws, implementation, litigation, agencies, official data and what to watch next." },
  { href: "/tools", eyebrow: "Arithmetic", title: "Policy Tools", text: "Transparent calculators and scenario explorers that expose assumptions instead of hiding them." },
  { href: "/civic-tools", eyebrow: "Primary-source navigation", title: "Civic Tools", text: "Find the controlling law, bill, government authority or elected official behind a policy claim." },
  { href: "/news", eyebrow: "Live event", title: "Texas News", text: "Follow the bill, ruling, campaign, agency action or political fight as it happens." },
] as const;

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
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">The current-status layer beneath the headlines: what Texas law says, who controls the issue, what changed, what KTR believes, and what to watch next.</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">Use a broader Issue Guide when you need durable background. Use a tracker when you need the narrower law, agency, litigation or implementation status. From there, move into source-finding tools, calculators or live reporting instead of duplicating the same answer across multiple pages.</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
            <a href="/issues" className="text-primary hover:underline">Browse Issue Guides →</a>
            <a href="/tools" className="text-primary hover:underline">Use Policy Tools →</a>
            <a href="/civic-tools" className="text-primary hover:underline">Find primary sources →</a>
          </div>
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
          <h2 className="font-display text-3xl tracking-tight">Five layers, one issue</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">KTR separates durable explanation, current policy status, arithmetic, primary-source navigation and breaking reporting so each URL has a distinct job.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {AUTHORITY_LAYERS.map((layer) => (
              <a key={layer.href} href={layer.href} className="rounded-xl border bg-background p-5 transition hover:border-primary">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{layer.eyebrow}</p>
                <h3 className="mt-2 font-semibold">{layer.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{layer.text}</p>
              </a>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold">
            <a href="/texas-case" className="text-primary hover:underline">Editorial positions: The Texas Case →</a>
            <a href="/texas-political-reference" className="text-primary hover:underline">Search-intent answers: Political Reference →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
