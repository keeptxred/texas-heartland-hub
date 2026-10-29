import { Outlet, createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
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
  TEXAS_ROSTER_REVIEWED_AT,
  type Rep,
  verifiedOfficialPortraitUrl,
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
    // Canonical intentionally omitted: this is the layout route for
    // /representatives/$representativeSlug. A canonical here was emitted on
    // every representative page, pointing all 250+ detail pages at the
    // directory. The leaf routes set their own self-canonical.
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
  const portrait = verifiedOfficialPortraitUrl(rep.imageUrl);
  return (
    <div className="border-2 border-foreground/10 bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        {portrait ? (
          <img
            src={portrait}
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
  const [query, setQuery] = useState("");
  const [chamber, setChamber] = useState("all");
  const sections = [
    { key: "us-senate", title: "U.S. Senate", reps: US_SENATORS },
    { key: "statewide", title: "Statewide Leadership", reps: STATE_LEADERSHIP },
    { key: "us-house", title: "U.S. House — Complete Texas Delegation", reps: US_HOUSE_DELEGATION },
    { key: "texas-senate", title: "Texas Senate — Current Members", reps: TEXAS_SENATE_MEMBERS },
    { key: "texas-house", title: "Texas House — Current Members", reps: TEXAS_HOUSE_MEMBERS },
  ];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSections = sections
    .filter((section) => chamber === "all" || section.key === chamber)
    .map((section) => ({
      ...section,
      reps: section.reps.filter((rep) =>
        !normalizedQuery ||
        [rep.name, rep.office, rep.district ?? "", `${rep.office} District ${rep.district?.match(/\d+/)?.[0] ?? ""}`].some((text) => text.toLowerCase().includes(normalizedQuery))
      ),
    }));
  const matchCount = filteredSections.reduce((total, section) => total + section.reps.length, 0);

  const { representativeSlug } = useParams({ strict: false }) as { representativeSlug?: string };

  if (representativeSlug) {
    return <Outlet />;
  }

  return (
    <>
      {/* Self-canonical for the directory itself. It lives here rather than in
          head() because this route is also the layout for detail pages. */}
      <Helmet>
        <link rel="canonical" href="https://keeptxred.com/representatives" />
      </Helmet>
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
          Find My Districts and Current Representatives →
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
        <section className="mt-10 border-2 border-foreground/10 bg-card p-5" aria-label="Search current representatives">
          <h2 className="font-display text-2xl">Find a current officeholder</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(12rem,1fr)]">
            <div>
              <label htmlFor="representative-search" className="mb-2 block text-xs font-bold uppercase tracking-wide">Search by name, office or district</label>
              <input id="representative-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. Texas House District 1, Brett Ligon"
                className="w-full rounded border border-foreground/20 bg-background px-4 py-3" />
            </div>
            <div>
              <label htmlFor="representative-chamber" className="mb-2 block text-xs font-bold uppercase tracking-wide">Office</label>
              <select id="representative-chamber" value={chamber} onChange={(event) => setChamber(event.target.value)}
                className="w-full rounded border border-foreground/20 bg-background px-4 py-3">
                <option value="all">All offices</option>
                <option value="us-senate">U.S. Senate</option>
                <option value="us-house">U.S. House</option>
                <option value="texas-senate">Texas Senate</option>
                <option value="texas-house">Texas House</option>
                <option value="statewide">Statewide leadership</option>
              </select>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground" role="status" aria-live="polite">{matchCount} current officeholders match. Vacancies are listed separately below.</p>
        </section>
        <div id="representative-results">
          {filteredSections.map((section) => section.reps.length ? <Section key={section.key} title={section.title} reps={section.reps} /> : null)}
          {!matchCount ? <p className="mt-8 rounded border border-dashed p-5 text-muted-foreground">No current officeholder matched. A vacant district will not appear as a current person; check the vacancies and official district directory below.</p> : null}
        </div>
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
            <h2 className="font-display text-2xl">Current U.S. House vacancies</h2>
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
        <p className="mt-8 text-xs text-muted-foreground">
          Texas legislative roster reviewed {TEXAS_ROSTER_REVIEWED_AT}. This date reflects the last generated official-source sync, not continuous live verification.
          Status can change between refreshes. Verify time-sensitive membership with the <a href="https://house.texas.gov/members" className="underline text-primary">Texas House</a>, <a href="https://senate.texas.gov/members.php" className="underline text-primary">Texas Senate</a> and <a href="https://www.house.gov/representatives" className="underline text-primary">U.S. House</a>.
        </p>
        <p className="mt-5 text-xs text-muted-foreground italic">
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
