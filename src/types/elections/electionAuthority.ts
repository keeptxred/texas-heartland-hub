import type { CountyId, ElectionAuthorityId, ElectionAuthoritySlug } from "./identifiers";
import type { ElectionDataMetadata, IsoDateTimeString } from "./metadata";
import type { ElectionAuthorityLevel, ElectionAuthorityStatus, ElectionAuthorityType } from "./electionAuthorityClassifications";

export interface ElectionAuthority extends ElectionDataMetadata {
  id: ElectionAuthorityId;
  slug: ElectionAuthoritySlug;
  countyId: CountyId | null;
  name: string;
  authorityLevel: ElectionAuthorityLevel;
  authorityType: ElectionAuthorityType;
  status: ElectionAuthorityStatus;
  jurisdictionName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateCode: string;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string;
  voterInformationUrl: string | null;
  registrationUrl: string | null;
  ballotTrackingUrl: string | null;
  officeHours: string | null;
  contactName: string | null;
  verifiedAt: IsoDateTimeString | null;
  featured: boolean;
  notes: string | null;
}

export type ElectionAuthorityCreateInput = Omit<ElectionAuthority, "id" | "createdAt" | "updatedAt">;

export type ElectionAuthorityUpdateInput = Partial<
  Omit<ElectionAuthority, "id" | "countyId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
