import { describe, expect, it } from "vitest";
import { getPrioritySitemapPaths, MAX_SEARCH_CONSOLE_PRIORITY_URLS } from "./priority-sitemap";

const paths = getPrioritySitemapPaths();

describe("priority sitemap inventory", () => {
  it("keeps the Search Console priority feed intentionally small and unique", () => {
    expect(paths).toHaveLength(MAX_SEARCH_CONSOLE_PRIORITY_URLS);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("contains only canonical KeepTXRed paths", () => {
    for (const path of paths) {
      expect(`https://keeptxred.com${path}`).toMatch(/^https:\/\/keeptxred\.com\//);
      expect(path).not.toContain("?");
      expect(path).not.toContain("#");
    }
  });

  it("keeps the highest-priority authority surfaces represented", () => {
    expect(paths).toContain("/");
    expect(paths).toContain("/elections");
    expect(paths).toContain("/texas-legislature/votes");
    expect(paths).toContain("/fact-checks/state");
  });
});
