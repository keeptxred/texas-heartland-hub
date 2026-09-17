import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { hasSeoDuplicateFlag } from "@/lib/article-canonical";
import { isKeepTxRedSearchOwnedStory } from "@/lib/ktr-search-ownership";
import {
  isPublicArticleReady,
  type PublicArticleCandidate,
} from "@/lib/public-article-readiness";

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function shouldNoindexCloudArticle(
  candidate: PublicArticleCandidate | string[] | null | undefined,
  lookupSucceeded: boolean,
): boolean {
  if (!lookupSucceeded) return true;
  if (Array.isArray(candidate) || candidate == null) {
    return hasSeoDuplicateFlag(candidate as string[] | null | undefined);
  }
  return !isPublicArticleReady(candidate);
}

export const getCloudArticleIndexability = createServerFn({ method: "GET" })
  .validator((data) => z.object({ slug: z.string().min(1).max(240) }).parse(data))
  .handler(async ({ data }): Promise<{ noindex: boolean }> => {
    const supabase = client();
    if (!supabase) return { noindex: true };

    const { data: row, error } = await supabase
      .from("daily_articles")
      .select("title,dek,kind,category,discover_category,source_name,source_url,published_at,content_quality_score,body_json,quality_flags,image_url,featured_image_url,image_generation_status")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error || !row) return { noindex: true };
    if (!isKeepTxRedSearchOwnedStory({
      title: row.title ?? "",
      description: row.dek,
      category: row.category,
      source: row.source_name,
      kind: row.kind,
    })) {
      return { noindex: true };
    }
    return { noindex: shouldNoindexCloudArticle(row as PublicArticleCandidate, true) };
  });
