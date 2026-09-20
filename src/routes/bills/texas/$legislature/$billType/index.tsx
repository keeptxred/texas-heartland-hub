import { createFileRoute, Link, notFound, stripSearchParams } from '@tanstack/react-router';
import { canonicalBillPath, SITE_URL } from '@/lib/bills';
import { getBillTypePage } from '@/lib/bill-hierarchy';

const EMPTY_BILLS_SEARCH = { q: '', status: '', legislature: 0, chamber: '', billType: '', page: 1 } as const;
const DEFAULT_SEARCH = { page: 1 } as const;
const label = (value: string) => value.toUpperCase();
const billSessionLabel = (legislature: number, sessionCode?: string | null) => {
  const code = String(sessionCode || 'R').trim().toUpperCase() || 'R';
  if (code === 'R') return `${legislature}(R) · Regular Session`;
  if (/^\d+$/.test(code)) {
    const number = Number(code);
    const suffix = number % 100 >= 11 && number % 100 <= 13 ? 'th' : number % 10 === 1 ? 'st' : number % 10 === 2 ? 'nd' : number % 10 === 3 ? 'rd' : 'th';
    return `${legislature}(${code}) · ${number}${suffix} Called Session`;
  }
  return `${legislature}(${code}) · Session ${code}`;
};

function paginationPages(current: number, total: number): number[] {
  return [...new Set([1, current - 2, current - 1, current, current + 1, current + 2, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
}

export const Route = createFileRoute('/bills/texas/$legislature/$billType/')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Math.max(1, Number(search.page) || 1),
  }),
  search: {
    middlewares: [stripSearchParams(DEFAULT_SEARCH)],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const legislature = Number(params.legislature);
    const result = await getBillTypePage(legislature, params.billType, deps.page);
    if (!result || result.page > result.pages) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: 'Texas bills not found | Keep TX Red' }, { name: 'robots', content: 'noindex,follow' }] };
    const { legislature, billType, page, count } = loaderData;
    const baseUrl = `${SITE_URL}/bills/texas/${legislature}/${billType}`;
    const canonical = page > 1 ? `${baseUrl}?page=${page}` : baseUrl;
    const title = `${label(billType)} Bills — ${legislature}th Texas Legislature${page > 1 ? ` — Page ${page}` : ''} | Keep TX Red`;
    const description = `Browse ${count.toLocaleString()} ${label(billType)} measures from the ${legislature}th Texas Legislature with status, captions, session identity, legislative activity and official bill history.`;
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
      ],
      links: [{ rel: 'canonical', href: canonical }],
      scripts: [{
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: `${label(billType)} Bills — ${legislature}th Texas Legislature${page > 1 ? ` — Page ${page}` : ''}`,
          description,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Bills', item: `${SITE_URL}/bills` },
              { '@type': 'ListItem', position: 3, name: `${legislature}th Legislature`, item: `${SITE_URL}/bills/texas/${legislature}` },
              { '@type': 'ListItem', position: 4, name: `${label(billType)} bills`, item: baseUrl },
            ],
          },
        }),
      }],
    };
  },
  component: BillTypeHub,
});

function BillTypeHub() {
  const { legislature, billType, bills, count, page, pages } = Route.useLoaderData();
  const visiblePages = paginationPages(page, pages);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/bills" search={EMPTY_BILLS_SEARCH}>Bills</Link> /{' '}
        <Link to="/bills/texas/$legislature" params={{ legislature: String(legislature) }}>{legislature}th Legislature</Link> / {label(billType)}
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{legislature}th Texas Legislature</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{label(billType)} Bills</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          {count.toLocaleString()} {label(billType)} measure{count === 1 ? '' : 's'} in the {legislature}th Legislature. Open any bill for sponsors, status, committee history, actions and official documents.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Regular-session and called-session measures can reuse the same bill number. Session labels are shown on every result so {legislature}(R), {legislature}(1), and {legislature}(2) remain distinct.
        </p>
      </header>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{label(billType)} bill directory</h2>
            <p className="mt-1 text-sm text-muted-foreground">Page {page} of {pages}</p>
          </div>
          <Link to="/bills/texas/$legislature" params={{ legislature: String(legislature) }} className="text-sm font-semibold text-primary hover:underline">All bill types →</Link>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {bills.map((bill) => (
            <article key={bill.id} className="rounded-xl border bg-card p-5 transition hover:border-primary">
              <a href={canonicalBillPath(bill)} className="text-xl font-bold text-primary hover:underline">{bill.bill_identifier}</a>
              <p className="mt-2 font-medium leading-snug">{bill.caption}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground/80">{billSessionLabel(bill.legislature_number, bill.session_code)}</span>
                <span>{bill.current_status_label}</span>
                {bill.last_action_date ? <span>Updated {new Date(`${bill.last_action_date}T12:00:00`).toLocaleDateString()}</span> : null}
              </div>
            </article>
          ))}
        </div>

        {pages > 1 ? (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label={`${label(billType)} bill pages`}>
            {page > 1 ? (
              <Link
                to="/bills/texas/$legislature/$billType"
                params={{ legislature: String(legislature), billType }}
                search={{ page: page - 1 }}
                className="rounded-md border px-4 py-2"
              >Previous</Link>
            ) : <span className="rounded-md border px-4 py-2 opacity-50">Previous</span>}
            {visiblePages.map((target, index) => {
              const previousTarget = visiblePages[index - 1];
              return (
                <span key={target} className="contents">
                  {previousTarget && target - previousTarget > 1 ? <span aria-hidden="true" className="px-1 text-muted-foreground">…</span> : null}
                  {target === page ? (
                    <span aria-current="page" className="rounded-md border border-primary bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{target}</span>
                  ) : (
                    <Link
                      to="/bills/texas/$legislature/$billType"
                      params={{ legislature: String(legislature), billType }}
                      search={{ page: target }}
                      aria-label={`Page ${target}`}
                      className="rounded-md border px-3 py-2 text-sm hover:border-primary"
                    >{target}</Link>
                  )}
                </span>
              );
            })}
            {page < pages ? (
              <Link
                to="/bills/texas/$legislature/$billType"
                params={{ legislature: String(legislature), billType }}
                search={{ page: page + 1 }}
                className="rounded-md border px-4 py-2"
              >Next</Link>
            ) : <span className="rounded-md border px-4 py-2 opacity-50">Next</span>}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
