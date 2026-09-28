/**
 * Emergency search-recovery boundary for Supabase-backed newsroom articles.
 *
 * KTR's Search Console visibility collapsed in July 2026 and the automated
 * cloud-news class has not recovered meaningful Google visibility. Keep those
 * stories available to readers, social distribution, and internal editorial
 * workflows, but do not advertise them to search engines while the site
 * rebuilds trust around durable, non-commodity authority content.
 *
 * Static editorial articles are governed separately and are intentionally not
 * affected by this policy.
 */
export const SEARCH_RECOVERY_SUPPRESSED_CLOUD_KINDS = [
  "news",
  "ingested",
] as const;

const SUPPRESSED = new Set<string>(SEARCH_RECOVERY_SUPPRESSED_CLOUD_KINDS);

export function isCloudArticleSearchEligibleByKind(
  kind: string | null | undefined,
): boolean {
  return !SUPPRESSED.has((kind ?? "").trim().toLowerCase());
}
