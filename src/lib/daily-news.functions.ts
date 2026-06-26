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
    .select("slug,category,title,dek,author,source_name,source_url,image_url,published_at")
    .order("published_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("getDailyArticles failed", error);
    return { articles: [] as DailyArticle[] };
  }
  return { articles: (data ?? []) as DailyArticle[] };
});