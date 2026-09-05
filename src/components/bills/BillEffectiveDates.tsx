import { useEffect, useState } from 'react';
import { CalendarDays, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type EffectiveDateProvision = {
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

export function BillEffectiveDates({ billId }: { billId: string }) {
  const [rows, setRows] = useState<EffectiveDateProvision[]>([]);

  useEffect(() => {
    let active = true;
    db.from('bill_effective_date_provisions')
      .select('id,sequence,provision_scope,effect_kind,effective_date,condition_text,condition_status,source_url,source_note')
      .eq('bill_id', billId)
      .order('sequence', { ascending: true })
      .then(({ data, error }: any) => {
        if (!active) return;
        if (error) {
          console.error(`Structured effective dates failed for bill ${billId}:`, error.message ?? error);
          return;
        }
        setRows((data ?? []) as EffectiveDateProvision[]);
      })
      .catch((error: any) => console.error(`Structured effective dates threw for bill ${billId}:`, error?.message ?? error));
    return () => { active = false; };
  }, [billId]);

  if (!rows.length) return null;

  return (
    <section className="scroll-mt-24 rounded-xl border bg-card p-6" id="effective-dates">
      <div className="flex items-center gap-3"><CalendarDays className="h-6 w-6 text-primary"/><h2 className="text-2xl font-bold">Effective-date schedule</h2></div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Texas bills can take effect in stages or depend on a separate constitutional or federal condition. These entries preserve the official provision-level schedule instead of forcing the bill into one date.</p>
      <div className="mt-5 space-y-4">
        {rows.map((row) => (
          <article key={row.id} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{effectLabel(row.effect_kind)}</p>
                <h3 className="mt-1 font-bold">{row.provision_scope}</h3>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{row.effect_kind === 'no_effect' ? 'No effect' : row.effective_date ? formatDate(row.effective_date) : 'Date tied to condition'}</span>
            </div>
            {row.condition_text ? <p className="mt-3 text-sm leading-6"><strong>Condition:</strong> {row.condition_text}</p> : null}
            {row.condition_status !== 'not_applicable' ? <p className="mt-2 text-sm"><strong>Condition status:</strong> {conditionLabel(row.condition_status)}</p> : null}
            {row.source_note ? <p className="mt-2 text-sm text-muted-foreground">{row.source_note}</p> : null}
            <a href={row.source_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Official effective-date source <ExternalLink className="h-3.5 w-3.5"/></a>
          </article>
        ))}
      </div>
    </section>
  );
}

function effectLabel(kind: EffectiveDateProvision['effect_kind']) {
  if (kind === 'conditional') return 'Conditional provision';
  if (kind === 'no_effect') return 'No-effect provision';
  return 'Effective provision';
}

function conditionLabel(status: EffectiveDateProvision['condition_status']) {
  if (status === 'satisfied') return 'Satisfied';
  if (status === 'failed') return 'Failed';
  if (status === 'pending') return 'Not yet satisfied';
  return 'Status not yet verified';
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
