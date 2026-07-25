import type { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';
import type { ExplorePaginatedResult, ExplorePagination } from '@/types/explore';

type UntypedSupabaseClient = SupabaseClient<Record<string, unknown>>;

export type ExploreImportJobStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'completed_with_warnings'
  | 'failed'
  | 'cancelled';

export interface ExploreImportJob {
  id: string;
  connectorKey: string;
  sourceId: string | null;
  status: ExploreImportJobStatus;
  startedAt: string | null;
  completedAt: string | null;
  recordsReceived: number;
  entitiesCreated: number;
  entitiesUpdated: number;
  entitiesUnchanged: number;
  warningsCount: number;
  errorsCount: number;
  summary: Record<string, unknown>;
  errorDetails: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface ExploreImportJobFilters {
  status?: ExploreImportJobStatus;
  connectorKey?: string;
}

interface ImportJobRow {
  id: string;
  connector_key: string;
  source_id: string | null;
  status: ExploreImportJobStatus;
  started_at: string | null;
  completed_at: string | null;
  records_received: number;
  entities_created: number;
  entities_updated: number;
  entities_unchanged: number;
  warnings_count: number;
  errors_count: number;
  summary: Record<string, unknown> | null;
  error_details: unknown[] | null;
  created_at: string;
  updated_at: string;
}

export class ImportJobRepository {
  constructor(
    private readonly client: UntypedSupabaseClient = supabase as unknown as UntypedSupabaseClient,
  ) {}

  async list(
    filters: ExploreImportJobFilters = {},
    pagination: ExplorePagination = { page: 1, pageSize: 25 },
  ): Promise<ExplorePaginatedResult<ExploreImportJob>> {
    const page = Math.max(1, Math.trunc(pagination.page));
    const pageSize = Math.min(100, Math.max(1, Math.trunc(pagination.pageSize)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.client.from('explore_import_jobs').select('*', { count: 'exact' });
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.connectorKey?.trim()) query = query.eq('connector_key', filters.connectorKey.trim());

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;
    return {
      items: ((data ?? []) as unknown as ImportJobRow[]).map(mapImportJobRow),
      page,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
    };
  }

  async countActive(): Promise<number> {
    const { count, error } = await this.client
      .from('explore_import_jobs')
      .select('id', { count: 'exact', head: true })
      .in('status', ['queued', 'running']);

    if (error) throw error;
    return count ?? 0;
  }
}

function mapImportJobRow(row: ImportJobRow): ExploreImportJob {
  return {
    id: row.id,
    connectorKey: row.connector_key,
    sourceId: row.source_id,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    recordsReceived: row.records_received,
    entitiesCreated: row.entities_created,
    entitiesUpdated: row.entities_updated,
    entitiesUnchanged: row.entities_unchanged,
    warningsCount: row.warnings_count,
    errorsCount: row.errors_count,
    summary: row.summary ?? {},
    errorDetails: row.error_details ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const importJobRepository = new ImportJobRepository();
