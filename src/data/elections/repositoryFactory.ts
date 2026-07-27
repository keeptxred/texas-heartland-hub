import type {
  CandidateRepository,
  ElectionCycleRepository,
  ElectionResultRepository,
  ForecastRepository,
  PollRepository,
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
  polls: PollRepository;
  forecasts: ForecastRepository;
  results: ElectionResultRepository;
  cycles: ElectionCycleRepository;
}

const READ_METHOD_PREFIXES = ["find", "get", "list", "search", "count", "exists"];

function createEmptyMockRepository<T extends object>(name: string): T {
  return new Proxy(
    {},
    {
      get: (_target, property) => {
        if (typeof property !== "string") return undefined;

        if (property === "count") return async () => 0;
        if (property === "exists") return async () => false;
        if (property.startsWith("list") || property.startsWith("search")) {
          return async () => ({ items: [], total: 0, page: 1, pageSize: 0, totalPages: 0 });
        }
        if (property.startsWith("find") || property.startsWith("get")) {
          return async () => null;
        }
        if (READ_METHOD_PREFIXES.some((prefix) => property.startsWith(prefix))) {
          return async () => [];
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
    polls: createEmptyMockRepository<PollRepository>("polls"),
    forecasts: createEmptyMockRepository<ForecastRepository>("forecasts"),
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
