import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const HOA_ENERGY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hoa-solar-panel-law": {
    slug: "texas-hoa-solar-panel-law",
    title: "Texas HOA Solar Panel Law: What Associations May Regulate",
    dek: "Texas Property Code Section 202.010 explained for homeowners installing solar energy devices in HOA communities, including placement, approval, roofline and production rules.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 202.010 generally prevents a Texas property owners' association from prohibiting or restricting a homeowner from installing a solar energy device.",
      "The statute still permits specified rules involving safety, law compliance, common property, roof placement, roofline, frame and visible wiring tones, fenced-yard height, warranties, and prior approval.",
      "If the HOA designates a roof location, an alternate location may be protected when a publicly available National Renewable Energy Laboratory modeling tool shows more than a 10 percent increase in estimated annual energy production.",
      "An HOA or architectural committee generally may not withhold approval when the statutory and authorized dedicatory-instrument conditions are met, subject to the statute's written nuisance determination provision.",
    ],
    intro: [
      "Texas gives residential solar installations strong protection from restrictive covenants while allowing HOAs to enforce a defined set of design and safety conditions.",
      "Section 202.010 is more detailed than a simple 'HOAs cannot ban solar' rule, so homeowners should use the statute itself when evaluating a proposed location or architectural-review decision.",
    ],
    sections: [
      { heading: "A blanket solar ban is generally prohibited", paragraphs: ["Section 202.010(b) generally bars a property owners' association from including or enforcing a dedicatory-instrument provision that prohibits or restricts installation of a solar energy device. A conflicting provision is void under subsection (c)."] },
      { heading: "Texas law preserves specific HOA design authority", paragraphs: ["Subsection (d) identifies circumstances in which an HOA may prohibit or regulate a device, including unlawful or unsafe installations, common property, certain locations, roofline and mounting details, fenced-yard height, warranty issues, and prior approval requirements that provide decisions within the applicable time frame."] },
      { heading: "Energy production matters when location is disputed", paragraphs: ["For roof-mounted devices, the statute addresses an HOA-designated location and an alternate location that increases estimated annual energy production by more than 10 percent using a publicly available National Renewable Energy Laboratory modeling tool."] },
      { heading: "Approval cannot be withheld without statutory support", paragraphs: ["Section 202.010(e) limits an HOA or architectural review committee's ability to withhold approval when the authorized conditions are met, while preserving a written determination involving substantial interference with use and enjoyment under the statutory standard."] },
    ],
    faq: [
      { q: "Can a Texas HOA ban solar panels?", a: "Generally no. Property Code Section 202.010 prohibits HOA provisions that ban or restrict solar energy devices except for the specific circumstances the statute allows." },
      { q: "Can an HOA tell me where panels must go?", a: "The statute permits some location regulation, but it also protects certain alternate locations when estimated annual production would increase by more than 10 percent under the statutory modeling rule." },
      { q: "Can an HOA require architectural approval first?", a: "Yes, Section 202.010 allows prior approval requirements if the review process provides decisions within a reasonable period or the period stated in the governing documents." },
    ],
    sources: [
      { label: "Texas Property Code § 202.010", url: "https://statutes.capitol.texas.gov/?artSec=202.010&chapter=PR.202&code=PR&tab=1" },
      { label: "Texas Tax Code § 11.27", url: "https://statutes.capitol.texas.gov/?artSec=11.27&chapter=TX.11&code=TX&tab=1" },
    ],
    related: [
      { label: "Texas HOA standby generators", href: "/guides/texas-hoa-standby-generator-law" },
      { label: "Texas HOA powers", href: "/guides/texas-hoa-powers-guide" },
      { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" },
    ],
  },

  "texas-hoa-standby-generator-law": {
    slug: "texas-hoa-standby-generator-law",
    title: "Texas HOA Standby Generator Law: Installation, Operation and Association Rules",
    dek: "How Texas Property Code Section 202.019 protects permanently installed standby electric generators while allowing specified HOA safety, placement and operating rules.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 202.019 generally prevents a property owners' association from prohibiting or effectively restricting a qualifying permanently installed standby electric generator.",
      "The statutory definition includes fuel, enclosure, transfer-switch, and minimum generating-capacity requirements.",
      "An HOA may enforce specified requirements involving manufacturer specifications, governmental health and safety codes, electrical and building codes, utility location, noise, placement, screening, testing and maintenance.",
      "Homeowners should confirm that the proposed equipment fits the statutory definition before relying on Section 202.019's protections.",
    ],
    intro: [
      "Texas law protects qualifying residential standby generators because HOA restrictions could otherwise prevent homeowners from installing permanent backup power.",
      "The statute balances that protection with association authority over safety, installation details and reasonable operation requirements.",
    ],
    sections: [
      { heading: "The generator must fit the statutory definition", paragraphs: ["Section 202.019 defines a standby electric generator by its fuel source, manufacturer-supplied sound-attenuating enclosure, connection to the residence's main electrical panel through a transfer switch, and a generating capacity of at least seven kilowatts."] },
      { heading: "A qualifying generator generally cannot be banned", paragraphs: ["Except as provided by the statute, an HOA may not adopt or enforce a provision that prohibits, restricts, or effectively prohibits or restricts an owner from owning, operating, installing, or maintaining a permanently installed standby electric generator."] },
      { heading: "Safety and installation rules remain valid", paragraphs: ["Section 202.019 expressly preserves multiple forms of HOA regulation, including compliance with manufacturer specifications and governmental health, safety, electrical and building codes, as well as authorized rules addressing placement and related installation concerns."] },
      { heading: "Read the full rule before installation", paragraphs: ["Because the section lists multiple permissible HOA requirements, homeowners should compare the exact equipment, location, screening, fuel source, testing plan, and architectural-review process with the current statute and governing documents before installation."] },
    ],
    faq: [
      { q: "Can a Texas HOA ban a whole-home standby generator?", a: "Generally not if the generator qualifies under Property Code Section 202.019, although the HOA may enforce the specific safety, placement and operating rules the statute allows." },
      { q: "Does a portable generator receive the same protection?", a: "Section 202.019 is written around a defined permanently installed standby electric generator. A portable generator may not fit that statutory definition." },
      { q: "Can the HOA require code compliance?", a: "Yes. The statute expressly allows requirements tied to manufacturer specifications and applicable governmental health, safety, electrical and building codes." },
    ],
    sources: [
      { label: "Texas Property Code § 202.019", url: "https://statutes.capitol.texas.gov/?artSec=202.019&chapter=PR.202&code=PR&tab=1" },
    ],
    related: [
      { label: "Texas HOA solar panel law", href: "/guides/texas-hoa-solar-panel-law" },
      { label: "Texas HOA powers", href: "/guides/texas-hoa-powers-guide" },
      { label: "Texas HOA laws", href: "/guides/texas-hoa-laws-guide" },
    ],
  },
};
