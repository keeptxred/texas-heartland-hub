import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_BATCH11_GRANDPARENT_EMANCIPATION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-grandparent-visitation-law": {
    slug: "texas-grandparent-visitation-law",
    title: "Texas Grandparent Visitation Law: Access, Standing and the Significant-Impairment Standard",
    dek: "What Texas Family Code Sections 153.432 through 153.434 require before a grandparent may obtain court-ordered possession of or access to a grandchild.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not give grandparents an automatic right to court-ordered visitation merely because of the family relationship.",
      "Section 153.432 requires a supporting affidavit alleging facts showing that denial of possession or access would significantly impair the child's physical health or emotional well-being.",
      "Section 153.433 requires the grandparent to overcome the presumption that a parent acts in the child's best interest and to satisfy additional statutory circumstances involving the grandparent's child, who is the parent of the grandchild.",
      "Section 153.434 limits requests in certain adoption situations, so adoption status can be decisive.",
    ],
    intro: [
      "Texas grandparent-access law is intentionally narrower than ordinary parent possession law. The statute starts from the principle that a fit parent is presumed to act in the child's best interest and requires more than proof that grandparent contact would be beneficial.",
      "The exact family history matters. Death, incarceration, incompetence, lack of possession or access, termination of parental rights, and adoption can change whether the statutory path is available.",
    ],
    sections: [
      { heading: "A grandparent may file an original suit or a modification request", paragraphs: ["Section 153.432 allows a biological or adoptive grandparent to request possession of or access to a grandchild in an original suit or a Chapter 156 modification proceeding, subject to the statute's threshold requirements."] },
      { heading: "The affidavit must allege significant impairment", paragraphs: ["The petition must include an affidavit stating supporting facts for the allegation that denial of possession or access would significantly impair the child's physical health or emotional well-being. If the alleged facts would not support the relief authorized by Section 153.433, the statute directs the court to deny relief and dismiss the suit."] },
      { heading: "The grandparent must overcome the parental presumption", paragraphs: ["Section 153.433 requires proof by a preponderance of the evidence that denial of possession or access would significantly impair the child's physical health or emotional well-being. The grandparent must also be the parent of a parent of the child who falls within one of the statute's specified circumstances, such as recent incarceration, incompetence, death, or lack of actual or court-ordered possession or access."] },
      { heading: "Adoption can limit or end the statutory route", paragraphs: ["Section 153.434 restricts grandparent requests when the biological parents have died, had rights terminated, or executed specified relinquishment or waiver documents and the child has been adopted, or is the subject of a pending adoption, by someone other than a stepparent."] },
    ],
    faq: [
      { q: "Do grandparents automatically have visitation rights in Texas?", a: "No. Sections 153.432 and 153.433 impose specific standing, affidavit, proof, and family-circumstance requirements." },
      { q: "Is showing a close grandparent-grandchild relationship enough?", a: "Not by itself. The statute requires proof that denial of possession or access would significantly impair the child's physical health or emotional well-being." },
      { q: "Can adoption affect a grandparent visitation case?", a: "Yes. Section 153.434 contains an important limitation tied to termination or relinquishment of parental rights and adoption by someone other than a stepparent." },
    ],
    sources: [
      { label: "Texas Family Code § 153.432", url: "https://statutes.capitol.texas.gov/?artSec=153.432&chapter=FA.153&code=FA&tab=1" },
      { label: "Texas Family Code § 153.433", url: "https://statutes.capitol.texas.gov/?artSec=153.433&chapter=FA.153&code=FA&tab=1" },
      { label: "Texas Family Code § 153.434", url: "https://statutes.capitol.texas.gov/?artSec=153.434&chapter=FA.153&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas child custody law", href: "/guides/texas-child-custody-conservatorship-law" },
      { label: "Texas custody modification law", href: "/guides/texas-custody-modification-law" },
      { label: "Texas parental-rights termination law", href: "/guides/texas-parental-rights-termination-law" },
    ],
  },

  "texas-emancipation-law": {
    slug: "texas-emancipation-law",
    title: "Texas Emancipation Law: Removal of Disabilities of Minority",
    dek: "How Texas Family Code Chapter 31 allows certain minors to ask a court to remove the disabilities of minority for limited or general purposes.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas statutes use the phrase 'removal of disabilities of minority' rather than emancipation, although emancipation is the common shorthand.",
      "A minor may petition if the minor is a Texas resident, is 17 or is at least 16 and living separate and apart from a parent or guardian, and is self-supporting and managing the minor's own financial affairs.",
      "The minor files in the county of residence and may file the suit in the minor's own name.",
      "The court must find that removal of the disabilities of minority is in the petitioner's best interest, and the order may be limited or general.",
    ],
    intro: [
      "Texas does not create emancipation merely because a teenager moves out, gets a job, becomes a parent, or has a disagreement with family. Chapter 31 sets specific eligibility and court-order requirements.",
      "The legal effect depends on the language of the order and statutory exceptions. Removal of disabilities can expand a minor's legal capacity, but it should not be assumed to erase every age-based rule in Texas law.",
    ],
    sections: [
      { heading: "Chapter 31 sets three core eligibility requirements", paragraphs: ["Section 31.001 requires Texas residency, the required age and living arrangement, and self-support with management of the minor's own financial affairs. A 17-year-old need not satisfy the separate-and-apart language that applies to a 16-year-old, but the self-support and financial-management requirements still apply."] },
      { heading: "The minor can file in the minor's own name", paragraphs: ["Section 31.001 allows the minor to file the suit without a next friend, and Section 31.003 places venue in the county where the minor resides."] },
      { heading: "The court appoints representation for the minor's interests", paragraphs: ["Section 31.004 directs the court to appoint an amicus attorney or attorney ad litem to represent the petitioner's interests at the hearing."] },
      { heading: "The order depends on best interest and can be limited", paragraphs: ["Section 31.005 authorizes removal of the disabilities of minority if the court finds removal to be in the petitioner's best interest. Chapter 31 permits removal for limited or general purposes, so the wording of the order matters."] },
    ],
    faq: [
      { q: "What age can a minor be emancipated in Texas?", a: "Chapter 31 allows a petition at age 17, or at age 16 if the minor is living separate and apart from a parent, managing conservator, or guardian, provided the other statutory requirements are met." },
      { q: "Does moving out automatically emancipate a Texas minor?", a: "No. Chapter 31 requires a court order and specific statutory findings." },
      { q: "Can an emancipated minor do everything an adult can do?", a: "Not necessarily. The effect depends on Chapter 31, the scope of the order, and other laws that may impose separate age-based restrictions." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 31", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.31&code=FA&tab=1" },
      { label: "Texas Family Code § 31.001", url: "https://statutes.capitol.texas.gov/?artSec=31.001&chapter=FA.31&code=FA&tab=1" },
      { label: "Texas Family Code § 31.005", url: "https://statutes.capitol.texas.gov/?artSec=31.005&chapter=FA.31&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas child name change law", href: "/guides/texas-child-name-change-law" },
      { label: "Texas adult name change law", href: "/guides/texas-adult-name-change-law" },
      { label: "Texas child custody law", href: "/guides/texas-child-custody-conservatorship-law" },
    ],
  },
};
