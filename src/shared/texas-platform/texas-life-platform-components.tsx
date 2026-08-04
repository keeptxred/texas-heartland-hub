import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import type { TexasLifeDecisionNode, TexasLifePageStandard, TexasLifePillar, TexasLifeTrustStatement } from './texas-life-platform';

export function TexasLifePillarCards({ pillars }: { pillars: ReadonlyArray<TexasLifePillar> }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {pillars.map((pillar) => (
        <section key={pillar.id} className="rounded-2xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{pillar.prompt}</p>
          <h2 className="mt-2 font-display text-3xl">{pillar.title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{pillar.description}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {pillar.examples.slice(0, 5).map((example) => <li key={example}>• {example}</li>)}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function TexasLifePageChecklist({ standards }: { standards: ReadonlyArray<TexasLifePageStandard> }) {
  return (
    <section className="rounded-2xl border bg-card p-6" aria-labelledby="page-standard-title">
      <h2 id="page-standard-title" className="font-display text-3xl">Every useful page should answer</h2>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {standards.map((standard, index) => (
          <li key={standard.id} className="rounded-xl border bg-background p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Question {index + 1}</p>
            <h3 className="mt-1 font-semibold">{standard.question}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{standard.purpose}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TexasLifeTrustBox({ statement }: { statement: TexasLifeTrustStatement }) {
  return (
    <aside className="rounded-2xl border bg-muted/30 p-6" aria-label="Explanation and official authority">
      <div className="flex items-center gap-2 text-primary"><ShieldCheck className="size-5" /><span className="text-xs font-bold uppercase tracking-[0.16em]">Know who decides</span></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">What TexasDefined explains</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{statement.explanation}</p>
        </div>
        <div>
          <h3 className="font-semibold">What the official authority decides</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{statement.authority}</p>
          {statement.authorityUrl ? (
            <a href={statement.authorityUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              Verify with {statement.authorityName ?? 'the official source'} <ExternalLink className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export function TexasLifeDecisionPath({ nodes }: { nodes: ReadonlyArray<TexasLifeDecisionNode> }) {
  return (
    <nav aria-label="Recommended next steps" className="overflow-x-auto pb-2">
      <ol className="flex min-w-max items-center gap-2">
        {nodes.map((node, index) => (
          <li key={node.id} className="flex items-center gap-2">
            <a href={node.href} className="rounded-full border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">{node.title}</a>
            {index < nodes.length - 1 ? <ArrowRight className="size-4 text-muted-foreground" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
