import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES } from "@/data/articles";
import { articleMainWordCount, hasMeaningfulArticleStructure, hasValidArticleSources } from "@/lib/article-length";

const reviewed = [
  { slug: "texas-energy-policy-guide", publishedAt: "2026-05-27T17:00:00" },
  { slug: "how-a-bill-becomes-texas-law", publishedAt: "2026-06-19T13:00:00" },
] as const;

describe("Phase 2A protected civic authority guide repairs", () => {
  for (const { slug, publishedAt } of reviewed) {
    it(`${slug} preserves original publication and substantive traceable sources`, () => {
      const article = ARTICLES.find((row) => row.slug === slug);
      const body = ARTICLE_BODIES[slug];
      expect(article?.publishedAt).toBe(publishedAt);
      expect(body.updated).toBe("2026-11-04");
      expect(articleMainWordCount(body)).toBeGreaterThanOrEqual(950);
      expect(hasMeaningfulArticleStructure(body)).toBe(true);
      expect(hasValidArticleSources(body)).toBe(true);
      expect(body.sections.length).toBeGreaterThanOrEqual(9);
      expect(body.sources.length).toBeGreaterThanOrEqual(5);
      expect(body.faq.length).toBeGreaterThanOrEqual(4);
    });
  }

  it("does not claim ERCOT is beyond all federal reliability jurisdiction", () => {
    const text = JSON.stringify(ARTICLE_BODIES["texas-energy-policy-guide"]).toLowerCase();
    expect(text).not.toContain("federal regulators have no jurisdiction");
    expect(text).toContain("ferc");
    expect(text).toContain("nerc");
    expect(text).toContain("public utility commission");
    expect(ARTICLE_BODIES["texas-energy-policy-guide"].sources.some(
      (source) => source.url === "https://www.ercot.com/mktrules/compliance",
    )).toBe(true);
  });

  it("does not portray hearings or conference committees as universal requirements", () => {
    const text = JSON.stringify(ARTICLE_BODIES["how-a-bill-becomes-texas-law"]).toLowerCase();
    expect(text).not.toContain("the path every texas bill takes");
    expect(text).toContain("not every");
    expect(text).toContain("texas legislature online");
    expect(ARTICLE_BODIES["how-a-bill-becomes-texas-law"].sources.some(
      (source) => source.url === "https://capitol.texas.gov/resources/FollowABill.aspx",
    )).toBe(true);
  });
});
