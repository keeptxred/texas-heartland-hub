import { ARTICLES, type Article } from "@/data/articles";

const RETIRED_CONTENT_CATEGORIES = new Set([
  "relocation",
  "housing",
  "financial",
  "cost-of-living",
  "lifestyle",
]);

const RETIRED_STATIC_SLUGS = new Set([
  "texas-stock-tank-plunge-pools-guide",
  "texas-food-cities-dominating-food-network",
  "texas-high-school-football-prospect-peyton-houser",
]);

/**
 * Static articles predate the current newsroom quality gate. Keep civic,
 * election, legal, tax, policy, history and pillar explainers indexable while
 * retiring the legacy lifestyle/relocation/home-finance inventory that dilutes
 * Keep TX Red's current Texas politics and public-policy focus.
 */
export function isStaticArticleIndexable(article: Pick<Article, "slug" | "pillar" | "contentCategory">): boolean {
  if (article.pillar) return true;
  if (article.slug.startsWith("live-")) return false;
  if (article.contentCategory && RETIRED_CONTENT_CATEGORIES.has(article.contentCategory)) return false;
  if (RETIRED_STATIC_SLUGS.has(article.slug)) return false;
  return true;
}

export function isRetiredStaticNewsPath(path: string): boolean {
  const match = path.match(/^\/news\/([^/?#]+)$/);
  if (!match) return false;
  const slug = decodeURIComponent(match[1]);
  const article = ARTICLES.find((candidate) => candidate.slug === slug);
  if (article) return !isStaticArticleIndexable(article);
  return slug.startsWith("live-");
}
