import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { TEAM_BY_SLUG, isTeamSlug, type LeagueSlug } from "./texas-teams";
import { SPORTS_TOPIC_SLUGS, classifySportsText, type SportsTopicSlug } from "./sports-taxonomy";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { shouldDisplayBreakingSports } from "@/lib/sports-lifecycle";
import { getArticlesByCategory, type CategoryFeedItem } from "./category-feed.functions";

export type SportsListItem = {
  slug: string;
  title: string;
  dek: string;
  author: string;
  published_at: string;
  image_url: string | null;
  image_hash: string | null;
  image_category?: string | null;
  featured_image_url?: string | null;
  image_alt_text?: string | null;
  seo_headline?: string | null;
  discover_category?: string | null;
  keywords?: string[] | null;
  seo_keywords?: string[] | null;
  category: string;
  teams?: string[] | null;
};

export const SPORTS_LEAGUES = ["nfl", "mlb", "nba", "nhl", "mls", "nwsl", "wnba", "cfb"] as const satisfies readonly LeagueSlug[];
const SPORT_KINDS = [...SPORTS_LEAGUES.map((league) => `sports-${league}`), "sports-general", "sports-policy", "sports-motorsports"];

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function toSportsListItem(row: CategoryFeedItem): SportsListItem {
  return {
    slug: row.slug,
    title: row.title,
    dek: row.dek ?? "",
    author: row.author,
    published_at: row.published_at,
    image_url: row.image_url,
    image_hash: row.image_hash,
    image_category: row.image_category,
    featured_image_url: row.featured_image_url,
    image_alt_text: row.image_alt_text,
    seo_headline: row.seo_headline,
    discover_category: row.discover_category,
    keywords: row.keywords,
    seo_keywords: row.seo_keywords,
    category: row.category,
    teams: row.teams,
  };
}

function searchableText(row: CategoryFeedItem): string {
  return [row.title, row.dek, row.category, row.kind, ...(row.keywords ?? []), ...(row.seo_keywords ?? [])].filter(Boolean).join(" ");
}

async function sportsRows(limit = 160): Promise<CategoryFeedItem[]> {
  return getArticlesByCategory({ data: { kind: SPORT_KINDS, limit, order: "newest" } });
}

export const listSportsLatest = createServerFn({ method: "GET" })
  .validator((input) => z.object({ limit: z.number().int().min(1).max(60).default(24) }).parse(input ?? {}))
  .handler(async ({ data }): Promise<{ items: SportsListItem[] }> => {
    const rows = await sportsRows(Math.min(data.limit * 2, 120));
    return { items: rows.slice(0, data.limit).map(toSportsListItem) };
  });

export const listSportsTrending = createServerFn({ method: "GET" })
  .validator((input) => z.object({ limit: z.number().int().min(1).max(30).default(12) }).parse(input ?? {}))
  .handler(async ({ data }): Promise<{ items: SportsListItem[] }> => {
    const rows = await sportsRows(160);
    const supabase = client();
    if (!supabase || rows.length === 0) return { items: rows.slice(0, data.limit).map(toSportsListItem) };

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: signals } = await supabase
      .from("texas_news_feed")
      .select("internal_slug,viral_score,trend_velocity,pub_date")
      .not("internal_slug", "is", null)
      .gte("pub_date", since)
      .order("viral_score", { ascending: false, nullsFirst: false })
      .order("trend_velocity", { ascending: false, nullsFirst: false })
      .limit(120);

    const rank = new Map<string, number>();
    for (const signal of signals ?? []) {
      if (!signal.internal_slug || rank.has(signal.internal_slug)) continue;
      const score = Number(signal.viral_score ?? 0) * 1000 + Number(signal.trend_velocity ?? 0) * 100;
      rank.set(signal.internal_slug, score);
    }
    const ranked = rows
      .filter((row) => rank.has(row.slug))
      .sort((a, b) => (rank.get(b.slug) ?? 0) - (rank.get(a.slug) ?? 0));
    const result = ranked.length > 0 ? ranked : rows;
    return { items: result.slice(0, data.limit).map(toSportsListItem) };
  });

export const listSportsByLeague = createServerFn({ method: "GET" })
  .validator((input) => z.object({ league: z.enum(SPORTS_LEAGUES) }).parse(input))
  .handler(async ({ data }): Promise<{ items: SportsListItem[] }> => {
    const rows = await getArticlesByCategory({ data: { kind: `sports-${data.league}`, limit: 100, order: "newest" } });
    const items = rows
      .filter((row) => shouldDisplayBreakingSports(row.kind, row.published_at, "league"))
      .slice(0, 50)
      .map(toSportsListItem);
    return { items };
  });

export const listSportsByTopic = createServerFn({ method: "GET" })
  .validator((input) => z.object({ topic: z.enum(SPORTS_TOPIC_SLUGS), limit: z.number().int().min(1).max(60).default(30) }).parse(input))
  .handler(async ({ data }): Promise<{ items: SportsListItem[] }> => {
    if (data.topic === "trending") return listSportsTrending({ data: { limit: data.limit } });
    const rows = await sportsRows(160);
    const topic = data.topic as SportsTopicSlug;
    const filtered = topic === "latest"
      ? rows
      : rows.filter((row) => classifySportsText(searchableText(row)).topics.includes(topic));
    return { items: filtered.slice(0, data.limit).map(toSportsListItem) };
  });

/** Team page feed: canonical team tags are primary; keyword matching preserves
 * legacy rows and catches multi-team stories. */
export const listSportsByTeam = createServerFn({ method: "GET" })
  .validator((input) => z.object({ team: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{ items: SportsListItem[] }> => {
    if (!isTeamSlug(data.team)) return { items: [] };
    const supabase = client();
    if (!supabase) return { items: [] };
    const team = TEAM_BY_SLUG[data.team];
    const select = "slug,title,dek,author,published_at,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,keywords,seo_keywords,category,teams,kind,body_json";

    const canonical = await supabase
      .from("daily_articles")
      .select(select)
      .contains("teams", [team.slug])
      .order("published_at", { ascending: false })
      .limit(60);

    const keywordOr = team.keywords
      .map((keyword) => keyword.replace(/[,()]/g, " ").trim())
      .filter(Boolean)
      .flatMap((keyword) => [`title.ilike.%${keyword}%`, `dek.ilike.%${keyword}%`])
      .join(",");
    const legacy = keywordOr
      ? await supabase
          .from("daily_articles")
          .select(select)
          .eq("kind", `sports-${team.league}`)
          .or(keywordOr)
          .order("published_at", { ascending: false })
          .limit(60)
      : { data: [], error: null as unknown };

    const merged = new Map<string, SportsListItem & { kind?: string | null; body_json?: unknown }>();
    for (const row of (canonical.data ?? []) as (SportsListItem & { kind?: string | null; body_json?: unknown })[]) merged.set(row.slug, row);
    for (const row of (legacy.data ?? []) as (SportsListItem & { kind?: string | null; body_json?: unknown })[]) if (!merged.has(row.slug)) merged.set(row.slug, row);

    const items = Array.from(merged.values())
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .filter((row) => meetsArticleMainWordCount(row.kind, row.body_json as never))
      .filter((row) => shouldDisplayBreakingSports(row.kind, row.published_at, "team"))
      .map(({ kind: _kind, body_json: _bodyJson, ...row }) => row);
    return { items };
  });
