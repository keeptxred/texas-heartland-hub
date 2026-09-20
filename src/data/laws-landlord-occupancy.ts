import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const LANDLORD_OCCUPANCY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-rental-occupancy-limits": {
    slug: "texas-rental-occupancy-limits",
    title: "Texas Rental Occupancy Limits: Adults Per Bedroom and Key Exceptions",
    dek: "Texas Property Code Section 92.010 explained, including the general adult-per-bedroom limit, fair-housing exceptions, temporary sanctuary for family violence, and bedroom definitions.",
    updated: "2026-08-13", pillarLabel: "Texas Laws", pillarHref: "/laws", guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Section 92.010 generally sets the maximum number of adults a landlord may allow to occupy a dwelling at three times the number of bedrooms.",
      "The statute recognizes exceptions when state or federal fair-housing law requires a higher occupancy rate.",
      "It also recognizes limited temporary sanctuary for an adult whose occupancy would otherwise exceed the limit when that person is seeking safety from family violence.",
      "The statute defines both 'adult' and 'bedroom,' so not every room in a dwelling counts as a bedroom for this calculation.",
    ],
    intro: ["Texas Property Code Section 92.010 creates a statewide residential occupancy ceiling based on the number of adults and bedrooms.", "The rule is not absolute because fair-housing requirements and a temporary family-violence sanctuary provision can require or allow a higher occupancy level."],
    sections: [
      { heading: "The general formula", paragraphs: ["Section 92.010 generally allows no more than three adult tenants per bedroom in the dwelling."] },
      { heading: "Fair-housing exception", paragraphs: ["A landlord may allow more adults when state or federal fair-housing law requires a higher occupancy rate."] },
      { heading: "Temporary sanctuary exception", paragraphs: ["The statute permits a temporary exception, for up to the period stated in the law, when an additional adult is seeking sanctuary from family violence."] },
      { heading: "What counts as a bedroom", paragraphs: ["Section 92.010 defines a bedroom as an area intended as sleeping quarters and excludes spaces such as kitchens, dining rooms, bathrooms, living rooms, utility rooms, closets, and storage areas."] },
    ],
    faq: [
      { q: "How many adults may live in a Texas rental?", a: "Section 92.010 generally uses three adults per bedroom, subject to statutory exceptions." },
      { q: "Can fair-housing law require a higher limit?", a: "Yes. Section 92.010 expressly recognizes that exception." },
      { q: "Does a living room count as a bedroom?", a: "Not under Section 92.010's definition of bedroom." },
    ],
    sources: [{ label: "Texas Property Code § 92.010", url: "https://statutes.capitol.texas.gov/?artSec=92.010&chapter=PR.92&code=PR&tab=1" }],
    related: [{ label: "Texas Laws Explained", href: "/laws" }, { label: "Texas rental application law", href: "/guides/texas-rental-application-fee-law" }, { label: "Texas lease copy law", href: "/guides/texas-right-to-copy-of-lease" }],
  },
};
