// Shared website-only category feed service.
//
// Single source of truth for pulling published rows out of `public.daily_articles`
// for any website category page. Public feeds use the same AdSense/readiness
// floor as homepage/newsroom discovery so alternate browse routes cannot
// re-promote a row that has been deliberately withheld from Google-facing pages.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { meetsArticleMainWordCount } from "@/lib/article-length";
import { isPublicArticleReady } from "@/lib/public-article-readiness";

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

type CategoryFeedRow = CategoryFeedItem & {
  source_url?: string | null;
  content_quality_score?: number | null;
  body_json?: unknown;
  quality_flags?: string[] | null;
};

const SELECT_COLS =
  "slug,title,dek,category,kind,image_url,image_hash,image_category,featured_image_url,image_alt_text,seo_headline,discover_category,keywords,seo_keywords,source_name,source_url,author,published_at,teams,affected_regions,body_json,quality_flags,content_quality_score";

const InputSchema = z.object({
  category: z.string().min(1).max(64).optional(),
  region: z
    .enum(["statewide", "houston", "dfw", "austin", "san-antonio", "el-paso", "rural"])
    .optional(),
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
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CategoryFeedItem[]> => {
    const supabase = await client();
    if (!supabase) return [];

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

    const gated = ((rows ?? []) as CategoryFeedRow[])
      .filter((row) =>
        isPublicArticleReady(row)
        && meetsArticleMainWordCount(row.kind, row.body_json as never),
      )
      .map(({
        source_url: _sourceUrl,
        content_quality_score: _qualityScore,
        body_json: _bodyJson,
        quality_flags: _qualityFlags,
        ...row
      }) => row);

    return gated.slice(data.offset, data.offset + data.limit);
  });
