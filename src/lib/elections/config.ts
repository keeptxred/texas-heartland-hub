import { ELECTION_ROUTES } from "./routes";

export interface ElectionCycleConfig {
  year: number;
  label: string;
  electionDay: string;
  registrationDeadline?: string;
  earlyVotingStart?: string;
  earlyVotingEnd?: string;
  resultsCertificationTarget?: string;
  isActive: boolean;
}

export interface ElectionFreshnessConfig {
  staleAfterMs: number;
  expiredAfterMs: number;
}

export const ELECTION_CENTRAL_CONFIG = {
  brand: {
    name: "KeepTXRed Election Central",
    shortName: "Election Central",
    description:
      "Texas election races, candidates, polling, forecasts, voting information, and results from KeepTXRed.",
    siteUrl: "https://keeptxred.com",
    defaultSocialImage: "/images/elections/election-central-social.jpg",
  },
  locale: "en-US",
  timeZone: "America/Chicago",
  activeCycleYear: 2026,
  defaultRoute: ELECTION_ROUTES.root,
  cycles: [
    {
      year: 2026,
      label: "2026 Texas Elections",
      electionDay: "2026-11-03T07:00:00-06:00",
      registrationDeadline: "2026-10-05T23:59:59-05:00",
      earlyVotingStart: "2026-10-19T00:00:00-05:00",
      earlyVotingEnd: "2026-10-30T23:59:59-05:00",
      isActive: true,
    },
  ] satisfies readonly ElectionCycleConfig[],
  display: {
    defaultCandidateLimit: 6,
    defaultRaceLimit: 8,
    defaultPollLimit: 10,
    defaultNewsLimit: 6,
    compactCandidateLimit: 3,
    compactRaceLimit: 4,
    percentDecimalPlaces: 1,
    marginDecimalPlaces: 1,
  },
  refresh: {
    countdownMs: 1_000,
    liveResultsMs: 30_000,
    pollingMs: 15 * 60_000,
    forecastsMs: 30 * 60_000,
    electionNewsMs: 5 * 60_000,
    staticReferenceMs: 24 * 60 * 60_000,
  },
  freshness: {
    polls: {
      staleAfterMs: 14 * 24 * 60 * 60_000,
      expiredAfterMs: 45 * 24 * 60 * 60_000,
    },
    forecasts: {
      staleAfterMs: 24 * 60 * 60_000,
      expiredAfterMs: 7 * 24 * 60 * 60_000,
    },
    results: {
      staleAfterMs: 2 * 60_000,
      expiredAfterMs: 24 * 60 * 60_000,
    },
  } satisfies Record<string, ElectionFreshnessConfig>,
  behavior: {
    showUnratedRaces: true,
    showThirdPartyCandidates: true,
    showPollsterGrades: true,
    showForecastMethodology: true,
    requirePollSourceUrl: true,
    requireForecastUpdatedAt: true,
    hideEmptySections: true,
    indexEmptyDetailPages: false,
    enableLiveResultAutoRefresh: true,
  },
  editorial: {
    minimumContextualInternalLinks: 2,
    requireSourceAttribution: true,
    requireLastUpdatedLabel: true,
    distinguishPollingFromForecasts: true,
    distinguishUnofficialFromCertifiedResults: true,
    defaultDisclaimer:
      "Polling and forecasts are snapshots, not guarantees. Election results remain unofficial until certified by the appropriate authority.",
  },
  accessibility: {
    announceLiveResultUpdates: true,
    minimumTouchTargetPx: 44,
    useTextAlongsideColor: true,
  },
} as const;

export type ElectionCentralConfig = typeof ELECTION_CENTRAL_CONFIG;

export function getElectionCycleConfig(
  year: number = ELECTION_CENTRAL_CONFIG.activeCycleYear,
): ElectionCycleConfig | undefined {
  return ELECTION_CENTRAL_CONFIG.cycles.find((cycle) => cycle.year === year);
}

export function getActiveElectionCycleConfig(): ElectionCycleConfig {
  const activeCycle = ELECTION_CENTRAL_CONFIG.cycles.find((cycle) => cycle.isActive);

  if (!activeCycle) {
    throw new Error("Election Central requires one active election cycle.");
  }

  return activeCycle;
}

export function isElectionDataStale(
  kind: keyof typeof ELECTION_CENTRAL_CONFIG.freshness,
  updatedAt: string | Date,
  now: Date = new Date(),
): boolean {
  const updatedTime = updatedAt instanceof Date ? updatedAt.getTime() : new Date(updatedAt).getTime();
  if (!Number.isFinite(updatedTime)) return true;

  return now.getTime() - updatedTime > ELECTION_CENTRAL_CONFIG.freshness[kind].staleAfterMs;
}

export function isElectionDataExpired(
  kind: keyof typeof ELECTION_CENTRAL_CONFIG.freshness,
  updatedAt: string | Date,
  now: Date = new Date(),
): boolean {
  const updatedTime = updatedAt instanceof Date ? updatedAt.getTime() : new Date(updatedAt).getTime();
  if (!Number.isFinite(updatedTime)) return true;

  return now.getTime() - updatedTime > ELECTION_CENTRAL_CONFIG.freshness[kind].expiredAfterMs;
}
