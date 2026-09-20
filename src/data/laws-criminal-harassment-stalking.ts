import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CRIMINAL_HARASSMENT_STALKING_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-harassment-law": {
    slug: "texas-harassment-law",
    title: "Texas Harassment Law: Calls, Messages, Threats and Repeated Communications",
    dek: "A plain-English guide to Texas Penal Code Section 42.07: the intent requirement, the categories of prohibited communications, the ordinary misdemeanor level, and the 2025 utility-worker enhancement.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas harassment under Section 42.07 requires intent to harass, annoy, alarm, abuse, torment or embarrass and conduct fitting one of the statute's listed communication categories.",
      "The statute covers more than one medium and includes specified threats, repeated electronic communications and other listed forms of communication; an unpleasant message is not automatically criminal harassment.",
      "Harassment is generally a Class B misdemeanor, with statutory enhancements for certain prior convictions and specified victims or circumstances.",
      "Effective September 1, 2025, SB 482 added a Class A misdemeanor enhancement for qualifying harassment of a utility employee or agent performing duties within the scope of the employment or agency.",
    ],
    intro: [
      "Texas Penal Code Section 42.07 does not criminalize every rude, unwanted or upsetting communication. The state must prove the statute's required intent and that the conduct fits one of the specific categories listed in the law.",
      "Because communications can overlap with stalking, terroristic threat, protective-order violations or school rules, the exact conduct and surrounding facts matter before assigning a legal label.",
    ],
    sections: [
      { heading: "The statute requires a specific harassing intent", paragraphs: ["Section 42.07 begins with an intent requirement: the communication must be made with intent to harass, annoy, alarm, abuse, torment or embarrass another. That mental-state requirement is part of the offense and should not be omitted from a summary."] },
      { heading: "Section 42.07 lists particular communication conduct", paragraphs: ["The statute covers specified categories that can include certain obscene communications, threats, false reports designed to cause repeated telephone ringing or responses, repeated telephone communications, and repeated electronic communications under the statutory definitions. Whether a communication is criminal depends on the text of the applicable subsection and the facts."] },
      { heading: "The baseline offense is generally a Class B misdemeanor", paragraphs: ["Section 42.07 generally classifies harassment as a Class B misdemeanor, while the statute contains circumstances that can raise the offense to Class A, including specified repeat-offender situations and protected-victim categories."] },
      { heading: "SB 482 added a utility-worker enhancement", paragraphs: ["Effective September 1, 2025, SB 482 amended Section 42.07 so qualifying harassment is a Class A misdemeanor when committed against a person the actor knows or reasonably should know is an employee or agent of a utility while that person is performing a duty within the scope of the employment or agency."] },
    ],
    faq: [
      { q: "Is one rude text message automatically harassment in Texas?", a: "No. Section 42.07 requires the statutory intent and conduct fitting one of its listed categories. A rude or unwanted communication by itself does not automatically establish the offense." },
      { q: "Can electronic messages be covered by Section 42.07?", a: "Yes. The statute includes repeated electronic communications under its definitions and requirements, along with other specified communication methods." },
      { q: "What changed for utility workers in 2025?", a: "SB 482 added a Class A misdemeanor enhancement for qualifying harassment of utility employees or agents performing covered duties when the statute's knowledge requirement is met, effective September 1, 2025." },
    ],
    sources: [
      { label: "Texas Penal Code § 42.07", url: "https://statutes.capitol.texas.gov/?artSec=42.07&chapter=PE.42&code=PE&tab=1" },
      { label: "Texas Legislature SB 482 (2025), enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00482F.htm" },
    ],
    related: [
      { label: "Texas stalking law", href: "/guides/texas-stalking-law" },
      { label: "Texas assault law", href: "/guides/texas-assault-law" },
      { label: "Texas disorderly conduct", href: "/guides/texas-disorderly-conduct-law" },
    ],
  },

  "texas-stalking-law": {
    slug: "texas-stalking-law",
    title: "Texas Stalking Law: Repeated Conduct, Fear, Harassment and Protective Orders",
    dek: "What Texas Penal Code Section 42.072 requires for stalking, why repeated conduct and the reasonable-person test matter, the felony level, and how protective-order and victim-rights provisions connect to the offense.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas stalking requires more than a single isolated act; Section 42.072 focuses on conduct occurring on more than one occasion and pursuant to the same scheme or course of conduct directed specifically at another person.",
      "The statute links the conduct to specified threatening or harassing effects and includes a reasonable-person standard in circumstances similar to the alleged victim's.",
      "Stalking under Section 42.072 is a felony offense, with the punishment level capable of increasing for a qualifying prior stalking conviction.",
      "Texas law provides protective-order procedures and other victim protections tied specifically to stalking, including Chapter 7B of the Code of Criminal Procedure.",
    ],
    intro: [
      "Texas stalking law is built around a pattern, not merely an uncomfortable encounter. Penal Code Section 42.072 requires conduct on more than one occasion and under the same scheme or course of conduct, along with the statute's threat, fear, harassment and reasonable-person requirements.",
      "The criminal offense also connects to separate protective-order, bond-condition and victim-notification provisions, which is why a stalking case can have consequences beyond the Penal Code charge itself.",
    ],
    sections: [
      { heading: "A repeated scheme or course of conduct is central", paragraphs: ["Section 42.072 applies to qualifying conduct occurring on more than one occasion and pursuant to the same scheme or course of conduct directed specifically at another person. A single incident should not be labeled stalking without analyzing whether another offense applies instead."] },
      { heading: "Threat, fear or harassment requirements matter", paragraphs: ["The statute requires the conduct to satisfy specified conditions involving conduct that constitutes harassment or that the actor knows or reasonably should know will be regarded as threatening bodily injury or death, an offense against property, or other effects identified by the statute, and the conduct must actually cause a qualifying reaction."] },
      { heading: "The law uses a reasonable-person standard", paragraphs: ["Section 42.072 also asks whether the conduct would cause a reasonable person in circumstances similar to the alleged victim's to experience the type of fear or other reaction specified by the statute. Context and the relationship history can therefore matter to the legal analysis."] },
      { heading: "Protective-order law is separate but connected", paragraphs: ["Code of Criminal Procedure Chapter 7B provides stalking-related protective-order mechanisms. Those civil-protective procedures are distinct from proving the criminal charge, but they are an important part of Texas's legal framework for stalking allegations and victim safety."] },
    ],
    faq: [
      { q: "Can one incident be stalking under Section 42.072?", a: "The stalking statute requires qualifying conduct on more than one occasion and pursuant to the same scheme or course of conduct. A single incident may implicate another law, but it does not satisfy that repeated-conduct element by itself." },
      { q: "Is stalking a misdemeanor in Texas?", a: "No. Stalking under Penal Code Section 42.072 is a felony offense, and a qualifying prior stalking conviction can affect punishment." },
      { q: "Can a stalking victim seek a protective order?", a: "Texas Code of Criminal Procedure Chapter 7B contains protective-order provisions specifically applicable to stalking, separate from the criminal prosecution itself." },
    ],
    sources: [
      { label: "Texas Penal Code § 42.072", url: "https://statutes.capitol.texas.gov/?artSec=42.072&chapter=PE.42&code=PE&tab=1" },
      { label: "Texas Code of Criminal Procedure Chapter 7B", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=CR.7B&code=CR&tab=1" },
    ],
    related: [
      { label: "Texas harassment law", href: "/guides/texas-harassment-law" },
      { label: "Texas assault law", href: "/guides/texas-assault-law" },
      { label: "Texas family-violence lease termination", href: "/guides/texas-family-violence-lease-termination" },
    ],
  },
};
