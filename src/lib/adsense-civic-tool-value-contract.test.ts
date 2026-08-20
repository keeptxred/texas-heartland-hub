import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

const tools = [
  {
    path: "/civic-tools/government-authority-finder",
    file: "../routes/civic-tools.government-authority-finder.tsx",
    required: ["useState", "getGovernmentGraphLinks", "authority-query", "results.map"],
  },
  {
    path: "/civic-tools/texas-law-finder",
    file: "../routes/civic-tools.texas-law-finder.tsx",
    required: ["useState", "LAW_TOPICS", "scoreTopic", "law-query", "results.map"],
  },
  {
    path: "/civic-tools/bill-finder",
    file: "../routes/civic-tools.bill-finder.tsx",
    required: ["useState", "bill-issue", 'to="/bills"', "EMPTY_BILL_FILTERS"],
  },
  {
    path: "/civic-tools/compare-legislators",
    file: "../routes/civic-tools.compare-legislators.tsx",
    required: ["useState", "TEXAS_HOUSE_MEMBERS", "TEXAS_SENATE_MEMBERS", "<select", "RepCard"],
  },
] as const;

describe("AdSense civic-tool functional value contract", () => {
  it.each(tools)("keeps $path interactive and backed by maintained KTR data", ({ file, required }) => {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    expect(source).toContain("buildSeo");
    for (const marker of required) expect(source).toContain(marker);
  });

  it.each(tools)("keeps $path discoverable while its utility contract passes", ({ path }) => {
    expect(sitemapSource).toContain(`\"${path}\"`);
  });
});
