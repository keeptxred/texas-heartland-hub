/**
 * A feed record can appear in multiple READY/DISCOVERED newsroom clusters
 * when successive bounded 72-hour discovery windows select different anchors.
 * That multiplies PENDING candidates and leaves stale publisher counts.
 *
 * A current deterministic assignment may replace only uncommitted historical
 * assignments. Never remove evidence from SELECTED, HELD, or PUBLISHED
 * clusters/candidates: they have a publication audit or active process.
 */
export type ReconciliationMembership = {
  cluster_id: string;
  feed_item_id: number;
};
export type ReconciliationCluster = { id: string; status: string };
export type ReconciliationCandidate = { cluster_id: string; status: string };

export function staleUncommittedNewsroomMemberships(
  desired: readonly ReconciliationMembership[],
  existing: readonly ReconciliationMembership[],
  clusters: readonly ReconciliationCluster[],
  candidates: readonly ReconciliationCandidate[],
): { obsolete: ReconciliationMembership[]; protectedCount: number } {
  const desiredByFeedId = new Map<number, string>(desired.map((row) => [row.feed_item_id, row.cluster_id]));
  const clusterStatus = new Map(clusters.map((row) => [row.id, row.status]));
  const candidateStatus = new Map(candidates.map((row) => [row.cluster_id, row.status]));
  const obsolete: ReconciliationMembership[] = [];
  let protectedCount = 0;
  const seen = new Set<string>();
  for (const membership of existing) {
    const intendedCluster = desiredByFeedId.get(membership.feed_item_id);
    if (!intendedCluster || intendedCluster === membership.cluster_id) continue;
    const oldClusterStatus = clusterStatus.get(membership.cluster_id);
    const oldCandidateStatus = candidateStatus.get(membership.cluster_id);
    if (!["READY", "DISCOVERED"].includes(oldClusterStatus ?? "") ||
      (oldCandidateStatus != null && oldCandidateStatus !== "PENDING")) {
      protectedCount += 1;
      continue;
    }
    const key = `${membership.cluster_id}:${membership.feed_item_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    obsolete.push(membership);
  }
  return { obsolete, protectedCount };
}
