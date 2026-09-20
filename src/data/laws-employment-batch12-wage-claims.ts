import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH12_WAGE_CLAIM_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-wage-deduction-law": {
    slug: "texas-wage-deduction-law",
    title: "Texas Wage Deduction Law: What Employers Can Take From a Paycheck",
    dek: "How Texas Labor Code Section 61.018 treats payroll deductions, including court orders, deductions authorized by law, written employee authorization, and federal minimum-wage limits.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Labor Code Section 61.018 generally permits a wage deduction only when it is ordered by a court, authorized by state or federal law, or authorized in writing by the employee for a lawful purpose.",
      "A written authorization should be sufficiently specific about the purpose and nature of the deduction; a broad catch-all authorization can create Payday Law problems.",
      "An employee's written authorization does not make an otherwise unlawful deduction valid, including a deduction that violates applicable federal minimum-wage or overtime rules.",
      "Ordinary employer business costs and property-loss disputes require careful analysis rather than an automatic deduction from wages.",
    ],
    intro: [
      "Texas employers cannot treat a paycheck as a general collection account. The Payday Law creates categories of permitted deductions and requires written authorization for many deductions that are not imposed by law or court order.",
      "Federal wage-and-hour law can impose an additional limit. A deduction that satisfies the Texas authorization rule can still be unlawful if it improperly cuts into required minimum wage or overtime compensation.",
    ],
    sections: [
      { heading: "Section 61.018 creates three main deduction routes", paragraphs: ["The Texas Payday Law generally permits deductions ordered by a court of competent jurisdiction, deductions authorized by state or federal law, and deductions authorized in writing by the employee for a lawful purpose. Most voluntary employer-specific deductions depend on the third route."] },
      { heading: "Written authorization should be specific", paragraphs: ["Texas Workforce Commission guidance emphasizes that written deduction authorizations should be as specific as possible about the amount or method and purpose so the employee can reasonably understand what may be taken from wages."] },
      { heading: "Federal wage floors still matter", paragraphs: ["A Texas-compliant authorization does not override the Fair Labor Standards Act. Depending on the type of deduction, reducing pay below the required minimum wage or cutting into overtime compensation can violate federal law even when the employee signed an authorization."] },
      { heading: "Losses, loans, uniforms, and property require category-specific analysis", paragraphs: ["TWC guidance discusses separate rules for loans, wage advances, uniforms, cash shortages, property loss, and other employer costs. The safest legal question is not simply whether the employer believes money is owed, but whether the particular deduction has statutory, court-ordered, or valid written authority and complies with wage-hour limits."] },
    ],
    faq: [
      { q: "Can a Texas employer deduct money from my paycheck without permission?", a: "Some deductions do not require employee permission because they are ordered by a court or required or specifically authorized by law. Other deductions generally require specific written employee authorization for a lawful purpose." },
      { q: "Does signing a deduction form make every deduction legal?", a: "No. Written authorization does not validate a deduction that violates another state or federal law, including applicable minimum-wage or overtime protections." },
      { q: "Can an employer deduct for unreturned equipment?", a: "Not automatically. The deduction needs a lawful basis under Section 61.018 and must comply with applicable federal wage rules. The employer may have other civil remedies for property disputes." },
    ],
    sources: [
      { label: "Texas Labor Code § 61.018", url: "https://statutes.capitol.texas.gov/?artSec=61.018&chapter=LA.61&code=LA&tab=1" },
      { label: "Texas Workforce Commission — Deduction Problems Under the Texas Payday Law", url: "https://efte.twc.texas.gov/deduction_problems_under_tpl.html" },
      { label: "Texas Workforce Commission — Payday Law Deduction Summary", url: "https://efte.twc.texas.gov/texas_payday_law_deduction_summary.html" },
    ],
    related: [
      { label: "Texas final paycheck law", href: "/guides/texas-final-paycheck-law" },
      { label: "Texas wage claims", href: "/guides/texas-wage-claim-law" },
      { label: "Texas minimum wage law", href: "/guides/texas-minimum-wage-law" },
    ],
  },

  "texas-wage-claim-law": {
    slug: "texas-wage-claim-law",
    title: "Texas Wage Claim Law: The 180-Day Payday Law Deadline",
    dek: "How to understand a Texas Payday Law wage claim, the 180-day filing deadline, what wages can be claimed, TWC's determination process, and alternatives when a claim falls outside the state process.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "A Texas Payday Law wage claim generally must be filed with the Texas Workforce Commission within 180 days after the wages originally became due.",
      "The Payday Law can cover compensation for services, commissions and bonuses due under an agreement, and certain fringe benefits due under a written policy or agreement.",
      "TWC's wage-claim system is claim-driven: the claimant must identify the employer, wage agreement, unpaid amounts, dates, and supporting facts.",
      "Federal wage claims, contract claims, bankruptcy claims, and other remedies can have different rules and deadlines; missing the TWC deadline does not answer every possible legal remedy.",
    ],
    intro: [
      "Texas provides an administrative process for many unpaid-wage disputes through the Texas Workforce Commission. The most important threshold issue is timing because the Payday Law uses a comparatively short state filing period.",
      "A wage claim is not the same as a general payroll audit. The claimant identifies the wages allegedly due, and TWC investigates and issues a determination through the statutory process.",
    ],
    sections: [
      { heading: "The state wage-claim deadline is generally 180 days", paragraphs: ["TWC states that a Payday Law wage claim must be received no later than 180 days after the date the wages were originally due. If some unpaid wages fall outside that window and others remain timely, the state claim can be limited to the wages still within the filing period."] },
      { heading: "The claim should identify each category of unpaid wages", paragraphs: ["The claimant should identify the employer, the pay agreement, pay rate, dates worked, each type of unpaid wage, and how the amount was calculated. Supporting records such as pay stubs, policies, commission agreements, time records, and communications can matter to the investigation."] },
      { heading: "TWC investigates and issues a preliminary determination", paragraphs: ["TWC sends notice to the employer, allows a response, gathers additional information when needed, and issues a Preliminary Wage Determination Order. The Payday Law includes an administrative appeal path before the determination becomes final."] },
      { heading: "Other legal routes can have different deadlines and coverage", paragraphs: ["TWC notes that the U.S. Department of Labor may handle minimum-wage and overtime matters under the Fair Labor Standards Act and that civil, contract, bankruptcy, or arbitration remedies may be relevant in other disputes. Those alternatives are governed by their own jurisdictional rules and deadlines."] },
    ],
    faq: [
      { q: "How long do I have to file a Texas wage claim?", a: "TWC states that a Texas Payday Law wage claim generally must be received within 180 days after the wages were originally due." },
      { q: "Can a commission or bonus be part of a wage claim?", a: "Potentially. The Payday Law can cover commissions and bonuses when they are due under the governing compensation agreement." },
      { q: "If the 180 days passed, is every unpaid-wage remedy gone?", a: "Not necessarily. The TWC Payday Law process has its own deadline. Federal wage-hour law, contract remedies, bankruptcy procedures, or other claims may have different rules and should be evaluated separately." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 61", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.61.htm" },
      { label: "Texas Workforce Commission — Texas Payday Law Wage Claim", url: "https://www.twc.texas.gov/programs/wage-and-hour/texas-payday-law" },
      { label: "Texas Workforce Commission — Wage Claim and Appeal Process", url: "https://efte.twc.texas.gov/wage_claims_in_texas.html" },
    ],
    related: [
      { label: "Texas final paycheck law", href: "/guides/texas-final-paycheck-law" },
      { label: "Texas wage deductions", href: "/guides/texas-wage-deduction-law" },
      { label: "Texas overtime law", href: "/guides/texas-overtime-law" },
    ],
  },
};
