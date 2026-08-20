import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const HOA_CONSERVATION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hoa-composting-law": {
    slug: "texas-hoa-composting-law",
    title: "Texas HOA Composting Law: Yard Waste, Grass Clippings and Association Rules",
    dek: "Texas Property Code Section 202.007 explained for homeowners who compost vegetation or leave grass clippings on the lawn in an HOA community.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 202.007 generally bars a Texas property owners' association from prohibiting or restricting measures that promote solid-waste composting of vegetation.",
      "The statutory protection expressly includes grass clippings, leaves, brush, and leaving grass clippings uncollected on grass.",
      "The HOA may still regulate the size, type, shielding, materials, and location of a composting device if the rules do not prohibit economic installation where there is reasonably sufficient area.",
      "Separate nuisance, sanitation, local-code, and maintenance requirements may still apply even when the composting activity itself is protected from an HOA ban.",
    ],
    intro: [
      "Texas law treats residential vegetation composting as a protected conservation activity for purposes of restrictive covenants.",
      "That protection does not mean an HOA loses all authority over where a composting device sits or how it is screened; Section 202.007 draws the line between regulation and prohibition.",
    ],
    sections: [
      { heading: "What the HOA may not prohibit", paragraphs: ["Section 202.007(a)(1) prohibits an association from adopting or enforcing a dedicatory-instrument provision that prohibits or restricts measures promoting solid-waste composting of vegetation, including grass clippings, leaves, or brush, or leaving grass clippings uncollected on grass."] },
      { heading: "Composting-device rules are still possible", paragraphs: ["The statute permits an HOA to regulate requirements such as size, type, shielding, materials, and location of a composting device if the restriction does not prohibit economic installation on property with reasonably sufficient space."] },
      { heading: "Protected does not mean unregulated by everyone", paragraphs: ["Section 202.007 limits restrictive covenants and HOA enforcement. It does not eliminate applicable municipal, county, sanitation, nuisance, or health-and-safety rules."] },
      { heading: "Document the actual HOA rule", paragraphs: ["When a dispute arises, homeowners should identify whether the association is imposing a design condition authorized by the statute or attempting to ban the protected activity. The text of the governing rule and the practical effect of the rule both matter."] },
    ],
    faq: [
      { q: "Can a Texas HOA ban composting yard waste?", a: "Generally no. Section 202.007 protects measures promoting composting of vegetation, including grass clippings, leaves, and brush." },
      { q: "Can the HOA require a compost bin to be screened?", a: "Potentially yes. The statute preserves reasonable regulation of size, type, shielding, materials, and location if the restriction does not prohibit economic installation." },
      { q: "Can I leave grass clippings on my lawn?", a: "Section 202.007 expressly includes leaving grass clippings uncollected on grass among the protected conservation measures, subject to other applicable laws." },
    ],
    sources: [
      { label: "Texas Property Code § 202.007", url: "https://statutes.capitol.texas.gov/?artSec=202.007&chapter=PR.202&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas HOA drought-resistant landscaping", href: "/guides/texas-hoa-drought-resistant-landscaping-law" },
      { label: "Texas HOA efficient irrigation", href: "/guides/texas-hoa-efficient-irrigation-law" },
      { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" },
    ],
  },

  "texas-hoa-efficient-irrigation-law": {
    slug: "texas-hoa-efficient-irrigation-law",
    title: "Texas HOA Efficient Irrigation Law: Drip Systems and Water-Conservation Rules",
    dek: "How Texas Property Code Section 202.007 protects efficient irrigation systems, including underground drip and other drip systems, from HOA bans.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 202.007 generally prevents an HOA from prohibiting or restricting efficient irrigation systems.",
      "The statute specifically identifies underground drip and other drip systems as protected examples.",
      "HOA rules may still address legitimate installation details if they do not amount to a prohibition or unlawful restriction on the protected system.",
      "Utility, plumbing, backflow, drainage, easement, and local-code requirements remain separate from the HOA restrictive-covenant protection.",
    ],
    intro: [
      "Water-efficient irrigation is one of the conservation measures Texas law protects against restrictive-covenant bans.",
      "For homeowners, the key distinction is between a rule that reasonably coordinates an installation and a rule that prevents the efficient irrigation system Section 202.007 protects.",
    ],
    sections: [
      { heading: "Efficient irrigation is expressly protected", paragraphs: ["Section 202.007(a)(3) prohibits an association from including or enforcing a dedicatory-instrument provision that prohibits or restricts efficient irrigation systems, expressly including underground drip or other drip systems."] },
      { heading: "A conflicting covenant is void", paragraphs: ["Under Section 202.007(b), a dedicatory-instrument provision violating the statutory prohibition is void. Recorded age alone does not save a restriction that conflicts with the statute."] },
      { heading: "Installation details can still matter", paragraphs: ["The statutory protection does not excuse a homeowner from separate easement, plumbing, utility, drainage, or governmental-code requirements. Associations also retain lawful authority that does not defeat the protected irrigation system itself."] },
      { heading: "Focus on practical effect", paragraphs: ["If an HOA condition makes an efficient system impossible or effectively prohibits it, the homeowner should compare that condition with Section 202.007 rather than assuming every architectural rule is enforceable as written."] },
    ],
    faq: [
      { q: "Can a Texas HOA ban drip irrigation?", a: "Generally no. Section 202.007 specifically protects efficient irrigation systems, including underground drip and other drip systems." },
      { q: "Do local plumbing rules still apply?", a: "Yes. The HOA statute limits restrictive covenants; it does not repeal applicable governmental plumbing, backflow, utility, or other safety requirements." },
      { q: "Is an old deed restriction automatically enforceable?", a: "No. Section 202.007 states that a provision violating its protections is void." },
    ],
    sources: [
      { label: "Texas Property Code § 202.007", url: "https://statutes.capitol.texas.gov/?artSec=202.007&chapter=PR.202&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas HOA rainwater harvesting", href: "/guides/texas-hoa-rainwater-harvesting-law" },
      { label: "Texas HOA drought-resistant landscaping", href: "/guides/texas-hoa-drought-resistant-landscaping-law" },
      { label: "Texas HOA composting", href: "/guides/texas-hoa-composting-law" },
    ],
  },
};
