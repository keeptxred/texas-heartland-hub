import { createFileRoute, notFound } from "@tanstack/react-router";
import { getStateDistrictDetail } from "@/lib/state-districts.functions";
import {
  STATE_DISTRICT_OFFICIAL_LINKS,
  STATE_DISTRICT_PLANS,
  electionDistrictSlug,
  partyLabel,
} from "@/lib/state-districts";
import { buildSeo, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/districts/$districtSlug")({
  loader: async ({ params }) => {
    const district = await getStateDistrictDetail({ data: { slug: params.districtSlug } });
    if (!district) throw notFound();
    return { district };
  },
  head: ({ loaderData }) => {
    const district = loaderData?.district;
    if (!district) return {};
    const path = `/districts/${district.slug}`;
    const member = district.currentMember ? ` Current representative: ${district.currentMember}.` : " The seat is currently recorded as vacant.";
    const description = `${district.title} permanent authority page with the current officeholder, official district plan, committees, legislation, election history, campaign-finance sources, and Texas Legislature links.${member}`;
    const seo = buildSeo({
      title: `${district.title} | Representative, Map & Legislation`,
      description,
      path,
      type: "article",
      publishedTime: `${district.reviewedAt}T12:00:00-05:00`,
      modifiedTime: `${district.reviewedAt}T12:00:00-05:00`,
      section: "Texas Legislative Districts",
      author: "Keep TX Red Government Desk",
    });
    const canonical = `${SITE_URL}${path}`;
    const graph = [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: district.title,
        description,
        about: { "@id": `${canonical}#district` },
      },
      {
        "@type": "AdministrativeArea",
        "@id": `${canonical}#district`,
        name: district.title,
        identifier: district.slug,
        additionalType: district.chamber === "house" ? "Texas House district" : "Texas Senate district",
      },
      ...(district.currentMember
        ? [{
            "@type": "Person",
            "@id": `${canonical}#current-member`,
            name: district.currentMember,
            jobTitle: STATE_DISTRICT_PLANS[district.chamber].memberLabel,
            affiliation: { "@type": "Organization", name: district.party === "R" ? "Republican Party" : district.party === "D" ? "Democratic Party" : "Not published" },
            url: district.currentMemberSlug ? `${SITE_URL}/representatives/${district.currentMemberSlug}` : undefined,
          }]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Texas Legislative Districts", item: `${SITE_URL}/districts` },
          { "@type": "ListItem", position: 3, name: district.title, item: canonical },
        ],
      },
    ];
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }],
    };
  },
  component: StateDistrictPage,
});

