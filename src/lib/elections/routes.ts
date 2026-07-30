export const ELECTION_ROUTES = {
  base: "/elections",
  legacyRoot: "/elections",
  root: "/elections/2026",
  cycle: (year: number | string) => `/elections/${year}` as const,
  races: "/elections/races",
  race: (slug: string) => `/elections/races/${slug}` as const,
  statewide: "/elections/statewide",
  legislative: "/elections/legislative",
  districts: "/elections/districts",
  district: (slug: string) => `/elections/districts/${slug}` as const,
  candidates: "/elections/candidates",
  candidate: (slug: string) => `/elections/candidates/${slug}` as const,
  polls: "/elections/polls",
  poll: (slug: string) => `/elections/polls/${slug}` as const,
  forecast: "/elections/forecast",
  forecastDetail: (slug: string) => `/elections/forecast/${slug}` as const,
  results: "/elections/results",
  result: (slug: string) => `/elections/results/${slug}` as const,
  methodology: "/elections/methodology",
  corrections: "/elections/corrections",
  voting: "/elections/voting",
} as const;

export const ELECTION_PRIMARY_NAV_ROUTES = [
  ELECTION_ROUTES.root,
  ELECTION_ROUTES.races,
  ELECTION_ROUTES.statewide,
  ELECTION_ROUTES.legislative,
  ELECTION_ROUTES.districts,
  ELECTION_ROUTES.candidates,
  ELECTION_ROUTES.polls,
  ELECTION_ROUTES.forecast,
  ELECTION_ROUTES.results,
  ELECTION_ROUTES.voting,
  ELECTION_ROUTES.methodology,
] as const;

export const ELECTION_PRIMARY_NAVIGATION = [
  { label: "Overview", href: ELECTION_ROUTES.root },
  { label: "All Races", href: ELECTION_ROUTES.races },
  { label: "Statewide", href: ELECTION_ROUTES.statewide },
  { label: "Legislature", href: ELECTION_ROUTES.legislative },
  { label: "Districts", href: ELECTION_ROUTES.districts },
  { label: "Candidates", href: ELECTION_ROUTES.candidates },
  { label: "Polls", href: ELECTION_ROUTES.polls },
  { label: "Forecasts", href: ELECTION_ROUTES.forecast },
  { label: "Results", href: ELECTION_ROUTES.results },
  { label: "Voting", href: ELECTION_ROUTES.voting },
  { label: "Methodology", href: ELECTION_ROUTES.methodology },
] as const;

export type ElectionStaticRoute = (typeof ELECTION_PRIMARY_NAV_ROUTES)[number];
