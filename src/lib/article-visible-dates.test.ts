import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES, isPublished } from "@/data/articles";
import { visibleArticleDates } from "@/lib/article-visible-dates";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

describe("visible article chronology", () => {
  it("shows Updated only when it is genuinely later than Published", () => {
    expect(visibleArticleDates("2026-06-27T10:00:00-05:00", "2026-06-27").updatedIso).toBeNull();
    expect(visibleArticleDates("2026-06-27T10:00:00-05:00", "2026-06-26").updatedIso).toBeNull();
    expect(visibleArticleDates("2026-06-27T10:00:00-05:00", "2026-08-19").updatedIso).not.toBeNull();
  });

  it("makes every indexable static article safe for reader-facing chronology", () => {
    const violations = ARTICLES
      .filter((article) => isPublished(article) && isStaticArticleIndexable(article))
      .flatMap((article) => {
        const body = ARTICLE_BODIES[article.slug];
        if (!body?.updated) return [];
        const visible = visibleArticleDates(article.publishedAt, body.updated);
        if (!visible.updatedIso) return [];
        return new Date(visible.updatedIso).getTime() > new Date(visible.publishedIso).getTime()
          ? []
          : [article.slug];
      });
    expect(violations).toEqual([]);
  });
});
