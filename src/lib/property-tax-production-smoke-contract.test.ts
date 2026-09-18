import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const smoke = readFileSync("scripts/seo/verify-property-tax-handoff.py", "utf8");
const workflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");

const migratedPaths = [
  "/property-taxes",
  "/texas/property-taxes-2026",
  "/news/texas-property-tax-guide",
  "/news/homestead-exemption-explained",
  "/news/appraisal-protest-playbook",
  "/news/county-appraisal-districts-explained",
  "/texas-property-tax-protest-guide",
  "/tax-calculator",
  "/texas-property-tax-calculator",
  "/tools/property-tax-calculator",
  "/texas-property-tax-increase-calculator",
] as const;

describe("property-tax production handoff hard gate", () => {
  it("runs the smoke after the deployed law-route gate", () => {
    const lawGate = workflow.indexOf("Verify deployed law route ownership, H1s, and canonicals");
    const ownershipGate = workflow.indexOf("Verify property-tax ownership handoff on deployed Worker");
    const cityGate = workflow.indexOf("Verify city migration redirects on deployed Worker");

    expect(lawGate).toBeGreaterThanOrEqual(0);
    expect(ownershipGate).toBeGreaterThan(lawGate);
    expect(cityGate).toBeGreaterThan(ownershipGate);
    expect(workflow).toContain("python3 scripts/seo/verify-property-tax-handoff.py");
  });

  it("covers every migrated practical property-tax entry point", () => {
    for (const path of migratedPaths) {
      expect(smoke).toContain(`"${path}"`);
    }
    expect(smoke).toContain('status != 301');
    expect(smoke).toContain("expected direct Location");
  });

  it("requires TexasDefined destinations to stay canonical and sitemap-owned", () => {
    expect(smoke).toContain('TD_ORIGIN = "https://texasdefined.com"');
    expect(smoke).toContain('signals.canonicals != [url]');
    expect(smoke).toContain('destination unexpectedly declares noindex');
    expect(smoke).toContain('TexasDefined destination is missing from sitemap.xml');
  });

  it("keeps migrated KTR URLs out of advertised sitemaps", () => {
    expect(smoke).toContain("verify_ktr_sitemap_absence");
    expect(smoke).toContain("migrated homeowner URL still appears in KTR sitemap");
  });

  it("preserves the KTR policy owner", () => {
    expect(smoke).toContain('POLICY_PATH = "/issues/texas-property-tax-relief"');
    expect(smoke).toContain("KTR covers policy; TexasDefined covers homeowner tasks");
    expect(smoke).toContain("Practical homeowner tasks belong on TexasDefined");
    expect(smoke).toContain("legitimate KTR policy page unexpectedly declares noindex");
  });
});
