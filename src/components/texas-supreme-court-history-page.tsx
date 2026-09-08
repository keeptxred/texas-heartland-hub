import { Link } from "@tanstack/react-router";
import {
  COURT_TIMELINE,
  CURRENT_JUSTICES,
  HISTORIC_FIRSTS,
  JUSTICES_1876_1945,
  LANDMARK_CASES,
  MODERN_SEATS,
  REPUBLIC_ASSOCIATE_JUSTICES,
  REPUBLIC_CHIEF_JUSTICES,
  STATEHOOD_TO_1876_GROUPS,
  SUPREME_COURT_REVIEWED,
  SUPREME_COURT_SOURCES,
} from "@/data/texas-supreme-court-history-expanded";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-government/texas-supreme-court-history`;
const TITLE = "Texas Supreme Court History: Justices, Elections & Landmark Cases | KeepTXRed";
const DESCRIPTION = "A comprehensive, source-backed history of the Supreme Court of Texas: every documented justice era, the current nine-member court, judicial elections, appointments, landmark cases, historic firsts, and the Court's constitutional role.";

const FAQS = [
  {
    question: "Is the Texas Supreme Court the highest criminal court in Texas?",
    answer: "No. The Supreme Court of Texas is the state's court of last resort for civil matters and juvenile cases. The Texas Court of Criminal Appeals is the highest state court for criminal matters.",
  },
  {
    question: "How many justices are on the Texas Supreme Court?",
    answer: "The Texas Constitution provides for a chief justice and eight justices, for a total of nine members. Five members constitute a quorum and five votes are required for a decision.",
  },
  {
    question: "How are Texas Supreme Court justices chosen?",
    answer: "Texas Supreme Court justices are elected statewide to six-year terms. When a vacancy occurs, the governor may appoint a replacement, and the seat then returns to the electoral process required by Texas law.",
  },
  {
    question: "What are the qualifications to serve on the Texas Supreme Court?",
    answer: "Article V of the Texas Constitution requires a justice to be licensed to practice law in Texas, be a U.S. citizen and Texas resident at the time of election, be at least 35 years old, and have at least ten years of qualifying Texas legal or judicial experience without specified license discipline during that period.",
  },
  {
    question: "When did the Texas Supreme Court become a nine-member court?",
    answer: "A 1945 constitutional amendment expanded the Court from three members to nine. Six judges from the Commission of Appeals became associate justices as part of the transition.",
  },
  {
    question: "Who was the first woman on the Texas Supreme Court?",
    answer: "Texas had a special all-woman Supreme Court in 1925 for one case. Ruby Kless Sondock became the first woman to serve on the regular Supreme Court of Texas when she was appointed in 1982.",
  },
  {
    question: "Who is the longest-serving Texas Supreme Court justice?",
    answer: "Nathan L. Hecht served on the Court from 1989 through the end of 2024 and is recognized by the Court as its longest-serving member.",
  },
];

export function texasSupremeCourtHistoryHead() {
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
          headline: "History of the Texas Supreme Court",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: SUPREME_COURT_REVIEWED,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: SUPREME_COURT_SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.href })),
          about: [
            { "@type": "GovernmentOrganization", name: "Supreme Court of Texas", url: "https://www.txcourts.gov/supreme/" },
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

export function TexasSupremeCourtHistoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / Texas Supreme Court History
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas judicial authority guide</p>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Reviewed {SUPREME_COURT_REVIEWED}</span>
        </div>
        <h1 className="mt-4 max-w-6xl text-4xl font-bold leading-tight md:text-6xl">History of the Texas Supreme Court</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
          The Supreme Court of Texas has existed in several constitutional forms since the Republic. This guide follows the Court from 1836 to the present, identifies the justices who served in each era, explains elections and appointments, tracks the 1945 expansion to nine seats, highlights landmark disputes and historic firsts, and connects the Court’s institutional history to the political realignment that reshaped statewide judicial elections.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#current-court" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Current justices</a>
          <a href="#complete-roster" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Complete historical roster</a>
          <Link to="/texas-politics/texas-supreme-court-realignment" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">How the Court became Republican</Link>
          <Link to="/texas-courts" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas courts guide</Link>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Texas Supreme Court quick facts">
        {[
          ["9 members", "One chief justice and eight justices under Article V."],
          ["6-year terms", "Justices are elected statewide, with staggered terms."],
          ["5 votes", "Five members constitute a quorum and five votes are necessary for a decision."],
          ["Civil court of last resort", "Final state appellate jurisdiction generally excludes criminal-law matters."],
        ].map(([value, text]) => (
          <div key={value} className="rounded-xl border bg-card p-5">
            <p className="text-xl font-bold text-primary">{value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section id="current-court" className="mt-14 scroll-mt-24">
        <SectionHeading eyebrow="Current court" title="The nine justices serving today" description="The roster below reflects the Court’s current membership, including the 2025 appointments of Chief Justice James Blacklock, Justice James Sullivan, and Justice Kyle Hawkins." />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CURRENT_JUSTICES.map((justice) => (
            <article key={justice.name} className="rounded-xl border bg-card p-5">
              <h3 className="text-xl font-bold">{justice.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{justice.service}</p>
              <p className="mt-3 text-sm leading-6 text-foreground/90">{justice.selection}</p>
              {justice.note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{justice.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading eyebrow="Constitutional structure" title="How a Texas Supreme Court justice gets the job" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 leading-8 text-foreground/90">
            <p>Article V, Section 2 of the Texas Constitution provides for a chief justice and eight justices. The offices are filled through statewide elections for six-year terms, with three seats scheduled for election every two years. Texas therefore puts its highest civil court directly into the statewide electoral system in a way many other states do not.</p>
            <p>A vacancy does not leave a seat empty until the next normal six-year election. Governors have repeatedly filled vacancies by appointment, and many of the Court’s modern justices first entered through an appointment before later facing voters. That is why a justice’s service history may show both an appointment date and later election dates.</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Current constitutional qualifications</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground/90">
              <li>• Licensed to practice law in Texas.</li>
              <li>• U.S. citizen and Texas resident at the time of election.</li>
              <li>• At least 35 years old.</li>
              <li>• At least ten years of qualifying Texas legal practice, or qualifying legal practice combined with judicial service.</li>
              <li>• No license revocation, suspension, or probated suspension during the qualifying period described by Article V.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="1836 to today" title="The Court’s major institutional turning points" description="Texas did not simply create today’s Court in 1876. Its structure repeatedly changed through the Republic, statehood, Reconstruction, constitutional amendment, caseload growth, and partisan realignment." />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b bg-muted/40 text-sm"><tr><th className="px-5 py-4 font-bold">Year</th><th className="px-5 py-4 font-bold">Milestone</th><th className="px-5 py-4 font-bold">Why it matters</th></tr></thead>
            <tbody>
              {COURT_TIMELINE.map((item) => (
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

      <section className="mt-14">
        <SectionHeading eyebrow="Cases that changed Texas" title="Landmark disputes in the Court’s history" description="No short list can represent a court that has issued opinions for generations. These cases are included because they illuminate major constitutional or institutional moments in Texas history." />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {LANDMARK_CASES.map((item) => (
            <article key={item.name} className="rounded-xl border bg-card p-6">
              <p className="text-sm font-bold text-primary">{item.year}</p>
              <h3 className="mt-1 text-2xl font-bold">{item.name}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{item.significance}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Representation and records" title="Historic firsts and unusual chapters" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HISTORIC_FIRSTS.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading eyebrow="Political history" title="From one-party Democratic Texas to a Republican court" />
        <div className="mt-5 space-y-4 leading-8 text-foreground/90">
          <p>For most of the post-Reconstruction era, Democratic dominance in Texas elections extended to the Supreme Court. By the 1980s, statewide judicial races became unusually visible as business groups, trial lawyers, tort-reform advocates, and partisan organizations fought over civil law and judicial selection.</p>
          <p>The decisive change unfolded across multiple elections rather than one takeover date. Thomas Phillips and Nathan Hecht became central figures in the late-1980s transition, and Republican candidates consolidated control through the 1990s. The Court’s political history is important to understanding elections, but party label alone does not describe the Court’s entire docket or substitute for reading individual opinions.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
          <Link to="/texas-politics/texas-supreme-court-realignment" className="text-primary underline-offset-4 hover:underline">Read the full Republican realignment history →</Link>
          <Link to="/texas-politics/how-texas-became-republican" className="text-primary underline-offset-4 hover:underline">How Texas became Republican →</Link>
        </div>
      </section>

      <section id="complete-roster" className="mt-16 scroll-mt-24">
        <SectionHeading eyebrow="Complete historical roster" title="Justices of the Republic of Texas, 1836–1845" description="Under the Republic system, the chief justice sat with district judges serving as associate justices. The first recorded session with the district judges serving as associates occurred in January 1840." />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Chief justices</h3>
            <div className="mt-4 space-y-4">
              {REPUBLIC_CHIEF_JUSTICES.map((justice) => (
                <div key={justice.name} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <p className="font-bold">{justice.name}</p>
                  <p className="text-sm text-primary">{justice.service}</p>
                  {justice.selection ? <p className="mt-1 text-sm leading-6 text-muted-foreground">{justice.selection}</p> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-xl font-bold">Associate justices / district judges who served with the Court</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {REPUBLIC_ASSOCIATE_JUSTICES.map((name) => <div key={name} className="rounded-md bg-muted/40 px-3 py-2 text-sm font-medium">{name}</div>)}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Their service as Supreme Court associates derived from their district judgeships rather than from the later numbered-seat structure.</p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Statehood, Civil War and Reconstruction" title="Justices from 1845 through the Constitution of 1876" />
        <div className="mt-6 space-y-5">
          {STATEHOOD_TO_1876_GROUPS.map((group) => (
            <article key={group.title} className="rounded-xl border bg-card p-5 md:p-6">
              <h3 className="text-2xl font-bold">{group.title}</h3>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">{group.note}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.entries.map((justice) => (
                  <div key={`${justice.name}-${justice.service}`} className="rounded-lg border bg-muted/20 p-4">
                    <p className="font-bold">{justice.name}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">{justice.service}</p>
                    {"selection" in justice && justice.selection ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{justice.selection}</p> : null}
                    {"note" in justice && justice.note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{justice.note}</p> : null}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="The three-member constitutional court" title="Justices from 1876 to the 1945 expansion" description="The Constitution of 1876 restored elected justices and six-year terms. The 1891 judicial amendment ended the traveling-court system and fixed the Supreme Court in Austin." />
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[520px] text-left">
              <thead className="border-b bg-muted/40"><tr><th className="px-4 py-3">Chief Justice</th><th className="px-4 py-3">Service</th></tr></thead>
              <tbody>{JUSTICES_1876_1945.chief.map(([name, service]) => <tr key={`${name}-${service}`} className="border-b last:border-b-0"><td className="px-4 py-3 font-semibold">{name}</td><td className="px-4 py-3 text-sm text-muted-foreground">{service}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[520px] text-left">
              <thead className="border-b bg-muted/40"><tr><th className="px-4 py-3">Associate Justice</th><th className="px-4 py-3">Service</th></tr></thead>
              <tbody>{JUSTICES_1876_1945.associate.map(([name, service]) => <tr key={`${name}-${service}`} className="border-b last:border-b-0"><td className="px-4 py-3 font-semibold">{name}</td><td className="px-4 py-3 text-sm text-muted-foreground">{service}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Nine seats since 1945" title="Seat-by-seat history of the modern Supreme Court" description="The numbered-seat structure makes it possible to follow appointments, elections, promotions to chief justice, resignations, retirements, and later careers across the modern Court." />
        <div className="mt-6 space-y-4">
          {MODERN_SEATS.map((seat) => (
            <details key={seat.seat} className="group rounded-xl border bg-card p-5" open={seat.seat === "Chief Justice (Place 1)"}>
              <summary className="cursor-pointer list-none text-xl font-bold marker:hidden">{seat.seat} <span className="ml-2 text-sm font-normal text-muted-foreground">({seat.entries.length} officeholders)</span></summary>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[780px] text-left">
                  <thead className="border-b bg-muted/40 text-sm"><tr><th className="px-4 py-3">Justice</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">How the justice entered or retained the seat</th></tr></thead>
                  <tbody>
                    {seat.entries.map((justice) => (
                      <tr key={`${seat.seat}-${justice.name}-${justice.service}`} className="border-b last:border-b-0 align-top">
                        <td className="px-4 py-3 font-semibold">{justice.name}</td>
                        <td className="px-4 py-3 text-sm font-medium text-primary">{justice.service}</td>
                        <td className="px-4 py-3 text-sm leading-6 text-muted-foreground">{justice.selection ?? justice.note ?? "See official Court history."}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading eyebrow="Beyond the Court" title="Supreme Court service as a bridge to other major offices" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["John Cornyn", "Place 7 justice before becoming Texas attorney general and then a U.S. senator.", "/texas-politics/figures/john-cornyn-texas-senator-profile"],
            ["Greg Abbott", "Place 5 justice before becoming Texas attorney general and governor.", "/texas-politics/figures/greg-abbott-texas-governor-profile"],
            ["Priscilla Owen", "Place 2 justice before appointment to the U.S. Court of Appeals for the Fifth Circuit.", "/texas-politics/figures/priscilla-owen-texas-supreme-court-fifth-circuit"],
            ["Don Willett", "Place 2 justice before appointment to the U.S. Court of Appeals for the Fifth Circuit.", "/texas-politics/figures/don-willett-texas-supreme-court-fifth-circuit"],
            ["Wallace Jefferson", "First Black justice and chief justice, and a central figure in modern court administration.", "/texas-politics/figures/wallace-jefferson-texas-supreme-court-chief-justice"],
            ["Nathan Hecht", "Longest-serving member of the Court and chief justice from 2013 through 2024.", "/texas-politics/figures/nathan-hecht-texas-supreme-court-chief-justice"],
          ].map(([name, text, href]) => (
            <a key={name} href={href} className="rounded-xl border bg-card p-5 transition hover:border-primary">
              <h3 className="font-bold">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Primary sources" title="Where this history comes from" description="The roster and institutional dates are anchored primarily to the Supreme Court of Texas, the Texas Constitution, and official appointment records. Keep TX Red uses secondary historical sources for context, not as a substitute for the Court’s own records." />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {SUPREME_COURT_SOURCES.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-lg border bg-card px-4 py-3 text-sm font-semibold text-primary underline-offset-4 hover:underline">{source.label} ↗</a>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="FAQ" title="Texas Supreme Court questions" />
        <div className="mt-6 space-y-4">
          {FAQS.map((faq) => (
            <article key={faq.question} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold">{faq.question}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading eyebrow="Keep exploring" title="Related Texas government and political history" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Texas Government", "Current offices, powers, leaders, and official sources.", "/texas-government"],
            ["Texas Courts", "How the state judiciary is structured below the Supreme Court.", "/texas-courts"],
            ["Court of Criminal Appeals history", "The separate court of last resort for criminal cases.", "/texas-government/texas-court-of-criminal-appeals-history"],
            ["Texas Supreme Court realignment", "How Republican candidates transformed statewide Supreme Court elections.", "/texas-politics/texas-supreme-court-realignment"],
            ["Texas constitutional history", "The charters that repeatedly redesigned state government.", "/texas-politics/texas-constitutional-history"],
            ["2026 Election Central", "Current statewide judicial and other Texas election coverage.", "/elections/2026"],
          ].map(([title, text, href]) => (
            <a key={href} href={href} className="rounded-xl border bg-muted/20 p-5 transition hover:border-primary">
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
