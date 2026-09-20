import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(
  new URL("../../.github/workflows/newsroom-production-observability.yml", import.meta.url),
  "utf8",
);

describe("newsroom Phase 15 production observability", () => {
  it("observes completed production publisher runs without invoking newsroom endpoints", () => {
    expect(workflow).toContain('workflows: ["Run Daily News Now"]');
    expect(workflow).toContain("types: [completed]");
    expect(workflow).toContain("actions: read");
    expect(workflow).toContain("contents: read");
    expect(workflow).not.toContain("generate-newsroom?mode=");
    expect(workflow).not.toContain("generate-news'");
    expect(workflow).not.toContain("publishing-safety-net");
    expect(workflow).not.toContain("CLOUDFLARE_API_TOKEN");
    expect(workflow).not.toContain("SUPABASE");
  });

  it("captures publisher choice, AI efficiency, repairs, evidence and fallback telemetry", () => {
    expect(workflow).toContain("NEWSROOM_PRODUCTION_TELEMETRY");
    expect(workflow).toContain("clustered_newsroom");
    expect(workflow).toContain("overdue_gap");
    expect(workflow).toContain("legacy_rss");
    expect(workflow).toContain("safety_net");
    expect(workflow).toContain("clusteredNoItemReason");
    expect(workflow).toContain("sourceCount");
    expect(workflow).toContain("primarySourceCount");
    expect(workflow).toContain("aiCalls");
    expect(workflow).toContain("repairAttempted");
    expect(workflow).toContain("legacyOffsetsAttempted");
    expect(workflow).toContain("legacyExpensiveAttempts");
    expect(workflow).toContain("legacyCapReached");
    expect(workflow).toContain("LEGACY_FALLBACK_AI_CAP_REACHED");
    expect(workflow).toContain("quotaExhausted");
  });

  it("retains a machine-readable telemetry artifact for later optimization", () => {
    expect(workflow).toContain("'schemaVersion': 2");
    expect(workflow).toContain("newsroom-production-telemetry.json");
    expect(workflow).toContain("actions/upload-artifact@v4");
    expect(workflow).toContain("retention-days: 30");
    expect(workflow).toContain("GITHUB_STEP_SUMMARY");
  });
});
