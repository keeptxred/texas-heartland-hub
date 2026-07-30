import type { CountyId, CountySlug, ElectionEntityId } from "./identifiers";
import type { IsoDateTimeString } from "./metadata";
import type { ElectionCounty } from "./county";

export interface ElectionCountySummary {
  id: CountyId;
  slug: CountySlug;
  entityId: ElectionEntityId | null;
  name: string;
  stateCode: string;
  fipsCode: string;
  population: number | null;
  active: boolean;
  raceCount: number;
  updatedAt: IsoDateTimeString;
}

export interface ElectionCountyDetail extends ElectionCounty {
  raceCount: number;
  districtCount: number;
  candidateCount: number;
}

export type ElectionCountyListItem = ElectionCountySummary;