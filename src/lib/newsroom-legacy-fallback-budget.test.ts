import fs from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = fs.readFileSync(
  new URL("../../.github/workflows/run-daily-news-now.yml", import.meta.url),
  "utf8",
);
const legacyWriter = fs.readFileSync(
  new URL("../routes/api/public/hooks/generate-news.ts", import.meta.url),
  "utf8",
);

describe("retired newsroom legacy fallback", () => {
  it("removes the legacy RSS fallback from the scheduled publisher", () => {
    expect(workflow).not.toContain("LEGACY_FALLBACK_MAX_EXPENSIVE_ATTEMPTS");
    expect(workflow).not.toContain("legacy_expensive_attempts");
    expect(workflow).not.toContain("LEGACY_FALLBACK_AI_CAP_REACHED");
    expect(workflow).not.toContain("Continuing to legacy ranked RSS publisher");
    expect(workflow).not.toContain("/api/public/hooks/generate-news'");
    expect(workflow).not.toContain("for offset in $(seq 0 9)");
  });

  it("makes the old writer incapable of a paid or database-writing retry", () => {
    expect(legacyWriter).toContain("LEGACY_GENERATE_NEWS_DISABLED = true");
    expect(legacyWriter).toContain("aiCalls: 0");
    expect(legacyWriter).toContain("inserted: 0");
    expect(legacyWriter).not.toContain("fetch(");
    expect(legacyWriter).not.toContain("runCloudflareJson");
    expect(legacyWriter).not.toMatch(/\.from\(["']daily_articles["']\)/);
  });

  it("preserves the quality-gated newsroom and reserve safety net", () => {
    expect(workflow).toContain("publish-overdue-gap");
    expect(workflow).toContain("generate-newsroom?mode=publish");
    expect(workflow).toContain("publishing-safety-net");
    expect(workflow).toContain("No lower-quality writer will be attempted.");
    expect(workflow).toContain("DAILY_NEWS_PUBLISH_SUCCESS no_quality_gated_article=true reserve_published=false");
  });
});
