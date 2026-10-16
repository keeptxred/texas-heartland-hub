import { createFileRoute } from "@tanstack/react-router";
import { buildResearchPacket } from "@/lib/newsroom-research-packet";
import { newsroomIndependentPublisherFamilyFromUrl } from "@/lib/newsroom-publication-preflight";
import {
  fetchReadableNewsroomSource,
  isNewsroomSourceFetchCoolingDown,
  shouldFetchNewsroomSourcePage,
} from "@/lib/newsroom-source-page.server";

const LOOKBACK_HOURS = 72;
const PUBLISHED_REFRESH_HOURS = 48;
const PUBLISHED_REFRESH_LIMIT = 80;
const CLUSTER_READ_BATCH_SIZE = 100;
const CLUSTER_READ_CONCURRENCY = 2;
// Match the 500-candidate publication window. Previously the packet builder
// stopped after 48h, leaving 72h-old publishable candidates with stale packets.
const CANDIDATE_LIMIT = 500;
// Source-page fetching is zero-AI but network-bound. Keep it bounded and aim
// the work at the highest-scored candidate sources first.
const SOURCE_PAGE_FETCH_LIMIT = 40;
const SOURCE_PAGE_CONCURRENCY = 4;
const HYDRATION_ID_BATCH_SIZE = 100;
const HYDRATION_READ_CONCURRENCY = 2;
// Keep full-length successful fetches on the six-hour retry cadence, but wait
// 24 hours after unreadable or too-short extraction so thin pages do not monopolize fetch slots.
// Explicit manual hydration remains available; no quality/evidence bar changes.
const SOURCE_PAGE_RETRY_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const SOURCE_PAGE_UNREADABLE_RETRY_COOLDOWN_MS = 24 * 60 * 60 * 1000;

type CandidateRow = {
  id: string;
  cluster_id: string;
  editorial_score: number;
  recommended_format: string;
  status: string;
  created_at: string;
};
type ClusterRow = { id: string; canonical_subject: string; pillar_slug: string | null };
type MembershipRow = { cluster_id: string; feed_item_id: number; is_primary_source: boolean };
type FeedPacketRow = {
  id: number;
  title: string | null;
  source: string | null;
  link: string | null;
  pub_date: string | null;
  description: string | null;
  extracted_body: string | null;
  source_reputation_score: number | null;
};
type SourcePageFetchStateRow = {
  feed_item_id: number;
  last_attempt_at: string;
  last_success_at: string | null;
  last_result: string;
  chars: number;
};
type ExistingPacketRow = {
  cluster_id: string;
  packet_version: number;
  packet_json: unknown;
  source_count: number;
  primary_source_count: number;
};

type PacketWriteRow = ExistingPacketRow;

function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
}

function samePacket(left: PacketWriteRow, right: ExistingPacketRow | undefined): boolean {
  if (!right) return false;
  return left.cluster_id === right.cluster_id
    && left.packet_version === right.packet_version
    && left.source_count === right.source_count
    && left.primary_source_count === right.primary_source_count
    && stableJson(left.packet_json) === stableJson(right.packet_json);
}

async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const output: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, Math.max(items.length, 1)) }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      output[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return output;
}

