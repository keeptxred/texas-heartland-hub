import { createServerFn } from "@tanstack/react-start";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES, isPublished } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

/**
 * Lightweight server boundary for client-facing discovery surfaces.
 * Static metadata records may preserve historical URLs without being suitable
 * for search or prominent internal discovery. Only records with a substantive
 * authored body and an indexable static metadata classification are returned.
 */
export const getDiscoverableStaticArticleSlugs = createServerFn({ method: "GET" })
  .handler(async (): Promise<string[]> =>
    ARTICLES
      .filter((article) =>
        isPublished(article)
        && isStaticArticleIndexable(article)
        && Boolean(ARTICLE_BODIES[article.slug]),
      )
      .map((article) => article.slug),
  );
