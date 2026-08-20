import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_DIVORCE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-divorce-law-guide": {
    slug: "texas-divorce-law-guide",
    title: "Texas Divorce Law: Grounds, Filing and What a Decree Can Decide",
    dek: "A plain-English overview of Texas divorce law, including insupportability, fault grounds, residency, property division, children, support, and the final decree.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas allows divorce on the no-fault ground of insupportability under Family Code Section 6.001 and also retains several statutory fault grounds.",
      "A Texas divorce can address marital status, division of the marital estate, conservatorship and possession of children, child support, and other issues within the court's jurisdiction.",
      "Residency and venue rules in Chapter 6 determine where a divorce may be filed; filing in Texas is not based only on where the wedding occurred.",
      "Texas generally uses a just-and-right division standard for the marital estate rather than an automatic 50/50 formula.",
    ],
    intro: [
      "A Texas divorce is a lawsuit to dissolve a marriage and resolve the legal issues tied to that marriage. Even an agreed divorce has statutory filing, waiting-period, and final-order requirements.",
      "This guide explains the statewide structure. A particular case may also involve temporary orders, discovery, business interests, retirement benefits, domestic violence, jurisdiction disputes, or other issues that require individualized legal advice.",
    ],
    sections: [
      { heading: "Insupportability is Texas's no-fault divorce ground", paragraphs: ["Family Code Section 6.001 allows divorce if the marriage has become insupportable because of discord or conflict of personalities that destroys the legitimate ends of the marital relationship and prevents a reasonable expectation of reconciliation. Chapter 6 also contains separate fault-based grounds."] },
      { heading: "Texas residency rules determine whether and where to file", paragraphs: ["Chapter 6 contains residency and venue requirements. The county of marriage is not automatically the proper filing county, and interstate or international cases can raise additional jurisdiction questions."] },
      { heading: "The court can divide the marital estate", paragraphs: ["Family Code Section 7.001 directs the court to order a division of the estate of the parties in a manner the court deems just and right, having due regard for the rights of each party and any children of the marriage. That standard is not the same as an automatic equal split in every case."] },
      { heading: "Children and support may be resolved in the same case", paragraphs: ["When children are involved, the divorce commonly incorporates a suit affecting the parent-child relationship so the final orders can address conservatorship, possession and access, child support, and related rights and duties under Titles 4 and 5 of the Family Code."] },
    ],
    faq: [
      { q: "Does Texas have no-fault divorce?", a: "Yes. Family Code Section 6.001 recognizes insupportability as a ground for divorce without requiring proof of a separate fault ground." },
      { q: "Does Texas always divide property 50/50?", a: "No. Section 7.001 uses a just-and-right division standard. The result may be equal in some cases, but the statute does not require a mechanical 50/50 split." },
      { q: "Can custody and child support be handled in the divorce?", a: "Yes. When the court has jurisdiction, divorce orders commonly resolve conservatorship, possession and access, child support, and related parent-child issues." },
    ],
    sources: [
      { label: "Texas Family Code § 6.001", url: "https://statutes.capitol.texas.gov/?artSec=6.001&chapter=FA.6&code=FA&tab=1" },
      { label: "Texas Family Code Chapter 6", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.6&code=FA&tab=1" },
      { label: "Texas Family Code § 7.001", url: "https://statutes.capitol.texas.gov/?artSec=7.001&chapter=FA.7&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas divorce waiting period", href: "/guides/texas-divorce-waiting-period-law" },
      { label: "Texas divorce name change", href: "/guides/texas-divorce-name-change-law" },
      { label: "Texas child custody", href: "/guides/texas-child-custody-conservatorship-law" },
    ],
  },

  "texas-divorce-waiting-period-law": {
    slug: "texas-divorce-waiting-period-law",
    title: "Texas Divorce Waiting Period: The 60-Day Rule and Exceptions",
    dek: "How Texas Family Code Section 6.702 calculates the divorce waiting period, when a court may grant a divorce sooner, and why filing day is not the same as finalization day.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas generally may not grant a divorce before the 60th day after the date the suit was filed.",
      "The waiting period is a minimum finalization rule; it does not guarantee that a divorce will be completed on day 60.",
      "Section 6.702 contains exceptions tied to specified family-violence convictions, deferred adjudication, and protective orders.",
      "Service, response deadlines, discovery, negotiations, court scheduling, children, and property issues can make a divorce take substantially longer than the statutory minimum.",
    ],
    intro: [
      "Texas's familiar '60-day divorce rule' is often misunderstood. It is generally the earliest point at which the court may grant the divorce, not a promise that a case will be finished in two months.",
      "The statute also contains family-violence exceptions. Those exceptions are specific, so a case involving safety concerns should be evaluated against the actual language of Section 6.702 rather than a generic waiting-period summary.",
    ],
    sections: [
      { heading: "The general rule is 60 days after filing", paragraphs: ["Family Code Section 6.702 generally provides that the court may not grant a divorce before the 60th day after the date the suit was filed. The statutory calculation therefore starts from filing, not from separation or service on the other spouse."] },
      { heading: "Day 60 is not an automatic divorce date", paragraphs: ["The parties still must satisfy the procedural and substantive requirements for a final decree. Contested property, parenting issues, service problems, discovery, mediation, and court scheduling can all extend the case beyond the minimum waiting period."] },
      { heading: "Family-violence exceptions exist", paragraphs: ["Section 6.702 allows an earlier divorce in specified circumstances involving a respondent's conviction or deferred adjudication for certain family-violence offenses against the petitioner or a member of the petitioner's household, or an active protective order based on a finding of family violence committed during the marriage."] },
      { heading: "Temporary orders can operate before final divorce", paragraphs: ["The waiting period does not mean the court is powerless during the case. Chapter 6 authorizes temporary orders and other interim relief when the statutory requirements are met, while the final divorce remains subject to the waiting-period rule unless an exception applies."] },
    ],
    faq: [
      { q: "Can I be divorced exactly 60 days after filing in Texas?", a: "Possibly, but not automatically. Section 6.702 sets a general minimum; the case must otherwise be ready for a final decree and the court must be available to grant it." },
      { q: "Does the 60 days start when my spouse is served?", a: "No. The statute measures from the date the divorce suit is filed." },
      { q: "Can the 60-day period ever be waived?", a: "Section 6.702 contains specific family-violence exceptions. Whether an exception applies depends on the exact statutory facts and court record." },
    ],
    sources: [
      { label: "Texas Family Code § 6.702", url: "https://statutes.capitol.texas.gov/?artSec=6.702&chapter=FA.6&code=FA&tab=1" },
      { label: "Texas Family Code Chapter 6", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.6&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas divorce law", href: "/guides/texas-divorce-law-guide" },
      { label: "Texas family-violence protective orders", href: "/guides/texas-family-violence-protective-order-law" },
      { label: "Texas divorce name change", href: "/guides/texas-divorce-name-change-law" },
    ],
  },
};
