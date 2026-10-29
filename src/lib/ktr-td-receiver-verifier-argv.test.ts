import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const yaml = readFileSync(".github/workflows/verify-texasdefined-image-receiver-production.yml", "utf8");

describe("TexasDefined receiver verification uses bounded deployment lookup", () => {
  it("streams GitHub workflow JSON instead of exceeding Linux env argument size", () => {
    expect(yaml).toContain('printf \'%s\' "$runs_json" | python3 -c');
    expect(yaml).toContain("data = json.load(sys.stdin)");
    expect(yaml).not.toContain('RUNS_JSON="$runs_json"');
    expect(yaml).not.toContain("os.environ['RUNS_JSON']");
  });
  it("still requires the exact successful main deployment before probing the receiver", () => {
    expect(yaml).toContain('if run.get("head_sha") == expected]');
    expect(yaml).toContain('if run.get("status") == "completed"');
    expect(yaml).toContain('and run.get("conclusion") == "success"');
    expect(yaml).toContain("chosen = successful or running or (matching[0] if matching else None)");
    expect(yaml).toContain('if [[ "$status" != "completed" ]]; then');
    expect(yaml).toContain('if [[ "$conclusion" != "success" ]]; then');
    expect(yaml).toContain("TexasDefined generated-image receiver returned HTTP");
    expect(yaml).toContain('if [[ "$status" != "401" ]]; then');
  });
});
