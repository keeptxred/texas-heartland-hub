import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_EVICTION_PROCESS_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-eviction-process-timeline": {
    slug: "texas-eviction-process-timeline",
    title: "Texas Eviction Process: Notice, Justice Court, Appeal and Writ of Possession",
    dek: "A step-by-step Texas eviction overview covering notice to vacate, filing in justice court, trial, appeal, and the writ-of-possession stage under current Texas law and Rule 510.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Most Texas residential evictions begin with the notice required by Property Code Section 24.005 and then proceed as a forcible-detainer case in justice court.",
      "Texas Rule of Civil Procedure 510 governs eviction-case procedure in justice court.",
      "There is no single universal number of days from notice to physical removal because service, scheduling, continuances, appeals, and case facts can change the timeline.",
      "Physical removal occurs under a writ of possession executed through the court process.",
    ],
    intro: ["Texas eviction cases decide the immediate right to possession. Property Code Chapter 24 supplies the statutory framework, while Rule 510 governs the justice-court procedure.", "A reliable timeline should explain the sequence rather than promise one universal number of days."],
    sections: [
      { heading: "1. Notice to vacate", paragraphs: ["Section 24.005 generally requires the applicable written notice before a covered forcible-detainer suit is filed. Lease terms and the ground for possession can affect the notice requirement."] },
      { heading: "2. Filing and service", paragraphs: ["The landlord files in the justice court with jurisdiction over the rental property. Rule 510 governs the petition, citation, service, and trial procedure."] },
      { heading: "3. Trial, judgment and appeal", paragraphs: ["The justice court decides possession. Rule 510 contains special eviction appeal procedures and deadlines, so parties should use the current rule and their court notices rather than ordinary civil-case assumptions."] },
      { heading: "4. Writ of possession", paragraphs: ["When a possession judgment is enforceable, the prevailing landlord may seek a writ of possession. The appropriate officer executes the writ; a private demand is not a substitute for that process."] },
    ],
    faq: [
      { q: "How long does a Texas eviction take?", a: "There is no single guaranteed duration. Notice, service, scheduling, trial, appeal, and writ timing can all affect the total time." },
      { q: "Where are Texas eviction cases handled?", a: "Residential forcible-detainer cases are generally filed in the justice court with jurisdiction over the rental property." },
      { q: "What authorizes physical removal?", a: "A writ of possession issued through the court process authorizes the appropriate officer to carry out possession." },
    ],
    sources: [
      { label: "Texas Property Code Chapter 24", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.24.htm" },
      { label: "Texas Property Code § 24.005", url: "https://statutes.capitol.texas.gov/?artSec=24.005&chapter=PR.24&code=PR&tab=1" },
      { label: "Supreme Court of Texas — current rules", url: "https://www.txcourts.gov/rules-forms/rules-standards/" },
    ],
    related: [{ label: "Texas Laws Explained", href: "/laws" }, { label: "Texas eviction notice law", href: "/guides/texas-eviction-notice-law" }, { label: "Texas landlord lockout law", href: "/guides/texas-landlord-lockout-law" }],
  },
};
