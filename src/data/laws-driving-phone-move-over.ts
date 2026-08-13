import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const related = [
  { label: "Texas Laws Explained", href: "/laws" },
  { label: "Texas Law Enforcement & Public Safety", href: "/texas-law-enforcement" },
];

export const DRIVING_PHONE_MOVE_OVER_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-texting-driving-phone-laws": {
    slug: "texas-texting-driving-phone-laws",
    title: "Texas Texting and Driving Laws: Phones, Messages and Hands-Free Use",
    dek: "What Texas drivers can and cannot do with a phone behind the wheel, including the statewide electronic-message ban, statutory defenses, and school-zone rules.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Transportation Code Section 545.4251 generally prohibits reading, writing, or sending an electronic message with a portable wireless device while operating a motor vehicle unless the vehicle is stopped.",
      "The statute includes specified defenses for uses such as hands-free operation, navigation, emergency reporting, certain occupational dispatch functions, and music applications.",
      "School crossing zones have additional restrictions, and local governments can adopt certain broader wireless-device rules when statutory requirements are met.",
      "The statute does not give an officer automatic authority to inspect a phone solely because of a stop for the messaging offense.",
    ],
    intro: [
      "Texas has a statewide distracted-driving statute focused on electronic messages. Section 545.4251 generally prohibits using a portable wireless communication device to read, write, or send an electronic message while operating a motor vehicle unless the vehicle is stopped.",
      "The rule is more specific than a blanket phrase such as 'no phones while driving.' The statute identifies prohibited conduct, provides defenses for particular uses, and operates alongside additional school-zone and local rules.",
    ],
    sections: [
      { heading: "The statewide messaging rule", paragraphs: ["Section 545.4251 applies to reading, writing, or sending an electronic message on a portable wireless communication device while operating a motor vehicle unless the vehicle is stopped. Drivers should use the statutory text rather than assuming every device interaction is treated the same way."] },
      { heading: "Uses treated differently", paragraphs: ["The statute includes defenses for specified uses such as hands-free operation, navigation, reporting illegal activity or emergencies, reading emergency messages, certain occupational dispatch functions, and music applications. Those defenses do not remove the broader duty to operate safely."] },
      { heading: "School zones and local rules", paragraphs: ["Section 545.425 contains additional wireless-device restrictions associated with school crossing zones and certain drivers. State law also allows local restrictions in specified circumstances, so posted local signs can matter." ] },
      { heading: "A stop does not automatically authorize phone inspection", paragraphs: ["Section 545.4251 states that an officer making a stop for an alleged violation may not take possession of or inspect the portable wireless device unless another law authorizes it. Other facts, consent, a warrant, an arrest, or a separate investigation can raise different legal questions."] },
    ],
    faq: [
      { q: "Is texting while driving illegal statewide in Texas?", a: "Yes. Section 545.4251 generally prohibits reading, writing, or sending an electronic message while operating a motor vehicle unless the vehicle is stopped, subject to statutory defenses." },
      { q: "Can I use GPS while driving?", a: "Section 545.4251 includes a statutory defense for using a device with a GPS function to navigate. Safe-operation duties still apply." },
      { q: "Can an officer automatically inspect my phone after a texting stop?", a: "Section 545.4251 says the officer may not take possession of or inspect the device solely from that stop unless another law authorizes it." },
    ],
    sources: [
      { label: "Texas Transportation Code § 545.4251", url: "https://statutes.capitol.texas.gov/?artSec=545.4251&chapter=TN.545&code=TN&tab=1" },
      { label: "Texas Transportation Code § 545.425", url: "https://statutes.capitol.texas.gov/?artSec=545.425&chapter=TN.545&code=TN&tab=1" },
      { label: "Texas DPS distracted-driving enforcement", url: "https://www.dps.texas.gov/news/dps-increases-enforcement-annual-distracted-driving-campaign" },
    ],
    related: [...related, { label: "Texas speeding laws", href: "/guides/texas-speeding-laws-guide" }, { label: "Texas school-bus stop law", href: "/guides/texas-school-bus-stop-law" }],
  },

  "texas-move-over-slow-down-law": {
    slug: "texas-move-over-slow-down-law",
    title: "Texas Move Over or Slow Down Law: What Drivers Must Do",
    dek: "Texas Move Over or Slow Down requirements explained, including lane changes, reduced-speed rules, protected roadside vehicles, and the September 2025 expansion.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "When approaching a stationary protected vehicle using the required visual signals, a driver on a road with at least two same-direction lanes generally must leave the lane closest to that vehicle when the lane change can be made safely.",
      "When remaining in the adjacent lane, Section 545.157 generally requires no more than 20 mph below the posted limit when the limit is 25 mph or more, or 5 mph when the posted limit is below 25 mph.",
      "The protected list extends beyond police cars and ambulances and has expanded through multiple legislative sessions.",
      "Senate Bill 305, effective September 1, 2025, added specified animal-control carcass-removal and parking-enforcement vehicles.",
    ],
    intro: [
      "Texas Transportation Code Section 545.157 creates the state's Move Over or Slow Down rule. It is intended to create safer working space around specified stationary roadside vehicles displaying the signals required by law.",
      "The protected-vehicle list has changed over time. Senate Bill 305 expanded it again effective September 1, 2025, so an older online summary can omit vehicles that are protected under current law.",
    ],
    sections: [
      { heading: "Move out of the closest lane when it is safe", paragraphs: ["On a roadway with two or more lanes traveling in the same direction, Section 545.157 generally requires a driver approaching a stationary protected vehicle to vacate the lane closest to it when the lane change can be made safely and lawfully."] },
      { heading: "The slowdown standard", paragraphs: ["When the posted limit is 25 mph or more, the statute generally uses a speed no more than 20 mph below the posted limit. When the posted limit is below 25 mph, it specifies 5 mph. Other hazards can require an even lower reasonable speed."] },
      { heading: "The protected list changes over time", paragraphs: ["Current law covers multiple categories of roadside emergency, service, and enforcement vehicles. SB 305, effective September 1, 2025, added specified animal-control vehicles used for carcass removal and parking-enforcement vehicles." ] },
      { heading: "Why current sources matter", bullets: ["Protected vehicle categories have expanded over time.", "The required visual signals can depend on the vehicle category.", "Penalty provisions can change through legislation.", "The current Transportation Code and enacted bill text are the best references for an evergreen explanation."] },
    ],
    faq: [
      { q: "How much must I slow down if I do not move over?", a: "Section 545.157 generally uses 20 mph below the posted limit when the limit is 25 mph or more, and 5 mph when the posted limit is below 25 mph. Conditions can require a still lower safe speed." },
      { q: "Does the law apply only to police and ambulances?", a: "No. Section 545.157 covers multiple categories of protected roadside vehicles, and the list has expanded over time." },
      { q: "What changed in 2025?", a: "SB 305 took effect September 1, 2025 and added specified animal-control carcass-removal and parking-enforcement vehicles to the protected categories." },
    ],
    sources: [
      { label: "Texas Transportation Code § 545.157", url: "https://statutes.capitol.texas.gov/?artSec=545.157&chapter=TN.545&code=TN&tab=1" },
      { label: "Texas Legislature — SB 305 enrolled text", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00305F.HTM" },
      { label: "TxDOT — Move Over or Slow Down", url: "https://www.txdot.gov/safety/traffic-safety-campaigns/move-over-or-slow-down.html" },
    ],
    related: [...related, { label: "Texas speeding laws", href: "/guides/texas-speeding-laws-guide" }, { label: "Texas left-lane law", href: "/guides/texas-left-lane-passing-law" }],
  },
};
