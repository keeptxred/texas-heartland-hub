import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-15",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

const ageCode = { label: "Texas Alcoholic Beverage Code Chapter 106 — Age Provisions", url: "https://statutes.capitol.texas.gov/Docs/AL/htm/AL.106.htm" };
const hoursCode = { label: "Texas Alcoholic Beverage Code Chapter 105 — Hours of Sale and Consumption", url: "https://statutes.capitol.texas.gov/Docs/AL/htm/AL.105.htm" };
const penal49 = { label: "Texas Penal Code Chapter 49 — Intoxication and Open Container", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.49.htm" };
const mixedBeverage = { label: "Texas Alcoholic Beverage Code Chapter 28 — Mixed Beverage Permit", url: "https://statutes.capitol.texas.gov/Docs/AL/htm/AL.28.htm" };
const privateClub = { label: "Texas Alcoholic Beverage Code Chapter 32 — Private Club Registration Permit", url: "https://statutes.capitol.texas.gov/Docs/AL/htm/AL.32.htm" };
const consumerDelivery = { label: "Texas Alcoholic Beverage Code Chapter 57 — Consumer Delivery Permit", url: "https://statutes.capitol.texas.gov/Docs/AL/htm/AL.57.htm" };
const localStatus = { label: "Texas Alcoholic Beverage Code Chapter 251 — Local Option Status", url: "https://statutes.capitol.texas.gov/Docs/AL/htm/AL.251.htm" };
const localElection = { label: "Texas Election Code Chapter 501 — Local Option Elections", url: "https://statutes.capitol.texas.gov/Docs/EL/htm/EL.501.htm" };
const tabcFaq = { label: "Texas Alcoholic Beverage Commission — FAQs", url: "https://www.tabc.texas.gov/faqs/" };
const tabcDelivery = { label: "Texas Alcoholic Beverage Commission — Alcohol Delivery and Pickup", url: "https://www.tabc.texas.gov/texas-alcohol-laws-regulations/alcohol-delivery-pickup/" };

export const ALCOHOL_BATCH23_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-underage-drinking-law": {
    ...common,
    slug: "texas-underage-drinking-law",
    title: "Texas Underage Drinking Law: Purchase, Possession, Consumption and Parent Exceptions",
    dek: "Texas Alcoholic Beverage Code rules for people under 21, including purchase, possession and consumption offenses, visible-presence exceptions, emergency medical assistance and repeat-offense consequences.",
    keyTakeaways: [
      "Alcoholic Beverage Code Section 106.01 defines a minor as a person under 21 for purposes of the Code.",
      "Sections 106.02, 106.04 and 106.05 separately regulate a minor's purchase, consumption and possession of alcohol; the elements and exceptions are not identical.",
      "A minor may possess alcohol, and has an affirmative defense to consumption, in the visible presence of the minor's adult parent, guardian or spouse under the circumstances stated in Chapter 106.",
      "Section 106.05 contains a limited emergency-medical-assistance protection for a qualifying minor who is the first person to request help for a possible alcohol overdose, remains when required and cooperates with responders.",
    ],
    intro: ["Texas underage-alcohol law is broader than a simple age-21 purchase ban. Chapter 106 separately addresses buying, attempting to buy, possessing, consuming, misrepresenting age and driving or boating with detectable alcohol."],
    sections: [
      { heading: "Purchase, possession and consumption are separate offenses", paragraphs: ["A fact that creates a defense or exception to one Chapter 106 offense does not automatically erase every other offense. The specific section should be checked for the conduct involved."] },
      { heading: "Visible presence can matter with an adult parent, guardian or spouse", paragraphs: ["Section 106.05 permits possession in specified visible-presence circumstances, and Section 106.04 provides an affirmative defense to consumption when the beverage was consumed in the visible presence of the minor's adult parent, guardian or spouse."] },
      { heading: "Emergency assistance has a narrow safe harbor", paragraphs: ["The possession statute protects a qualifying minor who seeks emergency medical assistance for a possible alcohol overdose when the statutory first-caller, remaining-on-scene and cooperation conditions are satisfied."] },
      { heading: "Chapter 106 adds consequences beyond a basic fine", paragraphs: ["Section 106.071 generally classifies covered first offenses as Class C misdemeanors and also provides community-service, alcohol-awareness and driver's-license consequences, with enhanced treatment for repeat offenses."] },
    ],
    faq: [
      { q: "Can a Texas minor drink with a parent present?", a: "Chapter 106 provides a visible-presence affirmative defense to the minor-consumption offense when the adult is the minor's parent, guardian or spouse. Other laws and premises rules can still matter." },
      { q: "Can a minor possess alcohol with a parent present?", a: "Section 106.05 includes a visible-presence exception for an adult parent, guardian or spouse, along with other narrow exceptions." },
      { q: "Does calling 911 always erase a minor alcohol offense?", a: "No. The emergency protection is limited to specified possession and consumption circumstances and requires statutory conditions such as being the first caller and cooperating with responders." },
    ],
    sources: [ageCode, { label: "Texas Alcoholic Beverage Commission — Underage Drinking", url: "https://www.tabc.texas.gov/public-safety/age-verification/underage-drinking/" }],
    related: [
      { label: "Furnishing alcohol to minors", href: "/guides/texas-furnishing-alcohol-to-minor-law" },
      { label: "Texas fake-ID alcohol law", href: "/guides/texas-fake-id-alcohol-law" },
      { label: "Texas BYOB law", href: "/guides/texas-byob-law" },
    ],
  },

  "texas-furnishing-alcohol-to-minor-law": {
    ...common,
    slug: "texas-furnishing-alcohol-to-minor-law",
    title: "Texas Furnishing Alcohol to a Minor: Parent Exception and Criminal Penalties",
    dek: "When buying or giving alcohol to a person under 21 violates Texas law, the adult-parent/guardian/spouse visible-presence exception, Class A punishment and serious-injury enhancement.",
    keyTakeaways: [
      "Alcoholic Beverage Code Section 106.06 generally makes it an offense to purchase an alcoholic beverage for or give an alcoholic beverage to a minor.",
      "The statute permits an adult parent, guardian or spouse, or specified adult custodian, to furnish alcohol when that adult is visibly present while the minor possesses or consumes it.",
      "A basic Section 106.06 offense is a Class A misdemeanor.",
      "The offense becomes a state jail felony when the furnished alcohol is consumed by the minor and, as a result, the minor causes another person to suffer serious bodily injury or death.",
    ],
    intro: ["The Texas parent exception is narrow. It does not create a general right for any adult host to supply alcohol to minors, and simply having a parent somewhere nearby is not the same as the statutory visible-presence requirement."],
    sections: [
      { heading: "Section 106.06 prohibits purchasing or giving alcohol to a minor", paragraphs: ["The statute applies to the person who furnishes the beverage, separately from the minor's own possession or consumption offenses."] },
      { heading: "The family exception requires the right adult and visible presence", paragraphs: ["The exception covers the minor's adult parent, guardian or spouse and specified court-ordered custodians when the adult remains visibly present while the minor possesses or consumes the alcohol."] },
      { heading: "The ordinary offense is a Class A misdemeanor", paragraphs: ["Section 106.06 classifies the basic furnishing offense as Class A, making it materially more serious than the ordinary first minor-possession or consumption offense."] },
      { heading: "Serious injury or death can elevate the offense", paragraphs: ["The state-jail-felony enhancement applies when the minor's consumption of the furnished alcohol results in the minor causing serious bodily injury or death to another person."] },
    ],
    faq: [
      { q: "Can an unrelated adult legally give alcohol to a Texas minor if the minor's parent approves?", a: "Section 106.06's family exception is tied to the adult parent, guardian, spouse or specified custodian who is visibly present; informal permission to another adult is not the same rule." },
      { q: "What class of offense is furnishing alcohol to a minor?", a: "The basic offense is a Class A misdemeanor, with a state-jail-felony enhancement in the serious-injury or death circumstances stated by the statute." },
      { q: "Does the parent exception allow leaving the minor alone with alcohol?", a: "The statutory exception requires the qualifying adult to be visibly present while the minor possesses or consumes the beverage." },
    ],
    sources: [ageCode, tabcFaq],
    related: [
      { label: "Texas underage drinking law", href: "/guides/texas-underage-drinking-law" },
      { label: "Texas fake-ID alcohol law", href: "/guides/texas-fake-id-alcohol-law" },
      { label: "Texas BYOB law", href: "/guides/texas-byob-law" },
    ],
  },

  "texas-fake-id-alcohol-law": {
    ...common,
    slug: "texas-fake-id-alcohol-law",
    title: "Texas Fake ID and Alcohol Law: Misrepresenting Age and Seller ID Defenses",
    dek: "Texas rules when a minor falsely claims to be 21 or presents age documents to obtain alcohol, plus the separate apparently-valid government-ID defense available to some sellers.",
    keyTakeaways: [
      "Alcoholic Beverage Code Section 106.07 makes it an offense for a minor to falsely state that the minor is 21 or older or present a document indicating age 21 or older to a person selling or serving alcohol.",
      "Section 106.071 generally treats a first covered misrepresentation offense as a Class C misdemeanor and adds statutory community-service, education and driver's-license consequences.",
      "Section 106.03 separately provides a defense to a seller accused of selling to a minor when the minor displayed apparently valid government-issued identification meeting the statute's appearance requirements, subject to the electronically-invalid-ID limitation.",
      "Section 106.07 is an alcohol-age offense; possessing, altering or using a forged or fraudulent government document can implicate other criminal statutes depending on the document and conduct.",
    ],
    intro: ["Calling every underage alcohol-ID case a 'fake ID' case can hide two distinct legal questions: the minor's age misrepresentation under Section 106.07 and the seller's potential defense under Section 106.03."],
    sections: [
      { heading: "A false age statement can be enough", paragraphs: ["Section 106.07 is not limited to sophisticated counterfeit licenses. It covers falsely stating age 21 or older as well as presenting a document that indicates the minor is 21 or older to an alcohol seller or server."] },
      { heading: "Minor-offense punishment comes through Section 106.071", paragraphs: ["The ordinary first covered offense is Class C, with additional statutory consequences that can include community service, alcohol education and driver's-license suspension or denial."] },
      { heading: "Sellers have a separate apparently-valid-ID defense", paragraphs: ["Section 106.03 can protect a seller when the minor falsely represents age using apparently valid government-issued proof containing a consistent photograph and physical description. The defense does not apply when electronically readable information identifies the credential as invalid under the statute."] },
      { heading: "Document fraud can be a separate issue", paragraphs: ["A person who alters, possesses or uses another person's government credential may face laws beyond Chapter 106. The specific document and conduct determine whether another offense applies."] },
    ],
    faq: [
      { q: "Does a minor need a counterfeit driver's license to violate Section 106.07?", a: "No. Falsely stating age 21 or older to a person selling or serving alcohol can itself fall within the statute." },
      { q: "Does Texas require every adult alcohol buyer to show ID?", a: "State law does not generally require every person over 21 to present ID, but retailers commonly require it because selling to a minor carries criminal and licensing consequences." },
      { q: "Can a seller have a defense if a minor used convincing government ID?", a: "Section 106.03 provides a defense when its apparently-valid government-ID conditions are met, subject to the statute's electronic-invalid-ID limitation." },
    ],
    sources: [ageCode, tabcFaq],
    related: [
      { label: "Texas underage drinking law", href: "/guides/texas-underage-drinking-law" },
      { label: "Furnishing alcohol to minors", href: "/guides/texas-furnishing-alcohol-to-minor-law" },
      { label: "Texas alcohol sale hours", href: "/guides/texas-alcohol-sale-hours-law" },
    ],
  },

  "texas-alcohol-sale-hours-law": {
    ...common,
    slug: "texas-alcohol-sale-hours-law",
    title: "Texas Alcohol Sale Hours: Bars, Restaurants, Grocery and Convenience Stores",
    dek: "Current statewide alcohol sale hours for on-premises bars and restaurants and off-premises beer/wine retailers, including Sunday food-service rules and late-hours areas.",
    keyTakeaways: [
      "Texas Alcoholic Beverage Code Chapter 105 regulates hours of sale and consumption, while the exact hours depend on the license or permit type and whether a locality authorizes extended hours.",
      "TABC currently lists ordinary on-premises hours as 7 a.m.–midnight Monday through Friday, 7 a.m.–1 a.m. Saturday into Sunday, and noon–midnight Sunday, with 10 a.m.–noon Sunday sales allowed when alcohol is served with food.",
      "TABC currently lists ordinary off-premises beer and wine hours as 7 a.m.–midnight Monday through Friday, 7 a.m.–1 a.m. Saturday into Sunday, and 10 a.m.–midnight Sunday.",
      "A qualifying on-premises business in an area legal for late hours may sell for on-premises consumption until 2 a.m. when it holds the required late-hours authority; not every Texas bar automatically has 2 a.m. hours.",
    ],
    intro: ["Texas alcohol hours are permit-specific. A grocery store, liquor store, restaurant, winery and late-hours bar can all have different legal schedules, even in the same city."],
    sections: [
      { heading: "Chapter 105 supplies the statewide framework", paragraphs: ["The Code regulates ordinary and extended sale and consumption periods. Local wet/dry status and late-hours authorization can affect which privileges are available at a particular licensed location."] },
      { heading: "On-premises Sunday morning sales are conditional", paragraphs: ["Bars and restaurants generally may sell from noon Sunday, but current law permits 10 a.m.–noon Sunday service with food. Separate sports-venue, festival, fair and concert rules can also authorize Sunday morning sales."] },
      { heading: "Grocery and convenience beer/wine hours differ from liquor-store hours", paragraphs: ["Off-premises beer/wine retailers have broader Sunday hours than package stores. A consumer should not assume a grocery store and liquor store are governed by the same schedule."] },
      { heading: "Late-hours authority is location and permit dependent", paragraphs: ["A business can sell until 2 a.m. only when the locality is legally eligible for extended hours and the retailer has the appropriate late-hours authority. Public-consumption limits also extend slightly beyond the last lawful sale time under Chapter 105."] },
    ],
    faq: [
      { q: "Can a Texas restaurant sell alcohol at 10 a.m. Sunday?", a: "Current law generally allows on-premises Sunday sales from 10 a.m. to noon when alcohol is sold with food, with separate rules for qualifying venues and events." },
      { q: "Can a Texas bar always sell until 2 a.m.?", a: "No. The business must be in an area legal for extended hours and have the required late-hours authority." },
      { q: "Can a grocery store sell beer or wine on Sunday morning?", a: "Current TABC guidance lists off-premises beer/wine sales beginning at 10 a.m. Sunday." },
    ],
    sources: [hoursCode, tabcFaq],
    related: [
      { label: "Texas liquor-store hours", href: "/guides/texas-liquor-store-hours-sunday-law" },
      { label: "Texas wet and dry laws", href: "/guides/texas-wet-dry-local-option-law" },
      { label: "Texas alcohol-to-go law", href: "/guides/texas-alcohol-to-go-law" },
    ],
  },

  "texas-liquor-store-hours-sunday-law": {
    ...common,
    slug: "texas-liquor-store-hours-sunday-law",
    title: "Texas Liquor Store Hours: Sunday and Holiday Closures",
    dek: "Package-store hours in Texas, including the 10 a.m.–9 p.m. Monday–Saturday window, Sunday closure, Thanksgiving, Christmas and New Year's Day restrictions.",
    keyTakeaways: [
      "TABC currently lists Package Store Permit liquor-store sales as 10 a.m.–9 p.m. Monday through Saturday.",
      "Texas package stores are closed for liquor sales on Sunday.",
      "Package stores are also closed on Thanksgiving Day, Christmas Day and New Year's Day under the Chapter 105 framework.",
      "When Christmas Day or New Year's Day falls on Sunday, current TABC guidance states package stores are closed the following Monday as well.",
    ],
    intro: ["Texas liquor-store hours are more restrictive than grocery-store beer and wine hours. The Sunday and holiday package-store rules are a recurring source of confusion because they do not apply identically to every alcohol retailer."],
    sections: [
      { heading: "Package-store sales run 10 a.m. to 9 p.m. Monday through Saturday", paragraphs: ["A Package Store Permit covers retail liquor sales for off-premises consumption. Chapter 105 and TABC guidance impose the narrower package-store schedule."] },
      { heading: "Sunday package-store sales are prohibited", paragraphs: ["Unlike grocery and convenience stores selling authorized beer and wine, package stores do not receive a Sunday retail-sale window for liquor."] },
      { heading: "Three named holidays close package stores", paragraphs: ["Thanksgiving Day, Christmas Day and New Year's Day are statutory package-store closure days reflected in current TABC guidance."] },
      { heading: "Sunday Christmas or New Year's can carry the closure into Monday", paragraphs: ["Current TABC guidance states that if Christmas Day or New Year's Day falls on Sunday, the package store remains closed the following Monday."] },
    ],
    faq: [
      { q: "What time can Texas liquor stores sell Monday through Saturday?", a: "Current TABC guidance lists 10 a.m. to 9 p.m." },
      { q: "Can a Texas liquor store open on Sunday?", a: "Package stores are closed for liquor sales on Sunday under current state law." },
      { q: "Which holidays close Texas package stores?", a: "Thanksgiving Day, Christmas Day and New Year's Day, with a following-Monday rule when Christmas or New Year's falls on Sunday." },
    ],
    sources: [hoursCode, tabcFaq],
    related: [
      { label: "Texas alcohol sale hours", href: "/guides/texas-alcohol-sale-hours-law" },
      { label: "Texas wet and dry laws", href: "/guides/texas-wet-dry-local-option-law" },
      { label: "Texas alcohol delivery law", href: "/guides/texas-alcohol-delivery-law" },
    ],
  },

  "texas-open-container-vehicle-law": {
    ...common,
    slug: "texas-open-container-vehicle-law",
    title: "Texas Open Container Law: Alcohol in Motor Vehicles",
    dek: "Texas Penal Code Section 49.031 rules for open alcohol containers in a motor vehicle on a public highway, including the passenger-area definition, storage exceptions and passenger-transport/living-area exceptions.",
    keyTakeaways: [
      "Penal Code Section 49.031 generally prohibits knowingly possessing an open container of alcohol in the passenger area of a motor vehicle located on a public highway, regardless of whether the vehicle is being operated or is stopped or parked.",
      "The passenger area excludes a locked glove compartment or similar locked storage container, the trunk, and the area behind the last upright seat in a vehicle without a trunk.",
      "The offense does not apply to possession in the passenger area of a vehicle designed, maintained or used primarily to transport people for compensation or in the living quarters of a motorized house coach or motorized house trailer.",
      "Open-container possession is a separate offense from DWI; a person need not be intoxicated for Section 49.031 to apply.",
    ],
    intro: ["Texas open-container law focuses on where the open alcohol is located, not merely who owns it. The statute defines the passenger area and carves out specified storage, commercial-passenger and living-quarter locations."],
    sections: [
      { heading: "The prohibition applies on a public highway", paragraphs: ["Section 49.031 applies to a motor vehicle located on a public highway, including when the vehicle is stopped or parked. The State does not have to prove intoxication as an element of the open-container offense."] },
      { heading: "The passenger area excludes specified storage spaces", paragraphs: ["A locked glove box or similar locked storage container, a trunk and the area behind the last upright seat in a trunkless vehicle are excluded from the statutory passenger-area definition."] },
      { heading: "Certain passenger and living areas are excepted", paragraphs: ["The statute excludes qualifying vehicles primarily used to transport people for compensation and the living quarters of a motorized house coach or motorized house trailer."] },
      { heading: "DWI and open container are separate legal questions", paragraphs: ["An open-container citation does not itself prove intoxication, and a DWI does not require an open container. When both facts are present, Chapter 49 contains separate consequences that can interact."] },
    ],
    faq: [
      { q: "Can a passenger legally hold an open beer in an ordinary car on a Texas public highway?", a: "Section 49.031 generally prohibits open containers in the passenger area of an ordinary motor vehicle on a public highway, not only containers held by the driver." },
      { q: "Can an open bottle be carried in the trunk?", a: "The trunk is excluded from the statutory passenger-area definition." },
      { q: "Do you have to be drunk to violate the Texas open-container law?", a: "No. Open-container possession is a separate offense from DWI." },
    ],
    sources: [penal49, { label: "Texas Department of Transportation — Impaired Driving and Open Containers", url: "https://www.txdot.gov/safety/driving-laws/impaired-driving.html" }],
    related: [
      { label: "Texas DWI law", href: "/guides/texas-dwi-law-guide" },
      { label: "Texas alcohol-to-go law", href: "/guides/texas-alcohol-to-go-law" },
      { label: "Texas underage drinking law", href: "/guides/texas-underage-drinking-law" },
    ],
  },

  "texas-alcohol-to-go-law": {
    ...common,
    slug: "texas-alcohol-to-go-law",
    title: "Texas Alcohol-to-Go Law: Restaurant Pickup, Food Orders and Sealed Containers",
    dek: "Which Texas alcohol retailers may offer consumer pickup, when restaurant alcohol must accompany food, container rules and how permit type changes what may be sold to go.",
    keyTakeaways: [
      "Texas alcohol-to-go authority is permit-specific; not every alcohol business has the same pickup privileges.",
      "Current TABC guidance requires alcohol pickup from Mixed Beverage and specified Private Club permit holders to accompany a food order, while Wine and Malt Beverage Retailer's and Retail Dealer's On-Premise permit holders have different privileges.",
      "Businesses authorized to sell alcohol to go may generally accept the consumer's order or payment online or by phone under current TABC guidance.",
      "Container requirements depend on permit type: some retailers may use qualifying containers sealed by the license holder, while package-store and other off-premises sales can require unbroken original manufacturer-sealed containers.",
    ],
    intro: ["'Alcohol to go' is not one blanket privilege. Texas ties the beverage, food-order and packaging rules to the seller's TABC license or permit."],
    sections: [
      { heading: "Mixed Beverage and certain private-club pickup requires food", paragraphs: ["TABC's current pickup guidance states that MB, N, NE and NB alcohol pickup or to-go orders must accompany a food order, with the precise authorized beverage depending on the permit and certificate structure."] },
      { heading: "Beer-and-wine on-premises retailers use different rules", paragraphs: ["BG and BE retailers can have to-go authority for beverages their permits allow, and current TABC guidance does not impose the same food-order condition on those permit types."] },
      { heading: "Packaging depends on the permit", paragraphs: ["Some on-premises retailers may seal qualifying drinks themselves, while P, Q, BQ and BF off-premises transactions use manufacturer-sealed container rules described by TABC."] },
      { heading: "Pickup authority is different from delivery authority", paragraphs: ["A business that may hand a lawful to-go order to a consumer does not automatically have unrestricted authority to deliver it. Self-delivery and Consumer Delivery Permit rules should be checked separately."] },
    ],
    faq: [
      { q: "Can a Texas restaurant sell a margarita to go without food?", a: "For Mixed Beverage and specified Private Club pickup transactions, current TABC guidance requires the alcohol to accompany a food order." },
      { q: "Can a beer-and-wine retailer sell drinks to go without food?", a: "Current TABC guidance provides different pickup authority for BG and BE businesses and does not apply the same food-order requirement." },
      { q: "Does alcohol-to-go automatically mean the restaurant can deliver it anywhere?", a: "No. Delivery authority and delivery geography are separately regulated." },
    ],
    sources: [mixedBeverage, privateClub, tabcDelivery],
    related: [
      { label: "Texas alcohol delivery law", href: "/guides/texas-alcohol-delivery-law" },
      { label: "Texas open-container vehicle law", href: "/guides/texas-open-container-vehicle-law" },
      { label: "Texas alcohol sale hours", href: "/guides/texas-alcohol-sale-hours-law" },
    ],
  },

  "texas-alcohol-delivery-law": {
    ...common,
    slug: "texas-alcohol-delivery-law",
    title: "Texas Alcohol Delivery Law: Consumer Delivery Permits, Geography and Age Verification",
    dek: "How Texas retailers and Consumer Delivery Permit holders may deliver alcohol to consumers, where deliveries may go, permit-specific limits, original-container rules and delivery-age compliance.",
    keyTakeaways: [
      "Alcoholic Beverage Code Chapter 57 creates the Consumer Delivery Permit framework, and current TABC guidance also gives certain retailers self-delivery authority under their own permit types.",
      "A Consumer Delivery Permit holder may generally deliver an authorized retailer's order within the retailer's county to a location where sale of that beverage type is legal, with special rules for cities spanning county lines and locations near city limits.",
      "The types of alcohol, packaging and food-order requirements depend on the retailer that made the sale; a Consumer Delivery Permit does not expand the retailer's underlying sale authority.",
      "Delivery personnel must comply with age and intoxication restrictions and the applicable delivery-verification rules; delivery is not lawful merely because the consumer prepaid online.",
    ],
    intro: ["Texas separates the sale from the delivery. The retailer must be authorized to sell the beverage, and the person or business delivering it must use an authorized delivery route under the retailer's permit or Chapter 57."],
    sections: [
      { heading: "Chapter 57 governs third-party consumer delivery", paragraphs: ["A Consumer Delivery Permit allows qualifying permit holders to pick up alcohol sold by an authorized retailer and deliver it to consumers under the Code and TABC rules."] },
      { heading: "Delivery geography is not unlimited", paragraphs: ["TABC states that a CD holder can generally deliver anywhere in the retailer's county where sale of that beverage is legal, with additional rules for multi-county cities and locations within two miles of corporate limits in an adjacent county."] },
      { heading: "Retail permit type controls what can be delivered", paragraphs: ["Package stores, beer-and-wine retailers, Mixed Beverage businesses and other permit types have different beverage, food and packaging conditions. Delivery authority does not convert one permit into another."] },
      { heading: "Age and intoxication restrictions still apply at handoff", paragraphs: ["A prepaid order cannot lawfully be delivered to a minor or in another prohibited circumstance. TABC provides responsible-delivery training and guidance for verifying legal delivery conditions."] },
    ],
    faq: [
      { q: "Can a Texas delivery service deliver alcohol without TABC authority?", a: "A third-party alcohol delivery business generally needs the Chapter 57 Consumer Delivery Permit framework or another statutory authorization." },
      { q: "Can alcohol be delivered anywhere in Texas from one store?", a: "No. Delivery geography is tied to the retailer's location, permit and wet/dry status under current TABC rules." },
      { q: "Does online payment eliminate age verification?", a: "No. Legal sale and delivery restrictions still apply when the alcohol is handed to the consumer." },
    ],
    sources: [consumerDelivery, tabcDelivery],
    related: [
      { label: "Texas alcohol-to-go law", href: "/guides/texas-alcohol-to-go-law" },
      { label: "Texas wet and dry laws", href: "/guides/texas-wet-dry-local-option-law" },
      { label: "Texas underage drinking law", href: "/guides/texas-underage-drinking-law" },
    ],
  },

  "texas-byob-law": {
    ...common,
    slug: "texas-byob-law",
    title: "Texas BYOB Law: Restaurants, Bars, Corkage Fees and Local Rules",
    dek: "When customers may bring their own alcohol to Texas businesses, why Mixed Beverage and Private Club premises are different, corkage fees, unlicensed BYOB locations and local ordinances.",
    keyTakeaways: [
      "TABC states that Texas has no single statewide BYOB law governing every establishment, so city and county ordinances can matter.",
      "State law prohibits customers from bringing alcoholic beverages onto premises covered by a Mixed Beverage Permit or Private Club Registration Permit, subject to the Code's specific exceptions for authorized transactions.",
      "TABC states that BYOB can generally be allowed at an establishment that sells only beer and wine or at an establishment with no TABC permit, although the business may adopt stricter house rules.",
      "A business that permits BYOB may charge a corkage or setup fee, but an unlicensed business may not disguise an alcohol sale as a fee, donation or tip; selling alcohol requires the appropriate TABC authority.",
    ],
    intro: ["Texas BYOB law turns on the business's permit type and local rules. An establishment can be BYOB without holding a TABC permit, but that does not authorize it to sell the alcohol or ignore underage, consumption-hour or public-intoxication laws."],
    sections: [
      { heading: "There is no single statewide BYOB authorization", paragraphs: ["TABC expressly advises checking city or county ordinances. State law supplies important permit-specific prohibitions and alcohol-safety rules, while local government can add relevant BYOB restrictions."] },
      { heading: "Mixed Beverage and Private Club premises are different", paragraphs: ["TABC states that customers may not bring alcoholic beverages onto premises holding MB or N authority. Those permits operate under their own inventory and possession rules."] },
      { heading: "Beer/wine-only and unlicensed premises can allow BYOB", paragraphs: ["State law does not generally prohibit BYOB at a beer/wine-only restaurant or an establishment that has no alcohol permit, though the business may prohibit it and local ordinances may apply."] },
      { heading: "A corkage fee is not a license to sell alcohol", paragraphs: ["TABC allows a business to charge a fee for allowing the customer's own beverage, but an unlicensed business cannot sell alcohol or make purportedly free alcohol contingent on payment for another service in a way that constitutes an unlawful sale."] },
    ],
    faq: [
      { q: "Is BYOB legal everywhere in Texas?", a: "No single statewide BYOB rule governs every location. Permit type and local city or county ordinances matter." },
      { q: "Can I bring my own wine to a restaurant with a Mixed Beverage Permit?", a: "TABC states that bringing customer-owned alcohol onto MB or Private Club premises is illegal under the applicable Code rules." },
      { q: "Can a BYOB restaurant charge corkage?", a: "TABC says a business that allows customers to bring their own alcohol may charge a corkage or setup fee, but an unlicensed business still may not sell alcohol." },
    ],
    sources: [mixedBeverage, privateClub, tabcFaq],
    related: [
      { label: "Texas alcohol sale hours", href: "/guides/texas-alcohol-sale-hours-law" },
      { label: "Texas underage drinking law", href: "/guides/texas-underage-drinking-law" },
      { label: "Texas wet and dry laws", href: "/guides/texas-wet-dry-local-option-law" },
    ],
  },

  "texas-wet-dry-local-option-law": {
    ...common,
    slug: "texas-wet-dry-local-option-law",
    title: "Texas Wet and Dry Alcohol Laws: Local Option Elections and Beverage Types",
    dek: "How Texas cities, counties and justice precincts can have different wet/dry alcohol status, how local-option elections change legal sales, beverage-specific status and why one address can differ from nearby areas.",
    keyTakeaways: [
      "Alcoholic Beverage Code Section 251.71 defines an area as wet or dry with respect to particular alcoholic beverages based on whether sale of that beverage is lawful there.",
      "Texas local-option alcohol elections are conducted under Election Code Chapter 501 and can authorize or prohibit specified categories of alcoholic beverage sales rather than creating only one all-or-nothing statewide status.",
      "A wet or dry status generally remains in effect until changed through a later authorized local-option process or another specific statutory mechanism.",
      "City, justice-precinct and county statuses can interact under statutory priority rules, so the legal status of a particular address should be verified rather than inferred from the county name alone.",
    ],
    intro: ["Texas is not simply divided into wet counties and dry counties. Local-option history can produce beverage-specific rules at the city, justice-precinct or county level, and annexation or boundary changes can add another layer."],
    sections: [
      { heading: "Wet or dry status can be beverage specific", paragraphs: ["Section 251.71 defines status by the type and alcohol content of the beverage whose sale is lawful or prohibited. An area can therefore allow some alcohol sales while prohibiting others."] },
      { heading: "Chapter 501 governs local-option elections", paragraphs: ["Election Code Chapter 501 establishes petitions, ballot issues, voting units and election procedures for changing local alcohol-sale status."] },
      { heading: "Existing status persists until lawfully changed", paragraphs: ["Chapter 251 generally preserves a locality's prior wet/dry result until a later local-option election or a specific statutory procedure changes it."] },
      { heading: "The exact address matters", paragraphs: ["Section 251.73 and related provisions address conflicts among city, justice-precinct and county election results. TABC licensing also requires certification of the wet/dry status of the proposed premises."] },
    ],
    faq: [
      { q: "Can one Texas city allow liquor sales while another area in the same county does not?", a: "Yes. Local-option status can differ by authorized voting unit and by beverage or type of sale." },
      { q: "Does 'wet' always mean every type of alcohol sale is legal?", a: "No. Texas local-option status can be specific to beverage categories and sale types." },
      { q: "How does an area change from dry to wet or vice versa?", a: "The ordinary mechanism is a local-option election under Election Code Chapter 501, subject to the Alcoholic Beverage Code's status and boundary rules." },
    ],
    sources: [localStatus, localElection, { label: "Texas Alcoholic Beverage Commission — Local Option Elections", url: "https://www.tabc.texas.gov/public-information/local-option-elections/" }],
    related: [
      { label: "Texas alcohol sale hours", href: "/guides/texas-alcohol-sale-hours-law" },
      { label: "Texas alcohol delivery law", href: "/guides/texas-alcohol-delivery-law" },
      { label: "Texas BYOB law", href: "/guides/texas-byob-law" },
    ],
  },
};
