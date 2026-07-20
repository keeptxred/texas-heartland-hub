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
  const merged = dedupeByTitle(dailyRotated).slice(0, 30);
  return { articles: merged };
});