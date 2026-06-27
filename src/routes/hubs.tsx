import { createFileRoute, Link } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/hubs")({
  head: () => ({
    meta: [
      { title: "Topic Hubs — Keep TX Red" },
      { name: "description", content: "Browse Keep TX Red's three topic hubs — Texas Politics, Texas Economy, and Texas Policy & Law — each anchored by a deep pillar guide." },
      { property: "og:title", content: "Topic Hubs — Keep TX Red" },
    ],
    links: [{ rel: "canonical", href: "/hubs" }],
  }),
  component: HubsIndex,
});

function HubsIndex() {
  return (
    <>
      <PageHero eyebrow="Topic Hubs" title="EVERYTHING ON ONE" highlight="TOPIC" description="Three deep hubs — Politics, Economy, Policy & Law — each anchored by a long pillar guide and 10+ supporting articles." />
      <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-3 gap-5">
        {HUBS.map((h) => (
          <Link key={h.slug} to="/hubs/$slug" params={{ slug: h.slug }} className="block border-2 border-foreground/10 bg-card p-6 hover:border-primary transition-colors">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ {h.eyebrow}</span>
            <h2 className="font-display text-2xl tracking-tight mt-1">{h.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{h.intro}</p>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Open Hub →</span>
          </Link>
        ))}
      </div>
    </>
  );
}