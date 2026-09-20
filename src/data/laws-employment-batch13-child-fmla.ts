import type { CornerstoneGuide } from "@/data/cornerstone-guides";

export const EMPLOYMENT_BATCH13_CHILD_FMLA_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-child-labor-law": {
    slug: "texas-child-labor-law",
    title: "Texas Child Labor Law: Minimum Age, Hours and Hazardous Work",
    dek: "A practical guide to Texas and federal child-labor rules, including the general under-14 restriction, hours for 14- and 15-year-olds, hazardous occupations, parental-business exceptions, and the stricter-law rule.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "Texas Labor Code Chapter 51 regulates employment of people under 18 and generally prohibits employment of a child under 14 except in specified circumstances.",
      "Children ages 14 and 15 face restrictions on occupations and work hours, including school-day and school-week limits, while 16- and 17-year-olds generally have broader hour flexibility but remain barred from hazardous occupations.",
      "Federal Fair Labor Standards Act child-labor rules can be stricter than Texas rules; when both apply, an employer must comply with the stricter applicable protection.",
      "Texas law contains specific exemptions and special rules for parent-owned businesses, casual work, newspaper delivery, child actors, agriculture, solicitation, and other circumstances.",
    ],
    intro: [
      "Texas child-labor law is not simply a minimum-age rule. It regulates who may work, when minors may work, and which duties are too hazardous for young workers.",
      "Federal child-labor law overlays the Texas rules for covered employers. A state exception does not authorize conduct that federal law independently prohibits.",
    ],
    sections: [
      { heading: "Texas generally bars employment under age 14", paragraphs: ["Texas Workforce Commission states that it is generally illegal to employ a child under 14 except in specific circumstances authorized by law. Chapter 51 and TWC rules define the state framework and exemptions."] },
      { heading: "Fourteen- and fifteen-year-olds have hour and occupation limits", paragraphs: ["Young workers in this age group may work only within the state and federal limits that apply to school days, school weeks, non-school periods, time of day, and permitted occupations. Employers should check both systems before scheduling the minor."] },
      { heading: "Hazardous work remains restricted through age 17", paragraphs: ["Texas and federal law identify hazardous occupations that minors may not perform. TWC emphasizes that workers under 18 may not be assigned prohibited hazardous duties even if their hours would otherwise be lawful."] },
      { heading: "When state and federal rules differ, follow the stricter applicable rule", paragraphs: ["TWC expressly warns that some Texas provisions are less restrictive than federal child-labor rules. A business covered by the FLSA must comply with federal requirements as well as state law and should apply the stricter protection when both govern the same work."] },
    ],
    faq: [
      { q: "How old do you have to be to work in Texas?", a: "Texas generally prohibits employment under age 14, but specific statutory exemptions and special categories exist." },
      { q: "Can a 16-year-old work unlimited hours in Texas?", a: "Texas generally allows broader hours at ages 16 and 17, but federal rules, school-related requirements, and hazardous-occupation restrictions can still matter." },
      { q: "What if Texas law allows something federal child-labor law prohibits?", a: "For an employer covered by both systems, the stricter applicable rule controls. TWC specifically instructs employers to follow the stricter protection when state and federal law overlap." },
    ],
    sources: [
      { label: "Texas Labor Code Chapter 51", url: "https://statutes.capitol.texas.gov/Docs/LA/htm/LA.51.htm" },
      { label: "Texas Workforce Commission — Texas Child Labor Law", url: "https://www.twc.texas.gov/programs/wage-and-hour/texas-child-labor-law" },
      { label: "U.S. Department of Labor — YouthRules!", url: "https://www.dol.gov/agencies/whd/youthrules" },
    ],
    related: [
      { label: "Texas minimum wage law", href: "/guides/texas-minimum-wage-law" },
      { label: "Texas overtime law", href: "/guides/texas-overtime-law" },
      { label: "Texas payday schedule law", href: "/guides/texas-payday-schedule-law" },
    ],
  },

  "texas-fmla-leave-law": {
    slug: "texas-fmla-leave-law",
    title: "FMLA in Texas: Eligibility, 12 Weeks of Leave and Job Protection",
    dek: "How the federal Family and Medical Leave Act applies to Texas workers, including covered employers, the 12-month and 1,250-hour tests, the 50-employees-within-75-miles rule, qualifying reasons, health benefits, and restoration rights.",
    updated: "2026-08-13",
    pillarLabel: "Texas Laws",
    pillarHref: "/laws",
    guideLabel: "Texas Law Guide",
    keyTakeaways: [
      "The Family and Medical Leave Act is federal law and applies in Texas to covered employers and eligible employees.",
      "For the ordinary private-sector eligibility test, an employee generally must have worked for the employer for at least 12 months, have at least 1,250 hours of service in the preceding 12 months, and work at a location where the employer has at least 50 employees within 75 miles.",
      "Eligible employees may generally take up to 12 workweeks of job-protected leave in the applicable 12-month period for qualifying family and medical reasons, with special military-caregiver leave rules allowing more time in qualifying cases.",
      "FMLA leave can be unpaid, but qualifying group health benefits generally continue under the same conditions and the employee is ordinarily entitled to return to the same or a virtually identical position.",
    ],
    intro: [
      "Texas does not replace the federal FMLA with a separate general private-sector family-leave system. For many Texas workers, the federal statute and regulations are therefore the main source of job-protected family and medical leave rights.",
      "Coverage and eligibility are separate questions. A company can be a covered employer while a particular employee has not yet met the service, hours, or worksite requirements for FMLA leave.",
    ],
    sections: [
      { heading: "Private-sector coverage generally begins at 50 employees", paragraphs: ["The FMLA covers private-sector employers that employed 50 or more employees in at least 20 workweeks in the current or preceding calendar year, as well as public agencies and covered educational agencies under the statute's separate rules."] },
      { heading: "Employee eligibility has service, hours and worksite tests", paragraphs: ["An ordinary eligible employee generally must have at least 12 months of employment, at least 1,250 hours of service during the 12 months before leave begins, and work at a location where the employer has at least 50 employees within 75 miles. Special rules apply to some categories such as airline flight crews."] },
      { heading: "Qualifying reasons include serious health and family events", paragraphs: ["FMLA leave can cover birth or placement of a child, care for a spouse, child, or parent with a serious health condition, the employee's own serious health condition, and qualifying military-family reasons. The statute and regulations define the conditions and notice/certification requirements."] },
      { heading: "Job and health-benefit protection accompany qualifying leave", paragraphs: ["During qualifying FMLA leave, group health coverage generally continues under the same conditions as if the employee had continued working. Upon return, the employee is ordinarily entitled to the same or a virtually identical job, subject to the statute's exceptions and rules."] },
    ],
    faq: [
      { q: "How long do I have to work before I qualify for FMLA in Texas?", a: "For the ordinary rule, an employee generally needs at least 12 months with the employer and 1,250 hours of service in the prior 12 months, plus the worksite requirement." },
      { q: "Is FMLA paid leave?", a: "FMLA itself generally provides unpaid job-protected leave, though paid employer leave may run concurrently when the legal requirements are met." },
      { q: "Does a small Texas business have to provide FMLA?", a: "Private-sector FMLA coverage generally requires 50 or more employees for at least 20 workweeks in the current or prior calendar year, while public agencies and certain schools follow separate coverage rules." },
    ],
    sources: [
      { label: "Family and Medical Leave Act, 29 U.S.C. § 2601 et seq.", url: "https://www.govinfo.gov/link/uscode/29/2601" },
      { label: "29 C.F.R. Part 825", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-C/part-825" },
      { label: "U.S. Department of Labor — FMLA Fact Sheet #28", url: "https://www.dol.gov/agencies/whd/fact-sheets/28-fmla" },
    ],
    related: [
      { label: "Texas employment-at-will law", href: "/guides/texas-employment-at-will-law" },
      { label: "Texas workplace discrimination law", href: "/guides/texas-workplace-discrimination-law" },
      { label: "Texas jury-duty employment law", href: "/guides/texas-jury-duty-employment-law" },
    ],
  },
};
