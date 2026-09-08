import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/verify-primary-sitemap-ownership-after-deploy.yml", "utf8");
const smoke = readFileSync("scripts/seo/verify-deployed-primary-sitemap-ownership.py", "utf8");

describe("deployed primary sitemap ownership gate", () => {
  it("runs after a successful verified Cloudflare deployment", () => {
    expect(workflow).toContain('workflows: ["Deploy verified KeepTXRed to Cloudflare"]');
    expect(workflow).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(workflow).toContain("github.event.workflow_run.head_sha");
    expect(workflow).toContain("python3 scripts/seo/verify-deployed-primary-sitemap-ownership.py");
    expect(workflow).not.toContain("continue-on-error: true");
  });

  it("checks exact primary ownership for the core crawl hubs", () => {
    for (const route of [
      "/find-representative",
      "/bills",
      "/districts",
      "/representatives",
      "/contact-legislators",
      "/laws",
      "/texas-legislature",
      "/elections/2026",
    ]) {
      expect(smoke).toContain(route);
    }

    expect(smoke).toContain('f"{SITE_ORIGIN}/find-representative": f"{SITE_ORIGIN}/sitemap-elections.xml"');
    expect(smoke).toContain('f"{SITE_ORIGIN}/bills": f"{SITE_ORIGIN}/sitemap-legislature.xml"');
    expect(smoke).toContain('f"{SITE_ORIGIN}/districts": f"{SITE_ORIGIN}/sitemap-pages.xml"');
    expect(smoke).toContain("expected exactly one primary owner");
  });

  it("keeps the bulk district, representative, and bill feeds unadvertised", () => {
    for (const sitemap of [
      "sitemap-districts.xml",
      "sitemap-representatives.xml",
      "sitemap-bills.xml",
    ]) {
      expect(smoke).toContain(sitemap);
    }
    expect(smoke).toContain("crawl-budget sitemap is incorrectly advertised");
  });

  it("probes the exact deployed Worker through the canonical deployment-smoke path", () => {
    expect(workflow).toContain("https://keeptxred-site.freddy-coppola.workers.dev");
    expect(smoke).toContain('DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"');
    expect(smoke).toContain('if "workers.dev" in url:');
    expect(smoke).toContain('command.extend(["-H", DEPLOYMENT_SMOKE_HEADER])');
    expect(smoke).toContain('"--max-redirs", "0"');
  });
});
