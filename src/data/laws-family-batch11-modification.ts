import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_BATCH11_MODIFICATION_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-child-support-modification-law": {
    slug: "texas-child-support-modification-law",
    title: "Texas Child Support Modification Law: Material Change and the Three-Year Rule",
    dek: "How Texas Family Code Chapter 156 governs modification of child support, including material and substantial change, the three-year 20%-or-$100 test, agreed deviations, and prospective-only changes.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas child support does not automatically change when income, expenses, custody, or family circumstances change; a court or authorized process must modify the existing order.",
      "Section 156.401 generally allows modification for a material and substantial change in circumstances or, in qualifying cases, when three years have passed and the ordered amount differs from current guideline support by either 20 percent or $100.",
      "If the existing amount resulted from an agreement that departed from the guidelines, the three-year shortcut generally does not apply; material and substantial change is required under Section 156.401(a-1).",
      "A modification of the amount generally operates only for obligations accruing after service of citation or an appearance in the modification suit, subject to statutory exceptions.",
    ],
    intro: [
      "A job change, raise, layoff, new child, or shift in physical possession can create a reason to examine child support, but those events do not by themselves rewrite the existing order. Until the order is modified, the existing obligation remains the legal baseline.",
      "Texas uses more than one modification route. Section 156.401 contains the principal grounds, while other Chapter 156 provisions address guidelines, new spouses, incarceration, physical possession, and medical or dental support.",
    ],
    sections: [
      { heading: "Material and substantial change is the main modification ground", paragraphs: ["Section 156.401 allows modification when the circumstances of the child or a person affected by the order have materially and substantially changed since the relevant prior order or settlement agreement, subject to the statute's exceptions."] },
      { heading: "A three-year guideline comparison can provide another route", paragraphs: ["In qualifying cases, Section 156.401 also permits modification when at least three years have passed since the order was rendered or last modified and the monthly amount differs by either 20 percent or $100 from the amount that would be awarded under the current child-support guidelines."] },
      { heading: "Agreed guideline deviations are treated differently", paragraphs: ["If the parties agreed to an order with support different from the guideline amount, Section 156.401(a-1) generally requires a material and substantial change rather than relying on the ordinary three-year comparison alone."] },
      { heading: "A modification is generally prospective, not a rewrite of old installments", paragraphs: ["Section 156.401(b) generally limits modification of the support amount to obligations accruing after the earlier of service of citation or an appearance in the modification suit, subject to specified statutory exceptions. Filing promptly can therefore matter."] },
    ],
    faq: [
      { q: "Does child support automatically change if I lose my job?", a: "No. A change in employment may support a modification request, but the existing order remains in effect until it is legally modified." },
      { q: "What is the Texas three-year child-support modification rule?", a: "In qualifying cases, if three years have passed and the current order differs from guideline support by either 20 percent or $100, Section 156.401 provides a statutory modification ground." },
      { q: "Can a judge retroactively erase old child support because the order should have been lower?", a: "Section 156.401 generally makes an amount modification prospective from service or appearance, subject to statutory exceptions; past-due support is handled under separate enforcement and arrearage rules." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 156", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.156&code=FA&tab=1" },
      { label: "Texas Family Code § 156.401", url: "https://statutes.capitol.texas.gov/?artSec=156.401&chapter=FA.156&code=FA&tab=1" },
      { label: "Texas Family Code § 156.402", url: "https://statutes.capitol.texas.gov/?artSec=156.402&chapter=FA.156&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas child support guidelines", href: "/guides/texas-child-support-guidelines-law" },
      { label: "Texas child support enforcement", href: "/guides/texas-child-support-enforcement-law" },
      { label: "Texas custody modification law", href: "/guides/texas-custody-modification-law" },
    ],
  },

  "texas-custody-modification-law": {
    slug: "texas-custody-modification-law",
    title: "Texas Custody Modification Law: Changing Conservatorship, Possession or Primary Residence",
    dek: "How Texas Family Code Chapter 156 governs modification of conservatorship and possession orders, including best interest, material change, one-year restrictions, child preference, relinquishment, and the 2025 repeated-denial rule.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A court with continuing, exclusive jurisdiction may modify an order governing conservatorship, possession, access, or support under Chapter 156.",
      "Section 156.101 generally requires that modification be in the child's best interest plus one of the statutory grounds, including a material and substantial change in circumstances.",
      "Special affidavit restrictions apply when a suit seeks to change the person with the exclusive right to designate the child's primary residence within one year of the prior order or qualifying settlement agreement.",
      "Effective September 1, 2025, Section 156.107 makes a qualifying pattern of contempt findings for denial of court-ordered possession or access a material and substantial change sufficient to justify modification.",
    ],
    intro: [
      "Texas custody orders are not modified simply because one parent prefers a different schedule or because the parties have informally followed a different arrangement. Chapter 156 requires a court proceeding and statutory grounds.",
      "The exact standard depends on what is being changed and how soon the request is filed. Changing possession times can present a different procedural issue from changing the parent who has the exclusive right to determine the child's primary residence.",
    ],
    sections: [
      { heading: "Best interest plus a statutory ground is the core test", paragraphs: ["Section 156.101 allows modification of conservatorship or possession terms if modification is in the child's best interest and one of the statute's grounds is established. The most common ground is a material and substantial change in the circumstances of the child, a conservator, or another affected party."] },
      { heading: "A child age 12 or older may express a primary-residence preference", paragraphs: ["Section 156.101 includes a ground tied to a child age 12 or older expressing to the court in chambers the child's preference about who should have the exclusive right to designate the primary residence. The preference does not itself decide the case because best interest remains required."] },
      { heading: "Primary-residence changes filed within one year face an affidavit gate", paragraphs: ["Section 156.102 imposes an additional verified-affidavit requirement when a suit seeks to change the person with the exclusive right to designate primary residence within one year of the relevant prior order or settlement agreement. The affidavit must allege one of the specific statutory circumstances before the court schedules the requested modification hearing."] },
      { heading: "Repeated denial of possession became an express modification ground in 2025", paragraphs: ["Effective September 1, 2025, HB 3181 added Section 156.107. A current contempt finding for denial of court-ordered possession or access, combined with at least three previous contempt findings for failure to comply with possession or access terms, constitutes a material and substantial change sufficient to justify modification under the statute."] },
    ],
    faq: [
      { q: "Can parents change a Texas custody order by agreement without going back to court?", a: "Parents can agree informally, but an informal agreement does not itself replace the signed order. A legally enforceable modification generally requires a new court order." },
      { q: "Does a 12-year-old choose which parent to live with in Texas?", a: "No. Section 156.101 lets a child age 12 or older express a preference to the court in chambers, but the court still applies the child's best interest and the other statutory requirements." },
      { q: "Did Texas change the law for repeated denial of visitation in 2025?", a: "Yes. HB 3181 added Section 156.107 effective September 1, 2025, creating an express material-change rule for a qualifying pattern of contempt findings involving denial of possession or access." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 156", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.156&code=FA&tab=1" },
      { label: "Texas Family Code § 156.101", url: "https://statutes.capitol.texas.gov/?artSec=156.101&chapter=FA.156&code=FA&tab=1" },
      { label: "Texas Family Code § 156.107", url: "https://statutes.capitol.texas.gov/?artSec=156.107&chapter=FA.156&code=FA&tab=1" },
      { label: "Texas Legislature HB 3181 (2025), enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03181F.HTM" },
    ],
    related: [
      { label: "Texas child custody law", href: "/guides/texas-child-custody-conservatorship-law" },
      { label: "Texas custody order enforcement", href: "/guides/texas-custody-order-enforcement-law" },
      { label: "Texas standard possession order", href: "/guides/texas-standard-possession-order-law" },
    ],
  },
};
