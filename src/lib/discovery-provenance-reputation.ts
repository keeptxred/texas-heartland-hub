export type SourceReputation = {
  score: number;
  reason: string;
};

/**
 * Preserve the publisher's reputation whenever it already clears the review
 * floor. If an otherwise-unclassified publisher was surfaced through a vetted
 * Texas discovery feed, allow the item to reach editorial review — but cap the
 * provenance lift at the review floor so discovery provenance can never grant
 * auto-publish authority.
 */
export function applyTrustedDiscoveryReviewFloor(
  publisher: SourceReputation,
  discovery: SourceReputation | null,
  reviewFloor: number,
): SourceReputation {
  if (publisher.score >= reviewFloor || !discovery || discovery.score < reviewFloor) {
    return publisher;
  }

  return {
    score: reviewFloor,
    reason: `${publisher.reason}; review-floor visibility from trusted discovery provenance (${discovery.reason})`,
  };
}