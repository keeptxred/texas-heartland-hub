import { createFileRoute } from "@tanstack/react-router";
import { decideNewsroomFormat } from "@/lib/newsroom-decision-engine";

const LOOKBACK_HOURS = 48;
const CANDIDATE_LIMIT = 500;

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: candidates, error: candidateError } = await newsroomDb
    .from("news_publish_candidates")
    .select("id,cluster_id,editorial_score,status,created_at")
    .in("status", ["PENDING", "HELD"])
    .gte("created_at", since)
    .order("editorial_score", { ascending: false })
    .limit(CANDIDATE_LIMIT);
  if (candidateError) return Response.json({ ok: false, error: candidateError.message }, { status: 500 });
  if (!(candidates ?? []).length) return Response.json({ ok: true, decided: 0, decisions: {}, aiCalls: 0 });

  const clusterIds = candidates.map((candidate: { cluster_id: string }) => candidate.cluster_id);
  const [{ data: clusters, error: clusterError }, { data: memberships, error: membershipError }] = await Promise.all([
    newsroomDb
      .from("news_story_clusters")
      .select("id,source_count,primary_source_count,status")
      .in("id", clusterIds),
    newsroomDb
      .from("news_story_cluster_items")
      .select("cluster_id,relationship_type,is_primary_source")
      .in("cluster_id", clusterIds),
  ]);
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });
  if (membershipError) return Response.json({ ok: false, error: membershipError.message }, { status: 500 });

  const clusterById = new Map((clusters ?? []).map((cluster: { id: string }) => [cluster.id, cluster]));
  const membershipsByCluster = new Map<string, Array<{ relationship_type: string; is_primary_source: boolean }>>();
  for (const membership of memberships ?? []) {
    membershipsByCluster.set(membership.cluster_id, [...(membershipsByCluster.get(membership.cluster_id) ?? []), membership]);
  }

  const results = (candidates ?? []).map((candidate: { id: string; cluster_id: string; editorial_score: number }) => {
    const cluster = clusterById.get(candidate.cluster_id);
    const members = membershipsByCluster.get(candidate.cluster_id) ?? [];
    const result = decideNewsroomFormat({
      editorialScore: candidate.editorial_score,
      sourceCount: cluster?.source_count ?? 1,
      primarySourceCount: Math.max(cluster?.primary_source_count ?? 0, members.filter((member) => member.is_primary_source).length),
      trendSignalCount: members.filter((member) => member.relationship_type === "trend-signal").length,
    });
    return { candidate, result };
  });

  const candidateUpdates = results.map(({ candidate, result }) => ({
    id: candidate.id,
    cluster_id: candidate.cluster_id,
    editorial_score: candidate.editorial_score,
    recommended_format: result.decision,
    selection_reason: result.decision === "SKIP" ? null : result.reason,
    rejection_reason: result.decision === "SKIP" ? result.reason : null,
  }));
  const { error: updateError } = await newsroomDb
    .from("news_publish_candidates")
    .upsert(candidateUpdates, { onConflict: "id" });
  if (updateError) return Response.json({ ok: false, error: updateError.message }, { status: 500 });

  const clusterUpdates = results.map(({ candidate, result }) => ({
    id: candidate.cluster_id,
    cluster_type: result.decision,
  }));
  const { error: clusterUpdateError } = await newsroomDb
    .from("news_story_clusters")
    .upsert(clusterUpdates, { onConflict: "id" });
  if (clusterUpdateError) return Response.json({ ok: false, error: clusterUpdateError.message }, { status: 500 });

  const decisions = results.reduce<Record<string, number>>((counts, { result }) => {
    counts[result.decision] = (counts[result.decision] ?? 0) + 1;
    return counts;
  }, {});

  return Response.json({ ok: true, decided: results.length, decisions, aiCalls: 0 });
}

export const Route = createFileRoute("/api/public/hooks/decide-newsroom-packages")({
  server: { handlers: { GET: handler, POST: handler } },
});
