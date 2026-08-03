import { createFileRoute, Link } from '@tanstack/react-router';
import { Search, Landmark, Scale, FileCheck2 } from 'lucide-react';
import { listBills, getBillFilterOptions, SITE_URL, canonicalBillPath } from '@/lib/bills';

export const Route = createFileRoute('/bills/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q.slice(0, 100) : '',
    status: typeof search.status === 'string' ? search.status.slice(0, 60) : '',
    legislature: Math.max(0, Number(search.legislature) || 0),
    chamber: typeof search.chamber === 'string' ? search.chamber.slice(0, 20) : '',
    billType: typeof search.billType === 'string' ? search.billType.slice(0, 20) : '',
    page: Math.max(1, Number(search.page) || 1),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [results, options] = await Promise.all([
      listBills({
        search: deps.q,
        status: deps.status,
        legislature: deps.legislature || undefined,
        chamber: deps.chamber,
        billType: deps.billType,
        limit: 24,
        offset: (deps.page - 1) * 24,
      }),
      getBillFilterOptions(),
    ]);
    return { ...results, options };
  },
  pendingComponent: () => (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Loading Texas bills…</div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-destructive/40 bg-card p-8">
        <h1 className="text-2xl font-bold">Texas bills are temporarily unavailable</h1>
        <p className="mt-3 text-muted-foreground">The bills database could not be loaded in this environment. Refresh the page or open the published site.</p>
        {import.meta.env.DEV ? <pre className="mt-4 overflow-auto rounded bg-muted p-3 text-xs">{error instanceof Error ? error.message : String(error)}</pre> : null}
      </div>
    </div>
  ),
  head: () => ({
    meta: [
      { title: 'Texas Bills and Legislation | KeepTXRed' },
      { name: 'description', content: 'Search and track Texas bills, sponsors, committees, legislative actions, current status, official documents and related Texas news.' },
      { property: 'og:title', content: 'Texas Bills and Legislation | KeepTXRed' },
      { property: 'og:description', content: 'Track Texas legislation by bill number, status, sponsor, committee and subject.' },
      { property: 'og:url', content: `${SITE_URL}/bills` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/bills` }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Texas Bills and Legislation', url: `${SITE_URL}/bills`,
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Bills', item: `${SITE_URL}/bills` },
      ] },
    }) }],
  }),
  component: BillsPage,
});

const statuses = [
  ['filed', 'Filed'], ['in-committee', 'In committee'], ['passed', 'Passed'],
  ['sent-to-governor', 'Sent to governor'], ['signed', 'Signed / law'], ['vetoed', 'Vetoed'],
] as const;

const chamberLabel = (value: string) => value === 'house' ? 'Texas House' : value === 'senate' ? 'Texas Senate' : value === 'joint' ? 'Joint measures' : value;
const billTypeLabel = (value: string) => value.toUpperCase().replace(/([A-Z])([A-Z])/g, '$1$2');

function BillsPage() {
  const { bills, count, options } = Route.useLoaderData();
  const search = Route.useSearch();
  const pages = Math.max(1, Math.ceil(count / 24));
  const hasFilters = Boolean(search.q || search.status || search.legislature || search.chamber || search.billType);
  const preserved = { q: search.q, status: search.status, legislature: search.legislature, chamber: search.chamber, billType: search.billType };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / Bills</nav>
      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Texas Legislature</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">Texas Bills and Legislation</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">Search Texas House and Senate bills, see their current status, sponsors, committee history, official timeline, documents and related reporting.</p>
        <form className="mt-7 space-y-3" action="/bills" method="get">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1"><span className="sr-only">Search Texas bills</span><Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground"/><input name="q" defaultValue={search.q} placeholder="Search HB 1, caption or subject" className="h-12 w-full rounded-md border bg-background pl-10 pr-4"/></label>
            <button className="h-12 rounded-md bg-primary px-6 font-semibold text-primary-foreground">Search bills</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Legislature</span><select name="legislature" defaultValue={search.legislature || ''} className="h-11 w-full rounded-md border bg-background px-3"><option value="">All legislatures</option>{options.legislatures.map((item: any) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Chamber</span><select name="chamber" defaultValue={search.chamber} className="h-11 w-full rounded-md border bg-background px-3"><option value="">All chambers</option>{options.chambers.map((value: string) => <option key={value} value={value}>{chamberLabel(value)}</option>)}</select></label>
            <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bill type</span><select name="billType" defaultValue={search.billType} className="h-11 w-full rounded-md border bg-background px-3"><option value="">All bill types</option>{options.billTypes.map((value: string) => <option key={value} value={value}>{billTypeLabel(value)}</option>)}</select></label>
          </div>
          {search.status && <input type="hidden" name="status" value={search.status} />}
        </form>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Texas legislation resources">
        {[['Current status', 'See where legislation stands now.', Scale], ['Sponsors', 'Connect bills to Texas representatives.', Landmark], ['Official history', 'Review each recorded legislative action.', FileCheck2]].map(([title, text, Icon]: any) => <div key={title} className="rounded-xl border bg-card p-5"><Icon className="h-6 w-6 text-primary"/><h2 className="mt-3 font-bold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>)}
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="text-2xl font-bold">{hasFilters ? 'Matching bills' : 'Recently updated bills'}</h2><p className="text-sm text-muted-foreground">{count.toLocaleString()} bill{count === 1 ? '' : 's'}</p></div>
          <div className="flex flex-wrap gap-2">
            <Link to="/bills" search={{ ...preserved, status: '', page: 1 }} className={`rounded-full border px-3 py-1.5 text-sm ${!search.status ? 'bg-primary text-primary-foreground' : 'bg-background hover:border-primary'}`}>All statuses</Link>
            {statuses.map(([value,label]) => <Link key={value} to="/bills" search={{ ...preserved, status: value, page: 1 }} className={`rounded-full border px-3 py-1.5 text-sm ${search.status === value ? 'bg-primary text-primary-foreground' : 'bg-background hover:border-primary'}`}>{label}</Link>)}
            {hasFilters && <Link to="/bills" search={{ q: '', status: '', legislature: 0, chamber: '', billType: '', page: 1 }} className="rounded-full border border-dashed px-3 py-1.5 text-sm hover:border-primary">Clear filters</Link>}
          </div>
        </div>
        {bills.length ? <div className="mt-6 grid gap-4 lg:grid-cols-2">{bills.map((bill: any) => <article key={bill.id} className="rounded-xl border bg-card p-5 transition hover:border-primary"><div className="flex items-start justify-between gap-4"><div><a href={canonicalBillPath(bill)} className="text-xl font-bold text-primary hover:underline">{bill.bill_identifier}</a><p className="mt-2 font-medium leading-snug">{bill.caption}</p></div><span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold">{bill.current_status_label}</span></div><div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground"><span>{bill.chamber === 'house' ? 'Texas House' : bill.chamber === 'senate' ? 'Texas Senate' : 'Joint'}</span><span>{bill.legislature_number}th Legislature</span><span>{bill.bill_type.toUpperCase()}</span>{bill.last_action_date && <span>Updated {new Date(`${bill.last_action_date}T12:00:00`).toLocaleDateString()}</span>}</div></article>)}</div> : <div className="mt-6 rounded-xl border border-dashed p-10 text-center"><h3 className="font-semibold">No matching bills</h3><p className="mt-2 text-sm text-muted-foreground">Clear one or more filters or try a broader bill number or caption search.</p></div>}
        {pages > 1 && <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Bill results pages">{search.page > 1 ? <Link to="/bills" search={{ ...search, page: search.page - 1 }} className="rounded-md border px-4 py-2">Previous</Link> : <span className="rounded-md border px-4 py-2 opacity-50">Previous</span>}<span className="text-sm">Page {search.page} of {pages}</span>{search.page < pages ? <Link to="/bills" search={{ ...search, page: search.page + 1 }} className="rounded-md border px-4 py-2">Next</Link> : <span className="rounded-md border px-4 py-2 opacity-50">Next</span>}</nav>}
      </section>
    </div>
  );
}
