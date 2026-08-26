import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const imageWorkflow = readFileSync(new URL("../../.github/workflows/image-backlog-recovery.yml", import.meta.url), "utf8");
const adsenseWorkflow = readFileSync(new URL("../../.github/workflows/adsense-image-backfill.yml", import.meta.url), "utf8");
const imageRoute = readFileSync(new URL("../routes/api/public/hooks/image-backlog-recovery.ts", import.meta.url), "utf8");
const adsenseRoute = readFileSync(new URL("../routes/api/public/hooks/adsense-image-backfill.ts", import.meta.url), "utf8");
const DIRECT_WORKER_ORIGIN = "https://keeptxred-site.freddy-coppola.workers.dev";

describe("image recovery OIDC workflow event contract", () => {
  it("authorizes scheduled, protected push, post-deploy, and manual recovery events", () => {
    expect(imageWorkflow).toContain("workflow_run:");
    expect(imageWorkflow).toContain("schedule:");
    expect(imageWorkflow).toContain("push:");
    expect(imageRoute).toContain('allowedEventNames: ["push", "schedule", "workflow_dispatch", "workflow_run"]');
  });

  it("authorizes schedule, manual dispatch, and post-deploy workflow_run for AdSense recovery", () => {
    expect(adsenseWorkflow).toContain("schedule:");
    expect(adsenseWorkflow).toContain("workflow_run:");
    expect(adsenseRoute).toContain('allowedEventNames: ["schedule", "workflow_dispatch", "workflow_run"]');
  });

  it("routes OIDC recovery POSTs directly to the Worker instead of the challenged production hostname", () => {
    expect(imageWorkflow).toContain(
      `endpoint='${DIRECT_WORKER_ORIGIN}/api/public/hooks/image-backlog-recovery'`,
    );
    expect(adsenseWorkflow).toContain(
      `endpoint='${DIRECT_WORKER_ORIGIN}/api/public/hooks/adsense-image-backfill'`,
    );
    expect(imageWorkflow).not.toContain("endpoint='https://keeptxred.com/api/public/hooks/image-backlog-recovery'");
    expect(adsenseWorkflow).not.toContain("endpoint='https://keeptxred.com/api/public/hooks/adsense-image-backfill'");
  });

  it("refreshes the newsroom OIDC token for each long-running image request", () => {
    expect(imageWorkflow).toContain("issue_oidc_token() {");
    expect(imageWorkflow).toContain("for slug in \"${slugs[@]}\"; do");

    const slugLoop = imageWorkflow.slice(imageWorkflow.indexOf('for slug in "${slugs[@]}"; do'));
    expect(slugLoop).toContain("oidc_token=$(issue_oidc_token)");
    expect(slugLoop.indexOf("oidc_token=$(issue_oidc_token)")).toBeLessThan(
      slugLoop.indexOf('Authorization: Bearer ${oidc_token}'),
    );
  });
});
