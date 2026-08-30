import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/issues/texas-local-government-handbook`;

const layers = [
  {
    title: "Counties: arms of the state with limited authority",
    body: [
      "Texas counties are not miniature states and do not possess the broad home-rule power available to qualifying cities. County authority comes from the Texas Constitution and statutes. That matters whenever a debate assumes that a commissioners court can simply pass an ordinance because residents want one.",
      "The commissioners court is the county's governing body, but county government is intentionally fragmented among separately elected officials such as the county judge, sheriff, tax assessor-collector, county clerk, district clerk, treasurer in many counties, constables and justices of the peace. A county story should identify which office actually controls the function in question rather than treating 'the county' as one executive branch.",
    ],
    links: [["Texas Constitution", "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm"], ["Local Government Code", "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.81.htm"], ["Texas government hub", "/texas-government"]],
  },
  {
    title: "Cities: home-rule and general-law are different legal animals",
    body: [
      "Texas municipalities do not all operate from the same grant of power. A home-rule municipality operates under a voter-approved charter authorized by Article XI, Section 5 of the Texas Constitution. General-law municipalities depend more directly on powers granted by state statute. The distinction can determine whether a city may act unless the Legislature has prohibited it, or whether the city first needs a statutory grant.",
      "Even home-rule authority is not unlimited. State preemption, constitutional restrictions and subject-specific statutes can displace local ordinances. When a political fight is described as 'Austin versus City Hall,' the controlling question is often whether state law has occupied or expressly limited that field.",
    ],
    links: [["Municipality classifications", "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.5.htm"], ["Municipal powers", "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.51.htm"], ["Policy trackers", "/policy"]],
  },
  {
    title: "School districts: separate governments with separate boundaries",
    body: [
      "An independent school district is a separate local governmental entity. Its boundaries do not have to match a city, ZIP code or county, and a single city may overlap several districts. The elected board governs the district subject to state education law and oversight by the Texas Education Agency.",
      "School tax rates, bond elections, attendance boundaries, campus assignments and district policy should therefore be attributed to the school district rather than the city or county. A mayor does not run the ISD simply because both governments serve the same neighborhood.",
    ],
    links: [["Texas Education Code", "https://statutes.capitol.texas.gov/?link=ED"], ["Texas Education Agency", "https://tea.texas.gov/"], ["Texas political reference", "/texas-political-reference"]],
  },
  {
    title: "MUDs and water districts: infrastructure government you may barely notice",
    body: [
      "Municipal utility districts and other water districts can finance and operate water, sewer, drainage and related infrastructure, particularly in growing areas outside or at the edge of cities. Depending on the district and its governing law, residents may pay property taxes, utility charges or other assessments and may be responsible for district debt.",
      "A subdivision name does not tell you whether a property lies in a MUD. For accountability reporting and homebuyer due diligence, identify the exact district, review its governing board, tax rate, outstanding debt, service contracts and relationship with any nearby municipality.",
    ],
    links: [["Texas Commission on Environmental Quality water districts", "https://www.tceq.texas.gov/permitting/water_rights/wr_technical-resources/water-districts"], ["Comptroller special purpose districts", "https://comptroller.texas.gov/transparency/local/special-purpose.php"], ["Texas data", "/data"]],
  },
  {
    title: "PIDs: assessments tied to a defined improvement area",
    body: [
      "A public improvement district is not the same thing as a MUD. Under Chapter 372 of the Local Government Code, a municipality or county can establish a PID to fund authorized improvements or services within a defined area, commonly using special assessments on benefited property.",
      "Because the charge can appear alongside other property costs, readers often describe every development-related assessment as a 'tax.' Reporting should identify whether the charge is an ad valorem tax, a PID assessment, a utility charge, an HOA assessment or another obligation, because the legal authority and payoff structure differ.",
    ],
    links: [["Local Government Code Chapter 372", "https://statutes.capitol.texas.gov/Docs/LG/htm/LG.372.htm"], ["Texas law finder", "/civic-tools/texas-law-finder"], ["Texas tax tools", "/tools"]],
  },
  {
    title: "Emergency services districts: local fire and EMS authority",
    body: [
      "Emergency services districts can provide fire protection, emergency medical services and related emergency functions in areas where those services are not delivered solely through a city department. Their boundaries can cross familiar city or county lines, and funding can include property taxes and, where authorized, sales taxes.",
      "When response times, station locations or emergency-service taxes become political issues, identify the ESD board and district boundary first. Blaming a county sheriff, city council or volunteer department for a decision controlled by another entity can produce a confident but incorrect story.",
    ],
    links: [["Texas Health and Safety Code Chapter 775", "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.775.htm"], ["Comptroller special-purpose district taxes", "https://comptroller.texas.gov/taxes/sales/spd.php"], ["Government authority finder", "/civic-tools/government-authority-finder"]],
  },
  {
    title: "Appraisal districts are not the governments setting your tax rate",
    body: [
      "Central appraisal districts determine property values for taxing units in the county under the Tax Code. They do not set the tax rates adopted by cities, counties, school districts and other taxing entities. That distinction is essential in property-tax coverage because appraisal value and tax rate are separate parts of the bill.",
      "A protest over market or appraised value belongs in the appraisal process. A political argument over how much revenue a taxing unit adopts belongs with that taxing unit. KTR coverage should keep those two accountability chains separate even when they meet on the same tax statement.",
    ],
    links: [["Texas Property Tax Code", "https://statutes.capitol.texas.gov/?link=TX"], ["Texas Comptroller property tax", "https://comptroller.texas.gov/taxes/property-tax/"], ["Property tax coverage", "/topics/property-taxes"]],
  },
  {
    title: "Special districts: always ask what created it and how it is financed",
    body: [
      "Texas has thousands of special-purpose districts providing services ranging from water and hospitals to libraries, toll roads and fire protection. Some are created under general law, some through special legislation, and their financing can involve property taxes, sales taxes, assessments, user fees or debt.",
      "The safest reporting method is to avoid treating 'special district' as a single form of government. Find the enabling statute or legislation, current board, geographic boundary, revenue authority, debt authority and required elections. The Comptroller's Special Purpose District Public Information Database is a useful starting point for financial and tax information submitted by districts.",
    ],
    links: [["Comptroller special-purpose district database", "https://comptroller.texas.gov/transparency/local/special-purpose.php"], ["Texas Legislature Online", "https://capitol.texas.gov/"], ["Citation guide", "/citation-guide"]],
  },
  {
    title: "The overlap is the point: one address can sit under many governments",
    body: [
      "A Texas address may simultaneously sit inside a county, municipality, school district, community college district, hospital district, emergency services district, utility district, appraisal district and other special-purpose boundaries. Those governments can have different elected boards, tax rates, debt and public-record systems.",
      "That is why local-government accountability should begin with a boundary-and-authority check. Before asking whether a policy is good or bad, determine which entity adopted it, which voters elect that entity, what statute grants its power and which revenue stream pays for the decision.",
    ],
    links: [["Government authority finder", "/civic-tools/government-authority-finder"], ["Accountability Handbook", "/issues/texas-government-accountability-handbook"], ["Texas Policy Handbook", "/issues/texas-policy-handbook"]],
  },
] as const;

const municipalAuthorityLinks = [
  ["Municipal government history", "/texas-government/texas-municipal-government-history"],
  ["Home-rule vs. general-law cities", "/texas-government/home-rule-general-law-cities-history"],
  ["Mayors and city councils", "/texas-government/mayor-city-council-history"],
  ["City manager government", "/texas-government/city-manager-government-history"],
  ["Municipal courts", "/texas-government/texas-municipal-courts-history"],
  ["Special districts", "/texas-government/texas-special-district-government-history"],
  ["Municipal elections and representation", "/texas-government/municipal-elections-representation-history"],
  ["Municipal taxes, budgets and debt", "/texas-government/municipal-finance-tax-debt-history"],
  ["State-local preemption tracker", "/policy/local-preemption-regulatory-consistency"],
] as const;

const sourceStarts = [
  ["Texas Constitution and Statutes", "https://statutes.capitol.texas.gov/"],
  ["Texas Comptroller — Special Purpose Districts", "https://comptroller.texas.gov/transparency/local/special-purpose.php"],
  ["Texas Commission on Environmental Quality", "https://www.tceq.texas.gov/"],
  ["Texas Education Agency", "https://tea.texas.gov/"],
  ["Texas Comptroller — Property Tax", "https://comptroller.texas.gov/taxes/property-tax/"],
  ["Texas Legislature Online", "https://capitol.texas.gov/"],
] as const;

export const Route = createFileRoute("/issues/texas-local-government-handbook")({
  head: () => ({
    meta: [
      { title: "Texas Local Government Handbook | Counties, Cities, MUDs, PIDs & Districts | Keep TX Red" },
      { name: "description", content: "A source-first guide to Texas counties, home-rule and general-law cities, school districts, MUDs, PIDs, ESDs, appraisal districts and other special-purpose governments." },
      { property: "og:title", content: "Texas Local Government Handbook | Keep TX Red" },
      { property: "og:description", content: "Who actually controls what in Texas local government—from counties and cities to school districts, MUDs, PIDs, ESDs and appraisal districts." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org", "@type": "Article", headline: "Texas Local Government Handbook",
      description: "A source-first guide to the overlapping governments that control local taxes, services, infrastructure, schools and regulation in Texas.",
      mainEntityOfPage: PAGE_URL, datePublished: "2026-08-22", dateModified: "2026-08-30",
      author: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL }, publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
    }) }],
  }),
  component: TexasLocalGovernmentHandbook,
});

function TexasLocalGovernmentHandbook() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/issues" className="hover:text-primary">Texas Issues</Link> <span aria-hidden>→</span> Local Government Handbook</nav>
      <header className="mt-5 max-w-4xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">★ Permanent Reference</span>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight md:text-7xl">TEXAS LOCAL<br /><span className="text-primary">GOVERNMENT</span></h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">Texas local government is a stack of overlapping jurisdictions, not one chain of command. This handbook identifies the layer that actually controls the tax, service, regulation or decision before the political argument begins.</p>
      </header>

      <section className="mt-10 border-l-4 border-primary bg-muted/40 p-6">
        <h2 className="font-display text-2xl">The rule to remember</h2>
        <p className="mt-3 leading-7">Never infer government authority from the city name in a mailing address. Find the exact county, municipality, school district and special-purpose districts attached to the issue or property, then trace each entity's power to its charter, statute, constitutional provision or enabling legislation.</p>
      </section>

      <div className="mt-14 space-y-14">
        {layers.map((layer, index) => (
          <section key={layer.title} className="border-t pt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Layer {index + 1}</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{layer.title}</h2>
            <div className="mt-5 space-y-4 text-[1.02rem] leading-8 text-muted-foreground">{layer.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">{layer.links.map(([label, href]) => <a key={href} href={href} className="text-primary hover:underline">{label} →</a>)}</div>
          </section>
        ))}
      </div>

      <section className="mt-14 border-t pt-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Municipal authority library</p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">Go deeper on Texas city government</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">These evergreen authority guides add the constitutional, historical and institutional layer behind the practical handbook. Use them to identify where municipal power came from, who exercises it and where state law can override it.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{municipalAuthorityLinks.map(([label, href]) => <a key={href} href={href} className="border p-4 font-semibold text-primary hover:border-primary">{label} →</a>)}</div>
      </section>

      <section className="mt-14 border-t pt-8">
        <h2 className="font-display text-3xl tracking-tight">Primary-source starting points</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{sourceStarts.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer" className="border p-4 font-semibold text-primary hover:border-primary">{label} ↗</a>)}</div>
      </section>

      <section className="mt-14 border-t pt-8">
        <h2 className="font-display text-3xl tracking-tight">Use all three KTR handbooks together</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <a href="/issues/texas-policy-handbook" className="border p-5 hover:border-primary"><strong>Policy Handbook</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Understand the statewide policy system and who controls the issue.</p></a>
          <a href="/issues/texas-government-accountability-handbook" className="border p-5 hover:border-primary"><strong>Accountability Handbook</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Follow records, money, meetings, contracts and chronology.</p></a>
          <a href="/issues/texas-local-government-handbook" className="border border-primary p-5"><strong>Local Government Handbook</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Map the county, city, district and special-purpose authority.</p></a>
        </div>
      </section>
    </main>
  );
}
