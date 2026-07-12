// Live-DB companion to articles-by-category.ts.
// Runs the exact query the user requested:
//   supabase.from("daily_articles").select("*").eq("category", activeFilter);
// activeFilter is the topic slug from the URL; we map it to the display
// category name via CATEGORY_SLUG_TO_NAME so /texas-news/economy queries
// category = "Economy", etc. Returns [] for unknown filters or on error —
// never throws, so the loader stays SSR-safe.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CATEGORY_SLUG_TO_NAME, isCategorySlug } from "./articles-by-category";

export type LiveArticleRow = {
  slug: string;
  title: string;
  dek: string | null;
  category: string;
  image_url: string | null;
  image_category?: string | null;
  image_hash?: string | null;
  featured_image_url?: string | null;
  image_alt_text?: string | null;
  seo_headline?: string | null;
  discover_category?: string | null;
  keywords?: string[] | null;
  seo_keywords?: string[] | null;
  source_name: string | null;
  author: string;
  published_at: string;
  kind: string;
};

export const getLiveArticlesByCategory = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ activeFilter: z.string().max(40) }).parse(input),
  )
  .handler(async ({ data }): Promise<LiveArticleRow[]> => {
    if (!isCategorySlug(data.activeFilter)) return [];
    const categoryName = CATEGORY_SLUG_TO_NAME[data.activeFilter];

    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return [];
    const supabase = createClient(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const { data: rows, error } = await supabase
      .from("daily_articles")
      .select(
        "slug,title,dek,category,image_url,image_category,image_hash,featured_image_url,image_alt_text,seo_headline,discover_category,keywords,seo_keywords,source_name,author,published_at,kind",
      )
      .eq("category", categoryName)
      .order("published_at", { ascending: false })
      .limit(24);

    if (error) {
      console.error("getLiveArticlesByCategory failed", error);
      return [];
    }
    return (rows ?? []) as LiveArticleRow[];
  });