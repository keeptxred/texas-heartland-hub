import {
  buildStoryCluster,
  normalizeClusterText,
  sourceFamily,
  strongMergeThreshold,
  type ClusterCandidate,
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

const HISTORICAL_TITLE_STOP = new Set([
  "about", "after", "again", "against", "along", "amid", "among", "another", "around", "before", "being", "between",
  "could", "from", "have", "into", "more", "most", "over", "said", "says", "than", "that", "their", "there", "these",
  "they", "this", "those", "through", "today", "under", "want", "wants", "were", "what", "when", "where", "which", "while",
  "with", "would", "texas", "houston", "dallas", "austin", "antonio", "mayor", "governor", "judge", "senator", "representative",
  "official", "officials", "city", "county", "state", "office", "news", "update", "latest", "new",
]);

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

function historicalTitleTokens(title: string): Set<string> {
  const tokens = new Set<string>();
  for (const raw of normalizeClusterText(title).split(/\s+/)) {
    if (raw.length < 4 || HISTORICAL_TITLE_STOP.has(raw)) continue;
    let token = raw;
    if (token.length > 5 && token.endsWith("ies")) token = `${token.slice(0, -3)}y`;
    else if (token.length > 5 && token.endsWith("s") && !token.endsWith("ss")) token = token.slice(0, -1);
    if (!HISTORICAL_TITLE_STOP.has(token)) tokens.add(token);
  }
  return tokens;
}

/**
 * Historical backfill is deliberately stricter than live candidate clustering.
 * A shared person, office or city can connect unrelated stories days apart, so
 * backfill requires substantial title-level event identity before it may attach
 * provenance to an already-published URL.
 */
export function historicalEventIdentityCompatible(
  anchor: HistoricalFeedItem,
  candidate: ClusterableFeedItem,
): boolean {
  const left = historicalTitleTokens(anchor.title);
  const right = historicalTitleTokens(candidate.title);
  if (left.size < 3 || right.size < 3) return false;

  const shared = [...left].filter((token) => right.has(token)).length;
  if (shared < 4) return false;

  const containment = shared / Math.max(1, Math.min(left.size, right.size));
  const union = new Set([...left, ...right]).size;
  const jaccard = shared / Math.max(1, union);
  return containment >= 0.5 || jaccard >= 0.38;
}

function historicalCluster(anchor: HistoricalFeedItem, nearby: HistoricalFeedItem[], maxMembers: number): StoryCluster {
  const initial = buildStoryCluster(anchor, nearby, maxMembers);
  const members = initial.members.filter((member) => historicalEventIdentityCompatible(anchor, member));
  const threshold = strongMergeThreshold(anchor);
  return {
    ...initial,
    members: members as ClusterCandidate[],
    sourceCount: 1 + members.length,
    score: members.length ? Math.max(...members.map((member) => member.combinationScore)) : 0,
    strongMerge: members.some((member) => member.combinationScore >= threshold),
  };
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
    const cluster = historicalCluster(anchor, nearby, maxMembers);
    if (!cluster.strongMerge || cluster.sourceCount < 2) continue;

    const rows = clusterRows(cluster);
    const slugs = distinctSlugs(rows);
    if (!slugs.length) continue;

    const feedItemIds = rows.map((row) => row.id).sort((a, b) => a - b);
    const sourceFamilies = [...new Set(rows.map(sourceFamily).filter(Boolean))].sort();

    // A single canonical URL is not enough for multi-source backfill when the
    // apparent supporting reports collapse to one lineage/family.
    if (slugs.length === 1 && sourceFamilies.length < 2) continue;

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
