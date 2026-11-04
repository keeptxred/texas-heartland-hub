import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES } from "@/data/articles";
import { articleMainWordCount, hasMeaningfulArticleStructure, hasValidArticleSources } from "@/lib/article-length";

const reviewed = [
  { slug: "texas-governor-powers", publishedAt: "2026-06-26T13:00:00" },
  { slug: "texas-attorney-general-powers", publishedAt: "2026-06-26T12:00:00" },
] as const;

describe("Phase 2A — Texas executive authority guides", () => {
  for (const { slug, publishedAt } of reviewed) {
    it(`${slug} preserves publication history and contains checkable original civic value`, () => {
      const article = ARTICLES.find((row) => row.slug === slug);
      const body = ARTICLE_BODIES[slug];
      expect(article?.publishedAt).toBe(publishedAt);
      expect(body.updated).toBe("2026-11-04");
      expect(articleMainWordCount(body)).toBeGreaterThanOrEqual(950);
      expect(hasMeaningfulArticleStructure(body)).toBe(true);
      expect(hasValidArticleSources(body)).toBe(true);
      expect(body.sections.length).toBeGreaterThanOrEqual(8);
      expect(body.sources.length).toBeGreaterThanOrEqual(5);
      expect(body.sources.some(s => s.url === "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.4.htm")).toBe(true);
    });
  }

  it("distinguishes constitutional appointments, appropriations veto and disaster statutes", () => {
    const guide = ARTICLE_BODIES["texas-governor-powers"];
    const bodyText = JSON.stringify(guide).toLowerCase();
    expect(bodyText).toContain("senate");
    expect(bodyText).toContain("appropriation");
    expect(bodyText).toContain("418");
    expect(bodyText).not.toContain("1,500 appointments per term");
    expect(guide.sources.some(s => s.url === "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.418.htm")).toBe(true);
  });

  it("does not mistake attorney general opinions for binding statutes or unlimited prosecutions", () => {
    const guide = ARTICLE_BODIES["texas-attorney-general-powers"];
    const bodyText = JSON.stringify(guide).toLowerCase();
    expect(bodyText).not.toContain("issue binding legal opinions");
    expect(bodyText).not.toContain("binding guidance for state officials");
    expect(bodyText).toContain("cannot create");
    expect(bodyText).toContain("local");
    expect(bodyText).toContain("visitation");
    expect(guide.sources.some(s => s.url === "https://www.texasattorneygeneral.gov/attorney-general-opinions")).toBe(true);
  });
});