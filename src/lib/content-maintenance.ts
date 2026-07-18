/**
 * Evergreen content maintenance schedule.
 *
 * Determines how frequently a given content category should be reviewed,
 * and computes review-due dates from an article's lastReviewedDate.
 * Used by the /laws hub and any future evergreen tooling to surface
 * out-of-date articles for editorial review without duplicating the
 * original URL.
 */

export type ContentCategory =
  | "laws"
  | "elections"
  | "taxes"
  | "regulations"
  | "government-policy"
  | "relocation"
  | "housing"
  | "financial"
  | "cost-of-living"
  | "history"
  | "culture"
  | "lifestyle";

/** Review cadence in days, by category. */
export const REVIEW_INTERVAL_DAYS: Record<ContentCategory, number> = {
  // High-change: review every 90 days.
  laws: 90,
  elections: 90,
  taxes: 90,
  regulations: 90,
  "government-policy": 90,
  // Medium-change: review every 180 days.
  relocation: 180,
  housing: 180,
  financial: 180,
  "cost-of-living": 180,
  // Low-change: review every 365 days.
  history: 365,
  culture: 365,
  lifestyle: 365,
};

export function reviewIntervalDays(category: ContentCategory | null | undefined): number {
  if (!category) return 180;
  return REVIEW_INTERVAL_DAYS[category] ?? 180;
}

/** Returns the ISO date the next review is due, based on lastReviewedDate + interval. */
export function nextReviewDate(
  lastReviewedDate: string | null | undefined,
  category: ContentCategory | null | undefined,
): string | null {
  if (!lastReviewedDate) return null;
  const last = new Date(lastReviewedDate);
  if (Number.isNaN(last.getTime())) return null;
  const due = new Date(last.getTime() + reviewIntervalDays(category) * 86_400_000);
  return due.toISOString().slice(0, 10);
}

/** True if the article is past its scheduled review date. */
export function isReviewDue(
  lastReviewedDate: string | null | undefined,
  category: ContentCategory | null | undefined,
  now: Date = new Date(),
): boolean {
  const next = nextReviewDate(lastReviewedDate, category);
  if (!next) return false;
  return new Date(next).getTime() <= now.getTime();
}

/**
 * Editorial defaults applied to any newly-created evergreen article.
 * The generator/backfill pipeline should call this to stamp maintenance
 * fields at creation time so future review sweeps can find the article.
 */
export function defaultMaintenanceFields(
  category: ContentCategory,
  publishedDate: string = new Date().toISOString().slice(0, 10),
): {
  contentCategory: ContentCategory;
  lastReviewedDate: string;
  dateModified: string;
  nextReviewDate: string;
} {
  return {
    contentCategory: category,
    lastReviewedDate: publishedDate,
    dateModified: publishedDate,
    nextReviewDate: nextReviewDate(publishedDate, category) ?? publishedDate,
  };
}