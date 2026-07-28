export const ELECTION_ROUTES = {
  root: "/elections",
  cycle: (year: number | string) => `/elections/${year}` as const,
  races: "/elections/races",
  race: (slug: string) => `/elections/races/${slug}` as const,
  candidates: "/elections/candidates",
  candidate: (slug: string) => `/elections/candidates/${slug}` as const,
  polls: "/elections/polls",
  forecast: "/elections/forecast",
  forecastDetail: (slug: string) => `/elections/forecast/${slug}` as const,
  results: "/elections/results",
  result: (slug: string) => `/elections/results/${slug}` as const,
  methodology: "/elections/methodology",
  voting: "/elections/voting",
} as const;

export const ELECTION_PRIMARY_NAV_ROUTES = [
  ELECTION_ROUTES.root,
  ELECTION_ROUTES.races,
  ELECTION_ROUTES.candidates,
  ELECTION_ROUTES.polls,
  ELECTION_ROUTES.forecast,
  ELECTION_ROUTES.results,
  ELECTION_ROUTES.methodology,
] as const;

export type ElectionStaticRoute = (typeof ELECTION_PRIMARY_NAV_ROUTES)[number];
