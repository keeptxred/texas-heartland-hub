import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const DRIVING_SCHOOL_BUS_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-school-bus-stop-law": {
    slug: "texas-school-bus-stop-law",
    title: "Texas School Bus Stop Law: When Drivers Must Stop",
    dek: "Texas school-bus stopping rules explained, including flashing red lights, divided highways, when traffic may proceed, and why median design matters.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Transportation Code Section 545.066 generally requires drivers approaching a school bus with flashing red signals to stop before reaching the bus.",
      "Traffic generally must remain stopped until the bus resumes motion, the driver signals motorists to proceed, or the visual signal is no longer actuated.",
      "The opposite-direction rule depends on whether the roadway is separated in the manner described by statute; a simple turn lane is not automatically the same thing as a divided highway.",
      "Drivers should slow early around school buses and children rather than waiting until the last possible moment to determine whether the stop rule applies.",
    ],
    intro: [
      "School-bus stops combine traffic law with one of the highest-risk moments on a neighborhood road: children entering or crossing the roadway. Transportation Code Section 545.066 establishes the Texas stopping rule for drivers approaching a school bus that is receiving or discharging students and displaying the required visual signals.",
      "The most common point of confusion is opposite-direction traffic on a divided roadway. The physical design of the roadway matters, so drivers should not assume that every painted center area or left-turn lane creates an exception.",
    ],
    sections: [
      { heading: "Stop for the flashing red school-bus signal", paragraphs: ["Section 545.066 generally requires an approaching driver to stop before reaching a school bus that is operating the visual signal required by law while receiving or discharging students. The safest response is to begin slowing as soon as the bus signals become apparent." ] },
      { heading: "When traffic may move again", paragraphs: ["The statute generally requires drivers to remain stopped until the school bus resumes motion, the bus driver signals motorists to proceed, or the visual signal is no longer actuated. Drivers should also confirm that children have cleared the roadway before proceeding safely." ] },
      { heading: "Opposite-direction traffic and divided roads", paragraphs: ["Section 545.066 contains an exception for a driver on a different roadway of a divided highway. TxDOT guidance explains that traffic on the opposite side of a divided highway does not stop in that circumstance. Whether a roadway is legally divided depends on its design, not just the number of lanes." ] },
      { heading: "Do not guess around children", bullets: ["Slow early when a school bus activates warning signals.", "Watch for children who may cross unexpectedly.", "Do not rely on another driver's movement as proof that the stop rule does not apply.", "Use the current statute and TxDOT guidance when roadway design creates uncertainty." ] },
    ],
    faq: [
      { q: "Do I have to stop for a Texas school bus with flashing red lights?", a: "Generally yes. Section 545.066 requires an approaching driver to stop before reaching a school bus displaying the required visual signal while receiving or discharging students, subject to the divided-highway exception." },
      { q: "When can I start moving again?", a: "Generally when the bus resumes motion, the bus driver signals traffic to proceed, or the visual signal is no longer actuated, while continuing to watch for children." },
      { q: "Do cars going the opposite direction always have to stop?", a: "Not when the bus is on a different roadway of a divided highway as described by the statute. The roadway's physical design matters." },
    ],
    sources: [
      { label: "Texas Transportation Code § 545.066", url: "https://statutes.capitol.texas.gov/?artSec=545.066&chapter=TN.545&code=TN&tab=1" },
      { label: "TxDOT — School bus safety", url: "https://www.txdot.gov/safety/driving-laws/school-bus-safety.html" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas seat belt and child safety seat laws", href: "/guides/texas-seat-belt-child-safety-seat-laws" },
      { label: "Texas speeding laws", href: "/guides/texas-speeding-laws-guide" },
    ],
  },
};
