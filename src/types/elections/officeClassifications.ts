export const OFFICE_LEVELS = [
  "federal",
  "state",
  "county",
  "municipal",
  "school_district",
  "special_district",
  "other",
] as const;

export const OFFICE_BRANCHES = [
  "executive",
  "legislative",
  "judicial",
  "administrative",
  "other",
] as const;

export const OFFICE_ELECTION_METHODS = [
  "partisan",
  "nonpartisan",
  "retention",
  "appointment",
  "mixed",
  "unknown",
] as const;

export type OfficeLevel = (typeof OFFICE_LEVELS)[number];
export type OfficeBranch = (typeof OFFICE_BRANCHES)[number];
export type OfficeElectionMethod = (typeof OFFICE_ELECTION_METHODS)[number];

export const OFFICE_LEVEL_LABELS: Record<OfficeLevel, string> = {
  federal: "Federal",
  state: "State",
  county: "County",
  municipal: "Municipal",
  school_district: "School district",
  special_district: "Special district",
  other: "Other",
};

export const OFFICE_BRANCH_LABELS: Record<OfficeBranch, string> = {
  executive: "Executive",
  legislative: "Legislative",
  judicial: "Judicial",
  administrative: "Administrative",
  other: "Other",
};

function includesValue<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function isOfficeLevel(value: unknown): value is OfficeLevel {
  return includesValue(OFFICE_LEVELS, value);
}

export function isOfficeBranch(value: unknown): value is OfficeBranch {
  return includesValue(OFFICE_BRANCHES, value);
}

export function isOfficeElectionMethod(value: unknown): value is OfficeElectionMethod {
  return includesValue(OFFICE_ELECTION_METHODS, value);
}