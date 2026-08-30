import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES } from "@/data/texas-post-reconstruction-progressive-authority";

const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const valueClassificationSource = readFileSync(new URL("./adsense-static-sitemap-value-classification.test.ts", import.meta.url), "utf8");

describe("Phase 8 sitemap authority coverage", () => {
  it("registers every Phase 8 canonical in the static pages sitemap", () => {
    for (const page of TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES) {
      expect(sitemapSource, page.slug).toContain(`\"/texas-politics/${page.slug}\"`);
    }
  });

  it("requires every Phase 8 canonical to be classified as an authority reference", () => {
    for (const page of TEXAS_POST_RECONSTRUCTION_PROGRESSIVE_AUTHORITY_PAGES) {
      expect(valueClassificationSource, page.slug).toContain(`\"/texas-politics/${page.slug}\"`);
    }
  });
});
