import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { eligibleImageBackfillAge, NEWS_IMAGE_BACKFILL_MAX_AGE_DAYS } from "./image-backlog-age-policy";

const recovery = readFileSync(new URL("../routes/api/public/hooks/image-backlog-recovery.ts", import.meta.url), "utf8");
const now = Date.parse("2026-11-08T12:00:00Z");
const daysAgo = (days: number) => new Date(now - days * 86400_000).toISOString();

describe("archive photo age policy", () => {
  it("does not generate photographs of months-old news scenes", () => {
    expect(NEWS_IMAGE_BACKFILL_MAX_AGE_DAYS).toBe(14);
    expect(eligibleImageBackfillAge("news", daysAgo(36), now)).toBe(false);
    expect(eligibleImageBackfillAge("ingested", daysAgo(30), now)).toBe(false);
    expect(eligibleImageBackfillAge("sports-nfl", daysAgo(20), now)).toBe(false);
  });

  it("retains current-event and evergreen image work", () => {
    expect(eligibleImageBackfillAge("news", daysAgo(4), now)).toBe(true);
    expect(eligibleImageBackfillAge("news", daysAgo(14), now)).toBe(true);
    expect(eligibleImageBackfillAge("evergreen", daysAgo(180), now)).toBe(true);
    expect(eligibleImageBackfillAge("EVERGREEN", daysAgo(365), now)).toBe(true);
  });

  it("rejects future, invalid or unpublished dates rather than guessing", () => {
    expect(eligibleImageBackfillAge("news", "", now)).toBe(false);
    expect(eligibleImageBackfillAge("news", "not-a-date", now)).toBe(false);
    expect(eligibleImageBackfillAge("news", new Date(now + 1000).toISOString(), now)).toBe(false);
  });

  it("preserves quality-gated visual review for any surviving eligible row", () => {
    expect(recovery).toContain("if (!eligibleImageBackfillAge(row.kind, row.published_at)) return false;");
    expect(recovery).toContain("if (row.image_candidate_url?.trim()) return false;");
    expect(recovery).toContain("meetsArticleMainWordCount(row.kind, row.body_json)");
    expect(recovery).toContain("generateFeaturedImageForSlugDirect(requestedSlug, true)");
    expect(recovery).toContain("hasHeroVisualReadinessProvenance");
  });
});
