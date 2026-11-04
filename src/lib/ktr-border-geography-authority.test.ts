import { describe, expect, it } from "vitest";
import { ARTICLES } from "@/data/articles";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { articleMainWordCount, hasMeaningfulArticleStructure, hasValidArticleSources } from "@/lib/article-length";

describe("Phase 2A Texas border geography authority", () => {
  const slug = "texas-border-geography-101";
  const body = ARTICLE_BODIES[slug];

  it("preserves the historical publication and a genuine substantive revision date", () => {
    const meta = ARTICLES.find(article => article.slug === slug);
    expect(meta?.publishedAt).toBe("2026-05-27T21:00:00");
    expect(meta?.date).toBe("May 27, 2026");
    expect(body.updated).toBe("2026-11-04");
  });

  it("provides substantial original verification guidance based on official sources", () => {
    expect(articleMainWordCount(body)).toBeGreaterThanOrEqual(900);
    expect(hasMeaningfulArticleStructure(body)).toBe(true);
    expect(hasValidArticleSources(body)).toBe(true);
    expect(body.sections.length).toBeGreaterThanOrEqual(8);
    expect(body.sources.length).toBeGreaterThanOrEqual(5);
    expect(body.sources.some(source => source.url === "https://www.ibwc.gov/about-us/")).toBe(true);
    expect(body.sources.some(source => source.url.includes("cbp.gov/border-security"))).toBe(true);
    expect(body.sources.some(source => source.url.includes("comptroller.texas.gov/economy/economic-data/ports"))).toBe(true);
  });

  it("does not publish unsupported static barrier percentages or river safety claims", () => {
    const t = JSON.stringify(body).toLowerCase();
    expect(t).not.toContain("roughly a third of the texas border has");
    expect(t).not.toContain("often walkable in dry months");
    expect(t).not.toContain("the busiest commercial truck crossing in the hemisphere");
    expect(t).toContain("office of field operations");
    expect(t).toContain("2024");
    expect(t).toContain("new mexico");
    expect(t).toContain("treat");
  });
});