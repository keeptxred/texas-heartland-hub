import type { RaceRating } from "./domain";
import type {
  CandidateId,
  ElectionCycleId,
  ElectionEntityId,
  RaceId,
  RaceSlug,
} from "./identifiers";
import type {
  ElectionDataMetadata,
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

/**
 * Normalized, source-backed race record used by repositories and data adapters.
 * Display labels, formatted dates, URLs, and embedded candidate profiles belong
 * in summary/detail projections rather than this core persistence model.
 */
export interface ElectionRace extends ElectionDataMetadata {
  id: RaceId;
  electionCycleId: ElectionCycleId;
  slug: RaceSlug;

  name: string;
  shortName: string | null;
  description: string | null;

  officeId: ElectionEntityId;
  officeName: string;
  officeLevel: OfficeLevel;
  raceType: RaceType;
  electionType: ElectionType;
  jurisdictionType: JurisdictionType;
  partyScope: PartyScope;

  districtId: ElectionEntityId | null;
  districtName: string | null;
  districtNumber: string | null;
  stateCode: string;
  countyIds: readonly ElectionEntityId[];

  electionDate: IsoDateString;
  filingDeadline: IsoDateString | null;
  registrationDeadline: IsoDateString | null;
  earlyVotingStart: IsoDateString | null;
  earlyVotingEnd: IsoDateString | null;

  status: RaceStatus;
  rating: RaceRating;
  featured: boolean;
  competitive: boolean;
  uncontested: boolean;

  candidateIds: readonly CandidateId[];
  incumbentCandidateId: CandidateId | null;
  winnerCandidateId: CandidateId | null;

  calledAt: IsoDateTimeString | null;
  certifiedAt: IsoDateTimeString | null;
  cancelledAt: IsoDateTimeString | null;

  seatsAvailable: number;
  termLengthYears: number | null;
  runoffRequired: boolean;
  notes: string | null;
}

export type ElectionRaceCreateInput = Omit<
  ElectionRace,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionRaceUpdateInput = Partial<
  Omit<ElectionRace, "id" | "electionCycleId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
