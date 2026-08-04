import type { ReactNode } from 'react';
import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import type { TexasLifePageBlueprint } from './texas-life-page-blueprint';

export function TexasLifePageShell({ blueprint, children }: { blueprint: TexasLifePageBlueprint; children?: ReactNode }) {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{blueprint.pillar}</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{blueprint.title}</h1>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <QuestionCard title="What is it?" body={blueprint.what} />
        <QuestionCard title="Why should I care?" body={blueprint.why} />
        <QuestionCard title="What do I do next?" body={blueprint.next} />
        <QuestionCard title="What else should I know?" body={blueprint.else} />
      </section>

      {children}

      <section className="mt-10 rounded-2xl border bg-card p-6" aria-labelledby="official-source-heading">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="size-5" />
          <h2 id="official-source-heading" className="font-display text-2xl">TexasDefined explains. The official authority decides.</h2>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <h3 className="font-bold">What TexasDefined explains</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{blueprint.trust.explanation}</p>
          </div>
          <div>
            <h3 className="font-bold">What the official authority decides</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{blueprint.trust.authority}</p>
            {blueprint.trust.authorityUrl ? (
              <a className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" href={blueprint.trust.authorityUrl} target="_blank" rel="noreferrer">
                Verify with {blueprint.trust.authorityName ?? 'the official source'} <ExternalLink className="size-4" />
              </a>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">{blueprint.verify}</p>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="next-steps-heading">
        <h2 id="next-steps-heading" className="font-display text-3xl">What should I do next?</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blueprint.nextSteps.map((step) => (
            <a key={step.href} href={step.href} className="group rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm">
              <h3 className="font-display text-2xl group-hover:text-primary">{step.title}</h3>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">Continue <ArrowRight className="size-4" /></span>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}

function QuestionCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
    </section>
  );
}
