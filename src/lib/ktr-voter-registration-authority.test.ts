import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/article-bodies";
import { ARTICLES } from "@/data/articles";
import { articleMainWordCount, hasMeaningfulArticleStructure, hasValidArticleSources } from "@/lib/article-length";

describe("Phase 2A Texas voter registration authority", () => {
  const slug = "texas-voter-registration-guide";
  const body = ARTICLE_BODIES[slug];

  it("preserves the actual 2026 publication date and records the factual revision", () => {
    const meta = ARTICLES.find(article => article.slug === slug);
    expect(meta?.publishedAt).toBe("2026-05-27T19:00:00");
    expect(meta?.date).toBe("May 27, 2026");
    expect(body.updated).toBe("2026-11-05");
  });

  it("offers a structured primary-source civic reference rather than an abbreviated ID list", () => {
    expect(hasMeaningfulArticleStructure(body)).toBe(true);
    expect(hasValidArticleSources(body)).toBe(true);
    expect(articleMainWordCount(body)).toBeGreaterThanOrEqual(800);
    expect(body.sections.length).toBeGreaterThanOrEqual(8);
    expect(body.sources.length).toBeGreaterThanOrEqual(7);
    expect(body.sources.some(source => source.url.includes("EL.13.htm"))).toBe(true);
    expect(body.sources.some(source => source.url.includes("/voting/need-id"))).toBe(true);
    expect(body.sources.some(source => source.url.includes("advisory2026-21"))).toBe(true);
  });

  it("does not misstate the mail deadline, online registration, county moves or photo ID", () => {
    const s = JSON.stringify(body).toLowerCase();
    expect(s).not.toContain("must be received by the county voter registrar at least 30");
    expect(s).not.toContain("must mail or hand-deliver a paper application");
    expect(s).toContain("postmark");
    expect(s).toContain("october 5, 2026");
    expect(s).toContain("17 years and 10 months");
    expect(s).toContain("reasonable impediment declaration");
    expect(s).toContain("limited ballot");
    expect(s).toContain("driver-license");
    expect(s).toContain("texas.gov");
  });
});
