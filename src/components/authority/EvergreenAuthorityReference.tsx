import { CitationTrustPanel, type CitationSource } from '@/components/authority/CitationTrustPanel';

export type AuthorityInstitution = {
  name: string;
  role: string;
  href: string;
  scopeNote?: string;
};

export type AuthorityQuestion = {
  question: string;
  answer: string;
  href?: string;
  linkLabel?: string;
};

export function EvergreenAuthorityReference({
  eyebrow,
  title,
  summary,
  institutions,
  questions,
  sources,
  methodology,
  lastVerified,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  institutions: AuthorityInstitution[];
  questions: AuthorityQuestion[];
  sources: CitationSource[];
  methodology: string;
  lastVerified: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14" aria-labelledby="evergreen-authority-heading">
      <div className="rounded-2xl border bg-card p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 id="evergreen-authority-heading" className="mt-2 text-3xl font-bold">{title}</h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">{summary}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {institutions.map((institution) => (
            <a key={institution.name} href={institution.href} className="rounded-xl border p-5 transition hover:border-primary">
              <h3 className="font-bold text-foreground">{institution.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{institution.role}</p>
              {institution.scopeNote ? <p className="mt-2 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Scope:</strong> {institution.scopeNote}</p> : null}
              <span className="mt-3 inline-block text-sm font-semibold text-primary">Open reference →</span>
            </a>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold">Questions this reference answers</h3>
          <div className="mt-4 divide-y border-y">
            {questions.map((item) => (
              <details key={item.question} className="py-5">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">{item.answer}</p>
                {item.href && item.linkLabel ? <a href={item.href} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">{item.linkLabel} →</a> : null}
              </details>
            ))}
          </div>
        </div>
      </div>

      <CitationTrustPanel
        className="mt-8"
        sources={sources}
        methodology={methodology}
        lastVerified={lastVerified}
        title={`${title} sources`}
      />
    </section>
  );
}

export default EvergreenAuthorityReference;
