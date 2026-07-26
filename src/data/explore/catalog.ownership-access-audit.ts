import { commercialCavernCatalog } from "./catalog.caverns";
import { cavernOwnershipAccessAudit } from "./catalog.caverns-access";
import { majorSpringOwnershipAccessAudit } from "./catalog.major-springs-access";
import { privateNaturalLandmarkAccessAudit } from "./catalog.private-natural-landmarks-access";
import { privateCulturalLandmarkAccessAudit } from "./catalog.private-cultural-landmarks-access";

export type OwnershipAccessCatalogFamily =
  | "commercial-cavern"
  | "major-spring"
  | "private-natural-landmark"
  | "private-cultural-landmark";

export type UnifiedOwnershipAccessAuditRecord = {
  catalogFamily: OwnershipAccessCatalogFamily;
  sourceRecordId: string;
  destinationSlug: string;
  ownershipClassification: string;
  ownershipLabel: string;
  operator: string;
  publicAccess: boolean;
  accessModel: string;
  admissionRequired: boolean;
  reservationsRequiredOrRecommended: boolean;
  guidedAccess: boolean;
  overnightAccess: boolean | null;
  accessSummary: string;
  sourceUrl: string;
  sourceName: string;
  verificationStatus: "official-source-reviewed";
  lastReviewed: string;
};

const cavernSlugById = new Map(
  commercialCavernCatalog.map((cavern) => [cavern.id, cavern.slug]),
);

const cavernRecords: UnifiedOwnershipAccessAuditRecord[] = cavernOwnershipAccessAudit.map(
  (record) => {
    const destinationSlug = cavernSlugById.get(record.destinationId);

    if (!destinationSlug) {
      throw new Error(`Missing commercial cavern catalog record for audit: ${record.destinationId}`);
    }

    return {
      catalogFamily: "commercial-cavern",
      sourceRecordId: record.destinationId,
      destinationSlug,
      ownershipClassification: record.ownershipClassification,
      ownershipLabel: record.ownershipLabel,
      operator: record.operator,
      publicAccess: record.publicAccess,
      accessModel: record.visitorAccessModel,
      admissionRequired: record.admissionRequired,
      reservationsRequiredOrRecommended: record.reservationsRecommended,
      guidedAccess: record.cavernEntryRequiresGuide,
      overnightAccess: null,
      accessSummary: record.accessSummary,
      sourceUrl: record.sourceUrl,
      sourceName: record.sourceName,
      verificationStatus: record.verificationStatus,
      lastReviewed: record.lastReviewed,
    };
  },
);

const springRecords: UnifiedOwnershipAccessAuditRecord[] = majorSpringOwnershipAccessAudit.map(
  (record) => ({
    catalogFamily: "major-spring",
    sourceRecordId: record.springId,
    destinationSlug: record.destinationSlug,
    ownershipClassification: record.ownershipClassification,
    ownershipLabel: record.ownershipLabel,
    operator: record.operator,
    publicAccess: record.publicAccess,
    accessModel: record.visitorAccessModel,
    admissionRequired: record.admissionRequired,
    reservationsRequiredOrRecommended: record.reservationsRecommended,
    guidedAccess: record.visitorAccessModel === "scheduled-program-access",
    overnightAccess: null,
    accessSummary: record.accessSummary,
    sourceUrl: record.sourceUrl,
    sourceName: record.sourceName,
    verificationStatus: record.verificationStatus,
    lastReviewed: record.lastReviewed,
  }),
);

const naturalLandmarkRecords: UnifiedOwnershipAccessAuditRecord[] =
  privateNaturalLandmarkAccessAudit.map((record) => ({
    catalogFamily: "private-natural-landmark",
    sourceRecordId: record.landmarkId,
    destinationSlug: record.destinationSlug,
    ownershipClassification: record.ownershipClassification,
    ownershipLabel: record.ownershipLabel,
    operator: record.operator,
    publicAccess: record.publicAccess,
    accessModel: record.accessModel,
    admissionRequired: record.admissionRequired,
    reservationsRequiredOrRecommended: record.reservationsRequired,
    guidedAccess:
      record.accessModel === "reservation-guided-access" ||
      record.accessModel === "scheduled-public-program-access",
    overnightAccess: record.overnightAccess,
    accessSummary: record.accessSummary,
    sourceUrl: record.sourceUrl,
    sourceName: record.sourceName,
    verificationStatus: record.verificationStatus,
    lastReviewed: record.lastReviewed,
  }));

const culturalLandmarkRecords: UnifiedOwnershipAccessAuditRecord[] =
  privateCulturalLandmarkAccessAudit.map((record) => ({
    catalogFamily: "private-cultural-landmark",
    sourceRecordId: record.landmarkId,
    destinationSlug: record.destinationSlug,
    ownershipClassification: record.ownershipClassification,
    ownershipLabel: record.ownershipLabel,
    operator: record.operator,
    publicAccess: record.publicAccess,
    accessModel: record.accessModel,
    admissionRequired: record.admissionRequired,
    reservationsRequiredOrRecommended: record.reservationsRequired,
    guidedAccess: record.guidedTourAvailable,
    overnightAccess: record.overnightAccess,
    accessSummary: record.accessSummary,
    sourceUrl: record.sourceUrl,
    sourceName: record.sourceName,
    verificationStatus: record.verificationStatus,
    lastReviewed: record.lastReviewed,
  }));

export const ownershipAccessAudit: readonly UnifiedOwnershipAccessAuditRecord[] = [
  ...cavernRecords,
  ...springRecords,
  ...naturalLandmarkRecords,
  ...culturalLandmarkRecords,
];

const ownershipAccessAuditByDestinationSlug = new Map(
  ownershipAccessAudit.map((record) => [record.destinationSlug, record]),
);

export function getOwnershipAccessAuditByDestination(
  destinationSlug: string,
): UnifiedOwnershipAccessAuditRecord | null {
  return ownershipAccessAuditByDestinationSlug.get(destinationSlug) ?? null;
}

export function getOwnershipAccessAuditByFamily(
  catalogFamily: OwnershipAccessCatalogFamily,
): readonly UnifiedOwnershipAccessAuditRecord[] {
  return ownershipAccessAudit.filter((record) => record.catalogFamily === catalogFamily);
}
