import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const CONSUMER_BATCH14_PRIVACY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-credit-freeze-law": {
    slug: "texas-credit-freeze-law",
    title: "Texas Credit Freeze Law: How Security Freezes Protect Your Credit",
    dek: "How Texans can use a security freeze to restrict new-credit access, the difference between a freeze and fraud alert, free placement and lifting, and why all three national credit bureaus matter.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Business & Commerce Code Chapter 20 regulates consumer reporting agencies and includes security-freeze protections, while federal law makes freezes at the nationwide credit bureaus free to place and lift.",
      "A credit freeze limits access to a consumer's credit report for new-account decisions and can make it harder for an identity thief to open new credit in the consumer's name.",
      "To freeze all three nationwide reports, the consumer must contact Equifax, Experian, and TransUnion separately.",
      "A freeze does not erase existing accounts, stop charges on already-open accounts, or change the consumer's credit score; existing financial accounts still need monitoring.",
    ],
    intro: [
      "A security freeze is one of the strongest preventive tools available after identity theft, a data breach, or a lost wallet, and a consumer may also choose one before any fraud occurs.",
      "A freeze is different from a fraud alert. A freeze restricts access to the report for new credit, while a fraud alert generally tells prospective creditors to take added steps to verify identity.",
    ],
    sections: [
      { heading: "Texas law recognizes security freezes", paragraphs: ["Business & Commerce Code Chapter 20 regulates consumer reporting agencies in Texas and includes provisions governing security freezes and access to frozen consumer files. Federal law separately guarantees free freezes and lifts at the nationwide consumer reporting agencies."] },
      { heading: "Freeze each nationwide bureau separately", paragraphs: ["The three nationwide credit bureaus maintain separate files. FTC guidance therefore instructs consumers to contact Equifax, Experian, and TransUnion to place a freeze on each report."] },
      { heading: "Freezes can be temporarily lifted", paragraphs: ["A consumer applying for new credit can temporarily lift the freeze for the bureau a lender will use and restore the freeze afterward. Federal law requires nationwide bureaus to provide free placement and lifting and establishes timing requirements for properly submitted requests."] },
      { heading: "A freeze protects new-credit access, not existing accounts", paragraphs: ["A security freeze does not prevent misuse of an already-open bank or credit-card account. Consumers should continue reviewing account statements, credit reports, and fraud alerts for unauthorized activity."] },
    ],
    faq: [
      { q: "Does it cost money to freeze my credit?", a: "No. Federal law makes credit freezes at the nationwide credit bureaus free to place and lift." },
      { q: "Do I contact one bureau or all three?", a: "For a freeze on all three nationwide credit reports, contact Equifax, Experian, and TransUnion separately." },
      { q: "Will a credit freeze lower my credit score?", a: "No. FTC guidance states that placing a credit freeze does not affect the consumer's credit score." },
    ],
    sources: [
      { label: "Texas Business & Commerce Code Chapter 20", url: "https://statutes.capitol.texas.gov/Docs/BC/htm/BC.20.htm" },
      { label: "Federal Trade Commission — Credit Freezes and Fraud Alerts", url: "https://consumer.ftc.gov/articles/credit-freezes-and-fraud-alerts" },
      { label: "Federal Trade Commission — Understanding Your Credit", url: "https://consumer.ftc.gov/articles/understanding-your-credit" },
    ],
    related: [
      { label: "Texas consumer data privacy law", href: "/guides/texas-consumer-data-privacy-law" },
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
      { label: "Debt validation and disputes", href: "/guides/debt-validation-dispute-law-texas" },
    ],
  },

  "texas-consumer-data-privacy-law": {
    slug: "texas-consumer-data-privacy-law",
    title: "Texas Consumer Data Privacy Law: Access, Delete, Correct and Opt Out",
    dek: "What the Texas Data Privacy and Security Act gives covered Texas consumers: access, correction, deletion, portability, opt-out rights, appeals, response deadlines, and Attorney General enforcement.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "The Texas Data Privacy and Security Act is codified in Business & Commerce Code Chapter 541 and became effective July 1, 2024.",
      "Covered consumers can request confirmation and access, correction, deletion, and a portable copy of personal data, subject to the statute's definitions and exemptions.",
      "Covered consumers can opt out of processing for targeted advertising, sale of personal data, or certain profiling decisions.",
      "Controllers generally must respond to authenticated consumer requests without undue delay and no later than 45 days, subject to the statute's extension rules; the Act is enforced by the Texas Attorney General and does not create a private right of action.",
    ],
    intro: [
      "Texas now has a comprehensive consumer-data privacy statute. It gives residents specific rights over covered personal data while creating duties for businesses that qualify as controllers under Chapter 541.",
      "The law has important entity and data exemptions, including categories involving financial institutions, health information, higher education, nonprofits, and data governed by other federal laws. A privacy request therefore begins with whether the controller and data are actually covered.",
    ],
    sections: [
      { heading: "Chapter 541 creates consumer data rights", paragraphs: ["Covered consumers may confirm whether a controller is processing their personal data, obtain access, correct inaccuracies, request deletion, and obtain qualifying data in a portable format. The exact scope depends on the definitions and exemptions in Chapter 541."] },
      { heading: "Consumers can opt out of specified processing", paragraphs: ["The Act gives covered consumers the right to opt out of processing for targeted advertising, the sale of personal data, and profiling in furtherance of decisions producing legal or similarly significant effects as defined by the statute."] },
      { heading: "Controllers generally have 45 days to respond", paragraphs: ["Texas Attorney General guidance states that a controller must respond to an authenticated request without undue delay and generally no later than 45 days after receipt. A qualifying extension may add another 45 days if the controller provides timely notice and the reason for delay."] },
      { heading: "Enforcement belongs to the Attorney General", paragraphs: ["Chapter 541 gives the Texas Attorney General enforcement authority. The Act does not create a private right of action, so consumers use the controller's request and appeal processes and may file privacy complaints with the Attorney General when appropriate."] },
    ],
    faq: [
      { q: "Can I ask a Texas company to delete my personal data?", a: "If Chapter 541 covers the controller and the data, the Act includes a deletion right, subject to statutory exceptions and limitations." },
      { q: "Can I opt out of targeted advertising or sale of my data?", a: "Yes, covered consumers have statutory opt-out rights for targeted advertising, sale of personal data, and specified profiling." },
      { q: "Can I personally sue under the Texas Data Privacy and Security Act?", a: "The Act does not create a private right of action. Enforcement authority belongs to the Texas Attorney General." },
    ],
    sources: [
      { label: "Texas Business & Commerce Code Chapter 541", url: "https://statutes.capitol.texas.gov/Docs/BC/htm/BC.541.htm" },
      { label: "Texas Attorney General — Texas Data Privacy and Security Act", url: "https://www.texasattorneygeneral.gov/consumer-protection/file-consumer-complaint/consumer-privacy-rights/texas-data-privacy-and-security-act" },
    ],
    related: [
      { label: "Texas credit freeze law", href: "/guides/texas-credit-freeze-law" },
      { label: "Texas DTPA", href: "/guides/texas-deceptive-trade-practices-law" },
      { label: "Texas debt collection law", href: "/guides/texas-debt-collection-law" },
    ],
  },
};
