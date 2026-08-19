import { createFileRoute } from "@tanstack/react-router";
import { getStateDistrictDirectory } from "@/lib/state-districts.functions";
import { STATE_DISTRICT_PLANS, partyLabel } from "@/lib/state-districts";
import { buildSeo, SITE_URL, webPageJsonLd } from "@/lib/seo";

const TITLE = "Texas Legislative Districts | House & Senate District Directory";
const DESCRIPTION = "Permanent Keep TX Red directory for all 150 Texas House districts and 31 Texas Senate districts, with current members, official maps, legislation, election history, and primary sources.";

export const Route = createFileRoute("/districts")({
  loader: () => getStateDistrictDirectory(),
  head: () => {
    const seo = buildSeo({ title: TITLE, description: DESCRIPTION, path: "/districts" });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/districts", type: "CollectionPage" })) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: "Texas legislative districts", numberOfItems: 181, itemListElement: Array.from({ length: 181 }, (_, index) => ({ "@type": "ListItem", position: index + 1 })) }) },
      ],
    };
  },
  component: StateDistrictDirectoryPage,
});

function StateDistrictDirectoryPage() {
  const districts = Route.useLoaderData();
  const house = districts.filter((district) => district.chamber === "house");
  const senate = districts.filter((district) => district.chamber === "senate");

  return (
    <main className="bg-background">
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1180px] px-6 py-16 md:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">Keep TX Red Government Graph</p>
          <h1 className="mt-4 max-w-5xl font-display text-5xl leading-none tracking-tight md:text-7xl">Texas Legislative Districts</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">Permanent district identities that stay put when candidates, officeholders, and election cycles change.</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">Texas has {STATE_DISTRICT_PLANS.house.seats} House districts and {STATE_DISTRICT_PLANS.senate.seats} Senate districts. Each page connects the district to its current member, committee work, sponsored legislation, election history, official maps, campaign-finance records, and the rest of KTR's government coverage.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <a href="https://wrm.capitol.texas.gov/" target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-card p-5 transition hover:border-primary">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Official lookup</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">Who Represents Me?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Verify a Texas address, city, ZIP code, or county against the Legislature's official representation service.</p>
          </a>
          <a href="https://redistricting.capitol.texas.gov/Current-districts" target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-card p-5 transition hover:border-primary">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Official boundaries</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">Current District Maps</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Texas House {STATE_DISTRICT_PLANS.house.planId} and Senate {STATE_DISTRICT_PLANS.senate.planId} are the current state legislative plans.</p>
          </a>
          <a href="/representatives" className="rounded-xl border bg-card p-5 transition hover:border-primary">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Current officeholders</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight">Representative Profiles</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Move from a stable district to the current person holding the office and their authority record.</p>
          </a>
        </div>
      </section>

      <DistrictSection title="Texas House" description={`${house.length} single-member districts · Current plan ${STATE_DISTRICT_PLANS.house.planId}`} districts={house} />
      <DistrictSection title="Texas Senate" description={`${senate.length} single-member districts · Current plan ${STATE_DISTRICT_PLANS.senate.planId}`} districts={senate} />

      <section className="border-t bg-muted/25">
        <div className="mx-auto max-w-[1180px] px-6 py-14">
          <h2 className="font-display text-3xl tracking-tight">Why the district URL is permanent</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">Candidate pages are election-cycle records. Representative pages follow the person. These district pages follow the seat itself. When an officeholder changes, the district URL remains the same and KTR can attach the new representative, election result, legislative record, and future coverage without throwing away the district's history.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/elections/2026" className="rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary">Election Central</a>
            <a href="/texas-legislature" className="rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary">Texas Legislature</a>
            <a href="/policy" className="rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary">Policy Trackers</a>
            <a href="/data/elections-results" className="rounded-md border bg-background px-4 py-2.5 text-sm font-bold hover:border-primary">Election Data</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function DistrictSection({ title, description, districts }: { title: string; description: string; districts: ReturnType<typeof Route.useLoaderData> }) {
  return (
    <section className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="mb-6 border-b pb-4">
        <h2 className="font-display text-4xl tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {districts.map((district) => (
          <a key={district.slug} href={`/districts/${district.slug}`} className="group rounded-lg border bg-card p-4 transition hover:border-primary hover:shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">District {district.district}</p>
            <h3 className="mt-1 font-semibold group-hover:text-primary">{district.currentMember ?? "Vacant seat"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{district.vacant ? "Vacant" : partyLabel(district.party)}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
