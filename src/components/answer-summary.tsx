import type { ReactNode } from "react";

export type AnswerSource = {
  label: string;
  href: string;
};

export type AnswerFact = {
  label: string;
  value: ReactNode;
};

function isSafeSourceUrl(value: string): boolean {
  try {
    const url = new URL(value, "https://keeptxred.com");
    return url.protocol === "https:" || (url.protocol === "http:" && url.hostname === "localhost");
  } catch {
    return value.startsWith("/");
  }
}

export function DirectAnswer({
  children,
  heading = "The answer",
}: {
  children: ReactNode;
  heading?: string;
}) {
  return (
    <section aria-labelledby="direct-answer-heading" className="border-l-4 border-primary bg-primary/5 px-5 py-4">
      <h2 id="direct-answer-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {heading}
      </h2>
      <div className="mt-2 max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
        {children}
      </div>
    </section>
  );
}

export function AtAGlance({
  facts,
  heading = "At a glance",
}: {
  facts: AnswerFact[];
  heading?: string;
}) {
  const usableFacts = facts.filter((fact) => fact.label.trim().length > 0 && fact.value != null);
  if (usableFacts.length === 0) return null;

  return (
    <section aria-labelledby="at-a-glance-heading" className="border border-border bg-card p-5">
      <h2 id="at-a-glance-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {heading}
      </h2>
      <dl className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {usableFacts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{fact.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function VerificationNote({
  date,
  label = "Last verified",
  children,
}: {
  date: string;
  label?: string;
  children?: ReactNode;
}) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  const iso = parsed.toISOString();
  const display = parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  });

  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      <strong className="font-semibold text-foreground">{label}:</strong>{" "}
      <time dateTime={iso}>{display}</time>
      {children ? <> · {children}</> : null}
    </p>
  );
}

export function AnswerSources({
  sources,
  heading = "Primary sources",
}: {
  sources: AnswerSource[];
  heading?: string;
}) {
  const usableSources = sources.filter(
    (source) => source.label.trim().length > 0 && isSafeSourceUrl(source.href),
  );
  if (usableSources.length === 0) return null;

  return (
    <section aria-labelledby="answer-sources-heading">
      <h2 id="answer-sources-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        {heading}
      </h2>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {usableSources.map((source) => {
          const external = /^https?:\/\//i.test(source.href);
          return (
            <li key={`${source.label}-${source.href}`}>
              <a
                href={source.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="font-semibold text-primary underline underline-offset-4 hover:no-underline"
              >
                {source.label}{external ? " ↗" : ""}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function AnswerSummary({
  answer,
  facts = [],
  lastVerified,
  verificationNote,
  sources = [],
}: {
  answer: ReactNode;
  facts?: AnswerFact[];
  lastVerified?: string;
  verificationNote?: ReactNode;
  sources?: AnswerSource[];
}) {
  return (
    <div className="space-y-4" data-aeo-answer-summary>
      <DirectAnswer>{answer}</DirectAnswer>
      <AtAGlance facts={facts} />
      {lastVerified ? <VerificationNote date={lastVerified}>{verificationNote}</VerificationNote> : null}
      <AnswerSources sources={sources} />
    </div>
  );
}
