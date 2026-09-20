import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const HOA_GOVERNANCE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hoa-board-meetings-law": {
    slug: "texas-hoa-board-meetings-law",
    title: "Texas HOA Board Meetings: Open Meetings, Notice and Executive Sessions",
    dek: "Texas HOA board-meeting rules under Property Code Section 209.0051, including open meetings, executive sessions, meeting notices, electronic participation, minutes, and decisions that must be made in an open meeting.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 209.0051 generally requires regular and special HOA board meetings to be open to owners, subject to listed executive-session subjects.",
      "Meeting notices must identify the date, hour, place, and general subject, including a general description of executive-session matters.",
      "The statute generally requires at least 144 hours' notice for a regular board meeting and at least 72 hours for a special board meeting when the posting-and-e-mail method is used.",
      "Fines, foreclosure initiation, assessment increases, special assessments, annual budgets, real-property transactions, board vacancies, and other listed matters may not be decided outside a properly noticed open meeting.",
    ],
    intro: ["Texas HOA boards may conduct association business, but Chapter 209 imposes open-meeting and notice rules that make major decisions visible to owners.", "Section 209.0051 also recognizes electronic meetings and executive sessions, but each has limits and procedural requirements."],
    sections: [
      { heading: "Regular and special meetings are generally open", paragraphs: ["Section 209.0051 requires regular and special board meetings to be open to owners. The board may adjourn into executive session for specified matters such as personnel, litigation, contract negotiations, enforcement actions, privileged attorney communications, and privacy-sensitive matters."] },
      { heading: "Notice timing depends on the method", paragraphs: ["The statute allows notice by mailing within the statutory 10-to-60-day window or by the posting-and-e-mail method. Under that method, notice generally must be provided at least 144 hours before a regular board meeting and at least 72 hours before a special board meeting."] },
      { heading: "Electronic meetings are allowed with safeguards", paragraphs: ["A board meeting may be held electronically or by telephone if board members can hear and be heard, owners can hear the non-executive-session portions, and the meeting notice supplies access instructions for the communication method."] },
      { heading: "Major actions cannot be hidden in off-meeting votes", paragraphs: ["Section 209.0051 permits some action outside a meeting, but expressly lists matters that must be handled in an open meeting with prior notice, including fines, foreclosure initiation, assessment increases, special assessments, annual budgets, real-property transactions, filling a board vacancy, and election of an officer."] },
    ],
    faq: [
      { q: "Are Texas HOA board meetings open to homeowners?", a: "Generally yes. Section 209.0051 requires regular and special board meetings to be open to owners, with limited executive-session exceptions." },
      { q: "How much notice is required for a Texas HOA board meeting?", a: "When the association uses the posting-and-e-mail method, Section 209.0051 generally requires at least 144 hours for a regular meeting and 72 hours for a special meeting. A different statutory mailing method is also available." },
      { q: "Can a Texas HOA board vote by e-mail?", a: "Some action outside a meeting is permitted, but Section 209.0051 lists major matters that may not be considered or voted on unless done in an open meeting with prior notice." },
    ],
    sources: [{ label: "Texas Property Code § 209.0051", url: "https://statutes.capitol.texas.gov/?artSec=209.0051&chapter=PR.209&code=PR&tab=1" }],
    related: [{ label: "Texas HOA records", href: "/guides/texas-hoa-records-law" }, { label: "Texas HOA elections", href: "/guides/texas-hoa-election-law" }, { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" }],
  },
  "texas-hoa-election-law": {
    slug: "texas-hoa-election-law",
    title: "Texas HOA Elections: Notice, Ballots, Voting Rights and Board Seats",
    dek: "Texas HOA election rules explained, including election notice, written and electronic ballots, owner voting rights, board candidacy, annual meetings, and the 2025 updates to association voting procedures.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 209.0056 generally requires written election notice 10 to 60 days before an owner vote held at a meeting and at least 20 days before the ballot deadline for a vote not taken at a meeting.",
      "Section 209.0059 generally voids a dedicatory-instrument provision that disqualifies an owner from voting in a board election or on owner rights or responsibilities, subject to the statute's limited exception.",
      "Sections 209.0058 and 209.00592 regulate written, signed, absentee, proxy, and electronic voting methods and how those ballots interact with in-person voting and quorum.",
      "Section 209.00591 generally protects an owner's right to run for the board, while Section 209.014 requires an annual member meeting and supplies a homeowner process if the board fails to call one.",
    ],
    intro: ["Texas HOA election procedure is spread across several sections of Chapter 209 rather than one single election statute.", "The rules cover notice, candidacy, voting methods, ballots, board membership, annual meetings, and remedies when an association fails to conduct required governance."],
    sections: [
      { heading: "Election notice has statutory windows", paragraphs: ["For a vote taken at an owner meeting, Section 209.0056 requires written notice no later than the 10th day and no earlier than the 60th day before the election or vote. For a vote not taken at a meeting, notice must be given no later than the 20th day before the latest ballot-submission date."] },
      { heading: "Owners generally retain voting rights", paragraphs: ["Section 209.0059 voids a governing-document provision that would disqualify a property owner from voting in a board election or on matters concerning the owner's rights or responsibilities, subject to the section's narrow small-development exception."] },
      { heading: "Texas law recognizes multiple voting methods", paragraphs: ["Chapter 209 addresses written and signed ballots, secret ballots, absentee ballots, proxies, and electronic ballots. Section 209.00592 generally requires an association to allow at least one of absentee ballot, proxy, or electronic ballot unless the dedicatory instrument provides otherwise."] },
      { heading: "Board candidacy and annual meetings are protected", paragraphs: ["Section 209.00591 generally voids restrictions on an owner's right to run for the board, subject to statutory qualifications and exceptions. Section 209.014 requires an annual member meeting and creates a process for owners to demand and ultimately organize an election meeting if the board does not call one."] },
    ],
    faq: [
      { q: "How much notice is required for a Texas HOA election?", a: "For a vote at a meeting, generally 10 to 60 days. For a vote not taken at a meeting, notice generally must be given at least 20 days before the latest ballot-submission date." },
      { q: "Can a Texas HOA stop an owner from voting because the owner owes money?", a: "Section 209.0059 generally makes a provision that disqualifies an owner from voting in a board election or on owner rights and responsibilities void, subject to the statute's limited exception." },
      { q: "Can Texas HOA owners vote electronically?", a: "Yes. Section 209.00592 recognizes electronic ballots and defines requirements for confirming the owner's identity and receipt of the ballot." },
    ],
    sources: [
      { label: "Texas Property Code § 209.0056", url: "https://statutes.capitol.texas.gov/?artSec=209.0056&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.0058", url: "https://statutes.capitol.texas.gov/?artSec=209.0058&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.0059", url: "https://statutes.capitol.texas.gov/?artSec=209.0059&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.00591", url: "https://statutes.capitol.texas.gov/?artSec=209.00591&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.00592", url: "https://statutes.capitol.texas.gov/?artSec=209.00592&chapter=PR.209&code=PR&tab=1" },
      { label: "Texas Property Code § 209.014", url: "https://statutes.capitol.texas.gov/?artSec=209.014&chapter=PR.209&code=PR&tab=1" },
    ],
    related: [{ label: "Texas HOA board meetings", href: "/guides/texas-hoa-board-meetings-law" }, { label: "Texas HOA records", href: "/guides/texas-hoa-records-law" }, { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" }],
  },
};
