import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH13_UNEMPLOYMENT_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-unemployment-benefits-eligibility-law": {
    slug: "texas-unemployment-benefits-eligibility-law",
    title: "Texas Unemployment Benefits Eligibility: Wages, Job Separation and Ongoing Requirements",
    dek: "How Texas unemployment eligibility works, including base-period wages, qualifying job separation, work-search requirements, ability and availability for work, and suitable-work rules.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Workforce Commission evaluates unemployment eligibility through three broad categories: past wages, the reason for job separation, and ongoing weekly eligibility requirements.",
      "A claimant generally must have sufficient covered wages in the statutory base period and be unemployed or underemployed through circumstances that qualify under the Texas Unemployment Compensation Act.",
      "Ongoing eligibility generally requires the claimant to be able and available for suitable full-time work and to satisfy required work-search and payment-request obligations unless an exception applies.",
      "Eligibility is not decided solely by whether a person was fired, laid off, or quit; TWC investigates the specific separation facts and applies the statutory qualification and disqualification rules.",
    ],
    intro: [
      "Texas unemployment benefits are temporary, partial income replacement funded through the unemployment insurance system. Filing a claim starts the process, but filing alone does not establish eligibility.",
      "TWC separately examines monetary eligibility, the most relevant work separation, and whether the claimant remains able, available, and actively seeking suitable work during each benefit period.",
    ],
    sections: [
      { heading: "Past wages determine monetary eligibility", paragraphs: ["TWC uses covered wages reported during the claimant's base period to determine whether the wage requirements are met and to calculate potential benefit amounts. The ordinary base period is generally the first four of the last five completed calendar quarters before the claim's effective date, subject to statutory alternatives in qualifying circumstances."] },
      { heading: "The job separation must qualify", paragraphs: ["Texas Labor Code Chapter 207 contains qualification and disqualification rules tied to the reason work ended. A layoff for lack of work is different from a discharge for misconduct or a voluntary quit without good cause connected with the work, and TWC investigates the facts rather than relying only on the label used by either party."] },
      { heading: "Ability, availability and work search continue each week", paragraphs: ["TWC requires claimants to remain physically and mentally able to work, available for suitable full-time work, and compliant with assigned work-search requirements unless TWC grants or recognizes an exception. Claimants must also request payment as scheduled and respond to agency instructions."] },
      { heading: "Suitable work changes with circumstances", paragraphs: ["Texas law and TWC guidance consider factors such as experience, training, prevailing conditions, safety, commuting distance, and length of unemployment when evaluating suitable work. Refusing suitable work without good cause can trigger disqualification."] },
    ],
    faq: [
      { q: "Does being laid off automatically guarantee Texas unemployment benefits?", a: "No. A layoff may satisfy the job-separation component, but the claimant must also meet wage and ongoing eligibility requirements." },
      { q: "Do I have to look for full-time work while receiving benefits?", a: "Generally yes. TWC ordinarily requires an active search for suitable full-time work unless a work-search exemption or other specific rule applies." },
      { q: "Can I receive benefits while working part time?", a: "Potentially. Texas allows some partial-unemployment claims, but earnings must be reported and the claimant must continue satisfying the applicable eligibility requirements." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 207", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.207.htm" },
      { label: "Texas Workforce Commission — Eligibility & Benefit Amounts", url: "https://www.twc.texas.gov/programs/unemployment-benefits/eligibility-benefit-amounts" },
      { label: "Texas Workforce Commission — Ongoing Eligibility Requirements", url: "https://www.twc.texas.gov/programs/unemployment-benefits/ongoing-eligibility-requirement" },
    ],
    related: [
      { label: "Texas unemployment separation rules", href: "/guides/texas-unemployment-quit-fired-misconduct-law" },
      { label: "Texas unemployment appeals", href: "/guides/texas-unemployment-appeal-law" },
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
    ],
  },

  "texas-unemployment-quit-fired-misconduct-law": {
    slug: "texas-unemployment-quit-fired-misconduct-law",
    title: "Texas Unemployment After Quitting or Being Fired: Good Cause and Misconduct",
    dek: "How Texas unemployment law treats voluntary quits, discharge for misconduct, layoffs, and the burden of proving why the last work separation occurred.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A claimant who voluntarily leaves work generally must show a qualifying reason under the Texas Unemployment Compensation Act rather than assuming any resignation is covered.",
      "A worker discharged for misconduct connected with the work can be disqualified under Texas Labor Code Section 207.044.",
      "TWC guidance places the practical burden on the party who initiated the separation: a claimant who quit generally must prove qualifying good cause, while an employer alleging misconduct after a discharge generally must prove the misconduct basis.",
      "A layoff or other separation through no fault of the worker is generally analyzed differently from a misconduct discharge or voluntary quit.",
    ],
    intro: [
      "The phrase 'through no fault of your own' is a useful shorthand for Texas unemployment benefits, but the actual legal analysis is more specific. TWC determines who initiated the separation and why it occurred when it did.",
      "Documentation can matter. Warnings, resignation messages, schedules, medical information, policy records, and the final incident may all affect the agency's separation determination.",
    ],
    sections: [
      { heading: "Discharge for misconduct can disqualify a claimant", paragraphs: ["Section 207.044 addresses discharge for misconduct connected with the individual's last work. TWC looks at the conduct leading to the discharge and whether it falls within the statutory misconduct standard rather than treating every firing as disqualifying."] },
      { heading: "Voluntary quits use a different statutory analysis", paragraphs: ["Section 207.045 generally disqualifies an individual who left the last work voluntarily without good cause connected with the work, while the statute contains specific exceptions and specialized rules. Personal reasons and work-connected reasons can therefore produce different results."] },
      { heading: "The initiating party generally carries the practical proof burden", paragraphs: ["TWC's employer guide explains that when a claimant quits, the claimant generally must establish qualifying good cause; when an employer fires the claimant and asserts misconduct, the employer generally must establish misconduct connected with the work."] },
      { heading: "The final separation facts matter", paragraphs: ["TWC focuses on the cause or final incident that precipitated the separation. A resignation submitted only after an employer has already made an unconditional discharge decision, or a discharge that follows a prior notice of resignation, can require closer factual analysis than the label on a personnel form suggests."] },
    ],
    faq: [
      { q: "Can I get Texas unemployment if I was fired?", a: "Possibly. Being fired does not automatically disqualify a claimant; TWC determines whether the discharge was for misconduct connected with the work or another disqualifying reason." },
      { q: "Can I get benefits if I quit?", a: "Sometimes. Section 207.045 and related provisions govern voluntary leaving, including qualifying exceptions. The reason for leaving and supporting evidence matter." },
      { q: "Who has to prove misconduct?", a: "TWC guidance generally places the burden on the employer to prove misconduct when the employer initiated the separation by discharge and relies on misconduct to defeat benefits." },
    ],
    sources: [
      { label: "Texas Labor Code § 207.044", url: "https://statutes.capitol.texas.gov/?artSec=207.044&chapter=LA.207&code=LA&tab=1" },
      { label: "Texas Labor Code § 207.045", url: "https://statutes.capitol.texas.gov/?artSec=207.045&chapter=LA.207&code=LA&tab=1" },
      { label: "Texas Workforce Commission — UI Qualification Issues", url: "https://efte.twc.texas.gov/ui_law_qualification_issues.html" },
    ],
    related: [
      { label: "Texas unemployment eligibility", href: "/guides/texas-unemployment-benefits-eligibility-law" },
      { label: "Texas unemployment appeals", href: "/guides/texas-unemployment-appeal-law" },
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
    ],
  },
};
