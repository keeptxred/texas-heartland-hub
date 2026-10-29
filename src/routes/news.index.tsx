import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { AUTHORS, authorSlug } from "@/data/authors";
import {
  getDailyArticles, getRecentNewsArchive, type DailyArticle,
} from "@/lib/daily-news.functions";
import { getDiscoverableStaticArticleSlugs } from "@/lib/static-article-discovery.functions";
import { filterByCategorySlug, CATEGORY_NAME_TO_SLUG, type CategoryName } from "@/lib/articles-by-category";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { resolveDisplayHeadline } from "@/lib/ctr-score";
import { buildSeo } from "@/lib/seo";
import { shouldContainArticleImage } from "@/lib/article-image-attribution";
import { isNewsroomReport, isReserveDeskExplainer } from "@/lib/newsroom-presentation";

const NEWS_TITLE = "Texas Political News";
const NEWS_DESCRIPTION =
  "Source-backed Texas political news, previous reporting and permanent explainers covering elections, the Legislature, government, border policy, energy, education and taxes.";

export function newsHead() {
  return buildSeo({
    title: NEWS_TITLE,
    description: NEWS_DESCRIPTION,
    path: "/news",
    type: "website",
    imageAlt: "Keep TX Red Texas political news coverage",
  });
}

export const Route = createFileRoute("/news/")({
  head: newsHead,
  loader: async () => {
    const [daily, previous, discoverableStaticSlugs] = await Promise.all([
      getDailyArticles(),
      getRecentNewsArchive(),
      getDiscoverableStaticArticleSlugs(),
    ]);
    return { ...daily, previousArticles: previous.articles, discoverableStaticSlugs };
  },
  component: NewsPage,
});

const CATS = [
  "All", "Texas News", "Politics", "Legislature", "Government",
  "Local Government", "Laws", "Border", "Elections", "Tax & Spending",
  "Energy", "Education", "Business", "Economy",
] as const;

function catToSlug(cat: (typeof CATS)[number]): string {
  return cat === "All" ? "" : CATEGORY_NAME_TO_SLUG[cat as CategoryName];
}

function absoluteNewsDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", timeZone: "America/Chicago",
  });
}

