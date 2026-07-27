export const ELECTION_REPOSITORY_MODES = ["mock", "supabase", "api"] as const;

export type ElectionRepositoryMode =
  (typeof ELECTION_REPOSITORY_MODES)[number];

export interface ElectionRepositoryConfiguration {
  mode: ElectionRepositoryMode;
  source: "environment" | "default";
}

export const DEFAULT_ELECTION_REPOSITORY_MODE: ElectionRepositoryMode = "mock";

export function isElectionRepositoryMode(
  value: unknown,
): value is ElectionRepositoryMode {
  return (
    typeof value === "string" &&
    ELECTION_REPOSITORY_MODES.includes(value as ElectionRepositoryMode)
  );
}

export function resolveElectionRepositoryConfiguration(
  value: unknown = import.meta.env.VITE_ELECTION_REPOSITORY_MODE,
): ElectionRepositoryConfiguration {
  if (isElectionRepositoryMode(value)) {
    return { mode: value, source: "environment" };
  }

  return {
    mode: DEFAULT_ELECTION_REPOSITORY_MODE,
    source: "default",
  };
}

export const electionRepositoryConfiguration =
  resolveElectionRepositoryConfiguration();
