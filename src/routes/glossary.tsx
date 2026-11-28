import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";
import { buildSeo, SITE_URL } from "@/lib/seo";

type Term = { term: string; definition: string; seeAlso?: { label: string; href: string }[] };

const TLC_GLOSSARY = "https://tlc.texas.gov/Glossary";
const LRL_SESSIONS = "https://lrl.texas.gov/sessions/sessionyears.cfm";
const COMPTROLLER_PROPERTY_TAX = "https://comptroller.texas.gov/taxes/property-tax/basics.php";
const COMPTROLLER_EXEMPTIONS = "https://comptroller.texas.gov/taxes/property-tax/exemptions/";
const TEA_SCHOOL_FINANCE = "https://tea.texas.gov/about-tea/state-funding/state-funding-manuals/school-finance-topics-one-page-descriptions";
const GLOSSARY_TITLE = "Texas Political Glossary";
const GLOSSARY_DESCRIPTION =
  "Plain-English definitions of Texas political terms: special session, sunset review, recapture, ERCOT, homestead exemption, and more.";

const SOS_AFFILIATION = "https://www.sos.state.tx.us/elections/laws/advisory2020-05.shtml";
const SUNSET_PROCESS = "https://www.sunset.texas.gov/how-sunset-works";
const TWDB_GROUNDWATER = "https://www.twdb.texas.gov/groundwater/faq/faqgwm.asp";
const TERMS: Term[] = [
  {
    term: "Appraisal Review Board (ARB)",
    definition:
      "Citizen panel that hears property tax protests at each County Appraisal District. Its decisions can be appealed to state district court.",
    seeAlso: [{ label: "How CADs Work", href: "https://texasdefined.com/learn/appraisal-districts" }],
  },
  {
    term: "Basic Allotment",
    definition:
      "A base amount used in state school-finance formulas, with adjustments and separate allotments. It is not the total per-student funding or an individual payment to a family.",
  },
  {
    term: "Biennium",
    definition:
      "The two-year budget cycle Texas operates on. The Legislature appropriates funds for a biennium during each regular session.",
  },
  {
    term: "Calendars Committee",
    definition:
      "The Texas House committee that schedules which bills reach the floor and when. A primary chokepoint in the legislative process.",
  },
  {
    term: "Chub",
    definition:
      "House slang for stalling a bill with extended debate as a procedural deadline approaches — essentially talking it to death.",
  },
  {
    term: "Commissioners Court",
    definition:
      "A Texas county's governing body: the county judge plus four precinct commissioners. Sets the county budget and tax rate.",
  },
  {
    term: "Compression",
    definition:
      "State buy-down of school district Maintenance & Operations property tax rates. The mechanism behind most recent property tax 'relief' packages.",
  },
  {
    term: "Constitutional Amendment",
    definition:
      "A change to the Texas Constitution proposed by two-thirds of the elected members of each legislative chamber and approved by a majority of voters voting on that amendment.",
    seeAlso: [
      { label: "Amendment Process Guide", href: "/laws/constitutional-amendments" },
    ],
  },
  {
    term: "Conference Committee",
    definition:
      "Joint House-Senate panel that reconciles different versions of the same bill before a final vote.",
  },
  {
    term: "County Appraisal District (CAD)",
    definition:
      "Local appraisal entity responsible for appraising taxable property under state law. Taxable values may differ from market values, and taxing units set tax rates separately.",
  },
  {
    term: "ERCOT",
    definition:
      "Electric Reliability Council of Texas. Operates the electrical grid serving about 90% of Texas load.",
    seeAlso: [{ label: "ERCOT Explained", href: "/news/texas-grid-ercot-explained" }],
  },
  {
    term: "Foundation School Program (FSP)",
    definition:
      "The formula-driven mechanism that distributes state funding to Texas school districts.",
  },
  {
    term: "Homestead Exemption",
    definition:
      "Property tax exemption that removes $140,000 from the value taxed by a school district on a qualifying owner-occupied principal residence; additional relief may apply for homeowners age 65 or older, disabled homeowners, and disabled veterans.",
    seeAlso: [
      { label: "Homestead Exemption Explained", href: "https://texasdefined.com/do/homestead-exemption" },
    ],
  },
  {
    term: "Joint Resolution",
    definition:
      "A legislative resolution used, among other purposes, to propose a constitutional amendment. A proposed constitutional amendment does not require the governor's signature.",
  },
  {
    term: "Local & Consent Calendar",
    definition:
      "House calendar for non-controversial bills, debated under time-limited rules to move them quickly.",
  },
  {
    term: "M&O Rate",
    definition:
      "Maintenance & Operations property tax rate — the portion of an ISD tax rate that funds day-to-day operations (as opposed to debt service).",
  },
  {
    term: "MUD",
    definition:
      "Municipal Utility District. A special-purpose district that may provide water, wastewater, drainage and other authorized services. District boundaries and services vary; some include territory within municipalities.",
  },
  {
    term: "Open Primary",
    definition:
      "Texas does not require advance party registration. Participation in a party's primary affiliates the voter with that party for the voting year, and the voter cannot participate in another party's primary or runoff during that year. General-election voting is separate.",
  },
  {
    term: "Point of Order",
    definition:
      "Parliamentary objection alleging a procedural violation. Can kill a bill on technical grounds.",
  },
  {
    term: "Recapture",
    definition:
      "The school-finance mechanism requiring districts with local revenue exceeding their applicable entitlement to reduce excess local revenue under Education Code Chapter 49. It operates within the broader state funding formulas.",
    seeAlso: [{ label: "School Finance Explained", href: "/news/texas-school-finance-explained" }],
  },
  {
    term: "Regular Session",
    definition:
      "The 140-day legislative session that begins the second Tuesday of January in odd-numbered years.",
  },
  {
    term: "Rule of Capture",
    definition:
      "A common-law groundwater production doctrine subject to statutory and judicial limits. Groundwater ownership may be severed from the surface estate; conservation districts may regulate production, spacing and permits.",
  },
  {
    term: "Special Session",
    definition:
      "A 30-day session called by the Governor, limited to subjects the Governor lists in the call.",
  },
  {
    term: "Sunset Review",
    definition:
      "A statutory review process for agencies subject to Sunset. Most face a scheduled abolition date unless legislation continues them; recommendations may also change or transfer functions.",
  },
  {
    term: "Taxable Value",
    definition:
      "The value subject to tax for a particular taxing unit after applicable appraisal limitations and exemptions. It may differ from market value and from the taxable value used by another taxing unit.",
  },
];

