import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-15",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

const huntingLicense = { label: "Texas Parks and Wildlife Code Chapter 42 — Hunting Licenses", url: "https://statutes.capitol.texas.gov/Docs/PW/htm/PW.42.htm" };
const fishingLicense = { label: "Texas Parks and Wildlife Code Chapter 46 — Fishing Licenses", url: "https://statutes.capitol.texas.gov/Docs/PW/htm/PW.46.htm" };
const huntingGeneral = { label: "Texas Parks and Wildlife Code Chapter 62 — General Hunting Provisions", url: "https://statutes.capitol.texas.gov/Docs/PW/htm/PW.62.htm" };
const waterSafety = { label: "Texas Parks and Wildlife Code Chapter 31 — Water Safety Act", url: "https://statutes.capitol.texas.gov/Docs/PW/htm/PW.31.htm" };
const aquatic = { label: "Texas Parks and Wildlife Code Chapter 66 — Fish and Aquatic Plants", url: "https://statutes.capitol.texas.gov/Docs/PW/htm/PW.66.htm" };
const penal49 = { label: "Texas Penal Code Chapter 49 — Intoxication Offenses", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.49.htm" };
const penal30 = { label: "Texas Penal Code Chapter 30 — Burglary and Criminal Trespass", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.30.htm" };

export const OUTDOORS_BATCH22_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-fishing-license-law": {
    ...common,
    slug: "texas-fishing-license-law",
    title: "Texas Fishing License Law: Public Waters, Endorsements and Exceptions",
    dek: "Who generally needs a Texas fishing license, freshwater and saltwater endorsements, common age exceptions, private-water distinctions and TPWD's current purchase-identification process.",
    keyTakeaways: [
      "Parks and Wildlife Code Chapter 46 generally requires a fishing license to fish in Texas public water, subject to statutory and regulatory exceptions.",
      "TPWD requires the appropriate freshwater or saltwater endorsement when taking aquatic life in the corresponding public waters, unless an exception applies.",
      "Current TPWD rules exempt several groups from the ordinary recreational license requirement, including people under age 17; additional exceptions are specific and should be checked before relying on them.",
      "Effective August 3, 2026, TPWD added identity-validation requirements for recreational hunting and fishing license purchases by individuals age 17 and older; that purchase process is separate from the underlying Chapter 46 duty to be licensed while fishing.",
    ],
    intro: ["Texas fishing-license law is statewide, but the required package or endorsement depends on where and what a person is fishing for. Seasonal bag and length limits are separate rules and are intentionally not hard-coded into this evergreen guide."],
    sections: [
      { heading: "Chapter 46 creates the public-water license rule", paragraphs: ["Section 46.001 generally prohibits fishing in public water without a fishing license unless a statutory exception applies. TPWD's Outdoor Annual translates that framework into current recreational packages and endorsements."] },
      { heading: "Freshwater and saltwater endorsements matter", paragraphs: ["A basic license may be packaged with the endorsement required for inland or coastal public waters. Anglers moving between freshwater and saltwater should confirm that their package covers both environments."] },
      { heading: "Exceptions are narrower than 'private property'", paragraphs: ["License rules distinguish public water from truly private water and include age and other exceptions. Fishing public water from privately owned land can still require a license and landowner permission."] },
      { heading: "TPWD changed license-purchase ID validation in 2026", paragraphs: ["Beginning August 3, 2026, individuals age 17 and older must satisfy TPWD's current identification-validation process when purchasing recreational licenses, including independent validation for online purchases."] },
    ],
    faq: [
      { q: "Do Texas residents generally need a license to fish public water?", a: "Yes, unless a Chapter 46 or TPWD exception applies." },
      { q: "Does a freshwater license automatically cover saltwater fishing?", a: "Not necessarily. The appropriate endorsement or package must cover the water being fished." },
      { q: "Are children required to buy a Texas fishing license?", a: "Current TPWD rules generally exempt people under age 17 from the ordinary recreational fishing-license requirement." },
    ],
    sources: [fishingLicense, { label: "Texas Parks & Wildlife — Fishing Licenses and Packages", url: "https://tpwd.texas.gov/regulations/outdoor-annual/licenses/fishing-licenses-stamps-tags-packages/fishing-licenses-and-packages" }, { label: "Texas Parks & Wildlife — License Purchase Requirements", url: "https://tpwd.texas.gov/regulations/outdoor-annual/licenses/purchase-requirements" }],
    related: [
      { label: "Texas boat-drain invasive-species law", href: "/guides/texas-boat-drain-invasive-species-law" },
      { label: "Texas life-jacket law", href: "/guides/texas-life-jacket-law" },
      { label: "Texas boater education", href: "/guides/texas-boater-education-law" },
    ],
  },

  "texas-hunting-license-law": {
    ...common,
    slug: "texas-hunting-license-law",
    title: "Texas Hunting License Law: General License Rule, Endorsements and Feral-Hog Exception",
    dek: "Who generally needs a Texas hunting license, additional endorsements, landowner status, the private-property feral-hog exception and TPWD's current license-purchase ID requirements.",
    keyTakeaways: [
      "Parks and Wildlife Code Chapter 42 generally requires a person hunting birds or animals in Texas to have the appropriate hunting license unless an exception applies.",
      "Owning the land does not itself create a blanket hunting-license exemption because Texas wildlife is regulated as a public resource.",
      "Current TPWD rules state that no hunting license is required to hunt feral hogs on private property with landowner authorization, while other hunting, trespass and safety laws still apply.",
      "Effective August 3, 2026, recreational hunting-license purchasers age 17 and older are subject to TPWD identity-validation requirements when obtaining a license.",
    ],
    intro: ["A hunting lease or permission from a landowner answers the access question, not necessarily the licensing question. Texas separately regulates the hunter's license, hunter education, species endorsements, seasons and lawful means."],
    sections: [
      { heading: "Chapter 42 supplies the general license requirement", paragraphs: ["Texas generally requires a hunting license for a person hunting regulated birds or animals. The exact resident, nonresident, youth or package license depends on the hunter and species."] },
      { heading: "Landowners generally still need the required license", paragraphs: ["Private ownership of the land does not transfer ownership of wild game to the landowner or erase statewide hunting-license rules. Species-specific exceptions must come from law, not ownership alone."] },
      { heading: "Feral hogs have a specific private-property exception", paragraphs: ["TPWD currently states that a hunting license is not required to hunt feral hogs on private property with landowner authorization. That does not authorize trespass, unsafe shooting, or conduct prohibited by another statute."] },
      { heading: "Purchase identity validation changed in August 2026", paragraphs: ["TPWD now requires individuals age 17 and older to complete the current identification-validation process for recreational hunting and fishing license purchases, including online validation requirements."] },
    ],
    faq: [
      { q: "Do I need a hunting license on my own Texas land?", a: "Generally yes unless a specific exception applies; land ownership alone is not a blanket license exemption." },
      { q: "Do I need a Texas hunting license for feral hogs on private land?", a: "Current TPWD rules state no hunting license is required when hunting feral hogs on private property with landowner authorization." },
      { q: "Does a hunting license replace hunter education?", a: "No. Licensing and mandatory hunter-education compliance are separate requirements." },
    ],
    sources: [huntingLicense, { label: "Texas Parks & Wildlife — Hunting Licenses", url: "https://tpwd.texas.gov/regulations/outdoor-annual/licenses/hunting-licenses-and-permits/hunting-licenses" }, { label: "Texas Parks & Wildlife — License Purchase Requirements", url: "https://tpwd.texas.gov/regulations/outdoor-annual/licenses/purchase-requirements" }],
    related: [
      { label: "Texas hunter education", href: "/guides/texas-hunter-education-law" },
      { label: "Texas private-property hunting permission", href: "/guides/texas-hunting-private-property-permission-law" },
      { label: "Texas public-road hunting restrictions", href: "/guides/texas-public-road-hunting-law" },
    ],
  },

  "texas-hunter-education-law": {
    ...common,
    slug: "texas-hunter-education-law",
    title: "Texas Hunter Education Law: Birth-Date Rule, Accompaniment and Deferral",
    dek: "Who must complete Texas hunter education, the September 2, 1971 birth-date rule, age-based accompaniment requirements, proof of certification and the one-time adult deferral.",
    keyTakeaways: [
      "TPWD requires every hunter, including an out-of-state hunter, born on or after September 2, 1971 to satisfy Texas hunter-education requirements unless an applicable exemption applies.",
      "Minimum certification age is 9; hunters under 9 must be accompanied, and hunters ages 9 through 16 may hunt after certification or while accompanied as TPWD defines that term.",
      "A hunter age 17 or older who is subject to hunter education generally must be certified or may use the one-time Hunter Education Deferral while accompanied, if eligible for the deferral.",
      "Proof of certification or deferral must be carried while hunting, but proof is not required merely to purchase a hunting license.",
    ],
    intro: ["Hunter education and hunting licenses are separate systems. A hunter can sometimes buy a license without showing hunter-education proof and still violate the law by hunting without the required certification, deferral or accompaniment."],
    sections: [
      { heading: "September 2, 1971 is the key birth-date line", paragraphs: ["Current TPWD rules require hunters born on or after that date to satisfy the education framework. Statutory exemptions exist for specified military, National Guard and peace-officer service."] },
      { heading: "Age determines the available compliance route", paragraphs: ["Hunters under 9 must be accompanied; ages 9 through 16 may be certified or accompanied; subject hunters age 17 and older need certification or an eligible deferral with accompaniment."] },
      { heading: "Accompanied means close supervision", paragraphs: ["TPWD defines accompaniment as being with a person at least 17 who is licensed, hunter-education compliant or exempt, and within normal voice control."] },
      { heading: "Deferral is limited", paragraphs: ["The adult Hunter Education Deferral may generally be obtained only once and lasts through the current license year. A person disqualified by a prior hunter-education violation cannot rely on the deferral option."] },
    ],
    faq: [
      { q: "Who generally needs Texas hunter education?", a: "Hunters born on or after September 2, 1971, subject to the age rules and statutory exemptions." },
      { q: "Can I buy a hunting license before completing hunter education?", a: "Yes, but proof of certification, exemption or a valid deferral/accompaniment route is still required while hunting when the education law applies." },
      { q: "Can an adult use hunter-education deferrals every year?", a: "No. TPWD describes the deferral as a one-time option for an eligible hunter age 17 or older." },
    ],
    sources: [huntingGeneral, { label: "Texas Parks & Wildlife — Hunter Education", url: "https://tpwd.texas.gov/regulations/outdoor-annual/hunting/hunter-education/" }],
    related: [
      { label: "Texas hunting license law", href: "/guides/texas-hunting-license-law" },
      { label: "Texas private-property hunting permission", href: "/guides/texas-hunting-private-property-permission-law" },
      { label: "Texas public-road hunting law", href: "/guides/texas-public-road-hunting-law" },
    ],
  },

  "texas-hunting-private-property-permission-law": {
    ...common,
    slug: "texas-hunting-private-property-permission-law",
    title: "Texas Hunting on Private Property: Landowner Permission, Trespass and Game Retrieval",
    dek: "Why Texas hunters need landowner consent, how criminal-trespass notice works, hunting leases, retrieving wounded game or dogs, and why absence of a posted sign is not permission to hunt.",
    keyTakeaways: [
      "TPWD states that a hunter needs landowner consent to hunt on any private property in Texas; lack of a fence, sign or purple paint does not create hunting permission.",
      "Texas Penal Code Section 30.05 separately defines criminal trespass and recognizes notice through oral or written communication, fencing, signs, qualifying purple paint and other statutory forms.",
      "A hunting lease or invitation may authorize access subject to its terms, but it does not waive statewide hunting-license, season, species or safety laws.",
      "TPWD states that a person may not enter another person's property to retrieve wounded game, retrieve a dog or for another purpose without the landowner's consent.",
    ],
    intro: ["Texas has both wildlife-law consent rules and general criminal-trespass law. A hunter should obtain permission before entering or shooting onto private land rather than treating posting requirements as a substitute for consent."],
    sections: [
      { heading: "Hunting requires landowner authorization", paragraphs: ["TPWD's enforcement guidance states that consent is required to hunt on private property, even when there are no posted signs, fence or purple paint markings."] },
      { heading: "Criminal-trespass notice is a separate legal layer", paragraphs: ["Penal Code Section 30.05 defines notice through several methods, including oral or written communication, fencing, signs and qualifying purple-paint marks. A hunter can face both wildlife-law and trespass consequences depending on the facts."] },
      { heading: "Permission can be limited by the landowner", paragraphs: ["A landowner may grant, deny or condition hunting permission and may charge for a lease. Private terms can be stricter than statewide harvest rules so long as they do not authorize conduct prohibited by law."] },
      { heading: "Retrieval is not a self-help trespass exception", paragraphs: ["TPWD specifically warns that pursuing wounded game or retrieving a dog onto someone else's property requires consent. Hunters should contact the owner or law enforcement rather than enter without permission."] },
    ],
    faq: [
      { q: "Can I hunt land that is not posted in Texas?", a: "Not merely because it lacks signs. TPWD states that hunters need landowner consent to hunt private property." },
      { q: "Can purple paint provide criminal-trespass notice?", a: "Yes, when the marks satisfy the placement and size rules in Penal Code Section 30.05." },
      { q: "Can I cross a fence to retrieve a wounded deer?", a: "Not without the landowner's consent; TPWD states that game retrieval does not create an automatic entry right." },
    ],
    sources: [penal30, huntingGeneral, { label: "Texas Parks & Wildlife — Hunting Laws, Penalties and Restitution", url: "https://tpwd.texas.gov/regulations/outdoor-annual/hunting/general-regulations/laws-penalties-restitution" }],
    related: [
      { label: "Texas hunting license law", href: "/guides/texas-hunting-license-law" },
      { label: "Texas public-road hunting law", href: "/guides/texas-public-road-hunting-law" },
      { label: "Texas hunter education", href: "/guides/texas-hunter-education-law" },
    ],
  },

  "texas-public-road-hunting-law": {
    ...common,
    slug: "texas-public-road-hunting-law",
    title: "Texas Public-Road Hunting Law: Rights-of-Way and Shooting Across Roads",
    dek: "Texas restrictions on hunting from public roads and rights-of-way, shooting on or across a public road, private-property distance questions and the narrow reptile/amphibian exception.",
    keyTakeaways: [
      "Texas generally prohibits hunting wild animals or birds on a public road or the right-of-way of a public road, subject to a narrow nonlethal reptile-and-amphibian exception.",
      "Penal Code Section 42.01 separately prohibits intentionally or knowingly discharging a firearm on or across a public road.",
      "TPWD states there is no universal minimum number of feet a hunter on private property must stand away from a public road, but the hunter still may not discharge on or across the road and must obey local and other safety laws.",
      "Being inside a vehicle on a public road does not create a hunting exception; roadway, vehicle, species and means-and-method restrictions can overlap.",
    ],
    intro: ["The common 'how far from the road?' question has no single statewide distance answer. Texas instead uses roadway/right-of-way hunting bans, firearm-discharge restrictions and other local or species-specific rules."],
    sections: [
      { heading: "Hunting on the road or right-of-way is generally prohibited", paragraphs: ["TPWD's current Outdoor Annual lists hunting on public roads and rights-of-way as unlawful, except for the specific recreational reptile/amphibian provision using nonlethal means."] },
      { heading: "Shooting on or across a road is separately prohibited", paragraphs: ["Penal Code Section 42.01 addresses intentionally or knowingly discharging a firearm on or across a public road. That rule can apply even when the target itself is on lawful private land."] },
      { heading: "No single statewide setback applies on private land", paragraphs: ["TPWD enforcement guidance states there is no set distance from a public road for a hunter who is lawfully on private property, while emphasizing that the shot cannot be on or across the road."] },
      { heading: "Other restrictions can still control", paragraphs: ["County discharge ordinances, subdivision rules, city limits, dangerous-conduct laws and species-specific means-and-method regulations can make an otherwise off-road location unlawful or unsafe."] },
    ],
    faq: [
      { q: "How many feet from a Texas public road must a hunter be?", a: "TPWD states there is no general statewide setback when the hunter is on private property, but shooting on or across the road is prohibited and other laws may impose restrictions." },
      { q: "Can I hunt from the public-road right-of-way?", a: "Generally no. TPWD lists public-road and right-of-way hunting as unlawful, subject to the narrow reptile/amphibian exception." },
      { q: "Can I shoot across a road at game on the other side?", a: "No. Penal Code Section 42.01 prohibits intentionally or knowingly discharging a firearm on or across a public road." },
    ],
    sources: [huntingGeneral, { label: "Texas Penal Code Chapter 42 — Disorderly Conduct", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.42.htm" }, { label: "Texas Parks & Wildlife — Hunting Laws, Penalties and Restitution", url: "https://tpwd.texas.gov/regulations/outdoor-annual/hunting/general-regulations/laws-penalties-restitution" }],
    related: [
      { label: "Texas private-property hunting permission", href: "/guides/texas-hunting-private-property-permission-law" },
      { label: "Texas hunter education", href: "/guides/texas-hunter-education-law" },
      { label: "Texas hunting license law", href: "/guides/texas-hunting-license-law" },
    ],
  },

  "texas-boater-education-law": {
    ...common,
    slug: "texas-boater-education-law",
    title: "Texas Boater Education Law: Birth-Date, Horsepower and Age Rules",
    dek: "Who must complete Texas boater education, the September 1, 1993 birth-date rule, vessel thresholds, minimum operator age, supervision and proof requirements.",
    keyTakeaways: [
      "Texas requires boater education for a person born on or after September 1, 1993 who operates a motorboat with more than 15 horsepower, a windblown vessel over 14 feet, or a personal watercraft, subject to statutory supervision and exemptions.",
      "A person operating covered watercraft alone generally must satisfy the Water Safety Act's age and education rules; operators under 13 face additional restrictions.",
      "A person subject to mandatory boater education must carry proof of certification and photo identification while operating covered watercraft.",
      "TPWD recognizes approved equivalent education, including qualifying NASBLA-approved out-of-state courses, and provides a limited one-time deferral option under current rules.",
    ],
    intro: ["Boater education is tied to the operator's birth date and the type of vessel, not simply whether a boat is registered. The Water Safety Act also layers minimum-age and supervision rules onto certain vessels."],
    sections: [
      { heading: "September 1, 1993 is the main birth-date threshold", paragraphs: ["Current TPWD guidance requires covered operators born on or after that date to complete approved boater education unless a lawful supervision or exemption route applies."] },
      { heading: "The vessel thresholds are specific", paragraphs: ["Mandatory education applies to motorboats over 15 horsepower, windblown vessels over 14 feet, and personal watercraft. Smaller or different craft can still be subject to other safety laws."] },
      { heading: "Age and supervision matter", paragraphs: ["A person at least 13 who completed boater education may operate covered vessels under the statutory framework. Younger operators generally need an onboard adult who is at least 18 and can lawfully operate the vessel."] },
      { heading: "Carry certification and photo ID", paragraphs: ["TPWD requires covered operators to have boater-education proof and valid picture identification in their possession while operating, subject to recognized equivalency and deferral rules."] },
    ],
    faq: [
      { q: "Who generally must take Texas boater education?", a: "People born on or after September 1, 1993 who operate the covered motorboats, sailboats or personal watercraft, subject to statutory exceptions and supervision rules." },
      { q: "Does the rule apply to every small fishing boat?", a: "Not necessarily; the ordinary motor threshold is more than 15 horsepower, though other safety requirements still apply." },
      { q: "Does Texas recognize boater education from another state?", a: "TPWD recognizes qualifying NASBLA-approved courses from other states and territories." },
    ],
    sources: [waterSafety, { label: "Texas Parks & Wildlife — Mandatory Boater Education", url: "https://tpwd.texas.gov/regulations/outdoor-annual/boating/mandatory-boater-education-requirements" }],
    related: [
      { label: "Texas life-jacket law", href: "/guides/texas-life-jacket-law" },
      { label: "Texas personal-watercraft law", href: "/guides/texas-personal-watercraft-law" },
      { label: "Texas boating while intoxicated", href: "/guides/texas-boating-while-intoxicated-law" },
    ],
  },

  "texas-life-jacket-law": {
    ...common,
    slug: "texas-life-jacket-law",
    title: "Texas Life Jacket Law: Required PFDs for Adults, Children and Personal Watercraft",
    dek: "Texas life-jacket requirements by vessel and age, the under-13 wear rule, readily accessible adult PFDs, throwable devices on larger boats and stricter personal-watercraft rules.",
    keyTakeaways: [
      "Texas generally requires a U.S. Coast Guard-approved wearable personal flotation device of appropriate size for each person aboard a recreational vessel.",
      "On recreational vessels under 26 feet while underway, children younger than 13 must wear an approved life jacket rather than merely have one available.",
      "Adults generally must have required wearable PFDs readily accessible; vessel size and type can also trigger a throwable-device requirement.",
      "Personal-watercraft occupants must wear approved wearable PFDs, and inflatable PFDs are not approved for personal-watercraft use under current TPWD rules.",
    ],
    intro: ["Texas PFD law is not a single 'one jacket per boat' rule. It combines one-per-person equipment requirements with mandatory wearing rules for children, PWC occupants and certain activities."],
    sections: [
      { heading: "One approved wearable PFD per person is the baseline", paragraphs: ["Required safety-equipment rules call for properly sized, serviceable, Coast Guard-approved wearable flotation for each person aboard the vessel."] },
      { heading: "Children under 13 must wear one while underway", paragraphs: ["On recreational vessels under 26 feet, a child younger than 13 must wear an approved PFD while the vessel is underway, meaning not anchored, made fast to shore or aground."] },
      { heading: "Some vessels also need a throwable device", paragraphs: ["Boats 16 feet and longer generally require an approved throwable flotation device in addition to wearable PFDs, subject to vessel-specific rules."] },
      { heading: "PWC rules are stricter", paragraphs: ["Every PWC occupant, including a person being towed, must wear an approved wearable PFD. Inflatable PFDs are not approved for PWC use."] },
    ],
    faq: [
      { q: "Must adults wear a life jacket at all times in a Texas recreational boat?", a: "Not under the general adult rule, but the required wearable PFD must be readily accessible and activity-appropriate; some vessel and activity rules require actual wear." },
      { q: "At what age must a child wear a life jacket?", a: "Children younger than 13 must wear one on a recreational vessel under 26 feet while underway." },
      { q: "Can I use an inflatable life jacket on a jet ski?", a: "No. Current TPWD rules do not approve inflatable PFDs for personal-watercraft use." },
    ],
    sources: [waterSafety, { label: "Texas Parks & Wildlife — Life Jackets", url: "https://tpwd.texas.gov/education/boater-education/lifejacket" }, { label: "Texas Parks & Wildlife — Required Safety Equipment", url: "https://tpwd.texas.gov/regulations/outdoor-annual/boating/required-safety-equipment" }],
    related: [
      { label: "Texas boater education", href: "/guides/texas-boater-education-law" },
      { label: "Texas personal-watercraft law", href: "/guides/texas-personal-watercraft-law" },
      { label: "Texas boating while intoxicated", href: "/guides/texas-boating-while-intoxicated-law" },
    ],
  },

  "texas-boating-while-intoxicated-law": {
    ...common,
    slug: "texas-boating-while-intoxicated-law",
    title: "Texas Boating While Intoxicated Law: BWI, 0.08 BAC and Penalties",
    dek: "Texas Penal Code Section 49.06 boating-while-intoxicated rules, the statutory intoxication definition, misdemeanor and repeat-offense consequences, specimen refusal and open-container distinctions.",
    keyTakeaways: [
      "Texas Penal Code Section 49.06 makes it an offense to be intoxicated while operating a watercraft in a public place.",
      "Chapter 49 defines intoxication to include not having the normal use of mental or physical faculties because of alcohol, drugs or other listed substances, or having an alcohol concentration of 0.08 or more.",
      "BWI penalties can increase with prior intoxication convictions and can become substantially more serious when intoxicated operation causes serious bodily injury or death.",
      "Texas's motor-vehicle open-container statute does not generally prohibit an adult passenger from possessing an open alcoholic beverage merely because it is on a boat, but that does not permit an operator to be intoxicated and other public-intoxication or alcohol laws can apply.",
    ],
    intro: ["BWI is a criminal intoxication offense, not merely a boating citation. The safest legal distinction is between possession of alcohol on a vessel and operating the watercraft while intoxicated."],
    sections: [
      { heading: "Section 49.06 is the core BWI offense", paragraphs: ["The offense applies when a person is intoxicated while operating a watercraft in a public place. Watercraft has the meaning supplied by Chapter 49 and related law."] },
      { heading: "0.08 is one statutory route to intoxication", paragraphs: ["A BAC of 0.08 or higher satisfies the per-se concentration definition, but a lower BAC does not automatically defeat a case if the State proves loss of normal mental or physical faculties from alcohol, drugs or a combination."] },
      { heading: "Consequences escalate", paragraphs: ["A first BWI is generally a Class B misdemeanor with statutory minimum confinement provisions, and prior intoxication convictions can enhance punishment. Intoxication assault or manslaughter statutes apply when serious injury or death is caused."] },
      { heading: "Specimen refusal and open containers are separate issues", paragraphs: ["Water-safety enforcement can trigger driver's-license consequences for specified specimen refusals. Separately, Texas's motor-vehicle open-container law does not simply transfer to a boat, though public-intoxication and other alcohol rules remain relevant."] },
    ],
    faq: [
      { q: "What is the Texas BWI BAC limit?", a: "An alcohol concentration of 0.08 or more meets one statutory definition of intoxication, but impairment-based intoxication can also be proved." },
      { q: "Is BWI only a ticket?", a: "No. Section 49.06 is a criminal offense, generally a Class B misdemeanor for a basic first offense, with enhancements possible." },
      { q: "Is an open beer automatically illegal on a Texas boat?", a: "The motor-vehicle open-container law does not generally apply to watercraft, but the operator still cannot legally operate while intoxicated and other laws may apply." },
    ],
    sources: [penal49, { label: "Texas Parks & Wildlife — Water Safety Violations", url: "https://tpwd.texas.gov/warden/water" }, { label: "Texas Parks & Wildlife — Operation of Your Boat", url: "https://tpwd.texas.gov/regulations/outdoor-annual/boating/operation-of-your-boat" }],
    related: [
      { label: "Texas boater education", href: "/guides/texas-boater-education-law" },
      { label: "Texas life-jacket law", href: "/guides/texas-life-jacket-law" },
      { label: "Texas personal-watercraft law", href: "/guides/texas-personal-watercraft-law" },
    ],
  },

  "texas-personal-watercraft-law": {
    ...common,
    slug: "texas-personal-watercraft-law",
    title: "Texas Jet Ski and Personal Watercraft Law: Age, Life Jackets, Night Use and 50-Foot Rule",
    dek: "Texas PWC rules for jet skis and similar craft, including operator age, boater education, mandatory PFDs, sunset-to-sunrise prohibition, the 50-foot headway-speed rule and wake jumping.",
    keyTakeaways: [
      "Parks and Wildlife Code Section 31.106 imposes operating rules specific to personal watercraft in addition to the general Water Safety Act.",
      "A child under 13 may not operate a PWC unless accompanied on board by a person at least 18 who can lawfully operate it.",
      "Every PWC occupant must wear an approved wearable life jacket, and current TPWD rules do not approve inflatable PFDs for PWC use.",
      "Texas prohibits PWC operation at night and generally requires headway speed when operating within 50 feet of another vessel, PWC, platform, person, object or shore; reckless close wake-jumping is also prohibited.",
    ],
    intro: ["A personal watercraft is legally a type of motorboat but has extra operating restrictions. Jet-ski riders therefore need to comply with both general boating law and PWC-specific Section 31.106 rules."],
    sections: [
      { heading: "PWC operators face age and education requirements", paragraphs: ["Mandatory boater education applies to covered operators, and Section 31.106 adds the under-13 onboard-accompaniment rule for PWC operation."] },
      { heading: "PFD wear is mandatory", paragraphs: ["Unlike the general adult boat rule, every PWC occupant must actually wear an approved wearable PFD. A person being towed by the PWC is treated as an occupant for this requirement."] },
      { heading: "Night operation is prohibited", paragraphs: ["TPWD states that PWC operation is unlawful from sunset to sunrise. Navigation lights do not convert a PWC into a lawful nighttime vessel under this rule."] },
      { heading: "The 50-foot and wake rules target close operation", paragraphs: ["Within 50 feet of listed people, vessels, objects and shore, a PWC generally must remain at headway speed without creating a swell or wake. Reckless or unnecessarily close wake jumping is separately prohibited."] },
    ],
    faq: [
      { q: "Can a 12-year-old operate a jet ski alone in Texas?", a: "No. A person under 13 must have a qualifying adult on board." },
      { q: "Can a Texas PWC be operated after dark if it has lights?", a: "No. Current Texas rules prohibit PWC operation from sunset to sunrise." },
      { q: "Do PWC riders have to wear life jackets?", a: "Yes. Every occupant must wear an approved wearable PFD." },
    ],
    sources: [waterSafety, { label: "Texas Parks & Wildlife — Operation of Personal Watercraft", url: "https://tpwd.texas.gov/regulations/outdoor-annual/boating/personal-watercraft" }, { label: "Texas Parks & Wildlife — PWC Required Safety Equipment", url: "https://tpwd.texas.gov/regulations/outdoor-annual/boating/required-safety-equipment/personal-watercraft-required-safety-equipment" }],
    related: [
      { label: "Texas boater education", href: "/guides/texas-boater-education-law" },
      { label: "Texas life-jacket law", href: "/guides/texas-life-jacket-law" },
      { label: "Texas boating while intoxicated", href: "/guides/texas-boating-while-intoxicated-law" },
    ],
  },

  "texas-boat-drain-invasive-species-law": {
    ...common,
    slug: "texas-boat-drain-invasive-species-law",
    title: "Texas Boat Drain and Invasive-Species Law: Clean, Drain and Dry Requirements",
    dek: "Texas requirements to drain water and remove harmful aquatic plants before moving boats and gear, plus the Clean-Drain-Dry practices TPWD recommends to stop invasive mussels and plants.",
    keyTakeaways: [
      "Texas law and TPWD regulations require boaters to drain water from boats and specified gear before approaching or leaving public fresh water, subject to stated exceptions.",
      "It is unlawful to fail to immediately remove and lawfully dispose of harmful or potentially harmful aquatic plants attached to a vessel, trailer, vehicle or launching/transport device.",
      "The legal drain-and-remove duties are minimum requirements; TPWD additionally recommends cleaning mud and plant material and thoroughly drying boats and gear before moving between waters.",
      "A boat stored in water known to contain invasive mussels can require special decontamination precautions before transport; TPWD advises contacting the agency for guidance in that situation.",
    ],
    intro: ["Texas aquatic-invasive-species law follows the boat from lake to lake. The statewide goal is to prevent residual water, attached vegetation and invasive mussels from hitchhiking into new public waters."],
    sections: [
      { heading: "Drain water before moving between public fresh waters", paragraphs: ["TPWD's Outdoor Annual states that boaters must drain all water from the boat and gear before approaching or leaving a public freshwater body. The exact statutory and regulatory exceptions should be checked for specialized operations."] },
      { heading: "Attached harmful plants must be removed", paragraphs: ["Failing to immediately remove and lawfully dispose of harmful or potentially harmful aquatic plants attached to a vessel, trailer, motor vehicle or transport/launch device is unlawful."] },
      { heading: "Clean, drain and dry is broader than the minimum drain rule", paragraphs: ["TPWD recommends removing plants, mud and debris, draining motors, bilges, livewells and bait buckets, and allowing equipment to dry thoroughly before entering another water body."] },
      { heading: "Mussel-infested stored boats need extra care", paragraphs: ["A vessel stored in infested water can carry adult mussels or microscopic larvae even after ordinary draining. TPWD advises contacting the agency before moving a boat known or suspected to be infested."] },
    ],
    faq: [
      { q: "Do I need to drain livewells before leaving a Texas lake?", a: "The statewide drain-water rule applies to boats and specified gear around public fresh water, subject to regulatory exceptions; TPWD recommends fully draining livewells and bait buckets." },
      { q: "Is removing visible plants enough?", a: "No. Removal of harmful plants is one legal duty; draining residual water and following Clean-Drain-Dry practices address other invasive species risks." },
      { q: "What if my boat has been stored in an invasive-mussel lake?", a: "TPWD advises contacting the agency for decontamination guidance before transporting the boat." },
    ],
    sources: [aquatic, { label: "Texas Parks & Wildlife — Clean, Drain, Dry Your Boat", url: "https://tpwd.texas.gov/regulations/outdoor-annual/boating/clean-drain-dry-your-boat" }, { label: "Texas Parks & Wildlife — July 2026 Invasive Species Reminder", url: "https://tpwd.texas.gov/newsmedia/releases/?req=20260702a" }],
    related: [
      { label: "Texas fishing license law", href: "/guides/texas-fishing-license-law" },
      { label: "Texas boater education", href: "/guides/texas-boater-education-law" },
      { label: "Texas life-jacket law", href: "/guides/texas-life-jacket-law" },
    ],
  },
};
