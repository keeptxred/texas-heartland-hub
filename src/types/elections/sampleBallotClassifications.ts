export const SAMPLE_BALLOT_FORMATS = ["pdf", "html", "image", "interactive", "external_link", "other"] as const;
export type SampleBallotFormat = (typeof SAMPLE_BALLOT_FORMATS)[number];

export const SAMPLE_BALLOT_STATUSES = ["draft", "published", "superseded", "withdrawn", "unverified"] as const;
export type SampleBallotStatus = (typeof SAMPLE_BALLOT_STATUSES)[number];

export const SAMPLE_BALLOT_PRECISION_LEVELS = ["statewide", "county", "precinct", "ballot_style", "address_specific"] as const;
export type SampleBallotPrecisionLevel = (typeof SAMPLE_BALLOT_PRECISION_LEVELS)[number];
