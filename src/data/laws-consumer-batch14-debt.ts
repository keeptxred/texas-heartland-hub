import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH14_DEBT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-debt-collection-law": {
    slug: "texas-debt-collection-law",
    title: "Texas Debt Collection Law: Harassment, Threats and Misleading Practices",
    dek: "A practical guide to the Texas Debt Collection Act in Finance Code Chapter 392, including harassment, prohibited threats, unfair charges, deceptive representations, and consumer remedies.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Finance Code Chapter 392 regulates debt collection and applies to conduct beyond the federal FDCPA's narrower definition of a third-party debt collector.",
      "Section 392.302 prohibits specified harassment and abuse, while Section 392.301 restricts threats and coercive collection tactics.",
      "Sections 392.303 and 392.304 address unfair charges and fraudulent, deceptive, or misleading representations in debt collection.",
      "Texas remedies can overlap with federal debt-collection protections, but coverage, procedures, limitations periods, and available damages are not identical.",
    ],
    intro: [
      "A legitimate debt does not give a collector unlimited freedom to threaten, harass, mislead, or add unauthorized charges. Texas has its own debt-collection statute in addition to federal law.",
      "The identity of the collector matters. Texas Chapter 392 and the federal Fair Debt Collection Practices Act use different definitions, so a practice may need to be analyzed under both systems.",
    ],
    sections: [
      { heading: "Chapter 392 is Texas's debt-collection framework", paragraphs: ["Texas Finance Code Chapter 392 defines debt collection and debt collectors and sets statewide conduct rules. A consumer should identify who is collecting, what debt is involved, and whether the communication came from the original creditor, a third-party collector, a debt buyer, a law firm, or another person covered by the relevant provision."] },
      { heading: "Harassment and abusive conduct are restricted", paragraphs: ["Section 392.302 prohibits specified oppressive or abusive conduct, including certain repeated telephone communications intended to harass and other conduct listed by the statute. The fact that money is owed does not authorize harassment."] },
      { heading: "Threats and misleading statements have separate rules", paragraphs: ["Sections 392.301 and 392.304 restrict specified threats, coercive tactics, and fraudulent, deceptive, or misleading representations. Collectors should not misrepresent the character or amount of a debt, falsely imply government or legal authority, or threaten action that the statute prohibits."] },
      { heading: "Unauthorized charges can create a separate problem", paragraphs: ["Section 392.303 restricts the use of unfair or unconscionable means and addresses collection of interest, fees, charges, or incidental expenses unless the amount is expressly authorized by the agreement creating the obligation or legally chargeable to the consumer."] },
    ],
    faq: [
      { q: "Can a debt collector threaten to have me arrested just because I owe a consumer debt?", a: "A collector may not use threats or representations prohibited by Chapter 392. Ordinary failure to pay a civil consumer debt should not be falsely presented as automatic criminal liability." },
      { q: "Does Texas debt-collection law apply only to collection agencies?", a: "No. Texas Chapter 392 uses its own definitions and can reach conduct beyond the federal FDCPA's typical third-party collector coverage. The exact actor and activity should be checked against the statute." },
      { q: "Can a collector add fees to what I owe?", a: "Not simply because the collector wants to. Section 392.303 restricts collection of interest, fees, charges, or incidental expenses unless authorized by the underlying agreement or otherwise legally chargeable." },
    ],
    sources: [
      { label: "Texas Finance Code Chapter 392", url: "https://statutes.capitol.texas.gov/Docs/FI/htm/FI.392.htm" },
      { label: "Texas Finance Code § 392.302", url: "https://statutes.capitol.texas.gov/?artSec=392.302&chapter=FI.392&code=FI&tab=1" },
      { label: "Texas Finance Code § 392.304", url: "https://statutes.capitol.texas.gov/?artSec=392.304&chapter=FI.392&code=FI&tab=1" },
      { label: "Texas Attorney General — Debt Collection and Relief", url: "https://www.texasattorneygeneral.gov/consumer-protection/financial-and-insurance-scams/debt-collection-and-relief" },
    ],
    related: [
      { label: "Debt validation and disputes", href: "/guides/debt-validation-dispute-law-texas" },
      { label: "Texas credit freeze law", href: "/guides/texas-credit-freeze-law" },
      { label: "Texas DTPA", href: "/guides/texas-deceptive-trade-practices-law" },
    ],
  },

  "debt-validation-dispute-law-texas": {
    slug: "debt-validation-dispute-law-texas",
    title: "Debt Validation in Texas: The Federal 30-Day Dispute Window",
    dek: "How the federal FDCPA and Regulation F validation notice work for Texans, including required debt information, the 30-day validation period, written disputes, and original-creditor requests.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Federal Regulation F generally requires an FDCPA debt collector to provide specified validation information in the initial communication or within five days afterward, subject to the regulation's exceptions.",
      "The validation period generally ends 30 days after the consumer receives or is assumed to receive the validation information.",
      "A timely written dispute requires the collector to cease collection of the disputed debt or portion until the collector sends verification or a copy of a judgment as required by the rule.",
      "A timely written request for the name and address of the original creditor can likewise require collection to pause until the collector supplies that information when the rule applies.",
    ],
    intro: [
      "Texans receive the same federal debt-validation protections as consumers elsewhere in the United States. These rights are especially useful when the consumer does not recognize the debt, disputes the amount, or is unsure who originally extended the credit.",
      "The federal validation process does not replace Texas Chapter 392. A collection communication can be subject to both the federal rule and Texas prohibitions on abusive, unfair, or misleading practices.",
    ],
    sections: [
      { heading: "Regulation F requires validation information", paragraphs: ["12 C.F.R. Section 1006.34 requires covered debt collectors to provide information designed to help the consumer identify the debt, including creditor information, an itemization, the current amount, and statements explaining the validation period and dispute rights."] },
      { heading: "The validation period is generally 30 days", paragraphs: ["Section 1006.34 defines the validation period as beginning when validation information is provided and ending 30 days after the consumer receives or is assumed to receive it. The notice identifies the date the collector will treat as the end of that period."] },
      { heading: "A timely written dispute pauses collection of the disputed amount", paragraphs: ["Under Section 1006.38, when the consumer timely disputes the debt or a portion in writing, the collector must cease collection of the disputed amount until it sends the verification required by the rule or a copy of a judgment."] },
      { heading: "Original-creditor information can also be requested", paragraphs: ["A consumer may timely request in writing the name and address of the original creditor if different from the current creditor. Regulation F requires collection to pause until the covered collector responds as required."] },
    ],
    faq: [
      { q: "How long do I have to dispute a debt after receiving a validation notice?", a: "The Regulation F validation period generally ends 30 days after you receive or are assumed to receive the validation information; the notice should identify the end date." },
      { q: "Does disputing a debt erase it?", a: "No. A timely written dispute triggers verification and collection-pause rights under the federal rule; it does not automatically cancel a valid debt." },
      { q: "Can I ask who the original creditor was?", a: "Yes. A timely written request for original-creditor information can trigger the response and collection-pause requirements in Regulation F when the rule applies." },
    ],
    sources: [
      { label: "12 C.F.R. § 1006.34", url: "https://www.consumerfinance.gov/rules-policy/regulations/1006/34/" },
      { label: "12 C.F.R. § 1006.38", url: "https://www.consumerfinance.gov/rules-policy/regulations/1006/38/" },
      { label: "Consumer Financial Protection Bureau — Debt Collection", url: "https://www.consumerfinance.gov/compliance/compliance-resources/other-applicable-requirements/debt-collection/" },
      { label: "Texas Finance Code Chapter 392", url: "https://statutes.capitol.texas.gov/Docs/FI/htm/FI.392.htm" },
    ],
    related: [
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
      { label: "Texas credit freeze law", href: "/guides/texas-credit-freeze-law" },
      { label: "Texas DTPA", href: "/guides/texas-deceptive-trade-practices-law" },
    ],
  },
};
