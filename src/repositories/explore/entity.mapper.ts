import type {
  ExploreEntity,
  ExploreEntityCreateInput,
  ExploreEntityUpdateInput,
} from '@/types/explore';

export interface ExploreEntityRow {
  id: string;
  entity_type_id: string;
  name: string;
  slug: string;
  alternate_names: string[] | null;
  short_description: string | null;
  long_description: string | null;
  summary: string | null;
  status: ExploreEntity['status'];
  visibility: ExploreEntity['visibility'];
  source_confidence: number;
  featured: boolean;
  popularity_score: number | string;
  version: number;
  owner_user_id: string | null;
  published_at: string | null;
  verified_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export function mapExploreEntityRow(row: ExploreEntityRow): ExploreEntity {
  return {
    id: row.id,
    entityTypeId: row.entity_type_id,
    name: row.name,
    slug: row.slug,
    alternateNames: row.alternate_names ?? [],
    shortDescription: row.short_description,
    longDescription: row.long_description,
    summary: row.summary,
    status: row.status,
    visibility: row.visibility,
    sourceConfidence: row.source_confidence,
    featured: row.featured,
    popularityScore: Number(row.popularity_score),
    version: row.version,
    ownerUserId: row.owner_user_id,
    publishedAt: row.published_at,
    verifiedAt: row.verified_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapExploreEntityCreateInput(
  input: ExploreEntityCreateInput & { slug: string },
): Record<string, unknown> {
  return {
    entity_type_id: input.entityTypeId,
    name: input.name,
    slug: input.slug,
    alternate_names: input.alternateNames ?? [],
    short_description: input.shortDescription ?? null,
    long_description: input.longDescription ?? null,
    summary: input.summary ?? null,
    status: input.status ?? 'draft',
    visibility: input.visibility ?? 'internal',
    source_confidence: input.sourceConfidence ?? 0,
    featured: input.featured ?? false,
    popularity_score: input.popularityScore ?? 0,
    owner_user_id: input.ownerUserId ?? null,
  };
}

export function mapExploreEntityUpdateInput(
  input: ExploreEntityUpdateInput,
): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (input.entityTypeId !== undefined) row.entity_type_id = input.entityTypeId;
  if (input.name !== undefined) row.name = input.name;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.alternateNames !== undefined) row.alternate_names = input.alternateNames;
  if (input.shortDescription !== undefined) row.short_description = input.shortDescription;
  if (input.longDescription !== undefined) row.long_description = input.longDescription;
  if (input.summary !== undefined) row.summary = input.summary;
  if (input.status !== undefined) row.status = input.status;
  if (input.visibility !== undefined) row.visibility = input.visibility;
  if (input.sourceConfidence !== undefined) row.source_confidence = input.sourceConfidence;
  if (input.featured !== undefined) row.featured = input.featured;
  if (input.popularityScore !== undefined) row.popularity_score = input.popularityScore;
  if (input.ownerUserId !== undefined) row.owner_user_id = input.ownerUserId;

  return row;
}
