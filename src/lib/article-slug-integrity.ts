/**
 * Article slug / publish-date integrity.
 *
 * News slugs are `YYYY-MM-DD-descriptive-hash` (older rows carry a `live-`
 * prefix). Some RSS feeds publish wildly wrong `pubDate` values (e.g. 2001
 * for a 2026 story), which used to leak straight into the slug and into
 * `published_at`. These helpers clamp untrustworthy feed dates at ingest and
 * let the site detect legacy bad-year URLs so they are never advertised in a
 * sitemap.
 *
 * Pure module — no side effects, safe on the client and the server.
 */

/** Feed dates older than this many days are treated as untrustworthy. */
export const MAX_BACKDATE_DAYS = 60;
/** Feed dates further in the future than this are treated as untrustworthy. */
export const MAX_FUTUREDATE_DAYS = 2;

const SLUG_DATE_RE = /^(live-)?(\d{4})-(\d{2})-(\d{2})-(.+)$/;

export type ParsedArticleSlug = {
  prefix: string;
  year: number;
  month: number;
  day: number;
  /** Everything after the date prefix (descriptive words + link hash). */
  tail: string;
};

export function parseArticleSlug(slug: string): ParsedArticleSlug | null {
  const match = SLUG_DATE_RE.exec((slug ?? "").trim());
  if (!match) return null;
  return {
    prefix: match[1] ?? "",
    year: Number(match[2]),
    month: Number(match[3]),
    day: Number(match[4]),
    tail: match[5],
  };
}

/** A publish timestamp we are willing to trust from a feed. */
export function isPlausiblePublishDate(value: string | number | Date, now: Date = new Date()): boolean {
  const ts = value instanceof Date ? value.getTime() : typeof value === "number" ? value : Date.parse(value);
  if (Number.isNaN(ts)) return false;
  const nowMs = now.getTime();
  if (ts > nowMs + MAX_FUTUREDATE_DAYS * 86_400_000) return false;
  if (ts < nowMs - MAX_BACKDATE_DAYS * 86_400_000) return false;
  return true;
}

/**
 * Returns an ISO timestamp safe to use for `published_at` and for the slug
 * date prefix. Implausible feed dates fall back to ingestion time so a 2026
 * story can never mint a 2001 URL.
 */
export function resolvePublishTimestamp(raw: string | number | Date | null | undefined, now: Date = new Date()): string {
  if (raw == null) return now.toISOString();
  if (!isPlausiblePublishDate(raw, now)) return now.toISOString();
  const ts = raw instanceof Date ? raw.getTime() : typeof raw === "number" ? raw : Date.parse(raw);
  return new Date(ts).toISOString();
}

/** True when the slug's date prefix disagrees with the article's real date. */
export function hasSlugDateMismatch(
  slug: string,
  publishedAt: string | Date | null | undefined,
  now: Date = new Date(),
): boolean {
  const parsed = parseArticleSlug(slug);
  if (!parsed) return false;
  const reference = publishedAt ? new Date(publishedAt) : now;
  const refYear = Number.isNaN(reference.getTime()) ? now.getFullYear() : reference.getUTCFullYear();
  if (parsed.year === refYear) return false;
  // Allow a one-year gap only across a year boundary (Dec 31 / Jan 1).
  if (Math.abs(parsed.year - refYear) === 1 && (parsed.month === 12 || parsed.month === 1)) return false;
  return true;
}

/** Legacy bad-year URL: slug year is far from the current year. */
export function isBadYearSlug(slug: string, now: Date = new Date()): boolean {
  const parsed = parseArticleSlug(slug);
  if (!parsed) return false;
  const year = now.getUTCFullYear();
  return parsed.year < year - 1 || parsed.year > year + 1;
}

/** Rebuild a slug with a corrected date prefix (same prefix + tail). */
export function canonicalSlugForDate(slug: string, publishedAt: string | Date): string | null {
  const parsed = parseArticleSlug(slug);
  if (!parsed) return null;
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return null;
  return `${parsed.prefix}${date.toISOString().slice(0, 10)}-${parsed.tail}`;
}

/** May this article URL be advertised in a sitemap? */
export function isSitemapEligibleSlug(
  slug: string,
  publishedAt?: string | Date | null,
  now: Date = new Date(),
): boolean {
  if (!slug) return false;
  if (isBadYearSlug(slug, now)) return false;
  if (publishedAt && hasSlugDateMismatch(slug, publishedAt, now)) return false;
  return true;
}

const CLUSTER_STOP = new Set([
  "texas","texan","texans","today","update","updates","report","reports","reported","state","states",
  "news","story","stories","breaking","live","after","before","during","amid","says","said","what",
  "when","where","which","while","with","from","into","over","this","that","their","there","would",
  "could","should","being","about","against","across","among","around","between","under","other","more",
  "most","first","new","following","official","officials","announced","announces",
]);

/**
 * A coarse same-event fingerprint used to spot near-duplicate news clusters
 * (same flood, same appointment, same game) across days and sources.
 */
export function newsClusterKey(title: string): string {
  const tokens = (title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 5 && !CLUSTER_STOP.has(word));
  return Array.from(new Set(tokens)).sort().slice(0, 5).join("-");
}
