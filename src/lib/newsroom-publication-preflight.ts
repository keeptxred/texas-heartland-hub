import type { ResearchPacketSource } from "./newsroom-research-packet";
import { isGovernmentNewsClippingUrl } from "./newsroom-discovery-sources";

/**
 * Mirrors public.newsroom_source_family_from_url() so publication candidates
 * do not spend AI calls on the same publisher-family constraint that Postgres
 * enforces during INSERT. Keep this in sync with the database trigger.
 */
export function newsroomSourceFamilyFromUrl(inputUrl: string): string | null {
  const raw = inputUrl.trim();
  if (!raw) return null;
  const host = raw.replace(/^https?:\/\//i, "").split("/")[0]
    .toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "");
  if (!host) return null;
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join(".");
  if (new Set(["co.uk", "org.uk", "gov.uk", "com.au", "org.au"]).has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return lastTwo;
}

/**
 * A Google News RSS or government newspaper-clipping link points to reporting, not an
 * independent publisher. Keep the database-compatible family function above
 * intact and use this stricter helper for newsroom editorial independence.
 */
export function newsroomIndependentPublisherFamilyFromUrl(url: string): string | null {
  if (isGovernmentNewsClippingUrl(url)) return null;
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host === "news.google.com" || host === "www.news.google.com") return null;
  } catch {
    return null;
  }
  return newsroomSourceFamilyFromUrl(url);
}

/**
 * The same ordered, deduplicated publisher records drive publication lead
 * selection, the source list and the pre-AI duplicate/source checks. Discovery
 * RSS links are evidence-finding pointers, not citable publisher records.
 */
export function uniquePacketSources(sources: ResearchPacketSource[]): ResearchPacketSource[] {
  const seen = new Set<string>();
  return [...sources]
    .filter((source) => Boolean(source.url?.trim())
      && newsroomIndependentPublisherFamilyFromUrl(source.url) !== null)
    .sort((a, b) => Number(b.isPrimarySource) - Number(a.isPrimarySource)
      || (b.sourceReputationScore ?? 0) - (a.sourceReputationScore ?? 0)
      || a.feedItemId - b.feedItemId)
    .filter((source) => {
      const key = source.url.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function newsroomLeadSourceUrl(sources: ResearchPacketSource[]): string | null {
  return uniquePacketSources(sources)[0]?.url ?? null;
}

/**
 * A story reprinted by a second outlet is not independent reporting simply
 * because the republisher has a different domain. Exact long headlines
 * published across two sites are a conservative, auditable syndication clue.
 *
 * Short/generic titles are not enough evidence to collapse distinct reporting,
 * and this function does not mutate or erase original source citations.
 */
export function newsroomOriginalReportKey(title: string | null | undefined): string | null {
  const normalized = (title ?? "").normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  if (normalized.length < 45 || normalized.split(" ").length < 8) return null;
  return normalized;
}

/**
 * Near-verbatim long headlines are a conservative signal that a story was
 * syndicated through two domains, even if one outlet dropped "is" or a
 * connector. Never use this to collapse short generic titles.
 */
export function newsroomLikelySameOriginalReport(left: string, right: string): boolean {
  const a = newsroomOriginalReportKey(left);
  const b = newsroomOriginalReportKey(right);
  if (!a || !b) return false;
  if (a === b) return true;
  const leftTerms = new Set(a.split(" "));
  const rightTerms = new Set(b.split(" "));
  if (Math.min(leftTerms.size, rightTerms.size) < 8) return false;
  const shared = [...leftTerms].filter((term) => rightTerms.has(term)).length;
  return shared / Math.max(leftTerms.size, rightTerms.size) >= 0.85;
}

/** Stricter than the database guard: discovery links never count as an independent publisher. */
export function newsroomHasPublisherDiversity(sources: ResearchPacketSource[]): boolean {
  const unique = uniquePacketSources(sources);
  if (unique.some((source) => source.isPrimarySource)) return true;
  const families = new Set<string>();
  const originalReports: string[] = [];
  for (const source of unique) {
    const family = newsroomIndependentPublisherFamilyFromUrl(source.url);
    if (!family) continue;
    const originalReport = newsroomOriginalReportKey(source.title);
    // For example, Texas Standard republishes KUT / Texas Newsroom's same
    // long-headline story: two domains, but only ONE independent report.
    if (originalReport && originalReports.some((previous) =>
      newsroomLikelySameOriginalReport(previous, originalReport))) continue;
    if (originalReport) originalReports.push(originalReport);
    families.add(family);
  }
  return families.size >= 2;
}
