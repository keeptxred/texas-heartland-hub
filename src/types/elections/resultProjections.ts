import type { CandidateParty } from "./domain";
import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
  ElectionEntityId,
  ElectionResultId,
  ElectionResultSlug,
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
  OfficeLevel,
  RaceType,
} from "./raceClassifications";
import type {
  CertificationStatus,
  ElectionResultStatus,
  ResultReportingStatus,
  TabulationScope,
  WinnerStatus,
} from "./resultClassifications";
import type {
  CandidateElectionResult,
  ElectionResult,
  ElectionResultReportingProgress,
  ElectionResultSubdivision,
  ElectionResultVoteMethodBreakdown,
} from "./result";

/** Candidate-facing row used by compact result tables and race cards. */
export interface ElectionResultCandidateSummary {
  candidateId: CandidateId;
  candidateSlug: CandidateSlug;
  candidateName: string;
  ballotName: string;
  party: CandidateParty;
  partyLabel: string | null;
  imageUrl: string | null;
  votes: number;
  voteShare: number | null;
  marginVotes: number | null;
  marginPercentagePoints: number | null;
  rank: number | null;
  winnerStatus: WinnerStatus;
  advancedToRunoff: boolean;
  isWriteIn: boolean;
}

/** Minimal race context needed to render a result outside the race page. */
export interface ElectionResultRaceSummary {
  id: RaceId;
  slug: RaceSlug;
  name: string;
  officeName: string;
  officeLevel: OfficeLevel;
  raceType: RaceType;
  electionType: ElectionType;
  districtName: string | null;
  jurisdictionName: string | null;
  electionDate: IsoDateString;
}

/** Compact result projection for election-night lists, cards, and dashboards. */
export interface ElectionResultSummary {
  id: ElectionResultId;
  slug: ElectionResultSlug;
  electionCycleId: ElectionCycleId;
  race: ElectionResultRaceSummary;
  status: ElectionResultStatus;
  reportingStatus: ResultReportingStatus;
  certificationStatus: CertificationStatus;
  tabulationScope: TabulationScope;
  totalVotes: number;
  turnoutPercentage: number | null;
  reporting: ElectionResultReportingProgress;
  leaderCandidateId: CandidateId | null;
  winnerCandidateId: CandidateId | null;
  candidates: readonly ElectionResultCandidateSummary[];
  recountRequested: boolean;
  contested: boolean;
  lastVoteUpdateAt: IsoDateTimeString | null;
  freshnessStatus: ElectionFreshnessStatus;
  verificationStatus: ElectionVerificationStatus;
  updatedAt: IsoDateTimeString;
}

/** Subdivision projection enriched with display-ready geographic context. */
export interface ElectionResultSubdivisionDetail
  extends ElectionResultSubdivision {
  entitySlug: string | null;
  parentEntityId: ElectionEntityId | null;
  parentEntityName: string | null;
  candidateSummaries: readonly ElectionResultCandidateSummary[];
}

/** Full result-page projection with enriched race and candidate information. */
export interface ElectionResultDetail extends ElectionResult {
  race: ElectionResultRaceSummary;
  candidateSummaries: readonly ElectionResultCandidateSummary[];
  leader: ElectionResultCandidateSummary | null;
  winner: ElectionResultCandidateSummary | null;
  runoffCandidates: readonly ElectionResultCandidateSummary[];
  subdivisions: readonly ElectionResultSubdivisionDetail[];
  voteMethodBreakdowns: readonly ElectionResultVoteMethodBreakdown[];
}

/** Historical point-in-time snapshot for charts and election-night timelines. */
export interface ElectionResultSnapshot {
  resultId: ElectionResultId;
  capturedAt: IsoDateTimeString;
  status: ElectionResultStatus;
  reportingStatus: ResultReportingStatus;
  certificationStatus: CertificationStatus;
  totalVotes: number;
  reporting: ElectionResultReportingProgress;
  candidateResults: readonly CandidateElectionResult[];
  leaderCandidateId: CandidateId | null;
  winnerCandidateId: CandidateId | null;
}

export type ElectionResultListItem = ElectionResultSummary;
