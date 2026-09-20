import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH13_RETALIATION_JURY_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-workers-comp-retaliation-law": {
    slug: "texas-workers-comp-retaliation-law",
    title: "Texas Workers' Compensation Retaliation Law: Protected Claims and Testimony",
    dek: "How Texas Labor Code Chapter 451 protects employees from discharge or other discrimination for filing a good-faith workers' compensation claim, hiring a lawyer, starting a proceeding, or testifying.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Labor Code Section 451.001 prohibits discharge or other discrimination against an employee for specified workers' compensation activities.",
      "Protected activities include filing a workers' compensation claim in good faith, hiring a lawyer to represent the employee in a claim, instituting or causing a proceeding, and testifying or being about to testify in a proceeding.",
      "Chapter 451 is an exception to the ordinary Texas employment-at-will default when an adverse action is taken for a prohibited workers' compensation reason.",
      "A retaliation claim is separate from the underlying workers' compensation benefit claim and turns on the employment action, protected activity, causation, and available defenses or remedies.",
    ],
    intro: [
      "Texas generally follows employment at will, but employers cannot use that rule to punish an employee for the workers' compensation activities protected by Chapter 451.",
      "The existence of a work injury does not make every later disciplinary action retaliatory. The legal question is whether the adverse employment action occurred because of protected conduct within the statute.",
    ],
    sections: [
      { heading: "Section 451.001 lists protected workers' compensation activities", paragraphs: ["The statute prohibits discharging or otherwise discriminating against an employee because the employee filed a workers' compensation claim in good faith, hired a lawyer to represent the employee in a claim, instituted or caused a proceeding under the workers' compensation law, or testified or was about to testify in such a proceeding."] },
      { heading: "The protection is tied to causation", paragraphs: ["A Chapter 451 case requires more than showing that the employee had a work injury and later lost a job. The adverse action must be linked to the protected workers' compensation activity under the governing legal standard."] },
      { heading: "At-will employment does not override Chapter 451", paragraphs: ["Texas's general at-will rule remains the default for lawful employment decisions, but a reason prohibited by Chapter 451 is not made lawful merely because the employee otherwise worked at will."] },
      { heading: "The retaliation case is distinct from the benefits case", paragraphs: ["A dispute over whether an injury is compensable or what benefits are owed proceeds through the workers' compensation system. A Chapter 451 retaliation claim concerns prohibited employment discrimination and has its own elements and remedies."] },
    ],
    faq: [
      { q: "Can a Texas employer fire someone for filing workers' comp?", a: "Section 451.001 prohibits discharge or other discrimination because an employee filed a workers' compensation claim in good faith or engaged in the other protected activities listed in the statute." },
      { q: "Does every firing after a work injury prove retaliation?", a: "No. Timing can be evidence, but the claim still turns on whether the protected workers' compensation activity caused the adverse action under the applicable legal standard." },
      { q: "Is workers' comp retaliation the same as a benefits dispute?", a: "No. The retaliation claim concerns the employer's employment action; the benefit claim concerns entitlement to workers' compensation benefits." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 451", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.451.htm" },
      { label: "Texas Labor Code § 451.001", url: "https://statutes.capitol.texas.gov/?artSec=451.001&chapter=LA.451&code=LA&tab=1" },
      { label: "Texas Workforce Commission — Wrongful Discharge", url: "https://efte.twc.texas.gov/wrongful_discharge.html" },
    ],
    related: [
      { label: "Texas workers' compensation coverage", href: "/guides/texas-workers-compensation-coverage-law" },
      { label: "Texas workers' comp injury deadlines", href: "/guides/texas-workers-comp-injury-deadlines-law" },
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
    ],
  },

  "texas-jury-duty-employment-law": {
    slug: "texas-jury-duty-employment-law",
    title: "Texas Jury Duty Employment Law: Job Protection, Reemployment and Pay",
    dek: "Texas employee protections for jury service, including the Juror's Right to Reemployment Act, retaliation protection, and the distinction between job-protected leave and paid jury-duty leave.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Civil Practice and Remedies Code Chapter 122 protects qualifying employees from discharge because they perform jury service.",
      "A protected employee is entitled to return to the same employment after jury service under the statutory reemployment framework.",
      "Texas generally does not require private employers to provide paid jury-duty leave, although separate salary-basis rules apply to some exempt employees under federal wage law.",
      "Jury service should not be treated as an ordinary unexcused absence when doing so would conflict with the statutory protection against adverse action for jury service.",
    ],
    intro: [
      "A jury summons can create a scheduling problem, but Texas law protects jury service from becoming a lawful reason for discharge. The right is principally a job-protection and reemployment rule, not a general guarantee of private-employer paid leave.",
      "Employer policy may provide more generous jury-duty pay, and federal salary-basis rules can affect deductions for some exempt salaried workers. Those pay questions are separate from the state reemployment protection.",
    ],
    sections: [
      { heading: "Chapter 122 protects jury service from discharge", paragraphs: ["The Juror's Right to Reemployment Act in Civil Practice and Remedies Code Chapter 122 prohibits an employer from terminating a protected employee because the employee serves as a juror and provides a statutory path for enforcement."] },
      { heading: "The employee has a statutory reemployment right", paragraphs: ["The chapter provides a right to return to the same employment after qualifying jury service. An employee should comply with the statute's notice and return-to-work requirements and retain the summons and proof of service."] },
      { heading: "Job protection does not equal a general paid-leave mandate", paragraphs: ["Texas Workforce Commission guidance states that Texas law generally does not require private employers to pay ordinary hourly employees for time spent on jury duty. Employer policies can promise pay, and separate federal salary-basis rules can apply to exempt salaried employees."] },
      { heading: "Attendance policies must respect jury-service protection", paragraphs: ["An employer should not use an absence-control policy in a way that effectively penalizes protected jury service. A neutral attendance rule does not override the statutory prohibition on adverse action because of jury duty."] },
    ],
    faq: [
      { q: "Can I be fired for serving on a jury in Texas?", a: "Texas Civil Practice and Remedies Code Chapter 122 protects qualifying employees from termination because of jury service." },
      { q: "Does my Texas employer have to pay me while I am on jury duty?", a: "Texas generally does not require private employers to provide paid jury-duty leave, though employer policy and federal salary-basis rules can create different pay obligations." },
      { q: "Should jury duty count as an attendance occurrence?", a: "An employer should not apply an absence rule in a way that penalizes protected jury service or conflicts with the employee's statutory reemployment rights." },
    ],
    sources: [
      { label: "Texas Civil Practice and Remedies Code Chapter 122", url: "https://statutes.capitol.texas.gov/?link=CP" },
      { label: "Texas Workforce Commission — Jury Duty", url: "https://efte.twc.texas.gov/jury_duty.html" },
      { label: "29 C.F.R. § 541.602", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-A/part-541/subpart-G/section-541.602" },
    ],
    related: [
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
      { label: "Texas FMLA leave law", href: "/guides/texas-fmla-leave-law" },
      { label: "Texas workplace discrimination law", href: "/guides/texas-workplace-discrimination-law" },
    ],
  },
};
