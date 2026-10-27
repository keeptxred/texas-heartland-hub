import { ARTICLE_BODIES, type ArticleBody } from "@/data/article-bodies";
import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

/** Only explicitly backed, indexable published stories can receive related links. */
export function isStaticArticleDiscoverableForRelated(article: Article): boolean {
  return isPublished(article) &&
    isStaticArticleIndexable(article) &&
    Boolean(ARTICLE_BODIES[article.slug]);
}

export type StaticNewsMaterials = {
  authoredBody: ArticleBody | null;
  defaultRelatedSlugs: string[];
  relatedArticles: Article[];
};

/**
 * Complete body registry is never needed by all-page route initialization.
 * Return only the requested article and its actual eligible related articles.
 * This preserves existing server-rendered links and fallback-only noindex rules.
 */
export function selectStaticNewsMaterials(slug: string, category: string): StaticNewsMaterials {
  const authoredBody = ARTICLE_BODIES[slug] ?? null;
  const eligibleArticles = ARTICLES.filter(isStaticArticleDiscoverableForRelated);
  const defaultRelatedSlugs = eligibleArticles
    .filter((article) => article.category === category && article.slug !== slug)
    .sort(sortByDateDesc)
    .slice(0, 3)
    .map((article) => article.slug);

  const requestedRelatedSlugs = authoredBody ? authoredBody.related : defaultRelatedSlugs;
  const relatedBySlug = new Map(eligibleArticles.map((article) => [article.slug, article]));
  const relatedArticles = requestedRelatedSlugs
    .map((relatedSlug) => relatedBySlug.get(relatedSlug))
    .filter((article): article is Article => Boolean(article));

  return { authoredBody, defaultRelatedSlugs, relatedArticles };
}
