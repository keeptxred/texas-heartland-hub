import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { runNewsroomHistoricalBacktest } from "./newsroom-backtest";

const server = fs.readFileSync(new URL("./newsroom-backtest.functions.ts", import.meta.url), "utf8");
const route = fs.readFileSync(new URL("../routes/admin/newsroom-backtest.tsx", import.meta.url), "utf8");

describe("newsroom Phase 12 historical backtesting", () => {
  it("replays deterministic decisions and observed outcomes", () => {
    const result = runNewsroomHistoricalBacktest({
      candidates: [
        { id: "c1", clusterId: "a", editorialScore: 72, recommendedFormat: "MERGE", status: "PUBLISHED", publishedAt: "2026-08-10T12:00:00Z", createdAt: "2026-08-10T10:00:00Z" },
        { id: "c2", clusterId: "b", editorialScore: 42, recommendedFormat: "SKIP", status: "PENDING", publishedAt: null, createdAt: "2026-08-10T11:00:00Z" },
        { id: "c3", clusterId: "c", editorialScore: 66, recommendedFormat: "SYNTHESIS", status: "PUBLISHED", publishedAt: "2026-08-10T13:00:00Z", createdAt: "2026-08-10T12:00:00Z" },
      ],
      clusters: [
        { id: "a", canonicalSubject: "Texas event A", pillarSlug: "texas-news", sourceCount: 2, primarySourceCount: 1, firstSeenAt: "2026-08-10T09:00:00Z", lastSeenAt: "2026-08-10T10:00:00Z", publishedAt: null },
        { id: "b", canonicalSubject: "Texas event B", pillarSlug: "business", sourceCount: 1, primarySourceCount: 0, firstSeenAt: "2026-08-10T10:00:00Z", lastSeenAt: "2026-08-10T11:00:00Z", publishedAt: null },
        { id: "c", canonicalSubject: "Texas trend C", pillarSlug: "politics", sourceCount: 3, primarySourceCount: 1, firstSeenAt: "2026-08-10T11:00:00Z", lastSeenAt: "2026-08-10T12:00:00Z", publishedAt: null },
      ],
      memberships: [
        { clusterId: "a", relationshipType: "same-event", isPrimarySource: true },
        { clusterId: "c", relationshipType: "trend-signal", isPrimarySource: false },
        { clusterId: "c", relationshipType: "trend-signal", isPrimarySource: false },
      ],
    });

    expect(result.totalCandidates).toBe(3);
    expect(result.publishedCandidates).toBe(2);
    expect(result.decisionCounts).toEqual({ SKIP: 1, SINGLE: 0, MERGE: 1, SYNTHESIS: 1 });
    expect(result.captureRate).toBe(100);
    expect(result.publishedMissed).toBe(0);
    expect(result.historicalAgreementRate).toBe(100);
    expect(result.thresholdSweep.find((row) => row.threshold === 45)).toMatchObject({ advanced: 2, publishedCaptured: 2, captureRate: 100 });
  });

  it("exposes a useful threshold tradeoff when a published item scores below 45", () => {
    const result = runNewsroomHistoricalBacktest({
      candidates: [
        { id: "c1", clusterId: "a", editorialScore: 40, recommendedFormat: "SKIP", status: "PUBLISHED", publishedAt: "2026-08-10T12:00:00Z", createdAt: "2026-08-10T10:00:00Z" },
        { id: "c2", clusterId: "b", editorialScore: 60, recommendedFormat: "SINGLE", status: "PUBLISHED", publishedAt: "2026-08-10T12:30:00Z", createdAt: "2026-08-10T10:30:00Z" },
      ],
      clusters: [
        { id: "a", canonicalSubject: "A", pillarSlug: null, sourceCount: 1, primarySourceCount: 0, firstSeenAt: "2026-08-10T09:00:00Z", lastSeenAt: "2026-08-10T10:00:00Z", publishedAt: null },
        { id: "b", canonicalSubject: "B", pillarSlug: null, sourceCount: 1, primarySourceCount: 1, firstSeenAt: "2026-08-10T09:30:00Z", lastSeenAt: "2026-08-10T10:30:00Z", publishedAt: null },
      ],
      memberships: [],
    });

    expect(result.captureRate).toBe(50);
    expect(result.publishedMissed).toBe(1);
    expect(result.thresholdSweep.find((row) => row.threshold === 40)?.captureRate).toBe(100);
    expect(result.thresholdSweep.find((row) => row.threshold === 45)?.captureRate).toBe(50);
  });

  it("keeps the Phase 12 server read-only and zero-AI", () => {
    expect(server).toContain('aiCalls: 0');
    expect(server).toContain('writes: 0');
    expect(server).toContain('.from("news_publish_candidates")');
    expect(server).toContain('.from("news_story_clusters")');
    expect(server).not.toContain("runCloudflareJson");
    expect(server).not.toContain("newsroom_reserve_ai_generation");
    expect(server).not.toContain(".insert(");
    expect(server).not.toContain(".update(");
    expect(server).not.toContain(".upsert(");
    expect(server).not.toContain('from("daily_articles")');
    expect(route).toContain("Historical Newsroom Backtest");
    expect(route).toContain("no AI calls, no budget reservations, no publishing, and no database writes");
  });
});
