import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH13_COMPLAINT_PTO_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-employment-discrimination-filing-deadline-law": {
    slug: "texas-employment-discrimination-filing-deadline-law",
    title: "Texas Employment Discrimination Filing Deadline: 180 Days and the Sexual-Harassment Rule",
    dek: "How Texas Labor Code Section 21.202 sets the state administrative filing deadline for employment-discrimination complaints and the separate timing rule for sexual-harassment allegations.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Labor Code Section 21.202 generally requires a Chapter 21 employment-discrimination complaint to be filed not later than the 180th day after the alleged unlawful employment practice occurred.",
      "For a complaint alleging sexual harassment, Section 21.202 provides a separate 300-day filing period.",
      "The Texas Workforce Commission Civil Rights Division is the state agency that receives and investigates covered Chapter 21 employment-discrimination complaints.",
      "State and federal administrative deadlines, coverage rules, and claim theories can differ; a worker should not assume that one filing period automatically governs every potential state or federal claim.",
    ],
    intro: [
      "Employment-discrimination deadlines can expire long before an ordinary civil limitations period. Texas Chapter 21 requires an administrative complaint before the state-law process moves toward litigation.",
      "The most important timing distinction is that the ordinary Chapter 21 complaint period is 180 days, while Texas law gives sexual-harassment complaints a 300-day period under Section 21.202.",
    ],
    sections: [
      { heading: "The ordinary Texas Chapter 21 deadline is 180 days", paragraphs: ["Section 21.202 generally requires a complaint to be filed not later than the 180th day after the date the alleged unlawful employment practice occurred. Because the deadline is tied to the challenged practice, delay can affect which events remain timely."] },
      { heading: "Sexual-harassment complaints have a 300-day period", paragraphs: ["Section 21.202(a-1) provides a separate rule for complaints alleging sexual harassment, extending the state administrative filing period to the 300th day after the alleged harassment occurred."] },
      { heading: "TWC Civil Rights Division handles the state complaint process", paragraphs: ["TWC's Civil Rights Division investigates covered employment-discrimination charges. The agency's Employment Discrimination Inquiry Submission System is the current state intake route described by TWC."] },
      { heading: "Federal deadlines and theories should be checked separately", paragraphs: ["Federal EEOC law can overlap with Texas Chapter 21 but has its own jurisdiction, deadlines, charge rules, and protected claims. A person evaluating a deadline should identify each potential legal claim and forum rather than assuming the longest possible period applies to everything."] },
    ],
    faq: [
      { q: "How long do I have to file a Texas employment-discrimination complaint?", a: "Section 21.202 generally uses a 180-day deadline for Chapter 21 complaints." },
      { q: "Is the deadline different for sexual harassment in Texas?", a: "Yes. Texas law provides a 300-day state administrative filing period for complaints alleging sexual harassment." },
      { q: "Do Texas and EEOC deadlines always match?", a: "No. State and federal administrative systems can overlap but have distinct rules. Each potential claim and forum should be checked separately." },
    ],
    sources: [
      { label: "Texas Labor Code § 21.202", url: "https://statutes.capitol.texas.gov/?artSec=21.202&chapter=LA.21&code=LA&tab=1" },
      { label: "Texas Labor Code Chapter 21", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.21.htm" },
      { label: "Texas Workforce Commission — Employment Discrimination", url: "https://www.twc.texas.gov/programs/civil-rights/employment-discrimination" },
    ],
    related: [
      { label: "Texas workplace discrimination law", href: "/guides/texas-workplace-discrimination-law" },
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
      { label: "Texas workers' comp retaliation", href: "/guides/texas-workers-comp-retaliation-law" },
    ],
  },

  "texas-vacation-pto-payout-law": {
    slug: "texas-vacation-pto-payout-law",
    title: "Texas Vacation and PTO Payout Law: When Unused Leave Must Be Paid",
    dek: "Why Texas does not generally require private employers to provide vacation or PTO, when a written policy can make accrued leave payable, and how final-pay timing interacts with the policy.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas law generally does not require a private employer to provide paid vacation, sick leave, or PTO as a fringe benefit.",
      "If an employer promises a covered fringe benefit in a written policy or written agreement, the Texas Payday Law can enforce the benefit according to the policy's terms.",
      "Unused vacation or PTO is not automatically payable at separation; payout generally depends on what the written policy or agreement promises and the conditions it imposes.",
      "When a fringe-benefit payout is owed, the policy can affect the payment date, and ordinary final-pay deadlines apply unless the governing agreement or policy provides a different payout schedule for that component.",
    ],
    intro: [
      "Texas does not use a universal 'use it or lose it is illegal' rule for private-employer vacation plans. Instead, the written policy is central because the Texas Payday Law enforces promised fringe benefits according to the employer's written terms.",
      "That makes policy wording critical at separation. A policy can distinguish resignation, discharge, layoff, notice periods, caps, forfeiture, and payout conditions, subject to other applicable laws such as anti-discrimination rules.",
    ],
    sections: [
      { heading: "Texas does not generally require private-employer vacation or PTO", paragraphs: ["TWC states that the Texas Payday Law does not require employers to offer vacation pay, holiday pay, sick pay, or other pay for hours not worked. Employers may decide whether to offer those benefits, subject to other applicable legal obligations."] },
      { heading: "Written policies can turn fringe benefits into enforceable wages", paragraphs: ["Texas Labor Code Section 61.001 includes qualifying fringe benefits promised in a written employer policy or written agreement within the Payday Law's wage framework. TWC therefore enforces covered leave pay according to the written promise."] },
      { heading: "Payout at separation depends on the policy", paragraphs: ["TWC guidance states that accrued-leave payouts are required under the Payday Law only when the employer's written policy or agreement promises the payout. If a policy lawfully provides forfeiture or conditions payout on particular separation circumstances, those terms can control."] },
      { heading: "The payment schedule can differ by compensation component", paragraphs: ["Regular final wages follow the six-day discharge deadline or next-regular-payday voluntary-separation rule. TWC explains that fringe benefits, commissions, and bonuses may follow a different payment schedule if the governing written policy or wage agreement specifically provides one."] },
    ],
    faq: [
      { q: "Does Texas require employers to pay out unused PTO when someone quits?", a: "Not automatically. The payout generally depends on whether the employer's written policy or agreement promises payment and on the conditions in that policy." },
      { q: "Can a Texas employer have a use-it-or-lose-it vacation policy?", a: "Texas generally lets private employers define accrual, carryover, use, and payout conditions in their written policy, subject to other applicable laws." },
      { q: "When is owed PTO payout due after termination?", a: "TWC states that final-pay timing applies to pay components unless the written policy or agreement for that component provides a different payout schedule." },
    ],
    sources: [
      { label: "Texas Labor Code § 61.001", url: "https://statutes.capitol.texas.gov/?artSec=61.001&chapter=LA.61&code=LA&tab=1" },
      { label: "Texas Workforce Commission — Texas Payday Law", url: "https://www.twc.texas.gov/programs/wage-and-hour/texas-payday-law" },
      { label: "Texas Workforce Commission — Accrued Leave Payouts", url: "https://efte.twc.texas.gov/accrued_leave_payouts.html" },
    ],
    related: [
      { label: "Texas final paycheck law", href: "/guides/texas-final-paycheck-law" },
      { label: "Texas wage claims", href: "/guides/texas-wage-claim-law" },
      { label: "Texas FMLA leave law", href: "/guides/texas-fmla-leave-law" },
    ],
  },
};
