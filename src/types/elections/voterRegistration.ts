import type {
  VoterEligibilityStatus,
  VoterRegistrationChangeType,
  VoterRegistrationMethod,
  VoterRegistrationStatus,
} from "./voterRegistrationClassifications";
import type {
  CountyId,
  ElectionCycleId,
  VoterRegistrationId,
  VoterRegistrationSlug,
} from "./identifiers";
import type { ElectionDataMetadata, IsoDateString, IsoDateTimeString } from "./metadata";

export interface VoterRegistrationRecord extends ElectionDataMetadata {
  id: VoterRegistrationId;
  slug: VoterRegistrationSlug;
  electionCycleId: ElectionCycleId;
  countyId: CountyId;
  status: VoterRegistrationStatus;
  eligibilityStatus: VoterEligibilityStatus;
  registrationMethod: VoterRegistrationMethod | null;
  changeType: VoterRegistrationChangeType | null;
  effectiveOn: IsoDateString | null;
  submittedAt: IsoDateTimeString | null;
  processedAt: IsoDateTimeString | null;
  registrationDeadline: IsoDateString | null;
  precinctCode: string | null;
  voterCertificateNumber: string | null;
  sourceUrl: string | null;
  lastVerifiedAt: IsoDateTimeString | null;
  notes: string | null;
}

export type VoterRegistrationCreateInput = Omit<
  VoterRegistrationRecord,
  "id" | "createdAt" | "updatedAt"
>;

export type VoterRegistrationUpdateInput = Partial<
  Omit<VoterRegistrationRecord, "id" | "electionCycleId" | "countyId" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};
