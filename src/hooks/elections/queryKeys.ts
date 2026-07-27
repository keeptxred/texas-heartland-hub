import type {
  CandidateFilters,
  CandidateId,
  CandidateListQuery,
  CandidateSlug,
  ElectionCycleId,
  ElectionCycleListQuery,
  ElectionForecastListQuery,
  ElectionPollListQuery,
  ElectionResultId,
  ElectionResultListQuery,
  ForecastId,
  PollId,
  RaceId,
  RaceListQuery,
  RaceSlug,
} from "@/types/elections";

export const electionQueryKeys = {
  all: ["elections"] as const,
  races: {
    all: () => [...electionQueryKeys.all, "races"] as const,
    lists: () => [...electionQueryKeys.races.all(), "list"] as const,
    list: (query?: RaceListQuery) =>
      [...electionQueryKeys.races.lists(), query ?? null] as const,
    featured: (cycleId: ElectionCycleId, limit?: number) =>
      [...electionQueryKeys.races.all(), "featured", cycleId, limit ?? null] as const,
    detail: (identifier: RaceId | RaceSlug) =>
      [...electionQueryKeys.races.all(), "detail", identifier] as const,
  },
  candidates: {
    all: () => [...electionQueryKeys.all, "candidates"] as const,
    lists: () => [...electionQueryKeys.candidates.all(), "list"] as const,
    list: (query?: CandidateListQuery) =>
      [...electionQueryKeys.candidates.lists(), query ?? null] as const,
    byRace: (raceId: RaceId, filters?: CandidateFilters) =>
      [...electionQueryKeys.candidates.all(), "race", raceId, filters ?? null] as const,
    detail: (identifier: CandidateId | CandidateSlug) =>
      [...electionQueryKeys.candidates.all(), "detail", identifier] as const,
  },
  polls: {
    all: () => [...electionQueryKeys.all, "polls"] as const,
    lists: () => [...electionQueryKeys.polls.all(), "list"] as const,
    list: (query?: ElectionPollListQuery) =>
      [...electionQueryKeys.polls.lists(), query ?? null] as const,
    byRace: (raceId: RaceId) =>
      [...electionQueryKeys.polls.all(), "race", raceId] as const,
    detail: (id: PollId) => [...electionQueryKeys.polls.all(), "detail", id] as const,
    latest: (cycleId: ElectionCycleId, limit?: number) =>
      [...electionQueryKeys.polls.all(), "latest", cycleId, limit ?? null] as const,
  },
  forecasts: {
    all: () => [...electionQueryKeys.all, "forecasts"] as const,
    lists: () => [...electionQueryKeys.forecasts.all(), "list"] as const,
    list: (query?: ElectionForecastListQuery) =>
      [...electionQueryKeys.forecasts.lists(), query ?? null] as const,
    byRace: (raceId: RaceId, source?: string) =>
      [...electionQueryKeys.forecasts.all(), "race", raceId, source ?? null] as const,
    detail: (id: ForecastId) =>
      [...electionQueryKeys.forecasts.all(), "detail", id] as const,
    featured: (cycleId: ElectionCycleId) =>
      [...electionQueryKeys.forecasts.all(), "featured", cycleId] as const,
  },
  results: {
    all: () => [...electionQueryKeys.all, "results"] as const,
    lists: () => [...electionQueryKeys.results.all(), "list"] as const,
    list: (query?: ElectionResultListQuery) =>
      [...electionQueryKeys.results.lists(), query ?? null] as const,
    byRace: (raceId: RaceId) =>
      [...electionQueryKeys.results.all(), "race", raceId] as const,
    detail: (id: ElectionResultId) =>
      [...electionQueryKeys.results.all(), "detail", id] as const,
    active: (cycleId?: ElectionCycleId) =>
      [...electionQueryKeys.results.all(), "active", cycleId ?? null] as const,
  },
  cycles: {
    all: () => [...electionQueryKeys.all, "cycles"] as const,
    lists: () => [...electionQueryKeys.cycles.all(), "list"] as const,
    list: (query?: ElectionCycleListQuery) =>
      [...electionQueryKeys.cycles.lists(), query ?? null] as const,
    detail: (id: ElectionCycleId) =>
      [...electionQueryKeys.cycles.all(), "detail", id] as const,
    active: () => [...electionQueryKeys.cycles.all(), "active"] as const,
  },
} as const;
