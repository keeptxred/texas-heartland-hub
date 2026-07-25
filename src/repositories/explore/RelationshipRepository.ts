import type { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';
import type { ExploreEntity, ExplorePaginatedResult, ExplorePagination } from '@/types/explore';

import { mapExploreEntityRow, type ExploreEntityRow } from './entity.mapper';

type UntypedSupabaseClient = SupabaseClient<Record<string, unknown>>;

export interface ExploreRelationshipRecord {
  id: string;
  typeKey: string;
  typeName: string;
  reverseName: string;
  sourceEntity: ExploreEntity;
  targetEntity: ExploreEntity;
  weight: number;
  priority: 'primary' | 'secondary' | 'nearby' | 'regional' | 'suggested';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExploreRelationshipFilters {
  entityId?: string;
  typeKey?: string;
  active?: boolean;
}

interface RelationshipTypeRow {
  key: string;
  name: string;
  reverse_name: string;
}

interface RelationshipRow {
  id: string;
  weight: number | string;
  priority: ExploreRelationshipRecord['priority'];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  relationship_type: RelationshipTypeRow | RelationshipTypeRow[];
  source_entity: ExploreEntityRow | ExploreEntityRow[];
  target_entity: ExploreEntityRow | ExploreEntityRow[];
}

const RELATIONSHIP_SELECT = `
  id,
  weight,
  priority,
  is_active,
  created_at,
  updated_at,
  relationship_type:explore_relationship_types!explore_entity_relationships_relationship_type_id_fkey(key,name,reverse_name),
  source_entity:explore_entities!explore_entity_relationships_source_entity_id_fkey(*),
  target_entity:explore_entities!explore_entity_relationships_target_entity_id_fkey(*)
`;

export class RelationshipRepository {
  constructor(
    private readonly client: UntypedSupabaseClient = supabase as unknown as UntypedSupabaseClient,
  ) {}

  async list(
    filters: ExploreRelationshipFilters = {},
    pagination: ExplorePagination = { page: 1, pageSize: 25 },
  ): Promise<ExplorePaginatedResult<ExploreRelationshipRecord>> {
    const page = Math.max(1, Math.trunc(pagination.page));
    const pageSize = Math.min(100, Math.max(1, Math.trunc(pagination.pageSize)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.client
      .from('explore_entity_relationships')
      .select(RELATIONSHIP_SELECT, { count: 'exact' });

    if (filters.active !== undefined) query = query.eq('is_active', filters.active);
    if (filters.entityId) {
      query = query.or(
        `source_entity_id.eq.${filters.entityId},target_entity_id.eq.${filters.entityId}`,
      );
    }
    if (filters.typeKey) {
      const { data: type, error: typeError } = await this.client
        .from('explore_relationship_types')
        .select('id')
        .eq('key', filters.typeKey)
        .maybeSingle();
      if (typeError) throw typeError;
      if (!type) return { items: [], page, pageSize, total: 0, totalPages: 0 };
      query = query.eq('relationship_type_id', (type as { id: string }).id);
    }

    const { data, error, count } = await query
      .order('priority', { ascending: true })
      .order('weight', { ascending: false })
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;
    return {
      items: ((data ?? []) as unknown as RelationshipRow[]).map(mapRelationshipRow),
      page,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
    };
  }
}

function mapRelationshipRow(row: RelationshipRow): ExploreRelationshipRecord {
  const type = first(row.relationship_type);
  const source = first(row.source_entity);
  const target = first(row.target_entity);
  if (!type || !source || !target) throw new Error(`Relationship ${row.id} has incomplete joins.`);

  return {
    id: row.id,
    typeKey: type.key,
    typeName: type.name,
    reverseName: type.reverse_name,
    sourceEntity: mapExploreEntityRow(source),
    targetEntity: mapExploreEntityRow(target),
    weight: Number(row.weight),
    priority: row.priority,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function first<T>(value: T | T[]): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export const relationshipRepository = new RelationshipRepository();
