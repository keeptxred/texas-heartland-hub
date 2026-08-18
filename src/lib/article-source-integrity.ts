export type ArticleSourceReference = {
  url?: string | null;
  label?: string | null;
};

export type ArticleSourceIntegrity = {
  distinctFamilies: string[];
  falseMultiSourceClaim: boolean;
  primarySourceRepresented: boolean;
};

const MULTI_SOURCE_RE = /\bmultiple\s+(?:independent\s+)?sources?\b/i;

const PUBLIC_SUFFIX_EXCEPTIONS = new Set([
  "co.uk",
  "org.uk",
  "gov.uk",
  "com.au",
  "org.au",
]);

function normalizedHost(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Collapse feed/CDN/subdomain variants to a publisher family. This prevents
 * an RSS URL plus the publisher's canonical article URL from masquerading as
 * two independent sources.
 */
export function sourceFamilyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const host = normalizedHost(url);
  if (!host) return null;
  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return host;

  const lastTwo = parts.slice(-2).join(".");
  if (PUBLIC_SUFFIX_EXCEPTIONS.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return lastTwo;
}

export function normalizedSourceUrlKey(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
    return parsed.toString();
  } catch {
    return null;
  }
}

export function distinctSourceFamilies(
  sources: readonly ArticleSourceReference[] | null | undefined,
): string[] {
  const families = new Set<string>();
  for (const source of sources ?? []) {
    const family = sourceFamilyFromUrl(source.url);
    if (family) families.add(family);
  }
  return [...families].sort();
}

export function sourceUrlRepresentedInBody(
  sourceUrl: string | null | undefined,
  sources: readonly ArticleSourceReference[] | null | undefined,
): boolean {
  if (!sourceUrl) return true;
  const primaryKey = normalizedSourceUrlKey(sourceUrl);
  if (!primaryKey) return false;
  return (sources ?? []).some((source) => normalizedSourceUrlKey(source.url) === primaryKey);
}

export function assessArticleSourceIntegrity(input: {
  sourceName?: string | null;
  sourceUrl?: string | null;
  sources?: readonly ArticleSourceReference[] | null;
}): ArticleSourceIntegrity {
  const distinctFamilies = distinctSourceFamilies(input.sources);
  const falseMultiSourceClaim = MULTI_SOURCE_RE.test(input.sourceName ?? "") && distinctFamilies.length < 2;
  const primarySourceRepresented = sourceUrlRepresentedInBody(input.sourceUrl, input.sources);
  return { distinctFamilies, falseMultiSourceClaim, primarySourceRepresented };
}
