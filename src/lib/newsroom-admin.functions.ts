import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const actionSchema = z.enum(["SELECT", "HOLD", "REJECT", "RELEASE"]);

function assertAdminToken(token: string) {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  if (token !== expected) throw new Error("Unauthorized");
}

export const getNewsroomAdminSnapshot = createServerFn({ method: "POST" })
  .validator((d) => z.object({ token: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    assertAdminToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Newsroom tables intentionally lead generated Supabase types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const today = new Date().toISOString().slice(0, 10);

    const [budgetResult, candidatesResult, clustersResult, packetsResult, draftsResult, briefsResult, cronResult] = await Promise.all([
      db.from("ai_generation_budget").select("*").eq("site", "keeptxred").eq("budget_date", today).maybeSingle(),
      db.from("news_publish_candidates")
        .select("id,cluster_id,editorial_score,score_breakdown,recommended_format,status,selection_reason,rejection_reason,selected_at,published_at,created_at,updated_at")
        .order("editorial_score", { ascending: false }).limit(100),
      db.from("news_story_clusters")
        .select("id,canonical_subject,canonical_headline,cluster_type,status,pillar_slug,score,score_breakdown,confidence,source_count,primary_source_count,first_seen_at,last_seen_at,selected_at,published_at,published_article_id")
        .order("score", { ascending: false }).limit(150),
      db.from("news_research_packets")
        .select("cluster_id,packet_json,source_count,primary_source_count,created_at,updated_at")
        .order("updated_at", { ascending: false }).limit(150),
      db.from("newsroom_generation_drafts")
        .select("id,candidate_id,cluster_id,mode,status,validation_reasons,main_word_count,provider,model,provider_attempts,published_article_id,created_at")
        .order("created_at", { ascending: false }).limit(50),
      db.from("newsroom_daily_briefs")
        .select("id,brief_date,mode,status,candidate_ids,cluster_ids,validation_reasons,main_word_count,provider,model,provider_attempts,published_article_id,created_at")
        .order("created_at", { ascending: false }).limit(20),
      db.rpc("newsroom_admin_cron_health"),
    ]);

    for (const result of [budgetResult, candidatesResult, clustersResult, packetsResult, draftsResult, briefsResult]) {
      if (result.error) throw new Error(result.error.message);
    }

    const clusters = clustersResult.data ?? [];
    const candidates = candidatesResult.data ?? [];
    const packets = packetsResult.data ?? [];
    const packetByCluster = new Map(packets.map((packet: any) => [packet.cluster_id, packet]));
    const clusterById = new Map(clusters.map((cluster: any) => [cluster.id, cluster]));

    const queue = candidates.map((candidate: any) => ({
      ...candidate,
      cluster: clusterById.get(candidate.cluster_id) ?? null,
      packet: packetByCluster.get(candidate.cluster_id) ?? null,
    }));

    const statusCounts = queue.reduce((acc: Record<string, number>, row: any) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1;
      return acc;
    }, {});
    const formatCounts = queue.reduce((acc: Record<string, number>, row: any) => {
      acc[row.recommended_format] = (acc[row.recommended_format] ?? 0) + 1;
      return acc;
    }, {});

    return {
      ok: true as const,
      generatedAt: new Date().toISOString(),
      budget: budgetResult.data ?? null,
      queue,
      statusCounts,
      formatCounts,
      drafts: draftsResult.data ?? [],
      briefs: briefsResult.data ?? [],
      cronHealth: cronResult.error ? [] : (cronResult.data ?? []),
    };
  });

export const updateNewsroomEditorialState = createServerFn({ method: "POST" })
  .validator((d) => z.object({
    token: z.string().min(1),
    candidateId: z.string().uuid(),
    action: actionSchema,
    reason: z.string().max(500).optional().default(""),
  }).parse(d))
  .handler(async ({ data }) => {
    assertAdminToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const { data: candidate, error: readError } = await db
      .from("news_publish_candidates")
      .select("id,cluster_id,status")
      .eq("id", data.candidateId)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!candidate) throw new Error("Candidate not found");
    if (candidate.status === "PUBLISHED") throw new Error("Published candidates cannot be changed here");

    const now = new Date().toISOString();
    const reason = data.reason.trim();
    const candidatePatch: Record<string, unknown> = {};
    const clusterPatch: Record<string, unknown> = {};

    if (data.action === "SELECT") {
      candidatePatch.status = "SELECTED";
      candidatePatch.selected_at = now;
      candidatePatch.selection_reason = reason || "Selected in Admin Editorial Control Center";
      candidatePatch.rejection_reason = null;
      clusterPatch.status = "SELECTED";
      clusterPatch.selected_at = now;
    } else if (data.action === "HOLD") {
      candidatePatch.status = "HELD";
      candidatePatch.selection_reason = reason || "Held in Admin Editorial Control Center";
      candidatePatch.rejection_reason = null;
      clusterPatch.status = "HELD";
    } else if (data.action === "REJECT") {
      candidatePatch.status = "REJECTED";
      candidatePatch.rejection_reason = reason || "Rejected in Admin Editorial Control Center";
      candidatePatch.selection_reason = null;
      clusterPatch.status = "SKIPPED";
    } else {
      candidatePatch.status = "PENDING";
      candidatePatch.selection_reason = null;
      candidatePatch.rejection_reason = null;
      candidatePatch.selected_at = null;
      clusterPatch.status = "READY";
      clusterPatch.selected_at = null;
    }

    const [candidateUpdate, clusterUpdate] = await Promise.all([
      db.from("news_publish_candidates").update(candidatePatch).eq("id", candidate.id),
      db.from("news_story_clusters").update(clusterPatch).eq("id", candidate.cluster_id),
    ]);
    if (candidateUpdate.error) throw new Error(candidateUpdate.error.message);
    if (clusterUpdate.error) throw new Error(clusterUpdate.error.message);

    return { ok: true as const, candidateId: candidate.id, clusterId: candidate.cluster_id, action: data.action };
  });
