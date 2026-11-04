import { describe, expect, it } from "vitest";
import { ARTICLES } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import {
  articleMainWordCount,
  hasMeaningfulArticleStructure,
  hasValidArticleSources,
} from "@/lib/article-length";

const UPGRADED_GUIDES = [
  { slug: "how-texas-counties-spend", publishedAt: "2026-05-28T00:00:00" },
  { slug: "what-local-governments-control", publishedAt: "2026-05-27T20:00:00" },
] as const;

describe("Phase 2A reviewed local government guides", () => {
  for (const guide of UPGRADED_GUIDES) {
    it(`${guide.slug} keeps substantive, traceable public-service value`, () => {
      const body = ARTICLE_BODIES[guide.slug];
      const article = ARTICLES.find((row) => row.slug === guide.slug);
      expect(body).toBeDefined();
      expect(article).toBeDefined();
      // Original publication chronology is preserved; only the substantive
      // body update date changes after this verified editorial improvement.
      expect(article?.publishedAt).toBe(guide.publishedAt);
      expect(body.updated).toBe("2026-11-04");

      expect(articleMainWordCount(body)).toBeGreaterThanOrEqual(850);
      expect(hasMeaningfulArticleStructure(body)).toBe(true);
      expect(hasValidArticleSources(body)).toBe(true);
      expect(body.sections.length).toBeGreaterThanOrEqual(8);
      expect(body.sources.length).toBeGreaterThanOrEqual(4);
      expect(body.sources.some((source) => source.url.startsWith("https://statutes.capitol.texas.gov/"))).toBe(true);
      expect(body.sources.some((source) => source.url.startsWith("https://comptroller.texas.gov/"))).toBe(true);
    });
  }

  it("removes invented statewide county budget percentages and keeps actual-record methods", () => {
    const body = ARTICLE_BODIES["how-texas-counties-spend"];
    const text = body.intro.join(" ") + " " + body.sections.flatMap((section) =>
      [...(section.paragraphs ?? []), ...(section.bullets ?? [])],
    ).join(" ");
    expect(text).not.toContain("20-25%");
    expect(text).not.toContain("15-20%");
    expect(text).toContain("fiscal year");
    expect(text).toContain("adopted");
    expect(text).toContain("denominator");
  });
});
