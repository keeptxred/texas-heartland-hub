import type { CandidateParty } from "./domain";
import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
  ElectionEntityId,
  PollId,
  PollSlug,
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
  ElectionPoll,
  PollMethodology,
  PollQuestion,
  PollResponseOption,
  PollSponsor,
  PollsterProfile,
} from "./poll";
import type {
  PollPopulation,
  PollQuestionType,
  PollStatus,
} from "./pollClassifications";

/** Candidate or response option enriched for public poll displays. */
export interface PollResponseSummary extends PollResponseOption {
  candidateSlug: CandidateSlug | null;
  candidateName: string | null;
  candidateImageUrl: string | null;
  partyLabel: string | null;
}

/** Primary poll question with display-ready response information. */
export interface PollQuestionSummary {
  id: string;
  type: PollQuestionType;
  prompt: string;
  sampleSize: number | null;
  population: PollPopulation;
  responses: readonly PollResponseSummary[];
  leaderCandidateId: CandidateId | null;
  leaderLabel: string | null;
  leaderPercentage: number | null;
  leadMargin: number | null;
}

/** Minimal race context used when a poll is displayed outside a race page. */
export interface PollRaceSummary {
  id: RaceId;
  slug: RaceSlug;
  name: string;
  officeName: string;
  districtName: string | null;
  jurisdictionName: string | null;
  electionDate: IsoDateString;
}

/** Compact poll projection for lists, cards, charts, and trend pages. */
export interface ElectionPollSummary {
  id: PollId;
  slug: PollSlug;
  electionCycleId: ElectionCycleId;
  race: PollRaceSummary | null;
  jurisdictionId: ElectionEntityId | null;
  jurisdictionName: string | null;
  title: string;
  status: PollStatus;
  pollsterName: string;
  pollsterGrade: PollsterProfile["grade"];
  sponsors: readonly PollSponsor[];
  fieldStartDate: IsoDateString;
  fieldEndDate: IsoDateString;
  releaseDate: IsoDateString | null;
  methodology: PollMethodology;
  primaryQuestion: PollQuestionSummary | null;
  internalPoll: boolean;
  partisanPoll: boolean;
  trackingPoll: boolean;
  freshnessStatus: ElectionFreshnessStatus;
  verificationStatus: ElectionVerificationStatus;
  updatedAt: IsoDateTimeString;
}

/** Full poll-page projection with enriched questions and related context. */
export interface ElectionPollDetail extends ElectionPoll {
  race: PollRaceSummary | null;
  jurisdictionName: string | null;
  questionSummaries: readonly PollQuestionSummary[];
  primaryQuestion: PollQuestionSummary | null;
  supersededByPoll: ElectionPollSummary | null;
}

/** Candidate trend point derived from one poll and one question. */
export interface PollTrendPoint {
  pollId: PollId;
  pollSlug: PollSlug;
  pollsterName: string;
  fieldEndDate: IsoDateString;
  releaseDate: IsoDateString | null;
  questionId: string;
  candidateId: CandidateId | null;
  candidateName: string | null;
  party: CandidateParty | null;
  percentage: number | null;
  sampleSize: number | null;
  population: PollPopulation;
  marginOfError: number | null;
}

/** Comparison-ready poll question retaining the original source question. */
export interface PollQuestionDetail extends PollQuestion {
  responseSummaries: readonly PollResponseSummary[];
}

export type ElectionPollListItem = ElectionPollSummary;
