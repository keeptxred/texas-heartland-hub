import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const related = [{ label: "Texas Laws Explained", href: "/laws" }];

export const DRIVING_PLATE_PASSING_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-front-license-plate-law": {
    slug: "texas-front-license-plate-law",
    title: "Texas Front License Plate Law: When Two Plates Are Required",
    dek: "Texas license-plate display rules explained, including the general front-and-rear requirement, current dealer plate procedures, and common compliance questions.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas generally issues two license plates for ordinary passenger vehicles and requires both to be displayed when the vehicle is in a class for which two plates are issued.",
      "The front plate should be securely mounted rather than stored inside the vehicle as a substitute for display.",
      "Plate display and vehicle registration are separate legal requirements.",
      "Dealer plate procedures changed beginning July 1, 2025, so recent buyers should follow current TxDMV instructions rather than older paper-tag guidance.",
    ],
    intro: [
      "Texas is generally a two-plate state for ordinary passenger vehicles. Transportation Code Chapter 504 governs license plates, and TxDMV describes the general-issue passenger plate as a set that is displayed at the front and rear of the vehicle.",
      "Questions about a missing front plate often get mixed together with registration or temporary-tag questions. Those are separate issues, and the 2025 dealer-plate changes make current TxDMV guidance especially important for recently purchased vehicles.",
    ],
    sections: [
      { heading: "The general front-and-rear rule", paragraphs: ["Transportation Code Section 504.943 addresses operation of a vehicle without the required license plates. For vehicles issued two plates, current TxDMV guidance requires a plate at the front and rear." ] },
      { heading: "Display means mounting the plate", paragraphs: ["A plate should be secured in the location required for display. Keeping a front plate inside the passenger compartment is not the same as displaying it on the front of the vehicle." ] },
      { heading: "Registration is a different requirement", paragraphs: ["Registration status is primarily governed by Chapter 502, while plate issuance and display are governed by Chapter 504. A vehicle can therefore have a current registration issue, a plate-display issue, or both." ] },
      { heading: "Dealer procedures changed in 2025", paragraphs: ["House Bill 718 changed dealer plate and temporary-tag procedures beginning July 1, 2025. TxDMV now instructs dealers and buyers under a system that uses metal plates in many situations where paper temporary tags were previously used." ] },
    ],
    faq: [
      { q: "Does Texas require a front license plate?", a: "For ordinary passenger vehicles issued two plates, Texas generally requires display of both a front and rear plate. Vehicle classes and special plate situations can differ." },
      { q: "Can I keep the front plate on my dashboard?", a: "The general rule is display at the front of the vehicle. Storing a plate inside the vehicle is not the same as mounting it in the required display position." },
      { q: "Is a missing front plate the same as expired registration?", a: "No. Registration and plate display are governed by separate parts of the Transportation Code and can create separate compliance issues." },
    ],
    sources: [
      { label: "Texas Transportation Code § 504.943", url: "https://statutes.capitol.texas.gov/?artSec=504.943&chapter=TN.504&code=TN&tab=1" },
      { label: "TxDMV — License Plates", url: "https://www.txdmv.gov/motorists/license-plates" },
      { label: "TxDMV — HB 718 dealer plate changes", url: "https://www.txdmv.gov/dealers/HB718" },
    ],
    related: [...related, { label: "Texas expired registration law", href: "/guides/texas-expired-registration-law" }, { label: "Texas auto insurance requirements", href: "/guides/texas-auto-insurance-requirements" }],
  },

  "texas-left-lane-passing-law": {
    slug: "texas-left-lane-passing-law",
    title: "Texas Left-Lane and Passing Laws: When to Keep Right",
    dek: "Texas keep-right and passing rules explained, including slower traffic, passing on the left, no-passing zones, and 'Left Lane for Passing Only' signs.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Transportation Code Section 545.051 generally requires a driver moving more slowly than the normal speed of traffic to use the right-hand lane when practical, subject to statutory exceptions.",
      "Passing on the left is governed by additional rules requiring adequate distance and safe return to the lane.",
      "Texas highways may be posted with 'Left Lane for Passing Only' signs; drivers should obey those official traffic-control devices.",
      "A left lane is not a license to exceed the speed limit while passing.",
    ],
    intro: [
      "Texas drivers often summarize the rule as 'keep right except to pass.' The actual Transportation Code is more detailed. Section 545.051 establishes the general right-side and slower-traffic rules, while Sections 545.053 through 545.055 address passing on the left and no-passing situations.",
      "TxDOT also uses 'Left Lane for Passing Only' signs on qualifying highways. Those signs turn a general driving expectation into a clearly posted traffic-control instruction on the road where the sign appears.",
    ],
    sections: [
      { heading: "Slower traffic generally keeps right", paragraphs: ["Section 545.051 generally requires a vehicle moving more slowly than the normal speed of other traffic at that time and place to use the right-hand lane available for traffic, or drive as close as practicable to the right curb or edge, except when passing or preparing for a left turn and subject to other statutory provisions." ] },
      { heading: "Passing has its own safety rules", paragraphs: ["Sections 545.053 through 545.055 regulate passing on the left, returning to the lane, and locations where passing is restricted. A driver should not begin a pass without enough clear distance to complete it safely and lawfully." ] },
      { heading: "Passing-only signs matter", paragraphs: ["TxDOT installs official 'Left Lane for Passing Only' signs on qualifying highways. When posted, drivers should follow the traffic-control device and return right after completing a pass when it is safe to do so." ] },
      { heading: "Passing does not cancel the speed law", bullets: ["The reasonable-and-prudent speed rule continues to apply.", "A posted maximum does not increase merely because a driver is overtaking another vehicle.", "Weather, congestion, work zones, and other hazards can require additional caution.", "No-passing markings and signs must be obeyed even when the vehicle ahead is slow." ] },
    ],
    faq: [
      { q: "Is the left lane only for passing everywhere in Texas?", a: "Texas law contains general keep-right rules, and some highways are specifically posted 'Left Lane for Passing Only.' The exact duty depends on the road, traffic, signs, and statutory exceptions." },
      { q: "Can I speed to complete a pass?", a: "Passing does not create a separate permission to exceed an otherwise applicable lawful speed or ignore the reasonable-and-prudent speed requirement." },
      { q: "When should slower traffic move right?", a: "Section 545.051 generally directs traffic moving more slowly than the normal speed at that time and place to use the right-hand lane when practical, subject to statutory exceptions." },
    ],
    sources: [
      { label: "Texas Transportation Code § 545.051", url: "https://statutes.capitol.texas.gov/?artSec=545.051&chapter=TN.545&code=TN&tab=1" },
      { label: "Texas Transportation Code § 545.053", url: "https://statutes.capitol.texas.gov/?artSec=545.053&chapter=TN.545&code=TN&tab=1" },
      { label: "TxDOT — Highway driving tips", url: "https://www.txdot.gov/safety/driving-laws/tips-highway-driving.html" },
    ],
    related: [...related, { label: "Texas speeding laws", href: "/guides/texas-speeding-laws-guide" }, { label: "Move Over or Slow Down", href: "/guides/texas-move-over-slow-down-law" }],
  },
};
