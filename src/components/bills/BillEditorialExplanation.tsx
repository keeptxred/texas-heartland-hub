import { useEffect, useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { getBillEditorialEnrichment, type BillEditorialEnrichment } from '@/lib/bills';

type Editorial = BillEditorialEnrichment;

export function BillEditorialExplanation({ billId }: { billId: string }) {
  const [item, setItem] = useState<Editorial | null>(null);

  useEffect(() => {
    let active = true;
    getBillEditorialEnrichment(billId).then((data) => { if (active) setItem(data); });
    return () => { active = false; };
  }, [billId]);

  if (!item) return null;
  const sections = [
    ['KeepTXRed summary', item.plain_language_summary],
    ['What would change', item.what_changes],
    ['Who may be affected', item.who_is_affected],
    ['When it would take effect', item.effective_date_explanation],
    ['Limits and uncertainty', item.limitations],
  ].filter(([, value]) => Boolean(value));

  if (!sections.length) return null;

  return (
    <section className="scroll-mt-24 rounded-xl border-2 border-primary/30 bg-primary/5 p-6" id="explanation">
      <div className="flex items-center gap-3"><Info className="h-6 w-6 text-primary"/><h2 className="text-2xl font-bold">KeepTXRed explanation</h2></div>
      <p className="mt-2 text-sm text-muted-foreground">This reviewed explanation is separate from the official bill record and is provided for general information, not legal advice.</p>
      <div className="mt-6 space-y-6">
        {sections.map(([label, value]) => <div key={label}><h3 className="font-bold">{label}</h3><p className="mt-2 whitespace-pre-line leading-7">{value}</p></div>)}
      </div>
      {(item.source_notes || (item.source_urls?.length ?? 0) > 0) && <div className="mt-6 border-t pt-4"><h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Sources and review notes</h3>{item.source_notes && <p className="mt-2 text-sm text-muted-foreground">{item.source_notes}</p>}<div className="mt-3 flex flex-wrap gap-3">{(item.source_urls ?? []).map((url, index) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Official source {index + 1}<ExternalLink className="h-3.5 w-3.5"/></a>)}</div></div>}
      {item.reviewed_at && <p className="mt-4 text-xs text-muted-foreground">Editorial explanation reviewed {new Date(item.reviewed_at).toLocaleDateString('en-US')}.</p>}
    </section>
  );
}
