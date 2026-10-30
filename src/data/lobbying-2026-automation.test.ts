import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Texas lobbying source refresh protected PR publication", () => {
  const workflow = readFileSync(".github/workflows/texas-lobbying-2026-source-check.yml", "utf8");

  it("uses a non-GITHUB_TOKEN credential for changed-source bot PRs", () => {
    expect(workflow).toContain("secrets.KTR_AUTOMATION_PR_TOKEN || github.token");
    expect(workflow).toContain("PR_AUTH_TOKEN: ${{ secrets.KTR_AUTOMATION_PR_TOKEN }}");
    expect(workflow).toContain("Bot PR credential missing");
    expect(workflow).toContain("if git diff --quiet");
    expect(workflow.indexOf("if git diff --quiet")).toBeLessThan(workflow.indexOf('if [[ -z "$PR_AUTH_TOKEN" ]]'));
  });

  it("preserves weekly TEC checking and protected publication without bypassing required verify", () => {
    expect(workflow).toContain('cron: "23 14 * * 1"');
    expect(workflow).toContain("node scripts/lobbying/verify-texas-2026-sources.mjs");
    expect(workflow).toContain("bash scripts/ci/publish-automation-pr.sh texas-lobbying-2026");
    const publisher = readFileSync("scripts/ci/publish-automation-pr.sh", "utf8");
    expect(publisher).toContain("dispatch_and_watch_verify");
    expect(publisher).toContain("gh pr merge");
  });
});
