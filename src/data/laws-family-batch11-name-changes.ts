import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_BATCH11_NAME_CHANGE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-child-name-change-law": {
    slug: "texas-child-name-change-law",
    title: "Texas Child Name Change Law: Petition, Consent, Notice and Best Interest",
    dek: "How Texas Family Code Chapter 45 governs a child's legal name change, including who may file, consent for children 10 and older, citation, best interest, and the final order.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A parent, managing conservator, or guardian may petition to change a child's name in the county where the child resides.",
      "If the child is age 10 or older, the child's written consent must generally be attached to the petition.",
      "Parents whose rights have not been terminated, managing conservators, and guardians are among the persons entitled to citation under Section 45.003.",
      "The court may order the change only if the statutory requirements are met and the change is in the child's best interest.",
    ],
    intro: [
      "Changing a child's name in Texas is a court proceeding, not simply an update to a school, medical, or birth record. Chapter 45 requires a verified petition and gives specified people notice rights before the court acts.",
      "The court's focus is the child's best interest. Agreement between adults can simplify the case, but it does not replace the statutory process.",
    ],
    sections: [
      { heading: "A parent, managing conservator, or guardian may file", paragraphs: ["Section 45.001 authorizes a parent, managing conservator, or guardian to petition in the county where the child resides."] },
      { heading: "The petition has specific content requirements", paragraphs: ["Section 45.002 requires a verified petition stating the child's current name and residence, the reason for the requested change, the requested new name, continuing-jurisdiction information, and specified registration information. If the child is at least 10 years old, the child's written consent must be attached."] },
      { heading: "Specified parents and conservators are entitled to citation", paragraphs: ["Section 45.003 identifies persons entitled to citation, including a parent whose rights have not been terminated, any managing conservator, and any guardian of the child. Chapter 45 also contains a statutory waiver-of-citation procedure."] },
      { heading: "Best interest controls the order", paragraphs: ["Section 45.004 allows the court to change the child's name if the change is in the child's best interest, along with additional requirements if the child is subject to specified registration laws. The order does not erase liabilities or rights associated with the child's previous name."] },
    ],
    faq: [
      { q: "Does a 10-year-old have to consent to a Texas name change?", a: "Section 45.002 generally requires the written consent of a child age 10 or older to be attached to the petition." },
      { q: "Can one parent change a child's name without notifying the other parent?", a: "A parent whose rights have not been terminated is generally entitled to citation under Section 45.003, subject to the statute's waiver and service rules." },
      { q: "What standard does the judge use?", a: "Section 45.004 requires the change to be in the child's best interest, with additional rules in certain registration cases." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 45", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.45&code=FA&tab=1" },
      { label: "Texas Family Code § 45.002", url: "https://statutes.capitol.texas.gov/?artSec=45.002&chapter=FA.45&code=FA&tab=1" },
      { label: "Texas Family Code § 45.004", url: "https://statutes.capitol.texas.gov/?artSec=45.004&chapter=FA.45&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas adult name change law", href: "/guides/texas-adult-name-change-law" },
      { label: "Texas divorce name change law", href: "/guides/texas-divorce-name-change-law" },
      { label: "Texas emancipation law", href: "/guides/texas-emancipation-law" },
    ],
  },

  "texas-adult-name-change-law": {
    slug: "texas-adult-name-change-law",
    title: "Texas Adult Name Change Law: Filing Requirements and Court Standard",
    dek: "A practical guide to Texas Family Code Chapter 45 adult name changes, including venue, petition contents, background information, felony and registration rules, and the court's public-interest standard.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "An adult generally files a name-change petition in the county of the adult's residence under Section 45.101.",
      "The verified petition must contain the information required by Section 45.102, including identifying and criminal-history-related information specified by the statute.",
      "For most petitioners who do not have a final felony conviction and are not subject to Chapter 62 registration, the court shall order the change if it benefits the petitioner and is in the public interest.",
      "Separate restrictions apply to petitioners with a final felony conviction or specified registration obligations.",
    ],
    intro: [
      "A Texas adult name change is a judicial process under Family Code Chapter 45. It is different from restoring a prior name inside a divorce decree, although both can result in a lawful name change.",
      "Chapter 45 requires more than stating a preferred new name. The petition includes identifying information and, for some petitioners, criminal-history or registration-related requirements that affect whether the court may grant the request.",
    ],
    sections: [
      { heading: "File in the county of residence", paragraphs: ["Section 45.101 provides that an adult may file a petition requesting a name change in the county of the adult's place of residence."] },
      { heading: "The petition must be verified and detailed", paragraphs: ["Section 45.102 requires the petition to include the present name and residence, requested name, reason for the change, and additional identifying and criminal-history information specified by the statute. The section also contains fingerprint-related requirements."] },
      { heading: "The court applies benefit and public-interest standards", paragraphs: ["Section 45.103 generally directs the court to order a name change for a petitioner without a final felony conviction or Chapter 62 registration obligation when the change is in the interest or benefit of the petitioner and in the interest of the public."] },
      { heading: "Felony convictions and registration trigger separate rules", paragraphs: ["Section 45.103 contains additional eligibility and notice requirements for people with final felony convictions and people subject to specified registration requirements. Those petitioners should review the exact subsection that applies before filing."] },
    ],
    faq: [
      { q: "Where do I file an adult name change in Texas?", a: "Section 45.101 places the petition in the county of the adult's residence." },
      { q: "Is an adult name change automatic if no one objects?", a: "No. The court still must apply Section 45.103 and the petition must satisfy the statutory requirements." },
      { q: "Is a divorce name restoration the same as a Chapter 45 adult name change?", a: "No. A divorce court can restore a prior name under Family Code Section 6.706. Chapter 45 is the general adult name-change procedure." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 45", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.45&code=FA&tab=1" },
      { label: "Texas Family Code § 45.102", url: "https://statutes.capitol.texas.gov/?artSec=45.102&chapter=FA.45&code=FA&tab=1" },
      { label: "Texas Family Code § 45.103", url: "https://statutes.capitol.texas.gov/?artSec=45.103&chapter=FA.45&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas child name change law", href: "/guides/texas-child-name-change-law" },
      { label: "Texas divorce name change law", href: "/guides/texas-divorce-name-change-law" },
      { label: "Texas marriage license law", href: "/guides/texas-marriage-license-law" },
    ],
  },
};
