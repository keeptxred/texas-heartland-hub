import type { CandidateParty } from "./domain";
import type {
  CandidateId,
  CandidateSlug,
  ElectionCycleId,
  ForecastId,
  ForecastSlug,
  RaceId,
  RaceSlug,
} from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type { ElectionForecast } from "./forecast";
import type {
  ForecastConfidenceLevel,
  ForecastModel,
  ForecastRating,
  ForecastStatus,
} from "./forecastClassifications";

export interface ForecastCandidateSummary {
  candidateId: CandidateId;
  candidateSlug: CandidateSlug;
  candidateName: string;
  party: CandidateParty;
  imageUrl: string | null;
  winProbability: number;
  projectedVoteShare: number | null;
  projectedVoteShareLow: number | null;
  projectedVoteShareHigh: number | null;
}

export interface ForecastRaceSummary {
  id: RaceId;
  slug: RaceSlug;
  name: string;
  officeName: string;
  districtName: string | null;
  electionDate: string;
}

export interface ElectionForecastSummary {
  id: ForecastId;
  slug: ForecastSlug;
  electionCycleId: ElectionCycleId;
  race: ForecastRaceSummary;
  title: string;
  status: ForecastStatus;
  rating: ForecastRating;
  confidenceLevel: ForecastConfidenceLevel;
  model: ForecastModel;
  projectedWinnerCandidateId: CandidateId | null;
  projectedMargin: number | null;
  candidates: readonly ForecastCandidateSummary[];
  publishedAt: IsoDateTimeString | null;
  updatedAt: IsoDateTimeString;
}

export interface ElectionForecastDetail extends ElectionForecast {
  race: ForecastRaceSummary;
  candidateSummaries: readonly ForecastCandidateSummary[];
  projectedWinner: ForecastCandidateSummary | null;
}

export interface ElectionForecastSnapshot {
  forecastId: ForecastId;
  capturedAt: IsoDateTimeString;
  status: ForecastStatus;
  rating: ForecastRating;
  confidenceLevel: ForecastConfidenceLevel;
  projectedWinnerCandidateId: CandidateId | null;
  projectedMargin: number | null;
  candidateSummaries: readonly ForecastCandidateSummary[];
}

export type ElectionForecastListItem = ElectionForecastSummary;
