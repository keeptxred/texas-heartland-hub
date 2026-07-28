import type { MailBallotRecord } from "./mailBallot";
import type { MailBallotApplicationStatus, MailBallotStatus } from "./mailBallotClassifications";
import type { CountyId, ElectionCycleId, MailBallotId, MailBallotSlug } from "./identifiers";
import type { IsoDateString, IsoDateTimeString } from "./metadata";

export interface MailBallotSummary {
  id: MailBallotId;
  slug: MailBallotSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId;
  countyName: string;
  applicationStatus: MailBallotApplicationStatus;
  ballotStatus: MailBallotStatus;
  applicationDeadline: IsoDateString | null;
  ballotReturnDeadline: IsoDateTimeString | null;
  lastVerifiedAt: IsoDateTimeString | null;
  updatedAt: IsoDateTimeString;
}

export interface MailBallotDetail extends MailBallotRecord {
  countyName: string;
  countySlug: string;
  electionCycleName: string;
  officialApplicationUrl: string | null;
  officialTrackingUrl: string | null;
  cureAvailable: boolean;
}

export interface MailBallotCountyOverview {
  countyId: CountyId;
  countyName: string;
  applicationDeadline: IsoDateString | null;
  ballotReturnDeadline: IsoDateTimeString | null;
  issuedCount: number;
  receivedCount: number;
  acceptedCount: number;
  rejectedCount: number;
  lastUpdatedAt: IsoDateTimeString | null;
}
