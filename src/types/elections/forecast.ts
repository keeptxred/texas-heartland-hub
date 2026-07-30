import type { CandidateParty } from "./domain";
import type { CandidateId, ElectionCycleId, ForecastId, ForecastSlug, RaceId } from "./identifiers";
import type { ElectionDataMetadata, IsoDateTimeString } from "./metadata";
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
  /** Candidate polling average used by this forecast, when credible polling exists. */
  pollingAverage: number | null;
  /** Change in win probability, in percentage points, from the previous published snapshot. */
  winProbabilityChange: number | null;
}

/**
 * Source-backed fundamentals used when credible public polling is unavailable.
 * Point values are model inputs, not poll results or reported vote totals.
 */
export interface ForecastFundamentals {
  previousElectionMargin: number | null;
  districtPartisanLean: number | null;
  incumbencyAdjustment: number | null;
  fundraisingAdvantage: number | null;
  candidateQualityAdjustment: number | null;
  dataAsOf: IsoDateTimeString;
  sourceUrls: readonly string[];
}

export interface ForecastModelMetadata {
  model: ForecastModel;
  modelName: string;
  modelVersion: string | null;
  methodologyUrl: string | null;
  simulationCount: number | null;
  lastModelRunAt: IsoDateTimeString | null;
  fundamentals: ForecastFundamentals | null;
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

export type ElectionForecastCreateInput = Omit<ElectionForecast, "id" | "createdAt" | "updatedAt">;

export type ElectionForecastUpdateInput = Partial<
  Omit<ElectionForecast, "id" | "electionCycleId" | "raceId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
