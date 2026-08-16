import { createFileRoute } from "@tanstack/react-router";
import { routeEditorialPillar, scoreEditorialCluster } from "@/lib/newsroom-editorial-scoring";

const LOOKBACK_HOURS = 48;
const CLUSTER_LIMIT = 500;

function maxNumber(values: Array<number | null | undefined>, fallback = 0): number {
  const finite = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return finite.length ? Math.max(...finite) : fallback;
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: clusters, error: clusterError } = await newsroomDb
    .from("news_story_clusters")
    .select("id,canonical_subject,status,source_count,primary_source_count,first_seen_at,last_seen_at")
    .in("status", ["DISCOVERED", "READY"])
    .gte("last_seen_at", since)
    .order("last_seen_at", { ascending: false })
    .limit(CLUSTER_LIMIT);
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });
  if (!(clusters ?? []).length) return Response.json({ ok: true, scored: 0, candidates: 0, aiCalls: 0, quotaEnforced: false });

  const clusterIds = clusters.map((cluster: { id: string }) => cluster.id);
  const { data: memberships, error: membershipError } = await newsroomDb
    .from("news_story_cluster_items")
    .select("cluster_id,feed_item_id,is_primary_source")
    .in("cluster_id", clusterIds);
  if (membershipError) return Response.json({ ok: false, error: membershipError.message }, { status: 500 });

  const feedIds = [...new Set((memberships ?? []).map((row: { feed_item_id: number }) => row.feed_item_id))];
  const { data: feedRows, error: feedError } = feedIds.length
    ? await supabaseAdmin
      .from("texas_news_feed")
      .select("id,pillar_slug,texas_relevance_score,source_reputation_score,viral_score,trend_velocity,pub_date,created_at")
      .in("id", feedIds)
    : { data: [], error: null };
  if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });

  const feedById = new Map((feedRows ?? []).map((row) => [row.id, row]));
  const membersByCluster = new Map<string, Array<{ feed_item_id: number; is_primary_source: boolean }>>();
  for (const membership of memberships ?? []) {
    membersByCluster.set(membership.cluster_id, [...(membersByCluster.get(membership.cluster_id) ?? []), membership]);
  }

  const now = Date.now();
  const scored = clusters.map((cluster: {
    id: string;
    canonical_subject: string;
    source_count: number;
    primary_source_count: number;
    first_seen_at: string;
  }) => {
    const members = membersByCluster.get(cluster.id) ?? [];
    const feeds = members.map((member) => feedById.get(member.feed_item_id)).filter(Boolean);
    const ageHours = Math.max(0, (now - Date.parse(cluster.first_seen_at)) / 3_600_000);
    const score = scoreEditorialCluster({
      texasRelevance: maxNumber(feeds.map((feed) => feed?.texas_relevance_score), 50),
      sourceReputation: maxNumber(feeds.map((feed) => feed?.source_reputation_score), 50),
      viralScore: maxNumber(feeds.map((feed) => feed?.viral_score), 0),
      trendVelocity: maxNumber(feeds.map((feed) => feed?.trend_velocity), 0),
      sourceCount: cluster.source_count,
      primarySourceCount: Math.max(cluster.primary_source_count, members.filter((member) => member.is_primary_source).length),
      ageHours,
    });
    const pillarSlug = routeEditorialPillar({
      canonicalSubject: cluster.canonical_subject,
      persistedPillars: feeds.map((feed) => feed?.pillar_slug),
    });
    return { cluster, score, pillarSlug };
  });

  const clusterUpdates = scored.map(({ cluster, score, pillarSlug }) => ({
    id: cluster.id,
    canonical_subject: cluster.canonical_subject,
    score: score.score,
    score_breakdown: score.breakdown,
    pillar_slug: pillarSlug,
    status: "READY",
  }));
  const { error: updateError } = await newsroomDb
    .from("news_story_clusters")
    .upsert(clusterUpdates, { onConflict: "id" });
  if (updateError) return Response.json({ ok: false, error: updateError.message }, { status: 500 });

  const candidates = scored.map(({ cluster, score }) => ({
    cluster_id: cluster.id,
    editorial_score: score.score,
    score_breakdown: score.breakdown,
  }));
  const { error: candidateError } = await newsroomDb
    .from("news_publish_candidates")
    .upsert(candidates, { onConflict: "cluster_id" });
  if (candidateError) return Response.json({ ok: false, error: candidateError.message }, { status: 500 });

  return Response.json({
    ok: true,
    scored: scored.length,
    candidates: candidates.length,
    topScore: Math.max(0, ...scored.map(({ score }) => score.score)),
    aiCalls: 0,
    quotaEnforced: false,
  });
}

export const Route = createFileRoute("/api/public/hooks/score-newsroom-stories")({
  server: { handlers: { GET: handler, POST: handler } },
});
