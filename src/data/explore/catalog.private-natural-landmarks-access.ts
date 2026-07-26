import {
  privateNaturalLandmarkCatalog,
  type PrivateNaturalLandmarkAccessModel,
  type PrivateNaturalLandmarkOwnership,
} from "./catalog.private-natural-landmarks";

export type PrivateNaturalLandmarkAccessAuditRecord = {
  landmarkId: string;
  landmarkSlug: string;
  destinationSlug: string;
  ownershipClassification: PrivateNaturalLandmarkOwnership;
  ownershipLabel: string;
  operator: string;
  publicAccess: boolean;
  accessModel: PrivateNaturalLandmarkAccessModel;
  admissionRequired: boolean;
  reservationsRequired: boolean;
  swimmingPermitted: boolean;
  overnightAccess: boolean;
  accessSummary: string;
  conservationSummary: string;
  sourceUrl: string;
  sourceName: string;
  verificationStatus: "official-source-reviewed";
  lastReviewed: string;
};

export const privateNaturalLandmarkAccessAudit: readonly PrivateNaturalLandmarkAccessAuditRecord[] =
  privateNaturalLandmarkCatalog.map((landmark) => ({
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
    swimmingPermitted: landmark.swimmingStatus === "permitted",
    overnightAccess: landmark.overnightAccess,
    accessSummary: landmark.accessNotes,
    conservationSummary: landmark.conservationNotes,
    sourceUrl: landmark.officialUrl,
    sourceName: landmark.sourceName,
    verificationStatus: landmark.verificationStatus,
    lastReviewed: landmark.lastReviewed,
  }));

const auditByLandmarkSlug = new Map(
  privateNaturalLandmarkAccessAudit.map((record) => [record.landmarkSlug, record]),
);

const auditByDestinationSlug = new Map(
  privateNaturalLandmarkAccessAudit.map((record) => [record.destinationSlug, record]),
);

export function getPrivateNaturalLandmarkAccessAudit(
  landmarkSlug: string,
): PrivateNaturalLandmarkAccessAuditRecord | null {
  return auditByLandmarkSlug.get(landmarkSlug) ?? null;
}

export function getPrivateNaturalLandmarkAccessAuditByDestination(
  destinationSlug: string,
): PrivateNaturalLandmarkAccessAuditRecord | null {
  return auditByDestinationSlug.get(destinationSlug) ?? null;
}
