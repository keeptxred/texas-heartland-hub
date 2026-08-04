import { ArrowRight, ExternalLink } from 'lucide-react';
import type { TexasLifePillarHub, TexasLifePillarHubLink } from './texas-life-pillar-hubs';

function isExternal(href: string) {
  return href.startsWith('https://');
}

export function TexasLifePillarHubPage({ hub }: { hub: TexasLifePillarHub }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Texas Life</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{hub.title}</h1>
        <p className="mt-3 text-xl font-semibold">{hub.prompt}</p>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{hub.description}</p>
      </header>

      <section className="mt-10" aria-labelledby={`${hub.id}-featured-heading`}>
        <h2 id={`${hub.id}-featured-heading`} className="font-display text-3xl">Start here</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {hub.featured.map((resource) => (
            <TexasLifePillarResourceCard key={resource.href} resource={resource} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function TexasLifePillarResourceCard({ resource }: { resource: TexasLifePillarHubLink }) {
  const external = isExternal(resource.href);
  return (
    <a
      href={resource.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group rounded-2xl border bg-card p-6 transition hover:border-primary hover:shadow-sm"
    >
      <h3 className="font-display text-2xl group-hover:text-primary">{resource.title}</h3>
      <p className="mt-3 leading-7 text-muted-foreground">{resource.description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
        {external ? 'Visit official resource' : 'Explore'}
        {external ? <ExternalLink className="size-4" /> : <ArrowRight className="size-4" />}
      </span>
    </a>
  );
}

export function TexasLifePillarNavigation({ hubs }: { hubs: ReadonlyArray<TexasLifePillarHub> }) {
  return (
    <nav aria-label="Texas Life pillars" className="overflow-x-auto">
      <div className="flex min-w-max gap-2 py-2">
        {hubs.map((hub) => (
          <a
            key={hub.id}
            href={`/texas-life/${hub.id}`}
            className="rounded-full border bg-card px-4 py-2 text-sm font-bold transition hover:border-primary hover:text-primary"
          >
            {hub.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