function StateDistrictPage() {
  const { district } = Route.useLoaderData();
  const plan = STATE_DISTRICT_PLANS[district.chamber];
  const electionSlug = electionDistrictSlug(district.chamber, district.district);
  const reviewed = new Date(`${district.reviewedAt}T12:00:00-05:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <a href="/">Home</a> / <a href="/districts">Districts</a> / {district.title}
      </nav>

      <header className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Permanent district authority page</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">{district.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          {district.currentMember
            ? `${district.currentMember} currently represents this ${district.chamber === "house" ? "Texas House" : "Texas Senate"} seat. The district page remains permanent when the officeholder changes.`
            : `This ${district.chamber === "house" ? "Texas House" : "Texas Senate"} seat is currently recorded as vacant. The district page remains permanent between officeholders.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {district.currentMemberSlug ? <a href={`/representatives/${district.currentMemberSlug}`} className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Current member profile</a> : null}
          <a href={STATE_DISTRICT_OFFICIAL_LINKS.whoRepresentsMe} target="_blank" rel="noopener noreferrer" className="rounded-md border px-4 py-2.5 text-sm font-bold">Verify your address</a>
          <a href={`/elections/districts/${electionSlug}`} className="rounded-md border px-4 py-2.5 text-sm font-bold">Election-cycle district page</a>
        </div>
      </header>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DistrictFact label="Chamber" value={plan.chamberLabel} />
        <DistrictFact label="District" value={String(district.district)} />
        <DistrictFact label="Current party" value={district.vacant ? "Vacant" : partyLabel(district.party)} />
        <DistrictFact label="Current map" value={district.planId} />
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-8">
          <section className="rounded-xl border bg-card p-6">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Quick answer</p>
            <h2 className="mt-2 text-2xl font-bold">Who represents {district.title}?</h2>
            {district.currentMember ? (
              <div className="mt-5 flex gap-5">
                {district.memberImageUrl ? <img src={district.memberImageUrl} alt={`${district.currentMember} official portrait`} className="h-36 w-28 rounded-lg border object-cover" loading="lazy" /> : null}
                <div>
                  <h3 className="text-xl font-bold">{district.currentMember}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.memberLabel} · {partyLabel(district.party)}</p>
                  {district.biography ? <p className="mt-4 max-w-2xl text-sm leading-7">{district.biography}</p> : null}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                    {district.currentMemberSlug ? <a href={`/representatives/${district.currentMemberSlug}`} className="text-primary hover:underline">Full authority profile →</a> : null}
                    {district.memberWebsite ? <a href={district.memberWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Official member page →</a> : null}
                  </div>
                </div>
              </div>
            ) : <p className="mt-4 text-muted-foreground">The underlying legislative directory currently marks this seat vacant. Official House or Senate records control when a new member takes office.</p>}
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">District boundaries and map authority</h2>
            <p className="mt-4 leading-7">{district.districtOverview}</p>
            <div className="mt-5 rounded-lg border bg-muted/20 p-5 text-sm leading-7">
              <strong>{district.planId}</strong> is the current {plan.chamberLabel} plan. It became effective {district.planEffective}. The ideal 2020 Census population used for a {district.chamber === "house" ? "House" : "Senate"} district was {district.ideal2020Population.toLocaleString("en-US")}.
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
              <a href={STATE_DISTRICT_OFFICIAL_LINKS.currentDistricts} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Texas Redistricting — current districts →</a>
              <a href={STATE_DISTRICT_OFFICIAL_LINKS.whoRepresentsMe} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Who Represents Me? →</a>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Committee assignments and governing role</h2>
            {district.committees.length ? <ul className="mt-5 space-y-3">{district.committees.map((committee) => <li key={committee} className="flex gap-3 leading-7"><span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" /><span>{committee}</span></li>)}</ul> : <p className="mt-4 text-muted-foreground">No verified committee summary is attached to the current seat record. Use the member's official page for the latest assignment.</p>}
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Legislation connected to the current member</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">These records follow the current officeholder, not the district forever. When the seat changes hands, this section changes with it while the district URL stays stable.</p>
            {district.bills.length ? <div className="mt-5 space-y-3">{district.bills.map((bill) => <a key={bill.id} href={bill.path} className="block rounded-lg border p-4 hover:border-primary"><div className="flex flex-wrap items-center justify-between gap-3"><strong className="text-primary">{bill.identifier}</strong>{bill.status ? <span className="text-xs font-semibold text-muted-foreground">{bill.status}</span> : null}</div><p className="mt-2 font-medium">{bill.caption}</p></a>)}</div> : <p className="mt-5 rounded-lg border border-dashed p-5 text-muted-foreground">No sponsored bills are currently matched to this seat's current member profile.</p>}
            <a href="/bills" className="mt-5 inline-block font-semibold text-primary hover:underline">Search all Texas bills →</a>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Election history attached to the current officeholder</h2>
            {district.electionHistory.length ? <ol className="mt-5 space-y-4">{district.electionHistory.map((event) => <li key={`${event.year}-${event.result}`} className="grid gap-1 border-l-2 border-primary pl-4 sm:grid-cols-[6rem_1fr]"><strong>{event.year}</strong><span className="text-muted-foreground">{event.result}</span></li>)}</ol> : <p className="mt-4 text-muted-foreground">KTR has not attached a verified election-history summary to the current member record.</p>}
            <a href={`/elections/districts/${electionSlug}`} className="mt-5 inline-block font-semibold text-primary hover:underline">Open the election-cycle district record →</a>
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Primary and authority sources</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a href={STATE_DISTRICT_OFFICIAL_LINKS.currentDistricts} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Texas Legislative Council — current redistricting plans →</a></li>
              <li><a href={STATE_DISTRICT_OFFICIAL_LINKS.whoRepresentsMe} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Texas Legislature — Who Represents Me? →</a></li>
              {district.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{source.label} →</a></li>)}
            </ul>
            <p className="mt-5 text-sm text-muted-foreground">Current member authority record reviewed {reviewed}. Address-level district membership should always be verified with the official Legislature lookup.</p>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-5">
            <h2 className="font-bold">Current office contact</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <DistrictFactCompact label="Member" value={district.currentMember ?? "Vacant"} />
              {district.memberPhone ? <DistrictFactCompact label="Phone" value={district.memberPhone} /> : null}
              {district.capitolAddress ? <DistrictFactCompact label="Capitol / published office" value={district.capitolAddress} /> : null}
              {district.districtAddress ? <DistrictFactCompact label="District office" value={district.districtAddress} /> : null}
            </dl>
          </section>

          {district.financeUrl ? <section className="rounded-xl border bg-card p-5"><h2 className="font-bold">Campaign finance</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Campaign-finance records belong to the current officeholder, not the district itself. Use the disclosure database for the latest filing.</p><a href={district.financeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">{district.financeLabel ?? "Official campaign-finance records"} →</a></section> : null}

          <section className="rounded-xl border bg-muted/30 p-5">
            <h2 className="font-bold">Government Graph</h2>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              <a href="/representatives" className="block text-primary hover:underline">Representative directory</a>
              <a href="/texas-legislature" className="block text-primary hover:underline">Texas Legislature</a>
              <a href="/bills" className="block text-primary hover:underline">Texas Bills</a>
              <a href="/laws/topics" className="block text-primary hover:underline">Texas Law Library</a>
              <a href="/policy" className="block text-primary hover:underline">Policy Trackers</a>
              <a href="/data/elections-results" className="block text-primary hover:underline">Texas Election Data</a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function DistrictFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border bg-card p-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">{label}</p><p className="mt-2 font-semibold">{value}</p></div>;
}

function DistrictFactCompact({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</dt><dd className="mt-1 whitespace-pre-line font-semibold">{value}</dd></div>;
}
