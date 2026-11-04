import { BorderSecuritySpendingPanel } from "@/components/border-security-spending-panel";
import {
  BORDER_SECURITY_TOTALS,
  BORDER_SECURITY_DATA_REVIEWED_AT,
  borderSecurityFundingChangePercent,
} from "@/data/border-security-spending";

const sources = {
  gaa: "https://lbb.texas.gov/Documents/Appropriations_Bills/89/Final/General_Appropriations_Act_2026_2027.pdf",
  txdot: "https://www.txdot.gov/projects/projects-studies/statewide/texas-mexico-border-crossings.html",
  planning: "https://www.txdot.gov/projects/planning/international-trade-border-planning.html",
  crossingCounts: "https://www.txdot.gov/projects/planning/international-trade-border-planning/btmp.html",
  sb4: "https://capitol.texas.gov/tlodocs/884/billtext/pdf/SB00004F.pdf",
  firstAppeal: "https://www.ca5.uscourts.gov/Opinions/pub/24/24-50149-CV2.pdf",
  secondAppeal: "https://www.tmcec.com/wp-content/uploads/2026/05/26-50418_documents.pdf",
  timeline: "https://www.tmcec.com/resources/sb4/",
  uscourts: "https://pacer.uscourts.gov/",
  preemption: "https://constitution.congress.gov/browse/article-6/clause-2/",
  tenth: "https://constitution.congress.gov/constitution/amendment-10/",
  delegation: "https://www.law.cornell.edu/uscode/text/8/1357",
  cbp: "https://www.cbp.gov/border-security",
  dps: "https://www.dps.texas.gov/section/texas-border-security",
  guard: "https://tmd.texas.gov/about-us",
  gov: "https://gov.texas.gov/operationlonestar",
  wait: "https://bwt.cbp.gov/",
  bts: "https://www.bts.gov/browse-statistical-products-and-data/border-crossing-data/border-crossingentry-data",
};

type AuthorityRow = { question: string; texas: string; federal: string; check: string; url: string };

const authorityRows: AuthorityRow[] = [
  {
    question: "Who inspects travelers and commercial cargo at a lawful port?",
    texas: "State and local authorities manage roads, traffic, and criminal matters within their jurisdictions; they do not replace federal customs inspection.",
    federal: "CBP officers administer federal inspection and admissibility functions at ports of entry.",
    check: "CBP port rules and port-specific notices",
    url: sources.cbp,
  },
  {
    question: "Who patrols between established ports of entry?",
    texas: "DPS and state military personnel may conduct authorized state criminal-law and support missions. Specific powers depend on statute, duty status, and orders.",
    federal: "U.S. Border Patrol carries out federal border enforcement between ports.",
    check: "CBP Border Patrol, Texas DPS, and mission orders",
    url: sources.dps,
  },
  {
    question: "Who decides immigration admission, asylum, or federal removal?",
    texas: "Texas cannot simply convert state police or Guard assignments into federal immigration adjudication powers; specific state laws may be litigated.",
    federal: "Federal statutes assign immigration admission, asylum, and removal functions to federal agencies and courts, subject to judicial review.",
    check: "Federal statutes and operative court orders",
    url: sources.delegation,
  },
  {
    question: "Who commands deployed National Guard members?",
    texas: "The governor directs state-status missions, including state active duty; the applicable orders determine the mission and powers.",
    federal: "Federalized Title 10 missions are under federal command; federally funded Title 32 service generally retains state command.",
    check: "Texas Military Department, duty-status orders",
    url: sources.guard,
  },
  {
    question: "Can Texas enforce a new state border crime?",
    texas: "The enacted statute defines the offense, but enforceability can depend on litigation, injunctions, stays, and case-specific interpretation.",
    federal: "The Supremacy Clause and federal immigration statutes supply potential preemption limits, evaluated by courts.",
    check: "Bill text and latest operative court order",
    url: sources.sb4,
  },
];

