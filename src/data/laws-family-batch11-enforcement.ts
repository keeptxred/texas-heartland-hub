import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_BATCH11_ENFORCEMENT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-child-support-enforcement-law": {
    slug: "texas-child-support-enforcement-law",
    title: "Texas Child Support Enforcement Law: Arrearages, Judgments and Court Remedies",
    dek: "How Texas Family Code Chapter 157 enforces child-support orders, including motions for enforcement, arrearage calculations, cumulative money judgments, income withholding, and contempt-related procedures.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A motion for enforcement of a Texas child-support order is generally filed in the court with continuing, exclusive jurisdiction under Family Code Chapter 157.",
      "The motion must identify the order provision allegedly violated and, for child-support enforcement, state the ordered amount, amount paid, and claimed arrearages as required by Section 157.002.",
      "Section 157.263 authorizes confirmation of child-support, medical-support, and dental-support arrearages and cumulative money judgments for qualifying unpaid amounts.",
      "Texas law provides multiple enforcement mechanisms, and a periodic-payment order on an arrearage judgment does not necessarily eliminate other lawful collection remedies.",
    ],
    intro: [
      "Past-due child support in Texas is not handled simply by recalculating what a parent thinks should have been paid. Chapter 157 provides a formal enforcement process tied to the existing order, payment history, arrearages, and requested remedies.",
      "Modification and enforcement are different. If circumstances changed, a parent may need a Chapter 156 modification; that does not automatically erase arrearages that accrued under an earlier order.",
    ],
    sections: [
      { heading: "Chapter 157 provides the enforcement procedure", paragraphs: ["Section 157.001 authorizes a motion to enforce provisions of temporary or final orders and places the motion in the court of continuing, exclusive jurisdiction. Child-support orders may be enforced under Chapter 157 and related income-withholding provisions in Chapter 158."] },
      { heading: "The motion must identify the violation and support calculation", paragraphs: ["Section 157.002 requires the motion to identify the violated provision, explain the alleged noncompliance, and state the requested relief. A child-support enforcement motion must also include the amount owed under the order, the amount paid, and the claimed arrearages, with additional detail when contempt is requested."] },
      { heading: "The court can confirm arrearages as a money judgment", paragraphs: ["Section 157.263 directs the court, when properly requested, to confirm qualifying child-support, medical-support, and dental-support arrearages and render cumulative money judgments that include the categories listed in the statute."] },
      { heading: "Enforcement remedies can operate together", paragraphs: ["Section 157.264 provides for periodic payments on an arrearage judgment, including income withholding when applicable, while preserving other lawful judgment and child-support collection remedies. The remedy available in a particular case depends on the order, evidence, procedure, and statutory requirements."] },
    ],
    faq: [
      { q: "Does filing to lower child support erase existing arrears?", a: "No. Modification and enforcement are separate. Section 156.401 generally makes an amount modification prospective from specified procedural events, while accrued arrearages are handled under Chapter 157." },
      { q: "Can Texas turn unpaid child support into a money judgment?", a: "Yes. Section 157.263 provides for confirmation of qualifying arrearages and cumulative money judgments when properly requested." },
      { q: "Is contempt the only child-support enforcement tool?", a: "No. Chapter 157 and related provisions provide multiple remedies, including money judgments and income withholding where applicable. Contempt has additional procedural requirements." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 157", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.157&code=FA&tab=1" },
      { label: "Texas Family Code § 157.002", url: "https://statutes.capitol.texas.gov/?artSec=157.002&chapter=FA.157&code=FA&tab=1" },
      { label: "Texas Family Code § 157.263", url: "https://statutes.capitol.texas.gov/?artSec=157.263&chapter=FA.157&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas child support guidelines", href: "/guides/texas-child-support-guidelines-law" },
      { label: "Texas child support modification", href: "/guides/texas-child-support-modification-law" },
      { label: "Texas custody order enforcement", href: "/guides/texas-custody-order-enforcement-law" },
    ],
  },

  "texas-custody-order-enforcement-law": {
    slug: "texas-custody-order-enforcement-law",
    title: "Texas Custody and Visitation Enforcement: Enforcing Possession Orders",
    dek: "How Texas Family Code Chapter 157 handles enforcement of conservatorship, possession, and access orders, including motion requirements, contempt, clarification of vague orders, and the 2025 repeated-denial modification rule.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas possession and access orders are enforced through the court order itself; a parent should not assume that an informal schedule replaces the signed order.",
      "A Chapter 157 enforcement motion must identify the provision allegedly violated, describe the noncompliance, and request specific relief.",
      "Contempt may be available for an enforceable order, but vague or nonspecific language can require clarification before contempt enforcement.",
      "Effective September 1, 2025, a qualifying pattern of contempt findings for denial of possession or access can also constitute a material and substantial change supporting modification under Section 156.107.",
    ],
    intro: [
      "When court-ordered possession or access is denied, Texas law provides an enforcement process rather than a rule allowing the other parent to retaliate by withholding support or ignoring other parts of the order.",
      "Successful enforcement depends heavily on the wording of the existing order and proof of the specific violation. Exact exchange times, dates, locations, and conditions can matter when contempt is requested.",
    ],
    sections: [
      { heading: "The signed order is the starting point", paragraphs: ["Section 157.001 authorizes enforcement of provisions in temporary and final orders. The motion belongs in the court with continuing, exclusive jurisdiction, and the movant must tie the requested relief to the actual order language."] },
      { heading: "The motion must identify specific violations", paragraphs: ["Section 157.002 requires the motion to identify the allegedly violated provision, state how the respondent failed to comply, and state the relief requested. Precision is especially important when contempt is sought."] },
      { heading: "A vague order may need clarification", paragraphs: ["Section 157.421 allows a court to clarify an order that is not specific enough to be enforced by contempt. A clarification may make the order specific enough for future enforcement, but Chapter 157 bars using clarification to make a substantive change or retroactively punish conduct under language that was too vague."] },
      { heading: "Repeated contempt findings can now affect modification", paragraphs: ["HB 3181 added Section 156.107 effective September 1, 2025. Under that section, a current contempt finding for denial of possession or access plus at least three prior contempt findings for failure to comply with possession or access terms constitutes a material and substantial change sufficient to justify modification."] },
    ],
    faq: [
      { q: "Can I stop paying child support if the other parent denies visitation?", a: "No. Texas Family Code Section 153.001 states that a court may not condition possession or access on payment of child support. Support and possession have separate enforcement mechanisms." },
      { q: "Can a vague visitation order be enforced by contempt?", a: "A court may clarify an order that is not specific enough for contempt under Section 157.421. Clarification cannot be used to make a substantive change or retroactively impose contempt for previously unclear terms." },
      { q: "Can repeated denial of visitation support a custody modification?", a: "Yes, in the specific circumstances added by Section 156.107 effective September 1, 2025, involving a current contempt finding and at least three prior qualifying contempt findings." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 157", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.157&code=FA&tab=1" },
      { label: "Texas Family Code § 157.002", url: "https://statutes.capitol.texas.gov/?artSec=157.002&chapter=FA.157&code=FA&tab=1" },
      { label: "Texas Family Code § 157.421", url: "https://statutes.capitol.texas.gov/?artSec=157.421&chapter=FA.157&code=FA&tab=1" },
      { label: "Texas Legislature HB 3181 (2025), enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB03181F.HTM" },
    ],
    related: [
      { label: "Texas custody modification law", href: "/guides/texas-custody-modification-law" },
      { label: "Texas standard possession order", href: "/guides/texas-standard-possession-order-law" },
      { label: "Texas child support enforcement", href: "/guides/texas-child-support-enforcement-law" },
    ],
  },
};
