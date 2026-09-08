import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const deployWorkflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");
const lawsSmoke = readFileSync("scripts/seo/verify-deployed-laws-routes.py", "utf8");
const prioritySmoke = readFileSync("scripts/seo/verify_deployed_priority_sitemap.py", "utf8");
const ownershipSmoke = readFileSync("scripts/seo/verify_deployed_primary_sitemap_ownership.py", "utf8");

describe("deployed primary sitemap ownership hard gate", () => {
  it("runs inside the existing verified production deployment smoke path", () => {
    expect(deployWorkflow).toContain("python3 scripts/seo/verify-deployed-laws-routes.py");
    expect(lawsSmoke).toContain("from verify_deployed_priority_sitemap import verify_priority_sitemap");
    expect(lawsSmoke).toContain("verify_priority_sitemap(SITE_URL)");
    expect(prioritySmoke).toContain(
      "from verify_deployed_primary_sitemap_ownership import verify_primary_sitemap_ownership",
    );
    expect(prioritySmoke).toContain("verify_primary_sitemap_ownership(worker_origin)");
    expect(deployWorkflow).not.toContain("continue-on-error: true\n        env:\n          SITE_URL: ${{ env.PREVIEW_URL }}\n        run: python3 scripts/seo/verify-deployed-laws-routes.py");
  });

  it("does not rely on the failed chained workflow trigger", () => {
    expect(existsSync(".github/workflows/verify-primary-sitemap-ownership-after-deploy.yml")).toBe(false);
    expect(existsSync("scripts/seo/verify-deployed-primary-sitemap-ownership.py")).toBe(false);
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
      expect(ownershipSmoke).toContain(route);
    }

    expect(ownershipSmoke).toContain(
      'f"{SITE_ORIGIN}/find-representative": f"{SITE_ORIGIN}/sitemap-elections.xml"',
    );
    expect(ownershipSmoke).toContain(
      'f"{SITE_ORIGIN}/bills": f"{SITE_ORIGIN}/sitemap-legislature.xml"',
    );
    expect(ownershipSmoke).toContain(
      'f"{SITE_ORIGIN}/districts": f"{SITE_ORIGIN}/sitemap-pages.xml"',
    );
    expect(ownershipSmoke).toContain("expected exactly one primary owner");
  });

  it("keeps the bulk district, representative, and bill feeds unadvertised", () => {
    for (const sitemap of [
      "sitemap-districts.xml",
      "sitemap-representatives.xml",
      "sitemap-bills.xml",
    ]) {
      expect(ownershipSmoke).toContain(sitemap);
    }
    expect(ownershipSmoke).toContain("crawl-budget sitemap is incorrectly advertised");
  });

  it("probes the exact deployed Worker through the canonical deployment-smoke path", () => {
    expect(deployWorkflow).toContain("https://keeptxred-site.freddy-coppola.workers.dev");
    expect(ownershipSmoke).toContain(
      'DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"',
    );
    expect(ownershipSmoke).toContain('if "workers.dev" in url:');
    expect(ownershipSmoke).toContain('command.extend(["-H", DEPLOYMENT_SMOKE_HEADER])');
    expect(ownershipSmoke).toContain('"--max-redirs", "0"');
  });
});
