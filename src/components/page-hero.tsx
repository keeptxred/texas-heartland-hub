import type { ReactNode } from "react";
import {
  AnswerSummary,
  type AnswerFact,
  type AnswerSource,
} from "@/components/answer-summary";

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  answer,
  facts,
  lastVerified,
  verificationNote,
  sources,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  answer?: ReactNode;
  facts?: AnswerFact[];
  lastVerified?: string;
  verificationNote?: ReactNode;
  sources?: AnswerSource[];
  children?: ReactNode;
}) {
  const hasAnswerSummary = answer != null;

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
          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/90 leading-relaxed">{description}</p>
        ) : null}
        {hasAnswerSummary ? (
          <div className="mt-8 rounded-sm bg-background p-4 text-foreground md:p-6">
            <AnswerSummary
              answer={answer}
              facts={facts}
              lastVerified={lastVerified}
              verificationNote={verificationNote}
              sources={sources}
            />
          </div>
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
