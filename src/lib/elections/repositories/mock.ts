import type {
  ReadonlyCandidateRepository,
  ReadonlyElectionCycleRepository,
  ReadonlyElectionForecastRepository,
  ReadonlyElectionPollRepository,
  ReadonlyElectionResultRepository,
  ReadonlyRaceRepository,
} from "../../../types/elections";
import type { ElectionRepositories } from "./types";

const EMPTY_PAGE = Object.freeze({
  items: Object.freeze([]),
  page: 1,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

function createEmptyReadonlyRepository<T extends object>(
  pagedMethods: readonly string[] = ["list", "listCore"],
): T {
  const paged = new Set(pagedMethods);

  return new Proxy(
    {},
    {
      get(_target, property) {
        if (typeof property !== "string") return undefined;

        return async () => {
          if (property === "count") return 0;
          if (property === "exists") return false;
          if (paged.has(property)) return EMPTY_PAGE;
          if (property.startsWith("list")) return Object.freeze([]);
          if (property.startsWith("find")) return null;

          throw new Error(`Unsupported empty mock repository method: ${property}`);
        };
      },
    },
  ) as T;
}

export function createMockElectionRepositories(): ElectionRepositories {
  return {
    mode: "mock",
    cycles: createEmptyReadonlyRepository<ReadonlyElectionCycleRepository>(),
    races: createEmptyReadonlyRepository<ReadonlyRaceRepository>(),
    candidates: createEmptyReadonlyRepository<ReadonlyCandidateRepository>(),
    polls: createEmptyReadonlyRepository<ReadonlyElectionPollRepository>([
      "list",
      "listCore",
      "listByRace",
    ]),
    forecasts: createEmptyReadonlyRepository<ReadonlyElectionForecastRepository>(),
    results: createEmptyReadonlyRepository<ReadonlyElectionResultRepository>(),
  };
}
