import type { ArticleBill } from '@/lib/article-bills';

export function ArticleBillsSection({ bills }: { bills: ArticleBill[] }) {
  if (!bills.length) return null;

  return (
    <section className="mt-12 border-t-2 border-foreground/10 pt-8" aria-labelledby="verified-bills-heading">
      <h2 id="verified-bills-heading" className="font-display text-2xl md:text-3xl tracking-tight">
        Bills connected to this article
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        These links come from approved article-to-bill relationships in the Keep TX Red legislative database.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {bills.map((bill) => (
          <a key={bill.id} href={bill.href} className="rounded-lg border bg-card p-4 hover:border-primary">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                {bill.bill_identifier}
              </span>
              <span className="rounded-full border px-2.5 py-1 text-xs font-semibold">
                {bill.current_status_label}
              </span>
              {bill.became_law ? (
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-900">Became law</span>
              ) : null}
            </div>
            <h3 className="mt-3 font-semibold leading-snug">{bill.caption}</h3>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary">
              {bill.relationship_type}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
