import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-15",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

const ch13 = { label: "Texas Election Code Chapter 13 — Voter Registration", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.13.htm" };
const ch41 = { label: "Texas Election Code Chapter 41 — Election Dates and Hours", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.41.htm" };
const ch61 = { label: "Texas Election Code Chapter 61 — Conduct of Voting", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.61.htm" };
const ch63 = { label: "Texas Election Code Chapter 63 — Accepting the Voter", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.63.htm" };
const ch64 = { label: "Texas Election Code Chapter 64 — Voting Procedures", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.64.htm" };
const ch82 = { label: "Texas Election Code Chapter 82 — Eligibility for Early Voting", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.82.htm" };
const ch84 = { label: "Texas Election Code Chapter 84 — Application for Ballot by Mail", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.84.htm" };
const ch85 = { label: "Texas Election Code Chapter 85 — Early Voting by Personal Appearance", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.85.htm" };
const ch86 = { label: "Texas Election Code Chapter 86 — Conduct of Voting by Mail", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.86.htm" };
const voteTexas = { label: "Texas Secretary of State — Early Voting FAQs", url: "https://www.sos.state.tx.us/elections/pamphlets/earlyvote.shtml" };

export const ELECTIONS_BATCH20_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-voter-registration-law": {
    ...common,
    slug: "texas-voter-registration-law",
    title: "Texas Voter Registration Law: Eligibility, Deadlines and Effective Registration",
    dek: "Who may register to vote in Texas, the ordinary 30-day registration deadline, when an application becomes effective, and why moving or changing an address can affect where a voter casts a ballot.",
    keyTakeaways: [
      "Election Code Section 13.001 generally requires a registrant to be a United States citizen, a resident of the county, and at least 18 years old on election day, subject to the statute's felony-conviction and mental-capacity rules.",
      "Section 13.143 generally makes a timely registration effective on the 30th day after the application is submitted to the voter registrar, with statutory weekend and holiday adjustments affecting election deadlines.",
      "Texas does not have ordinary same-day voter registration at polling places; a voter generally must satisfy Chapter 13 before the registration deadline for the election.",
      "Registration status, county residence, and address changes are related but distinct; voters who move near an election may be subject to limited-ballot or statement-of-residence rules rather than simply voting anywhere in the state.",
    ],
    intro: ["Texas voter registration is governed principally by Election Code Chapter 13. The safest approach is to register or update an address well before an election and confirm the record through the Secretary of State or county voter registrar."],
    sections: [
      { heading: "Section 13.001 sets the basic qualifications", paragraphs: ["The statute addresses age, citizenship, county residence, final felony convictions, and court findings concerning mental capacity. Eligibility questions can be fact-specific, especially after completion of a criminal sentence or a move."] },
      { heading: "The ordinary deadline is tied to the 30th day", paragraphs: ["Section 13.143 governs when a registration becomes effective. Election calendars apply the statutory weekend and holiday adjustments when the nominal 30th day falls on a nonbusiness day."] },
      { heading: "Submitting an application is different from confirming registration", paragraphs: ["Voters should check the registration record after applying. A rejected, incomplete, or misdirected application can create a different legal situation from a completed registration that simply has an outdated address."] },
      { heading: "Moves can trigger separate voting rules", paragraphs: ["A voter who moved within a county or to another county may need to update registration or use a statutory procedure such as a statement of residence or, in limited circumstances, a limited ballot during early voting."] },
    ],
    faq: [
      { q: "How early should I register before a Texas election?", a: "The ordinary rule is that registration must become effective by election day, and Section 13.143 generally uses the 30th day after submission, subject to statutory calendar adjustments." },
      { q: "Can I normally register for the first time at the polling place?", a: "Texas does not generally provide same-day voter registration. Chapter 13 registration deadlines apply." },
      { q: "Where can I check my Texas registration?", a: "The Texas Secretary of State and county voter registrars provide registration-status tools and records." },
    ],
    sources: [ch13, { label: "Texas Secretary of State — Voter Registration", url: "https://www.sos.state.tx.us/elections/vr/index.shtml" }],
    related: [
      { label: "Texas voter ID", href: "/guides/texas-voter-id-law" },
      { label: "Texas early voting", href: "/guides/texas-early-voting-law" },
      { label: "Texas provisional ballots", href: "/guides/texas-provisional-ballot-law" },
    ],
  },

  "texas-voter-id-law": {
    ...common,
    slug: "texas-voter-id-law",
    title: "Texas Voter ID Law: Accepted Photo ID and Reasonable Impediment Declarations",
    dek: "Texas in-person voter identification rules, the seven accepted photo IDs, expiration rules, Reasonable Impediment Declarations, supporting documents, disability exemptions and provisional ballots.",
    keyTakeaways: [
      "Texas generally asks an in-person voter who possesses an acceptable photo ID to present one of seven forms listed by Election Code Section 63.0101 and Secretary of State guidance.",
      "For voters ages 18 through 69, most accepted photo IDs may be current or expired no more than four years; a voter age 70 or older may use an otherwise valid accepted photo ID regardless of how long it has been expired.",
      "A voter who does not possess an acceptable photo ID and cannot reasonably obtain one may present an approved supporting document and sign a Reasonable Impediment Declaration to vote a regular ballot if otherwise eligible.",
      "A voter who cannot complete the regular ID procedure at the polling place may be entitled to a provisional ballot and may have a six-calendar-day post-election cure opportunity under the applicable rules.",
    ],
    intro: ["Texas voter ID law has more than one path. The ordinary photo-ID rule is important, but the Reasonable Impediment Declaration, disability exemption, and provisional-ballot procedures are also part of the current statewide system."],
    sections: [
      { heading: "Seven photo-ID categories form the ordinary rule", paragraphs: ["Current Secretary of State guidance lists Texas driver licenses, Election Identification Certificates, Texas personal ID cards, Texas handgun licenses, qualifying U.S. military photo ID, U.S. citizenship certificates with a photograph, and U.S. passports as accepted photo identification."] },
      { heading: "Expiration rules vary by age", paragraphs: ["Except for the citizenship certificate, accepted photo ID for voters 18 through 69 generally may be expired by no more than four years. For voters 70 or older, an otherwise valid accepted ID may be expired for any length of time."] },
      { heading: "Reasonable Impediment Declarations provide another regular-ballot path", paragraphs: ["A voter who does not possess and cannot reasonably obtain an accepted photo ID may use an approved supporting document and execute the declaration. Poll workers may not simply substitute their own view of whether a stated impediment is reasonable."] },
      { heading: "Provisional voting protects unresolved eligibility questions", paragraphs: ["When the ID requirement cannot be completed at check-in, a voter may be offered a provisional ballot. Whether it counts can depend on timely completion of the required post-election cure or another applicable qualification procedure."] },
    ],
    faq: [
      { q: "Is a Texas voter-registration certificate one of the seven photo IDs?", a: "No, but it can be a supporting document for a voter who does not possess and cannot reasonably obtain an accepted photo ID and completes a Reasonable Impediment Declaration." },
      { q: "Does the address on my photo ID have to match my registration address?", a: "Secretary of State guidance states that the identification address does not have to match the voter-registration address; other residence and registration rules still apply." },
      { q: "What if I forgot my ID?", a: "Depending on the facts, a voter may return before polls close with acceptable ID or cast a provisional ballot and follow the applicable cure procedure." },
    ],
    sources: [ch63, voteTexas],
    related: [
      { label: "Texas voter registration", href: "/guides/texas-voter-registration-law" },
      { label: "Texas provisional ballots", href: "/guides/texas-provisional-ballot-law" },
      { label: "Texas early voting", href: "/guides/texas-early-voting-law" },
    ],
  },

  "texas-early-voting-law": {
    ...common,
    slug: "texas-early-voting-law",
    title: "Texas Early Voting Law: Who Can Vote Early, Dates and Locations",
    dek: "How early voting by personal appearance works in Texas, who may use it, statutory timing, countywide locations, identification rules and the difference between early voting and voting by mail.",
    keyTakeaways: [
      "Any registered Texas voter who is otherwise eligible for the election may vote early by personal appearance; unlike voting by mail, no special excuse is required.",
      "Election Code Section 85.001 sets the statutory beginning and ending framework for early voting by personal appearance, with election calendars applying weekend and holiday adjustments.",
      "For county elections using the ordinary countywide early-voting system, voters may use early-voting locations made available for the county rather than being limited to one election-day precinct location.",
      "The same in-person voter-identification framework generally applies during early voting as on election day.",
    ],
    intro: ["Texas calls in-person voting before election day 'early voting by personal appearance.' It is available to ordinary registered voters without the eligibility restrictions that apply to mail ballots."],
    sections: [
      { heading: "No special excuse is required for in-person early voting", paragraphs: ["A registered voter may vote early in person if otherwise qualified for the election. This is a key difference from Chapter 82 voting by mail, which requires a statutory eligibility ground."] },
      { heading: "Chapter 85 controls the statutory early-voting period", paragraphs: ["Section 85.001 establishes when early voting begins and ends for different election types. The Secretary of State's election calendars apply Section 1.006 weekend and holiday adjustments where necessary."] },
      { heading: "Locations are published by the early voting clerk", paragraphs: ["Counties publish early-voting sites and schedules. VoteTexas also directs voters to the state's registration and polling-place tools as locations become available."] },
      { heading: "In-person identification rules still apply", paragraphs: ["Early voting is still in-person voting, so Chapter 63 identification and voter-acceptance procedures generally apply just as they do on election day."] },
    ],
    faq: [
      { q: "Do I need a reason to vote early in person in Texas?", a: "No. Any otherwise eligible registered voter may vote early by personal appearance." },
      { q: "Are early-voting dates the same every election?", a: "No. Chapter 85 provides formulas and different rules by election type, and the Secretary of State publishes election-specific calendars." },
      { q: "Do voter-ID rules apply during early voting?", a: "Yes. The ordinary in-person voter-acceptance and identification procedures apply." },
    ],
    sources: [ch85, voteTexas],
    related: [
      { label: "Texas voter registration", href: "/guides/texas-voter-registration-law" },
      { label: "Texas vote-by-mail eligibility", href: "/guides/texas-vote-by-mail-eligibility-law" },
      { label: "Texas voter ID", href: "/guides/texas-voter-id-law" },
    ],
  },

  "texas-vote-by-mail-eligibility-law": {
    ...common,
    slug: "texas-vote-by-mail-eligibility-law",
    title: "Texas Vote-by-Mail Eligibility: Who Qualifies for a Ballot by Mail",
    dek: "Texas Election Code Chapter 82 eligibility for voting by mail, including age 65+, sickness or disability, expected childbirth, absence from the county, confinement and related limits.",
    keyTakeaways: [
      "Texas does not provide no-excuse voting by mail to every voter; Chapter 82 limits ordinary mail-ballot eligibility to statutory categories.",
      "Current Secretary of State guidance identifies eligibility based on being 65 or older on election day, sickness or disability, expected childbirth within the statutory window, qualifying absence from the county, or specified confinement circumstances.",
      "Absence-based eligibility generally requires the voter to expect to be absent from the county of residence on election day and during the period for early voting by personal appearance.",
      "Eligibility to receive a mail ballot is separate from properly completing the application, carrier envelope, identification-number requirements and return deadline.",
    ],
    intro: ["In Texas, early voting in person is broadly available, but early voting by mail is not. A voter requesting an ordinary ABBM must qualify under Chapter 82 and then satisfy the separate application and ballot-return procedures."],
    sections: [
      { heading: "Age 65 or older is a statutory category", paragraphs: ["A voter who will be 65 years of age or older on election day may qualify to vote by mail under Chapter 82."] },
      { heading: "Sickness, disability and childbirth have statutory rules", paragraphs: ["Chapter 82 includes sickness or physical-condition eligibility and a separate expected-childbirth provision. The statutory definitions and voter certification control rather than an election worker inventing an additional medical standard."] },
      { heading: "Absence from the county has timing requirements", paragraphs: ["The absence category generally applies when the voter expects to be outside the county of residence on election day and during the in-person early-voting period. The application also has address requirements tied to the claimed ground."] },
      { heading: "Confinement can qualify without every incarcerated person being eligible", paragraphs: ["Chapter 82 includes specified confinement circumstances. Separate voter-registration eligibility rules, including final felony-conviction rules, still matter."] },
    ],
    faq: [
      { q: "Can any Texas voter request a mail ballot just because they prefer mail voting?", a: "No. Ordinary ABBM eligibility requires one of the grounds in Chapter 82." },
      { q: "Does being 65 qualify automatically?", a: "A registered voter who will be at least 65 on election day is within a statutory mail-ballot eligibility category, but still must timely submit a valid application and ballot." },
      { q: "Is being out of town for election day alone always enough?", a: "The statutory absence ground generally also considers the in-person early-voting period, so the full Chapter 82 rule should be checked." },
    ],
    sources: [ch82, voteTexas],
    related: [
      { label: "Mail-ballot application and return", href: "/guides/texas-mail-ballot-application-return-law" },
      { label: "Texas early voting", href: "/guides/texas-early-voting-law" },
      { label: "Texas voter registration", href: "/guides/texas-voter-registration-law" },
    ],
  },

  "texas-mail-ballot-application-return-law": {
    ...common,
    slug: "texas-mail-ballot-application-return-law",
    title: "Texas Mail Ballot Applications and Returns: ABBM Deadlines, ID Numbers and Cure Rules",
    dek: "How a Texas Application for Ballot by Mail is submitted, the 11th-day application deadline, ballot-return timing, identification-number matching and the mail-ballot correction process.",
    keyTakeaways: [
      "Election Code Section 84.007 generally requires the early voting clerk to receive an ABBM by the close of regular business or noon, whichever is later, on the 11th day before election day, subject to calendar adjustments.",
      "Texas mail-ballot applications and carrier envelopes include identification-number requirements; voters should use identifying information that can be matched to their voter-registration record.",
      "Section 86.007 governs the ordinary deadline for returning a voted mail ballot, with different rules for domestic, overseas, military and certain other ballots.",
      "Texas law provides notice and correction procedures for certain defects in mail-ballot applications or carrier envelopes, so a flagged ballot is not necessarily the end of the process if the voter acts within the applicable cure window.",
    ],
    intro: ["Mail voting has two separate timing problems: getting an application to the early voting clerk soon enough to receive a ballot, and returning the voted ballot under the applicable Section 86.007 deadline. Identification-number matching and cure procedures add another layer."],
    sections: [
      { heading: "The ABBM must be received, not merely postmarked, by the application deadline", paragraphs: ["Section 84.007 uses receipt by the early voting clerk. Election calendars identify the actual date after applying statutory weekend and holiday rules."] },
      { heading: "Identification information matters on both application and carrier envelope", paragraphs: ["Texas requires specified identifying information designed to match the voter-registration record. A mismatch can trigger rejection or cure procedures rather than being treated as a trivial formatting issue."] },
      { heading: "Ballot return deadlines depend on how and where the ballot is returned", paragraphs: ["Section 86.007 contains the ordinary domestic mailed-ballot deadline and separate rules for overseas, military and other categories. The election-specific Secretary of State calendar is the safest source for the actual date and postmark requirement."] },
      { heading: "Texas provides correction procedures for some defects", paragraphs: ["Election officials use the statutory notice and cure framework for specified problems. Voters should respond promptly through the official process rather than assuming a mail ballot can be casually replaced or altered outside that framework."] },
    ],
    faq: [
      { q: "Is an ABBM timely if I mail it by the deadline?", a: "Not necessarily. Section 84.007 generally requires the early voting clerk to receive it by the statutory deadline." },
      { q: "Is every mail ballot due at exactly the same time?", a: "No. Section 86.007 has different timing rules for several categories, including domestic and overseas ballots." },
      { q: "Can some mail-ballot defects be corrected?", a: "Yes. Texas law includes notice and cure procedures for specified application and carrier-envelope defects, subject to strict deadlines." },
    ],
    sources: [ch84, ch86, voteTexas, { label: "Texas Legislature — HB 3697 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03697F.HTM" }],
    related: [
      { label: "Texas vote-by-mail eligibility", href: "/guides/texas-vote-by-mail-eligibility-law" },
      { label: "Texas voter ID", href: "/guides/texas-voter-id-law" },
      { label: "Texas provisional ballots", href: "/guides/texas-provisional-ballot-law" },
    ],
  },

  "texas-polling-place-hours-law": {
    ...common,
    slug: "texas-polling-place-hours-law",
    title: "Texas Election Day Polling Hours: 7 A.M. to 7 P.M. and Voters in Line",
    dek: "Texas Election Day polling hours, the 7 a.m.–7 p.m. rule, what happens if a voter is in line at closing time, and why early-voting hours follow a different schedule.",
    keyTakeaways: [
      "Election Code Section 41.031 generally requires election-day polling places to be open from 7 a.m. to 7 p.m.",
      "A voter who is in line at the polling place by the statutory closing time may remain eligible to vote under the Election Code's closing procedures even if the ballot is cast after 7 p.m.",
      "The 7 a.m.–7 p.m. rule is an election-day rule; early-voting dates and daily hours are governed separately by Chapter 85 and the election authority's published schedule.",
      "Polling-place locations and countywide-voting arrangements can change from one election to another, so voters should verify the correct location before traveling.",
    ],
    intro: ["Texas's familiar 7-to-7 schedule applies to election day, not every voting day. The Election Code separately regulates early-voting hours and protects voters who timely arrive before an election-day polling place closes."],
    sections: [
      { heading: "Election day is generally 7 a.m. to 7 p.m.", paragraphs: ["Section 41.031 establishes the statewide baseline polling hours for election day, subject to narrow statutory exceptions for particular elections or circumstances."] },
      { heading: "Closing time does not mean ejecting voters already in line", paragraphs: ["Election officers use statutory closing procedures to identify voters who arrived by closing time. A voter should stay in line and follow election-official instructions rather than leaving because the clock passes 7 p.m."] },
      { heading: "Early-voting hours are separate", paragraphs: ["Chapter 85 controls early-voting schedules. Counties publish site-specific hours, which can vary by day and election."] },
      { heading: "Confirm the correct polling place", paragraphs: ["Election-day precinct or countywide-vote-center arrangements can differ by county and election. The Secretary of State and county election office publish current locations." ] },
    ],
    faq: [
      { q: "What time do Texas election-day polls usually open and close?", a: "Section 41.031 generally sets 7 a.m. to 7 p.m." },
      { q: "What if I am in line at 7 p.m.?", a: "Stay in line and follow election officials' instructions; election law provides closing procedures for voters who timely arrived before the polls closed." },
      { q: "Are early-voting sites also always open 7 to 7?", a: "No. Early-voting schedules are governed separately and should be checked for the specific election and site." },
    ],
    sources: [ch41, { label: "Texas Secretary of State — Election Law Calendars", url: "https://www.sos.state.tx.us/elections/laws/current-elections-information.shtml" }],
    related: [
      { label: "Texas early voting", href: "/guides/texas-early-voting-law" },
      { label: "Texas voter ID", href: "/guides/texas-voter-id-law" },
      { label: "Texas curbside voting", href: "/guides/texas-curbside-voting-law" },
    ],
  },

  "texas-electioneering-polling-place-law": {
    ...common,
    slug: "texas-electioneering-polling-place-law",
    title: "Texas Electioneering Law at Polling Places: 100-Foot and Curbside Zones",
    dek: "Where campaigning is prohibited around Texas polling places, the 100-foot entrance zone, the new 20-foot curbside zone, signs and literature, sound amplification and lawful activity outside the marker.",
    keyTakeaways: [
      "Election Code Section 61.003 prohibits loitering or electioneering during the voting period within 100 feet of an outside door through which a voter may enter the polling-place building.",
      "Electioneering includes expressing a preference for or against a candidate, measure or political party and includes posting, using or distributing political signs or literature within the protected zone.",
      "HB 521, effective September 1, 2025, added a separate 20-foot no-electioneering and no-loitering zone around a parking space designated for curbside voting.",
      "Outside the statutory protected area, an entity controlling a public building used as a polling place generally may not ban electioneering altogether, although reasonable content-neutral time, place and manner regulations can apply.",
    ],
    intro: ["Texas polling places have marked campaign-free zones. The main rule is measured from outside voter entrances, and 2025 law added a separate protected area around designated curbside spaces."],
    sections: [
      { heading: "The ordinary boundary is 100 feet from an outside voter entrance", paragraphs: ["Sections 61.003 and 85.036 govern electioneering during election-day and early-voting periods. Election officials place distance markers showing the protected boundary."] },
      { heading: "Signs, literature and campaign advocacy count", paragraphs: ["Secretary of State guidance treats political signs, literature, petition activity and other advocacy for or against a candidate, measure or party as electioneering within the protected area."] },
      { heading: "HB 521 added a curbside-specific 20-foot zone", paragraphs: ["Effective September 1, 2025, Section 61.003 also protects the area within 20 feet of a designated curbside-voting parking space. That zone can overlap or extend beyond the ordinary 100-foot entrance boundary."] },
      { heading: "Outside the boundary is not regulation-free", paragraphs: ["Public-building owners generally must allow electioneering outside the statutory zone but may adopt reasonable content-neutral time, place and manner rules. Other laws governing signs, conduct, traffic and sound can still apply."] },
    ],
    faq: [
      { q: "How far from a Texas polling-place entrance does the electioneering ban extend?", a: "The ordinary protected area extends 100 feet from an outside door through which voters enter the polling-place building." },
      { q: "Did Texas add a curbside-voting campaign-free zone?", a: "Yes. HB 521 added a 20-foot protected zone around designated curbside-voting parking spaces effective September 1, 2025." },
      { q: "Is campaigning always prohibited everywhere on the property?", a: "No. The Election Code distinguishes the statutory protected zones from areas outside them, although reasonable lawful regulations can still apply outside the markers." },
    ],
    sources: [ch61, { label: "Texas Secretary of State — Certain Activities in Vicinity of Polling Places", url: "https://www.sos.state.tx.us/elections/laws/advisory2026-07.shtml" }, { label: "Texas Secretary of State — HB 521 Curbside and Assistance Changes", url: "https://www.sos.state.tx.us/elections/laws/advisory2025-12.shtml" }],
    related: [
      { label: "Texas curbside voting", href: "/guides/texas-curbside-voting-law" },
      { label: "Texas voter assistance", href: "/guides/texas-voter-assistance-law" },
      { label: "Texas polling hours", href: "/guides/texas-polling-place-hours-law" },
    ],
  },

  "texas-voter-assistance-law": {
    ...common,
    slug: "texas-voter-assistance-law",
    title: "Texas Voter Assistance Law: Who May Help a Voter and Required Oaths",
    dek: "When a Texas voter may receive assistance, who the voter may select, what an assistant may do, required oaths and forms, and the 2025 HB 521 election-worker assistance changes.",
    keyTakeaways: [
      "Election Code Section 64.031 permits assistance when a voter is unable to prepare the ballot because of a physical disability that prevents writing or seeing, or because the voter cannot read the ballot language, subject to the statute's current terms.",
      "A qualifying voter generally may select a person of the voter's choice to assist, except for persons disqualified by federal or state law such as the voter's employer, an employer's agent, or an officer or agent of the voter's union.",
      "A non-election-officer assistant must take the statutory oath and may provide only assistance authorized by the voter and Election Code Chapter 64.",
      "HB 521, effective September 1, 2025, added an Election Worker Assistance Sheet requirement when election officials themselves provide assistance at a polling location or curbside.",
    ],
    intro: ["Assistance is meant to enable the voter—not transfer the voter's choices to someone else. Chapter 64 regulates eligibility for assistance, the assistant's oath, permitted conduct, and recordkeeping."],
    sections: [
      { heading: "Section 64.031 defines when assistance is available", paragraphs: ["The statute addresses voters who cannot prepare a ballot because of specified physical or reading limitations. Election officials should apply the legal criteria rather than require an extra showing not found in the Code."] },
      { heading: "The voter ordinarily chooses the assistant", paragraphs: ["Subject to statutory disqualifications, a voter entitled to assistance may choose an individual to help. Federal law also protects the choice of assistant with exceptions for an employer or union representative."] },
      { heading: "The assistant's role is limited", paragraphs: ["An assistant may help as authorized by Chapter 64 and the voter but may not decide how the voter should vote, reveal the vote, or use the position to coerce or improperly influence the voter."] },
      { heading: "HB 521 changed election-worker paperwork", paragraphs: ["The 2025 law requires an Election Worker Assistance Sheet when an election official assists a voter at the polling location or curbside. Non-election-officer assistants remain subject to the oath and other Chapter 64 requirements."] },
    ],
    faq: [
      { q: "Can a voter choose a family member to assist?", a: "Often yes, if the voter qualifies for assistance and the chosen person is not disqualified by law. The assistant must follow the statutory oath and limits." },
      { q: "Can an assistant tell the voter which candidates to select?", a: "No. Assistance is to help the voter mark or understand the ballot as authorized, not to substitute the assistant's choices or pressure the voter." },
      { q: "Did HB 521 eliminate the oath for private assistants?", a: "No. Secretary of State guidance states the oath still applies to a person other than an election officer selected to provide assistance; HB 521 added election-worker assistance documentation." },
    ],
    sources: [ch64, { label: "Texas Secretary of State — HB 521 Curbside and Assistance Changes", url: "https://www.sos.state.tx.us/elections/laws/advisory2025-12.shtml" }],
    related: [
      { label: "Texas curbside voting", href: "/guides/texas-curbside-voting-law" },
      { label: "Texas voter ID", href: "/guides/texas-voter-id-law" },
      { label: "Texas provisional ballots", href: "/guides/texas-provisional-ballot-law" },
    ],
  },

  "texas-curbside-voting-law": {
    ...common,
    slug: "texas-curbside-voting-law",
    title: "Texas Curbside Voting Law: Disability Access and 2025 HB 521 Changes",
    dek: "Who may vote curbside in Texas, the polling-place accommodation process, privacy, the new voter attestation and 20-foot protected zone, and transportation/assistance records under HB 521.",
    keyTakeaways: [
      "Election Code Section 64.009 provides curbside voting when a qualified voter is physically unable to enter the polling place without personal assistance or likelihood of injuring the voter's health.",
      "HB 521, effective September 1, 2025, requires curbside voters to complete a statement attesting that they are physically unable to enter the polling place.",
      "The same 2025 law added a 20-foot no-electioneering and no-loitering zone around parking spaces designated for curbside voting.",
      "HB 521 also added recordkeeping when a person transports seven or more curbside voters during the combined early-voting and election-day voting period and changed election-worker assistance documentation.",
    ],
    intro: ["Curbside voting is a statutory polling-place accommodation, not a general drive-through voting option. Texas substantially updated its curbside procedures in 2025 through HB 521."],
    sections: [
      { heading: "Curbside voting is tied to physical inability to enter", paragraphs: ["Section 64.009 requires election officials to make curbside voting available when the statutory physical-access standard is met. The ballot or voting equipment is brought to the voter at the entrance or curb."] },
      { heading: "The voter must be able to vote privately", paragraphs: ["Secretary of State guidance explains that the vehicle becomes the voting station for the curbside voter, so campaigns, bystanders and assistants must respect ballot privacy."] },
      { heading: "HB 521 added a curbside voter statement and protected zone", paragraphs: ["Beginning September 1, 2025, curbside voters must complete the statutory statement, and election officials must protect a 20-foot area around designated curbside parking spaces from electioneering and loitering."] },
      { heading: "Transportation and assistance can trigger additional forms", paragraphs: ["When one person transports seven or more curbside voters during the full voting period, HB 521 requires specified identifying information. Election workers who assist voters also complete the new assistance sheet described by the Secretary of State."] },
    ],
    faq: [
      { q: "Can anyone choose curbside voting for convenience?", a: "No. Section 64.009 ties curbside voting to a physical inability to enter the polling place without assistance or likelihood of injuring the voter's health." },
      { q: "Is campaigning allowed next to a curbside voting space?", a: "HB 521 created a separate 20-foot no-electioneering and no-loitering zone around designated curbside spaces." },
      { q: "Did curbside procedures change in 2025?", a: "Yes. HB 521 added the curbside voter statement, new protected-zone rules, transportation reporting and election-worker assistance documentation." },
    ],
    sources: [ch64, ch61, { label: "Texas Secretary of State — HB 521 Curbside and Assistance Changes", url: "https://www.sos.state.tx.us/elections/laws/advisory2025-12.shtml" }],
    related: [
      { label: "Texas voter assistance", href: "/guides/texas-voter-assistance-law" },
      { label: "Texas electioneering law", href: "/guides/texas-electioneering-polling-place-law" },
      { label: "Texas voter ID", href: "/guides/texas-voter-id-law" },
    ],
  },

  "texas-provisional-ballot-law": {
    ...common,
    slug: "texas-provisional-ballot-law",
    title: "Texas Provisional Ballot Law: When You Can Vote Provisionally and How It Is Reviewed",
    dek: "When Texas voters may cast provisional ballots, common registration and ID situations, the six-day voter-ID cure period, ballot-board review and why a provisional ballot is not automatically rejected.",
    keyTakeaways: [
      "Election Code Section 63.011 provides provisional voting in specified situations when a voter's eligibility cannot be resolved through the ordinary check-in process.",
      "Common provisional-ballot situations can involve a voter not appearing on the precinct list, unresolved eligibility information, or inability to satisfy the in-person voter-ID procedure at the polling place.",
      "For specified photo-ID provisional ballots, current Secretary of State guidance provides a six-calendar-day period after election day to present acceptable identification or complete another applicable cure or exemption procedure at the voter registrar's office.",
      "A provisional ballot is reviewed under statutory procedures; casting one does not mean the ballot will automatically count or automatically be rejected.",
    ],
    intro: ["Provisional voting is a safeguard for eligibility questions that cannot be conclusively resolved at the polling place. The ballot is kept separate while the voter registrar and early voting ballot board apply the statutory review process."],
    sections: [
      { heading: "Section 63.011 identifies provisional-voting situations", paragraphs: ["A voter may be accepted provisionally when the voter claims eligibility but the ordinary records or procedures do not permit a regular ballot. Election officers complete the required affidavit and notices rather than simply turning the voter away when provisional voting applies."] },
      { heading: "ID problems can trigger a provisional ballot", paragraphs: ["A voter who does not complete the ordinary photo-ID or Reasonable Impediment Declaration procedure at check-in may be entitled to vote provisionally and then follow the applicable post-election cure procedure."] },
      { heading: "Some ID provisional ballots have a six-day cure window", paragraphs: ["Current Secretary of State guidance gives specified provisional voters six calendar days after election day to appear at the county voter registrar and provide acceptable ID or complete an applicable exemption or declaration procedure."] },
      { heading: "The ballot is reviewed before it is counted", paragraphs: ["Election officials investigate registration and eligibility information and the early voting ballot board determines whether the provisional ballot should be counted under the Election Code. The voter receives information explaining how to learn the disposition."] },
    ],
    faq: [
      { q: "Is a provisional ballot just a fake ballot that never counts?", a: "No. It is a real statutory ballot reviewed after election day. Whether it counts depends on the voter's eligibility and any required cure or supporting information." },
      { q: "What if my name is not on the voter list?", a: "Depending on the circumstances and inability to resolve the record at the polling place, Section 63.011 may permit provisional voting." },
      { q: "How long do I have to cure certain voter-ID provisional ballots?", a: "Current Secretary of State guidance provides six calendar days after election day for specified ID-related provisional-ballot cures." },
    ],
    sources: [ch63, voteTexas],
    related: [
      { label: "Texas voter ID", href: "/guides/texas-voter-id-law" },
      { label: "Texas voter registration", href: "/guides/texas-voter-registration-law" },
      { label: "Texas polling hours", href: "/guides/texas-polling-place-hours-law" },
    ],
  },
};
