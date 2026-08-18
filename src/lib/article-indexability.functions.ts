import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { hasSeoDuplicateFlag } from "@/lib/article-canonical";

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/**
 * Cloud article indexability is deliberately fail-closed. A migration-backed
 * article can still render when Supabase is unavailable, so treating a failed
 * quality lookup as indexable would temporarily expose quarantined legacy
 * inventory to crawlers. A successful lookup may opt the article into indexing
 * only when none of the centralized SEO quarantine flags are present.
 */
export function shouldNoindexCloudArticle(
  flags: string[] | null | undefined,
  lookupSucceeded: boolean,
): boolean {
  return !lookupSucceeded || hasSeoDuplicateFlag(flags);
}

export const getCloudArticleIndexability = createServerFn({ method: "GET" })
  .validator((data) => z.object({ slug: z.string().min(1).max(240) }).parse(data))
  .handler(async ({ data }): Promise<{ noindex: boolean }> => {
    const supabase = client();
    if (!supabase) return { noindex: true };

    const { data: row, error } = await supabase
      .from("daily_articles")
      .select("quality_flags")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error || !row) return { noindex: true };
    const flags = (row as { quality_flags?: string[] | null }).quality_flags ?? null;
    return { noindex: shouldNoindexCloudArticle(flags, true) };
  });
