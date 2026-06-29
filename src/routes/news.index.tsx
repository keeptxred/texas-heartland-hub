import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import capitol from "@/assets/capitol.jpg";
import border from "@/assets/border.jpg";
import ballot from "@/assets/ballot.jpg";
import suburb from "@/assets/suburb.jpg";
import podium from "@/assets/podium.jpg";
import oil from "@/assets/article-oil.jpg";
import classroom from "@/assets/article-classroom.jpg";

export const Route = createFileRoute("/news/")({
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
  loader: () => getDailyArticles(),
  component: NewsPage,
});

const CATS = ["All", "Legislature", "Border", "Elections", "Tax & Spending", "Energy", "Education"] as const;

const CATEGORY_IMAGES: Record<string, string> = {
  Legislature: capitol,
  Border: border,
  Elections: ballot,
  "Tax & Spending": suburb,
  Energy: oil,
  Education: classroom,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function NewsPage() {
  const { articles } = Route.useLoaderData();
  const useLive = articles.length > 0;
  const [activeCat, setActiveCat] = useState<(typeof CATS)[number]>("All");

  const filteredLive = useMemo(
    () => (activeCat === "All" ? articles : articles.filter((a: DailyArticle) => a.category === activeCat)),
    [articles, activeCat]
  );
  const filteredStatic = useMemo(
    () => {
      const live = ARTICLES.filter((a) => isPublished(a)).sort(sortByDateDesc);
      return activeCat === "All" ? live : live.filter((a) => a.category === activeCat);
    },
    [activeCat]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Newsroom</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Texas Political News</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Independent conservative reporting on the legislature, border security, energy, education, and the tax fights that matter to Texas families. Updated every morning at 2:00 AM Central.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCat(c)}
            className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 border ${
              c === activeCat
                ? "bg-foreground text-background border-foreground"
                : "border-border hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {useLive
          ? filteredLive.map((a: DailyArticle) => {
              const img = a.image_url || CATEGORY_IMAGES[a.category] || capitol;
              const isEvergreen = a.kind === "evergreen";
              const card = (
                <>
                  <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                    <img src={img} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
                  <h2 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.dek}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground italic">
                    {a.source_name ? `Source: ${a.source_name}` : a.author} • {timeAgo(a.published_at)}
                  </p>
                </>
              );
              const internal =
                isEvergreen || a.kind === "ingested" || (a.source_url && a.source_url.startsWith("/"));
              if (internal) {
                return (
                  <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group cursor-pointer block">
                    {card}
                  </Link>
                );
              }
              // Safety net: never link off-site from the live feed.
              return <article key={a.slug} className="group">{card}</article>;
            })
          : filteredStatic.map((a) => (
              <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                  <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
                <h2 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.dek}</p>
                <p className="mt-2 text-[11px] text-muted-foreground italic">{a.author} • {a.date}</p>
              </Link>
            ))}
      </div>
    </div>
  );
}