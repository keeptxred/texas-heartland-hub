import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_ENTRY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-landlord-entry-privacy-law": {
    slug: "texas-landlord-entry-privacy-law",
    title: "Texas Landlord Entry and Tenant Privacy: What the Lease Controls",
    dek: "Texas landlord-entry rules explained, including why there is no general statewide notice statute, how lease terms matter, and the role of emergencies, repairs, and quiet enjoyment.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not have a general state statute that sets a universal advance-notice period for landlord entry into a residential rental.",
      "The lease is therefore especially important: it may define when the landlord, maintenance staff, or other authorized people may enter and whether advance notice is required.",
      "Emergency access and repair access can be treated differently from routine inspections or showings.",
      "Texas courts recognize an implied covenant of quiet enjoyment, so repeated unreasonable entry can raise issues beyond the absence of a specific notice statute.",
    ],
    intro: [
      "A common Texas rental myth is that state law always requires 24 hours' notice before a landlord enters. The Texas State Law Library notes that Texas has no general state statute regulating landlord entry in that way.",
      "That makes the lease the starting point. Entry rights can depend on the written contract, the reason for entry, emergencies, repair needs, and other facts. Tenants and landlords should read the actual entry clause rather than assume a rule borrowed from another state.",
    ],
    sections: [
      { heading: "There is no universal statewide notice period", paragraphs: ["Texas has no general statute requiring every residential landlord to give a fixed number of hours of notice before entry. A lease may create a notice requirement even though state law does not supply one across the board." ] },
      { heading: "The lease usually supplies the rule", paragraphs: ["Residential leases often address entry for repairs, inspections, pest control, emergencies, prospective tenants or buyers, and other purposes. The exact language matters because it defines contractual rights beyond baseline state law." ] },
      { heading: "Emergencies and repairs are different", paragraphs: ["An emergency can justify immediate access in circumstances where advance notice would be impractical. Repair access may also be supported by the lease and by the landlord's statutory repair obligations." ] },
      { heading: "Quiet enjoyment still matters", paragraphs: ["The Texas State Law Library explains that courts recognize an implied covenant of quiet enjoyment. Repeated, unnecessary, unreasonable, or lease-violating entry can therefore create legal issues even without a statewide 24-hour notice statute." ] },
    ],
    faq: [
      { q: "Does Texas law require 24 hours' notice before landlord entry?", a: "No general Texas statute imposes a universal 24-hour notice rule. The lease may require notice." },
      { q: "Can the lease allow maintenance staff to enter?", a: "Yes. Lease terms commonly authorize entry for repairs or maintenance, sometimes with notice requirements and sometimes with emergency exceptions." },
      { q: "Does no notice statute mean a landlord can enter whenever they want?", a: "No. Lease terms, the reason and manner of entry, and the covenant of quiet enjoyment can all matter." },
    ],
    sources: [
      { label: "Texas State Law Library — Landlord entry", url: "https://sll.texas.gov/faqs/landlord-entry/" },
      { label: "Texas Property Code Chapter 92", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas security devices and rekeying", href: "/guides/texas-rental-security-device-law" },
      { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" },
    ],
  },
};
