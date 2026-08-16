import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { evaluateNewsroomShadowProduction } from "./newsroom-shadow-production";

function assertAdminToken(token: string) {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  if (token !== expected) throw new Error("Unauthorized");
}

export const getNewsroomShadowProduction = createServerFn({ method: "POST" })
  .validator((d) => z.object({
    token: z.string().min(1),
    hours: z.number().int().min(6).max(168).default(48),
  }).parse(d))
  .handler(async ({ data }) => {
    assertAdminToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Newsroom tables intentionally lead generated Supabase types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const since = new Date(Date.now() - data.hours * 60 * 60 * 1000).toISOString();

    const { data: candidateData, error: candidateError } = await db
      .from("news_publish_candidates")
      .select("id,cluster_id,editorial_score,recommended_format,status,created_at")
      .gte("created_at", since)
      .order("editorial_score", { ascending: false })
      .limit(1000);
    if (candidateError) throw new Error(candidateError.message);

    const candidates = candidateData ?? [];
    const clusterIds = [...new Set(candidates.map((candidate: any) => candidate.cluster_id))];
    if (!clusterIds.length) {
      return {
        ok: true as const,
        hours: data.hours,
        since,
        generatedAt: new Date().toISOString(),
        aiCalls: 0,
        budgetReservations: 0,
        writes: 0,
        publishes: 0,
        result: evaluateNewsroomShadowProduction({ candidates: [], clusters: [], memberships: [], packets: [], drafts: [] }),
      };
    }

    const [clusterResult, membershipResult, packetResult, draftResult] = await Promise.all([
      db.from("news_story_clusters")
        .select("id,canonical_subject,pillar_slug,source_count,primary_source_count,first_seen_at")
        .in("id", clusterIds),
      db.from("news_story_cluster_items")
        .select("cluster_id,relationship_type,is_primary_source")
        .in("cluster_id", clusterIds),
      db.from("news_research_packets")
        .select("cluster_id")
        .in("cluster_id", clusterIds),
      db.from("newsroom_generation_drafts")
        .select("id,candidate_id,cluster_id,mode,status,main_word_count,validation_reasons,published_article_id,created_at")
        .eq("mode", "shadow")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (clusterResult.error) throw new Error(clusterResult.error.message);
    if (membershipResult.error) throw new Error(membershipResult.error.message);
    if (packetResult.error) throw new Error(packetResult.error.message);
    if (draftResult.error) throw new Error(draftResult.error.message);

    const result = evaluateNewsroomShadowProduction({
      candidates: candidates.map((row: any) => ({
        id: row.id,
        clusterId: row.cluster_id,
        editorialScore: row.editorial_score,
        recommendedFormat: row.recommended_format,
        status: row.status,
        createdAt: row.created_at,
      })),
      clusters: (clusterResult.data ?? []).map((row: any) => ({
        id: row.id,
        canonicalSubject: row.canonical_subject,
        pillarSlug: row.pillar_slug,
        sourceCount: row.source_count,
        primarySourceCount: row.primary_source_count,
        firstSeenAt: row.first_seen_at,
      })),
      memberships: (membershipResult.data ?? []).map((row: any) => ({
        clusterId: row.cluster_id,
        relationshipType: row.relationship_type,
        isPrimarySource: row.is_primary_source,
      })),
      packets: (packetResult.data ?? []).map((row: any) => ({ clusterId: row.cluster_id })),
      drafts: (draftResult.data ?? []).map((row: any) => ({
        id: row.id,
        candidateId: row.candidate_id,
        clusterId: row.cluster_id,
        mode: row.mode,
        status: row.status,
        mainWordCount: row.main_word_count,
        validationReasons: row.validation_reasons,
        publishedArticleId: row.published_article_id,
        createdAt: row.created_at,
      })),
    });

    return {
      ok: true as const,
      hours: data.hours,
      since,
      generatedAt: new Date().toISOString(),
      aiCalls: 0,
      budgetReservations: 0,
      writes: 0,
      publishes: 0,
      result,
    };
  });
