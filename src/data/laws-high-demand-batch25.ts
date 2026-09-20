import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-09-14",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

const penal21 = { label: "Texas Penal Code Chapter 21 — Sexual Offenses", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.21.htm" };
const hb1465 = { label: "Texas Legislature Online — HB 1465, 89th Legislature", url: "https://capitol.texas.gov/billlookup/History.aspx?Bill=HB1465&LegSess=89R" };
const transport547 = { label: "Texas Transportation Code Chapter 547 — Vehicle Equipment", url: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.547.htm" };
const dpsTint = { label: "Texas DPS — Window Tinting Standards", url: "https://www.dps.texas.gov/section/vehicle-inspection/window-tinting-standards" };
const penal46 = { label: "Texas Penal Code Chapter 46 — Weapons", url: "https://statutes.capitol.texas.gov/Docs/PE/htm/PE.46.htm" };
const property24 = { label: "Texas Property Code Chapter 24 — Forcible Entry and Detainer", url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.24.htm" };
const cprc16 = { label: "Texas Civil Practice and Remedies Code Chapter 16 — Limitations", url: "https://statutes.capitol.texas.gov/Docs/CP/htm/CP.16.htm" };
const sb38 = { label: "Texas Legislature Online — SB 38, 89th Legislature", url: "https://capitol.texas.gov/billlookup/BillSummary.aspx?Bill=SB38&LegSess=89R" };

export const HIGH_DEMAND_BATCH25_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-hidden-camera-privacy-law": {
    ...common,
    slug: "texas-hidden-camera-privacy-law",
    title: "Texas Hidden Camera Law: Invasive Visual Recording, Consent and Private Places",
    dek: "What Texas Penal Code Section 21.15 actually prohibits, including intimate-area recording, recording in places where a person can reasonably expect to disrobe in privacy, consent, intent and the 2025 HB 1465 expansion.",
    keyTakeaways: [
      "Texas does not have one blanket rule that makes every hidden camera illegal; the location, subject, consent, intent and what is recorded matter.",
      "Penal Code Section 21.15 prohibits specified visual recording without consent and with intent to invade privacy, including images of an intimate area when it is reasonably expected not to be public.",
      "HB 1465 expanded Section 21.15 effective September 1, 2025 so the protected-place rule is not limited to bathrooms and changing rooms; it covers a place where a person reasonably expects to be able to disrobe in privacy, including a bedroom.",
      "A visual-recording question can overlap with different criminal, civil, employment, landlord or audio-interception rules. Section 21.15 is the core invasive-visual-recording statute, not a complete answer for every surveillance dispute.",
    ],
    intro: [
      "Searches for 'Texas hidden camera laws' often collapse several different questions into one. Texas criminal law focuses heavily on invasive visual recording: whether a person was recorded without consent, whether the recording targeted an intimate area or a protected private setting, and whether the actor intended to invade privacy.",
      "The law changed in 2025. HB 1465 broadened the protected-location language in Penal Code Section 21.15 and made invasive visual recording a reportable conviction or adjudication for sex-offender-registration purposes. The amendment applies to offenses committed on or after September 1, 2025.",
    ],
    sections: [
      { heading: "Section 21.15 is narrower than 'all secret recording'", paragraphs: ["The statute does not say that any camera hidden from view automatically creates the offense. The criminal elements include lack of consent and intent to invade another person's privacy, plus one of the forms of recording, broadcasting, transmitting or promoting covered by Section 21.15.", "That distinction matters for ordinary security cameras, doorbell cameras and cameras in public-facing spaces. A device being concealed is relevant context, but concealment alone is not the statutory test described in Section 21.15."] },
      { heading: "Intimate-area recording has its own privacy protection", paragraphs: ["Section 21.15 addresses photographing, recording, broadcasting or transmitting a visual image of another person's intimate area when that person reasonably expects the intimate area is not subject to public view. The statute defines the covered intimate areas rather than leaving the term entirely open-ended."] },
      { heading: "The 2025 law expanded protected private places", paragraphs: ["Before HB 1465, Section 21.15 expressly identified bathrooms and changing rooms in this part of the offense. The 2025 amendment replaced that narrow location wording with a defined place in which a person has a reasonable expectation of privacy: a place where a reasonable person would believe the person could disrobe in privacy without concern that the act would be visually recorded, broadcast or transmitted. The definition includes a bathroom, bedroom and changing room."], bullets: ["HB 1465 was signed May 29, 2025.", "The amendment took effect September 1, 2025.", "The change applies prospectively to offenses committed on or after the effective date."] },
      { heading: "Audio recording is a separate legal question", paragraphs: ["A camera may capture sound as well as video. Texas laws governing interception or recording of communications are not identical to Section 21.15's visual-recording rules. A person evaluating a specific camera system should identify whether it records audio, video or both and analyze the applicable law separately."] },
      { heading: "Private-property rules can add another layer", paragraphs: ["A recording that does not satisfy every element of Section 21.15 can still raise lease, workplace, tort, contract or other legal issues. The criminal statute should therefore be treated as a starting point for the specific invasive-visual-recording offense rather than permission to record anywhere the statute does not apply."] },
    ],
    faq: [
      { q: "Are hidden cameras illegal in Texas?", a: "Not categorically. Texas Penal Code Section 21.15 criminalizes specified nonconsensual visual recording done with intent to invade privacy, including covered intimate-area recordings and recordings in protected private places. Other laws can also apply depending on the facts." },
      { q: "Can someone legally put a hidden camera in a bedroom in Texas?", a: "A bedroom is expressly included in the post-September 1, 2025 definition of a place where a person may have the protected expectation of privacy described by Section 21.15. Whether a particular case satisfies every element still depends on consent, intent and the recording conduct." },
      { q: "Did Texas hidden-camera law change in 2025?", a: "Yes. HB 1465 expanded the protected-location language in Penal Code Section 21.15 effective September 1, 2025 and also changed sex-offender-registration treatment for the offense." },
    ],
    sources: [penal21, hb1465],
    related: [
      { label: "Texas Laws", href: "/laws" },
      { label: "Texas courts", href: "/texas-courts" },
      { label: "Texas landlord entry and tenant privacy", href: "/guides/texas-landlord-entry-privacy-law" },
    ],
  },

  "texas-window-tint-law": {
    ...common,
    slug: "texas-window-tint-law",
    title: "Texas Window Tint Law: 25% Rule, Windshield Limits, Medical Exceptions and Labels",
    dek: "Texas window-tint rules under Transportation Code Section 547.613 and current DPS standards, including the 25% light-transmission rule for driver-side windows, windshield placement and medical exceptions.",
    keyTakeaways: [
      "Texas Transportation Code Section 547.613 and DPS rules govern vehicle sunscreening and window tint; the rule depends on which window is tinted.",
      "DPS states that windows immediately to the driver's left and right must have at least 25 percent light transmission when the film and original glass are measured together.",
      "Windshield sunscreening generally must remain above the AS-1 line, or no more than five inches below the top when there is no AS-1 line, and must satisfy light-transmission, reflectance and color limits.",
      "Texas recognizes specified exemptions, including a medical exception supported by a signed statement from a licensed physician or optometrist.",
    ],
    intro: [
      "Texas window-tint law is more precise than a single percentage. The windshield, windows immediately beside the driver and other windows are treated differently, and the legal measurement considers the sunscreening device together with the vehicle's original glass.",
      "For current enforcement standards, the most useful pairing is Transportation Code Section 547.613 and the Texas Department of Public Safety window-tint standards page."
    ],
    sections: [
      { heading: "The front side-window benchmark is 25 percent light transmission", paragraphs: ["Texas DPS states that windows immediately to the right and left of the driver with less than 25 percent light transmission do not meet the standard. The measurement is for the combination of the original glass and the added sunscreening device, not simply the film manufacturer's nominal rating."] },
      { heading: "Windshield tint has placement, color and optical limits", paragraphs: ["Section 547.613 permits qualifying sunscreening on the windshield when it stays above the AS-1 line, or no more than five inches below the top if no AS-1 line exists. The combined windshield and sunscreening must transmit at least 25 percent of light, reflect no more than 25 percent of light and may not be red, blue or amber."] },
      { heading: "Medical exceptions use a signed medical statement", paragraphs: ["DPS says a motorist who needs the two front windows darker than the ordinary 25 percent requirement for medical reasons must keep a signed medical-exemption statement from a licensed physician or licensed optometrist. DPS no longer issues separate window-tint exemption certificates; the signed medical statement is the proof described by the agency."] },
      { heading: "Tint labels are part of the Texas compliance system", paragraphs: ["DPS interprets Transportation Code Section 547.609 and its administrative rule to require a compliance label, with the required wording placed in the rearmost bottom corner of the driver's-side window. The installer should follow the current DPS label standard rather than relying on an old sticker format."] },
      { heading: "Do not apply the front-window percentage to every piece of glass", paragraphs: ["The statute contains separate exceptions and conditions for different windows and vehicle configurations. Before buying film, check the exact window, vehicle type and any applicable exception on the current DPS standards page instead of assuming a universal statewide darkness percentage."] },
    ],
    faq: [
      { q: "What is the legal tint percentage in Texas?", a: "For windows immediately to the left and right of the driver, DPS states the combined glass and sunscreening must have at least 25 percent light transmission. Other windows and the windshield have different rules." },
      { q: "Can I tint the windshield in Texas?", a: "Qualifying sunscreening may be used above the AS-1 line, or within the top five inches when there is no AS-1 line, subject to the statutory light-transmission, reflectance and color limits. DPS also recognizes clear UV film under its current guidance." },
      { q: "Does Texas allow a medical window-tint exception?", a: "Yes. DPS describes a medical exception supported by a signed statement from a licensed physician or licensed optometrist identifying the driver or occupant and the medical need." },
    ],
    sources: [transport547, dpsTint],
    related: [
      { label: "Texas Laws", href: "/laws" },
      { label: "Texas driver license and vehicle laws", href: "/laws" },
      { label: "Texas speeding laws", href: "/guides/texas-speeding-laws-guide" },
    ],
  },

  "texas-knife-carry-law": {
    ...common,
    slug: "texas-knife-carry-law",
    title: "Texas Knife Laws: Carry Rules, Location-Restricted Knives and Prohibited Places",
    dek: "A current guide to Texas Penal Code Chapter 46, including the 5.5-inch location-restricted-knife definition, rules for people under 18 and places where carrying a location-restricted knife can be prohibited.",
    keyTakeaways: [
      "Texas Penal Code Section 46.01 defines a location-restricted knife as a knife with a blade over five and one-half inches.",
      "Texas law does not treat every knife as a location-restricted knife; blade length and the statutory definition matter.",
      "Section 46.02 imposes special restrictions on carrying a location-restricted knife for a person younger than 18 unless a listed exception applies, including being on the person's premises, in or en route to the person's vehicle or watercraft, or under direct parental or guardian supervision.",
      "Section 46.03 restricts weapons in specified places. The exact place and subsection matter, so a knife guide should not simply copy a handgun prohibited-place list and assume every rule is identical.",
    ],
    intro: [
      "Texas broadly liberalized knife law in 2017 by replacing the old 'illegal knife' framework with the narrower category of a 'location-restricted knife.' That does not mean a knife can be carried anywhere by anyone.",
      "The current starting point is Penal Code Chapter 46. The legal analysis turns on what the object is, blade length, the carrier's age and the location."
    ],
    sections: [
      { heading: "A location-restricted knife means a blade over 5.5 inches", paragraphs: ["Section 46.01 defines a knife as a bladed hand instrument capable of inflicting serious bodily injury or death by cutting or stabbing and defines a location-restricted knife as a knife with a blade over five and one-half inches. That threshold is central to the special location and youth-carry rules."] },
      { heading: "Adults and minors do not have identical carry rules", paragraphs: ["Section 46.02 contains a specific offense for a person younger than 18 who carries a location-restricted knife and does not fall within a listed exception. Exceptions include being on the person's own premises or premises under the person's control, being inside or directly en route to the person's own or controlled motor vehicle or watercraft, or being under the direct supervision of a parent or legal guardian."] },
      { heading: "Prohibited-place rules require reading Section 46.03 carefully", paragraphs: ["Section 46.03 identifies places where weapons offenses can apply, and the statute distinguishes among weapon types and subsections. Schools and educational activities, polling places during voting, courts or court offices, racetracks, secured airport areas and other listed locations can trigger restrictions depending on the weapon and circumstances.", "Do not assume a firearm exception, defense or signage rule automatically applies to a location-restricted knife. The statute should be checked for the exact place and weapon involved."] },
      { heading: "A 2025 proposal to loosen two knife locations did not become law", paragraphs: ["HB 2239 in the 89th Legislature proposed exceptions for location-restricted knives at certain 51-percent alcohol establishments and amusement parks. Texas Legislature Online shows the bill did not complete the legislative process. A proposed effective-date clause in a failed bill is not current law."] },
      { heading: "Local rules and other conduct can still matter", paragraphs: ["State preemption and local authority can be technical, and a knife can become evidence in a separate offense even when simple possession would otherwise be lawful. For a specific school, courthouse, event, private-property or criminal case, verify the current statute and any legally applicable local or property rule."] },
    ],
    faq: [
      { q: "How long can a knife blade be in Texas?", a: "Texas defines a 'location-restricted knife' as a knife with a blade over five and one-half inches. That does not create a universal 5.5-inch possession ban; it triggers special age and location rules." },
      { q: "Can an adult openly carry a knife in Texas?", a: "Texas generally does not use the old statewide 'illegal knife' category, but location-restricted knives remain subject to Penal Code Chapter 46 restrictions in specified places. Other criminal or property rules can also apply." },
      { q: "Can a person under 18 carry a location-restricted knife?", a: "Section 46.02 restricts that carry unless a statutory exception applies, including certain premises, vehicle or watercraft situations or direct supervision by a parent or legal guardian." },
    ],
    sources: [penal46, { label: "Texas Legislature Online — HB 2239, 89th Legislature bill stages", url: "https://capitol.texas.gov/billlookup/BillStages.aspx?Bill=HB2239&LegSess=89R" }],
    related: [
      { label: "Texas Laws", href: "/laws" },
      { label: "Texas firearm prohibited places", href: "/guides/texas-firearm-prohibited-places-law" },
      { label: "Texas gun and carry law", href: "/laws/topic/gun-carry-law" },
    ],
  },

  "texas-squatter-adverse-possession-law": {
    ...common,
    slug: "texas-squatter-adverse-possession-law",
    title: "Texas Squatter Rights and Adverse Possession: Eviction, Unauthorized Occupancy and Title Claims",
    dek: "Why 'squatter rights' is not one Texas doctrine, how unauthorized occupancy differs from adverse possession, the Chapter 24 eviction process and the separate statutory limitation periods for adverse-possession claims.",
    keyTakeaways: [
      "Texas law does not give a person ownership merely because the person moved into someone else's property and stayed there for a short period.",
      "Unauthorized occupancy and adverse possession are different legal questions: Chapter 24 addresses forcible entry, forcible detainer and eviction, while Civil Practice and Remedies Code Chapter 16 governs adverse-possession limitation periods and elements.",
      "Adverse possession requires actual and visible appropriation under a claim of right inconsistent with and hostile to another person's claim; different statutory paths have different requirements and time periods.",
      "SB 38 changed Texas eviction procedure for suits filed on or after January 1, 2026, including procedural rules intended to move possession disputes through justice court more predictably.",
    ],
    intro: [
      "'Squatter rights' is a search phrase, not a single Texas statute. A person occupying property without permission may face a possession or eviction case long before the facts could support an adverse-possession title claim. Treating the two concepts as interchangeable produces bad legal guidance.",
      "The correct Texas framework separates immediate possession from long-term title. Property Code Chapter 24 addresses forcible entry and detainer and the eviction process. Civil Practice and Remedies Code Chapter 16 defines adverse possession and provides several limitation periods whose requirements differ."
    ],
    sections: [
      { heading: "Unauthorized occupancy does not automatically become ownership", paragraphs: ["Chapter 16 defines adverse possession as actual and visible appropriation of real property, commenced and continued under a claim of right that is inconsistent with and hostile to another person's claim. Simply being present on property is not the full statutory test, and there is no general rule that a trespasser becomes the owner after a few days or months."] },
      { heading: "Texas has multiple adverse-possession limitation paths", paragraphs: ["Chapter 16 contains different limitation periods tied to different facts. The current statutes include a five-year provision requiring, among other things, use of the property, payment of applicable taxes and a claim under a duly registered deed; a ten-year provision for peaceable adverse possession by a person who cultivates, uses or enjoys the property; special rules for cotenant heirs; and 25-year provisions. The shortest number found in a search result cannot be applied without the accompanying statutory requirements."] },
      { heading: "Forcible entry and forcible detainer address possession", paragraphs: ["Property Code Chapter 24 says a person can commit forcible entry and detainer by entering another's property without legal authority or by force and refusing to surrender possession on demand. It separately addresses forcible detainer when a person who fits specified possession categories refuses to surrender possession after written demand. These are possession remedies, not shortcuts to adjudicating every possible title dispute."] },
      { heading: "SB 38 changed Texas eviction procedure in 2026", paragraphs: ["SB 38 was signed in 2025 and, except for its rulemaking section, took effect January 1, 2026. The law revised Chapter 24 eviction procedures, including justice-court jurisdiction, sworn petitions, trial postponements, appeals, rent payments during appeal and writ-of-possession procedures. The changes apply to eviction suits filed on or after January 1, 2026.", "That procedural reform does not erase adverse possession. It makes it even more important to identify whether the dispute is about immediate possession, a landlord-tenant relationship, unauthorized occupancy or an actual competing title claim."] },
      { heading: "Owners should avoid self-help assumptions", paragraphs: ["A property owner who discovers an unauthorized occupant should document ownership and possession facts and use the process that fits the situation. Whether police action, a Chapter 24 eviction, a trespass claim, a title action or another remedy is appropriate depends on facts that an evergreen guide cannot resolve. Changing locks, removing property or cutting utilities can create separate legal issues in some occupancy relationships."] },
    ],
    faq: [
      { q: "How long does a squatter have to live in a Texas property before owning it?", a: "There is no single answer. Texas adverse-possession statutes contain multiple limitation periods with different elements, and unauthorized occupancy alone does not satisfy them. For example, the five-year path has deed-and-tax requirements, while the ten-year path has different requirements." },
      { q: "Can a Texas property owner just remove a squatter?", a: "The correct process depends on the facts and claimed right of possession. Texas Property Code Chapter 24 provides forcible-entry, forcible-detainer and eviction procedures, and SB 38 revised those procedures for cases filed on or after January 1, 2026." },
      { q: "Are squatter rights and adverse possession the same thing?", a: "No. 'Squatter rights' is an informal search term. Adverse possession is a specific title doctrine under Chapter 16, while unauthorized occupancy can instead be a possession or eviction issue under Chapter 24." },
    ],
    sources: [cprc16, property24, sb38],
    related: [
      { label: "Texas Laws", href: "/laws" },
      { label: "Texas eviction process", href: "/guides/texas-eviction-process-timeline" },
      { label: "Texas eviction notice law", href: "/guides/texas-eviction-notice-law" },
    ],
  },
};