import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_DISCLOSURE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-landlord-owner-management-disclosure-law": {
    slug: "texas-landlord-owner-management-disclosure-law",
    title: "Texas Landlord Ownership and Management Disclosure Law",
    dek: "How Texas tenants can obtain the name and address of the rental property's record owner and off-site management company under Property Code Chapter 92.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.201 requires disclosure of the record titleholder's name and address and, when applicable, the off-site management company's name and street address.",
      "A tenant can request the information, and Section 92.201 generally requires written disclosure on or before the seventh day after the landlord receives the request.",
      "The statute also allows the information to be supplied through specified lease or posted-notice methods.",
      "Sections 92.202 through 92.205 address liability and remedies when required ownership or management information is not properly disclosed.",
    ],
    intro: [
      "Texas tenants have a statutory way to identify who owns and manages the dwelling they rent. Property Code Subchapter E requires disclosure of ownership and management information and creates a request-and-remedy process.",
      "This can matter when a tenant needs to send formal notice, identify the responsible owner, resolve management confusion, or determine who should receive legal communications.",
    ],
    sections: [
      { heading: "What information must be disclosed", paragraphs: ["Section 92.201 requires the landlord to disclose the name and either a street or post-office-box address of the record titleholder. If an off-site entity is primarily responsible for management, the landlord must also disclose that management company's name and street address." ] },
      { heading: "A tenant may request the information", paragraphs: ["When a tenant requests the information, Section 92.201 generally requires the landlord to provide it in writing on or before the seventh day after receiving the request." ] },
      { heading: "The law recognizes other disclosure methods", paragraphs: ["Section 92.201 also allows ownership and management information to be disclosed through methods described in the statute, including lease and posted-notice mechanisms in appropriate circumstances." ] },
      { heading: "Failure to disclose can create remedies", paragraphs: ["Sections 92.202 through 92.205 establish the notice process, bad-faith rules, liability, and remedies associated with failure to provide required information." ] },
    ],
    faq: [
      { q: "Can a Texas tenant ask who legally owns the rental property?", a: "Yes. Section 92.201 provides a statutory right to request specified ownership and management information." },
      { q: "How long does the landlord generally have to answer a tenant request?", a: "Section 92.201 generally uses a seven-day period after the landlord receives the request." },
      { q: "Does the law cover the management company too?", a: "Yes, when an off-site entity is primarily responsible for managing the dwelling, Section 92.201 requires specified management-company information." },
    ],
    sources: [
      { label: "Texas Property Code § 92.201", url: "https://statutes.capitol.texas.gov/?artSec=92.201&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.202", url: "https://statutes.capitol.texas.gov/?artSec=92.202&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.205", url: "https://statutes.capitol.texas.gov/?artSec=92.205&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas right to a copy of the lease", href: "/guides/texas-right-to-copy-of-lease" },
      { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" },
    ],
  },
};
