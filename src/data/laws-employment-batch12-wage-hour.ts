import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH12_WAGE_HOUR_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-minimum-wage-law": {
    slug: "texas-minimum-wage-law",
    title: "Texas Minimum Wage Law: State and Federal Wage Floors Explained",
    dek: "How Texas Labor Code Chapter 62 and the federal Fair Labor Standards Act work together, including the current wage floor, coverage, exemptions, tips, and why promised wages above minimum wage are a separate issue.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Labor Code Chapter 62 ties the Texas minimum-wage framework to the federal minimum wage, and the U.S. Department of Labor currently lists Texas at the federal $7.25-per-hour floor.",
      "The minimum wage is a legal floor for covered work, not a rule that every worker or every hour arrangement is governed identically; statutory coverage and exemptions matter.",
      "Tips, lodging, certain facilities, youth rules, disability certificates, and other specialized situations are governed by additional state and federal provisions.",
      "A dispute over a promised wage higher than minimum wage may fall under the Texas Payday Law or contract principles even when the minimum-wage floor itself was satisfied.",
    ],
    intro: [
      "Texas minimum-wage questions often involve two layers of law. Chapter 62 supplies the state framework, while the federal Fair Labor Standards Act governs many employees and sets the nationwide wage floor for covered, nonexempt work.",
      "Minimum wage should not be confused with an agreed pay rate. An employer can potentially violate a wage agreement even when the amount actually paid remains above the statutory minimum.",
    ],
    sections: [
      { heading: "Texas currently uses the federal minimum-wage floor", paragraphs: ["The U.S. Department of Labor's current state table lists Texas as equal to the federal minimum wage of $7.25 per hour. Texas Labor Code Chapter 62 contains the state minimum-wage framework and should be read together with federal coverage and exemption rules."] },
      { heading: "Coverage and exemptions matter", paragraphs: ["Not every worker is governed in exactly the same way. The FLSA and Texas Labor Code contain coverage definitions and exemptions for particular employment relationships or occupations, so job title alone should not be used to decide whether an exemption applies."] },
      { heading: "Special pay arrangements have additional rules", paragraphs: ["Tip credits, certain meals or lodging, training arrangements, youth employment, and other special situations are governed by detailed state or federal rules. A stated hourly cash rate below the ordinary floor is not automatically unlawful if a valid statutory credit applies, but the employer must satisfy the conditions for that credit."] },
      { heading: "Promised wages above the floor are a separate Payday Law issue", paragraphs: ["The FLSA establishes a floor, while the Texas Payday Law can enforce wages that are due under the parties' compensation agreement. An employee promised $20 per hour, for example, does not lose the wage-agreement issue merely because the employer paid more than the federal minimum."] },
    ],
    faq: [
      { q: "What is the Texas minimum wage?", a: "The U.S. Department of Labor currently lists Texas at the federal minimum wage of $7.25 per hour for covered work, subject to applicable exemptions and special rules." },
      { q: "Can Texas cities set a different minimum wage for private employers?", a: "State preemption and local-authority questions can be fact-specific. This guide addresses the statewide and federal wage floors; a local public-contract or governmental-pay rule should be checked separately." },
      { q: "If I was promised more than minimum wage, can the employer just pay minimum wage instead?", a: "Not necessarily. The agreed compensation rate can create a Texas Payday Law or contract issue even when the statutory minimum-wage floor is met." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 62", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.62.htm" },
      { label: "Texas Labor Code § 62.051", url: "https://statutes.capitol.texas.gov/?artSec=62.051&chapter=LA.62&code=LA&tab=1" },
      { label: "Fair Labor Standards Act § 6, 29 U.S.C. § 206", url: "https://www.govinfo.gov/link/uscode/29/206" },
      { label: "U.S. Department of Labor — Minimum Wage", url: "https://www.dol.gov/agencies/whd/minimum-wage" },
    ],
    related: [
      { label: "Texas overtime law", href: "/guides/texas-overtime-law" },
      { label: "Texas wage claims", href: "/guides/texas-wage-claim-law" },
      { label: "Texas wage deductions", href: "/guides/texas-wage-deduction-law" },
    ],
  },

  "texas-overtime-law": {
    slug: "texas-overtime-law",
    title: "Texas Overtime Law: The 40-Hour FLSA Rule and Exemptions",
    dek: "How overtime works for Texas employees under the federal Fair Labor Standards Act, including the 40-hour workweek, regular rate, salaried employees, exemptions, and unauthorized overtime.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "For covered, nonexempt employees in Texas, the Fair Labor Standards Act generally requires overtime of at least one and one-half times the regular rate for hours worked over 40 in a workweek.",
      "Being paid a salary does not by itself make an employee exempt from overtime; an exemption must satisfy the applicable legal requirements.",
      "The ordinary FLSA rule is weekly, not daily: federal law generally does not require overtime merely because an employee worked more than eight hours in one day.",
      "An employer may prohibit unauthorized overtime as a workplace rule, but generally must still pay for compensable overtime work it required or permitted and can address the rule violation separately.",
    ],
    intro: [
      "Texas does not have a separate general overtime formula that replaces the federal Fair Labor Standards Act for ordinary private employment. Most Texas overtime disputes therefore begin with federal coverage, exemption, hours-worked, and regular-rate rules.",
      "The word 'salary' causes frequent confusion. Salary is a method of pay; overtime exemption is a legal status that depends on the specific exemption's requirements.",
    ],
    sections: [
      { heading: "The ordinary rule is time-and-a-half after 40 hours", paragraphs: ["For covered, nonexempt workers, the FLSA generally requires overtime compensation at not less than one and one-half times the employee's regular rate for hours worked over 40 in a workweek. A workweek is a fixed, recurring seven-day period and need not match the calendar week."] },
      { heading: "Salary alone does not decide exemption", paragraphs: ["Some executive, administrative, professional, outside-sales, computer, and other employees can be exempt if the applicable legal test is met. Merely labeling a worker 'salaried' or 'manager' does not by itself establish an overtime exemption."] },
      { heading: "Weekend, holiday, and long-day work are not automatically overtime", paragraphs: ["The FLSA generally measures overtime by hours over 40 in the workweek. It does not independently require premium pay merely because work occurred on Saturday, Sunday, a holiday, or after eight hours in one day, although an agreement or another law can provide additional rights."] },
      { heading: "Unauthorized overtime can still be compensable", paragraphs: ["U.S. Department of Labor guidance explains that an employer that requires or permits overtime generally must pay for the compensable work. The employer may enforce a rule against unauthorized overtime through discipline rather than treating worked time as unpaid."] },
    ],
    faq: [
      { q: "Do Texas employees get overtime after eight hours in a day?", a: "Not under the ordinary FLSA rule. Covered, nonexempt employees generally earn overtime after 40 hours in a workweek, although another contract or law can provide a different premium." },
      { q: "Are salaried employees exempt from overtime in Texas?", a: "Not automatically. The employee must satisfy the requirements of an applicable FLSA exemption; salary alone is not enough." },
      { q: "Can an employer refuse to pay overtime because it was not preapproved?", a: "An employer may prohibit unauthorized overtime, but if it knew or should have known compensable overtime was worked, federal law generally requires payment. The employer can separately enforce its scheduling rule." },
    ],
    sources: [
      { label: "Fair Labor Standards Act § 7, 29 U.S.C. § 207", url: "https://www.govinfo.gov/link/uscode/29/207" },
      { label: "U.S. Department of Labor — Overtime", url: "https://www.dol.gov/general/topic/workhours/overtime" },
      { label: "U.S. Department of Labor — FLSA Fact Sheet #23", url: "https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay" },
      { label: "Texas Workforce Commission — Texas Payday Law", url: "https://www.twc.texas.gov/programs/wage-and-hour/texas-payday-law" },
    ],
    related: [
      { label: "Texas minimum wage law", href: "/guides/texas-minimum-wage-law" },
      { label: "Texas meal and rest break law", href: "/guides/texas-meal-rest-break-law" },
      { label: "Texas wage claims", href: "/guides/texas-wage-claim-law" },
    ],
  },
};
