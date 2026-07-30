import type {
  CandidateId,
  ElectionCycleId,
  ElectionEntityId,
  ElectionResultId,
  ElectionResultSlug,
  RaceId,
} from "./identifiers";
import type {
  ElectionDataMetadata,
  IsoDateString,
  IsoDateTimeString,
} from "./metadata";
import type {
  CertificationStatus,
  ElectionResultStatus,
  ResultReportingStatus,
  TabulationScope,
  VoteMethod,
  WinnerStatus,
} from "./resultClassifications";

/** Vote totals for one candidate or ballot option within a race result. */
export interface CandidateElectionResult {
  candidateId: CandidateId;
  ballotOrder: number | null;
  votes: number;
  voteShare: number | null;
  marginVotes: number | null;
  marginPercentagePoints: number | null;
  rank: number | null;
  winnerStatus: WinnerStatus;
  advancedToRunoff: boolean;
  isWriteIn: boolean;
  lastUpdatedAt: IsoDateTimeString;
}

/** Aggregate reporting progress for a result or one geographic subdivision. */
export interface ElectionResultReportingProgress {
  reportingStatus: ResultReportingStatus;
  totalUnits: number | null;
  reportingUnits: number | null;
  reportingPercentage: number | null;
  estimatedVotesRemaining: number | null;
  lastReportReceivedAt: IsoDateTimeString | null;
}

/** Vote totals grouped by voting method, when an official source provides them. */
export interface ElectionResultVoteMethodBreakdown {
  voteMethod: VoteMethod;
  totalVotes: number;
  candidateResults: readonly CandidateElectionResult[];
  reporting: ElectionResultReportingProgress;
}

/** Geographic or administrative subdivision of a race result. */
export interface ElectionResultSubdivision {
  scope: TabulationScope;
  entityId: ElectionEntityId | null;
  entityName: string;
  countyId: ElectionEntityId | null;
  countyName: string | null;
  precinctCode: string | null;
  totalVotes: number;
  candidateResults: readonly CandidateElectionResult[];
  voteMethodBreakdowns: readonly ElectionResultVoteMethodBreakdown[];
  reporting: ElectionResultReportingProgress;
  certificationStatus: CertificationStatus;
  certifiedAt: IsoDateTimeString | null;
  lastUpdatedAt: IsoDateTimeString;
}

/**
 * Source-backed aggregate result for one election race. Detailed historical
 * snapshots and display formatting belong in result projections or services.
 */
export interface ElectionResult extends ElectionDataMetadata {
  id: ElectionResultId;
  slug: ElectionResultSlug;
  electionCycleId: ElectionCycleId;
  raceId: RaceId;

  electionDate: IsoDateString;
  status: ElectionResultStatus;
  reportingStatus: ResultReportingStatus;
  certificationStatus: CertificationStatus;
  tabulationScope: TabulationScope;

  totalVotes: number;
  ballotsCast: number | null;
  registeredVoters: number | null;
  turnoutPercentage: number | null;
  undervotes: number | null;
  overvotes: number | null;

  candidateResults: readonly CandidateElectionResult[];
  voteMethodBreakdowns: readonly ElectionResultVoteMethodBreakdown[];
  subdivisions: readonly ElectionResultSubdivision[];
  reporting: ElectionResultReportingProgress;

  leaderCandidateId: CandidateId | null;
  winnerCandidateId: CandidateId | null;
  runoffCandidateIds: readonly CandidateId[];

  resultsUrl: string | null;
  certificationDocumentUrl: string | null;
  certifiedAt: IsoDateTimeString | null;
  calledAt: IsoDateTimeString | null;
  finalizedAt: IsoDateTimeString | null;
  lastVoteUpdateAt: IsoDateTimeString | null;

  recountRequested: boolean;
  contested: boolean;
  notes: string | null;
}

export type ElectionResultCreateInput = Omit<
  ElectionResult,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionResultUpdateInput = Partial<
  Omit<ElectionResult, "id" | "electionCycleId" | "raceId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
