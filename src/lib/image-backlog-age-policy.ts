// News photos are a current-event editorial expense. Artificial old-event
// scenes repeatedly fail exact-subject vision, and a new image cannot
// truthfully recreate a past rally, hearing or vote. Maintain visual
// verification for fresh news and preserve evergreen updates indefinitely.
export const NEWS_IMAGE_BACKFILL_MAX_AGE_DAYS = 14;

export function eligibleImageBackfillAge(
  kind: string | null | undefined,
  publishedAt: string | null | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (!publishedAt) return false;
  const publishedMs = Date.parse(publishedAt);
  if (!Number.isFinite(publishedMs) || publishedMs > nowMs) return false;
  if (kind?.trim().toLowerCase() === "evergreen") return true;
  return nowMs - publishedMs <= NEWS_IMAGE_BACKFILL_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}
