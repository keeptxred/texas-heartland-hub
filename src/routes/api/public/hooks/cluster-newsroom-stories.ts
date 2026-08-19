import { createFileRoute } from "@tanstack/react-router";
import { clusterNewsFeedItems } from "@/lib/newsroom-clustering";
import { isPrimaryNewsSource } from "@/lib/newsroom-editorial-scoring";
import { countDistinctNewsSources, countDistinctPrimaryNewsSources } from "@/lib/newsroom-source-quality";

const LOOKBACK_HOURS = 48;
const CLUSTER_LIMIT = 500;
const CLUSTER_VERSION = 1;

type NormalizationRow = {
  feed_item_id: number;
  normalized_title: string;
  source_key: string;
  observed_at: string;
};

type FeedRouteRow = {
  id: number;
  source: string | null;
  link: string | null;
  pillar_slug: string | null;
  target_site: string | null;
};

type SavedClusterRow = { id: string; cluster_key: string };

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // The generated Database type is refreshed separately from schema migrations.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: normalizationData, error: normalizedError } = await newsroomDb
    .from("news_feed_normalization")
    .select("feed_item_id,normalized_title,source_key,observed_at")
    .gte("observed_at", since)
    .is("duplicate_of_feed_item_id", null)
    .order("observed_at", { ascending: false })
    .limit(CLUSTER_LIMIT);
  if (normalizedError) return Response.json({ ok: false, error: normalizedError.message }, { status: 500 });
  const normalizedRows = (normalizationData ?? []) as NormalizationRow[];

  const feedIds = normalizedRows.map((row) => row.feed_item_id);
  if (!feedIds.length) {
    return Response.json({ ok: true, scanned: 0, clusters: 0, multiSourceClusters: 0, memberships: 0, aiCalls: 0 });
  }

  const { data: feedData, error: feedError } = await newsroomDb
    .from("texas_news_feed")
    .select("id,source,link,pillar_slug,target_site")
    .in("id", feedIds);
  if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });
  const feedRows = (feedData ?? []) as FeedRouteRow[];

  const feedById = new Map<number, FeedRouteRow>(feedRows.map((row) => [row.id, row]));
  const clusterable = normalizedRows
    .filter((row) => feedById.get(row.feed_item_id)?.target_site === "keeptxred")
    .map((row) => ({
      feedItemId: row.feed_item_id,
      normalizedTitle: row.normalized_title,
      sourceKey: row.source_key,
      observedAt: row.observed_at,
      pillarSlug: feedById.get(row.feed_item_id)?.pillar_slug ?? null,
    }));

  const clusters = clusterNewsFeedItems(clusterable);
  const now = new Date().toISOString();
  const clusterRows = clusters.map((cluster) => {
    const members = cluster.memberFeedItemIds
      .map((id) => feedById.get(id))
      .filter((row): row is FeedRouteRow => Boolean(row));
    const sourceCount = countDistinctNewsSources(members);
    const primarySourceCount = countDistinctPrimaryNewsSources(members);
    return {
      cluster_key: `deterministic-v${CLUSTER_VERSION}:${cluster.anchorFeedItemId}`,
      canonical_subject: cluster.canonicalSubject,
      source_count: sourceCount,
      primary_source_count: primarySourceCount,
      confidence: cluster.confidence,
      last_seen_at: now,
    };
  });

  const { data: savedData, error: clusterError } = await newsroomDb
    .from("news_story_clusters")
    .upsert(clusterRows, { onConflict: "cluster_key" })
    .select("id,cluster_key");
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });
  const savedClusters = (savedData ?? []) as SavedClusterRow[];

  const idByKey = new Map<string, string>(savedClusters.map((row) => [row.cluster_key, row.id]));
  const memberships = clusters.flatMap((cluster) => {
    const clusterId = idByKey.get(`deterministic-v${CLUSTER_VERSION}:${cluster.anchorFeedItemId}`);
    if (!clusterId) return [];
    return cluster.memberFeedItemIds.map((feedItemId) => {
      const feed = feedById.get(feedItemId);
      const isPrimarySource = isPrimaryNewsSource(feed?.source, feed?.link);
      return {
        cluster_id: clusterId,
        feed_item_id: feedItemId,
        relationship_type: isPrimarySource ? "primary" : "supporting",
        weight: 1,
        is_primary_source: isPrimarySource,
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
  const primarySourceItems = memberships.filter((row) => row.is_primary_source).length;
  const distinctPrimarySources = clusterRows.reduce((sum, row) => sum + row.primary_source_count, 0);
  return Response.json({
    ok: true,
    scanned: clusterable.length,
    clusters: clusters.length,
    multiSourceClusters,
    memberships: memberships.length,
    primarySourceItems,
    distinctPrimarySources,
    clusterVersion: CLUSTER_VERSION,
    aiCalls: 0,
  });
}

export const Route = createFileRoute("/api/public/hooks/cluster-newsroom-stories")({
  server: { handlers: { GET: handler, POST: handler } },
});
