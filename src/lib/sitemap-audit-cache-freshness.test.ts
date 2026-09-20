import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("../../scripts/ci/audit-sitemap-page-indexability.mjs", import.meta.url),
  "utf8",
);

describe("sitemap production audit cache freshness", () => {
  it("cache-busts sitemap XML fetches per workflow revision", () => {
    expect(source).toContain('const SITEMAP_CACHE_BUSTER = process.env.GITHUB_SHA');
    expect(source).toContain('url.searchParams.set("__ktr_sitemap_audit", SITEMAP_CACHE_BUSTER)');
    expect(source).toContain('fetchManual(freshSitemapUrl(sitemapUrl), "application/xml');
  });

  it("continues auditing canonical page URLs without cache-busting them", () => {
    expect(source).toContain('fetchManual(url, "text/html,application/xhtml+xml');
    expect(source).not.toContain('fetchManual(freshSitemapUrl(url), "text/html');
  });
});
