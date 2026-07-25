import type { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';
import type { ExplorePaginatedResult, ExplorePagination } from '@/types/explore';

type UntypedSupabaseClient = SupabaseClient<Record<string, unknown>>;

export type ExploreSourceType =
  | 'government'
  | 'academic'
  | 'nonprofit'
  | 'commercial'
  | 'partner'
  | 'community'
  | 'internal'
  | 'ai';

export interface ExploreSourceRecord {
  id: string;
  name: string;
  sourceType: ExploreSourceType;
  baseUrl: string | null;
  publisher: string | null;
  licenseName: string | null;
  licenseUrl: string | null;
  defaultConfidence: number;
  isAuthoritative: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExploreSourceFilters {
  query?: string;
  sourceType?: ExploreSourceType;
  active?: boolean;
  authoritative?: boolean;
}

interface SourceRow {
  id: string;
  name: string;
  source_type: ExploreSourceType;
  base_url: string | null;
  publisher: string | null;
  license_name: string | null;
  license_url: string | null;
  default_confidence: number;
  is_authoritative: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class SourceRepository {
  constructor(
    private readonly client: UntypedSupabaseClient = supabase as unknown as UntypedSupabaseClient,
  ) {}

  async list(
    filters: ExploreSourceFilters = {},
    pagination: ExplorePagination = { page: 1, pageSize: 25 },
  ): Promise<ExplorePaginatedResult<ExploreSourceRecord>> {
    const page = Math.max(1, Math.trunc(pagination.page));
    const pageSize = Math.min(100, Math.max(1, Math.trunc(pagination.pageSize)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.client.from('explore_sources').select('*', { count: 'exact' });

    if (filters.sourceType) query = query.eq('source_type', filters.sourceType);
    if (filters.active !== undefined) query = query.eq('is_active', filters.active);
    if (filters.authoritative !== undefined) {
      query = query.eq('is_authoritative', filters.authoritative);
    }
    if (filters.query?.trim()) {
      const escaped = filters.query.trim().replace(/[%_,()]/g, '');
      query = query.or(`name.ilike.%${escaped}%,publisher.ilike.%${escaped}%`);
    }

    const { data, error, count } = await query
      .order('is_authoritative', { ascending: false })
      .order('default_confidence', { ascending: false })
      .order('name', { ascending: true })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;
    return {
      items: ((data ?? []) as unknown as SourceRow[]).map(mapSourceRow),
      page,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
    };
  }

  async countActive(): Promise<number> {
    const { count, error } = await this.client
      .from('explore_sources')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) throw error;
    return count ?? 0;
  }
}

function mapSourceRow(row: SourceRow): ExploreSourceRecord {
  return {
    id: row.id,
    name: row.name,
    sourceType: row.source_type,
    baseUrl: row.base_url,
    publisher: row.publisher,
    licenseName: row.license_name,
    licenseUrl: row.license_url,
    defaultConfidence: row.default_confidence,
    isAuthoritative: row.is_authoritative,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const sourceRepository = new SourceRepository();
