import { Outlet, createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import {
  US_SENATORS,
  STATE_LEADERSHIP,
  US_HOUSE_DELEGATION,
  US_HOUSE_VACANCIES,
  TEXAS_HOUSE_MEMBERS,
  TEXAS_SENATE_MEMBERS,
  TEXAS_LEGISLATIVE_VACANCIES,
  representativeSlug,
  type Rep,
} from "@/data/representatives";

const ALL_REPRESENTATIVES = [
  ...US_SENATORS,
  ...STATE_LEADERSHIP,
  ...US_HOUSE_DELEGATION,
  ...TEXAS_SENATE_MEMBERS,
  ...TEXAS_HOUSE_MEMBERS,
];

export const Route = createFileRoute("/representatives")({
  head: () => ({
    meta: [
      { title: "Texas Representatives — Keep TX Red" },
      {
        name: "description",
        content:
          "Directory of Texas federal and statewide officials, with direct paths to all 150 Texas House districts and 31 Texas Senate districts.",
      },
      { property: "og:title", content: "Texas Representatives" },
      {
        property: "og:description",
        content: "Contact your Texas elected officials — federal and state.",
      },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/representatives" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Texas Representatives",
          url: "https://keeptxred.com/representatives",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: ALL_REPRESENTATIVES.length,
            itemListElement: ALL_REPRESENTATIVES.map((rep, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://keeptxred.com/representatives/${representativeSlug(rep.name)}`,
              item: {
                "@type": "Person",
                name: rep.name,
                jobTitle: rep.office,
                affiliation: {
                  "@type": "Organization",
                  name: rep.party === "R" ? "Republican Party" : "Democratic Party",
                },
                sameAs: [rep.website],
              },
            })),
          },
        }).replace(/</g, "\\u003c"),
      },
    ],
  }),
  component: RepresentativesPage,
});

function RepCard({ rep }: { rep: Rep }) {
  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        {rep.imageUrl ? (
          <img
            src={rep.imageUrl}
            alt=""
            loading="lazy"
            className="h-20 w-16 shrink-0 rounded object-cover"
          />
        ) : null}
        <div>
          <h3 className="font-display text-2xl tracking-tight leading-tight">{rep.name}</h3>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {rep.office}
            {rep.district ? ` • ${rep.district}` : ""}
          </p>
          <Link
            to="/representatives/$representativeSlug"
            params={{ representativeSlug: representativeSlug(rep.name) }}
            className="mt-3 inline-block text-sm font-bold text-primary hover:underline"
          >
            View authority profile →
          </Link>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 ${rep.party === "R" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
        >
          {rep.party}
        </span>
      </div>
      <dl className="mt-4 space-y-1 text-sm">
        {rep.phoneDC && (
          <div>
            <dt className="inline text-muted-foreground">DC:&nbsp;</dt>
            <dd className="inline font-mono">{rep.phoneDC}</dd>
          </div>
        )}
        {rep.phoneTX && (
          <div>
            <dt className="inline text-muted-foreground">TX:&nbsp;</dt>
            <dd className="inline font-mono">{rep.phoneTX}</dd>
          </div>
        )}
        <a
          href={rep.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 text-primary font-semibold text-xs uppercase tracking-widest hover:underline"
        >
          Official Office →
        </a>
      </dl>
    </div>
  );
}

function Section({ title, reps }: { title: string; reps: Rep[] }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground/20 pb-2 mb-6">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reps.map((r) => (
          <RepCard key={r.name} rep={r} />
        ))}
      </div>
    </section>
  );
}

function RepresentativesPage() {
  const { representativeSlug } = useParams({ strict: false }) as { representativeSlug?: string };

  if (representativeSlug) {
    return <Outlet />;
  }

  return (
    <>
      <PageHero
        eyebrow="Directory"
        title="TEXAS"
        highlight="REPRESENTATIVES"
        description="Every Texan deserves to know who speaks for them in Austin and Washington. Find your federal and state officials, then make the call."
      >
        <Link
          to="/find-representative"
          className="inline-block bg-primary text-primary-foreground px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary/90"
        >
          Find My Rep by Address →
        </Link>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <section className="mt-12">
          <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground/20 pb-2 mb-6">
            Texas Legislature — All 181 Districts
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              to="/texas-legislature/house"
              className="rounded-xl border bg-card p-6 hover:border-primary"
            >
              <h3 className="font-display text-2xl">Texas House of Representatives</h3>
              <p className="mt-2 text-muted-foreground">
                Browse resources for all 150 Texas House districts, members, elections, bills and
                committees.
              </p>
              <span className="mt-4 inline-block font-semibold text-primary">
                Open Texas House directory →
              </span>
            </Link>
            <Link
              to="/texas-legislature/senate"
              className="rounded-xl border bg-card p-6 hover:border-primary"
            >
              <h3 className="font-display text-2xl">Texas Senate</h3>
              <p className="mt-2 text-muted-foreground">
                Browse resources for all 31 Texas Senate districts, members, elections, bills and
                committees.
              </p>
              <span className="mt-4 inline-block font-semibold text-primary">
                Open Texas Senate directory →
              </span>
            </Link>
          </div>
        </section>
        <Section title="U.S. Senate" reps={US_SENATORS} />
        <Section title="Statewide Leadership" reps={STATE_LEADERSHIP} />
        <Section title="U.S. House — Complete Texas Delegation" reps={US_HOUSE_DELEGATION} />
        <Section title="Texas Senate — Current Members" reps={TEXAS_SENATE_MEMBERS} />
        <Section title="Texas House — Current Members" reps={TEXAS_HOUSE_MEMBERS} />
        {TEXAS_LEGISLATIVE_VACANCIES.length ? (
          <section className="mt-8 rounded-xl border border-dashed bg-muted/30 p-5">
            <h2 className="font-display text-2xl">Current Texas Legislature vacancies</h2>
            <div className="mt-3 space-y-2">
              {TEXAS_LEGISLATIVE_VACANCIES.map((vacancy) => (
                <p key={vacancy.district}>
                  <strong>{vacancy.district}</strong> — {vacancy.label}.{" "}
                  <a
                    href={vacancy.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    Verify with the official chamber →
                  </a>
                </p>
              ))}
            </div>
          </section>
        ) : null}
        {US_HOUSE_VACANCIES.length ? (
          <section className="mt-8 rounded-xl border border-dashed bg-muted/30 p-5">
            <h2 className="font-display text-2xl">Current House vacancies</h2>
            <div className="mt-3 space-y-2">
              {US_HOUSE_VACANCIES.map((vacancy) => (
                <p key={vacancy.district}>
                  <strong>{vacancy.district}</strong> — {vacancy.label}.{" "}
                  <a
                    href={vacancy.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    Verify with House.gov →
                  </a>
                </p>
              ))}
            </div>
          </section>
        ) : null}
        <p className="mt-10 text-xs text-muted-foreground italic">
          Membership and contact information are linked to official chamber records. For your
          specific district, use the{" "}
          <Link to="/find-representative" className="text-primary underline">
            district lookup tool
          </Link>
          .
        </p>
      </div>
    </>
  );
}
