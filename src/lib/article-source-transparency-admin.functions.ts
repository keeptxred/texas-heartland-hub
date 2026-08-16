import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function assertAdminToken(token: string) {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  if (token !== expected) throw new Error("Unauthorized");
}

export const getSourceProvenanceAdminSnapshot = createServerFn({ method: "POST" })
  .validator((value) => z.object({ token: z.string().min(1) }).parse(value))
  .handler(async ({ data }) => {
    assertAdminToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Durable provenance tables intentionally lead generated Supabase types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const { data: clusters, error: clusterError } = await db
      .from("news_event_clusters")
      .select("id,cluster_key,canonical_headline,status,match_score,source_count,independent_source_count,first_seen_at,last_seen_at,published_at,published_slug,published_article_id")
      .eq("status", "published")
      .not("published_slug", "is", null)
      .order("published_at", { ascending: false })
      .limit(75);
    if (clusterError) throw new Error(clusterError.message);

    const clusterIds = (clusters ?? []).map((cluster: any) => cluster.id);
    if (clusterIds.length === 0) return { ok: true as const, generatedAt: new Date().toISOString(), clusters: [] };

    const { data: sources, error: sourceError } = await db
      .from("news_event_cluster_sources")
      .select("id,cluster_id,feed_item_id,relationship_type,source_name,source_family,source_url,canonical_url,headline,published_at,is_primary_record,is_independent_source,match_score,match_reason,created_at")
      .in("cluster_id", clusterIds)
      .order("is_primary_record", { ascending: false })
      .order("published_at", { ascending: false });
    if (sourceError) throw new Error(sourceError.message);

    const byCluster = new Map<string, any[]>();
    for (const source of sources ?? []) {
      const rows = byCluster.get(source.cluster_id) ?? [];
      rows.push(source);
      byCluster.set(source.cluster_id, rows);
    }

    return {
      ok: true as const,
      generatedAt: new Date().toISOString(),
      clusters: (clusters ?? []).map((cluster: any) => ({
        ...cluster,
        primaryRecordCount: (byCluster.get(cluster.id) ?? []).filter((source: any) => source.is_primary_record).length,
        sources: byCluster.get(cluster.id) ?? [],
      })),
    };
  });
