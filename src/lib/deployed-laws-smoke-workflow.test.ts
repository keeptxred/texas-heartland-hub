import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/verify-laws-after-deploy.yml", "utf8");
const productionDeploy = readFileSync(".github/workflows/deploy-cloudflare-production.yml", "utf8");
const runtimeVerifier = readFileSync("scripts/verify-deployed-laws-runtime.py", "utf8");

describe("deployed laws route smoke workflow", () => {
  it("keeps the standalone smoke available after either recognized Cloudflare deployment", () => {
    expect(workflow).toContain('"Deploy verified KeepTXRed to Cloudflare"');
    expect(workflow).toContain('"Deploy KeepTXRed to Cloudflare Workers"');
    expect(workflow).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(workflow).toContain("https://keeptxred-site.freddy-coppola.workers.dev");
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

  it("guards the laws hub, child routes, and a dynamic topic route", () => {
    const required = [
      '("/laws", PARENT_H1',
      "/laws/constitutional-amendments",
      "/laws/effective-dates",
      "/laws/topics",
      "/laws/topic/property-tax-law",
      "Texas Constitutional Amendments Tracker",
      "Texas Laws Taking Effect in 2026",
      "Texas Law Library",
      "Texas Property Tax Law Explained",
    ];

    for (const marker of required) expect(runtimeVerifier).toContain(marker);
    expect(runtimeVerifier).toContain("child route is still rendering the /laws parent H1");
  });

  it("requires canonical production URLs for every runtime-checked route", () => {
    for (const canonical of [
      "https://keeptxred.com/laws",
      "https://keeptxred.com/laws/constitutional-amendments",
      "https://keeptxred.com/laws/effective-dates",
      "https://keeptxred.com/laws/topics",
      "https://keeptxred.com/laws/topic/property-tax-law",
    ]) {
      expect(runtimeVerifier).toContain(canonical);
    }
  });
});
