const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "source",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
]);

const TITLE_NOISE = new Set([
  "a", "an", "and", "at", "by", "for", "from", "in", "of", "on", "the", "to", "with",
]);

function fold(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"');
}

export function normalizeText(value: string | null | undefined): string {
  return fold(value ?? "")
    .toLowerCase()
    .replace(/&amp;/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeTitle(value: string | null | undefined): string {
  const normalized = normalizeText(value);
  const tokens = normalized.split(" ").filter(Boolean);
  return tokens.filter((token, index) => !TITLE_NOISE.has(token) || index === 0).join(" ");
}

export function normalizeSourceKey(value: string | null | undefined): string {
  return normalizeText(value).replace(/\s+/g, "-") || "unknown-source";
}

export function canonicalizeNewsUrl(value: string | null | undefined): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMS.has(key.toLowerCase()) || key.toLowerCase().startsWith("utm_")) {
        url.searchParams.delete(key);
      }
    }
    url.searchParams.sort();
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString();
  } catch {
    return value.trim();
  }
}

export function stableFingerprint(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export type NormalizedNewsFeedItem = {
  feedItemId: number;
  normalizedTitle: string;
  normalizedDescription: string;
  canonicalUrl: string;
  sourceKey: string;
  titleFingerprint: string;
  contentFingerprint: string | null;
  observedAt: string;
};

export function normalizeNewsFeedItem(row: {
  id: number;
  title?: string | null;
  source?: string | null;
  link?: string | null;
  description?: string | null;
  pub_date?: string | null;
  created_at?: string | null;
}): NormalizedNewsFeedItem {
  const normalizedTitle = normalizeTitle(row.title);
  const normalizedDescription = normalizeText(row.description);
  const canonicalUrl = canonicalizeNewsUrl(row.link);
  const sourceKey = normalizeSourceKey(row.source);
  return {
    feedItemId: row.id,
    normalizedTitle,
    normalizedDescription,
    canonicalUrl,
    sourceKey,
    titleFingerprint: stableFingerprint(normalizedTitle),
    contentFingerprint: normalizedDescription ? stableFingerprint(`${normalizedTitle}|${normalizedDescription}`) : null,
    observedAt: row.pub_date ?? row.created_at ?? new Date(0).toISOString(),
  };
}

export type ExistingNormalization = {
  feed_item_id: number;
  canonical_url: string;
  source_key: string;
  title_fingerprint: string;
  observed_at: string;
};

export function findDeterministicDuplicate(
  item: NormalizedNewsFeedItem,
  existing: readonly ExistingNormalization[],
): { feedItemId: number; reason: "canonical-url" | "same-source-title"; confidence: number } | null {
  const candidates = existing
    .filter((candidate) => candidate.feed_item_id !== item.feedItemId)
    .sort((a, b) => Date.parse(a.observed_at) - Date.parse(b.observed_at) || a.feed_item_id - b.feed_item_id);

  if (item.canonicalUrl) {
    const exactUrl = candidates.find((candidate) => candidate.canonical_url === item.canonicalUrl);
    if (exactUrl) return { feedItemId: exactUrl.feed_item_id, reason: "canonical-url", confidence: 1 };
  }

  const sameSourceTitle = candidates.find((candidate) =>
    candidate.source_key === item.sourceKey && candidate.title_fingerprint === item.titleFingerprint,
  );
  if (sameSourceTitle) return { feedItemId: sameSourceTitle.feed_item_id, reason: "same-source-title", confidence: 0.98 };

  return null;
}
