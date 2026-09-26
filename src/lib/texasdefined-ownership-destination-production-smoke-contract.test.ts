import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MIGRATED_PRACTICAL_GUIDE_CANONICALS } from "@/lib/migrated-practical-guide-canonical";
import { MIGRATED_TOOL_CANONICALS } from "@/lib/migrated-tool-canonical";

const smoke = readFileSync("scripts/seo/verify-texasdefined-ownership-destinations.py", "utf8");
const workflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");

const propertyTaxDestinations = [
  "https://texasdefined.com/learn/property-taxes",
  "https://texasdefined.com/do/homestead-exemption",
  "https://texasdefined.com/do/property-tax-protest",
  "https://texasdefined.com/learn/appraisal-districts",
  "https://texasdefined.com/decide/property-taxes",
  "https://texasdefined.com/property-tax-calculators",
] as const;

describe("TexasDefined ownership destination production gate", () => {
  it("covers every migrated tool, practical guide, and property-tax ownership destination", () => {
    const expected = new Set([
      ...Object.values(MIGRATED_TOOL_CANONICALS),
      ...Object.values(MIGRATED_PRACTICAL_GUIDE_CANONICALS),
      ...propertyTaxDestinations,
    ]);
    for (const url of expected) {
      expect(smoke).toContain(`"${url}"`);
    }
  });

  it("requires live, canonical, indexable, H1-bearing, sitemap-owned destinations", () => {
    expect(smoke).toContain("if status != 200");
    expect(smoke).toContain("if signals.canonicals != [url]");
    expect(smoke).toContain('if any("noindex" in value.lower() for value in signals.robots)');
    expect(smoke).toContain("if not signals.h1");
    expect(smoke).toContain("if url not in advertised");
  });

  it("emits GitHub annotations for actionable production failures", () => {
    expect(smoke).toContain("def github_error(message: str) -> None");
    expect(smoke).toContain("::error title=TexasDefined ownership destination failed::");
    expect(smoke).toContain("for failure in failures:");
    expect(smoke).toContain("github_error(failure)");
  });

  it("runs after the property-tax handoff and before the redirect smoke", () => {
    const propertyGate = workflow.indexOf("Verify property-tax ownership handoff on deployed Worker");
    const destinationGate = workflow.indexOf("Verify all TexasDefined ownership destinations");
    const redirectGate = workflow.indexOf("Verify city migration redirects on deployed Worker");

    expect(propertyGate).toBeGreaterThanOrEqual(0);
    expect(destinationGate).toBeGreaterThan(propertyGate);
    expect(redirectGate).toBeGreaterThan(destinationGate);
    expect(workflow).toContain("python3 scripts/seo/verify-texasdefined-ownership-destinations.py");
  });
});
