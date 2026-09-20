import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const DRIVING_DWI_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-dwi-law-guide": {
    slug: "texas-dwi-law-guide",
    title: "Texas DWI Law: The 0.08 Standard, Impairment and License Consequences",
    dek: "A plain-English overview of Texas DWI law, including the statutory intoxication definition, the 0.08 alcohol-concentration standard, and the separate DPS license process.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Penal Code Section 49.04 makes it an offense to be intoxicated while operating a motor vehicle in a public place.",
      "The statutory definition of intoxicated includes an alcohol concentration of 0.08 or more, but it also includes not having the normal use of mental or physical faculties because of alcohol, drugs, a controlled substance, another substance, or a combination.",
      "The driver's-license process can be separate from the criminal DWI case. DPS administers the Administrative License Revocation process for specified alcohol-test refusals and failures.",
      "DWI consequences depend heavily on the facts, prior history, injury allegations, age, license status, test issues, and other circumstances, so individual cases require qualified legal advice.",
    ],
    intro: [
      "Texas DWI law is commonly reduced to the number 0.08, but the statute is broader. Penal Code Section 49.04 prohibits operating a motor vehicle in a public place while intoxicated, and Section 49.01 defines intoxicated in more than one way.",
      "A DWI arrest can also create a separate driver's-license process administered by the Texas Department of Public Safety. That administrative process has its own deadlines and should not be confused with the criminal court case.",
    ],
    sections: [
      { heading: "The criminal DWI rule", paragraphs: ["Penal Code Section 49.04 provides the basic offense: a person commits DWI if the person is intoxicated while operating a motor vehicle in a public place. Other provisions in Chapter 49 address enhanced or related offenses and consequences." ] },
      { heading: "Intoxication is not defined only by 0.08", paragraphs: ["Penal Code Section 49.01 defines intoxicated to include an alcohol concentration of 0.08 or more. It also includes not having the normal use of mental or physical faculties because of alcohol, a drug, a controlled substance, another substance, or a combination. That means the legal inquiry is not limited to a single breath or blood number." ] },
      { heading: "The license process can be separate", paragraphs: ["DPS administers the Administrative License Revocation program for specified cases involving alcohol-test refusal or failure. The administrative proceeding is separate from the criminal prosecution and has its own notice and hearing deadlines." ] },
      { heading: "Why individual facts matter", bullets: ["Prior DWI history can change the legal consequences.", "A crash, injury, child passenger, or other allegation can change the applicable offense or penalty structure.", "Commercial drivers and drivers younger than 21 can face additional or different rules.", "Testing, license status, court orders, and administrative deadlines can create separate issues in the same incident." ] },
    ],
    faq: [
      { q: "Is 0.08 the only way to be legally intoxicated for Texas DWI?", a: "No. Section 49.01 also defines intoxicated as not having the normal use of mental or physical faculties because of alcohol, drugs, another substance, or a combination." },
      { q: "Is a DPS license suspension the same as the criminal DWI case?", a: "No. The Administrative License Revocation process is a separate civil administrative process with its own procedures and deadlines." },
      { q: "Does every DWI case have the same consequences?", a: "No. Consequences can vary based on the charge, prior history, injuries, passenger circumstances, license type, test issues, and other facts." },
    ],
    sources: [
      { label: "Texas Penal Code § 49.01 — Definitions", url: "https://statutes.capitol.texas.gov/?artSec=49.01&chapter=PE.49&code=PE&tab=1" },
      { label: "Texas Penal Code § 49.04 — Driving While Intoxicated", url: "https://statutes.capitol.texas.gov/?artSec=49.04&chapter=PE.49&code=PE&tab=1" },
      { label: "Texas DPS — Administrative License Revocation", url: "https://www.dps.texas.gov/section/driver-license/administrative-license-revocation-alr-program" },
      { label: "Texas DPS — Alcohol-related offenses", url: "https://www.dps.texas.gov/section/driver-license/alcohol-related-offenses" },
    ],
    related: [
      { label: "Texas Laws Explained", href: "/laws" },
      { label: "Texas auto insurance requirements", href: "/guides/texas-auto-insurance-requirements" },
      { label: "Texas speeding laws", href: "/guides/texas-speeding-laws-guide" },
    ],
  },
};
