import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH15_DEBT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-time-barred-debt-law": {
    slug: "texas-time-barred-debt-law",
    title: "Texas Time-Barred Debt Law: Statutes of Limitation and Debt Buyers",
    dek: "How Texas treats old consumer debt, including the applicable limitations period, the special debt-buyer rule in Finance Code Section 392.307, required notices, and why a payment does not revive a barred debt-buyer lawsuit.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not use one limitations period for every kind of debt; the governing contract or instrument and the applicable limitations statute must be identified.",
      "Finance Code Section 392.307 prohibits a debt buyer from filing suit or initiating arbitration to collect consumer debt after the applicable limitations period in Section 16.004 of the Civil Practice and Remedies Code or Section 3.118 of the Business & Commerce Code has expired.",
      "For a debt buyer covered by Section 392.307, a payment, oral or written reaffirmation, or other activity does not revive the time-barred cause of action.",
      "A debt buyer collecting time-barred debt must provide the statutory disclosure in the initial written communication, with language that varies depending on credit-reporting status.",
    ],
    intro: [
      "An old debt does not necessarily disappear, but the creditor's ability to sue can expire. Texas law makes that distinction especially important when a debt buyer is collecting charged-off consumer debt.",
      "Consumers should identify the type of debt, the last legally relevant dates, whether the collector is a debt buyer, and whether a lawsuit has already been filed before relying on a limitations defense.",
    ],
    sections: [
      { heading: "Different debts can use different limitation statutes", paragraphs: ["Civil Practice and Remedies Code Section 16.004 governs several four-year causes of action, including actions for debt, while Business & Commerce Code Section 3.118 contains separate limitations rules for negotiable instruments. The exact obligation and accrual rules matter."] },
      { heading: "Section 392.307 creates a special debt-buyer prohibition", paragraphs: ["A debt buyer may not directly or indirectly commence an action or initiate arbitration to collect consumer debt after the applicable limitations period referenced by Section 392.307 has expired."] },
      { heading: "Payment does not revive the barred debt-buyer action", paragraphs: ["Section 392.307 expressly states that once the debt-buyer action is barred, payment, reaffirmation, or other activity on the debt does not revive the cause of action. That protection should not be generalized to every type of creditor or every nonconsumer obligation without checking the governing law."] },
      { heading: "Time-barred collection letters require a warning", paragraphs: ["A debt buyer collecting a time-barred consumer debt must include a conspicuous statutory notice in the initial written communication. The required wording depends on whether the debt can still be reported and whether the debt buyer furnishes information to a consumer reporting agency."] },
    ],
    faq: [
      { q: "Is every Texas consumer debt subject to a four-year statute of limitations?", a: "No. Many debt actions involve Section 16.004, but negotiable instruments and other obligations can use different statutes or accrual rules. The exact debt must be identified." },
      { q: "Can a debt buyer sue after the applicable limitation period expires?", a: "Section 392.307 prohibits a covered debt buyer from suing or initiating arbitration after the applicable limitations period referenced by that section has expired." },
      { q: "Does making a small payment restart a time-barred debt-buyer lawsuit in Texas?", a: "For debt buyers covered by Section 392.307, the statute expressly says payment or reaffirmation does not revive the barred cause of action." },
    ],
    sources: [
      { label: "Texas Finance Code § 392.307", url: "https://statutes.capitol.texas.gov/?artSec=392.307&chapter=FI.392&code=FI&tab=1" },
      { label: "Texas Civil Practice and Remedies Code § 16.004", url: "https://statutes.capitol.texas.gov/?artSec=16.004&chapter=CP.16&code=CP&tab=1" },
      { label: "Texas Business & Commerce Code § 3.118", url: "https://statutes.capitol.texas.gov/?artSec=3.118&chapter=BC.3&code=BC&tab=1" },
    ],
    related: [
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
      { label: "Debt validation and disputes", href: "/guides/debt-validation-dispute-law-texas" },
      { label: "Texas wage garnishment law", href: "/guides/texas-wage-garnishment-law" },
    ],
  },

  "texas-wage-garnishment-law": {
    slug: "texas-wage-garnishment-law",
    title: "Texas Wage Garnishment Law: Why Current Wages Are Usually Exempt",
    dek: "Texas protections for current wages from ordinary creditor garnishment, the child-support exception, federal collection exceptions, and why deposited money and secured debts require separate analysis.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Property Code Section 42.001 exempts current wages for personal services from seizure for ordinary creditor claims, outside the personal-property value cap.",
      "The Texas statute expressly excepts enforcement of court-ordered child support from the current-wage exemption.",
      "Federal law can independently authorize withholding or collection for obligations such as federal taxes and qualifying defaulted federal student loans, so the Texas creditor exemption is not absolute against federal collection powers.",
      "The exemption for current wages should not be assumed to protect every dollar after wages are paid and deposited into a bank account; bank-account collection and tracing of exempt benefits present different legal questions.",
    ],
    intro: [
      "Texas is unusually protective of current wages against ordinary judgment creditors. That does not mean every form of income or every bank balance is untouchable.",
      "The source of the collection order matters. Consumer-credit judgments, child support, federal tax collection, federal student-loan collection, and secured-credit remedies operate under different legal frameworks.",
    ],
    sections: [
      { heading: "Current wages are outside the ordinary personal-property cap", paragraphs: ["Property Code Section 42.001(b)(1) exempts current wages for personal services from seizure and does not include those wages in the $100,000 family or $50,000 single-adult aggregate personal-property limits."] },
      { heading: "Child support is an express Texas exception", paragraphs: ["Section 42.001(b)(1) expressly excepts enforcement of court-ordered child support payments. Family Code withholding procedures govern that type of wage withholding rather than the ordinary consumer-credit judgment process."] },
      { heading: "Federal collection powers can override the ordinary state rule", paragraphs: ["Federal tax and federal student-loan collection laws can authorize wage levies or administrative garnishment despite Texas's strong exemption for ordinary creditor claims. A person should identify who issued the withholding and under what authority before assuming it is invalid."] },
      { heading: "Paid wages and bank accounts are a different issue", paragraphs: ["The Texas exemption is written for current wages. Once money is paid, bank-account garnishment and exemptions for specific benefit sources can involve additional statutes and federal protections, so the payroll rule should not be treated as a blanket bank-account exemption."] },
    ],
    faq: [
      { q: "Can a credit-card company garnish my paycheck in Texas after getting a judgment?", a: "Texas generally exempts current wages from ordinary creditor seizure. The creditor may have other lawful collection tools against nonexempt property." },
      { q: "Can wages be withheld for child support in Texas?", a: "Yes. Section 42.001 expressly excludes court-ordered child support enforcement from the ordinary current-wage exemption." },
      { q: "Does Texas wage protection stop an IRS levy or federal student-loan garnishment?", a: "Not necessarily. Federal law provides separate collection authority that can apply despite the ordinary Texas creditor exemption." },
    ],
    sources: [
      { label: "Texas Property Code § 42.001", url: "https://statutes.capitol.texas.gov/?artSec=42.001&chapter=PR.42&code=PR&tab=1" },
      { label: "Texas Civil Practice and Remedies Code Chapter 63", url: "https://statutes.capitol.texas.gov/Docs/CP/htm/CP.63.htm" },
      { label: "Texas Family Code Chapter 158", url: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.158.htm" },
    ],
    related: [
      { label: "Texas judgment exemptions", href: "/guides/texas-judgment-exempt-property-law" },
      { label: "Texas time-barred debt", href: "/guides/texas-time-barred-debt-law" },
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
    ],
  },
};
