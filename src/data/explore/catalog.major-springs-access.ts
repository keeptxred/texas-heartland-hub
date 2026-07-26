import {
  majorSpringCatalog,
  type MajorSpringAccessStatus,
  type MajorSpringCatalogRecord,
  type MajorSpringIntegrationMode,
} from "./catalog.major-springs";

export type MajorSpringOwnershipClassification =
  | "public-state-managed"
  | "public-municipal-managed"
  | "public-county-managed"
  | "public-university-managed"
  | "private-family-operated"
  | "private-association-managed";

export type MajorSpringVisitorAccessModel =
  | "ticketed-public-swimming"
  | "public-natural-area-no-swimming"
  | "scheduled-program-access";

export type MajorSpringOwnershipAccessAuditRecord = {
  springId: string;
  springSlug: string;
  destinationSlug: string;
  integrationMode: MajorSpringIntegrationMode;
  ownershipClassification: MajorSpringOwnershipClassification;
  ownershipLabel: string;
  operator: string;
  publicAccess: boolean;
  visitorAccessModel: MajorSpringVisitorAccessModel;
  accessStatus: MajorSpringAccessStatus;
  swimmingPermitted: boolean;
  swimmingProgramOnly: boolean;
  admissionRequired: boolean;
  reservationsRecommended: boolean;
  accessSummary: string;
  ecologicalSensitivity: string;
  sourceUrl: string;
  sourceName: string;
  verificationStatus: "official-source-reviewed";
  lastReviewed: string;
};

type SpringAuditClassification = Pick<
  MajorSpringOwnershipAccessAuditRecord,
  "ownershipClassification" | "ownershipLabel" | "visitorAccessModel"
>;

const SPRING_AUDIT_CLASSIFICATIONS: Record<string, SpringAuditClassification> = {
  "san-solomon-springs": {
    ownershipClassification: "public-state-managed",
    ownershipLabel: "State-managed spring within a Texas state park",
    visitorAccessModel: "ticketed-public-swimming",
  },
  "barton-springs-pool": {
    ownershipClassification: "public-municipal-managed",
    ownershipLabel: "Municipally managed spring-fed public swimming facility",
    visitorAccessModel: "ticketed-public-swimming",
  },
  "san-marcos-springs-spring-lake": {
    ownershipClassification: "public-university-managed",
    ownershipLabel: "Public university-managed spring and environmental education site",
    visitorAccessModel: "scheduled-program-access",
  },
  "jacobs-well-natural-area": {
    ownershipClassification: "public-county-managed",
    ownershipLabel: "County-managed public natural area and protected spring",
    visitorAccessModel: "public-natural-area-no-swimming",
  },
  "hancock-springs-park": {
    ownershipClassification: "public-municipal-managed",
    ownershipLabel: "Municipally managed spring-fed park and swimming facility",
    visitorAccessModel: "ticketed-public-swimming",
  },
  "blue-hole-regional-park": {
    ownershipClassification: "public-municipal-managed",
    ownershipLabel: "Municipally managed regional park and seasonal spring-fed swimming area",
    visitorAccessModel: "ticketed-public-swimming",
  },
  "krause-springs": {
    ownershipClassification: "private-family-operated",
    ownershipLabel: "Privately owned and family-operated natural swimming and camping destination",
    visitorAccessModel: "ticketed-public-swimming",
  },
  "las-moras-springs-fort-clark": {
    ownershipClassification: "private-association-managed",
    ownershipLabel: "Privately managed historic community spring and visitor recreation facility",
    visitorAccessModel: "ticketed-public-swimming",
  },
};

function destinationSlugForSpring(spring: MajorSpringCatalogRecord): string {
  return spring.existingDestinationSlug ?? spring.slug;
}

function toOwnershipAccessAudit(
  spring: MajorSpringCatalogRecord,
): MajorSpringOwnershipAccessAuditRecord {
  const classification = SPRING_AUDIT_CLASSIFICATIONS[spring.slug];

  if (!classification) {
    throw new Error(`Missing ownership and access classification for major spring: ${spring.slug}`);
  }

  return {
    springId: spring.id,
    springSlug: spring.slug,
    destinationSlug: destinationSlugForSpring(spring),
    integrationMode: spring.integrationMode,
    ...classification,
    operator: spring.managingOrganization,
    publicAccess: spring.publicAccess,
    accessStatus: spring.accessStatus,
    swimmingPermitted: spring.swimmingStatus === "permitted",
    swimmingProgramOnly: spring.swimmingStatus === "program-only",
    admissionRequired: spring.feeRequired,
    reservationsRecommended: spring.reservationsRecommended,
    accessSummary: spring.accessNotes,
    ecologicalSensitivity: spring.ecologicalNotes,
    sourceUrl: spring.officialUrl,
    sourceName: spring.sourceName,
    verificationStatus: spring.verificationStatus,
    lastReviewed: spring.lastReviewed,
  };
}

export const majorSpringOwnershipAccessAudit: readonly MajorSpringOwnershipAccessAuditRecord[] =
  majorSpringCatalog.map(toOwnershipAccessAudit);

const majorSpringOwnershipAccessBySpringSlug = new Map(
  majorSpringOwnershipAccessAudit.map((record) => [record.springSlug, record]),
);

const majorSpringOwnershipAccessByDestinationSlug = new Map(
  majorSpringOwnershipAccessAudit.map((record) => [record.destinationSlug, record]),
);

export function getMajorSpringOwnershipAccessAudit(
  springSlug: string,
): MajorSpringOwnershipAccessAuditRecord | null {
  return majorSpringOwnershipAccessBySpringSlug.get(springSlug) ?? null;
}

export function getMajorSpringOwnershipAccessAuditByDestination(
  destinationSlug: string,
): MajorSpringOwnershipAccessAuditRecord | null {
  return majorSpringOwnershipAccessByDestinationSlug.get(destinationSlug) ?? null;
}
