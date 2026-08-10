export type TexasEntityKind =
  | 'county' | 'city' | 'census-place' | 'zip-code' | 'region' | 'metro-area'
  | 'lake' | 'river' | 'state-park' | 'national-park' | 'national-forest'
  | 'wildlife-management-area' | 'beach' | 'mountain' | 'cavern' | 'waterfall'
  | 'agency' | 'appraisal-district' | 'tax-office' | 'county-clerk' | 'dps-office'
  | 'museum' | 'historic-site' | 'courthouse' | 'mission' | 'battlefield'
  | 'attraction' | 'scenic-drive' | 'fair' | 'rodeo' | 'festival'
  | 'holiday-event' | 'sporting-event' | 'fairground' | 'sports-venue'
  | 'school-district' | 'university' | 'utility';

export type TexasEntityStatus = 'active' | 'pending-source-verification' | 'seasonal' | 'temporarily-closed' | 'retired';
export type SourceConfidence = 'official' | 'high' | 'medium' | 'low';
export type GeoPoint = { latitude: number; longitude: number };
export type EntityRelationship = { type: string; targetId: string; sourceId?: string; verifiedAt?: string };

export type TexasEntityRecord = {
  id: string;
  kind: TexasEntityKind;
  name: string;
  slug: string;
  aliases: string[];
  description?: string;
  countySlug?: string;
  region?: string;
  coordinates?: GeoPoint;
  officialUrl?: string;
  sourceId: string;
  sourceConfidence: SourceConfidence;
  sourceCheckedAt?: string;
  reviewDueAt?: string;
  status: TexasEntityStatus;
  relationships: EntityRelationship[];
  tags?: string[];
};

export function canonicalizeEntity(entity: TexasEntityRecord): TexasEntityRecord {
  return {
    ...entity,
    aliases: [...new Set(entity.aliases)].sort(),
    relationships: [...entity.relationships].sort((a, b) => `${a.type}:${a.targetId}`.localeCompare(`${b.type}:${b.targetId}`)),
    tags: [...new Set(entity.tags ?? [])].sort(),
  };
}

export function cloneEntity(entity: TexasEntityRecord): TexasEntityRecord {
  return structuredClone(entity);
}
