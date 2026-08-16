import { createFileRoute } from "@tanstack/react-router";
import { buildResearchPacket } from "@/lib/newsroom-research-packet";

const LOOKBACK_HOURS = 48;
const CANDIDATE_LIMIT = 250;

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: candidates, error: candidateError } = await newsroomDb
    .from("news_publish_candidates")
    .select("cluster_id,editorial_score,recommended_format,status,created_at")
    .in("status", ["PENDING", "HELD", "SELECTED"])
    .neq("recommended_format", "SKIP")
    .gte("created_at", since)
    .order("editorial_score", { ascending: false })
    .limit(CANDIDATE_LIMIT);
  if (candidateError) return Response.json({ ok: false, error: candidateError.message }, { status: 500 });
  if (!(candidates ?? []).length) return Response.json({ ok: true, built: 0, sourceItems: 0, aiCalls: 0 });

  const clusterIds = candidates.map((candidate: { cluster_id: string }) => candidate.cluster_id);
  const [{ data: clusters, error: clusterError }, { data: memberships, error: membershipError }] = await Promise.all([
    newsroomDb.from("news_story_clusters").select("id,canonical_subject,pillar_slug").in("id", clusterIds),
    newsroomDb.from("news_story_cluster_items").select("cluster_id,feed_item_id,is_primary_source").in("cluster_id", clusterIds),
  ]);
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });
  if (membershipError) return Response.json({ ok: false, error: membershipError.message }, { status: 500 });

  const feedIds = [...new Set((memberships ?? []).map((row: { feed_item_id: number }) => row.feed_item_id))];
  const { data: feeds, error: feedError } = feedIds.length
    ? await supabaseAdmin
      .from("texas_news_feed")
      .select("id,title,source,link,pub_date,description,extracted_body,source_reputation_score")
      .in("id", feedIds)
    : { data: [], error: null };
  if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });

  const clusterById = new Map((clusters ?? []).map((cluster: { id: string; canonical_subject: string; pillar_slug: string | null }) => [cluster.id, cluster]));
  const feedById = new Map((feeds ?? []).map((feed) => [feed.id, feed]));
  const membershipsByCluster = new Map<string, Array<{ feed_item_id: number; is_primary_source: boolean }>>();
  for (const membership of memberships ?? []) {
    membershipsByCluster.set(membership.cluster_id, [...(membershipsByCluster.get(membership.cluster_id) ?? []), membership]);
  }

  const packets = (candidates ?? []).flatMap((candidate: { cluster_id: string; editorial_score: number; recommended_format: string }) => {
    const cluster = clusterById.get(candidate.cluster_id);
    if (!cluster) return [];
    const members = membershipsByCluster.get(candidate.cluster_id) ?? [];
    const sources = members.flatMap((membership) => {
      const feed = feedById.get(membership.feed_item_id);
      if (!feed) return [];
      return [{
        feedItemId: feed.id,
        title: feed.title ?? "",
        source: feed.source ?? "",
        url: feed.link ?? "",
        publishedAt: feed.pub_date ?? null,
        description: feed.description ?? "",
        extractedBody: feed.extracted_body ?? "",
        isPrimarySource: membership.is_primary_source,
        sourceReputationScore: feed.source_reputation_score ?? null,
      }];
    });
    const packet = buildResearchPacket({
      clusterId: candidate.cluster_id,
      subject: cluster.canonical_subject,
      pillar: cluster.pillar_slug,
      recommendedFormat: candidate.recommended_format,
      editorialScore: candidate.editorial_score,
      sources,
    });
    return [{
      cluster_id: candidate.cluster_id,
      packet_version: packet.packetVersion,
      packet_json: packet,
      source_count: packet.sources.length,
      primary_source_count: packet.sources.filter((source) => source.isPrimarySource).length,
      built_at: new Date().toISOString(),
    }];
  });

  if (packets.length) {
    const { error: upsertError } = await newsroomDb
      .from("news_research_packets")
      .upsert(packets, { onConflict: "cluster_id" });
    if (upsertError) return Response.json({ ok: false, error: upsertError.message }, { status: 500 });
  }

  return Response.json({
    ok: true,
    built: packets.length,
    sourceItems: packets.reduce((sum, packet) => sum + packet.source_count, 0),
    primarySourceItems: packets.reduce((sum, packet) => sum + packet.primary_source_count, 0),
    aiCalls: 0,
  });
}

export const Route = createFileRoute("/api/public/hooks/build-newsroom-research-packets")({
  server: { handlers: { GET: handler, POST: handler } },
});
