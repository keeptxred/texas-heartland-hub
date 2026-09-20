import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");

const TRUTHFUL_STATIC_LASTMODS = [
  ["ISSUES_HUB_REFRESH", "2026-08-27T20:21:48Z", "/issues"],
  ["TOOLS_HUB_REFRESH", "2026-08-27T12:57:29Z", "/tools"],
  ["SPENDING_GROWTH_CAP_REFRESH", "2026-08-19T20:37:09Z", "/tools/texas-spending-growth-cap"],
  ["TAX_STRUCTURE_COMPARISON_REFRESH", "2026-08-19T20:37:09Z", "/tools/texas-tax-structure-comparison"],
  ["RAINY_DAY_FUND_REFRESH", "2026-08-19T22:13:49Z", "/tools/texas-rainy-day-fund"],
  ["BUDGET_HEADROOM_REFRESH", "2026-08-19T22:28:36Z", "/tools/texas-budget-headroom"],
] as const;

describe("static sitemap lastmod", () => {
  it("uses the verified modification timestamp for each issue/tool static route", () => {
    for (const [constant, timestamp, path] of TRUTHFUL_STATIC_LASTMODS) {
      expect(sitemapSource).toContain(`const ${constant} = toIsoDate("${timestamp}");`);
      expect(sitemapSource).toContain(`"${path}": ${constant}`);
    }
  });

  it("does not blanket-refresh the issue and fiscal-tool routes", () => {
    for (const [, , path] of TRUTHFUL_STATIC_LASTMODS) {
      expect(sitemapSource).not.toContain(`"${path}": ISSUE_GUIDE_REFRESH`);
    }
  });

  it("keeps the legacy issue-guide refresh scoped away from the corrected route cohort", () => {
    expect(sitemapSource).toContain('const ISSUE_GUIDE_REFRESH = toIsoDate("2026-08-19T13:15:00-05:00");');
    expect(sitemapSource).toContain('"/issues/texas-policy-handbook": HANDBOOK_REFRESH');
  });
});
