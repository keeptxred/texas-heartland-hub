import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(".github/workflows/auto-facebook-posts.yml", "utf8");
const refresh = fs.readFileSync(".github/workflows/refresh-published-news.yml", "utf8");
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
    expect(workflow).toContain('"${GITHUB_EVENT_NAME}" == "workflow_dispatch" && "${SCHEDULED_RECOVERY:-false}" != "true"');
    expect(workflow).toContain("github.event.workflow_run.name == 'Run Daily News Now'");
  });

  it("avoids GitHub's congested :00/:30 starts and protects TexasDefined from recovery-only triggers", () => {
    expect(workflow).toContain('cron: "11,41 12-23 * * *"');
    expect(workflow).toContain('cron: "11,41 0-4 * * *"');
    expect(workflow).not.toContain('cron: "0,30 12-23 * * *"');
    expect(workflow).toContain("github.event.workflow_run.name == 'Run Daily News Now'");
    expect(workflow).toContain("group: keeptxred-auto-facebook");
  });

  it("relays successful refreshes as guarded scheduled checks rather than manual posts", () => {
    expect(workflow).toContain("scheduled_recovery:");
    expect(workflow).toContain("SCHEDULED_RECOVERY: ${{ inputs.scheduled_recovery || false }}");
    expect(workflow).toContain('"${SCHEDULED_RECOVERY:-false}" != "true"');
    expect(workflow).toContain('mode="scheduled"');
    expect(refresh).toContain("actions: write");
    expect(refresh).toContain("if: success() && github.event_name == 'schedule'");
    expect(refresh).toContain("gh workflow run auto-facebook-posts.yml");
    expect(refresh).toContain("-f scheduled_recovery=true");
    expect(refresh).toContain('TZ=America/Chicago date +%H');
    expect(workflow).toContain("sha256sum /tmp/ktrfb/generated-image.png");
    expect(smartPublisher).toContain("facebookPostingDecision");
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
