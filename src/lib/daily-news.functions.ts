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

type DailyArticleRow = DailyArticle & { body_json?: unknown };

const ARTICLE_PAGE_SIZE = 1000;

async function loadPublishedDailyArticles(limit: number): Promise<DailyArticle[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || limit <= 0) return [];

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const rows: DailyArticleRow[] = [];
  for (let from = 0; from < limit; from += ARTICLE_PAGE_SIZE) {
    const pageSize = Math.min(ARTICLE_PAGE_SIZE, limit - from);
    const { data, error } = await supabase
      .from("daily_articles")
      .select("slug,category,title,dek,author,source_name,source_url,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,seo_keywords,ctr_score,headline_variants,published_at,kind,score,is_breaking,body_json")
      .order("published_at", { ascending: false })
      .order("slug", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("loadPublishedDailyArticles failed", error);
      return [];
    }

    const page = (data ?? []) as DailyArticleRow[];
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  return rows
    .filter((article) => meetsArticleMainWordCount(article.kind, article.body_json as never))
    .map(({ body_json: _bodyJson, ...article }) => article);
}

export const getDailyArticles = createServerFn({ method: "GET" }).handler(async () => {
  const rawDaily = await loadPublishedDailyArticles(80);

  // Demote daily breaking articles older than 24 hours: clear the flag in-memory
  // so the homepage strip only shows fresh items. They still appear in news
  // listings and topic pages via the normal sort.
  const demoteCutoff = Date.now() - 24 * 60 * 60 * 1000;
  const dailyRotated = rawDaily.map((article) => {
    if (article.is_breaking && Date.parse(article.published_at) < demoteCutoff) {
      return { ...article, is_breaking: false };
    }
    return article;
  });

  // Global near-duplicate title guard: same story rewritten by two sources must
  // never render twice on the homepage/breaking strip.
  const merged = dedupeByTitle(dailyRotated).slice(0, 30);
  return { articles: merged };
});

export const getPublishedAuthorArticles = createServerFn({ method: "GET" }).handler(async () => {
  // Author discovery must not depend on the homepage's 30-story display window.
  // Page through a broad publication history so active desks with older bylines
  // remain indexable and discoverable even after the newsroom exceeds one API page.
  const articles = dedupeByTitle(await loadPublishedDailyArticles(5000));
  return { articles };
});
