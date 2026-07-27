import type { ElectionEntityId, OfficeId, OfficeSlug } from "./identifiers";
import type { ElectionDataMetadata, IsoDateTimeString } from "./metadata";
import type {
  OfficeBranch,
  OfficeElectionMethod,
  OfficeLevel,
} from "./officeClassifications";

export interface ElectionOffice extends ElectionDataMetadata {
  id: OfficeId;
  slug: OfficeSlug;
  name: string;
  shortName: string | null;
  description: string | null;
  level: OfficeLevel;
  branch: OfficeBranch;
  electionMethod: OfficeElectionMethod;
  jurisdictionId: ElectionEntityId | null;
  districtRequired: boolean;
  termLengthYears: number | null;
  seatsAvailable: number;
  incumbentLimit: number | null;
  active: boolean;
  archivedAt: IsoDateTimeString | null;
}

export type ElectionOfficeCreateInput = Omit<
  ElectionOffice,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionOfficeUpdateInput = Partial<
  Omit<ElectionOffice, "id" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};