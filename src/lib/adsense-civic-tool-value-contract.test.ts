import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const civicToolsHubSource = readFileSync(new URL("../routes/civic-tools.tsx", import.meta.url), "utf8");
const policyToolsHubSource = readFileSync(new URL("../routes/tools/index.tsx", import.meta.url), "utf8");

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
  {
    path: "/tools/texas-spending-growth-cap",
    file: "../routes/tools/texas-spending-growth-cap.tsx",
    required: ["useState", "useMemo", "benchmarkSpending", "proposedSpending", '"@type": "WebApplication"'],
  },
  {
    path: "/tools/texas-tax-structure-comparison",
    file: "../routes/tools/texas-tax-structure-comparison.tsx",
    required: ["useState", "useMemo", "hypotheticalIncomeTax", "enteredCurrentTaxes", '"@type": "WebApplication"'],
  },
  {
    path: "/tools/texas-rainy-day-fund",
    file: "../routes/tools/texas-rainy-day-fund.tsx",
    required: ["useState", "useMemo", "calculateRainyDayFundScenario", "STATE_BUDGET_METRICS", '"@type": "WebApplication"'],
  },
  {
    path: "/tools/texas-budget-headroom",
    file: "../routes/tools/texas-budget-headroom.tsx",
    required: ["useState", "useMemo", "calculateBudgetHeadroomScenario", "STATE_BUDGET_METRICS", '"@type": "WebApplication"'],
  },
] as const;

describe("AdSense functional tool value contract", () => {
  it.each(tools)("keeps $path interactive and backed by maintained logic or data", ({ file, required }) => {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    for (const marker of required) expect(source).toContain(marker);
  });

  it.each(tools)("keeps $path discoverable while its utility contract passes", ({ path }) => {
    expect(sitemapSource).toContain(`\"${path}\"`);
  });

  it("keeps civic and policy tool hubs mutually discoverable", () => {
    expect(civicToolsHubSource).toContain('to="/tools"');
    expect(policyToolsHubSource).toContain('to="/civic-tools"');
  });
});