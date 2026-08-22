import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const imageWorkflow = readFileSync(new URL("../../.github/workflows/image-backlog-recovery.yml", import.meta.url), "utf8");
const adsenseWorkflow = readFileSync(new URL("../../.github/workflows/adsense-image-backfill.yml", import.meta.url), "utf8");
const imageRoute = readFileSync(new URL("../routes/api/public/hooks/image-backlog-recovery.ts", import.meta.url), "utf8");
const adsenseRoute = readFileSync(new URL("../routes/api/public/hooks/adsense-image-backfill.ts", import.meta.url), "utf8");

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
});
