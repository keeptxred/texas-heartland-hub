import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import type {
  ExploreDuplicateCandidate,
  ExploreDuplicateCandidateWithEntities,
  ExploreDuplicateEntitySummary,
  ExploreDuplicateStatus,
  ExploreMergeErrorCode,
  ExploreMergeResult,
} from '@/types/explore/duplicates';

// Admin passcode gate — matches convention in publishArticle.functions.ts.
function authOk(token: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? 'keeptxred';
  return typeof token === 'string' && token.length > 0 && token === expected;
}

function fail(
  code: ExploreMergeErrorCode,
  message: string,
  details?: Record<string, unknown>,
) {
  return { ok: false as const, error: { code, message, details } };
}

type CandidateRow = {
  id: string;
  entity_a_id: string;
  entity_b_id: string;
  similarity_score: number | string;
  matching_fields: string[] | null;
  evidence: Record<string, unknown> | null;
  status: ExploreDuplicateStatus;
  resolution_notes: string | null;
  resolved_by_user_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapCandidate(row: CandidateRow): ExploreDuplicateCandidate {
  return {
    id: row.id,
    entityAId: row.entity_a_id,
    entityBId: row.entity_b_id,
    similarityScore: Number(row.similarity_score),
    matchingFields: row.matching_fields ?? [],
    evidence: (row.evidence ?? {}) as Record<string, unknown>,
    status: row.status,
    resolutionNotes: row.resolution_notes,
    resolvedByUserId: row.resolved_by_user_id,
    resolvedAt: row.resolved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function loadEntitySummaries(
  ids: string[],
): Promise<Map<string, ExploreDuplicateEntitySummary>> {
  const map = new Map<string, ExploreDuplicateEntitySummary>();
  if (ids.length === 0) return map;
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

  const { data: entities, error: entErr } = await supabaseAdmin
    .from('explore_entities')
    .select(
      'id,name,slug,status,visibility,entity_type_id,summary,short_description,verified_at,archived_at,updated_at,created_at,source_confidence,popularity_score',
    )
    .in('id', ids);
  if (entErr) throw entErr;

  const typeIds = Array.from(
    new Set((entities ?? []).map((e) => (e as { entity_type_id: string }).entity_type_id)),
  );
  const { data: types } = await supabaseAdmin
    .from('explore_entity_types')
    .select('id,key,name')
    .in('id', typeIds.length ? typeIds : ['00000000-0000-0000-0000-000000000000']);
  const typeMap = new Map(
    (types ?? []).map((t) => [
      (t as { id: string }).id,
      t as { id: string; key: string; name: string },
    ]),
  );

  const { data: locations } = await supabaseAdmin
    .from('explore_locations')
    .select('entity_id,city,county,state_code,address_line_1,latitude,longitude')
    .in('entity_id', ids);
  const locMap = new Map(
    (locations ?? []).map((l) => [(l as { entity_id: string }).entity_id, l]),
  );

  const countTables = [
    ['explore_entity_media', 'media'],
    ['explore_entity_categories', 'categories'],
    ['explore_entity_tags', 'tags'],
    ['explore_entity_amenities', 'amenities'],
    ['explore_entity_activities', 'activities'],
    ['explore_entity_relationships_src', 'relationships'],
    ['explore_observations', 'observations'],
    ['explore_entity_reviews', 'reviews'],
    ['explore_entity_sources', 'sources'],
  ] as const;

  const counts: Record<string, Record<string, number>> = {};
  for (const id of ids) counts[id] = {};

  async function countFor(table: string, key: string, column: string) {
    for (const id of ids) {
      const { count } = await supabaseAdmin
        .from(table)
        .select('*', { head: true, count: 'exact' })
        .eq(column, id);
      counts[id][key] = count ?? 0;
    }
  }

  for (const [table, key] of countTables) {
    if (table === 'explore_entity_relationships_src') {
      // Count both source + target
      for (const id of ids) {
        const { count: srcCount } = await supabaseAdmin
          .from('explore_entity_relationships')
          .select('*', { head: true, count: 'exact' })
          .eq('source_entity_id', id);
        const { count: tgtCount } = await supabaseAdmin
          .from('explore_entity_relationships')
          .select('*', { head: true, count: 'exact' })
          .eq('target_entity_id', id);
        counts[id][key] = (srcCount ?? 0) + (tgtCount ?? 0);
      }
    } else {
      await countFor(table, key, 'entity_id');
    }
  }

  const profileTables = [
    'explore_lake_profiles',
    'explore_park_profiles',
    'explore_campground_profiles',
    'explore_species_profiles',
    'explore_business_profiles',
  ];
  const profilePresence = new Map<string, boolean>();
  for (const id of ids) profilePresence.set(id, false);
  for (const pt of profileTables) {
    const { data: rows } = await supabaseAdmin
      .from(pt)
      .select('entity_id')
      .in('entity_id', ids);
    for (const r of rows ?? []) {
      profilePresence.set((r as { entity_id: string }).entity_id, true);
    }
  }

  for (const raw of entities ?? []) {
    const e = raw as {
      id: string;
      name: string;
      slug: string;
      status: ExploreDuplicateEntitySummary['status'];
      visibility: ExploreDuplicateEntitySummary['visibility'];
      entity_type_id: string;
      summary: string | null;
      short_description: string | null;
      verified_at: string | null;
      archived_at: string | null;
      updated_at: string;
      created_at: string;
      source_confidence: number;
      popularity_score: number | string;
    };
    const t = typeMap.get(e.entity_type_id);
    const loc = locMap.get(e.id) as
      | {
          city: string | null;
          county: string | null;
          state_code: string | null;
          address_line_1: string | null;
          latitude: number | string | null;
          longitude: number | string | null;
        }
      | undefined;
    map.set(e.id, {
      id: e.id,
      name: e.name,
      slug: e.slug,
      status: e.status,
      visibility: e.visibility,
      entityTypeId: e.entity_type_id,
      entityTypeKey: t?.key ?? null,
      entityTypeName: t?.name ?? null,
      summary: e.summary,
      shortDescription: e.short_description,
      verifiedAt: e.verified_at,
      archivedAt: e.archived_at,
      updatedAt: e.updated_at,
      createdAt: e.created_at,
      sourceConfidence: Number(e.source_confidence),
      popularityScore: Number(e.popularity_score),
      location: loc
        ? {
            city: loc.city,
            county: loc.county,
            stateCode: loc.state_code,
            addressLine1: loc.address_line_1,
            latitude: loc.latitude == null ? null : Number(loc.latitude),
            longitude: loc.longitude == null ? null : Number(loc.longitude),
          }
        : null,
      counts: {
        media: counts[e.id].media ?? 0,
        categories: counts[e.id].categories ?? 0,
        tags: counts[e.id].tags ?? 0,
        amenities: counts[e.id].amenities ?? 0,
        activities: counts[e.id].activities ?? 0,
        relationships: counts[e.id].relationships ?? 0,
        observations: counts[e.id].observations ?? 0,
        reviews: counts[e.id].reviews ?? 0,
        sources: counts[e.id].sources ?? 0,
      },
      hasProfile: profilePresence.get(e.id) ?? false,
    });
  }

  return map;
}

const ListInput = z.object({
  token: z.string().min(1),
  status: z.enum(['pending', 'merged', 'not_duplicate', 'deferred']).default('pending'),
  page: z.number().int().positive().max(1000).default(1),
  pageSize: z.number().int().positive().max(100).default(25),
});

export const listExploreDuplicateCandidatesFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => ListInput.parse(d))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return fail('unauthorized', 'Admin access required');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    const { data: rows, error, count } = await supabaseAdmin
      .from('explore_duplicate_candidates')
      .select('*', { count: 'exact' })
      .eq('status', data.status)
      .order('similarity_score', { ascending: false })
      .order('created_at', { ascending: true })
      .range(from, to);
    if (error) return fail('server_error', error.message);

    const candidates = ((rows ?? []) as CandidateRow[]).map(mapCandidate);
    const ids = Array.from(
      new Set(candidates.flatMap((c) => [c.entityAId, c.entityBId])),
    );
    const summaries = await loadEntitySummaries(ids);
    const items: ExploreDuplicateCandidateWithEntities[] = candidates.map((c) => ({
      ...c,
      entityA: summaries.get(c.entityAId) ?? null,
      entityB: summaries.get(c.entityBId) ?? null,
    }));

    return {
      ok: true as const,
      data: {
        items,
        total: count ?? 0,
        page: data.page,
        pageSize: data.pageSize,
      },
    };
  });

