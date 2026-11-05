import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const src = readFileSync("src/routes/api/public/hooks/publish-overdue-gap.ts", "utf8");

describe("overdue-gap read-only timeout recovery", () => {
  it("keeps a bounded retry only for a 57014 read timeout", () => {
    expect(src).toContain("GAP_VIEW_MAX_READ_ATTEMPTS = 2");
    expect(src).toContain('error.code === "57014"');
    expect(src).toContain("statement timeout|canceling statement due to statement timeout");
    expect(src).toContain("if (!timedOut || attempt >= GAP_VIEW_MAX_READ_ATTEMPTS)");
    expect(src).toContain("loadOverdueGapsWithTimeoutRetry(db, cutoff)");
    expect(src).toContain("gap_read_attempts: gapReadAttempts");
  });

  it("preserves the identity, editorial and publication limits", () => {
    expect(src).toContain('verifyGitHubActionsOidc({');
    expect(src).toContain('const MAX_ATTEMPTS = 2');
    expect(src).toContain('const MAX_PUBLISHED = 1');
    expect(src).toContain('const GAP_SCAN_LIMIT = 80');
    expect(src).toContain('const MAX_CANDIDATE_SCAN = 48');
    expect(src).toContain('const OVERDUE_REQUEST_DEADLINE_MS = 45_000');
    expect(src).toContain('publishSingleFeedItem(gap.id)');
    const read = src.slice(src.indexOf("async function loadOverdueGapsWithTimeoutRetry"), src.indexOf("async function recentFailureCounts"));
    expect(read).not.toContain("publishSingleFeedItem");
    expect(read).not.toContain(".update(");
    expect(read).not.toContain(".upsert(");
  });
});
