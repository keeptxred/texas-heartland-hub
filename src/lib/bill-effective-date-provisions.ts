import { supabase } from '@/integrations/supabase/client';

export type BillEffectiveDateProvision = {
  id: string;
  sequence: number;
  provision_scope: string;
  effect_kind: 'effective' | 'conditional' | 'no_effect';
  effective_date: string | null;
  condition_text: string | null;
  condition_status: 'not_applicable' | 'pending' | 'satisfied' | 'failed' | 'unknown';
  source_url: string;
  source_note: string | null;
};

const db = supabase as any;

export async function getBillEffectiveDateProvisions(billId: string) {
  const { data, error } = await db
    .from('bill_effective_date_provisions')
    .select('id,sequence,provision_scope,effect_kind,effective_date,condition_text,condition_status,source_url,source_note')
    .eq('bill_id', billId)
    .order('sequence', { ascending: true });

  if (error) {
    console.error(`getBillEffectiveDateProvisions failed for bill ${billId}:`, error.message ?? error);
    return [] as BillEffectiveDateProvision[];
  }

  return (data ?? []) as BillEffectiveDateProvision[];
}
