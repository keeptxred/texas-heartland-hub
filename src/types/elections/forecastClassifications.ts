export const FORECAST_STATUSES = [
  "draft",
  "active",
  "paused",
  "final",
  "archived",
] as const;

export const FORECAST_MODELS = [
  "fundamentals",
  "polling",
  "hybrid",
  "expert_rating",
  "simulation",
  "other",
] as const;

export const FORECAST_RATINGS = [
  "safe_republican",
  "likely_republican",
  "leans_republican",
  "toss_up",
  "leans_democratic",
  "likely_democratic",
  "safe_democratic",
  "safe_other",
  "unrated",
] as const;

export const FORECAST_CONFIDENCE_LEVELS = [
  "low",
  "medium",
  "high",
  "very_high",
  "unknown",
] as const;

export type ForecastStatus = (typeof FORECAST_STATUSES)[number];
export type ForecastModel = (typeof FORECAST_MODELS)[number];
export type ForecastRating = (typeof FORECAST_RATINGS)[number];
export type ForecastConfidenceLevel =
  (typeof FORECAST_CONFIDENCE_LEVELS)[number];

export const FORECAST_STATUS_LABELS: Record<ForecastStatus, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  final: "Final",
  archived: "Archived",
};

export const FORECAST_MODEL_LABELS: Record<ForecastModel, string> = {
  fundamentals: "Fundamentals",
  polling: "Polling",
  hybrid: "Hybrid",
  expert_rating: "Expert rating",
  simulation: "Simulation",
  other: "Other",
};

export const FORECAST_RATING_LABELS: Record<ForecastRating, string> = {
  safe_republican: "Safe Republican",
  likely_republican: "Likely Republican",
  leans_republican: "Leans Republican",
  toss_up: "Toss-up",
  leans_democratic: "Leans Democratic",
  likely_democratic: "Likely Democratic",
  safe_democratic: "Safe Democratic",
  safe_other: "Safe other",
  unrated: "Unrated",
};

export const FORECAST_CONFIDENCE_LEVEL_LABELS: Record<
  ForecastConfidenceLevel,
  string
> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  very_high: "Very high",
  unknown: "Unknown",
};

function includesValue<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function isForecastStatus(value: unknown): value is ForecastStatus {
  return includesValue(FORECAST_STATUSES, value);
}

export function isForecastModel(value: unknown): value is ForecastModel {
  return includesValue(FORECAST_MODELS, value);
}

export function isForecastRating(value: unknown): value is ForecastRating {
  return includesValue(FORECAST_RATINGS, value);
}

export function isForecastConfidenceLevel(
  value: unknown,
): value is ForecastConfidenceLevel {
  return includesValue(FORECAST_CONFIDENCE_LEVELS, value);
}
