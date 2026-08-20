import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FIREARMS_CARRY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-open-carry-law": {
    slug: "texas-open-carry-law",
    title: "Texas Open Carry Law: Holsters, Private Property and Location Limits",
    dek: "What Texas law means by open carry, when a handgun must be holstered, how private-property notice works, and why open carry is not allowed everywhere licensed carry is allowed.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas law generally requires an openly carried handgun to be in a holster when the person is otherwise authorized to carry it.",
      "Texas removed the former belt-or-shoulder-holster wording in 2021; DPS says state law does not require a particular holster style.",
      "A property owner may prohibit openly carried handguns by giving effective notice under Penal Code Section 30.07.",
      "Open carry is prohibited in some places where a license holder may carry concealed, including the campus-carry framework for institutions of higher education.",
    ],
    intro: [
      "Open carry is legal in Texas in many circumstances, but the visible-handgun rules are not identical to concealed carry rules.",
      "The key questions are whether the person may legally carry, whether the handgun is properly holstered, whether the location is prohibited by law, and whether the property owner has given effective notice against open carry.",
    ],
    sections: [
      { heading: "An openly carried handgun generally must be holstered", paragraphs: ["DPS states that when Texas law authorizes open carry, the handgun must generally be carried in a holster. Since September 1, 2021, Texas law no longer limits that rule to a belt or shoulder holster."] },
      { heading: "Private property can prohibit open carry", paragraphs: ["Penal Code Section 30.07 provides a notice mechanism for a property owner or a person with apparent authority to prohibit a license holder from entering with an openly carried handgun. Oral notice can also matter under the statute."] },
      { heading: "Open carry and concealed carry are not interchangeable", paragraphs: ["Texas campus carry is a leading example: Government Code Section 411.2031 permits qualifying license holders to carry concealed on covered higher-education campuses subject to lawful institutional rules, while open carry remains prohibited there."] },
      { heading: "Prohibited-place rules apply first", paragraphs: ["Penal Code Section 46.03 identifies locations where weapons are prohibited. A person should not assume that a holster or an LTC overrides a statutory prohibited place unless a specific exception or defense applies."] },
    ],
    faq: [
      { q: "Does Texas require a belt or shoulder holster?", a: "No. DPS states that the belt-or-shoulder wording was removed effective September 1, 2021. The handgun must still be holstered when carried openly under the applicable law." },
      { q: "Can a store prohibit open carry?", a: "Yes. Private-property owners may give effective notice under Penal Code Section 30.07, including through a compliant posted sign or other statutory notice." },
      { q: "Can I open carry on a college campus with an LTC?", a: "No. DPS states that campus carry is concealed carry; open carry on a college campus remains prohibited." },
    ],
    sources: [
      { label: "Texas Penal Code § 30.07", url: "https://statutes.capitol.texas.gov/?artSec=30.07&chapter=PE.30&code=PE&tab=1" },
      { label: "Texas Penal Code Chapter 46", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=PE.46&code=PE&tab=1" },
      { label: "Texas DPS Carrying a Handgun FAQs", url: "https://www.dps.texas.gov/section/handgun-licensing/faq/laws-relate-carrying-handgun-faqs" },
    ],
    related: [
      { label: "Texas handgun signs", href: "/guides/texas-30-05-30-06-30-07-signs-guide" },
      { label: "Texas prohibited carry locations", href: "/guides/texas-firearm-prohibited-places-law" },
      { label: "Texas permitless carry", href: "/guides/texas-permitless-carry-law" },
    ],
  },

  "texas-30-05-30-06-30-07-signs-guide": {
    slug: "texas-30-05-30-06-30-07-signs-guide",
    title: "Texas 30.05, 30.06 and 30.07 Signs: What Each Handgun Notice Means",
    dek: "A practical guide to Texas private-property firearm notices: criminal trespass under Section 30.05, concealed-handgun notice under Section 30.06, and open-carry notice under Section 30.07.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Sections 30.06 and 30.07 are separate notice statutes aimed at license holders carrying concealed and openly carried handguns, respectively.",
      "A posted 30.06 or 30.07 sign must use the statutory English and Spanish text, contrasting colors, block letters at least one inch high, and the visibility requirements specified by the statute.",
      "Section 30.05 is the broader criminal-trespass statute and contains firearm-related notice provisions relevant to people carrying without an LTC.",
      "Oral notice can be legally significant; a person who receives personal notice to leave should not assume a defective sign creates permission to remain.",
    ],
    intro: [
      "Texas handgun signage is often reduced to three numbers, but those numbers do different jobs. A 30.06 sign addresses concealed carry by a license holder, a 30.07 sign addresses open carry by a license holder, and Section 30.05 contains broader trespass rules that can apply to firearm carry without a license.",
      "Because notice can be written or oral and the statutes contain exceptions and defenses, the sign on the door is only one part of the legal analysis.",
    ],
    sections: [
      { heading: "Section 30.06 addresses concealed carry by a license holder", paragraphs: ["Penal Code Section 30.06 creates trespass rules for a license holder who carries a concealed handgun on property after receiving effective notice that concealed handguns are prohibited."] },
      { heading: "Section 30.07 addresses openly carried handguns", paragraphs: ["Section 30.07 separately addresses a license holder who openly carries a handgun after effective notice. DPS states that a posted 30.07 sign must contain the statutory bilingual wording, use contrasting colors and one-inch block letters, and be conspicuously displayed at each entrance."] },
      { heading: "Section 30.05 matters for unlicensed carry", paragraphs: ["Section 30.05 is Texas's general criminal-trespass statute and includes firearm-specific notice provisions. That means a person relying on permitless carry should not treat 30.06 and 30.07 as the only private-property rules that can matter."] },
      { heading: "Personal notice changes the analysis", paragraphs: ["DPS emphasizes that property owners can provide notice through oral communication in addition to qualifying signs or documents. For 30.06 and 30.07 offenses, failing to depart after personal oral notice can also affect the offense level under the statute."] },
    ],
    faq: [
      { q: "What does a 30.06 sign prohibit?", a: "It gives statutory notice against carrying a concealed handgun by a person licensed under Government Code Chapter 411, Subchapter H." },
      { q: "What does a 30.07 sign prohibit?", a: "It gives statutory notice against a license holder entering with an openly carried handgun." },
      { q: "Do 30.06 and 30.07 signs cover every person carrying without a license?", a: "No. Section 30.05 contains separate criminal-trespass and firearm-notice provisions relevant to unlicensed carry, so all three statutes may need to be reviewed." },
    ],
    sources: [
      { label: "Texas Penal Code § 30.05", url: "https://statutes.capitol.texas.gov/?artSec=30.05&chapter=PE.30&code=PE&tab=1" },
      { label: "Texas Penal Code § 30.06", url: "https://statutes.capitol.texas.gov/?artSec=30.06&chapter=PE.30&code=PE&tab=1" },
      { label: "Texas Penal Code § 30.07", url: "https://statutes.capitol.texas.gov/?artSec=30.07&chapter=PE.30&code=PE&tab=1" },
      { label: "Texas DPS Carrying a Handgun FAQs", url: "https://www.dps.texas.gov/section/handgun-licensing/faq/laws-relate-carrying-handgun-faqs" },
      { label: "Texas Legislature HB 4995 (2025), enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB04995F.HTM" },
    ],
    related: [
      { label: "Texas open carry", href: "/guides/texas-open-carry-law" },
      { label: "Texas permitless carry", href: "/guides/texas-permitless-carry-law" },
      { label: "Texas prohibited carry locations", href: "/guides/texas-firearm-prohibited-places-law" },
    ],
  },
};
