import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

function authorized(token: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  return Boolean(expected && token && token === expected);
}

type DbClient = { from: (table: string) => any };
async function adminClient(): Promise<DbClient> {
  const mod = await import('@/integrations/supabase/client.server');
  return mod.supabaseAdmin as unknown as DbClient;
}

const ReviewStatus = z.enum(['draft', 'pending', 'approved', 'rejected']);

export const listBillEditorialEnrichments = createServerFn({ method: 'POST' })
  .validator(z.object({
    token: z.string().min(1),
    status: ReviewStatus.default('pending'),
    limit: z.number().int().min(1).max(100).default(50),
  }))
  .handler(async ({ data }) => {
    if (!authorized(data.token)) return { ok: false as const, error: 'Unauthorized' };
    const db = await adminClient();
    const { data: rows, error } = await db
      .from('bill_editorial_enrichments')
      .select('*,bills(id,bill_identifier,caption,legislature_number,bill_type,bill_number,current_status_label)')
      .eq('review_status', data.status)
      .order('updated_at', { ascending: false })
      .limit(data.limit);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, items: rows ?? [] };
  });

export const saveBillEditorialEnrichment = createServerFn({ method: 'POST' })
  .validator(z.object({
    token: z.string().min(1),
    id: z.string().uuid(),
    plainLanguageSummary: z.string().max(5000).nullable(),
    whatChanges: z.string().max(10000).nullable(),
    whoIsAffected: z.string().max(10000).nullable(),
    effectiveDateExplanation: z.string().max(5000).nullable(),
    limitations: z.string().max(5000).nullable(),
    sourceUrls: z.array(z.string().url()).max(20),
    sourceDocumentIds: z.array(z.string().uuid()).max(50),
    sourceNotes: z.string().max(5000).nullable(),
    confidence: z.number().min(0).max(1).nullable(),
    reviewStatus: ReviewStatus,
  }))
  .handler(async ({ data }) => {
    if (!authorized(data.token)) return { ok: false as const, error: 'Unauthorized' };
    if (data.reviewStatus === 'approved' && data.sourceUrls.length === 0 && data.sourceDocumentIds.length === 0) {
      return { ok: false as const, error: 'Approved explanations require at least one source.' };
    }
    const db = await adminClient();
    const reviewed = data.reviewStatus === 'approved' || data.reviewStatus === 'rejected';
    const { error } = await db.from('bill_editorial_enrichments').update({
      plain_language_summary: data.plainLanguageSummary,
      what_changes: data.whatChanges,
      who_is_affected: data.whoIsAffected,
      effective_date_explanation: data.effectiveDateExplanation,
      limitations: data.limitations,
      source_urls: data.sourceUrls,
      source_document_ids: data.sourceDocumentIds,
      source_notes: data.sourceNotes,
      confidence: data.confidence,
      review_status: data.reviewStatus,
      reviewed_by: reviewed ? 'admin' : null,
      reviewed_at: reviewed ? new Date().toISOString() : null,
    }).eq('id', data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });