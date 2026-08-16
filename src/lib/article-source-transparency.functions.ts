import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  buildArticleSourceTransparency,
  type ArticleSourceTransparency,
  type DurableSourceRow,
  type FallbackSource,
} from "@/lib/article-source-transparency";

const slugSchema = z.object({ slug: z.string().min(1).max(240) });

async function fallbackSources(db: any, slug: string): Promise<FallbackSource[]> {
  const { data, error } = await db
    .from("daily_articles")
    .select("body_json")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data?.body_json || typeof data.body_json !== "object") return [];
  const sources = (data.body_json as { sources?: unknown }).sources;
  if (!Array.isArray(sources)) return [];
  return sources
    .filter((source): source is { label?: string; url?: string } => Boolean(source) && typeof source === "object")
    .map((source) => ({ label: source.label, url: source.url }));
}

/**
 * Public article provenance is resolved server-side with the service client.
 * Only explicitly whitelisted citation metadata leaves the server. Raw source
 * text, normalized text, match scores and match rationale remain internal.
 */
export const getArticleSourceTransparency = createServerFn({ method: "POST" })
  .validator((value) => slugSchema.parse(value))
  .handler(async ({ data }): Promise<ArticleSourceTransparency> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Durable multi-source tables intentionally lead generated Supabase types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const fallback = await fallbackSources(db, data.slug);

    const clusterResult = await db
      .from("news_event_clusters")
      .select("id,source_count,independent_source_count")
      .eq("published_slug", data.slug)
      .eq("status", "published")
      .not("published_article_id", "is", null)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (clusterResult.error || !clusterResult.data) {
      return buildArticleSourceTransparency({ fallbackSources: fallback });
    }

    const sourceResult = await db
      .from("news_event_cluster_sources")
      .select("source_name,source_family,source_url,canonical_url,headline,published_at,relationship_type,is_primary_record,is_independent_source")
      .eq("cluster_id", clusterResult.data.id)
      .order("is_primary_record", { ascending: false })
      .order("published_at", { ascending: false });

    if (sourceResult.error) {
      return buildArticleSourceTransparency({ fallbackSources: fallback });
    }

    return buildArticleSourceTransparency({
      durableSources: (sourceResult.data ?? []) as DurableSourceRow[],
      fallbackSources: fallback,
      durableSourceCount: clusterResult.data.source_count,
      durableIndependentSourceCount: clusterResult.data.independent_source_count,
    });
  });
