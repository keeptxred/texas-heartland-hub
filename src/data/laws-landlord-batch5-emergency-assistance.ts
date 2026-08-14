import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_BATCH5_EMERGENCY_ASSISTANCE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-tenant-emergency-assistance-law": {
    slug: "texas-tenant-emergency-assistance-law",
    title: "Texas Tenant Right to Call Police or Emergency Assistance",
    dek: "Property Code Section 92.015 explained: a landlord generally cannot prohibit or penalize a residential tenant for summoning police or emergency assistance based on a reasonable belief that help is needed.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.015 says a landlord may not prohibit or limit a residential tenant's right to summon police or other emergency assistance based on a reasonable belief that someone needs intervention or emergency help.",
      "The statute also prohibits monetary or other penalties when assistance was requested or dispatched based on that reasonable belief.",
      "A lease provision that attempts to waive the tenant's right or exempt a party from liability or duty under the section is void.",
      "The statute provides civil remedies for a landlord violation, including specified statutory and actual damages, court costs, injunctive relief, and reasonable attorney's fees when applicable.",
    ],
    intro: ["Texas residential tenants have a statutory right to seek emergency help without a landlord turning the call itself into a lease penalty. Section 92.015 protects calls made on a reasonable belief that intervention or emergency assistance is needed.", "The law focuses on the tenant's right to summon help; it does not excuse unrelated lease violations or decide every dispute that may surround an emergency response."],
    sections: [
      { heading: "A landlord cannot prohibit the emergency call", paragraphs: ["Section 92.015 bars a landlord from prohibiting or limiting a residential tenant's right to summon police or other emergency assistance when the request is based on a reasonable belief that an individual needs intervention or emergency help."] },
      { heading: "Penalizing the tenant for the call is also restricted", paragraphs: ["The statute prohibits monetary or other penalties when assistance was requested or dispatched based on the tenant's reasonable belief that help was needed."] },
      { heading: "A lease cannot waive the statutory protection", paragraphs: ["A lease provision is void if it purports to waive the tenant's protected right to summon assistance or exempt a party from a liability or duty imposed by Section 92.015."] },
      { heading: "The law provides remedies", paragraphs: ["Section 92.015 identifies remedies for violations, including statutory and actual damages, court costs, injunctive relief, and reasonable attorney's fees in qualifying actions."] },
    ],
    faq: [
      { q: "Can a Texas landlord ban tenants from calling police?", a: "Section 92.015 prohibits a landlord from limiting a residential tenant's right to summon police or emergency assistance based on a reasonable belief that help is needed." },
      { q: "Can a landlord fine me just because I called for emergency help?", a: "The statute prohibits monetary or other penalties when the assistance was requested or dispatched based on the protected reasonable belief." },
      { q: "Can the lease waive this protection?", a: "No. Section 92.015 makes a lease provision void if it purports to waive the protected right or exempt a party from the section's liability or duty." },
    ],
    sources: [{ label: "Texas Property Code § 92.015", url: "https://statutes.capitol.texas.gov/?artSec=92.015&chapter=PR.92&code=PR&tab=1" }],
    related: [{ label: "Texas Landlord & Tenant Laws", href: "/laws" }, { label: "Family-violence lease termination", href: "/guides/texas-family-violence-lease-termination-law" }, { label: "Texas landlord retaliation law", href: "/guides/texas-landlord-retaliation-law" }],
  },
};
