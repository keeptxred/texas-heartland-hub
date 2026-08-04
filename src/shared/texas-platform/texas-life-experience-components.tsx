import { ArrowRight, Building2, CheckCircle2, Clock3, ExternalLink, Sparkles } from 'lucide-react';
import type {
  TexasLifeAction,
  TexasLifeChange,
  TexasLifeOfficialResource,
} from './texas-life-experience';

export function TexasLifeActionCards({ actions }: { actions: ReadonlyArray<TexasLifeAction> }) {
  return (
    <section aria-labelledby="texas-life-actions-title">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-primary" />
        <h2 id="texas-life-actions-title" className="font-display text-3xl">What to do next</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <a key={action.id} href={action.href} className="group rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm">
            <h3 className="font-display text-2xl group-hover:text-primary">{action.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
              {action.estimatedMinutes ? <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{action.estimatedMinutes} min</span> : null}
              <span className="capitalize">{action.difficulty}</span>
              {action.officialAction ? <span>Official action</span> : null}
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">Continue <ArrowRight className="size-4" /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function TexasLifeOfficialResourceCard({ resource }: { resource: TexasLifeOfficialResource }) {
  return (
    <aside className="rounded-2xl border bg-card p-6" aria-labelledby="official-resource-title">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-primary"><Building2 className="size-6" /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Official resource</p>
          <h2 id="official-resource-title" className="mt-1 font-display text-3xl">{resource.agencyName}</h2>
          <p className="mt-2 text-muted-foreground">{resource.purpose}</p>
        </div>
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        {resource.phone ? <div><dt className="font-bold">Phone</dt><dd className="text-muted-foreground">{resource.phone}</dd></div> : null}
        {resource.hours ? <div><dt className="font-bold">Hours</dt><dd className="text-muted-foreground">{resource.hours}</dd></div> : null}
        {resource.fees ? <div><dt className="font-bold">Fees</dt><dd className="text-muted-foreground">{resource.fees}</dd></div> : null}
      </dl>
      <a href={resource.officialUrl} rel="noopener noreferrer" target="_blank" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
        Visit official website <ExternalLink className="size-4" />
      </a>
      {[...(resource.forms ?? []), ...(resource.onlineServices ?? [])].length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {[...(resource.forms ?? []), ...(resource.onlineServices ?? [])].map((link) => (
            <a key={link.href} href={link.href} rel="noopener noreferrer" target="_blank" className="rounded-full border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary">{link.label}</a>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

export function TexasLifeRecentChanges({ changes }: { changes: ReadonlyArray<TexasLifeChange> }) {
  if (!changes.length) return null;
  return (
    <section aria-labelledby="recent-changes-title" className="rounded-2xl border bg-muted/30 p-6">
      <h2 id="recent-changes-title" className="font-display text-3xl">What changed</h2>
      <div className="mt-5 space-y-4">
        {changes.map((change) => (
          <article key={change.id} className="rounded-xl border bg-background p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 text-primary" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{change.title}</h3>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">{change.type}</span>
                  {change.effectiveDate ? <span className="text-xs text-muted-foreground">Effective {change.effectiveDate}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{change.summary}</p>
                <a href={change.sourceUrl} rel="noopener noreferrer" target="_blank" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary">Verify with the official source <ExternalLink className="size-3.5" /></a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
