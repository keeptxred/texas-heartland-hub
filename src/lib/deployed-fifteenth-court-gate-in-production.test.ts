import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const deployWorkflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");
const lawsSmoke = readFileSync("scripts/seo/verify-deployed-laws-routes.py", "utf8");
const courtSmoke = readFileSync("scripts/authority/verify-deployed-fifteenth-court.py", "utf8");
const ownershipSmoke = readFileSync("scripts/seo/verify_deployed_primary_sitemap_ownership.py", "utf8");

const route = "/texas-government/fifteenth-court-of-appeals";
const canonical = `https://keeptxred.com${route}`;

describe("deployed Fifteenth Court authority gate", () => {
  it("runs inside the verified Cloudflare deploy hard gate", () => {
    expect(deployWorkflow).toContain("- name: Verify deployed law route ownership, H1s, and canonicals");
    expect(deployWorkflow).toContain("run: python3 scripts/seo/verify-deployed-laws-routes.py");
    expect(lawsSmoke).toContain('"authority" / "verify-deployed-fifteenth-court.py"');
    expect(lawsSmoke).toContain('"fifteenth_court": {"status": "not_run", "error": None}');
    expect(lawsSmoke).toContain('github_error("Deployed Fifteenth Court authority smoke failed", error)');
    expect(lawsSmoke).not.toContain("continue-on-error: true");
  });

  it("checks the freshly deployed page as direct, canonical, and indexable", () => {
    expect(courtSmoke).toContain(`COURT_PATH = "${route}"`);
    expect(courtSmoke).toContain('COURT_CANONICAL = f"{SITE_ORIGIN}{COURT_PATH}"');
    expect(courtSmoke).toContain("Texas Fifteenth Court of Appeals: The Statewide Court That Changed the Appellate Map");
    expect(courtSmoke).toContain('DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"');
    expect(courtSmoke).toContain('"--max-redirs", "0"');
    expect(courtSmoke).toContain("expected direct 200 with no redirect");
    expect(courtSmoke).toContain("X-Robots-Tag contains noindex");
    expect(courtSmoke).toContain("robots meta contains noindex");
    expect(courtSmoke).toContain("expected one canonical");
  });

  it("requires exactly one government-sitemap entry and one primary owner", () => {
    expect(courtSmoke).toContain('GOVERNMENT_SITEMAP_PATH = "/sitemap-government.xml"');
    expect(courtSmoke).toContain("locs.count(COURT_CANONICAL)");
    expect(courtSmoke).toContain("expected exactly one");
    expect(ownershipSmoke).toContain(
      `f"{SITE_ORIGIN}${route}": f"{SITE_ORIGIN}/sitemap-government.xml"`,
    );
    expect(ownershipSmoke).toContain("expected exactly one primary owner");
    expect(canonical).toBe("https://keeptxred.com/texas-government/fifteenth-court-of-appeals");
  });
});
