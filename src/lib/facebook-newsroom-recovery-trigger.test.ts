import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(".github/workflows/auto-facebook-posts.yml", "utf8");
const smartPublisher = fs.readFileSync("src/routes/api/public/hooks/auto-facebook-post-smart.ts", "utf8");
const articlePublisher = fs.readFileSync("src/routes/api/public/hooks/auto-facebook-post.ts", "utf8");
const texasDefinedPublisher = fs.readFileSync("src/routes/api/public/hooks/auto-facebook-post-texasdefined.ts", "utf8");

describe("Facebook article publishing missed-schedule recovery", () => {
  it("responds to newsroom completion without introducing an unbounded workflow", () => {
    expect(workflow).toContain('workflows: ["Run Daily News Now", "Refresh Developing Published News"]');
    expect(workflow).toContain("types: [completed]");
    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("group: keeptxred-auto-facebook");
    expect(workflow).toContain("cancel-in-progress: false");
    expect(workflow).toContain('if [[ "${GITHUB_EVENT_NAME}" == "workflow_dispatch" ]]; then');
    expect(workflow).toContain("github.event.workflow_run.name == 'Run Daily News Now'");
  });

  it("avoids GitHub's congested :00/:30 starts and protects TexasDefined from recovery-only triggers", () => {
    expect(workflow).toContain('cron: "11,41 12-23 * * *"');
    expect(workflow).toContain('cron: "11,41 0-4 * * *"');
    expect(workflow).not.toContain('cron: "0,30 12-23 * * *"');
    expect(workflow).toContain("github.event.workflow_run.name == 'Run Daily News Now'");
    expect(workflow).toContain("group: keeptxred-auto-facebook");
  });

  it("explicitly authorizes the added signed event at all three publisher boundaries", () => {
    for (const source of [smartPublisher, articlePublisher, texasDefinedPublisher]) {
      expect(source).toContain('allowedEventNames: ["schedule", "workflow_dispatch", "workflow_run"]');
      expect(source).toContain("verifyGitHubActionsOidc");
    }
  });

  it("preserves editorial gates and strict authorization", () => {
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("AUTO_FACEBOOK_EDITORIAL_SHORTAGE");
    expect(workflow).toContain("X-KTR-Facebook-Mode: scheduled");
    expect(smartPublisher).toContain("facebookPostingDecision");
    expect(articlePublisher).toContain("facebookPostMatchesArticle");
    expect(texasDefinedPublisher).toContain("hardPostingGuard");
  });
});
