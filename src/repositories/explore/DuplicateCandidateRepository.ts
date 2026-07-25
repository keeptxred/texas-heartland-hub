/*
PATH:
src/repositories/explore/DuplicateCandidateRepository.ts

FILE:
DuplicateCandidateRepository.ts
*/

import type { SupabaseClient } from '@supabase/supabase-js';

import { supabase } from '@/integrations/supabase/client';
import { ExploreNotFoundError } from '@/lib/explore/errors';
import type { ExploreEntity, ExplorePaginatedResult, ExplorePagination } from '@/types/explore';

import { mapExploreEntityRow, type ExploreEntityRow } from './entity.mapper';

type UntypedSupabaseClient = SupabaseClient<Record<string, unknown>>;

export type ExploreDuplicateCandidateStatus =
  | 'pending'
  | 'merged'
  | 'not_duplicate'
  | 'deferred';

export interface ExploreDuplicateCandidate {
  id: string;
  entityA: ExploreEntity;
  entityB: ExploreEntity;
  similarityScore: number;
  matchingFields: string[];
  evidence: Record<string, unknown>;
  status: ExploreDuplicateCandidateStatus;
  resolutionNotes: string | null;
  resolvedByUserId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExploreDuplicateCandidateFilters {
  status?: ExploreDuplicateCandidateStatus;
  minimumSimilarity?: number;
}

export interface ResolveExploreDuplicateCandidateInput {
  status: Exclude<ExploreDuplicateCandidateStatus, 'pending'>;
  resolutionNotes?: string | null;
  resolvedByUserId?: string | null;
}

export interface MergeExploreDuplicateCandidateInput {
  survivorEntityId: string;
  mergedEntityId: string;
  resolutionNotes?: string | null;
  resolvedByUserId?: string | null;
}

export interface ExploreEntityMergeResult {
  candidateId: string;
  survivorEntityId: string;
  mergedEntityId: string;
  archivedSlug: string;
  mergedAt: string;
}

interface DuplicateCandidateRow {
  id: string;
  entity_a_id: string;
  entity_b_id: string;
  similarity_score: number | string;
  matching_fields: string[] | null;
  evidence: Record<string, unknown> | null;
  status: ExploreDuplicateCandidateStatus;
  resolution_notes: string | null;
  resolved_by_user_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  entity_a: ExploreEntityRow | ExploreEntityRow[];
  entity_b: ExploreEntityRow | ExploreEntityRow[];
}

const DUPLICATE_SELECT = `
  id,
  entity_a_id,
  entity_b_id,
  similarity_score,
  matching_fields,
  evidence,
  status,
  resolution_notes,
  resolved_by_user_id,
  resolved_at,
  created_at,
  updated_at,
  entity_a:explore_entities!explore_duplicate_candidates_entity_a_id_fkey(*),
  entity_b:explore_entities!explore_duplicate_candidates_entity_b_id_fkey(*)
`;

export class DuplicateCandidateRepository {
  constructor(
    private readonly client: UntypedSupabaseClient = supabase as unknown as UntypedSupabaseClient,
  ) {}

  async list(
    filters: ExploreDuplicateCandidateFilters = { status: 'pending' },
    pagination: ExplorePagination = { page: 1, pageSize: 25 },
  ): Promise<ExplorePaginatedResult<ExploreDuplicateCandidate>> {
    const page = Math.max(1, Math.trunc(pagination.page));
    const pageSize = Math.min(100, Math.max(1, Math.trunc(pagination.pageSize)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.client
      .from('explore_duplicate_candidates')
      .select(DUPLICATE_SELECT, { count: 'exact' });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.minimumSimilarity !== undefined) {
      const minimumSimilarity = Math.max(0, Math.min(1, filters.minimumSimilarity));
      query = query.gte('similarity_score', minimumSimilarity);
    }

    const { data, error, count } = await query
      .order('similarity_score', { ascending: false })
      .order('created_at', { ascending: true })
      .range(from, to);

    if (error) throw error;

    const total = count ?? 0;

    return {
      items: ((data ?? []) as unknown as DuplicateCandidateRow[]).map(mapDuplicateCandidateRow),
      page,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
    };
  }

  async findById(id: string): Promise<ExploreDuplicateCandidate | null> {
    const { data, error } = await this.client
      .from('explore_duplicate_candidates')
      .select(DUPLICATE_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return data ? mapDuplicateCandidateRow(data as unknown as DuplicateCandidateRow) : null;
  }

  async countPending(): Promise<number> {
    const { count, error } = await this.client
      .from('explore_duplicate_candidates')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) throw error;
    return count ?? 0;
  }

  async resolve(
    candidateId: string,
    input: ResolveExploreDuplicateCandidateInput,
  ): Promise<ExploreDuplicateCandidate> {
    const resolutionNotes = input.resolutionNotes?.trim() || null;
    const resolvedAt = new Date().toISOString();

    const { data, error } = await this.client
      .from('explore_duplicate_candidates')
      .update({
        status: input.status,
        resolution_notes: resolutionNotes,
        resolved_by_user_id: input.resolvedByUserId ?? null,
        resolved_at: resolvedAt,
      })
      .eq('id', candidateId)
      .eq('status', 'pending')
      .select(DUPLICATE_SELECT)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new ExploreNotFoundError('Pending Explore duplicate candidate', candidateId);
    }

    return mapDuplicateCandidateRow(data as unknown as DuplicateCandidateRow);
  }

  async merge(
    candidateId: string,
    input: MergeExploreDuplicateCandidateInput,
  ): Promise<ExploreEntityMergeResult> {
    const { data, error } = await this.client.rpc('explore_merge_duplicate_candidate', {
      p_candidate_id: candidateId,
      p_survivor_entity_id: input.survivorEntityId,
      p_merged_entity_id: input.mergedEntityId,
      p_resolution_notes: input.resolutionNotes?.trim() || null,
      p_resolved_by_user_id: input.resolvedByUserId ?? null,
    });

    if (error) throw error;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Explore entity merge completed without a valid result payload.');
    }

    const result = data as Record<string, unknown>;

    return {
      candidateId: String(result.candidateId),
      survivorEntityId: String(result.survivorEntityId),
      mergedEntityId: String(result.mergedEntityId),
      archivedSlug: String(result.archivedSlug),
      mergedAt: String(result.mergedAt),
    };
  }
}

function mapDuplicateCandidateRow(row: DuplicateCandidateRow): ExploreDuplicateCandidate {
  const entityA = firstJoinedRow(row.entity_a);
  const entityB = firstJoinedRow(row.entity_b);

  if (!entityA || !entityB) {
    throw new Error(`Duplicate candidate ${row.id} is missing one or more linked entities.`);
  }

  return {
    id: row.id,
    entityA: mapExploreEntityRow(entityA),
    entityB: mapExploreEntityRow(entityB),
    similarityScore: Number(row.similarity_score),
    matchingFields: row.matching_fields ?? [],
    evidence: row.evidence ?? {},
    status: row.status,
    resolutionNotes: row.resolution_notes,
    resolvedByUserId: row.resolved_by_user_id,
    resolvedAt: row.resolved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function firstJoinedRow(value: ExploreEntityRow | ExploreEntityRow[]): ExploreEntityRow | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export const duplicateCandidateRepository = new DuplicateCandidateRepository();
