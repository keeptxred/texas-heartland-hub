import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateNewsroomShadowProduction } from "./newsroom-shadow-production";

const server = fs.readFileSync(new URL("./newsroom-shadow-production.functions.ts", import.meta.url), "utf8");
const route = fs.readFileSync(new URL("../routes/admin/newsroom-shadow.tsx", import.meta.url), "utf8");

describe("newsroom Phase 13 shadow production", () => {
  it("replays live decisions, selects standalone and brief slates, and detects drift", () => {
    const candidates = Array.from({ length: 12 }, (_, index) => ({
      id: `c${index + 1}`,
      clusterId: `k${index + 1}`,
      editorialScore: 80 - index * 2,
      recommendedFormat: index === 1 ? "SINGLE" : "MERGE",
      status: "PENDING",
      createdAt: "2026-08-16T10:00:00Z",
    }));
    const clusters = candidates.map((candidate, index) => ({
      id: candidate.clusterId,
      canonicalSubject: `Texas live story ${index + 1}`,
      pillarSlug: index % 2 ? "sports" : "texas-news",
      sourceCount: 2,
      primarySourceCount: 1,
      firstSeenAt: `2026-08-16T0${Math.min(index, 9)}:00:00Z`,
    }));
    const result = evaluateNewsroomShadowProduction({
      candidates,
      clusters,
      memberships: clusters.map((cluster) => ({ clusterId: cluster.id, relationshipType: "same-event", isPrimarySource: true })),
      packets: clusters.map((cluster) => ({ clusterId: cluster.id })),
      drafts: [],
    });

    expect(result.totalCandidates).toBe(12);
    expect(result.advancedCandidates).toBe(12);
    expect(result.decisionDriftCount).toBe(1);
    expect(result.standaloneSelection).toHaveLength(8);
    expect(result.dailyBriefSelection).toHaveLength(4);
    expect(result.packetCoverageRate).toBe(100);
    expect(result.draftStats.publishedFromShadow).toBe(0);
    expect(result.readyForControlledLaunch).toBe(false);
  });

  it("fails readiness if a shadow draft appears published", () => {
    const result = evaluateNewsroomShadowProduction({
      candidates: [{ id: "c1", clusterId: "k1", editorialScore: 70, recommendedFormat: "SINGLE", status: "HELD", createdAt: "2026-08-16T10:00:00Z" }],
      clusters: [{ id: "k1", canonicalSubject: "Texas story", pillarSlug: "texas-news", sourceCount: 1, primarySourceCount: 1, firstSeenAt: "2026-08-16T09:00:00Z" }],
      memberships: [{ clusterId: "k1", relationshipType: "same-event", isPrimarySource: true }],
      packets: [{ clusterId: "k1" }],
      drafts: [{ id: "d1", candidateId: "c1", clusterId: "k1", mode: "shadow", status: "PUBLISHED", mainWordCount: 1000, validationReasons: [], publishedArticleId: "a1", createdAt: "2026-08-16T11:00:00Z" }],
    });

    expect(result.draftStats.publishedFromShadow).toBe(1);
    expect(result.readiness.find((check) => check.key === "shadow_publication")?.passed).toBe(false);
    expect(result.readyForControlledLaunch).toBe(false);
  });

  it("keeps the Phase 13 observer read-only, zero-AI and zero-budget", () => {
    expect(server).toContain("aiCalls: 0");
    expect(server).toContain("budgetReservations: 0");
    expect(server).toContain("writes: 0");
    expect(server).toContain("publishes: 0");
    expect(server).toContain('.from("news_publish_candidates")');
    expect(server).toContain('.from("newsroom_generation_drafts")');
    expect(server).not.toContain("runCloudflareJson");
    expect(server).not.toContain("newsroom_reserve_ai_generation");
    expect(server).not.toContain(".insert(");
    expect(server).not.toContain(".update(");
    expect(server).not.toContain(".upsert(");
    expect(server).not.toContain('from("daily_articles")');
    expect(route).toContain("Newsroom Shadow Production");
    expect(route).toContain("This page never invokes AI");
  });
});
