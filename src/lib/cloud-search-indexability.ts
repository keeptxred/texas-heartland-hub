/**
 * Emergency search-recovery boundary for Supabase-backed newsroom articles.
 *
 * KTR's Search Console visibility collapsed in July 2026 and the automated
 * cloud-news class has not recovered meaningful Google visibility. Keep those
 * stories available to readers, social distribution, and internal editorial
 * workflows, but do not advertise ordinary commodity rewrites to search engines
 * while the site rebuilds trust around durable, differentiated authority content.
 *
 * Static editorial articles are governed separately and are intentionally not
 * affected by this policy.
 */
export const SEARCH_RECOVERY_SUPPRESSED_CLOUD_KINDS = [
  "news",
  "ingested",
] as const;

export const SEARCH_RECOVERY_AUTHORITY_FLAG = "search_recovery_authority";
export const SEARCH_RECOVERY_SOURCE_FIRST_FLAG = "search_recovery_source_first";

const SUPPRESSED = new Set<string>(SEARCH_RECOVERY_SUPPRESSED_CLOUD_KINDS);
const REQUIRED_AUTHORITY_FLAGS = [
  SEARCH_RECOVERY_AUTHORITY_FLAG,
  "editorial_reviewed",
  "primary_sources",
] as const;

/**
 * Official/public-source URLs that are strong enough to support the automated
 * source-first recovery lane. `.gov` covers federal, state, county, and local
 * public agencies. ERCOT is included because it is the authoritative operator
 * and publisher for Texas grid/resource-adequacy data even though it uses .com.
 */
export function isSearchRecoveryPrimarySourceUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/^www\./, "");
    return hostname.endsWith(".gov")
      || hostname === "ercot.com"
      || hostname.endsWith(".ercot.com");
  } catch {
    return false;
  }
}

/**
 * During search recovery, ordinary cloud news remains suppressed. Two narrow
 * exceptions exist:
 *
 * 1. a manually reviewed authority item carrying all three review/provenance
 *    flags; or
 * 2. a source-first newsroom item carrying the internal flag emitted only by
 *    the post-publish finalizer after a >=90 quality score, source-integrity
 *    checks, repetition checks, and an official/public primary source.
 *
 * All callers must still apply the normal public-readiness and site-ownership
 * gates. A recovery flag never overrides duplicate, thin, off-topic, image, or
 * source-integrity protections.
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
  if (flags.has(SEARCH_RECOVERY_SOURCE_FIRST_FLAG)) return true;
  return REQUIRED_AUTHORITY_FLAGS.every((flag) => flags.has(flag));
}
