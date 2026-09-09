import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const route = readFileSync(new URL("../routes/about-keep-texas-red.tsx", import.meta.url), "utf8");
const pagesSitemap = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const indexabilityGuard = readFileSync(new URL("../../scripts/seo/validate-indexability.mjs", import.meta.url), "utf8");

describe("legacy Keep Texas Red About URL consolidation", () => {
  it("permanently redirects the duplicate About URL to the canonical About page", () => {
    expect(route).toContain('createFileRoute("/about-keep-texas-red")');
    expect(route).toContain('href: `/about${location.searchStr || ""}`');
    expect(route).toContain("statusCode: 301");
    expect(route).not.toContain('rel: "canonical"');
  });

  it("keeps the duplicate About URL out of primary sitemap ownership", () => {
    expect(pagesSitemap).not.toContain('"/about-keep-texas-red"');
    expect(indexabilityGuard).toContain('"/about-keep-texas-red"');
  });
});
