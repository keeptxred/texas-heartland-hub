declare const electionIdentifierBrand: unique symbol;

/**
 * Nominal string type used to prevent IDs and slugs for different election
 * entities from being mixed accidentally while preserving string behavior at
 * runtime.
 */
export type ElectionIdentifier<Brand extends string> = string & {
  readonly [electionIdentifierBrand]: Brand;
};

export type ElectionEntityId = ElectionIdentifier<"ElectionEntityId">;
export type ElectionSlug = ElectionIdentifier<"ElectionSlug">;

export type ElectionCycleId = ElectionIdentifier<"ElectionCycleId">;
export type ElectionCycleSlug = ElectionIdentifier<"ElectionCycleSlug">;

export type OfficeId = ElectionIdentifier<"OfficeId">;
export type OfficeSlug = ElectionIdentifier<"OfficeSlug">;

export type DistrictId = ElectionIdentifier<"DistrictId">;
export type DistrictSlug = ElectionIdentifier<"DistrictSlug">;

export type RaceId = ElectionIdentifier<"RaceId">;
export type RaceSlug = ElectionIdentifier<"RaceSlug">;

export type CandidateId = ElectionIdentifier<"CandidateId">;
export type CandidateSlug = ElectionIdentifier<"CandidateSlug">;

export type PollId = ElectionIdentifier<"PollId">;
export type PollSlug = ElectionIdentifier<"PollSlug">;

export type ForecastId = ElectionIdentifier<"ForecastId">;
export type ForecastSlug = ElectionIdentifier<"ForecastSlug">;

export type ElectionResultId = ElectionIdentifier<"ElectionResultId">;
export type ElectionResultSlug = ElectionIdentifier<"ElectionResultSlug">;

export type CoreElectionId =
  | ElectionCycleId
  | OfficeId
  | DistrictId
  | RaceId
  | CandidateId
  | PollId
  | ForecastId
  | ElectionResultId;

export type CoreElectionSlug =
  | ElectionCycleSlug
  | OfficeSlug
  | DistrictSlug
  | RaceSlug
  | CandidateSlug
  | PollSlug
  | ForecastSlug
  | ElectionResultSlug;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isElectionIdentifier(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isElectionSlug(value: unknown): value is ElectionSlug {
  return typeof value === "string" && SLUG_PATTERN.test(value);
}

export function toElectionIdentifier<Brand extends string>(
  value: string,
  label = "Election identifier",
): ElectionIdentifier<Brand> {
  const normalized = value.trim();

  if (!normalized) {
    throw new TypeError(`${label} must be a non-empty string.`);
  }

  return normalized as ElectionIdentifier<Brand>;
}

export function toElectionSlug<Brand extends string>(
  value: string,
  label = "Election slug",
): ElectionIdentifier<Brand> {
  const normalized = value.trim().toLowerCase();

  if (!SLUG_PATTERN.test(normalized)) {
    throw new TypeError(
      `${label} must contain only lowercase letters, numbers, and single hyphens.`,
    );
  }

  return normalized as ElectionIdentifier<Brand>;
}

export const electionIds = {
  cycle: (value: string) =>
    toElectionIdentifier<"ElectionCycleId">(value, "Election cycle ID"),
  office: (value: string) =>
    toElectionIdentifier<"OfficeId">(value, "Office ID"),
  district: (value: string) =>
    toElectionIdentifier<"DistrictId">(value, "District ID"),
  race: (value: string) => toElectionIdentifier<"RaceId">(value, "Race ID"),
  candidate: (value: string) =>
    toElectionIdentifier<"CandidateId">(value, "Candidate ID"),
  poll: (value: string) => toElectionIdentifier<"PollId">(value, "Poll ID"),
  forecast: (value: string) =>
    toElectionIdentifier<"ForecastId">(value, "Forecast ID"),
  result: (value: string) =>
    toElectionIdentifier<"ElectionResultId">(value, "Election result ID"),
} as const;

export const electionSlugs = {
  cycle: (value: string) =>
    toElectionSlug<"ElectionCycleSlug">(value, "Election cycle slug"),
  office: (value: string) =>
    toElectionSlug<"OfficeSlug">(value, "Office slug"),
  district: (value: string) =>
    toElectionSlug<"DistrictSlug">(value, "District slug"),
  race: (value: string) => toElectionSlug<"RaceSlug">(value, "Race slug"),
  candidate: (value: string) =>
    toElectionSlug<"CandidateSlug">(value, "Candidate slug"),
  poll: (value: string) => toElectionSlug<"PollSlug">(value, "Poll slug"),
  forecast: (value: string) =>
    toElectionSlug<"ForecastSlug">(value, "Forecast slug"),
  result: (value: string) =>
    toElectionSlug<"ElectionResultSlug">(value, "Election result slug"),
} as const;