import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_NAME_CUSTODY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-divorce-name-change-law": {
    slug: "texas-divorce-name-change-law",
    title: "Texas Divorce Name Change Law: Restoring a Prior Name in the Decree",
    dek: "How Texas Family Code Section 6.706 lets a divorcing spouse request restoration of a prior name, what the divorce court can order, and what still has to be updated afterward.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A Texas divorce decree may include a change from the name used during the marriage to a prior name under Family Code Section 6.706.",
      "The divorce-based procedure is designed to restore a prior name; it is not necessarily a substitute for the separate general name-change process when a person wants a completely new name.",
      "The court may not deny a requested restoration solely to keep the spouses' surnames the same or similar.",
      "A decree changing the name is the legal authority for the change, but the person still must update records with agencies, financial institutions, employers, and other organizations.",
    ],
    intro: [
      "A spouse who wants to return to a prior name can often handle that request inside the Texas divorce itself instead of filing a separate adult name-change case.",
      "The divorce decree does not automatically update every government or private record. It provides the legal order that the person can then use to update those records.",
    ],
    sections: [
      { heading: "The divorce court can restore a prior name", paragraphs: ["Family Code Section 6.706 authorizes the court, in a decree of divorce or annulment, to change the name of a party specifically requesting the change to a prior name used by that party, unless the court states a reason in the decree for denying the request."] },
      { heading: "The statute addresses restoration, not every possible new name", paragraphs: ["Section 6.706 is framed around changing the party's name to a prior name. A person seeking a different new name may need to use the separate adult name-change procedure rather than assuming the divorce decree can accomplish any requested name choice."] },
      { heading: "The court cannot refuse just to make surnames match", paragraphs: ["The statute states that the court may not deny the change solely to keep the surnames of family members the same. The decision still appears in the decree and the statutory requirements must be satisfied."] },
      { heading: "The decree must then be used to update records", paragraphs: ["A restored name in the divorce decree does not itself rewrite Social Security, driver's-license, passport, bank, payroll, insurance, or other records. The person generally uses a certified copy of the decree or other accepted proof to update each record holder under that organization's rules."] },
    ],
    faq: [
      { q: "Can I restore my maiden name in a Texas divorce?", a: "Yes. Section 6.706 allows a party to request restoration of a prior name used by that party in the divorce or annulment decree." },
      { q: "Can the judge deny the request because children use the married surname?", a: "The court may not deny the change solely to keep family members' surnames the same." },
      { q: "Does the divorce decree automatically update my driver's license and Social Security record?", a: "No. The decree provides legal authority for the change, but the person still must complete the update process required by each agency or organization." },
    ],
    sources: [
      { label: "Texas Family Code § 6.706", url: "https://statutes.capitol.texas.gov/?artSec=6.706&chapter=FA.6&code=FA&tab=1" },
      { label: "Texas Family Code Chapter 6", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.6&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas divorce law", href: "/guides/texas-divorce-law-guide" },
      { label: "Texas divorce waiting period", href: "/guides/texas-divorce-waiting-period-law" },
      { label: "Texas marriage license law", href: "/guides/texas-marriage-license-law" },
    ],
  },

  "texas-child-custody-conservatorship-law": {
    slug: "texas-child-custody-conservatorship-law",
    title: "Texas Child Custody Law: Conservatorship, Best Interest and Parent Rights",
    dek: "Why Texas custody orders use the term conservatorship, how the best-interest standard works, the parental presumption, and why rights and possession schedules are separate questions.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Family Code Chapter 153 uses the term conservatorship for what people commonly call child custody.",
      "The best interest of the child is the court's primary consideration in determining conservatorship and possession or access.",
      "Section 153.131 creates a parental presumption in an original case, subject to the statute's exceptions and the evidence before the court.",
      "Joint managing conservatorship does not automatically mean equal possession time or identical decision-making rights; the order allocates rights, duties, and possession separately.",
    ],
    intro: [
      "Texas custody cases use terminology that can be confusing at first. A parent may be a managing conservator or possessory conservator, and the order separately addresses decision-making rights, duties, possession, access, and support.",
      "The label alone does not tell the whole story. The specific rights and duties written into the order are often more important than whether the arrangement is described as joint managing conservatorship.",
    ],
    sections: [
      { heading: "Best interest is the primary statutory consideration", paragraphs: ["Family Code Section 153.002 states that the best interest of the child shall always be the primary consideration of the court in determining conservatorship and possession of or access to the child."] },
      { heading: "Texas begins with a parental presumption in original cases", paragraphs: ["Section 153.131 generally provides that, unless appointment of a parent or parents as managing conservator would not be in the child's best interest because it would significantly impair the child's physical health or emotional development, a parent shall be appointed sole managing conservator or both parents joint managing conservators. Other statutory provisions can affect that analysis."] },
      { heading: "Joint managing conservatorship is not automatically 50/50 time", paragraphs: ["The Family Code requires the court to specify rights and duties and to establish possession and access. A joint-managing-conservator label therefore does not by itself create an equal-possession schedule or identical authority on every decision."] },
      { heading: "Family violence and other safety findings can change the framework", paragraphs: ["Chapter 153 contains provisions directing courts to consider family violence, abuse, neglect, and other safety-related facts. Those provisions can affect conservatorship, possession, access, and whether presumptions that normally apply remain appropriate."] },
    ],
    faq: [
      { q: "Does Texas call custody 'conservatorship'?", a: "Yes. Chapter 153 uses conservatorship terminology, though people commonly use the word custody in everyday conversation." },
      { q: "Does joint managing conservatorship mean 50/50 possession?", a: "No. Conservatorship status and the possession schedule are related but separate parts of the order." },
      { q: "What is the main custody standard in Texas?", a: "Section 153.002 makes the child's best interest the court's primary consideration for conservatorship and possession or access." },
    ],
    sources: [
      { label: "Texas Family Code § 153.002", url: "https://statutes.capitol.texas.gov/?artSec=153.002&chapter=FA.153&code=FA&tab=1" },
      { label: "Texas Family Code § 153.131", url: "https://statutes.capitol.texas.gov/?artSec=153.131&chapter=FA.153&code=FA&tab=1" },
      { label: "Texas Family Code Chapter 153", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.153&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas standard possession order", href: "/guides/texas-standard-possession-order-law" },
      { label: "Texas child support guidelines", href: "/guides/texas-child-support-guidelines-law" },
      { label: "Texas family-violence protective orders", href: "/guides/texas-family-violence-protective-order-law" },
    ],
  },
};
