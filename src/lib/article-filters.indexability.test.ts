import { describe, expect, it } from "vitest";
import { ARTICLES } from "@/data/articles";
import { filterArticlesByCategory, getRelatedArticles } from "@/lib/article-filters";

const RETIRED = new Set([
  "voter-id-surge",
  "speaker-special-session",
  "school-board-elections",
  "property-tax-relief-package",
  "operation-lone-star",
  "permian-energy",
  "isd-tax-burdens",
]);

describe("topical static discovery indexability", () => {
  it("filters retired static inventory out of topic results", () => {
    for (const topic of ["elections", "energy", "policy", "property-taxes", "schools"]) {
      const slugs = filterArticlesByCategory(ARTICLES, topic).map((article) => article.slug);
      expect(slugs.some((slug) => RETIRED.has(slug)), topic).toBe(false);
    }
  });

  it("filters retired static inventory out of related-story recommendations", () => {
    const slugs = getRelatedArticles("texas-voting-guide-2026", undefined, 200).map((article) => article.slug);
    expect(slugs.some((slug) => RETIRED.has(slug))).toBe(false);
  });
});
