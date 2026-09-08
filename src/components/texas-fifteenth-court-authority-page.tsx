import { Link } from "@tanstack/react-router";
import {
  FIFTEENTH_COURT_CONSTITUTIONAL_CASE,
  FIFTEENTH_COURT_EXPANSION,
  FIFTEENTH_COURT_FAQS,
  FIFTEENTH_COURT_JURISDICTION,
  FIFTEENTH_COURT_JUSTICES,
  FIFTEENTH_COURT_LIMITS,
  FIFTEENTH_COURT_PATHS,
  FIFTEENTH_COURT_QUICK_FACTS,
  FIFTEENTH_COURT_REVIEWED,
  FIFTEENTH_COURT_SELECTION,
  FIFTEENTH_COURT_SOURCES,
  FIFTEENTH_COURT_TIMELINE,
} from "@/data/texas-fifteenth-court-authority";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-government/fifteenth-court-of-appeals`;
const TITLE = "Texas Fifteenth Court of Appeals: Jurisdiction, Justices & History | KeepTXRed";
const DESCRIPTION = "A current guide to the Texas Fifteenth Court of Appeals: its statewide civil jurisdiction, current justices, Business Court appeals, 2024 constitutional challenge, statewide elections, and planned expansion to five seats.";

export function texasFifteenthCourtAuthorityHead() {
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
          headline: "Texas Fifteenth Court of Appeals",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: FIFTEENTH_COURT_REVIEWED,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: FIFTEENTH_COURT_SOURCES.map((source) => ({
            "@type": "CreativeWork",
            name: source.label,
            url: source.href,
          })),
          about: [
            { "@type": "Thing", name: "Fifteenth Court of Appeals" },
            { "@type": "Thing", name: "Texas courts of appeals" },
            { "@type": "Thing", name: "Texas Business Court" },
          ],
          isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FIFTEENTH_COURT_FAQS.map((faq) => ({
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

export function TexasFifteenthCourtAuthorityPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / <Link to="/texas-courts">Texas Courts</Link> / Fifteenth Court of Appeals
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas appellate-court authority guide</p>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Reviewed {FIFTEENTH_COURT_REVIEWED}</span>
        </div>
        <h1 className="mt-4 max-w-6xl text-4xl font-bold leading-tight md:text-6xl">Texas Fifteenth Court of Appeals: The Statewide Court That Changed the Appellate Map</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
          Texas created the Fifteenth Court of Appeals in 2023 and opened it on September 1, 2024. Unlike the state's regional intermediate courts, its district covers all 254 counties and its jurisdiction is specialized: specified civil cases involving Texas state government, certain public-law disputes, and appeals from the Texas Business Court.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#current-court" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Current justices</a>
          <a href="#jurisdiction" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">What it hears</a>
          <a href="#constitutionality" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Constitutional challenge</a>
          <a href="#future-seats" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Five-seat expansion</a>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Fifteenth Court quick facts">
        {FIFTEENTH_COURT_QUICK_FACTS.map((fact) => (
          <article key={fact.label} className="rounded-xl border bg-card p-5">
            <p className="text-2xl font-bold text-primary">{fact.value}</p>
            <p className="mt-1 font-bold">{fact.label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{fact.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Why this court is different"
          title="Statewide geography plus subject-matter specialization"
          description="The Fifteenth Court is still a constitutional Texas court of appeals, but the Legislature gave it a statewide district and restricted its docket to defined civil matters instead of the ordinary regional civil-and-criminal model."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">One statewide district</h3>
            <p className="mt-3 leading-7 text-muted-foreground">The district comprises all 254 counties. The court sits in Austin and may transact business elsewhere in the district when the court determines that is necessary and convenient.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">A specialized civil docket</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Its jurisdiction is tied to specified civil subject matter and parties. That makes it structurally different from the First through Fourteenth Courts of Appeals, which generally serve geographic regions and hear both civil and criminal appeals.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">Linked to the Business Court</h3>
            <p className="mt-3 leading-7 text-muted-foreground">The Legislature paired the new statewide appellate court with the specialized Texas Business Court. Covered Business Court appeals move to the Fifteenth Court rather than a regional court of appeals.</p>
            <Link to="/texas-government/texas-business-court" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">Read the Texas Business Court guide →</Link>
          </article>
        </div>
      </section>

      <section id="current-court" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Current bench"
          title="The inaugural three-member court remains in place in 2026"
          description="The Texas Judicial Branch currently lists the three justices Governor Greg Abbott appointed to launch the court in September 2024."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {FIFTEENTH_COURT_JUSTICES.map((justice) => (
            <article key={justice.place} className="rounded-xl border bg-card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{justice.place}</p>
              <h3 className="mt-2 text-2xl font-bold">{justice.name}</h3>
              <p className="mt-1 font-semibold text-muted-foreground">{justice.role}</p>
              <p className="mt-4 text-sm leading-6">{justice.appointed}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{justice.background}</p>
              <a href={justice.officialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">Official biography ↗</a>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-xl border bg-muted/30 p-5">
          <p className="font-bold">Clerk of Court: Michael A. Cruz</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">The court appointed Michael A. Cruz as Clerk of Court effective April 1, 2026. The Judicial Branch says he had served as the court's chief deputy clerk since its creation in September 2024.</p>
          <a href="https://www.txcourts.gov/15thcoa/about-the-court/clerk-of-court/" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-bold text-primary hover:underline">Official clerk information ↗</a>
        </div>
      </section>

      <section id="jurisdiction" className="mt-14 scroll-mt-24 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading
          eyebrow="Jurisdiction"
          title="What the Fifteenth Court actually hears"
          description="The statewide district does not create statewide jurisdiction over every appeal. The Legislature defined a specialized civil docket in Government Code Chapter 22 and linked it to Business Court appeals in Chapter 25A."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {FIFTEENTH_COURT_JURISDICTION.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Limits"
          title="What the statewide court does not automatically hear"
          description="A statewide district can sound broader than it is. These limits are central to understanding the Fifteenth Court."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FIFTEENTH_COURT_LIMITS.map((item) => (
            <div key={item} className="rounded-xl border bg-card p-5 text-sm leading-6 text-muted-foreground">{item}</div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Appeal paths"
          title="Where the Fifteenth Court fits in Texas's split appellate system"
          description="Texas has separate final courts for civil and criminal matters. The Fifteenth Court is an intermediate civil appellate court within that broader system."
        />
        <div className="mt-6 space-y-4">
          {FIFTEENTH_COURT_PATHS.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2 font-semibold text-primary">{item.path}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <Link to="/texas-courts" className="mt-5 inline-block rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">See all 15 Texas courts of appeals →</Link>
      </section>

      <section id="constitutionality" className="mt-14 scroll-mt-24 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading
          eyebrow="Foundational case"
          title="The Texas Supreme Court upheld the Fifteenth Court before it opened"
          description="The new court faced a direct constitutional challenge in August 2024, days before its first term began."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-xl border bg-muted/30 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{FIFTEENTH_COURT_CONSTITUTIONAL_CASE.docket}</p>
            <h3 className="mt-2 text-xl font-bold">{FIFTEENTH_COURT_CONSTITUTIONAL_CASE.name}</h3>
            <p className="mt-2 text-sm font-semibold">{FIFTEENTH_COURT_CONSTITUTIONAL_CASE.citation}</p>
            <p className="mt-1 text-sm text-muted-foreground">Decided {FIFTEENTH_COURT_CONSTITUTIONAL_CASE.decided}</p>
            <a href={FIFTEENTH_COURT_CONSTITUTIONAL_CASE.officialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">Read the official opinion ↗</a>
          </article>
          <article className="rounded-xl border p-5">
            <h3 className="text-xl font-bold">Holding and significance</h3>
            <p className="mt-3 leading-7 text-muted-foreground">{FIFTEENTH_COURT_CONSTITUTIONAL_CASE.holding}</p>
            <p className="mt-4 leading-7 text-muted-foreground">{FIFTEENTH_COURT_CONSTITUTIONAL_CASE.significance}</p>
          </article>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Judicial selection"
          title="The court began with appointments and transitions to statewide elections"
          description="The unusual startup sequence was part of the 2024 constitutional challenge and is a key difference between the inaugural court and its long-term selection structure."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Inaugural appointments</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{FIFTEENTH_COURT_SELECTION.initial}</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Statewide elections</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{FIFTEENTH_COURT_SELECTION.elections}</p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Qualifications</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{FIFTEENTH_COURT_SELECTION.qualifications}</p>
            <Link to="/texas-government/judicial-selection-elections" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">Compare Texas judicial selection systems →</Link>
          </article>
        </div>
      </section>

      <section id="future-seats" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Future structure"
          title="Current law expands the court from three to five justices"
          description="The 2025 Legislature revised the transition schedule rather than immediately moving the court to its eventual five-seat structure."
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {FIFTEENTH_COURT_EXPANSION.map((item) => (
            <article key={item.date} className="rounded-xl border bg-card p-6">
              <p className="text-sm font-bold text-primary">{item.date}</p>
              <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="History" title="From creation to a permanent statewide appellate institution" />
        <div className="mt-6 space-y-4">
          {FIFTEENTH_COURT_TIMELINE.map((item) => (
            <article key={`${item.year}-${item.title}`} className="grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-[120px_1fr]">
              <p className="font-bold text-primary">{item.year}</p>
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading eyebrow="Official sources" title="Primary sources behind this guide" description="Court rosters and procedural details can change. These are the official institutions and enacted authorities used to review the page." />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {FIFTEENTH_COURT_SOURCES.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-lg border bg-card px-4 py-3 text-sm font-semibold hover:border-primary hover:text-primary">{source.label} ↗</a>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="FAQ" title="Texas Fifteenth Court of Appeals questions" />
        <div className="mt-6 space-y-4">
          {FIFTEENTH_COURT_FAQS.map((faq) => (
            <details key={faq.question} className="rounded-xl border bg-card p-5">
              <summary className="cursor-pointer font-bold">{faq.question}</summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading eyebrow="Related judiciary guides" title="Keep following the Texas court structure" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/texas-courts" className="rounded-xl border p-5 hover:border-primary">
            <p className="font-bold">Texas Courts</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">All 15 courts of appeals and the civil/criminal appellate split.</p>
          </Link>
          <Link to="/texas-government/texas-business-court" className="rounded-xl border p-5 hover:border-primary">
            <p className="font-bold">Texas Business Court</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">The specialized trial court whose appeals feed the Fifteenth Court.</p>
          </Link>
          <Link to="/texas-government/texas-supreme-court-history" className="rounded-xl border p-5 hover:border-primary">
            <p className="font-bold">Texas Supreme Court</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">The state's court of last resort for civil matters.</p>
          </Link>
          <Link to="/texas-government/judicial-selection-elections" className="rounded-xl border p-5 hover:border-primary">
            <p className="font-bold">Judicial Elections</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">How Texas selects judges, fills vacancies and structures terms.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
