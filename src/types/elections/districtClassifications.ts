export const DISTRICT_TYPES = [
  "statewide",
  "congressional",
  "state_senate",
  "state_house",
  "state_board_of_education",
  "judicial",
  "county",
  "municipal",
  "school_district",
  "special_district",
  "other",
] as const;

export type DistrictType = (typeof DISTRICT_TYPES)[number];

export const DISTRICT_TYPE_LABELS: Record<DistrictType, string> = {
  statewide: "Statewide",
  congressional: "Congressional",
  state_senate: "State Senate",
  state_house: "State House",
  state_board_of_education: "State Board of Education",
  judicial: "Judicial",
  county: "County",
  municipal: "Municipal",
  school_district: "School district",
  special_district: "Special district",
  other: "Other",
};

export function isDistrictType(value: unknown): value is DistrictType {
  return typeof value === "string" && DISTRICT_TYPES.includes(value as DistrictType);
}