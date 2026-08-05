import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import { SITE_URL } from '@/lib/bills';
import { getBillSubjectBySlug, getBillsForSubject } from '@/lib/bill-subjects';

export const Route = createFileRoute('/bills/subject/$subjectSlug')({
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
    const description = subject.description || `Track ${bills.length} active Texas bills classified under ${subject.name}, with current status and official legislative links.`;
    return {
      meta: [
        { title: `${subject.name} Texas Bills | KeepTXRed` },
        { name: 'description', content: description },
        { property: 'og:title', content: `${subject.name} Texas Bills | KeepTXRed` },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
      ],
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
                  url: `${SITE_URL}${bill.href}`,
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
  const { subject, bills } = Route.useLoaderData();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <a href="/bills">Texas Bills</a> / {subject.name}
      </nav>

      <header className="mt-6 rounded-2xl border bg-card p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">Texas legislation subject</p>
        <h1 className="mt-2 text-4xl font-bold">{subject.name}</h1>
        {subject.description ? <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{subject.description}</p> : null}
        <p className="mt-4 text-sm text-muted-foreground">{bills.length} active bill{bills.length === 1 ? '' : 's'} currently classified under this verified subject.</p>
        {subject.source_url ? (
          <a className="mt-5 inline-flex items-center gap-1 font-semibold text-primary hover:underline" href={subject.source_url} target="_blank" rel="noopener noreferrer">
            Official subject source <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </header>

      <section className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="text-2xl font-bold">Bills in this subject</h2>
        {bills.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {bills.map((bill) => (
              <a key={bill.id} href={bill.href} className="rounded-lg border p-5 hover:border-primary">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{bill.bill_identifier}</strong>
                  {bill.became_law ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-900">Became law</span> : null}
                </div>
                <p className="mt-2 leading-6">{bill.caption}</p>
                <p className="mt-3 text-sm text-muted-foreground">{bill.current_status_label}</p>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">No active bills are currently connected to this subject.</p>
        )}
      </section>
    </main>
  );
}
