import {
  privateCulturalLandmarkCatalog,
  type PrivateCulturalLandmarkAccessModel,
  type PrivateCulturalLandmarkOwnership,
} from "./catalog.private-cultural-landmarks";

export type PrivateCulturalLandmarkAccessAuditRecord = {
  landmarkId: string;
  landmarkSlug: string;
  destinationSlug: string;
  ownershipClassification: PrivateCulturalLandmarkOwnership;
  ownershipLabel: string;
  operator: string;
  publicAccess: boolean;
  accessModel: PrivateCulturalLandmarkAccessModel;
  admissionRequired: boolean;
  reservationsRequired: boolean;
  guidedTourAvailable: boolean;
  overnightAccess: boolean;
  accessSummary: string;
  culturalSignificance: string;
  sourceUrl: string;
  sourceName: string;
  verificationStatus: "official-source-reviewed";
  lastReviewed: string;
};

export const privateCulturalLandmarkAccessAudit: readonly PrivateCulturalLandmarkAccessAuditRecord[] =
  privateCulturalLandmarkCatalog.map((landmark) => ({
    landmarkId: landmark.id,
    landmarkSlug: landmark.slug,
    destinationSlug: landmark.slug,
    ownershipClassification: landmark.ownershipClassification,
    ownershipLabel: landmark.ownershipLabel,
    operator: landmark.operator,
    publicAccess: landmark.publicAccess,
    accessModel: landmark.accessModel,
    admissionRequired: landmark.admissionRequired,
    reservationsRequired: landmark.reservationsRequired,
    guidedTourAvailable: landmark.guidedTourAvailable,
    overnightAccess: landmark.overnightAccess,
    accessSummary: landmark.accessNotes,
    culturalSignificance: landmark.culturalSignificance,
    sourceUrl: landmark.officialUrl,
    sourceName: landmark.sourceName,
    verificationStatus: landmark.verificationStatus,
    lastReviewed: landmark.lastReviewed,
  }));

const auditByLandmarkSlug = new Map(
  privateCulturalLandmarkAccessAudit.map((record) => [record.landmarkSlug, record]),
);

const auditByDestinationSlug = new Map(
  privateCulturalLandmarkAccessAudit.map((record) => [record.destinationSlug, record]),
);

export function getPrivateCulturalLandmarkAccessAudit(
  landmarkSlug: string,
): PrivateCulturalLandmarkAccessAuditRecord | null {
  return auditByLandmarkSlug.get(landmarkSlug) ?? null;
}

export function getPrivateCulturalLandmarkAccessAuditByDestination(
  destinationSlug: string,
): PrivateCulturalLandmarkAccessAuditRecord | null {
  return auditByDestinationSlug.get(destinationSlug) ?? null;
}
