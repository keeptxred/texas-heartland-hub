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

  it("keeps the standalone competitiveness guide in the child sitemap with its September 25 lastmod", () => {
    expect(sitemap).toContain(
      'const COMPETITIVENESS_LASTMOD = toIsoDate("2026-09-25T07:00:00-05:00")',
    );
    expect(sitemap).toContain(
      'loc: `${BASE_URL}/texas-politics/why-texas-is-politically-competitive`',
    );
    expect(sitemap).toContain("lastmod: COMPETITIVENESS_LASTMOD");
  });
});
