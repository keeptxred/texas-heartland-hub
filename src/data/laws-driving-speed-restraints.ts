import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const related = [
  { label: "Texas Laws Explained", href: "/laws" },
  { label: "Texas Law Enforcement & Public Safety", href: "/texas-law-enforcement" },
];

export const DRIVING_SPEED_RESTRAINT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-speeding-laws-guide": {
    slug: "texas-speeding-laws-guide",
    title: "Texas Speeding Laws: Speed Limits and the Reasonable-Speed Rule",
    dek: "A plain-English guide to Texas speed law, including posted limits, the reasonable-and-prudent rule, changing road conditions, and traffic citations.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas drivers must use a speed that is reasonable and prudent for existing conditions, even when that means driving below the posted limit.",
      "Transportation Code Section 545.352 supplies statutory prima facie speed limits, while authorized state and local entities may establish different lawful limits on particular roads.",
      "Rain, congestion, curves, pedestrians, construction, crashes, and other hazards can require additional slowing.",
      "A traffic citation starts a court process; the court listed on the citation controls deadlines and available procedures.",
    ],
    intro: [
      "Texas speed law is broader than the number on a sign. Transportation Code Section 545.351 requires a driver to operate no faster than is reasonable and prudent under the circumstances and to control speed as necessary to avoid a collision.",
      "Section 545.352 provides the familiar numerical framework. The practical rule is that a posted limit matters, but it does not make that speed safe in every condition.",
    ],
    sections: [
      { heading: "Reasonable and prudent comes first", paragraphs: ["Section 545.351 requires a reasonable and prudent speed for existing conditions. It also calls for reduced speed when a special hazard exists because of traffic, weather, road conditions, intersections, curves, hills, pedestrians, or other circumstances."] },
      { heading: "Posted and statutory limits", paragraphs: ["Section 545.352 establishes prima facie limits for common road settings. Other Transportation Code provisions authorize lawful changes to limits on particular roads after the required procedures are followed, so drivers should obey current signs and traffic-control devices."] },
      { heading: "When conditions require a lower speed", bullets: ["Heavy rain, fog, ice, flooding, dust, or poor visibility.", "Congestion, stopped traffic, crash scenes, workers, or pedestrians.", "Curves, hills, intersections, railroad crossings, and other visibility hazards.", "Any circumstance in which the posted speed would not be reasonable and prudent."] },
      { heading: "After a citation", paragraphs: ["A speeding citation is an allegation rather than a conviction. Response deadlines and possible procedures vary by court and case, so a driver should use the court named on the citation rather than relying on a generic online checklist."] },
    ],
    faq: [
      { q: "Can I always drive the posted speed limit in bad weather?", a: "No. Section 545.351 requires a reasonable and prudent speed for existing conditions and can require a speed below the posted limit." },
      { q: "Does every Texas road have the same statutory limit?", a: "No. Section 545.352 provides prima facie limits, and authorized entities can establish different lawful limits for particular roads and zones." },
      { q: "Is a speeding ticket already a conviction?", a: "No. A citation starts a court process. The court listed on the citation controls the response deadline and procedures." },
    ],
    sources: [
      { label: "Texas Transportation Code § 545.351", url: "https://statutes.capitol.texas.gov/?artSec=545.351&chapter=TN.545&code=TN&tab=1" },
      { label: "Texas Transportation Code § 545.352", url: "https://statutes.capitol.texas.gov/?artSec=545.352&chapter=TN.545&code=TN&tab=1" },
      { label: "TxDOT highway driving safety", url: "https://www.txdot.gov/safety/driving-laws/tips-highway-driving.html" },
    ],
    related: [...related, { label: "Texas left-lane law", href: "/guides/texas-left-lane-passing-law" }, { label: "Move Over or Slow Down", href: "/guides/texas-move-over-slow-down-law" }],
  },

  "texas-seat-belt-child-safety-seat-laws": {
    slug: "texas-seat-belt-child-safety-seat-laws",
    title: "Texas Seat Belt and Child Safety Seat Laws",
    dek: "Texas seat-belt and child-passenger rules explained, including the under-8 child-seat requirement, the 4-foot-9 height exception, and driver responsibilities.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A child younger than 8 generally must be secured in a child passenger safety seat system unless the child is taller than 4 feet 9 inches.",
      "A person age 15 or older in a passenger vehicle equipped with safety belts generally must be secured while the vehicle is being operated.",
      "Drivers have separate statutory responsibility for certain younger passengers who are not properly restrained.",
      "Families should follow both Texas law and the restraint manufacturer's size and installation instructions.",
    ],
    intro: [
      "Texas uses separate statutes for ordinary seat-belt use and child passenger safety seats. Transportation Code Section 545.412 addresses younger children, while Section 545.413 addresses safety-belt use and driver responsibility for certain passengers.",
      "The rules overlap but are not interchangeable. The correct restraint depends on the child's age, height, and the manufacturer's instructions for the safety-seat system.",
    ],
    sections: [
      { heading: "Children younger than 8", paragraphs: ["Section 545.412 generally requires a child younger than 8 to be secured in a child passenger safety seat system according to the manufacturer's instructions unless the child is taller than 4 feet 9 inches."] },
      { heading: "Seat belts for older occupants", paragraphs: ["Section 545.413 generally requires a person age 15 or older riding in a passenger vehicle equipped with safety belts to be secured while the vehicle is being operated. It also creates driver responsibility for certain passengers younger than 17 who are not otherwise covered by the child-seat requirement."] },
      { heading: "Correct use matters", bullets: ["Use a restraint appropriate for the child's size and the manufacturer's limits.", "Install the restraint according to both vehicle and seat instructions.", "Check current recall, expiration, and crash-replacement guidance for the seat.", "Use a qualified child-passenger safety inspection resource if installation is uncertain."] },
      { heading: "After a child-restraint citation", paragraphs: ["Section 545.4121 contains a limited statutory defense tied to acquiring an appropriate child passenger safety seat after certain citations. Its conditions should be read directly and do not make compliance optional before a citation occurs."] },
    ],
    faq: [
      { q: "When can a Texas child stop using a child safety seat?", a: "Section 545.412 generally requires one for a child younger than 8 unless the child is taller than 4 feet 9 inches." },
      { q: "Do adults have to wear seat belts in Texas?", a: "Section 545.413 generally requires a person age 15 or older in an equipped passenger vehicle to be secured while the vehicle is being operated." },
      { q: "Can the driver be responsible for an unbuckled child?", a: "Yes. Section 545.413 creates driver responsibility for certain passengers younger than 17 who are not properly restrained." },
    ],
    sources: [
      { label: "Texas Transportation Code § 545.412", url: "https://statutes.capitol.texas.gov/?artSec=545.412&chapter=TN.545&code=TN&tab=1" },
      { label: "Texas Transportation Code § 545.4121", url: "https://statutes.capitol.texas.gov/?artSec=545.4121&chapter=TN.545&code=TN&tab=1" },
      { label: "Texas Transportation Code § 545.413", url: "https://statutes.capitol.texas.gov/?artSec=545.413&chapter=TN.545&code=TN&tab=1" },
    ],
    related: [...related, { label: "Texas school-bus stop law", href: "/guides/texas-school-bus-stop-law" }, { label: "Texas phone-use law", href: "/guides/texas-texting-driving-phone-laws" }],
  },
};
