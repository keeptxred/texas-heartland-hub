import type { CandidateParty } from "./domain";
import type {
  CandidateId,
  ElectionCycleId,
  ElectionEntityId,
  PollId,
  PollSlug,
  RaceId,
} from "./identifiers";
import type {
  ElectionDataMetadata,
  IsoDateString,
  IsoDateTimeString,
} from "./metadata";
import type {
  PollGrade,
  PollMode,
  PollPopulation,
  PollQuestionType,
  PollSponsorType,
  PollStatus,
} from "./pollClassifications";

/** Polling organization responsible for fielding the survey. */
export interface PollsterProfile {
  name: string;
  slug: string | null;
  websiteUrl: string | null;
  grade: PollGrade;
  transparencyScore: number | null;
  methodologyUrl: string | null;
}

/** Organization that commissioned, sponsored, or published the poll. */
export interface PollSponsor {
  name: string;
  type: PollSponsorType;
  websiteUrl: string | null;
  partisanAffiliation: CandidateParty | null;
  notes: string | null;
}

/** One selectable response in a poll question. */
export interface PollResponseOption {
  id: string;
  label: string;
  candidateId: CandidateId | null;
  party: CandidateParty | null;
  percentage: number | null;
  respondentCount: number | null;
  marginFromLeader: number | null;
  isLeader: boolean;
  isUndecided: boolean;
  isOther: boolean;
}

/** One question and its published topline results. */
export interface PollQuestion {
  id: string;
  type: PollQuestionType;
  prompt: string;
  order: number | null;
  sampleSize: number | null;
  population: PollPopulation;
  responses: readonly PollResponseOption[];
  notes: string | null;
}

/** Sampling and field-method details needed to assess poll quality. */
export interface PollMethodology {
  population: PollPopulation;
  sampleSize: number;
  marginOfError: number | null;
  confidenceLevel: number | null;
  mode: PollMode;
  languages: readonly string[];
  weightingDescription: string | null;
  samplingDescription: string | null;
  likelyVoterModelDescription: string | null;
  questionOrderRandomized: boolean | null;
  includesCellPhones: boolean | null;
  responseRate: number | null;
  methodologyUrl: string | null;
}

/** Source-backed poll record associated with an election cycle and optional race. */
export interface ElectionPoll extends ElectionDataMetadata {
  id: PollId;
  slug: PollSlug;
  electionCycleId: ElectionCycleId;
  raceId: RaceId | null;
  jurisdictionId: ElectionEntityId | null;

  title: string;
  status: PollStatus;
  pollster: PollsterProfile;
  sponsors: readonly PollSponsor[];

  fieldStartDate: IsoDateString;
  fieldEndDate: IsoDateString;
  releaseDate: IsoDateString | null;
  revisedAt: IsoDateTimeString | null;

  methodology: PollMethodology;
  questions: readonly PollQuestion[];

  primaryQuestionId: string | null;
  toplineUrl: string | null;
  questionnaireUrl: string | null;
  crosstabsUrl: string | null;
  archiveUrl: string | null;

  internalPoll: boolean;
  partisanPoll: boolean;
  trackingPoll: boolean;
  supersededByPollId: PollId | null;
  notes: string | null;
}

export type ElectionPollCreateInput = Omit<
  ElectionPoll,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionPollUpdateInput = Partial<
  Omit<ElectionPoll, "id" | "electionCycleId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
