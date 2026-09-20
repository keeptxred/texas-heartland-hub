import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH15_CREDIT_SERVICES_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-credit-repair-organization-law": {
    slug: "texas-credit-repair-organization-law",
    title: "Texas Credit Repair Law: Credit Services Contracts and the Three-Day Cancellation Right",
    dek: "How Texas Finance Code Chapter 393 regulates credit services organizations, including pre-contract disclosures, written contract terms, the 180-day service estimate limit, and the consumer's three-day cancellation right.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Finance Code Chapter 393 regulates credit services organizations that, for payment, offer services such as improving a consumer's credit history or rating or helping obtain consumer credit, subject to the chapter's definitions and exclusions.",
      "Before entering a contract, a credit services organization must provide the disclosure statement required by Section 393.105, including information about credit-report rights and the limits of what accurate information can lawfully be removed.",
      "Section 393.201 requires the consumer contract to be written, dated, and signed and to describe payment terms, promised services and guarantees, and an estimated performance period that may not exceed 180 days.",
      "Section 393.202 requires a conspicuous cancellation notice stating that the buyer may cancel before midnight of the third day after the transaction, together with detachable cancellation forms.",
    ],
    intro: [
      "Texas credit-repair protections are found principally in the Credit Services Organizations Act, Finance Code Chapter 393. The law is broader than the everyday phrase 'credit repair' and can cover paid services involving credit improvement or obtaining consumer credit.",
      "A company cannot lawfully promise to make accurate negative credit information permanently disappear merely because the consumer pays a fee. Chapter 393 requires disclosures designed to distinguish legitimate dispute rights from impossible or misleading promises.",
    ],
    sections: [
      { heading: "Chapter 393 defines covered credit services organizations", paragraphs: ["Section 393.001 defines a credit services organization to include a person who, for valuable consideration, provides or represents that it will provide specified services concerning consumer credit, including improving a consumer's credit history or rating or obtaining an extension of consumer credit. The statutory definitions and exclusions should be checked before assuming a particular business is covered."] },
      { heading: "Consumers receive disclosures before contracting", paragraphs: ["Section 393.105 requires a written disclosure statement containing specified information about the consumer's credit-report rights, the ability to dispute inaccurate information, limits on removing accurate information, and the availability of nonprofit credit counseling. Section 393.106 requires the organization to retain a signed acknowledgment of that disclosure."] },
      { heading: "The contract must describe services and cannot estimate more than 180 days", paragraphs: ["Section 393.201 requires the contract to be in writing, dated, and signed. It must disclose payment terms and fully describe the promised services, guarantees, refund promises, and the estimated period for performance, which the statute caps at 180 days."] },
      { heading: "The consumer receives a three-day cancellation right", paragraphs: ["Section 393.202 requires the contract to state conspicuously that the buyer may cancel before midnight of the third day after the transaction. The organization must attach two detachable cancellation forms, and the statutory notice explains the consequences of timely cancellation."] },
    ],
    faq: [
      { q: "Can a Texas credit-repair company promise to permanently remove accurate negative information?", a: "Chapter 393 requires disclosure that accurate information cannot simply be permanently removed from a consumer reporting agency's files. Consumers retain rights to dispute information that is inaccurate or incomplete." },
      { q: "How long can a Texas credit-services contract say the work will take?", a: "Section 393.201 requires an estimated period for performing the services and states that the estimate may not exceed 180 days." },
      { q: "Can I cancel a Texas credit-services contract after signing it?", a: "Section 393.202 gives the buyer a statutory right to cancel before midnight of the third day after the transaction, using the notice procedure required by the statute." },
    ],
    sources: [
      { label: "Texas Finance Code Chapter 393", url: "https://statutes.capitol.texas.gov/Docs/FI/htm/FI.393.htm" },
      { label: "Texas Finance Code § 393.105", url: "https://statutes.capitol.texas.gov/?artSec=393.105&chapter=FI.393&code=FI&tab=1" },
      { label: "Texas Finance Code § 393.201", url: "https://statutes.capitol.texas.gov/?artSec=393.201&chapter=FI.393&code=FI&tab=1" },
      { label: "Texas Finance Code § 393.202", url: "https://statutes.capitol.texas.gov/?artSec=393.202&chapter=FI.393&code=FI&tab=1" },
    ],
    related: [
      { label: "Texas credit freeze law", href: "/guides/texas-credit-freeze-law" },
      { label: "Debt validation and disputes", href: "/guides/debt-validation-dispute-law-texas" },
      { label: "Texas payday and title loan law", href: "/guides/texas-payday-title-loan-law" },
    ],
  },

  "texas-payday-title-loan-law": {
    slug: "texas-payday-title-loan-law",
    title: "Texas Payday and Title Loan Law: Credit Access Business Fees and Disclosures",
    dek: "How Texas Finance Code Chapter 393 regulates credit access businesses that arrange payday and motor-vehicle-title loans, including licensing, lender and fee disclosures, cancellation rights, prepayment terms, and local-rule overlap.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A Texas credit access business obtains or assists a consumer in obtaining credit from an independent third-party lender as a deferred-presentment payday transaction or motor-vehicle-title loan and is the licensed broker in this statutory model.",
      "Finance Code Section 393.201 requires a credit access business contract to identify the lender, disclose lender interest and the specific fees paid to the credit access business, include OCCC contact information, and state that the consumer has no prepayment penalty.",
      "Section 393.602 permits credit access business fees to be calculated on a daily, biweekly, monthly, or other periodic basis as agreed by the parties, but a fee may not be charged unless it is disclosed.",
      "Texas does not have one simple statewide statement that all payday or title-loan costs are capped at a single APR; consumers should review the lender interest, CAB fees, current OCCC disclosures, and any applicable local ordinance separately.",
    ],
    intro: [
      "Texas payday and title lending often uses a credit-access-business structure: the business at the storefront or online arranges credit from an independent third-party lender and charges its own service fee. That makes the consumer contract more complex than a single interest-rate number.",
      "OCCC currently licenses credit access businesses and publishes cost-disclosure forms and compliance guidance. The agency also has 2026 rule-review activity concerning CAB licensing and recordkeeping, so this guide relies on enacted Chapter 393 and current OCCC materials rather than pending draft amendments.",
    ],
    sections: [
      { heading: "Chapter 393 defines the payday and title-loan CAB model", paragraphs: ["Section 393.602 applies the credit-access-business subchapter when a covered credit services organization obtains or assists a Texas consumer in obtaining a deferred-presentment transaction or a motor-vehicle-title loan. OCCC describes the CAB as the licensed broker and the actual lender as an independent third party in this model."] },
      { heading: "The contract must separate lender interest from CAB fees", paragraphs: ["Section 393.201 requires a CAB contract to disclose the lender, the interest paid or to be paid to that lender, and the specific fees paid to the credit access business. The contract must also include OCCC contact information and other statutory statements, including that the consumer has no prepayment penalty."] },
      { heading: "Fees can be periodic but must be disclosed", paragraphs: ["Section 393.602 allows CAB service fees as agreed by the parties and permits daily, biweekly, monthly, or other periodic calculation. The same section states that a fee may not be charged unless it is disclosed, so the fee schedule should be examined separately from lender interest."] },
      { heading: "State law and local ordinances can overlap", paragraphs: ["OCCC publishes CAB cost disclosures and has issued guidance addressing compliance with city ordinances. A consumer or business should therefore check current Chapter 393, OCCC rules and disclosures, and any applicable municipal requirements instead of assuming the statewide statute is the only rule that matters."] },
    ],
    faq: [
      { q: "Who is actually lending the money in a Texas payday or title-loan CAB transaction?", a: "OCCC describes the CAB as a licensed business that obtains credit for the consumer from an independent third-party lender. The consumer typically signs a loan note with the lender and a separate services agreement with the CAB." },
      { q: "Can a Texas credit access business charge service fees?", a: "Yes. Section 393.602 allows CAB fees as agreed by the parties and permits periodic calculation, but the fee may not be charged unless it is disclosed." },
      { q: "Can a Texas payday or title loan charge a prepayment penalty?", a: "Section 393.201 requires the CAB contract to state that the consumer may prepay the extension of consumer credit at any time without penalty." },
    ],
    sources: [
      { label: "Texas Finance Code Chapter 393", url: "https://statutes.capitol.texas.gov/Docs/FI/htm/FI.393.htm" },
      { label: "Texas Finance Code § 393.201", url: "https://statutes.capitol.texas.gov/?artSec=393.201&chapter=FI.393&code=FI&tab=1" },
      { label: "Texas Finance Code § 393.602", url: "https://statutes.capitol.texas.gov/?artSec=393.602&chapter=FI.393&code=FI&tab=1" },
      { label: "Texas Office of Consumer Credit Commissioner — Credit Access Businesses", url: "https://occc.texas.gov/industry/cab/" },
      { label: "Texas Office of Consumer Credit Commissioner — CAB Disclosures", url: "https://occc.texas.gov/industry/cab/bulletins-disclosures/" },
    ],
    related: [
      { label: "Texas credit-repair organization law", href: "/guides/texas-credit-repair-organization-law" },
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
      { label: "Texas time-barred debt", href: "/guides/texas-time-barred-debt-law" },
    ],
  },
};
