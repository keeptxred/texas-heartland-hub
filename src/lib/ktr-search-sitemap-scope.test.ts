import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const evergreenSitemap = readFileSync(new URL("../routes/sitemap-evergreen[.]xml.ts", import.meta.url), "utf8");
const newsSitemap = readFileSync(new URL("../routes/sitemap-news[.]xml.ts", import.meta.url), "utf8");
const cloudIndexability = readFileSync(new URL("./article-indexability.functions.ts", import.meta.url), "utf8");

describe("KTR cross-site search surface scope", () => {
  it("applies canonical brand ownership to cloud indexing and both article sitemaps", () => {
    for (const source of [evergreenSitemap, newsSitemap, cloudIndexability]) {
      expect(source).toContain("isKeepTxRedSearchOwnedStory");
    }
  });

  it("does not advertise sports article kinds in the KTR Google News sitemap", () => {
    expect(newsSitemap).not.toContain('kind.startsWith("sports-")');
  });
});
