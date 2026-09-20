import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { SITE_URL } from '@/lib/bills';
import { publicBillPath } from '@/lib/bill-public-path';
import { getRelatedAuthorityContent } from '@/lib/authority-relationships';
import { RelatedAuthorityContent } from '@/components/authority/RelatedAuthorityContent';

const db = supabase as any;

const hasCanonicalBillFields = (bill: any) =>
  bill &&
  Number.isFinite(Number(bill.legislature_number)) &&
  typeof bill.bill_type === 'string' &&
  bill.bill_type.trim().length > 0 &&
  Number.isFinite(Number(bill.bill_number));

const safeCanonicalBillPath = (bill: any) =>
  hasCanonicalBillFields(bill) ? publicBillPath(bill) : null;

const formatScheduleDate = (value: string | null | undefined) => {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const Route = createFileRoute('/texas-legislature/committees/$committeeSlug')({
  loader: async ({ params }) => {
    const { data: committee, error } = await db
      .from('legislative_committees')
      .select('*')
      .eq('committee_slug', params.committeeSlug)
      .order('legislature_number', { ascending: false })
      .order('updated_at', { ascending: false })
      .order('chamber', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!committee) throw notFound();

    const [historyResult, scheduleResult, relatedContentResult] = await Promise.allSettled([
      db
        .from('bill_committee_history')
        .select('*,bills(*)')
        .eq('committee_id', committee.id)
        .order('referred_date', { ascending: false })
        .limit(100),
      db
        .from('upcoming_legislative_schedule')
        .select('*')
        .eq('committee_id', committee.id)
        .order('event_date', { ascending: true })
        .order('bill_identifier', { ascending: true })
        .limit(50),
      getRelatedAuthorityContent('committee', committee.committee_slug),
    ]);

    let history: any[] = [];
    if (historyResult.status === 'fulfilled') {
      if (historyResult.value.error) {
        console.error(`Committee bill history failed for ${committee.committee_slug}:`, historyResult.value.error.message ?? historyResult.value.error);
      } else {
        history = historyResult.value.data ?? [];
      }
    } else {
      console.error(`Committee bill history failed for ${committee.committee_slug}:`, historyResult.reason);
    }

    let upcomingSchedule: any[] = [];
    if (scheduleResult.status === 'fulfilled') {
      if (scheduleResult.value.error) {
        console.error(`Committee schedule failed for ${committee.committee_slug}:`, scheduleResult.value.error.message ?? scheduleResult.value.error);
      } else {
        upcomingSchedule = scheduleResult.value.data ?? [];
      }
    } else {
      console.error(`Committee schedule failed for ${committee.committee_slug}:`, scheduleResult.reason);
    }

    let relatedContent: Awaited<ReturnType<typeof getRelatedAuthorityContent>> = [];
    if (relatedContentResult.status === 'fulfilled') relatedContent = relatedContentResult.value;
    else console.error(`Committee related content failed for ${committee.committee_slug}:`, relatedContentResult.reason);

    return { committee, history, upcomingSchedule, relatedContent };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { committee, history } = loaderData;
    const canonical = `${SITE_URL}/texas-legislature/committees/${committee.committee_slug}`;
    const description = `${committee.committee_name} authority page with referred Texas bills, upcoming hearings, legislative activity, and official source links.`;
    const itemListElement = history.flatMap((item: any, index: number) => {
      const billPath = safeCanonicalBillPath(item.bills);
      if (!billPath) return [];
      return [{ '@type': 'ListItem', position: index + 1, name: item.bills.bill_identifier, url: `${SITE_URL}${billPath}` }];
    });
    return {
      meta: [{ title: `${committee.committee_name} | Texas Legislature | KeepTXRed` }, { name: 'description', content: description }],
      links: [{ rel: 'canonical', href: canonical }],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': ['GovernmentOrganization', 'CollectionPage'], '@id': `${canonical}#committee`, name: committee.committee_name, description, url: canonical, parentOrganization: { '@type': 'GovernmentOrganization', name: 'Texas Legislature', url: 'https://capitol.texas.gov/' }, mainEntity: { '@type': 'ItemList', numberOfItems: itemListElement.length, itemListElement }, sameAs: committee.source_url || undefined },
          { '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Texas Legislature', item: `${SITE_URL}/texas-legislature` },
            { '@type': 'ListItem', position: 3, name: 'Committees', item: `${SITE_URL}/texas-legislature/committees` },
            { '@type': 'ListItem', position: 4, name: committee.committee_name, item: canonical },
          ] },
        ],
      }).replace(/</g, '\\u003c') }],
    };
  },
  component: CommitteePage,
});

function CommitteePage() {
  const { committee, history, upcomingSchedule, relatedContent } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-muted-foreground"><Link to="/">Home</Link> / <Link to="/texas-legislature">Texas Legislature</Link> / <a href="/texas-legislature/committees">Committees</a> / {committee.committee_name}</nav>
      <header className="mt-6 rounded-2xl border bg-card p-8">
        <p className="text-sm font-bold uppercase text-primary">{committee.chamber} committee</p>
        <h1 className="mt-2 text-4xl font-bold">{committee.committee_name}</h1>
        {committee.description ? <p className="mt-4 text-lg text-muted-foreground">{committee.description}</p> : null}
        {committee.source_url ? <a className="mt-5 inline-block font-semibold text-primary hover:underline" href={committee.source_url} target="_blank" rel="noreferrer">Official committee source →</a> : null}
      </header>
      <div className="mt-8 space-y-8">
        {upcomingSchedule.length > 0 ? (
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Upcoming hearings</h2>
            <p className="mt-2 text-sm text-muted-foreground">Scheduled activity from Texas Legislature Online. Hearing dates can change; use the official source for the latest notice.</p>
            <div className="mt-5 space-y-3">{upcomingSchedule.map((item: any) => {
              const billPath = safeCanonicalBillPath(item);
              if (!billPath) return null;
              return <div key={item.id} className="rounded-lg border p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><a href={billPath} className="font-bold text-primary hover:underline">{item.bill_identifier}</a><span className="text-sm font-medium">{formatScheduleDate(item.event_date)}</span></div><p className="mt-2">{item.bill_caption}</p><p className="mt-2 text-sm text-muted-foreground">{item.title || item.current_status_label}</p>{item.source_url ? <a className="mt-2 inline-block text-sm font-semibold text-primary hover:underline" href={item.source_url} target="_blank" rel="noreferrer">Official schedule notice →</a> : null}</div>;
            })}</div>
          </section>
        ) : null}
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-2xl font-bold">Bills referred</h2>
          <div className="mt-5 space-y-3">{history.map((item: any) => {
            const billPath = safeCanonicalBillPath(item.bills);
            if (!billPath) return null;
            return <a key={item.id} href={billPath} className="block rounded-lg border p-4 hover:border-primary"><strong>{item.bills.bill_identifier}</strong><p className="mt-1">{item.bills.caption}</p><p className="mt-2 text-sm text-muted-foreground">{item.action_description || item.action_type || item.bills.current_status_label}</p></a>;
          })}</div>
        </section>
        <RelatedAuthorityContent items={relatedContent} />
      </div>
    </main>
  );
}
