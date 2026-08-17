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
  extracted_body?: string | null;
  internal_slug?: string | null;
  event_cluster_id?: string | null;
  target_site?: string | null;
  created_at?: string | null;
};

export type HistoricalArticleEvidence = {
  title: string;
  bodyText?: string | null;
};

export type HistoricalReconciliationHoldType =
  | "multiple_published_slugs"
  | "source_material_contamination";

export type HistoricalReconciliationPlan = {
  kind: "safe" | "hold";
  holdType?: HistoricalReconciliationHoldType;
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

const AWARD_PREFIX_STOP = new Set([
  "to", "the", "a", "an", "for", "named", "added", "selected", "makes", "make", "on", "preseason", "watch", "list", "2026",
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

function namedAwardIdentity(title: string): string | null {
  const tokens = normalizeClusterText(title).split(/\s+/).filter(Boolean);
  const awardIndex = tokens.indexOf("award");
  if (awardIndex <= 0) return null;

  const identity: string[] = [];
  for (let index = awardIndex - 1; index >= 0 && identity.length < 3; index -= 1) {
    const token = tokens[index];
    if (AWARD_PREFIX_STOP.has(token)) break;
    identity.unshift(token);
  }
  return identity.length ? identity.join(" ") : null;
}

/**
 * Old generated feed rows can contain the synthesis prompt/packet instead of
 * the source article body. That material must never become durable provenance:
 * it can recursively embed unrelated reports and poison the fact ledger.
 */
export function historicalSourceMaterialContaminated(row: HistoricalFeedItem): boolean {
  const body = row.extracted_body?.trim();
  if (!body) return false;

  const packetMarkers = body.match(/MULTI-SOURCE STORY PACKET/gi)?.length ?? 0;
  const sourceHeaders = body.match(/(?:^|\n)SOURCE\s+\d+\s*:/gim)?.length ?? 0;
  const sourceMaterialHeaders = body.match(/(?:^|\n)SOURCE MATERIAL\s*:/gim)?.length ?? 0;

  return (
    (body.startsWith("MULTI-SOURCE STORY PACKET") && sourceHeaders >= 1)
    || packetMarkers >= 2
    || (sourceHeaders >= 2 && sourceMaterialHeaders >= 2)
  );
}

/**
 * A legacy row may contain an internal_slug written by an older buggy pipeline.
 * Before that slug can become canonical durable provenance, require the row's
 * actual event title to be supported by the published article's editorial text.
 */
export function historicalArticleOwnershipCompatible(
  row: HistoricalFeedItem,
  article: HistoricalArticleEvidence,
): boolean {
  const rowTitle = historicalTitleTokens(row.title);
  const articleEvidence = historicalTitleTokens(`${article.title} ${article.bodyText ?? ""}`);
  if (rowTitle.size < 2 || articleEvidence.size < 2) return false;

  const shared = [...rowTitle].filter((token) => articleEvidence.has(token)).length;
  if (shared < 2) return false;

  const containment = shared / Math.max(1, rowTitle.size);
  return shared >= 3 || containment >= 0.34;
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
  const anchorAward = namedAwardIdentity(anchor.title);
  const candidateAward = namedAwardIdentity(candidate.title);
  if (anchorAward && candidateAward && anchorAward !== candidateAward) return false;

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

    const contaminatedRows = rows.filter(historicalSourceMaterialContaminated);
    if (contaminatedRows.length) {
      plans.push({
        kind: "hold",
        holdType: "source_material_contamination",
        cluster,
        canonicalSlug: slugs.length === 1 ? slugs[0] : null,
        publishedSlugs: slugs,
        feedItemIds,
        sourceFamilies,
        reason: `Historical feed source material contains synthesized or nested source-packet content and cannot be safely preserved as provenance. Contaminated feed item(s): ${contaminatedRows.map((row) => row.id).join(", ")}.`,
      });
      for (const id of feedItemIds) consumed.add(id);
      continue;
    }

    const kind: "safe" | "hold" = slugs.length === 1 ? "safe" : "hold";
    const reason = kind === "safe"
      ? `One existing published slug is supported by ${rows.length} matched reports from ${sourceFamilies.length} source families.`
      : `Matched reports already point to ${slugs.length} published slugs; canonical ownership requires admin review.`;

    plans.push({
      kind,
      holdType: kind === "hold" ? "multiple_published_slugs" : undefined,
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
