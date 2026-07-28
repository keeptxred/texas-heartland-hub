declare const electionIdentifierBrand: unique symbol;

/** Nominal election identifier preserving string runtime behavior. */
export type ElectionIdentifier<Brand extends string> = string & {
  readonly [electionIdentifierBrand]: Brand;
};

export type ElectionEntityId = ElectionIdentifier<"ElectionEntityId">;
export type ElectionSlug = ElectionIdentifier<"ElectionSlug">;
export type ElectionCycleId = ElectionIdentifier<"ElectionCycleId">;
export type ElectionCycleSlug = ElectionIdentifier<"ElectionCycleSlug">;
export type OfficeId = ElectionIdentifier<"OfficeId">;
export type OfficeSlug = ElectionIdentifier<"OfficeSlug">;
export type DistrictId = ElectionIdentifier<"DistrictId">;
export type DistrictSlug = ElectionIdentifier<"DistrictSlug">;
export type CountyId = ElectionIdentifier<"CountyId">;
export type CountySlug = ElectionIdentifier<"CountySlug">;
export type BallotMeasureId = ElectionIdentifier<"BallotMeasureId">;
export type BallotMeasureSlug = ElectionIdentifier<"BallotMeasureSlug">;
export type ElectionEventId = ElectionIdentifier<"ElectionEventId">;
export type ElectionEventSlug = ElectionIdentifier<"ElectionEventSlug">;
export type EndorsementId = ElectionIdentifier<"EndorsementId">;
export type EndorsementSlug = ElectionIdentifier<"EndorsementSlug">;
export type CampaignFinanceReportId = ElectionIdentifier<"CampaignFinanceReportId">;
export type CampaignFinanceReportSlug = ElectionIdentifier<"CampaignFinanceReportSlug">;
export type IssuePositionId = ElectionIdentifier<"IssuePositionId">;
export type IssuePositionSlug = ElectionIdentifier<"IssuePositionSlug">;
export type VotingLocationId = ElectionIdentifier<"VotingLocationId">;
export type VotingLocationSlug = ElectionIdentifier<"VotingLocationSlug">;
export type ElectionAuthorityId = ElectionIdentifier<"ElectionAuthorityId">;
export type ElectionAuthoritySlug = ElectionIdentifier<"ElectionAuthoritySlug">;
export type SampleBallotId = ElectionIdentifier<"SampleBallotId">;
export type SampleBallotSlug = ElectionIdentifier<"SampleBallotSlug">;
export type VoterGuideId = ElectionIdentifier<"VoterGuideId">;
export type VoterGuideSlug = ElectionIdentifier<"VoterGuideSlug">;
export type LegislativeScorecardId = ElectionIdentifier<"LegislativeScorecardId">;
export type LegislativeScorecardSlug = ElectionIdentifier<"LegislativeScorecardSlug">;
export type VoterRegistrationId = ElectionIdentifier<"VoterRegistrationId">;
export type VoterRegistrationSlug = ElectionIdentifier<"VoterRegistrationSlug">;
export type MailBallotId = ElectionIdentifier<"MailBallotId">;
export type MailBallotSlug = ElectionIdentifier<"MailBallotSlug">;
export type RaceId = ElectionIdentifier<"RaceId">;
export type RaceSlug = ElectionIdentifier<"RaceSlug">;
export type CandidateId = ElectionIdentifier<"CandidateId">;
export type CandidateSlug = ElectionIdentifier<"CandidateSlug">;
export type PollId = ElectionIdentifier<"PollId">;
export type PollSlug = ElectionIdentifier<"PollSlug">;
export type ForecastId = ElectionIdentifier<"ForecastId">;
export type ForecastSlug = ElectionIdentifier<"ForecastSlug">;
export type ElectionResultId = ElectionIdentifier<"ElectionResultId">;
export type ElectionResultSlug = ElectionIdentifier<"ElectionResultSlug">;

