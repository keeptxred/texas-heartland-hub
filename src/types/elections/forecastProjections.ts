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
import type { ElectionFreshnessStatus, IsoDateTimeString } from "./metadata";
import type { ElectionForecast } from "./forecast";
import type {
  ForecastConfidenceLevel,
  ForecastModel,
  ForecastRating,
  ForecastStatus,
} from "./forecastClassifications";
import type { OfficeLevel } from "./raceClassifications";

export const FORECAST_COVERAGE_CATEGORIES = [
  "us_senate",
  "statewide_executive",
  "us_house",
  "texas_senate",
  "texas_house",
] as const;

export type ForecastCoverageCategory = (typeof FORECAST_COVERAGE_CATEGORIES)[number];

export const FORECAST_COVERAGE_CATEGORY_LABELS: Record<ForecastCoverageCategory, string> = {
  us_senate: "U.S. Senate",
  statewide_executive: "Statewide executive",
  us_house: "Competitive congressional",
  texas_senate: "Competitive Texas Senate",
  texas_house: "Competitive Texas House",
};

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
  pollingAverage: number | null;
  winProbabilityChange: number | null;
}

export interface ForecastRaceSummary {
  id: RaceId;
  slug: RaceSlug;
  name: string;
  officeName: string;
  officeLevel: OfficeLevel;
  districtName: string | null;
  electionDate: string;
  forecastCoverage: ForecastCoverageCategory;
  competitive: boolean;
}

export interface ElectionForecastSummary {
  id: ForecastId;
  slug: ForecastSlug;
  electionCycleId: ElectionCycleId;
  race: ForecastRaceSummary;
  sourceId: string | null;
  sourceName: string;
  title: string;
  status: ForecastStatus;
  rating: ForecastRating;
  confidenceLevel: ForecastConfidenceLevel;
  model: ForecastModel;
  projectedWinnerCandidateId: CandidateId | null;
  projectedMargin: number | null;
  candidates: readonly ForecastCandidateSummary[];
  freshnessStatus: ElectionFreshnessStatus;
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

export function isFundamentalsBasedForecast(forecast: Pick<ElectionForecast, "model">): boolean {
  return forecast.model.model === "fundamentals";
}

export function isForecastInLaunchCoverage(forecast: ElectionForecastSummary): boolean {
  if (
    forecast.race.forecastCoverage === "us_house" ||
    forecast.race.forecastCoverage === "texas_senate" ||
    forecast.race.forecastCoverage === "texas_house"
  ) {
    return forecast.race.competitive;
  }
  return true;
}
