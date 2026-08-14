import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH12_BREAKS_ATWILL_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-meal-rest-break-law": {
    slug: "texas-meal-rest-break-law",
    title: "Texas Meal and Rest Break Law: Lunch, Short Breaks and Paid Time",
    dek: "The general Texas rule on meal and rest breaks, how federal law treats short rest periods and bona fide meal periods, and why special protections can apply in particular situations.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas does not impose a general statewide rule requiring ordinary adult employees to receive lunch or coffee breaks solely because a shift lasts a certain number of hours.",
      "The federal Fair Labor Standards Act also does not generally require employers to offer meal or rest periods, but it regulates whether breaks that are provided count as paid work time.",
      "Short rest periods, usually about 5 to 20 minutes, generally count as compensable work time under federal law when the employer provides them.",
      "Bona fide meal periods are generally not compensable when the employee is completely relieved from duty; special federal or state protections can apply to particular workers or circumstances.",
    ],
    intro: [
      "Texas employees often hear that every four, six, or eight hours of work automatically creates a lunch-break right. There is no general Texas rule of that kind for ordinary adult employment.",
      "That does not mean employers can ignore break-related wage rules. Once an employer provides breaks, federal law can determine whether the time must be paid, and separate laws can create rights for specific situations.",
    ],
    sections: [
      { heading: "Texas has no general adult meal-break mandate", paragraphs: ["For ordinary adult employees, Texas does not generally require an employer to provide a meal or rest period simply because the employee worked a particular shift length. Employer policy, a contract, a collective bargaining agreement, or a specialized law can create different rights."] },
      { heading: "Short breaks generally count as paid work time", paragraphs: ["U.S. Department of Labor guidance states that short rest periods, commonly about 5 to 20 minutes, generally must be counted as hours worked when the employer offers them. Those minutes therefore count toward minimum-wage and overtime calculations."] },
      { heading: "A bona fide meal period can be unpaid", paragraphs: ["A genuine meal period is generally noncompensable if the employee is completely relieved from duty. A worker who must continue performing substantial job duties during the supposed meal period may still be working for FLSA purposes."] },
      { heading: "Special-purpose protections should be checked separately", paragraphs: ["Federal law contains additional protections involving nursing employees and other specialized circumstances, and industry-specific or public-sector rules can differ. A general 'Texas does not require lunch breaks' summary should not be used to erase a more specific right that applies to the worker."] },
    ],
    faq: [
      { q: "Does Texas law require a 30-minute lunch after six hours?", a: "There is no general statewide adult-employment rule requiring that specific break solely because six hours were worked." },
      { q: "Does a 15-minute break have to be paid?", a: "When an employer provides a short rest break, federal law generally treats a break of about 5 to 20 minutes as compensable work time." },
      { q: "Can a lunch break be unpaid?", a: "Yes, a bona fide meal period can generally be unpaid when the employee is completely relieved from duty. If work continues, the time may be compensable." },
    ],
    sources: [
      { label: "U.S. Department of Labor — Breaks and Meal Periods", url: "https://www.dol.gov/general/topic/workhours/breaks" },
      { label: "U.S. Department of Labor — FLSA Fact Sheet #22", url: "https://www.dol.gov/agencies/whd/fact-sheets/22-flsa-hours-worked" },
      { label: "Texas Workforce Commission — Texas Guidebook for Employers", url: "https://efte.twc.texas.gov/efte.html" },
    ],
    related: [
      { label: "Texas overtime law", href: "/guides/texas-overtime-law" },
      { label: "Texas minimum wage law", href: "/guides/texas-minimum-wage-law" },
      { label: "Texas payday schedule law", href: "/guides/texas-payday-schedule-law" },
    ],
  },

  "texas-employment-at-will-law": {
    slug: "texas-employment-at-will-law",
    title: "Texas Employment-at-Will Law: What At-Will Does and Does Not Mean",
    dek: "Texas's employment-at-will default, how contracts and statutes can limit it, and why discrimination, retaliation, and other unlawful reasons are not protected simply because employment is at will.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas generally follows employment at will: absent an applicable statute or enforceable agreement, either side can usually end an indefinite employment relationship without advance notice and without needing a particular reason.",
      "At-will does not authorize an employer to fire or discipline an employee for a reason prohibited by law, including unlawful discrimination or protected retaliation.",
      "An express employment contract, collective bargaining agreement, or other enforceable promise can alter the ordinary at-will relationship.",
      "Texas recognizes a narrow court-made public-policy exception involving an employee discharged solely for refusing to perform an illegal act, in addition to statutory exceptions.",
    ],
    intro: [
      "Employment at will is a default rule, not a blanket immunity from every employment law. It explains what happens when no contract or specific legal protection requires a different result.",
      "The key question in a termination dispute is often not whether Texas is an at-will state—it is—but whether a contract, discrimination law, retaliation statute, leave right, workers' compensation protection, or another exception applies to the actual reason for the action.",
    ],
    sections: [
      { heading: "At-will is the Texas default for indefinite employment", paragraphs: ["Texas Workforce Commission guidance describes the basic rule as allowing either party, absent a statute or express agreement to the contrary, to modify terms or end an indefinite employment relationship for any lawful reason or no particular reason, with or without advance notice."] },
      { heading: "A contract can change the default", paragraphs: ["A definite-term employment contract, collective bargaining agreement, or other enforceable promise can limit when or how employment may be ended. Not every handbook statement creates a contract, so the actual language and circumstances matter."] },
      { heading: "Illegal reasons remain illegal", paragraphs: ["Texas Labor Code Chapter 21 prohibits covered employment discrimination on specified protected grounds, and other state and federal laws protect particular activities or statuses. At-will doctrine does not convert a prohibited reason into a lawful one."] },
      { heading: "Texas also recognizes a narrow refusal-to-commit-crime exception", paragraphs: ["TWC guidance identifies a court-made public-policy exception for an employee discharged solely because the employee refused to commit a criminal act for the employer. Because this exception is narrow, it should not be generalized into a broad good-cause requirement for every termination."] },
    ],
    faq: [
      { q: "Can a Texas employer fire someone for no reason?", a: "In an ordinary at-will relationship, an employer generally does not need a particular reason, but the termination still cannot violate a statute, enforceable agreement, or recognized legal exception." },
      { q: "Does at-will mean an employer can discriminate?", a: "No. Employment discrimination and retaliation laws remain enforceable regardless of the general at-will default." },
      { q: "Does a two-week notice requirement bind the employer too?", a: "Not automatically. A policy or custom about notice is not necessarily an employment contract. The actual agreement and policy language determine whether an enforceable obligation exists." },
    ],
    sources: [
      { label: "Texas Workforce Commission — Pay and Policies: Employment At Will", url: "https://efte.twc.texas.gov/pay_and_policies_general.html" },
      { label: "Texas Workforce Commission — Wrongful Discharge", url: "https://efte.twc.texas.gov/wrongful_discharge.html" },
      { label: "Texas Labor Code Chapter 21", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.21.htm" },
    ],
    related: [
      { label: "Texas workplace discrimination law", href: "/guides/texas-workplace-discrimination-law" },
      { label: "Texas workers' compensation coverage", href: "/guides/texas-workers-compensation-coverage-law" },
      { label: "Texas final paycheck law", href: "/guides/texas-final-paycheck-law" },
    ],
  },
};
