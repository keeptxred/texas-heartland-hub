import { Link } from "@tanstack/react-router";

type FAQ = { q: string; a: React.ReactNode };
type Block = { heading: string; body: React.ReactNode };
type RelatedLink = { to: string; label: string };

/**
 * PageExpansion — modular append-only block for static pages.
 * Implements the global rules:
 *  - 800+ words via concise add-on sections (100–150 words each)
 *  - Reader-question coverage (FAQs)
 *  - Originality block (Texas-specific perspective)
 *  - Auto-linking to related internal pages
 *
 * Cheap to render, no regeneration required.
 */
export function PageExpansion({
  perspectiveTitle = "The Texas Angle",
  perspective,
  blocks,
  faqs,
  summary,
  related,
}: {
  perspectiveTitle?: string;
  perspective: React.ReactNode;
  blocks: Block[];
  faqs: FAQ[];
  summary: React.ReactNode;
  related?: RelatedLink[];
}) {
  return (
    <section className="mt-12 border-t-2 border-foreground/10 pt-10 space-y-8">
      <div className="border-l-4 border-primary bg-muted/30 p-5">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ {perspectiveTitle}</span>
        <div className="mt-2 font-serif text-base leading-relaxed text-foreground">{perspective}</div>
      </div>

      {blocks.map((b) => (
        <div key={b.heading}>
          <h2 className="font-display text-2xl tracking-tight">{b.heading}</h2>
          <div className="mt-2 text-muted-foreground leading-relaxed">{b.body}</div>
        </div>
      ))}

      {faqs.length > 0 && (
        <div>
          <h2 className="font-display text-2xl tracking-tight">Frequently Asked Questions</h2>
          <dl className="mt-3 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-foreground/10 pb-3">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1 text-muted-foreground text-sm leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="bg-muted/40 p-5 border border-border">
        <h2 className="font-display text-xl tracking-tight">Summary</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{summary}</p>
      </div>

      {related && related.length > 0 && (
        <div>
          <h2 className="font-display text-xl tracking-tight">Related Reading</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
            {related.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="text-primary underline">{r.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
