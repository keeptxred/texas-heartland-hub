import type { DistrictId, DistrictSlug, ElectionEntityId } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type { ElectionDistrict } from "./district";
import type { DistrictType } from "./districtClassifications";

export interface ElectionDistrictSummary {
  id: DistrictId;
  slug: DistrictSlug;
  name: string;
  shortName: string | null;
  type: DistrictType;
  districtNumber: string | null;
  stateCode: string;
  jurisdictionId: ElectionEntityId | null;
  population: number | null;
  active: boolean;
  raceCount: number;
  updatedAt: IsoDateTimeString;
}

export interface ElectionDistrictDetail extends ElectionDistrict {
  raceCount: number;
  activeRaceCount: number;
  candidateCount: number;
}

export type ElectionDistrictListItem = ElectionDistrictSummary;