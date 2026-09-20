import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES } from "./texas-political-geography-authority";

const sitemap = readFileSync(new URL("../routes/sitemap-political-geography[.]xml.ts", import.meta.url), "utf8");
const sitemapIndex = readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");

describe("political geography sitemap ownership", () => {
  it("advertises the dedicated primary child sitemap", () => {
    expect(sitemapIndex).toContain('"sitemap-political-geography.xml"');
  });

  it("derives every geography URL from the authority registry", () => {
    expect(sitemap).toContain("TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES.map");
    expect(sitemap).toContain("/texas-politics/${page.slug}");
    expect(TEXAS_POLITICAL_GEOGRAPHY_AUTHORITY_PAGES).toHaveLength(4);
  });
});
