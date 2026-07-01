import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { getArticlesByCategory, filterByCategorySlug } from "@/lib/articles-by-category";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { getArticleImage } from "@/lib/fallback-images";

const CATEGORY_SLUG = "non-political";
const CATEGORY_NAME = "Non-Political";

export const Route = createFileRoute("/news/non-political")({
  head: () => ({
    meta: [
      { title: "Non-Political Texas News — Keep TX Red" },
      { name: "description", content: "Human-interest, community, culture, weather, science, and lifestyle stories from across Texas — the news that isn't about politics." },
      { property: "og:title", content: "Non-Political Texas News — Keep TX Red" },
      { property: "og:description", content: "Texas human-interest, culture, community, and lifestyle stories." },
      { property: "og:url", content: "https://www.keeptxred.com/news/non-political" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/news/non-political" }],
  }),
  loader: () => getDailyArticles(),
  component: NonPoliticalPage,
});

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function NonPoliticalPage() {
  const { articles } = Route.useLoaderData();
  // Single shared category filter — exact match on category_slug, newest first.
  const live = useMemo(
    () => filterByCategorySlug(articles as DailyArticle[], CATEGORY_SLUG),
    [articles]
  );
  const staticArticles = useMemo(() => getArticlesByCategory(CATEGORY_SLUG), []);
  const useLive = live.length > 0;

  const liveImages = useMemo(
    () =>
      assignUniqueImages(
        live,
        (a: DailyArticle) => a.slug,
        (a: DailyArticle) => getArticleImage(a),
        undefined,
        (a: DailyArticle) => a.image_hash,
      ),
    [live]
  );
  const staticImages = useMemo(
    () => assignUniqueImages(staticArticles, (a) => a.slug, (a) => a.image),
    [staticArticles]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Non-Political</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Non-Political Texas News</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Human-interest, community, culture, festivals, weather, science, travel, and lifestyle stories from across Texas — the news that isn&apos;t about politics.
        </p>
      </div>

      {!useLive && staticArticles.length === 0 ? (
        <p className="text-muted-foreground">No {CATEGORY_NAME} stories yet. Check back soon.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {useLive
            ? live.map((a: DailyArticle) => {
                const img = liveImages.get(a.slug) ?? getArticleImage(a);
                return (
                  <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group cursor-pointer block">
                    <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                      <img src={img} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
                    <h2 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.dek}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground italic">
                      {a.source_name ? `Source: ${a.source_name}` : a.author} • {timeAgo(a.published_at)}
                    </p>
                  </Link>
                );
              })
            : staticArticles.map((a) => (
                <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                    <img src={staticImages.get(a.slug) ?? a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
                  <h2 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.dek}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground italic">{a.author} • {a.date}</p>
                </Link>
              ))}
        </div>
      )}
    </div>
  );
}