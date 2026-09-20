import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

function authOk(token: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  return Boolean(expected && token && token === expected);
}

async function getAdmin(): Promise<any> {
  const mod = await import('@/integrations/supabase/client.server');
  return mod.supabaseAdmin as any;
}

const ListInput = z.object({
  token: z.string().min(1),
  status: z.enum(['draft', 'pending', 'approved', 'rejected']).default('draft'),
  limit: z.number().int().positive().max(100).default(50),
});

export const listBillEditorialEnrichments = createServerFn({ method: 'POST' })
  .validator((input: unknown) => ListInput.parse(input))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    const admin = await getAdmin();
    const { data: rows, error } = await admin
      .from('bill_editorial_enrichments')
      .select('*,bills(id,bill_identifier,caption,legislature_number,bill_type,bill_number,current_status_label),bill_documents(id,document_title,document_type,document_url,document_date)')
      .eq('review_status', data.status)
      .order('updated_at', { ascending: false })
      .limit(data.limit);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, items: rows ?? [] };
  });

const CandidateInput = z.object({
  token: z.string().min(1),
  limit: z.number().int().positive().max(100).default(50),
});

export const listBillEditorialCandidates = createServerFn({ method: 'POST' })
  .validator((input: unknown) => CandidateInput.parse(input))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    const admin = await getAdmin();
    const { data: bills, error } = await admin
      .from('bills')
      .select('id,bill_identifier,caption,legislature_number,bill_type,bill_number,current_status_label,last_action_date,bill_documents(id,document_title,document_type,document_url,document_date)')
      .eq('is_active', true)
      .order('last_action_date', { ascending: false, nullsFirst: false })
      .limit(data.limit * 3);
    if (error) return { ok: false as const, error: error.message };

    const ids = (bills ?? []).map((row: any) => row.id);
    const { data: existing } = ids.length
      ? await admin.from('bill_editorial_enrichments').select('bill_id').in('bill_id', ids)
      : { data: [] };
    const existingIds = new Set((existing ?? []).map((row: any) => row.bill_id));
    const candidates = (bills ?? [])
      .filter((row: any) => !existingIds.has(row.id))
      .filter((row: any) => (row.bill_documents ?? []).some((doc: any) => ['analysis', 'bill_analysis', 'fiscal_note', 'bill_text'].includes(String(doc.document_type).toLowerCase())))
      .slice(0, data.limit);
    return { ok: true as const, items: candidates };
  });

const SaveInput = z.object({
  token: z.string().min(1),
  billId: z.string().uuid(),
  plainLanguageSummary: z.string().max(6000).nullable().optional(),
  whatChanges: z.string().max(8000).nullable().optional(),
  whoIsAffected: z.string().max(8000).nullable().optional(),
  effectiveDateExplanation: z.string().max(4000).nullable().optional(),
  limitations: z.string().max(4000).nullable().optional(),
  sourceDocumentIds: z.array(z.string().uuid()).max(25).default([]),
  sourceUrls: z.array(z.string().url()).max(25).default([]),
  sourceNotes: z.string().max(4000).nullable().optional(),
  generationMethod: z.enum(['manual', 'assisted', 'automated']).default('manual'),
  confidence: z.number().min(0).max(1).nullable().optional(),
  reviewStatus: z.enum(['draft', 'pending', 'approved', 'rejected']).default('draft'),
});

export const saveBillEditorialEnrichment = createServerFn({ method: 'POST' })
  .validator((input: unknown) => SaveInput.parse(input))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    if (data.reviewStatus === 'approved' && data.sourceDocumentIds.length === 0 && data.sourceUrls.length === 0) {
      return { ok: false as const, error: 'Approved explanations require at least one official source.' };
    }
    const admin = await getAdmin();
    const payload = {
      bill_id: data.billId,
      plain_language_summary: data.plainLanguageSummary ?? null,
      what_changes: data.whatChanges ?? null,
      who_is_affected: data.whoIsAffected ?? null,
      effective_date_explanation: data.effectiveDateExplanation ?? null,
      limitations: data.limitations ?? null,
      source_document_ids: data.sourceDocumentIds,
      source_urls: data.sourceUrls,
      source_notes: data.sourceNotes ?? null,
      generation_method: data.generationMethod,
      confidence: data.confidence ?? null,
      review_status: data.reviewStatus,
      reviewed_by: data.reviewStatus === 'approved' ? 'admin' : null,
      reviewed_at: data.reviewStatus === 'approved' ? new Date().toISOString() : null,
    };
    const { data: row, error } = await admin
      .from('bill_editorial_enrichments')
      .upsert(payload, { onConflict: 'bill_id' })
      .select('*')
      .single();
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, item: row };
  });