const DetailInput = z.object({
  token: z.string().min(1),
  candidateId: z.string().uuid(),
});

export const getExploreDuplicateCandidateFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => DetailInput.parse(d))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return fail('unauthorized', 'Admin access required');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: row, error } = await supabaseAdmin
      .from('explore_duplicate_candidates')
      .select('*')
      .eq('id', data.candidateId)
      .maybeSingle();
    if (error) return fail('server_error', error.message);
    if (!row) return fail('not_found', 'Duplicate candidate not found');
    const candidate = mapCandidate(row as CandidateRow);
    const summaries = await loadEntitySummaries([candidate.entityAId, candidate.entityBId]);
    return {
      ok: true as const,
      data: {
        ...candidate,
        entityA: summaries.get(candidate.entityAId) ?? null,
        entityB: summaries.get(candidate.entityBId) ?? null,
      } as ExploreDuplicateCandidateWithEntities,
    };
  });

const MergeInput = z.object({
  token: z.string().min(1),
  candidateId: z.string().uuid(),
  survivorId: z.string().uuid(),
  reason: z.string().trim().max(1000).nullable().optional(),
});

export const mergeExploreDuplicateCandidateFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => MergeInput.parse(d))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return fail('unauthorized', 'Admin access required');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

    // Pre-flight validation: candidate exists, still pending, survivor belongs, entities not archived.
    const { data: candRow, error: candErr } = await supabaseAdmin
      .from('explore_duplicate_candidates')
      .select('id,entity_a_id,entity_b_id,status')
      .eq('id', data.candidateId)
      .maybeSingle();
    if (candErr) return fail('server_error', candErr.message);
    if (!candRow) return fail('not_found', 'Duplicate candidate not found');
    const cand = candRow as {
      id: string;
      entity_a_id: string;
      entity_b_id: string;
      status: ExploreDuplicateStatus;
    };
    if (cand.status !== 'pending') {
      return fail('already_resolved', `Candidate is already ${cand.status}`);
    }
    if (data.survivorId !== cand.entity_a_id && data.survivorId !== cand.entity_b_id) {
      return fail('invalid_survivor', 'Survivor must be one of the candidate entities');
    }
    const loserId =
      data.survivorId === cand.entity_a_id ? cand.entity_b_id : cand.entity_a_id;

    const { data: ents, error: entsErr } = await supabaseAdmin
      .from('explore_entities')
      .select('id,status,archived_at')
      .in('id', [cand.entity_a_id, cand.entity_b_id]);
    if (entsErr) return fail('server_error', entsErr.message);
    for (const raw of ents ?? []) {
      const e = raw as { id: string; status: string; archived_at: string | null };
      if (e.status === 'archived' || e.archived_at) {
        return fail('archived_entity', `Entity ${e.id} is already archived`);
      }
    }

    const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc(
      'explore_merge_duplicate_candidate',
      {
        p_candidate_id: data.candidateId,
        p_survivor_id: data.survivorId,
        p_resolved_by: null,
        p_notes: data.reason ?? null,
      },
    );
    if (rpcErr) {
      const msg = rpcErr.message ?? 'Merge failed';
      const lower = msg.toLowerCase();
      if (lower.includes('not found')) return fail('not_found', msg);
      if (lower.includes('already')) return fail('already_resolved', msg);
      if (lower.includes('archived')) return fail('archived_entity', msg);
      if (lower.includes('not part of')) return fail('invalid_survivor', msg);
      return fail('server_error', msg);
    }

    const raw = (rpcData ?? {}) as Record<string, unknown>;
    const merge = (raw.merge ?? {}) as Record<string, unknown>;
    const counts = (merge.counts ?? {}) as Record<string, unknown>;
    const result: ExploreMergeResult = {
      candidateId: String(raw.candidate_id ?? data.candidateId),
      survivorId: String(merge.survivor_id ?? data.survivorId),
      loserId: String(merge.loser_id ?? loserId),
      archivedSlug: (merge.archived_slug as string | null) ?? null,
      mergedAt: String(merge.merged_at ?? new Date().toISOString()),
      stats: {
        slugHistoryMoved: Number(counts.slug_history_moved ?? 0),
        relationshipsPruned: Number(counts.relationships_pruned ?? 0),
      },
      warnings: [],
      raw,
    };
    return { ok: true as const, data: result };
  });

const ResolveInput = z.object({
  token: z.string().min(1),
  candidateId: z.string().uuid(),
  status: z.enum(['not_duplicate', 'deferred']),
  reason: z.string().trim().max(1000).nullable().optional(),
});

export const resolveExploreDuplicateCandidateFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => ResolveInput.parse(d))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return fail('unauthorized', 'Admin access required');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: row, error } = await supabaseAdmin
      .from('explore_duplicate_candidates')
      .update({
        status: data.status,
        resolved_at: new Date().toISOString(),
        resolution_notes: data.reason ?? null,
      })
      .eq('id', data.candidateId)
      .eq('status', 'pending')
      .select('*')
      .maybeSingle();
    if (error) return fail('server_error', error.message);
    if (!row) return fail('already_resolved', 'Candidate is not pending or does not exist');
    return { ok: true as const, data: mapCandidate(row as CandidateRow) };
  });
