import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const verify = readFileSync(".github/workflows/shared-vitest.yml", "utf8");
const deploy = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");

describe("protected main deployment verification", () => {
  it("preserves main verification to completion even when manually dispatched again", () => {
    expect(verify).toContain("branches:\n      - main");
    expect(verify).toContain("cancel-in-progress: ${{ github.event_name == 'pull_request' || github.event_name == 'merge_group' }}");
    expect(verify).not.toContain("cancel-in-progress: true");
    // GitHub replaces older pending jobs in the same group even when
    // cancel-in-progress is false; main push/manual events cannot share a key.
    expect(verify).toContain("group: repository-health-\${{ github.event_name }}-\${{ github.event.pull_request.number || github.event.merge_group.head_sha || github.sha }}");
    expect(verify).not.toContain("github.event.merge_group.head_sha || github.ref");

  });
  it("keeps deployment gated on successful verification of current main", () => {
    expect(deploy).toContain('workflows: ["Repository test and build health"]');
    expect(deploy).toContain("github.event.workflow_run.conclusion == 'success'");
    expect(deploy).toContain('if [[ "$VERIFIED_SHA" != "$main_sha" ]]');
    expect(deploy).toContain("cancel-in-progress: false");
  });
});
