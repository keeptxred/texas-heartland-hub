import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MIGRATED_TOOL_CANONICALS } from "@/lib/migrated-tool-canonical";

const smoke = readFileSync("scripts/authority/smoke-production.py", "utf8");
const workflow = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");

describe("migrated homeowner-tool production redirect smoke", () => {
  it("covers every canonical migrated-tool handoff", () => {
    expect(smoke).toContain("MIGRATED_TOOL_REDIRECTS = {");
    for (const [legacyPath, canonical] of Object.entries(MIGRATED_TOOL_CANONICALS)) {
      expect(smoke).toContain(`"${legacyPath}": "${canonical}"`);
    }
  });

  it("requires exact permanent redirects with preserved query strings", () => {
    expect(smoke).toContain("def verify_migrated_tool_redirects()");
    expect(smoke).toContain("for path, target in MIGRATED_TOOL_REDIRECTS.items()");
    expect(smoke).toContain("if status != 301");
    expect(smoke).toContain('expected_location = f"{target}?{LEGACY_PROBE_QUERY}"');
    expect(smoke).toContain("if location != expected_location");
  });

  it("runs the migrated-tool probes in the deployment-critical smoke", () => {
    expect(smoke).toContain("verify_migrated_tool_redirects()");
    expect(workflow).toContain("python3 scripts/authority/smoke-production.py --city-migration-only");
  });
});
