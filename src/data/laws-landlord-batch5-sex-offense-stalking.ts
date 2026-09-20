import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_BATCH5_SEX_OFFENSE_STALKING_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-sex-offense-stalking-lease-termination-law": {
    slug: "texas-sex-offense-stalking-lease-termination-law",
    title: "Texas Lease Termination After Certain Sex Offenses or Stalking: 2025 Update",
    dek: "Property Code Section 92.0161 explained, including qualifying circumstances, documentation, notice, confidentiality, and the September 2025 HB 47 change.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Property Code Section 92.0161 gives qualifying tenants a right to terminate a residential lease early after specified sex offenses or stalking when the statutory requirements are met.",
      "House Bill 47, effective September 1, 2025, removed the former requirement in subsection (c) that specified qualifying offenses occur on the rental premises or at another dwelling on the premises.",
      "The statute has separate documentation pathways for specified sex offenses and for stalking, so the two categories should not be treated as identical.",
      "Section 92.0161 includes confidentiality protections for information received under its documentation provisions and makes the statutory termination right nonwaivable.",
    ],
    intro: [
      "Texas Property Code Section 92.0161 provides an early-termination right for tenants affected by specified sex offenses or stalking. The law is document-specific and uses separate statutory pathways depending on the qualifying circumstance.",
      "The 89th Legislature changed subsection (c) through House Bill 47. Effective September 1, 2025, the old premises-location language was removed for the listed offenses, so older summaries that still require the event to have occurred at the rental property are stale on that point.",
    ],
    sections: [
      { heading: "The statute covers specified circumstances", paragraphs: ["Section 92.0161 identifies the offenses and stalking circumstances that can support early termination. A tenant should match the facts and documentation to the current statutory category rather than assume every crime or safety concern uses the same procedure." ] },
      { heading: "HB 47 changed the location rule", paragraphs: ["HB 47 deleted the former language in subsection (c) tying the listed offenses to the premises or another dwelling on the premises. The preceding-six-month period and the statute's documentation requirements remain important. The amendment took effect September 1, 2025." ] },
      { heading: "Stalking has a separate pathway", paragraphs: ["Section 92.0161 contains a separate documentation provision for stalking. The 2025 amendment to subsection (c) should not be assumed to rewrite every separate stalking requirement." ] },
      { heading: "Notice, vacating and confidentiality", paragraphs: ["A tenant must follow the applicable documentation and termination procedure and vacate as required. Information received under the section is subject to statutory confidentiality limits, with the exceptions provided by law." ] },
    ],
    faq: [
      { q: "Does a qualifying offense still have to occur at the Texas rental property?", a: "For the specified offenses governed by Section 92.0161(c), HB 47 removed the former premises-location requirement effective September 1, 2025. Other statutory requirements still apply." },
      { q: "Are the stalking and sex-offense procedures identical?", a: "No. Section 92.0161 contains separate documentation provisions, so the correct pathway depends on the qualifying circumstance." },
      { q: "Can this early-termination right be waived in a lease?", a: "No. Section 92.0161 provides a nonwaivable statutory termination right when its requirements are satisfied." },
    ],
    sources: [
      { label: "Texas Property Code § 92.0161", url: "https://statutes.capitol.texas.gov/?artSec=92.0161&chapter=PR.92&code=PR&tab=1" },
      { label: "Texas Legislature — HB 47 enrolled text (89R)", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00047F.htm" },
    ],
    related: [
      { label: "Texas Landlord & Tenant Laws", href: "/laws" },
      { label: "Family-violence lease termination", href: "/guides/texas-family-violence-lease-termination-law" },
      { label: "Breaking a Texas lease", href: "/guides/texas-breaking-lease-law" },
    ],
  },
};
