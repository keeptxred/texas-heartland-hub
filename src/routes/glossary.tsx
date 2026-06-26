import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

type Term = { term: string; definition: string; seeAlso?: { label: string; href: string }[] };

const TERMS: Term[] = [
  { term: "Appraisal Review Board (ARB)", definition: "Citizen panel that hears property tax protests at each County Appraisal District. Its decisions can be appealed to state district court.", seeAlso: [{ label: "How CADs Work", href: "/news/county-appraisal-districts-explained" }] },
  { term: "Basic Allotment", definition: "The per-student dollar amount the Legislature sets as the funding floor in the Foundation School Program. The lever that drives nearly every ISD funding formula." },
  { term: "Biennium", definition: "The two-year budget cycle Texas operates on. The Legislature appropriates funds for a biennium during each regular session." },
  { term: "Calendars Committee", definition: "The Texas House committee that schedules which bills reach the floor and when. A primary chokepoint in the legislative process." },
  { term: "Chub", definition: "House slang for stalling a bill with extended debate as a procedural deadline approaches — essentially talking it to death." },
  { term: "Commissioners Court", definition: "A Texas county's governing body: the county judge plus four precinct commissioners. Sets the county budget and tax rate." },
  { term: "Compression", definition: "State buy-down of school district Maintenance & Operations property tax rates. The mechanism behind most recent property tax 'relief' packages." },
  { term: "Constitutional Amendment", definition: "A voter-approved change to the Texas Constitution. Requires a two-thirds vote of each legislative chamber plus a simple majority of statewide voters.", seeAlso: [{ label: "Amendment Process Guide", href: "/news/texas-constitutional-amendments-guide" }] },
  { term: "Conference Committee", definition: "Joint House-Senate panel that reconciles different versions of the same bill before a final vote." },
  { term: "County Appraisal District (CAD)", definition: "Independent local entity that sets market values on every property in the county for tax purposes." },
  { term: "ERCOT", definition: "Electric Reliability Council of Texas. Operates the electrical grid serving about 90% of Texas load.", seeAlso: [{ label: "ERCOT Explained", href: "/news/texas-grid-ercot-explained" }] },
  { term: "Foundation School Program (FSP)", definition: "The formula-driven mechanism that distributes state funding to Texas school districts." },
  { term: "Homestead Exemption", definition: "Property tax exemption that removes $100,000 from the value taxed by a school district on an owner-occupied primary residence.", seeAlso: [{ label: "Homestead Exemption Explained", href: "/news/homestead-exemption-explained" }] },
  { term: "Joint Resolution", definition: "A measure passed by both legislative chambers that proposes a constitutional amendment. Not subject to gubernatorial veto." },
  { term: "Local & Consent Calendar", definition: "House calendar for non-controversial bills, debated under time-limited rules to move them quickly." },
  { term: "M&O Rate", definition: "Maintenance & Operations property tax rate — the portion of an ISD tax rate that funds day-to-day operations (as opposed to debt service)." },
  { term: "MUD", definition: "Municipal Utility District. A special local government created to provide water, sewer, and drainage to areas outside city limits." },
  { term: "Open Primary", definition: "A primary election in which voters do not pre-register with a party. Texas runs open primaries — you choose your party ballot on election day." },
  { term: "Point of Order", definition: "Parliamentary objection alleging a procedural violation. Can kill a bill on technical grounds." },
  { term: "Recapture", definition: "The 'Robin Hood' system that redirects property tax revenue from property-wealthy ISDs to property-poor ISDs through the state.", seeAlso: [{ label: "School Finance Explained", href: "/news/texas-school-finance-explained" }] },
  { term: "Regular Session", definition: "The 140-day legislative session that begins the second Tuesday of January in odd-numbered years." },
  { term: "Rule of Capture", definition: "The Texas common-law doctrine under which groundwater belongs to the surface landowner, who may pump to beneficial use." },
  { term: "Special Session", definition: "A 30-day session called by the Governor, limited to subjects the Governor lists in the call." },
  { term: "Sunset Review", definition: "Periodic legislative audit that automatically abolishes a state agency unless the Legislature reauthorizes it." },
  { term: "Taxable Value", definition: "The value of a property after exemptions are subtracted from the market value. The number tax rates are actually applied to." },
];

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Texas Political Glossary — Keep TX Red" },
      { name: "description", content: "Plain-English definitions of Texas political terms: special session, sunset review, recapture, ERCOT, homestead exemption, and more." },
      { property: "og:title", content: "Texas Political Glossary — Keep TX Red" },
      { property: "og:description", content: "Definitions of the most common Texas political and policy terms." },
      { property: "og:url", content: "/glossary" },
    ],
    links: [{ rel: "canonical", href: "/glossary" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Texas Political Glossary",
          hasDefinedTerm: TERMS.map((t) => ({
            "@type": "DefinedTerm",
            name: t.term,
            description: t.definition,
          })),
        }),
      },
    ],
  }),
  component: GlossaryPage,
});

function GlossaryPage() {
  const grouped = TERMS.reduce<Record<string, Term[]>>((acc, t) => {
    const letter = t.term[0].toUpperCase();
    (acc[letter] ||= []).push(t);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  return (
    <>
      <PageHero
        eyebrow="Reference"
        title="Texas Political"
        highlight="Glossary"
        description="The terms Austin reporters never define — special session, sunset review, recapture, M&O, point of order, and the rest of the Capitol's working vocabulary."
      />
      <div className="mx-auto max-w-4xl px-4 py-14">
        <nav aria-label="Glossary index" className="flex flex-wrap gap-2 mb-10 border-b border-border pb-5">
          {letters.map((l) => (
            <a key={l} href={`#letter-${l}`} className="text-xs font-bold tracking-widest uppercase px-2 py-1 border border-border hover:border-primary hover:text-primary">
              {l}
            </a>
          ))}
        </nav>

        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} className="mb-10">
            <h2 className="font-display text-4xl text-primary border-b-2 border-foreground mb-5">{l}</h2>
            <dl className="space-y-6">
              {grouped[l].map((t) => (
                <div key={t.term}>
                  <dt className="font-display text-lg tracking-tight">{t.term}</dt>
                  <dd className="font-serif text-base text-muted-foreground leading-relaxed mt-1">{t.definition}</dd>
                  {t.seeAlso?.map((s) => (
                    <Link key={s.href} to={s.href} className="inline-block text-xs uppercase tracking-widest text-primary mt-2 hover:underline">
                      → {s.label}
                    </Link>
                  ))}
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}