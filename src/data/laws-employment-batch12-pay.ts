import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH12_PAY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-final-paycheck-law": {
    slug: "texas-final-paycheck-law",
    title: "Texas Final Paycheck Law: When Final Wages Are Due",
    dek: "How Texas Labor Code Section 61.014 treats final pay after a firing, layoff, resignation, retirement, or other work separation, and why company property does not automatically justify holding wages.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Under Texas Labor Code Section 61.014, an employee who is discharged must generally be paid in full not later than the sixth day after discharge.",
      "An employee who leaves voluntarily generally must receive final wages no later than the next regularly scheduled payday.",
      "Commissions, bonuses, vacation payouts, and other compensation depend on the wage agreement or written policy when the law does not independently require the benefit.",
      "An employer generally cannot simply hold an otherwise due final paycheck because company property was not returned; any deduction must independently satisfy Texas and federal law.",
    ],
    intro: [
      "Texas has different final-pay deadlines depending on who initiated the separation. That distinction matters more than labels such as 'mutual separation' if the underlying facts show whether the employee or employer actually ended the relationship.",
      "The final-pay deadline does not answer every question about bonuses, commissions, severance, or unused leave. Those items may turn on the governing compensation agreement or written policy.",
    ],
    sections: [
      { heading: "Discharged employees generally have a six-day deadline", paragraphs: ["Labor Code Section 61.014 requires an employer to pay an employee who is discharged from employment in full not later than the sixth day after the date of discharge. Texas Workforce Commission guidance treats layoffs, firings, and other employer-initiated separations under this rule based on the actual circumstances."] },
      { heading: "Voluntary departures use the next regular payday", paragraphs: ["When an employee leaves employment voluntarily, Section 61.014 generally makes the final wages due no later than the next regularly scheduled payday. Resignation and retirement are common examples of voluntary separation."] },
      { heading: "Policies can control some non-wage components", paragraphs: ["The Texas Payday Law can enforce commissions, bonuses, and qualifying fringe benefits when they are due under the wage agreement or written policy. Texas law does not independently require every employer to offer vacation, severance, or similar benefits."] },
      { heading: "Company-property disputes do not erase the payday deadline", paragraphs: ["TWC guidance states that an employer may not simply hold a final paycheck beyond the legal deadline because an employee has not returned company property. A lawful deduction requires a court order, statutory authority, or sufficiently specific written employee authorization and must also comply with applicable federal wage rules."] },
    ],
    faq: [
      { q: "How long does a Texas employer have to pay me after firing me?", a: "Section 61.014 generally requires full payment not later than the sixth day after discharge." },
      { q: "When is my final check due if I quit?", a: "For a voluntary departure, final wages are generally due no later than the next regularly scheduled payday." },
      { q: "Can an employer hold my last check until I return equipment?", a: "Not merely because the equipment is outstanding. The paycheck remains subject to the statutory deadline, and any deduction must have an independent lawful basis." },
    ],
    sources: [
      { label: "Texas Labor Code § 61.014", url: "https://statutes.capitol.texas.gov/?artSec=61.014&chapter=LA.61&code=LA&tab=1" },
      { label: "Texas Workforce Commission — Final Pay", url: "https://efte.twc.texas.gov/final_pay.html" },
      { label: "Texas Workforce Commission — Texas Payday Law", url: "https://www.twc.texas.gov/programs/wage-and-hour/texas-payday-law" },
    ],
    related: [
      { label: "Texas payday schedule law", href: "/guides/texas-payday-schedule-law" },
      { label: "Texas wage deductions", href: "/guides/texas-wage-deduction-law" },
      { label: "Texas wage claims", href: "/guides/texas-wage-claim-law" },
    ],
  },

  "texas-payday-schedule-law": {
    slug: "texas-payday-schedule-law",
    title: "Texas Payday Law: How Often Employees Must Be Paid",
    dek: "Texas payday-frequency rules for exempt and nonexempt employees, designated paydays, missed-payday requests, commissions, bonuses, and payment methods under Labor Code Chapter 61.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Labor Code Section 61.011 generally requires employees who are exempt from the federal overtime provisions to be paid at least once each month and other employees at least twice each month.",
      "If an employer does not designate paydays, Texas law supplies the first and fifteenth days of each month as the paydays.",
      "For twice-monthly pay, the pay periods must consist as nearly as possible of an equal number of days.",
      "Commission and bonus timing can depend on the parties' agreement, but earned wages remain subject to the Texas Payday Law's due-and-payable framework.",
    ],
    intro: [
      "Texas does not leave wage-payment frequency entirely to employer preference. Chapter 61 establishes minimum payday frequency and a default schedule when the employer has not designated paydays.",
      "How compensation is calculated is a different question from how often it must be paid. Hourly, salary, commission, piece-rate, and other arrangements can still be subject to the same payday framework.",
    ],
    sections: [
      { heading: "Pay frequency depends in part on overtime-exempt status", paragraphs: ["Section 61.011 generally requires employees exempt from the overtime provisions of the Fair Labor Standards Act to be paid at least once a month. Other employees generally must be paid at least twice a month."] },
      { heading: "Texas supplies default paydays when none are designated", paragraphs: ["An employer may designate regular paydays within the statutory frequency rules. If no paydays are designated, Section 61.011 makes the first and fifteenth days of each month the paydays."] },
      { heading: "Missed payday wages remain due", paragraphs: ["TWC guidance explains that when an employee is not paid on payday for a reason such as absence, the employer must pay the wages on another business day as requested by the employee. The Payday Law is designed around full and timely payment of wages that are due and payable."] },
      { heading: "Commissions and bonuses turn on the compensation agreement", paragraphs: ["The Payday Law recognizes wages calculated in different ways. For commissions and bonuses, the agreement defining when the compensation is earned and due is especially important, and changes to compensation should operate prospectively rather than retroactively."] },
    ],
    faq: [
      { q: "Can a Texas employer pay employees only once a month?", a: "For employees exempt from the federal overtime provisions, generally yes. Other employees generally must be paid at least twice a month under Section 61.011." },
      { q: "What if my employer never announced regular paydays?", a: "Section 61.011 provides the first and fifteenth of each month as default paydays when the employer has not designated paydays." },
      { q: "Can commissions be paid on a different schedule?", a: "Commission timing depends heavily on the compensation agreement, but earned commissions remain subject to the Payday Law once they are due and payable." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 61", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.61.htm" },
      { label: "Texas Labor Code § 61.011", url: "https://statutes.capitol.texas.gov/?artSec=61.011&chapter=LA.61&code=LA&tab=1" },
      { label: "Texas Workforce Commission — Texas Payday Law", url: "https://www.twc.texas.gov/programs/wage-and-hour/texas-payday-law" },
    ],
    related: [
      { label: "Texas final paycheck law", href: "/guides/texas-final-paycheck-law" },
      { label: "Texas wage claims", href: "/guides/texas-wage-claim-law" },
      { label: "Texas overtime law", href: "/guides/texas-overtime-law" },
    ],
  },
};
