import type {
  MailBallotApplicationStatus,
  MailBallotEligibilityReason,
  MailBallotReturnMethod,
  MailBallotStatus,
} from "./mailBallotClassifications";
import type {
  CountyId,
  ElectionCycleId,
  MailBallotId,
  MailBallotSlug,
} from "./identifiers";
import type { ElectionDataMetadata, IsoDateString, IsoDateTimeString } from "./metadata";

export interface MailBallotRecord extends ElectionDataMetadata {
  id: MailBallotId;
  slug: MailBallotSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId;
  applicationStatus: MailBallotApplicationStatus;
  ballotStatus: MailBallotStatus;
  eligibilityReason: MailBallotEligibilityReason | null;
  returnMethod: MailBallotReturnMethod | null;
  applicationDeadline: IsoDateString | null;
  ballotReturnDeadline: IsoDateTimeString | null;
  applicationSubmittedAt: IsoDateTimeString | null;
  applicationReceivedAt: IsoDateTimeString | null;
  ballotIssuedAt: IsoDateTimeString | null;
  ballotReceivedAt: IsoDateTimeString | null;
  ballotAcceptedAt: IsoDateTimeString | null;
  rejectionReason: string | null;
  cureDeadline: IsoDateTimeString | null;
  trackingUrl: string | null;
  applicationUrl: string | null;
  sourceUrl: string | null;
  lastVerifiedAt: IsoDateTimeString | null;
  notes: string | null;
}

export type MailBallotCreateInput = Omit<MailBallotRecord, "id" | "createdAt" | "updatedAt">;
export type MailBallotUpdateInput = Partial<
  Omit<MailBallotRecord, "id" | "electionCycleId" | "countyId" | "createdAt">
> & { updatedAt: IsoDateTimeString };
