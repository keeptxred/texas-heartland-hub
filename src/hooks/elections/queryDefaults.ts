import type { DefaultOptions, QueryObserverOptions } from "@tanstack/react-query";
import { ELECTION_CENTRAL_CONFIG } from "@/lib/elections/config";

export const ELECTION_QUERY_DEFAULTS = {
  public: {
    retry: 2,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  },
  staticReference: {
    staleTime: ELECTION_CENTRAL_CONFIG.refresh.staticReferenceMs,
    refetchOnWindowFocus: false,
  },
  polls: {
    staleTime: ELECTION_CENTRAL_CONFIG.refresh.pollingMs,
    refetchInterval: ELECTION_CENTRAL_CONFIG.refresh.pollingMs,
    refetchIntervalInBackground: false,
  },
  forecasts: {
    staleTime: ELECTION_CENTRAL_CONFIG.refresh.forecastsMs,
    refetchInterval: ELECTION_CENTRAL_CONFIG.refresh.forecastsMs,
    refetchIntervalInBackground: false,
  },
  activeResults: {
    staleTime: 15_000,
    refetchInterval: ELECTION_CENTRAL_CONFIG.refresh.liveResultsMs,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  },
  completedResults: {
    staleTime: 30 * 60_000,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  },
  admin: {
    retry: 1,
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: "always",
  },
} as const;

export const electionQueryClientDefaults: DefaultOptions = {
  queries: ELECTION_QUERY_DEFAULTS.public,
};

export function electionQueryOptions<TData>(
  options: QueryObserverOptions<TData>,
): QueryObserverOptions<TData> {
  return {
    ...ELECTION_QUERY_DEFAULTS.public,
    ...options,
  };
}

export function electionAdminQueryOptions<TData>(
  options: QueryObserverOptions<TData>,
): QueryObserverOptions<TData> {
  return {
    ...ELECTION_QUERY_DEFAULTS.admin,
    ...options,
  };
}
