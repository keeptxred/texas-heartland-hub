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
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  type: z.enum(['all', 'subject', 'article']).default('all'),
  limit: z.number().int().positive().max(200).default(100),
});

export const listBillRelationshipReviews = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ListInput.parse(data))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    const admin = await getAdmin();
    const items: any[] = [];

    if (data.type !== 'article') {
      const { data: rows, error } = await admin
        .from('bill_subject_relationships')
        .select('bill_id,subject_id,confidence,source,is_manual,review_status,evidence,created_at,updated_at,bills(bill_identifier,caption,legislature_number,bill_type,bill_number),bill_subjects(name,slug)')
        .eq('review_status', data.status)
        .order('confidence', { ascending: false, nullsFirst: false })
        .limit(data.limit);
      if (error) throw error;
      for (const row of rows ?? []) items.push({ type: 'subject', id: `${row.bill_id}:${row.subject_id}`, ...row });
    }

    if (data.type !== 'subject') {
      const { data: rows, error } = await admin
        .from('bill_article_relationships')
        .select('id,bill_id,article_id,relationship_type,confidence,source,is_manual,review_status,evidence,created_at,updated_at,bills(bill_identifier,caption,legislature_number,bill_type,bill_number),daily_articles(title,slug,dek,published_at)')
        .eq('review_status', data.status)
        .order('confidence', { ascending: false, nullsFirst: false })
        .limit(data.limit);
      if (error) throw error;
      for (const row of rows ?? []) items.push({ type: 'article', ...row });
    }

    items.sort((a, b) => Number(b.confidence ?? 0) - Number(a.confidence ?? 0));
    return { ok: true as const, items: items.slice(0, data.limit) };
  });

const ReviewInput = z.object({
  token: z.string().min(1),
  type: z.enum(['subject', 'article']),
  id: z.string().min(1),
  status: z.enum(['approved', 'rejected']),
});

export const reviewBillRelationship = createServerFn({ method: 'POST' })
  .validator((data: unknown) => ReviewInput.parse(data))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    const admin = await getAdmin();
    const now = new Date().toISOString();

    if (data.type === 'article') {
      const { error } = await admin
        .from('bill_article_relationships')
        .update({ review_status: data.status, is_manual: true, source: 'admin-review', updated_at: now })
        .eq('id', data.id);
      if (error) throw error;
    } else {
      const [billId, subjectId] = data.id.split(':');
      if (!billId || !subjectId) return { ok: false as const, error: 'Invalid subject relationship id' };
      const { error } = await admin
        .from('bill_subject_relationships')
        .update({ review_status: data.status, is_manual: true, source: 'admin-review', updated_at: now })
        .eq('bill_id', billId)
        .eq('subject_id', subjectId);
      if (error) throw error;
    }

    return { ok: true as const };
  });
