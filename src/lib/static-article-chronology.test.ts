import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES, isPublished } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

describe("static article chronology", () => {
  it("never exposes an Updated date earlier than Published on indexable articles", () => {
    const violations = ARTICLES
      .filter((article) => isPublished(article) && isStaticArticleIndexable(article))
      .flatMap((article) => {
        const body = ARTICLE_BODIES[article.slug];
        if (!body?.updated) return [];
        const published = new Date(article.publishedAt).getTime();
        const updated = new Date(body.updated).getTime();
        if (!Number.isFinite(published) || !Number.isFinite(updated) || updated >= published) return [];
        return [`${article.slug}: published=${article.publishedAt} updated=${body.updated}`];
      });

    expect(violations, violations.join("\n")).toEqual([]);
  });
});
