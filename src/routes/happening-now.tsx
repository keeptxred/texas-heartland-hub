import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { isNewsroomReport } from "@/lib/newsroom-presentation";
import { buildSeo, PUBLISHER_LOGO } from "@/lib/seo";
import { shouldContainArticleImage } from "@/lib/article-image-attribution";

const MAX_VISIBLE_STORIES = 24;
const REFRESH_MS = 60_000;
const HAPPENING_NOW_TITLE = "Happening Now — Latest Texas News";
const HAPPENING_NOW_DESCRIPTION =
  "Happening Now on Keep TX Red: the newest publish-ready Texas politics, elections, government, law, business, and economic-policy stories in one rolling feed.";

function absoluteDate(iso: string) {
  const date = new Date(iso);
  return Number.isFinite(date.getTime()) ? date.toLocaleDateString("en-US", { timeZone: "America/Chicago", year: "numeric", month: "short", day: "numeric" }) : "Date unavailable";
}

function currentReports(articles: DailyArticle[]) {
  return articles.filter(isNewsroomReport)
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
    .slice(0, MAX_VISIBLE_STORIES);
}

export function happeningNowHead() {
  const seo = buildSeo({
    title: HAPPENING_NOW_TITLE,
    description: HAPPENING_NOW_DESCRIPTION,
    path: "/happening-now",
    type: "website",
    imageAlt: "Keep TX Red latest Texas news",
  });

  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NewsMediaOrganization",
              "@id": "https://keeptxred.com/#org",
              name: "Keep TX Red",
              url: "https://keeptxred.com",
              logo: {
                "@type": "ImageObject",
                url: PUBLISHER_LOGO,
                contentUrl: PUBLISHER_LOGO,
                caption: "Keep TX Red",
              },
              areaServed: { "@type": "State", name: "Texas" },
            },
            {
              "@type": "CollectionPage",
              "@id": "https://keeptxred.com/happening-now#page",
              url: "https://keeptxred.com/happening-now",
              name: "Happening Now — Latest Texas News",
              description:
                "A rolling feed of the newest publish-ready Keep TX Red reporting across Texas politics, elections, government, law, business, and economic policy.",
              isPartOf: { "@id": "https://keeptxred.com/#org" },
            },
          ],
        }),
      },
    ],
  };
}

export const Route = createFileRoute("/happening-now")({
  head: happeningNowHead,
  loader: async () => currentReports((await getDailyArticles()).articles),
  component: HappeningNowPage,
});

type ArticleRow = DailyArticle;

function storyImage(article: ArticleRow) {
  const image = article.image_generation_status === "ready" ? article.featured_image_url?.trim() : null;
  return image && !/\/og\/default\.jpg(?:[?#].*)?$/i.test(image) ? image : null;
}

function StoryCard({ article }: { article: ArticleRow }) {
  const image = storyImage(article);

  return (
    <article className="overflow-hidden border-2 border-foreground/10 bg-card transition-colors hover:border-primary">
      {image ? (
        <a href={`/news/${article.slug}`} className="block aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={image}
            alt={article.image_alt_text || ""}
            className={`h-full w-full ${shouldContainArticleImage(image) ? "object-contain bg-white p-4" : "object-cover"} transition-transform duration-300 hover:scale-[1.02]`}
            loading="lazy"
          />
        </a>
      ) : null}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-widest">
          {article.is_breaking ? <span className="text-primary">Breaking</span> : null}
          <span className="text-muted-foreground">{article.category}</span>
          <time className="text-muted-foreground" dateTime={article.published_at}>
            {absoluteDate(article.published_at)}
          </time>
        </div>
        <h2 className="font-serif text-lg font-bold leading-snug">
          <a href={`/news/${article.slug}`} className="hover:underline underline-offset-4">
            {article.title}
          </a>
        </h2>
        {article.dek ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.dek}</p>
        ) : null}
        {article.source_name ? (
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Source: {article.source_name}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function HappeningNowPage() {
  const initial = Route.useLoaderData();
  const [items, setItems] = useState<ArticleRow[]>(initial);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const latest = currentReports((await getDailyArticles()).articles);
        if (active) {
          setItems(latest);
          setLoadError(false);
        }
      } catch {
        if (active) setLoadError(true);
      }
    }
    const timer = window.setInterval(() => void load(), REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const lead = items[0];
  const rest = items.slice(1);

  return (
    <div className="bg-white">
      <section className="border-b-4 border-primary bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
            ★ Happening Now
          </span>
          <h1 className="mt-3 font-display text-4xl leading-[0.95] tracking-tight md:text-6xl">
            Latest
            <br />
            <span className="text-primary">Texas News</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            Verified Texas news reporting published within the past seven days. New reports appear first; older coverage remains in the dated newsroom archive. Evergreen explainers are listed separately rather than presented as breaking news.
          </p>

        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl tracking-tight md:text-3xl">Newest Stories</h2>
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {items.length} current stories
          </span>
        </div>

        {!lead ? (
          <div className="border-2 border-dashed border-border p-10 text-center text-muted-foreground">
            {loadError ? "The latest-news feed is temporarily unavailable." : "No newly verified reports are available in the past seven days."}
            <p className="mt-3"><a href="/news" className="font-semibold text-primary underline">Browse previous verified reporting and permanent guides</a></p>
          </div>
        ) : (
          <>
            <article className="mb-8 overflow-hidden border-2 border-foreground/10 bg-card md:grid md:grid-cols-[1.25fr_1fr]">
              {storyImage(lead) ? (
                <a href={`/news/${lead.slug}`} className="block min-h-64 overflow-hidden bg-muted md:min-h-full">
                  <img
                    src={storyImage(lead) as string}
                    alt={lead.image_alt_text || ""}
                    className={`h-full w-full ${shouldContainArticleImage(storyImage(lead)) ? "object-contain bg-white p-6" : "object-cover"}`}
                  />
                </a>
              ) : null}
              <div className="flex flex-col justify-center p-6 md:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-widest">
                  {lead.is_breaking ? <span className="text-primary">Breaking</span> : null}
                  <span className="text-muted-foreground">{lead.category}</span>
                  <time className="text-muted-foreground" dateTime={lead.published_at}>
                    {absoluteDate(lead.published_at)}
                  </time>
                </div>
                <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
                  <a href={`/news/${lead.slug}`} className="hover:underline underline-offset-4">
                    {lead.title}
                  </a>
                </h2>
                {lead.dek ? (
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{lead.dek}</p>
                ) : null}
                {lead.source_name ? (
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Source: {lead.source_name}
                  </p>
                ) : null}
              </div>
            </article>

            {rest.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <StoryCard key={article.slug} article={article} />
                ))}
              </div>
            ) : null}
          </>
        )}
        <nav aria-label="Newsroom references" className="mt-10 flex flex-wrap gap-x-5 gap-y-3 border-t pt-6 text-sm font-semibold"><a className="text-primary underline" href="/news">News archive</a><a className="text-primary underline" href="/editorial-standards">Sourcing and corrections</a><a className="text-primary underline" href="/authors">Editorial desks</a><a className="text-primary underline" href="/texas-government">Texas government reference</a></nav>
      </main>
    </div>
  );
}
