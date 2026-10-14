import { ALL_GUIDES } from "@/data/all-guides";
import { ARTICLES } from "@/data/articles";
import { issueGuides } from "@/data/issue-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";
import { getLawGuideMeta, lawGuideCanonicalPath } from "@/lib/law-guides";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";

export type DurableFacebookGuideCandidate = {
  slug: string;
  title: string;
  category: string;
  kind: "evergreen-guide";
  source_pool: "pillar-articles" | "guides" | "issue-guides" | "published-evergreen";
  is_breaking: false;
  score: number;
  published_at: string;
  url: string;
  image_url: string;
};

const DATE_INDEPENDENT_SENTINEL = "2000-01-01T00:00:00.000Z";

export function durableGuideCanonicalUrl(slug: string): string {
  const path = getLawGuideMeta(slug)
    ? lawGuideCanonicalPath(slug)
    : `/guides/${encodeURIComponent(slug)}`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function isPublishedPillarArticle(article: (typeof ARTICLES)[number], now = new Date()): boolean {
  if (!article.pillar || !isStaticArticleIndexable(article)) return false;
  if (!article.publishAt) return true;
  const publishAt = Date.parse(article.publishAt);
  return Number.isFinite(publishAt) && publishAt <= now.getTime();
}

function uniqueByUrl(candidates: DurableFacebookGuideCandidate[]): DurableFacebookGuideCandidate[] {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    if (seen.has(candidate.url)) return false;
    seen.add(candidate.url);
    return true;
  });
}

const pillarArticles: DurableFacebookGuideCandidate[] = ARTICLES
  .filter((article) => isPublishedPillarArticle(article))
  .map((article) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    kind: "evergreen-guide" as const,
    source_pool: "pillar-articles" as const,
    is_breaking: false as const,
    score: 22,
    published_at: article.publishedAt,
    url: `${SITE_URL}/news/${encodeURIComponent(article.slug)}`,
    image_url: article.image || DEFAULT_OG_IMAGE,
  }));

const productionGuides: DurableFacebookGuideCandidate[] = Object.values(ALL_GUIDES)
  .filter(isSupportingGuideIndexable)
  .map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    category: guide.pillarLabel,
    kind: "evergreen-guide" as const,
    source_pool: "guides" as const,
    is_breaking: false as const,
    score: 20,
    published_at: guide.updated,
    url: durableGuideCanonicalUrl(guide.slug),
    image_url: DEFAULT_OG_IMAGE,
  }));

const productionIssueGuides: DurableFacebookGuideCandidate[] = issueGuides
  .filter(isIssueGuideIndexable)
  .map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    category: guide.category,
    kind: "evergreen-guide" as const,
    source_pool: "issue-guides" as const,
    is_breaking: false as const,
    score: 20,
    published_at: DATE_INDEPENDENT_SENTINEL,
    url: `${SITE_URL}/issues/${encodeURIComponent(guide.slug)}`,
    image_url: DEFAULT_OG_IMAGE,
  }));

/**
 * KTR durable content is intentionally date-independent for Facebook.
 * Dates are carried only as metadata; eligibility never filters on content age.
 * The pool includes published, indexable pillar articles, production-indexable
 * guides, and production-indexable issue guides. URL dedupe prevents the same
 * canonical page from entering twice when registries overlap.
 */
// A generic OG placeholder is not a suitable thumbnail for a news feed.
// Share only substantive pages that have their own specific editorial image.
export const KTR_DURABLE_FACEBOOK_GUIDES: DurableFacebookGuideCandidate[] = uniqueByUrl([
  ...pillarArticles,
  ...productionGuides,
  ...productionIssueGuides,
]).filter((guide) => guide.image_url !== DEFAULT_OG_IMAGE);


/**
 * Static URLs are not sufficient evidence that a guide can pass the database
 * Facebook article-image trigger. Only genuine, approved daily_articles
 * evergreen rows have the canonical featured-image record that the trigger
 * intentionally requires. Do NOT send legacy static ARTICLES slugs into this
 * publisher without a separately approved static-image provenance contract.
 */
export type PublishedFacebookEvergreenRow = {
  slug: string;
  title: string;
  category: string | null;
  kind: string | null;
  published_at: string;
  content_quality_score: number | null;
  quality_flags: string[] | null;
  image_generation_status: string | null;
  featured_image_url: string | null;
};

export function approvedPublishedEvergreen(
  row: PublishedFacebookEvergreenRow,
): DurableFacebookGuideCandidate | null {
  const flags = new Set(row.quality_flags ?? []);
  const image = row.featured_image_url?.trim() ?? "";
  if (row.kind !== "evergreen" || (row.content_quality_score ?? 0) < 90) return null;
  if (!/^[a-z0-9-]+$/.test(row.slug) || !row.title.trim()) return null;
  if (row.image_generation_status !== "ready" || !image || /\\/og\\/default\\.jpg(?:[?#]|$)/i.test(image)) return null;
  if (!flags.has("evergreen_authority") || !flags.has("editorial_reviewed") || !flags.has("primary_sources") || !flags.has("image_rights_verified")) return null;
  if (flags.has("chatgpt-admin-ignored") || flags.has("seo_noindex") || flags.has("seo_off_topic") || flags.has("legacy_url_restored") || flags.has("internal_repetition") || flags.has("seo_low_value_commodity")) return null;
  if (!(image.startsWith("https://") || image.startsWith("/api/public/article-image/"))) return null;
  return {
    slug: row.slug,
    title: row.title,
    category: row.category || "Government",
    kind: "evergreen-guide",
    source_pool: "published-evergreen",
    is_breaking: false,
    score: row.content_quality_score ?? 90,
    published_at: row.published_at,
    url: `${SITE_URL}/news/${row.slug}`,
    image_url: image,
  };
}
