import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://keeptxred.com";
const PAGE_URL = `${SITE_URL}/issues/texas-government-accountability-handbook`;

const chapters = [
  {
    title: "Start with the record: what government actually did",
    body: [
      "Accountability starts with the underlying record, not the press release describing it. In Texas that record may be a bill, enrolled law, agency rule, contract, purchase order, budget, audit, court filing, meeting agenda, campaign-finance report or public-information response. The first job is identifying the document that can prove or disprove the claim.",
      "A useful watchdog workflow separates proposal from action. A budget request is not an appropriation. An appropriation is not proof the money was spent. A contract award is not the same as a payment. An announced investigation is not a finding. Keeping those stages distinct prevents routine political messaging from becoming the factual record.",
    ],
    links: [
      ["Texas Legislature", "/texas-legislature"],
      ["Texas laws", "/laws"],
      ["Texas data catalog", "/data"],
    ],
  },
  {
    title: "Public information: use the Texas Public Information Act deliberately",
    body: [
      "The Texas Public Information Act creates a process for requesting existing government records. Strong requests identify the governmental body, a realistic date range, the specific record type and the subject matter. Broad requests for 'everything' can produce delay, cost questions and disputes over what the request actually covers.",
      "Agencies and local governments may withhold information only when an exception applies, and some disputes are referred to the Texas Attorney General for a ruling. Requesters should preserve the original request, all correspondence, cost estimates, production dates and any claimed exception so the timeline remains reviewable.",
    ],
    links: [
      ["Texas Attorney General open government", "https://www.texasattorneygeneral.gov/open-government"],
      ["Texas Public Information Act handbook", "https://www.texasattorneygeneral.gov/open-government/members-public/public-information-act"],
      ["Government authority finder", "/civic-tools/government-authority-finder"],
    ],
  },
  {
    title: "Open meetings: agendas, notice and final action matter",
    body: [
      "The Texas Open Meetings Act governs many meetings of governmental bodies. Watchdog reporting should preserve the posted agenda, notice time, meeting packet, video or audio when available, minutes and the final vote. Those pieces establish what the public was told in advance and what the body actually decided.",
      "Executive sessions can be lawful for specified purposes, but a closed discussion does not erase the need to examine the public action that follows. When a controversial item moves quickly, compare the posted agenda language with the motion and vote rather than relying only on a summary after the meeting.",
    ],
    links: [
      ["Texas Open Meetings Act resources", "https://www.texasattorneygeneral.gov/open-government/members-public/open-meetings-act"],
      ["Texas government hub", "/texas-government"],
      ["Texas law finder", "/civic-tools/texas-law-finder"],
    ],
  },
  {
    title: "Budgets and spending: follow authorization, obligation and payment separately",
    body: [
      "Texas state and local budgets contain different layers of financial information. An adopted budget authorizes spending; encumbrances and contracts can obligate funds; invoices and warrants reflect payment; audits examine what happened later. Good accountability work identifies which layer supports the claim.",
      "For state government, the General Appropriations Act, Legislative Budget Board material, Comptroller data and agency financial reports provide overlapping views. At the local level, adopted budgets, tax-rate notices, check registers, procurement records and annual financial reports can reveal how priorities translated into actual spending.",
    ],
    links: [
      ["Texas Legislative Budget Board", "https://www.lbb.texas.gov/"],
      ["Texas Comptroller transparency", "https://comptroller.texas.gov/transparency/"],
      ["Texas budget tools", "/tools"],
    ],
  },
  {
    title: "Contracts and procurement: identify the vendor, authority and deliverable",
    body: [
      "Government-contract stories should answer four basic questions: who selected the vendor, under what procurement authority, for what deliverable, and for how much. The contract itself matters, but so do solicitations, bid tabs, amendments, change orders, invoices and performance records.",
      "A headline contract value may be a ceiling rather than the amount ultimately paid. Cooperative purchasing, emergency procurement, sole-source justification and professional-services rules can also change the normal competitive process. Reporting should name the procurement path before implying that ordinary bidding rules were ignored.",
    ],
    links: [
      ["Texas Comptroller procurement resources", "https://comptroller.texas.gov/purchasing/"],
      ["Texas SmartBuy", "https://www.txsmartbuy.gov/"],
      ["Accountability data", "/data"],
    ],
  },
  {
    title: "Campaign finance and ethics: separate contributions, expenditures and conflicts",
    body: [
      "Campaign-finance reporting is strongest when it distinguishes who gave money, who received it, when it was reported, how it was spent and which office or committee the filing covers. A contribution alone does not prove a quid pro quo, but undisclosed relationships, timing and official action can justify deeper reporting.",
      "The Texas Ethics Commission administers many state campaign-finance, lobby and ethics filings. Local candidates and officeholders may have separate filing authorities. Before drawing a conclusion, confirm the reporting period, amendment history, filer identity and whether the transaction falls under the cited rule.",
    ],
    links: [
      ["Texas Ethics Commission", "https://www.ethics.state.tx.us/"],
      ["Texas elections", "/elections"],
      ["Editorial standards", "/editorial-standards"],
    ],
  },
  {
    title: "Audits, inspectors and oversight: findings are stronger than rumors",
    body: [
      "Audits can turn a vague allegation into a defined finding with scope, methodology and management response. The Texas State Auditor, agency internal-audit offices, local external auditors and federal oversight bodies all publish different kinds of review. Their conclusions should be read with the limits of the audit in mind.",
      "A finding may identify weak controls without proving fraud. A questioned cost may still be resolved. A management response may dispute the finding or promise corrective action. KTR accountability coverage should preserve those distinctions and follow whether the recommended fix was actually implemented.",
    ],
    links: [
      ["Texas State Auditor", "https://sao.texas.gov/"],
      ["Texas government agencies", "/texas-government/agencies"],
      ["Citation guide", "/citation-guide"],
    ],
  },
  {
    title: "Build the chronology before assigning blame",
    body: [
      "The most important accountability technique is often a timeline. Record when the problem was first known, when officials were notified, what authority they had, what money was available, what decision they made, when implementation occurred and what happened afterward. Chronology separates hindsight from decisions officials could reasonably have made at the time.",
      "For breaking stories, preserve source documents as the timeline develops and update the page when later evidence changes the picture. Accountability should become more precise as records accumulate, not more certain merely because a political narrative has hardened.",
    ],
    links: [
      ["Texas Policy Handbook", "/issues/texas-policy-handbook"],
      ["Texas news", "/news"],
      ["Civic tools", "/civic-tools"],
    ],
  },
] as const;

