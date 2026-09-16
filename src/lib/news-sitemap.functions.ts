import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const InputSchema = z.object({
  slugs: z.array(z.string().min(1).max(240)).max(1000),
});

/**
 * Resolve the exact headline shown on cloud-backed article pages for URLs that
 * have already passed the central sitemap/public-readiness gate. This is a
 * display-consistency lookup only; it does not decide indexability.
 */
export const getNewsSitemapHeadlines = createServerFn({ method: "GET" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<{ headlines: Record<string, string> }> => {
    const slugs = [...new Set(data.slugs.map((slug) => slug.trim()).filter(Boolean))];
    if (slugs.length === 0) return { headlines: {} };

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return { headlines: {} };

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: rows, error } = await supabase
      .from("daily_articles")
      .select("slug,seo_headline")
      .in("slug", slugs);

    if (error || !rows) {
      console.error("sitemap-news: SEO headline lookup failed", error?.message ?? "no rows");
      return { headlines: {} };
    }

    const headlines: Record<string, string> = {};
    for (const row of rows as Array<{ slug: string; seo_headline: string | null }>) {
      const headline = (row.seo_headline ?? "").trim();
      if (headline) headlines[row.slug] = headline;
    }
    return { headlines };
  });
