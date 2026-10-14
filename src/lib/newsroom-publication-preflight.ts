import type { ResearchPacketSource } from "./newsroom-research-packet";

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
 * A Google News discovery/RSS link is a pointer to reporting, not an
 * independent publisher. Keep the database-compatible family function above
 * intact and use this stricter helper for newsroom editorial independence.
 */
export function newsroomIndependentPublisherFamilyFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host === "news.google.com" || host === "www.news.google.com") return null;
  } catch {
    return null;
  }
  return newsroomSourceFamilyFromUrl(url);
}

/** Identical deterministic ordering to the source list used in the article. */
export function uniquePacketSources(sources: ResearchPacketSource[]): ResearchPacketSource[] {
  const seen = new Set<string>();
  return [...sources]
    .filter((source) => Boolean(source.url?.trim()))
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

/** Stricter than the database guard: discovery links never count as an independent publisher. */
export function newsroomHasPublisherDiversity(sources: ResearchPacketSource[]): boolean {
  const unique = uniquePacketSources(sources);
  if (unique.some((source) => source.isPrimarySource)) return true;
  const families = new Set(unique.map((source) => newsroomIndependentPublisherFamilyFromUrl(source.url)).filter(Boolean));
  return families.size >= 2;
}