const regions = [
  { area: "El Paso / Ciudad Juárez", example: "El Paso County; El Paso and Ysleta crossings", significance: "Large urban passenger and freight crossings; local traffic operations and federal port inspections overlap.", source: sources.txdot },
  { area: "Big Bend / Presidio", example: "Presidio County; Presidio crossing", significance: "Long rural stretches and substantial travel distances change logistics, access, and response needs.", source: sources.planning },
  { area: "Del Rio / Eagle Pass", example: "Val Verde and Maverick counties", significance: "River geography, state barrier disputes, and international bridge operations call for separate legal and operational reporting.", source: sources.planning },
  { area: "Laredo / Webb County", example: "Laredo international bridges", significance: "Commercial freight and customs operations are central; a security measure may also affect cross-border trade.", source: sources.txdot },
  { area: "Rio Grande Valley", example: "Starr, Hidalgo, and Cameron counties", significance: "Multiple local crossing systems and densely populated border communities have different impacts from remote river areas.", source: sources.planning },
];

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4 hover:opacity-80">{children}</a>;
}

export function BorderSecurityAuthorityResearch() {
  const before = BORDER_SECURITY_TOTALS.biennium2024_25Millions;
  const after = BORDER_SECURITY_TOTALS.biennium2026_27Millions;
  const change = borderSecurityFundingChangePercent();
  return (
    <article className="mt-8 pb-8 text-foreground" aria-labelledby="texas-border-research-heading">
      <header className="border-t pt-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Texas border public-records reference</p>
        <h2 id="texas-border-research-heading" className="mt-3 font-display text-3xl tracking-tight md:text-4xl">Who controls what, what Texas budgeted, and how to check the law</h2>
        <p className="mt-4 max-w-4xl text-base leading-8">
          A single border headline may mix state policing, federal immigration administration, Guard deployments, and a court order. Those are different questions with different sources. This reference puts them side by side, then connects budget totals and border geography to the records behind them.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">Prepared by the <a href="/editorial-standards" className="font-semibold text-primary underline underline-offset-4">Keep TX Red editorial desk</a> · Source-check completed November 4, 2026 for the records cited below. Court dockets can change after this review. This is public-policy research, not legal advice.</p>
        <nav aria-label="Sections of this border-security reference" className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold">
          <a href="#border-powers" className="text-primary underline underline-offset-4">Authority comparison</a>
          <a href="#border-spending" className="text-primary underline underline-offset-4">Budget by agency</a>
          <a href="#border-litigation" className="text-primary underline underline-offset-4">SB 4 court chronology</a>
          <a href="#border-geography" className="text-primary underline underline-offset-4">Border regions</a>
          <a href="#border-records" className="text-primary underline underline-offset-4">Source desk</a>
        </nav>
      </header>

      <section id="border-powers" className="mt-12 scroll-mt-24">
        <h3 className="font-display text-2xl tracking-tight">1. Texas and federal authority: a practical comparison</h3>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">
          The Supremacy Clause controls conflicts involving valid federal law; the Tenth Amendment reserves powers not delegated to the federal government. Neither is a blanket answer to every border dispute. Specific statutes, orders, and legal status matter. See the <Source href={sources.preemption}>Supremacy Clause</Source> and <Source href={sources.tenth}>Tenth Amendment</Source>.
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border" role="region" aria-label="Texas and federal border powers comparison, horizontally scrollable" tabIndex={0}>
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <caption className="sr-only">Practical division of Texas and federal border authority, with primary record links</caption>
            <thead className="bg-muted/40"><tr><th scope="col" className="p-4">Reader's question</th><th scope="col" className="p-4">Texas and local role</th><th scope="col" className="p-4">Federal role</th><th scope="col" className="p-4">Where to verify</th></tr></thead>
            <tbody>{authorityRows.map((row) => <tr key={row.question} className="border-t align-top"><th scope="row" className="p-4 font-semibold">{row.question}</th><td className="p-4 leading-6">{row.texas}</td><td className="p-4 leading-6">{row.federal}</td><td className="p-4 leading-6"><Source href={row.url}>{row.check}</Source></td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground md:hidden">Swipe horizontally inside the comparison table to view all four columns.</p>
        <p className="mt-4 max-w-4xl text-sm leading-7">
          <strong>What this clarifies:</strong> an officer helping another agency does not automatically gain that agency's full powers. An arrest under Texas criminal law is not identical to federal admission or removal. A state Guard deployment is not necessarily a federal deployment. And a court stay changes what can happen during litigation without necessarily deciding who is right on the constitutional merits.
        </p>
        <p className="mt-3 text-sm">For the current state mission description, compare <Source href={sources.gov}>Operation Lone Star</Source>, <Source href={sources.dps}>DPS border security</Source>, and <Source href={sources.guard}>the Texas Military Department</Source>.</p>
      </section>

      <section id="border-spending" className="mt-12 scroll-mt-24">
        <h3 className="font-display text-2xl tracking-tight">2. What the Legislature authorized, and what that does not prove</h3>
        <p className="mt-3 max-w-4xl text-sm leading-7">
          The enacted state budget's Article IX border-security schedule lists <strong>${(after / 1000).toFixed(4)} billion for the 2026–27 biennium</strong>, versus <strong>${(before / 1000).toFixed(4)} billion for 2024–25</strong>, a <strong>{Math.abs(change).toFixed(1)}% reduction</strong> in those comparable headline funding totals. This is a comparison of budget authority, <em>not</em> a claim that Texas already spent that amount, that costs fell by the same percentage, or that enforcement outcomes changed proportionally. The precise funding definition includes more than one agency and mission category. <Source href={sources.gaa}>Read the enacted General Appropriations Act, Article IX</Source>.
        </p>
        <p className="mt-3 max-w-4xl text-sm leading-7">
          <strong>How to read the budget:</strong> DPS and the Texas Military Department account for major portions, but the schedule also funds state court administration, justice, and other agencies. Summing press-release announcements may double-count transfers or confuse contracts with appropriations. The LBB requires expenditure and performance reporting; reported actuals should be compared separately. The table below reuses KTR's existing agency-level dataset, rather than creating a conflicting second set of figures.
        </p>
        <BorderSecuritySpendingPanel />
        <p className="mt-2 text-xs text-muted-foreground">Underlying spending dataset last reviewed {BORDER_SECURITY_DATA_REVIEWED_AT}. Fiscal numbers are not represented as continuously refreshed.</p>
      </section>

      <section id="border-litigation" className="mt-12 scroll-mt-24">
        <h3 className="font-display text-2xl tracking-tight">3. SB 4: the orders behind the headlines</h3>
        <p className="mt-3 max-w-4xl text-sm leading-7">
          Texas's <Source href={sources.sb4}>2023 SB 4 (88th Legislature, Fourth Called Session)</Source> added state illegal-entry and reentry offenses and provisions concerning return orders. The legal dispute is not resolved by quoting the law alone: a reader must distinguish the statutory text from orders in specific federal lawsuits.
        </p>
        <ol className="mt-5 space-y-5 border-l-2 border-primary/30 pl-6">
          <li><strong>April 24, 2026 — Fifth Circuit, No. 24-50149:</strong> the en banc court vacated a preliminary injunction because the plaintiffs lacked Article III standing. It <em>did not decide</em> the merits of the preemption challenge. <Source href={sources.firstAppeal}>Read the Fifth Circuit’s April 24 opinion (PDF)</Source>.</li>
          <li><strong>May 14, 2026 — Western District of Texas, No. 1:26-cv-01170:</strong> in <em>L.M.L. & K.G.S. v. Martin</em>, the district court preliminarily enjoined certain reentry and return-order provisions, while leaving other portions outside that particular injunction. <Source href={sources.timeline}>Texas Municipal Courts Education Center case summary and links</Source>.</li>
          <li><strong>May 29, 2026 — Fifth Circuit, No. 26-50418:</strong> the appeals court stayed the May 14 preliminary injunction pending appeal. A stay is not a final holding that the challenged statute is constitutional. <Source href={sources.secondAppeal}>Read the appellate order</Source>.</li>
        </ol>
        <div className="mt-5 rounded-lg border-l-4 border-primary bg-muted/30 p-5 text-sm leading-7">
          <strong>Current-status warning:</strong> these are dated, source-backed procedural events, <em>not a real-time declaration of enforceability on November 4, 2026</em>. To report whether a provision can be enforced today, check subsequent entries in both dockets and any later orders. <Source href={sources.uscourts}>PACER federal court records</Source> and the <Source href={sources.timeline}>TMCEC chronology</Source> are starting points. Do not mistake the April standing ruling for a merits decision, or the May stay for final appellate judgment.
        </div>
        <p className="mt-4 text-sm leading-7">
          <strong>Practical test for a new border-law story:</strong> identify the precise statutory section, named case, court, docket number, date of order, whether an injunction was stayed, and which provisions that order addresses. Avoid saying an entire law is "upheld" when a court merely rules on standing or temporary relief.
        </p>
      </section>

      <section id="border-geography" className="mt-12 scroll-mt-24">
        <h3 className="font-display text-2xl tracking-tight">4. Five border regions that should not be treated as one story</h3>
        <p className="mt-3 max-w-4xl text-sm leading-7">
          TxDOT describes a <strong>1,254-mile</strong> Texas–Mexico boundary. Its public <Source href={sources.txdot}>crossing inventory</Source> lists <strong>28 international bridges and crossings</strong>, while the <Source href={sources.crossingCounts}>multimodal Border Transportation Master Plan update</Source> counts <strong>34 crossings: 28 vehicle, 5 rail and 1 pedestrian</strong>. Those figures use different facility definitions, not different border lengths. A bridge traffic delay, a remote river barrier, and a Border Patrol sector encounter are not interchangeable measurements.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {regions.map((region) => <div key={region.area} className="rounded-xl border p-5">
            <h4 className="font-bold">{region.area}</h4>
            <p className="mt-1 text-sm font-medium text-muted-foreground">{region.example}</p>
            <p className="mt-3 text-sm leading-7">{region.significance}</p>
            <p className="mt-3 text-xs"><Source href={region.source}>Official TxDOT geography and crossing context</Source></p>
          </div>)}
        </div>
        <p className="mt-5 text-sm leading-7"><strong>Useful live records:</strong> check <Source href={sources.wait}>CBP border wait times</Source> before travel, <Source href={sources.bts}>Bureau of Transportation Statistics crossing data</Source> for historical movements, and <Source href={sources.planning}>TxDOT transportation planning</Source> for bridge and freight questions. Do not interpret a crossing-wait snapshot as a measure of illegal entry or border security.</p>
      </section>

      <section id="border-records" className="mt-12 scroll-mt-24 rounded-xl border bg-card p-5 md:p-7">
        <h3 className="font-display text-2xl tracking-tight">5. How to independently check a Texas border claim</h3>
        <ul className="mt-4 list-disc space-y-3 pl-6 text-sm leading-7">
          <li><strong>Budget claim:</strong> identify the biennium, agency, appropriation versus actual expenditure, and any federal reimbursement. Begin with the <Source href={sources.gaa}>LBB enacted budget</Source>.</li>
          <li><strong>Who has authority:</strong> name the exact state or federal agency and applicable statute; see <Source href={sources.delegation}>8 U.S.C. § 1357</Source> for federal immigration officer functions and cooperative arrangements.</li>
          <li><strong>Court ruling:</strong> read the operative order and procedural posture, not just a news headline. Start with <Source href={sources.firstAppeal}>the April 2026 Fifth Circuit opinion</Source> and <Source href={sources.timeline}>subsequent SB 4 case chronology</Source>.</li>
          <li><strong>Crossing or port:</strong> distinguish pedestrian, private-vehicle, truck, rail, and Border Patrol data. Consult <Source href={sources.txdot}>TxDOT</Source>, <Source href={sources.wait}>CBP</Source>, and <Source href={sources.bts}>BTS</Source>.</li>
        </ul>
        <h4 className="mt-7 text-lg font-bold">Editorial accountability and limitations</h4>
        <p className="mt-2 text-sm leading-7">
          This reference is maintained under <a href="/editorial-standards" className="font-semibold text-primary underline">Keep TX Red's editorial standards</a>. The responsible published byline is the editorial desk; no legal expert, attorney, or individual reviewer is represented as having signed off unless separately credited. The November 4, 2026 check covers the linked LBB budget schedule, Texas statutory text, cited appellate records, TMCEC chronology, and TxDOT reference pages—not every docket entry, contract, or operational bulletin. Some underlying datasets were reviewed earlier and show their own dates. Send corrections through <a href="/contact" className="font-semibold text-primary underline">the contact page</a> with a primary-source link.
        </p>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          Method: separate enacted law from temporary judicial relief; state appropriations from expenditures; crossings from Border Patrol events; and agency descriptions from independent outcomes. The source links are provided so readers can reproduce or challenge each conclusion. We do not infer causation from changes in border appropriations, encounters, or wait times.
        </p>
      </section>
    </article>
  );
}
