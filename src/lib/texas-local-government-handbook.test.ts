import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(new URL("../routes/issues/texas-local-government-handbook.tsx", import.meta.url), "utf8");
const hubSource = readFileSync(new URL("../routes/issues/index.tsx", import.meta.url), "utf8");
const sitemapSource = readFileSync(new URL("../routes/sitemap-pages[.]xml.ts", import.meta.url), "utf8");
const valueSource = readFileSync(new URL("./adsense-static-sitemap-value-classification.test.ts", import.meta.url), "utf8");

describe("Texas Local Government Handbook authority layer", () => {
  it("protects the nine local-government layers and primary-source framing", () => {
    expect((routeSource.match(/title: "/g) ?? []).length).toBeGreaterThanOrEqual(9);
    for (const token of [
      "Counties: arms of the state with limited authority",
      "home-rule and general-law",
      "School districts: separate governments",
      "MUDs and water districts",
      "PIDs: assessments",
      "Emergency services districts",
      "Appraisal districts are not the governments setting your tax rate",
      "Special districts: always ask what created it",
      "one address can sit under many governments",
      "Texas Constitution and Statutes",
      "Texas Comptroller — Special Purpose Districts",
      "Texas Commission on Environmental Quality",
      "Texas Education Agency",
    ]) {
      expect(routeSource).toContain(token);
    }
  });

  it("is discoverable from the Issues hub and sitemap", () => {
    expect(hubSource).toContain("/issues/texas-local-government-handbook");
    expect(hubSource).toContain("Texas Local Government Handbook");
    expect(sitemapSource).toContain("/issues/texas-local-government-handbook");
    expect(sitemapSource).toContain("LOCAL_GOVERNMENT_HANDBOOK_REFRESH");
  });

  it("retains explicit authority-reference value classification", () => {
    expect(valueSource).toContain('"/issues/texas-local-government-handbook"');
    expect(valueSource).toContain("authorityReference");
  });
});
