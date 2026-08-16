import { createFileRoute } from "@tanstack/react-router";
import { clusterNewsFeedItems } from "@/lib/newsroom-clustering";

const LOOKBACK_HOURS = 48;
const CLUSTER_LIMIT = 500;
const CLUSTER_VERSION = 1;

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // The generated Database type is refreshed separately from schema migrations.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: normalizedRows, error: normalizedError } = await newsroomDb
    .from("news_feed_normalization")
    .select("feed_item_id,normalized_title,source_key,observed_at")
    .gte("observed_at", since)
    .is("duplicate_of_feed_item_id", null)
    .order("observed_at", { ascending: false })
    .limit(CLUSTER_LIMIT);
  if (normalizedError) return Response.json({ ok: false, error: normalizedError.message }, { status: 500 });

  const feedIds = (normalizedRows ?? []).map((row: { feed_item_id: number }) => row.feed_item_id);
  if (!feedIds.length) {
    return Response.json({ ok: true, scanned: 0, clusters: 0, multiSourceClusters: 0, memberships: 0, aiCalls: 0 });
  }

  const { data: feedRows, error: feedError } = await supabaseAdmin
    .from("texas_news_feed")
    .select("id,source,link,pillar_slug,target_site")
    .in("id", feedIds);
  if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });

  const feedById = new Map((feedRows ?? []).map((row) => [row.id, row]));
  const clusterable = (normalizedRows ?? [])
    .filter((row: { feed_item_id: number }) => {
      const feed = feedById.get(row.feed_item_id);
      return feed && (!feed.target_site || feed.target_site === "keeptxred");
    })
    .map((row: { feed_item_id: number; normalized_title: string; source_key: string; observed_at: string }) => ({
      feedItemId: row.feed_item_id,
      normalizedTitle: row.normalized_title,
      sourceKey: row.source_key,
      observedAt: row.observed_at,
      pillarSlug: feedById.get(row.feed_item_id)?.pillar_slug ?? null,
    }));

  const clusters = clusterNewsFeedItems(clusterable);
  const now = new Date().toISOString();
  const clusterRows = clusters.map((cluster) => {
    const members = cluster.memberFeedItemIds.map((id) => feedById.get(id)).filter(Boolean);
    const sourceCount = new Set(members.map((row) => row!.source)).size;
    return {
      cluster_key: `deterministic-v${CLUSTER_VERSION}:${cluster.anchorFeedItemId}`,
      canonical_subject: cluster.canonicalSubject,
      source_count: sourceCount,
      primary_source_count: 0,
      confidence: cluster.confidence,
      last_seen_at: now,
    };
  });

  const { data: savedClusters, error: clusterError } = await newsroomDb
    .from("news_story_clusters")
    .upsert(clusterRows, { onConflict: "cluster_key" })
    .select("id,cluster_key");
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });

  const idByKey = new Map((savedClusters ?? []).map((row: { id: string; cluster_key: string }) => [row.cluster_key, row.id]));
  const memberships = clusters.flatMap((cluster) => {
    const clusterId = idByKey.get(`deterministic-v${CLUSTER_VERSION}:${cluster.anchorFeedItemId}`);
    if (!clusterId) return [];
    return cluster.memberFeedItemIds.map((feedItemId) => {
      const feed = feedById.get(feedItemId);
      return {
        cluster_id: clusterId,
        feed_item_id: feedItemId,
        relationship_type: "supporting",
        weight: 1,
        is_primary_source: false,
        source_name: feed?.source ?? null,
        source_url: feed?.link ?? null,
      };
    });
  });

  if (memberships.length) {
    const { error: membershipError } = await newsroomDb
      .from("news_story_cluster_items")
      .upsert(memberships, { onConflict: "cluster_id,feed_item_id" });
    if (membershipError) return Response.json({ ok: false, error: membershipError.message }, { status: 500 });
  }

  const multiSourceClusters = clusterRows.filter((row) => row.source_count > 1).length;
  return Response.json({
    ok: true,
    scanned: clusterable.length,
    clusters: clusters.length,
    multiSourceClusters,
    memberships: memberships.length,
    clusterVersion: CLUSTER_VERSION,
    aiCalls: 0,
  });
}

export const Route = createFileRoute("/api/public/hooks/cluster-newsroom-stories")({
  server: { handlers: { GET: handler, POST: handler } },
});
