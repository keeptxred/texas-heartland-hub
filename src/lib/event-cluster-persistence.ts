import {
  normalizeClusterText,
  sourceFamily,
  strongMergeThreshold,
  type ClusterCandidate,
  type ClusterableFeedItem,
  type StoryCluster,
} from "@/lib/story-clustering";

export type EventClusterStatus = "collecting" | "ready" | "synthesized" | "published" | "archived";

type PersistOptions = {
  status: EventClusterStatus;
  publishedSlug?: string;
};

function canonicalizeUrl(value: string): string {
  try {
    const url = new URL(value);
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|mc_cid$|mc_eid$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return value;
  }
}

function looksPrimaryRecord(item: ClusterableFeedItem): boolean {
  const family = sourceFamily(item);
  const text = `${item.source} ${item.title}`;
  return (
    /\.gov$|\.gov\//i.test(family) ||
    /\b(texas education agency|office of the governor|texas secretary of state|texas attorney general|texas supreme court|ercot|police department|sheriff'?s office|city of |county of )\b/i.test(text)
  );
}

function rawText(item: ClusterableFeedItem): string {
  return (item.extracted_body ?? item.description ?? "").trim().slice(0, 16000);
}

function clusterRows(cluster: StoryCluster): Array<ClusterableFeedItem | ClusterCandidate> {
  return [cluster.primary, ...cluster.members];
}

function clusterKey(cluster: StoryCluster): string {
  if (typeof cluster.primary.id === "number") return `feed-event:${cluster.primary.id}`;
  const normalized = normalizeClusterText(cluster.primary.title).slice(0, 96).replace(/\s+/g, "-");
  return `headline-event:${normalized || "unknown"}`;
}

function matchData(row: ClusterableFeedItem | ClusterCandidate, primary: ClusterableFeedItem) {
  if (row === primary || !("combinationScore" in row)) {
    return { score: 100, reason: { role: "primary", overlap_terms: [] as string[] } };
  }
  return {
    score: row.combinationScore,
    reason: { role: "supporting", overlap_terms: row.overlapTerms },
  };
}

function independentSourceCount(cluster: StoryCluster): number {
  const families = new Set(clusterRows(cluster).map(sourceFamily).filter(Boolean));
  return Math.max(1, families.size);
}

async function resolvePublishedArticleId(db: any, slug?: string): Promise<string | null> {
  if (!slug) return null;
  const { data } = await db.from("daily_articles").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

export function strongSupportingFeedIds(cluster: StoryCluster): number[] {
  const threshold = strongMergeThreshold(cluster.primary);
  return cluster.members
    .filter((row) => row.combinationScore >= threshold)
    .map((row) => row.id)
    .filter((id): id is number => typeof id === "number");
}

async function clusterMembershipForFeedIds(db: any, feedIds: number[]): Promise<Array<{ cluster_id: string; feed_item_id: number }>> {
  if (!feedIds.length) return [];
  const { data, error } = await db
    .from("news_event_cluster_sources")
    .select("cluster_id,feed_item_id")
    .in("feed_item_id", feedIds);
  if (error) throw error;
  return (data ?? []).filter(
    (row: any) => typeof row.cluster_id === "string" && typeof row.feed_item_id === "number",
  );
}

async function resolveExistingClusterId(db: any, cluster: StoryCluster): Promise<string | null> {
  // The primary report owns durable event identity. Reuse its current cluster
  // before considering any supporting source, even when the in-memory feed row
  // did not select event_cluster_id.
  if (typeof cluster.primary.event_cluster_id === "string" && cluster.primary.event_cluster_id.length > 0) {
    return cluster.primary.event_cluster_id;
  }
  if (typeof cluster.primary.id === "number") {
    const primaryMembership = await clusterMembershipForFeedIds(db, [cluster.primary.id]);
    if (primaryMembership[0]?.cluster_id) return primaryMembership[0].cluster_id;
  }

  // A supporting report may connect a new primary to an established event, but
  // only a strong direct match may choose that durable cluster. Weak 45-point
  // context members must never pull an unrelated primary into their old event.
  const strongIds = strongSupportingFeedIds(cluster);
  const memberships = await clusterMembershipForFeedIds(db, strongIds);
  const clusterIds = [...new Set(memberships.map((row) => row.cluster_id))];
  return clusterIds.length === 1 ? clusterIds[0] : null;
}

async function refreshLedgerCounts(db: any, clusterId: string): Promise<{ sourceCount: number; independentSourceCount: number }> {
  const { data, error } = await db
    .from("news_event_cluster_sources")
    .select("source_family,is_independent_source")
    .eq("cluster_id", clusterId);
  if (error) throw error;

  const rows = data ?? [];
  const independentFamilies = new Set(
    rows
      .filter((row: any) => row.is_independent_source !== false)
      .map((row: any) => row.source_family)
      .filter((family: unknown): family is string => typeof family === "string" && family.length > 0),
  );
  return {
    sourceCount: Math.max(1, rows.length),
    independentSourceCount: Math.max(1, independentFamilies.size || rows.length),
  };
}

/**
 * Persists the in-memory clustering decision without making it a hard dependency
 * of publishing. A schema rollout or transient persistence failure must never
 * prevent the existing single-source fallback from functioning.
 */
export async function persistEventCluster(
  db: any,
  cluster: StoryCluster,
  options: PersistOptions,
): Promise<string | null> {
  try {
    const rows = clusterRows(cluster);
    let id = await resolveExistingClusterId(db, cluster);
    const now = new Date().toISOString();
    const publishedArticleId = await resolvePublishedArticleId(db, options.publishedSlug);
    const payload: Record<string, unknown> = {
      canonical_headline: cluster.primary.title,
      status: options.status,
      match_score: cluster.score,
      source_count: rows.length,
      independent_source_count: independentSourceCount(cluster),
      last_seen_at: now,
      metadata: {
        strong_merge: cluster.strongMerge,
        source_families: [...new Set(rows.map(sourceFamily).filter(Boolean))],
        lookback_source_count: cluster.sourceCount,
      },
    };
    if (options.status === "synthesized" || options.status === "published") payload.synthesized_at = now;
    if (options.status === "published") {
      payload.published_at = now;
      payload.published_article_id = publishedArticleId;
      payload.published_slug = options.publishedSlug ?? null;
    }

    if (!id) {
      const firstSeen = rows
        .map((row) => row.pub_date)
        .filter((date): date is string => typeof date === "string" && Number.isFinite(Date.parse(date)))
        .sort()[0] ?? now;
      const { data, error } = await db
        .from("news_event_clusters")
        .insert({ ...payload, cluster_key: clusterKey(cluster), first_seen_at: firstSeen })
        .select("id")
        .single();
      if (error) throw error;
      id = data?.id ?? null;
    } else {
      const { error } = await db.from("news_event_clusters").update(payload).eq("id", id);
      if (error) throw error;
    }

    if (!id) return null;

    for (const row of rows) {
      if (typeof row.id !== "number") continue;
      const match = matchData(row, cluster.primary);
      const family = sourceFamily(row);
      const isPrimaryRecord = looksPrimaryRecord(row);
      const canonicalUrl = canonicalizeUrl(row.link);
      const text = rawText(row);
      const sourcePayload = {
        cluster_id: id,
        feed_item_id: row.id,
        relationship_type: row === cluster.primary ? "primary" : "supporting",
        source_name: row.source,
        source_family: family || null,
        source_url: row.link,
        canonical_url: canonicalUrl,
        headline: row.title,
        published_at: row.pub_date ?? null,
        raw_text: text || null,
        normalized_text: text ? normalizeClusterText(text).slice(0, 16000) : null,
        is_primary_record: isPrimaryRecord,
        is_independent_source: true,
        match_score: match.score,
        match_reason: match.reason,
      };
      const { error: sourceError } = await db
        .from("news_event_cluster_sources")
        .upsert(sourcePayload, { onConflict: "feed_item_id" });
      if (sourceError) throw sourceError;

      const reason = row === cluster.primary
        ? "primary event report"
        : `score=${match.score}; overlap=${("overlapTerms" in row ? row.overlapTerms : []).join(",") || "none"}`;
      const { error: feedError } = await db
        .from("texas_news_feed")
        .update({ event_cluster_id: id, event_cluster_score: match.score, event_cluster_reason: reason })
        .eq("id", row.id);
      if (feedError) throw feedError;
    }

    // Count the durable source ledger, not just the current lookback window, so
    // later refreshes never make an established event appear to lose sources.
    const ledgerCounts = await refreshLedgerCounts(db, id);
    const { error: countError } = await db
      .from("news_event_clusters")
      .update({
        source_count: ledgerCounts.sourceCount,
        independent_source_count: ledgerCounts.independentSourceCount,
      })
      .eq("id", id);
    if (countError) throw countError;

    console.info("[multi-source] event cluster persisted", {
      eventClusterId: id,
      status: options.status,
      score: cluster.score,
      sources: ledgerCounts.sourceCount,
      independentSources: ledgerCounts.independentSourceCount,
    });
    return id;
  } catch (error) {
    console.warn("[multi-source] durable event cluster persistence skipped", error instanceof Error ? error.message : String(error));
    return null;
  }
}
