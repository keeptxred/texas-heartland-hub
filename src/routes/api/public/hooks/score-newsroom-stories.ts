import { createFileRoute } from "@tanstack/react-router";
import { routeEditorialPillar, scoreEditorialCluster } from "@/lib/newsroom-editorial-scoring";

const LOOKBACK_HOURS = 48;
const CLUSTER_LIMIT = 500;

type ClusterRow = {
  id: string;
  canonical_subject: string;
  status: string;
  source_count: number;
  primary_source_count: number;
  first_seen_at: string;
  last_seen_at: string;
};

type MembershipRow = { cluster_id: string; feed_item_id: number; is_primary_source: boolean };
type FeedScoreRow = {
  id: number;
  source: string | null;
  link: string | null;
  pillar_slug: string | null;
  texas_relevance_score: number | null;
  source_reputation_score: number | null;
  viral_score: number | null;
  trend_velocity: number | null;
  pub_date: string | null;
  created_at: string;
};

function maxNumber(values: Array<number | null | undefined>, fallback = 0): number {
  const finite = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return finite.length ? Math.max(...finite) : fallback;
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // New newsroom tables and recent feed columns intentionally lead the generated Database type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: clusterData, error: clusterError } = await newsroomDb
    .from("news_story_clusters")
    .select("id,canonical_subject,status,source_count,primary_source_count,first_seen_at,last_seen_at")
    .in("status", ["DISCOVERED", "READY"])
    .gte("last_seen_at", since)
    .order("last_seen_at", { ascending: false })
    .limit(CLUSTER_LIMIT);
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });
  const clusters = (clusterData ?? []) as ClusterRow[];
  if (!clusters.length) return Response.json({ ok: true, scored: 0, candidates: 0, aiCalls: 0, quotaEnforced: false });

  const clusterIds = clusters.map((cluster) => cluster.id);
  const { data: membershipData, error: membershipError } = await newsroomDb
    .from("news_story_cluster_items")
    .select("cluster_id,feed_item_id,is_primary_source")
    .in("cluster_id", clusterIds);
  if (membershipError) return Response.json({ ok: false, error: membershipError.message }, { status: 500 });
  const memberships = (membershipData ?? []) as MembershipRow[];

  const feedIds = [...new Set(memberships.map((row) => row.feed_item_id))];
  let feedRows: FeedScoreRow[] = [];
  if (feedIds.length) {
    const { data: feedData, error: feedError } = await newsroomDb
      .from("texas_news_feed")
      .select("id,source,link,pillar_slug,texas_relevance_score,source_reputation_score,viral_score,trend_velocity,pub_date,created_at")
      .in("id", feedIds);
    if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });
    feedRows = (feedData ?? []) as FeedScoreRow[];
  }

  const feedById = new Map<number, FeedScoreRow>(feedRows.map((row) => [row.id, row]));
  const membersByCluster = new Map<string, MembershipRow[]>();
  for (const membership of memberships) {
    membersByCluster.set(membership.cluster_id, [...(membersByCluster.get(membership.cluster_id) ?? []), membership]);
  }

  const now = Date.now();
  const scored = clusters.map((cluster) => {
    const members = membersByCluster.get(cluster.id) ?? [];
    const feeds = members
      .map((member) => feedById.get(member.feed_item_id))
      .filter((feed): feed is FeedScoreRow => Boolean(feed));
    const ageHours = Math.max(0, (now - Date.parse(cluster.first_seen_at)) / 3_600_000);
    const score = scoreEditorialCluster({
      texasRelevance: maxNumber(feeds.map((feed) => feed.texas_relevance_score), 50),
      sourceReputation: maxNumber(feeds.map((feed) => feed.source_reputation_score), 50),
      viralScore: maxNumber(feeds.map((feed) => feed.viral_score), 0),
      trendVelocity: maxNumber(feeds.map((feed) => feed.trend_velocity), 0),
      sourceCount: cluster.source_count,
      primarySourceCount: Math.max(cluster.primary_source_count, members.filter((member) => member.is_primary_source).length),
      ageHours,
    });
    const pillarSlug = routeEditorialPillar({
      canonicalSubject: cluster.canonical_subject,
      persistedPillars: feeds.map((feed) => feed.pillar_slug),
      sourceNames: feeds.map((feed) => feed.source),
      sourceUrls: feeds.map((feed) => feed.link),
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
