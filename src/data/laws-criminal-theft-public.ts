import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CRIMINAL_THEFT_PUBLIC_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-theft-shoplifting-law": {
    slug: "texas-theft-shoplifting-law",
    title: "Texas Theft and Shoplifting Law: Value Levels, Intent and Retail Theft",
    dek: "A practical guide to Texas Penal Code Section 31.03: what theft requires, how value affects punishment, why shoplifting is part of the general theft statute, and how organized retail theft differs.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas theft generally requires unlawful appropriation of property with intent to deprive the owner of the property.",
      "Texas consolidates older labels such as shoplifting, embezzlement and receiving stolen property into the general theft framework in Chapter 31.",
      "Punishment under Section 31.03 usually depends heavily on the value of the property, but special property types, victim circumstances and prior convictions can change the grade.",
      "The 2025 Legislature separately rewrote organized retail theft in Section 31.16 through SB 1300; an ordinary single theft should not automatically be described as organized retail theft.",
    ],
    intro: [
      "Texas does not need a separate offense called 'shoplifting' for a basic retail theft case. Penal Code Section 31.02 consolidates a number of older theft labels, and Section 31.03 supplies the general theft offense.",
      "The key questions are whether appropriation was unlawful, whether the person intended to deprive the owner, what property was involved, and what value or special punishment facts the state can prove.",
    ],
    sections: [
      { heading: "Theft requires unlawful appropriation plus intent to deprive", paragraphs: ["Section 31.03 states the core offense in two parts: unlawful appropriation of property and intent to deprive the owner. The statute then defines circumstances in which appropriation is unlawful, so possession alone is not the complete legal test."] },
      { heading: "Shoplifting falls within the general theft framework", paragraphs: ["Section 31.02 expressly says theft under Section 31.03 supersedes several older labels, including shoplifting. A conventional store-theft allegation is therefore commonly analyzed under the same general theft statute used for other property thefts."] },
      { heading: "Value and special facts determine punishment", paragraphs: ["Section 31.03 contains a detailed punishment ladder based primarily on property value, with additional rules for certain property, victims and criminal-history circumstances. A reliable charge-level answer requires the current subsection rather than a generic dollar chart alone."] },
      { heading: "Organized retail theft is a separate statute", paragraphs: ["SB 1300, effective September 1, 2025, substantially revised Penal Code Section 31.16. That statute addresses specified repeated, coordinated or benefit-from-others retail-theft conduct. It should not be substituted for the ordinary Section 31.03 analysis merely because a theft occurred in a store."] },
    ],
    faq: [
      { q: "Does Texas have a separate shoplifting offense?", a: "Basic shoplifting is generally treated within Texas's consolidated theft framework. Penal Code Section 31.02 expressly lists shoplifting among the older labels superseded by theft as defined in Section 31.03." },
      { q: "Does the value of the item matter?", a: "Yes. Value is a central punishment factor under Section 31.03, although special property types, victim circumstances and prior convictions can also change the offense level." },
      { q: "Is every store theft organized retail theft?", a: "No. Organized retail theft is separately defined in Section 31.16. The 2025 SB 1300 changes address specified repeated, coordinated or benefit-based conduct and should not be applied automatically to every retail theft." },
    ],
    sources: [
      { label: "Texas Penal Code §§ 31.02–31.03", url: "https://statutes.capitol.texas.gov/?artSec=31.03&chapter=PE.31&code=PE&tab=1" },
      { label: "Texas Penal Code § 31.16", url: "https://statutes.capitol.texas.gov/?artSec=31.16&chapter=PE.31&code=PE&tab=1" },
      { label: "Texas Legislature SB 1300 (2025), enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB01300F.htm" },
    ],
    related: [
      { label: "Texas criminal trespass", href: "/guides/texas-criminal-trespass-law" },
      { label: "Texas criminal mischief", href: "/guides/texas-criminal-mischief-law" },
      { label: "Texas disorderly conduct", href: "/guides/texas-disorderly-conduct-law" },
    ],
  },

  "texas-disorderly-conduct-law": {
    slug: "texas-disorderly-conduct-law",
    title: "Texas Disorderly Conduct Law: Public Conduct, Fighting and Firearm Provisions",
    dek: "What Texas Penal Code Section 42.01 covers, from specified abusive or threatening public conduct to fighting and firearm-related conduct, plus the difference between the ordinary and firearm punishment levels.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas disorderly conduct is a list of specific prohibited acts, not a catch-all offense for anything an officer considers rude or disruptive.",
      "The statute covers several categories, including certain abusive or threatening language or gestures in public, unreasonable noise after notice, fighting, and specified firearm conduct.",
      "Most Section 42.01 violations are Class C misdemeanors, while the firearm-discharge and firearm-display provisions in Subsections (a)(7) and (a)(8) are generally Class B misdemeanors.",
      "Context matters because some subsections include their own location, intent, notice or reasonable-person requirements, and other statutes can apply to the same episode.",
    ],
    intro: [
      "Texas Penal Code Section 42.01 is broader than fighting in public but narrower than a general ban on being loud or offensive. Each subsection identifies particular conduct and, in several instances, requires additional facts such as public location, intent, notice or a specified effect on a reasonable person.",
      "The firearm provisions are especially important because they carry a different baseline punishment level from most of the other listed conduct.",
    ],
    sections: [
      { heading: "Section 42.01 lists specific conduct", paragraphs: ["The statute addresses multiple categories of conduct, including certain abusive or threatening words or gestures in a public place, unreasonable noise under the statutory conditions, fighting, exposure, disturbing a meeting or funeral, and other listed acts. A disorderly-conduct label should be tied to the actual subsection alleged."] },
      { heading: "Fighting is one listed form of disorderly conduct", paragraphs: ["Section 42.01 includes fighting with another in a public place. A physical encounter can also raise separate assault questions under Section 22.01, so the legal theories should not be assumed to be interchangeable."] },
      { heading: "Firearm conduct receives separate treatment", paragraphs: ["Subsections (a)(7) and (a)(8) address discharging a firearm in specified public settings and displaying a firearm or other deadly weapon in a public place in a manner calculated to alarm. Those provisions are generally punished as Class B misdemeanors rather than the usual Class C level for Section 42.01."] },
      { heading: "Speech is not automatically disorderly conduct", paragraphs: ["Several speech-related provisions contain limiting language, including public-place, intent or reasonable-person concepts. A legally protected expression should not be reduced to disorderly conduct merely because someone dislikes it; the actual statutory elements still have to be satisfied."] },
    ],
    faq: [
      { q: "Is being loud in public automatically disorderly conduct?", a: "No. Section 42.01 has specific requirements for unreasonable noise, including statutory notice language. The facts must match the subsection rather than a general idea of loud behavior." },
      { q: "Is fighting in public covered?", a: "Yes. Fighting with another in a public place is one form listed in Section 42.01, although assault or other statutes may also be relevant depending on the facts." },
      { q: "Are all disorderly conduct offenses Class C misdemeanors?", a: "No. Most are Class C misdemeanors, but the firearm-related provisions in Section 42.01(a)(7) and (a)(8) are generally Class B misdemeanors." },
    ],
    sources: [
      { label: "Texas Penal Code § 42.01", url: "https://statutes.capitol.texas.gov/?artSec=42.01&chapter=PE.42&code=PE&tab=1" },
      { label: "Texas Penal Code § 22.01", url: "https://statutes.capitol.texas.gov/?artSec=22.01&chapter=PE.22&code=PE&tab=1" },
    ],
    related: [
      { label: "Texas assault law", href: "/guides/texas-assault-law" },
      { label: "Texas public intoxication", href: "/guides/texas-public-intoxication-law" },
      { label: "Texas open carry", href: "/guides/texas-open-carry-law" },
    ],
  },
};
