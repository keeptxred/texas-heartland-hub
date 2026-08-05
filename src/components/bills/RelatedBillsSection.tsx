import type { RelatedBill } from '@/lib/related-bills';

export function RelatedBillsSection({ bills }: { bills: readonly RelatedBill[] }) {
  if (!bills.length) return null;

  return (
    <section className="scroll-mt-24 rounded-xl border bg-card p-6" id="related-bills">
      <h2 className="text-2xl font-bold">Related bills</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        These bills share verified subjects or sponsors with this measure. They are not matched from title wording alone.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {bills.map((bill) => (
          <a key={bill.id} href={bill.href} className="rounded-lg border p-4 hover:border-primary">
            <div className="flex flex-wrap items-center gap-2">
              <strong>{bill.bill_identifier}</strong>
              {bill.became_law ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-900">
                  Became law
                </span>
              ) : null}
            </div>
            <p className="mt-2 line-clamp-3 text-sm">{bill.caption}</p>
            <p className="mt-3 text-xs text-muted-foreground">{bill.current_status_label}</p>
            <p className="mt-2 text-xs font-semibold text-primary">
              {bill.relationshipReasons.join(' · ')}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
