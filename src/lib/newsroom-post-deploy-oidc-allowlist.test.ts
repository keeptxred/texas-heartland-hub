import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isAllowedGitHubActionsEvent } from "./github-actions-oidc";

describe("post-deployment news publishing is authorized only for the exact guarded workflow", () => {
  const files = [
    "src/routes/api/public/hooks/generate-newsroom.ts",
    "src/routes/api/public/hooks/publish-overdue-gap.ts",
    "src/routes/api/public/hooks/finalize-newsroom-article.ts",
  ];
  const trigger = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");
  it("preserves the general verifier's strict default event policy", () => {
    expect(isAllowedGitHubActionsEvent("schedule")).toBe(true);
    expect(isAllowedGitHubActionsEvent("workflow_dispatch")).toBe(true);
    expect(isAllowedGitHubActionsEvent("workflow_run")).toBe(false);
    expect(isAllowedGitHubActionsEvent("pull_request")).toBe(false);
  });
  it("opts in the three exact production newsroom endpoints without permitting PR-origin tokens", () => {
    for (const file of files) {
      const code = readFileSync(file, "utf8");
      expect(code, file).toContain('allowedEventNames: ["schedule", "workflow_dispatch", "workflow_run"]');
      expect(code, file).toContain('repository: REPOSITORY,');
      expect(code, file).toMatch(/workflowPath: (PRODUCTION_WORKFLOW_PATH|WORKFLOW_PATH),/);
      expect(code, file).not.toContain('"pull_request"');
    }
  });
  it("only dispatches on exact-main verified deployment after passing production smoke", () => {
    const deploy = readFileSync(".github/workflows/deploy-cloudflare-after-verify.yml", "utf8");
    expect(deploy).toContain("guarded-newsroom-dispatch:");
    expect(deploy).toContain("needs: [deploy, newsroom-smoke]");
    expect(deploy).toContain("needs.newsroom-smoke.result == 'success'");
    expect(deploy).toContain("needs.deploy.outputs.deployed == 'true'");
    expect(deploy).toContain('gh api');
    expect(deploy).toContain('current_main" != "$DEPLOYED_SHA"');
    expect(deploy).toContain("gh workflow run run-daily-news-now.yml --ref main");
    expect(deploy).toContain("actions: write");
    expect(trigger).not.toContain("workflow_run:");
    expect(trigger).toContain("workflow_dispatch:");
    expect(trigger).toContain('id-token: write');
  });
});
