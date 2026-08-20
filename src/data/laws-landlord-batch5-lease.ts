import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const related = [{ label: "Texas Landlord & Tenant Laws", href: "/laws" }];

export const LANDLORD_BATCH5_LEASE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-breaking-lease-law": {
    slug: "texas-breaking-lease-law",
    title: "Breaking a Lease in Texas: Early Termination, Rent Liability and Mitigation",
    dek: "What happens when a Texas tenant leaves before a fixed lease ends, including statutory termination rights, the landlord's duty to mitigate damages, and why there is no general three-day cancellation rule.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not give residential tenants a general three-day right to cancel a signed lease.",
      "A tenant who leaves early without a lease-based or statutory termination right can remain liable under the lease, subject to the landlord's duty to mitigate damages under Property Code Section 91.006.",
      "Texas law creates specific early-termination rights in situations including family violence, certain sex offenses or stalking, qualifying military service, a sole tenant's death, and specified landlord violations.",
      "The lease may also contain an early-termination, reletting, buyout, or notice provision that affects the parties' obligations.",
    ],
    intro: [
      "A Texas lease is generally binding once signed. Moving out early does not by itself erase rent obligations, but the result depends on the lease and on whether a specific Texas statute gives the tenant a right to terminate early.",
      "Property Code Section 91.006 is especially important when there is no special termination right: a landlord has a duty to mitigate damages if a tenant abandons the leased premises in violation of the lease, and a lease provision purporting to waive that duty is void.",
    ],
    sections: [
      { heading: "There is no general three-day lease cancellation rule", paragraphs: ["Texas law does not create a general buyer's-remorse period for residential leases. A tenant should review the signed lease and any applicable statutory termination right before assuming the agreement can simply be canceled."] },
      { heading: "The landlord must mitigate damages", paragraphs: ["Section 91.006 requires a landlord to mitigate damages when a tenant abandons the premises in violation of the lease. Mitigation reduces avoidable damages; it does not automatically eliminate every amount the tenant may owe."] },
      { heading: "Special statutory termination rights", bullets: ["Family violence under Property Code Section 92.016 when the statutory requirements are met.", "Certain sex offenses or stalking under Section 92.0161.", "Qualifying military service under Section 92.017.", "Death of a sole occupant under Section 92.0162 through the estate representative.", "Specified landlord failures involving repairs, smoke alarms, disclosures, or other statutory duties when the applicable remedy requirements are satisfied."] },
      { heading: "Read the lease before choosing a path", paragraphs: ["The lease can contain notice deadlines, reletting provisions, buyout terms, renewal language, and move-out procedures. Those contract terms operate alongside nonwaivable statutory rights, so a tenant should not rely on a generic early-move-out checklist." ] },
    ],
    faq: [
      { q: "Can I cancel a Texas apartment lease within three days of signing?", a: "Texas does not provide a general three-day cancellation period for residential leases. A specific lease clause or statutory termination right may apply in a particular situation." },
      { q: "Do I owe all remaining rent if I move out early?", a: "Not necessarily. Liability depends on the lease, any statutory termination right, and the landlord's duty to mitigate damages under Section 91.006." },
      { q: "Can a lease waive the landlord's duty to mitigate?", a: "No. Section 91.006 says a lease provision that purports to waive the landlord's duty to mitigate damages is void." },
    ],
    sources: [
      { label: "Texas Property Code § 91.006", url: "https://statutes.capitol.texas.gov/?artSec=91.006&chapter=PR.91&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 92 — statutory termination rights", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm" },
      { label: "Texas State Law Library — Ending the Lease", url: "https://guides.sll.texas.gov/landlord-tenant-law/ending-the-lease" },
    ],
    related: [...related, { label: "Family-violence lease termination", href: "/guides/texas-family-violence-lease-termination-law" }, { label: "Military lease termination", href: "/guides/texas-military-lease-termination-law" }, { label: "Texas subletting law", href: "/guides/texas-subletting-law" }],
  },

  "texas-lease-renewal-law": {
    slug: "texas-lease-renewal-law",
    title: "Texas Lease Renewal Law: Notice, New Terms and Month-to-Month Holdovers",
    dek: "How residential lease renewals work in Texas, including fixed-term notice clauses, month-to-month rules, rent or term changes at renewal, and guarantor liability.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not set one universal advance-notice period for ending or declining renewal of every fixed-term residential lease; the written lease often controls.",
      "If a tenancy becomes month-to-month, Property Code Section 91.001 supplies the statutory termination framework unless the parties have agreed otherwise as allowed by the section.",
      "A landlord may propose different rent or lease terms for a new lease period, subject to the existing lease and other laws such as anti-retaliation and fair-housing protections.",
      "Property Code Section 92.021 limits a non-tenant guarantor's liability on lease renewal unless the statutory written conditions are satisfied or the guarantor separately agrees at renewal.",
    ],
    intro: [
      "Texas lease renewal questions are largely contract-driven. A fixed-term lease may contain automatic-renewal language, a move-out notice deadline, or a conversion to month-to-month status, so the starting point is the signed agreement.",
      "State statutes still matter around the edges. Section 91.001 governs periodic tenancies, and Section 92.021 places specific limits on when a guarantor remains liable after renewal.",
    ],
    sections: [
      { heading: "Fixed-term notice usually starts with the lease", paragraphs: ["For a written lease that is not month-to-month, Texas law does not prescribe one universal notice period for every tenant who plans to leave at the end of the term. The lease's renewal and move-out provisions can therefore be decisive." ] },
      { heading: "Month-to-month tenancies have a statutory framework", paragraphs: ["Section 91.001 provides the termination rule for certain monthly and shorter periodic tenancies. The statute also permits the parties to agree in writing to a different notice period." ] },
      { heading: "New term, new proposed terms", paragraphs: ["When the existing lease term ends, a renewal can involve a new rent amount or other changed terms. Mid-term changes are different: an existing lease generally remains the governing contract unless the parties validly amend it or another law authorizes the change." ] },
      { heading: "Guarantors do not automatically roll forward forever", paragraphs: ["Section 92.021 generally limits a guarantor to the original lease term unless the required written renewal-guarantee conditions are satisfied. A guarantor can also voluntarily enter a separate written agreement at renewal." ] },
    ],
    faq: [
      { q: "How much notice must I give before a Texas fixed-term lease ends?", a: "There is no single Texas statutory notice period for every fixed-term residential lease. Check the lease's move-out and renewal clauses." },
      { q: "What if my lease becomes month-to-month?", a: "Property Code Section 91.001 supplies the default termination framework for qualifying periodic tenancies unless a valid written agreement provides different terms." },
      { q: "Is a guarantor automatically liable after renewal?", a: "No. Section 92.021 limits renewal liability unless its written conditions are satisfied or the guarantor separately agrees to the renewed obligation." },
    ],
    sources: [
      { label: "Texas Property Code § 91.001", url: "https://statutes.capitol.texas.gov/?artSec=91.001&chapter=PR.91&code=PR&tab=1" },
      { label: "Texas Property Code § 92.021", url: "https://statutes.capitol.texas.gov/?artSec=92.021&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas State Law Library — Ending the Lease", url: "https://guides.sll.texas.gov/landlord-tenant-law/ending-the-lease" },
    ],
    related: [...related, { label: "Month-to-month lease law", href: "/guides/texas-month-to-month-lease-law" }, { label: "Texas rent increase law", href: "/guides/texas-rent-increase-law" }, { label: "Breaking a Texas lease", href: "/guides/texas-breaking-lease-law" }],
  },
};
