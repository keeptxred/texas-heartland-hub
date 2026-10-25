import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { VERIFIED_ADDITIONAL_RESERVE_ARTICLES } from "@/data/reserve-articles-verified-2026";
import { RESERVE_ARTICLES } from "@/data/reserve-articles";
import { articleMainWordCount, INGESTED_MIN_MAIN_WORDS } from "@/lib/article-length";

describe("official-record-backed Texas election civic-reference reserve", () => {
  it("replenishes the exact existing 24-hour guarded reserve, not a new publisher", () => {
    const keys = new Set(RESERVE_ARTICLES.map(a => a.key));
    expect(keys.has("texas-election-canvass")).toBe(true);
    expect(keys.has("texas-campaign-finance-search")).toBe(true);
    expect(VERIFIED_ADDITIONAL_RESERVE_ARTICLES).toHaveLength(2);
    const publisher = readFileSync("src/routes/api/public/hooks/publishing-safety-net.ts", "utf8");
    expect(publisher).toContain("RESERVE_ARTICLES.filter");
    expect(publisher).toContain(".slice(0, 2)");
    expect(publisher).toContain("if (!preparedImage.ok || !preparedImage.url || !preparedImage.imageValidationNote)");
    expect(publisher).toContain("reserve_article_publications");
  });

  it("retains substantial source-backed explanations, not invented race projections", () => {
    for (const article of VERIFIED_ADDITIONAL_RESERVE_ARTICLES) {
      expect(articleMainWordCount({ ...article.body, updated: "2026-10-25" })).toBeGreaterThanOrEqual(INGESTED_MIN_MAIN_WORDS);
      expect(article.body.sections?.find(s => s.heading === "Why This Matters")?.paragraphs?.length ?? 0).toBeGreaterThanOrEqual(2);
      expect(article.body.sources.length).toBeGreaterThanOrEqual(3);
      expect(article.body.sources.every(x => x.url.startsWith("https://"))).toBe(true);
      expect(article.body.faq.length).toBeGreaterThanOrEqual(3);
      expect(article.title).not.toMatch(/prediction|who will win|endorsement/i);
    }
  });

  it("grounds the materials in actual Texas Election Code and Ethics Commission records", () => {
    const canvass = VERIFIED_ADDITIONAL_RESERVE_ARTICLES.find(a => a.key === "texas-election-canvass");
    const finance = VERIFIED_ADDITIONAL_RESERVE_ARTICLES.find(a => a.key === "texas-campaign-finance-search");
    expect(canvass?.body.sources.map(x => x.url)).toContain("https://statutes.capitol.texas.gov/Docs/EL/htm/EL.67.htm");
    expect(canvass?.body.sources.map(x => x.url)).toContain("https://statutes.capitol.texas.gov/Docs/EL/htm/EL.212.htm");
    expect(finance?.body.sources.map(x => x.url)).toContain("https://webservices.ethics.state.tx.us/search/cf/index.php");
    expect(finance?.body.sources.map(x => x.url)).toContain("https://statutes.capitol.texas.gov/Docs/EL/htm/EL.254.htm");
  });

  it("uses subject-matched illustrative images with no fabricated candidates or election results", () => {
    const imageWriter = readFileSync("src/lib/featured-image.functions.ts", "utf8");
    expect(imageWriter).toContain('row.slug.endsWith("-how-texas-election-results-are-canvassed-and-certified")');
    expect(imageWriter).toContain('row.slug.endsWith("-how-to-search-texas-campaign-finance-reports")');
    expect(imageWriter).toContain("No invented vote totals");
    expect(imageWriter).toContain("No politicians, parties, campaign colors");
    expect(imageWriter).toContain("reserveCanvass ?? reserveCampaignFinance");
  });
});
