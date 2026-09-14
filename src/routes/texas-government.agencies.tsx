import { createFileRoute, Link } from '@tanstack/react-router';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';
import { AGENCY_AUTHORITY_PROFILES } from '@/data/agency-authority';
import { EXTRA_AGENCY_AUTHORITY_PROFILES } from '@/data/agency-authority-extra';
import { isAgencyAuthorityIndexable } from '@/lib/agency-authority-indexability';
import { buildSeo, SITE_URL } from '@/lib/seo';

const CANONICAL = `${SITE_URL}/texas-government/agencies`;
const TEXAS_GOV_DIRECTORY = 'https://www.texas.gov/texas-state-agencies-departments/';
const TSL_DIRECTORY = 'https://www.tsl.texas.gov/apps/lrs/agencies/index.html';
const ALL_AGENCY_PROFILES = [...AGENCY_AUTHORITY_PROFILES, ...EXTRA_AGENCY_AUTHORITY_PROFILES];
const INDEXABLE_AGENCY_PROFILES = ALL_AGENCY_PROFILES.filter(isAgencyAuthorityIndexable);
const AGENCY_DIRECTORY_TITLE = 'Texas State Agency Directory, Official Services & Profiles';
const AGENCY_DIRECTORY_DESCRIPTION = 'Find official Texas state agencies, high-use online services and KTR authority profiles for employment, business filings, taxes, benefits, licensing, education, courts and public records.';

const SERVICE_AREAS = [
  'Agriculture', 'Business', 'Driver services', 'Education', 'Employment',
  'Environment and natural resources', 'Family and health', 'Government administration and representatives',
  'Housing', 'Judicial and courts', 'Occupational and professional licenses', 'Open data',
  'Outdoors and recreation', 'Public safety', 'Public transportation', 'Tourism', 'Veterans', 'Vital records', 'Voting',
] as const;

const VERIFIED_ENTRY_POINTS = [
  { name: 'Texas Workforce Commission — unemployment benefits', href: 'https://www.twc.texas.gov/services/apply-benefits', use: 'Apply for unemployment benefits, log in to Unemployment Benefits Services, request payments and check claim status.' },
  { name: 'Texas Secretary of State — SOSDirect business search', href: 'https://www.sos.state.tx.us/corp/sosda/index.shtml', use: 'Search Texas business entities and use official online business filing services.' },
  { name: 'Texas Comptroller — Webfile and eSystems', href: 'https://comptroller.texas.gov/taxes/file-pay/', use: 'File and pay Texas taxes through Webfile, review electronic filing requirements and find official due-date guidance.' },
  { name: 'Texas Attorney General — child support account', href: 'https://www.texasattorneygeneral.gov/child-support/about-your-online-child-support-account', use: 'Access child-support case status, payment records, court dates and case-specific account information.' },
  { name: 'Texas Health and Human Services — Your Texas Benefits', href: 'https://www.yourtexasbenefits.com/', use: 'Apply for and manage eligible state benefit programs, including SNAP and other HHSC-administered benefits.' },
  { name: 'Texas Medical Board — provider verification', href: 'https://profile.tmb.state.tx.us/', use: 'Verify current physician and other TMB-regulated healthcare professional license information.' },
  { name: 'Texas Department of Insurance — license and company lookup', href: 'https://www.tdi.texas.gov/consumer/company-profiles-and-agents-for-service-of-process.html', use: 'Verify insurance agents, agencies and companies and review official company information.' },
  { name: 'Texas Real Estate Commission — license holder search', href: 'https://www.trec.texas.gov/license-search', use: 'Verify Texas real-estate license holders, status and disciplinary information; reach TREC rules and contract forms.' },
  { name: 'Texas Board of Nursing — license verification', href: 'https://www.bon.texas.gov/licensure_verification.asp', use: 'Verify Texas nursing licenses through the Board of Nursing official verification portal.' },
  { name: 'State Bar of Texas — Find a Lawyer', href: 'https://www.texasbar.com/', use: 'Search State Bar membership and lawyer records using the official member directory.' },
  { name: 'Texas Education Agency — school ratings', href: 'https://www.txschools.gov/', use: 'Search Texas school and district accountability ratings, profiles, performance and finance information.' },
  { name: 'Texas Education Agency — educator certification', href: 'https://tea.texas.gov/texas-educators/certification/educator-certification-online-system', use: 'Use TEAL and ECOS for educator certification accounts, applications and certificate information.' },
  { name: 'Texas Comptroller — unclaimed property', href: 'https://www.claimittexas.gov/', use: 'Search the State of Texas official unclaimed-property system and start a claim.' },
  { name: 'Texas Secretary of State — notary services', href: 'https://www.sos.state.tx.us/statdoc/notaryforms.shtml', use: 'Apply for or renew a Texas notary commission and reach the current SOS Notary Portal.' },
  { name: 'Teacher Retirement System — MyTRS', href: 'https://www.trs.texas.gov/', use: 'Reach MyTRS account access and official retirement-system resources for Texas public-education employees.' },
  { name: 'Texas State Board of Public Accountancy — portal', href: 'https://portal.tsbpa.texas.gov/', use: 'Verify CPA and firm licenses or sign in to TSBPA online services.' },
  { name: 'Texas State Board of Pharmacy — license verification', href: 'https://www.pharmacy.texas.gov/dbsearch/default.asp', use: 'Verify Texas pharmacists, pharmacies, technicians, interns and related registrations.' },
  { name: 'Texas Virtual School Network', href: 'https://www.txvsn.org/', use: 'Find TEA-administered online course-catalog and full-time public online-school information.' },
] as const;