export function glossaryHead() {
  const seo = buildSeo({
    title: GLOSSARY_TITLE,
    description: GLOSSARY_DESCRIPTION,
    path: "/glossary",
    type: "website",
    imageAlt: "Keep TX Red Texas Political Glossary",
  });

  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Texas Political Glossary",
          url: `${SITE_URL}/glossary`,
          dateModified: "2026-11-25",
          isBasedOn: [TLC_GLOSSARY, LRL_SESSIONS, COMPTROLLER_PROPERTY_TAX, COMPTROLLER_EXEMPTIONS, TEA_SCHOOL_FINANCE, SOS_AFFILIATION, SUNSET_PROCESS, TWDB_GROUNDWATER],
          hasDefinedTerm: TERMS.map((t) => ({
            "@type": "DefinedTerm",
            name: t.term,
            description: t.definition,
          })),
        }),
      },
    ],
  };
}

export const Route = createFileRoute("/glossary")({
  head: glossaryHead,
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
      <main className="mx-auto max-w-4xl px-4 py-14">
        <aside className="mb-8 rounded-xl border bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Reference note:</strong> These are concise plain-English definitions, not substitutes for the governing statute, rule, constitutional provision, agency guidance, or chamber rules. Terms can have exceptions or context-specific meanings; the official source families linked below control when precision matters.
        </aside>

        <nav
          aria-label="Glossary index"
          className="mb-10 flex flex-wrap gap-2 border-b border-border pb-5"
        >
          {letters.map((l) => (
            <a
              key={l}
              href={`#letter-${l}`}
              className="border border-border px-2 py-1 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary"
            >
              {l}
            </a>
          ))}
        </nav>

        {letters.map((l) => (
          <section key={l} id={`letter-${l}`} className="mb-10">
            <h2 className="mb-5 border-b-2 border-foreground font-display text-4xl text-primary">
              {l}
            </h2>
            <dl className="space-y-6">
              {grouped[l].map((t) => (
                <div key={t.term}>
                  <dt className="font-display text-lg tracking-tight">{t.term}</dt>
                  <dd className="mt-1 font-serif text-base leading-relaxed text-muted-foreground">
                    {t.definition}
                  </dd>
                  {t.seeAlso?.map((s) => (
                    <Link
                      key={s.href}
                      to={s.href}
                      className="mt-2 inline-block text-xs uppercase tracking-widest text-primary hover:underline"
                    >
                      → {s.label}
                    </Link>
                  ))}
                </div>
              ))}
            </dl>
          </section>
        ))}

        <CitationTrustPanel
          className="mt-12"
          sources={[
            { name: "Secretary of State — Party affiliation", url: SOS_AFFILIATION, note: "Primary and runoff affiliation rules." },
            { name: "Texas Sunset Advisory Commission — process", url: SUNSET_PROCESS, note: "Agency review and scheduled abolition." },
            { name: "Texas Water Development Board — groundwater FAQ", url: TWDB_GROUNDWATER, note: "Ownership, rule of capture and district regulation." },
            { name: "Texas Legislative Council — Legislative Glossary", url: TLC_GLOSSARY, note: "Official terminology for legislative procedure and measures." },
            { name: "Texas Legislative Reference Library — Sessions and Years", url: LRL_SESSIONS, note: "Official-reference session dates and lengths." },
            { name: "Texas Comptroller — Property Tax System Basics", url: COMPTROLLER_PROPERTY_TAX, note: "Property appraisal, ARB and local property-tax process." },
            { name: "Texas Comptroller — Property Tax Exemptions", url: COMPTROLLER_EXEMPTIONS, note: "Current residence-homestead exemption amounts and eligibility framework." },
            { name: "Texas Education Agency — School Finance Topics", url: TEA_SCHOOL_FINANCE, note: "Basic allotment, Foundation School Program, recapture and school-finance references." },
          ]}
          methodology="Keep TX Red summarizes recurring Texas government and policy terminology in plain English, then checks legislative terms against Texas Legislative Council/Legislative Reference Library materials, property-tax terms against Comptroller guidance, and school-finance terms against Texas Education Agency references. Definitions are intentionally short and should not be read to erase statutory exceptions."
          lastVerified="November 25, 2026"
          title="Glossary sources and verification"
        />
      </main>
    </>
  );
}
