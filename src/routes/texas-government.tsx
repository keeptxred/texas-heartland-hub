import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Gavel, Landmark, Scale } from "lucide-react";
import { StatewideOfficePowersComparison } from "@/components/government/StatewideOfficePowersComparison";
import { GOVERNMENT_HISTORY_AUTHORITY_PAGES } from "@/data/texas-government-history-authority";
import { GOVERNMENT_ENTITIES, governmentHubJsonLd, governmentPath, SITE_URL } from "@/lib/texas-government";

const TITLE = "Texas Government: Offices, Leaders, Powers and Elections | KeepTXRed";
const DESCRIPTION = "Explore Texas government offices, legislative institutions, statewide boards and highest courts, including current leaders, constitutional powers, limits, laws, elections and history.";

export const Route = createFileRoute("/texas-government")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/texas-government` }, { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/texas-government` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(governmentHubJsonLd()).replace(/</g, "\\u003c") }],
  }),
  component: TexasGovernmentHub,
});

const groups = [
  { branch: "Executive", title: "Executive offices and statewide boards", description: "Constitutional officers, independently elected regulators and statewide policymaking boards.", icon: Building2 },
  { branch: "Legislative", title: "Texas legislative institutions", description: "The Legislature, its two chambers and the presiding officers who organize their work.", icon: Landmark },
  { branch: "Judicial", title: "Texas highest courts", description: "The separate courts of last resort for civil and criminal cases.", icon: Scale },
] as const;

function TexasGovernmentHub() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / Texas Government</nav>
      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex items-center gap-3 text-primary"><Landmark className="h-7 w-7"/><span className="text-sm font-bold uppercase tracking-[0.18em]">Texas government authority guides</span></div>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">Texas Government: Offices, Leaders, Powers and Elections</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Understand who runs Texas government, what the constitution allows each institution to do, what limits apply, how leaders are selected, and how offices connect to laws, bills, elections and representatives.</p>
        <div className="mt-6 flex flex-wrap gap-3"><a href="/laws" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Read the Texas Constitution</a><a href="/elections/2026" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas Election Central</a><a href="/bills" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Track Texas bills</a><a href="/texas-government/agencies" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">State agency directory</a></div>
      </header>

      <section className="mt-10" aria-labelledby="government-history-authority">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">How Texas institutions got their power</p>
          <h2 id="government-history-authority" className="mt-2 text-3xl font-bold md:text-4xl">Texas government and judiciary history</h2>
          <p className="mt-3 leading-7 text-muted-foreground">Connect today's officeholders and court powers to the constitutional changes, legislative rules, elections and partisan transitions that produced them. These guides are built from Texas constitutional, legislative, archival and judicial sources.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {GOVERNMENT_HISTORY_AUTHORITY_PAGES.map((page) => (
            <a key={page.slug} href={`/texas-government/${page.slug}`} className="rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-sm">
              <h3 className="font-bold text-primary">{page.title}</h3>
              <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{page.description}</p>
              <span className="mt-4 inline-flex text-sm font-bold text-primary">Read history guide →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 md:p-8" aria-labelledby="texas-child-support-government">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas families & government</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 id="texas-child-support-government" className="text-2xl font-bold md:text-3xl">Texas child support connects the Family Code with the Attorney General's enforcement role.</h2>
            <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">KeepTXRed's verified child-support guide explains the Chapter 154 guideline framework, net resources, deviations and multiple-household rules. The Texas Attorney General authority page explains the office that administers the state's child-support enforcement program.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/guides/$slug" params={{ slug: "texas-child-support-guidelines-law" }} className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Texas child support guide</Link>
            <Link to="/texas-government/$entitySlug" params={{ entitySlug: "attorney-general" }} className="rounded-md border bg-card px-4 py-2 text-sm font-bold hover:border-primary">Texas Attorney General</Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3" aria-label="Texas government branches">
        {groups.map(({ branch, title, description, icon: Icon }) => <div key={branch} className="rounded-xl border bg-card p-6"><Icon className="h-7 w-7 text-primary"/><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p><p className="mt-4 text-sm font-semibold">{GOVERNMENT_ENTITIES.filter((entity) => entity.branch === branch).length} authority guides</p></div>)}
      </section>

      {groups.map(({ branch, title }) => {
        const entities = GOVERNMENT_ENTITIES.filter((entity) => entity.branch === branch);
        return <section key={branch} className="mt-12" aria-labelledby={`${branch.toLowerCase()}-heading`}><div className="flex items-center gap-3"><Gavel className="h-6 w-6 text-primary"/><h2 id={`${branch.toLowerCase()}-heading`} className="text-3xl font-bold">{title}</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{entities.map((entity) => <a key={entity.slug} href={governmentPath(entity.slug)} className="group rounded-xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold uppercase tracking-wide">{entity.entityType}</span><span className="text-xs text-muted-foreground">{entity.currentOfficeholder}</span></div><h3 className="mt-4 text-xl font-bold group-hover:text-primary">{entity.name}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{entity.overview}</p><span className="mt-4 inline-flex text-sm font-bold text-primary">View authority page →</span></a>)}</div></section>;
      })}

      <StatewideOfficePowersComparison />

      <section className="mt-12 rounded-2xl border bg-muted/30 p-6 md:p-8"><h2 className="text-2xl font-bold">How Texas government power is divided</h2><div className="mt-5 grid gap-6 md:grid-cols-3"><div><h3 className="font-bold">Executive</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Texas divides executive authority among independently elected constitutional officers, appointed officials, boards and commissions rather than concentrating all power in the governor.</p></div><div><h3 className="font-bold">Legislative</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">The House and Senate must agree on legislation. The governor may sign or veto bills, while courts may review enacted laws.</p></div><div><h3 className="font-bold">Judicial</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Texas has separate highest courts for civil and criminal cases, each with statewide elected judges.</p></div></div></section>
    </div>
  );
}
