import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { staleUncommittedNewsroomMemberships } from "./newsroom-cluster-membership-reconciliation";

describe("live newsroom cluster-membership reconciliation", () => {
  const desired = [
    { cluster_id: "current", feed_item_id: 10 },
    { cluster_id: "current", feed_item_id: 11 },
    { cluster_id: "other", feed_item_id: 12 },
  ];
  it("cleans only stale uncommitted duplicate memberships", () => {
    const old = [
      ...desired,
      { cluster_id: "obsolete", feed_item_id: 10 },
      { cluster_id: "obsolete", feed_item_id: 11 },
      { cluster_id: "obsolete", feed_item_id: 10 }, // paginated duplicate harmless
      { cluster_id: "unrelated", feed_item_id: 99 },
    ];
    const result = staleUncommittedNewsroomMemberships(
      desired, old,
      [{ id: "current", status: "READY" }, { id: "obsolete", status: "READY" }, { id: "unrelated", status: "READY" }],
      [{ cluster_id: "obsolete", status: "PENDING" }],
    );
    expect(result.obsolete).toEqual([
      { cluster_id: "obsolete", feed_item_id: 10 },
      { cluster_id: "obsolete", feed_item_id: 11 },
    ]);
    expect(result.protectedCount).toBe(0);
  });

  it("preserves PUBLISHED, SELECTED and HELD cluster histories even if they overlap", () => {
    const old = [
      { cluster_id: "published", feed_item_id: 10 },
      { cluster_id: "selected", feed_item_id: 10 },
      { cluster_id: "held", feed_item_id: 10 },
      { cluster_id: "candidate-held", feed_item_id: 10 },
      { cluster_id: "candidate-selected", feed_item_id: 11 },
    ];
    const result = staleUncommittedNewsroomMemberships(
      desired, old,
      [
        { id: "published", status: "PUBLISHED" },
        { id: "selected", status: "SELECTED" },
        { id: "held", status: "HELD" },
        { id: "candidate-held", status: "READY" },
        { id: "candidate-selected", status: "READY" },
      ],
      [
        { cluster_id: "candidate-held", status: "HELD" },
        { cluster_id: "candidate-selected", status: "SELECTED" },
      ],
    );
    expect(result.obsolete).toEqual([]);
    expect(result.protectedCount).toBe(5);
  });

  it("never deletes unknown or out-of-window feed item assignments", () => {
    const result = staleUncommittedNewsroomMemberships(
      desired, [{ cluster_id: "older", feed_item_id: 123 }],
      [{ id: "older", status: "READY" }], [],
    );
    expect(result.obsolete).toHaveLength(0);
  });

  it("runs after the current assignment is saved, refreshes counts, and closes empty PENDING duplicates", () => {
    const code = readFileSync("src/routes/api/public/hooks/cluster-newsroom-stories.ts", "utf8");
    expect(code.indexOf('.upsert(membershipsToWrite, { onConflict: "cluster_id,feed_item_id" })')).toBeLessThan(
      code.indexOf("staleUncommittedNewsroomMemberships("),
    );
    expect(code).toContain('.in("feed_item_id", batch)');
    expect(code).toContain('.in("status", ["DISCOVERED", "READY"])');
    expect(code).toContain('countDistinctNewsSources(sourceRows)');
    expect(code).toContain('countDistinctPrimaryNewsSources(sourceRows)');
    expect(code).toContain('status: "ARCHIVED"');
    expect(code).toContain('superseded_empty_reconciled_newsroom_cluster');
    expect(code).toContain('staleMembershipsRemoved,');
    expect(code).toContain('protectedHistoricalMemberships,');
    expect(code).not.toContain('status: "PUBLISHED"');
  });
});
