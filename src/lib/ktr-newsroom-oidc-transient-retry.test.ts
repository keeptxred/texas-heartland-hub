import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");
const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
const verifier = readFileSync("src/lib/github-actions-oidc.ts", "utf8");

describe("one-shot GitHub OIDC recovery for HELD newsroom drafts", () => {
  it("retries only an authentication rejection with a newly signed GitHub token", () => {
    expect(workflow).toContain("refresh_newsroom_oidc() {");
    expect(workflow).toContain("ACTIONS_ID_TOKEN_REQUEST_TOKEN");
    expect(workflow).toContain("HELD_DRAFT_AUTH_RETRY:");
    const start = workflow.indexOf('echo "recent-held-draft-recovery HTTP');
    const end = workflow.indexOf("if grep -Eqi 'daily free allocation", start);
    expect(start).toBeGreaterThan(0);
    expect(end).toBeGreaterThan(start);
    const section = workflow.slice(start, end);
    expect(section).toContain('if [[ "$newsroom_status" == "401" ]]; then');
    expect(section).toContain("refresh_newsroom_oidc");
    expect(section.match(/generate-newsroom\?mode=publish&recover_held=1/g)).toHaveLength(1);
    expect(section).toContain("HELD_DRAFT_AUTH_FAILED:");
    expect(section).toContain("exit 1");
    expect(section).not.toContain("skip_auth");
  });

  it("also refreshes once for authenticated election recovery and normal newsroom calls", () => {
    for (const [stage, startMarker, endMarker, expectedPath] of [
      ["ELECTION_DRAFT", 'echo "approved-election-draft-recovery HTTP', "if grep -Eqi 'daily free allocation", "generate-newsroom?mode=publish&recover_election=1"],
      ["NORMAL_NEWSROOM", 'echo "clustered-newsroom HTTP', "if grep -Eqi 'daily free allocation", 'generate-newsroom?mode=publish"'],
    ] as const) {
      const start = workflow.indexOf(startMarker);
      const end = workflow.indexOf(endMarker, start);
      expect(start).toBeGreaterThan(0);
      expect(end).toBeGreaterThan(start);
      const section = workflow.slice(start, end);
      expect(section).toContain('if [[ "$newsroom_status" == "401" ]]; then');
      expect(section).toContain("refresh_newsroom_oidc");
      expect(section).toContain(`${stage}_AUTH_RETRY:`);
      expect(section).toContain(`${stage}_AUTH_FAILED:`);
      expect(section).toContain("exit 1");
      expect(section).toContain(expectedPath);
      expect(section).not.toContain("skip_auth");
    }
  });

  it("keeps strict Worker's OIDC identity and signature checks", () => {
    expect(generator).toContain("verifyGitHubActionsOidc");
    expect(generator).toContain('workflowPath: PRODUCTION_WORKFLOW_PATH');
    expect(verifier).toContain('claims.ref !== "refs/heads/main"');
    expect(verifier).toContain("crypto.subtle.verify");
    expect(verifier).toContain("claims.workflow_ref !== expectedWorkflowRef");
  });
});
