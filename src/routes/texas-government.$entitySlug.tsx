import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink, Gavel, Landmark, Scale, ShieldCheck, Users } from "lucide-react";
import { ARTICLES, isPublished } from "@/data/articles";
import { RelatedAuthorityContent } from "@/components/authority/RelatedAuthorityContent";
import { getRelatedAuthorityContent } from "@/lib/authority-relationships";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { isGovernmentEntityIndexable } from "@/lib/government-entity-indexability";
import { getPublicationGovernmentEntity } from "@/lib/government-entity-publication";
import { GOVERNMENT_REVIEWED_AT, getGovernmentEntity, governmentJsonLd, governmentPath, SITE_URL, type GovernmentLink } from "@/lib/texas-government";

export const Route = createFileRoute("/texas-government/$entitySlug")({
  loader: async ({ params }) => {
    const baseEntity = getGovernmentEntity(params.entitySlug);
    if (!baseEntity) throw notFound();
    const entity = getPublicationGovernmentEntity(baseEntity);
    const relatedEntities = entity.relatedEntities
      .map(getGovernmentEntity)
      .filter(Boolean)
      .map((related) => getPublicationGovernmentEntity(related!));
    const terms = [...entity.newsKeywords, entity.name, entity.shortName].map((value) => value.toLowerCase());
    const news = ARTICLES.filter((article: any) => isPublished(article) && isStaticArticleIndexable(article))
      .filter((article: any) => {
        const haystack = `${article.title} ${article.dek} ${(article.topics ?? []).join(" ")}`.toLowerCase();
        return terms.some((term) => haystack.includes(term));
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 6);
    const scoredRelated = await getRelatedAuthorityContent("government", entity.slug, 12).catch(() => []);
    return { entity, relatedEntities, news, scoredRelated };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ name: "robots", content: "noindex,follow" }] };
    const { entity } = loaderData;
    const canonical = `${SITE_URL}${governmentPath(entity.slug)}`;
    const title = `${entity.name}: Powers, Leadership, Elections and History | KeepTXRed`;
    const description = `Learn what the ${entity.name} does, who currently leads it, its constitutional powers, related Texas laws, elections, history and latest news.`;
    const robots = isGovernmentEntityIndexable(entity)
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";
    return {
      meta: [
        { title }, { name: "description", content: description },
        { name: "robots", content: robots },
        { property: "og:title", content: title }, { property: "og:description", content: description },
        { property: "og:url", content: canonical }, { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(governmentJsonLd(entity)).replace(/</g, "\\u003c") }],
    };
  },
  component: GovernmentEntityPage,
});

