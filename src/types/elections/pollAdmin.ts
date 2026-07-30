import type { PollMode, PollPopulation } from "./pollClassifications";

export interface PollEntryResponseInput {
  label: string;
  candidateId: string;
  percentage: string;
}

export interface PollEntryAdminInput {
  slug: string;
  title: string;
  electionCycleId: string;
  raceId: string;
  pollsterName: string;
  fieldStartDate: string;
  fieldEndDate: string;
  releaseDate: string;
  population: PollPopulation;
  mode: PollMode;
  sampleSize: string;
  marginOfError: string;
  questionPrompt: string;
  responses: readonly PollEntryResponseInput[];
  internalPoll: boolean;
  partisanPoll: boolean;
  sourceName: string;
  sourceUrl: string;
  methodologyUrl: string;
}

export interface ValidPollEntryDraft {
  slug: string;
  title: string;
  electionCycleId: string;
  raceId: string | null;
  pollsterName: string;
  fieldStartDate: string;
  fieldEndDate: string;
  releaseDate: string | null;
  population: PollPopulation;
  mode: PollMode;
  sampleSize: number;
  marginOfError: number | null;
  questionPrompt: string;
  responses: readonly {
    label: string;
    candidateId: string | null;
    percentage: number;
  }[];
  internalPoll: boolean;
  partisanPoll: boolean;
  sourceName: string;
  sourceUrl: string;
  methodologyUrl: string | null;
}
