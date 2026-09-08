import { Link } from "@tanstack/react-router";
import {
  TEXAS_COMMON_CASE_STARTS,
  TEXAS_DISTRICT_COURT_COUNT_AS_OF_REVIEW,
  TEXAS_TRIAL_COURT_2026_CHANGES,
  TEXAS_TRIAL_COURT_APPEAL_NOTES,
  TEXAS_TRIAL_COURT_TYPES,
  TEXAS_TRIAL_COURTS_FAQS,
  TEXAS_TRIAL_COURTS_REVIEWED,
  TEXAS_TRIAL_COURTS_SOURCES,
} from "@/data/texas-trial-courts-authority";

const SITE_URL = "https://keeptxred.com";
const CANONICAL_PATH = "/texas-government/texas-trial-courts";
const CANONICAL = `${SITE_URL}${CANONICAL_PATH}`;
const TITLE = "Texas Trial Courts: District, County, JP & Municipal Courts | KeepTXRed";
const DESCRIPTION = "A comprehensive guide to Texas trial courts: district courts, Business Court, county courts, probate courts, justice courts, municipal courts, jurisdiction, judges, appeals, and 2026 court changes.";

export function texasTrialCourtsAuthorityHead() {
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
          headline: "Texas Trial Courts: How District, County, Justice and Municipal Courts Work",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: TEXAS_TRIAL_COURTS_REVIEWED,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: TEXAS_TRIAL_COURTS_SOURCES.map((source) => ({
            "@type": "CreativeWork",
            name: source.label,
            url: source.href,
          })),
          about: [
            { "@type": "Thing", name: "Texas trial courts" },
            { "@type": "Thing", name: "Texas district courts" },
            { "@type": "Thing", name: "Texas county courts" },
            { "@type": "Thing", name: "Texas justice courts" },
            { "@type": "Thing", name: "Texas municipal courts" },
          ],
          isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: TEXAS_TRIAL_COURTS_FAQS.map((faq) => ({
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

export function TexasTrialCourtsAuthorityPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / <Link to="/texas-courts">Texas Courts</Link> / Trial Courts
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas judiciary authority guide</p>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Reviewed {TEXAS_TRIAL_COURTS_REVIEWED}</span>
        </div>
        <h1 className="mt-4 max-w-6xl text-4xl font-bold leading-tight md:text-6xl">Texas Trial Courts: Where Cases Actually Begin</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
          Texas does not have one generic trial court. The Judicial Branch identifies seven types: district courts, the Texas Business Court, constitutional county courts, statutory county courts at law, statutory probate courts, justice courts, and municipal courts. Their jurisdiction overlaps in places, changes by county, and determines where a case starts and where an appeal goes next.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#seven-courts" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Seven court types</a>
          <a href="#common-cases" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Where common cases start</a>
          <a href="#appeals" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">How appeals work</a>
          <a href="#find-court" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Find a Texas court</a>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Texas trial court quick facts">
        {[
          ["7", "trial-court types", "The Judicial Branch's current civic guide recognizes seven distinct trial-court types."],
          [String(TEXAS_DISTRICT_COURT_COUNT_AS_OF_REVIEW), "district courts", "Statutory active count after seven new districts took effect September 1, 2026."],
          ["254", "constitutional county courts", "One exists in every Texas county, although its judicial workload varies by county."],
          ["11", "administrative judicial regions", "Presiding judges coordinate assignments and administration; these regions are not another level of appeal."],
        ].map(([value, label, text]) => (
          <article key={label} className="rounded-xl border bg-card p-5">
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="mt-1 font-bold">{label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading
          eyebrow="Why the system looks complicated"
          title="Texas layers state, county and city trial courts instead of using one uniform local court"
          description="Jurisdiction comes from the Texas Constitution, statewide statutes, and in many county-level courts the specific law that created the court. That is why the same type of dispute can be assigned differently in different counties."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">General jurisdiction</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">District courts are the state's general-jurisdiction trial courts. They handle major civil matters, felonies, divorce, land-title disputes, election contests, juvenile matters, and cases not assigned elsewhere.</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">County specialization</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Every county has a constitutional county court, but the Legislature has added county courts at law and probate courts where local caseload and population justify specialized capacity.</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Local limited jurisdiction</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Justice and municipal courts handle high-volume local matters such as fine-only offenses, evictions, small civil cases, city-ordinance violations, and magistrate functions.</p>
          </article>
        </div>
      </section>

      <section id="seven-courts" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Current structure"
          title="The seven types of Texas trial courts"
          description="Counts are labeled by source date where appropriate because the Legislature can create courts and municipalities can change local court operations between statewide OCA snapshots."
        />
        <div className="mt-6 space-y-5">
          {TEXAS_TRIAL_COURT_TYPES.map((court) => (
            <article key={court.name} className="rounded-xl border bg-card p-6">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{court.level}</p>
                  <h3 className="mt-1 text-2xl font-bold">{court.name}</h3>
                </div>
                <p className="rounded-full border px-3 py-1 text-sm font-bold text-primary">{court.count}</p>
              </div>
              <p className="mt-4 leading-7 text-foreground/90">{court.footprint}</p>
              <dl className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-lg bg-muted/40 p-4"><dt className="font-bold">What it handles</dt><dd className="mt-2 text-sm leading-6 text-muted-foreground">{court.jurisdiction}</dd></div>
                <div className="rounded-lg bg-muted/40 p-4"><dt className="font-bold">How the judge is chosen</dt><dd className="mt-2 text-sm leading-6 text-muted-foreground">{court.selection}</dd></div>
                <div className="rounded-lg bg-muted/40 p-4"><dt className="font-bold">Where review goes</dt><dd className="mt-2 text-sm leading-6 text-muted-foreground">{court.appeal}</dd></div>
              </dl>
              {court.note ? <p className="mt-4 text-sm leading-6 text-muted-foreground"><span className="font-bold text-foreground">Context:</span> {court.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section id="common-cases" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Civic navigation"
          title="Where common Texas cases usually start"
          description="These are statewide orientation rules, not filing instructions. Local enabling statutes, venue rules, specialized jurisdiction and the facts of a case can change the correct court."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[860px] text-left">
            <thead className="border-b bg-muted/40 text-sm">
              <tr><th className="px-5 py-4 font-bold">Matter</th><th className="px-5 py-4 font-bold">Usual starting court</th><th className="px-5 py-4 font-bold">Why</th></tr>
            </thead>
            <tbody>
              {TEXAS_COMMON_CASE_STARTS.map((item) => (
                <tr key={item.matter} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4 font-bold">{item.matter}</td>
                  <td className="px-5 py-4 font-semibold text-primary">{item.starts}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted-foreground">{item.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="September 2026 update"
          title="Texas's district-court map is changing right now"
          description="A static 2025 court count is already obsolete. KTR reconciles the latest OCA structure chart with the later effective dates enacted in House Bill 16."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {TEXAS_TRIAL_COURT_2026_CHANGES.map((item) => (
            <article key={`${item.date}-${item.title}`} className="rounded-xl border bg-card p-5">
              <p className="text-sm font-bold text-primary">{item.date}</p>
              <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="appeals" className="mt-14 scroll-mt-24 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading
          eyebrow="After judgment"
          title="The appeal path depends on both the trial court and the type of case"
          description="The key distinction is that an appeal is normally review of a trial-court decision, while some lower local courts use a trial-de-novo system that starts the case again at the next level."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {TEXAS_TRIAL_COURT_APPEAL_NOTES.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/texas-courts" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">All 15 Courts of Appeals</Link>
          <Link to="/texas-government/texas-supreme-court-history" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Supreme Court history</Link>
          <Link to="/texas-government/court-of-criminal-appeals-history" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Court of Criminal Appeals</Link>
          <Link to="/texas-government/fifteenth-court-of-appeals" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Fifteenth Court</Link>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Judges and administration"
          title="Election, appointment and administration are separate questions"
          description="Texas uses multiple judicial-selection models, and administrative judicial regions help coordinate courts without becoming another appellate layer."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Most constitutional trial judges are elected</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">District judges, county judges, county-court-at-law judges, probate judges and justices of the peace generally run in partisan elections. Their districts, qualifications and vacancy rules differ.</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Business and municipal courts differ</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Business Court judges are appointed by the governor with Senate confirmation. Most municipal judges are appointed locally, although municipal selection is governed by applicable law and can vary.</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Eleven administrative regions</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Texas divides the state into eleven administrative judicial regions. Each has a presiding judge appointed by the governor for a four-year term to perform administrative and assignment functions.</p>
          </article>
        </div>
        <Link to="/texas-government/judicial-selection-elections" className="mt-5 inline-block font-bold text-primary hover:underline">Read the complete judicial-selection and elections guide →</Link>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading
          eyebrow="County judge ≠ district judge"
          title="The title “county judge” combines judicial history with county executive duties"
          description="This is one of the most common sources of confusion in Texas local government."
        />
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <p className="leading-8 text-foreground/90">The elected county judge presides over the constitutional county court, but also presides over the commissioners court and plays a central role in county administration. In many populous counties, statutory county courts at law or probate courts handle large portions of the judicial workload that the constitutional county court handles elsewhere.</p>
          <p className="leading-8 text-foreground/90">A district judge, by contrast, presides over a state district court. District boundaries are created by the Legislature and may be contained within one county or span multiple counties. The offices therefore differ in jurisdiction, geography, administrative role and vacancy process.</p>
        </div>
      </section>

      <section id="find-court" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Find the actual court"
          title="Use the Texas Judicial Branch directory and jurisdiction maps"
          description="For live judge names, contact information, court personnel and jurisdiction maps, use the state's current directory rather than relying on a static third-party list."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a href="https://www.txcourts.gov/judicial-directory/" target="_blank" rel="noreferrer" className="rounded-xl border bg-card p-5 hover:border-primary">
            <h3 className="font-bold">Texas Judicial Directory ↗</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">District, county, justice and municipal judges and personnel, plus live directory search.</p>
          </a>
          <a href="https://www.txcourts.gov/judicial-directory/court-jurisdiction-maps/" target="_blank" rel="noreferrer" className="rounded-xl border bg-card p-5 hover:border-primary">
            <h3 className="font-bold">Court Jurisdiction Maps ↗</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">District courts, county courts at law, probate courts, administrative regions, Business Court divisions and appellate districts.</p>
          </a>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="FAQ" title="Texas trial court questions" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {TEXAS_TRIAL_COURTS_FAQS.map((faq) => (
            <article key={faq.question} className="rounded-xl border bg-card p-5">
              <h3 className="font-bold">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading eyebrow="Continue the authority cluster" title="Related Texas judiciary guides" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Texas courts and appeals", "All 15 intermediate appellate courts, appeal paths and appellate history.", "/texas-courts"],
            ["Texas Business Court", "Divisions, appointed judges, jurisdiction, exclusions and appeals.", "/texas-government/texas-business-court"],
            ["Fifteenth Court of Appeals", "The statewide specialized intermediate appellate court.", "/texas-government/fifteenth-court-of-appeals"],
            ["Judicial selection and elections", "How Texas elects judges, fills vacancies and sets qualifications.", "/texas-government/judicial-selection-elections"],
            ["State Commission on Judicial Conduct", "Complaints, discipline, authority and limits.", "/texas-government/state-commission-on-judicial-conduct"],
            ["Texas Government", "Government institutions, officeholders and civic authority guides.", "/texas-government"],
          ].map(([label, text, href]) => (
            <Link key={href} to={href} className="rounded-xl border bg-card p-5 hover:border-primary">
              <h3 className="font-bold">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Primary sources" title="Official Texas judiciary and statutory sources" />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {TEXAS_TRIAL_COURTS_SOURCES.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-xl border bg-card p-4 text-sm font-semibold hover:border-primary hover:text-primary">{source.label} ↗</a>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">This page is a civic-reference guide, not legal advice or a substitute for checking the controlling jurisdiction, venue, filing, procedural, and appellate rules for a particular case.</p>
      </section>
    </main>
  );
}
