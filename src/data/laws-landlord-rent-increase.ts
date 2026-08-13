import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_RENT_INCREASE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rent-increase-law": {
    slug: "texas-rent-increase-law",
    title: "Texas Rent Increase Law: When a Landlord Can Raise the Rent",
    dek: "Texas rent-increase rules explained, including fixed-term leases, renewals, retaliation limits, and the state's narrow rent-control statute.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas has no general statewide cap on the amount a residential landlord may charge when a lease term ends and a new rental term is offered.",
      "A landlord generally cannot change the rent during a fixed lease term unless the lease permits the change or the parties agree to amend the lease.",
      "Property Code Section 92.331 prohibits certain retaliatory rent increases for six months after protected tenant activity, subject to statutory exceptions.",
      "Texas Local Government Code Section 214.902 allows local rent-control measures only in a narrow disaster-related housing emergency and with gubernatorial approval.",
    ],
    intro: [
      "Texas does not have a general statewide rent-control cap. At renewal, a landlord can generally offer a new rental rate, while the tenant can accept, negotiate, or move when the existing term ends.",
      "During a fixed lease term, the written lease controls. A rent change not authorized by the lease generally requires agreement of the parties. Retaliation law can also restrict an increase imposed because of protected tenant activity.",
    ],
    sections: [
      { heading: "No general statewide rent cap", paragraphs: ["Texas law does not set a general percentage ceiling on residential rent increases at the end of a lease term. The amount offered for a renewal is generally a matter of contract, subject to other applicable laws." ] },
      { heading: "A fixed-term lease still controls", paragraphs: ["A landlord generally cannot simply rewrite the rent during an existing fixed lease unless the lease itself authorizes the change or both sides agree to modify the contract." ] },
      { heading: "Retaliatory increases are different", paragraphs: ["Section 92.331 prohibits specified retaliatory conduct, including certain rent increases within six months after protected tenant actions such as good-faith repair requests, code complaints, or tenant-organization activity. Section 92.332 lists exceptions and valid grounds." ] },
      { heading: "Local rent control is narrowly limited", paragraphs: ["Local Government Code Section 214.902 allows a municipality to adopt rent control only to address a housing emergency caused by a disaster, and the ordinance requires approval by the governor." ] },
    ],
    faq: [
      { q: "Is there a statewide cap on Texas rent increases?", a: "No general statewide percentage cap applies when a lease term ends and a new term is offered." },
      { q: "Can rent be raised in the middle of a fixed lease?", a: "Usually only if the lease authorizes the change or the parties agree to amend the lease." },
      { q: "Can a landlord raise rent because a tenant requested repairs?", a: "Section 92.331 can prohibit a retaliatory rent increase after protected tenant activity, subject to Section 92.332." },
    ],
    sources: [
      { label: "Texas Property Code § 92.331", url: "https://statutes.capitol.texas.gov/?artSec=92.331&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.332", url: "https://statutes.capitol.texas.gov/?artSec=92.332&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas State Law Library — Rent increases", url: "https://sll.texas.gov/faqs/rent-increase/" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas rent late-fee law", href: "/guides/texas-rent-late-fee-law" },
      { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" },
    ],
  },
};
