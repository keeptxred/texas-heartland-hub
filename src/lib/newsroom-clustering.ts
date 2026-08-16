const CLUSTER_STOPWORDS = new Set([
  "a", "about", "after", "again", "against", "all", "an", "and", "are", "as", "at", "be", "before", "by",
  "for", "from", "has", "have", "in", "into", "is", "it", "its", "new", "of", "on", "or", "over", "says", "the",
  "to", "texas", "that", "this", "with", "will",
]);

export type ClusterableFeedItem = {
  feedItemId: number;
  normalizedTitle: string;
  sourceKey: string;
  observedAt: string;
  pillarSlug?: string | null;
};

export function storyTokens(title: string): Set<string> {
  return new Set(
    title.split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3 && !CLUSTER_STOPWORDS.has(token)),
  );
}

export function deterministicStorySimilarity(a: ClusterableFeedItem, b: ClusterableFeedItem): number {
  if (a.feedItemId === b.feedItemId) return 1;
  if (a.pillarSlug && b.pillarSlug && a.pillarSlug !== b.pillarSlug) return 0;
  const hoursApart = Math.abs(Date.parse(a.observedAt) - Date.parse(b.observedAt)) / 3_600_000;
  if (!Number.isFinite(hoursApart) || hoursApart > 36) return 0;

  const aTokens = storyTokens(a.normalizedTitle);
  const bTokens = storyTokens(b.normalizedTitle);
  if (aTokens.size < 3 || bTokens.size < 3) return 0;
  const intersection = [...aTokens].filter((token) => bTokens.has(token)).length;
  if (intersection < 3) return 0;
  const union = new Set([...aTokens, ...bTokens]).size;
  const jaccard = intersection / Math.max(1, union);
  const containment = intersection / Math.max(1, Math.min(aTokens.size, bTokens.size));

  if (containment >= 0.72) return Math.max(jaccard, containment);
  if (jaccard >= 0.48) return jaccard;
  return 0;
}

export type DeterministicStoryCluster = {
  anchorFeedItemId: number;
  memberFeedItemIds: number[];
  canonicalSubject: string;
  confidence: number;
};

export function clusterNewsFeedItems(items: readonly ClusterableFeedItem[]): DeterministicStoryCluster[] {
  const ordered = [...items].sort((a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt) || a.feedItemId - b.feedItemId);
  const parent = ordered.map((_, index) => index);
  const find = (index: number): number => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]];
      index = parent[index];
    }
    return index;
  };
  const union = (left: number, right: number) => {
    const a = find(left);
    const b = find(right);
    if (a !== b) parent[b] = a;
  };

  const pairScores = new Map<string, number>();
  for (let left = 0; left < ordered.length; left += 1) {
    for (let right = left + 1; right < ordered.length; right += 1) {
      const score = deterministicStorySimilarity(ordered[left], ordered[right]);
      if (score <= 0) continue;
      union(left, right);
      pairScores.set(`${left}:${right}`, score);
    }
  }

  const groups = new Map<number, number[]>();
  ordered.forEach((_, index) => {
    const root = find(index);
    groups.set(root, [...(groups.get(root) ?? []), index]);
  });

  return [...groups.values()].map((indexes) => {
    const members = indexes.map((index) => ordered[index]);
    const anchor = members[0];
    const canonical = [...members].sort((a, b) => b.normalizedTitle.length - a.normalizedTitle.length || a.feedItemId - b.feedItemId)[0];
    const scores: number[] = [];
    for (let left = 0; left < indexes.length; left += 1) {
      for (let right = left + 1; right < indexes.length; right += 1) {
        const key = `${Math.min(indexes[left], indexes[right])}:${Math.max(indexes[left], indexes[right])}`;
        const score = pairScores.get(key);
        if (score) scores.push(score);
      }
    }
    const confidence = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 1;
    return {
      anchorFeedItemId: anchor.feedItemId,
      memberFeedItemIds: members.map((member) => member.feedItemId),
      canonicalSubject: canonical.normalizedTitle,
      confidence: Math.min(1, Math.max(0, confidence)),
    };
  });
}
