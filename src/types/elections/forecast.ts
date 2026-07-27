import type { CandidateParty } from "./domain";
import type {
  CandidateId,
  ElectionCycleId,
  ForecastId,
  ForecastSlug,
  RaceId,
} from "./identifiers";
import type {
  ElectionDataMetadata,
  IsoDateTimeString,
} from "./metadata";
import type {
  ForecastConfidenceLevel,
  ForecastModel,
  ForecastRating,
  ForecastStatus,
} from "./forecastClassifications";

export interface ForecastCandidateProbability {
  candidateId: CandidateId;
  party: CandidateParty;
  winProbability: number;
  runoffProbability: number | null;
  projectedVoteShare: number | null;
  projectedVoteShareLow: number | null;
  projectedVoteShareHigh: number | null;
}

export interface ForecastModelMetadata {
  model: ForecastModel;
  modelName: string;
  modelVersion: string | null;
  methodologyUrl: string | null;
  simulationCount: number | null;
  lastModelRunAt: IsoDateTimeString | null;
}

export interface ElectionForecast extends ElectionDataMetadata {
  id: ForecastId;
  slug: ForecastSlug;
  electionCycleId: ElectionCycleId;
  raceId: RaceId;
  title: string;
  status: ForecastStatus;
  rating: ForecastRating;
  confidenceLevel: ForecastConfidenceLevel;
  model: ForecastModelMetadata;
  candidateProbabilities: readonly ForecastCandidateProbability[];
  projectedMargin: number | null;
  projectedWinnerCandidateId: CandidateId | null;
  publishedAt: IsoDateTimeString | null;
  finalizedAt: IsoDateTimeString | null;
  notes: string | null;
}

export type ElectionForecastCreateInput = Omit<
  ElectionForecast,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionForecastUpdateInput = Partial<
  Omit<ElectionForecast, "id" | "electionCycleId" | "raceId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
