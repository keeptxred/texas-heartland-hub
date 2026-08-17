import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(
  new URL("../../.github/workflows/run-daily-news-now.yml", import.meta.url),
  "utf8",
);

describe("newsroom Phase 15 legacy fallback budget", () => {
  it("hard-caps potentially expensive legacy fallback attempts", () => {
    expect(workflow).toContain("LEGACY_FALLBACK_MAX_EXPENSIVE_ATTEMPTS=2");
    expect(workflow).toContain("legacy_expensive_attempts=0");
    expect(workflow).toContain("LEGACY_FALLBACK_AI_CAP_REACHED");
    expect(workflow).toContain('legacy_expensive_attempts=$((legacy_expensive_attempts + 1))');
    expect(workflow).toContain('legacy_expensive_attempts" -ge "$LEGACY_FALLBACK_MAX_EXPENSIVE_ATTEMPTS');
  });

  it("does not retry a possibly-paid legacy response", () => {
    expect(workflow).not.toContain("for attempt in 1 2");
    expect(workflow).not.toContain('if [[ "$attempt" -lt 2 ]]');
    expect(workflow).not.toContain("sleep 10");
  });

  it("still scans no-item offsets and preserves the reserve safety net", () => {
    expect(workflow).toContain("for offset in $(seq 0 9)");
    expect(workflow).toContain(".no_items == true");
    expect(workflow).toContain("publishing-safety-net");
    expect(workflow).toContain("DAILY_NEWS_PUBLISH_SUCCESS inserted=");
  });
});
