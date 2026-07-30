import type { ElectionRepositories } from "./types";

/**
 * Applies projection-level safeguards without mutating canonical persistence records.
 * This keeps every repository mode consistent while the underlying adapters remain read-only.
 */
export function normalizeElectionRepositories(
  repositories: ElectionRepositories,
): ElectionRepositories {
  return {
    ...repositories,
    races: new Proxy(repositories.races, {
      get(target, property, receiver) {
        const value = Reflect.get(target, property, receiver);
        if (typeof value !== "function") return value;
        return async (...args: readonly unknown[]) =>
          normalizeRaceProjection(await value.apply(target, args));
      },
    }),
  };
}

function normalizeRaceProjection<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeRaceProjection(item)) as T;
  }
  if (!value || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;
  if (Array.isArray(record.items)) {
    return {
      ...record,
      items: record.items.map((item) => normalizeRaceProjection(item)),
    } as T;
  }
  if (!Array.isArray(record.candidates)) return value;

  const incumbentCandidateId =
    typeof record.incumbentCandidateId === "string" ? record.incumbentCandidateId : null;
  return {
    ...record,
    candidates: record.candidates.map((candidate) => {
      if (!candidate || typeof candidate !== "object") return candidate;
      const candidateRecord = candidate as Record<string, unknown>;
      return {
        ...candidateRecord,
        incumbent:
          incumbentCandidateId != null && candidateRecord.id === incumbentCandidateId,
      };
    }),
  } as T;
}
