import { describe, expect, it } from "vitest";
import { getPrioritySitemapPaths, MAX_SEARCH_CONSOLE_PRIORITY_URLS } from "@/lib/priority-sitemap";

const UPDATED_ISSUE_GUIDES = [
  "/issues/texas-gun-laws",
  "/issues/texas-medical-transition-minors-law",
  "/issues/texas-bail-criminal-justice",
  "/issues/texas-rural-healthcare",
  "/issues/texas-local-preemption-home-rule",
] as const;

const RETIRED_ZERO_SIGNAL_BILLS = [
  "/bills/texas/89/hb/37",
  "/bills/texas/89/hb/119",
  "/bills/texas/89/hb/261",
  "/bills/texas/89/sb/13",
  "/bills/texas/89/sb/1253",
] as const;

describe("Search Console priority sitemap authority allocation", () => {
  it("keeps the overlay bounded at exactly 30 canonical URLs", () => {
    const paths = getPrioritySitemapPaths();
    expect(paths).toHaveLength(MAX_SEARCH_CONSOLE_PRIORITY_URLS);
    expect(new Set(paths).size).toBe(MAX_SEARCH_CONSOLE_PRIORITY_URLS);
  });

  it("prioritizes the five September 3 current-law issue guides", () => {
    const paths = getPrioritySitemapPaths();
    for (const path of UPDATED_ISSUE_GUIDES) expect(paths).toContain(path);
  });

  it("does not spend priority slots on the five zero-crawl bill details", () => {
    const paths = getPrioritySitemapPaths();
    for (const path of RETIRED_ZERO_SIGNAL_BILLS) expect(paths).not.toContain(path);
  });
});
