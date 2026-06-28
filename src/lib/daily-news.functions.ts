import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export type DailyArticle = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
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
    .select("slug,category,title,dek,author,source_name,source_url,image_url,published_at,kind,score,is_breaking")
    .order("published_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("getDailyArticles failed", error);
    return { articles: [] as DailyArticle[] };
  }

  // Pull the freshest live RSS items and surface them as breaking cards so the
  // homepage breaking strip refreshes every 30 minutes alongside the RSS feed.
  // Only items from the last 6 hours stay in the rotation — older items get
  // demoted to "Happening Now" (last 24h) and then to topic pages.
  const sinceIso = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const { data: feed } = await supabase
    .from("texas_news_feed")
    .select("title,source,link,description,pub_date")
    .gte("pub_date", sinceIso)
    .order("pub_date", { ascending: false })
    .limit(6);

  const liveBreaking: DailyArticle[] = (feed ?? []).map((row, i) => ({
    slug: `live-${i}-${row.link}`,
    category: row.source ?? "Live",
    title: row.title,
    dek: row.description ?? "",
    author: row.source ?? "Live Feed",
    source_name: row.source ?? null,
    source_url: row.link,
    image_url: null,
    published_at: row.pub_date,
    kind: "live",
    score: 100,
    is_breaking: true,
  }));

  // Demote daily breaking articles older than 6 hours: clear the flag in-memory
  // so the homepage strip only shows fresh items. They still appear in news
  // listings and topic pages via the normal sort.
  const demoteCutoff = Date.now() - 6 * 60 * 60 * 1000;
  const dailyRotated = ((data ?? []) as DailyArticle[]).map((a) => {
    if (a.is_breaking && Date.parse(a.published_at) < demoteCutoff) {
      return { ...a, is_breaking: false };
    }
    return a;
  });

  return { articles: [...liveBreaking, ...dailyRotated] };
});