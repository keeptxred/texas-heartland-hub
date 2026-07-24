import type { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';
import { ExploreNotFoundError } from '@/lib/explore/errors';
import type {
  ExploreEntity,
  ExploreEntityCreateInput,
  ExploreEntityFilters,
  ExploreEntityUpdateInput,
  ExplorePaginatedResult,
  ExplorePagination,
} from '@/types/explore';

import {
  mapExploreEntityCreateInput,
  mapExploreEntityRow,
  mapExploreEntityUpdateInput,
  type ExploreEntityRow,
} from './entity.mapper';

const ENTITY_SELECT = '*';

type UntypedSupabaseClient = SupabaseClient<Record<string, unknown>>;

export class EntityRepository {
  constructor(
    private readonly client: UntypedSupabaseClient = supabase as unknown as UntypedSupabaseClient,
  ) {}

  async findById(id: string): Promise<ExploreEntity | null> {
    const { data, error } = await this.client
      .from('explore_entities')
      .select(ENTITY_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapExploreEntityRow(data as unknown as ExploreEntityRow) : null;
  }

  async requireById(id: string): Promise<ExploreEntity> {
    const entity = await this.findById(id);
    if (!entity) throw new ExploreNotFoundError('Explore entity', id);
    return entity;
  }

  async findBySlug(slug: string): Promise<ExploreEntity | null> {
    const { data, error } = await this.client
      .from('explore_entities')
      .select(ENTITY_SELECT)
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data ? mapExploreEntityRow(data as unknown as ExploreEntityRow) : null;
  }

  async list(
    filters: ExploreEntityFilters = {},
    pagination: ExplorePagination = { page: 1, pageSize: 24 },
  ): Promise<ExplorePaginatedResult<ExploreEntity>> {
    const page = Math.max(1, pagination.page);
    const pageSize = Math.min(100, Math.max(1, pagination.pageSize));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.client
      .from('explore_entities')
      .select(ENTITY_SELECT, { count: 'exact' });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.visibility) query = query.eq('visibility', filters.visibility);
    if (filters.featured !== undefined) query = query.eq('featured', filters.featured);
    if (filters.query?.trim()) {
      const escaped = filters.query.trim().replace(/[%_,()]/g, '');
      query = query.or(`name.ilike.%${escaped}%,slug.ilike.%${escaped}%,summary.ilike.%${escaped}%`);
    }

    if (filters.type) {
      const { data: entityType, error: entityTypeError } = await this.client
        .from('explore_entity_types')
        .select('id')
        .eq('key', filters.type)
        .maybeSingle();

      if (entityTypeError) throw entityTypeError;
      if (!entityType) {
        return { items: [], page, pageSize, total: 0, totalPages: 0 };
      }
      query = query.eq('entity_type_id', (entityType as { id: string }).id);
    }

    const { data, error, count } = await query
      .order('featured', { ascending: false })
      .order('popularity_score', { ascending: false })
      .order('name', { ascending: true })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;
    return {
      items: ((data ?? []) as unknown as ExploreEntityRow[]).map(mapExploreEntityRow),
      page,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
    };
  }

  async create(input: ExploreEntityCreateInput & { slug: string }): Promise<ExploreEntity> {
    const { data, error } = await this.client
      .from('explore_entities')
      .insert(mapExploreEntityCreateInput(input))
      .select(ENTITY_SELECT)
      .single();

    if (error) throw error;
    return mapExploreEntityRow(data as unknown as ExploreEntityRow);
  }

  async update(id: string, input: ExploreEntityUpdateInput): Promise<ExploreEntity> {
    const values = mapExploreEntityUpdateInput(input);
    const { data, error } = await this.client
      .from('explore_entities')
      .update(values)
      .eq('id', id)
      .select(ENTITY_SELECT)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new ExploreNotFoundError('Explore entity', id);
    return mapExploreEntityRow(data as unknown as ExploreEntityRow);
  }

  async archive(id: string): Promise<ExploreEntity> {
    const now = new Date().toISOString();
    const { data, error } = await this.client
      .from('explore_entities')
      .update({ status: 'archived', visibility: 'internal', archived_at: now })
      .eq('id', id)
      .select(ENTITY_SELECT)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new ExploreNotFoundError('Explore entity', id);
    return mapExploreEntityRow(data as unknown as ExploreEntityRow);
  }
}

export const entityRepository = new EntityRepository();
