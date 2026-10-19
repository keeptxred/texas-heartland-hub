import { describe, expect, it } from "vitest";
import { RESERVE_ARTICLES } from "@/data/reserve-articles";
import { articleMainWordCount, INGESTED_MIN_MAIN_WORDS } from "@/lib/article-length";
import { scoreQuality } from "@/lib/content-quality";

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

  it("retains substantive relevance and clears the image-backed Facebook quality threshold", () => {
    for (const article of RESERVE_ARTICLES) {
      const sections = article.body.sections ?? [];
      const why = sections.find((section) => section.heading === "Why This Matters");
      expect(why, article.key).toBeDefined();
      expect((why?.paragraphs ?? []).length, article.key).toBeGreaterThanOrEqual(2);
      expect((why?.paragraphs ?? []).join(" ").split(/\\s+/).length, article.key).toBeGreaterThanOrEqual(65);

      const body = { ...article.body, updated: "2026-10-19" };
      const quality = scoreQuality({
        slug: `2026-10-19-${article.slugStem}`,
        title: article.title,
        dek: article.dek,
        author: "Keep TX Red Editorial Staff",
        published_at: "2026-10-19T00:00:00Z",
        image_url: "/api/public/article-image/example.jpg",
        kind: "ingested",
        body_json: body,
      });
      expect(quality.flags, article.key).not.toContain("missing_why_this_matters");
      expect(quality.score, article.key).toBeGreaterThanOrEqual(72);
    }
  });

});
