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
import { getArticlesByCategory, type CategoryFeedItem } from "./category-feed.functions";

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
    const rows = await getArticlesByCategory({
      data: { category: categoryName, limit: 24, order: "newest" },
    });
    return rows.map((r: CategoryFeedItem) => ({
      slug: r.slug,
      title: r.title,
      dek: r.dek,
      category: r.category,
      image_url: r.image_url,
      image_category: r.image_category,
      image_hash: r.image_hash,
      featured_image_url: r.featured_image_url,
      image_alt_text: r.image_alt_text,
      seo_headline: r.seo_headline,
      discover_category: r.discover_category,
      keywords: r.keywords,
      seo_keywords: r.seo_keywords,
      source_name: r.source_name,
      author: r.author,
      published_at: r.published_at,
      kind: r.kind ?? "",
    }));
  });