import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findRepresentativeBySlug, representativeSlug, verifiedOfficialPortraitUrl } from "@/data/representatives";
import { ARTICLES, isPublished } from "@/data/articles";
import { getRepresentativeAuthorityRouteData } from "@/lib/representative-authority-route.functions";
import { canonicalBillPath, getRepresentativeLegislation, SITE_URL } from "@/lib/bills";
import { getRelatedAuthorityContent } from "@/lib/authority-relationships";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { RelatedAuthorityContent } from "@/components/authority/RelatedAuthorityContent";
import { RepresentativeLegislativeIntelligence } from "@/components/representative-legislative-intelligence";
import { RepresentativePrimarySourceResearch } from "@/components/representative-primary-source-research";
import { RepresentativeSpeakerActivity } from "@/components/representative-speaker-activity";

export const Route = createFileRoute("/representatives/$representativeSlug")({
  loader: async ({ params }) => {
    const directoryRepresentative = findRepresentativeBySlug(params.representativeSlug);
    // Keep previously verified historical research accessible during a temporary
    // data-service failure. Never infer that a missing response means zero bills.
    let legislation: Awaited<ReturnType<typeof getRepresentativeLegislation>> | null = null;
    try {
      legislation = await getRepresentativeLegislation(params.representativeSlug);
    } catch {
      legislation = null;
    }
    if (!directoryRepresentative && !legislation?.identity) throw notFound();
    const { authority, houseCommittees, certification, primarySourceResearch, speakerActivityResearch } =
      await getRepresentativeAuthorityRouteData({
        data: {
          slug: params.representativeSlug,
          temporaryDataOutage: legislation === null,
        },
      });
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
    const relatedContent = await getRelatedAuthorityContent(
      "representative", params.representativeSlug
    ).catch(() => []);
    return {
      directoryRepresentative, authority, houseCommittees, news, relatedContent,
      identity: legislation?.identity ?? null,
      bills: legislation?.bills ?? [],
      certification, primarySourceResearch, speakerActivityResearch,
      legislationUnavailable: legislation === null,
    };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return {};
    const representative = loaderData.directoryRepresentative;
    const identity = loaderData.identity;
    const former = representative?.status === "former";
    const name = representative?.name ?? identity?.sponsor_name ?? "Texas Representative";
    const office = representative?.office ?? identity?.chamber ?? "Texas legislator";
    const district = representative?.district ?? identity?.district ?? null;
    const canonical = `${SITE_URL}/representatives/${params.representativeSlug}`;
    const description = former
      ? `Historical profile for former Texas legislator ${name}. This person does not currently hold the seat; verify its status with the Texas House.`
      : `Government record for ${name}: ${office}${district ? `, ${district}` : ""}, official sources, contact details and research coverage.`;
    const graph = [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${name} — ${office}`,
        description,
        about: { "@id": `${canonical}#person` },
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
              alumniOf: loaderData.authority.education.filter((name) =>
                !/consult the linked official biography|no independent credential claim/i.test(name)
              ).map((name) => ({
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
        { title: `${name} — ${office}${district ? ` · ${district}` : ""} | KeepTXRed` },
        { name: "description", content: description },
        {
          name: "robots",
          content: loaderData.certification.state === "AUTHORITY_READY"
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
  const { directoryRepresentative: rep, identity, authority, bills, news, relatedContent, certification, primarySourceResearch, speakerActivityResearch, legislationUnavailable } = Route.useLoaderData();
  const portrait = verifiedOfficialPortraitUrl(rep?.imageUrl);
  const former = rep?.status === "former";
  const federal = rep?.office.startsWith("U.S.") ?? false;
  const name = rep?.name ?? identity?.sponsor_name ?? "Texas Representative";
  const office = rep?.office ?? chamberLabel(identity?.chamber);
  const district = rep?.district ?? identity?.district ?? null;
  const party = rep?.party ?? identity?.party ?? null;
  const profileAuthority = authority;
  const hasPrimarySourceResearch = primarySourceResearch.length > 0;
  const hasSpeakerActivity = speakerActivityResearch.length > 0;
  const profileEducation = profileAuthority?.education.filter(
    (item) => !/consult the linked official biography|no independent credential claim/i.test(item)
  ) ?? [];
  const profileElections = profileAuthority?.electionHistory.filter(
    (item) => !/current recorded texas .* service began|serving during the 89th/i.test(item.result)
  ) ?? [];
  const profileSections = [
    "Biography",
    ...(profileAuthority?.career.length ? ["Career"] : []),
    ...(profileEducation.length ? ["Education"] : []),
    ...(profileAuthority?.committees.length ? ["Committees"] : []),
    ...(profileElections.length ? ["Elections"] : []),
    ...(hasPrimarySourceResearch || hasSpeakerActivity || (!federal && bills.length) ? ["Activity"] : []),
    ...(!hasPrimarySourceResearch && !hasSpeakerActivity && (federal || bills.length) ? ["Legislation"] : []),
    ...(profileAuthority?.financeUrl ? ["Finance"] : []),
    ...(profileAuthority?.districtOverview ? ["District"] : []),
    ...(news.length ? ["News"] : []),
    ...(profileAuthority?.sources.length ? ["Sources"] : []),
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/">Home</Link> / <Link to="/representatives">Representatives</Link> / {name}
      </nav>

      <header className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
        {portrait ? (
          <img
            src={portrait}
            alt={`${name} official portrait`}
            className="mb-6 h-40 w-32 rounded-lg border object-cover"
          />
        ) : null}
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {former ? "Historical representative record" : "Public government research record"}
        </p>
        {former ? (
          <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-6">
            <strong>Former officeholder — not listed as the current representative.</strong>
            Verify the current seat status and constituent-services contact through the official chamber roster.
          </div>
        ) : null}
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {[office, district, partyLabel(party)].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Research coverage: {certification.state === "AUTHORITY_READY"
            ? (hasSpeakerActivity ? "Official House Speaker actions and dated statements are documented below; these are not personal sponsorship records." : "Source-backed historical Texas legislative research is available below.")
            : "This page is being reviewed for completeness and source verification."}
          {" "}This is a KeepTXRed editorial classification, not an assessment from Google.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {rep ? (
            <a
              href={rep.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              {former ? "View current district office" : "Official office website"}
            </a>
          ) : null}
          <a
            href="https://www.sos.state.tx.us/elections/historical/elections-results-archive.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border px-4 py-2.5 text-sm font-bold"
          >
            Official Texas election results archive
          </a>
        </div>
        {profileAuthority ? (
          <nav
            className="mt-6 flex flex-wrap gap-2 border-t pt-5"
            aria-label={`${name} profile sections`}
          >
            {profileSections.map((label) => (
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
              {profileEducation.length ? (
                <AuthoritySection id="education" title="Education">
                  <AuthorityList items={profileEducation} />
                </AuthoritySection>
              ) : null}
              {profileAuthority.committees.length ? (
                <AuthoritySection id="committees" title="Committee assignments and governing role">
                  <AuthorityList items={profileAuthority.committees} />
                </AuthoritySection>
              ) : null}
              {profileElections.length ? (
              <AuthoritySection id="elections" title="Election history">
                {profileElections.length ? (
                  <ol className="space-y-4">
                    {profileElections.map((event: any) => (
                      <li
                        key={`${event.year}-${event.result}`}
                        className="grid gap-1 border-l-2 border-primary pl-4 sm:grid-cols-[5rem_1fr]"
                      >
                        <strong>{event.year}</strong>
                        <span className="text-muted-foreground">{event.result}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                <a
                  href="https://www.sos.state.tx.us/elections/historical/elections-results-archive.shtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block font-semibold text-primary hover:underline"
                >
                  Verify election results in the official state archive →
                </a>
              </AuthoritySection>
              ) : null}
            </>
          ) : null}

          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">Office and district</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileFact label="Office" value={office} />
              <ProfileFact label="District" value={district ?? "Statewide"} />
              <ProfileFact label="Party" value={partyLabel(party) ?? "Not published"} />
              {rep?.phoneTX ? <ProfileFact label="Texas office phone (verify)" value={rep.phoneTX} /> : null}
              <ProfileFact label="Profile identifier" value={representativeSlug(name)} />
            </dl>
            {district ? (
              <a
                href={districtResearchPath(office, district)}
                className="mt-5 inline-block font-semibold text-primary hover:underline"
              >
                View official district information →
              </a>
            ) : (
              <a
                href={federal ? "https://www.senate.gov/states/TX/intro.htm" : "/representatives"}
                className="mt-5 inline-block font-semibold text-primary hover:underline"
              >
                {federal ? "Official Texas Senate delegation →" : "View Texas representatives directory →"}
              </a>
            )}
          </section>

          {hasSpeakerActivity ? (
            <RepresentativeSpeakerActivity records={speakerActivityResearch} />
          ) : hasPrimarySourceResearch ? (
            <RepresentativePrimarySourceResearch name={name} records={primarySourceResearch} />
          ) : federal ? (
            <section className="rounded-xl border bg-card p-6">
              <h2 className="text-2xl font-bold">Federal legislative activity</h2>
              <p className="mt-3 text-muted-foreground">KTR's Texas legislative graph does not cover a federal representative's complete congressional sponsorship or voting history. A zero here would be misleading.</p>
              <a href="https://www.congress.gov/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-primary hover:underline">Search Congress.gov for federal bills and activity →</a>
            </section>
          ) : !former && bills.length ? (
            <RepresentativeLegislativeIntelligence name={name} bills={bills} relatedContent={relatedContent} />
          ) : null}

          {!hasPrimarySourceResearch && !hasSpeakerActivity ? <section className="rounded-xl border bg-card p-6">
            <span id="legislation" className="scroll-mt-24" />
            <h2 className="text-2xl font-bold">Sponsored legislation</h2>
            <p className="mt-2 text-muted-foreground">
              Bills are connected through normalized sponsor records in the Texas Bills platform.
            </p>
            {federal ? (
              <p className="mt-5 rounded-lg border border-dashed p-5 text-muted-foreground">
                Federal sponsored legislation is not indexed in this Texas-only bills collection. Search Congress.gov for the complete official federal record.
              </p>
            ) : bills.length ? (
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
                No Texas-sponsored bills are currently matched to this profile in KTR's indexed records. This does not imply no legislative activity.
              </p>
            )}
          </section> : null}

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
                      ? districtResearchPath(office, district)
                      : federal ? "https://www.senate.gov/states/TX/intro.htm" : "/representatives"
                  }
                  className="mt-4 inline-block font-semibold text-primary hover:underline"
                >
                  {district ? "Official district information" : "Texas office directory"} →
                </a>
              </AuthoritySection>
              {news.length ? (
              <AuthoritySection id="news" title={`Related ${name} news`}>
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
              </AuthoritySection>
              ) : null}
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
                  Profile source review recorded{" "}
                  {new Date(`${profileAuthority.reviewedAt}T12:00:00`).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  . This is the recorded review date, not a guarantee that all information is current. Confirm time-sensitive assignments, offices, and election details using the linked official sources.
                </p>
              </AuthoritySection>
            </>
          ) : null}
          {legislationUnavailable ? (
            <p role="status" className="rounded-lg border p-4 text-sm text-muted-foreground">
              Live bill database temporarily unavailable. Historical source-linked research, where
              published, remains visible; absence of a live response is not a zero bill count.
            </p>
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

function districtResearchPath(office: string, district: string): string {
  const house = /house\\s*(?:district)?\\s*(\\d+)/i.exec(district);
  const senate = /senate\\s*(?:district)?\\s*(\\d+)/i.exec(district);
  if (office === "Texas House" && house) return `/districts/texas-house-${house[1]}`;
  if (office === "Texas Senate" && senate) return `/districts/texas-senate-${senate[1]}`;
  // Our /districts index currently covers Texas state legislative districts.
  // Do not pretend federal congressional districts have KTR authority pages.
  return "https://www.house.gov/representatives/find-your-representative";
}
