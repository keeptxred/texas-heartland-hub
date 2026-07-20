import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { TEAM_BY_SLUG, isTeamSlug } from "./texas-teams";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { shouldDisplayBreakingSports } from "@/lib/sports-lifecycle";
import { getArticlesByCategory } from "./category-feed.functions";

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

const LEAGUES = ["nfl", "mlb", "nba"] as const;
export type League = (typeof LEAGUES)[number];

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const listSportsByLeague = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ league: z.enum(LEAGUES) }).parse(d))
  .handler(async ({ data }): Promise<{ items: SportsListItem[] }> => {
    const rows = await getArticlesByCategory({
      data: { kind: `sports-${data.league}`, limit: 100, order: "newest" },
    });
    const items = rows
      .filter((row) => shouldDisplayBreakingSports(row.kind, row.published_at, "league"))
      .slice(0, 50)
      .map((r) => ({
        slug: r.slug,
        title: r.title,
        dek: r.dek ?? "",
        author: r.author,
        published_at: r.published_at,
        image_url: r.image_url,
        image_hash: r.image_hash,
        image_category: r.image_category,
        featured_image_url: r.featured_image_url,
        image_alt_text: r.image_alt_text,
        seo_headline: r.seo_headline,
        discover_category: r.discover_category,
        keywords: r.keywords,
        seo_keywords: r.seo_keywords,
        category: r.category,
        teams: null,
      }));
    return { items };
  });

/** Team page feed: an article shows up on a team page if either
 *  (a) its `teams[]` array contains the team slug (canonical, set at ingest), or
 *  (b) its title/dek mentions the team by keyword (fallback for legacy rows
 *      written before teams[] existed). This is what makes cross-posting work
 *      — one article can appear on multiple team pages. */
export const listSportsByTeam = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ team: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<{ items: SportsListItem[] }> => {
    if (!isTeamSlug(data.team)) return { items: [] };
    const supabase = client();
    if (!supabase) return { items: [] };
    const team = TEAM_BY_SLUG[data.team];

    // Primary: canonical tag match.
    const canonical = await supabase
      .from("daily_articles")
      .select("slug,title,dek,author,published_at,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,keywords,seo_keywords,category,teams,kind,body_json")
      .contains("teams", [team.slug])
      .order("published_at", { ascending: false })
      .limit(50);

    // Fallback: keyword scan of sports rows for the team's league (covers rows
    // written before teams[] was added, and lets an NFL story that mentions
    // "Cowboys" show up on the Cowboys page even if ingest missed it).
    const kindFilter = `sports-${team.league}`;
    const keywordOr = team.keywords
      .map((k) => k.replace(/[,()]/g, " ").trim())
      .filter(Boolean)
      .flatMap((k) => [`title.ilike.%${k}%`, `dek.ilike.%${k}%`])
      .join(",");
    const legacy = keywordOr
      ? await supabase
          .from("daily_articles")
          .select("slug,title,dek,author,published_at,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,keywords,seo_keywords,category,teams,kind,body_json")
          .eq("kind", kindFilter)
          .or(keywordOr)
          .order("published_at", { ascending: false })
          .limit(50)
      : { data: [], error: null as unknown };

    const merged = new Map<string, SportsListItem & { kind?: string | null; body_json?: unknown }>();
    for (const r of (canonical.data ?? []) as (SportsListItem & { kind?: string | null; body_json?: unknown })[]) merged.set(r.slug, r);
    for (const r of (legacy.data ?? []) as (SportsListItem & { kind?: string | null; body_json?: unknown })[]) if (!merged.has(r.slug)) merged.set(r.slug, r);

    const items = Array.from(merged.values()).sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )
      .filter((row) => meetsArticleMainWordCount(row.kind, row.body_json as never))
      .filter((row) => shouldDisplayBreakingSports(row.kind, row.published_at, "team"))
      .map(({ kind: _kind, body_json: _bodyJson, ...row }) => row);
    return { items };
  });