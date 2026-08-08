import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { RelatedAuthorityContent } from '@/components/authority/RelatedAuthorityContent';
import { supabase } from '@/integrations/supabase/client';
import { getRelatedAuthorityContent } from '@/lib/authority-relationships';
import { canonicalBillPath, SITE_URL } from '@/lib/bills';

const db = supabase as any;

async function loadRelatedCommitteeContent(committeeSlug: string) {
  try {
    return await getRelatedAuthorityContent('committee', committeeSlug);
  } catch (error: any) {
    // Related authority cards are supplemental. A graph/RPC problem must not turn
    // an otherwise valid public committee authority page into an HTTP 500.
    console.error(
      `Committee related-content lookup failed for ${committeeSlug}:`,
      error?.message ?? error,
    );
    return [];
  }
}

export const Route = createFileRoute('/texas-legislature/committees/$committeeSlug')({
  loader: async ({ params }) => {
    // committee_slug is only unique inside legislature/session/chamber in the DB.
    // Public committee URLs intentionally omit those dimensions, so select the
    // newest canonical record instead of using maybeSingle() across every session.
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

    const [{ data: history, error: historyError }, relatedContent] = await Promise.all([
      db
        .from('bill_committee_history')
        .select('*,bills(*)')
        .eq('committee_id', committee.id)
        .order('referred_date', { ascending: false })
        .limit(100),
      loadRelatedCommitteeContent(committee.committee_slug),
    ]);

    if (historyError) throw historyError;
    return { committee, history: history ?? [], relatedContent };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { committee, history } = loaderData;
    const canonical = `${SITE_URL}/texas-legislature/committees/${committee.committee_slug}`;
    const description = `${committee.committee_name} authority page with referred Texas bills, legislative activity, and official source links.`;

    return {
      meta: [
        { title: `${committee.committee_name} | Texas Legislature | KeepTXRed` },
        { name: 'description', content: description },
      ],
      links: [{ rel: 'canonical', href: canonical }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': ['GovernmentOrganization', 'CollectionPage'],
                '@id': `${canonical}#committee`,
                name: committee.committee_name,
                description,
                url: canonical,
                parentOrganization: {
                  '@type': 'GovernmentOrganization',
                  name: 'Texas Legislature',
                  url: 'https://capitol.texas.gov/',
                },
                mainEntity: {
                  '@type': 'ItemList',
                  numberOfItems: history.length,
                  itemListElement: history.map((item: any, index: number) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.bills?.bill_identifier,
                    url: item.bills ? `${SITE_URL}${canonicalBillPath(item.bills)}` : undefined,
                  })),
                },
                sameAs: committee.source_url || undefined,
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Texas Legislature',
                    item: `${SITE_URL}/texas-legislature`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Committees',
                    item: `${SITE_URL}/texas-legislature/committees`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 4,
                    name: committee.committee_name,
                    item: canonical,
                  },
                ],
              },
            ],
          }).replace(/</g, '\\u003c'),
        },
      ],
    };
  },
  component: CommitteePage,
});

function CommitteePage() {
  const { committee, history, relatedContent } = Route.useLoaderData();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <nav className="text-sm text-muted-foreground">
        <Link to="/">Home</Link> / <Link to="/texas-legislature">Texas Legislature</Link> /{' '}
        <a href="/texas-legislature/committees">Committees</a> / {committee.committee_name}
      </nav>
      <header className="mt-6 rounded-2xl border bg-card p-8">
        <p className="text-sm font-bold uppercase text-primary">{committee.chamber} committee</p>
        <h1 className="mt-2 text-4xl font-bold">{committee.committee_name}</h1>
        {committee.description ? (
          <p className="mt-4 text-lg text-muted-foreground">{committee.description}</p>
        ) : null}
        {committee.source_url ? (
          <a
            className="mt-5 inline-block font-semibold text-primary hover:underline"
            href={committee.source_url}
            target="_blank"
            rel="noreferrer"
          >
            Official committee source →
          </a>
        ) : null}
      </header>
      <div className="mt-8 space-y-8">
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-2xl font-bold">Bills referred</h2>
          <div className="mt-5 space-y-3">
            {history.map((item: any) =>
              item.bills ? (
                <a
                  key={item.id}
                  href={canonicalBillPath(item.bills)}
                  className="block rounded-lg border p-4 hover:border-primary"
                >
                  <strong>{item.bills.bill_identifier}</strong>
                  <p className="mt-1">{item.bills.caption}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.action_description ||
                      item.action_type ||
                      item.bills.current_status_label}
                  </p>
                </a>
              ) : null,
            )}
          </div>
        </section>
        <RelatedAuthorityContent items={relatedContent} />
      </div>
    </main>
  );
}
