import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_BATCH11_ADOPTION_TERMINATION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-adoption-law-guide": {
    slug: "texas-adoption-law-guide",
    title: "Texas Adoption Law: Eligibility, Consent, Evaluation and Final Orders",
    dek: "A practical overview of Texas Family Code Chapter 162, including who may adopt, when a child may be adopted, spouse-joinder, adoption evaluations, residence requirements, child consent, and final orders.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas adoption is governed principally by Family Code Chapter 162, together with related standing, termination, and evaluation provisions.",
      "An adult may petition to adopt a child who may legally be adopted, subject to Chapter 102 standing rules and the eligibility conditions in Section 162.001.",
      "If the petitioner is married, both spouses generally must join in the adoption petition under Section 162.002.",
      "A child age 12 or older generally must consent to the adoption, although the court may waive that requirement if waiver serves the child's best interest.",
    ],
    intro: [
      "Texas adoption cases do more than approve a new family relationship. The court must confirm that the child is legally available for adoption, the petitioner has standing, required evaluations and consents are addressed, and the adoption serves the child's best interest.",
      "Stepparent, relative, private, agency, interstate, and foster-care adoptions can involve different procedural paths. This guide explains the statewide statutory framework rather than a case-specific filing strategy.",
    ],
    sections: [
      { heading: "Section 162.001 controls who may adopt and when a child may be adopted", paragraphs: ["An adult may petition to adopt a child who may be adopted, subject to standing requirements. Section 162.001 lists circumstances under which a child residing in Texas may be adopted, including situations involving termination of parental rights, stepparent adoption, and specified consent-based arrangements."] },
      { heading: "Married petitioners generally file together", paragraphs: ["Section 162.002 provides that if a petitioner is married, both spouses must join in the petition for adoption. The petition must also address compliance with the interstate-placement provisions when those provisions apply."] },
      { heading: "An adoption evaluation is generally required", paragraphs: ["Section 162.003 requires an adoption evaluation under Chapter 107 unless the court waives the evaluation under the statutory waiver provision. The evaluation is separate from the ultimate best-interest determination by the court."] },
      { heading: "Residence and consent rules apply before finalization", paragraphs: ["Section 162.009 generally requires the child to have resided with the petitioner for at least six months, but the court may waive that requirement if waiver is in the child's best interest. Section 162.010 addresses required managing-conservator consent and generally requires a child age 12 or older to consent unless the court waives that requirement in the child's best interest."] },
    ],
    faq: [
      { q: "Can any adult adopt a child in Texas?", a: "An adult may petition, but the child must be legally eligible for adoption and the petitioner must satisfy standing and the other Chapter 162 requirements." },
      { q: "Does a married person have to include their spouse in a Texas adoption petition?", a: "Generally yes. Section 162.002 requires both spouses to join if the petitioner is married." },
      { q: "Does a 12-year-old have to agree to a Texas adoption?", a: "Section 162.010 generally requires written or in-court consent from a child age 12 or older, but the court may waive that requirement if waiver serves the child's best interest." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 162", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.162&code=FA&tab=1" },
      { label: "Texas Family Code § 162.001", url: "https://statutes.capitol.texas.gov/?artSec=162.001&chapter=FA.162&code=FA&tab=1" },
      { label: "Texas Family Code § 162.010", url: "https://statutes.capitol.texas.gov/?artSec=162.010&chapter=FA.162&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas parental-rights termination law", href: "/guides/texas-parental-rights-termination-law" },
      { label: "Texas paternity law", href: "/guides/texas-paternity-law-guide" },
      { label: "Texas child custody law", href: "/guides/texas-child-custody-conservatorship-law" },
    ],
  },

  "texas-parental-rights-termination-law": {
    slug: "texas-parental-rights-termination-law",
    title: "Texas Parental Rights Termination Law: Grounds, Proof and Best Interest",
    dek: "How Texas Family Code Chapter 161 approaches involuntary and voluntary termination of the parent-child relationship, including statutory grounds, clear-and-convincing proof, best interest, and legal consequences.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Termination of parental rights is governed principally by Texas Family Code Chapter 161 and permanently changes the legal parent-child relationship unless a later statutory reinstatement applies.",
      "In an involuntary case under Section 161.001, the court generally must find by clear and convincing evidence at least one statutory ground and that termination is in the child's best interest.",
      "A parent cannot simply sign away parental rights by private agreement and make the legal relationship disappear; court action and statutory requirements are required.",
      "Texas law also contains separate procedures involving voluntary relinquishment, alleged fathers, specified criminal conduct, and limited reinstatement of parental rights after some involuntary terminations.",
    ],
    intro: [
      "Termination is one of the most consequential remedies in Texas family law. It can end major parental rights and duties and may clear the legal path for adoption, but the result depends on strict statutory grounds and procedures.",
      "Because the stakes are unusually high, this guide is limited to the statutory framework. A person involved in a termination case should obtain advice based on the actual pleadings, evidence, deadlines, and court orders in that case.",
    ],
    sections: [
      { heading: "Section 161.001 requires both a statutory ground and best interest", paragraphs: ["For involuntary termination under Section 161.001, the court generally must find by clear and convincing evidence that the parent committed one or more acts or omissions listed in the statute and that termination is in the child's best interest. One element without the other is not enough under that section."] },
      { heading: "Termination is a court process, not a private waiver", paragraphs: ["A parent may execute an affidavit of voluntary relinquishment that can support a termination proceeding, but the affidavit itself is not a private substitute for a court order terminating the parent-child relationship. Chapter 161 governs the legal proceeding and resulting order."] },
      { heading: "Different sections address special termination situations", paragraphs: ["Chapter 161 contains separate provisions for alleged fathers, certain mental-illness cases, a parent who is the petitioner, pregnancy resulting from specified criminal conduct, procedural requirements, and other specialized circumstances."] },
      { heading: "Texas now permits limited reinstatement in some cases", paragraphs: ["Subchapter D of Chapter 161 creates a narrow statutory process for reinstatement of parental rights after certain involuntary terminations. The existence of that process does not make an ordinary termination temporary or automatically reversible."] },
    ],
    faq: [
      { q: "Can a Texas court terminate parental rights just because the other parent asks?", a: "No. An involuntary termination requires the statutory grounds and proof required by Chapter 161, including the applicable best-interest finding." },
      { q: "Can a parent sign away rights without going to court?", a: "A relinquishment document can be part of a termination case, but legal termination of the parent-child relationship requires the statutory court process and order." },
      { q: "Are terminated parental rights ever restored in Texas?", a: "Chapter 161 includes a limited reinstatement procedure for some involuntary terminations. It is not available in every case and does not automatically restore rights." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 161", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.161&code=FA&tab=1" },
      { label: "Texas Family Code § 161.001", url: "https://statutes.capitol.texas.gov/?artSec=161.001&chapter=FA.161&code=FA&tab=1" },
      { label: "Texas Family Code § 161.301 et seq.", url: "https://statutes.capitol.texas.gov/?artSec=161.301&chapter=FA.161&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas adoption law", href: "/guides/texas-adoption-law-guide" },
      { label: "Texas paternity law", href: "/guides/texas-paternity-law-guide" },
      { label: "Texas child custody law", href: "/guides/texas-child-custody-conservatorship-law" },
    ],
  },
};
