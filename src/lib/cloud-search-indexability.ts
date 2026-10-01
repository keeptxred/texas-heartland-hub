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

export const SEARCH_RECOVERY_AUTHORITY_FLAG = "search_recovery_authority";

const SUPPRESSED = new Set<string>(SEARCH_RECOVERY_SUPPRESSED_CLOUD_KINDS);
const REQUIRED_AUTHORITY_FLAGS = [
  SEARCH_RECOVERY_AUTHORITY_FLAG,
  "editorial_reviewed",
  "primary_sources",
] as const;

/**
 * During search recovery, ordinary cloud news remains suppressed. A narrowly
 * governed exception is available for durable authority explainers that have
 * been explicitly approved for search and carry both editorial-review and
 * primary-source provenance flags. This prevents an automated or accidental
 * single flag from reopening the commodity-news class.
 */
export function isCloudArticleSearchEligibleByKind(
  kind: string | null | undefined,
  qualityFlags: string[] | null | undefined = null,
): boolean {
  const normalizedKind = (kind ?? "").trim().toLowerCase();
  if (!SUPPRESSED.has(normalizedKind)) return true;

  const flags = new Set(
    (qualityFlags ?? []).map((flag) => String(flag).trim().toLowerCase()),
  );
  return REQUIRED_AUTHORITY_FLAGS.every((flag) => flags.has(flag));
}
