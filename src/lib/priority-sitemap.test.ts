import { describe, expect, it } from "vitest";
import priorityUrls from "../data/search-console-priority-sitemap-urls.json";
import { getPrioritySitemapPaths, MAX_SEARCH_CONSOLE_PRIORITY_URLS } from "./priority-sitemap";

const paths = getPrioritySitemapPaths();
const sourcePaths = priorityUrls.map((value) => new URL(value).pathname.replace(/\/+$/, "") || "/");

describe("priority sitemap inventory", () => {
  it("keeps the Search Console priority feed intentionally small and unique", () => {
    expect(paths).toHaveLength(MAX_SEARCH_CONSOLE_PRIORITY_URLS);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("keeps the source inventory canonical instead of silently filtering aliases", () => {
    expect(sourcePaths).toEqual(paths);
  });

  it("contains only canonical KeepTXRed paths", () => {
    for (const path of paths) {
      expect(`https://keeptxred.com${path}`).toMatch(/^https:\/\/keeptxred\.com\//);
      expect(path).not.toContain("?");
      expect(path).not.toContain("#");
      expect(path).not.toMatch(/^\/texas-(?:house|senate)\//);
      expect(path).not.toMatch(/^\/fact-checks(?:\/|$)/);
    }

    expect(paths).not.toContain("/elections");
    expect(paths).not.toContain("/elections/polls/methodology");
    expect(paths).not.toContain("/bills/capital-punishment");
    expect(paths).not.toContain("/texas-legislature/cross-party-scorecard");
  });

  it("uses the canonical bill detail route contract", () => {
    const billPaths = paths.filter((path) => /^\/bills\/texas\//.test(path));
    expect(billPaths.length).toBeGreaterThan(0);
    for (const path of billPaths) {
      expect(path).toMatch(/^\/bills\/texas\/\d+\/[a-z]+\/\d+$/);
    }
  });

  it("keeps the highest-priority authority surfaces represented", () => {
    for (const path of [
      "/",
      "/elections/2026",
      "/elections/candidates",
      "/elections/methodology",
      "/texas-legislature",
      "/texas-legislature/votes",
      "/texas-legislature/current-session",
      "/bills",
      "/laws",
      "/policy",
      "/texas-politics",
      "/texas-government",
    ]) {
      expect(paths).toContain(path);
    }
  });
});
