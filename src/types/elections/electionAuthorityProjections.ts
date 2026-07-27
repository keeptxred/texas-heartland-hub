import type { ElectionAuthority } from "./electionAuthority";
import type { ElectionAuthorityLevel, ElectionAuthorityStatus, ElectionAuthorityType } from "./electionAuthorityClassifications";
import type { CountyId, ElectionAuthorityId, ElectionAuthoritySlug } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";

export interface ElectionAuthoritySummary {
  id: ElectionAuthorityId;
  slug: ElectionAuthoritySlug;
  countyId: CountyId | null;
  countyName: string | null;
  name: string;
  authorityLevel: ElectionAuthorityLevel;
  authorityType: ElectionAuthorityType;
  status: ElectionAuthorityStatus;
  jurisdictionName: string;
  phone: string | null;
  websiteUrl: string;
  verified: boolean;
  featured: boolean;
  updatedAt: IsoDateTimeString;
}

export interface ElectionAuthorityDetail extends ElectionAuthority {
  countyName: string | null;
  countySlug: string | null;
  primaryContactLabel: string | null;
}

export interface CountyElectionAuthorityDirectory {
  countyId: CountyId;
  countyName: string;
  authorities: readonly ElectionAuthoritySummary[];
  primaryAuthority: ElectionAuthoritySummary | null;
  lastVerifiedAt: IsoDateTimeString | null;
}
