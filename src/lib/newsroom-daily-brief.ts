export type DailyBriefCandidate = {
  id: string;
  clusterId: string;
  editorialScore: number;
  recommendedFormat: "SKIP" | "SINGLE" | "MERGE" | "SYNTHESIS" | string;
  status: string;
  firstSeenAt: string;
  hasResearchPacket: boolean;
};

export type DailyBriefSelectionOptions = {
  maxItems?: number;
  reservedStandaloneSlots?: number;
  minimumScore?: number;
};

const DEFAULT_MAX_ITEMS = 7;
const DEFAULT_STANDALONE_SLOTS = 8;
const DEFAULT_MINIMUM_SCORE = 35;

/**
 * Select secondary statewide developments for one Texas Daily Brief.
 *
 * The selector deliberately has no pillar inputs or quotas. It ranks every
 * eligible candidate together, reserves the strongest normal-generation slots
 * for standalone coverage, then uses the next strongest packet-backed items.
 */
export function selectDailyBriefItems(
  candidates: readonly DailyBriefCandidate[],
  options: DailyBriefSelectionOptions = {},
): DailyBriefCandidate[] {
  const maxItems = Math.max(1, Math.min(options.maxItems ?? DEFAULT_MAX_ITEMS, 10));
  const reservedStandaloneSlots = Math.max(0, options.reservedStandaloneSlots ?? DEFAULT_STANDALONE_SLOTS);
  const minimumScore = Math.max(0, Math.min(options.minimumScore ?? DEFAULT_MINIMUM_SCORE, 100));

  const eligible = candidates
    .filter((candidate) => candidate.hasResearchPacket)
    .filter((candidate) => candidate.editorialScore >= minimumScore)
    .filter((candidate) => !["SELECTED", "PUBLISHED", "REJECTED"].includes(candidate.status))
    .filter((candidate) => candidate.recommendedFormat !== "SKIP")
    .sort((a, b) =>
      b.editorialScore - a.editorialScore
      || Date.parse(a.firstSeenAt) - Date.parse(b.firstSeenAt)
      || a.clusterId.localeCompare(b.clusterId),
    );

  const secondary = eligible.slice(reservedStandaloneSlots);
  const seenClusters = new Set<string>();
  const selected: DailyBriefCandidate[] = [];
  for (const candidate of secondary) {
    if (seenClusters.has(candidate.clusterId)) continue;
    seenClusters.add(candidate.clusterId);
    selected.push(candidate);
    if (selected.length >= maxItems) break;
  }
  return selected;
}

export function dailyBriefSelectionDefaults() {
  return {
    maxItems: DEFAULT_MAX_ITEMS,
    reservedStandaloneSlots: DEFAULT_STANDALONE_SLOTS,
    minimumScore: DEFAULT_MINIMUM_SCORE,
  } as const;
}
