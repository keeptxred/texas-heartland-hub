import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CRIMINAL_PROPERTY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-criminal-trespass-law": {
    slug: "texas-criminal-trespass-law",
    title: "Texas Criminal Trespass Law: Notice, Property Types and Penalties",
    dek: "A plain-English guide to Texas Penal Code Section 30.05: what counts as criminal trespass, how notice can be given, when remaining after notice matters, and why the offense level depends on the property and circumstances.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas criminal trespass generally requires entering or remaining on property of another without effective consent after the person had notice that entry was forbidden or received notice to depart and failed to do so.",
      "Notice is broader than a posted sign; Section 30.05 recognizes several forms of notice, including oral or written communication, fencing or other enclosure designed to exclude intruders, and certain signs or markings.",
      "The offense level is not one-size-fits-all. Section 30.05 grades trespass differently depending on the property, location, notice, and other statutory circumstances.",
      "Criminal trespass is distinct from burglary. Trespass focuses on unauthorized entry or remaining after notice, while burglary under Section 30.02 adds different elements involving entry with intent to commit, attempting to commit, or committing specified offenses.",
    ],
    intro: [
      "Texas criminal trespass is often described as simply being somewhere you are not allowed to be, but the statute is more specific. The core questions are whether the property belonged to another, whether the person lacked effective consent, and whether legally sufficient notice made the entry or continued presence forbidden.",
      "The same section also contains special rules for certain property and firearm-related notice. This guide focuses on the general trespass framework and does not substitute for reviewing the exact subsection that applies to a specific location.",
    ],
    sections: [
      { heading: "The core rule is entry or remaining after notice", paragraphs: ["Penal Code Section 30.05 generally applies when a person enters or remains on or in property of another without effective consent and the person had notice that the entry was forbidden or received notice to depart but failed to do so."] },
      { heading: "Notice can take several forms", paragraphs: ["The statute recognizes more than a conventional 'No Trespassing' sign. Depending on the circumstances, notice can include oral or written communication by an owner or authorized person, fencing or other enclosure obviously designed to exclude intruders, qualifying signs, and certain identifying marks or cultivated-crop conditions described by the statute."] },
      { heading: "Penalties depend on the place and facts", paragraphs: ["Section 30.05 contains multiple punishment levels and special categories. A general trespass may be a misdemeanor, while entry into or onto certain places or under specified circumstances can increase the grade. The exact property type and subsection matter before assigning a penalty level."] },
      { heading: "Trespass and burglary are different offenses", paragraphs: ["Criminal trespass does not require the same additional criminal intent that burglary can require. Burglary is separately defined in Section 30.02, so an unauthorized entry should not automatically be described as burglary without checking those additional statutory elements."] },
    ],
    faq: [
      { q: "Do I have to see a No Trespassing sign before Section 30.05 can apply?", a: "No. Texas law recognizes several forms of notice, including oral or written notice and some physical enclosures or markings. A posted sign is only one possible method." },
      { q: "If an owner tells someone to leave, can staying become trespass?", a: "Yes. Section 30.05 expressly covers remaining on property after receiving notice to depart and failing to do so, assuming the other statutory elements are satisfied." },
      { q: "Is criminal trespass the same as burglary?", a: "No. Burglary is a separate offense under Penal Code Section 30.02 and has additional elements. The two statutes should be analyzed separately." },
    ],
    sources: [
      { label: "Texas Penal Code § 30.05", url: "https://statutes.capitol.texas.gov/?artSec=30.05&chapter=PE.30&code=PE&tab=1" },
      { label: "Texas Penal Code § 30.02", url: "https://statutes.capitol.texas.gov/?artSec=30.02&chapter=PE.30&code=PE&tab=1" },
    ],
    related: [
      { label: "Texas criminal mischief", href: "/guides/texas-criminal-mischief-law" },
      { label: "Texas theft law", href: "/guides/texas-theft-shoplifting-law" },
      { label: "Texas handgun signs", href: "/guides/texas-30-05-30-06-30-07-signs-guide" },
    ],
  },

  "texas-criminal-mischief-law": {
    slug: "texas-criminal-mischief-law",
    title: "Texas Criminal Mischief Law: Property Damage, Loss Amounts and Charges",
    dek: "What Texas Penal Code Section 28.03 covers, including intentional or knowing property damage, tampering and markings, how pecuniary loss affects the offense level, and why special property rules can change the result.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Criminal mischief can involve intentionally or knowingly damaging or destroying another person's tangible property without effective consent.",
      "The statute also reaches certain intentional or knowing tampering that causes loss or substantial inconvenience, and certain intentional or knowing markings on another person's property.",
      "Pecuniary loss is a major punishment factor, but special property categories and consequences can change the offense level even when the dollar amount is not the only issue.",
      "A property dispute is not automatically criminal mischief; the state still must prove the elements and required mental state in Section 28.03.",
    ],
    intro: [
      "Texas criminal mischief is the state's principal general property-damage offense. It covers more than simply breaking an object: the statute also addresses specified tampering and marking conduct when done without the owner's effective consent.",
      "Because Section 28.03 uses detailed loss thresholds and special categories, a reliable guide should not assign a charge level from a repair estimate alone without checking the complete statute.",
    ],
    sections: [
      { heading: "Damage or destruction is one path to the offense", paragraphs: ["Section 28.03 covers intentionally or knowingly damaging or destroying tangible property of an owner when the conduct occurs without the owner's effective consent. Ownership and consent therefore matter alongside what happened to the property."] },
      { heading: "Tampering and markings can also qualify", paragraphs: ["The statute separately addresses intentionally or knowingly tampering with another's tangible property when the conduct causes pecuniary loss or substantial inconvenience, as well as intentionally or knowingly making specified markings on another's tangible property without effective consent."] },
      { heading: "Loss amount drives much of the punishment structure", paragraphs: ["Section 28.03 grades many cases by pecuniary loss, moving from misdemeanor ranges into felony ranges as qualifying loss increases. It also contains special rules for particular types of property and interruptions, so the dollar threshold is not always the entire analysis."] },
      { heading: "Civil property disagreements are not automatically crimes", paragraphs: ["A disagreement over ownership, repairs, boundaries, deposits, or contracts does not by itself establish criminal mischief. A criminal case still requires proof of the statutory conduct, the applicable culpable mental state, lack of effective consent, and any punishment facts alleged by the state."] },
    ],
    faq: [
      { q: "Is accidentally damaging someone else's property criminal mischief?", a: "Section 28.03 generally requires intentional or knowing conduct for its principal forms. An accident should not be labeled criminal mischief without analyzing the required mental state and facts." },
      { q: "Does the repair bill determine the charge?", a: "It can be important because pecuniary loss affects many punishment levels, but Section 28.03 also contains special rules for certain property and consequences. The whole statute must be checked." },
      { q: "Can tampering count even if the property is not destroyed?", a: "Yes. Section 28.03 includes a tampering theory when the statutory requirements are met and the conduct causes pecuniary loss or substantial inconvenience." },
    ],
    sources: [
      { label: "Texas Penal Code § 28.03", url: "https://statutes.capitol.texas.gov/?artSec=28.03&chapter=PE.28&code=PE&tab=1" },
      { label: "Texas Penal Code Chapter 28", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=PE.28&code=PE&tab=1" },
    ],
    related: [
      { label: "Texas criminal trespass", href: "/guides/texas-criminal-trespass-law" },
      { label: "Texas theft law", href: "/guides/texas-theft-shoplifting-law" },
      { label: "Texas self-defense law", href: "/guides/texas-self-defense-law" },
    ],
  },
};
