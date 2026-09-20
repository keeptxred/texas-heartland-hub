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
  source_pool: "pillar-articles" | "guides" | "issue-guides";
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
export const KTR_DURABLE_FACEBOOK_GUIDES: DurableFacebookGuideCandidate[] = uniqueByUrl([
  ...pillarArticles,
  ...productionGuides,
  ...productionIssueGuides,
]);
