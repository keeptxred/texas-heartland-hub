import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { AUTHORS, authorSlug } from "@/data/authors";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { getDiscoverableStaticArticleSlugs } from "@/lib/static-article-discovery.functions";
import { filterByCategorySlug, CATEGORY_NAME_TO_SLUG, type CategoryName } from "@/lib/articles-by-category";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import border from "@/assets/border.jpg";
import ballot from "@/assets/ballot.jpg";
import suburb from "@/assets/suburb.jpg";
import podium from "@/assets/podium.jpg";
import oil from "@/assets/article-oil.jpg";
import classroom from "@/assets/article-classroom.jpg";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { resolveArticleImage } from "@/lib/seo-headline";
import { resolveDisplayHeadline } from "@/lib/ctr-score";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "Texas Political News — Keep TX Red" },
      { name: "description", content: "Conservative news from Austin to the border — politics, elections, government, laws, legislature, energy, education, and tax policy from the Lone Star State." },
      { property: "og:title", content: "Texas Political News — Keep TX Red" },
      { property: "og:description", content: "Conservative reporting on Texas politics, elections, legislation, government, law, and policy." },
      { property: "og:url", content: "/news" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/news" }],
  }),
  loader: async () => {
    const [daily, discoverableStaticSlugs] = await Promise.all([
      getDailyArticles(),
      getDiscoverableStaticArticleSlugs(),
    ]);
    return { ...daily, discoverableStaticSlugs };
  },
  component: NewsPage,
});

const CATS = [
  "All",
  "Politics",
  "Legislature",
  "Government",
  "Local Government",
  "Laws",
  "Border",
  "Elections",
  "Tax & Spending",
  "Energy",
  "Education",
] as const;

function catToSlug(cat: (typeof CATS)[number]): string {
  if (cat === "All") return "";
  return CATEGORY_NAME_TO_SLUG[cat as CategoryName];
}

const CATEGORY_IMAGES: Record<string, string> = {
  Border: border,
  Elections: ballot,
  "Tax & Spending": suburb,
  Energy: oil,
  Education: classroom,
};

function absoluteNewsDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

function timeAgo(iso: string): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "Date unavailable";
  const diff = Date.now() - ts;
  if (diff < 0) return absoluteNewsDate(iso);
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d <= 6) return `${d} day${d === 1 ? "" : "s"} ago`;
  return absoluteNewsDate(iso);
}

