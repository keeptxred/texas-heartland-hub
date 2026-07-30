import type { CandidateParty, RaceRating } from "@/types/elections";

export const ELECTION_OFFICES = [
  "president",
  "u_s_senate",
  "u_s_house",
  "governor",
  "lieutenant_governor",
  "attorney_general",
  "comptroller",
  "land_commissioner",
  "agriculture_commissioner",
  "railroad_commissioner",
  "state_senate",
  "state_house",
  "state_board_of_education",
  "supreme_court",
  "court_of_criminal_appeals",
  "court_of_appeals",
  "district_judge",
  "county_office",
  "municipal_office",
  "school_board",
  "ballot_measure",
] as const;

export type ElectionOfficeKey = (typeof ELECTION_OFFICES)[number];

export const ELECTION_PARTIES: ReadonlyArray<{
  key: CandidateParty;
  label: string;
  abbreviation: string;
}> = [
  { key: "republican", label: "Republican", abbreviation: "R" },
  { key: "democratic", label: "Democratic", abbreviation: "D" },
  { key: "libertarian", label: "Libertarian", abbreviation: "L" },
  { key: "green", label: "Green", abbreviation: "G" },
  { key: "independent", label: "Independent", abbreviation: "I" },
  { key: "nonpartisan", label: "Nonpartisan", abbreviation: "NP" },
  { key: "other", label: "Other", abbreviation: "O" },
];

export const RACE_RATINGS: ReadonlyArray<{
  key: RaceRating;
  label: string;
  shortLabel: string;
}> = [
  { key: "safe_republican", label: "Safe Republican", shortLabel: "Safe R" },
  { key: "likely_republican", label: "Likely Republican", shortLabel: "Likely R" },
  { key: "leans_republican", label: "Leans Republican", shortLabel: "Leans R" },
  { key: "toss_up", label: "Toss-up", shortLabel: "Toss-up" },
  { key: "leans_democratic", label: "Leans Democratic", shortLabel: "Leans D" },
  { key: "likely_democratic", label: "Likely Democratic", shortLabel: "Likely D" },
  { key: "safe_democratic", label: "Safe Democratic", shortLabel: "Safe D" },
  { key: "unrated", label: "Unrated", shortLabel: "Unrated" },
];

export const ELECTION_COLOR_PALETTE = {
  republican: "#B91C1C",
  democratic: "#1D4ED8",
  libertarian: "#D97706",
  green: "#15803D",
  independent: "#6B7280",
  nonpartisan: "#475569",
  other: "#7C3AED",
  tossUp: "#A16207",
  background: "#FFFFFF",
  foreground: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
} as const;

export const ELECTION_UPDATE_INTERVALS = {
  countdownMs: 1_000,
  liveResultsMs: 30_000,
  pollingMs: 15 * 60_000,
  forecastsMs: 30 * 60_000,
  electionNewsMs: 5 * 60_000,
  staticReferenceMs: 24 * 60 * 60_000,
} as const;

export const DEFAULT_ELECTION_MAP_SETTINGS = {
  center: {
    latitude: 31.0,
    longitude: -99.0,
  },
  zoom: 5.5,
  minZoom: 4,
  maxZoom: 12,
  fitBoundsPadding: 24,
  showCountyBoundaries: true,
  showDistrictBoundaries: true,
  showLegend: true,
} as const;

export const DEFAULT_ELECTION_CHART_SETTINGS = {
  height: 320,
  animationDurationMs: 300,
  showGrid: true,
  showLegend: true,
  showTooltip: true,
  decimalPlaces: 1,
  margin: {
    top: 16,
    right: 24,
    bottom: 24,
    left: 24,
  },
} as const;
