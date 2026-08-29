import fs from "node:fs";
import { describe, expect, it } from "vitest";

const backlogWorkflow = fs.readFileSync(new URL("../../.github/workflows/image-backlog-recovery.yml", import.meta.url), "utf8");
const adsenseWorkflow = fs.readFileSync(new URL("../../.github/workflows/adsense-image-backfill.yml", import.meta.url), "utf8");

describe("image recovery workflow bounds", () => {
  it("keeps both production recovery workflows on the same non-cancelling concurrency lock", () => {
    for (const source of [backlogWorkflow, adsenseWorkflow]) {
      expect(source).toContain("group: adsense-image-readiness-backfill");
      expect(source).toContain("cancel-in-progress: false");
    }
  });

  it("bounds ordinary lock-holding passes to one article and ten minutes per article", () => {
    for (const source of [backlogWorkflow, adsenseWorkflow]) {
      expect(source).toContain("max_per_run=1");
      expect(source).toContain("--max-time 600");
      expect(source).not.toContain("max_per_run=5");
      expect(source).not.toContain("max_per_run=20");
      expect(source).not.toContain("max_per_run=40");
      expect(source).not.toContain("--max-time 900");
    }
  });

  it("caps force-marker repair at four exact eligible slugs", () => {
    expect(backlogWorkflow).toContain('if [[ "${GITHUB_EVENT_NAME}" == "push" ]]; then');
    expect(backlogWorkflow).toContain("max_per_run=4");
    expect(backlogWorkflow).toContain("force-image-backlog-recovery?ref=${GITHUB_SHA}");
    expect(backlogWorkflow).toContain("slug:[[:space:]]*");
    expect(backlogWorkflow).toContain("Target slug is not currently eligible for image recovery");
    expect(adsenseWorkflow).not.toContain("max_per_run=4");
  });

  it("rotates ordinary recovery across the current missing-image cohort without increasing the quota", () => {
    expect(backlogWorkflow).toContain("missing=$(jq -r '.missing // 0' /tmp/image-backlog-dry.json)");
    expect(backlogWorkflow).toContain("rotation=$(( (GITHUB_RUN_NUMBER - 1) % candidate_count ))");
    expect(backlogWorkflow).toContain(".slugs[$offset:($offset + $max)][]");
    expect(backlogWorkflow).toContain("IMAGE_BACKLOG_RECOVERY_ROTATION");
    expect(backlogWorkflow).toContain("max_per_run=1");
  });

  it("fails closed when any requested recovery image fails", () => {
    expect(backlogWorkflow).toContain('if [[ "$failures" -gt 0 ]]; then');
    expect(backlogWorkflow).toContain("At least one requested image failed the existing production quality gate");
    expect(backlogWorkflow).not.toContain('if [[ "$processed" -gt 0 && "$succeeded" -eq 0 ]]; then');
  });

  it("staggers schedules and avoids unbounded or expired diagnostic AI retry loops", () => {
    expect(backlogWorkflow).toContain("45 2,10,18 * * *");
    expect(backlogWorkflow).not.toContain("30 22 28 8 *");
    expect(backlogWorkflow).not.toContain("EVENT_SCHEDULE");
    expect(adsenseWorkflow).toContain("45 6,14,22 * * *");
    for (const source of [backlogWorkflow, adsenseWorkflow]) {
      expect(source).not.toContain("*/5 * * * *");
      expect(source).not.toContain('workflows: ["Deploy verified KeepTXRed to Cloudflare"]');
    }
  });

  it("refreshes the short-lived OIDC token for each protected article request", () => {
    for (const source of [backlogWorkflow, adsenseWorkflow]) {
      expect(source).toContain("issue_oidc_token() {");
      const loopStart = source.indexOf('for slug in "${slugs[@]}"; do');
      expect(loopStart).toBeGreaterThan(-1);
      const loopSource = source.slice(loopStart);
      expect(loopSource).toContain("oidc_token=$(issue_oidc_token)");
      expect(loopSource).toContain('-H "Authorization: Bearer ${oidc_token}"');
    }
  });
});
