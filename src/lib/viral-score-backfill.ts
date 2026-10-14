/** Preserve the recent feed view while reserving bounded capacity for unscored
 * historical stories. A story in both windows must be scored only once.
 */
export function mergeScoringRows<T extends { id: number }>(
  recent: readonly T[],
  unscored: readonly T[],
  maxRows = 300,
): T[] {
  const result: T[] = [];
  const seen = new Set<number>();
  for (const row of [...recent, ...unscored]) {
    if (result.length >= maxRows) break;
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    result.push(row);
  }
  return result;
}

/** Historical backfill improves discovery but may not mint stale news as new. */
export function isFreshForAutoPublication(
  pubDate: string | null,
  nowMs = Date.now(),
): boolean {
  const publishMs = Date.parse(pubDate ?? "");
  return Number.isFinite(publishMs) &&
    publishMs >= nowMs - 72 * 60 * 60 * 1000 &&
    publishMs <= nowMs + 60 * 60 * 1000;
}
