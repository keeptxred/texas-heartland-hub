import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const HOA_LIEN_RECORDS_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hoa-lien-law": {
    slug: "texas-hoa-lien-law",
    title: "Texas HOA Liens: Delinquency Notices, Filing Timelines and Owner Rights",
    dek: "How Texas HOA assessment liens work, including the two delinquency notices, certified-mail requirement, waiting periods, title effects, and the difference between a lien and foreclosure.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 209.0094 treats an assessment lien filed in county records as a legal instrument affecting title to real property.",
      "Before filing an assessment lien, the HOA must provide a first delinquency notice by first-class mail or qualifying e-mail, followed by a second notice by certified mail, return receipt requested.",
      "The second delinquency notice may not be sent earlier than the 30th day after the first notice, and the association may not file the lien before the 90th day after the second notice was sent.",
      "A recorded assessment lien and foreclosure are separate steps; foreclosure has additional statutory restrictions and court procedures.",
    ],
    intro: ["An HOA assessment lien can cloud title to a Texas home, but Chapter 209 requires staged notice before the lien is filed.", "The timing matters: owners should compare the association's notices and account history against Section 209.0094 before assuming a recorded lien was procedurally valid."],
    sections: [
      { heading: "An assessment lien affects title", paragraphs: ["Section 209.0094 defines an assessment lien broadly and states that a lien filed in the official public records is a legal instrument affecting title to real property."] },
      { heading: "The first delinquency notice", paragraphs: ["The first notice must be sent either by first-class mail to the owner's last known mailing address in the association's records or by e-mail to an address the owner provided to the association."] },
      { heading: "The certified second notice", paragraphs: ["The second delinquency notice must be sent by certified mail, return receipt requested, and may not be provided earlier than the 30th day after the first notice."] },
      { heading: "The HOA must wait before filing", paragraphs: ["The association may not file the assessment lien before the 90th day after the date the certified second delinquency notice was sent. Filing the lien still does not automatically authorize foreclosure; separate rules govern foreclosure."] },
    ],
    faq: [
      { q: "Can a Texas HOA file a lien immediately after a missed payment?", a: "No. Section 209.0094 requires staged delinquency notices and waiting periods before an assessment lien may be filed." },
      { q: "Does the second HOA lien notice have to be certified?", a: "Yes. Section 209.0094 requires the second delinquency notice to be sent by certified mail, return receipt requested." },
      { q: "Is an HOA lien the same as foreclosure?", a: "No. A lien affects title and secures claimed debt; foreclosure is a later enforcement remedy subject to additional Chapter 209 restrictions and procedures." },
    ],
    sources: [{ label: "Texas Property Code § 209.0094", url: "https://statutes.capitol.texas.gov/?artSec=209.0094&chapter=PR.209&code=PR&tab=1" }, { label: "Texas Property Code § 209.0092", url: "https://statutes.capitol.texas.gov/?artSec=209.0092&chapter=PR.209&code=PR&tab=1" }],
    related: [{ label: "Texas HOA foreclosure", href: "/guides/texas-hoa-foreclosure-law" }, { label: "Texas HOA fines", href: "/guides/texas-hoa-fines-law" }, { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" }],
  },
  "texas-hoa-records-law": {
    slug: "texas-hoa-records-law",
    title: "Texas HOA Records: How Homeowners Can Request Books, Minutes and Financial Records",
    dek: "Texas Property Code Section 209.005 explained, including certified-mail requests, 10-business-day response rules, privacy exceptions, copying charges, retention requirements, and justice-court remedies.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 209.005 generally requires HOA books and records, including financial records, to be open and reasonably available to an owner or a properly designated representative.",
      "The statutory request must be sent by certified mail with enough detail to identify the requested records and must state whether the owner wants inspection or copies.",
      "The association generally has 10 business days to provide inspection dates or produce copies, with a limited extension procedure when it cannot meet that deadline.",
      "Certain attorney files, individual violation histories, personal financial information, contact information, and employee records are protected or restricted under the statute.",
    ],
    intro: ["Texas homeowners have a statutory records-access process that is more specific than simply e-mailing the management company and asking for documents.", "Following Section 209.005's certified-mail procedure matters because the statute ties response deadlines and remedies to a properly made request."],
    sections: [
      { heading: "What records are generally available", paragraphs: ["Section 209.005 generally makes association books and records, including financial records, open and reasonably available to an owner or a designated agent, attorney, or CPA, subject to the section's exceptions."] },
      { heading: "Use the statutory request method", paragraphs: ["The owner or authorized representative must submit a written request by certified mail to the address shown on the association's current management certificate. The request must describe the records with sufficient detail and elect inspection or copies."] },
      { heading: "The 10-business-day framework", paragraphs: ["For inspection, the association generally must send available inspection dates by the 10th business day after receiving the request. For copies, it generally must produce them by that deadline. If it cannot, the association must send written notice and identify a production date within the additional period allowed by statute."] },
      { heading: "Privacy, costs and remedies", paragraphs: ["The statute protects specified privileged and owner-specific information, permits recorded copying-cost policies, requires document retention for associations over 14 lots, and authorizes a justice-court petition when an owner is denied records to which the owner is entitled."] },
    ],
    faq: [
      { q: "Can a Texas homeowner inspect HOA financial records?", a: "Generally yes. Section 209.005 includes financial records among the association books and records that must be reasonably available, subject to statutory exceptions." },
      { q: "How should I request Texas HOA records?", a: "Section 209.005 requires a detailed written request sent by certified mail to the association or representative at the address on the current management certificate." },
      { q: "How long does a Texas HOA have to respond to a records request?", a: "The statute generally uses a 10-business-day deadline for inspection dates or production, with a written extension procedure if the association cannot meet that deadline." },
    ],
    sources: [{ label: "Texas Property Code § 209.005", url: "https://statutes.capitol.texas.gov/?artSec=209.005&chapter=PR.209&code=PR&tab=1" }, { label: "Texas Property Code § 202.006", url: "https://statutes.capitol.texas.gov/?artSec=202.006&chapter=PR.202&code=PR&tab=1" }],
    related: [{ label: "Texas HOA board meetings", href: "/guides/texas-hoa-board-meetings-law" }, { label: "Texas HOA elections", href: "/guides/texas-hoa-election-law" }, { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" }],
  },
};
