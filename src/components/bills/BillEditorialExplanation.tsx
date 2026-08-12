import { useEffect, useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';
import { supabase } from '@/integrations/supabase/client';
import { getBillEditorialEnrichment, type BillEditorialEnrichment } from '@/lib/bills';

type Editorial = BillEditorialEnrichment;
type BillAuthorityRecord = {
  bill_identifier: string;
  current_status_label: string;
  last_action_date: string | null;
  source_url: string | null;
  bill_text_url: string | null;
  analysis_url: string | null;
  fiscal_note_url: string | null;
  last_synced_at: string | null;
};
const db = supabase as any;

export function BillEditorialExplanation({ billId }: { billId: string }) {
  const [item, setItem] = useState<Editorial | null>(null);
  const [bill, setBill] = useState<BillAuthorityRecord | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      getBillEditorialEnrichment(billId),
      db.from('bills').select('bill_identifier,current_status_label,last_action_date,source_url,bill_text_url,analysis_url,fiscal_note_url,last_synced_at').eq('id', billId).maybeSingle(),
    ]).then(([editorial, billResult]) => {
      if (!active) return;
      setItem(editorial);
      if (!billResult.error && billResult.data) setBill(billResult.data as BillAuthorityRecord);
    }).catch((error) => console.error(`Bill authority reference failed for ${billId}:`, error));
    return () => { active = false; };
  }, [billId]);

  const sections = item ? [
    ['KeepTXRed summary', item.plain_language_summary],
    ['What would change', item.what_changes],
    ['Who may be affected', item.who_is_affected],
    ['When it would take effect', item.effective_date_explanation],
    ['Limits and uncertainty', item.limitations],
  ].filter(([, value]) => Boolean(value)) : [];

  const officialSources = bill ? [
    bill.source_url ? { name: `${bill.bill_identifier} official legislative record`, url: bill.source_url, note: 'Primary bill-status record.' } : { name: 'Texas Legislature Online', url: 'https://capitol.texas.gov/', note: 'Primary Texas legislative record system.' },
    bill.bill_text_url ? { name: 'Current official bill text', url: bill.bill_text_url, note: 'Official bill text or printing.' } : null,
    bill.analysis_url ? { name: 'Official bill analysis', url: bill.analysis_url, note: 'Committee or legislative analysis when available.' } : null,
    bill.fiscal_note_url ? { name: 'Official fiscal note', url: bill.fiscal_note_url, note: 'Fiscal analysis when available.' } : null,
  ].filter((source): source is { name: string; url: string; note: string } => Boolean(source)) : [];

  if (!bill && !sections.length) return null;

  return (
    <div className="space-y-8">
      {bill ? <CitationTrustPanel
        sources={officialSources}
        methodology={`KeepTXRed treats the official legislative record and latest official action as the factual status layer for ${bill.bill_identifier}. Status labels are normalized for browsing, while the legislative timeline and documents preserve official action text and source links. Any KeepTXRed explanation below is editorial context and remains separate from the official record.`}
        lastVerified={bill.last_synced_at ? `Legislative record synchronized ${formatTimestamp(bill.last_synced_at)}${bill.last_action_date ? `; latest recorded official action ${formatDate(bill.last_action_date)}` : ''}.` : bill.last_action_date ? `Latest recorded official action ${formatDate(bill.last_action_date)}; synchronization timestamp unavailable.` : 'Official record available; synchronization timestamp pending.'}
        title={`${bill.bill_identifier} sources, status methodology and verification`}
      /> : null}

      {item && sections.length ? <section className="scroll-mt-24 rounded-xl border-2 border-primary/30 bg-primary/5 p-6" id="explanation">
        <div className="flex items-center gap-3"><Info className="h-6 w-6 text-primary"/><h2 className="text-2xl font-bold">KeepTXRed explanation</h2></div>
        <p className="mt-2 text-sm text-muted-foreground">This reviewed explanation is separate from the official bill record and is provided for general information, not legal advice.</p>
        <div className="mt-6 space-y-6">
          {sections.map(([label, value]) => <div key={label}><h3 className="font-bold">{label}</h3><p className="mt-2 whitespace-pre-line leading-7">{value}</p></div>)}
        </div>
        {(item.source_notes || (item.source_urls?.length ?? 0) > 0) && <div className="mt-6 border-t pt-4"><h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Editorial sources and review notes</h3>{item.source_notes && <p className="mt-2 text-sm text-muted-foreground">{item.source_notes}</p>}<div className="mt-3 flex flex-wrap gap-3">{(item.source_urls ?? []).map((url, index) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Editorial source {index + 1}<ExternalLink className="h-3.5 w-3.5"/></a>)}</div></div>}
        {item.reviewed_at && <p className="mt-4 text-xs text-muted-foreground">Editorial explanation reviewed {new Date(item.reviewed_at).toLocaleDateString('en-US')}.</p>}
      </section> : null}
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
}
