import { describe, expect, it } from "vitest";
import { ARTICLES } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { articleMainWordCount, hasMeaningfulArticleStructure, hasValidArticleSources } from "@/lib/article-length";

const vetted = [
  { slug: "texas-school-finance-explained", publishedAt: "2026-05-27T22:00:00" },
  { slug: "texas-political-terminology", publishedAt: "2026-05-27T23:00:00" },
] as const;

describe("Phase 2A — school-finance and legislative-term source recovery", () => {
  for (const { slug, publishedAt } of vetted) {
    it(`${slug} preserves historical dates and provides independently usable research`, () => {
      const article = ARTICLES.find(item => item.slug === slug);
      const body = ARTICLE_BODIES[slug];
      expect(article?.publishedAt).toBe(publishedAt);
      expect(body.updated).toBe("2026-11-04");
      expect(articleMainWordCount(body)).toBeGreaterThanOrEqual(950);
      expect(hasMeaningfulArticleStructure(body)).toBe(true);
      expect(hasValidArticleSources(body)).toBe(true);
      expect(body.sections.length).toBeGreaterThanOrEqual(9);
      expect(body.sources.length).toBeGreaterThanOrEqual(5);
    });
  }

  it("does not publish unsupported statewide recapture amount claims", () => {
    const body = ARTICLE_BODIES["texas-school-finance-explained"];
    const text = JSON.stringify(body).toLowerCase();
    expect(text).not.toContain("recapture now exceeds $5 billion");
    expect(text).toContain("summary of finances");
    expect(text).toContain("average daily attendance");
    expect(text).toContain("recapture");
    expect(body.sources.some(source => source.url === "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.48.htm")).toBe(true);
    expect(body.sources.some(source => source.url === "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.49.htm")).toBe(true);
  });

  it("distinguishes committee action from enactment and election-night reporting from canvass", () => {
    const body = ARTICLE_BODIES["texas-political-terminology"];
    const text = JSON.stringify(body).toLowerCase();
    expect(text).toContain("not a law");
    expect(text).toContain("committee substitute");
    expect(text).toContain("canvass");
    expect(text).toContain("sunset");
    expect(body.sources.some(source => source.url === "https://tlc.texas.gov/glossary")).toBe(true);
    expect(body.sources.some(source => source.url === "https://www.sos.state.tx.us/elections/laws/glossary.shtml")).toBe(true);
  });
});