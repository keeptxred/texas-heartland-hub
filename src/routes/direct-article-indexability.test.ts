import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./news.$slug.tsx", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../lib/news-static-materials.server.ts", import.meta.url), "utf8");

describe("direct article static indexability", () => {
  it("marks retired static articles noindex on the direct article route", () => {
    expect(source).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(source).toContain("noindex: !isStaticArticleIndexable(article)");
  });

  it("does not use retired or fallback-only static articles as related content", () => {
    expect(server).toContain("function isStaticArticleDiscoverableForRelated(article: Article)");
    expect(server).toContain("isPublished(article) &&");
    expect(server).toContain("isStaticArticleIndexable(article) &&");
    expect(server).toContain("Boolean(ARTICLE_BODIES[article.slug])");
    expect(source).toContain("related: materials.defaultRelatedSlugs");
    expect(server).toContain("eligibleArticles");
    expect(server).toContain("article.slug !== slug");
    expect(source).toContain("relatedArticles: materials.relatedArticles");
    expect(source).not.toContain('import { ARTICLE_BODIES');
  });
});
