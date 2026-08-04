import { Check, Circle, RotateCcw } from 'lucide-react';
import type { TexasLifeChecklistProgress, TexasLifeJourneyProgress } from './texas-life-progress';

export type TexasLifeProgressStep = {
  id: string;
  title: string;
  href?: string;
};

export function TexasLifeJourneyProgressBar({
  title,
  steps,
  progress,
}: {
  title: string;
  steps: TexasLifeProgressStep[];
  progress?: TexasLifeJourneyProgress;
}) {
  const completed = new Set(progress?.completedStepIds ?? []);
  const percent = steps.length ? Math.round((steps.filter((step) => completed.has(step.id)).length / steps.length) * 100) : 0;
  return (
    <section className="rounded-2xl border bg-card p-6" aria-labelledby={`journey-${progress?.journeyId ?? title}`}>
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Your progress</p><h2 id={`journey-${progress?.journeyId ?? title}`} className="mt-2 font-display text-3xl">{title}</h2></div>
        <span className="text-sm font-bold text-primary">{percent}% complete</span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} /></div>
      <ol className="mt-6 space-y-3">
        {steps.map((step) => {
          const done = completed.has(step.id);
          const current = progress?.currentStepId === step.id;
          const content = <><span className={`grid size-7 place-items-center rounded-full border ${done ? 'border-primary bg-primary text-primary-foreground' : current ? 'border-primary text-primary' : 'text-muted-foreground'}`}>{done ? <Check className="size-4" /> : <Circle className="size-3" />}</span><span className={current ? 'font-bold text-primary' : done ? 'font-semibold' : ''}>{step.title}</span></>;
          return <li key={step.id}>{step.href ? <a href={step.href} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted">{content}</a> : <div className="flex items-center gap-3 px-2 py-2">{content}</div>}</li>;
        })}
      </ol>
    </section>
  );
}

export function TexasLifeChecklistProgressCard({
  title,
  itemLabels,
  progress,
  onToggle,
  onReset,
}: {
  title: string;
  itemLabels: Record<string, string>;
  progress?: TexasLifeChecklistProgress;
  onToggle?: (itemId: string) => void;
  onReset?: () => void;
}) {
  const completed = new Set(progress?.completedItemIds ?? []);
  const entries = Object.entries(itemLabels);
  const percent = entries.length ? Math.round((completed.size / entries.length) * 100) : 0;
  return (
    <section className="rounded-2xl border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Checklist</p><h2 className="mt-2 font-display text-3xl">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{completed.size} of {entries.length} complete</p></div>
        {onReset ? <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary"><RotateCcw className="size-4" />Reset</button> : null}
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${percent}%` }} /></div>
      <div className="mt-5 space-y-2">
        {entries.map(([id, label]) => {
          const checked = completed.has(id);
          return <label key={id} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background px-3 py-3 hover:border-primary"><input type="checkbox" checked={checked} onChange={() => onToggle?.(id)} className="size-4 accent-primary" /><span className={checked ? 'text-muted-foreground line-through' : 'font-medium'}>{label}</span></label>;
        })}
      </div>
    </section>
  );
}
