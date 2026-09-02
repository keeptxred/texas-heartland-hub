import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const deployWorkflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");
const smokeScript = readFileSync("scripts/seo/verify-deployed-laws-routes.py", "utf8");
const prioritySmoke = readFileSync("scripts/seo/verify_deployed_priority_sitemap.py", "utf8");

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

  it("probes the freshly deployed Worker without following its canonical-host redirect", () => {
    expect(smokeScript).toContain('CANONICAL_HOST = "keeptxred.com"');
    expect(smokeScript).toContain('"-H", f"host: {CANONICAL_HOST}"');
    expect(smokeScript).not.toContain('"-H", f"x-forwarded-host: {CANONICAL_HOST}"');
    expect(smokeScript).not.toContain('"-H", "x-forwarded-proto: https"');
    expect(smokeScript).toContain('"--max-redirs", "0"');
    expect(smokeScript).not.toContain('"--location"');

    expect(prioritySmoke).toContain('CANONICAL_HOST = "keeptxred.com"');
    expect(prioritySmoke).toContain('"-H", f"host: {CANONICAL_HOST}"');
    expect(prioritySmoke).not.toContain('"-H", f"x-forwarded-host: {CANONICAL_HOST}"');
    expect(prioritySmoke).not.toContain('"-H", "x-forwarded-proto: https"');
    expect(prioritySmoke).toContain('"--max-redirs", "0"');
  });

  it("keeps exact GitHub annotations for route and priority failures", () => {
    expect(smokeScript).toContain('github_error("Deployed laws route smoke failed", failure)');
    expect(smokeScript).toContain('os.environ.get("GITHUB_ACTIONS") != "true"');
    expect(prioritySmoke).toContain("::error title=Deployed priority sitemap/indexability smoke failed::");
    expect(prioritySmoke).toContain("for failure in failures:");
    expect(prioritySmoke).toContain("_github_error(failure)");
  });

  it("makes the priority sitemap and all 30 priority URLs part of the same hard deploy gate", () => {
    expect(smokeScript).toContain("from verify_deployed_priority_sitemap import verify_priority_sitemap");
    expect(smokeScript).toContain("verify_priority_sitemap(SITE_URL)");
    expect(prioritySmoke).toContain('PRIORITY_SOURCE = Path("src/data/search-console-priority-sitemap-urls.json")');
    expect(prioritySmoke).toContain('/sitemap-priority.xml');
    expect(prioritySmoke).toContain("len(expected) != 30");
    expect(prioritySmoke).toContain("returned HTTP {status}, expected direct 200 with no redirect");
    expect(prioritySmoke).toContain("X-Robots-Tag contains noindex");
    expect(prioritySmoke).toContain("robots meta contains noindex");
    expect(prioritySmoke).toContain("expected one canonical");
    expect(prioritySmoke).toContain("observed != expected");
    expect(prioritySmoke).toContain("--max-redirs");
  });
});
