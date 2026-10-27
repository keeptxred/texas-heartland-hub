import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES, isPublished } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const route = fs.readFileSync(new URL("../routes/news.$slug.tsx", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("./news-static-materials.server.ts", import.meta.url), "utf8");
const fn = fs.readFileSync(new URL("./news-static-materials.functions.ts", import.meta.url), "utf8");

describe("static related article discovery", () => {
  it("keeps every currently indexable published static article backed by an explicit body", () => {
    const indexable = ARTICLES.filter(
      (article) => isPublished(article) && isStaticArticleIndexable(article),
    );
    expect(indexable.length).toBeGreaterThan(0);
    expect(indexable.every((article) => Boolean(ARTICLE_BODIES[article.slug]))).toBe(true);
  });

  it("requires an explicit body before a static article can be related discovery", () => {
    expect(server).toContain("function isStaticArticleDiscoverableForRelated(article: Article)");
    expect(server).toContain("isPublished(article) &&");
    expect(server).toContain("isStaticArticleIndexable(article) &&");
    expect(server).toContain("Boolean(ARTICLE_BODIES[article.slug])");
  });

  it("uses the substantive predicate for every related-static discovery path", () => {
    const calls = server.match(/isStaticArticleDiscoverableForRelated\(/g) ?? [];
    expect(calls.length).toBe(1); // predicate in one server-side eligibility filter
    expect(server).toContain("ARTICLES.filter(isStaticArticleDiscoverableForRelated)");
    expect(server).toContain("const relatedBySlug = new Map(eligibleArticles.map");
    expect(route).toContain("relatedArticles: materials.relatedArticles");
    expect(fn).toContain('await import("@/lib/news-static-materials.server")');
    expect(route).not.toContain('import { ARTICLE_BODIES');
    expect(route).not.toContain(
      "x.slug !== a.slug && isPublished(x) && isStaticArticleIndexable(x)",
    );
    expect(route).not.toContain(
      "Boolean(a) && isPublished(a as Article) && isStaticArticleIndexable(a as Article)",
    );
  });
});
