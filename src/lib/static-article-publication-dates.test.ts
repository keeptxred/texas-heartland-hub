import { describe, expect, it } from "vitest";
import { ARTICLES } from "@/data/articles";

describe("static news publication chronology", () => {
  it("uses each preserved original publication date instead of stale relative copy", () => {
    expect(ARTICLES.length).toBeGreaterThan(0);
    for (const article of ARTICLES) {
      const originalDate = article.publishedAt.slice(0, 10);
      const parsed = new Date(`${originalDate}T12:00:00Z`);
      expect(Number.isNaN(parsed.getTime()), article.slug).toBe(false);
      const formatted = parsed.toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
      });
      expect(article.date, article.slug).toBe(formatted);
    }
  });
});
