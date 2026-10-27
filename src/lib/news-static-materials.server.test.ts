import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES, isPublished } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { selectStaticNewsMaterials, isStaticArticleDiscoverableForRelated } from "@/lib/news-static-materials.server";

describe("server-only static newsroom material selection", () => {
  it("preserves the actual authored body and its curated eligible related destinations", () => {
    const article = ARTICLES.find((item) =>
      isPublished(item) && isStaticArticleIndexable(item) && Boolean(ARTICLE_BODIES[item.slug]));
    expect(article).toBeDefined();
    if (!article) return;
    const materials = selectStaticNewsMaterials(article.slug, article.category);
    expect(materials.authoredBody).toEqual(ARTICLE_BODIES[article.slug]);
    expect(materials.relatedArticles.map((item) => item.slug)).toEqual(
      (ARTICLE_BODIES[article.slug]?.related ?? [])
        .map((slug) => ARTICLES.find((item) => item.slug === slug))
        .filter((item) => item && isStaticArticleDiscoverableForRelated(item))
        .map((item) => item!.slug),
    );
    expect(materials.relatedArticles.every((item) => isStaticArticleDiscoverableForRelated(item))).toBe(true);
  });

  it("never makes a default related link to an unpublished, thin, or bodyless story", () => {
    const materials = selectStaticNewsMaterials("missing-static-story-123", "Elections");
    expect(materials.authoredBody).toBeNull();
    expect(materials.defaultRelatedSlugs).toHaveLength(materials.relatedArticles.length);
    expect(materials.defaultRelatedSlugs.length).toBeLessThanOrEqual(3);
    expect(materials.relatedArticles.every((item) =>
      isPublished(item) && isStaticArticleIndexable(item) && Boolean(ARTICLE_BODIES[item.slug]))).toBe(true);
    expect(materials.relatedArticles.every((item) => item.slug !== "missing-static-story-123")).toBe(true);
  });
});
