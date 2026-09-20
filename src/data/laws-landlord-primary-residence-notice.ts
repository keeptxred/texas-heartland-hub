import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_PRIMARY_RESIDENCE_NOTICE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rental-notice-address-law": {
    slug: "texas-rental-notice-address-law",
    title: "Texas Rental Notice Address Law: Getting Lease Notices at a Primary Residence",
    dek: "Texas Property Code Section 92.012 explained for tenants who do not use the leased premises as their primary residence and want specified notices mailed to another address.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 92.012 applies when a tenant tells the landlord in writing that the leased premises are not the tenant's primary residence and requests specified notices at the primary-residence address.",
      "The statute covers notices of lease violations, lease termination, rental increases at the end of the lease term, and notices to vacate.",
      "The tenant must provide the primary-residence address and give written notice of later address changes.",
      "The section contains an exception when notice is actually hand-delivered to and received by a person occupying the leased premises.",
    ],
    intro: ["Texas Property Code Section 92.012 gives certain tenants a way to direct important rental notices to a separate primary-residence address.", "The rule is most relevant when someone leases a dwelling but does not use that rental as the person's primary residence."],
    sections: [
      { heading: "The tenant must make a written request", paragraphs: ["At lease signing or renewal, the tenant must give the landlord written notice that the leased premises are not the tenant's primary residence, request mailing to the primary residence, and provide that address."] },
      { heading: "Which notices are covered", paragraphs: ["Section 92.012 covers notices of lease violations, lease termination, rental increases at the end of the lease term, and notices to vacate."] },
      { heading: "Address changes must also be written", paragraphs: ["The tenant must notify the landlord in writing of a change to the primary-residence address. The statute says oral notice of the change is insufficient."] },
      { heading: "Hand delivery can be different", paragraphs: ["The section does not apply when the notice is actually hand-delivered to and received by a person occupying the leased premises, as provided by the statute."] },
    ],
    faq: [
      { q: "Can a Texas tenant have important lease notices sent to another address?", a: "Section 92.012 provides that option when its written-request and primary-residence requirements are satisfied." },
      { q: "Which notices does the law cover?", a: "Lease violations, lease termination, end-of-term rental increases, and notices to vacate are included." },
      { q: "Can the tenant change the notice address orally?", a: "No. Section 92.012 requires written notice of a change in the primary-residence address." },
    ],
    sources: [{ label: "Texas Property Code § 92.012", url: "https://statutes.capitol.texas.gov/?artSec=92.012&chapter=PR.92&code=PR&tab=1" }],
    related: [{ label: "Texas Laws Explained", href: "/laws" }, { label: "Texas eviction notice law", href: "/guides/texas-eviction-notice-law" }, { label: "Texas lease copy law", href: "/guides/texas-right-to-copy-of-lease" }],
  },
};
