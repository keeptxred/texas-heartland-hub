/**
 * Canonical-article helpers for SEO crawl-budget cleanup.
 *
 * Pure module (no I/O) so it is testable and safe on both client and server:
 *  - resolve `article_slug_redirects` chains with a loop/self guard
 *  - detect SEO duplicate / quarantine quality flags
 *  - pick the *strongest* article in a same-event cluster
 *  - decide conservatively whether two headlines are the same event rewrite
 *    or a materially new follow-up development
 */

import { isDuplicateTitle } from "@/lib/title-similarity";
import { newsClusterKey } from "@/lib/article-slug-integrity";

/**
 * Quality flags that mean "do not advertise this URL to search engines".
 *
 * This list is also the public-discovery quarantine contract used by newsroom
 * loaders. Keep it synchronized with the AdSense readiness audit so a row that
 * is deliberately noindexed cannot still be promoted through homepage,
 * newsroom, or author discovery.
 */
export const SEO_DUPLICATE_FLAGS = [
  "seo_duplicate",
  "duplicate",
  "duplicate_story",
  "duplicate_cluster",
  "near_duplicate",
  "noindex",
  "seo_noindex",
  "canonical_duplicate",
  "legacy_thin_content",
  "seo_legacy_single_source",
  "seo_low_value_commodity",
  "seo_false_multisource",
  "source_integrity_failure",
  "seo_off_topic",
  "site_boundary_violation",
  "gsc_zero_impression_hold_2026_09_03",
] as const;

export function hasSeoDuplicateFlag(flags: string[] | null | undefined): boolean {
  if (!Array.isArray(flags)) return false;
  return flags.some((raw) => {
    const flag = (raw ?? "").trim().toLowerCase();
    return (SEO_DUPLICATE_FLAGS as readonly string[]).includes(flag);
  });
}

/* ------------------------------------------------------------------ *
 * Redirect resolution
 * ------------------------------------------------------------------ */

export const MAX_REDIRECT_HOPS = 5;

/**
 * Follows old_slug -> new_slug hops. Returns null when there is no redirect,
 * when the mapping points at itself, or when a loop / overlong chain is
 * detected (so we never emit a redirect loop to Google).
 */
export function resolveRedirectChain(
  redirects: ReadonlyMap<string, string> | Record<string, string>,
  slug: string,
  maxHops: number = MAX_REDIRECT_HOPS,
): string | null {
  const get = (key: string): string | undefined =>
    redirects instanceof Map
      ? redirects.get(key)
      : (redirects as Record<string, string>)[key];

  const start = (slug ?? "").trim();
  if (!start) return null;

  const seen = new Set<string>([start]);
  let current = start;
  for (let hop = 0; hop < maxHops; hop++) {
    const next = (get(current) ?? "").trim();
    if (!next) break;
    if (next === current || seen.has(next)) return null;
    seen.add(next);
    current = next;
  }
  if (current === start) return null;
  if (get(current)) return null;
  return current;
}

/* ------------------------------------------------------------------ *
 * Same-event clustering
 * ------------------------------------------------------------------ */

const FOLLOW_UP_MARKERS = [
  /\barrest(ed|s)?\b/i,
  /\bindict(ed|ment)\b/i,
  /\bcharged\b/i,
  /\bconvicted\b/i,
  /\bsentenced\b/i,
  /\bresign(ed|s|ation)\b/i,
  /\bfired\b/i,
  /\bdies?\b|\bdeath toll\b|\bkilled\b/i,
  /\bdeclares?\b|\bdeclaration\b/i,
  /\bpasses?\b|\bpassed\b|\bapproved?\b|\bsigns?\b|\bsigned\b|\bvetoe?[sd]?\b/i,
  /\bruling\b|\bruled\b|\bappeal(s|ed)?\b|\blawsuit\b|\bsued\b/i,
  /\bhearing\b|\btestifies?\b|\btestimony\b/i,
  /\bfinal\b|\bresults?\b|\bconcedes?\b/i,
  /\brecall(ed|s)?\b|\bevacuat(e|ed|ion)\b|\breopens?\b|\bcloses?\b/i,
  /\bupdate[d]?\b|\bnew (details|evidence|numbers)\b/i,
];

function numbersIn(title: string): string[] {
  return (title.match(/\d+(?:[.,]\d+)?/g) ?? []).filter((n) => n.length > 0);
}

export function isFollowUpDevelopment(existing: string, candidate: string): boolean {
  const a = existing ?? "";
  const b = candidate ?? "";
  if (!b.trim()) return false;

  const existingMarkers = new Set(
    FOLLOW_UP_MARKERS.filter((re) => re.test(a)).map((re) => re.source),
  );
  const newMarker = FOLLOW_UP_MARKERS.some(
    (re) => re.test(b) && !existingMarkers.has(re.source),
  );
  if (newMarker) return true;

  const existingNumbers = new Set(numbersIn(a));
  return numbersIn(b).some((n) => !existingNumbers.has(n));
}

export function isSameEventRewrite(existing: string, candidate: string): boolean {
  if (!existing?.trim() || !candidate?.trim()) return false;
  if (isDuplicateTitle(existing, candidate)) {
    return !isFollowUpDevelopment(existing, candidate);
  }
  const keyA = newsClusterKey(existing);
  const keyB = newsClusterKey(candidate);
  if (!keyA || keyA !== keyB) return false;
  return !isFollowUpDevelopment(existing, candidate);
}

/* ------------------------------------------------------------------ *
 * Strongest-article selection
 * ------------------------------------------------------------------ */

export type ClusterCandidate = {
  slug: string;
  title: string;
  published_at: string;
  content_quality_score?: number | null;
  main_word_count?: number | null;
};

export function isStrongerArticle(a: ClusterCandidate, b: ClusterCandidate): boolean {
  const qa = a.content_quality_score ?? 0;
  const qb = b.content_quality_score ?? 0;
  if (qa !== qb) return qa > qb;
  const wa = a.main_word_count ?? 0;
  const wb = b.main_word_count ?? 0;
  if (wa !== wb) return wa > wb;
  const ta = Date.parse(a.published_at) || 0;
  const tb = Date.parse(b.published_at) || 0;
  if (ta !== tb) return ta > tb;
  return a.slug < b.slug;
}

export function pickStrongestArticle<T extends ClusterCandidate>(candidates: T[]): T | null {
  let best: T | null = null;
  for (const candidate of candidates) {
    if (!best || isStrongerArticle(candidate, best)) best = candidate;
  }
  return best;
}

export function selectCanonicalArticles<T extends ClusterCandidate>(articles: T[]): T[] {
  const groups: T[][] = [];
  for (const article of articles) {
    const group = groups.find((g) => g.some((member) => isSameEventRewrite(member.title, article.title)));
    if (group) group.push(article);
    else groups.push([article]);
  }
  const winners = new Set(
    groups.map((g) => pickStrongestArticle(g)!.slug),
  );
  return articles.filter((a) => winners.has(a.slug));
}
