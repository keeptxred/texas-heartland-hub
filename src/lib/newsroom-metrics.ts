export type NewsroomFeedRow = {
  id: number;
  internal_slug?: string | null;
  cluster_json?: Record<string, unknown> | null;
  viral_signals?: Record<string, unknown> | null;
};

export type NewsroomMetrics = {
  feedRows: number;
  linkedFeedRows: number;
  autoPublishEligibleRows: number;
  postRewriteReviewBlocks: number;
  clusteredRows: number;
  uniqueClusters: number;
  confirmations: number;
  followUps: number;
  multiSourceSyntheses: number;
  sourceRelationshipsAdded: number;
  estimatedRewriteCallsAvoided: number;
  averageSourcesPerCluster: number;
};

type ClusterSnapshot = {
  key: string;
  sourceCount: number;
  developmentKind: "confirmation" | "follow_up" | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function sourceUrls(cluster: Record<string, unknown>): string[] {
  if (!Array.isArray(cluster.source_links)) return [];
  return cluster.source_links
    .map((entry) => asRecord(entry)?.url)
    .filter((url): url is string => typeof url === "string" && url.length > 0)
    .sort();
}

function clusterSnapshot(row: NewsroomFeedRow): ClusterSnapshot | null {
  const cluster = asRecord(row.cluster_json);
  if (!cluster) return null;
  const rawCount = Number(cluster.source_count ?? 0);
  const urls = sourceUrls(cluster);
  const sourceCount = Math.max(Number.isFinite(rawCount) ? Math.trunc(rawCount) : 0, urls.length);
  if (sourceCount < 2) return null;
  const kind = cluster.development_kind;
  const developmentKind = kind === "confirmation" || kind === "follow_up" ? kind : null;
  const clusteredAt = typeof cluster.clustered_at === "string" ? cluster.clustered_at : "";
  const key = urls.length
    ? `${clusteredAt}|${urls.join("|")}|${developmentKind ?? "synthesis"}`
    : `${clusteredAt}|row:${row.id}|${developmentKind ?? "synthesis"}`;
  return { key, sourceCount, developmentKind };
}

export function aggregateNewsroomMetrics(rows: NewsroomFeedRow[]): NewsroomMetrics {
  const clusters = new Map<string, ClusterSnapshot>();
  let linkedFeedRows = 0;
  let autoPublishEligibleRows = 0;
  let postRewriteReviewBlocks = 0;
  let clusteredRows = 0;

  for (const row of rows) {
    if (row.internal_slug) linkedFeedRows += 1;
    if (row.viral_signals?.auto_publish_eligible === true) autoPublishEligibleRows += 1;
    if (row.viral_signals?.post_rewrite_review_required === true) postRewriteReviewBlocks += 1;
    const snapshot = clusterSnapshot(row);
    if (!snapshot) continue;
    clusteredRows += 1;
    clusters.set(snapshot.key, snapshot);
  }

  let confirmations = 0;
  let followUps = 0;
  let multiSourceSyntheses = 0;
  let sourceRelationshipsAdded = 0;
  let estimatedRewriteCallsAvoided = 0;
  let totalSources = 0;

  for (const cluster of clusters.values()) {
    totalSources += cluster.sourceCount;
    sourceRelationshipsAdded += Math.max(0, cluster.sourceCount - 1);
    if (cluster.developmentKind === "confirmation") {
      confirmations += 1;
      estimatedRewriteCallsAvoided += 1;
    } else {
      if (cluster.developmentKind === "follow_up") followUps += 1;
      else multiSourceSyntheses += 1;
      estimatedRewriteCallsAvoided += Math.max(0, cluster.sourceCount - 1);
    }
  }

  return {
    feedRows: rows.length,
    linkedFeedRows,
    autoPublishEligibleRows,
    postRewriteReviewBlocks,
    clusteredRows,
    uniqueClusters: clusters.size,
    confirmations,
    followUps,
    multiSourceSyntheses,
    sourceRelationshipsAdded,
    estimatedRewriteCallsAvoided,
    averageSourcesPerCluster: clusters.size ? Number((totalSources / clusters.size).toFixed(2)) : 0,
  };
}
