import type { CandidateParty } from "./domain";
import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
  ElectionEntityId,
  RaceId,
  RaceSlug,
} from "./identifiers";
import type {
  ElectionFreshnessStatus,
  ElectionVerificationStatus,
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
import type {
  CandidateExternalIdentifiers,
  CandidateImageRights,
  CandidateSocialLinks,
  ElectionCandidate,
} from "./candidate";
import type { ElectionType, OfficeLevel, RaceStatus, RaceType } from "./raceClassifications";

export interface CandidateRaceSummary {
  id: RaceId;
  slug: RaceSlug;
  name: string;
  officeName: string;
  officeLevel: OfficeLevel;
  raceType: RaceType;
  electionType: ElectionType;
  districtName: string | null;
  electionDate: IsoDateString;
  status: RaceStatus;
  isPrimaryRace: boolean;
  isWinner: boolean;
}

export interface CandidateOfficeSummary {
  id: ElectionEntityId;
  name: string;
  level: OfficeLevel;
  districtName: string | null;
  assumedOfficeDate: IsoDateString | null;
  termEndDate: IsoDateString | null;
}

export interface CandidateFundraisingSummary {
  totalRaised: number | null;
  totalSpent: number | null;
  cashOnHand: number | null;
  debtsOwed: number | null;
  reportingPeriodEnd: IsoDateString | null;
  sourceUrl: string | null;
  updatedAt: IsoDateTimeString | null;
}

export interface CandidateEndorsementSummary {
  organizationName: string;
  organizationType: string | null;
  endorsementDate: IsoDateString | null;
  sourceUrl: string | null;
}

export interface CandidateOfficeHistoryEntry {
  officeName: string;
  districtName: string | null;
  serviceStartDate: IsoDateString | null;
  serviceEndDate: IsoDateString | null;
  current: boolean;
  sourceUrl: string | null;
}

export interface CandidateSourceReference {
  label: string;
  url: string;
  retrievedAt: IsoDateTimeString;
}

export type CandidateProfileDepth = "standard" | "expanded";

export interface CandidateSummary {
  id: CandidateId;
  electionCycleId: ElectionCycleId;
  slug: CandidateSlug;
  fullName: string;
  preferredName: string | null;
  ballotName: string;
  party: CandidateParty;
  partyLabel: string | null;
  status: CandidateStatus;
  filingStatus: CandidateFilingStatus;
  incumbencyType: IncumbencyType;
  campaignStatus: CampaignStatus;
  ballotAccessStatus: BallotAccessStatus;
  imageUrl: string | null;
  imageAltText: string | null;
  occupation: string | null;
  hometown: string | null;
  stateCode: string;
  featured: boolean;
  endorsed: boolean;
  primaryRace: CandidateRaceSummary | null;
  freshnessStatus: ElectionFreshnessStatus;
  verificationStatus: ElectionVerificationStatus;
  updatedAt: IsoDateTimeString;
}

export interface CandidateDetail extends ElectionCandidate {
  races: readonly CandidateRaceSummary[];
  currentOffice: CandidateOfficeSummary | null;
  fundraising: CandidateFundraisingSummary | null;
  campaignFinanceUrl: string | null;
  endorsements: readonly CandidateEndorsementSummary[];
  officeHistory: readonly CandidateOfficeHistoryEntry[];
  sources: readonly CandidateSourceReference[];
  profileDepth: CandidateProfileDepth;
  imageRights: CandidateImageRights | null;
  socialLinks: CandidateSocialLinks;
  externalIds: CandidateExternalIdentifiers;
  relatedCandidateIds: readonly CandidateId[];
}

export type CandidateListItem = CandidateSummary;