function GovernmentEntityPage() {
  const { entity, relatedEntities, news, scoredRelated } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / {entity.name}</nav>
      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">{entity.branch} branch</span><span className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide">{entity.entityType}</span></div>
        <h1 className="mt-5 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">{entity.name}</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">{entity.overview}</p>
        <nav className="mt-6 flex flex-wrap gap-2 border-t pt-5" aria-label={`${entity.shortName} page sections`}>
          {["Overview", "Responsibilities", "Leadership", "History", "Powers", "Laws", "Elections", "Representatives", "News", "FAQs"].map((label) => <a key={label} href={`#${label.toLowerCase()}`} className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold hover:bg-primary hover:text-primary-foreground">{label}</a>)}
        </nav>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <main className="space-y-8">
          <AuthoritySection id="overview" title="Overview" icon={<Landmark className="h-6 w-6 text-primary"/>}><p className="text-lg leading-8">{entity.overview}</p><p className="mt-4 text-muted-foreground">The {entity.shortName} is part of the Texas {entity.branch.toLowerCase()} branch. Its authority is limited to powers granted by the Texas Constitution, state statutes, valid rules and controlling court decisions.</p></AuthoritySection>
          <AuthoritySection id="responsibilities" title="Constitutional and statutory responsibilities" icon={<Scale className="h-6 w-6 text-primary"/>}><p className="leading-7">{entity.constitutionalResponsibilities}</p><h3 className="mt-5 font-bold">Primary legal authority</h3><ul className="mt-3 space-y-2">{entity.constitutionalBasis.map((basis: any) => <li key={basis} className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary"/><span>{basis}</span></li>)}</ul></AuthoritySection>
          <AuthoritySection id="leadership" title="Current officeholder or leadership" icon={<Users className="h-6 w-6 text-primary"/>}><div className="rounded-xl border bg-muted/30 p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{entity.officeholderTitle}</p><h3 className="mt-2 text-2xl font-bold">{entity.currentOfficeholder}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{entity.officeholderNote}</p><div className="mt-4 flex flex-wrap gap-3">{entity.relatedRepresentatives.slice(0, 2).map((link: any) => <AuthorityLink key={link.href} link={link}/>)}<a href={entity.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Official leadership source <ExternalLink className="h-4 w-4"/></a></div></div></AuthoritySection>
          <AuthoritySection id="history" title="Historical information" icon={<Landmark className="h-6 w-6 text-primary"/>}><ol className="space-y-4">{entity.history.map((item: any, index: number) => <li key={item} className="relative border-l-2 border-border pb-4 pl-6 last:pb-0"><span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary"/><span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Milestone {index + 1}</span><p className="mt-1 leading-7">{item}</p></li>)}</ol></AuthoritySection>
          <AuthoritySection id="powers" title="Important powers" icon={<Gavel className="h-6 w-6 text-primary"/>}><div className="grid gap-3 sm:grid-cols-2">{entity.powers.map((power: any) => <div key={power} className="rounded-lg border p-4"><p className="font-medium leading-6">{power}</p></div>)}</div><h3 className="mt-6 text-lg font-bold">What this entity cannot do</h3><ul className="mt-3 space-y-2 text-muted-foreground">{entity.limitations.map((item: any) => <li key={item}>• {item}</li>)}</ul></AuthoritySection>
          <AuthoritySection id="laws" title="Related laws and legislation" icon={<Scale className="h-6 w-6 text-primary"/>}><LinkGrid links={[...entity.relatedLaws, { label: "Texas bill database", href: "/bills", description: "Search current status, sponsors, committees and legislative history." }]} /></AuthoritySection>
          <AuthoritySection id="elections" title="Related elections" icon={<Gavel className="h-6 w-6 text-primary"/>}><LinkGrid links={entity.relatedElections.length ? entity.relatedElections : [{ label: "Texas Election Central", href: "/elections", description: "Statewide, legislative and judicial election coverage." }]} /></AuthoritySection>
          <AuthoritySection id="representatives" title="Related representatives and officials" icon={<Users className="h-6 w-6 text-primary"/>}><LinkGrid links={entity.relatedRepresentatives} /></AuthoritySection>
          <AuthoritySection id="news" title={`Latest ${entity.shortName} news`} icon={<Landmark className="h-6 w-6 text-primary"/>}>{news.length ? <div className="grid gap-4 sm:grid-cols-2">{news.map((article: any) => <a key={article.slug} href={`/news/${article.slug}`} className="rounded-xl border p-5 hover:border-primary"><p className="text-xs font-bold uppercase tracking-wide text-primary">{article.category}</p><h3 className="mt-2 font-bold leading-snug">{article.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.dek}</p><time className="mt-3 block text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></a>)}</div> : <div className="rounded-lg bg-muted/40 p-5"><p className="text-muted-foreground">No matching published KeepTXRed articles are currently linked to this entity.</p><a href="/politics" className="mt-3 inline-flex text-sm font-bold text-primary hover:underline">Browse the latest Texas politics coverage →</a></div>}</AuthoritySection>
          <AuthoritySection id="faqs" title="Frequently asked questions" icon={<Scale className="h-6 w-6 text-primary"/>}><div className="divide-y rounded-xl border">{entity.faqs.map((faq: any) => <details key={faq.question} className="group p-5"><summary className="cursor-pointer list-none pr-8 font-bold marker:hidden">{faq.question}<span className="float-right text-primary group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{faq.answer}</p></details>)}</div></AuthoritySection>
          <AuthoritySection id="related-government" title="Related Texas government entities" icon={<Landmark className="h-6 w-6 text-primary"/>}><div className="grid gap-3 sm:grid-cols-2">{relatedEntities.map((related: any) => related ? <a key={related.slug} href={governmentPath(related.slug)} className="rounded-lg border p-4 hover:border-primary"><p className="font-bold">{related.name}</p><p className="mt-1 text-sm text-muted-foreground">{related.branch} · {related.entityType}</p></a> : null)}</div></AuthoritySection>
          <RelatedAuthorityContent items={scoredRelated} title="Related bills, elections, districts, and news" />
        </main>
        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-5"><h2 className="font-bold">At a glance</h2><dl className="mt-4 space-y-3 text-sm"><Info label="Branch" value={entity.branch}/><Info label="Type" value={entity.entityType}/><Info label="Current leader" value={entity.currentOfficeholder}/><Info label="Authority reviewed" value={new Date(`${GOVERNMENT_REVIEWED_AT}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}/></dl></section>
          <section className="rounded-xl border bg-card p-5"><h2 className="font-bold">Official information</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Verify time-sensitive leadership, orders, rules and meeting information with the responsible Texas government source.</p><a href={entity.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Visit official website <ExternalLink className="h-4 w-4"/></a></section>
          <section className="rounded-xl border bg-muted/30 p-5"><h2 className="font-bold">Explore Texas government</h2><div className="mt-3 space-y-2 text-sm"><a href="/texas-government" className="block font-semibold text-primary hover:underline">All government entities</a><a href="/representatives" className="block font-semibold text-primary hover:underline">Texas representatives</a><a href="/elections" className="block font-semibold text-primary hover:underline">Texas elections</a><a href="/bills" className="block font-semibold text-primary hover:underline">Texas bills</a><a href="/laws" className="block font-semibold text-primary hover:underline">Texas laws</a></div></section>
        </aside>
      </div>
    </div>
  );
}

function AuthoritySection({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) { return <section id={id} className="scroll-mt-24 rounded-xl border bg-card p-6"><div className="flex items-center gap-3">{icon}<h2 className="text-2xl font-bold">{title}</h2></div><div className="mt-5">{children}</div></section>; }
function LinkGrid({ links }: { links: GovernmentLink[] }) { return links.length ? <div className="grid gap-3 sm:grid-cols-2">{links.map((link: any) => <a key={`${link.href}-${link.label}`} href={link.href} className="rounded-lg border p-4 hover:border-primary"><p className="font-bold">{link.label}</p>{link.description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{link.description}</p>}</a>)}</div> : <p className="text-muted-foreground">No directly related records are currently linked.</p>; }
function AuthorityLink({ link }: { link: GovernmentLink }) { return <a href={link.href} className="text-sm font-bold text-primary hover:underline">{link.label}</a>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-4"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-semibold capitalize">{value}</dd></div>; }