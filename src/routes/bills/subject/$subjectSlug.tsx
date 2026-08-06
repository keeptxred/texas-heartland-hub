import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { canonicalBillPath, SITE_URL } from '@/lib/bills';
import {
  getBillSubjectBySlug,
  getBillsForSubject,
  type BillSubjectBill,
} from '@/lib/bill-subjects';

const EMPTY_BILLS_SEARCH = {
  q: '',
  status: '',
  legislature: 0,
  chamber: '',
  billType: '',
  page: 1,
} as const;

type SubjectSearch = {
  legislature: number;
  status: string;
  law: boolean;
};

const DEFAULT_SUBJECT_SEARCH: SubjectSearch = {
  legislature: 0,
  status: '',
  law: false,
};

function normalizeSubjectSearch(search: Record<string, unknown>): SubjectSearch {
  const legislature = Number(search.legislature);
  return {
    legislature: Number.isInteger(legislature) && legislature > 0 ? legislature : 0,
    status: typeof search.status === 'string' ? search.status.trim() : '',
    law: search.law === true || search.law === 'true' || search.law === '1',
  };
}

const formatDate = (value?: string | null) => value
  ? new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  : null;

export const Route = createFileRoute('/bills/subject/$subjectSlug')({
  validateSearch: normalizeSubjectSearch,
  loader: async ({ params }) => {
    const subject = await getBillSubjectBySlug(params.subjectSlug);
    if (!subject) throw notFound();
    const bills = await getBillsForSubject(subject.id);
    return { subject, bills };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { subject, bills } = loaderData;
    const canonical = `${SITE_URL}/bills/subject/${subject.slug}`;
    const description = `Track ${bills.length} active Texas bills classified under ${subject.name}, with current status and official legislative records.`;
    const meta = [
      { title: `${subject.name} Texas Bills | KeepTXRed` },
      { name: 'description', content: description },
      { property: 'og:title', content: `${subject.name} Texas Bills | KeepTXRed` },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
    ];

    if (bills.length === 0) {
      meta.push({ name: 'robots', content: 'noindex,follow' });
    }

    return {
      meta,
      links: [{ rel: 'canonical', href: canonical }],
      scripts: [{
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              '@id': `${canonical}#collection`,
              url: canonical,
              name: `${subject.name} Texas Bills`,
              description,
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: bills.length,
                itemListElement: bills.map((bill, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: `${bill.bill_identifier}: ${bill.caption}`,
                  url: `${SITE_URL}${canonicalBillPath(bill)}`,
                })),
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Texas Bills', item: `${SITE_URL}/bills` },
                { '@type': 'ListItem', position: 3, name: subject.name, item: canonical },
              ],
            },
          ],
        }).replace(/</g, '\\u003c'),
      }],
    };
  },
  component: BillSubjectPage,
});

function BillSubjectPage() {
  const loaderData = Route.useLoaderData() as { subject: { name: string; slug: string }; bills: BillSubjectBill[] };
  const subject = loaderData.subject;
  const bills: BillSubjectBill[] = loaderData.bills;
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const legislatures: number[] = Array.from(new Set(bills.map((bill) => bill.legislature_number))).sort((a, b) => b - a);
  const statuses: string[] = Array.from(
    new Set(bills.map((bill) => bill.current_status_label).filter((label): label is string => Boolean(label))),
  ).sort();
  const filteredBills = bills.filter((bill: BillSubjectBill) => {
    if (search.legislature && bill.legislature_number !== search.legislature) return false;
    if (search.status && bill.current_status_label !== search.status) return false;
    if (search.law && !bill.became_law) return false;
    return true;
  });
  const latestActivity = filteredBills.find((bill: BillSubjectBill) => bill.last_action_date);
  const hasFilters = search.legislature > 0 || Boolean(search.status) || search.law;

  const updateSearch = (patch: Partial<SubjectSearch>) => {
    void navigate({
      search: (previous: SubjectSearch) => ({ ...previous, ...patch }),
      replace: true,
      resetScroll: false,
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/bills" search={EMPTY_BILLS_SEARCH}>Texas Bills</Link> / {subject.name}
      </nav>

      <header className="mt-6 rounded-2xl border bg-card p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">Texas legislation subject</p>
        <h1 className="mt-2 text-4xl font-bold">{subject.name}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{bills.length} active bill{bills.length === 1 ? '' : 's'} currently classified under this verified legislative subject.</p>
        {latestActivity ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Latest activity: <a href={latestActivity.href} className="font-semibold text-foreground hover:text-primary hover:underline">{latestActivity.bill_identifier}</a>
            {latestActivity.last_action_date ? ` on ${formatDate(latestActivity.last_action_date)}` : ''}.
          </p>
        ) : null}
      </header>

      {bills.length ? (
        <section className="mt-8 rounded-xl border bg-card p-5" aria-labelledby="subject-filters-heading">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <h2 id="subject-filters-heading" className="text-lg font-bold">Filter this subject</h2>
              <p className="mt-1 text-sm text-muted-foreground">Narrow the verified bill relationships without leaving this topic page.</p>
            </div>
            <label className="ml-auto grid gap-1 text-sm font-medium">
              Legislature
              <select
                value={search.legislature}
                onChange={(event) => updateSearch({ legislature: Number(event.target.value) })}
                className="min-w-40 rounded-md border bg-background px-3 py-2"
              >
                <option value={0}>All legislatures</option>
                {legislatures.map((legislature) => <option key={legislature} value={legislature}>{legislature}th Legislature</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Status
              <select
                value={search.status}
                onChange={(event) => updateSearch({ status: event.target.value })}
                className="min-w-48 rounded-md border bg-background px-3 py-2"
              >
                <option value="">All statuses</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label className="flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium">
              <input type="checkbox" checked={search.law} onChange={(event) => updateSearch({ law: event.target.checked })} />
              Became law
            </label>
            {hasFilters ? (
              <button type="button" onClick={() => updateSearch(DEFAULT_SUBJECT_SEARCH)} className="min-h-10 rounded-md border px-3 py-2 text-sm font-semibold hover:border-primary">
                Clear filters
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mt-8 rounded-xl border bg-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Bills in this subject</h2>
            <p className="mt-1 text-sm text-muted-foreground">Showing {filteredBills.length} of {bills.length} verified bill relationship{bills.length === 1 ? '' : 's'}.</p>
          </div>
        </div>
        {filteredBills.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {filteredBills.map((bill: BillSubjectBill) => (
              <a key={bill.id} href={bill.href} className="rounded-lg border p-5 hover:border-primary">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{bill.bill_identifier}</strong>
                  <span className="rounded-full border px-2 py-0.5 text-xs font-semibold">{bill.legislature_number}th</span>
                  {bill.became_law ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-900">Became law</span> : null}
                </div>
                <p className="mt-2 leading-6">{bill.caption}</p>
                <p className="mt-3 text-sm text-muted-foreground">{bill.current_status_label}</p>
                {bill.last_action_date ? <p className="mt-1 text-xs text-muted-foreground">Last activity {formatDate(bill.last_action_date)}</p> : null}
              </a>
            ))}
          </div>
        ) : bills.length ? (
          <div className="mt-5 rounded-lg border border-dashed p-6">
            <p className="font-semibold">No bills match these filters.</p>
            <p className="mt-1 text-sm text-muted-foreground">Clear one or more filters to see the full verified subject collection.</p>
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">No active bills are currently connected to this subject.</p>
        )}
      </section>
    </main>
  );
}
