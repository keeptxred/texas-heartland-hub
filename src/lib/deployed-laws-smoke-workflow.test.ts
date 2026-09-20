import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROPERTY_TAX_LAW_TOPIC } from "@/data/law-topic-property-tax-authority";

const workflow = readFileSync(".github/workflows/verify-laws-after-deploy.yml", "utf8");
const productionDeploy = readFileSync(".github/workflows/deploy-cloudflare-production.yml", "utf8");
const runtimeVerifier = readFileSync("scripts/verify-deployed-laws-runtime.py", "utf8");
const lawRouteContract = readFileSync("scripts/seo/deployed-laws-route-contract.json", "utf8");
const parsedLawRouteContract = JSON.parse(lawRouteContract) as {
  parentH1: string;
  checks: Array<{ path: string; h1: string; canonical: string; exactH1: boolean; forbidParent: boolean }>;
};

describe("deployed laws route smoke workflow", () => {
  it("keeps the standalone smoke available after either recognized Cloudflare deployment", () => {
    expect(workflow).toContain('"Deploy verified KeepTXRed to Cloudflare"');
    expect(workflow).toContain('"Deploy KeepTXRed to Cloudflare Workers"');
    expect(workflow).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(workflow).toContain("https://keeptxred-site.freddy-coppola.workers.dev");
    expect(workflow).toContain("uses: actions/checkout@v5");
    expect(workflow).toContain("run: python3 scripts/verify-deployed-laws-runtime.py");
  });

  it("gates the real production deployment on the reusable laws runtime verifier", () => {
    const edgeGate = productionDeploy.indexOf("Verify promoted Worker health and production edge route");
    const lawsGate = productionDeploy.indexOf("Verify deployed law route ownership, H1s, and canonicals");

    expect(edgeGate).toBeGreaterThanOrEqual(0);
    expect(lawsGate).toBeGreaterThan(edgeGate);
    expect(productionDeploy).toContain("SITE_URL: ${{ steps.deploy.outputs.preview_url }}");
    expect(productionDeploy).toContain("run: python3 scripts/verify-deployed-laws-runtime.py");
    expect(productionDeploy).toContain("inputs.activate_custom_domain == true");
  });

  it("loads one shared contract for the hub, child routes, and dynamic topic route", () => {
    expect(runtimeVerifier).toContain("deployed-laws-route-contract.json");
    expect(runtimeVerifier).toContain('CONTRACT["parentH1"]');
    expect(runtimeVerifier).toContain('for check in CONTRACT["checks"]');

    for (const marker of [
      "/laws",
      "/laws/constitutional-amendments",
      "/laws/effective-dates",
      "/laws/topics",
      "/laws/topic/property-tax-law",
      "Texas Constitutional Amendments Tracker",
      "Texas Laws Taking Effect in 2026",
      "Texas Law Library",
      "Texas Property Tax Policy & Law",
      "https://keeptxred.com/laws/topic/property-tax-law",
    ]) {
      expect(lawRouteContract).toContain(marker);
    }

    expect(runtimeVerifier).toContain("child route is still rendering the /laws parent H1");
  });

  it("keeps the property-tax deployment H1 synchronized with the law-topic owner", () => {
    const propertyTaxCheck = parsedLawRouteContract.checks.find(
      (check) => check.path === "/laws/topic/property-tax-law",
    );
    expect(propertyTaxCheck).toBeTruthy();
    expect(propertyTaxCheck?.h1).toBe(PROPERTY_TAX_LAW_TOPIC.title);
    expect(propertyTaxCheck?.canonical).toBe("https://keeptxred.com/laws/topic/property-tax-law");
    expect(propertyTaxCheck?.exactH1).toBe(true);
  });

  it("keeps route expectations out of the standalone workflow copy", () => {
    expect(workflow).not.toContain("Texas Property Tax Policy & Law");
    expect(workflow).not.toContain("/laws/topic/property-tax-law");
    expect(workflow).not.toContain("class PageParser");
  });
});
