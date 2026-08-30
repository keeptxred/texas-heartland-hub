import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

const VALUE_CLASSES = {
  collectionOrNavigation: [
    "/", "/news", "/happening-now", "/keep-texas-red",
    "/houston", "/texas-sports", "/texas-business",
    "/texas-legislature", "/texas-legislature/house", "/texas-legislature/senate", "/texas-legislature/sessions",
    "/texas-government", "/texas-government/agencies", "/districts", "/representatives",
    "/get-involved", "/laws", "/laws/topics", "/data", "/civic-tools", "/topics", "/issues", "/tools",
    "/texas-politics", "/texas-political-reference", "/policy", "/texas-economy", "/texas-border-security", "/texas-energy",
    "/texas-agriculture", "/texas-veterans", "/texas-law-enforcement", "/texas-case", "/texas-case/facts", "/authors", "/shop",
  ],
  functionalTool: [
    "/civic-tools/government-authority-finder", "/civic-tools/texas-law-finder", "/civic-tools/bill-finder", "/civic-tools/compare-legislators",
    "/tools/texas-spending-growth-cap", "/tools/texas-tax-structure-comparison", "/tools/texas-rainy-day-fund", "/tools/texas-budget-headroom",
  ],
  authorityReference: [
    "/texas-legislature/current-session", "/texas-legislature/votes", "/register-to-vote", "/contact-legislators", "/county-elections",
    "/laws/constitutional-amendments", "/laws/effective-dates", "/glossary", "/citation-guide", "/issues/texas-policy-handbook",
    "/issues/texas-government-accountability-handbook", "/issues/texas-local-government-handbook",
    "/texas-politics/texas-constitutional-history", "/texas-politics/texas-election-history",
    "/texas-politics/texas-redistricting-history", "/texas-politics/voting-rights-history",
  ],
  trustOrCommerce: [
    "/about", "/contact", "/privacy", "/terms-of-service", "/shipping-policy", "/return-refund-policy", "/editorial-standards",
  ],
} as const;

function staticPathsFromSitemapSource() {
  const match = sitemapSource.match(/const STATIC_PATHS:string\[\]=\[([\s\S]*?)\];/);
  if (!match) throw new Error("Could not locate STATIC_PATHS in sitemap-pages.xml source");
  return [...match[1].matchAll(/"([^"\n]+)"/g)].map((item) => item[1]);
}

describe("AdSense static sitemap value classification", () => {
  it("requires every static sitemap URL to have exactly one explicit value rationale", () => {
    const sitemapPaths = staticPathsFromSitemapSource().sort();
    const classified = Object.values(VALUE_CLASSES).flat();
    expect(new Set(classified).size, "duplicate path across value classes").toBe(classified.length);
    expect([...classified].sort()).toEqual(sitemapPaths);
  });

  it("keeps functional tools separate from prose-depth gates", () => {
    expect(VALUE_CLASSES.functionalTool).toHaveLength(8);
    expect(VALUE_CLASSES.functionalTool).toContain("/civic-tools/government-authority-finder");
    expect(VALUE_CLASSES.functionalTool).toContain("/tools/texas-budget-headroom");
  });

  it("keeps high-stakes civic/reference pages in the authority class", () => {
    expect(VALUE_CLASSES.authorityReference).toEqual(expect.arrayContaining([
      "/register-to-vote",
      "/contact-legislators",
      "/county-elections",
      "/laws/constitutional-amendments",
      "/laws/effective-dates",
      "/issues/texas-policy-handbook",
      "/issues/texas-government-accountability-handbook",
      "/issues/texas-local-government-handbook",
      "/texas-politics/texas-constitutional-history",
      "/texas-politics/texas-election-history",
      "/texas-politics/texas-redistricting-history",
      "/texas-politics/voting-rights-history",
    ]));
  });

  it("does not allow dynamic guides to bypass readiness through STATIC_PATHS", () => {
    expect(staticPathsFromSitemapSource().filter((path) => path.startsWith("/guides/"))).toEqual([]);
    expect(sitemapSource).toContain("...INDEXABLE_GUIDES.map((guide)=>`/guides/${guide.slug}`)");
    expect(sitemapSource).toContain("Object.values(ALL_GUIDES).filter(isSupportingGuideIndexable)");
  });
});
