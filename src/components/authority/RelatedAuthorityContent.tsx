import type { RelatedAuthorityItem } from '@/lib/authority-relationships';

export function RelatedAuthorityContent({ items, title = 'Related content' }: { items: RelatedAuthorityItem[]; title?: string }) {
  if (!items.length) return null;
  return <section className="rounded-xl border bg-card p-6" aria-labelledby="related-authority-heading">
    <h2 id="related-authority-heading" className="text-2xl font-bold">{title}</h2>
    <p className="mt-2 text-sm text-muted-foreground">Ranked by official relationships such as sponsorship, committee referral, district, election, session, and direct news coverage.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {items.map((item) => <a key={`${item.type}-${item.key}-${item.relationship}`} href={item.href} className="rounded-lg border p-4 transition hover:border-primary">
        <div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wide text-primary">{item.type}</span><span className="text-xs text-muted-foreground">Score {item.score}</span></div>
        <h3 className="mt-2 font-bold leading-snug capitalize">{item.title}</h3>{item.description ? <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.description}</p> : null}
        <p className="mt-3 text-xs font-semibold text-muted-foreground">{item.relationship.replaceAll('-', ' ')}</p>
      </a>)}
    </div>
  </section>;
}
