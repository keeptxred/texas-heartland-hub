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

  it("caps the explicit force-marker repair cohort at four articles", () => {
    expect(backlogWorkflow).toContain('if [[ "${GITHUB_EVENT_NAME}" == "push" ]]; then');
    expect(backlogWorkflow).toContain("max_per_run=4");
    expect(adsenseWorkflow).not.toContain("max_per_run=4");
  });

  it("staggers schedules and avoids unbounded five-minute AI retry loops", () => {
    expect(backlogWorkflow).toContain("45 2,10,18 * * *");
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
