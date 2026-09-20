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
    title: "Do You Have to Show ID to Police in Texas? Arrests, Detentions and Traffic Stops",
    dek: "When Texas law requires identification or a driver's license during a police encounter, when it prohibits false information, and how the rules differ for arrests, detentions, drivers, passengers and witnesses.",
    updated: "2026-09-07",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not impose one blanket physical-ID rule for every police encounter. The legal duty depends on whether the person has been lawfully arrested or detained, is operating a motor vehicle, or is being questioned as a possible witness.",
      "After a lawful arrest, Penal Code § 38.02(a) makes it an offense to intentionally refuse an officer's request for your name, residence address or date of birth. That subsection requires identifying information; it does not itself say every arrested person must hand over a physical identification card.",
      "During a lawful detention that has not become an arrest, § 38.02(b) prohibits intentionally giving false or fictitious identifying information. The general refusal offense in § 38.02(a) is written for a lawful arrest, while drivers have a separate rule in § 38.02(b-1).",
      "A person operating a motor vehicle has additional obligations. Transportation Code § 521.025 requires a licensed driver to carry the appropriate driver's license while operating and display it on demand of a peace officer, magistrate or court officer.",
      "Giving false identifying information can carry a higher baseline penalty than the ordinary refusal offense, and § 38.02 contains additional enhancements in specified circumstances.",
    ],
    intro: [
      "The question 'Do I have to show ID to police in Texas?' sounds simple, but Texas law divides police encounters into several categories. Online slogans such as 'Texas is a stop-and-identify state,' 'you never have to identify unless you are arrested,' or 'you must show ID whenever an officer asks' are too broad to describe the statute accurately. The answer can change depending on whether the encounter is voluntary, whether the person is lawfully detained, whether an arrest has occurred, whether the person is driving, and whether the officer is asking a possible witness for information.",
      "The most important statute is Texas Penal Code § 38.02, Failure to Identify. It distinguishes refusing information after a lawful arrest from giving false information during a lawful arrest or detention. Since September 1, 2023, it also contains a separate provision for a motor-vehicle operator who is lawfully detained for an alleged violation, does not provide or display a driver's license when requested, and then intentionally refuses specified identifying information. Drivers are also covered by Transportation Code § 521.025, which independently requires a person who must hold a driver's license to possess and display it while operating a motor vehicle. This guide explains those rules in plain English; it is general information, not individualized legal advice about a particular stop or arrest.",
    ],
    sections: [
      {
        heading: "The short answer: sometimes you must identify yourself, but not every request is the same",
        paragraphs: [
          "Texas law does not treat every conversation with a police officer as the same kind of encounter. Penal Code § 38.02(a) addresses intentional refusal after a lawful arrest. Section 38.02(b) addresses false or fictitious information after a lawful arrest, during a lawful detention, or when an officer has good cause to believe a person witnessed a criminal offense. Section 38.02(b-1) creates a separate driver rule. Transportation Code § 521.025 separately requires licensed drivers to carry and display their driver's license while operating a motor vehicle.",
          "That structure also explains why 'show ID' can be misleading. A statute may require a person to give a name, residence address and date of birth without saying that the person must produce a physical card. A different statute can expressly require a driver to display a driver's license. The safest way to understand the issue is to ask what legal status applies to the encounter and what information or document the particular statute requires.",
        ],
      },
      {
        heading: "If you have been lawfully arrested, Section 38.02(a) requires identifying information",
        paragraphs: [
          "Penal Code § 38.02(a) says a person commits an offense if the person intentionally refuses to give a peace officer the person's name, residence address or date of birth after the officer has lawfully arrested the person and requested the information. Those elements matter: the statute refers to a lawful arrest, a request from the officer, an intentional refusal, and three categories of identifying information.",
          "The baseline offense under Subsection (a) is a Class C misdemeanor. Section 38.02(d) increases the punishment to a Class B misdemeanor if, at the time of the offense, the person was a fugitive from justice. The statute therefore does more than authorize an officer to ask questions after arrest; it creates a criminal consequence for intentionally refusing the specified information when the statutory conditions are met.",
          "Notice what Subsection (a) actually lists: name, residence address and date of birth. It does not use the phrase 'government-issued photo ID' and does not say that the only way to comply is by physically handing over a card. Other laws, booking procedures, court orders or circumstances can create separate obligations, but the failure-to-identify offense in Subsection (a) is framed around providing the specified information after a lawful arrest.",
        ],
      },
      {
        heading: "A lawful detention is different: do not confuse refusal with giving false information",
        paragraphs: [
          "A detention is not automatically an arrest, and § 38.02 treats those two situations differently. Subsection (b) makes it an offense to intentionally give a false or fictitious name, residence address or date of birth to a peace officer who has lawfully arrested or lawfully detained the person. The baseline offense under Subsection (b) is a Class B misdemeanor, and it can become a Class A misdemeanor under the fugitive enhancement in Subsection (d).",
          "For an ordinarily detained person who is not operating a motor vehicle under the special driver subsection, the general refusal language in § 38.02(a) is tied to lawful arrest. That is why the statement 'you must identify whenever you are detained' is too broad if it is based only on § 38.02(a). At the same time, the opposite slogan—'you can say anything you want if you are only detained'—is also wrong because Subsection (b) expressly prohibits intentionally giving false or fictitious identifying information during a lawful detention.",
          "Other Texas or federal laws can apply to particular people, places or circumstances, so a summary of § 38.02 should not be turned into a universal instruction to refuse an officer. The practical legal question is what authority applies to the specific encounter. If a stop later becomes an arrest, the statutory rule changes with that status.",
        ],
      },
      {
        heading: "Drivers have an additional duty to carry and display a driver's license",
        paragraphs: [
          "Traffic stops are the clearest situation in which a physical license matters. Transportation Code § 521.025 requires a person who is required to hold a driver's license to have the appropriate class of license in the person's possession while operating a motor vehicle and to display the license on demand of a magistrate, court officer or peace officer. The statute also authorizes a peace officer to stop and detain a motor-vehicle operator to determine whether the operator has the required license.",
          "Penal Code § 38.02(b-1), added by Senate Bill 1551 and effective September 1, 2023, adds another driver-specific rule. It applies when a motor-vehicle operator is lawfully detained for an alleged violation of law, fails to provide or display a driver's license when the officer requests it, and then intentionally refuses to give the person's name, driver's-license number, residence address or date of birth. The baseline offense under that subsection is a Class C misdemeanor.",
          "Those provisions are why advice written for a pedestrian cannot simply be copied into a traffic-stop situation. The driver is subject to specific licensing and identification statutes because the person is operating a motor vehicle. Whether another occupant of the vehicle has the same duty is a separate question.",
        ],
      },
      {
        heading: "What if the address on your driver's license is old?",
        paragraphs: [
          "The 2023 amendment anticipated a common real-world problem: a driver's current residence address may not match the address associated with the driver's license. Penal Code § 38.02(b-2) says that, for the motor-vehicle refusal offense, a person does not refuse to provide a residence address merely by giving an address different from the one associated with the license if the address given is the person's actual residence address.",
          "That protection is narrow. It explains what counts as refusal under § 38.02(b-1); it does not erase any separate legal duty a driver may have to update address information with the state. A driver should therefore distinguish between truthfully stating a current residence during the encounter and any separate administrative requirement concerning driver-license records.",
        ],
      },
      {
        heading: "Do passengers have to show ID during a Texas traffic stop?",
        paragraphs: [
          "Transportation Code § 521.025 is directed at the person operating the motor vehicle. A passenger is not automatically subject to the driver's carry-and-display duty merely because the vehicle has been stopped. The passenger's obligations instead depend on the passenger's own legal status and the circumstances of the encounter.",
          "If a passenger is lawfully detained, § 38.02(b) makes intentionally giving false or fictitious identifying information an offense. If the passenger is lawfully arrested and an officer requests the specified identifying information, § 38.02(a) applies to intentional refusal. Other statutes or facts can create additional duties, so 'passengers never have to identify' is too absolute. The key point is that the driver's license-display statute does not automatically convert every occupant into the operator.",
        ],
      },
      {
        heading: "What about a pedestrian or someone approached on the street?",
        paragraphs: [
          "An officer approaching a person and asking a question does not by itself tell you whether the encounter is voluntary, a lawful detention, or an arrest. Those categories carry different legal consequences. Section 38.02(a)'s refusal offense is tied to lawful arrest, while § 38.02(b)'s false-information rule expressly covers lawful detention.",
          "In a real encounter, a person can calmly ask whether the person is being detained or is free to leave. The officer's response can help clarify what the officer is asserting, although the ultimate legality of a detention or arrest depends on the facts and law rather than on a particular phrase. Disagreement about the legality of a stop should not be turned into physical resistance or flight; Texas has separate statutes governing resisting arrest and evading arrest or detention.",
        ],
      },
      {
        heading: "Witnesses are covered by the false-information provision",
        paragraphs: [
          "Section 38.02(b) is not limited to suspects. It also applies when a peace officer requests identifying information from a person the officer has good cause to believe is a witness to a criminal offense. In that circumstance, intentionally giving a false or fictitious name, residence address or date of birth can fall within the statute.",
          "The witness provision is another reason simple internet summaries can be incomplete. A person may not be arrested or accused of committing the underlying crime yet can still face a failure-to-identify issue if the statutory witness conditions are present and the person intentionally supplies false information.",
        ],
      },
      {
        heading: "Physical ID and identifying information are not identical concepts",
        paragraphs: [
          "Texas statutes use different words for different duties. Penal Code § 38.02(a) lists information: name, residence address and date of birth. The driver subsection lists name, driver's-license number, residence address and date of birth after the operator has failed to provide or display the requested driver's license. Transportation Code § 521.025 expressly says a driver must possess and display the license.",
          "Keeping those concepts separate makes the law much easier to understand. 'Identify yourself' may mean providing truthful identifying facts in one setting, while 'display your driver's license' means producing a particular document in another. A headline that treats the two as interchangeable can give a reader the wrong rule for the encounter the reader is actually facing.",
        ],
      },
      {
        heading: "Giving a false name can make the situation more serious",
        paragraphs: [
          "The penalty structure reflects a significant distinction between refusal and false information. The ordinary refusal offense under § 38.02(a) begins as a Class C misdemeanor. Intentionally giving false or fictitious identifying information under § 38.02(b) begins as a Class B misdemeanor. Fugitive status can increase those punishment levels under Subsection (d).",
          "For a driver charged under the motor-vehicle provision, § 38.02(d-1) raises the offense from the ordinary Class C level to a Class B misdemeanor if, during the commission of the offense, the person intentionally gives the officer a false or fictitious name. The safest factual takeaway is straightforward: Texas law repeatedly treats intentionally false identification as its own offense or enhancement, not as a harmless substitute for refusing to answer.",
        ],
      },
      {
        heading: "A quick scenario guide",
        bullets: [
          "Voluntary street encounter: a request for ID does not by itself establish that an arrest or detention has occurred. Determine what legal status the officer is asserting before applying the arrest or detention rules in § 38.02.",
          "Lawfully detained on foot but not arrested: § 38.02(b) prohibits intentionally giving false or fictitious name, residence address or date of birth. The general refusal offense in § 38.02(a) is written for lawful arrest.",
          "Lawfully arrested: after an officer requests it, intentionally refusing to provide name, residence address or date of birth can violate § 38.02(a).",
          "Driving and lawfully stopped: § 521.025 requires the licensed operator to carry and display the driver's license on demand. If the operator does not provide or display it, § 38.02(b-1) can require the specified identifying information when its conditions are met.",
          "Passenger in a stopped vehicle: the operator's license-display statute does not automatically apply to the passenger. The passenger's own detention, arrest and other facts determine which rules apply.",
          "Possible witness: if an officer has good cause to believe a person witnessed a criminal offense and requests identifying information, intentionally giving false or fictitious identifying information can violate § 38.02(b).",
        ],
      },
    ],
    faq: [
      { q: "Do you have to show ID to police in Texas?", a: "Sometimes, but there is no single rule for every encounter. After a lawful arrest, Penal Code § 38.02(a) requires the specified identifying information when requested. A driver has a separate duty under Transportation Code § 521.025 to carry and display a driver's license while operating. During an ordinary lawful detention, § 38.02(b) separately prohibits false identifying information." },
      { q: "Do I have to show a physical ID card if I am walking in Texas?", a: "Penal Code § 38.02(a) is written in terms of providing name, residence address and date of birth after a lawful arrest; it does not itself say every pedestrian must carry or hand over a physical ID card. Other laws or circumstances may apply, so the encounter's legal status matters." },
      { q: "Does a passenger have to show ID during a Texas traffic stop?", a: "The driver's license-display duty in Transportation Code § 521.025 applies to the motor-vehicle operator, not automatically to every passenger. A passenger can still have obligations under § 38.02 if lawfully detained or arrested, and other facts or laws can matter." },
      { q: "Does a Texas driver have to show a driver's license to police?", a: "Yes, when the driver is required to hold a license and is operating a motor vehicle. Transportation Code § 521.025 requires the driver to possess the appropriate license and display it on demand of a peace officer, magistrate or court officer." },
      { q: "What happens if a driver does not display a license during a lawful stop?", a: "Penal Code § 38.02(b-1) can apply when a motor-vehicle operator is lawfully detained for an alleged violation, fails to provide or display the requested driver's license, and intentionally refuses to provide the identifying information listed in that subsection." },
      { q: "Can you give police a fake name in Texas?", a: "Doing so can be a criminal offense. Section 38.02(b) prohibits intentionally giving false or fictitious name, residence address or date of birth in the lawful-arrest, lawful-detention and specified witness circumstances. The driver provision also has an enhancement for giving a false or fictitious name." },
      { q: "What if the address on my driver's license is different from where I actually live?", a: "For the motor-vehicle failure-to-identify provision, § 38.02(b-2) says providing an actual residence address does not constitute refusal merely because it differs from the address associated with the driver's license. Separate address-update requirements may still apply." },
      { q: "What are the penalties for failure to identify in Texas?", a: "The baseline level depends on the subsection. Ordinary refusal after lawful arrest under § 38.02(a) and the driver refusal offense under § 38.02(b-1) begin as Class C misdemeanors. False information under § 38.02(b) begins as a Class B misdemeanor. The statute contains enhancements for fugitive status and, in the driver provision, for a false or fictitious name." },
    ],
    sources: [
      { label: "Texas Penal Code § 38.02", url: "https://statutes.capitol.texas.gov/?artSec=38.02&chapter=PE.38&code=PE&tab=1" },
      { label: "Texas Transportation Code § 521.025", url: "https://statutes.capitol.texas.gov/?artSec=521.025&chapter=TN.521&code=TN&tab=1" },
      { label: "Texas Legislature SB 1551 (2023), enrolled", url: "https://capitol.texas.gov/tlodocs/88R/billtext/html/SB01551F.htm" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas Law Enforcement & Public Safety", href: "/texas-law-enforcement" },
      { label: "Texas law enforcement agencies compared", href: "/news/texas-policing-agencies-compared" },
      { label: "Texas evading arrest or detention", href: "/guides/texas-evading-arrest-detention-law" },
      { label: "Texas DWI law guide", href: "/guides/texas-dwi-law-guide" },
      { label: "Texas vehicle handgun carry", href: "/guides/texas-vehicle-handgun-carry-law" },
      { label: "Texas disorderly conduct", href: "/guides/texas-disorderly-conduct-law" },
    ],
  },
};
