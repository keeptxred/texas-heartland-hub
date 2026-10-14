import type { IssueGuide } from "@/data/issue-guides";

/**
 * A declared review date is not evidence on its own. Require a real UTC calendar
 * date, not in the future, and cited primary-source URLs identified as checked.
 * This validates provenance metadata, not the accuracy of the underlying facts.
 */
export function verifiedIssueGuideReviewDate(
  guide: Pick<IssueGuide, "reviewedAt" | "reviewSourceUrls" | "sources">,
  now: Date,
): string | null {
  const date = guide.reviewedAt;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  if (parsed.getTime() > now.getTime()) return null;

  const checked = guide.reviewSourceUrls;
  if (!checked?.length) return null;
  const cited = new Set(guide.sources.map((source) => source.url));
  if (!checked.every((url) => /^https:\/\//i.test(url) && cited.has(url))) return null;
  return date;
}
