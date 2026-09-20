import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH13_APPEALS_WORKERSCOMP_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-unemployment-appeal-law": {
    slug: "texas-unemployment-appeal-law",
    title: "Texas Unemployment Appeals: The 14-Day Deadline and Appeal Process",
    dek: "How to appeal a Texas Workforce Commission unemployment determination, including the 14-calendar-day deadline, Appeal Tribunal, Commission appeal, rehearing, and judicial review path.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "The first appeal of a Texas unemployment determination generally must be submitted in writing within 14 calendar days from the date TWC mailed the determination notice.",
      "The first administrative appeal is to the Appeal Tribunal, which commonly conducts a telephone hearing and issues a written decision.",
      "A party that disagrees with the Appeal Tribunal decision generally has another 14-calendar-day period to appeal in writing to the Commission.",
      "A motion for rehearing and later judicial review have their own statutory requirements; missing an administrative deadline can seriously limit the available path.",
    ],
    intro: [
      "Texas unemployment appeals move quickly. The deadline printed on the determination or appeal decision should be treated as controlling because the first several administrative stages generally use 14-calendar-day filing periods.",
      "An appeal is not merely a request for TWC to reread the file. The Appeal Tribunal can conduct a hearing, receive testimony and documents, and decide disputed facts and law.",
    ],
    sections: [
      { heading: "The first appeal is generally due within 14 calendar days", paragraphs: ["TWC states that an appeal to the Appeal Tribunal must be in writing and filed within 14 calendar days from the date the agency mailed the Determination Notice. If the final day falls on a qualifying state or federal holiday, TWC's instructions describe the applicable extension."] },
      { heading: "The Appeal Tribunal can hold an evidentiary hearing", paragraphs: ["After a timely appeal, TWC may schedule a hearing and send the parties a hearing packet. The hearing is commonly by telephone, and parties should be prepared to present testimony, witnesses, and documents relevant to the disputed determination."] },
      { heading: "Commission review has another short deadline", paragraphs: ["A party that disagrees with the Appeal Tribunal decision may appeal in writing to the Commission, generally within 14 calendar days from the date TWC mailed the tribunal decision. The decision itself contains the filing instructions and deadline."] },
      { heading: "Rehearing and court review come later", paragraphs: ["Texas Labor Code Chapter 212 governs the administrative appeal and judicial-review framework. After the Commission decision, a motion for rehearing is available only under the stated requirements, and judicial review generally depends on exhausting the administrative process and meeting the applicable filing rules."] },
    ],
    faq: [
      { q: "How many days do I have to appeal a Texas unemployment decision?", a: "The first administrative appeal generally must be filed in writing within 14 calendar days from the mailing date shown on the determination." },
      { q: "Is the unemployment appeal hearing in person?", a: "TWC commonly conducts Appeal Tribunal hearings by telephone, though parties should follow the specific hearing notice they receive." },
      { q: "Can I appeal the Appeal Tribunal decision?", a: "Yes. TWC provides a written appeal to the Commission, generally subject to another 14-calendar-day deadline." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 212", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.212.htm" },
      { label: "Texas Workforce Commission — File an Unemployment Appeal", url: "https://www.twc.texas.gov/services/file-unemployment-appeal" },
      { label: "Texas Workforce Commission — UI Claim and Appeal Process", url: "https://efte.twc.texas.gov/ui_law_the_claim_and_appeal_process.html" },
    ],
    related: [
      { label: "Texas unemployment eligibility", href: "/guides/texas-unemployment-benefits-eligibility-law" },
      { label: "Texas unemployment separation rules", href: "/guides/texas-unemployment-quit-fired-misconduct-law" },
      { label: "Texas wage claims", href: "/guides/texas-wage-claim-law" },
    ],
  },

  "texas-workers-comp-injury-deadlines-law": {
    slug: "texas-workers-comp-injury-deadlines-law",
    title: "Texas Workers' Comp Injury Deadlines: 30-Day Notice and One-Year Claim",
    dek: "The key Texas workers' compensation deadlines for an injured employee: reporting the injury to the employer and filing the employee claim with the Division of Workers' Compensation.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "An injured employee generally must notify the employer of a work-related injury within 30 days after the injury or the date the employee knew or should have known the injury was work related.",
      "The employee generally must file a claim with the Texas Division of Workers' Compensation within one year to protect the right to benefits, subject to statutory exceptions.",
      "Employer notice and the employee's DWC claim are separate steps; reporting the injury at work does not necessarily substitute for filing the employee claim with DWC.",
      "Occupational diseases and repetitive-trauma injuries can involve a different injury-date analysis, so the date the worker knew or should have known of the work relationship can be important.",
    ],
    intro: [
      "Texas workers' compensation law uses short notice and claim deadlines. An injured worker should not assume that the employer, doctor, or insurance carrier has completed every filing required to protect the employee's own claim.",
      "The deadlines can have exceptions, but relying on an exception is riskier than giving prompt notice and filing the required DWC claim when coverage applies.",
    ],
    sections: [
      { heading: "Report the injury to the employer within 30 days", paragraphs: ["Texas Labor Code Chapter 409 generally requires an employee to notify the employer of an injury not later than the 30th day after the injury occurs or, for an occupational disease, after the employee knew or should have known the disease was related to employment. Failure to give timely notice can affect benefits unless an exception applies."] },
      { heading: "File the employee claim with DWC within one year", paragraphs: ["Section 409.003 generally requires the employee to file a claim for compensation with the Division of Workers' Compensation not later than one year after the injury date, with separate provisions for occupational disease and statutory exceptions."] },
      { heading: "Employer notice and DWC filing are different", paragraphs: ["TDI's injured-employee guidance expressly tells workers both to report the injury to the employer and to send DWC Form-041 to the Division within the claim period. One step should not be assumed to automatically complete the other."] },
      { heading: "Occupational disease dates can be less obvious", paragraphs: ["Repetitive-trauma and occupational-disease cases may not involve one obvious accident date. Chapter 408 and Chapter 409 contain rules that tie notice and claim timing to when the employee knew or should have known the disease was related to employment."] },
    ],
    faq: [
      { q: "How long do I have to tell my employer about a Texas work injury?", a: "The general rule is 30 days, subject to the statutory injury-date rules and exceptions." },
      { q: "How long do I have to file a Texas workers' comp claim?", a: "The general employee claim deadline is one year, subject to the statutory rules and exceptions in Chapter 409." },
      { q: "If I told my supervisor, do I still need to file with DWC?", a: "Generally yes. Employer notice and the employee's DWC claim are separate requirements, and TDI advises injured employees to complete both steps." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 409", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.409.htm" },
      { label: "Texas Labor Code § 409.003", url: "https://statutes.capitol.texas.gov/?artSec=409.003&chapter=LA.409&code=LA&tab=1" },
      { label: "Texas Department of Insurance — Injured Employee FAQ", url: "https://tdi.texas.gov/wc/employee/iefaqe.html" },
    ],
    related: [
      { label: "Texas workers' compensation coverage", href: "/guides/texas-workers-compensation-coverage-law" },
      { label: "Texas workers' comp retaliation", href: "/guides/texas-workers-comp-retaliation-law" },
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
    ],
  },
};
