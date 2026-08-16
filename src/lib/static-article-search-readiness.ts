import { ARTICLE_BODIES } from "@/data/article-bodies";
import type { Article } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

/**
 * Static registry entries are sometimes metadata-only placeholders. The public
 * article route can render those entries with a generic fallback body so the
 * URL remains usable, but that fallback is not editorial content Google should
 * index. Only static articles with an authored body are search-ready.
 *
 * This is intentionally separate from static-article-indexability.ts because
 * the global SEO helper imports the lightweight retirement policy. Keeping the
 * body registry out of that module avoids pulling the large static body fixture
 * into every page's SEO dependency graph.
 */
export function hasAuthoredStaticArticleBody(slug: string): boolean {
  return Boolean(ARTICLE_BODIES[slug]);
}

export function isStaticArticleSearchReady(
  article: Pick<Article, "slug" | "pillar" | "contentCategory">,
): boolean {
  return isStaticArticleIndexable(article) && hasAuthoredStaticArticleBody(article.slug);
}
