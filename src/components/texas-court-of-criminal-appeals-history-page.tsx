import { Link } from "@tanstack/react-router";
import {
  CCA_HISTORIC_FIRSTS,
  CCA_LANDMARK_CASES,
  CCA_NOTABLE_JUDGES,
  CCA_PRESIDING_JUDGES,
  CCA_REVIEWED,
  CCA_SOURCES,
  CCA_TIMELINE,
  CURRENT_CCA_JUDGES,
} from "@/data/texas-court-of-criminal-appeals-history-expanded";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-government/court-of-criminal-appeals-history`;
const TITLE = "Texas Court of Criminal Appeals History: Judges, Elections & Landmark Cases | KeepTXRed";
const DESCRIPTION = "A comprehensive, source-backed history of the Texas Court of Criminal Appeals: the current nine judges, presiding-judge lineage, elections, jurisdiction, landmark criminal cases, historic firsts, and the Court's development since 1876.";

const FAQS = [
  {
    question: "Is the Texas Court of Criminal Appeals below the Texas Supreme Court?",
    answer: "No. Texas has two separate courts of last resort. The Court of Criminal Appeals is the highest state court for criminal cases, while the Supreme Court of Texas is the highest state court for civil matters and juvenile cases.",
  },
  {
    question: "How many judges serve on the Texas Court of Criminal Appeals?",
    answer: "Article V of the Texas Constitution provides for one presiding judge and eight judges, for a total of nine members.",
  },
  {
    question: "How are Texas Court of Criminal Appeals judges selected?",
    answer: "The presiding judge and eight judges are elected statewide in partisan general elections for six-year terms. Vacancies can be filled through the constitutional appointment process until the electoral process fills the seat.",
  },
  {
    question: "When was the Texas Court of Criminal Appeals created?",
    answer: "The Constitution of 1876 created a three-judge Court of Appeals with criminal jurisdiction. Voters approved the 1891 judicial amendment that reorganized the system and established the Court of Criminal Appeals name; the reorganized court began operating in 1892.",
  },
  {
    question: "Does the Court of Criminal Appeals hear every Texas criminal appeal?",
    answer: "No. Most criminal appeals first go to a regional court of appeals. The Court of Criminal Appeals exercises discretionary review over many of those decisions, while death-penalty cases have a constitutionally specified direct path to the Court.",
  },
  {
    question: "Who is the current presiding judge of the Texas Court of Criminal Appeals?",
    answer: "David J. Schenck is the current presiding judge. He was elected statewide in 2024 and took office in January 2025.",
  },
  {
    question: "Who was the first woman on the Texas Court of Criminal Appeals?",
    answer: "Sharon Keller became the first woman elected to the Court of Criminal Appeals in 1994. She later won election as presiding judge in 2000 and served in that role from 2001 through 2024.",
  },
];

export function texasCourtOfCriminalAppealsHistoryHead() {
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
          headline: "History of the Texas Court of Criminal Appeals",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: CCA_REVIEWED,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: CCA_SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.href })),
          about: [
            { "@type": "GovernmentOrganization", name: "Texas Court of Criminal Appeals", url: "https://www.txcourts.gov/cca/" },
            { "@type": "Thing", name: "Texas criminal appellate law" },
            { "@type": "Thing", name: "Texas judicial history" },
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
    <div className="max-w-4xl">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">{description}</p> : null}
    </div>
  );
}

export function TexasCourtOfCriminalAppealsHistoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / Court of Criminal Appeals History
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas judicial authority guide</p>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Reviewed {CCA_REVIEWED}</span>
        </div>
        <h1 className="mt-4 max-w-6xl text-4xl font-bold leading-tight md:text-6xl">History of the Texas Court of Criminal Appeals</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
          Texas has two separate courts of last resort. This guide follows the state's highest criminal court from the three-judge Court of Appeals created in 1876 through the 1891 reorganization, the growth to nine judges, the move to discretionary review, modern statewide elections, landmark criminal-law decisions, historic firsts, and the judges serving today.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#current-court" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Current judges</a>
          <a href="#presiding-lineage" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Presiding-judge lineage</a>
          <a href="#landmark-cases" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Landmark cases</a>
          <Link to="/texas-government/judicial-selection-elections" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">How Texas elects judges</Link>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Texas Court of Criminal Appeals quick facts">
        {[
          ["9 members", "One presiding judge and eight judges under Article V."],
          ["6-year terms", "The Court's judges are elected statewide."],
          ["Highest criminal court", "The CCA is Texas's court of last resort for criminal cases."],
          ["Death-penalty direct review", "The constitution gives the Court direct appellate jurisdiction in cases where the death penalty has been assessed."],
        ].map(([value, text]) => (
          <div key={value} className="rounded-xl border bg-card p-5">
            <p className="text-xl font-bold text-primary">{value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section id="current-court" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Current court"
          title="The nine judges serving today"
          description="The official Texas Judicial Branch roster lists Presiding Judge David Schenck and Judges Mary Lou Keel, Bert Richardson, Kevin Yeary, Scott Walker, Jesse McClure, Gina Parker, Lee Finley, and David Newell."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CURRENT_CCA_JUDGES.map((judge) => (
            <article key={judge.name} className="rounded-xl border bg-card p-5">
              <h3 className="text-xl font-bold">{judge.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{judge.service}</p>
              {judge.selection ? <p className="mt-3 text-sm leading-6 text-foreground/90">{judge.selection}</p> : null}
              {judge.note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{judge.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading eyebrow="Jurisdiction" title="What the Court of Criminal Appeals actually does" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 leading-8 text-foreground/90">
            <p>Article V gives the Court final appellate jurisdiction across Texas in criminal cases, subject to constitutional and statutory rules. That makes the CCA a peer of the Texas Supreme Court at the top of a separate subject-matter track: criminal cases end at the CCA, while civil and juvenile cases ordinarily end at the Supreme Court.</p>
            <p>Most criminal appeals now move first through one of Texas's regional courts of appeals. The CCA can grant discretionary review to resolve important criminal-law questions, conflicts, procedural issues, or other matters within its authority. Death-penalty cases are different because the constitution gives the Court direct appellate jurisdiction when a death sentence has been assessed.</p>
            <p>The Court also exercises major habeas-corpus and extraordinary-writ authority in criminal matters. Those powers can put it at the center of post-conviction innocence claims, changed scientific evidence, constitutional challenges, and statewide questions about criminal procedure.</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">CCA vs. Texas Supreme Court</h3>
            <dl className="mt-4 space-y-4 text-sm leading-6">
              <div><dt className="font-bold text-primary">Court of Criminal Appeals</dt><dd className="text-muted-foreground">Criminal cases, criminal habeas matters, discretionary review, and direct death-penalty appeals.</dd></div>
              <div><dt className="font-bold text-primary">Supreme Court of Texas</dt><dd className="text-muted-foreground">Civil and juvenile matters, plus statewide judicial-administration responsibilities within its constitutional authority.</dd></div>
              <div><dt className="font-bold text-primary">Neither is above the other</dt><dd className="text-muted-foreground">They are separate courts of last resort with different subject-matter jurisdiction.</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Selection" title="How a CCA judge gets the job" description="Texas combines statewide elections with vacancy appointments, so a judge's first day in office and the election that secures a longer term may be different events." />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Statewide elections</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Article V provides that the presiding judge and eight judges are elected by qualified voters statewide in general elections for six-year terms.</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Vacancy appointments</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">When a covered vacancy occurs, the governor can appoint a qualified replacement under the Texas Constitution, with the seat returning to the electoral process required by law.</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Qualifications</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">CCA judges have the same constitutional qualifications as Supreme Court justices, including Texas licensure, age, residency/citizenship requirements, and the required period of qualifying legal or judicial experience.</p>
          </article>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="1876 to today"
          title="The institutional turning points that built the modern Court"
          description="The CCA's current role came from repeated constitutional changes in membership, appellate jurisdiction, panel practice, and rulemaking authority."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b bg-muted/40 text-sm"><tr><th className="px-5 py-4 font-bold">Year</th><th className="px-5 py-4 font-bold">Milestone</th><th className="px-5 py-4 font-bold">Why it matters</th></tr></thead>
            <tbody>
              {CCA_TIMELINE.map((item) => (
                <tr key={`${item.year}-${item.title}`} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4 font-bold text-primary">{item.year}</td>
                  <td className="px-5 py-4 font-semibold">{item.title}</td>
                  <td className="px-5 py-4 leading-7 text-muted-foreground">{item.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="landmark-cases" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Cases that changed Texas criminal law"
          title="Landmark decisions in the Court's history"
          description="This is a representative set, not a claim that five cases can summarize more than a century of Texas criminal appellate law."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {CCA_LANDMARK_CASES.map((item) => (
            <article key={item.name} className="rounded-xl border bg-card p-6">
              <p className="text-sm font-bold text-primary">{item.year}</p>
              <h3 className="mt-1 text-2xl font-bold">{item.name}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{item.significance}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Representation and institutional firsts" title="Milestones that changed who served and how the Court was led" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CCA_HISTORIC_FIRSTS.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading eyebrow="Political history" title="Statewide judicial elections became part of Texas's partisan realignment" />
        <div className="mt-5 space-y-4 leading-8 text-foreground/90">
          <p>For much of the post-Reconstruction era, Democratic dominance in statewide politics carried into the judiciary. As Republican strength grew late in the twentieth century, Court of Criminal Appeals races became part of the broader transformation of Texas statewide elections.</p>
          <p>The election mechanism did not change simply because the winning party did: Texans continued electing the Court statewide. What changed was the electorate, party competition, and the practical significance of partisan labels in judicial races. The 1990 election of Morris Overstreet and the 1994 election of Sharon Keller also produced two major representation milestones during that period of transition.</p>
          <p>Party history is relevant to how judges reach office, but it is not a substitute for case-level analysis. The Court decides criminal cases under constitutions, statutes, precedent, rules, and the records before it; Keep TX Red treats election history and judicial holdings as related but distinct subjects.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
          <Link to="/texas-government/judicial-selection-elections" className="text-primary underline-offset-4 hover:underline">Texas judicial selection history →</Link>
          <Link to="/texas-politics/texas-election-history" className="text-primary underline-offset-4 hover:underline">Texas election history →</Link>
        </div>
      </section>

      <section id="presiding-lineage" className="mt-16 scroll-mt-24">
        <SectionHeading
          eyebrow="Leadership record"
          title="Presiding judges from the 1876 Court of Appeals to today"
          description="The table follows the presiding leadership lineage across the predecessor Court of Appeals and the Court of Criminal Appeals. Repeated names reflect separate periods of service."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b bg-muted/40 text-sm"><tr><th className="px-5 py-4 font-bold">Presiding judge</th><th className="px-5 py-4 font-bold">Service</th><th className="px-5 py-4 font-bold">Selection / note</th></tr></thead>
            <tbody>
              {CCA_PRESIDING_JUDGES.map((judge, index) => (
                <tr key={`${judge.name}-${judge.service}-${index}`} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4 font-semibold">{judge.name}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted-foreground">{judge.service}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted-foreground">{judge.selection ?? judge.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Beyond the presiding judges" title="Other notable judges in the Court's historical record" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CCA_NOTABLE_JUDGES.map((judge) => (
            <article key={judge.name} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold">{judge.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{judge.note}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 max-w-4xl text-sm leading-6 text-muted-foreground">This section highlights historically documented figures and is not labeled as a complete roster of every associate judge. The presiding-judge table above is the comprehensive leadership lineage maintained on this page.</p>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading eyebrow="Related Keep TX Red authority guides" title="Continue through the Texas judiciary" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Current Court of Criminal Appeals", "Current judges, jurisdiction, powers, and official resources.", "/texas-government/court-of-criminal-appeals"],
            ["Texas Supreme Court history", "The separate civil court of last resort from the Republic to today.", "/texas-government/texas-supreme-court-history"],
            ["Texas judicial selection", "How elections, appointments, vacancies, and reform debates shaped the judiciary.", "/texas-government/judicial-selection-elections"],
            ["Texas courts", "The statewide structure of trial courts and appellate courts.", "/texas-courts"],
            ["2026 Election Central", "Current statewide judicial races and election information.", "/elections/2026"],
            ["Texas election history", "How statewide party competition and voting patterns changed over time.", "/texas-politics/texas-election-history"],
          ].map(([title, text, href]) => (
            <Link key={href} to={href} className="rounded-xl border bg-card p-5 transition hover:border-primary">
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Sources" title="Primary and historical sources used for this guide" />
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {CCA_SOURCES.map((source) => (
            <li key={source.href} className="rounded-xl border bg-card p-4">
              <a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.label} ↗</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="FAQ" title="Texas Court of Criminal Appeals history questions" />
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
