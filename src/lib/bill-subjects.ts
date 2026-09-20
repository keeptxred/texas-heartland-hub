import { supabase } from '@/integrations/supabase/client';
import { canonicalBillPath, type Bill } from '@/lib/bills';

const db = supabase as any;

export type BillSubject = {
  id: string;
  name: string;
  slug: string;
};

export type BillSubjectBill = Pick<
  Bill,
  | 'id'
  | 'legislature_number'
  | 'session_code'
  | 'bill_type'
  | 'bill_number'
  | 'bill_identifier'
  | 'caption'
  | 'current_status_label'
  | 'last_action_date'
  | 'became_law'
> & { href: string };

export async function getBillSubjectBySlug(slug: string): Promise<BillSubject | null> {
  const { data, error } = await db
    .from('bill_subjects')
    .select('id,name,slug')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return (data as BillSubject | null) ?? null;
}

export async function getBillsForSubject(
  subjectId: string,
  limit = 100,
): Promise<BillSubjectBill[]> {
  const { data, error } = await db
    .from('bill_subject_relationships')
    .select(
      'bills(id,legislature_number,session_code,bill_type,bill_number,bill_identifier,caption,current_status_label,last_action_date,became_law,is_active)',
    )
    .eq('subject_id', subjectId)
    .eq('review_status', 'approved')
    .limit(limit);

  if (error) throw error;

  return (data ?? [])
    .map((row: any) => row.bills)
    .filter((bill: any) => bill?.id && bill.is_active !== false)
    .map((bill: any) => ({ ...bill, href: canonicalBillPath(bill) }))
    .sort((a: BillSubjectBill, b: BillSubjectBill) =>
      String(b.last_action_date ?? '').localeCompare(String(a.last_action_date ?? '')),
    );
}
