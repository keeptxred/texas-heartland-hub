import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const release = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");

describe("protected production laws browser verification", () => {
  it("runs real Chromium on live law pages without slow Ubuntu apt dependency upgrades", () => {
    expect(release).toContain("bunx playwright install --only-shell chromium");
    expect(release).not.toContain("bunx playwright install --with-deps chromium");
    expect(release).toContain("bunx playwright test --config=playwright.laws-deployed.config.ts");
    expect(release).toContain("Measure deployed Texas law touch targets on the public hostname");
    expect(release).toContain("Verify complete law-topic sitemap and legal sources on both hosts");
    expect(release).toContain("Verify deployed law route ownership, H1s, and canonicals");
    expect(release).toContain("if: steps.revision.outputs.deploy == 'true'");
  });
});
