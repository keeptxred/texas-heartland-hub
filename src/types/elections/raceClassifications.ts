export const OFFICE_LEVELS = [
  "federal",
  "state",
  "county",
  "municipal",
  "local",
] as const;

export const RACE_TYPES = [
  "executive",
  "legislative",
  "judicial",
  "administrative",
  "ballot_measure",
  "party_office",
  "other",
] as const;

export const ELECTION_TYPES = [
  "general",
  "primary",
  "primary_runoff",
  "runoff",
  "special",
  "special_runoff",
  "local",
  "constitutional_amendment",
] as const;

export const JURISDICTION_TYPES = [
  "statewide",
  "congressional_district",
  "state_senate_district",
  "state_house_district",
  "state_board_of_education_district",
  "judicial_district",
  "county",
  "commissioners_precinct",
  "municipality",
  "school_district",
  "special_district",
  "precinct",
  "other",
] as const;

export const PARTY_SCOPES = [
  "partisan",
  "nonpartisan",
  "republican_primary",
  "democratic_primary",
  "libertarian_primary",
  "green_primary",
  "other_party_primary",
] as const;

export const RACE_STATUSES = [
  "draft",
  "scheduled",
  "filing_open",
  "filing_closed",
  "candidate_review",
  "early_voting",
  "polls_open",
  "polls_closed",
  "counting",
  "called",
  "recount",
  "runoff_required",
  "certified",
  "cancelled",
  "postponed",
] as const;

export type OfficeLevel = (typeof OFFICE_LEVELS)[number];
export type RaceType = (typeof RACE_TYPES)[number];
export type ElectionType = (typeof ELECTION_TYPES)[number];
export type JurisdictionType = (typeof JURISDICTION_TYPES)[number];
export type PartyScope = (typeof PARTY_SCOPES)[number];
export type RaceStatus = (typeof RACE_STATUSES)[number];

export const OFFICE_LEVEL_LABELS: Record<OfficeLevel, string> = {
  federal: "Federal",
  state: "State",
  county: "County",
  municipal: "Municipal",
  local: "Local",
};

export const RACE_TYPE_LABELS: Record<RaceType, string> = {
  executive: "Executive",
  legislative: "Legislative",
  judicial: "Judicial",
  administrative: "Administrative",
  ballot_measure: "Ballot measure",
  party_office: "Party office",
  other: "Other",
};

export const ELECTION_TYPE_LABELS: Record<ElectionType, string> = {
  general: "General election",
  primary: "Primary election",
  primary_runoff: "Primary runoff",
  runoff: "Runoff election",
  special: "Special election",
  special_runoff: "Special-election runoff",
  local: "Local election",
  constitutional_amendment: "Constitutional amendment election",
};

export const JURISDICTION_TYPE_LABELS: Record<JurisdictionType, string> = {
  statewide: "Statewide",
  congressional_district: "Congressional district",
  state_senate_district: "State Senate district",
  state_house_district: "State House district",
  state_board_of_education_district: "State Board of Education district",
  judicial_district: "Judicial district",
  county: "County",
  commissioners_precinct: "Commissioners precinct",
  municipality: "Municipality",
  school_district: "School district",
  special_district: "Special district",
  precinct: "Precinct",
  other: "Other jurisdiction",
};

export const PARTY_SCOPE_LABELS: Record<PartyScope, string> = {
  partisan: "Partisan",
  nonpartisan: "Nonpartisan",
  republican_primary: "Republican primary",
  democratic_primary: "Democratic primary",
  libertarian_primary: "Libertarian primary",
  green_primary: "Green primary",
  other_party_primary: "Other-party primary",
};

export const RACE_STATUS_LABELS: Record<RaceStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  filing_open: "Filing open",
  filing_closed: "Filing closed",
  candidate_review: "Candidate review",
  early_voting: "Early voting",
  polls_open: "Polls open",
  polls_closed: "Polls closed",
  counting: "Counting",
  called: "Called",
  recount: "Recount",
  runoff_required: "Runoff required",
  certified: "Certified",
  cancelled: "Cancelled",
  postponed: "Postponed",
};

function includesValue<T extends readonly string[]>(values: T, value: string): value is T[number] {
  return values.includes(value as T[number]);
}

export const isOfficeLevel = (value: string): value is OfficeLevel =>
  includesValue(OFFICE_LEVELS, value);

export const isRaceType = (value: string): value is RaceType =>
  includesValue(RACE_TYPES, value);

export const isElectionType = (value: string): value is ElectionType =>
  includesValue(ELECTION_TYPES, value);

export const isJurisdictionType = (value: string): value is JurisdictionType =>
  includesValue(JURISDICTION_TYPES, value);

export const isPartyScope = (value: string): value is PartyScope =>
  includesValue(PARTY_SCOPES, value);

export const isRaceStatus = (value: string): value is RaceStatus =>
  includesValue(RACE_STATUSES, value);
