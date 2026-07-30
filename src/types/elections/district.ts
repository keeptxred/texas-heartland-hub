import type { DistrictId, DistrictSlug, ElectionEntityId } from "./identifiers";
import type { ElectionDataMetadata, IsoDateTimeString } from "./metadata";
import type { DistrictType } from "./districtClassifications";

export interface ElectionDistrict extends ElectionDataMetadata {
  id: DistrictId;
  slug: DistrictSlug;
  name: string;
  shortName: string | null;
  description: string | null;
  type: DistrictType;
  districtNumber: string | null;
  stateCode: string;
  jurisdictionId: ElectionEntityId | null;
  countyEntityIds: readonly ElectionEntityId[];
  population: number | null;
  geometryUrl: string | null;
  active: boolean;
  archivedAt: IsoDateTimeString | null;
}

export type ElectionDistrictCreateInput = Omit<
  ElectionDistrict,
  "id" | "createdAt" | "updatedAt"
>;

export type ElectionDistrictUpdateInput = Partial<
  Omit<ElectionDistrict, "id" | "createdAt">
> & {
  updatedAt: IsoDateTimeString;
};