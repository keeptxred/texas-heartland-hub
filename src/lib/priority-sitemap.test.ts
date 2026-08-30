import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  PRIORITY_SITEMAP_PATHS,
  isValidPrioritySitemapPath,
} from "./priority-sitemap";

const requiredPriorityPaths = [
  "/",
  "/laws",
  "/news",
  "/texas-politics",
  "/texas-legislature",
  "/bills",
  "/data",
  "/policy",
  "/texas-economy",
  "/elections/2026",
  "/elections/candidates",
  "/elections/statewide",
  "/elections/legislative",
  "/elections/districts",
  "/elections/races",
  "/elections/voting",
  "/news/texas-election-laws-explained",
  "/news/texas-property-tax-laws-explained",
  "/news/texas-gun-laws-explained",
  "/news/texas-new-laws-2026",
] as const;

const tracker = JSON.parse(
  readFileSync("src/data/search-console-priority-urls.json", "utf8"),
) as { siteUrl: string; maxUrls: number; urls: string[] };

describe("priority sitemap crawl-budget contract", () => {
  it("stays intentionally small", () => {
    expect(PRIORITY_SITEMAP_PATHS.length).toBeGreaterThanOrEqual(20);
    expect(PRIORITY_SITEMAP_PATHS.length).toBeLessThanOrEqual(30);
  });

  it("contains only unique canonical-style paths", () => {
    expect(new Set(PRIORITY_SITEMAP_PATHS).size).toBe(PRIORITY_SITEMAP_PATHS.length);
    for (const path of PRIORITY_SITEMAP_PATHS) {
      expect(isValidPrioritySitemapPath(path)).toBe(true);
    }
  });

  it("keeps the core law, government, policy and election crawl spine present", () => {
    for (const path of requiredPriorityPaths) {
      expect(PRIORITY_SITEMAP_PATHS).toContain(path);
    }
  });

  it("keeps the repository Search Console priority inventory in lockstep", () => {
    const expected = PRIORITY_SITEMAP_PATHS.map((path) =>
      path === "/" ? `${tracker.siteUrl}/` : `${tracker.siteUrl}${path}`,
    );
    expect(tracker.maxUrls).toBeGreaterThanOrEqual(expected.length);
    expect(tracker.urls).toEqual(expected);
  });

  it("rejects low-value or unresolved inventory shapes", () => {
    for (const path of [
      "/search?q=texas",
      "/tag/elections",
      "/category/politics",
      "/elections/candidates/$candidateSlug",
      "/elections/races/%24raceSlug",
      "/laws/",
    ]) {
      expect(isValidPrioritySitemapPath(path)).toBe(false);
    }
  });
});
