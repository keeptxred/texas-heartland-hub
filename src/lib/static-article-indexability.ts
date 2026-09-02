import { ARTICLES, type Article } from "@/data/articles";
import { isExplicitlyRetiredStaticSlug } from "@/lib/retired-static-news";

const RETIRED_CONTENT_CATEGORIES = new Set([
  "relocation",
  "housing",
  "financial",
  "cost-of-living",
  "history",
  "culture",
  "lifestyle",
  "sports",
]);

const RETIRED_DISPLAY_CATEGORIES = new Set([
  "Sports",
  "Sports Culture",
  "Culture & Identity",
]);

export function isStaticArticleIndexable(
  article: Pick<Article, "slug" | "pillar" | "contentCategory" | "category">,
): boolean {
  if (isExplicitlyRetiredStaticSlug(article.slug)) return false;
  if (article.contentCategory && RETIRED_CONTENT_CATEGORIES.has(article.contentCategory)) return false;
  if (RETIRED_DISPLAY_CATEGORIES.has(article.category)) return false;
  return true;
}

export function isRetiredStaticNewsPath(path: string): boolean {
  const match = path.match(/^\/news\/([^/?#]+)$/);
  if (!match) return false;
  const slug = decodeURIComponent(match[1]);
  const article = ARTICLES.find((candidate) => candidate.slug === slug);
  if (article) return !isStaticArticleIndexable(article);
  return isExplicitlyRetiredStaticSlug(slug);
}
