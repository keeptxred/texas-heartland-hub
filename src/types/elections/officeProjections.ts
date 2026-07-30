import type { ElectionEntityId, OfficeId, OfficeSlug } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type { ElectionOffice } from "./office";
import type {
  OfficeBranch,
  OfficeElectionMethod,
  OfficeLevel,
} from "./officeClassifications";

export interface ElectionOfficeSummary {
  id: OfficeId;
  slug: OfficeSlug;
  name: string;
  shortName: string | null;
  level: OfficeLevel;
  branch: OfficeBranch;
  electionMethod: OfficeElectionMethod;
  jurisdictionId: ElectionEntityId | null;
  districtRequired: boolean;
  termLengthYears: number | null;
  active: boolean;
  raceCount: number;
  updatedAt: IsoDateTimeString;
}

export interface ElectionOfficeDetail extends ElectionOffice {
  raceCount: number;
  activeRaceCount: number;
  candidateCount: number;
}

export type ElectionOfficeListItem = ElectionOfficeSummary;