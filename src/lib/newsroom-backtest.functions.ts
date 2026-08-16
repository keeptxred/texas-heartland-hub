import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runNewsroomHistoricalBacktest } from "./newsroom-backtest";

function assertAdminToken(token: string) {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  if (token !== expected) throw new Error("Unauthorized");
}

export const getNewsroomHistoricalBacktest = createServerFn({ method: "POST" })
  .validator((d) => z.object({
    token: z.string().min(1),
    days: z.number().int().min(1).max(120).default(30),
  }).parse(d))
  .handler(async ({ data }) => {
    assertAdminToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Newsroom tables intentionally lead generated Supabase types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const since = new Date(Date.now() - data.days * 24 * 60 * 60 * 1000).toISOString();

    const { data: candidateData, error: candidateError } = await db
      .from("news_publish_candidates")
      .select("id,cluster_id,editorial_score,recommended_format,status,published_at,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (candidateError) throw new Error(candidateError.message);

    const candidates = candidateData ?? [];
    const clusterIds = [...new Set(candidates.map((candidate: any) => candidate.cluster_id))];
    if (!clusterIds.length) {
      return {
        ok: true as const,
        days: data.days,
        since,
        generatedAt: new Date().toISOString(),
        aiCalls: 0,
        writes: 0,
        result: runNewsroomHistoricalBacktest({ candidates: [], clusters: [], memberships: [] }),
      };
    }

    const [{ data: clusterData, error: clusterError }, { data: membershipData, error: membershipError }] = await Promise.all([
      db.from("news_story_clusters")
        .select("id,canonical_subject,pillar_slug,source_count,primary_source_count,first_seen_at,last_seen_at,published_at")
        .in("id", clusterIds),
      db.from("news_story_cluster_items")
        .select("cluster_id,relationship_type,is_primary_source")
        .in("cluster_id", clusterIds),
    ]);
    if (clusterError) throw new Error(clusterError.message);
    if (membershipError) throw new Error(membershipError.message);

    const result = runNewsroomHistoricalBacktest({
      candidates: candidates.map((row: any) => ({
        id: row.id,
        clusterId: row.cluster_id,
        editorialScore: row.editorial_score,
        recommendedFormat: row.recommended_format,
        status: row.status,
        publishedAt: row.published_at,
        createdAt: row.created_at,
      })),
      clusters: (clusterData ?? []).map((row: any) => ({
        id: row.id,
        canonicalSubject: row.canonical_subject,
        pillarSlug: row.pillar_slug,
        sourceCount: row.source_count,
        primarySourceCount: row.primary_source_count,
        firstSeenAt: row.first_seen_at,
        lastSeenAt: row.last_seen_at,
        publishedAt: row.published_at,
      })),
      memberships: (membershipData ?? []).map((row: any) => ({
        clusterId: row.cluster_id,
        relationshipType: row.relationship_type,
        isPrimarySource: row.is_primary_source,
      })),
    });

    return {
      ok: true as const,
      days: data.days,
      since,
      generatedAt: new Date().toISOString(),
      aiCalls: 0,
      writes: 0,
      result,
    };
  });
