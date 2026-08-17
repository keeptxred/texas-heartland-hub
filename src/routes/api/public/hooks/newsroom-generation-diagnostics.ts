import { createFileRoute } from "@tanstack/react-router";
import { categoryForPillar } from "@/lib/newsroom-rewrite-adapter";
import { researchPacketEvidenceChars, type ResearchPacket } from "@/lib/newsroom-research-packet";

const STANDARD_MIN_SOURCE_EVIDENCE_CHARS = 5_000;
const LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS = 9_000;

type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  recommended_format: string;
  status: string;
};
type ClusterRow = { id: string; pillar_slug: string | null };
type PacketRow = { cluster_id: string; packet_json: ResearchPacket; source_count: number; primary_source_count: number };

function evidenceFloorForPillar(pillar: string | null): number {
  const category = categoryForPillar(pillar).toLowerCase();
  return category === "sports" || category === "education" || category === "non-political"
    ? LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS
    : STANDARD_MIN_SOURCE_EVIDENCE_CHARS;
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Newsroom tables intentionally lead generated Supabase types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;

  const { data: candidateData, error: candidateError } = await db
    .from("news_publish_candidates")
    .select("id,cluster_id,editorial_score,recommended_format,status")
    .in("status", ["PENDING", "HELD"])
    .in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"])
    .order("editorial_score", { ascending: false })
    .limit(100);
  if (candidateError) return Response.json({ ok: false, error: candidateError.message }, { status: 500 });
  const candidates = (candidateData ?? []) as CandidateRow[];
  if (!candidates.length) return Response.json({ ok: true, aiCalls: 0, writes: 0, candidates: [], summary: { total: 0 } });

  const clusterIds = candidates.map((candidate) => candidate.cluster_id);
  const candidateIds = candidates.map((candidate) => candidate.id);
  const [clusterResult, packetResult, draftResult] = await Promise.all([
    db.from("news_story_clusters").select("id,pillar_slug").in("id", clusterIds),
    db.from("news_research_packets").select("cluster_id,packet_json,source_count,primary_source_count").in("cluster_id", clusterIds),
    db.from("newsroom_generation_drafts").select("candidate_id").eq("mode", "shadow").in("candidate_id", candidateIds),
  ]);
  if (clusterResult.error) return Response.json({ ok: false, error: clusterResult.error.message }, { status: 500 });
  if (packetResult.error) return Response.json({ ok: false, error: packetResult.error.message }, { status: 500 });
  if (draftResult.error) return Response.json({ ok: false, error: draftResult.error.message }, { status: 500 });

  const clusterById = new Map<string, ClusterRow>((clusterResult.data ?? []).map((row: ClusterRow) => [row.id, row]));
  const packetByCluster = new Map<string, PacketRow>((packetResult.data ?? []).map((row: PacketRow) => [row.cluster_id, row]));
  const shadowed = new Set<string>((draftResult.data ?? []).map((row: { candidate_id: string }) => row.candidate_id));

  const diagnostics = candidates.map((candidate) => {
    const cluster = clusterById.get(candidate.cluster_id);
    const packet = packetByCluster.get(candidate.cluster_id);
    const pillar = cluster?.pillar_slug ?? null;
    const evidenceFloor = evidenceFloorForPillar(pillar);
    const evidenceChars = packet ? researchPacketEvidenceChars(packet.packet_json) : 0;
    const alreadyShadowed = shadowed.has(candidate.id);
    let exclusionReason: string | null = null;
    if (alreadyShadowed) exclusionReason = "already_shadowed";
    else if (!cluster) exclusionReason = "missing_cluster";
    else if (!packet) exclusionReason = "missing_packet";
    else if (packet.source_count <= 0) exclusionReason = "empty_packet";
    else if (evidenceChars < evidenceFloor) exclusionReason = "below_evidence_floor";

    return {
      candidateId: candidate.id,
      clusterId: candidate.cluster_id,
      score: candidate.editorial_score,
      format: candidate.recommended_format,
      status: candidate.status,
      pillar,
      sourceCount: packet?.source_count ?? 0,
      primarySourceCount: packet?.primary_source_count ?? 0,
      evidenceChars,
      evidenceFloor,
      evidenceGap: Math.max(0, evidenceFloor - evidenceChars),
      alreadyShadowed,
      eligible: exclusionReason === null,
      exclusionReason,
    };
  });

  const reasonCounts = diagnostics.reduce<Record<string, number>>((acc, row) => {
    const key = row.exclusionReason ?? "eligible";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const eligible = diagnostics.filter((row) => row.eligible);
  const closestBelowFloor = diagnostics
    .filter((row) => row.exclusionReason === "below_evidence_floor")
    .sort((a, b) => a.evidenceGap - b.evidenceGap || b.score - a.score)
    .slice(0, 15);

  return Response.json({
    ok: true,
    aiCalls: 0,
    writes: 0,
    summary: {
      total: diagnostics.length,
      eligible: eligible.length,
      reasonCounts,
      maxEvidenceChars: Math.max(0, ...diagnostics.map((row) => row.evidenceChars)),
    },
    eligible: eligible.slice(0, 10),
    closestBelowFloor,
    topCandidates: diagnostics.slice(0, 20),
  });
}

export const Route = createFileRoute("/api/public/hooks/newsroom-generation-diagnostics")({
  server: { handlers: { GET: handler, POST: handler } },
});
