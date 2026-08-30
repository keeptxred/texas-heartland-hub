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
    "/texas-politics/republic-of-texas-government-history", "/texas-politics/presidents-of-republic-of-texas",
    "/texas-politics/congress-of-republic-of-texas", "/texas-politics/constitution-of-1836-republic-of-texas",
    "/texas-politics/republic-of-texas-capitals-government-seats", "/texas-politics/republic-of-texas-diplomacy-recognition",
    "/texas-politics/texas-annexation-statehood-history", "/texas-politics/republic-of-texas-debt-finance",
    "/texas-politics/republic-to-state-government-transition",
    "/texas-politics/texas-secession-convention-1861", "/texas-politics/constitution-of-1861-texas",
    "/texas-politics/texas-government-during-civil-war", "/texas-politics/texas-reconstruction-government",
    "/texas-politics/constitution-of-1866-texas", "/texas-politics/constitution-of-1869-texas",
    "/texas-politics/texas-constitutional-convention-1875",
    "/texas-politics/texas-democratic-dominance-1876-1952", "/texas-politics/texas-populist-progressive-era",
    "/texas-politics/ferguson-era-texas-politics", "/texas-politics/texas-white-primary-history",
    "/texas-politics/texas-new-deal-politics", "/texas-politics/texas-civil-rights-era-politics",
    "/texas-politics/texas-political-geography-history", "/texas-politics/texas-urban-suburban-rural-politics-history",
    "/texas-politics/south-texas-rio-grande-valley-political-history", "/texas-politics/texas-metro-regional-realignment-history",
    "/texas-government/texas-government-history", "/texas-government/texas-legislature-history",
    "/texas-government/governor-history", "/texas-government/lieutenant-governor-history",
    "/texas-government/speaker-of-the-house-history", "/texas-government/texas-supreme-court-history",
    "/texas-government/court-of-criminal-appeals-history", "/texas-government/judicial-selection-elections",
    "/texas-government/texas-county-government-history", "/texas-government/commissioners-court-history",
    "/texas-government/county-judge-history", "/texas-government/county-commissioner-history",
    "/texas-government/county-sheriff-history", "/texas-government/county-district-clerk-history",
    "/texas-government/tax-assessor-collector-history", "/texas-government/justice-of-the-peace-constable-history",
    "/texas-government/texas-municipal-government-history", "/texas-government/home-rule-general-law-cities-history",
    "/texas-government/mayor-city-council-history", "/texas-government/city-manager-government-history",
    "/texas-government/texas-municipal-courts-history", "/texas-government/texas-special-district-government-history",
    "/texas-government/municipal-elections-representation-history", "/texas-government/municipal-finance-tax-debt-history",
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
      "/texas-politics/republic-of-texas-government-history",
      "/texas-politics/presidents-of-republic-of-texas",
      "/texas-politics/congress-of-republic-of-texas",
      "/texas-politics/constitution-of-1836-republic-of-texas",
      "/texas-politics/republic-of-texas-capitals-government-seats",
      "/texas-politics/republic-of-texas-diplomacy-recognition",
      "/texas-politics/texas-annexation-statehood-history",
      "/texas-politics/republic-of-texas-debt-finance",
      "/texas-politics/republic-to-state-government-transition",
      "/texas-politics/texas-secession-convention-1861",
      "/texas-politics/constitution-of-1861-texas",
      "/texas-politics/texas-government-during-civil-war",
      "/texas-politics/texas-reconstruction-government",
      "/texas-politics/constitution-of-1866-texas",
      "/texas-politics/constitution-of-1869-texas",
      "/texas-politics/texas-constitutional-convention-1875",
      "/texas-politics/texas-democratic-dominance-1876-1952",
      "/texas-politics/texas-populist-progressive-era",
      "/texas-politics/ferguson-era-texas-politics",
      "/texas-politics/texas-white-primary-history",
      "/texas-politics/texas-new-deal-politics",
      "/texas-politics/texas-civil-rights-era-politics",
      "/texas-politics/texas-political-geography-history",
      "/texas-politics/texas-urban-suburban-rural-politics-history",
      "/texas-politics/south-texas-rio-grande-valley-political-history",
      "/texas-politics/texas-metro-regional-realignment-history",
      "/texas-government/texas-government-history",
      "/texas-government/texas-legislature-history",
      "/texas-government/governor-history",
      "/texas-government/lieutenant-governor-history",
      "/texas-government/speaker-of-the-house-history",
      "/texas-government/texas-supreme-court-history",
      "/texas-government/court-of-criminal-appeals-history",
      "/texas-government/judicial-selection-elections",
      "/texas-government/texas-county-government-history",
      "/texas-government/commissioners-court-history",
      "/texas-government/county-judge-history",
      "/texas-government/county-commissioner-history",
      "/texas-government/county-sheriff-history",
      "/texas-government/county-district-clerk-history",
      "/texas-government/tax-assessor-collector-history",
      "/texas-government/justice-of-the-peace-constable-history",
      "/texas-government/texas-municipal-government-history",
      "/texas-government/home-rule-general-law-cities-history",
      "/texas-government/mayor-city-council-history",
      "/texas-government/city-manager-government-history",
      "/texas-government/texas-municipal-courts-history",
      "/texas-government/texas-special-district-government-history",
      "/texas-government/municipal-elections-representation-history",
      "/texas-government/municipal-finance-tax-debt-history",
    ]));
  });

  it("does not allow dynamic guides to bypass readiness through STATIC_PATHS", () => {
    expect(staticPathsFromSitemapSource().filter((path) => path.startsWith("/guides/"))).toEqual([]);
    expect(sitemapSource).toContain("...INDEXABLE_GUIDES.map((guide)=>`/guides/${guide.slug}`)");
    expect(sitemapSource).toContain("Object.values(ALL_GUIDES).filter(isSupportingGuideIndexable)");
  });
});