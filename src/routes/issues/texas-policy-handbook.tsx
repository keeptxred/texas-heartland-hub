import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/issues/texas-policy-handbook`;

const chapters = [
  {
    title: "Texas government: who actually controls what?",
    body: [
      "Texas policy is split among the Legislature, governor, statewide elected officials, courts, agencies, counties, cities, school districts and special districts. A useful political story starts by identifying which body has legal authority over the decision instead of treating every public problem as something the governor or Legislature can change by announcement.",
      "The Legislature writes statutes and appropriates money. Agencies implement laws within delegated authority. Courts interpret constitutional and statutory limits. Local governments exercise powers granted or preserved by state law. That division is the first check KTR applies when evaluating claims about taxes, schools, policing, utilities, elections or local regulation.",
    ],
    links: [
      ["Texas Legislature", "/texas-legislature"],
      ["Texas government agencies", "/texas-government/agencies"],
      ["State vs. federal power", "/issues/texas-state-federal-power"],
    ],
  },
  {
    title: "Taxes and spending: Texas has no personal state income tax, but government still has a price tag",
    body: [
      "Texas relies heavily on sales taxes, property taxes collected by local taxing units, severance taxes, fees, federal funds and other revenue streams rather than a personal state income tax. That makes state-local tax comparisons more important than slogans about whether Texas is simply a low-tax or high-tax state.",
      "Property-tax bills combine appraisal values, exemptions and rates set by multiple local units. State spending is governed by appropriations, constitutional limits and available revenue. KTR separates the amount government authorizes, the amount an agency actually spends and the tax burden a household or business ultimately experiences.",
    ],
    links: [
      ["Texas economy and no income tax", "/issues/texas-economy-no-income-tax"],
      ["Property-tax protest guide", "/texas-property-tax-protest-guide"],
      ["Texas tax structure tool", "/tools/texas-tax-structure-comparison"],
    ],
  },
  {
    title: "Energy: the grid, oil and gas, and the difference between operations and policy",
    body: [
      "ERCOT operates the grid and wholesale market for most of Texas, but it does not own most generation or transmission. The Public Utility Commission regulates the market, utilities and retail-electricity framework, while the Legislature sets major policy. Oil and gas production adds another layer through the Railroad Commission, TCEQ and federal environmental and interstate authorities.",
      "When Texas energy stories become political, KTR distinguishes physical reliability questions from market rules, permitting, fuel supply, transmission, environmental regulation and ratepayer costs. Those are related, but they are not interchangeable.",
    ],
    links: [
      ["ERCOT and grid reliability", "/issues/ercot-grid-reliability"],
      ["Texas oil and gas regulation", "/issues/texas-oil-gas-federal-regulation"],
      ["Texas energy hub", "/texas-energy"],
    ],
  },
  {
    title: "Border security and immigration: overlapping governments, distinct legal powers",
    body: [
      "Immigration law is principally federal, while Texas controls state criminal law, policing resources, National Guard missions under state authority, infrastructure spending and other state functions. That overlap is why border disputes routinely become constitutional disputes over preemption, federal supremacy and the scope of state police powers.",
      "KTR treats Operation Lone Star, state border barriers, state immigration crimes, National Guard deployments, federal enforcement policy, asylum, detention and border-county costs as connected but separate questions. Each claim should identify the law, agency, appropriation or court order actually controlling the issue.",
    ],
    links: [
      ["Operation Lone Star guide", "/issues/texas-border-security-operation-lone-star"],
      ["Texas border security hub", "/texas-border-security"],
      ["Government authority finder", "/civic-tools/government-authority-finder"],
    ],
  },
  {
    title: "Education and parental rights: school choice, local districts and state rules",
    body: [
      "Texas education policy combines state statutes, TEA rules, State Board of Education decisions, locally elected school boards and federal education law. School-choice debates add private providers, education savings accounts, charter schools and homeschooling to that mix.",
      "Parental rights are real but issue-specific. Access to records, curriculum, instructional materials, health services, complaints and opt-outs can be governed by different statutes. KTR's reference coverage ties each claim to the controlling rule instead of presenting one broad slogan as the answer to every school dispute.",
    ],
    links: [
      ["Texas school choice and ESAs", "/issues/texas-school-choice-esas"],
      ["Parental rights in Texas schools", "/issues/parental-rights-texas-schools"],
      ["Texas law finder", "/civic-tools/texas-law-finder"],
    ],
  },
  {
    title: "Public safety, bail and constitutional rights",
    body: [
      "Texas criminal-justice policy runs through constitutional protections, the Code of Criminal Procedure, Penal Code, courts, prosecutors, sheriffs, police departments, jails and state agencies. A change to bail is different from a sentencing change; a police policy is different from a statute; and a local jail-capacity problem is different from a statewide criminal-law rule.",
      "KTR coverage should identify the stage of the system being discussed: investigation, arrest, pretrial release, prosecution, conviction, sentencing, incarceration, parole or reentry. That prevents political debates over crime from collapsing every institution into one number or one official.",
    ],
    links: [
      ["Texas bail and criminal justice", "/issues/texas-bail-criminal-justice"],
      ["Texas law enforcement hub", "/texas-law-enforcement"],
      ["Texas laws library", "/laws"],
    ],
  },
  {
    title: "Elections: rules, administration, candidates and results belong in different layers",
    body: [
      "The Texas Election Code and Secretary of State guidance establish much of the statewide framework, but counties conduct many election functions and courts can alter implementation through litigation. Candidate qualifications, voter registration, mail ballots, poll watchers, voting systems, recounts and campaign-finance questions are governed by different provisions.",
      "KTR keeps permanent election-law explainers separate from Election Central's candidate and results coverage. That lets a breaking dispute link back to durable legal context without rewriting the same background in every election story.",
    ],
    links: [
      ["Texas election law", "/issues/texas-election-law"],
      ["Election Central", "/elections"],
      ["Register to vote", "/register-to-vote"],
    ],
  },
  {
    title: "Healthcare and rural Texas: access is more than a hospital count",
    body: [
      "Healthcare access in rural Texas depends on emergency coverage, clinicians, hospital licensing, EMS travel times, telemedicine, broadband, reimbursement and whether specialty care can be reached in practice. A county can retain a healthcare facility and still lose important services.",
      "Policy claims should therefore name the program being changed: Medicaid, hospital licensing, rural grants, workforce programs, telemedicine rules, maternal-health programs or another specific mechanism. KTR uses the permanent rural-health guide to keep those stories anchored in the right system.",
    ],
    links: [
      ["Rural healthcare in Texas", "/issues/texas-rural-healthcare"],
      ["Rural Texas", "/issues/rural-texas"],
      ["Texas data catalog", "/data"],
    ],
  },
  {
    title: "Local government and preemption: city hall does not exist outside state law",
    body: [
      "Home-rule cities have broad local authority, but state constitutional and statutory preemption can restrict that authority. Counties operate under a different grant-of-powers framework. The result is a recurring fight over which level of government may regulate businesses, land use, employment practices, natural resources and other local concerns.",
      "The useful question is not simply whether a policy is 'local control.' KTR identifies the ordinance, the state provision alleged to preempt it, any express authorization and the current court posture before drawing a conclusion.",
    ],
    links: [
      ["Texas local preemption and home rule", "/issues/texas-local-preemption-home-rule"],
      ["Texas government", "/texas-government"],
      ["Bill finder", "/civic-tools/bill-finder"],
    ],
  },
  {
    title: "How to read Texas political claims without getting trapped by the headline",
    body: [
      "First identify whether the claim concerns a bill, an enacted law, an agency rule, an executive action, a court decision, a budget appropriation or a campaign proposal. Those labels describe different legal realities. A filed bill is not law; an appropriation is not proof every dollar was spent; a trial-court order may not be the final word; and an agency press release is not a statute.",
      "Second, check the date and version. Texas legislation changes during the process, statutes are amended, rules receive effective dates and litigation can pause implementation. Third, follow the primary source. KTR's civic tools and reference pages are designed to make that last step easier instead of asking readers to trust a summary alone.",
    ],
    links: [
      ["Civic tools", "/civic-tools"],
      ["Editorial standards", "/editorial-standards"],
      ["Citation guide", "/citation-guide"],
    ],
  },
] as const;

const primarySources = [
  ["Texas Constitution and statutes", "https://statutes.capitol.texas.gov/"],
  ["Texas Legislature Online", "https://capitol.texas.gov/"],
  ["Texas Secretary of State", "https://www.sos.state.tx.us/"],
  ["Texas Comptroller", "https://comptroller.texas.gov/"],
  ["Texas Legislative Budget Board", "https://www.lbb.texas.gov/"],
  ["Texas courts", "https://www.txcourts.gov/"],
] as const;

export const Route = createFileRoute("/issues/texas-policy-handbook")({
  head: () => ({
    meta: [
      { title: "Texas Policy Handbook: Government, Taxes, Energy, Border & Elections | Keep TX Red" },
      { name: "description", content: "A source-first Texas policy handbook explaining state government, taxes, energy, border security, schools, public safety, elections, healthcare and local authority." },
      { property: "og:title", content: "Texas Policy Handbook | Keep TX Red" },
      { property: "og:description", content: "The durable framework behind Texas political headlines, with direct paths to laws, agencies, issue guides and civic tools." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Texas Policy Handbook",
        description: "A source-first handbook to the durable framework behind Texas political and government coverage.",
        mainEntityOfPage: PAGE_URL,
        datePublished: "2026-08-22",
        dateModified: "2026-08-22",
        author: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
        publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
      }),
    }],
  }),
  component: TexasPolicyHandbook,
});

function TexasPolicyHandbook() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/issues" className="hover:text-primary">Texas Issues</Link> <span aria-hidden>→</span> Policy Handbook</nav>
      <header className="mt-5 max-w-4xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">★ Permanent Reference</span>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight md:text-7xl">TEXAS POLICY<br /><span className="text-primary">HANDBOOK</span></h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">The durable framework behind the daily fight. Use this page to understand which government controls what, how major Texas policy systems fit together and where to verify the underlying law before judging the headline.</p>
      </header>

      <section className="mt-10 border-l-4 border-primary bg-muted/40 p-6">
        <h2 className="font-display text-2xl">Quick answer</h2>
        <p className="mt-3 leading-7">Texas politics makes more sense when you separate authority, law, money and implementation. The Legislature can pass a bill, but an agency may implement it; a court may limit it; a county may administer part of it; and the final effect may depend on appropriations, rules and deadlines. KTR's issue guides, policy trackers, civic tools and live coverage are built as separate layers so those distinctions stay visible.</p>
      </section>

      <div className="mt-14 space-y-14">
        {chapters.map((chapter, index) => (
          <section key={chapter.title} className="border-t pt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Chapter {index + 1}</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{chapter.title}</h2>
            <div className="mt-5 space-y-4 text-[1.02rem] leading-8 text-muted-foreground">{chapter.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">{chapter.links.map(([label, href]) => <a key={href} href={href} className="text-primary hover:underline">{label} →</a>)}</div>
          </section>
        ))}
      </div>

      <section className="mt-14 border-t pt-8">
        <h2 className="font-display text-3xl tracking-tight">Primary-source starting points</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">These statewide sources are the fastest way to move from a political claim to the controlling record. Individual issue guides add narrower agency, statute and bill links.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{primarySources.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer" className="border p-4 font-semibold text-primary hover:border-primary">{label} ↗</a>)}</div>
      </section>

      <section className="mt-14 border-t pt-8">
        <h2 className="font-display text-3xl tracking-tight">Go deeper</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a href="/issues" className="border p-5 hover:border-primary"><strong>Issue guides</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Permanent explainers for the major Texas policy fights.</p></a>
          <a href="/policy" className="border p-5 hover:border-primary"><strong>Policy trackers</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Current status for narrower laws, agencies and implementation questions.</p></a>
          <a href="/civic-tools" className="border p-5 hover:border-primary"><strong>Civic tools</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Find bills, laws, government authority and public officials.</p></a>
          <a href="/news" className="border p-5 hover:border-primary"><strong>Texas news</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Move from durable context into today's developments.</p></a>
        </div>
      </section>
    </main>
  );
}
