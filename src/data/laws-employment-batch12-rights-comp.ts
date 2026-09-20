import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH12_RIGHTS_COMP_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-workplace-discrimination-law": {
    slug: "texas-workplace-discrimination-law",
    title: "Texas Workplace Discrimination Law: Protected Classes, Harassment and Retaliation",
    dek: "How Texas Labor Code Chapter 21 addresses employment discrimination, harassment, reasonable accommodation, retaliation, employer coverage, and the special one-employee sexual-harassment rule.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Labor Code Chapter 21 prohibits covered employers from discriminating in employment because of specified protected characteristics including race, color, disability, religion, sex, national origin, and age.",
      "The ordinary Chapter 21 employer definition generally uses a 15-employee threshold, but Texas created a separate sexual-harassment subchapter whose employer definition reaches a person employing one or more employees or acting directly in an employer's interests toward an employee.",
      "Chapter 21 also addresses retaliation and reasonable accommodation in covered circumstances; discrimination law applies to more than firing decisions.",
      "Federal employment-discrimination law operates alongside Texas law and can differ in coverage, protected activity, procedure, and remedies, so the applicable forum and deadline should be checked promptly.",
    ],
    intro: [
      "Texas employment discrimination law reaches hiring, firing, compensation, terms and conditions, harassment, and other employment actions when the statutory requirements are met. The general at-will doctrine does not protect an action taken for a prohibited reason.",
      "Coverage is not identical for every claim. In particular, the Texas Legislature created a special one-employee threshold for the state's sexual-harassment provisions, while the ordinary Chapter 21 employer definition generally uses a larger threshold.",
    ],
    sections: [
      { heading: "Section 21.051 prohibits specified discriminatory employment practices", paragraphs: ["Texas Labor Code Section 21.051 makes it an unlawful employment practice for a covered employer to discriminate because of race, color, disability, religion, sex, national origin, or age in hiring, discharge, compensation, or other terms, conditions, or privileges of employment."] },
      { heading: "Ordinary Chapter 21 coverage generally starts at 15 employees", paragraphs: ["Section 21.002 generally defines an employer using a 15-or-more-employee test over the statutory calendar-week period, subject to the detailed definition and separate provisions that apply to particular claims."] },
      { heading: "Sexual harassment has a special one-employee Texas rule", paragraphs: ["Section 21.141 defines an employer for the sexual-harassment subchapter as a person who employs one or more employees or acts directly in an employer's interests in relation to an employee. Texas Workforce Commission guidance therefore treats sexual-harassment coverage differently from the ordinary 15-employee Chapter 21 threshold."] },
      { heading: "Retaliation and accommodation can create separate violations", paragraphs: ["Chapter 21 includes protections against retaliation for specified discrimination-related activity and provisions concerning reasonable accommodation. A dispute should be analyzed by the actual protected characteristic, activity, employer coverage, requested accommodation, and procedural path rather than by a generic 'wrongful termination' label."] },
    ],
    faq: [
      { q: "How many employees must a Texas employer have for Chapter 21 discrimination law?", a: "The ordinary Chapter 21 employer definition generally uses a 15-employee threshold, but Texas has a special sexual-harassment provision that can apply with one employee." },
      { q: "Does at-will employment allow discrimination?", a: "No. At-will is a default rule and does not authorize an employer to take action for a reason prohibited by Chapter 21 or other applicable law." },
      { q: "Is harassment covered only when a manager does it?", a: "No. The legal analysis depends on the type of harassment, who engaged in it, employer knowledge and response, and the governing state or federal standard. Harassment can involve supervisors, coworkers, or others in the workplace." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 21", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.21.htm" },
      { label: "Texas Labor Code § 21.051", url: "https://statutes.capitol.texas.gov/?artSec=21.051&chapter=LA.21&code=LA&tab=1" },
      { label: "Texas Labor Code § 21.141", url: "https://statutes.capitol.texas.gov/?artSec=21.141&chapter=LA.21&code=LA&tab=1" },
      { label: "Texas Workforce Commission — Employment Discrimination", url: "https://www.twc.texas.gov/programs/civil-rights/employment-discrimination" },
    ],
    related: [
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
      { label: "Texas workers' compensation coverage", href: "/guides/texas-workers-compensation-coverage-law" },
      { label: "Texas wage claims", href: "/guides/texas-wage-claim-law" },
    ],
  },

  "texas-workers-compensation-coverage-law": {
    slug: "texas-workers-compensation-coverage-law",
    title: "Texas Workers' Compensation Law: Coverage, Non-Subscribers and Employee Benefits",
    dek: "Why most Texas private employers can choose whether to carry workers' compensation coverage, what subscriber and non-subscriber status means, employee notices, and the basic benefit structure for covered injuries.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Labor Code Section 406.002 generally allows most private employers to choose whether to obtain workers' compensation insurance coverage, subject to exceptions elsewhere in law.",
      "A private employer without Texas workers' compensation coverage is commonly called a non-subscriber and has state notice and reporting duties.",
      "When valid workers' compensation coverage applies, the system can provide medical and income benefits for compensable work-related injuries or occupational illnesses under the Texas Workers' Compensation Act.",
      "Coverage status materially changes an injured worker's legal path; an employee should verify whether the employer was a subscriber, certified self-insurer, governmental entity, or non-subscriber on the injury date.",
    ],
    intro: [
      "Texas is unusual because most private employers are not required to subscribe to the state workers' compensation system. That makes coverage verification one of the first questions after a workplace injury.",
      "Optional coverage does not mean an employer can simply hide its status. Non-subscribers have notice and reporting duties, and other laws require coverage in particular governmental or contracting situations.",
    ],
    sections: [
      { heading: "Most private Texas employers may choose whether to subscribe", paragraphs: ["Labor Code Section 406.002 provides the general optional-coverage rule for employers other than public employers and other situations in which law requires coverage. Texas Department of Insurance guidance likewise explains that workers' compensation is not mandatory for most private employers."] },
      { heading: "No coverage means non-subscriber status", paragraphs: ["A private employer that elects not to provide Texas workers' compensation coverage is a non-subscriber. DWC requires non-subscribers to provide workers with notice of no coverage and to make specified reports to the state, including certain injury, illness, and fatality reporting when the statutory thresholds are met."] },
      { heading: "Subscriber coverage provides a statutory benefit system", paragraphs: ["For a covered compensable injury or occupational illness, the Texas system can provide medical benefits and, when the eligibility rules are met, income benefits replacing part of lost wages. Death and burial benefits can apply in qualifying fatal cases."] },
      { heading: "Verify coverage for the actual injury date", paragraphs: ["Coverage can begin or end over time. The Texas Department of Insurance provides coverage-verification resources and distinguishes carrier subscribers, certified self-insurers, governmental self-insurance, and non-subscribers. The employer's status on the date of injury is critical to the legal path."] },
    ],
    faq: [
      { q: "Do all Texas employers have to carry workers' compensation insurance?", a: "No. Most private employers may choose whether to carry Texas workers' compensation coverage, although public employers and some other situations are governed by mandatory-coverage rules." },
      { q: "What is a Texas workers' compensation non-subscriber?", a: "It is generally a private employer that has chosen not to provide Texas workers' compensation coverage. Non-subscribers still have notice and reporting duties." },
      { q: "How do I know whether my employer had workers' comp when I was hurt?", a: "Texas DWC provides coverage-verification resources. Coverage should be checked for the specific employer, workplace, and date of injury." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 406", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.406.htm" },
      { label: "Texas Labor Code § 406.002", url: "https://statutes.capitol.texas.gov/?artSec=406.002&chapter=LA.406&code=LA&tab=1" },
      { label: "Texas Department of Insurance — Workers' Compensation Coverage Verification", url: "https://www.tdi.texas.gov/WC/employer/coverage.html" },
      { label: "Texas Department of Insurance — Non-Subscriber Reporting", url: "https://tdi.texas.gov/wc/nonsubscriber.html" },
    ],
    related: [
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
      { label: "Texas workplace discrimination law", href: "/guides/texas-workplace-discrimination-law" },
      { label: "Texas final paycheck law", href: "/guides/texas-final-paycheck-law" },
    ],
  },
};
