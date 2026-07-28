import type {
  CandidateId,
  CandidateListQuery,
  CandidateSlug,
  ElectionCycleId,
  ElectionCycleListQuery,
  ElectionCycleSlug,
  ElectionForecastListQuery,
  ElectionPollListQuery,
  ElectionResultListQuery,
  ForecastId,
  ForecastSlug,
  PollId,
  PollSlug,
  RaceId,
  RaceListQuery,
  RaceSlug,
} from "@/types/elections";

export type ElectionRecordIdentifier = string;

export const electionQueryKeys = {
  all: ["elections"] as const,

  cycles: {
    all: () => [...electionQueryKeys.all, "cycles"] as const,
    lists: () => [...electionQueryKeys.cycles.all(), "list"] as const,
    list: (query?: ElectionCycleListQuery) =>
      [...electionQueryKeys.cycles.lists(), query ?? {}] as const,
    details: () => [...electionQueryKeys.cycles.all(), "detail"] as const,
    detailById: (id: ElectionCycleId) => [...electionQueryKeys.cycles.details(), "id", id] as const,
    detailBySlug: (slug: ElectionCycleSlug) =>
      [...electionQueryKeys.cycles.details(), "slug", slug] as const,
    active: (stateCode = "TX") => [...electionQueryKeys.cycles.all(), "active", stateCode] as const,
  },

  races: {
    all: () => [...electionQueryKeys.all, "races"] as const,
    lists: () => [...electionQueryKeys.races.all(), "list"] as const,
    list: (query?: RaceListQuery) => [...electionQueryKeys.races.lists(), query ?? {}] as const,
    details: () => [...electionQueryKeys.races.all(), "detail"] as const,
    detailById: (id: RaceId) => [...electionQueryKeys.races.details(), "id", id] as const,
    detailBySlug: (slug: RaceSlug, electionCycleId?: ElectionCycleId) =>
      [...electionQueryKeys.races.details(), "slug", slug, electionCycleId ?? null] as const,
    featured: (electionCycleId: ElectionCycleId, limit?: number) =>
      [...electionQueryKeys.races.all(), "featured", electionCycleId, limit ?? null] as const,
  },

  candidates: {
    all: () => [...electionQueryKeys.all, "candidates"] as const,
    lists: () => [...electionQueryKeys.candidates.all(), "list"] as const,
    list: (query?: CandidateListQuery) =>
      [...electionQueryKeys.candidates.lists(), query ?? {}] as const,
    details: () => [...electionQueryKeys.candidates.all(), "detail"] as const,
    detailById: (id: CandidateId) => [...electionQueryKeys.candidates.details(), "id", id] as const,
    detailBySlug: (slug: CandidateSlug, electionCycleId?: ElectionCycleId) =>
      [...electionQueryKeys.candidates.details(), "slug", slug, electionCycleId ?? null] as const,
    byRace: (raceId: RaceId) => [...electionQueryKeys.candidates.all(), "race", raceId] as const,
  },

  polls: {
    all: () => [...electionQueryKeys.all, "polls"] as const,
    lists: () => [...electionQueryKeys.polls.all(), "list"] as const,
    list: (query?: ElectionPollListQuery) =>
      [...electionQueryKeys.polls.lists(), query ?? {}] as const,
    details: () => [...electionQueryKeys.polls.all(), "detail"] as const,
    detail: (id: PollId) => [...electionQueryKeys.polls.details(), id] as const,
    detailBySlug: (slug: PollSlug, electionCycleId?: ElectionCycleId) =>
      [...electionQueryKeys.polls.details(), "slug", slug, electionCycleId ?? null] as const,
    byRace: (raceId: RaceId, query?: Omit<ElectionPollListQuery, "filters">) =>
      [...electionQueryKeys.polls.all(), "race", raceId, query ?? {}] as const,
    latest: (electionCycleId: ElectionCycleId, limit?: number) =>
      [...electionQueryKeys.polls.all(), "latest", electionCycleId, limit ?? null] as const,
  },

  forecasts: {
    all: () => [...electionQueryKeys.all, "forecasts"] as const,
    lists: () => [...electionQueryKeys.forecasts.all(), "list"] as const,
    list: (query?: ElectionForecastListQuery) =>
      [...electionQueryKeys.forecasts.lists(), query ?? {}] as const,
    details: () => [...electionQueryKeys.forecasts.all(), "detail"] as const,
    detail: (id: ForecastId) => [...electionQueryKeys.forecasts.details(), id] as const,
    detailBySlug: (slug: ForecastSlug, electionCycleId?: ElectionCycleId) =>
      [...electionQueryKeys.forecasts.details(), "slug", slug, electionCycleId ?? null] as const,
    byRace: (raceId: RaceId) => [...electionQueryKeys.forecasts.all(), "race", raceId] as const,
    featured: (electionCycleId: ElectionCycleId, limit?: number) =>
      [...electionQueryKeys.forecasts.all(), "featured", electionCycleId, limit ?? null] as const,
  },

  results: {
    all: () => [...electionQueryKeys.all, "results"] as const,
    lists: () => [...electionQueryKeys.results.all(), "list"] as const,
    list: (query?: ElectionResultListQuery) =>
      [...electionQueryKeys.results.lists(), query ?? {}] as const,
    details: () => [...electionQueryKeys.results.all(), "detail"] as const,
    detail: (identifier: ElectionRecordIdentifier) =>
      [...electionQueryKeys.results.details(), identifier] as const,
    byRace: (raceId: RaceId) => [...electionQueryKeys.results.all(), "race", raceId] as const,
    active: (electionCycleId: ElectionCycleId, limit?: number) =>
      [...electionQueryKeys.results.all(), "active", electionCycleId, limit ?? null] as const,
  },
} as const;
