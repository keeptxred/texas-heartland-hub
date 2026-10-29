import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");
const safetyNet = readFileSync("src/routes/api/public/hooks/publishing-safety-net.ts", "utf8");

describe("normal newsroom stall accountability", () => {
  it("fails a prolonged normal newsroom stall after the reserve fallback", () => {
    const fallback = workflow.indexOf('reserve_published=$(jq -r');
    const reserveBranch = workflow.indexOf('if [[ -n "$reserve_published" ]]; then', fallback);
    const stalled = workflow.indexOf("if jq -e '.automation_stalled == true'", reserveBranch);
    expect(fallback).toBeGreaterThan(0);
    expect(reserveBranch).toBeGreaterThan(fallback);
    expect(stalled).toBeGreaterThan(reserveBranch);
    // The normal-stall test MUST be outside the reserve-success branch so
    // publishing a reserve cannot mask a 24h regular article outage.
    const tail = workflow.slice(reserveBranch, stalled);
    expect(tail).toContain("\n          fi\n\n          # A curated reserve guide");
    expect(workflow.slice(stalled)).toContain("DAILY_NEWS_NORMAL_PUBLISHING_STALLED");
    expect(workflow.slice(stalled)).toContain("exit 1");
    expect(workflow).toContain("DAILY_NEWS_WEB_ONLY_SUCCESS");
    expect(workflow).toContain("DAILY_NEWS_PUBLISH_SUCCESS reserve_published=");
  });

  it("keeps publishing-stall status and resolved_at in sync", () => {
    expect(safetyNet).toContain('type OpenAlert = { id: string; incident_key: string; opened_at: string; resolved_at: string | null }');
    expect(safetyNet).toContain('.select("id,incident_key,opened_at,resolved_at")');
    expect(safetyNet).toContain('resolved_at: null,\n          latest_published_at:');
    expect(safetyNet).toContain("if (automationStalled && openAlert?.resolved_at)");
    expect(safetyNet).toContain('.update({ resolved_at: null, updated_at: new Date().toISOString() })');
    expect(safetyNet).toContain('.eq("status", "open")');
    expect(safetyNet).toContain("Publishing stall alert reconciliation failed");
    expect(safetyNet).toContain('if (!automationStalled && openAlert)');
  });
});
