import { createFileRoute } from "@tanstack/react-router";
import { buildResearchPacket } from "@/lib/newsroom-research-packet";
import {
  fetchReadableNewsroomSource,
  shouldFetchNewsroomSourcePage,
} from "@/lib/newsroom-source-page.server";

const LOOKBACK_HOURS = 48;
// Match the 500-candidate scoring/decision pipeline so eligible lower-scored
// developments are not starved of research packets during high-volume windows.
const CANDIDATE_LIMIT = 500;
// Source-page fetching is zero-AI but network-bound. Keep it bounded and aim
// the work at the highest-scored candidate sources first.
const SOURCE_PAGE_FETCH_LIMIT = 40;
const SOURCE_PAGE_CONCURRENCY = 4;
// A blocked or already-short page must not consume one of the same 40 fetch
// slots every 15-minute packet cycle. Explicit targeted hydration can still be
// used at any time, but automatic retries cool down for six hours.
const SOURCE_PAGE_RETRY_COOLDOWN_MS = 6 * 60 * 60 * 1000;

type CandidateRow = {
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

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // New newsroom tables and recent feed columns intentionally lead the generated Database type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsroomDb = supabaseAdmin as any;
  const since = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();

  const { data: candidateData, error: candidateError } = await newsroomDb
    .from("news_publish_candidates")
    .select("cluster_id,editorial_score,recommended_format,status,created_at")
    .in("status", ["PENDING", "HELD", "SELECTED"])
    .neq("recommended_format", "SKIP")
    .gte("created_at", since)
    .order("editorial_score", { ascending: false })
    .limit(CANDIDATE_LIMIT);
  if (candidateError) return Response.json({ ok: false, error: candidateError.message }, { status: 500 });
  const candidates = (candidateData ?? []) as CandidateRow[];
  if (!candidates.length) return Response.json({ ok: true, built: 0, sourceItems: 0, sourcePagesFetched: 0, sourcePagesUpdated: 0, sourcePagesCoolingDown: 0, aiCalls: 0 });

  const clusterIds = candidates.map((candidate) => candidate.cluster_id);
  const [{ data: clusterData, error: clusterError }, { data: membershipData, error: membershipError }] = await Promise.all([
    newsroomDb.from("news_story_clusters").select("id,canonical_subject,pillar_slug").in("id", clusterIds),
    newsroomDb.from("news_story_cluster_items").select("cluster_id,feed_item_id,is_primary_source").in("cluster_id", clusterIds),
  ]);
  if (clusterError) return Response.json({ ok: false, error: clusterError.message }, { status: 500 });
  if (membershipError) return Response.json({ ok: false, error: membershipError.message }, { status: 500 });
  const clusters = (clusterData ?? []) as ClusterRow[];
  const memberships = (membershipData ?? []) as MembershipRow[];

  const feedIds = [...new Set(memberships.map((row) => row.feed_item_id))];
  let feeds: FeedPacketRow[] = [];
  if (feedIds.length) {
    const { data: feedData, error: feedError } = await newsroomDb
      .from("texas_news_feed")
      .select("id,title,source,link,pub_date,description,extracted_body,source_reputation_score")
      .in("id", feedIds);
    if (feedError) return Response.json({ ok: false, error: feedError.message }, { status: 500 });
    feeds = (feedData ?? []) as FeedPacketRow[];
  }

  const sourcePageStateById = new Map<number, SourcePageFetchStateRow>();
  if (feedIds.length) {
    const { data: stateData, error: stateError } = await newsroomDb
      .from("newsroom_source_page_fetch_state")
      .select("feed_item_id,last_attempt_at,last_success_at,last_result,chars")
      .in("feed_item_id", feedIds);
    // Stay backward-compatible if application code reaches production before
    // the migration. Cooldown is an optimization/safety valve, not a reason to
    // block packet construction.
    if (stateError) {
      console.warn("[newsroom-packets] source-page fetch state read failed", stateError.message);
    } else {
      for (const row of (stateData ?? []) as SourcePageFetchStateRow[]) sourcePageStateById.set(row.feed_item_id, row);
    }
  }

  const candidateScoreByCluster = new Map(candidates.map((candidate) => [candidate.cluster_id, candidate.editorial_score]));
  const priorityByFeedId = new Map<number, number>();
  for (const membership of memberships) {
    const score = candidateScoreByCluster.get(membership.cluster_id) ?? 0;
    priorityByFeedId.set(membership.feed_item_id, Math.max(priorityByFeedId.get(membership.feed_item_id) ?? 0, score));
  }

  const sourcePageCandidates = feeds
    .filter((feed) => shouldFetchNewsroomSourcePage({ url: feed.link, extractedBody: feed.extracted_body }));
  const cooldownCutoff = Date.now() - SOURCE_PAGE_RETRY_COOLDOWN_MS;
  const sourcePagesCoolingDown = sourcePageCandidates.filter((feed) => {
    const state = sourcePageStateById.get(feed.id);
    return Boolean(state && Number.isFinite(Date.parse(state.last_attempt_at)) && Date.parse(state.last_attempt_at) > cooldownCutoff);
  }).length;
  const sourcePageTargets = sourcePageCandidates
    .filter((feed) => {
      const state = sourcePageStateById.get(feed.id);
      return !state || !Number.isFinite(Date.parse(state.last_attempt_at)) || Date.parse(state.last_attempt_at) <= cooldownCutoff;
    })
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

  const packets = candidates.flatMap((candidate) => {
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