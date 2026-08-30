import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/verify-laws-after-deploy.yml", "utf8");

describe("deployed laws route smoke workflow", () => {
  it("runs after the verified Cloudflare deployment and checks the Worker origin", () => {
    expect(workflow).toContain('workflows: ["Deploy verified KeepTXRed to Cloudflare"]');
    expect(workflow).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(workflow).toContain("https://keeptxred-site.freddy-coppola.workers.dev");
  });

  it("guards the laws hub, child routes, and a dynamic topic route", () => {
    const required = [
      '/laws", parent_h1',
      "/laws/constitutional-amendments",
      "/laws/effective-dates",
      "/laws/topics",
      "/laws/topic/property-tax-law",
      "Texas Constitutional Amendments Tracker",
      "Texas Laws Taking Effect in 2026",
      "Texas Law Library",
      "Texas Property Tax Law Explained",
    ];

    for (const marker of required) expect(workflow).toContain(marker);
    expect(workflow).toContain("child route is still rendering the /laws parent H1");
  });

  it("requires canonical production URLs for every runtime-checked route", () => {
    for (const canonical of [
      "https://keeptxred.com/laws",
      "https://keeptxred.com/laws/constitutional-amendments",
      "https://keeptxred.com/laws/effective-dates",
      "https://keeptxred.com/laws/topics",
      "https://keeptxred.com/laws/topic/property-tax-law",
    ]) {
      expect(workflow).toContain(canonical);
    }
  });
});
