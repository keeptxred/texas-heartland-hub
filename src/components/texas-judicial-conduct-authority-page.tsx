import { Link } from "@tanstack/react-router";
import {
  SCJC_2025_REFORMS,
  SCJC_COMPLAINT_STEPS,
  SCJC_CURRENT_MEMBERS,
  SCJC_DECISIONS,
  SCJC_FAQS,
  SCJC_JURISDICTION,
  SCJC_LIMITS,
  SCJC_QUICK_FACTS,
  SCJC_REVIEWED,
  SCJC_REVIEW_PATHS,
  SCJC_SOURCES,
  SCJC_TIMELINE,
} from "@/data/texas-judicial-conduct-authority";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-government/state-commission-on-judicial-conduct`;
const TITLE = "Texas State Commission on Judicial Conduct: Complaints & Discipline | KeepTXRed";
const DESCRIPTION = "A source-backed guide to the Texas State Commission on Judicial Conduct: current commissioners, who it can investigate, how to file a complaint, sanctions, confidentiality, appeals, removal procedures, and the 2025 Proposition 12 changes.";

export function texasJudicialConductAuthorityHead() {
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
          headline: "Texas State Commission on Judicial Conduct: Complaints, Discipline and Appeals",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: SCJC_REVIEWED,
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: SCJC_SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.href })),
          about: [
            { "@type": "Thing", name: "State Commission on Judicial Conduct" },
            { "@type": "Thing", name: "Texas judicial discipline" },
            { "@type": "Thing", name: "Texas judicial complaints" },
          ],
          isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: SCJC_FAQS.map((faq) => ({
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

export function TexasJudicialConductAuthorityPage() {
  const judgeMembers = SCJC_CURRENT_MEMBERS.filter((member) => member.role === "Judge member");
  const publicMembers = SCJC_CURRENT_MEMBERS.filter((member) => member.role === "Public member");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-government">Texas Government</Link> / State Commission on Judicial Conduct
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas judicial accountability</p>
          <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Reviewed {SCJC_REVIEWED}</span>
        </div>
        <h1 className="mt-4 max-w-6xl text-4xl font-bold leading-tight md:text-6xl">Texas State Commission on Judicial Conduct</h1>
        <p className="mt-5 max-w-5xl text-lg leading-8 text-muted-foreground">
          The State Commission on Judicial Conduct is the Texas judicial-branch agency that investigates alleged judicial misconduct or incapacity and administers discipline. It is not an appellate court: it cannot reverse a ruling, change a sentence, remove a judge from one litigant&apos;s case, or award damages. This guide explains who sits on the Commission, who falls within its jurisdiction, how complaints actually work, what discipline can follow, and how the 2025 constitutional amendment changed the system beginning in 2026.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#complaints" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">How to file a complaint</a>
          <a href="#commissioners" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Current commissioners</a>
          <a href="#discipline" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Discipline and review</a>
          <a href="https://scjc.texas.gov/" target="_blank" rel="noreferrer" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Official SCJC site ↗</a>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Judicial conduct quick facts">
        {SCJC_QUICK_FACTS.map((fact) => (
          <article key={fact.label} className="rounded-xl border bg-card p-5">
            <p className="text-xl font-bold text-primary">{fact.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-foreground/70">{fact.label}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{fact.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8">
        <SectionHeading
          eyebrow="What the Commission is"
          title="A discipline agency with constitutional authority — not a substitute for an appeal"
          description="The distinction matters whenever someone believes a judge made a bad ruling. Judicial misconduct and legal error can overlap factually, but the remedies are different."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-2xl font-bold">What it can investigate</h3>
            <p className="mt-3 leading-7 text-muted-foreground">The Commission can investigate allegations involving judicial misconduct, willful or persistent failure to perform duties, incapacity, specified criminal conduct, violations of the Code of Judicial Conduct, and other conduct within Article V, Section 1-a and Chapter 33.</p>
            <p className="mt-3 leading-7 text-muted-foreground">Its jurisdiction reaches judges throughout the Texas court system and, within the constitutional limits added in 2022, judicial candidates.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-2xl font-bold">What it cannot do</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {SCJC_LIMITS.map((limit) => <li key={limit} className="flex gap-3"><span aria-hidden="true" className="font-bold text-primary">×</span><span>{limit}</span></li>)}
            </ul>
          </article>
        </div>
        <div className="mt-6 rounded-xl border bg-card p-5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Practical rule</p>
          <p className="mt-2 leading-7 text-foreground/90">If the requested remedy is “change the judgment,” “reverse the ruling,” “reduce the sentence,” or “remove this judge from my case,” the Commission is not the forum that provides that relief. Those questions belong to the applicable court procedure, recusal process, or appellate route.</p>
        </div>
      </section>

      <section id="commissioners" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Current membership"
          title="The 13-member Commission after the 2025 constitutional amendment"
          description={`The current roster contains ${judgeMembers.length} judicial members appointed by the Supreme Court of Texas and ${publicMembers.length} citizen members appointed by the governor. All appointments require Senate confirmation.`}
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b bg-muted/40 text-sm">
              <tr>
                <th className="px-5 py-4 font-bold">Commissioner</th>
                <th className="px-5 py-4 font-bold">Role</th>
                <th className="px-5 py-4 font-bold">Location</th>
                <th className="px-5 py-4 font-bold">Appointed by</th>
                <th className="px-5 py-4 font-bold">Term expires</th>
              </tr>
            </thead>
            <tbody>
              {SCJC_CURRENT_MEMBERS.map((member) => (
                <tr key={member.name} className="border-b last:border-b-0">
                  <td className="px-5 py-4">
                    <p className="font-bold">{member.name}</p>
                    {member.officer ? <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">{member.officer}</p> : null}
                  </td>
                  <td className="px-5 py-4 text-sm">{member.role}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{member.location}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{member.appointedBy}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold">{member.termExpires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">The Commission describes the listed officers as interim officers. Membership and officer assignments can change, so the official roster remains the controlling current source.</p>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Jurisdiction"
          title="Who can — and cannot — be the subject of an SCJC complaint"
          description="A complaint must concern a person or conduct within the Commission's jurisdiction. The Commission is not a general grievance office for every participant in the justice system."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold text-primary">Within the Commission&apos;s judicial jurisdiction</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {SCJC_JURISDICTION.covers.map((item) => <li key={item} className="rounded-md bg-muted/40 px-3 py-2 text-sm leading-5">{item}</li>)}
            </ul>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">Common targets outside SCJC jurisdiction</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {SCJC_JURISDICTION.doesNotCover.map((item) => <li key={item} className="rounded-md bg-muted/40 px-3 py-2 text-sm leading-5 text-muted-foreground">{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section id="complaints" className="mt-14 scroll-mt-24 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading
          eyebrow="Complaint process"
          title="How to file a Texas judicial-conduct complaint"
          description="The current official process is paper-based. A complaint is not filed by sending an email or filling out a web form."
        />
        <ol className="mt-7 grid gap-4 lg:grid-cols-5">
          {SCJC_COMPLAINT_STEPS.map((step, index) => (
            <li key={step.title} className="rounded-xl border bg-background p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Mail complaints to</p>
            <address className="mt-3 not-italic leading-7">
              State Commission on Judicial Conduct<br />
              P.O. Box 12265<br />
              Austin, Texas 78711
            </address>
          </div>
          <div className="rounded-xl border p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Not accepted as a complaint filing</p>
            <p className="mt-3 leading-7 text-muted-foreground">Online form · telephone · email · fax</p>
            <a href="https://scjc.texas.gov/complaints/" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-bold text-primary">Official complaint instructions and form ↗</a>
          </div>
        </div>
      </section>

      <section id="discipline" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Possible outcomes"
          title="From dismissal to formal removal proceedings"
          description="Not every complaint becomes a sanction. The legal framework distinguishes dismissals, education, private and public sanctions, suspension, resignation agreements, and formal proceedings."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b bg-muted/40 text-sm">
              <tr><th className="px-5 py-4 font-bold">Outcome</th><th className="px-5 py-4 font-bold">Public status</th><th className="px-5 py-4 font-bold">What it means</th></tr>
            </thead>
            <tbody>
              {SCJC_DECISIONS.map((decision) => (
                <tr key={decision.action} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4 font-bold">{decision.action}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-primary">{decision.visibility}</td>
                  <td className="px-5 py-4 text-sm leading-6 text-muted-foreground">{decision.action === "Public sanction" ? "The Commission's ordinary public-sanction scale uses public admonitions, warnings, and reprimands. Formal proceedings are the route that can lead to public censure or a recommendation for removal or retirement." : decision.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SCJC_REVIEW_PATHS.map((path) => (
            <article key={path.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold">{path.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{path.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <SectionHeading
          eyebrow="Confidentiality"
          title="Complaints begin confidentially, but some disciplinary records become public"
          description="Texas law does not make every complaint file public simply because a complaint was filed. The public/private line depends on the type and stage of Commission action."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">Generally confidential</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Article V states that papers filed with and proceedings before the Commission or a master are confidential unless law provides otherwise. That protects the investigatory process and means a complaint itself should not be treated as proof of misconduct.</p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <h3 className="text-xl font-bold">Records that can become public</h3>
            <p className="mt-3 leading-7 text-muted-foreground">Public sanctions, papers filed after formal charges, suspension orders and related proceedings in specified circumstances, and accepted voluntary resignation agreements are among the materials Texas law makes available publicly.</p>
          </article>
        </div>
        <a href="https://scjc.texas.gov/public-information/rule-12/" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-bold text-primary">Read the Commission&apos;s public-information guidance ↗</a>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="2025 Proposition 12"
          title="The biggest structural changes to judicial discipline now in effect"
          description="Texas voters adopted the constitutional amendment proposed by SJR 27 in 2025. Its structural changes began taking effect with the new Commission terms on January 1, 2026."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SCJC_2025_REFORMS.map((reform) => (
            <article key={reform.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold text-primary">{reform.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{reform.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Institutional history"
          title="From the 1965 commission to the 2026 structure"
          description="Judicial discipline in Texas has been repeatedly revised as the state expanded who can be investigated, added review rights, and changed how the Commission itself is selected."
        />
        <div className="mt-7 space-y-4">
          {SCJC_TIMELINE.map((item) => (
            <article key={`${item.year}-${item.title}`} className="grid gap-3 rounded-xl border bg-card p-5 md:grid-cols-[90px_1fr]">
              <div className="text-2xl font-bold text-primary">{item.year}</div>
              <div><h3 className="text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-primary/25 bg-primary/[0.03] p-6 md:p-8">
        <SectionHeading
          eyebrow="Public accountability records"
          title="Where to check sanctions, suspensions and review opinions"
          description="For current accountability reporting, use the Commission's own records rather than relying on an allegation, social-media post, or stale biography."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Public sanctions", "https://scjc.texas.gov/discipline/public-sanctions/", "Named public admonitions, warnings, reprimands and education orders."],
            ["Private-sanction summaries", "https://scjc.texas.gov/discipline/private-sanctions/", "Anonymized summaries showing the kinds of conduct addressed privately."],
            ["Suspensions", "https://scjc.texas.gov/discipline/suspensions/", "Current and historical suspension actions listed by the Commission."],
            ["Special Court of Review opinions", "https://scjc.texas.gov/opinions/", "Published opinions from the three-justice review process."],
          ].map(([label, href, text]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm">
              <h3 className="font-bold text-primary">{label} ↗</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Frequently asked questions" title="Texas judicial-discipline FAQ" />
        <div className="mt-6 divide-y rounded-xl border bg-card">
          {SCJC_FAQS.map((faq) => (
            <details key={faq.question} className="group p-5">
              <summary className="cursor-pointer list-none font-bold marker:hidden">{faq.question}<span className="float-right text-primary group-open:rotate-45">+</span></summary>
              <p className="mt-3 max-w-5xl leading-7 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading eyebrow="Primary sources" title="Official Texas sources used for this guide" />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {SCJC_SOURCES.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded-lg border bg-card px-4 py-3 text-sm font-semibold text-primary hover:border-primary">{source.label} ↗</a>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border bg-card p-6 md:p-8">
        <SectionHeading eyebrow="Keep reading" title="Texas courts, judges and elections" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Texas courts hub", "/texas-courts", "How cases move through trial courts, 15 Courts of Appeals and the two high courts."],
            ["How Texas chooses judges", "/texas-government/judicial-selection-elections", "Partisan elections, vacancy appointments, qualifications and reform debates."],
            ["Texas Supreme Court history", "/texas-government/texas-supreme-court-history", "Current justices, historic rosters, constitutional role and landmark cases."],
            ["Court of Criminal Appeals history", "/texas-government/court-of-criminal-appeals-history", "Texas's highest criminal court, current judges and institutional history."],
          ].map(([label, href, text]) => (
            <a key={href} href={href} className="rounded-xl border bg-background p-5 transition hover:border-primary hover:shadow-sm">
              <h3 className="font-bold text-primary">{label} →</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </a>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs leading-5 text-muted-foreground">This page is a civic reference guide, not legal advice. Complaint jurisdiction, deadlines, confidentiality, discipline, and review can turn on facts and procedural rules. Use the official Commission materials and applicable law for a specific matter.</p>
    </main>
  );
}
