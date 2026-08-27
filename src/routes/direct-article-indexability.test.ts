import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(new URL("./news.$slug.tsx", import.meta.url), "utf8");

describe("direct article static indexability", () => {
  it("marks retired static articles noindex on the direct article route", () => {
    expect(source).toContain('import { isStaticArticleIndexable } from "@/lib/static-article-indexability"');
    expect(source).toContain("noindex: !isStaticArticleIndexable(article)");
  });

  it("does not use retired or fallback-only static articles as related content", () => {
    expect(source).toContain("function isStaticArticleDiscoverableForRelated(article: Article)");
    expect(source).toContain(
      "isPublished(article) && isStaticArticleIndexable(article) && Boolean(ARTICLE_BODIES[article.slug])",
    );
    expect(source).toContain("x.category === ever.category && isStaticArticleDiscoverableForRelated(x)");
    expect(source).toContain("x.slug !== a.slug && isStaticArticleDiscoverableForRelated(x)");
    expect(source).toContain("Boolean(a) && isStaticArticleDiscoverableForRelated(a as Article)");
  });
});
