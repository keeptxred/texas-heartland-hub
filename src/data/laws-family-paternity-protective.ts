import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const FAMILY_PATERNITY_PROTECTIVE_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-paternity-law-guide": {
    slug: "texas-paternity-law-guide",
    title: "Texas Paternity Law: Presumptions, Acknowledgments and Court Orders",
    dek: "A plain-English guide to Texas Family Code Chapter 160: how parentage can be presumed, acknowledged, denied, or adjudicated and why paternity affects custody, support, and legal rights.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas paternity and parentage rules are governed principally by Family Code Chapter 160, the Uniform Parentage Act.",
      "A man can be a presumed father under statutory circumstances, while a valid acknowledgment of paternity is a separate legal route to establishing paternity.",
      "An acknowledgment must satisfy statutory requirements; rescission and challenges are governed by specific procedures and deadlines rather than an informal change of mind.",
      "A court can adjudicate parentage, and an established parent-child relationship can affect conservatorship, possession, child support, inheritance, records, and other rights and duties.",
    ],
    intro: [
      "Texas law recognizes several paths by which legal parentage can be established. Marriage-related presumptions, voluntary acknowledgments, and court adjudication are different legal mechanisms and should not be treated as interchangeable.",
      "Because parentage can have long-term consequences for support and parental rights, a person facing disputed paternity should use the current Chapter 160 procedures rather than rely on an informal agreement between adults.",
    ],
    sections: [
      { heading: "Chapter 160 defines the parentage framework", paragraphs: ["Family Code Chapter 160 sets out the state's Uniform Parentage Act, including rules for presumed parentage, acknowledgments and denials, genetic testing, proceedings to adjudicate parentage, and resulting orders."] },
      { heading: "Presumed father status is statutory", paragraphs: ["Section 160.204 identifies circumstances in which a man is presumed to be the father of a child. The presumption is legal status created by the statute and can interact with acknowledgment and adjudication procedures in Chapter 160."] },
      { heading: "A valid acknowledgment can establish paternity", paragraphs: ["Subchapter D allows a qualifying acknowledgment of paternity. The document must satisfy the statutory requirements, and Chapter 160 provides specific rules for rescission and later challenges rather than allowing the acknowledgment to be casually withdrawn at any time."] },
      { heading: "Court adjudication can resolve disputed parentage", paragraphs: ["When parentage is disputed or otherwise requires judicial determination, Chapter 160 provides a court process that can include genetic testing and a final order adjudicating parentage. Once legal parentage is established, other Family Code titles govern support, conservatorship, possession, and related rights and duties."] },
    ],
    faq: [
      { q: "Does signing a birth certificate by itself always establish Texas paternity?", a: "Not necessarily. Texas parentage law uses statutory presumptions, valid acknowledgments, and court adjudication. The legal effect depends on which Chapter 160 requirements were actually satisfied." },
      { q: "Can an acknowledgment of paternity be undone at any time?", a: "No. Chapter 160 contains specific rescission and challenge procedures and deadlines. A person should review those provisions promptly if the acknowledgment is disputed." },
      { q: "Why does legal paternity matter?", a: "Established parentage can affect child support, conservatorship and possession, inheritance, records, and other legal rights and duties involving the child." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 160", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.160&code=FA&tab=1" },
      { label: "Texas Family Code § 160.204", url: "https://statutes.capitol.texas.gov/?artSec=160.204&chapter=FA.160&code=FA&tab=1" },
      { label: "Texas Family Code § 160.301", url: "https://statutes.capitol.texas.gov/?artSec=160.301&chapter=FA.160&code=FA&tab=1" },
    ],
    related: [
      { label: "Texas child support guidelines", href: "/guides/texas-child-support-guidelines-law" },
      { label: "Texas child custody", href: "/guides/texas-child-custody-conservatorship-law" },
      { label: "Texas standard possession order", href: "/guides/texas-standard-possession-order-law" },
    ],
  },

  "texas-family-violence-protective-order-law": {
    slug: "texas-family-violence-protective-order-law",
    title: "Texas Family-Violence Protective Orders: Eligibility, Findings and Duration",
    dek: "How Texas Family Code Title 4 defines family violence, who may seek a protective order, what a court must find, how long orders can last, and the 2025 conflict-and-transfer update in SB 1559.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas family-violence protective orders are governed by Family Code Title 4, including Chapters 71, 82, 83, and 85.",
      "A final protective order requires the statutory findings in Section 85.001; temporary ex parte relief uses a separate emergency framework.",
      "Section 85.025 governs duration and allows some orders to last longer than the ordinary period when specified statutory findings are made.",
      "Effective September 1, 2025, SB 1559 added rules making a valid protective order prevail over conflicting divorce or parent-child orders while it remains valid and subject to transfer, and revised the transfer process.",
    ],
    intro: [
      "A Texas protective order is a court order, not the same thing as a police report, criminal charge, restraining request, or informal no-contact agreement. Family Code Title 4 supplies the civil family-violence framework.",
      "Safety-sensitive cases can move quickly and may involve temporary ex parte orders before a final hearing. This guide explains the statutory structure, not individualized safety planning or legal strategy.",
    ],
    sections: [
      { heading: "Family Code Title 4 controls the family-violence framework", paragraphs: ["Chapter 71 defines key terms including family violence, family, household, and dating relationship. Chapter 82 governs applications, Chapter 83 addresses temporary ex parte orders, and Chapter 85 governs final protective orders and their contents."] },
      { heading: "The court must make statutory findings for a final order", paragraphs: ["Section 85.001 identifies the findings that support issuance of a protective order after the hearing. The court may then impose the protections authorized by Chapter 85 based on the facts and statutory requirements."] },
      { heading: "Duration depends on Section 85.025", paragraphs: ["Section 85.025 provides the general duration rules and circumstances under which a protective order can remain effective for a longer period. The actual expiration date and terms in the signed order control unless the order is lawfully modified, transferred, or otherwise changed by a court."] },
      { heading: "SB 1559 changed conflicts and transfers in 2025", paragraphs: ["Effective September 1, 2025, SB 1559 added Family Code Section 81.012 so a protective order, including a temporary ex parte order, prevails to the extent of a conflict with specified divorce or parent-child orders while the protective order remains valid and subject to transfer. The bill also revised Section 85.064 transfer procedures and added safety-focused findings and notice requirements."] },
    ],
    faq: [
      { q: "Is a Texas protective order the same as a criminal case?", a: "No. A protective order under Family Code Title 4 is a court order with its own civil statutory process, though violating an order can create separate criminal and contempt consequences." },
      { q: "How long does a Texas family-violence protective order last?", a: "Section 85.025 governs duration. The ordinary rule and longer-duration provisions depend on the findings and terms in the particular order." },
      { q: "What happens if a protective order conflicts with a divorce or custody order?", a: "For qualifying orders issued under the current law, Section 81.012 provides that the protective order prevails to the extent of the conflict while it is valid and subject to transfer. SB 1559 also revised the transfer procedure effective September 1, 2025." },
    ],
    sources: [
      { label: "Texas Family Code Chapter 71", url: "https://statutes.capitol.texas.gov/?artSec=&chapter=FA.71&code=FA&tab=1" },
      { label: "Texas Family Code § 85.001", url: "https://statutes.capitol.texas.gov/?artSec=85.001&chapter=FA.85&code=FA&tab=1" },
      { label: "Texas Family Code § 85.025", url: "https://statutes.capitol.texas.gov/?artSec=85.025&chapter=FA.85&code=FA&tab=1" },
      { label: "Texas Legislature SB 1559 (2025), enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB01559F.htm" },
    ],
    related: [
      { label: "Texas divorce waiting period", href: "/guides/texas-divorce-waiting-period-law" },
      { label: "Texas child custody", href: "/guides/texas-child-custody-conservatorship-law" },
      { label: "Texas family-violence lease termination", href: "/guides/texas-family-violence-lease-termination-law" },
    ],
  },
};