const primarySources = [
  ["Texas Attorney General Open Government", "https://www.texasattorneygeneral.gov/open-government"],
  ["Texas Ethics Commission", "https://www.ethics.state.tx.us/"],
  ["Texas Comptroller Transparency", "https://comptroller.texas.gov/transparency/"],
  ["Texas State Auditor", "https://sao.texas.gov/"],
  ["Texas Legislature Online", "https://capitol.texas.gov/"],
  ["Texas statutes", "https://statutes.capitol.texas.gov/"],
] as const;

export const Route = createFileRoute("/issues/texas-government-accountability-handbook")({
  head: () => ({
    meta: [
      { title: "Texas Government Accountability Handbook | Keep TX Red" },
      { name: "description", content: "A source-first Texas government accountability handbook covering public records, open meetings, budgets, procurement, campaign finance, audits and evidence timelines." },
      { property: "og:title", content: "Texas Government Accountability Handbook | Keep TX Red" },
      { property: "og:description", content: "How to follow the record behind Texas government claims: documents, meetings, spending, contracts, ethics, audits and chronology." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: PAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Texas Government Accountability Handbook",
        description: "A source-first handbook for investigating and understanding Texas government records, spending, meetings, contracts, ethics and oversight.",
        mainEntityOfPage: PAGE_URL,
        datePublished: "2026-08-22",
        dateModified: "2026-08-22",
        author: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
        publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
      }),
    }],
  }),
  component: TexasGovernmentAccountabilityHandbook,
});

function TexasGovernmentAccountabilityHandbook() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb"><Link to="/issues" className="hover:text-primary">Texas Issues</Link> <span aria-hidden>→</span> Government Accountability Handbook</nav>
      <header className="mt-5 max-w-4xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">★ Permanent Reference</span>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight md:text-7xl">TEXAS GOVERNMENT<br /><span className="text-primary">ACCOUNTABILITY</span></h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">A working manual for following the public record behind Texas government claims. Use it to move from rhetoric to agendas, records, budgets, contracts, ethics filings, audits and the chronology that shows what officials actually knew and did.</p>
      </header>

      <section className="mt-10 border-l-4 border-primary bg-muted/40 p-6">
        <h2 className="font-display text-2xl">Quick answer</h2>
        <p className="mt-3 leading-7">Government accountability is strongest when every claim can be tied to a record and every record is placed in the correct stage of the process. The question is not only whether a document exists; it is whether that document proves authorization, action, payment, disclosure, oversight or a final finding.</p>
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
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">These are the statewide records systems and oversight offices worth checking before a Texas accountability story is treated as settled.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{primarySources.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer" className="border p-4 font-semibold text-primary hover:border-primary">{label} ↗</a>)}</div>
      </section>

      <section className="mt-14 border-t pt-8">
        <h2 className="font-display text-3xl tracking-tight">Keep the layers connected</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a href="/issues/texas-policy-handbook" className="border p-5 hover:border-primary"><strong>Policy Handbook</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Identify the government authority and policy system first.</p></a>
          <a href="/data" className="border p-5 hover:border-primary"><strong>Accountability data</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Move into structured state and local data sources.</p></a>
          <a href="/civic-tools" className="border p-5 hover:border-primary"><strong>Civic tools</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Find laws, bills, officials and controlling government bodies.</p></a>
          <a href="/news" className="border p-5 hover:border-primary"><strong>Live reporting</strong><p className="mt-2 text-sm leading-6 text-muted-foreground">Apply the permanent method to current Texas government stories.</p></a>
        </div>
      </section>
    </main>
  );
}
