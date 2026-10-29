import { createFileRoute } from "@tanstack/react-router";
import { clusterNewsFeedItems, reserveDirectPublisherCohort } from "@/lib/newsroom-clustering";
import { isPrimaryNewsSource } from "@/lib/newsroom-editorial-scoring";
import { countDistinctNewsSources, countDistinctPrimaryNewsSources } from "@/lib/newsroom-source-quality";
import { staleUncommittedNewsroomMemberships } from "@/lib/newsroom-cluster-membership-reconciliation";

// Use the same 72-hour horizon as the normal production writer.
const LOOKBACK_HOURS = 72;
// Google News discovery wrappers are valuable leads but are not independently
// attributable source evidence. Preserve the most-recent discovery window
// while reserving space for the newest original publisher/agency URL records.
const CLUSTER_LIMIT = 500;
const DIRECT_PUBLISHER_COHORT_LIMIT = 320;
// Source normalization covers both websites. Reserve a bounded set of direct
// KeepTXRed publisher/agency records so TexasDefined sources and Google News
// wrappers cannot displace KTR's original reporting before clustering.
const KTR_DIRECT_PUBLISHER_COHORT_LIMIT = 240;
const KTR_DIRECT_NORMALIZATION_BATCH_SIZE = 80;
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
type MembershipWriteRow = {
  cluster_id: string;
  feed_item_id: number;
  relationship_type: string;
  weight: number;
  is_primary_source: boolean;
  source_name: string | null;
  source_url: string | null;
};
type ExistingMembershipRow = MembershipWriteRow;

function sameInstant(left: string, right: string): boolean {
  const leftMs = Date.parse(left);
  const rightMs = Date.parse(right);
  return Number.isFinite(leftMs) && Number.isFinite(rightMs) ? leftMs === rightMs : left === right;
}

function membershipKey(row: Pick<MembershipWriteRow, "cluster_id" | "feed_item_id">): string {
  return `${row.cluster_id}:${row.feed_item_id}`;
}

