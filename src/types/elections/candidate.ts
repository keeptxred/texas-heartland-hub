import type { CandidateParty } from "./domain";
import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
  ElectionEntityId,
  RaceId,
} from "./identifiers";
import type {
  ElectionDataMetadata,
  IsoDateString,
  IsoDateTimeString,
} from "./metadata";
import type {
  BallotAccessStatus,
  CampaignStatus,
  CandidateFilingStatus,
  CandidateStatus,
  IncumbencyType,
} from "./candidateClassifications";

export interface CandidateSocialLinks {
  facebookUrl: string | null;
  xUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  linkedinUrl: string | null;
}

export interface CandidateExternalIdentifiers {
  fecCandidateId: string | null;
  texasEthicsId: string | null;
  ballotpediaId: string | null;
  wikidataId: string | null;
}

/**
 * Normalized, source-backed candidate record used by repositories and data
 * adapters. Race-specific vote totals and display-only formatting belong in
 * candidate projections rather than this persistence model.
 */
export interface ElectionCandidate extends ElectionDataMetadata {
  id: CandidateId;
  electionCycleId: ElectionCycleId;
  slug: CandidateSlug;

  fullName: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  preferredName: string | null;
  ballotName: string;
  pronunciation: string | null;

  party: CandidateParty;
  partyLabel: string | null;
  status: CandidateStatus;
  filingStatus: CandidateFilingStatus;
  incumbencyType: IncumbencyType;
  campaignStatus: CampaignStatus;
  ballotAccessStatus: BallotAccessStatus;

  raceIds: readonly RaceId[];
  primaryRaceId: RaceId | null;
  currentOfficeId: ElectionEntityId | null;
  currentOfficeName: string | null;

  biography: string | null;
  occupation: string | null;
  employer: string | null;
  hometown: string | null;
  residenceCity: string | null;
  residenceCountyId: ElectionEntityId | null;
  stateCode: string;
  dateOfBirth: IsoDateString | null;

  imageUrl: string | null;
  imageAltText: string | null;
  websiteUrl: string | null;
  campaignUrl: string | null;
  donationUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: CandidateSocialLinks;

  externalIds: CandidateExternalIdentifiers;

  filingDate: IsoDateString | null;
  withdrawalDate: IsoDateString | null;
  campaignAnnouncedAt: IsoDateTimeString | null;
  campaignEndedAt: IsoDateTimeString | null;

  featured: boolean;
  endorsed: boolean;
  notes: string | null;
}

export type ElectionCandidateCreateInput = Omit<
  ElectionCandidate,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionCandidateUpdateInput = Partial<
  Omit<ElectionCandidate, "id" | "electionCycleId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
