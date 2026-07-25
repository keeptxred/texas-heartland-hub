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

// Admin passcode gate — matches convention used elsewhere in the codebase.
function authOk(token: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? 'keeptxred';
  return typeof token === 'string' && token.length > 0 && token === expected;
}

type ErrorPayload = { ok: false; error: { code: ExploreMergeErrorCode; message: string } };

function fail(code: ExploreMergeErrorCode, message: string): ErrorPayload {
  return { ok: false, error: { code, message } };
}

type CandidateRow = {
  id: string;
  entity_a_id: string;
  entity_b_id: string;
  similarity_score: number | string;
  matching_fields: string[] | null;
  evidence: unknown;
  status: ExploreDuplicateStatus;
  resolution_notes: string | null;
  resolved_by_user_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapCandidate(row: CandidateRow): ExploreDuplicateCandidate {
  let evidenceJson = '{}';
  try {
    evidenceJson = JSON.stringify(row.evidence ?? {});
  } catch {
    evidenceJson = '{}';
  }
  return {
    id: row.id,
    entityAId: row.entity_a_id,
    entityBId: row.entity_b_id,
    similarityScore: Number(row.similarity_score),
    matchingFields: row.matching_fields ?? [],
    evidenceJson,
    status: row.status,
    resolutionNotes: row.resolution_notes,
    resolvedByUserId: row.resolved_by_user_id,
    resolvedAt: row.resolved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Loose supabase type for dynamic table access. supabaseAdmin bypasses RLS;
// callers of this module must be pre-authorized.
/* eslint-disable @typescript-eslint/no-explicit-any */
type LooseClient = {
  from: (table: string) => any;
  rpc: (name: string, args?: Record<string, unknown>) => any;
};

async function getAdmin(): Promise<LooseClient> {
  const mod = await import('@/integrations/supabase/client.server');
  return mod.supabaseAdmin as unknown as LooseClient;
}

async function loadEntitySummaries(
  admin: LooseClient,
  ids: string[],
): Promise<Map<string, ExploreDuplicateEntitySummary>> {
  const map = new Map<string, ExploreDuplicateEntitySummary>();
  if (ids.length === 0) return map;

  const { data: entities, error: entErr } = await admin
    .from('explore_entities')
    .select(
      'id,name,slug,status,visibility,entity_type_id,summary,short_description,verified_at,archived_at,updated_at,created_at,source_confidence,popularity_score',
    )
    .in('id', ids);
  if (entErr) throw entErr;
  const entRows = (entities ?? []) as Array<Record<string, any>>;

  const typeIds = Array.from(new Set(entRows.map((e) => String(e.entity_type_id))));
  const { data: types } = await admin
    .from('explore_entity_types')
    .select('id,key,name')
    .in('id', typeIds.length ? typeIds : ['00000000-0000-0000-0000-000000000000']);
  const typeMap = new Map<string, { key: string; name: string }>();
  for (const t of (types ?? []) as Array<Record<string, any>>) {
    typeMap.set(String(t.id), { key: String(t.key), name: String(t.name) });
  }

  const { data: locations } = await admin
    .from('explore_locations')
    .select('entity_id,city,county,state_code,address_line_1,latitude,longitude')
    .in('entity_id', ids);
  const locMap = new Map<string, Record<string, any>>();
  for (const l of (locations ?? []) as Array<Record<string, any>>) {
    locMap.set(String(l.entity_id), l);
  }

  const counts: Record<string, Record<string, number>> = {};
  for (const id of ids) counts[id] = {};

  async function countEntityIdTable(table: string, key: string) {
    for (const id of ids) {
      const { count } = await admin
        .from(table)
        .select('*', { head: true, count: 'exact' })
        .eq('entity_id', id);
      counts[id][key] = count ?? 0;
    }
  }

  await countEntityIdTable('explore_entity_media', 'media');
  await countEntityIdTable('explore_entity_categories', 'categories');
  await countEntityIdTable('explore_entity_tags', 'tags');
  await countEntityIdTable('explore_entity_amenities', 'amenities');
  await countEntityIdTable('explore_entity_activities', 'activities');
  await countEntityIdTable('explore_observations', 'observations');
  await countEntityIdTable('explore_entity_reviews', 'reviews');
  await countEntityIdTable('explore_entity_sources', 'sources');

  for (const id of ids) {
    const { count: srcCount } = await admin
      .from('explore_entity_relationships')
      .select('*', { head: true, count: 'exact' })
      .eq('source_entity_id', id);
    const { count: tgtCount } = await admin
      .from('explore_entity_relationships')
      .select('*', { head: true, count: 'exact' })
      .eq('target_entity_id', id);
    counts[id].relationships = (srcCount ?? 0) + (tgtCount ?? 0);
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
    const { data: rows } = await admin
      .from(pt)
      .select('entity_id')
      .in('entity_id', ids);
    for (const r of (rows ?? []) as Array<Record<string, any>>) {
      profilePresence.set(String(r.entity_id), true);
    }
  }

  for (const e of entRows) {
    const t = typeMap.get(String(e.entity_type_id));
    const loc = locMap.get(String(e.id));
    map.set(String(e.id), {
      id: String(e.id),
      name: String(e.name),
      slug: String(e.slug),
      status: e.status,
      visibility: e.visibility,
      entityTypeId: String(e.entity_type_id),
      entityTypeKey: t?.key ?? null,
      entityTypeName: t?.name ?? null,
      summary: e.summary ?? null,
      shortDescription: e.short_description ?? null,
      verifiedAt: e.verified_at ?? null,
      archivedAt: e.archived_at ?? null,
      updatedAt: String(e.updated_at),
      createdAt: String(e.created_at),
      sourceConfidence: Number(e.source_confidence ?? 0),
      popularityScore: Number(e.popularity_score ?? 0),
      location: loc
        ? {
            city: loc.city ?? null,
            county: loc.county ?? null,
            stateCode: loc.state_code ?? null,
            addressLine1: loc.address_line_1 ?? null,
            latitude: loc.latitude == null ? null : Number(loc.latitude),
            longitude: loc.longitude == null ? null : Number(loc.longitude),
          }
        : null,
      counts: {
        media: counts[String(e.id)].media ?? 0,
        categories: counts[String(e.id)].categories ?? 0,
        tags: counts[String(e.id)].tags ?? 0,
        amenities: counts[String(e.id)].amenities ?? 0,
        activities: counts[String(e.id)].activities ?? 0,
        relationships: counts[String(e.id)].relationships ?? 0,
        observations: counts[String(e.id)].observations ?? 0,
        reviews: counts[String(e.id)].reviews ?? 0,
        sources: counts[String(e.id)].sources ?? 0,
      },
      hasProfile: profilePresence.get(String(e.id)) ?? false,
    });
  }

  return map;
}

// ------------------ LIST ------------------

const ListInput = z.object({
  token: z.string().min(1),
  status: z.enum(['pending', 'merged', 'not_duplicate', 'deferred']).default('pending'),
  page: z.number().int().positive().max(1000).default(1),
  pageSize: z.number().int().positive().max(100).default(25),
});

export type ListDuplicatesResult =
  | ErrorPayload
  | {
      ok: true;
      data: {
        items: ExploreDuplicateCandidateWithEntities[];
        total: number;
        page: number;
        pageSize: number;
      };
    };

export const listExploreDuplicateCandidatesFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => ListInput.parse(d))
  .handler(async ({ data }): Promise<ListDuplicatesResult> => {
    if (!authOk(data.token)) return fail('unauthorized', 'Admin access required');
    const admin = await getAdmin();
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    const { data: rows, error, count } = await admin
      .from('explore_duplicate_candidates')
      .select('*', { count: 'exact' })
      .eq('status', data.status)
      .order('similarity_score', { ascending: false })
      .order('created_at', { ascending: true })
      .range(from, to);
    if (error) return fail('server_error', error.message);

    const candidates = ((rows ?? []) as CandidateRow[]).map(mapCandidate);
    const ids = Array.from(new Set(candidates.flatMap((c) => [c.entityAId, c.entityBId])));
    const summaries = await loadEntitySummaries(admin, ids);
    const items: ExploreDuplicateCandidateWithEntities[] = candidates.map((c) => ({
      ...c,
      entityA: summaries.get(c.entityAId) ?? null,
      entityB: summaries.get(c.entityBId) ?? null,
    }));

    return {
      ok: true,
      data: { items, total: Number(count ?? 0), page: data.page, pageSize: data.pageSize },
    };
  });

// ------------------ DETAIL ------------------

const DetailInput = z.object({ token: z.string().min(1), candidateId: z.string().uuid() });

export type GetDuplicateResult =
  | ErrorPayload
  | { ok: true; data: ExploreDuplicateCandidateWithEntities };

export const getExploreDuplicateCandidateFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => DetailInput.parse(d))
  .handler(async ({ data }): Promise<GetDuplicateResult> => {
    if (!authOk(data.token)) return fail('unauthorized', 'Admin access required');
    const admin = await getAdmin();
    const { data: row, error } = await admin
      .from('explore_duplicate_candidates')
      .select('*')
      .eq('id', data.candidateId)
      .maybeSingle();
    if (error) return fail('server_error', error.message);
    if (!row) return fail('not_found', 'Duplicate candidate not found');
    const candidate = mapCandidate(row as CandidateRow);
    const summaries = await loadEntitySummaries(admin, [candidate.entityAId, candidate.entityBId]);
    return {
      ok: true,
      data: {
        ...candidate,
        entityA: summaries.get(candidate.entityAId) ?? null,
        entityB: summaries.get(candidate.entityBId) ?? null,
      },
    };
  });

// ------------------ MERGE ------------------

const MergeInput = z.object({
  token: z.string().min(1),
  candidateId: z.string().uuid(),
  survivorId: z.string().uuid(),
  reason: z.string().trim().max(1000).optional(),
});

export type MergeCandidateResult = ErrorPayload | { ok: true; data: ExploreMergeResult };

export const mergeExploreDuplicateCandidateFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => MergeInput.parse(d))
  .handler(async ({ data }): Promise<MergeCandidateResult> => {
    if (!authOk(data.token)) return fail('unauthorized', 'Admin access required');
    if (data.candidateId === data.survivorId) {
      return fail('validation', 'candidateId and survivorId must differ');
    }
    const admin = await getAdmin();

    // Server-side membership + state pre-flight.
    const { data: candRow, error: candErr } = await admin
      .from('explore_duplicate_candidates')
      .select('id,entity_a_id,entity_b_id,status')
      .eq('id', data.candidateId)
      .maybeSingle();
    if (candErr) return fail('server_error', candErr.message);
    if (!candRow) return fail('not_found', 'Duplicate candidate not found');
    const cand = candRow as {
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

    const { data: ents, error: entsErr } = await admin
      .from('explore_entities')
      .select('id,status,archived_at')
      .in('id', [cand.entity_a_id, cand.entity_b_id]);
    if (entsErr) return fail('server_error', entsErr.message);
    for (const raw of (ents ?? []) as Array<Record<string, any>>) {
      if (raw.status === 'archived' || raw.archived_at) {
        return fail('archived_entity', `Entity ${String(raw.id)} is already archived`);
      }
    }

    const { data: rpcData, error: rpcErr } = await admin.rpc(
      'explore_merge_duplicate_candidate',
      {
        p_candidate_id: data.candidateId,
        p_survivor_id: data.survivorId,
        p_resolved_by: null,
        p_notes: data.reason ?? null,
      },
    );
    if (rpcErr) {
      const msg = String(rpcErr.message ?? 'Merge failed');
      const lower = msg.toLowerCase();
      if (lower.includes('not found')) return fail('not_found', msg);
      if (lower.includes('already')) return fail('already_resolved', msg);
      if (lower.includes('archived')) return fail('archived_entity', msg);
      if (lower.includes('not part of')) return fail('invalid_survivor', msg);
      return fail('server_error', msg);
    }

    const raw = (rpcData ?? {}) as Record<string, any>;
    const merge = (raw.merge ?? {}) as Record<string, any>;
    const countsBlock = (merge.counts ?? {}) as Record<string, any>;
    const result: ExploreMergeResult = {
      candidateId: String(raw.candidate_id ?? data.candidateId),
      survivorId: String(merge.survivor_id ?? data.survivorId),
      loserId: String(merge.loser_id ?? loserId),
      archivedSlug: merge.archived_slug == null ? null : String(merge.archived_slug),
      mergedAt: String(merge.merged_at ?? new Date().toISOString()),
      stats: {
        slugHistoryMoved: Number(countsBlock.slug_history_moved ?? 0),
        relationshipsPruned: Number(countsBlock.relationships_pruned ?? 0),
      },
      warnings: [],
    };
    return { ok: true, data: result };
  });

// ------------------ RESOLVE (not_duplicate | deferred) ------------------

const ResolveInput = z.object({
  token: z.string().min(1),
  candidateId: z.string().uuid(),
  status: z.enum(['not_duplicate', 'deferred']),
  reason: z.string().trim().max(1000).optional(),
});

export type ResolveCandidateResult =
  | ErrorPayload
  | { ok: true; data: ExploreDuplicateCandidate };

export const resolveExploreDuplicateCandidateFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => ResolveInput.parse(d))
  .handler(async ({ data }): Promise<ResolveCandidateResult> => {
    if (!authOk(data.token)) return fail('unauthorized', 'Admin access required');
    const admin = await getAdmin();
    const { data: row, error } = await admin
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
    return { ok: true, data: mapCandidate(row as CandidateRow) };
  });
