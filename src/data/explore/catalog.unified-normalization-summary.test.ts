import { describe, expect, it } from "vitest";
import type { UnifiedNormalizationAudit } from "./catalog.unified-normalization-audit";
import {
  buildUnifiedNormalizationSummary,
  unifiedNormalizationSummary,
} from "./catalog.unified-normalization-summary";

describe("unified normalization health summary", () => {
  it("reports full canonical slug and source coverage for the production catalog", () => {
    expect(unifiedNormalizationSummary.destinationCount).toBeGreaterThan(0);
    expect(unifiedNormalizationSummary.canonicalSlugCoveragePercent).toBe(100);
    expect(unifiedNormalizationSummary.sourceCoveragePercent).toBe(100);
    expect(unifiedNormalizationSummary.errorCount).toBe(0);
    expect(unifiedNormalizationSummary.passed).toBe(true);
  });

  it("keeps issue totals synchronized with the review queue", () => {
    const reviewIssueCount = Object.entries(
      unifiedNormalizationSummary.issueCountByType,
    )
      .filter(([type]) =>
        [
          "duplicate-official-url",
          "duplicate-normalized-name",
          "duplicate-coordinate",
          "missing-source",
        ].includes(type),
      )
      .reduce((total, [, count]) => total + count, 0);

    expect(unifiedNormalizationSummary.reviewQueue).toHaveLength(reviewIssueCount);
    expect(unifiedNormalizationSummary.reviewQueue.every(
      (issue) => issue.severity === "review",
    )).toBe(true);
  });

  it("calculates coverage and sorts review items deterministically", () => {
    const audit: UnifiedNormalizationAudit = {
      destinationCount: 4,
      uniqueIdCount: 4,
      uniqueSlugCount: 4,
      canonicalSlugCount: 3,
      sourcedDestinationCount: 2,
      validCoordinatePairCount: 1,
      duplicateIdGroups: [],
      duplicateSlugGroups: [],
      duplicateOfficialUrlGroups: [
        {
          type: "duplicate-official-url",
          key: "z-url",
          destinationSlugs: ["a", "b"],
          severity: "review",
        },
      ],
      duplicateNormalizedNameGroups: [
        {
          type: "duplicate-normalized-name",
          key: "a-name",
          destinationSlugs: ["c", "d"],
          severity: "review",
        },
      ],
      duplicateCoordinateGroups: [],
      noncanonicalSlugIssues: [
        {
          type: "noncanonical-slug",
          key: "Bad Slug",
          destinationSlugs: ["Bad Slug"],
          severity: "error",
        },
      ],
      missingSourceIssues: [],
      invalidCoordinatePairIssues: [],
      issues: [
        {
          type: "duplicate-official-url",
          key: "z-url",
          destinationSlugs: ["a", "b"],
          severity: "review",
        },
        {
          type: "duplicate-normalized-name",
          key: "a-name",
          destinationSlugs: ["c", "d"],
          severity: "review",
        },
        {
          type: "noncanonical-slug",
          key: "Bad Slug",
          destinationSlugs: ["Bad Slug"],
          severity: "error",
        },
      ],
      errorCount: 1,
      reviewCount: 2,
      passed: false,
    };

    const summary = buildUnifiedNormalizationSummary(audit);

    expect(summary.sourceCoveragePercent).toBe(50);
    expect(summary.coordinateCoveragePercent).toBe(25);
    expect(summary.canonicalSlugCoveragePercent).toBe(75);
    expect(summary.issueCountByType["noncanonical-slug"]).toBe(1);
    expect(summary.reviewQueue.map((issue) => issue.type)).toEqual([
      "duplicate-normalized-name",
      "duplicate-official-url",
    ]);
    expect(summary.passed).toBe(false);
  });

  it("treats an empty catalog as fully covered", () => {
    const audit: UnifiedNormalizationAudit = {
      destinationCount: 0,
      uniqueIdCount: 0,
      uniqueSlugCount: 0,
      canonicalSlugCount: 0,
      sourcedDestinationCount: 0,
      validCoordinatePairCount: 0,
      duplicateIdGroups: [],
      duplicateSlugGroups: [],
      duplicateOfficialUrlGroups: [],
      duplicateNormalizedNameGroups: [],
      duplicateCoordinateGroups: [],
      noncanonicalSlugIssues: [],
      missingSourceIssues: [],
      invalidCoordinatePairIssues: [],
      issues: [],
      errorCount: 0,
      reviewCount: 0,
      passed: true,
    };

    const summary = buildUnifiedNormalizationSummary(audit);

    expect(summary.sourceCoveragePercent).toBe(100);
    expect(summary.coordinateCoveragePercent).toBe(100);
    expect(summary.canonicalSlugCoveragePercent).toBe(100);
    expect(summary.reviewQueue).toEqual([]);
  });
});
