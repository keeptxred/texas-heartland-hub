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

/** A legacy rapid-publish URL may enter search only after explicit restoration. */
export function isLegacyArticleSearchEligible(
  slug: string,
  qualityFlags: string[] | null | undefined,
): boolean {
  if (!String(slug ?? "").trim().toLowerCase().startsWith("live-")) return true;
  return (qualityFlags ?? []).some(
    (flag) => String(flag).trim().toLowerCase() === "legacy_url_restored",
  );
}

/** Read factual source URLs from the stored article, not from a quality flag. */
export function articleProvenanceUrls(article: { source_url?: string | null; body_json?: unknown }): string[] {
  const urls: string[] = [];
  if (article.source_url) urls.push(article.source_url);
  if (!article.body_json || typeof article.body_json !== "object") return urls;
  const sources = (article.body_json as { sources?: unknown }).sources;
  if (!Array.isArray(sources)) return urls;
  for (const source of sources) {
    if (source && typeof source === "object" && typeof source.url === "string") {
      urls.push(source.url);
    }
  }
  return urls;
}

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
  provenanceUrls: readonly (string | null | undefined)[] = [],
): boolean {
  const normalizedKind = (kind ?? "").trim().toLowerCase();
  if (!SUPPRESSED.has(normalizedKind)) return true;

  const flags = new Set(
    (qualityFlags ?? []).map((flag) => String(flag).trim().toLowerCase()),
  );
  // A stored flag alone is insufficient: the official/public primary source
  // must still be present on the current article after any later edits.
  if (flags.has(SEARCH_RECOVERY_SOURCE_FIRST_FLAG)) {
    return provenanceUrls.some(isSearchRecoveryPrimarySourceUrl);
  }
  return REQUIRED_AUTHORITY_FLAGS.every((flag) => flags.has(flag));
}
