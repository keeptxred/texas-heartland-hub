import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isLowValueTitle } from "@/lib/low-value-titles";
import { PUBLISHER_LOGO } from "@/lib/seo";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { isPublicArticleReady, type PublicArticleCandidate } from "@/lib/public-article-readiness";

const MAX_VISIBLE_STORIES = 24;
const FETCH_CANDIDATES = 72;
const REFRESH_MS = 60_000;

function timeAgo(iso: string) {
  const timestamp = Date.parse(iso);
  if (!Number.isFinite(timestamp)) return "";
  const diff = Math.max(0, Date.now() - timestamp);
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `${Math.max(1, Math.floor(diff / 60_000))} min ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function isRollingNewsKind(kind?: string | null) {
  return kind === "news";
}

export const Route = createFileRoute("/happening-now")({
  head: () => ({
    meta: [
      { title: "Happening Now — Latest Texas News | Keep TX Red" },
      {
        name: "description",
        content:
          "Happening Now on Keep TX Red: the newest publish-ready Texas politics, elections, government, law, business, and economic-policy stories in one rolling feed.",
      },
      { property: "og:title", content: "Happening Now — Keep TX Red" },
      {
        property: "og:description",
        content: "The newest Keep TX Red stories, automatically refreshed as new reporting is published.",
      },
      { property: "og:url", content: "https://keeptxred.com/happening-now" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/happening-now" }],
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
  }),
  component: HappeningNowPage,
});

type ArticleRow = PublicArticleCandidate & {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  category: string;
  source_name: string | null;
  published_at: string;
  kind?: string | null;
  featured_image_url?: string | null;
  image_url?: string | null;
  image_alt_text?: string | null;
  is_breaking?: boolean | null;
};

function storyImage(article: ArticleRow) {
  return article.featured_image_url || article.image_url || null;
}

function StoryCard({ article }: { article: ArticleRow }) {
  const image = storyImage(article);

  return (
    <article className="overflow-hidden border-2 border-foreground/10 bg-card transition-colors hover:border-primary">
      {image ? (
        <a href={`/news/${article.slug}`} className="block aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={image}
            alt={article.image_alt_text || article.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </a>
      ) : null}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-widest">
          {article.is_breaking ? <span className="text-primary">Breaking</span> : null}
          <span className="text-muted-foreground">{article.category}</span>
          <time className="text-muted-foreground" dateTime={article.published_at}>
            {timeAgo(article.published_at)}
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
  const [items, setItems] = useState<ArticleRow[]>([]);
  const [fetchedAt, setFetchedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from("daily_articles")
        .select(
          "id,slug,title,dek,category,source_name,source_url,published_at,kind,featured_image_url,image_url,image_alt_text,is_breaking,content_quality_score,body_json,quality_flags",
        )
        .order("published_at", { ascending: false })
        .limit(FETCH_CANDIDATES);

      if (!active) return;
      if (error) {
        console.error("[happening-now] published article load failed", error.message);
        setLoadError(true);
        setLoading(false);
        return;
      }

      const latest = ((data ?? []) as ArticleRow[])
        .filter(
          (article) =>
            Boolean(article.slug)
            && Boolean(article.published_at)
            && isRollingNewsKind(article.kind)
            && !isLowValueTitle(article.title)
            && isPublicArticleReady(article)
            && meetsArticleMainWordCount(article.kind, article.body_json as never),
        )
        .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
        .slice(0, MAX_VISIBLE_STORIES);

      setItems(latest);
      setFetchedAt(new Date().toISOString());
      setLoadError(false);
      setLoading(false);
    }

    void load();
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
            Latest & Greatest
            <br />
            <span className="text-primary">Texas News</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            The newest publish-ready Keep TX Red stories in one rolling newsroom. New reporting moves
            to the top automatically; older stories roll off this page while remaining in their
            permanent news and category archives.
          </p>
          {fetchedAt ? (
            <p className="mt-3 text-xs uppercase tracking-widest text-white/85">
              Last refreshed: {new Date(fetchedAt).toLocaleString("en-US", {
                timeZone: "America/Chicago",
              })}{" "}
              CT
            </p>
          ) : null}
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
            {loading
              ? "Loading the latest Keep TX Red stories…"
              : loadError
                ? "The latest-news feed is temporarily unavailable. Please try again shortly."
                : "No publish-ready stories are available right now. The page refreshes automatically."}
          </div>
        ) : (
          <>
            <article className="mb-8 overflow-hidden border-2 border-foreground/10 bg-card md:grid md:grid-cols-[1.25fr_1fr]">
              {storyImage(lead) ? (
                <a href={`/news/${lead.slug}`} className="block min-h-64 overflow-hidden bg-muted md:min-h-full">
                  <img
                    src={storyImage(lead) as string}
                    alt={lead.image_alt_text || lead.title}
                    className="h-full w-full object-cover"
                  />
                </a>
              ) : null}
              <div className="flex flex-col justify-center p-6 md:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-widest">
                  {lead.is_breaking ? <span className="text-primary">Breaking</span> : null}
                  <span className="text-muted-foreground">{lead.category}</span>
                  <time className="text-muted-foreground" dateTime={lead.published_at}>
                    {timeAgo(lead.published_at)}
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
                  <StoryCard key={article.id} article={article} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
