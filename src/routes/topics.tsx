import { createFileRoute } from "@tanstack/react-router";
import { CONTENT_PILLARS } from "@/lib/content-pillars";

export const Route = createFileRoute("/topics")({
  head: () => ({
    meta: [
      { title: "Texas Coverage Topics — Keep TX Red Content Pillars" },
      { name: "description", content: "Browse Keep TX Red's core Texas coverage pillars: politics, elections, border security, energy, economy and small business, agriculture, veterans, law enforcement, and the Legislature." },
      { property: "og:title", content: "Texas Coverage Topics — Keep TX Red" },
      { property: "og:description", content: "The core topics Keep TX Red covers consistently across breaking news and evergreen guides." },
      { property: "og:url", content: "https://keeptxred.com/topics" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/topics" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Keep TX Red Content Pillars",
          itemListElement: CONTENT_PILLARS.map((pillar, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: pillar.title,
            url: `https://keeptxred.com${pillar.href}`,
          })),
        }),
      },
    ],
  }),
  component: TopicsPage,
});

function TopicsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Coverage Map</span>
      <h1 className="mt-2 font-display text-5xl md:text-7xl tracking-tight leading-none">Texas Topics We Cover</h1>
      <p className="mt-5 max-w-3xl font-serif text-lg leading-relaxed text-muted-foreground">
        Keep TX Red organizes developing news and evergreen explainers around these core Texas content pillars. Each hub connects the latest reporting to the laws, institutions, elections, industries, and public-policy context behind the story.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CONTENT_PILLARS.map((pillar) => (
          <a key={pillar.slug} href={pillar.href} className="group border-2 border-foreground/10 bg-card p-6 transition-colors hover:border-primary hover:bg-primary/5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Content Pillar</span>
            <h2 className="mt-2 font-display text-2xl tracking-tight group-hover:text-primary">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
            <span className="mt-5 inline-block text-xs font-bold uppercase tracking-widest text-primary">Explore coverage →</span>
          </a>
        ))}
      </div>
    </main>
  );
}
