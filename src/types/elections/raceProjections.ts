import type { CandidateParty, RaceRating } from "./domain";
import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
  ElectionResultId,
  ForecastId,
  PollId,
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
  ElectionType,
  JurisdictionType,
  OfficeLevel,
  PartyScope,
  RaceStatus,
  RaceType,
} from "./raceClassifications";
import type { ElectionRace } from "./race";

export interface RaceCandidateSummary {
  id: CandidateId;
  slug: CandidateSlug;
  fullName: string;
  shortName: string;
  party: CandidateParty;
  partyLabel: string | null;
  incumbent: boolean;
  imageUrl: string | null;
  status: "active" | "withdrawn" | "disqualified" | "write_in";
}

export interface RaceSummary {
  id: RaceId;
  electionCycleId: ElectionCycleId;
  slug: RaceSlug;
  name: string;
  shortName: string | null;
  officeName: string;
  officeLevel: OfficeLevel;
  raceType: RaceType;
  electionType: ElectionType;
  jurisdictionType: JurisdictionType;
  partyScope: PartyScope;
  districtName: string | null;
  districtNumber: string | null;
  stateCode: string;
  electionDate: IsoDateString;
  status: RaceStatus;
  rating: RaceRating;
  featured: boolean;
  competitive: boolean;
  uncontested: boolean;
  candidates: readonly RaceCandidateSummary[];
  incumbentCandidateId: CandidateId | null;
  winnerCandidateId: CandidateId | null;
  latestPollId: PollId | null;
  latestForecastId: ForecastId | null;
  latestResultId: ElectionResultId | null;
  freshnessStatus: ElectionFreshnessStatus;
  verificationStatus: ElectionVerificationStatus;
  updatedAt: IsoDateTimeString;
}

export interface RacePollSummary {
  id: PollId;
  pollsterName: string;
  fieldStartDate: IsoDateString;
  fieldEndDate: IsoDateString;
  sampleSize: number;
  marginOfError: number | null;
  publishedAt: IsoDateTimeString;
}

export interface RaceForecastSummary {
  id: ForecastId;
  providerName: string;
  rating: RaceRating;
  projectedMargin: number | null;
  confidence: number | null;
  generatedAt: IsoDateTimeString;
}

export interface RaceResultSummary {
  id: ElectionResultId;
  reportingPercent: number;
  totalVotes: number;
  called: boolean;
  certified: boolean;
  updatedAt: IsoDateTimeString;
}

export interface RaceDetail extends ElectionRace {
  candidates: readonly RaceCandidateSummary[];
  latestPoll: RacePollSummary | null;
  latestForecast: RaceForecastSummary | null;
  latestResult: RaceResultSummary | null;
  relatedRaceIds: readonly RaceId[];
}

export type RaceListItem = RaceSummary;
