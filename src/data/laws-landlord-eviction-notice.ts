import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_EVICTION_NOTICE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-eviction-notice-law": {
    slug: "texas-eviction-notice-law",
    title: "Texas Eviction Notice Law: Notice to Vacate Before Filing",
    dek: "Texas notice-to-vacate rules explained, including Property Code Section 24.005, lease-controlled notice periods, delivery methods, and the difference between a notice and a court eviction.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Property Code Section 24.005 generally requires a landlord to give a written notice to vacate before filing certain eviction suits.",
      "The required notice period can depend on the lease and the statutory reason for possession, so three days is not a universal answer for every Texas eviction.",
      "A notice to vacate is not itself a court order removing a tenant; possession is obtained through the judicial eviction process unless another lawful procedure applies.",
      "Delivery method matters because Section 24.005 specifies how notice may be delivered or mailed.",
    ],
    intro: [
      "A Texas eviction normally begins before anyone goes to court. Property Code Section 24.005 governs the written notice to vacate that precedes many forcible-detainer suits.",
      "The notice is a procedural step, not a writ of possession. Tenants and landlords should read the lease together with the current statute because the lease can affect the notice period in circumstances allowed by law.",
    ],
    sections: [
      { heading: "Notice comes before the suit", paragraphs: ["Section 24.005 generally requires written notice to vacate before a landlord files a forcible-detainer suit based on holding over after default or termination. The statute contains different rules for particular situations, so the reason for possession matters."] },
      { heading: "The lease can affect timing", paragraphs: ["Texas law does not support one universal notice period for every eviction. Section 24.005 contains statutory defaults and recognizes lease provisions in specified circumstances. The actual lease and current statute should be checked together."] },
      { heading: "Delivery method matters", paragraphs: ["Section 24.005 specifies permitted ways to deliver notice, including personal delivery, delivery to qualifying occupants, affixing notice in circumstances allowed by the statute, and mail. A defective notice can become a contested issue in the eviction case."] },
      { heading: "A notice is not a physical eviction", paragraphs: ["A notice to vacate tells the tenant that possession is demanded. If the tenant does not leave, the landlord generally must use the judicial eviction process and obtain a writ of possession before a constable or sheriff removes occupants under court authority."] },
    ],
    faq: [
      { q: "Is a Texas notice to vacate the same as an eviction order?", a: "No. It is a pre-suit notice. A court judgment and, when necessary, a writ of possession are separate steps in the judicial eviction process." },
      { q: "Is every Texas eviction based on a three-day notice?", a: "No. Section 24.005 contains different rules and can interact with lease language. The reason for eviction and the lease terms matter." },
      { q: "Can a landlord skip written notice?", a: "Section 24.005 generally requires written notice before filing the covered eviction suit, subject to the statute's specific rules and exceptions." },
    ],
    sources: [
      { label: "Texas Property Code § 24.005", url: "https://statutes.capitol.texas.gov/?artSec=24.005&chapter=PR.24&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 24", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.24.htm" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas eviction process", href: "/guides/texas-eviction-process-timeline" },
      { label: "Texas landlord lockout law", href: "/guides/texas-landlord-lockout-law" },
    ],
  },
};
