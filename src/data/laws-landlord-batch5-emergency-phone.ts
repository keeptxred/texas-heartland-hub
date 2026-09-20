import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_BATCH5_EMERGENCY_PHONE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-landlord-emergency-phone-law": {
    slug: "texas-landlord-emergency-phone-law",
    title: "Texas Landlord Emergency Phone Number Law: 24-Hour Contacts for Rental Conditions",
    dek: "Property Code Section 92.020 explained, including 24-hour emergency phone requirements for properties with on-site management and the contact-number rule for other landlords.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.020 requires a landlord with an on-site management or superintendent's office to provide tenants a telephone number answered 24 hours a day for reporting qualifying rental-condition emergencies.",
      "That 24-hour number must be posted prominently outside the on-site management or superintendent's office.",
      "A landlord to whom the on-site-office requirement does not apply must still provide tenants a telephone number for reporting the emergencies described by the statute.",
      "The statutory contact requirement concerns emergencies related to a condition of the leased premises that materially affects the physical health or safety of an ordinary tenant.",
    ],
    intro: ["Texas Property Code Section 92.020 gives residential tenants a direct contact path for serious premises-condition emergencies. The exact requirement depends on whether the rental property has an on-site management or superintendent's office.", "This emergency-contact statute works alongside the broader repair provisions in Chapter 92; reporting an emergency and enforcing a repair remedy can involve separate statutory requirements."],
    sections: [
      { heading: "Properties with an on-site management office", paragraphs: ["A landlord with an on-site management or superintendent's office must provide a telephone number answered 24 hours a day for reporting the qualifying emergencies described by Section 92.020."] },
      { heading: "The number must be posted", paragraphs: ["The landlord must post the required 24-hour phone number prominently outside the management or superintendent's office."] },
      { heading: "Other landlords still need a contact number", paragraphs: ["When the on-site-office requirement does not apply, Section 92.020 still requires the landlord to provide the tenant a telephone number for reporting the same category of emergency conditions." ] },
      { heading: "What counts as the statutory emergency category", paragraphs: ["The statute focuses on emergencies related to a condition of the leased premises that materially affects the physical health or safety of an ordinary tenant. Chapter 92's separate repair provisions govern additional notice and remedy questions." ] },
    ],
    faq: [
      { q: "Must a Texas apartment complex have a 24-hour emergency number?", a: "When the landlord has an on-site management or superintendent's office, Section 92.020 requires a number answered 24 hours a day for the qualifying premises-condition emergencies described by the statute." },
      { q: "Where should the emergency number be posted?", a: "For a property with the qualifying on-site office, Section 92.020 requires the number to be posted prominently outside that office." },
      { q: "What if there is no on-site management office?", a: "The statute still requires the landlord to provide tenants a telephone number for reporting the qualifying emergency conditions." },
    ],
    sources: [
      { label: "Texas Property Code § 92.020", url: "https://statutes.capitol.texas.gov/?artSec=92.020&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Property Code § 92.052 — Landlord Duty to Repair", url: "https://statutes.capitol.texas.gov/?artSec=92.052&chapter=PR.92&code=PR&tab=1" },
    ],
    related: [{ label: "Texas Landlord & Tenant Laws", href: "/laws" }, { label: "Texas landlord repair law", href: "/guides/texas-landlord-repair-law" }, { label: "Tenant right to call emergency assistance", href: "/guides/texas-tenant-emergency-assistance-law" }],
  },
};
