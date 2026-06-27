import { createFileRoute, Link } from "@tanstack/react-router";
import { HUBS } from "@/data/hubs";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/hubs")({
  head: () => ({
    meta: [
      { title: "Sections — Keep TX Red" },
      { name: "description", content: "Browse Keep TX Red's sections — Texas Politics, Texas Economy, and Texas Policy & Law — each with in-depth guides and supporting articles." },
      { property: "og:title", content: "Sections — Keep TX Red" },
    ],
    links: [{ rel: "canonical", href: "/hubs" }],
  }),
  component: HubsIndex,
});

function HubsIndex() {
  return (
    <>
      <PageHero eyebrow="Sections" title="Everything Texans Need to Stay Informed" description="Politics, elections, taxes, and statewide updates—explained clearly and updated regularly." />
      <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-3 gap-5">
        {HUBS.map((h) => (
          <Link key={h.slug} to="/hubs/$slug" params={{ slug: h.slug }} className="block border-2 border-foreground/10 bg-card p-6 hover:border-primary transition-colors">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ {h.eyebrow}</span>
            <h2 className="font-display text-2xl tracking-tight mt-1">{h.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{h.intro}</p>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Open Section →</span>
          </Link>
        ))}
      </div>
    </>
  );
}