import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_MONTH_TO_MONTH_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-month-to-month-lease-termination": {
    slug: "texas-month-to-month-lease-termination",
    title: "Texas Month-to-Month Lease Termination: Notice Rules and Timing",
    dek: "Texas month-to-month tenancy termination explained, including Property Code Section 91.001, lease-controlled notice terms, and how the statutory default works.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 91.001 supplies a default termination rule for certain tenancies when the lease does not provide a different termination period.",
      "A written lease may establish its own lawful notice requirement, so the lease should be checked before relying on the statutory default.",
      "Termination of a month-to-month tenancy ends the rental relationship prospectively; it does not erase rent or other obligations already accrued.",
      "Special statutory termination rights can override ordinary lease timing in qualifying situations such as family violence or military orders.",
    ],
    intro: [
      "Texas does not use a single notice rule for every rental arrangement. Property Code Section 91.001 provides a default framework for terminating certain periodic tenancies, but a lease can specify a different lawful notice period.",
      "Month-to-month renters and landlords should therefore begin with the lease, then apply the statute if the agreement does not resolve the timing question.",
    ],
    sections: [
      { heading: "Start with the lease", paragraphs: ["Section 91.001 operates as a statutory default. If the lease contains a valid termination provision, that provision can control instead of the default period described by the statute."] },
      { heading: "The statutory default", paragraphs: ["For a tenancy in which rent is payable in monthly or shorter periods, Section 91.001 describes when termination becomes effective after notice. The exact calculation depends on the rental-payment period and timing of notice."] },
      { heading: "Termination does not erase existing debt", paragraphs: ["Ending a periodic tenancy generally affects future possession and rent obligations. Amounts already due, property damage, deposit accounting, and other existing claims are separate issues governed by the lease and applicable law."] },
      { heading: "Special termination statutes can apply", paragraphs: ["Chapter 92 contains special early-termination rights for qualifying family violence, certain sex offenses or stalking, military service, and other circumstances. Those statutes should be reviewed separately when applicable."] },
    ],
    faq: [
      { q: "How much notice is required to end a month-to-month lease in Texas?", a: "Check the lease first. If it does not provide a different lawful period, Section 91.001 supplies the statutory default based on the rental-payment period and notice timing." },
      { q: "Does Texas require every month-to-month notice to be 30 days?", a: "Not as a universal statement. Section 91.001 uses a timing formula and the lease can provide a different lawful termination period." },
      { q: "Can special circumstances allow earlier termination?", a: "Yes. Chapter 92 contains separate statutory rights for certain qualifying situations, including family violence and military service." },
    ],
    sources: [
      { label: "Texas Property Code § 91.001", url: "https://statutes.capitol.texas.gov/?artSec=91.001&chapter=PR.91&code=PR&tab=1" },
      { label: "Texas Property Code Chapter 91", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.91.htm" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Breaking a Texas lease", href: "/guides/texas-breaking-lease-law" },
      { label: "Texas security deposit law", href: "/guides/texas-security-deposit-law" },
    ],
  },
};
