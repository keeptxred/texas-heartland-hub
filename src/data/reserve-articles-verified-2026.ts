import type { ReserveArticle } from "./reserve-articles";

/**
 * Long-form, independently written reference articles grounded in the
 * controlling Texas statutory / official records. These provide a bounded
 * emergency reserve, NOT a replacement for fresh corroborated reporting.
 * All must still pass the usual article-body and hero vision-validation gates.
 */
export const VERIFIED_ADDITIONAL_RESERVE_ARTICLES: ReserveArticle[] = [
  {
    key: "texas-election-canvass",
    slugStem: "how-texas-election-results-are-canvassed-and-certified",
    category: "Elections",
    title: "How Texas Election Results Become Official: Canvassing, Certification, and Recounts",
    dek: "A source-backed explanation of election-night totals, local canvasses, statewide results, certificates of election, and the separate rules for recounts.",
    body: {
      editorNote: "Permanent voter-information reference sourced to the Texas Election Code and the Texas Secretary of State. This article is part of KTR's prewritten emergency publishing reserve; it does not announce or forecast an election result.",
      intro: [
        "The numbers shown on election night are important, but they are not the same thing as the final legal result. County election offices report returns as voting devices and precinct processes are reconciled, and state or local officials later perform the canvass required by law. That process determines which totals become official for the offices and propositions covered by a particular election. A race may appear settled on a screen while the administrative work required to establish its official result continues.",
        "Texas Election Code Chapter 67 describes how local and statewide canvasses work. Other Election Code chapters address election records, early voting and recounts. Understanding the separation helps voters interpret late updates without assuming every change is suspicious or, conversely, assuming preliminary numbers already have the force of a certified result. The right source depends on the office: a school board race is not administered or canvassed in precisely the same way as a statewide contest.",
      ],
      sections: [
        {
          heading: "Election-night returns and canvassed totals are different records",
          paragraphs: [
            "The figures posted by a county or election-night reporting service are typically unofficial. They are a public view of vote reporting as precinct and early-voting data becomes available, not a substitute for the canvass prescribed by the Election Code. An early lead can be meaningful, but its meaning depends on how many precincts have reported, whether early and election-day returns are included, and whether additional legally eligible ballots remain to be considered. A responsible viewer checks the reporting jurisdiction and timestamp before comparing two totals.",
            "Not all vote records are presented in one uniform statewide format. A county may post precinct summaries, consolidated vote-center totals, or downloadable election files; the Secretary of State presents certain contests through state election reporting. Numbers from sources covering different geographies, reporting moments, or vote categories should not be combined as though they were interchangeable. If a total changes, first ask whether the comparison uses the same contest, precincts, reporting cutoff and data version. A headline based on mismatched snapshots can manufacture a discrepancy that is not present in the underlying records.",
            "Texas election workers also handle procedures whose timing does not match election-night television coverage. The appropriate election authority determines how ballots, returns and other required documents are treated under law. A voter cannot infer from an incomplete public dashboard that a specific ballot was included or excluded, and a reporter cannot infer the reason for an update from the change in a number alone. To evaluate a disputed total, obtain the precinct returns, official local tabulation and subsequent canvass record rather than guessing from a chart.",
          ],
        },
        {
          heading: "Local canvasses create the county and subdivision record",
          paragraphs: [
            "Chapter 67 assigns the local canvass to different authorities depending on who ordered the election. County commissioners courts generally canvass elections ordered by the governor or county authorities, while a political subdivision's governing body canvasses its elections under the applicable provisions. The body examines precinct returns and prepares an official tabulation as required by the code. That responsibility is administrative and statutory; it is not simply a declaration made by the person with the most visible election-night lead.",
            "A local canvass is supported by election materials that can be examined later. Chapter 67 addresses precinct totals, reports of early-voting votes by precinct, tally lists, tabulations, record retention and noting completion of the canvass in the authority's minutes or recording. When a correction or discrepancy is handled under the statute, the legally relevant record is the corrected return or canvass documentation, not a screenshot of an earlier unofficial webpage. Local election offices and governing bodies are the primary places to seek the applicable agenda and approved tabulation.",
            "Different districts and local authorities can have different election boundaries, so a county's public information does not answer every question about a municipal or school election held within its borders. The office that called the election, the relevant election agreement and the Election Code determine who has the formal duty to canvass. A careful inquiry identifies the actual canvassing body, asks when its meeting will take place, and requests the resulting vote tabulation. This reduces confusion when a school district spans multiple counties or voting jurisdictions.",
          ],
        },
        {
          heading: "Some contests also require a separate state canvass",
          paragraphs: [
            "County canvasses are not always the final step. For elections that must be canvassed at the state level, the Election Code provides for certified county returns to be transmitted and consolidated through the appropriate state authority. Chapter 67 identifies the governor as the canvassing authority for certain statewide and district contests, while elections for governor and lieutenant governor have a separate constitutional and legislative canvass process. The legal path therefore depends on the office, not merely on whether a race is politically prominent.",
            "The Secretary of State's role includes administering the state-level tabulation and related election records required by law. County election returns identify the relevant votes certified locally; the state canvass combines the county figures for offices that require it. Because Chapter 67 includes provisions affected by changes to election administration law, readers should consult the current statute and official instructions for the specific election rather than recycling a previous cycle's assumed deadline. A statewide reporting dashboard does not itself replace those formal steps.",
            "After the legally designated canvassing authority determines the result, certificates of election may be prepared for winning candidates as specified in Chapter 67. A certificate is a formal record associated with the office and result, not a campaign statement or media projection. The Election Code also identifies records that must be preserved after canvassing. For a contested issue, the best documentary chain is the original precinct returns, the county or local canvass and, where required, the final state canvass and certificate.",
          ],
        },
        {
          heading: "Recounts and disputes are separate legal processes",
          paragraphs: [
            "A recount should not be confused with an ordinary canvass. The canvass is the required process for establishing an official election result; a recount follows different rules concerning who may request it, timing, payment and the votes that are reexamined. Texas Election Code Title 13 contains the recount framework. A close margin alone does not tell observers whether a recount has been requested, granted, completed or changed the result. Each of those questions requires the appropriate recount documentation from election officials.",
            "Likewise, an election contest or other legal challenge is not proven by the existence of a late update, a recount request or an advocacy statement. Such claims have their own legal standards and adjudicative procedures. News accounts should distinguish a filed allegation from a finding, and a court filing from an order. Statements by campaigns can help locate a disputed matter, but the relevant election records and orders are the reliable evidence for describing its legal status.",
            "Voters following the process can maintain a straightforward source checklist: the relevant county elections office for election-night updates; the local canvassing authority for its agenda and approved tabulation; the Texas Secretary of State for statewide election reporting and notices; and the Election Code for the controlling process. If a number changes, note the date, jurisdiction and document version. This approach informs the public without treating every normal administrative step as either proof of wrongdoing or proof that any complaint is unfounded.",
          ],
        },
      ],
      faq: [
        { q: "Are Texas election-night results official?", a: "Election-night returns are generally unofficial. The canvass and other legally required procedures determine official results for the relevant contest." },
        { q: "Does the county canvass every Texas race?", a: "Local election authorities conduct applicable canvasses, but certain statewide and district contests also require a state-level canvass under Election Code Chapter 67." },
        { q: "Is a recount the same as certification?", a: "No. The canvass establishes the official result under the law; a recount is a separate procedure governed by its own eligibility, timing and records rules." },
      ],
      sources: [
        { label: "Texas Election Code — Chapter 67, Canvassing Elections", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.67.htm" },
        { label: "Texas Election Code — Chapter 65, Counting Votes and Preparing Returns", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.65.htm" },
        { label: "Texas Election Code — Title 13, Recounts", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.212.htm" },
        { label: "Texas Secretary of State — Elections", url: "https://www.sos.state.tx.us/elections/index.shtml" },
      ],
      keyTakeaways: [
        "Election-night totals are not necessarily the legally final figures.",
        "Local and state canvassing authorities differ depending on the office and election.",
        "Official canvass records, not screenshots of early totals, establish the authoritative count.",
        "Recounts and legal challenges operate under separate procedures from routine canvassing.",
      ],
    },
  },
];
