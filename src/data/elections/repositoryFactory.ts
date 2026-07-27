import type {
  CandidateRepository,
  ElectionCycleRepository,
  ElectionForecastRepository,
  ElectionPollRepository,
  ElectionResultRepository,
  RaceRepository,
} from "@/types/elections";
import {
  electionRepositoryConfiguration,
  type ElectionRepositoryMode,
} from "./repositoryConfig";

export interface ElectionRepositories {
  mode: ElectionRepositoryMode;
  races: RaceRepository;
  candidates: CandidateRepository;
  polls: ElectionPollRepository;
  forecasts: ElectionForecastRepository;
  results: ElectionResultRepository;
  cycles: ElectionCycleRepository;
}

const EMPTY_PAGE = {
  items: [],
  page: 1,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
} as const;

function createEmptyMockRepository<T extends object>(name: string): T {
  return new Proxy(
    {},
    {
      get: (_target, property) => {
        if (typeof property !== "string") return undefined;

        if (property === "count") return async () => 0;
        if (property === "exists" || property === "delete") {
          return async () => false;
        }
        if (property === "list" || property === "listCore") {
          return async () => EMPTY_PAGE;
        }
        if (property.startsWith("list") || property.startsWith("search")) {
          return async () => [];
        }
        if (property.startsWith("find") || property.startsWith("get")) {
          return async () => null;
        }

        return async () => {
          throw new Error(
            `${name}.${property} is unavailable in the read-only mock repository.`,
          );
        };
      },
    },
  ) as T;
}

function createMockElectionRepositories(): ElectionRepositories {
  return {
    mode: "mock",
    races: createEmptyMockRepository<RaceRepository>("races"),
    candidates: createEmptyMockRepository<CandidateRepository>("candidates"),
    polls: createEmptyMockRepository<ElectionPollRepository>("polls"),
    forecasts:
      createEmptyMockRepository<ElectionForecastRepository>("forecasts"),
    results: createEmptyMockRepository<ElectionResultRepository>("results"),
    cycles: createEmptyMockRepository<ElectionCycleRepository>("cycles"),
  };
}

export class UnsupportedElectionRepositoryModeError extends Error {
  constructor(mode: ElectionRepositoryMode) {
    super(
      `Election repository mode "${mode}" is not connected. Use "mock" until its implementation is available.`,
    );
    this.name = "UnsupportedElectionRepositoryModeError";
  }
}

export function createElectionRepositories(
  mode: ElectionRepositoryMode = electionRepositoryConfiguration.mode,
): ElectionRepositories {
  switch (mode) {
    case "mock":
      return createMockElectionRepositories();
    case "supabase":
    case "api":
      throw new UnsupportedElectionRepositoryModeError(mode);
    default: {
      const exhaustiveCheck: never = mode;
      throw new Error(`Unsupported election repository mode: ${exhaustiveCheck}`);
    }
  }
}
