import type { ExploreEntity } from "@/types/explore/public";
import { exploreDestinations } from "./all-destinations";

export type UnifiedNormalizationIssueType =
  | "duplicate-id"
  | "duplicate-slug"
  | "duplicate-official-url"
  | "duplicate-normalized-name"
  | "duplicate-coordinate"
  | "noncanonical-slug"
  | "missing-source"
  | "invalid-coordinate-pair";

export type UnifiedNormalizationIssue = {
  type: UnifiedNormalizationIssueType;
  key: string;
  destinationSlugs: string[];
  severity: "error" | "review";
};

export type UnifiedNormalizationAudit = {
  destinationCount: number;
  uniqueIdCount: number;
  uniqueSlugCount: number;
  canonicalSlugCount: number;
  sourcedDestinationCount: number;
  validCoordinatePairCount: number;
  duplicateIdGroups: UnifiedNormalizationIssue[];
  duplicateSlugGroups: UnifiedNormalizationIssue[];
  duplicateOfficialUrlGroups: UnifiedNormalizationIssue[];
  duplicateNormalizedNameGroups: UnifiedNormalizationIssue[];
  duplicateCoordinateGroups: UnifiedNormalizationIssue[];
  noncanonicalSlugIssues: UnifiedNormalizationIssue[];
  missingSourceIssues: UnifiedNormalizationIssue[];
  invalidCoordinatePairIssues: UnifiedNormalizationIssue[];
  issues: UnifiedNormalizationIssue[];
  errorCount: number;
  reviewCount: number;
  passed: boolean;
};

function canonicalSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizedName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizedUrl(value: string): string {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.trim().toLowerCase().replace(/\/+$/, "");
  }
}

function coordinateKey(destination: ExploreEntity): string | null {
  if (destination.latitude == null || destination.longitude == null) return null;
  return `${destination.latitude.toFixed(5)},${destination.longitude.toFixed(5)}`;
}

function groupBy(
  destinations: readonly ExploreEntity[],
  getKey: (destination: ExploreEntity) => string | null,
): Map<string, ExploreEntity[]> {
  const groups = new Map<string, ExploreEntity[]>();

  for (const destination of destinations) {
    const key = getKey(destination);
    if (!key) continue;
    const group = groups.get(key) ?? [];
    group.push(destination);
    groups.set(key, group);
  }

  return groups;
}

function duplicateIssues(
  type: UnifiedNormalizationIssueType,
  groups: Map<string, ExploreEntity[]>,
  severity: UnifiedNormalizationIssue["severity"],
): UnifiedNormalizationIssue[] {
  return [...groups.entries()]
    .filter(([, destinations]) => destinations.length > 1)
    .map(([key, destinations]) => ({
      type,
      key,
      destinationSlugs: destinations.map((destination) => destination.slug).sort(),
      severity,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

export function buildUnifiedNormalizationAudit(
  destinations: readonly ExploreEntity[] = exploreDestinations,
): UnifiedNormalizationAudit {
  const duplicateIdGroups = duplicateIssues(
    "duplicate-id",
    groupBy(destinations, (destination) => destination.id),
    "error",
  );
  const duplicateSlugGroups = duplicateIssues(
    "duplicate-slug",
    groupBy(destinations, (destination) => destination.slug),
    "error",
  );
  const duplicateOfficialUrlGroups = duplicateIssues(
    "duplicate-official-url",
    groupBy(destinations, (destination) =>
      destination.officialUrl ? normalizedUrl(destination.officialUrl) : null,
    ),
    "review",
  );
  const duplicateNormalizedNameGroups = duplicateIssues(
    "duplicate-normalized-name",
    groupBy(destinations, (destination) => normalizedName(destination.name)),
    "review",
  );
  const duplicateCoordinateGroups = duplicateIssues(
    "duplicate-coordinate",
    groupBy(destinations, coordinateKey),
    "review",
  );

  const noncanonicalSlugIssues = destinations
    .filter((destination) => destination.slug !== canonicalSlug(destination.slug))
    .map((destination) => ({
      type: "noncanonical-slug" as const,
      key: destination.slug,
      destinationSlugs: [destination.slug],
      severity: "error" as const,
    }));

  const missingSourceIssues = destinations
    .filter(
      (destination) =>
        !destination.sourceName?.trim() ||
        !(destination.sourceUrl?.trim() || destination.officialUrl?.trim()),
    )
    .map((destination) => ({
      type: "missing-source" as const,
      key: destination.slug,
      destinationSlugs: [destination.slug],
      severity: "review" as const,
    }));

  const invalidCoordinatePairIssues = destinations
    .filter(
      (destination) =>
        (destination.latitude == null) !== (destination.longitude == null) ||
        (destination.latitude != null &&
          (destination.latitude < 25 || destination.latitude > 37)) ||
        (destination.longitude != null &&
          (destination.longitude < -107 || destination.longitude > -93)),
    )
    .map((destination) => ({
      type: "invalid-coordinate-pair" as const,
      key: destination.slug,
      destinationSlugs: [destination.slug],
      severity: "error" as const,
    }));

  const issues = [
    ...duplicateIdGroups,
    ...duplicateSlugGroups,
    ...duplicateOfficialUrlGroups,
    ...duplicateNormalizedNameGroups,
    ...duplicateCoordinateGroups,
    ...noncanonicalSlugIssues,
    ...missingSourceIssues,
    ...invalidCoordinatePairIssues,
  ];

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const reviewCount = issues.filter((issue) => issue.severity === "review").length;

  return {
    destinationCount: destinations.length,
    uniqueIdCount: new Set(destinations.map((destination) => destination.id)).size,
    uniqueSlugCount: new Set(destinations.map((destination) => destination.slug)).size,
    canonicalSlugCount: destinations.filter(
      (destination) => destination.slug === canonicalSlug(destination.slug),
    ).length,
    sourcedDestinationCount: destinations.filter(
      (destination) =>
        Boolean(destination.sourceName?.trim()) &&
        Boolean(destination.sourceUrl?.trim() || destination.officialUrl?.trim()),
    ).length,
    validCoordinatePairCount: destinations.filter(
      (destination) =>
        destination.latitude != null &&
        destination.longitude != null &&
        destination.latitude >= 25 &&
        destination.latitude <= 37 &&
        destination.longitude >= -107 &&
        destination.longitude <= -93,
    ).length,
    duplicateIdGroups,
    duplicateSlugGroups,
    duplicateOfficialUrlGroups,
    duplicateNormalizedNameGroups,
    duplicateCoordinateGroups,
    noncanonicalSlugIssues,
    missingSourceIssues,
    invalidCoordinatePairIssues,
    issues,
    errorCount,
    reviewCount,
    passed: errorCount === 0,
  };
}

export const unifiedNormalizationAudit = buildUnifiedNormalizationAudit();
