import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { canonicalBillPath, SITE_URL } from '@/lib/bills';
import { getLegislatureBillDirectory } from '@/lib/bill-hierarchy';

const EMPTY_BILLS_SEARCH = { q: '', status: '', legislature: 0, chamber: '', billType: '', page: 1 } as const;
const billTypeLabel = (value: string) => value.toUpperCase();
const chamberLabel = (value: string) => value === 'house' ? 'Texas House' : value === 'senate' ? 'Texas Senate' : 'Joint measures';
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

export const Route = createFileRoute('/bills/texas/$legislature/')({
  loader: async ({ params }) => {
    const legislature = Number(params.legislature);
    const directory = await getLegislatureBillDirectory(legislature);
    if (!directory) throw notFound();
    return directory;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: 'Texas Legislature bills not found | Keep TX Red' }, { name: 'robots', content: 'noindex,follow' }] };
    const { legislature, totalCount, billTypes, lastActionDate } = loaderData;
    const url = `${SITE_URL}/bills/texas/${legislature}`;
    const title = `${legislature}th Texas Legislature Bills | Keep TX Red`;
    const description = `Browse ${totalCount.toLocaleString()} bills from the ${legislature}th Texas Legislature by bill type, chamber, status, session and official legislative history.`;
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: [{
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          url,
          name: `${legislature}th Texas Legislature Bills`,
          description,
          dateModified: lastActionDate || undefined,
          isPartOf: { '@type': 'WebSite', url: `${SITE_URL}/` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: billTypes.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: `${billTypeLabel(item.billType)} bills`,
              url: `${url}/${item.billType}`,
            })),
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Bills', item: `${SITE_URL}/bills` },
              { '@type': 'ListItem', position: 3, name: `${legislature}th Legislature`, item: url },
            ],
          },
        }),
      }],
    };
  },
  component: LegislatureBillHub,
});

function LegislatureBillHub() {
  const { legislature, totalCount, billTypes, recentBills } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/bills" search={EMPTY_BILLS_SEARCH}>Bills</Link> / {legislature}th Legislature
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Texas Legislature</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">{legislature}th Texas Legislature Bills</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Browse {totalCount.toLocaleString()} House, Senate and joint measures from the {legislature}th Legislature. Choose a bill type to move directly into the official bill inventory.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          This directory can include the regular session and called sessions. Every bill card is labeled with its session, such as {legislature}(R), {legislature}(1), or {legislature}(2), so reused bill numbers remain distinguishable.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Browse by bill type</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {billTypes.map((item) => (
            <Link
              key={item.billType}
              to="/bills/texas/$legislature/$billType"
              params={{ legislature: String(legislature), billType: item.billType }}
              search={{ page: 1 }}
              className="rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{chamberLabel(item.chamber)}</p>
              <h3 className="mt-2 text-2xl font-bold">{billTypeLabel(item.billType)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.count.toLocaleString()} measure{item.count === 1 ? '' : 's'}</p>
              <span className="mt-4 inline-block font-semibold text-primary">Browse {billTypeLabel(item.billType)} bills →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Recently updated bills</h2>
            <p className="mt-1 text-sm text-muted-foreground">Direct links into the latest activity from this Legislature, with session identity shown on every bill.</p>
          </div>
          <Link to="/bills" search={{ q: '', status: '', legislature, chamber: '', billType: '', page: 1 }} className="text-sm font-semibold text-primary hover:underline">Search this Legislature →</Link>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {recentBills.map((bill) => (
            <article key={bill.id} className="rounded-xl border bg-card p-5">
              <a href={canonicalBillPath(bill)} className="text-xl font-bold text-primary hover:underline">{bill.bill_identifier}</a>
              <p className="mt-2 font-medium leading-snug">{bill.caption}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground/80">{billSessionLabel(bill.legislature_number, bill.session_code)}</span>
                <span>{chamberLabel(bill.chamber)}</span>
                <span>{bill.current_status_label}</span>
                {bill.last_action_date ? <span>Updated {new Date(`${bill.last_action_date}T12:00:00`).toLocaleDateString()}</span> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
