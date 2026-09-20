import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FIREARMS_PLACES_VEHICLE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-firearm-prohibited-places-law": {
    slug: "texas-firearm-prohibited-places-law",
    title: "Where You Cannot Carry a Firearm in Texas: Penal Code § 46.03 Explained",
    dek: "A location-focused guide to Texas firearm restrictions for schools, polling places, courts, secured airport areas, 51-percent businesses and other prohibited premises.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Penal Code Section 46.03 identifies places where weapons are prohibited, and the rule can apply even when a person may lawfully possess or carry a handgun elsewhere.",
      "Examples include school premises and school activities, polling places during voting, courts and court offices, secured airport areas, racetracks, and premises of certain alcohol businesses.",
      "Some locations are prohibited only under specified conditions or after effective notice, and Section 46.15 contains exceptions and nonapplicability provisions for particular people and circumstances.",
      "An LTC is not a universal override for Section 46.03; a license holder must still check the location-specific rule and any applicable exception.",
    ],
    intro: [
      "The most consequential Texas carry question is often not whether a person has an LTC, but whether the location itself is prohibited by statute.",
      "Section 46.03 contains multiple location categories and exceptions. This guide is a map to the statute, not a substitute for checking the exact premises and current law before carrying.",
    ],
    sections: [
      { heading: "Schools and school activities are specially regulated", paragraphs: ["Section 46.03 covers the physical premises of schools and educational institutions, grounds or buildings where a school-sponsored activity is being conducted, and school transportation vehicles, subject to statutory written-authorization and other exceptions."] },
      { heading: "Voting, courts and secured airport areas are on the list", paragraphs: ["DPS identifies polling places during voting, courts and court offices, and secured airport areas among the places covered by Section 46.03. The statute should be reviewed for the exact premises definition and any exceptions."] },
      { heading: "Alcohol businesses can be prohibited premises", paragraphs: ["DPS notes that Section 46.03 prohibits weapons on premises of a business that derives 51 percent or more of its income from the sale or service of alcoholic beverages for on-premises consumption. Texas law requires specified notice for those premises."] },
      { heading: "Hospitals, nursing homes and amusement parks have notice-dependent rules", paragraphs: ["DPS explains that some locations, including certain hospitals, nursing facilities and amusement parks, are restricted when effective notice is given under the applicable statutes. This makes the sign-and-notice analysis important in addition to the location category itself."] },
    ],
    faq: [
      { q: "Does an LTC let me carry in every government building?", a: "No. Courts and other locations listed in Penal Code Section 46.03 can remain prohibited even for license holders, subject to the statute's exceptions." },
      { q: "Can I carry at a polling place?", a: "Section 46.03 prohibits weapons on the premises of a polling place on Election Day or while early voting is in progress, subject to the statute's precise terms and exceptions." },
      { q: "Is every hospital automatically a prohibited place?", a: "Not in the same way as every location on the list. DPS explains that hospital and nursing-home restrictions can depend on effective notice and other statutory conditions." },
    ],
    sources: [
      { label: "Texas Penal Code § 46.03", url: "https://statutes.capitol.texas.gov/?artSec=46.03&chapter=PE.46&code=PE&tab=1" },
      { label: "Texas Penal Code § 46.15", url: "https://statutes.capitol.texas.gov/?artSec=46.15&chapter=PE.46&code=PE&tab=1" },
      { label: "Texas DPS Carrying a Handgun FAQs", url: "https://www.dps.texas.gov/section/handgun-licensing/faq/laws-relate-carrying-handgun-faqs" },
    ],
    related: [
      { label: "Texas permitless carry", href: "/guides/texas-permitless-carry-law" },
      { label: "Texas handgun signs", href: "/guides/texas-30-05-30-06-30-07-signs-guide" },
      { label: "Texas campus carry", href: "/guides/texas-campus-carry-law" },
    ],
  },

  "texas-vehicle-handgun-carry-law": {
    slug: "texas-vehicle-handgun-carry-law",
    title: "Texas Vehicle Handgun Carry Law: Cars, Holsters and Parking Areas",
    dek: "How Texas treats handgun carry in a privately owned or controlled vehicle, including visibility, holsters, prohibited-person rules and special parking-area laws.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Penal Code Section 46.02 contains separate rules for carrying a handgun in a motor vehicle or watercraft that a person owns or controls.",
      "DPS states that a license holder carrying in a vehicle must have the handgun concealed or in a holster.",
      "Vehicle carry does not excuse possession by a person who is prohibited from possessing a firearm or conduct that falls outside the statutory vehicle exceptions.",
      "Some parking areas have additional statutes, including protections for specified license holders storing firearms in locked vehicles at certain school parking areas, but those laws do not authorize carry that is otherwise illegal.",
    ],
    intro: [
      "Texas vehicle-carry law is not simply 'your car is your castle.' Penal Code Section 46.02 treats a vehicle as a distinct carry context and imposes conditions involving how a handgun is carried and the status and conduct of the person carrying it.",
      "Parking-lot rules can add another layer because state law sometimes protects storage in a locked vehicle while still prohibiting possession inside a building or other restricted premises.",
    ],
    sections: [
      { heading: "Section 46.02 has a vehicle-specific framework", paragraphs: ["Texas Penal Code Section 46.02 addresses a handgun carried in a motor vehicle or watercraft owned or controlled by the person. The statute should be read together with the person's eligibility to possess a firearm and any location-specific restriction."] },
      { heading: "Visibility and holsters matter", paragraphs: ["DPS states that a license holder carrying a handgun in a vehicle must keep it concealed or carry it in a holster. The current Penal Code also uses visibility and holster concepts in the vehicle-carry provisions."] },
      { heading: "The vehicle does not erase prohibited-person rules", paragraphs: ["A person who is prohibited by state or federal law from possessing a firearm does not become eligible merely because the firearm is in a private vehicle. Other disqualifying conduct and location restrictions can also remain relevant."] },
      { heading: "Parking-area protections are separate from building carry", paragraphs: ["Texas statutes contain targeted parking-area protections in some settings. For example, Education Code Section 37.0815 addresses storage or transport by an LTC holder in a locked private vehicle in certain school parking areas when the firearm is not in plain view, while expressly stating that it does not authorize conduct prohibited by Section 46.03 or other law."] },
    ],
    faq: [
      { q: "Can a Texas LTC holder carry a handgun in a car?", a: "Yes, subject to applicable law. DPS states that for a license holder the handgun must be concealed or in a holster." },
      { q: "Does being inside my car override a prohibited location?", a: "No. Location-specific laws, parking-area statutes, and prohibited-person rules must still be checked." },
      { q: "Can an LTC holder store a firearm in a school parking lot?", a: "Texas Education Code Section 37.0815 provides a targeted protection for transport or storage in a locked private vehicle in specified school parking areas when the firearm is not in plain view, but it does not authorize conduct otherwise prohibited by law." },
    ],
    sources: [
      { label: "Texas Penal Code § 46.02", url: "https://statutes.capitol.texas.gov/?artSec=46.02&chapter=PE.46&code=PE&tab=1" },
      { label: "Texas Education Code § 37.0815", url: "https://statutes.capitol.texas.gov/?artSec=37.0815&chapter=ED.37&code=ED&tab=1" },
      { label: "Texas DPS Carrying a Handgun FAQs", url: "https://www.dps.texas.gov/section/handgun-licensing/faq/laws-relate-carrying-handgun-faqs" },
    ],
    related: [
      { label: "Texas permitless carry", href: "/guides/texas-permitless-carry-law" },
      { label: "Texas prohibited carry locations", href: "/guides/texas-firearm-prohibited-places-law" },
      { label: "Texas License to Carry", href: "/guides/texas-license-to-carry-guide" },
    ],
  },
};
