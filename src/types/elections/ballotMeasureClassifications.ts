export const BALLOT_MEASURE_TYPES = [
  "constitutional_amendment",
  "bond",
  "tax",
  "referendum",
  "initiative",
  "charter_amendment",
  "recall",
  "advisory",
  "other",
] as const;

export const BALLOT_MEASURE_STATUSES = [
  "draft",
  "qualified",
  "withdrawn",
  "on_ballot",
  "passed",
  "failed",
  "recount",
  "certified",
  "archived",
] as const;

export const BALLOT_MEASURE_POSITIONS = ["support", "oppose", "neutral"] as const;

export type BallotMeasureType = (typeof BALLOT_MEASURE_TYPES)[number];
export type BallotMeasureStatus = (typeof BALLOT_MEASURE_STATUSES)[number];
export type BallotMeasurePosition = (typeof BALLOT_MEASURE_POSITIONS)[number];

export const BALLOT_MEASURE_TYPE_LABELS: Record<BallotMeasureType, string> = {
  constitutional_amendment: "Constitutional amendment",
  bond: "Bond",
  tax: "Tax",
  referendum: "Referendum",
  initiative: "Initiative",
  charter_amendment: "Charter amendment",
  recall: "Recall",
  advisory: "Advisory",
  other: "Other",
};

export const BALLOT_MEASURE_STATUS_LABELS: Record<BallotMeasureStatus, string> = {
  draft: "Draft",
  qualified: "Qualified",
  withdrawn: "Withdrawn",
  on_ballot: "On ballot",
  passed: "Passed",
  failed: "Failed",
  recount: "Recount",
  certified: "Certified",
  archived: "Archived",
};

function includesValue<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function isBallotMeasureType(value: unknown): value is BallotMeasureType {
  return includesValue(BALLOT_MEASURE_TYPES, value);
}

export function isBallotMeasureStatus(value: unknown): value is BallotMeasureStatus {
  return includesValue(BALLOT_MEASURE_STATUSES, value);
}

export function isBallotMeasurePosition(value: unknown): value is BallotMeasurePosition {
  return includesValue(BALLOT_MEASURE_POSITIONS, value);
}
