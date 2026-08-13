import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnswerSummary, type AnswerFact } from "@/components/answer-summary";
import { ARTICLES, isPublished } from "@/data/articles";
import {
  getLawGuideMeta,
  lawGuideCanonicalPath,
  type LawGuideMeta,
  type LawSource,
} from "@/lib/law-guides";

export function LawQuickAnswer({
  answer,
  facts = [],
  lastVerified,
  sources = [],
}: {
  answer: ReactNode;
  facts?: AnswerFact[];
  lastVerified?: string;
  sources?: LawSource[];
}) {
  return (
    <AnswerSummary
      answer={answer}
      facts={facts}
      lastVerified={lastVerified}
      verificationNote="Checked against the primary authorities linked below."
      sources={sources.map((source) => ({ label: source.label, href: source.url }))}
    />
  );
}

export function LawStatuteCard({ meta }: { meta: LawGuideMeta }) {
  const statutes = meta.statutes ?? [];
  const sources = meta.sources ?? [];
  const verified = meta.status === "verified";

  return (
    <aside className="border-2 border-foreground/10 bg-card p-5" aria-label="Texas law reference details">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl tracking-tight">Texas law reference</h2>
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            verified ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {verified ? "Verified" : meta.status === "legacy" ? "Legacy guide" : "Review required"}
        </span>
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Topic</dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">{meta.topic}</dd>
        </div>
        {meta.lastVerified ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last verified</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">
              <time dateTime={meta.lastVerified}>{meta.lastVerified}</time>
            </dd>
          </div>
        ) : null}
        {meta.effectiveDate ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Effective</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{meta.effectiveDate}</dd>
          </div>
        ) : null}
      </dl>

      {statutes.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Statutes cited</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {statutes.map((statute) => (
              <li key={statute}>{statute}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {sources.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Primary authorities</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {sources.map((source) => (
              <li key={`${source.label}-${source.url}`}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-4 hover:no-underline"
                >
                  {source.label} ↗
                </a>
                {source.primary ? (
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Primary</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {meta.reviewNote ? <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{meta.reviewNote}</p> : null}
    </aside>
  );
}

export function LawDisclaimer() {
  return (
    <aside className="border-l-4 border-foreground/20 bg-secondary/20 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      <strong className="text-foreground">Legal information, not legal advice.</strong>{" "}
      Keep TX Red explains Texas law for general informational purposes. Laws, court decisions, agency rules,
      local ordinances, and individual facts can change the result. Use the linked primary authorities and consult
      a qualified Texas attorney when you need advice about a specific legal matter.
    </aside>
  );
}

export function RelatedLawGuides({ slugs }: { slugs: string[] }) {
  const guides = slugs
    .map((slug) => ARTICLES.find((article) => article.slug === slug))
    .filter((article) => Boolean(article) && isPublished(article!));

  if (guides.length === 0) return null;

  return (
    <section aria-labelledby="related-law-guides-heading" className="border-t border-border pt-6">
      <h2 id="related-law-guides-heading" className="font-display text-2xl tracking-tight">
        Related Texas law guides
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guides.map((article) => {
          const meta = getLawGuideMeta(article!.slug);
          const href = meta ? lawGuideCanonicalPath(article!.slug) : `/news/${article!.slug}`;
          return (
            <Link
              key={article!.slug}
              to={href}
              className="block border border-border bg-card p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold leading-snug text-foreground">{article!.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{article!.dek}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
