import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CRIMINAL_POLICE_CONTACT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-evading-arrest-detention-law": {
    slug: "texas-evading-arrest-detention-law",
    title: "Texas Evading Arrest or Detention Law: Flight, Vehicles and Penalties",
    dek: "A practical guide to Texas Penal Code Section 38.04: intentional flight from a known officer attempting a lawful arrest or detention, the base misdemeanor level, and when vehicles, prior convictions or injuries increase punishment.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Evading arrest or detention under Section 38.04 requires intentional flight from a person the actor knows is a peace officer or federal special investigator who is attempting lawfully to arrest or detain the actor.",
      "The baseline offense is a Class A misdemeanor, but the statute contains felony enhancements for specified circumstances.",
      "Using a vehicle or watercraft while fleeing can elevate the offense, as can a prior evading conviction and specified serious-injury or death consequences.",
      "The lawfulness of the attempted arrest or detention is part of Section 38.04's offense definition, unlike resisting arrest under Section 38.03, which expressly states that unlawfulness of the arrest or search is not a defense to that separate offense.",
    ],
    intro: [
      "Texas evading law focuses on intentional flight from a known law-enforcement officer who is trying lawfully to arrest or detain a person. It is not simply a label for being uncooperative, walking away in every police encounter, or disputing an officer's instructions.",
      "The punishment structure changes sharply when a vehicle, prior conviction, tire-deflation device, serious bodily injury or death is involved, so the precise subsection matters.",
    ],
    sections: [
      { heading: "Intentional flight and knowledge of the officer are required", paragraphs: ["Section 38.04 applies when a person intentionally flees from someone the person knows is a peace officer or federal special investigator attempting lawfully to arrest or detain the person. Intentional flight, officer identity and a lawful attempted arrest or detention are all part of the statutory framework."] },
      { heading: "The baseline offense is a Class A misdemeanor", paragraphs: ["The statute begins at the Class A misdemeanor level. It then provides higher punishment levels for specified facts, so a summary should not assume every evading case is a misdemeanor."] },
      { heading: "Vehicles, prior convictions and consequences can elevate punishment", paragraphs: ["Section 38.04 raises the offense level in circumstances that include a qualifying prior conviction or use of a vehicle or watercraft while in flight. Additional felony provisions address specified serious bodily injury, death and tire-deflation-device facts."] },
      { heading: "Evading and resisting arrest are different statutes", paragraphs: ["Evading under Section 38.04 centers on intentional flight. Resisting under Section 38.03 centers on intentionally preventing or obstructing an arrest, search or transportation by using force against an officer or another. Section 38.03 also contains a different rule about the lawfulness of the arrest or search, so the two offenses should not be blended together."] },
    ],
    faq: [
      { q: "Is evading arrest always a felony in Texas?", a: "No. Section 38.04 starts as a Class A misdemeanor, but specified facts such as a prior conviction, use of a vehicle or watercraft, or serious injury or death consequences can elevate the offense." },
      { q: "Does the officer have to be trying to lawfully arrest or detain the person?", a: "Yes. Section 38.04's offense definition refers to a peace officer or federal special investigator attempting lawfully to arrest or detain the person." },
      { q: "Is evading the same as resisting arrest?", a: "No. Evading under Section 38.04 addresses intentional flight; resisting under Section 38.03 addresses specified force used to prevent or obstruct an arrest, search or transportation." },
    ],
    sources: [
      { label: "Texas Penal Code § 38.04", url: "https://statutes.capitol.texas.gov/?artSec=38.04&chapter=PE.38&code=PE&tab=1" },
      { label: "Texas Penal Code § 38.03", url: "https://statutes.capitol.texas.gov/?artSec=38.03&chapter=PE.38&code=PE&tab=1" },
    ],
    related: [
      { label: "Texas failure to identify", href: "/guides/texas-failure-to-identify-law" },
      { label: "Texas disorderly conduct", href: "/guides/texas-disorderly-conduct-law" },
      { label: "Texas assault law", href: "/guides/texas-assault-law" },
    ],
  },

  "texas-failure-to-identify-law": {
    slug: "texas-failure-to-identify-law",
    title: "Texas Failure to Identify Law: Arrests, Detentions and Traffic Stops",
    dek: "What Texas Penal Code Section 38.02 actually requires after arrest, during detention and in a traffic stop, including the difference between refusing identifying information and giving false information.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Under Section 38.02(a), intentionally refusing to give name, residence address or date of birth after a lawful arrest and an officer's request is a Class C misdemeanor before any enhancement.",
      "During a lawful detention that has not become an arrest, Section 38.02(b) separately prohibits intentionally giving a false or fictitious name, residence address or date of birth; the general refusal provision in Subsection (a) is tied to lawful arrest.",
      "Since September 1, 2023, Subsection (b-1) contains a separate rule for a motor-vehicle operator lawfully detained for an alleged violation who fails to display a requested driver's license and intentionally refuses specified identifying information.",
      "The motor-vehicle provision recognizes that an actual current residence address can differ from the address associated with a driver's license and does not treat that difference alone as refusal when the address given is the person's actual residence.",
    ],
    intro: [
      "Texas failure-to-identify law is frequently oversimplified into 'you always have to identify yourself' or 'you never have to identify yourself during detention.' Penal Code Section 38.02 is more specific and treats lawful arrest, lawful detention, false information, witness requests and motor-vehicle stops differently.",
      "The 2023 motor-vehicle subsection is especially important because it added an identification duty for a lawfully detained driver under conditions that are not identical to the general arrest rule.",
    ],
    sections: [
      { heading: "Refusal after lawful arrest is the general Subsection (a) offense", paragraphs: ["Section 38.02(a) applies when a person intentionally refuses to give name, residence address or date of birth to a peace officer who has lawfully arrested the person and requested the information. The baseline offense under this subsection is a Class C misdemeanor."] },
      { heading: "False information during detention is treated differently", paragraphs: ["Section 38.02(b) makes it an offense to intentionally give a false or fictitious name, residence address or date of birth to an officer who has lawfully arrested or lawfully detained the person, or who has requested the information from a person the officer has good cause to believe is a witness to a criminal offense. The baseline offense under Subsection (b) is a Class B misdemeanor."] },
      { heading: "Drivers have a separate rule added in 2023", paragraphs: ["Subsection (b-1), added by SB 1551 effective September 1, 2023, applies to a motor-vehicle operator lawfully detained for an alleged violation who fails to provide or display a driver's license on request and then intentionally refuses to give the identifying information specified in the statute. The provision begins at the Class C level and has a Class B rule when a false or fictitious name is given during the offense."] },
      { heading: "Actual residence and license-record address are not always the same", paragraphs: ["Subsection (b-2) states that giving an actual residence address different from the address associated with the person's driver's license does not constitute refusal under the motor-vehicle subsection merely because the two addresses differ."] },
    ],
    faq: [
      { q: "Does Section 38.02(a) require every detained pedestrian to state a name?", a: "The refusal offense in Subsection (a) is written for a person who has been lawfully arrested. During lawful detention, Subsection (b) separately prohibits intentionally giving false identifying information. Other laws or circumstances can create additional duties, so the exact encounter matters." },
      { q: "Can giving a false name during a lawful detention be an offense?", a: "Yes. Section 38.02(b) covers intentionally giving false or fictitious identifying information during a lawful arrest or lawful detention and in the specified witness-request circumstance." },
      { q: "What changed for drivers in 2023?", a: "SB 1551 added Subsection (b-1), creating a separate failure-to-identify rule for a lawfully detained motor-vehicle operator who does not display a requested driver's license and intentionally refuses the identifying information specified by the statute." },
    ],
    sources: [
      { label: "Texas Penal Code § 38.02", url: "https://statutes.capitol.texas.gov/?artSec=38.02&chapter=PE.38&code=PE&tab=1" },
      { label: "Texas Legislature SB 1551 (2023), enrolled", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/SB01551F.htm" },
    ],
    related: [
      { label: "Texas evading arrest or detention", href: "/guides/texas-evading-arrest-detention-law" },
      { label: "Texas disorderly conduct", href: "/guides/texas-disorderly-conduct-law" },
      { label: "Texas vehicle handgun carry", href: "/guides/texas-vehicle-handgun-carry-law" },
    ],
  },
};