function NewsPage() {
  const { articles, discoverableStaticSlugs } = Route.useLoaderData();
  const [activeCat, setActiveCat] = useState<(typeof CATS)[number]>("All");
  const discoverableStatic = useMemo(
    () => new Set(discoverableStaticSlugs),
    [discoverableStaticSlugs],
  );

  const activeAuthors = useMemo(() => {
    const slugs = new Set<string>();
    for (const article of articles as DailyArticle[]) {
      if (article.slug && article.author) slugs.add(authorSlug(article.author));
    }
    for (const article of ARTICLES) {
      if (
        isPublished(article)
        && isStaticArticleIndexable(article)
        && discoverableStatic.has(article.slug)
      ) slugs.add(authorSlug(article.author));
    }
    return AUTHORS.filter((author) => slugs.has(author.slug));
  }, [articles, discoverableStatic]);

  const filteredLive = useMemo(
    () =>
      activeCat === "All"
        ? articles
        : filterByCategorySlug(articles as DailyArticle[], catToSlug(activeCat)),
    [articles, activeCat]
  );
  const filteredStatic = useMemo(
    () => {
      const live = ARTICLES.filter((a) =>
        isPublished(a)
        && isStaticArticleIndexable(a)
        && discoverableStatic.has(a.slug),
      ).sort(sortByDateDesc);
      return activeCat === "All" ? live : filterByCategorySlug(live, catToSlug(activeCat));
    },
    [activeCat, discoverableStatic]
  );
  const liveSlugSet = useMemo(() => new Set(filteredLive.map((article) => article.slug)), [filteredLive]);
  const archiveArticles = useMemo(
    () => filteredStatic.filter((article) => !liveSlugSet.has(article.slug)).slice(0, 30),
    [filteredStatic, liveSlugSet],
  );

  const liveImages = useMemo(
    () =>
      assignUniqueImages(
        filteredLive,
        (a: DailyArticle) => a.slug,
        (a: DailyArticle) => resolveArticleImage(a),
        (a: DailyArticle) => a.category ?? null,
        (a: DailyArticle) => a.image_hash,
      ),
    [filteredLive]
  );
  const staticImages = useMemo(
    () => assignUniqueImages(archiveArticles, (a) => a.slug, (a) => a.image, (a) => a.category ?? null),
    [archiveArticles]
  );

  const hasResults = filteredLive.length > 0 || archiveArticles.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-8">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Newsroom</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Texas Political News</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Independent conservative reporting on Texas politics, elections, government, law, the legislature, border security, energy, education, and tax policy. Updated every morning at 2:00 AM Central.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <Link to="/authors" className="text-primary hover:underline">Meet our authors &amp; desks →</Link>
          <Link to="/editorial-standards" className="text-primary hover:underline">Editorial standards →</Link>
        </div>
      </div>

      {activeAuthors.length > 0 ? (
        <nav className="mb-10 rounded-lg border bg-muted/30 p-5" aria-label="Active Keep TX Red newsroom desks">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Active newsroom desks</p>
              <p className="mt-1 text-sm text-muted-foreground">Browse reporting by the desks publishing current Keep TX Red coverage.</p>
            </div>
            <Link to="/authors" className="text-sm font-semibold text-primary hover:underline">All authors &amp; desks →</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeAuthors.map((author) => (
              <Link
                key={author.slug}
                to="/authors/$slug"
                params={{ slug: author.slug }}
                className="rounded-full border bg-background px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary"
              >
                {author.name}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}

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

      {!hasResults ? (
        <div className="rounded-lg border-2 border-dashed border-border px-6 py-12 text-center">
          <h2 className="font-display text-2xl tracking-tight">No coverage in this section yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another topic above or return to all newsroom coverage.
          </p>
          <button
            type="button"
            onClick={() => setActiveCat("All")}
            className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Show all news
          </button>
        </div>
      ) : null}

      {filteredLive.length > 0 ? (
        <section aria-labelledby="latest-news-heading">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Current feed</p>
              <h2 id="latest-news-heading" className="font-display text-3xl tracking-tight">Latest coverage</h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {filteredLive.length} current {filteredLive.length === 1 ? "story" : "stories"}
            </span>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredLive.map((a: DailyArticle) => {
              const img = liveImages.get(a.slug) ?? resolveArticleImage(a);
              const { headline: title } = resolveDisplayHeadline(a);
              const isEvergreen = a.kind === "evergreen";
              const card = (
                <>
                  <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                    <img src={img} alt={title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
                  <h3 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{title}</h3>
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
              return <article key={a.slug} className="group">{card}</article>;
            })}
          </div>
        </section>
      ) : null}

      {archiveArticles.length > 0 ? (
        <section className={filteredLive.length > 0 ? "mt-16 border-t border-border pt-10" : ""} aria-labelledby="news-archive-heading">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                {filteredLive.length > 0 ? "Go deeper" : "KTR newsroom"}
              </p>
              <h2 id="news-archive-heading" className="font-display text-3xl tracking-tight">
                {filteredLive.length > 0 ? "More reporting & explainers" : "Reporting & explainers"}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Evergreen guides and recent KTR reporting remain available instead of disappearing when the live feed updates.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Showing up to 30</span>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {archiveArticles.map((a) => (
              <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                  <img src={staticImages.get(a.slug) ?? a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
                <h3 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.dek}</p>
                <p className="mt-2 text-[11px] text-muted-foreground italic">{a.author} • {absoluteNewsDate(a.publishedAt)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}