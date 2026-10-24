import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/verify-laws-after-deploy.yml", "utf8");
const routes = readFileSync("scripts/verify-deployed-laws-runtime.py", "utf8");
const guide = readFileSync("scripts/verify-deployed-law-guide-rendering.py", "utf8");

describe("post-deploy laws verification covers production and every authority topic", () => {
  it("uses the maintained runtime scripts on both domains", () => {
    expect(workflow).toContain("python3 scripts/verify-deployed-laws-runtime.py");
    expect(workflow).toContain("python3 scripts/verify-deployed-law-guide-rendering.py");
    expect(workflow).toContain("SITE_URL: https://keeptxred.com");
    expect(workflow).toContain("SITE_URL: https://keeptxred-site.freddy-coppola.workers.dev");
    expect(workflow).not.toContain("python3 - <<'PY'");
  });

  it("detects source-inaccurate and stale hub content with complete links", () => {
    expect(routes).toContain("Find Texas laws by topic");
    expect(routes).toContain("Search the Texas law-topic library");
    expect(routes).toContain("outdated constitutional income-tax claim");
    for (const slug of [
      "driving-traffic-insurance-law", "landlord-tenant-rentals-law",
      "employment-wages-workplace-rights-law", "consumer-protection-deceptive-trade-law",
      "family-custody-child-support-law", "wills-probate-inheritance-law",
      "criminal-offenses-penalties-law", "business-formation-llc-law",
    ]) {
      expect(routes).toContain("/laws/topic/" + slug);
    }
    expect(routes).toContain("authority hub is missing law guide links");
  });

  it("continues verifying child support source links and article order", () => {
    expect(guide).toContain("/guides/texas-child-support-guidelines-law");
    expect(guide).toContain("Texas Attorney General Child Support Calculator");
    expect(guide).toContain("Frequently Asked Questions");
    expect(guide).toContain("Texas law reference");
  });
});