export type CoreElectionId = ElectionCycleId | OfficeId | DistrictId | CountyId | BallotMeasureId | ElectionEventId | EndorsementId | CampaignFinanceReportId | IssuePositionId | VotingLocationId | ElectionAuthorityId | SampleBallotId | VoterGuideId | LegislativeScorecardId | VoterRegistrationId | MailBallotId | RaceId | CandidateId | PollId | ForecastId | ElectionResultId;
export type CoreElectionSlug = ElectionCycleSlug | OfficeSlug | DistrictSlug | CountySlug | BallotMeasureSlug | ElectionEventSlug | EndorsementSlug | CampaignFinanceReportSlug | IssuePositionSlug | VotingLocationSlug | ElectionAuthoritySlug | SampleBallotSlug | VoterGuideSlug | LegislativeScorecardSlug | VoterRegistrationSlug | MailBallotSlug | RaceSlug | CandidateSlug | PollSlug | ForecastSlug | ElectionResultSlug;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isElectionIdentifier(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isElectionSlug(value: unknown): value is ElectionSlug {
  return typeof value === "string" && SLUG_PATTERN.test(value);
}

export function toElectionIdentifier<Brand extends string>(value: string, label = "Election identifier"): ElectionIdentifier<Brand> {
  const normalized = value.trim();
  if (!normalized) throw new TypeError(`${label} must be a non-empty string.`);
  return normalized as ElectionIdentifier<Brand>;
}

export function toElectionSlug<Brand extends string>(value: string, label = "Election slug"): ElectionIdentifier<Brand> {
  const normalized = value.trim().toLowerCase();
  if (!SLUG_PATTERN.test(normalized)) {
    throw new TypeError(`${label} must contain only lowercase letters, numbers, and single hyphens.`);
  }
  return normalized as ElectionIdentifier<Brand>;
}

export const electionIds = {
  cycle: (value: string) => toElectionIdentifier<"ElectionCycleId">(value, "Election cycle ID"),
  office: (value: string) => toElectionIdentifier<"OfficeId">(value, "Office ID"),
  district: (value: string) => toElectionIdentifier<"DistrictId">(value, "District ID"),
  county: (value: string) => toElectionIdentifier<"CountyId">(value, "County ID"),
  ballotMeasure: (value: string) => toElectionIdentifier<"BallotMeasureId">(value, "Ballot measure ID"),
  event: (value: string) => toElectionIdentifier<"ElectionEventId">(value, "Election event ID"),
  endorsement: (value: string) => toElectionIdentifier<"EndorsementId">(value, "Endorsement ID"),
  campaignFinanceReport: (value: string) => toElectionIdentifier<"CampaignFinanceReportId">(value, "Campaign finance report ID"),
  issuePosition: (value: string) => toElectionIdentifier<"IssuePositionId">(value, "Issue position ID"),
  votingLocation: (value: string) => toElectionIdentifier<"VotingLocationId">(value, "Voting location ID"),
  electionAuthority: (value: string) => toElectionIdentifier<"ElectionAuthorityId">(value, "Election authority ID"),
  sampleBallot: (value: string) => toElectionIdentifier<"SampleBallotId">(value, "Sample ballot ID"),
  voterGuide: (value: string) => toElectionIdentifier<"VoterGuideId">(value, "Voter guide ID"),
  legislativeScorecard: (value: string) => toElectionIdentifier<"LegislativeScorecardId">(value, "Legislative scorecard ID"),
  voterRegistration: (value: string) => toElectionIdentifier<"VoterRegistrationId">(value, "Voter registration ID"),
  mailBallot: (value: string) => toElectionIdentifier<"MailBallotId">(value, "Mail ballot ID"),
  race: (value: string) => toElectionIdentifier<"RaceId">(value, "Race ID"),
  candidate: (value: string) => toElectionIdentifier<"CandidateId">(value, "Candidate ID"),
  poll: (value: string) => toElectionIdentifier<"PollId">(value, "Poll ID"),
  forecast: (value: string) => toElectionIdentifier<"ForecastId">(value, "Forecast ID"),
  result: (value: string) => toElectionIdentifier<"ElectionResultId">(value, "Election result ID"),
} as const;

export const electionSlugs = {
  cycle: (value: string) => toElectionSlug<"ElectionCycleSlug">(value, "Election cycle slug"),
  office: (value: string) => toElectionSlug<"OfficeSlug">(value, "Office slug"),
  district: (value: string) => toElectionSlug<"DistrictSlug">(value, "District slug"),
  county: (value: string) => toElectionSlug<"CountySlug">(value, "County slug"),
  ballotMeasure: (value: string) => toElectionSlug<"BallotMeasureSlug">(value, "Ballot measure slug"),
  event: (value: string) => toElectionSlug<"ElectionEventSlug">(value, "Election event slug"),
  endorsement: (value: string) => toElectionSlug<"EndorsementSlug">(value, "Endorsement slug"),
  campaignFinanceReport: (value: string) => toElectionSlug<"CampaignFinanceReportSlug">(value, "Campaign finance report slug"),
  issuePosition: (value: string) => toElectionSlug<"IssuePositionSlug">(value, "Issue position slug"),
  votingLocation: (value: string) => toElectionSlug<"VotingLocationSlug">(value, "Voting location slug"),
  electionAuthority: (value: string) => toElectionSlug<"ElectionAuthoritySlug">(value, "Election authority slug"),
  sampleBallot: (value: string) => toElectionSlug<"SampleBallotSlug">(value, "Sample ballot slug"),
  voterGuide: (value: string) => toElectionSlug<"VoterGuideSlug">(value, "Voter guide slug"),
  legislativeScorecard: (value: string) => toElectionSlug<"LegislativeScorecardSlug">(value, "Legislative scorecard slug"),
  voterRegistration: (value: string) => toElectionSlug<"VoterRegistrationSlug">(value, "Voter registration slug"),
  mailBallot: (value: string) => toElectionSlug<"MailBallotSlug">(value, "Mail ballot slug"),
  race: (value: string) => toElectionSlug<"RaceSlug">(value, "Race slug"),
  candidate: (value: string) => toElectionSlug<"CandidateSlug">(value, "Candidate slug"),
  poll: (value: string) => toElectionSlug<"PollSlug">(value, "Poll slug"),
  forecast: (value: string) => toElectionSlug<"ForecastSlug">(value, "Forecast slug"),
  result: (value: string) => toElectionSlug<"ElectionResultSlug">(value, "Election result slug"),
} as const;
