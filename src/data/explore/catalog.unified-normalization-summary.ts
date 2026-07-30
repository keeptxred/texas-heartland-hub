import {
  unifiedNormalizationAudit,
  type UnifiedNormalizationAudit,
  type UnifiedNormalizationIssue,
  type UnifiedNormalizationIssueType,
} from "./catalog.unified-normalization-audit";

export type UnifiedNormalizationSummary = {
  destinationCount: number;
  errorCount: number;
  reviewCount: number;
  passed: boolean;
  sourceCoveragePercent: number;
  coordinateCoveragePercent: number;
  canonicalSlugCoveragePercent: number;
  issueCountByType: Record<UnifiedNormalizationIssueType, number>;
  reviewQueue: UnifiedNormalizationIssue[];
};

const ISSUE_TYPES: UnifiedNormalizationIssueType[] = [
  "duplicate-id",
  "duplicate-slug",
  "duplicate-official-url",
  "duplicate-normalized-name",
  "duplicate-coordinate",
  "noncanonical-slug",
  "missing-source",
  "invalid-coordinate-pair",
];

function percentage(value: number, total: number): number {
  if (total === 0) return 100;
  return Number(((value / total) * 100).toFixed(2));
}

export function buildUnifiedNormalizationSummary(
  audit: UnifiedNormalizationAudit = unifiedNormalizationAudit,
): UnifiedNormalizationSummary {
  const issueCountByType = Object.fromEntries(
    ISSUE_TYPES.map((type) => [
      type,
      audit.issues.filter((issue) => issue.type === type).length,
    ]),
  ) as Record<UnifiedNormalizationIssueType, number>;

  return {
    destinationCount: audit.destinationCount,
    errorCount: audit.errorCount,
    reviewCount: audit.reviewCount,
    passed: audit.passed,
    sourceCoveragePercent: percentage(
      audit.sourcedDestinationCount,
      audit.destinationCount,
    ),
    coordinateCoveragePercent: percentage(
      audit.validCoordinatePairCount,
      audit.destinationCount,
    ),
    canonicalSlugCoveragePercent: percentage(
      audit.canonicalSlugCount,
      audit.destinationCount,
    ),
    issueCountByType,
    reviewQueue: audit.issues
      .filter((issue) => issue.severity === "review")
      .sort((a, b) => a.type.localeCompare(b.type) || a.key.localeCompare(b.key)),
  };
}

export const unifiedNormalizationSummary = buildUnifiedNormalizationSummary();
