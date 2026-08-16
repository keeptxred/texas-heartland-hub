import { createFileRoute } from "@tanstack/react-router";
import { decideNewsroomFormat } from "@/lib/newsroom-decision-engine";

const LOOKBACK_HOURS = 48;
const CANDIDATE_LIMIT = 500;

type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  status: string;
  created_at: string;
};

type ClusterRow = {
  id: string;
  canonical_subject: string;
  source_count: number;
  primary_source_count: number;
  status: string;
};

type MembershipRow = {
  cluster_id: string;
  relationship_type: string;
  is_primary_source: boolean;
};

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // New newsroom tables intentionally lead the committed generated Database type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: candidateData, error: candidateError } = await newsroomDb
    .from("news_publish_candidates")
    .select("id,cluster_id,editorial_score,status,created_at")
    .in("status", ["PENDING", "HELD"])
    .gte("created_at", since)
    .order("editorial_score", { ascending: false })
    .limit(CANDIDATE_LIMIT);
  if (candidateError) return Response.json({ ok: false, error: candidateError.message }, { status: 500 });
  const candidates = (candidateData ?? []) as CandidateRow[];
  if (!candidates.length) return Response.json({ ok: true, decided: 0, decisions: {}, aiCalls: 0 });

  const clusterIds = candidates.map((candidate) => candidate.cluster_id);
  const [{ data: clusterData, error: clusterError }, { data: membershipData, error: membershipError }] = await Promise.all([
    newsroomDb
      .from("news_story_clusters")
      .select("id,canonical_subject,source_count,primary_source_count,status")
      .in("id", clusterIds),
    newsroomDb
      .from("news_story_cluster_items")
      .select("cluster_id,relationship_type,is_primary_source")
      .in("cluster_id", clusterIds),
  ]);
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });
  if (membershipError) return Response.json({ ok: false, error: membershipError.message }, { status: 500 });
  const clusters = (clusterData ?? []) as ClusterRow[];
  const memberships = (membershipData ?? []) as MembershipRow[];

  const clusterById = new Map<string, ClusterRow>(clusters.map((cluster) => [cluster.id, cluster]));
  const membershipsByCluster = new Map<string, MembershipRow[]>();
  for (const membership of memberships) {
    membershipsByCluster.set(membership.cluster_id, [...(membershipsByCluster.get(membership.cluster_id) ?? []), membership]);
  }

  const results = candidates.map((candidate) => {
    const cluster = clusterById.get(candidate.cluster_id);
    const members = membershipsByCluster.get(candidate.cluster_id) ?? [];
    const result = decideNewsroomFormat({
      editorialScore: candidate.editorial_score,
      sourceCount: cluster?.source_count ?? 1,
      primarySourceCount: Math.max(cluster?.primary_source_count ?? 0, members.filter((member) => member.is_primary_source).length),
      trendSignalCount: members.filter((member) => member.relationship_type === "trend-signal").length,
    });
    return { candidate, cluster, result };
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

  const clusterUpdates = results.flatMap(({ candidate, cluster, result }) => cluster ? [{
    id: candidate.cluster_id,
    canonical_subject: cluster.canonical_subject,
    cluster_type: result.decision,
  }] : []);
  if (clusterUpdates.length) {
    const { error: clusterUpdateError } = await newsroomDb
      .from("news_story_clusters")
      .upsert(clusterUpdates, { onConflict: "id" });
    if (clusterUpdateError) return Response.json({ ok: false, error: clusterUpdateError.message }, { status: 500 });
  }

  const decisions = results.reduce<Record<string, number>>((counts, { result }) => {
    counts[result.decision] = (counts[result.decision] ?? 0) + 1;
    return counts;
  }, {});

  return Response.json({ ok: true, decided: results.length, decisions, aiCalls: 0 });
}

export const Route = createFileRoute("/api/public/hooks/decide-newsroom-packages")({
  server: { handlers: { GET: handler, POST: handler } },
});
