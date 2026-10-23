import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const verify = readFileSync(".github/workflows/shared-vitest.yml", "utf8");
const deploy = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");

describe("protected main deployment verification", () => {
  it("preserves main verification to completion even when manually dispatched again", () => {
    expect(verify).toContain("branches:\n      - main");
    expect(verify).toContain("cancel-in-progress: ${{ github.event_name == 'pull_request' || github.event_name == 'merge_group' }}");
    expect(verify).not.toContain("cancel-in-progress: true");
  });
  it("keeps deployment gated on successful verification of current main", () => {
    expect(deploy).toContain('workflows: ["Repository test and build health"]');
    expect(deploy).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(deploy).toContain('if [[ "$VERIFIED_SHA" != "$main_sha" ]]');
    expect(deploy).toContain("cancel-in-progress: false");
  });
});
