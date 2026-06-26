import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-secondary text-secondary-foreground border-b-4 border-primary">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">★ {eyebrow}</span>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight mt-3">
          {title}
          {highlight ? (
            <>
              <br />
              <span className="text-primary">{highlight}</span>
            </>
          ) : null}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">{description}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-2 border-foreground/10 bg-card p-6 md:p-7">
      <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-3">{title}</h2>
      <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}