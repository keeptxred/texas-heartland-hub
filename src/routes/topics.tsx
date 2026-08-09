import { createFileRoute } from "@tanstack/react-router";
import { CONTENT_PILLARS, getRelatedContentPillars } from "@/lib/content-pillars";

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
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": "https://keeptxred.com/topics#page",
              url: "https://keeptxred.com/topics",
              name: "Keep TX Red Texas Coverage Topics",
              description: "The canonical topic map for Keep TX Red's Texas politics, elections, government, law, economy, energy, border, agriculture, veterans, and public-safety coverage.",
              about: CONTENT_PILLARS.map((pillar) => ({
                "@type": "Thing",
                "@id": `https://keeptxred.com${pillar.href}#topic`,
                name: pillar.title,
                url: `https://keeptxred.com${pillar.href}`,
                description: pillar.description,
              })),
            },
            {
              "@type": "ItemList",
              name: "Keep TX Red Content Pillars",
              itemListElement: CONTENT_PILLARS.map((pillar, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: pillar.title,
                url: `https://keeptxred.com${pillar.href}`,
              })),
            },
          ],
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
        {CONTENT_PILLARS.map((pillar) => {
          const related = getRelatedContentPillars(pillar.slug);
          return (
            <article key={pillar.slug} className="border-2 border-foreground/10 bg-card p-6">
              <a href={pillar.href} className="group block">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Content Pillar</span>
                <h2 className="mt-2 font-display text-2xl tracking-tight group-hover:text-primary">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                <span className="mt-5 inline-block text-xs font-bold uppercase tracking-widest text-primary">Explore coverage →</span>
              </a>

              <div className="mt-5 border-t border-border pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Key subtopics</h3>
                <p className="mt-2 text-xs leading-relaxed text-foreground/80">{pillar.subtopics.join(" · ")}</p>
              </div>

              <nav className="mt-4" aria-label={`Related topics for ${pillar.title}`}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Related coverage</h3>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
                  {related.map((item) => (
                    <a key={item.slug} href={item.href} className="text-primary hover:underline underline-offset-4">
                      {item.shortTitle}
                    </a>
                  ))}
                </div>
              </nav>
            </article>
          );
        })}
      </div>
    </main>
  );
}
