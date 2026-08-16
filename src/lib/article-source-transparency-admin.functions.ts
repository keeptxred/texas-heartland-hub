import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const relationshipSchema = z.enum(["primary", "supporting", "confirmation", "background"]);
const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("SET_RELATIONSHIP"),
    token: z.string().min(1),
    clusterId: z.string().uuid(),
    sourceId: z.string().uuid(),
    relationshipType: relationshipSchema,
    note: z.string().max(500).optional().default(""),
  }),
  z.object({
    action: z.literal("SET_LINEAGE"),
    token: z.string().min(1),
    clusterId: z.string().uuid(),
    sourceId: z.string().uuid(),
    sourceFamily: z.string().trim().min(2).max(200),
    isIndependent: z.boolean(),
    note: z.string().max(500).optional().default(""),
  }),
  z.object({
    action: z.literal("SPLIT_SOURCE"),
    token: z.string().min(1),
    clusterId: z.string().uuid(),
    sourceId: z.string().uuid(),
    note: z.string().max(500).optional().default(""),
  }),
  z.object({
    action: z.literal("MERGE_CLUSTER"),
    token: z.string().min(1),
    clusterId: z.string().uuid(),
    targetClusterId: z.string().uuid(),
    note: z.string().max(500).optional().default(""),
  }),
  z.object({
    action: z.literal("SYNC_ARTICLE_SOURCES"),
    token: z.string().min(1),
    clusterId: z.string().uuid(),
    note: z.string().max(500).optional().default(""),
  }),
]);

export type SourceProvenanceAdminMutation = z.infer<typeof actionSchema>;

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

    const [clustersResult, auditResult] = await Promise.all([
      db
        .from("news_event_clusters")
        .select("id,cluster_key,canonical_headline,status,match_score,source_count,independent_source_count,first_seen_at,last_seen_at,published_at,published_slug,published_article_id,metadata,updated_at")
        .neq("status", "archived")
        .order("last_seen_at", { ascending: false })
        .limit(125),
      db
        .from("news_event_cluster_admin_actions")
        .select("id,action,source_cluster_id,target_cluster_id,source_row_id,actor,note,created_at")
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

    if (clustersResult.error) throw new Error(clustersResult.error.message);
    // Phase 9 migration can roll out shortly after app code. Keep the source
    // inspector usable if the audit table is not visible for a few seconds.
    const audit = auditResult.error ? [] : (auditResult.data ?? []);
    const clusters = clustersResult.data ?? [];
    const clusterIds = clusters.map((cluster: any) => cluster.id);
    if (clusterIds.length === 0) {
      return { ok: true as const, generatedAt: new Date().toISOString(), clusters: [], audit };
    }

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
      clusters: clusters.map((cluster: any) => ({
        ...cluster,
        primaryRecordCount: (byCluster.get(cluster.id) ?? []).filter((source: any) => source.is_primary_record).length,
        sources: byCluster.get(cluster.id) ?? [],
      })),
      audit,
    };
  });

export const mutateSourceProvenanceAdmin = createServerFn({ method: "POST" })
  .validator((value) => actionSchema.parse(value))
  .handler(async ({ data }) => {
    assertAdminToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const payload: Record<string, unknown> = {
      p_action: data.action,
      p_cluster_id: data.clusterId,
      p_source_id: "sourceId" in data ? data.sourceId : null,
      p_target_cluster_id: "targetClusterId" in data ? data.targetClusterId : null,
      p_relationship_type: "relationshipType" in data ? data.relationshipType : null,
      p_source_family: "sourceFamily" in data ? data.sourceFamily : null,
      p_is_independent: "isIndependent" in data ? data.isIndependent : null,
      p_note: data.note.trim() || null,
      p_actor: "admin-source-provenance",
    };

    const { data: result, error } = await db.rpc("admin_mutate_news_event_cluster", payload);
    if (error) throw new Error(error.message);
    return result as {
      ok: true;
      action: string;
      cluster_id: string;
      target_cluster_id?: string | null;
      source_id?: string | null;
      sync?: { synced?: boolean; source_count?: number; published_slug?: string | null };
    };
  });
