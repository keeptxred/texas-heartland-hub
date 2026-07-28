import candidatesData from "../../../data/elections/2026/candidates.json";
import cycleData from "../../../data/elections/2026/cycle.json";
import forecastsData from "../../../data/elections/2026/forecasts.json";
import pollsData from "../../../data/elections/2026/polls.json";
import racesData from "../../../data/elections/2026/races.json";
import resultsData from "../../../data/elections/2026/results.json";
import type {
  ReadonlyCandidateRepository,
  ReadonlyElectionCycleRepository,
  ReadonlyElectionForecastRepository,
  ReadonlyElectionPollRepository,
  ReadonlyElectionResultRepository,
  ReadonlyRaceRepository,
} from "../../../types/elections";
import type { ElectionRepositories } from "./types";

type StaticRecord = Readonly<Record<string, unknown>>;
type StaticQuery = {
  filters?: Record<string, unknown>;
  pagination?: { page?: number; pageSize?: number };
};

function read(record: StaticRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined) return record[key];
  }
  return undefined;
}

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function matchesFilters(record: StaticRecord, filters?: Record<string, unknown>): boolean {
  if (!filters) return true;

  return Object.entries(filters).every(([key, expected]) => {
    if (expected === undefined || expected === null || expected === "") return true;
    if (key === "search") {
      const needle = normalize(expected);
      return Object.values(record).some((value) => normalize(value).includes(needle));
    }

    const singularKey = key.endsWith("s") ? key.slice(0, -1) : key;
    const actual = read(record, key, singularKey);
    if (Array.isArray(expected)) {
      return expected.some((value) => normalize(value) === normalize(actual));
    }
    return normalize(actual) === normalize(expected);
  });
}

function page<T>(items: readonly T[], query?: StaticQuery) {
  const requestedPage = Math.max(1, query?.pagination?.page ?? 1);
  const requestedPageSize = Math.max(1, query?.pagination?.pageSize ?? Math.max(items.length, 1));
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / requestedPageSize);
  const start = (requestedPage - 1) * requestedPageSize;

  return Object.freeze({
    items: Object.freeze(items.slice(start, start + requestedPageSize)),
    page: requestedPage,
    pageSize: requestedPageSize,
    totalItems,
    totalPages,
    hasNextPage: requestedPage < totalPages,
    hasPreviousPage: requestedPage > 1 && totalPages > 0,
  });
}

function createStaticReadonlyRepository<T extends object>(input: readonly StaticRecord[]): T {
  const records = Object.freeze([...input]);
  const filtered = (query?: StaticQuery) =>
    records.filter((record) => matchesFilters(record, query?.filters));
  const find = (key: string, value: unknown) =>
    records.find((record) => normalize(read(record, key)) === normalize(value)) ?? null;

  return new Proxy(
    {},
    {
      get(_target, property) {
        if (typeof property !== "string") return undefined;

        if (property === "list" || property === "listCore") {
          return async (query?: StaticQuery) => page(filtered(query), query);
        }
        if (property === "count") {
          return async (filters?: Record<string, unknown>) =>
            records.filter((record) => matchesFilters(record, filters)).length;
        }
        if (property === "exists") {
          return async (lookup: Record<string, unknown>) =>
            records.some((record) => matchesFilters(record, lookup));
        }
        if (property === "findById" || property === "findSummaryById" || property === "findDetailById") {
          return async (id: unknown) => find("id", id);
        }
        if (property === "findBySlug") {
          return async (slug: unknown) => find("slug", slug);
        }
        if (property === "findByYear") {
          return async (year: unknown, stateCode?: unknown) =>
            records.find(
              (record) =>
                normalize(read(record, "year")) === normalize(year) &&
                (stateCode === undefined ||
                  normalize(read(record, "stateCode", "state_code")) === normalize(stateCode)),
            ) ?? null;
        }
        if (property === "findActive") {
          return async (stateCode?: unknown) =>
            records.find(
              (record) =>
                Boolean(read(record, "active", "is_active")) &&
                (stateCode === undefined ||
                  normalize(read(record, "stateCode", "state_code")) === normalize(stateCode)),
            ) ?? null;
        }
        if (property.startsWith("findBy")) {
          const field = property.slice("findBy".length);
          const key = field.charAt(0).toLowerCase() + field.slice(1);
          return async (value: unknown) => find(key, value);
        }
        if (property.startsWith("listBy")) {
          const field = property.slice("listBy".length);
          const key = field.charAt(0).toLowerCase() + field.slice(1);
          return async (value: unknown) =>
            Object.freeze(records.filter((record) => normalize(read(record, key, `${key}_id`)) === normalize(value)));
        }
        if (property.startsWith("list")) {
          return async (_arg?: unknown, limit?: number) =>
            Object.freeze(typeof limit === "number" ? records.slice(0, limit) : [...records]);
        }

        throw new Error(`Unsupported static election repository method: ${property}`);
      },
    },
  ) as T;
}

export function createStaticElectionRepositories(): ElectionRepositories {
  return {
    mode: "static",
    cycles: createStaticReadonlyRepository<ReadonlyElectionCycleRepository>(cycleData),
    races: createStaticReadonlyRepository<ReadonlyRaceRepository>(racesData),
    candidates: createStaticReadonlyRepository<ReadonlyCandidateRepository>(candidatesData),
    polls: createStaticReadonlyRepository<ReadonlyElectionPollRepository>(pollsData),
    forecasts: createStaticReadonlyRepository<ReadonlyElectionForecastRepository>(forecastsData),
    results: createStaticReadonlyRepository<ReadonlyElectionResultRepository>(resultsData),
  };
}
