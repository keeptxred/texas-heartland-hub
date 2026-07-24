// Shared website-only category feed service.
//
// Single source of truth for pulling published rows out of `public.daily_articles`
// for any website category page (Texas News, Politics, Houston, Business,
// Non-Political, Sports, etc.). All website category feeds should route
// through this function so filtering, word-count gates, and ordering stay
// consistent across the site.
//
// NOT related to admin, publishing_queue, content_packages, Facebook, or any
// social workflow — those systems continue to use their own paths.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { meetsArticleMainWordCount } from "@/lib/article-length";

export type CategoryFeedItem = {
  slug: string;
  title: string;
  dek: string | null;
  category: string;
  kind: string | null;
  image_url: string | null;
  image_hash: string | null;
  image_category: string | null;
  featured_image_url: string | null;
  image_alt_text: string | null;
  seo_headline: string | null;
  discover_category: string | null;
  keywords: string[] | null;
  seo_keywords: string[] | null;
  source_name: string | null;
  author: string;
  published_at: string;
  teams: string[] | null;
  affected_regions: string[] | null;
};

const SELECT_COLS =
  "slug,title,dek,category,kind,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,keywords,seo_keywords,source_name,author,published_at,teams,affected_regions,body_json";

const InputSchema = z.object({
  // Display category name as stored on daily_articles.category (e.g. "Economy",
  // "Non-Political", "Sports Culture"). Optional — omit to skip filter.
  category: z.string().min(1).max(64).optional(),
  // Region tag added by the content-quality enrichment pass.
  region: z
    .enum(["statewide", "houston", "dfw", "austin", "san-antonio", "el-paso", "rural"])
    .optional(),
  // `kind` filter (e.g. "evergreen", "ingested", "sports-nfl"). Optional.
  kind: z.union([z.string().min(1).max(32), z.array(z.string().min(1).max(32))]).optional(),
  limit: z.number().int().min(1).max(200).default(24),
  offset: z.number().int().min(0).max(2000).default(0),
  order: z.enum(["newest", "oldest"]).default("newest"),
});

export type GetArticlesByCategoryInput = z.input<typeof InputSchema>;

async function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const getArticlesByCategory = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CategoryFeedItem[]> => {
    const supabase = await client();
    if (!supabase) return [];

    // Fetch a padded window so word-count filtering and pagination still
    // return `limit` items after gating.
    const windowSize = Math.min(data.offset + data.limit * 3 + 20, 300);

    let q = supabase.from("daily_articles").select(SELECT_COLS);
    if (data.category) q = q.eq("category", data.category);
    if (data.region) q = q.contains("affected_regions", [data.region]);
    if (data.kind) {
      q = Array.isArray(data.kind) ? q.in("kind", data.kind) : q.eq("kind", data.kind);
    }
    q = q.order("published_at", { ascending: data.order === "oldest" }).limit(windowSize);

    const { data: rows, error } = await q;
    if (error) {
      console.error("getArticlesByCategory failed", error);
      return [];
    }

    const gated = ((rows ?? []) as (CategoryFeedItem & { body_json?: unknown })[])
      .filter((row) => meetsArticleMainWordCount(row.kind, row.body_json as never))
      .map(({ body_json: _b, ...row }) => row);

    return gated.slice(data.offset, data.offset + data.limit);
  });
