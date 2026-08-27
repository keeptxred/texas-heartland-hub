import { createFileRoute, Link } from '@tanstack/react-router';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';
import { AGENCY_AUTHORITY_PROFILES } from '@/data/agency-authority';
import { EXTRA_AGENCY_AUTHORITY_PROFILES } from '@/data/agency-authority-extra';
import { isAgencyAuthorityIndexable } from '@/lib/agency-authority-indexability';

const SITE_URL = 'https://keeptxred.com';
const CANONICAL = `${SITE_URL}/texas-government/agencies`;
const TEXAS_GOV_DIRECTORY = 'https://www.texas.gov/texas-state-agencies-departments/';
const TSL_DIRECTORY = 'https://www.tsl.texas.gov/apps/lrs/agencies/index.html';
const ALL_AGENCY_PROFILES = [...AGENCY_AUTHORITY_PROFILES, ...EXTRA_AGENCY_AUTHORITY_PROFILES];
const INDEXABLE_AGENCY_PROFILES = ALL_AGENCY_PROFILES.filter(isAgencyAuthorityIndexable);

const SERVICE_AREAS = [
  'Agriculture', 'Business', 'Driver services', 'Education', 'Employment',
  'Environment and natural resources', 'Family and health', 'Government administration and representatives',
  'Housing', 'Judicial and courts', 'Occupational and professional licenses', 'Open data',
  'Outdoors and recreation', 'Public safety', 'Public transportation', 'Tourism', 'Veterans', 'Vital records', 'Voting',
] as const;

const VERIFIED_ENTRY_POINTS = [
  { name: 'Texas Department of Public Safety (DPS)', href: 'https://www.dps.texas.gov/', use: 'Driver licenses, identification, crime records, handgun licensing and public-safety services.' },
  { name: 'Texas Department of Motor Vehicles (TxDMV)', href: 'https://www.txdmv.gov/', use: 'Vehicle titles, registration resources, dealers, motor carriers and regional service centers.' },
  { name: 'Texas Education Agency (TEA)', href: 'https://tea.texas.gov/', use: 'Public schools, educator certification, assessment, accountability and education guidance.' },
  { name: 'Texas Department of Agriculture (TDA)', href: 'https://www.texasagriculture.gov/', use: 'Agriculture programs, licensing, consumer protection and rural/economic programs.' },
] as const;

export const Route = createFileRoute('/texas-government/agencies')({
  head: () => ({
    meta: [
      { title: 'Texas State Agency Directory & Authority Profiles | Keep TX Red' },
      { name: 'description', content: 'Find official Texas state agency directories and KTR authority profiles explaining what major agencies control, what they do not control, their programs, oversight and primary sources.' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: 'Texas State Agency Directory & Authority Profiles' },
      { property: 'og:url', content: CANONICAL },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: CANONICAL }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Texas State Agency Directory & Authority Profiles',
      url: CANONICAL,
      dateModified: '2026-08-20',
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
  }),
  component: TexasAgencyDirectory,
});

function TexasAgencyDirectory() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / Agencies</nav>
      <header className="mt-6 border-b pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Official agency research</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas State Agency Directory & Authority Profiles</h1>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-muted-foreground">Use the official statewide directories for the complete agency list. KTR separately maintains deeper authority profiles for the agencies and institutions that repeatedly drive Texas policy coverage—showing what they control, what they do not, how they are accountable, and which primary records govern their work.</p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <a href={TEXAS_GOV_DIRECTORY} target="_blank" rel="noopener noreferrer" className="rounded-2xl border bg-card p-6 hover:border-primary"><p className="text-xs font-bold uppercase tracking-wide text-primary">Official State of Texas directory</p><h2 className="mt-2 text-2xl font-bold">Texas.gov Agencies & Departments</h2><p className="mt-3 leading-7 text-muted-foreground">Search and filter the state's live agency directory by service area.</p><span className="mt-4 inline-block font-semibold text-primary">Open the complete directory →</span></a>
        <a href={TSL_DIRECTORY} target="_blank" rel="noopener noreferrer" className="rounded-2xl border bg-card p-6 hover:border-primary"><p className="text-xs font-bold uppercase tracking-wide text-primary">Reference & archive directory</p><h2 className="mt-2 text-2xl font-bold">Texas State Library Agency List</h2><p className="mt-3 leading-7 text-muted-foreground">Research current agency websites, agency information and TRAIL archive records.</p><span className="mt-4 inline-block font-semibold text-primary">Open the State Library list →</span></a>
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

      <section className="mt-10" aria-labelledby="agency-service-areas"><h2 id="agency-service-areas" className="text-3xl font-bold">Service areas in the official Texas.gov directory</h2><div className="mt-5 flex flex-wrap gap-2">{SERVICE_AREAS.map((area) => <span key={area} className="rounded-full border bg-muted/30 px-3 py-1.5 text-sm font-semibold">{area}</span>)}</div></section>

      <section className="mt-10" aria-labelledby="verified-agency-entry-points"><h2 id="verified-agency-entry-points" className="text-3xl font-bold">Verified high-use service entry points</h2><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">These direct agency links are a convenience set, not a claim that four agencies represent the whole Texas government. Use the complete official directories above for every agency and department.</p><div className="mt-5 grid gap-4 md:grid-cols-2">{VERIFIED_ENTRY_POINTS.map((agency) => <a key={agency.name} href={agency.href} target="_blank" rel="noopener noreferrer" className="rounded-xl border p-5 hover:border-primary"><h3 className="text-xl font-bold">{agency.name}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{agency.use}</p><span className="mt-3 inline-block text-sm font-semibold text-primary">Official agency website →</span></a>)}</div></section>

      <section className="mt-10 rounded-2xl border p-6"><h2 className="text-2xl font-bold">Government office or elected official?</h2><p className="mt-3 leading-7 text-muted-foreground">State agencies administer programs and regulations, while elected constitutional offices and legislative districts have different authority and accountability structures. Use the related KTR authority directories when your question is about an officeholder, lawmaker or constitutional office rather than an agency service.</p><div className="mt-5 flex flex-wrap gap-4 font-semibold"><Link to="/texas-government" className="text-primary hover:underline">Texas government powers →</Link><Link to="/representatives" className="text-primary hover:underline">Texas elected officials →</Link><Link to="/texas-legislature" className="text-primary hover:underline">Texas Legislature →</Link></div></section>

      <CitationTrustPanel
        className="mt-8"
        sources={[
          { name: 'Texas.gov — Texas State Agencies & Departments', url: TEXAS_GOV_DIRECTORY, note: 'Live official State of Texas agency directory.' },
          { name: 'Texas State Library — State Agency Information', url: TSL_DIRECTORY, note: 'Agency website and TRAIL reference directory.' },
        ]}
        methodology="The official statewide directories remain the complete discovery source. KTR only creates deeper authority profiles when an agency repeatedly matters to policy coverage and its jurisdiction can be grounded in official records."
        lastVerified="August 20, 2026"
        title="Agency directory sources and methodology"
      />
    </main>
  );
}
