import { Link } from "@tanstack/react-router";
import {
  JUDICIAL_SELECTION_REFORM_FINDINGS,
  JUDICIAL_SELECTION_REVIEWED,
  JUDICIAL_SELECTION_SOURCES,
  JUDICIAL_SELECTION_TIMELINE,
  JUDICIAL_SELECTION_VOTER_GUIDE,
  TEXAS_JUDICIAL_SELECTION_MATRIX,
} from "@/data/texas-judicial-selection-expanded";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-government/judicial-selection-elections`;
const TITLE = "Texas Judicial Elections & Selection: How Judges Are Chosen | KeepTXRed";
const DESCRIPTION = "A comprehensive guide to how Texas chooses judges: partisan elections, vacancy appointments, court-by-court terms and qualifications, the 2021 qualification changes, campaign rules, and the state's long-running judicial-selection reform debate.";

const FAQS = [
  {
    question: "Are all Texas judges elected?",
    answer: "No. Many constitutional and statutory judges are elected in partisan elections, but Texas also uses appointments. The governor fills many appellate and district-court vacancies with Senate consent, Business Court judges are appointed, county commissioners fill specified county-court vacancies, and most municipal judges are appointed by city governing bodies.",
  },
  {
    question: "Are Texas Supreme Court justices elected in partisan races?",
    answer: "Yes. The chief justice and eight justices of the Supreme Court of Texas are elected statewide in partisan elections for six-year terms. The Court of Criminal Appeals uses the same statewide partisan-election structure for its presiding judge and eight judges.",
  },
  {
    question: "Can the Texas governor appoint a judge to an elected court?",
    answer: "Yes. A vacancy between elections on the Supreme Court, Court of Criminal Appeals, courts of appeals, and district courts can be filled through gubernatorial appointment with the advice and consent of the Texas Senate. The appointment does not convert the office into a permanently appointed judgeship; the electoral process later applies as required by law.",
  },
  {
    question: "How long are Texas judges' terms?",
    answer: "Terms vary by court. Supreme Court, Court of Criminal Appeals, and courts of appeals judges generally serve six-year terms; district and many county-level judges serve four-year terms; Business Court judges serve two-year appointed terms; municipal-court terms commonly run two or four years.",
  },
  {
    question: "Do Texas judges have to be lawyers?",
    answer: "It depends on the court. Appellate, district, statutory county, statutory probate, and Business Court judges have legal-experience requirements. A constitutional county judge is not universally required to hold a law license, and the statewide judicial-selection chart lists no specific professional qualification for justice-court judges beyond generally applicable eligibility rules.",
  },
  {
    question: "Did Texas always elect judges?",
    answer: "No. Texas moved between appointment and election under different constitutions. Popular election expanded before the Civil War, the 1869 Reconstruction constitution used appointments, and the Constitution of 1876 restored elections for major judicial offices.",
  },
  {
    question: "Did Texas end straight-ticket voting?",
    answer: "Yes. House Bill 25, enacted in 2017, eliminated straight-party voting effective September 1, 2020. Judicial candidates still carry party labels in partisan races, but voters select individual candidates rather than casting a single straight-party choice.",
  },
  {
    question: "What did the Texas Commission on Judicial Selection recommend?",
    answer: "Its 2020 final report showed dissatisfaction with the status quo but no consensus replacement. A majority opposed continuing partisan elections, a majority also opposed nonpartisan elections, and the commission split 7–7 with one abstention on appointment followed by retention elections. It strongly supported higher qualifications and additional regulation of money in judicial elections.",
  },
];

export function texasJudicialSelectionHistoryHead() {
  return {
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Texas Judicial Selection and Election History",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: JUDICIAL_SELECTION_REVIEWED,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: JUDICIAL_SELECTION_SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.href })),
          about: [
            { "@type": "Thing", name: "Texas judicial elections" },
            { "@type": "Thing", name: "Texas judicial appointments" },
            { "@type": "Thing", name: "Texas judicial qualifications" },
          ],
          isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }).replace(/</g, "\\u003c"),
      },
    ],
  };
}

function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="max-w-5xl">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
    </div>
  );
}

export function TexasJudicialSelectionHistoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / Judicial Selection and Elections
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas judicial authority guide</p>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Reviewed {JUDICIAL_SELECTION_REVIEWED}</span>
        </div>
        <h1 className="mt-4 max-w-6xl text-4xl font-bold leading-tight md:text-6xl">How Texas Chooses Its Judges</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
          Texas does not use one selection method for every court. The state's two high courts, courts of appeals, district courts, many county courts, and justice courts use partisan elections; governors and county commissioners fill specified vacancies; most municipal judges are appointed locally; and the newer Texas Business Court uses gubernatorial appointment with Senate confirmation. This guide explains the system court by court, how it developed, what changed in 2025, and why reform remains unresolved.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#selection-matrix" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Selection by court</a>
          <a href="#vacancies" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Vacancies and appointments</a>
          <a href="#reform" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Reform history</a>
          <Link to="/elections/2026" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">2026 Election Central</Link>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Texas judicial selection quick facts">
        {[
          ["Partisan ballots", "Most elected Texas judges run with party labels."],
          ["6-year high-court terms", "Supreme Court and CCA members are elected statewide."],
          ["Appointments still matter", "Vacancies can put an appointee on an otherwise elected court."],
          ["No single system", "Business and municipal courts show that not every Texas judge is elected."],
        ].map(([value, text]) => (
          <article key={value} className="rounded-xl border bg-card p-5">
            <p className="text-xl font-bold text-primary">{value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>

      <section id="selection-matrix" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Current system"
          title="How judges are selected, court by court"
          description="Texas Judicial Branch and Secretary of State guidance show a mixed system: partisan elections dominate the constitutional courts, while specialized and municipal courts add several appointment models."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[1150px] text-left">
            <thead className="border-b bg-muted/40 text-sm">
              <tr>
                <th className="px-5 py-4 font-bold">Court</th>
                <th className="px-5 py-4 font-bold">Regular selection</th>
                <th className="px-5 py-4 font-bold">Vacancy path</th>
                <th className="px-5 py-4 font-bold">Term</th>
                <th className="px-5 py-4 font-bold">Core qualifications</th>
              </tr>
            </thead>
            <tbody>
              {TEXAS_JUDICIAL_SELECTION_MATRIX.map((row) => (
                <tr key={row.court} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4">
                    <p className="font-bold">{row.court}</p>
                    {row.note ? <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">{row.note}</p> : null}
                  </td>
                  <td className="px-5 py-4 text-sm leading-6">{row.selection}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted-foreground">{row.vacancy}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-primary">{row.term}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted-foreground">{row.qualifications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-5xl text-sm leading-6 text-muted-foreground">This table is a civic overview, not a substitute for checking the specific constitutional, statutory, residency, filing, and license requirements that apply to a candidate or vacancy. The Texas Secretary of State publishes election-year candidate qualification guidance.</p>
      </section>

      <section id="vacancies" className="mt-14 scroll-mt-24 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading
          eyebrow="The hybrid system"
          title="An elected court can still have an appointed judge"
          description="Regular selection and vacancy filling are different legal questions. Confusing them is one of the easiest ways to misdescribe a Texas judge's path to office."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">State appellate and district vacancies</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Vacancies on the Supreme Court, Court of Criminal Appeals, courts of appeals, and district courts can be filled by the governor with the advice and consent of the Senate. The office remains an elected office even when an appointee temporarily fills it.</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">County-level vacancies</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">For specified constitutional and statutory county courts, the county commissioners court fills vacancies. That makes the vacancy authority local rather than gubernatorial.</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Permanent appointment models</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">The Business Court uses gubernatorial appointment with Senate confirmation for regular two-year terms, while most municipal judges are appointed under local law. These are not merely vacancy exceptions to elected judgeships.</p>
          </article>
        </div>
        <div className="mt-6 rounded-xl border bg-card p-5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Reporting rule</p>
          <p className="mt-2 leading-7 text-foreground/90">For any judicial biography or election guide, Keep TX Red should record at least two separate facts: <strong>how the judge first entered the seat</strong> and <strong>which elections the judge later won</strong>. “Appointed in 2023, elected in 2024” conveys materially more information than simply calling the person an elected judge or an appointee.</p>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Qualifications"
          title="The qualification rules became tougher for newer appellate and district judges"
          description="Texas voters approved a constitutional amendment in 2021 that increased experience requirements and added license-standing protections for specified judges. The revised rules apply to covered judges first elected or appointed on or after January 1, 2025."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-2xl font-bold">Appellate courts</h3>
            <p className="mt-3 leading-7 text-muted-foreground">For the Supreme Court, Court of Criminal Appeals, and courts of appeals, current guidance generally requires at least 10 years of qualifying Texas legal or combined legal/judicial experience, plus the constitutional citizenship, residency, age, and license-standing requirements.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-2xl font-bold">District courts</h3>
            <p className="mt-3 leading-7 text-muted-foreground">The amendment increased the qualifying legal/judicial experience requirement for district judges to eight years for covered judges and added rules addressing suspension or revocation of the candidate's Texas law license during the qualifying period.</p>
          </article>
        </div>
        <p className="mt-5 max-w-5xl leading-7 text-foreground/90">This is an important date-sensitive distinction. A summary written before the amended qualification rules took effect can now be stale even if its explanation of partisan elections is otherwise correct.</p>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading eyebrow="Campaigns" title="Judicial elections are partisan, but they also have judicial-specific campaign rules" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 leading-8 text-foreground/90">
            <p>Texas judicial candidates operate inside the state's ordinary election system but also face restrictions under the Judicial Campaign Fairness Act. The Texas Ethics Commission publishes judicial-specific rules on contribution limits, fundraising periods, law-firm-group contributions, political advertising, and other campaign-finance requirements.</p>
            <p>That matters because debates over elected judges are not only debates about the party label on a ballot. They also involve how candidates finance statewide or district campaigns, how voters obtain information in long ballots, and whether fundraising can affect public confidence in judicial independence.</p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-5">
            <h3 className="text-xl font-bold">Straight-party voting ended in 2020</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">House Bill 25 eliminated the one-selection straight-party option effective September 1, 2020. Texas judicial elections remain partisan, but a voter who wants every candidate of one party must make the individual selections on the ballot.</p>
            <a href="https://www.sos.state.tx.us/elections/laws/advisory2020-29.shtml" target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-bold text-primary underline-offset-4 hover:underline">Texas Secretary of State advisory ↗</a>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="1836 to 2026"
          title="Why Texas keeps debating how to choose judges"
          description="Appointment and election are both part of Texas history. The present partisan-election system is a constitutional choice shaped by Reconstruction, later court expansion, modern campaign politics, and repeated reform efforts."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b bg-muted/40 text-sm"><tr><th className="px-5 py-4 font-bold">Year</th><th className="px-5 py-4 font-bold">Change</th><th className="px-5 py-4 font-bold">Why it matters</th></tr></thead>
            <tbody>
              {JUDICIAL_SELECTION_TIMELINE.map((item) => (
                <tr key={`${item.year}-${item.title}`} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4 whitespace-nowrap font-bold text-primary">{item.year}</td>
                  <td className="px-5 py-4 font-semibold">{item.title}</td>
                  <td className="px-5 py-4 leading-7 text-muted-foreground">{item.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="reform" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="2020 Texas Commission on Judicial Selection"
          title="Texas studied the alternatives—and still did not find a consensus replacement"
          description="The Legislature created the 15-member commission in 2019. Its final report is unusually useful because it records actual votes on the competing systems instead of reducing the debate to slogans."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {JUDICIAL_SELECTION_REFORM_FINDINGS.map((finding) => (
            <article key={finding.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-xl font-bold">{finding.title}</h3>
              <p className="mt-3 font-semibold leading-6 text-primary">{finding.result}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{finding.context}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-xl border bg-muted/30 p-5">
          <p className="leading-7 text-foreground/90"><strong>The central lesson:</strong> a majority could oppose partisan judicial elections while also opposing nonpartisan elections, and the commission could split evenly on appointment plus retention. The report therefore documented a reform problem without producing a majority replacement model. It did, however, show strong agreement around higher qualifications and tighter attention to campaign money.</p>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading eyebrow="2026 voter guide" title="What this means when a judicial race appears on your ballot" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {JUDICIAL_SELECTION_VOTER_GUIDE.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold">
          <Link to="/elections/2026" className="text-primary underline-offset-4 hover:underline">2026 Election Central →</Link>
          <Link to="/texas-government/texas-supreme-court-history" className="text-primary underline-offset-4 hover:underline">Texas Supreme Court history →</Link>
          <Link to="/texas-government/court-of-criminal-appeals-history" className="text-primary underline-offset-4 hover:underline">Court of Criminal Appeals history →</Link>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Related authority guides" title="Continue through the Texas court system" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Texas courts", "Current trial and appellate court structure across the state.", "/texas-courts"],
            ["Supreme Court of Texas", "Current justices, jurisdiction, powers, and official resources.", "/texas-government/supreme-court"],
            ["Court of Criminal Appeals", "Current judges, criminal jurisdiction, and official resources.", "/texas-government/court-of-criminal-appeals"],
            ["Texas Supreme Court history", "How the civil high court developed from the Republic to today.", "/texas-government/texas-supreme-court-history"],
            ["CCA history", "The criminal high court from the 1876 Court of Appeals to the modern nine-member bench.", "/texas-government/court-of-criminal-appeals-history"],
            ["Texas election history", "How statewide party competition and election rules changed over time.", "/texas-politics/texas-election-history"],
          ].map(([title, text, href]) => (
            <Link key={href} to={href} className="rounded-xl border bg-card p-5 transition hover:border-primary">
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Sources" title="Primary and Texas historical sources used for this guide" />
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {JUDICIAL_SELECTION_SOURCES.map((source) => (
            <li key={source.href} className="rounded-xl border bg-card p-4">
              <a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.label} ↗</a>
            </li>
          ))}
          <li className="rounded-xl border bg-card p-4">
            <a href="https://www.ethics.state.tx.us/resources/judicial/FairActJudicial.php" target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">Texas Ethics Commission: Judicial Campaign Fairness Act Guidelines ↗</a>
          </li>
        </ul>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="FAQ" title="Texas judicial election and appointment questions" />
        <div className="mt-6 space-y-4">
          {FAQS.map((faq) => (
            <article key={faq.question} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold">{faq.question}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
