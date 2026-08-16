import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES, isPublished } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

export function currentStaticMetadataShellSlugs(): string[] {
  return ARTICLES
    .filter((article) => isPublished(article) && isStaticArticleIndexable(article) && !ARTICLE_BODIES[article.slug])
    .map((article) => article.slug)
    .sort();
}

describe("static metadata shell audit", () => {
  it("reports the exact metadata-only search inventory for the generated guard", () => {
    const slugs = currentStaticMetadataShellSlugs();
    console.log(`STATIC_METADATA_SHELL_SLUGS=${JSON.stringify(slugs)}`);
    expect(slugs.length).toBeGreaterThan(0);
  });
});
