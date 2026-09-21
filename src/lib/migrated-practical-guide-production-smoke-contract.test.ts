import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MIGRATED_PRACTICAL_GUIDE_CANONICALS } from "@/lib/migrated-practical-guide-canonical";

const smoke = readFileSync("scripts/authority/smoke-production.py", "utf8");
const workflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");

describe("migrated practical-guide production redirect smoke", () => {
  it("covers every canonical practical-guide handoff", () => {
    for (const [legacyPath, canonical] of Object.entries(MIGRATED_PRACTICAL_GUIDE_CANONICALS)) {
      expect(smoke).toContain(`"${legacyPath}": "${canonical}"`);
    }
  });

  it("requires exact permanent redirects with preserved query strings", () => {
    expect(smoke).toContain("def verify_practical_guide_redirects()");
    expect(smoke).toContain("if status != 301");
    expect(smoke).toContain("expected_location = f\"{target}?{LEGACY_PROBE_QUERY}\"");
    expect(smoke).toContain("if location != expected_location");
  });

  it("runs the practical-guide probes in the deployment-critical smoke", () => {
    expect(smoke).toContain("verify_practical_guide_redirects()");
    expect(workflow).toContain("python3 scripts/authority/smoke-production.py --city-migration-only");
  });
});
