import {
  buildStoryCluster,
  sourceFamily,
  type ClusterableFeedItem,
  type StoryCluster,
} from "@/lib/story-clustering";

export type HistoricalFeedItem = ClusterableFeedItem & {
  id: number;
  internal_slug?: string | null;
  event_cluster_id?: string | null;
  target_site?: string | null;
  created_at?: string | null;
};

export type HistoricalReconciliationPlan = {
  kind: "safe" | "hold";
  cluster: StoryCluster;
  canonicalSlug: string | null;
  publishedSlugs: string[];
  feedItemIds: number[];
  sourceFamilies: string[];
  reason: string;
};

function timestamp(item: HistoricalFeedItem): number {
  const value = Date.parse(item.pub_date ?? item.created_at ?? "");
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
}

function clusterRows(cluster: StoryCluster): HistoricalFeedItem[] {
  return [cluster.primary, ...cluster.members].filter(
    (row): row is HistoricalFeedItem => typeof row.id === "number",
  );
}

function distinctSlugs(rows: readonly HistoricalFeedItem[]): string[] {
  return [...new Set(
    rows
      .map((row) => row.internal_slug?.trim())
      .filter((slug): slug is string => Boolean(slug)),
  )].sort();
}

/**
 * Plan deterministic historical reconciliation without mutating any article.
 * Modern rows that already belong to a durable event cluster are excluded so
 * backfill can never steal ownership from the live multi-source pipeline.
 */
export function planHistoricalReconciliation(
  inputRows: readonly HistoricalFeedItem[],
  maxMembers = 5,
): HistoricalReconciliationPlan[] {
  const eligible = inputRows
    .filter((row) => !row.event_cluster_id)
    .filter((row) => !row.target_site || row.target_site === "keeptxred")
    .sort((a, b) => timestamp(a) - timestamp(b) || a.id - b.id);

  const anchors = eligible.filter((row) => Boolean(row.internal_slug?.trim()));
  const consumed = new Set<number>();
  const plans: HistoricalReconciliationPlan[] = [];

  for (const anchor of anchors) {
    if (consumed.has(anchor.id)) continue;
    const nearby = eligible.filter((row) => row.id !== anchor.id && !consumed.has(row.id));
    const cluster = buildStoryCluster(anchor, nearby, maxMembers);
    if (!cluster.strongMerge || cluster.sourceCount < 2) continue;

    const rows = clusterRows(cluster);
    const slugs = distinctSlugs(rows);
    if (!slugs.length) continue;

    const feedItemIds = rows.map((row) => row.id).sort((a, b) => a - b);
    const sourceFamilies = [...new Set(rows.map(sourceFamily).filter(Boolean))].sort();
    const kind: "safe" | "hold" = slugs.length === 1 ? "safe" : "hold";
    const reason = kind === "safe"
      ? `One existing published slug is supported by ${rows.length} matched reports from ${sourceFamilies.length} source families.`
      : `Matched reports already point to ${slugs.length} published slugs; canonical ownership requires admin review.`;

    plans.push({
      kind,
      cluster,
      canonicalSlug: kind === "safe" ? slugs[0] : null,
      publishedSlugs: slugs,
      feedItemIds,
      sourceFamilies,
      reason,
    });
    for (const id of feedItemIds) consumed.add(id);
  }

  return plans.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "hold" ? -1 : 1;
    return a.feedItemIds[0] - b.feedItemIds[0];
  });
}

export function reconciliationSummary(plans: readonly HistoricalReconciliationPlan[]) {
  return {
    planned: plans.length,
    safe: plans.filter((plan) => plan.kind === "safe").length,
    held: plans.filter((plan) => plan.kind === "hold").length,
    feedItems: plans.reduce((sum, plan) => sum + plan.feedItemIds.length, 0),
  };
}
