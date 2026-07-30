import { exploreDestinations } from "./all-destinations";
import { majorSpringCatalog } from "./catalog.major-springs";

export type MajorSpringNormalizationAuditRecord = {
  springId: string;
  springSlug: string;
  destinationSlug: string;
  destinationExists: boolean;
  canonicalMappingValid: boolean;
  coordinatesValid: boolean;
  officialSourcePreserved: boolean;
  normalizedCategories: boolean;
  normalizedTags: boolean;
  duplicateDestinationCount: number;
  duplicateOfficialUrlCount: number;
};

function isNormalizedTerm(value: string): boolean {
  return value.length > 0 && value === value.trim() && value === value.toLowerCase();
}

function destinationSlugForSpring(existingDestinationSlug: string | null, springSlug: string): string {
  return existingDestinationSlug ?? springSlug;
}

export const majorSpringNormalizationAudit: readonly MajorSpringNormalizationAuditRecord[] =
  majorSpringCatalog.map((spring) => {
    const destinationSlug = destinationSlugForSpring(
      spring.existingDestinationSlug,
      spring.slug,
    );
    const destinationMatches = exploreDestinations.filter(
      (destination) => destination.slug === destinationSlug,
    );
    const destination = destinationMatches[0];
    const officialUrlMatches = exploreDestinations.filter(
      (candidate) => candidate.officialUrl === spring.officialUrl,
    );

    return {
      springId: spring.id,
      springSlug: spring.slug,
      destinationSlug,
      destinationExists: destinationMatches.length === 1,
      canonicalMappingValid:
        spring.integrationMode === "enrich-existing"
          ? spring.existingDestinationSlug !== null && destinationSlug !== spring.slug
          : spring.existingDestinationSlug === null && destinationSlug === spring.slug,
      coordinatesValid:
        destination != null &&
        destination.latitude != null &&
        destination.longitude != null &&
        destination.latitude >= 25 &&
        destination.latitude <= 37 &&
        destination.longitude >= -107 &&
        destination.longitude <= -93,
      officialSourcePreserved:
        destination != null &&
        (spring.integrationMode === "enrich-existing"
          ? destination.sourceUrl === spring.officialUrl
          : destination.officialUrl === spring.officialUrl &&
            destination.sourceUrl === spring.officialUrl),
      normalizedCategories:
        destination != null && destination.categories.every(isNormalizedTerm),
      normalizedTags: destination != null && destination.tags.every(isNormalizedTerm),
      duplicateDestinationCount: destinationMatches.length,
      duplicateOfficialUrlCount:
        spring.integrationMode === "enrich-existing" ? 0 : officialUrlMatches.length,
    };
  });

const auditBySpringSlug = new Map(
  majorSpringNormalizationAudit.map((record) => [record.springSlug, record]),
);

export function getMajorSpringNormalizationAudit(
  springSlug: string,
): MajorSpringNormalizationAuditRecord | null {
  return auditBySpringSlug.get(springSlug) ?? null;
}

export const majorSpringNormalizationPassed = majorSpringNormalizationAudit.every(
  (record) =>
    record.destinationExists &&
    record.canonicalMappingValid &&
    record.coordinatesValid &&
    record.officialSourcePreserved &&
    record.normalizedCategories &&
    record.normalizedTags &&
    record.duplicateDestinationCount === 1 &&
    record.duplicateOfficialUrlCount <= 1,
);
