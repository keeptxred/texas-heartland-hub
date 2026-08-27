import { hasSeoDuplicateFlag } from "@/lib/article-canonical";

export type PublicArticleCandidate = {
  category?: string | null;
  discover_category?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  published_at?: string | null;
  content_quality_score?: number | null;
  body_json?: unknown;
  quality_flags?: string[] | null;
};

type SourceShape = {
  url?: unknown;
};

type BodyShape = {
  updated?: unknown;
  sources?: unknown;
};

/**
 * KeepTXRed's durable editorial boundary is politics, government, hard news,
 * material business developments, and Texas sports. Lifestyle/culture/history
 * coverage belongs on TexasDefined. These legacy Discover labels are explicit
 * enough to block without headline heuristics, which keeps the public gate
 * deterministic and prevents restored lifestyle URLs from leaking back into
 * KTR discovery surfaces.
 */
const TEXASDEFINED_DISCOVER_CATEGORIES = new Set([
  "texas culture",
  "texas history",
]);

/**
 * Discovery/UGC hosts can help editors find a story, but they are not sufficient
 * provenance for an indexable KeepTXRed article on their own. In particular,
 * old `live-*` rows sometimes treated a Google News result or subreddit post as
 * an "official release". Keep those URLs accessible for historical recovery,
 * but out of search until a primary or independently published source is added.
 */
const DISCOVERY_ONLY_HOSTS = new Set([
  "news.google.com",
  "reddit.com",
  "www.reddit.com",
  "old.reddit.com",
]);

function sourceUrls(bodyJson: unknown): string[] {
  if (!bodyJson || typeof bodyJson !== "object") return [];
  const sources = (bodyJson as BodyShape).sources;
  if (!Array.isArray(sources)) return [];
  return sources
    .map((source) => {
      if (!source || typeof source !== "object") return "";
      const url = (source as SourceShape).url;
      return typeof url === "string" ? url.trim() : "";
    })
    .filter(Boolean);
}

function isDiscoveryOnlySource(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return DISCOVERY_ONLY_HOSTS.has(hostname) || hostname.endsWith(".reddit.com");
  } catch {
    return false;
  }
}

function qualifyingSourceCount(article: PublicArticleCandidate): number {
  const urls = [article.source_url, ...sourceUrls(article.body_json)]
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()));
  return new Set(urls.filter((url) => !isDiscoveryOnlySource(url))).size;
}

function sourceReferenceCount(bodyJson: unknown): number {
  if (!bodyJson || typeof bodyJson !== "object") return 0;
  const sources = (bodyJson as BodyShape).sources;
  return Array.isArray(sources) ? sources.length : 0;
}

function validDate(value: unknown): number | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isTexasDefinedDiscoverCategory(value: string | null | undefined): boolean {
  return TEXASDEFINED_DISCOVER_CATEGORIES.has((value ?? "").trim().toLowerCase());
}

export function isPublicArticleReady(article: PublicArticleCandidate): boolean {
  if (hasSeoDuplicateFlag(article.quality_flags)) return false;
  if ((article.category ?? "").trim().toLowerCase() === "non-political") return false;
  if (isTexasDefinedDiscoverCategory(article.discover_category)) return false;
  if ((article.content_quality_score ?? 0) < 60) return false;

  const sourceRefs = sourceReferenceCount(article.body_json);
  if (!article.source_url && sourceRefs === 0) return false;
  if (qualifyingSourceCount(article) === 0) return false;
  if (/\bmultiple(?:\s+independent)?\s+sources?\b/i.test(article.source_name ?? "") && sourceRefs < 2) return false;

  const published = validDate(article.published_at);
  const updated = article.body_json && typeof article.body_json === "object"
    ? validDate((article.body_json as BodyShape).updated)
    : null;
  if (published !== null && updated !== null && updated < published) return false;

  return true;
}
