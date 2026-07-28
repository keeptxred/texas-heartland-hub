export const ELECTION_REPOSITORY_MODES = ["mock", "supabase", "api"] as const;

export type ElectionRepositoryMode = (typeof ELECTION_REPOSITORY_MODES)[number];

export const DEFAULT_ELECTION_REPOSITORY_MODE: ElectionRepositoryMode = "mock";

export interface ElectionRepositoryConfig {
  mode: ElectionRepositoryMode;
}

export function isElectionRepositoryMode(value: unknown): value is ElectionRepositoryMode {
  return (
    typeof value === "string" &&
    (ELECTION_REPOSITORY_MODES as readonly string[]).includes(value)
  );
}

export function parseElectionRepositoryMode(
  value: unknown,
  fallback: ElectionRepositoryMode = DEFAULT_ELECTION_REPOSITORY_MODE,
): ElectionRepositoryMode {
  if (typeof value !== "string") return fallback;

  const normalized = value.trim().toLowerCase();
  return isElectionRepositoryMode(normalized) ? normalized : fallback;
}

export function readElectionRepositoryConfig(
  env: Record<string, unknown> = import.meta.env,
): ElectionRepositoryConfig {
  return {
    mode: parseElectionRepositoryMode(env.VITE_ELECTION_REPOSITORY_MODE),
  };
}

export const electionRepositoryConfig = readElectionRepositoryConfig();
