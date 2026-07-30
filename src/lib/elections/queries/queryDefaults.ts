export const ELECTION_QUERY_TIMES = {
  stale: {
    cycle: 30 * 60 * 1000,
    race: 5 * 60 * 1000,
    candidate: 15 * 60 * 1000,
    poll: 10 * 60 * 1000,
    forecast: 5 * 60 * 1000,
    result: 30 * 1000,
  },
  garbageCollection: 30 * 60 * 1000,
  polling: {
    activeResults: 30 * 1000,
    nearlyCompleteResults: 2 * 60 * 1000,
    admin: 60 * 1000,
  },
} as const;

export const electionQueryDefaults = {
  retry: 2,
  staleTime: ELECTION_QUERY_TIMES.stale.race,
  gcTime: ELECTION_QUERY_TIMES.garbageCollection,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: false,
} as const;

export const electionAdminQueryDefaults = {
  ...electionQueryDefaults,
  retry: 1,
  staleTime: 30 * 1000,
  refetchOnWindowFocus: true,
  refetchOnMount: "always" as const,
} as const;

export const electionQueryStaleTimes = {
  cycles: ELECTION_QUERY_TIMES.stale.cycle,
  races: ELECTION_QUERY_TIMES.stale.race,
  candidates: ELECTION_QUERY_TIMES.stale.candidate,
  polls: ELECTION_QUERY_TIMES.stale.poll,
  forecasts: ELECTION_QUERY_TIMES.stale.forecast,
  results: ELECTION_QUERY_TIMES.stale.result,
} as const;

export type ElectionResultRefreshState =
  | "pre_election"
  | "not_reporting"
  | "reporting"
  | "nearly_complete"
  | "complete"
  | "certified";

export function getElectionResultRefetchInterval(
  state: ElectionResultRefreshState | null | undefined,
): number | false {
  switch (state) {
    case "reporting":
      return ELECTION_QUERY_TIMES.polling.activeResults;
    case "nearly_complete":
      return ELECTION_QUERY_TIMES.polling.nearlyCompleteResults;
    default:
      return false;
  }
}
