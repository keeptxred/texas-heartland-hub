import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { dedupeByTitle } from "@/lib/title-similarity";
import { meetsArticleMainWordCount } from "@/lib/article-length";

export type DailyArticle = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  image_hash: string | null;
  image_category: string | null;
  featured_image_url: string | null;
  image_alt_text?: string | null;
  seo_headline: string | null;
  discover_category: string | null;
  seo_keywords: string[] | null;
  ctr_score: number | null;
  headline_variants: { a: string; b: string } | null;
  published_at: string;
  kind?: string | null;
  score?: number | null;
  is_breaking?: boolean | null;
};

export const getDailyArticles = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { articles: [] as DailyArticle[] };

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("daily_articles")
    .select("slug,category,title,dek,author,source_name,source_url,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,seo_keywords,ctr_score,headline_variants,published_at,kind,score,is_breaking,body_json")
    .order("published_at", { ascending: false })
    .limit(80);

  if (error) {
    console.error("getDailyArticles failed", error);
    return { articles: [] as DailyArticle[] };
  }

  const rawDaily = ((data ?? []) as (DailyArticle & { body_json?: unknown })[])
    .filter((a) => meetsArticleMainWordCount(a.kind, a.body_json as never))
    .map(({ body_json: _bodyJson, ...a }) => a);
  const validArticleSlugs = new Set(rawDaily.map((a) => a.slug));

  // Pull the freshest live RSS items and surface them as breaking cards so the
  // homepage breaking strip refreshes alongside the RSS feed. Window is 24h
  // so the strip stays populated even when feeds are quiet for a few hours.
  const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: feed } = await supabase
    .from("texas_news_feed")
    .select("title,source,link,description,pub_date,internal_slug")
    .not("internal_slug", "is", null)
    .gte("pub_date", sinceIso)
    .order("pub_date", { ascending: false })
    .limit(12);

  const isPuzzle = (t: string) => {
    const s = (t || "").toLowerCase();
    return (
      /\bcrossword\b/.test(s) ||
      /\bsudoku\b/.test(s) ||
      /\bword\s*(game|search|jumble)\b/.test(s) ||
      /\b(daily|weekly)\s+puzzle\b/.test(s) ||
      /\bpuzzle\s+(for|of\s+the\s+day)\b/.test(s) ||
      /\bmini\s+puzzle\b/.test(s)
    );
  };
  const liveBreaking: DailyArticle[] = (feed ?? []).filter((row) => !isPuzzle(row.title) && validArticleSlugs.has(row.internal_slug as string)).slice(0, 6).map((row) => ({
    slug: row.internal_slug as string,
    category: row.source ?? "Live",
    title: row.title,
    dek: row.description ?? "",
    author: row.source ?? "Live Feed",
    source_name: row.source ?? null,
    source_url: `/news/${row.internal_slug}`,
    image_url: null,
    image_hash: null,
    image_category: null,
    featured_image_url: null,
    image_alt_text: null,
    seo_headline: null,
    discover_category: null,
    seo_keywords: null,
    ctr_score: null,
    headline_variants: null,
    published_at: row.pub_date,
    kind: "ingested",
    score: 100,
    is_breaking: true,
  }));

  // Demote daily breaking articles older than 6 hours: clear the flag in-memory
  // so the homepage strip only shows fresh items. They still appear in news
  // listings and topic pages via the normal sort.
  const demoteCutoff = Date.now() - 24 * 60 * 60 * 1000;
  const dailyRotated = rawDaily.map((a) => {
    if (a.is_breaking && Date.parse(a.published_at) < demoteCutoff) {
      return { ...a, is_breaking: false };
    }
    return a;
  });

  // Global near-duplicate title guard: same story rewritten by two sources must
  // never render twice on the homepage/breaking strip.
  const merged = dedupeByTitle([...liveBreaking, ...dailyRotated]).slice(0, 30);
  return { articles: merged };
});