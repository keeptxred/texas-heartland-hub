import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Info, Landmark, Scale } from 'lucide-react';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';
import { BillEffectiveDates } from '@/components/bills/BillEffectiveDates';
import { supabase } from '@/integrations/supabase/client';
import { getLatestBillFiscalImpact } from '@/lib/bill-fiscal-impact';
import { getBillEditorialEnrichment, type BillEditorialEnrichment } from '@/lib/bills';

type Editorial = BillEditorialEnrichment;
type BillAuthorityRecord = {
  bill_identifier: string;
  current_status_label: string;
  last_action_date: string | null;
  signed_date: string | null;
  effective_date: string | null;
  became_law: boolean;
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
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      getBillEditorialEnrichment(billId),
      db.from('bills').select('bill_identifier,current_status_label,last_action_date,signed_date,effective_date,became_law,source_url,bill_text_url,analysis_url,fiscal_note_url,last_synced_at').eq('id', billId).maybeSingle(),
      db.from('bill_documents').select('*').eq('bill_id', billId).order('document_date', { ascending: false }),
    ]).then(([editorial, billResult, documentResult]) => {
      if (!active) return;
      setItem(editorial);
      if (!billResult.error && billResult.data) setBill(billResult.data as BillAuthorityRecord);
      if (!documentResult.error && documentResult.data) setDocuments(documentResult.data);
    }).catch((error) => console.error(`Bill authority reference failed for ${billId}:`, error));
    return () => { active = false; };
  }, [billId]);

  const fiscalImpact = useMemo(() => getLatestBillFiscalImpact(documents), [documents]);
  const verifiedAgencyContext = fiscalImpact?.verifiedSourceAgencies ?? [];

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

      <BillEffectiveDates billId={billId} />

      {bill ? <section className="scroll-mt-24 rounded-xl border bg-card p-6" id="law-agency-relationships">
        <div className="flex items-center gap-3"><Scale className="h-6 w-6 text-primary"/><h2 className="text-2xl font-bold">Bill → law → agency context</h2></div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">This relationship layer distinguishes what the normalized official record can prove from what it cannot. Enactment and effective dates come from the bill record. Agency names below are shown only when an official fiscal document supplies a verified agency reference; being cited in a fiscal note does not by itself prove that the agency administers the resulting law.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Bill → law status</p>
            <h3 className="mt-2 text-xl font-bold">{bill.became_law ? `${bill.bill_identifier} is recorded as enacted` : `${bill.bill_identifier} is not recorded as enacted`}</h3>
            <dl className="mt-4 space-y-3 text-sm"><RelationshipFact label="Current status" value={bill.current_status_label} />{bill.signed_date ? <RelationshipFact label="Signed" value={formatDate(bill.signed_date)} /> : null}{bill.effective_date ? <RelationshipFact label="Effective" value={formatDate(bill.effective_date)} /> : null}</dl>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold"><a href="/laws" className="text-primary hover:underline">Texas laws reference →</a>{bill.became_law ? <a href="/laws/effective-dates" className="text-primary hover:underline">Effective-date tracker →</a> : null}</div>
          </div>
          <div className="rounded-lg border p-5">
            <div className="flex items-center gap-2"><Landmark className="h-5 w-5 text-primary"/><p className="text-xs font-bold uppercase tracking-wide text-primary">Official fiscal-note agency context</p></div>
            {verifiedAgencyContext.length ? <><p className="mt-3 text-sm leading-6 text-muted-foreground">The latest parsed official fiscal material cites these verified agencies. This is fiscal/source context, not an inferred administration assignment.</p><div className="mt-4 flex flex-wrap gap-2">{verifiedAgencyContext.map((agency) => <a key={agency.slug} href={agency.officialUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border px-3 py-1.5 text-sm font-semibold hover:border-primary">{agency.shortName} ↗</a>)}</div></> : <p className="mt-3 text-sm leading-6 text-muted-foreground">No verified agency references are available from the latest parsed official fiscal material. KeepTXRed does not infer an administering agency from the bill topic or title.</p>}
          </div>
        </div>
      </section> : null}

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

function RelationshipFact({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>;
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
}
