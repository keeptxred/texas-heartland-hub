import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MIGRATED_TOOL_CANONICALS } from "@/lib/migrated-tool-canonical";

const smoke = readFileSync("scripts/seo/verify-migrated-tool-handoff.py", "utf8");
const workflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");

describe("migrated-tool production handoff hard gate", () => {
  it("runs after the property-tax handoff and before city migration smoke", () => {
    const propertyTaxGate = workflow.indexOf("Verify property-tax ownership handoff on deployed Worker");
    const migratedToolGate = workflow.indexOf("Verify all migrated tool redirects on deployed Worker");
    const cityGate = workflow.indexOf("Verify city migration redirects on deployed Worker");

    expect(propertyTaxGate).toBeGreaterThanOrEqual(0);
    expect(migratedToolGate).toBeGreaterThan(propertyTaxGate);
    expect(cityGate).toBeGreaterThan(migratedToolGate);
    expect(workflow).toContain("python3 scripts/seo/verify-migrated-tool-handoff.py");
  });

  it("derives the production redirect set from the canonical migrated-tool map", () => {
    expect(Object.keys(MIGRATED_TOOL_CANONICALS).length).toBeGreaterThanOrEqual(30);
    expect(smoke).toContain('CANONICAL_MAP = Path("src/lib/migrated-tool-canonical.ts")');
    expect(smoke).toContain("MIGRATED_TOOL_CANONICALS");
    expect(smoke).toContain("Expected at least 30 migrated tool redirects");
  });

  it("requires direct permanent redirects to TexasDefined with query preservation", () => {
    expect(smoke).toContain("status != 301");
    expect(smoke).toContain("expected direct Location");
    expect(smoke).toContain('parts.netloc != "texasdefined.com"');
    expect(smoke).toContain("query string was not preserved exactly");
    expect(smoke).toContain('SMOKE_QUERY = "ktr_smoke=1"');
  });

  it("uses the deployment smoke header for workers.dev verification", () => {
    expect(smoke).toContain('DEPLOYMENT_SMOKE_HEADER = "x-keeptxred-deployment-smoke: canonical"');
    expect(smoke).toContain('if "workers.dev" in url');
  });
});
