import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES } from "@/data/articles";
import { articleMainWordCount, hasMeaningfulArticleStructure, hasValidArticleSources } from "@/lib/article-length";

describe("Phase 2A — Texas school board civic authority recovery", () => {
  const slug = "texas-school-board-powers";
  const body = ARTICLE_BODIES[slug];

  it("keeps the historical publication and authentic substantive revision date", () => {
    const meta = ARTICLES.find((a) => a.slug === slug);
    expect(meta?.publishedAt).toBe("2026-05-27T16:00:00");
    expect(meta?.date).toBe("May 27, 2026");
    expect(body.updated).toBe("2026-11-04");
  });

  it("has substantial distinct civic research value and verifiable primary law", () => {
    expect(articleMainWordCount(body)).toBeGreaterThanOrEqual(900);
    expect(hasMeaningfulArticleStructure(body)).toBe(true);
    expect(hasValidArticleSources(body)).toBe(true);
    expect(body.sections.length).toBeGreaterThanOrEqual(8);
    expect(body.sources.length).toBeGreaterThanOrEqual(6);
    expect(body.sources.some(s => s.url === "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.11.htm")).toBe(true);
    expect(body.sources.some(s => s.url.includes("elections/laws/changing-election-dates"))).toBe(true);
    expect(body.sources.some(s => s.url.includes("tea2.tea.texas.gov"))).toBe(true);
  });

  it("does not assert universal May elections, seven trustees, or invented turnout", () => {
    const text = JSON.stringify(body).toLowerCase();
    expect(text).not.toContain("elected by a fraction of the turnout");
    expect(text).not.toContain("turnout often falls below 5%");
    expect(text).not.toContain("a seven-member board");
    expect(text).toContain("not every");
    expect(text).toContain("superintendent");
    expect(text).toContain("joint");
    expect(text).toContain("texas education code");
  });
});