function sameMembership(left: MembershipWriteRow, right: ExistingMembershipRow | undefined): boolean {
  if (!right) return false;
  return left.cluster_id === right.cluster_id
    && left.feed_item_id === right.feed_item_id
    && left.relationship_type === right.relationship_type
    && Number(left.weight) === Number(right.weight)
    && left.is_primary_source === right.is_primary_source
    && left.source_name === right.source_name
    && left.source_url === right.source_url;
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // The generated Database type is refreshed separately from schema migrations.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const [{ data: normalizationData, error: normalizedError }, { data: directData, error: directError }] = await Promise.all([
    newsroomDb.from("news_feed_normalization")
      .select("feed_item_id,normalized_title,source_key,observed_at")
      .gte("observed_at", since)
      .is("duplicate_of_feed_item_id", null)
      .order("observed_at", { ascending: false })
      .limit(CLUSTER_LIMIT),
    newsroomDb.from("news_feed_normalization")
      .select("feed_item_id,normalized_title,source_key,observed_at")
      .gte("observed_at", since)
      .is("duplicate_of_feed_item_id", null)
      // Read only normalized URLs that identify a real publisher, not a
      // news.google.com/rSS wrapper. This is selection priority, never
      // verification: upstream and downstream source gates remain authoritative.
      .not("canonical_url", "ilike", "https://news.google.com/%")
      .order("observed_at", { ascending: false })
      .limit(DIRECT_PUBLISHER_COHORT_LIMIT),
  ]);
  if (normalizedError || directError) return Response.json({ ok: false, error: (normalizedError || directError).message }, { status: 500 });
  // Collect eligible KeepTXRed direct publisher IDs before spending the
  // existing 500-row O(N^2) similarity budget. This is a retrieval priority,
  // NOT a new primary-source designation or relaxed corroboration gate.
  const { data: ktrDirectFeedData, error: ktrDirectFeedError } = await newsroomDb
    .from("texas_news_feed")
    .select("id")
    .eq("target_site", "keeptxred")
    .gte("pub_date", since)
    .not("link", "ilike", "https://news.google.com/%")
    .not("link", "ilike", "http://news.google.com/%")
    .order("pub_date", { ascending: false })
    .limit(KTR_DIRECT_PUBLISHER_COHORT_LIMIT);
  if (ktrDirectFeedError) return Response.json({ ok: false, error: ktrDirectFeedError.message }, { status: 500 });

  const ktrDirectIds = (ktrDirectFeedData ?? []).map((row: { id: number }) => row.id);
  const ktrNormalizedResults = await Promise.all(
    Array.from({ length: Math.ceil(ktrDirectIds.length / KTR_DIRECT_NORMALIZATION_BATCH_SIZE) }, (_, i) =>
      newsroomDb.from("news_feed_normalization")
        .select("feed_item_id,normalized_title,source_key,observed_at")
        .in("feed_item_id", ktrDirectIds.slice(i * KTR_DIRECT_NORMALIZATION_BATCH_SIZE, (i + 1) * KTR_DIRECT_NORMALIZATION_BATCH_SIZE))
        .gte("observed_at", since)
        .is("duplicate_of_feed_item_id", null),
    ),
  );
  const ktrNormalizationError = ktrNormalizedResults.find((result) => result.error)?.error;
  if (ktrNormalizationError) return Response.json({ ok: false, error: ktrNormalizationError.message }, { status: 500 });
  const ktrDirectNormalized = ktrNormalizedResults.flatMap((result) => result.data ?? []) as NormalizationRow[];
  const normalizedRows = reserveDirectPublisherCohort(
    ktrDirectNormalized,
    reserveDirectPublisherCohort(
      (directData ?? []) as NormalizationRow[],
      (normalizationData ?? []) as NormalizationRow[],
      CLUSTER_LIMIT,
    ),
    CLUSTER_LIMIT,
  );
  // Keep the original 500-row O(N²) similarity budget. The oldest Google
  // wrappers are displaced by original-publisher records, not stacked on top.
  const latestIds = new Set((normalizationData ?? []).map((row: NormalizationRow) => row.feed_item_id));
  const directCohortUnique = normalizedRows.filter((row) => !latestIds.has(row.feed_item_id)).length;

  const feedIds = normalizedRows.map((row) => row.feed_item_id);
  if (!feedIds.length) {
    return Response.json({ ok: true, scanned: 0, clusters: 0, clusterWrites: 0, multiSourceClusters: 0, memberships: 0, membershipWrites: 0, membershipUnchanged: 0, aiCalls: 0 });
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
  let clusterWrites = 0;
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
    clusterWrites = changedRows.length;

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
  const memberships: MembershipWriteRow[] = clusters.flatMap((cluster) => {
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

  let membershipWrites = 0;
  if (memberships.length) {
    const membershipClusterIds = [...new Set(memberships.map((row) => row.cluster_id))];
    const { data: existingMembershipData, error: existingMembershipError } = await newsroomDb
      .from("news_story_cluster_items")
      .select("cluster_id,feed_item_id,relationship_type,weight,is_primary_source,source_name,source_url")
      .in("cluster_id", membershipClusterIds);
    if (existingMembershipError) return Response.json({ ok: false, error: existingMembershipError.message }, { status: 500 });
    const existingMemberships = (existingMembershipData ?? []) as ExistingMembershipRow[];
    const existingMembershipByKey = new Map(existingMemberships.map((row) => [membershipKey(row), row]));
    const membershipsToWrite = memberships.filter((row) => !sameMembership(row, existingMembershipByKey.get(membershipKey(row))));
    membershipWrites = membershipsToWrite.length;
    if (membershipsToWrite.length) {
      const { error: membershipError } = await newsroomDb
        .from("news_story_cluster_items")
        .upsert(membershipsToWrite, { onConflict: "cluster_id,feed_item_id" });
      if (membershipError) return Response.json({ ok: false, error: membershipError.message }, { status: 500 });
    }
  }

  // Reconcile historical duplicate assignments AFTER the desired new
  // memberships exist, so a transient failure cannot leave a news source
  // without its original evidence link. Protect published, selected and held
  // story histories. Chunk reads because PostgREST caps response rows and
  // a feed item can have several legacy cluster memberships.
  let staleMembershipsRemoved = 0;
  let staleClustersArchived = 0;
  let staleClusterCountersUpdated = 0;
  let protectedHistoricalMemberships = 0;
  if (memberships.length) {
    const existingByFeedId: Array<{ cluster_id: string; feed_item_id: number }> = [];
    for (let offset = 0; offset < feedIds.length; offset += 70) {
      const batch = feedIds.slice(offset, offset + 70);
      for (let page = 0; page < 12; page += 1) {
        const { data, error } = await newsroomDb.from("news_story_cluster_items")
          .select("cluster_id,feed_item_id")
          .in("feed_item_id", batch)
          .order("feed_item_id", { ascending: true })
          .order("cluster_id", { ascending: true })
          .range(page * 1000, (page + 1) * 1000 - 1);
        if (error) return Response.json({ ok: false, error: error.message, stage: "membership_reconciliation_read" }, { status: 500 });
        const rows = (data ?? []) as Array<{ cluster_id: string; feed_item_id: number }>;
        existingByFeedId.push(...rows);
        if (rows.length < 1000) break;
        if (page === 11) return Response.json({ ok: false, error: "bounded cluster membership read overflow" }, { status: 503 });
      }
    }
    const desiredById = new Map(memberships.map((row) => [row.feed_item_id, row.cluster_id]));
    const staleClusterIds = [...new Set(existingByFeedId
      .filter((row) => desiredById.has(row.feed_item_id) && desiredById.get(row.feed_item_id) !== row.cluster_id)
      .map((row) => row.cluster_id))];
    if (staleClusterIds.length) {
      const oldClusters: Array<{ id: string; status: string }> = [];
      const oldCandidates: Array<{ cluster_id: string; status: string }> = [];
      for (let offset = 0; offset < staleClusterIds.length; offset += 80) {
        const batch = staleClusterIds.slice(offset, offset + 80);
        const [clustersResult, candidatesResult] = await Promise.all([
          newsroomDb.from("news_story_clusters").select("id,status").in("id", batch),
          newsroomDb.from("news_publish_candidates").select("cluster_id,status").in("cluster_id", batch),
        ]);
        if (clustersResult.error || candidatesResult.error) {
          return Response.json({ ok: false, error: (clustersResult.error || candidatesResult.error).message, stage: "membership_reconciliation_status" }, { status: 500 });
        }
        oldClusters.push(...((clustersResult.data ?? []) as Array<{ id: string; status: string }>));
        oldCandidates.push(...((candidatesResult.data ?? []) as Array<{ cluster_id: string; status: string }>));
      }
      const reconciliation = staleUncommittedNewsroomMemberships(
        memberships, existingByFeedId, oldClusters, oldCandidates,
      );
      protectedHistoricalMemberships = reconciliation.protectedCount;
      const removalsByCluster = new Map<string, number[]>();
      for (const row of reconciliation.obsolete) {
        const list = removalsByCluster.get(row.cluster_id) ?? [];
        list.push(row.feed_item_id);
        removalsByCluster.set(row.cluster_id, list);
      }
      const removalGroups = [...removalsByCluster.entries()];
      // Different historical clusters may be safely cleaned in parallel, but
      // each cluster is updated only after its stale memberships were deleted.
      for (let offset = 0; offset < removalGroups.length; offset += 4) {
        const outcomes = await Promise.all(removalGroups.slice(offset, offset + 4).map(async ([clusterId, obsoleteFeedIds]) => {
          for (let chunkStart = 0; chunkStart < obsoleteFeedIds.length; chunkStart += 80) {
            const { error } = await newsroomDb.from("news_story_cluster_items").delete()
              .eq("cluster_id", clusterId).in("feed_item_id", obsoleteFeedIds.slice(chunkStart, chunkStart + 80));
            if (error) return { error: error.message, clusterId };
          }
          const { data: remaining, error: remainingError } = await newsroomDb.from("news_story_cluster_items")
            .select("source_name,source_url,is_primary_source").eq("cluster_id", clusterId);
          if (remainingError) return { error: remainingError.message, clusterId };
          const sourceRows = ((remaining ?? []) as Array<{ source_name: string | null; source_url: string | null; is_primary_source: boolean }>)
            .map((row) => ({ source: row.source_name, link: row.source_url }));
          const archive = sourceRows.length === 0;
          const { error: updateError } = await newsroomDb.from("news_story_clusters").update({
            source_count: countDistinctNewsSources(sourceRows),
            primary_source_count: countDistinctPrimaryNewsSources(sourceRows),
            ...(archive ? { status: "ARCHIVED" } : {}),
          }).eq("id", clusterId).in("status", ["DISCOVERED", "READY"]);
          if (updateError) return { error: updateError.message, clusterId };
          if (archive) {
            const { error: candidateError } = await newsroomDb.from("news_publish_candidates")
              .update({ status: "REJECTED", rejection_reason: "superseded_empty_reconciled_newsroom_cluster" })
              .eq("cluster_id", clusterId).eq("status", "PENDING");
            if (candidateError) return { error: candidateError.message, clusterId };
          }
          return { removed: obsoleteFeedIds.length, archive };
        }));
        const failed = outcomes.find((outcome) => "error" in outcome);
        if (failed) return Response.json({ ok: false, error: failed.error, stage: "membership_reconciliation_update", clusterId: failed.clusterId }, { status: 500 });
        for (const outcome of outcomes) {
          staleMembershipsRemoved += outcome.removed ?? 0;
          staleClusterCountersUpdated += 1;
          if (outcome.archive) staleClustersArchived += 1;
        }
      }
    }
  }

  const multiSourceClusters = clusterRows.filter((row) => row.source_count > 1).length;
  const primarySourceItems = memberships.filter((row) => row.is_primary_source).length;
  const distinctPrimarySources = clusterRows.reduce((sum, row) => sum + row.primary_source_count, 0);
  return Response.json({
    ok: true,
    scanned: clusterable.length,
    clusters: clusters.length,
    clusterWrites,
    unchangedClusters: clusterRows.length - clusterWrites,
    multiSourceClusters,
    memberships: memberships.length,
    membershipWrites,
    membershipUnchanged: memberships.length - membershipWrites,
    primarySourceItems,
    distinctPrimarySources,
    clusterVersion: CLUSTER_VERSION,
    directCohortUnique,
    staleMembershipsRemoved,
    staleClustersArchived,
    staleClusterCountersUpdated,
    protectedHistoricalMemberships,
    aiCalls: 0,
  });
}

export const Route = createFileRoute("/api/public/hooks/cluster-newsroom-stories")({
  server: { handlers: { GET: handler, POST: handler } },
});
