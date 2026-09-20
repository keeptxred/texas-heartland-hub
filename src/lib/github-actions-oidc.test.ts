import { describe, expect, it } from "vitest";
import { isAllowedGitHubActionsEvent } from "./github-actions-oidc";

describe("GitHub Actions OIDC event policy", () => {
  it("keeps the shared default restricted to schedule and manual dispatch", () => {
    expect(isAllowedGitHubActionsEvent("schedule")).toBe(true);
    expect(isAllowedGitHubActionsEvent("workflow_dispatch")).toBe(true);
    expect(isAllowedGitHubActionsEvent("workflow_run")).toBe(false);
    expect(isAllowedGitHubActionsEvent("push")).toBe(false);
  });

  it("allows workflow_run only when an endpoint explicitly opts in", () => {
    const imageRecoveryEvents = ["workflow_dispatch", "workflow_run"] as const;
    expect(isAllowedGitHubActionsEvent("workflow_dispatch", imageRecoveryEvents)).toBe(true);
    expect(isAllowedGitHubActionsEvent("workflow_run", imageRecoveryEvents)).toBe(true);
    expect(isAllowedGitHubActionsEvent("schedule", imageRecoveryEvents)).toBe(false);
    expect(isAllowedGitHubActionsEvent("push", imageRecoveryEvents)).toBe(false);
  });
});
