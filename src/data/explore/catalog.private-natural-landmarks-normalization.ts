import { exploreDestinations } from "./all-destinations";
import { privateNaturalLandmarkAccessAudit } from "./catalog.private-natural-landmarks-access";
import { privateNaturalLandmarkDestinations } from "./catalog.private-natural-landmarks.entities";
import { privateNaturalLandmarkCatalog } from "./catalog.private-natural-landmarks";

export type PrivateNaturalLandmarkNormalizationIssue = {
  landmarkSlug: string;
  code:
    | "missing-entity"
    | "missing-access-audit"
    | "missing-unified-destination"
    | "duplicate-unified-destination"
    | "canonical-slug-mismatch"
    | "source-mismatch"
    | "ownership-mismatch"
    | "access-model-mismatch"
    | "invalid-coordinates"
    | "missing-normalized-tag";
  message: string;
};

export type PrivateNaturalLandmarkNormalizationAudit = {
  landmarkCount: number;
  entityCount: number;
  accessAuditCount: number;
  resolvedUnifiedDestinationCount: number;
  issues: readonly PrivateNaturalLandmarkNormalizationIssue[];
  passed: boolean;
};

function coordinatesAreValid(latitude: number | null, longitude: number | null): boolean {
  return latitude !== null &&
    longitude !== null &&
    latitude >= 25 &&
    latitude <= 37 &&
    longitude >= -107 &&
    longitude <= -93;
}

export function auditPrivateNaturalLandmarkNormalization(): PrivateNaturalLandmarkNormalizationAudit {
  const issues: PrivateNaturalLandmarkNormalizationIssue[] = [];
  let resolvedUnifiedDestinationCount = 0;

  for (const landmark of privateNaturalLandmarkCatalog) {
    const entity = privateNaturalLandmarkDestinations.find(
      (destination) => destination.slug === landmark.slug,
    );
    const accessAudit = privateNaturalLandmarkAccessAudit.find(
      (record) => record.landmarkSlug === landmark.slug,
    );
    const unifiedMatches = exploreDestinations.filter(
      (destination) => destination.slug === landmark.slug,
    );
    const unifiedDestination = unifiedMatches[0];

    if (!entity) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "missing-entity",
        message: `No ExploreEntity was generated for ${landmark.name}.`,
      });
    }

    if (!accessAudit) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "missing-access-audit",
        message: `No ownership and access audit record exists for ${landmark.name}.`,
      });
    }

    if (!unifiedDestination) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "missing-unified-destination",
        message: `${landmark.name} does not resolve in the unified destination catalog.`,
      });
      continue;
    }

    resolvedUnifiedDestinationCount += 1;

    if (unifiedMatches.length > 1) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "duplicate-unified-destination",
        message: `${landmark.name} resolves ${unifiedMatches.length} times in the unified catalog.`,
      });
    }

    if (unifiedDestination.id !== landmark.slug || unifiedDestination.slug !== landmark.slug) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "canonical-slug-mismatch",
        message: `${landmark.name} does not use its canonical slug for both id and slug.`,
      });
    }

    if (
      unifiedDestination.officialUrl !== landmark.officialUrl ||
      unifiedDestination.sourceUrl !== landmark.officialUrl ||
      unifiedDestination.sourceName !== landmark.sourceName
    ) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "source-mismatch",
        message: `${landmark.name} does not preserve its official source metadata.`,
      });
    }

    if (
      unifiedDestination.profile?.ownershipClassification !== landmark.ownershipClassification
    ) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "ownership-mismatch",
        message: `${landmark.name} does not preserve its ownership classification.`,
      });
    }

    if (unifiedDestination.profile?.accessType !== landmark.accessModel) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "access-model-mismatch",
        message: `${landmark.name} does not preserve its visitor access model.`,
      });
    }

    if (!coordinatesAreValid(unifiedDestination.latitude, unifiedDestination.longitude)) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "invalid-coordinates",
        message: `${landmark.name} has missing or out-of-range Texas coordinates.`,
      });
    }

    if (!unifiedDestination.tags.includes("private natural landmark")) {
      issues.push({
        landmarkSlug: landmark.slug,
        code: "missing-normalized-tag",
        message: `${landmark.name} is missing the normalized private natural landmark tag.`,
      });
    }
  }

  return {
    landmarkCount: privateNaturalLandmarkCatalog.length,
    entityCount: privateNaturalLandmarkDestinations.length,
    accessAuditCount: privateNaturalLandmarkAccessAudit.length,
    resolvedUnifiedDestinationCount,
    issues,
    passed: issues.length === 0,
  };
}

export const privateNaturalLandmarkNormalizationAudit =
  auditPrivateNaturalLandmarkNormalization();
