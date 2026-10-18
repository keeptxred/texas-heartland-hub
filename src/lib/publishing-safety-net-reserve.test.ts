import { describe, expect, it } from "vitest";
import { RESERVE_ARTICLES } from "@/data/reserve-articles";
import { articleMainWordCount, INGESTED_MIN_MAIN_WORDS } from "@/lib/article-length";

describe("publishing safety-net reserve inventory", () => {
  it("keeps a replenished set of unique, publication-ready reserve stories", () => {
    expect(RESERVE_ARTICLES.length).toBeGreaterThanOrEqual(6);

    const keys = RESERVE_ARTICLES.map((article) => article.key);
    const slugStems = RESERVE_ARTICLES.map((article) => article.slugStem);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(slugStems).size).toBe(slugStems.length);

    for (const article of RESERVE_ARTICLES) {
      expect(article.title.trim().length).toBeGreaterThan(20);
      expect(article.dek.trim().length).toBeGreaterThan(60);
      expect(articleMainWordCount({ ...article.body, updated: "2026-01-01" })).toBeGreaterThanOrEqual(
        INGESTED_MIN_MAIN_WORDS,
      );
      expect(article.body.sources.length).toBeGreaterThanOrEqual(2);
      for (const source of article.body.sources) {
        expect(source.url).toMatch(/^https:\/\//);
      }
    }
  });
});
