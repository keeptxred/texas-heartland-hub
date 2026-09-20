import { Link } from "@tanstack/react-router";
import {
  TEXAS_BUSINESS_COURT_2025_CHANGES,
  TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS,
  TEXAS_BUSINESS_COURT_CASE_PATHS,
  TEXAS_BUSINESS_COURT_EXCLUSIONS,
  TEXAS_BUSINESS_COURT_FAQS,
  TEXAS_BUSINESS_COURT_JUDGE_SELECTION,
  TEXAS_BUSINESS_COURT_JURISDICTION,
  TEXAS_BUSINESS_COURT_NONOPERATIONAL_DIVISIONS,
  TEXAS_BUSINESS_COURT_QUICK_FACTS,
  TEXAS_BUSINESS_COURT_REVIEWED,
  TEXAS_BUSINESS_COURT_SOURCES,
  TEXAS_BUSINESS_COURT_TIMELINE,
} from "@/data/texas-business-court-authority";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-government/texas-business-court`;
const TITLE = "Texas Business Court: Jurisdiction, Judges, Divisions & Appeals | KeepTXRed";
const DESCRIPTION = "A current guide to the Texas Business Court: its five operational divisions, current judges, $5 million jurisdiction framework, exclusions, filing and removal paths, 2025 changes, and appeals to the Fifteenth Court of Appeals.";

export function texasBusinessCourtAuthorityHead() {
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
          headline: "Texas Business Court",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: TEXAS_BUSINESS_COURT_REVIEWED,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: TEXAS_BUSINESS_COURT_SOURCES.map((source) => ({
            "@type": "CreativeWork",
            name: source.label,
            url: source.href,
          })),
          about: [
            { "@type": "Thing", name: "Texas Business Court" },
            { "@type": "Thing", name: "Texas business litigation" },
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
          mainEntity: TEXAS_BUSINESS_COURT_FAQS.map((faq) => ({
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

export function TexasBusinessCourtAuthorityPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / <Link to="/texas-courts">Texas Courts</Link> / Texas Business Court
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas specialized-court authority guide</p>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Reviewed {TEXAS_BUSINESS_COURT_REVIEWED}</span>
        </div>
        <h1 className="mt-4 max-w-6xl text-4xl font-bold leading-tight md:text-6xl">Texas Business Court: What It Hears, Who Its Judges Are, and Where Appeals Go</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
          The Texas Business Court is a statewide specialized trial court for defined complex business disputes. It is organized into eleven geographic divisions, but the Texas Judicial Branch currently lists five divisions as operational, with two appointed judges in each. The court does not replace ordinary district courts, and simply involving a business does not make a case eligible.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#divisions" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Current divisions and judges</a>
          <a href="#jurisdiction" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">What the court can hear</a>
          <a href="#case-paths" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">How cases get there</a>
          <a href="#changes-2025" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">2025 law changes</a>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Texas Business Court quick facts">
        {TEXAS_BUSINESS_COURT_QUICK_FACTS.map((fact) => (
          <article key={fact.label} className="rounded-xl border bg-card p-5">
            <p className="text-2xl font-bold text-primary">{fact.value}</p>
            <p className="mt-1 font-bold">{fact.label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{fact.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="The basic distinction"
          title="This is a trial court, not a business appellate court"
          description="The Business Court can conduct trials and exercise district-court-type powers within its statutory jurisdiction. Appeals then move into the statewide specialized appellate track."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">Specialized trial jurisdiction</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Chapter 25A gives the court concurrent civil jurisdiction with district courts over specified organization, governance, commercial, financial, intellectual-property, trade-secret, arbitration and related disputes when the statutory requirements are met.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">District courts still matter</h3>
            <p className="mt-3 leading-7 text-muted-foreground">The Business Court is not a replacement for Texas district courts. Cases that do not fit Chapter 25A remain in the ordinary trial-court system, and even high-dollar disputes can fall outside Business Court subject-matter jurisdiction.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">Appeals go to the Fifteenth Court</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Except where the Supreme Court of Texas has concurrent or exclusive jurisdiction, the Fifteenth Court of Appeals has exclusive intermediate appellate jurisdiction over Business Court judgments, orders and related original proceedings.</p>
            <Link to="/texas-courts" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">See the Texas appellate structure →</Link>
          </article>
        </div>
      </section>

      <section id="divisions" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Current court"
          title="Five Business Court divisions are currently operational"
          description="The statutory court has eleven geographic divisions. The Texas Judicial Branch currently operates the First, Third, Fourth, Eighth and Eleventh Divisions, each with two judges."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[860px] text-left">
            <thead className="border-b bg-muted/40 text-sm">
              <tr>
                <th className="px-5 py-4 font-bold">Division</th>
                <th className="px-5 py-4 font-bold">Primary location</th>
                <th className="px-5 py-4 font-bold">Current judges</th>
                <th className="px-5 py-4 font-bold">Official division</th>
              </tr>
            </thead>
            <tbody>
              {TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS.map((division) => (
                <tr key={division.number} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4 font-bold">{division.name}</td>
                  <td className="px-5 py-4 text-sm font-semibold">{division.location}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted-foreground">{division.judges.join(" · ")}</td>
                  <td className="px-5 py-4"><a href={division.officialUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline">Texas Judicial Branch ↗</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 rounded-xl border bg-muted/30 p-5">
          <p className="font-bold">Statutory but not currently operational</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">The Second, Fifth, Sixth, Seventh, Ninth and Tenth Divisions remain in the statutory structure but are not listed by the Judicial Branch among the five operational divisions. In number form: {TEXAS_BUSINESS_COURT_NONOPERATIONAL_DIVISIONS.join(", ")}.</p>
        </div>
      </section>

      <section id="jurisdiction" className="mt-14 scroll-mt-24 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading
          eyebrow="Subject-matter jurisdiction"
          title="The $5 million figure is important, but it is not the whole test"
          description="Business Court jurisdiction depends on the type of dispute, the parties, the amount in controversy when a threshold applies, and statutory exclusions. A large dollar amount by itself does not create jurisdiction."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {TEXAS_BUSINESS_COURT_JURISDICTION.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-primary">{item.threshold}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Hard limits"
          title="Some claims are excluded even if the dispute is large"
          description="The Legislature did not create a general-purpose high-dollar civil court. Chapter 25A expressly keeps several categories outside Business Court jurisdiction."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {TEXAS_BUSINESS_COURT_EXCLUSIONS.map((item) => (
            <div key={item} className="rounded-xl border bg-card p-5 text-sm leading-6 text-muted-foreground">{item}</div>
          ))}
        </div>
        <p className="mt-5 max-w-5xl text-sm leading-6 text-muted-foreground">Jurisdiction can turn on detailed statutory definitions and pleadings. This page is a civic and legal-system explainer, not legal advice about whether a specific lawsuit belongs in Business Court.</p>
      </section>

      <section id="case-paths" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Procedure"
          title="How a case reaches — and leaves — the Business Court"
          description="A qualifying dispute can begin in Business Court, arrive through removal or a limited transfer procedure, and then move into the Fifteenth Court appellate track."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {TEXAS_BUSINESS_COURT_CASE_PATHS.map((item, index) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step/path {index + 1}</p>
              <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="https://www.txcourts.gov/businesscourt/practice-before-the-court/" target="_blank" rel="noreferrer" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Official practice information ↗</a>
          <a href="https://www.txcourts.gov/businesscourt/opinions/" target="_blank" rel="noreferrer" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Published Business Court opinions ↗</a>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading
          eyebrow="Judicial selection"
          title="Business Court judges are appointed, not elected"
          description={TEXAS_BUSINESS_COURT_JUDGE_SELECTION.significance}
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-xl border bg-muted/30 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Selection</p>
            <p className="mt-2 text-lg font-bold">{TEXAS_BUSINESS_COURT_JUDGE_SELECTION.selection}</p>
            <p className="mt-4 text-sm font-bold text-primary">{TEXAS_BUSINESS_COURT_JUDGE_SELECTION.term}</p>
            <Link to="/texas-government/judicial-selection-elections" className="mt-4 inline-block text-sm font-bold text-primary hover:underline">Compare Texas judicial selection systems →</Link>
          </article>
          <article className="rounded-xl border p-5">
            <h3 className="text-xl font-bold">Core statutory qualifications</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {TEXAS_BUSINESS_COURT_JUDGE_SELECTION.qualifications.map((qualification) => <li key={qualification}>• {qualification}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section id="changes-2025" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="89th Legislature"
          title="House Bill 40 materially changed the Business Court in 2025"
          description="The court that exists now is not identical to the one created in 2023. The 2025 Legislature changed jurisdiction, exclusions, transfer authority and the treatment of divisions that were not yet operating."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {TEXAS_BUSINESS_COURT_2025_CHANGES.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Institutional history"
          title="From 2023 creation to the current five-division court"
        />
        <div className="mt-6 space-y-4">
          {TEXAS_BUSINESS_COURT_TIMELINE.map((item) => (
            <article key={`${item.year}-${item.title}`} className="grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-[120px_1fr]">
              <p className="text-lg font-bold text-primary">{item.year}</p>
              <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="FAQ" title="Texas Business Court questions" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {TEXAS_BUSINESS_COURT_FAQS.map((faq) => (
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
            ["Texas courts authority hub", "The two high courts, all 15 Courts of Appeals, appeal paths and appellate history.", "/texas-courts"],
            ["Judicial selection and elections", "How Texas elects and appoints judges across different court systems.", "/texas-government/judicial-selection-elections"],
            ["State Commission on Judicial Conduct", "How judicial complaints, discipline, review and removal procedures work.", "/texas-government/state-commission-on-judicial-conduct"],
            ["Supreme Court history", "The civil high court's current bench, history, firsts and landmark disputes.", "/texas-government/texas-supreme-court-history"],
            ["Court of Criminal Appeals history", "Texas's separate criminal court of last resort and its historical development.", "/texas-government/court-of-criminal-appeals-history"],
            ["Texas Government", "State offices, institutions, powers, elections and authority guides.", "/texas-government"],
          ].map(([label, text, href]) => (
            <Link key={href} to={href} className="rounded-xl border bg-card p-5 hover:border-primary">
              <h3 className="font-bold">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Primary sources" title="Official Texas court and legislative sources" />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {TEXAS_BUSINESS_COURT_SOURCES.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-xl border bg-card p-4 text-sm font-semibold hover:border-primary hover:text-primary">{source.label} ↗</a>
          ))}
        </div>
      </section>
    </main>
  );
}
