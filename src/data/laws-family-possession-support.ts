import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_POSSESSION_SUPPORT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-standard-possession-order-law": {
    slug: "texas-standard-possession-order-law",
    title: "Texas Standard Possession Order: What the Statutory Schedule Does",
    dek: "How Texas Family Code Chapter 153 uses the Standard Possession Order, why distance matters, when courts can deviate, and why the statutory schedule is not the same as conservatorship status.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Family Code Chapter 153 contains a statutory Standard Possession Order framework for possession of and access to a child.",
      "The schedule is not identical in every case; the statute distinguishes circumstances including the distance between the parents' residences and contains options for certain periods of possession.",
      "The Standard Possession Order is a possession schedule, not a rule that determines whether parents are sole or joint managing conservators.",
      "A court may order a different schedule when the statutory standards and the child's best interest support a deviation.",
    ],
    intro: [
      "The Texas Standard Possession Order, often shortened to SPO, is a statutory parenting-time framework rather than a one-line rule about alternating weekends. Chapter 153 contains the operative provisions and different rules for different circumstances.",
      "Parents should read the signed court order rather than rely on a generic calendar. The order controls the actual exchange times, elections, holidays, summer periods, geographic assumptions, and any court-approved deviations in that case.",
    ],
    sections: [
      { heading: "The SPO is a statutory possession framework", paragraphs: ["Subchapter F of Chapter 153 sets out the Standard Possession Order. Its purpose is to provide a defined possession-and-access structure that courts can use when the statutory presumptions and best-interest analysis support it."] },
      { heading: "Distance between the parents matters", paragraphs: ["The Family Code separates provisions for parents who reside within the statutory distance threshold from provisions that apply when they live farther apart. That affects parts of the possession framework, so a single statewide calendar cannot accurately describe every case."] },
      { heading: "Possession and conservatorship are separate concepts", paragraphs: ["A parent can be a joint managing conservator without having equal possession time. Conversely, the possession schedule does not by itself determine which parent holds particular education, medical, residence, or other decision-making rights."] },
      { heading: "The child's best interest can justify a different schedule", paragraphs: ["Section 153.002 makes best interest the primary consideration, and Chapter 153 contains provisions allowing the court to tailor possession and access when the standard framework is not appropriate for the child or the facts before the court."] },
    ],
    faq: [
      { q: "Is the Texas Standard Possession Order always 50/50?", a: "No. The SPO is a statutory possession framework and is not the same thing as an equal-possession schedule." },
      { q: "Does joint custody mean the SPO automatically applies?", a: "No. Conservatorship status and possession are separate parts of the order. The court must enter the possession terms that apply in the case." },
      { q: "Should I follow an online SPO calendar or my signed order?", a: "Your signed order controls. Generic calendars can be useful references, but they may not reflect elections, deviations, distance rules, or case-specific language in the actual order." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 153", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.153&code=FA&tab=1" },
      { label: "Texas Family Code § 153.311", url: "https://statutes.capitol.texas.gov/?artSec=153.311&chapter=FA.153&code=FA&tab=1" },
      { label: "Texas Family Code § 153.312", url: "https://statutes.capitol.texas.gov/?artSec=153.312&chapter=FA.153&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas child custody", href: "/guides/texas-child-custody-conservatorship-law" },
      { label: "Texas child support guidelines", href: "/guides/texas-child-support-guidelines-law" },
      { label: "Texas paternity law", href: "/guides/texas-paternity-law-guide" },
    ],
  },

  "texas-child-support-guidelines-law": {
    slug: "texas-child-support-guidelines-law",
    title: "Texas Child Support: Guidelines, Calculator, Payments and Modifications",
    dek: "How Texas child support works under Family Code Chapter 154, including net resources, guideline percentages, multiple households, the Attorney General calculator, payments, modifications, medical support, and court-approved deviations.",
    updated: "2026-08-21",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas child support is governed principally by Family Code Chapter 154, which uses statutory guidelines rather than a single flat statewide payment amount.",
      "The guideline calculation begins with the obligor's net resources as defined by statute and then applies the guideline framework based on the number of children before the court and other statutory circumstances.",
      "For qualifying net resources, the standard guideline schedule starts at 20% for one child and increases with the number of children before the court; separate low-income and multiple-household rules can change the calculation.",
      "The Texas Attorney General provides official child-support services for estimating support, applying for services, making and receiving payments, reviewing case information, and requesting a modification review.",
      "The court may consider statutory factors and order an amount that varies from the guideline result when application of the guidelines would be unjust or inappropriate under the circumstances.",
    ],
    intro: [
      "Texas child support is often discussed as a percentage of income, but the actual statute is more detailed. Chapter 154 defines net resources, sets the guideline framework, addresses multiple households, and lists factors that can support a deviation.",
      "Searches for Texas child support also often involve practical next steps: estimating a payment, starting a case, checking a case, making or receiving payments, or asking whether an existing order can be changed. Those functions are handled through the Texas Office of the Attorney General's Child Support Division and the courts.",
      "Support orders may also address medical and dental support and other obligations. A reliable estimate therefore starts with the current statute and the facts in the case rather than gross pay alone, and an online calculator remains only an estimate until an amount is set or approved through the legal process.",
    ],
    sections: [
      { heading: "The calculation starts with statutory net resources", paragraphs: ["Section 154.062 defines net resources for child-support purposes and identifies categories of resources and statutory deductions. Gross salary by itself is therefore not the final guideline base."] },
      { heading: "Chapter 154 supplies the guideline framework", paragraphs: ["Sections 154.121 through 154.130 contain the principal guideline rules. Section 154.125 applies the guideline schedule to qualifying net monthly resources, while other sections address lower-resource cases, multiple households, and additional circumstances. The standard schedule begins at 20% of net resources for one child before the court, then 25% for two, 30% for three, 35% for four, and 40% for five or more, subject to the statute's thresholds and adjustment rules."] },
      { heading: "Use the Attorney General calculator as an estimate, not a court order", paragraphs: ["The Texas Attorney General's Child Support Division provides an official calculator to estimate support from a single source of income. The agency expressly warns that the actual amount set or approved by a court may differ, so the calculator is best used as a planning tool rather than a substitute for the signed order."] },
      { heading: "Payments, case access and child-support services", paragraphs: ["The Attorney General provides the statewide practical service layer for many child-support cases. Parents can use its child-support portal to learn how to apply for services, review case information, and find payment and receipt options. Official payment methods include online and phone payments, mail, cash, wage withholding, and bank autodraft."] },
      { heading: "An existing order does not change automatically when income changes", paragraphs: ["A change in income, employment, family circumstances, or medical coverage does not by itself rewrite a court order. The Attorney General provides a modification-review process for eligible cases, and Texas law requires the legal process to change the ordered amount. Informal agreements between parents do not replace the operative order."] },
      { heading: "The guideline result is presumptive, not mechanically absolute", paragraphs: ["Section 154.122 creates a rebuttable presumption that guideline support is reasonable and in the child's best interest. Section 154.123 lists additional factors a court may consider when deciding whether application of the guidelines would be unjust or inappropriate."] },
      { heading: "Support and possession are separate obligations", paragraphs: ["Texas orders expressly treat child support and possession or access as separate duties. A dispute over parenting time does not by itself erase a support obligation, and failure to pay support does not by itself authorize denial of court-ordered possession or access."] },
    ],
    faq: [
      { q: "Is Texas child support based on gross income?", a: "Not directly. Chapter 154 uses statutory net resources, which are calculated under Section 154.062 before the guideline framework is applied." },
      { q: "What percentage is child support in Texas?", a: "For the standard guideline schedule and qualifying net resources, the percentages begin at 20% for one child, 25% for two, 30% for three, 35% for four, and 40% for five or more. Low-income and multiple-household rules can produce different percentages, and a court may deviate when the statute permits." },
      { q: "Does Texas have an official child support calculator?", a: "Yes. The Texas Office of the Attorney General provides a child-support calculator. It is an estimate for planning purposes; the amount set or approved through the legal process can differ." },
      { q: "How do I pay Texas child support?", a: "The Texas Attorney General lists official payment options including online or phone payment, mail, cash, wage withholding, and bank autodraft. Use the OAG payment page for the current methods and instructions tied to your case." },
      { q: "Can Texas child support be modified if income changes?", a: "Possibly, but the ordered amount does not change automatically. An eligible case can be reviewed for modification, and the amount changes only through the legal process rather than an informal agreement between parents." },
      { q: "Can a Texas judge order a different amount than the guidelines?", a: "Yes. The guidelines are presumptively reasonable, but Section 154.123 lists factors the court may consider in deciding whether a different amount is appropriate." },
      { q: "Does missing visitation cancel child support?", a: "No. Texas law treats support and possession as separate obligations. Enforcement of one should not be handled by unilaterally withholding the other." },
    ],
    sources: [
      { label: "Texas Family Code § 154.062 — net resources", url: "https://statutes.capitol.texas.gov/?artSec=154.062&chapter=FA.154&code=FA&tab=1" },
      { label: "Texas Family Code § 154.125 — guideline percentages", url: "https://statutes.capitol.texas.gov/?artSec=154.125&chapter=FA.154&code=FA&tab=1" },
      { label: "Texas Family Code § 154.123 — deviation factors", url: "https://statutes.capitol.texas.gov/?artSec=154.123&chapter=FA.154&code=FA&tab=1" },
      { label: "Texas Attorney General — Child Support", url: "https://www.texasattorneygeneral.gov/child-support" },
      { label: "Texas Attorney General — Get Started and Child Support Calculator", url: "https://www.texasattorneygeneral.gov/child-support/get-started" },
      { label: "Texas Attorney General — How to Pay Child Support", url: "https://www.texasattorneygeneral.gov/child-support/paying-and-receiving-child-support/how-pay-child-support" },
      { label: "Texas Attorney General — Modify Child Support", url: "https://www.texasattorneygeneral.gov/child-support/paying-and-receiving-child-support/get-back-track/modify-child-support" },
    ],
    related: [
      { label: "Texas Attorney General", href: "/texas-government/attorney-general" },
      { label: "Texas child custody", href: "/guides/texas-child-custody-conservatorship-law" },
      { label: "Texas standard possession order", href: "/guides/texas-standard-possession-order-law" },
      { label: "Texas paternity law", href: "/guides/texas-paternity-law-guide" },
    ],
  },
};
