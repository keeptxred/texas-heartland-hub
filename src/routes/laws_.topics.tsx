import { createFileRoute, Link } from "@tanstack/react-router";
import { LAW_TOPICS } from "@/data/law-topics";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const TITLE = "Texas Law Topics Explained | Keep TX Red Law Library";
const DESCRIPTION = "Plain-English Texas law guides covering property taxes, gun law, self-defense, elections, parental rights, open records, eminent domain, abortion law, agency rules, and local government power.";
const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;
const INDEXABLE_LAW_TOPICS = LAW_TOPICS.filter(isLawTopicIndexable);

export const Route = createFileRoute("/laws/topics")({
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/laws/topics" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify(webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/laws/topics", type: "CollectionPage" })) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Texas Law Topics", numberOfItems: INDEXABLE_LAW_TOPICS.length, itemListElement: INDEXABLE_LAW_TOPICS.map((topic, index) => ({ "@type": "ListItem", position: index + 1, name: topic.title, url: `${SITE_URL}/laws/topic/${topic.slug}` })) }) },
    ] };
  },
  component: LawTopicsHub,
});

function LawTopicsHub() {
  return <main className="bg-background">
    <section className="border-b bg-secondary text-secondary-foreground"><div className="mx-auto max-w-[1180px] px-6 py-16 md:py-20"><p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Keep TX Red Law Desk</p><h1 className="mt-4 max-w-5xl font-display text-5xl leading-none tracking-tight md:text-7xl">Texas Law Library</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">The statutes behind the political arguments — organized by the legal questions Texans actually face.</p><p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">Each guide starts with the controlling Texas code or official source, explains which government entity has authority, and connects the legal framework to KTR policy trackers, bills, elections, and editorial arguments.</p></div></section>
    <section className="mx-auto max-w-[1180px] px-6 py-12"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{INDEXABLE_LAW_TOPICS.map((topic) => <a key={topic.slug} href={`/laws/topic/${topic.slug}`} className="group flex h-full flex-col rounded-xl border bg-card p-6 transition hover:border-primary hover:shadow-md"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Texas law topic</p><h2 className="mt-2 font-display text-2xl leading-tight tracking-tight group-hover:text-primary">{topic.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{topic.dek}</p><span className="mt-5 text-xs font-bold text-primary">Read the legal framework →</span></a>)}</div></section>
    <section className="border-t bg-muted/25"><div className="mx-auto max-w-[1180px] px-6 py-12"><h2 className="font-display text-3xl tracking-tight">Law, policy, and legislation are different layers</h2><div className="mt-6 grid gap-4 md:grid-cols-3"><Link to="/laws" className="rounded-xl border bg-background p-5"><strong>Texas Laws</strong><p className="mt-2 text-sm text-muted-foreground">Statutory and legal-reference layer.</p></Link><a href="/policy" className="rounded-xl border bg-background p-5"><strong>Policy Trackers</strong><p className="mt-2 text-sm text-muted-foreground">What government is doing and what changes next.</p></a><Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-xl border bg-background p-5"><strong>Texas Bills</strong><p className="mt-2 text-sm text-muted-foreground">Proposals moving through the Legislature.</p></Link></div></div></section>
  </main>;
}
