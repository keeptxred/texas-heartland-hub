import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(HERE, "sitemap[.]xml.ts"), "utf8");

const advertised = [
  "sitemap-priority.xml",
  "sitemap-pages.xml",
  "sitemap-sources.xml",
  "sitemap-news.xml",
  "sitemap-evergreen.xml",
  "sitemap-elections.xml",
  "sitemap-government.xml",
  "sitemap-political-figures.xml",
  "sitemap-legislature.xml",
  "sitemap-committees.xml",
  "sitemap-authors.xml",
  "sitemap-products.xml",
  "sitemap-images.xml",
] as const;

describe("root sitemap availability contract", () => {
  it("advertises the approved child sitemap set", () => {
    for (const file of advertised) expect(source).toContain(`\"${file}\"`);
  });

  it("does not make optional runtime service calls before returning the index", () => {
    for (const forbidden of [
      "listSitemapArticles",
      "getProducts",
      "getPublishedAuthorArticles",
      "listSitemapArticles()",
      "getProducts()",
      "getPublishedAuthorArticles()",
    ]) {
      expect(source).not.toContain(forbidden);
    }
  });

  it("keeps bulk crawl-budget sitemaps out of the advertised index", () => {
    for (const suppressed of [
      "sitemap-districts.xml",
      "sitemap-representatives.xml",
      "sitemap-bills.xml",
    ]) {
      expect(source).not.toContain(`\"${suppressed}\"`);
    }
  });
});
