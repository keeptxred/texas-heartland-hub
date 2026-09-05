import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

type LooseClient = { from: (table: string) => any; rpc: (name: string, args?: Record<string, unknown>) => any };

async function getAdmin(): Promise<LooseClient> {
  const mod = await import('@/integrations/supabase/client.server');
  return mod.supabaseAdmin as unknown as LooseClient;
}

function authOk(token: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  return Boolean(expected && token && token === expected);
}

const ListInput = z.object({
  token: z.string().min(1),
  status: z.enum(['new', 'reviewed', 'dismissed', 'published']).default('new'),
  limit: z.number().int().positive().max(200).default(100),
});

export const listLegislativeOpportunities = createServerFn({ method: 'POST' })
  .validator((input) => ListInput.parse(input))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    const admin = await getAdmin();
    const { data: rows, error } = await admin
      .from('legislative_content_opportunities')
      .select('id,bill_id,event_type,event_date,headline,summary,priority,source_url,status,metadata,created_at,bills(id,legislature_number,bill_type,bill_number,bill_identifier,caption,current_status_label)')
      .eq('status', data.status)
      .order('priority', { ascending: false })
      .order('event_date', { ascending: false })
      .limit(data.limit);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, items: rows ?? [] };
  });

const UpdateInput = z.object({
  token: z.string().min(1),
  id: z.string().uuid(),
  status: z.enum(['reviewed', 'dismissed', 'published']),
});

export const updateLegislativeOpportunity = createServerFn({ method: 'POST' })
  .validator((input) => UpdateInput.parse(input))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    const admin = await getAdmin();
    const { error } = await admin
      .from('legislative_content_opportunities')
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq('id', data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const refreshLegislativeOpportunities = createServerFn({ method: 'POST' })
  .validator((input) => z.object({ token: z.string().min(1), sinceDays: z.number().int().positive().max(365).default(30) }).parse(input))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    const admin = await getAdmin();
    const { data: result, error } = await admin.rpc('refresh_legislative_content_opportunities', { p_since_days: data.sinceDays });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, result };
  });