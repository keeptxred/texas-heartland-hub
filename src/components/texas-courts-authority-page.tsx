import { Link } from "@tanstack/react-router";
import {
  TEXAS_APPEAL_PATHS,
  TEXAS_APPELLATE_TIMELINE,
  TEXAS_COURTS_FAQS,
  TEXAS_COURTS_OF_APPEALS,
  TEXAS_COURTS_QUICK_FACTS,
  TEXAS_COURTS_REVIEWED,
  TEXAS_COURTS_SOURCES,
} from "@/data/texas-courts-authority";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-courts`;
const TITLE = "Texas Courts: 15 Courts of Appeals, Appeal Paths & History | KeepTXRed";
const DESCRIPTION = "A comprehensive guide to Texas courts and the 15 Courts of Appeals: current appellate structure, court-by-court directory, civil and criminal appeal paths, judicial elections, history, and the statewide Fifteenth Court of Appeals.";

export function texasCourtsAuthorityHead() {
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
          headline: "Texas Courts and Courts of Appeals",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: TEXAS_COURTS_REVIEWED,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: TEXAS_COURTS_SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.href })),
          about: [
            { "@type": "Thing", name: "Texas Courts of Appeals" },
            { "@type": "Thing", name: "Texas appellate courts" },
            { "@type": "Thing", name: "Fifteenth Court of Appeals" },
          ],
          isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: TEXAS_COURTS_FAQS.map((faq) => ({
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

export function TexasCourtsAuthorityPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / Texas Courts
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas judiciary authority guide</p>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Reviewed {TEXAS_COURTS_REVIEWED}</span>
        </div>
        <h1 className="mt-4 max-w-6xl text-4xl font-bold leading-tight md:text-6xl">Texas Courts: How the Appellate System Actually Works</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
          Texas has two separate courts of last resort and 15 intermediate Courts of Appeals. Fourteen appellate courts primarily serve geographic districts and hear both civil and criminal appeals. The newer Fifteenth Court sits in Austin, has a district composed of every Texas county, and handles specialized civil appeals involving specified state matters and the Texas Business Court. This guide explains all 15 courts, where appeals go next, how the system developed, and how voters select appellate justices.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#court-directory" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">All 15 appellate courts</a>
          <a href="#appeal-paths" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Where appeals go</a>
          <a href="#history" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Appellate history</a>
          <Link to="/texas-government/judicial-selection-elections" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">How judges are chosen</Link>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Texas appellate court quick facts">
        {TEXAS_COURTS_QUICK_FACTS.map((fact) => (
          <article key={fact.label} className="rounded-xl border bg-card p-5">
            <p className="text-2xl font-bold text-primary">{fact.value}</p>
            <p className="mt-1 font-bold">{fact.label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{fact.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="The hierarchy"
          title="Texas has two high courts, not one"
          description="The appellate path depends first on whether the case is civil or criminal. Calling every final Texas tribunal the 'Texas Supreme Court' is incorrect."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Civil and juvenile</p>
            <h3 className="mt-2 text-2xl font-bold">Supreme Court of Texas</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Texas's court of last resort for civil and juvenile matters. Most ordinary civil cases reach it only after an intermediate Court of Appeals, and review is generally discretionary.</p>
            <Link to="/texas-government/texas-supreme-court-history" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">Supreme Court history →</Link>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Criminal</p>
            <h3 className="mt-2 text-2xl font-bold">Court of Criminal Appeals</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Texas's court of last resort for criminal cases. Most criminal cases reach it after a regional Court of Appeals, while death-penalty cases follow a special direct-review path.</p>
            <Link to="/texas-government/court-of-criminal-appeals-history" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">CCA history →</Link>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Intermediate review</p>
            <h3 className="mt-2 text-2xl font-bold">15 Courts of Appeals</h3>
            <p className="mt-3 leading-7 text-muted-foreground">These courts review trial-court records and legal rulings rather than retrying cases. The first 14 primarily operate geographically; the Fifteenth uses statewide specialized civil jurisdiction.</p>
            <a href="#court-directory" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">See the complete directory →</a>
          </article>
        </div>
      </section>

      <section id="court-directory" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Current directory"
          title="All 15 Texas Courts of Appeals"
          description="The current system contains 14 primarily regional courts plus the statewide specialized Fifteenth Court. Official court links below lead to current justices, dockets, opinions, local rules, and contact information."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[940px] text-left">
            <thead className="border-b bg-muted/40 text-sm">
              <tr>
                <th className="px-5 py-4 font-bold">Court</th>
                <th className="px-5 py-4 font-bold">Location</th>
                <th className="px-5 py-4 font-bold">Created</th>
                <th className="px-5 py-4 font-bold">Current role</th>
                <th className="px-5 py-4 font-bold">Official court</th>
              </tr>
            </thead>
            <tbody>
              {TEXAS_COURTS_OF_APPEALS.map((court) => (
                <tr key={court.number} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4">
                    <p className="font-bold">{court.name}</p>
                    {court.note ? <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">{court.note}</p> : null}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold">{court.location}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-primary">{court.created}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted-foreground">{court.jurisdiction}</td>
                  <td className="px-5 py-4"><a href={court.officialUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline">Texas Judicial Branch ↗</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="appeal-paths" className="mt-14 scroll-mt-24 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading
          eyebrow="Appeal paths"
          title="Where a Texas case goes after trial"
          description="The route depends on the type of case. These simplified paths show why the intermediate courts matter and why the Supreme Court and Court of Criminal Appeals cannot be used interchangeably."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {TEXAS_APPEAL_PATHS.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-sm font-bold text-primary">{item.path}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">These are civic-navigation summaries, not legal advice. Original proceedings, interlocutory appeals, transferred cases, statutory exceptions, and specialized writ procedures can follow different routes.</p>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="The Fifteenth Court"
          title="Texas added a statewide appellate district without making every civil appeal statewide"
          description="The Fifteenth Court is the largest structural change to the intermediate appellate map in decades, but its jurisdiction is deliberately specialized."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-2xl font-bold">Created in 2023; operating since September 1, 2024</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Senate Bill 1045 organized Texas into 15 court-of-appeals districts and made the Fifteenth District consist of every county in the state. The court sits in Austin and began with a chief justice and two justices.</p>
            <p className="mt-3 leading-7 text-muted-foreground">Its statewide geography does not make it a general second appellate court for every Texan. Statute gives it specialized civil jurisdiction, including specified matters involving the state and exclusive intermediate review of Texas Business Court appeals.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-2xl font-bold">The first regular election cycle is 2026</h3>
            <p className="mt-3 leading-7 text-muted-foreground">The inaugural justices were gubernatorial appointees. Texas Secretary of State guidance says the chief justice and Places 2 and 3 appear on the 2026 ballot. Although every county is inside the Fifteenth District, the office is listed with other court-of-appeals district offices rather than as a statewide executive-style office.</p>
            <p className="mt-3 leading-7 text-muted-foreground">Current election guidance also reflects later legislation phasing in Places 4 and 5 in future years. For voters, the key distinction is simple: statewide geographic coverage and specialized subject-matter jurisdiction are separate concepts.</p>
          </article>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="https://www.txcourts.gov/15thcoa/" target="_blank" rel="noreferrer" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Official Fifteenth Court ↗</a>
          <Link to="/texas-government/texas-business-court" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas Business Court</Link>
          <Link to="/texas-government/judicial-selection-elections" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas judicial elections</Link>
        </div>
      </section>

      <section id="history" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Institutional history"
          title="From three civil appellate courts to today's 15-court system"
          description="Texas built the intermediate appellate layer in stages as the state's population, docket, and criminal appellate structure changed."
        />
        <div className="mt-6 space-y-4">
          {TEXAS_APPELLATE_TIMELINE.map((item) => (
            <article key={`${item.year}-${item.title}`} className="grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-[150px_1fr]">
              <p className="text-lg font-bold text-primary">{item.year}</p>
              <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading
          eyebrow="What appellate judges do"
          title="Courts of Appeals review records; they do not conduct new jury trials"
          description="The intermediate appellate role is about reviewing claimed legal and procedural error based primarily on the trial-court record."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border p-5"><h3 className="text-xl font-bold">Record review</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Justices review the clerk's record, reporter's record when applicable, written briefs, controlling law, and the issues preserved for appellate review.</p></article>
          <article className="rounded-xl border p-5"><h3 className="text-xl font-bold">Written opinions</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">The court can affirm, reverse, modify, remand, dismiss, or otherwise dispose of matters under governing law and rules. Its written decisions guide lower courts and litigants within the appellate system.</p></article>
          <article className="rounded-xl border p-5"><h3 className="text-xl font-bold">Original proceedings</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Courts of Appeals also handle specified original proceedings such as petitions for mandamus. These are distinct from ordinary appeals and are governed by separate standards.</p></article>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Selection"
          title="Court-of-appeals justices are elected, but vacancies can be appointed"
          description="The same distinction KTR uses for the two high courts applies here: regular selection and temporary vacancy filling are different mechanisms."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-2xl font-bold">Six-year partisan elections</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Chief justices and justices of Texas Courts of Appeals serve six-year terms and run in partisan elections within their appellate districts. Because the Fifteenth District consists of every Texas county, all Texas voters are within that district even though election guidance classifies it as a district judicial office.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-2xl font-bold">Vacancy appointments</h3>
            <p className="mt-3 leading-7 text-muted-foreground">A governor can fill a covered appellate vacancy with Senate consent. An appointed justice may later run in the partisan election system, so accurate biographies should record both the original appointment and later election history.</p>
          </article>
        </div>
        <Link to="/texas-government/judicial-selection-elections" className="mt-5 inline-block font-bold text-primary hover:underline">Read the complete Texas judicial-selection guide →</Link>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="FAQ" title="Texas Courts of Appeals questions" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {TEXAS_COURTS_FAQS.map((faq) => (
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
            ["Supreme Court history", "Institutional history, current court, justices, landmark cases, and historical roster.", "/texas-government/texas-supreme-court-history"],
            ["Court of Criminal Appeals history", "Texas's separate criminal high court, current bench, cases, and presiding-judge lineage.", "/texas-government/court-of-criminal-appeals-history"],
            ["Judicial selection and elections", "How Texas chooses judges, fills vacancies, sets qualifications, and debates reform.", "/texas-government/judicial-selection-elections"],
            ["Texas Business Court", "Current divisions, appointed judges, jurisdiction, exclusions and appeals to the Fifteenth Court.", "/texas-government/texas-business-court"],
            ["Texas Government", "Current offices, institutions, authority pages, and official government resources.", "/texas-government"],
            ["2026 Election Central", "Current statewide and district judicial election coverage.", "/elections/2026"],
            ["Texas constitutional history", "How successive constitutions redesigned the judiciary and state government.", "/texas-politics/texas-constitutional-history"],
          ].map(([label, text, href]) => (
            <Link key={href} to={href} className="rounded-xl border bg-card p-5 hover:border-primary">
              <h3 className="font-bold">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Primary sources" title="Official Texas judiciary and election sources" />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {TEXAS_COURTS_SOURCES.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-xl border bg-card p-4 text-sm font-semibold hover:border-primary hover:text-primary">{source.label} ↗</a>
          ))}
        </div>
      </section>
    </main>
  );
}
