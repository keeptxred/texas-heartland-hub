import { supabase } from '@/integrations/supabase/client';
import type { LegislativeDocument } from '@/lib/bill-documents';

const db = supabase as any;

export type BillPrimarySourceAction = {
  action_date?: string | null;
  action_text?: string | null;
  chamber?: string | null;
  normalized_status?: string | null;
  source_url?: string | null;
};

/**
 * Fetch only the relations needed by the machine-readable bill reference route.
 * The general bill detail loader intentionally gathers a much wider relation graph,
 * but reference.json only publishes official actions and documents.
 */
export async function getBillPrimarySourceRelations(billId: string) {
  const [actionsResult, documentsResult] = await Promise.all([
    db
      .from('bill_actions')
      .select('action_date,action_text,chamber,normalized_status,source_url')
      .eq('bill_id', billId)
      .order('action_date', { ascending: false })
      .order('action_sequence', { ascending: false }),
    db
      .from('bill_documents')
      .select('id,bill_id,document_type,document_title,document_url,source_html_url,source_pdf_url,version_code,version_label,version_sequence,document_date,is_latest,file_format')
      .eq('bill_id', billId)
      .order('document_date', { ascending: false }),
  ]);

  if (actionsResult.error) throw actionsResult.error;
  if (documentsResult.error) throw documentsResult.error;

  return {
    actions: (actionsResult.data ?? []) as BillPrimarySourceAction[],
    documents: (documentsResult.data ?? []) as LegislativeDocument[],
  };
}