const HIGH_DEMAND_REFERENCE_LINKS = [
  { to: '/laws/constitutional-amendments', title: 'Texas Constitution and constitutional amendments', description: 'Current amendment status, process and official constitutional sources.' },
  { to: '/guides/texas-overtime-law', title: 'Texas overtime law', description: 'Texas and federal overtime framework, exemptions and primary wage-and-hour sources.' },
  { to: '/guides/texas-minimum-wage-law', title: 'Texas minimum wage law', description: 'Current Texas minimum-wage framework and the relationship to federal law.' },
  { to: '/laws/topic/open-records-public-information', title: 'Texas Public Information Act', description: 'Open-records requests, deadlines, exceptions and Attorney General review.' },
  { to: '/guides/texas-child-custody-conservatorship-law', title: 'Texas child custody and conservatorship', description: 'Conservatorship, possession and access rules under the Texas Family Code.' },
  { to: '/texas-courts', title: 'Texas courts and judicial records', description: 'Texas Supreme Court, Court of Criminal Appeals, appellate courts and official judicial sources.' },
  { to: '/elections/voting', title: 'Texas voter registration and voting', description: 'Registration, polling places, voter ID and official VoteTexas resources.' },
  { to: '/elections/2026', title: 'Texas 2026 elections', description: 'Current candidate, race, district and election-reference coverage.' },
] as const;

export function texasAgencyDirectoryHead() {
  const seo = buildSeo({
    title: AGENCY_DIRECTORY_TITLE,
    description: AGENCY_DIRECTORY_DESCRIPTION,
    path: '/texas-government/agencies',
    type: 'website',
    imageAlt: 'Keep TX Red Texas state agency directory, official services and authority profiles',
  });

  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Texas State Agency Directory, Official Services & Authority Profiles',
      url: CANONICAL,
      dateModified: '2026-09-14',
      isBasedOn: [TEXAS_GOV_DIRECTORY, TSL_DIRECTORY],
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: INDEXABLE_AGENCY_PROFILES.length,
        itemListElement: INDEXABLE_AGENCY_PROFILES.map((agency, index) => ({
          '@type': 'ListItem', position: index + 1, name: agency.name,
          url: `${SITE_URL}/texas-government/agencies/${agency.slug}`, description: agency.dek,
        })),
      },
    }).replace(/</g, '\\u003c') }],
  };
}

export const Route = createFileRoute('/texas-government/agencies')({
  head: texasAgencyDirectoryHead,
  component: TexasAgencyDirectory,
});

