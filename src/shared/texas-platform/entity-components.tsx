import { Link } from '@tanstack/react-router';
import type { SharedEntity } from './entities';

export function SharedEntityCard({ entity, cta = 'Learn more' }: { entity: SharedEntity; cta?: string }) {
  return (
    <Link to={entity.route} className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{entity.type.replace('-', ' ')}</span>
      <h2 className="mt-3 text-lg font-bold">{entity.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{entity.summary}</p>
      <span className="mt-4 block text-sm font-semibold text-primary group-hover:underline">{cta} →</span>
    </Link>
  );
}

export function SharedEntityHeader({ entity }: { entity: SharedEntity }) {
  return (
    <header className="border-b bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{entity.type.replace('-', ' ')}</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-tight sm:text-5xl">{entity.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{entity.summary}</p>
        {entity.lastReviewed ? <p className="mt-4 text-xs font-semibold text-muted-foreground">Last reviewed {entity.lastReviewed}</p> : null}
      </div>
    </header>
  );
}

export function SharedWhyItMatters({ entity }: { entity: SharedEntity }) {
  if (!entity.whyItMatters) return null;
  return (
    <section className="rounded-xl border bg-card p-6">
      <h2 className="font-display text-3xl">Why it matters</h2>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{entity.whyItMatters}</p>
    </section>
  );
}

export function SharedKeyFacts({ entity }: { entity: SharedEntity }) {
  if (!entity.keyFacts?.length) return null;
  return (
    <section>
      <h2 className="font-display text-3xl">Key facts</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entity.keyFacts.map((fact) => (
          <div key={`${fact.label}-${fact.value}`} className="rounded-xl border bg-card p-5">
            <dt className="text-sm font-semibold text-muted-foreground">{fact.label}</dt>
            <dd className="mt-2 text-lg font-bold">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function SharedOfficialSources({ entity }: { entity: SharedEntity }) {
  if (!entity.officialSources?.length) return null;
  return (
    <section className="rounded-xl border bg-muted/20 p-6">
      <h2 className="font-display text-3xl">Official sources</h2>
      <p className="mt-2 text-sm text-muted-foreground">Verify details and complete official actions through the responsible authority.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {entity.officialSources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="rounded-md border bg-background px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
            {source.label} ↗
          </a>
        ))}
      </div>
    </section>
  );
}

export function SharedRelatedEntities({ entities, title = 'Related resources', cta = 'Learn more' }: { entities: SharedEntity[]; title?: string; cta?: string }) {
  if (!entities.length) return null;
  return (
    <section>
      <h2 className="font-display text-3xl">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => <SharedEntityCard key={entity.id} entity={entity} cta={cta} />)}
      </div>
    </section>
  );
}

export function SharedNextSteps({ entities }: { entities: SharedEntity[] }) {
  return <SharedRelatedEntities entities={entities} title="What to do next" cta="Continue" />;
}

export function SharedEntityDetails({
  entity,
  related = [],
  nextSteps = [],
}: {
  entity: SharedEntity;
  related?: SharedEntity[];
  nextSteps?: SharedEntity[];
}) {
  return (
    <div className="space-y-10">
      <SharedWhyItMatters entity={entity} />
      <SharedKeyFacts entity={entity} />
      <SharedNextSteps entities={nextSteps} />
      <SharedRelatedEntities entities={related} />
      <SharedOfficialSources entity={entity} />
    </div>
  );
}