function verifiedImage(article: DailyArticle): string | null {
  const url = article.image_generation_status === "ready"
    ? article.featured_image_url?.trim()
    : null;
  // Do not silently replace missing, unverified or mismatched story imagery
  // with an unrelated generic Texas/category photograph.
  return url && !/\/og\/default\.jpg(?:[?#].*)?$/i.test(url) ? url : null;
}

function DailyNewsCard({ article }: { article: DailyArticle }) {
  const image = verifiedImage(article);
  const { headline } = resolveDisplayHeadline(article);
  const reserve = isReserveDeskExplainer(article);

  return (
    <Link to="/news/$slug" params={{ slug: article.slug }} className="group block h-full rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      <article className="h-full">
        {image ? (
          <div className="mb-4 aspect-[4/3] overflow-hidden rounded-sm bg-muted">
            <img
              src={image}
              alt={article.image_alt_text?.trim() || ""}
              width={640} height={480} loading="lazy"
              className={`size-full ${shouldContainArticleImage(image) ? "object-contain bg-white p-4" : "object-cover"} transition-transform duration-300 group-hover:scale-[1.02]`}
            />
          </div>
        ) : null}
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{article.category || "Texas News"}</p>
        <h3 className="mt-1 font-serif text-xl font-bold leading-snug group-hover:underline underline-offset-4">{headline}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{article.dek}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          By {article.author || "Keep TX Red Newsroom"} · <time dateTime={article.published_at}>{absoluteNewsDate(article.published_at)}</time>
        </p>
        {!reserve && article.source_name ? (
          <p className="mt-1 text-xs text-muted-foreground">Reported with: {article.source_name}</p>
        ) : null}
      </article>
    </Link>
  );
}

function NewsPage() {
  const { articles, previousArticles, discoverableStaticSlugs } = Route.useLoaderData();
  const [activeCat, setActiveCat] = useState<(typeof CATS)[number]>("All");
  const [visiblePrevious, setVisiblePrevious] = useState(12);
  const [visibleGuides, setVisibleGuides] = useState(12);

  const discoverableStatic = useMemo(
    () => new Set(discoverableStaticSlugs),
    [discoverableStaticSlugs],
  );

  const staticGuides = useMemo(() => ARTICLES.filter((article) =>
    isPublished(article)
    && isStaticArticleIndexable(article)
    && discoverableStatic.has(article.slug),
  ).sort(sortByDateDesc), [discoverableStatic]);

  const activeAuthors = useMemo(() => {
    const slugs = new Set<string>();
    for (const article of [...articles, ...previousArticles]) {
      if (article.slug && article.author) slugs.add(authorSlug(article.author));
    }
    for (const article of staticGuides) slugs.add(authorSlug(article.author));
    return AUTHORS.filter((author) => slugs.has(author.slug));
  }, [articles, previousArticles, staticGuides]);

  const visibleCurrent = useMemo(() => activeCat === "All"
    ? articles
    : filterByCategorySlug(articles as DailyArticle[], catToSlug(activeCat)),
  [articles, activeCat]);

  const reports = useMemo(() => visibleCurrent.filter(isNewsroomReport), [visibleCurrent]);
  const explainers = useMemo(() => visibleCurrent.filter((article) => !isNewsroomReport(article)), [visibleCurrent]);

  const prior = useMemo(() => {
    const currentSlugs = new Set(articles.map((article) => article.slug));
    const eligible = previousArticles.filter((article) => !currentSlugs.has(article.slug));
    return activeCat === "All" ? eligible : filterByCategorySlug(eligible, catToSlug(activeCat));
  }, [activeCat, articles, previousArticles]);

  const guides = useMemo(() => {
    const allDynamic = new Set([...articles, ...previousArticles].map((article) => article.slug));
    const eligible = staticGuides.filter((article) => !allDynamic.has(article.slug));
    return activeCat === "All" ? eligible : filterByCategorySlug(eligible, catToSlug(activeCat));
  }, [activeCat, articles, previousArticles, staticGuides]);

  const hasResults = reports.length > 0 || explainers.length > 0 || prior.length > 0 || guides.length > 0;

  function changeCategory(category: (typeof CATS)[number]) {
    setActiveCat(category);
    setVisiblePrevious(12);
    setVisibleGuides(12);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 border-b-2 border-foreground pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Keep TX Red newsroom</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">Texas Political News</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Texas politics, elections, government, the Legislature, border policy, energy, education and taxes.
          Browse separately dated news reporting, previous coverage and permanent guides—with sources and
          editorial context in each article.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          <Link to="/elections" className="text-primary hover:underline">2026 election coverage →</Link>
          <Link to="/authors" className="text-primary hover:underline">Our authors &amp; editorial desks →</Link>
          <Link to="/editorial-standards" className="text-primary hover:underline">Sourcing &amp; editorial standards →</Link>
        </div>
      </header>

      {activeAuthors.length > 0 ? (
        <nav className="mb-8 rounded-lg border bg-muted/30 p-4 sm:p-5" aria-label="Keep TX Red editorial desks">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Explore editorial desks</p>
          <p className="mt-1 text-sm text-muted-foreground">
            These labels identify coverage beats and editorial workflows—not necessarily individual reporters or physical bureaus.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeAuthors.map((author) => (
              <Link
                key={author.slug}
                to="/authors/$slug"
                params={{ slug: author.slug }}
                className="rounded-full border bg-background px-3 py-1.5 text-sm font-semibold hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2"
              >{author.name}</Link>
            ))}
            <Link to="/authors" className="rounded-full border px-3 py-1.5 text-sm font-semibold text-primary hover:underline">
              All desks →
            </Link>
          </div>
        </nav>
      ) : null}

      <nav className="mb-10" aria-label="Filter newsroom by topic">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Browse by topic</p>
        <div className="flex flex-wrap gap-2">
          {CATS.map((category) => (
            <button
              key={category} type="button"
              aria-pressed={category === activeCat}
              onClick={() => changeCategory(category)}
              className={`rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${category === activeCat
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-primary hover:text-primary"}`}
            >{category}</button>
          ))}
        </div>
      </nav>

      {!hasResults ? (
        <div className="mb-10 rounded-lg border-2 border-dashed border-border px-6 py-10 text-center">
          <h2 className="font-display text-2xl">No eligible coverage in this topic</h2>
          <p className="mt-2 text-sm text-muted-foreground">Try a different topic to find current reporting or permanent guides.</p>
          <button type="button" onClick={() => changeCategory("All")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Show all coverage
          </button>
        </div>
      ) : null}

      <section aria-labelledby="latest-news-heading" className="mb-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b pb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Past seven days</p>
            <h2 id="latest-news-heading" className="font-display text-3xl">Latest verified news reporting</h2>
          </div>
          <p className="text-xs text-muted-foreground">{reports.length} {reports.length === 1 ? "report" : "reports"}</p>
        </div>
        {reports.length ? (
          <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((article) => <DailyNewsCard key={article.slug} article={article} />)}
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/20 p-5">
            <p className="font-semibold">No newly verified news report in this selection during the past seven days.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We do not re-date older stories or classify evergreen explainers as breaking news.
              Previous verified reporting and reference material remain available below.
            </p>
          </div>
        )}
      </section>

      {prior.length > 0 ? (
        <section aria-labelledby="previous-news-heading" className="mb-12 border-t pt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Dated archive</p>
              <h2 id="previous-news-heading" className="font-display text-3xl">Previous verified reporting</h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                Earlier published news stories, clearly dated and subject to the same public-readiness and
                sourcing gates. Older reports are not presented as today's developments.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{prior.length} reports available</p>
          </div>
          <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {prior.slice(0, visiblePrevious).map((article) => <DailyNewsCard key={article.slug} article={article} />)}
          </div>
          {visiblePrevious < prior.length ? (
            <button type="button" onClick={() => setVisiblePrevious((count) => count + 12)}
              className="mt-8 rounded-md border px-5 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
              Show more previous reports
            </button>
          ) : null}
        </section>
      ) : null}

      {explainers.length > 0 ? (
        <section aria-labelledby="news-explainers-heading" className="mb-12 border-t pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Understanding Texas government</p>
          <h2 id="news-explainers-heading" className="mt-1 font-display text-3xl">Recently published explainers</h2>
          <p className="mb-6 mt-2 max-w-3xl text-sm text-muted-foreground">
            Practical background guides from the KTR editorial team. These are not reports of new events,
            and their publication dates do not mean the underlying laws or government processes recently changed.
          </p>
          <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {explainers.map((article) => <DailyNewsCard key={article.slug} article={article} />)}
          </div>
        </section>
      ) : null}

      {guides.length > 0 ? (
        <section aria-labelledby="news-guides-heading" className="border-t pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Reference library</p>
          <h2 id="news-guides-heading" className="mt-1 font-display text-3xl">Texas political guides &amp; explainers</h2>
          <p className="mb-6 mt-2 max-w-3xl text-sm text-muted-foreground">
            Permanent explainers and earlier features, shown with their original publication dates.
            Check each article for any later revisions and underlying primary records.
          </p>
          <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, visibleGuides).map((article) => (
              <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <article>
                  {article.image ? (
                    <div className="mb-4 aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                      <img src={article.image} alt="" loading="lazy" width={640} height={480}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                    </div>
                  ) : null}
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{article.category}</p>
                  <h3 className="mt-1 font-serif text-xl font-bold leading-snug group-hover:underline underline-offset-4">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{article.dek}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {article.author} · <time dateTime={article.publishedAt}>{absoluteNewsDate(article.publishedAt)}</time>
                  </p>
                </article>
              </Link>
            ))}
          </div>
          {visibleGuides < guides.length ? (
            <button type="button" onClick={() => setVisibleGuides((count) => count + 12)}
              className="mt-8 rounded-md border px-5 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
              Show more guides
            </button>
          ) : null}
        </section>
      ) : null}

      <aside className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Our sourcing promise.</strong> News reports and explainers have different purposes.
          We preserve original story dates, attribute reporting, and require public-readiness checks before discovery.
          Read our <Link to="/editorial-standards" className="font-semibold text-primary hover:underline">editorial standards</Link> or
          <Link to="/contact" className="ml-1 font-semibold text-primary hover:underline">request a correction</Link>.
        </p>
      </aside>
    </main>
  );
}
