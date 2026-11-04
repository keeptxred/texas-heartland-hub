import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import priorityUrls from "../data/search-console-priority-sitemap-urls.json";
import { getPrioritySitemapPaths } from "./priority-sitemap";

const retiredSitemap = readFileSync(new URL("../routes/sitemap-elections[.]xml.ts", import.meta.url), "utf8");
const sitemapIndex = readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");

describe("retired public Election Central sitemap policy", () => {
  it("withdraws the old election child feed from the sitemap index", () => {
    expect(sitemapIndex).toContain('ELECTION_FEATURE_FLAGS.homepagePromotion ? ["sitemap-elections.xml"] : []');
    expect(retiredSitemap).toContain("ELECTION_FEATURE_FLAGS.homepagePromotion ? PRIORITY_ELECTION_PATHS : []");
  });

  it("keeps the priority sitemap full and free of retired election paths", () => {
    const urls = getPrioritySitemapPaths();
    expect(urls).toHaveLength(30);
    expect(new Set(urls).size).toBe(30);
    expect(priorityUrls).toHaveLength(30);
    expect(urls.every((path) => !path.startsWith("/elections/"))).toBe(true);
  });
});
