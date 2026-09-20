import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const SELF_DEFENSE_CORE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-self-defense-law": {
    slug: "texas-self-defense-law",
    title: "Texas Self-Defense Law: When Force Is Justified Under Penal Code § 9.31",
    dek: "A plain-English guide to Texas self-defense law, including immediate necessity, unlawful force, provocation, verbal disputes, arrest situations and the no-duty-to-retreat rule.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Penal Code Section 9.31 generally justifies force only when and to the degree a person reasonably believes the force is immediately necessary to protect against another's use or attempted use of unlawful force.",
      "Verbal provocation alone does not justify force, and the statute contains additional limits involving provocation, consent and resistance to arrest or search.",
      "A person who has a right to be present, did not provoke the other person, and is not engaged in criminal activity generally has no duty to retreat before using force otherwise justified by Section 9.31.",
      "Section 9.31 governs ordinary force; deadly force has additional requirements under Section 9.32.",
    ],
    intro: [
      "Texas self-defense law is based on reasonableness and immediate necessity, not on a general right to use force whenever a person feels threatened or angry.",
      "The statute also contains important exceptions and conditions, so isolated slogans such as 'stand your ground' do not capture the full rule.",
    ],
    sections: [
      { heading: "The core rule is immediate necessity", paragraphs: ["Section 9.31 generally permits force when and to the degree the actor reasonably believes it is immediately necessary to protect against another person's use or attempted use of unlawful force. Both the timing and the degree of force matter under the statute."] },
      { heading: "Words alone are not enough", paragraphs: ["Section 9.31 states that force is not justified in response to verbal provocation alone. The law also restricts self-defense claims in circumstances involving consent, provocation and certain attempts to resist an arrest or search."] },
      { heading: "Texas has a no-duty-to-retreat rule in qualifying circumstances", paragraphs: ["A person who has a right to be present, did not provoke the person against whom force is used, and is not engaged in criminal activity at the time generally is not required to retreat before using force otherwise authorized by Section 9.31."] },
      { heading: "Deadly force is a separate legal question", paragraphs: ["Section 9.31 expressly provides that deadly force is not justified under the self-defense subchapter except as provided by Sections 9.32, 9.33 and 9.34. A situation supporting ordinary force therefore does not automatically justify deadly force."] },
    ],
    faq: [
      { q: "Can I use force because someone insults or threatens me verbally?", a: "Verbal provocation alone does not justify force under Section 9.31. Other facts can matter, including whether there is an actual or attempted use of unlawful force." },
      { q: "Does Texas require me to retreat first?", a: "Not when the statutory no-duty-to-retreat conditions are met: the person has a right to be present, did not provoke the other person, is not engaged in criminal activity, and the use of force is otherwise justified." },
      { q: "Does self-defense automatically justify deadly force?", a: "No. Deadly force has additional requirements under Section 9.32 and related statutes." },
    ],
    sources: [
      { label: "Texas Penal Code § 9.31", url: "https://statutes.capitol.texas.gov/?artSec=9.31&chapter=PE.9&code=PE&tab=1" },
      { label: "Texas Penal Code Chapter 9", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=PE.9&code=PE&tab=1" },
    ],
    related: [
      { label: "Texas castle doctrine and deadly force", href: "/guides/texas-castle-doctrine-stand-your-ground-law" },
      { label: "Texas permitless carry", href: "/guides/texas-permitless-carry-law" },
      { label: "Texas prohibited carry locations", href: "/guides/texas-firearm-prohibited-places-law" },
    ],
  },

  "texas-castle-doctrine-stand-your-ground-law": {
    slug: "texas-castle-doctrine-stand-your-ground-law",
    title: "Texas Castle Doctrine and Stand Your Ground: Deadly Force Under § 9.32",
    dek: "What Texas law actually says about deadly force, the castle-doctrine presumption, occupied homes and vehicles, and the state's no-duty-to-retreat rule.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Penal Code Section 9.32 permits deadly force only when ordinary force would be justified under Section 9.31 and the actor reasonably believes deadly force is immediately necessary for one of the purposes listed in Section 9.32.",
      "The statute creates a presumption of reasonableness in specified circumstances involving unlawful forcible entry or removal from an occupied habitation, vehicle, or place of business or employment, or certain listed violent crimes.",
      "The statutory presumption depends on additional conditions, including that the actor did not provoke the other person and was not otherwise engaged in criminal activity except for the limited traffic-offense exception.",
      "Texas's no-duty-to-retreat rule applies only when the person has a right to be present, did not provoke the other person, is not engaged in criminal activity, and the deadly force is otherwise justified.",
    ],
    intro: [
      "'Castle doctrine' and 'stand your ground' are common labels, but Texas law works through the specific elements of Penal Code Sections 9.31 and 9.32 rather than those slogans.",
      "The existence of a home, vehicle or business setting can affect presumptions and retreat rules, but it does not create an unlimited license to use deadly force.",
    ],
    sections: [
      { heading: "Deadly force has a higher statutory threshold", paragraphs: ["Section 9.32 first requires that the actor would be justified in using force under Section 9.31. The actor must then reasonably believe deadly force is immediately necessary to protect against another's use or attempted use of unlawful deadly force or to prevent one of the serious offenses listed in the statute."] },
      { heading: "The castle-doctrine presumption is conditional", paragraphs: ["Section 9.32 creates a presumption that the actor's belief was reasonable in specified circumstances involving unlawful forcible entry into, or forcible removal from, an occupied habitation, vehicle, or place of business or employment, and in connection with certain listed violent offenses. The presumption also requires that the actor did not provoke the other person and was not otherwise engaged in criminal activity, subject to the statute's limited traffic exception."] },
      { heading: "No duty to retreat does not replace the necessity requirement", paragraphs: ["Section 9.32 says a qualifying person is not required to retreat before using deadly force, and a fact finder may not consider a failure to retreat when the statutory conditions are met. The person must still satisfy the other requirements for justified deadly force."] },
      { heading: "Property-only deadly force is governed separately", paragraphs: ["Texas has separate rules in Sections 9.41 and 9.42 for protecting property. Those provisions have their own detailed conditions and should not be merged into the personal-defense standard in Section 9.32."] },
    ],
    faq: [
      { q: "Does Texas have a castle doctrine?", a: "Texas law contains a statutory presumption of reasonableness in specified unlawful-forcible-entry, removal and violent-crime circumstances involving an occupied habitation, vehicle, or place of business or employment. The presumption has conditions." },
      { q: "Is Texas a stand-your-ground state?", a: "Texas law provides that a qualifying person has no duty to retreat before using force or deadly force that is otherwise justified. The person must have a right to be present, must not have provoked the other person, and must not be engaged in criminal activity, subject to the statute's limited traffic exception." },
      { q: "Can deadly force be used merely to protect property?", a: "Property protection is governed by separate Sections 9.41 and 9.42, which contain additional specific requirements. It should not be assumed that Section 9.32's personal-defense rules apply to a property-only dispute." },
    ],
    sources: [
      { label: "Texas Penal Code § 9.31", url: "https://statutes.capitol.texas.gov/?artSec=9.31&chapter=PE.9&code=PE&tab=1" },
      { label: "Texas Penal Code § 9.32", url: "https://statutes.capitol.texas.gov/?artSec=9.32&chapter=PE.9&code=PE&tab=1" },
      { label: "Texas Penal Code §§ 9.41-9.42", url: "https://statutes.capitol.texas.gov/?artSec=9.42&chapter=PE.9&code=PE&tab=1" },
    ],
    related: [
      { label: "Texas self-defense law", href: "/guides/texas-self-defense-law" },
      { label: "Texas permitless carry", href: "/guides/texas-permitless-carry-law" },
      { label: "Texas vehicle handgun carry", href: "/guides/texas-vehicle-handgun-carry-law" },
    ],
  },
};
