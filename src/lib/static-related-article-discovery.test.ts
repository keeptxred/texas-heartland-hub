import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES, isPublished } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const route = fs.readFileSync(new URL("../routes/news.$slug.tsx", import.meta.url), "utf8");

describe("static related article discovery", () => {
  it("has indexable static metadata that still lacks an explicit substantive body", () => {
    const fallbackOnly = ARTICLES.filter(
      (article) => isPublished(article) && isStaticArticleIndexable(article) && !ARTICLE_BODIES[article.slug],
    );
    expect(fallbackOnly.length).toBeGreaterThan(0);
  });

  it("requires an explicit body before a static article can be related discovery", () => {
    expect(route).toContain("function isStaticArticleDiscoverableForRelated(article: Article)");
    expect(route).toContain(
      "isPublished(article) && isStaticArticleIndexable(article) && Boolean(ARTICLE_BODIES[article.slug])",
    );
  });

  it("uses the substantive predicate for every related-static discovery path", () => {
    const calls = route.match(/isStaticArticleDiscoverableForRelated\(/g) ?? [];
    expect(calls.length).toBe(4); // definition + cloud list + fallback list + final render filter
    expect(route).not.toContain(
      "x.slug !== a.slug && isPublished(x) && isStaticArticleIndexable(x)",
    );
    expect(route).not.toContain(
      "Boolean(a) && isPublished(a as Article) && isStaticArticleIndexable(a as Article)",
    );
  });
});
