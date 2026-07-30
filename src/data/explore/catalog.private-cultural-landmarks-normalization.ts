import { privateCulturalLandmarkCatalog } from "./catalog.private-cultural-landmarks";
import { privateCulturalLandmarkAccessAudit } from "./catalog.private-cultural-landmarks-access";
import { privateCulturalLandmarkDestinations } from "./catalog.private-cultural-landmarks.entities";
import { privateCulturalLandmarkCollections } from "./collections.private-cultural-landmarks";

export type PrivateCulturalLandmarkNormalizationIssue = {
  slug: string;
  code: string;
  message: string;
};

export type PrivateCulturalLandmarkNormalizationAudit = {
  landmarkCount: number;
  entityCount: number;
  accessAuditCount: number;
  collectionCount: number;
  issues: PrivateCulturalLandmarkNormalizationIssue[];
  passed: boolean;
};

export function auditPrivateCulturalLandmarkNormalization(): PrivateCulturalLandmarkNormalizationAudit {
  const issues: PrivateCulturalLandmarkNormalizationIssue[] = [];
  const entityBySlug = new Map(
    privateCulturalLandmarkDestinations.map((destination) => [destination.slug, destination]),
  );
  const accessBySlug = new Map(
    privateCulturalLandmarkAccessAudit.map((record) => [record.landmarkSlug, record]),
  );

  for (const landmark of privateCulturalLandmarkCatalog) {
    const destination = entityBySlug.get(landmark.slug);
    const access = accessBySlug.get(landmark.slug);

    if (!destination) {
      issues.push({ slug: landmark.slug, code: "missing-entity", message: "No destination entity exists." });
    } else {
      if (destination.officialUrl !== landmark.officialUrl || destination.sourceName !== landmark.sourceName) {
        issues.push({ slug: landmark.slug, code: "source-mismatch", message: "Official source metadata differs." });
      }
      if (destination.latitude !== landmark.latitude || destination.longitude !== landmark.longitude) {
        issues.push({ slug: landmark.slug, code: "coordinate-mismatch", message: "Coordinates differ from the catalog." });
      }
    }

    if (!access) {
      issues.push({ slug: landmark.slug, code: "missing-access-audit", message: "No access audit record exists." });
    } else if (
      access.ownershipClassification !== landmark.ownershipClassification ||
      access.accessModel !== landmark.accessModel ||
      access.admissionRequired !== landmark.admissionRequired ||
      access.reservationsRequired !== landmark.reservationsRequired ||
      access.guidedTourAvailable !== landmark.guidedTourAvailable ||
      access.overnightAccess !== landmark.overnightAccess
    ) {
      issues.push({ slug: landmark.slug, code: "access-mismatch", message: "Access classification differs from the catalog." });
    }
  }

  const catalogSlugs = privateCulturalLandmarkCatalog.map(({ slug }) => slug);
  for (const [label, values] of [
    ["catalog", catalogSlugs],
    ["entities", privateCulturalLandmarkDestinations.map(({ slug }) => slug)],
    ["access-audit", privateCulturalLandmarkAccessAudit.map(({ landmarkSlug }) => landmarkSlug)],
  ] as const) {
    if (new Set(values).size !== values.length) {
      issues.push({ slug: "*", code: `duplicate-${label}`, message: `${label} contains duplicate slugs.` });
    }
  }

  const unresolvedCollectionSlugs = privateCulturalLandmarkCollections.flatMap((collection) =>
    collection.destinationSlugs.filter((slug) => !entityBySlug.has(slug)),
  );
  for (const slug of new Set(unresolvedCollectionSlugs)) {
    issues.push({ slug, code: "unresolved-collection-destination", message: "A discovery collection references an unknown destination." });
  }

  return {
    landmarkCount: privateCulturalLandmarkCatalog.length,
    entityCount: privateCulturalLandmarkDestinations.length,
    accessAuditCount: privateCulturalLandmarkAccessAudit.length,
    collectionCount: privateCulturalLandmarkCollections.length,
    issues,
    passed: issues.length === 0,
  };
}

export const privateCulturalLandmarkNormalizationAudit =
  auditPrivateCulturalLandmarkNormalization();
