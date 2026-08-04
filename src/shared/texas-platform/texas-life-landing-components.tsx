import { ArrowRight } from 'lucide-react';
import { TEXAS_LIFE_PILLARS, TEXAS_LIFE_PLATFORM_VISION, TEXAS_LIFE_VISION } from './texas-life-platform';
import { TEXASDEFINED_LANDING_SECTIONS } from './texas-life-landing';

export function TexasLifeHero() {
  return (
    <section className="rounded-2xl border bg-card p-7 sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The Texas Life Platform</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl tracking-tight sm:text-6xl">Live Texas with confidence.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{TEXAS_LIFE_VISION}</p>
      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{TEXAS_LIFE_PLATFORM_VISION}</p>
    </section>
  );
}

export function TexasLifePillarHub() {
  return (
    <section aria-labelledby="texas-life-pillars-title">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start with what you need</p>
        <h2 id="texas-life-pillars-title" className="mt-2 font-display text-4xl">How can TexasDefined help?</h2>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {TEXASDEFINED_LANDING_SECTIONS.map((section) => {
          const pillar = TEXAS_LIFE_PILLARS.find((item) => item.id === section.pillar);
          return (
            <article key={section.pillar} className="rounded-2xl border bg-card p-6">
              <p className="text-sm font-bold text-primary">{pillar?.prompt}</p>
              <h3 className="mt-2 font-display text-3xl">{section.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{section.description}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {section.links.map((link) => (
                  <a key={link.href} href={link.href} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary">
                    {link.label}<ArrowRight className="size-4" />
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
