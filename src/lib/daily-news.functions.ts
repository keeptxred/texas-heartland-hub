import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { dedupeByTitle } from "@/lib/title-similarity";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { hasSeoDuplicateFlag } from "@/lib/article-canonical";
import { isPublicBreaking, PUBLIC_BREAKING_WINDOW_MS } from "@/lib/public-breaking";

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

type DailyArticleRow = DailyArticle & {
  body_json?: unknown;
  quality_flags?: string[] | null;
};

const ARTICLE_PAGE_SIZE = 1000;
const DAILY_ARTICLE_SELECT = "slug,category,title,dek,author,source_name,source_url,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,seo_keywords,ctr_score,headline_variants,published_at,kind,score,is_breaking,body_json,quality_flags";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function stripPrivateFields(rows: DailyArticleRow[]): DailyArticle[] {
  return rows
    .filter((article) =>
      !hasSeoDuplicateFlag(article.quality_flags)
      && meetsArticleMainWordCount(article.kind, article.body_json as never),
    )
    .map(({ body_json: _bodyJson, quality_flags: _qualityFlags, ...article }) => article);
}

async function loadPublishedDailyArticles(limit: number): Promise<DailyArticle[]> {
  const supabase = getSupabaseClient();
  if (!supabase || limit <= 0) return [];

  const rows: DailyArticleRow[] = [];
  for (let from = 0; from < limit; from += ARTICLE_PAGE_SIZE) {
    const pageSize = Math.min(ARTICLE_PAGE_SIZE, limit - from);
    const { data, error } = await supabase
      .from("daily_articles")
      .select(DAILY_ARTICLE_SELECT)
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

  return stripPrivateFields(rows);
}

async function loadFreshBreakingArticles(limit = 12): Promise<DailyArticle[]> {
  const supabase = getSupabaseClient();
  if (!supabase || limit <= 0) return [];

  const cutoff = new Date(Date.now() - PUBLIC_BREAKING_WINDOW_MS).toISOString();
  const { data, error } = await supabase
    .from("daily_articles")
    .select(DAILY_ARTICLE_SELECT)
    .eq("is_breaking", true)
    .gte("published_at", cutoff)
    .order("published_at", { ascending: false })
    .order("slug", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("loadFreshBreakingArticles failed", error);
    return [];
  }

  return stripPrivateFields((data ?? []) as DailyArticleRow[]).filter((article) => isPublicBreaking(article));
}

export const getDailyArticles = createServerFn({ method: "GET" }).handler(async () => {
  const [rawDaily, freshBreaking] = await Promise.all([
    loadPublishedDailyArticles(80),
    loadFreshBreakingArticles(),
  ]);

  // Preserve the broader newsroom/admin breaking flag in the database, but
  // expose only strict public-breaking decisions to homepage consumers.
  const dailyRotated = rawDaily.map((article) => ({
    ...article,
    is_breaking: isPublicBreaking(article),
  }));

  // Strict public-breaking stories are loaded explicitly and placed first so
  // they cannot be lost to the generic newest-30 homepage display window.
  // SEO-quarantined rows have already been removed by stripPrivateFields, so
  // they cannot regain crawl prominence through homepage/newsroom discovery.
  const merged = dedupeByTitle([...freshBreaking, ...dailyRotated]).slice(0, 30);
  return { articles: merged };
});

export const getPublishedAuthorArticles = createServerFn({ method: "GET" }).handler(async () => {
  // Author discovery must not depend on the homepage's 30-story display window.
  // Page through a broad publication history so active desks with older,
  // indexable bylines remain discoverable. Quarantined rows are excluded by the
  // shared loader and therefore cannot keep an otherwise dormant author page
  // exposed to search engines.
  const articles = dedupeByTitle(await loadPublishedDailyArticles(5000));
  return { articles };
});
