import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_MILITARY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-military-lease-termination": {
    slug: "texas-military-lease-termination",
    title: "Texas Military Lease Termination: Deployment, Transfer and Service Orders",
    dek: "Texas Property Code Section 92.017 explained for qualifying servicemembers and dependents, including documentation, notice, effective termination, prepaid rent, and nonwaiver rules.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.017 gives qualifying military tenants and certain dependents a statutory right to terminate a residential lease in specified service-order circumstances.",
      "The statute requires the tenant to provide the landlord with the qualifying orders or other documentation and written notice as specified by law.",
      "The effective termination date depends on the rent-payment structure and the timing of notice under Section 92.017.",
      "The statutory right may not be waived by the tenant.",
    ],
    intro: [
      "Texas provides a specific residential lease-termination statute for qualifying military service circumstances. Section 92.017 works alongside federal servicemember protections and should be read directly when deployment or a permanent change of station affects a tenancy.",
      "Because the statute uses defined service circumstances, documentation, and timing rules, a military move should not be analyzed as an ordinary voluntary early move-out.",
    ],
    sections: [
      { heading: "Who the Texas statute protects", paragraphs: ["Section 92.017 applies when the tenant or the tenant's dependent satisfies the statutory military-service conditions. The exact service status and orders matter, so the definitions and qualifying events in the current statute should be checked."] },
      { heading: "Orders and written notice", paragraphs: ["The termination procedure requires delivery of the documentation and written notice specified by Section 92.017. Keeping copies of the documents and proof of delivery helps establish the termination timeline."] },
      { heading: "When termination becomes effective", paragraphs: ["The statute sets an effective date based on the rental-payment arrangement and notice timing. It also requires refund of qualifying rent or other amounts paid in advance for periods after the effective termination date."] },
      { heading: "The right cannot be waived", paragraphs: ["Section 92.017 protects the statutory termination right from waiver. Existing delinquent amounts and other obligations that arose before termination can still require separate analysis under the statute and lease."] },
    ],
    faq: [
      { q: "Can military orders allow a Texas tenant to end a lease early?", a: "Yes, when the requirements of Property Code Section 92.017 are satisfied." },
      { q: "Does the tenant need to provide documentation?", a: "Yes. Section 92.017 specifies the orders or other documentation and written notice required for the statutory termination process." },
      { q: "Can a lease waive this Texas military termination right?", a: "No. Section 92.017 states that the tenant's right under the section may not be waived." },
    ],
    sources: [
      { label: "Texas Property Code § 92.017", url: "https://statutes.capitol.texas.gov/?artSec=92.017&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 92", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Breaking a Texas lease", href: "/guides/texas-breaking-lease-law" },
      { label: "Texas month-to-month termination", href: "/guides/texas-month-to-month-lease-termination" },
    ],
  },
};