function TexasAgencyDirectory() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / Agencies</nav>
      <header className="mt-6 border-b pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Official agency research</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas State Agency Directory, Official Services & Authority Profiles</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-muted-foreground">Use this page as a verified launch point for the Texas government searches people make most often. Direct service links go to the responsible agency or state system; KTR authority profiles explain jurisdiction, programs, oversight and primary-source records when the question is about what an agency can actually do.</p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <a href={TEXAS_GOV_DIRECTORY} target="_blank" rel="noopener noreferrer" className="rounded-2xl border bg-card p-6 hover:border-primary"><p className="text-xs font-bold uppercase tracking-wide text-primary">Official State of Texas directory</p><h2 className="mt-2 text-2xl font-bold">Texas.gov Agencies & Departments</h2><p className="mt-3 leading-7 text-muted-foreground">Search and filter the state's live agency directory by service area.</p><span className="mt-4 inline-block font-semibold text-primary">Open the complete directory →</span></a>
        <a href={TSL_DIRECTORY} target="_blank" rel="noopener noreferrer" className="rounded-2xl border bg-card p-6 hover:border-primary"><p className="text-xs font-bold uppercase tracking-wide text-primary">Reference & archive directory</p><h2 className="mt-2 text-2xl font-bold">Texas State Library Agency List</h2><p className="mt-3 leading-7 text-muted-foreground">Research current agency websites, agency information and TRAIL archive records.</p><span className="mt-4 inline-block font-semibold text-primary">Open the State Library list →</span></a>
      </section>

      <section className="mt-10" aria-labelledby="verified-agency-entry-points">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">High-demand official services</p>
        <h2 id="verified-agency-entry-points" className="mt-2 text-3xl font-bold">Go directly to the responsible Texas agency or portal</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">These links cover recurring searches such as TWC unemployment login, SOS business search, Comptroller Webfile, child support, benefits, professional-license verification, school ratings, unclaimed property and notary applications. Transactional services stay on the official state system so account status, deadlines and live records are not copied into a stale third-party page.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{VERIFIED_ENTRY_POINTS.map((agency) => <a key={agency.name} href={agency.href} target="_blank" rel="noopener noreferrer" className="rounded-xl border bg-card p-5 hover:border-primary"><h3 className="text-lg font-bold">{agency.name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{agency.use}</p><span className="mt-3 inline-block text-sm font-semibold text-primary">Open official service →</span></a>)}</div>
      </section>

      <section className="mt-10" aria-labelledby="ktr-authority-profiles">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Permanent KTR reference layer</p>
        <h2 id="ktr-authority-profiles" className="mt-2 text-3xl font-bold">High-use agency authority profiles</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">These pages are not generic contact cards. They explain the institutional boundary behind recurring Texas stories so readers can distinguish a regulator from an operator, a state agency from a local board, and an executive action from authority that requires legislation.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{INDEXABLE_AGENCY_PROFILES.map((agency) => (
          <a key={agency.slug} href={`/texas-government/agencies/${agency.slug}`} className="rounded-xl border bg-card p-5 hover:border-primary">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{agency.shortName} · {agency.entityType.replaceAll('-', ' ')}</p>
            <h3 className="mt-2 text-xl font-bold">{agency.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{agency.dek}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-primary">View authority profile →</span>
          </a>
        ))}</div>
      </section>

      <section className="mt-10" aria-labelledby="high-demand-reference-links">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">Related high-demand questions</p>
        <h2 id="high-demand-reference-links" className="mt-2 text-3xl font-bold">Government, law, courts and election answers</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">Some searches sound like agency questions but are really questions about a statute, a court system or an election. Use the canonical KTR reference page below rather than treating every search phrase as a separate page.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">{HIGH_DEMAND_REFERENCE_LINKS.map((item) => <Link key={item.to} to={item.to} className="rounded-xl border bg-card p-5 hover:border-primary"><h3 className="text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p><span className="mt-3 inline-block text-sm font-semibold text-primary">Read the KTR authority guide →</span></Link>)}</div>
      </section>

      <section className="mt-10" aria-labelledby="agency-service-areas"><h2 id="agency-service-areas" className="text-3xl font-bold">Service areas in the official Texas.gov directory</h2><div className="mt-5 flex flex-wrap gap-2">{SERVICE_AREAS.map((area) => <span key={area} className="rounded-full border bg-muted/30 px-3 py-1.5 text-sm font-semibold">{area}</span>)}</div></section>

      <section className="mt-10 rounded-2xl border p-6"><h2 className="text-2xl font-bold">Government office or elected official?</h2><p className="mt-3 leading-7 text-muted-foreground">State agencies administer programs and regulations, while elected constitutional offices and legislative districts have different authority and accountability structures. Use the related KTR authority directories when your question is about an officeholder, lawmaker or constitutional office rather than an agency service.</p><div className="mt-5 flex flex-wrap gap-4 font-semibold"><Link to="/texas-government" className="text-primary hover:underline">Texas government powers →</Link><Link to="/representatives" className="text-primary hover:underline">Texas elected officials →</Link><Link to="/texas-legislature" className="text-primary hover:underline">Texas Legislature →</Link></div></section>

      <CitationTrustPanel
        className="mt-8"
        sources={[
          { name: 'Texas.gov — Texas State Agencies & Departments', url: TEXAS_GOV_DIRECTORY, note: 'Live official State of Texas agency directory.' },
          { name: 'Texas State Library — State Agency Information', url: TSL_DIRECTORY, note: 'Agency website and TRAIL reference directory.' },
        ]}
        methodology="The official statewide directories remain the complete discovery source. High-demand service links are checked against the responsible official agency or state portal; KTR creates deeper authority profiles only when an agency repeatedly matters to policy coverage and its jurisdiction can be grounded in official records."
        lastVerified="September 14, 2026"
        title="Agency directory sources and methodology"
      />
    </main>
  );
}
