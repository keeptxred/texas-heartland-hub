import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_LEASE_COPY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-right-to-copy-of-lease": {
    slug: "texas-right-to-copy-of-lease",
    title: "Texas Right to a Copy of Your Lease: The Three-Business-Day Rule",
    dek: "When a Texas residential landlord must provide a complete copy of the signed lease and what happens when multiple tenants are on the same lease.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.024 generally requires a landlord to provide at least one complete copy of the lease to at least one tenant no later than the third business day after all parties sign.",
      "When multiple tenants are parties to the lease, a tenant who did not receive the original copy may make a written request for one.",
      "After that written request, the landlord generally has three business days to provide a complete copy to the requesting tenant.",
      "A lease copy should include the complete agreement, not merely a signature page or payment summary.",
    ],
    intro: [
      "Texas law gives residential tenants a specific right to receive the signed lease. Section 92.024 sets a short deadline and also addresses households in which several tenants signed the same agreement.",
      "Keeping the complete lease matters because entry rights, fees, repair-notice requirements, renewal terms, parking rules, and move-out obligations are often controlled by the written contract.",
    ],
    sections: [
      { heading: "At least one tenant must receive a complete copy", paragraphs: ["Section 92.024 generally requires the landlord to provide at least one complete copy of the lease to at least one tenant who is a party to the lease no later than the third business day after the lease is signed by each party." ] },
      { heading: "Other cotenants can request their own copy", paragraphs: ["If more than one tenant is a party to the lease, a tenant who did not receive a copy may request one in writing. The statute generally requires the landlord to provide one complete copy within three business days after receiving that request." ] },
      { heading: "Keep the version everyone actually signed", paragraphs: ["Tenants should keep the final executed lease and any addenda. Drafts, application paperwork, payment portals, or screenshots may not contain all of the terms that govern the tenancy." ] },
      { heading: "Why the lease copy matters later", bullets: ["Entry and notice provisions.", "Rent, late-fee, and payment terms.", "Repair-notice procedures.", "Renewal, termination, and move-out requirements.", "Parking, pets, utilities, and other addenda." ] },
    ],
    faq: [
      { q: "How quickly must a Texas landlord provide a signed lease copy?", a: "Section 92.024 generally requires at least one complete copy to at least one tenant within three business days after every party has signed." },
      { q: "Can each roommate get a copy?", a: "A tenant who is a party to the lease and did not receive a copy may make a written request; the statute generally requires a complete copy within three business days after that request." },
      { q: "Why should I keep the full lease?", a: "Many Texas landlord-tenant rights depend on the specific written lease terms, so the complete executed agreement is important evidence of those terms." },
    ],
    sources: [
      { label: "Texas Property Code § 92.024", url: "https://statutes.capitol.texas.gov/?artSec=92.024&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas landlord entry law", href: "/guides/texas-landlord-entry-privacy-law" },
      { label: "Texas rent late-fee law", href: "/guides/texas-rent-late-fee-law" },
    ],
  },
};