function chunkValues<T>(values: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) chunks.push(values.slice(index, index + size));
  return chunks;
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // New newsroom tables and recent feed columns intentionally lead the generated Database type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  // Paid generation considers the top 500 PENDING candidates over 72 hours.
  // Build those packets FIRST, without allowing held/published items to
  // displace them. A separate bounded published cohort still supplies the
  // existing source-backed in-place refresh workflow.
  const [
    { data: pendingData, error: pendingError },
    { data: publishedData, error: publishedError },
  ] = await Promise.all([
    newsroomDb.from("news_publish_candidates")
      .select("id,cluster_id,editorial_score,recommended_format,status,created_at")
      .eq("status", "PENDING")
      .in("recommended_format", ["SINGLE", "MERGE", "SYNTHESIS"])
      .gte("created_at", since)
      .order("editorial_score", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .limit(CANDIDATE_LIMIT),
    newsroomDb.from("news_publish_candidates")
      .select("id,cluster_id,editorial_score,recommended_format,status,created_at")
      .eq("status", "PUBLISHED")
      .gte("published_at", new Date(Date.now() - PUBLISHED_REFRESH_HOURS * 60 * 60 * 1000).toISOString())
      .order("published_at", { ascending: false })
      .limit(PUBLISHED_REFRESH_LIMIT),
  ]);
  if (pendingError) return Response.json({ ok: false, error: pendingError.message }, { status: 500 });
  if (publishedError) return Response.json({ ok: false, error: publishedError.message }, { status: 500 });
  const pending = (pendingData ?? []) as CandidateRow[];
  const published = (publishedData ?? []) as CandidateRow[];
  const candidates = [...new Map<string, CandidateRow>(
    [...pending, ...published].map((candidate): [string, CandidateRow] => [candidate.cluster_id, candidate]),
  ).values()];
  if (!candidates.length) return Response.json({ ok: true, built: 0, written: 0, unchanged: 0, sourceItems: 0, sourcePagesFetched: 0, sourcePagesUpdated: 0, sourcePagesCoolingDown: 0, aiCalls: 0 });

  // Each provider request stays below PostgREST UUID/query and row limits.
  // Group related lookups in the same bounded batch; no AI is used here.
  const clusterIds = [...new Set(candidates.map((candidate) => candidate.cluster_id))];
  const clusterBatches = chunkValues(clusterIds, CLUSTER_READ_BATCH_SIZE);
  const clusterResults = await mapWithConcurrency(clusterBatches, CLUSTER_READ_CONCURRENCY, async (batch) => {
    const [clusters, memberships, packets] = await Promise.all([
      newsroomDb.from("news_story_clusters").select("id,canonical_subject,pillar_slug").in("id", batch),
      newsroomDb.from("news_story_cluster_items").select("cluster_id,feed_item_id,is_primary_source").in("cluster_id", batch),
      newsroomDb.from("news_research_packets").select("cluster_id,packet_version,packet_json,source_count,primary_source_count").in("cluster_id", batch),
    ]);
    return { clusters, memberships, packets };
  });
  const readError = clusterResults.flatMap((result) =>
    [result.clusters.error, result.memberships.error, result.packets.error]).find(Boolean);
  if (readError) return Response.json({ ok: false, error: readError.message }, { status: 500 });
  const clusters = clusterResults.flatMap((result) => result.clusters.data ?? []) as ClusterRow[];
  const memberships = clusterResults.flatMap((result) => result.memberships.data ?? []) as MembershipRow[];
  const existingPackets = clusterResults.flatMap((result) => result.packets.data ?? []) as ExistingPacketRow[];
  const existingPacketByCluster = new Map(existingPackets.map((packet) => [packet.cluster_id, packet]));

  const feedIds = [...new Set(memberships.map((row) => row.feed_item_id))];
  let feeds: FeedPacketRow[] = [];
  const feedIdBatches = chunkValues(feedIds, HYDRATION_ID_BATCH_SIZE);
  if (feedIdBatches.length) {
    const feedResults = await mapWithConcurrency(feedIdBatches, HYDRATION_READ_CONCURRENCY, async (batch) => {
      return newsroomDb
        .from("texas_news_feed")
        .select("id,title,source,link,pub_date,description,extracted_body,source_reputation_score")
        .in("id", batch);
    });
    const feedError = feedResults.find((result) => result.error)?.error;
    if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });
    feeds = feedResults.flatMap((result) => result.data ?? []) as FeedPacketRow[];
  }

  const sourcePageStateById = new Map<number, SourcePageFetchStateRow>();
  if (feedIdBatches.length) {
    const stateResults = await mapWithConcurrency(feedIdBatches, HYDRATION_READ_CONCURRENCY, async (batch) => {
      return newsroomDb
        .from("newsroom_source_page_fetch_state")
        .select("feed_item_id,last_attempt_at,last_success_at,last_result,chars")
        .in("feed_item_id", batch);
    });
    const stateError = stateResults.find((result) => result.error)?.error;
    // Stay backward-compatible if application code reaches production before
    // the migration. Cooldown is an optimization/safety valve, not a reason to
    // block packet construction.
    if (stateError) {
      console.warn("[newsroom-packets] source-page fetch state read failed", stateError.message);
    } else {
      for (const result of stateResults) {
        for (const row of (result.data ?? []) as SourcePageFetchStateRow[]) sourcePageStateById.set(row.feed_item_id, row);
      }
    }
  }

  // Do not let published refresh enrichment use the 40 fetch slots before
  // pending publication candidates; both cohorts still get packet rebuilds.
  const candidateScoreByCluster = new Map(candidates.map((candidate) => [
    candidate.cluster_id,
    candidate.editorial_score + (candidate.status === "PENDING" ? 1_000 : 0),
  ]));
  // Spend scarce source-page fetches first on PENDING stories that could
  // legally publish: an official primary record or two independent publisher
  // families. Mirror the generation preflight's domain normalization.
  const feedByIdForPriority = new Map(feeds.map((feed) => [feed.id, feed]));
  const provenanceByCluster = new Map<string, { hasPrimary: boolean; families: Set<string> }>();
  for (const membership of memberships) {
    const state = provenanceByCluster.get(membership.cluster_id) ?? { hasPrimary: false, families: new Set<string>() };
    state.hasPrimary ||= membership.is_primary_source;
    const family = newsroomIndependentPublisherFamilyFromUrl(feedByIdForPriority.get(membership.feed_item_id)?.link ?? "");
    if (family) state.families.add(family);
    provenanceByCluster.set(membership.cluster_id, state);
  }
  const publishableProvenance = new Set(
    [...provenanceByCluster].filter(([, state]) => state.hasPrimary || state.families.size >= 2)
      .map(([clusterId]) => clusterId),
  );
  const priorityByFeedId = new Map<number, number>();
  for (const membership of memberships) {
    const score = (candidateScoreByCluster.get(membership.cluster_id) ?? 0)
      + (publishableProvenance.has(membership.cluster_id) ? 10_000 : 0);
    priorityByFeedId.set(membership.feed_item_id, Math.max(priorityByFeedId.get(membership.feed_item_id) ?? 0, score));
  }

  const sourcePageCandidates = feeds
    .filter((feed) => shouldFetchNewsroomSourcePage({ url: feed.link, extractedBody: feed.extracted_body }));
  const nowMs = Date.now();
  const sourcePageCoolingDown = (feedId: number) => isNewsroomSourceFetchCoolingDown(
    sourcePageStateById.get(feedId),
    nowMs,
    SOURCE_PAGE_RETRY_COOLDOWN_MS,
    SOURCE_PAGE_UNREADABLE_RETRY_COOLDOWN_MS,
  );
  const sourcePagesCoolingDown = sourcePageCandidates.filter((feed) => sourcePageCoolingDown(feed.id)).length;
  const sourcePageTargets = sourcePageCandidates
    .filter((feed) => !sourcePageCoolingDown(feed.id))
    .sort((a, b) => (priorityByFeedId.get(b.id) ?? 0) - (priorityByFeedId.get(a.id) ?? 0)
      || Number(Boolean(b.source_reputation_score)) - Number(Boolean(a.source_reputation_score))
      || a.id - b.id)
    .slice(0, SOURCE_PAGE_FETCH_LIMIT);

  const sourcePageResults = await mapWithConcurrency(sourcePageTargets, SOURCE_PAGE_CONCURRENCY, async (feed) => {
    const body = feed.link ? await fetchReadableNewsroomSource(feed.link) : null;
    return { feed, body };
  });

  let sourcePagesUpdated = 0;
  let sourcePageCharsWritten = 0;
  const enrichedById = new Map<number, string>();
  const fetchOutcomeById = new Map<number, "success" | "no_readable_body" | "update_failed">();
  for (const result of sourcePageResults) {
    if (!result.body) {
      fetchOutcomeById.set(result.feed.id, "no_readable_body");
      continue;
    }
    const existing = (result.feed.extracted_body ?? "").trim();
    if (result.body.length <= existing.length + 100) {
      fetchOutcomeById.set(result.feed.id, "success");
      continue;
    }
    const { error: updateError } = await newsroomDb
      .from("texas_news_feed")
      .update({ extracted_body: result.body })
      .eq("id", result.feed.id);
    if (updateError) {
      console.warn("[newsroom-packets] source-page cache update failed", { feedItemId: result.feed.id, error: updateError.message });
      fetchOutcomeById.set(result.feed.id, "update_failed");
      continue;
    }
    fetchOutcomeById.set(result.feed.id, "success");
    enrichedById.set(result.feed.id, result.body);
    sourcePagesUpdated++;
    sourcePageCharsWritten += result.body.length;
  }

  if (sourcePageResults.length) {
    const attemptedAt = new Date().toISOString();
    const stateRows = sourcePageResults.map((result) => {
      const prior = sourcePageStateById.get(result.feed.id);
      const outcome = fetchOutcomeById.get(result.feed.id) ?? "no_readable_body";
      return {
        feed_item_id: result.feed.id,
        last_attempt_at: attemptedAt,
        last_success_at: result.body ? attemptedAt : (prior?.last_success_at ?? null),
        last_result: outcome,
        chars: Math.max((result.feed.extracted_body ?? "").trim().length, result.body?.length ?? 0),
      };
    });
    const { error: stateUpsertError } = await newsroomDb
      .from("newsroom_source_page_fetch_state")
      .upsert(stateRows, { onConflict: "feed_item_id" });
    if (stateUpsertError) console.warn("[newsroom-packets] source-page fetch state write failed", stateUpsertError.message);
  }

  if (enrichedById.size) {
    feeds = feeds.map((feed) => enrichedById.has(feed.id)
      ? { ...feed, extracted_body: enrichedById.get(feed.id) ?? feed.extracted_body }
      : feed);
  }

  const clusterById = new Map<string, ClusterRow>(clusters.map((cluster) => [cluster.id, cluster]));
  const feedById = new Map<number, FeedPacketRow>(feeds.map((feed) => [feed.id, feed]));
  const membershipsByCluster = new Map<string, MembershipRow[]>();
  for (const membership of memberships) {
    membershipsByCluster.set(membership.cluster_id, [...(membershipsByCluster.get(membership.cluster_id) ?? []), membership]);
  }

  const packets: PacketWriteRow[] = candidates.flatMap((candidate) => {
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
    }];
  });

  const builtAt = new Date().toISOString();
  const packetsToWrite = packets
    .filter((packet) => !samePacket(packet, existingPacketByCluster.get(packet.cluster_id)))
    .map((packet) => ({ ...packet, built_at: builtAt }));
  if (packetsToWrite.length) {
    for (const batch of chunkValues(packetsToWrite, CLUSTER_READ_BATCH_SIZE)) {
      const { error: upsertError } = await newsroomDb
        .from("news_research_packets")
        .upsert(batch, { onConflict: "cluster_id" });
      if (upsertError) return Response.json({ ok: false, error: upsertError.message }, { status: 500 });
    }
  }

  return Response.json({
    ok: true,
    built: packets.length,
    written: packetsToWrite.length,
    unchanged: packets.length - packetsToWrite.length,
    sourceItems: packets.reduce((sum, packet) => sum + packet.source_count, 0),
    primarySourceItems: packets.reduce((sum, packet) => sum + packet.primary_source_count, 0),
    sourcePagesFetched: sourcePageTargets.length,
    sourcePagesUpdated,
    sourcePageCharsWritten,
    sourcePagesCoolingDown,
    aiCalls: 0,
  });
}

export const Route = createFileRoute("/api/public/hooks/build-newsroom-research-packets")({
  server: { handlers: { GET: handler, POST: handler } },
});