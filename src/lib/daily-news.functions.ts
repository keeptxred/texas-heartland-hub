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
const DAILY_ARTICLE_SELECT = "slug,category,title,dek,author,source_name,source_url,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,seo_keywords,ctr_score,headline_variants,published_at,kind,score,is_breaking,body_json";
const PUBLIC_BREAKING_WINDOW_MS = 12 * 60 * 60 * 1000;

const PUBLIC_BREAKING_SAFETY = /\b(active shooter|mass shooting|shooting|killed|fatal|dead|death toll|explosion|tornado warning|tornado emergency|hurricane warning|flash flood emergency|evacuation|evacuations|amber alert|manhunt|wildfire evacuation|shelter in place)\b/i;
const PUBLIC_BREAKING_INFRASTRUCTURE = /\b(ercot|power grid|electric grid|rolling blackout|blackout|grid emergency|major outage|boil water notice)\b/i;
const PUBLIC_BREAKING_GOVERNMENT = /\b(indicted|indictment|resigns|resigned|resignation|removed from office|impeached|impeachment|state of emergency|emergency declaration|court blocks|court halts|strikes down|supreme court rules|injunction)\b/i;
const PUBLIC_BREAKING_ELECTION = /\b(election|primary|runoff|ballot|race)\b/i;
const PUBLIC_BREAKING_ELECTION_EVENT = /\b(wins|winner|called|projected|concedes|conceded|withdraws|withdrew|drops out|results|recount|disqualified)\b/i;
const PUBLIC_BREAKING_ROUTINE = /\b(announces|announcement|appoints|appointment|approves|passes|signs bill|files bill|launches|opens|awards|visits|speaks|statement|press release)\b/i;

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function stripBodyJson(rows: DailyArticleRow[]): DailyArticle[] {
  return rows
    .filter((article) => meetsArticleMainWordCount(article.kind, article.body_json as never))
    .map(({ body_json: _bodyJson, ...article }) => article);
}

function isPublicBreaking(article: DailyArticle): boolean {
  if (!article.is_breaking) return false;

  const publishedAt = Date.parse(article.published_at);
  if (!Number.isFinite(publishedAt) || Date.now() - publishedAt > PUBLIC_BREAKING_WINDOW_MS) return false;

  const text = `${article.title ?? ""} ${article.dek ?? ""} ${article.category ?? ""} ${article.source_name ?? ""}`;
  const safety = PUBLIC_BREAKING_SAFETY.test(text);
  const infrastructure = PUBLIC_BREAKING_INFRASTRUCTURE.test(text) && /\b(emergency|warning|outage|blackout|failure|conservation|shed load|rolling)\b/i.test(text);
  const government = PUBLIC_BREAKING_GOVERNMENT.test(text);
  const election = PUBLIC_BREAKING_ELECTION.test(text) && PUBLIC_BREAKING_ELECTION_EVENT.test(text);

  if (!(safety || infrastructure || government || election)) return false;

  // Routine government/business activity should not become a public red-banner
  // item unless the same story also contains a genuine urgent-event signal.
  if (PUBLIC_BREAKING_ROUTINE.test(text) && !(safety || infrastructure || government || election)) return false;

  return true;
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

  return stripBodyJson(rows);
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

  return stripBodyJson((data ?? []) as DailyArticleRow[]).filter(isPublicBreaking);
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
  const merged = dedupeByTitle([...freshBreaking, ...dailyRotated]).slice(0, 30);
  return { articles: merged };
});

export const getPublishedAuthorArticles = createServerFn({ method: "GET" }).handler(async () => {
  // Author discovery must not depend on the homepage's 30-story display window.
  // Page through a broad publication history so active desks with older bylines
  // remain indexable and discoverable even after the newsroom exceeds one API page.
  const articles = dedupeByTitle(await loadPublishedDailyArticles(5000));
  return { articles };
});
