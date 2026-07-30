export type CavernOwnershipClassification =
  | "private-family-operated"
  | "private-commercial-operator"
  | "public-state-managed";

export type CavernVisitorAccessModel =
  | "ticketed-guided-public-access"
  | "reservation-guided-public-access"
  | "public-park-guided-cavern-access";

export type CavernOwnershipAccessAuditRecord = {
  destinationId: string;
  ownershipClassification: CavernOwnershipClassification;
  ownershipLabel: string;
  operator: string;
  publicAccess: boolean;
  visitorAccessModel: CavernVisitorAccessModel;
  cavernEntryRequiresGuide: boolean;
  admissionRequired: boolean;
  reservationsRecommended: boolean;
  accessSummary: string;
  ownershipNotes: string;
  sourceUrl: string;
  sourceName: string;
  verificationStatus: "official-source-reviewed";
  lastReviewed: string;
};

export const cavernOwnershipAccessAudit: readonly CavernOwnershipAccessAuditRecord[] = [
  {
    destinationId: "commercial-cavern-natural-bridge-caverns",
    ownershipClassification: "private-family-operated",
    ownershipLabel: "Privately owned, family-operated commercial attraction",
    operator: "Natural Bridge Caverns",
    publicAccess: true,
    visitorAccessModel: "ticketed-guided-public-access",
    cavernEntryRequiresGuide: true,
    admissionRequired: true,
    reservationsRecommended: true,
    accessSummary:
      "Open to ticketed visitors through scheduled guided cavern tours; undeveloped-cave experiences require designated adventure tours and compliance with operator requirements.",
    ownershipNotes:
      "The official operator identifies Natural Bridge Caverns as a Texas family-owned and operated attraction managed by the Wuest family.",
    sourceUrl: "https://naturalbridgecaverns.com/our-story/",
    sourceName: "Natural Bridge Caverns official website",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    destinationId: "commercial-cavern-inner-space-cavern",
    ownershipClassification: "private-commercial-operator",
    ownershipLabel: "Privately operated commercial attraction",
    operator: "Inner Space Cavern",
    publicAccess: true,
    visitorAccessModel: "ticketed-guided-public-access",
    cavernEntryRequiresGuide: true,
    admissionRequired: true,
    reservationsRecommended: false,
    accessSummary:
      "Open to the public through operator-led cavern tours during published business hours; visitors may not independently enter the cave system.",
    ownershipNotes:
      "The official site confirms public commercial operation and guided visitor access but does not clearly publish the underlying legal property owner; the catalog therefore avoids naming an unverified owner.",
    sourceUrl: "https://innerspacecavern.com/about-us/",
    sourceName: "Inner Space Cavern official website",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    destinationId: "commercial-cavern-caverns-of-sonora",
    ownershipClassification: "private-commercial-operator",
    ownershipLabel: "Privately operated commercial attraction",
    operator: "Caverns of Sonora",
    publicAccess: true,
    visitorAccessModel: "ticketed-guided-public-access",
    cavernEntryRequiresGuide: true,
    admissionRequired: true,
    reservationsRecommended: true,
    accessSummary:
      "Open to ticketed visitors through guided tours; access is controlled by the operator because of the cave's delicate formations, route conditions, and tour capacity.",
    ownershipNotes:
      "The destination is operated as a private show cave. The catalog records the public-facing operator without asserting a separate legal owner not clearly identified on the official visitor site.",
    sourceUrl: "https://www.cavernsofsonora.com/",
    sourceName: "Caverns of Sonora official website",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    destinationId: "commercial-cavern-cave-without-a-name",
    ownershipClassification: "private-commercial-operator",
    ownershipLabel: "Privately operated commercial attraction",
    operator: "Cave Without a Name",
    publicAccess: true,
    visitorAccessModel: "ticketed-guided-public-access",
    cavernEntryRequiresGuide: true,
    admissionRequired: true,
    reservationsRecommended: true,
    accessSummary:
      "Open to ticketed visitors on guided cavern tours and for scheduled underground events; general self-guided cave entry is not offered.",
    ownershipNotes:
      "The official visitor site presents the cave as a privately operated show cave. No separate legal ownership entity is asserted in the catalog without a clear official statement.",
    sourceUrl: "https://www.cavewithoutaname.com/",
    sourceName: "Cave Without a Name official website",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    destinationId: "commercial-cavern-cascade-caverns",
    ownershipClassification: "private-commercial-operator",
    ownershipLabel: "Privately operated commercial attraction",
    operator: "Cascade Caverns",
    publicAccess: true,
    visitorAccessModel: "ticketed-guided-public-access",
    cavernEntryRequiresGuide: true,
    admissionRequired: true,
    reservationsRecommended: true,
    accessSummary:
      "Open to ticketed visitors through guided tours, subject to tour capacity, flooding, and cave conditions; independent cavern entry is not permitted.",
    ownershipNotes:
      "The official site supports classification as a private commercial show-cave operation. The catalog does not infer a legal property owner beyond the published operator identity.",
    sourceUrl: "https://www.cascadecaverns.com/",
    sourceName: "Cascade Caverns official website",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
  {
    destinationId: "commercial-cavern-wonder-world-cave-adventure-park",
    ownershipClassification: "private-commercial-operator",
    ownershipLabel: "Privately operated commercial attraction",
    operator: "Wonder World Cave & Adventure Park",
    publicAccess: true,
    visitorAccessModel: "ticketed-guided-public-access",
    cavernEntryRequiresGuide: true,
    admissionRequired: true,
    reservationsRecommended: true,
    accessSummary:
      "Open to ticketed visitors as part of guided cave and attraction experiences; cave access is controlled by the operator and is not self-guided.",
    ownershipNotes:
      "The attraction is publicly presented as a private commercial cave and adventure park. The catalog records the operating attraction rather than inferring an unpublished legal owner.",
    sourceUrl: "https://www.wonderworldpark.com/",
    sourceName: "Wonder World Cave & Adventure Park official website",
    verificationStatus: "official-source-reviewed",
    lastReviewed: "2026-07-26",
  },
] as const;

const cavernOwnershipAccessByDestinationId = new Map(
  cavernOwnershipAccessAudit.map((record) => [record.destinationId, record]),
);

export function getCavernOwnershipAccessAudit(
  destinationId: string,
): CavernOwnershipAccessAuditRecord | null {
  return cavernOwnershipAccessByDestinationId.get(destinationId) ?? null;
}
