import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  findRepresentativeBySlug,
  representativeSlug,
} from "@/data/representatives";
import {
  canonicalBillPath,
  getRepresentativeLegislation,
  SITE_URL,
} from "@/lib/bills";

export const Route = createFileRoute("/representatives/$representativeSlug")({
  loader: async ({ params }) => {
    const directoryRepresentative = findRepresentativeBySlug(params.representativeSlug);
    const legislation = await getRepresentativeLegislation(params.representativeSlug);
    if (!directoryRepresentative && !legislation.identity) throw notFound();
    return { directoryRepresentative, ...legislation };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return {};
    const representative = loaderData.directoryRepresentative;
    const identity = loaderData.identity;
    const name = representative?.name ?? identity?.sponsor_name ?? "Texas Representative";
    const office = representative?.office ?? identity?.chamber ?? "Texas legislator";
    const district = representative?.district ?? identity?.district ?? null;
    const canonical = `${SITE_URL}/representatives/${params.representativeSlug}`;
    const description = `Authority profile for ${name}, including office, district, official contact information, sponsored Texas legislation, election links, and primary sources.`;
    const graph = [
      {
        "@type": "ProfilePage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${name} — ${office}`,
        description,
        mainEntity: { "@id": `${canonical}#person` },
      },
      {
        "@type": "Person",
        "@id": `${canonical}#person`,
        name,
        jobTitle: office,
        url: canonical,
        ...(district ? { workLocation: { "@type": "AdministrativeArea", name: district } } : {}),
        ...(representative
          ? {
              affiliation: {
                "@type": "Organization",
                name: representative.party === "R" ? "Republican Party" : "Democratic Party",
              },
              sameAs: [representative.website],
            }
          : {}),
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#sponsored-legislation`,
        name: `Sponsored legislation connected to ${name}`,
        numberOfItems: loaderData.bills.length,
        itemListElement: loaderData.bills.map((bill: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}${canonicalBillPath(bill)}`,
          name: `${bill.bill_identifier}: ${bill.caption}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Texas representatives",
            item: `${SITE_URL}/representatives`,
          },
          { "@type": "ListItem", position: 3, name, item: canonical },
        ],
      },
    ];
    return {
      meta: [
        { title: `${name} — ${office} | KeepTXRed` },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: `${name} — ${office}` },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "profile" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
            /</g,
            "\\u003c",
          ),
        },
      ],
    };
  },
  component: RepresentativeProfile,
});

function RepresentativeProfile() {
  const { representativeSlug: slug } = Route.useParams();
  const { directoryRepresentative: rep, identity, bills } = Route.useLoaderData();
  const name = rep?.name ?? identity?.sponsor_name ?? "Texas Representative";
  const office = rep?.office ?? chamberLabel(identity?.chamber);
  const district = rep?.district ?? identity?.district ?? null;
  const party = rep?.party ?? identity?.party ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/">Home</Link> / <Link to="/representatives">Representatives</Link> / {name}
      </nav>

      <header className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Representative authority profile
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {[office, district, partyLabel(party)].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {rep ? (
            <a
              href={rep.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Official office website
            </a>
          ) : null}
          <a
            href={`/elections/candidates?q=${encodeURIComponent(name)}`}
            className="rounded-md border px-4 py-2.5 text-sm font-bold"
          >
            Related election records
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-8">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Office and district</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileFact label="Office" value={office} />
              <ProfileFact label="District" value={district ?? "Statewide"} />
              <ProfileFact label="Party" value={partyLabel(party) ?? "Not published"} />
              <ProfileFact label="Profile identifier" value={representativeSlug(name)} />
            </dl>
            {district ? (
              <a
                href={`/elections/districts/${districtRouteSlug(district)}`}
                className="mt-5 inline-block font-semibold text-primary hover:underline"
              >
                View district election authority page →
              </a>
            ) : (
              <a href="/elections/statewide" className="mt-5 inline-block font-semibold text-primary hover:underline">
                View statewide elections →
              </a>
            )}
          </section>

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Sponsored legislation</h2>
            <p className="mt-2 text-muted-foreground">
              Bills are connected through normalized sponsor records in the Texas Bills platform.
            </p>
            {bills.length ? (
              <div className="mt-5 space-y-3">
                {bills.map((bill: any) => (
                  <a
                    key={bill.id}
                    href={canonicalBillPath(bill)}
                    className="block rounded-lg border p-4 hover:border-primary"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <strong className="text-primary">{bill.bill_identifier}</strong>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {bill.current_status_label}
                      </span>
                    </div>
                    <p className="mt-2 font-medium">{bill.caption}</p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-lg border border-dashed p-5 text-muted-foreground">
                No sponsored bills are currently matched to this profile.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-5">
            <h2 className="font-bold">Official contact</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {rep?.phoneDC ? <ProfileFact label="Washington" value={rep.phoneDC} /> : null}
              {rep?.phoneTX ? <ProfileFact label="Texas" value={rep.phoneTX} /> : null}
            </dl>
          </section>
          <section className="rounded-xl border bg-muted/30 p-5">
            <h2 className="font-bold">Related authority pages</h2>
            <div className="mt-4 space-y-3 text-sm font-semibold">
              <a href="/bills" className="block text-primary hover:underline">Texas Bills</a>
              <a href="/texas-legislature" className="block text-primary hover:underline">Texas Legislature</a>
              <a href="/find-representative" className="block text-primary hover:underline">Find Your Representative</a>
              <a href="/contact-legislators" className="block text-primary hover:underline">Contact Legislators</a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function chamberLabel(chamber?: string | null) {
  if (chamber === "house") return "Texas House";
  if (chamber === "senate") return "Texas Senate";
  return "Texas elected official";
}

function partyLabel(party?: string | null) {
  if (!party) return null;
  if (party === "R" || party.toLowerCase() === "republican") return "Republican";
  if (party === "D" || party.toLowerCase() === "democratic") return "Democratic";
  return party;
}

function districtRouteSlug(district: string) {
  const congressional = /^TX-(\d+)/i.exec(district);
  if (congressional) return `congressional-district-${congressional[1]}`;
  const house = /house\s*(?:district)?\s*(\d+)/i.exec(district);
  if (house) return `texas-house-district-${house[1]}`;
  const senate = /senate\s*(?:district)?\s*(\d+)/i.exec(district);
  if (senate) return `texas-senate-district-${senate[1]}`;
  return district.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
