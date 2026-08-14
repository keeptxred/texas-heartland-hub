import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const HOA_WATER_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hoa-rainwater-harvesting-law": {
    slug: "texas-hoa-rainwater-harvesting-law",
    title: "Texas HOA Rainwater Harvesting Law: What Associations Can and Cannot Restrict",
    dek: "Texas Property Code Section 202.007 explained for homeowners installing rain barrels or rainwater harvesting systems in HOA communities.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Property Code Section 202.007 generally prevents a property owners' association from prohibiting or restricting a homeowner from installing rain barrels or a rainwater harvesting system.",
      "The statute does not eliminate every HOA design rule; associations may regulate matters such as size, type, shielding, materials, and some visible locations if the rule does not prohibit economic installation.",
      "The statute contains location and appearance exceptions, including rules for common property and certain areas between the front of a home and an adjoining street.",
      "A homeowner should compare the proposed installation with both Section 202.007 and the association's current architectural requirements before work begins.",
    ],
    intro: [
      "Texas law gives homeowners meaningful protection for residential rainwater collection, but the protection is not a blanket exemption from HOA architectural standards.",
      "Section 202.007 makes a prohibition on rain barrels or rainwater harvesting systems void while preserving specified association authority over placement and appearance.",
    ],
    sections: [
      { heading: "The HOA cannot simply ban rainwater harvesting", paragraphs: ["Section 202.007(a) says a property owners' association may not include or enforce a dedicatory-instrument provision that prohibits or restricts installing rain barrels or a rainwater harvesting system. A conflicting provision is void under subsection (b)."] },
      { heading: "Location still matters", paragraphs: ["The statute does not require an HOA to permit a system on association-owned or commonly owned property, and it preserves restrictions for certain locations between the front of the home and an adjoining street."] },
      { heading: "Appearance rules can still apply", paragraphs: ["Section 202.007 permits reasonable regulation of matters such as size, type, shielding, construction materials, and some visible installations, so long as the restriction does not prohibit economic installation on the owner's property where sufficient area exists."] },
      { heading: "Use the statute and the architectural rules together", paragraphs: ["Before installation, homeowners should identify the proposed location, whether it is visible from a street or common area, and any architectural-review requirements. The HOA may regulate within the statute's limits but may not turn those rules into an effective prohibition."] },
    ],
    faq: [
      { q: "Can a Texas HOA ban rain barrels?", a: "Generally no. Property Code Section 202.007 prohibits an HOA from adopting or enforcing a provision that prohibits or restricts installation of rain barrels or a rainwater harvesting system, subject to the statute's exceptions." },
      { q: "Can an HOA regulate the color or shielding of a rain barrel?", a: "Yes, Section 202.007 preserves specified authority to regulate appearance and visible installations, provided the rule does not prohibit economic installation where sufficient area exists." },
      { q: "Can I put a rain barrel anywhere I want?", a: "Not necessarily. The statute contains exceptions involving common property, some front-yard locations, visibility, and design requirements." },
    ],
    sources: [
      { label: "Texas Property Code § 202.007", url: "https://statutes.capitol.texas.gov/?artSec=202.007&chapter=PR.202&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" },
      { label: "Texas HOA drought-resistant landscaping", href: "/guides/texas-hoa-drought-resistant-landscaping-law" },
      { label: "Texas HOA efficient irrigation", href: "/guides/texas-hoa-efficient-irrigation-law" },
    ],
  },

  "texas-hoa-drought-resistant-landscaping-law": {
    slug: "texas-hoa-drought-resistant-landscaping-law",
    title: "Texas HOA Drought-Resistant Landscaping Law: Xeriscaping and Water-Conserving Turf",
    dek: "How Texas Property Code Section 202.007 limits HOA restrictions on drought-resistant landscaping and water-conserving natural turf.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 202.007 generally prevents a Texas property owners' association from prohibiting or restricting drought-resistant landscaping or water-conserving natural turf.",
      "An HOA may still regulate landscaping through reasonable rules that are consistent with the statute rather than using those rules to create an effective ban.",
      "The statute expressly allows an association to restrict the type of newly planted turf in order to encourage or require water-conserving turf.",
      "Homeowners should distinguish protected water-conservation choices from separate rules governing maintenance, drainage, easements, visibility, or municipal requirements.",
    ],
    intro: [
      "Texas law limits deed restrictions that undermine residential water conservation. That protection includes drought-resistant landscaping and water-conserving natural turf.",
      "The practical effect is that an HOA may regulate landscaping details, but it cannot use its rules to prohibit the protected water-conserving choices identified by Section 202.007.",
    ],
    sections: [
      { heading: "Drought-resistant landscaping is protected", paragraphs: ["Section 202.007(a)(4) prohibits an HOA from including or enforcing a dedicatory-instrument provision that prohibits or restricts the use of drought-resistant landscaping or water-conserving natural turf."] },
      { heading: "A conflicting prohibition is void", paragraphs: ["Subsection (b) states that a provision violating the statute is void. An older recorded restriction does not become enforceable merely because it predates the homeowner's landscaping project."] },
      { heading: "The HOA may regulate new turf choices", paragraphs: ["Section 202.007(c) allows an association to restrict the type of turf used when new turf is planted in order to encourage or require water-conserving turf."] },
      { heading: "Other property rules can still matter", paragraphs: ["Protection for drought-resistant landscaping does not erase independent rules involving drainage, easements, public rights-of-way, maintenance, or local code compliance. Those issues should be evaluated separately from an HOA's attempt to ban water-conserving landscaping itself."] },
    ],
    faq: [
      { q: "Can a Texas HOA ban xeriscaping?", a: "An HOA generally may not prohibit or restrict drought-resistant landscaping covered by Property Code Section 202.007, though lawful design and maintenance rules may still apply." },
      { q: "Can an HOA require a water-conserving turf type?", a: "Yes. Section 202.007 expressly allows an association to restrict the type of newly planted turf to encourage or require water-conserving turf." },
      { q: "Does this law override city drainage or landscaping rules?", a: "No. The statute limits restrictive covenants and HOA enforcement; separate governmental requirements may still apply." },
    ],
    sources: [
      { label: "Texas Property Code § 202.007", url: "https://statutes.capitol.texas.gov/?artSec=202.007&chapter=PR.202&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas HOA rainwater harvesting", href: "/guides/texas-hoa-rainwater-harvesting-law" },
      { label: "Texas HOA efficient irrigation", href: "/guides/texas-hoa-efficient-irrigation-law" },
      { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" },
    ],
  },
};
