import { createFileRoute } from "@tanstack/react-router";
import { ARTICLES } from "@/data/articles";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Texas Political News — Keep TX Red" },
      { name: "description", content: "Conservative news from Austin to the border — legislature, border, energy, education, and tax policy from the Lone Star State." },
      { property: "og:title", content: "Texas Political News — Keep TX Red" },
      { property: "og:description", content: "Conservative reporting on Texas politics, legislation, and policy." },
      { property: "og:url", content: "/news" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: NewsPage,
});

const CATS = ["All", "Legislature", "Border", "Elections", "Tax & Spending", "Energy", "Education"] as const;

function NewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Newsroom</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Texas Political News</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Independent conservative reporting on the legislature, border security, energy, education, and the tax fights that matter to Texas families.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATS.map((c, i) => (
          <button
            key={c}
            className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 border ${
              i === 0
                ? "bg-foreground text-background border-foreground"
                : "border-border hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {ARTICLES.map((a) => (
          <article key={a.slug} className="group cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
              <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
            <h2 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.dek}</p>
            <p className="mt-2 text-[11px] text-muted-foreground italic">{a.author} • {a.date}</p>
          </article>
        ))}
      </div>
    </div>
  );
}