import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export type SportsListItem = {
  slug: string;
  title: string;
  dek: string;
  author: string;
  published_at: string;
  image_url: string | null;
  category: string;
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
    const supabase = client();
    if (!supabase) return { items: [] };
    const { data: rows, error } = await supabase
      .from("daily_articles")
      .select("slug,title,dek,author,published_at,image_url,image_hash,category")
      .eq("kind", `sports-${data.league}`)
      .order("published_at", { ascending: false })
      .limit(50);
    if (error || !rows) return { items: [] };
    return { items: rows as SportsListItem[] };
  });