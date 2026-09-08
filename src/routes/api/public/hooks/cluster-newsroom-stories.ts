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

type ExistingClusterRow = {
  id: string;
  cluster_key: string;
  canonical_subject: string;
  source_count: number;
  primary_source_count: number;
  confidence: number;
  last_seen_at: string;
};

type SavedClusterRow = { id: string; cluster_key: string };

function sameInstant(left: string, right: string): boolean {
  const leftMs = Date.parse(left);
  const rightMs = Date.parse(right);
  return Number.isFinite(leftMs) && Number.isFinite(rightMs) ? leftMs === rightMs : left === right;
}

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
  const observedAtByFeedId = new Map<number, string>(normalizedRows.map((row) => [row.feed_item_id, row.observed_at]));
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
  const clusterRows = clusters.map((cluster) => {
    const members = cluster.memberFeedItemIds
      .map((id) => feedById.get(id))
      .filter((row): row is FeedRouteRow => Boolean(row));
    const sourceCount = countDistinctNewsSources(members);
    const primarySourceCount = countDistinctPrimaryNewsSources(members);
    const lastSeenAt = cluster.memberFeedItemIds.reduce<string | null>((latest, feedItemId) => {
      const observedAt = observedAtByFeedId.get(feedItemId);
      if (!observedAt) return latest;
      if (!latest || Date.parse(observedAt) > Date.parse(latest)) return observedAt;
      return latest;
    }, null);
    return {
      cluster_key: `deterministic-v${CLUSTER_VERSION}:${cluster.anchorFeedItemId}`,
      canonical_subject: cluster.canonicalSubject,
      source_count: sourceCount,
      primary_source_count: primarySourceCount,
      confidence: cluster.confidence,
      last_seen_at: lastSeenAt ?? new Date().toISOString(),
    };
  });

  let savedClusters: SavedClusterRow[] = [];
  if (clusterRows.length) {
    const clusterKeys = clusterRows.map((row) => row.cluster_key);
    const { data: existingData, error: existingError } = await newsroomDb
      .from("news_story_clusters")
      .select("id,cluster_key,canonical_subject,source_count,primary_source_count,confidence,last_seen_at")
      .in("cluster_key", clusterKeys);
    if (existingError) return Response.json({ ok: false, error: existingError.message }, { status: 500 });

    const existingClusters = (existingData ?? []) as ExistingClusterRow[];
    const existingByKey = new Map(existingClusters.map((row) => [row.cluster_key, row]));
    const changedRows = clusterRows.filter((row) => {
      const prior = existingByKey.get(row.cluster_key);
      return !prior
        || prior.canonical_subject !== row.canonical_subject
        || Number(prior.source_count) !== row.source_count
        || Number(prior.primary_source_count) !== row.primary_source_count
        || Number(prior.confidence) !== Number(row.confidence)
        || !sameInstant(prior.last_seen_at, row.last_seen_at);
    });

    const changedSaved: SavedClusterRow[] = [];
    if (changedRows.length) {
      const { data: savedData, error: clusterError } = await newsroomDb
        .from("news_story_clusters")
        .upsert(changedRows, { onConflict: "cluster_key" })
        .select("id,cluster_key");
      if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });
      changedSaved.push(...((savedData ?? []) as SavedClusterRow[]));
    }

    const changedByKey = new Map(changedSaved.map((row) => [row.cluster_key, row]));
    savedClusters = clusterRows.flatMap((row) => {
      const changed = changedByKey.get(row.cluster_key);
      if (changed) return [changed];
      const existing = existingByKey.get(row.cluster_key);
      return existing ? [{ id: existing.id, cluster_key: existing.cluster_key }] : [];
    });
  }

  const idByKey = new Map<string, string>(savedClusters.map((row) => [row.cluster_key, row.id]));
  const memberships = clusters.flatMap((cluster) => {
    const clusterId = idByKey.get(`deterministic-v${CLUSTER_VERSION}:${cluster.anchorFeedItemId}`);
    if (!clusterId) return [];
    return cluster.memberFeedItemIds.map((feedItemId) => {
      const feed = feedById.get(feedItemId);
      const primary = isPrimaryNewsSource(feed?.source, feed?.link);
      return {
        cluster_id: clusterId,
        feed_item_id: feedItemId,
        relationship_type: primary ? "primary" : "supporting",
        weight: 1,
        is_primary_source: primary,
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
