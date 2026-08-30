import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const deployWorkflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");
const smokeScript = readFileSync("scripts/seo/verify-deployed-laws-routes.py", "utf8");

describe("deployed law routes production gate", () => {
  it("runs the law-route smoke inside the verified Cloudflare deployment", () => {
    expect(deployWorkflow).toContain("- name: Verify deployed law route ownership, H1s, and canonicals");
    expect(deployWorkflow).toContain("run: python3 scripts/seo/verify-deployed-laws-routes.py");
    expect(deployWorkflow).toContain("SITE_URL: ${{ env.PREVIEW_URL }}");

    const deployIndex = deployWorkflow.indexOf("- name: Deploy verified revision");
    const smokeIndex = deployWorkflow.indexOf("- name: Verify deployed law route ownership, H1s, and canonicals");
    const authorityIndex = deployWorkflow.indexOf("- name: Verify authority reference endpoints");

    expect(deployIndex).toBeGreaterThanOrEqual(0);
    expect(smokeIndex).toBeGreaterThan(deployIndex);
    expect(authorityIndex).toBeGreaterThan(smokeIndex);

    const smokeStep = deployWorkflow.slice(smokeIndex, authorityIndex);
    expect(smokeStep).not.toContain("continue-on-error: true");
  });

  it("covers the hub, all three child hubs, and a dynamic law topic", () => {
    for (const route of [
      "/laws",
      "/laws/constitutional-amendments",
      "/laws/effective-dates",
      "/laws/topics",
      "/laws/topic/property-tax-law",
    ]) {
      expect(smokeScript).toContain(route);
    }

    for (const h1 of [
      "Texas Constitutional Amendments Tracker",
      "Texas Laws Taking Effect in 2026",
      "Texas Law Library",
      "Texas Property Tax Law Explained",
    ]) {
      expect(smokeScript).toContain(h1);
    }

    expect(smokeScript).toContain("child route is still rendering the /laws parent H1");
    expect(smokeScript).toContain("https://keeptxred.com/laws/topic/property-tax-law");
    expect(smokeScript).toContain("cache-control: no-cache");
  });
});
