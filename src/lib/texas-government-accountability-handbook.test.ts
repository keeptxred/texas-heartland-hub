import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(new URL("../routes/issues/texas-government-accountability-handbook.tsx", import.meta.url), "utf8");
const hubSource = readFileSync(new URL("../routes/issues/index.tsx", import.meta.url), "utf8");
const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const valueSource = readFileSync(new URL("./adsense-static-sitemap-value-classification.test.ts", import.meta.url), "utf8");

describe("Texas Government Accountability Handbook authority layer", () => {
  it("protects the eight accountability chapters and primary-source method", () => {
    expect((routeSource.match(/title: "/g) ?? []).length).toBeGreaterThanOrEqual(8);
    for (const token of [
      "Texas Public Information Act",
      "Texas Open Meetings Act",
      "Budgets and spending",
      "Contracts and procurement",
      "Campaign finance and ethics",
      "Audits, inspectors and oversight",
      "Build the chronology before assigning blame",
      "Texas Attorney General Open Government",
      "Texas Ethics Commission",
      "Texas Comptroller Transparency",
      "Texas State Auditor",
    ]) {
      expect(routeSource).toContain(token);
    }
  });

  it("is discoverable from the Issues hub and sitemap", () => {
    expect(hubSource).toContain("/issues/texas-government-accountability-handbook");
    expect(hubSource).toContain("Government Accountability Handbook");
    expect(sitemapSource).toContain("/issues/texas-government-accountability-handbook");
    expect(sitemapSource).toContain("ACCOUNTABILITY_HANDBOOK_REFRESH");
  });

  it("retains explicit authority-reference value classification", () => {
    expect(valueSource).toContain('"/issues/texas-government-accountability-handbook"');
    expect(valueSource).toContain("authorityReference");
  });
});
