import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const audit = readFileSync(".github/workflows/statewide-election-audit.yml", "utf8");
const workflows = [
  "shared-vitest.yml",
  "production-build-validation.yml",
  "election-central-validation.yml",
  "election-central-mobile.yml",
];

describe("statewide official-candidate refresh CI protection", () => {
  it("dispatches every existing validation suite when GitHub bot authored the PR", () => {
    expect(audit).toContain('git push --force-with-lease origin "$refresh_branch"');
    for (const workflow of workflows) {
      expect(audit).toContain(workflow);
      const workflowContent = readFileSync(`.github/workflows/${workflow}`, "utf8");
      expect(workflowContent).toContain("workflow_dispatch:");
    }
    expect(audit).toContain('gh workflow run "$workflow" --ref "$refresh_branch"');
    expect(audit).toContain('gh pr merge "$pr_number" --auto --squash');
  });

  it("retains full official source and election-data validation gates before automated release", () => {
    expect(audit).toContain("Scrape official qualified candidates");
    expect(audit).toContain("bun scripts/elections/audit-statewide.mjs");
    expect(audit).toContain("bun run elections:validate");
    expect(audit).toContain('if [[ -n "$unexpected_files" ]]; then');
    expect(audit).toContain("if git diff --cached --quiet; then");
    expect(audit).not.toContain("--admin");
    expect(audit).not.toContain("SKIP_ELECTION");
  });
});
