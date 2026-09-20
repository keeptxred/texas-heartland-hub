import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findRepresentativeBySlug, representativeSlug } from "@/data/representatives";
import { ARTICLES, isPublished } from "@/data/articles";
import {
  getHouseCommitteeAssignments,
  getRepresentativeAuthority,
} from "@/data/representative-authority";
import { canonicalBillPath, getRepresentativeLegislation, SITE_URL } from "@/lib/bills";
import { getRelatedAuthorityContent } from "@/lib/authority-relationships";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { RelatedAuthorityContent } from "@/components/authority/RelatedAuthorityContent";
import { RepresentativeLegislativeIntelligence } from "@/components/representative-legislative-intelligence";

export const Route = createFileRoute("/representatives/$representativeSlug")({
  loader: async ({ params }) => {
    const directoryRepresentative = findRepresentativeBySlug(params.representativeSlug);
    const legislation = await getRepresentativeLegislation(params.representativeSlug);
    const authority = getRepresentativeAuthority(params.representativeSlug);
    if (!directoryRepresentative && !legislation.identity) throw notFound();
    const terms = (
      authority?.newsKeywords ?? (directoryRepresentative ? [directoryRepresentative.name] : [])
    ).map((term) => term.toLowerCase());
    const news = ARTICLES.filter((article) => isPublished(article) && isStaticArticleIndexable(article))
      .filter((article) => {
        const haystack =
          `${article.title} ${article.dek} ${(article.topics ?? []).join(" ")}`.toLowerCase();
        return terms.some((term) => haystack.includes(term));
      })
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, 6);
    const relatedContent = await getRelatedAuthorityContent("representative", params.representativeSlug);
    return { directoryRepresentative, authority, news, relatedContent, ...legislation };
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
              sameAs: [
                representative.website,
                ...(loaderData.authority?.sources.map((source: any) => source.url) ?? []),
              ],
            }
          : {}),
        ...(loaderData.authority
          ? {
              description: loaderData.authority.biography,
              alumniOf: loaderData.authority.education.map((name) => ({
                "@type": "EducationalOrganization",
                name,
              })),
              knowsAbout: [
                "Texas government",
                "Texas elections",
                "Public policy",
                ...loaderData.authority.committees,
              ],
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
        {
          name: "robots",
          content: representative
            ? "index,follow,max-image-preview:large"
            : "noindex,follow,max-image-preview:large",
        },
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
  const { directoryRepresentative: rep, identity, authority, bills, news, relatedContent } = Route.useLoaderData();
  const name = rep?.name ?? identity?.sponsor_name ?? "Texas Representative";
  const office = rep?.office ?? chamberLabel(identity?.chamber);
  const district = rep?.district ?? identity?.district ?? null;
  const party = rep?.party ?? identity?.party ?? null;
  const houseCommittees = getHouseCommitteeAssignments(slug);
  const profileAuthority =
    authority ??
    (rep?.office === "U.S. House"
      ? {
          biography: `${name} serves as the United States representative for ${district ?? "a Texas congressional district"}. This profile connects the member's official office, current House committee assignments, federal campaign-finance records, district election coverage, sponsored legislation and related KeepTXRed reporting.`,
          career: [
            `Current member of the U.S. House of Representatives for ${district ?? "Texas"}.`,
          ],
          education: [] as string[],
          committees: houseCommittees.map((committee) => `House Committee on ${committee}.`),
          electionHistory: [] as { year: string; result: string }[],
          districtOverview: `${district ?? "This congressional district"} is represented in the U.S. House. District boundaries and address-level representation should be verified through the official House lookup.`,
          financeUrl: `https://www.fec.gov/data/candidates/?search=${encodeURIComponent(name)}`,
          financeLabel: "Federal Election Commission candidate records",
          sources: [
            { label: "Official congressional office", url: rep.website },
            {
              label: "Official House directory and committee assignments",
              url: "https://www.house.gov/representatives",
            },
          ],
          reviewedAt: "2026-07-30",
        }
      : null);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/">Home</Link> / <Link to="/representatives">Representatives</Link> / {name}
      </nav>

      <header className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
        {rep?.imageUrl ? (
          <img
            src={rep.imageUrl}
            alt={`${name} official portrait`}
            className="mb-6 h-40 w-32 rounded-lg border object-cover"
          />
        ) : null}
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
        {profileAuthority ? (
          <nav
            className="mt-6 flex flex-wrap gap-2 border-t pt-5"
            aria-label={`${name} profile sections`}
          >
            {[
              "Biography",
              "Career",
              "Education",
              "Committees",
              "Elections",
              "Activity",
              "Legislation",
              "Finance",
              "District",
              "News",
              "Sources",
            ].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold hover:bg-primary hover:text-primary-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-8">
          {profileAuthority ? (
            <>
              <AuthoritySection id="biography" title="Biography">
                <p className="text-lg leading-8">{profileAuthority.biography}</p>
              </AuthoritySection>
              <AuthoritySection id="career" title="Career">
                <AuthorityList items={profileAuthority.career} />
              </AuthoritySection>
              <AuthoritySection id="education" title="Education">
                {profileAuthority.education.length ? (
                  <AuthorityList items={profileAuthority.education} />
                ) : (
                  <VerificationPending source={rep?.website} field="Education history" />
                )}
              </AuthoritySection>
              <AuthoritySection id="committees" title="Committee assignments and governing role">
                <AuthorityList items={profileAuthority.committees} />
              </AuthoritySection>
              <AuthoritySection id="elections" title="Election history">
                {profileAuthority.electionHistory.length ? (
                  <ol className="space-y-4">
                    {profileAuthority.electionHistory.map((event: any) => (
                      <li
                        key={`${event.year}-${event.result}`}
                        className="grid gap-1 border-l-2 border-primary pl-4 sm:grid-cols-[5rem_1fr]"
                      >
                        <strong>{event.year}</strong>
                        <span className="text-muted-foreground">{event.result}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <VerificationPending
                    source={`/elections/candidates?q=${encodeURIComponent(name)}`}
                    field="Election-history summary"
                  />
                )}
                <a
                  href={`/elections/candidates?q=${encodeURIComponent(name)}`}
                  className="mt-5 inline-block font-semibold text-primary hover:underline"
                >
                  Search related election records →
                </a>
              </AuthoritySection>
            </>
          ) : null}

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Office and district</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileFact label="Office" value={office} />
              <ProfileFact label="District" value={district ?? "Statewide"} />
              <ProfileFact label="Party" value={partyLabel(party) ?? "Not published"} />
              {rep?.phoneTX ? <ProfileFact label="Capitol phone" value={rep.phoneTX} /> : null}
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
              <a
                href="/elections/statewide"
                className="mt-5 inline-block font-semibold text-primary hover:underline"
              >
                View statewide elections →
              </a>
            )}
          </section>

          <RepresentativeLegislativeIntelligence
            name={name}
            bills={bills}
            relatedContent={relatedContent}
          />

          <section className="rounded-xl border bg-card p-6">
            <span id="legislation" className="scroll-mt-24" />
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

          {profileAuthority ? (
            <>
              <AuthoritySection id="finance" title="Campaign finance">
                <p className="leading-7 text-muted-foreground">
                  Campaign totals and filings can change throughout an election cycle. Use the
                  official disclosure database for the current record rather than a cached dollar
                  amount.
                </p>
                <a
                  href={profileAuthority.financeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-semibold text-primary hover:underline"
                >
                  {profileAuthority.financeLabel} →
                </a>
              </AuthoritySection>
              <AuthoritySection id="district" title="District information">
                <p className="leading-7">{profileAuthority.districtOverview}</p>
                <a
                  href={
                    district
                      ? `/elections/districts/${districtRouteSlug(district)}`
                      : "/elections/statewide"
                  }
                  className="mt-4 inline-block font-semibold text-primary hover:underline"
                >
                  {district ? "District" : "Statewide"} election authority page →
                </a>
              </AuthoritySection>
              <AuthoritySection id="news" title={`Related ${name} news`}>
                {news.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {news.map((article: any) => (
                      <a
                        key={article.slug}
                        href={`/news/${article.slug}`}
                        className="rounded-lg border p-4 hover:border-primary"
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-primary">
                          {article.category}
                        </p>
                        <h3 className="mt-2 font-bold">{article.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                          {article.dek}
                        </p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No matching published KeepTXRed articles are currently linked.
                  </p>
                )}
              </AuthoritySection>
              <AuthoritySection id="sources" title="Primary sources">
                <ul className="space-y-3">
                  {profileAuthority.sources.map((source: any) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        {source.label} →
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-muted-foreground">
                  Authority review completed{" "}
                  {new Date(`${profileAuthority.reviewedAt}T12:00:00`).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  .
                </p>
              </AuthoritySection>
            </>
          ) : null}
          <RelatedAuthorityContent items={relatedContent} />
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
              <a href="/bills" className="block text-primary hover:underline">
                Texas Bills
              </a>
              <a href="/texas-legislature" className="block text-primary hover:underline">
                Texas Legislature
              </a>
              <a href="/find-representative" className="block text-primary hover:underline">
                Find Your Representative
              </a>
              <a href="/contact-legislators" className="block text-primary hover:underline">
                Contact Legislators
              </a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function AuthoritySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border bg-card p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function AuthorityList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7">
          <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function VerificationPending({ source, field }: { source?: string; field: string }) {
  return (
    <p className="rounded-lg border border-dashed p-4 text-sm leading-6 text-muted-foreground">
      {field} is not summarized here until it passes primary-source verification.
      {source ? (
        <>
          {" "}
          <a href={source} className="font-semibold text-primary hover:underline">
            Consult the official source →
          </a>
        </>
      ) : null}
    </p>
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
  return district
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
