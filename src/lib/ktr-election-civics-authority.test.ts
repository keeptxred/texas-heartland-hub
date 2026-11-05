import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES } from "@/data/articles";
import { articleMainWordCount, hasMeaningfulArticleStructure, hasValidArticleSources } from "@/lib/article-length";

describe("Phase 2A Texas election civic reference repairs", () => {
  const guideSlugs = ["primary-vs-general-election", "beginners-guide-texas-elections"] as const;

  it.each(guideSlugs)("preserves %s historical publication while recording substantive revision", slug => {
    const meta = ARTICLES.find(article => article.slug === slug);
    expect(meta?.publishedAt).toBe(slug === "primary-vs-general-election" ? "2026-06-12T13:00:00" : "2026-05-27T15:00:00");
    expect(meta?.date).toBe(slug === "primary-vs-general-election" ? "June 12, 2026" : "May 27, 2026");
    expect(ARTICLE_BODIES[slug].updated).toBe("2026-11-05");
  });

  it.each(guideSlugs)("%s is substantive and grounded in multiple official sources", slug => {
    const body = ARTICLE_BODIES[slug];
    expect(hasMeaningfulArticleStructure(body)).toBe(true);
    expect(hasValidArticleSources(body)).toBe(true);
    expect(articleMainWordCount(body)).toBeGreaterThanOrEqual(800);
    expect(body.sections.length).toBeGreaterThanOrEqual(8);
    expect(body.sources.length).toBeGreaterThanOrEqual(7);
    expect(body.sources.every(source => source.url.startsWith("https://"))).toBe(true);
    expect(body.sources.some(source => source.url.includes("sos.state.tx.us"))).toBe(true);
    expect(body.sources.some(source => source.url.includes("statutes.capitol.texas.gov"))).toBe(true);
  });

  it("correctly distinguishes primary affiliation, majority nomination and general election", () => {
    const s = JSON.stringify(ARTICLE_BODIES["primary-vs-general-election"]).toLowerCase();
    expect(s).toContain("majority");
    expect(s).toContain("december 31");
    expect(s).toContain("may 26, 2026");
    expect(s).toContain("general election determines");
    expect(s).not.toContain("november general election is a formality");
    expect(s).not.toContain("runoff turnout is typically a third");
  });

  it("keeps local May election dates and runoff rules distinct and removes unsupported motives", () => {
    const s = JSON.stringify(ARTICLE_BODIES["beginners-guide-texas-elections"]).toLowerCase();
    expect(s).toContain("june 13");
    expect(s).toContain("december 12");
    expect(s).toContain("may 26");
    expect(s).toContain("sample ballot");
    expect(s).not.toContain("most pick may to depress turnout");
    expect(JSON.stringify(ARTICLE_BODIES).toLowerCase()).not.toContain("november general is often a formality");
  });
});
