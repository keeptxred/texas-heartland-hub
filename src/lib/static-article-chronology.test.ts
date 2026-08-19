import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES, isPublished } from "@/data/articles";
import { dedupeArticleBody } from "@/lib/article-dedupe";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

function calendarDay(value: string): string | null {
  const day = value.slice(0, 10);
  return ISO_DAY.test(day) ? day : null;
}

describe("static article chronology", () => {
  it("never exposes an Updated date earlier than Published on indexable articles", () => {
    const violations = ARTICLES
      .filter((article) => isPublished(article) && isStaticArticleIndexable(article))
      .flatMap((article) => {
        const rawBody = ARTICLE_BODIES[article.slug];
        if (!rawBody) return [];

        // Audit the same reviewed/deduped body the public article renderer uses,
        // not stale legacy registry metadata that may be replaced at render time.
        const body = dedupeArticleBody(rawBody);
        if (!body?.updated) return [];

        // `updated` is intentionally a calendar date while `publishedAt` carries
        // a time. Compare days so a same-day update is not treated as occurring
        // before a noon publication merely because date-only parsing means 00:00.
        const publishedDay = calendarDay(article.publishedAt);
        const updatedDay = calendarDay(body.updated);
        if (!publishedDay || !updatedDay || updatedDay >= publishedDay) return [];

        return [`${article.slug}: published=${article.publishedAt} updated=${body.updated}`];
      });

    expect(violations, violations.join("\n")).toEqual([]);
  });
});
