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
          heading: "Why This Matters",
          paragraphs: [
            "An unofficial election-night figure can look conclusive even when it is not yet the legally established result. Texas public election records have several steps, including precinct returns, local canvassing and—in certain contests—state canvassing. Readers who know which authority signs off on each stage can distinguish normal updates from genuine disputes, identify the actual source document and avoid treating television projections or partial online dashboards as certified results.",
            "The distinction is practical for local as well as statewide races. Counties, municipal governments and school districts can administer different elections under different legal responsibilities, and the records to request may differ. Before sharing a claim about a disputed count, identify the jurisdiction, reporting date, reporting authority, applicable official canvass and any later recount order. Those details are more useful than an unsupported claim about what an updated total means.",
          ],
        },
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
  {
    key: "texas-campaign-finance-search",
    slugStem: "how-to-search-texas-campaign-finance-reports",
    category: "Politics",
    title: "How to Read Texas Campaign Finance Reports and Follow Political Money",
    dek: "Use the Texas Ethics Commission's actual filing database to distinguish candidates, PACs, donors, spending categories, local records, and the limits of reported totals.",
    body: {
      editorNote: "A reference guide based on Texas Ethics Commission public search tools and the Election Code. It explains public records, not the financing of an unverified specific race. Released only under KTR's verified-image publishing safety net.",
      intro: [
        "Political fundraising figures often appear in headlines without enough information to explain what they actually measure. A campaign can report new contributions, spending during a reporting period, debt, loans or money maintained at the end of the period. Those are not interchangeable measures. The Texas Ethics Commission makes many state-filed campaign reports searchable, but users still need to identify the proper filer, election, report date and filing authority before comparing numbers.",
        "The commission's public campaign-finance search page includes reports, transaction records, datasets and explanations of its reporting formats. Texas Election Code Chapter 254 sets much of the filing framework, while forms, filer instructions and deadlines supply the reporting details. This guide is about interpreting published documents accurately. It does not infer donor motives from a contribution or assume a document is missing just because it does not appear in one search interface.",
      ],
      sections: [
        {
          heading: "Why This Matters",
          paragraphs: [
            "Campaign-finance reports are among the most useful original records for understanding what a candidate or political committee has disclosed, but a large fundraising headline is not enough to explain the financial position of a campaign. The reporting period, the filer, the type of transaction and the status of an amended report all affect what the numbers mean. This guide explains how to find and interpret the filed data without confusing reported spending with contributions.",
            "The right database matters as much as the arithmetic. The Texas Ethics Commission hosts many state-filed reports, while some local reports are filed with municipal or other local authorities. Comparing two records without checking their reporting periods or custodians can create a false discrepancy. Readers who retain source links, transaction IDs and report dates are better equipped to evaluate public claims and correct errors when a later disclosure becomes available.",
          ],
        },
        {
          heading: "Identify the right filer and filing authority first",
          paragraphs: [
            "A reader should begin with the exact name of the candidate, officeholder or political committee, and then locate that person's or committee's filer record. Similar names and campaign committees can cause a search for one person to return another record or nothing at all. The Texas Ethics Commission's search site lists the reports it maintains, but its own instructions explain that locally filed campaign-finance reports may be kept by local authorities rather than in the state database. Absence from a TEC result is therefore not conclusive evidence that no report exists.",
            "For statewide and other state-level filers, the commission is an important source of original campaign-finance disclosures. Local races can require a different starting point, such as a city secretary, county office or other local filing authority. Voters should use the commission's guidance to identify the appropriate records custodian before claiming a report was not filed. When a person is seeking another office, an older filer identity or campaign account may also exist and must not automatically be combined with a new committee without documentary support.",
            "The date of a filing matters as much as the candidate name. A report may cover a reporting period that ended before its filing date, while a newer transaction may belong to a later report. Searching for all reports and sorting by the period covered reduces the risk of describing money from one reporting window as current campaign cash. Special election, runoff, semiannual and other applicable schedules can differ, and viewers should consult the commission's published current filing calendar rather than relying on a generic yearly deadline.",
          ],
        },
        {
          heading: "Read receipts, expenditures, loans and ending balances separately",
          paragraphs: [
            "Campaign-finance cover sheets summarize major categories, but each label has a distinct meaning. Contributions identify reported support received under the applicable rules. Expenditures describe reported spending, which can range from advertising and staff costs to events, consulting and other activity. Loans, outstanding liabilities and related schedules can affect a campaign's overall position without appearing as ordinary cash donations. The exact accounting treatment is governed by the reporting instructions and the forms actually filed.",
            "An ending-balance or cash-on-hand figure addresses money maintained at a reporting date, not necessarily the money a campaign will have on Election Day. A campaign may have later expenses, new receipts or outstanding invoices that are not part of that snapshot. Comparing the beginning and ending figures of separate report periods can be more useful than placing a single large contribution beside a rival's unrelated expenditure number. Readers should explicitly state the date attached to every reported total in their analysis.",
            "A clean comparison starts by locating both campaigns' full reports for equivalent periods and checking that the report types are comparable. Contributions reported by one committee and expenditures by another are different metrics even when both numbers are expressed in dollars. If a candidate controls multiple political accounts, first establish their relationship and any transfers rather than adding totals without review. Summaries are useful signposts, but underlying schedules and amendments are necessary whenever a number looks surprising or politically consequential.",
          ],
        },
        {
          heading: "Inspect donor and vendor transactions without guessing intent",
          paragraphs: [
            "The commission's advanced search can help locate individual contributions and expenditures reported by a state filer. A contribution entry can contain a reported donor name, relevant date and amount along with other information required by the form. An expenditure entry can identify a reported payee and the declared purpose of spending. Such a record documents what was disclosed; it does not independently prove why a donor gave, whether a vendor benefited improperly or what policies a recipient intends to pursue.",
            "Vendors, reimbursement entries, transfers between political committees and in-kind activity can make transaction lists harder to interpret. One purchase may be connected to several underlying activities, while a reported payment description may be broader than the campaign message visible to the public. Analysts should preserve the original transaction description, identify the relevant schedule and request supporting records when a claim requires greater precision. A descriptive line on a report should not be expanded into an allegation of misconduct without separate evidence.",
            "When researching outside spending, distinguish the candidate's committee from a political action committee or another organization. The expenditure rules and reporting obligations depend on the filer and transaction type. A committee that supports a candidate is not automatically operated by that candidate; coordination and control are separate questions requiring evidence. The safest presentation identifies the legal filer, reported transaction, date, recipient and independent source before describing what a contribution or expenditure could mean for an election.",
          ],
        },
        {
          heading: "Verify amendments, local filings and the meaning of the data",
          paragraphs: [
            "Campaign-finance reports can be amended, so a result captured earlier may not be the latest filed version. Use the report identifiers, filing dates and amendment indicators available from the search tool, then note which version supplied a quoted amount. The Texas Ethics Commission also provides data layouts for downloadable campaign-finance records. Those layouts matter: a CSV column must be interpreted according to the correct reporting format, not merely by a familiar label copied from an unrelated election database.",
            "For local candidates, the commission directs users to the appropriate local filing authority. Some jurisdictions provide online systems with searchable reports, while others publish PDFs or accept public-information requests for copies. Different formats are not evidence of different standards of honesty or compliance. Readers can still build a consistent research trail by recording the office, official filer name, report period, filing date, and permanent source URL or document copy obtained from each authority.",
            "A balanced campaign-money story makes the limits clear: a reported contribution is not an endorsement of every policy, a spending total is not automatically a measure of advertising viewed by voters, and an absent record in the wrong database is not proof of concealment. To reproduce an analysis, keep the TEC or local authority URL, report ID, date accessed, reporting period and definition of the figure. If a complaint, enforcement action or legal allegation exists, report its own documentary status rather than confusing it with the ordinary disclosure record.",
          ],
        },
      ],
      faq: [
        { q: "Does the Texas Ethics Commission list all local candidate campaign reports?", a: "No. The TEC search site says it contains only reports filed with TEC and directs users to the local filing authority for reports filed locally." },
        { q: "Is campaign cash on hand the same as total contributions?", a: "No. Total reported contributions, expenditures, debts and the amount maintained at the end of a reporting period are different accounting concepts." },
        { q: "Does a political donation prove a particular policy agreement?", a: "No. A campaign-finance entry records a disclosed transaction; claims about motivations or improper coordination need additional evidence." },
      ],
      sources: [
        { label: "Texas Ethics Commission — Campaign Finance Report Search", url: "https://webservices.ethics.state.tx.us/search/cf/index.php" },
        { label: "Texas Ethics Commission — Help for Filers and Deadlines", url: "https://www.ethics.texas.gov/filers/" },
        { label: "Texas Election Code — Chapter 254, Political Reporting", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.254.htm" },
        { label: "Texas Ethics Commission — Official Website", url: "https://www.ethics.texas.gov/" },
      ],
      keyTakeaways: [
        "Search the correct official filing authority before drawing conclusions from missing results.",
        "Compare equivalent reporting periods and distinguish contributions, spending, loans and ending balances.",
        "A transaction entry proves a reported disclosure, not a donor's motivation.",
        "Check amendments and document the original report IDs and access dates.",
      ],
    },
  },
];
