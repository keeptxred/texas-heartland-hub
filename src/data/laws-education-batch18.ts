import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-14",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

export const EDUCATION_BATCH18_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-school-bullying-cyberbullying-law": {
    ...common,
    slug: "texas-school-bullying-cyberbullying-law",
    title: "Texas School Bullying and Cyberbullying Law: Reports, Parent Notice and Off-Campus Conduct",
    dek: "How Texas defines bullying and cyberbullying, when off-campus electronic conduct can fall within school policy, required district procedures, parent notification, anti-retaliation protections, and available school responses.",
    keyTakeaways: [
      "Texas Education Code Section 37.0832 defines bullying to include a single significant act or pattern of acts that exploits an imbalance of power and satisfies specified harm, disruption, environment, or rights-based standards.",
      "Cyberbullying can fall within Section 37.0832 even when it occurs off school property if it interferes with a student's educational opportunities or substantially disrupts a classroom, school, or school-related activity.",
      "District bullying policies must prohibit retaliation and provide notice to the alleged victim's parent or guardian on or before the third business day after the incident is reported.",
      "Texas law also requires districts to maintain reporting, intervention, counseling, prevention, and assessment procedures; severe forms of bullying can trigger separate disciplinary provisions.",
    ],
    intro: [
      "Texas bullying law is broader than conduct that happens face-to-face on campus. Section 37.0832 expressly includes cyberbullying and reaches specified off-campus electronic conduct when the required school-impact test is met.",
      "This guide focuses on the statewide framework. A district's published bullying policy supplies the local reporting channel, investigation process, and response steps within that framework.",
    ],
    sections: [
      { heading: "Texas uses a statutory definition of bullying", paragraphs: ["Section 37.0832 requires an imbalance of power plus specified effects or circumstances, such as physical harm, fear of harm, a severe or pervasive abusive educational environment, substantial disruption, or infringement of the victim's rights at school."] },
      { heading: "Cyberbullying can reach off-campus conduct", paragraphs: ["Off-campus or after-hours electronic conduct is not automatically school bullying. The statute reaches off-campus cyberbullying when it interferes with educational opportunities or substantially disrupts the orderly operation of a classroom, school, or school-related activity."] },
      { heading: "Parent notice has a specific deadline", paragraphs: ["A district policy must provide notice of a reported bullying incident to the alleged victim's parent or guardian on or before the third business day after the report. Notice to the alleged bully's parent or guardian must occur within a reasonable time."] },
      { heading: "District policies must include prevention and anti-retaliation rules", paragraphs: ["Texas requires district policies to prohibit bullying and good-faith-report retaliation and to include reporting, assistance, counseling, prevention, and incident-assessment procedures consistent with TEA minimum standards."] },
    ],
    faq: [
      { q: "Can a Texas school address cyberbullying that happened away from school?", a: "Yes, when the off-campus cyberbullying meets the statutory school-impact test in Section 37.0832(a-1)." },
      { q: "How quickly must the alleged victim's parent be notified?", a: "The district policy must provide notice on or before the third business day after the bullying incident is reported." },
      { q: "Does every rude or mean message meet the Texas bullying definition?", a: "No. The conduct must satisfy the statutory elements, including the imbalance-of-power and harm, environment, disruption, or rights-based requirements." },
    ],
    sources: [
      { label: "Texas Education Code § 37.0832", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.37.htm" },
      { label: "Texas Education Agency — Minimum Standards for Bullying Prevention", url: "https://tea.texas.gov/health-safety-and-discipline/weather-and-disaster/student-discipline/minimum-standards-bullying-prevention" },
    ],
    related: [
      { label: "Texas school suspension law", href: "/guides/texas-school-suspension-law" },
      { label: "Texas DAEP placement law", href: "/guides/texas-daep-placement-law" },
      { label: "Texas parental rights in public schools", href: "/guides/texas-public-school-parental-rights-law" },
    ],
  },

  "texas-school-corporal-punishment-opt-out-law": {
    ...common,
    slug: "texas-school-corporal-punishment-opt-out-law",
    title: "Texas School Corporal Punishment Law: Parent Opt-Out Rules",
    dek: "When a Texas school district may permit corporal punishment, how a parent or guardian can prohibit its use for a student, the annual written-statement requirement, and how revocation works.",
    keyTakeaways: [
      "Texas Education Code Section 37.0011 applies when an independent school district has adopted a policy permitting corporal punishment as a student-discipline method.",
      "A district educator may not use corporal punishment on a student after the student's parent, guardian, or other person with lawful control provides the required written, signed prohibition statement.",
      "The opt-out statement must be provided separately each school year in the manner established by the district board.",
      "The person who submitted the prohibition may revoke it during the school year through a written, signed revocation submitted in the district's prescribed manner.",
    ],
    intro: [
      "Texas does not impose one statewide rule requiring every district to use corporal punishment. Section 37.0011 instead regulates districts that choose to permit it and gives a parent or other legally responsible adult a statutory opt-out mechanism.",
      "Because the statement is annual, families who want the prohibition to continue should not assume a prior year's form automatically carries forward.",
    ],
    sections: [
      { heading: "The rule matters only where district policy permits corporal punishment", paragraphs: ["Section 37.0011 defines corporal punishment and governs its use in a district that has adopted a policy allowing it as a discipline method."] },
      { heading: "Parents can prohibit its use for their student", paragraphs: ["A parent, guardian, or other person having lawful control may submit a written, signed statement prohibiting corporal punishment for the student. Once properly submitted, a district educator may not use corporal punishment on that student under the district policy."] },
      { heading: "The opt-out must be renewed each school year", paragraphs: ["The statute requires a separate written, signed statement each school year, submitted in the manner established by the school board."] },
      { heading: "The prohibition can be revoked in writing", paragraphs: ["The same legally responsible adult may revoke the statement during the school year by providing a written, signed revocation in the manner established by the board."] },
    ],
    faq: [
      { q: "Does every Texas school district use corporal punishment?", a: "No. Section 37.0011 applies where the district has adopted a policy that permits corporal punishment." },
      { q: "Is a verbal request enough to opt out?", a: "The statute specifies a written, signed statement submitted in the manner established by the district board." },
      { q: "Does last year's opt-out automatically continue?", a: "No. Section 37.0011 requires a separate statement each school year." },
    ],
    sources: [
      { label: "Texas Education Code § 37.0011", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.37.htm" },
      { label: "Texas Education Agency — Student Discipline", url: "https://tea.texas.gov/health-safety-and-discipline/student-discipline" },
    ],
    related: [
      { label: "Texas school suspension law", href: "/guides/texas-school-suspension-law" },
      { label: "Texas school restraint and time-out", href: "/guides/texas-school-restraint-timeout-law" },
      { label: "Texas parental rights in public schools", href: "/guides/texas-public-school-parental-rights-law" },
    ],
  },

  "texas-special-education-evaluation-law": {
    ...common,
    slug: "texas-special-education-evaluation-law",
    title: "Texas Special-Education Evaluation Law: 15-Day Response, 45-Day Evaluation and ARD Timeline",
    dek: "What happens after a parent requests a special-education evaluation in Texas, including the written-request response deadline, parental consent, the 45-school-day evaluation timeline, report delivery, and initial ARD timing.",
    keyTakeaways: [
      "A parent may request a special-education evaluation at any time, but Texas's 15-school-day response deadline is triggered by a written request submitted to the district's special-education director or another district administrative employee.",
      "If the district agrees to evaluate, it must provide required notices and obtain written parental consent before the evaluation proceeds.",
      "The full individual and initial evaluation generally must be completed no later than 45 school days after the district receives written parental consent, subject to statutory and rule-based exceptions.",
      "After the evaluation report is completed, the initial ARD committee generally determines eligibility within 30 calendar days, with special end-of-school-year rules in specified circumstances.",
    ],
    intro: [
      "Texas adds state timelines to the federal IDEA evaluation process. The most important distinction is between requesting an evaluation and consenting to one: the 15-school-day response timeline concerns a qualifying written parent request, while the 45-school-day evaluation timeline generally begins after written consent.",
      "Absences, transfers, and requests near the end of the school year can alter the ordinary timeline, so families should keep dated copies of requests, notices, and consent forms.",
    ],
    sections: [
      { heading: "Parents may request an evaluation at any time", paragraphs: ["TEA states that a parent may request a special-education evaluation at any time. A verbal request still invokes federal Child Find duties, but it does not trigger Texas's specific 15-school-day response deadline."] },
      { heading: "A qualifying written request triggers a 15-school-day response", paragraphs: ["When the written request is submitted to the special-education director or another district administrative employee, the district must provide prior written notice of whether it agrees or refuses to evaluate no later than 15 school days after receiving the request, together with required procedural information."] },
      { heading: "Written consent starts the ordinary 45-school-day evaluation clock", paragraphs: ["Once the district obtains written parental consent, the evaluation and written report generally must be completed within 45 school days. Texas rules contain exceptions for specified student absences, transfers, and end-of-year timing."] },
      { heading: "Eligibility follows through the initial ARD process", paragraphs: ["The initial ARD committee generally meets within 30 calendar days after completion of the evaluation report to determine eligibility and, when appropriate, develop an IEP. Parents must also receive the evaluation report within the applicable pre-ARD timeframe."] },
    ],
    faq: [
      { q: "Does a verbal evaluation request trigger Texas's 15-school-day deadline?", a: "No. TEA says a verbal request still must be handled under Child Find and federal notice requirements, but the state 15-school-day response deadline is tied to a qualifying written request." },
      { q: "How long does a Texas school usually have to complete the initial evaluation after consent?", a: "Generally 45 school days after receipt of written parental consent, subject to the exceptions in Texas law and rule." },
      { q: "When is the initial eligibility decision usually made?", a: "The initial ARD committee generally determines eligibility within 30 calendar days after the evaluation report is completed, subject to specified school-year timing exceptions." },
    ],
    sources: [
      { label: "Texas Education Code § 29.004", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.29.htm" },
      { label: "Texas Education Agency — Student Handbook Statement on Special-Education Referrals", url: "https://tea.texas.gov/special-populations-and-support/special-education/programs-and-services/student-handbook-statement" },
      { label: "Texas SPED Support — Evaluation", url: "https://spedsupport.tea.texas.gov/resource-library/evaluation" },
    ],
    related: [
      { label: "Texas ARD and IEP parent rights", href: "/guides/texas-ard-iep-parent-rights-guide" },
      { label: "Texas special-education discipline", href: "/guides/texas-special-education-discipline-manifestation-law" },
      { label: "Texas parent access to student records", href: "/guides/texas-parent-access-student-records-law" },
    ],
  },

  "texas-ard-iep-parent-rights-guide": {
    ...common,
    slug: "texas-ard-iep-parent-rights-guide",
    title: "Texas ARD and IEP Parent Rights: Meetings, Notice, Participation and Disagreements",
    dek: "A Texas parent's role in the Admission, Review and Dismissal process, including participation in IEP decisions, meeting notice, prior written notice, procedural safeguards, requests for ARD meetings, and dispute options.",
    keyTakeaways: [
      "In Texas, the Admission, Review and Dismissal committee is the IDEA IEP team and is responsible for eligibility, IEP, placement, services, and related special-education decisions.",
      "Parents are members of the ARD committee and must be given an opportunity to participate meaningfully in decisions about their child's special-education program.",
      "Texas guidance generally requires at least five school days' notice of an ARD meeting unless the parent agrees to a shorter period, and prior written notice applies to specified proposals or refusals involving identification, evaluation, placement, or FAPE.",
      "If a parent makes a written request for an ARD meeting about IEP implementation or needed changes, TEA says the school must either schedule and convene a meeting or, within five school days, give written notice explaining the refusal to convene one.",
    ],
    intro: [
      "Texas uses the term ARD committee for the group federal law calls the IEP team. The process is intended to be collaborative, but the parent also has formal notice, participation, records, procedural-safeguard, and dispute-resolution rights when agreement is not possible.",
      "This guide summarizes the process rather than prescribing an IEP outcome for any particular child.",
    ],
    sections: [
      { heading: "The ARD committee makes individualized special-education decisions", paragraphs: ["Education Code Section 29.005 and IDEA requirements place eligibility, IEP development, placement, services, and review decisions within the ARD/IEP process rather than unilateral informal decisions by one staff member."] },
      { heading: "Parents are participants, not observers", paragraphs: ["Parents are members of the ARD committee. Schools must take steps to ensure meaningful participation, including notice and scheduling procedures that support parent involvement."] },
      { heading: "Notice and procedural safeguards matter", paragraphs: ["Texas special-education guidance generally calls for at least five school days' notice of an ARD meeting unless a shorter period is agreed to, while prior written notice and the IDEA procedural-safeguards notice apply at specified stages and decisions."] },
      { heading: "Parents can request a meeting and use dispute-resolution procedures", paragraphs: ["TEA states that a written parent request for an ARD meeting about IEP implementation or needed changes must result in either a scheduled meeting or written notice within five school days explaining why the school refuses to convene one. IDEA also provides complaint, mediation, and due-process mechanisms in appropriate disputes."] },
    ],
    faq: [
      { q: "Is an ARD committee different from an IEP team?", a: "Texas calls the IDEA IEP team an Admission, Review and Dismissal, or ARD, committee." },
      { q: "How much notice should a parent receive before an ARD meeting?", a: "Texas guidance generally provides at least five school days' notice unless the parent agrees to a shorter period." },
      { q: "What if the school refuses a parent's written request for an ARD meeting?", a: "TEA says the school must, within five school days, provide written notice explaining why it refuses to convene the requested meeting." },
    ],
    sources: [
      { label: "Texas Education Code § 29.005", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.29.htm" },
      { label: "Texas SPED Support — ARD Supports", url: "https://spedsupport.tea.texas.gov/resource-library/ard-supports" },
      { label: "Texas Education Agency — Raising Special-Education Concerns", url: "https://tea.texas.gov/about-tea/contact-us/general-education-complaints/raising-concerns-your-school-local-grievance-process" },
    ],
    related: [
      { label: "Texas special-education evaluation law", href: "/guides/texas-special-education-evaluation-law" },
      { label: "Texas special-education discipline", href: "/guides/texas-special-education-discipline-manifestation-law" },
      { label: "Texas school restraint and time-out", href: "/guides/texas-school-restraint-timeout-law" },
    ],
  },

  "texas-special-education-discipline-manifestation-law": {
    ...common,
    slug: "texas-special-education-discipline-manifestation-law",
    title: "Texas Special-Education Discipline and Manifestation Determinations: IDEA Rules",
    dek: "How IDEA discipline protections apply to Texas students with disabilities, including short removals, disciplinary changes of placement, the 10-school-day manifestation review, continued services, and behavior-plan consequences.",
    keyTakeaways: [
      "IDEA permits specified disciplinary removals of a child with a disability for up to 10 consecutive school days when the same alternatives are applied to children without disabilities and the removal does not otherwise violate the federal change-of-placement rules.",
      "Within 10 school days of a decision to change a child's placement because of a code-of-conduct violation, the LEA, parent, and relevant IEP-team members must conduct a manifestation determination.",
      "The manifestation review asks whether the conduct was caused by or had a direct and substantial relationship to the disability, or was the direct result of the LEA's failure to implement the IEP.",
      "When a disciplinary removal triggers IDEA service requirements, the student can retain rights to educational services and appropriate behavioral supports even while removed from the prior placement.",
    ],
    intro: [
      "Texas school-discipline rules operate alongside federal IDEA protections for students with disabilities. A suspension or removal does not automatically become unlawful because a student has an IEP, but a longer removal or pattern of removals can trigger change-of-placement protections and a manifestation determination.",
      "The exact analysis depends on the duration and pattern of removals, the student's eligibility status, the conduct, and the IEP implementation history.",
    ],
    sections: [
      { heading: "IDEA allows some short disciplinary removals", paragraphs: ["Federal regulation permits school personnel to use specified removals of not more than 10 consecutive school days to the extent comparable alternatives are used for students without disabilities, so long as additional removals do not amount to a prohibited change of placement."] },
      { heading: "A disciplinary change of placement triggers a 10-school-day manifestation review", paragraphs: ["Within 10 school days after the decision to change placement for a code-of-conduct violation, the LEA, parent, and relevant IEP-team members must review the required information and determine whether the conduct was a manifestation of the child's disability."] },
      { heading: "The review uses two federal questions", paragraphs: ["The group examines whether the conduct was caused by or had a direct and substantial relationship to the disability, and whether it directly resulted from the LEA's failure to implement the IEP. A yes finding on either condition makes the conduct a manifestation under the regulation."] },
      { heading: "Services and behavioral supports can continue during removal", paragraphs: ["IDEA requires continued educational services in specified removal circumstances so the student can continue participating in the general curriculum and progressing toward IEP goals, along with appropriate functional behavioral assessment and behavioral-intervention services when required."] },
    ],
    faq: [
      { q: "Is every suspension of a student with an IEP a change of placement?", a: "No. IDEA distinguishes short removals from removals or patterns that constitute a change of placement under the federal regulations." },
      { q: "When must a manifestation determination occur?", a: "Within 10 school days of a decision to change the placement of a child with a disability because of a code-of-conduct violation." },
      { q: "What does the manifestation team decide?", a: "It considers whether the conduct had the required relationship to the disability or was the direct result of a failure to implement the IEP." },
    ],
    sources: [
      { label: "34 C.F.R. §§ 300.530–300.536", url: "https://sites.ed.gov/idea/regs/b/e/300.530" },
      { label: "Texas Education Agency — Discipline and School Removals", url: "https://tea.texas.gov/special-populations-and-support/special-education/programs-and-services/state-guidance/discipline-and-school-removals" },
    ],
    related: [
      { label: "Texas school suspension law", href: "/guides/texas-school-suspension-law" },
      { label: "Texas ARD and IEP parent rights", href: "/guides/texas-ard-iep-parent-rights-guide" },
      { label: "Texas school restraint and time-out", href: "/guides/texas-school-restraint-timeout-law" },
    ],
  },

  "texas-school-restraint-timeout-law": {
    ...common,
    slug: "texas-school-restraint-timeout-law",
    title: "Texas School Restraint and Time-Out Law: Student Protections and Parent Documentation",
    dek: "The Texas framework for restraint and time-out in public schools, including Education Code Section 37.0021, special-education rules, health-and-safety limits, required procedures, and restraint documentation.",
    keyTakeaways: [
      "Texas Education Code Section 37.0021 and 19 TAC Section 89.1053 create rules for the use of restraint and time-out in public-school settings, especially for students receiving special-education services.",
      "Behavior-management practices must protect the health and safety of the student and others and must comply with the state procedures governing when restraint or time-out may be used.",
      "Texas rules distinguish restraint, time-out, and prohibited seclusion or confinement practices; the legal label depends on what staff actually did, not merely what a campus calls the intervention.",
      "When restraint is used in circumstances covered by the special-education rule, written documentation and parent notification requirements apply.",
    ],
    intro: [
      "Texas regulates restrictive school behavior practices through both statute and administrative rule. The requirements are particularly detailed for students with disabilities, and TEA provides state guidance and a written-summary form aligned to the restraint documentation rule.",
      "Because the facts matter, families should document what occurred, how long it lasted, who was involved, and what notice or written summary the school provided.",
    ],
    sections: [
      { heading: "Section 37.0021 supplies the statutory framework", paragraphs: ["The Education Code regulates confinement, restraint, seclusion, and time-out and authorizes commissioner rules governing implementation. The law must be read together with 19 TAC Section 89.1053 for students covered by the special-education procedures."] },
      { heading: "Restraint and time-out are not interchangeable terms", paragraphs: ["Texas defines and regulates restrictive practices differently. The legality of an intervention depends on the actual conduct, purpose, conditions, and procedural compliance rather than the label used by staff."] },
      { heading: "Health and safety are core requirements", paragraphs: ["TEA states that behavior-management techniques and discipline practices must be implemented in a manner that protects the health and safety of students and others."] },
      { heading: "Covered restraint events require documentation", paragraphs: ["TEA's restraint guidance and sample written-summary form reflect parent-notification and written-documentation requirements in the special-education restraint rule. Families should request and preserve the written record when restraint occurs."] },
    ],
    faq: [
      { q: "Are restraint and time-out the same under Texas school rules?", a: "No. Texas law and rule distinguish the practices and impose different definitions and requirements." },
      { q: "Does Texas require documentation when restraint is used?", a: "For restraint events covered by the special-education rule, parent notification and written documentation requirements apply." },
      { q: "Where are the main Texas rules found?", a: "Education Code Section 37.0021 and 19 TAC Section 89.1053 are the central state authorities, supplemented by TEA guidance." },
    ],
    sources: [
      { label: "Texas Education Code § 37.0021", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.37.htm" },
      { label: "Texas Education Agency — Discipline and School Removals", url: "https://tea.texas.gov/special-populations-and-support/special-education/programs-and-services/state-guidance/discipline-and-school-removals" },
      { label: "Texas Education Agency — Written Summary of Restraint Use", url: "https://tea.texas.gov/special-populations-and-support/special-education/programs-and-services/state-guidance/written-summary-restraint-use-sample-form" },
    ],
    related: [
      { label: "Texas ARD and IEP parent rights", href: "/guides/texas-ard-iep-parent-rights-guide" },
      { label: "Texas special-education discipline", href: "/guides/texas-special-education-discipline-manifestation-law" },
      { label: "Texas corporal-punishment opt-out", href: "/guides/texas-school-corporal-punishment-opt-out-law" },
    ],
  },

  "texas-school-immunization-exemption-law": {
    ...common,
    slug: "texas-school-immunization-exemption-law",
    title: "Texas School Vaccine Exemption Law: Medical and Conscience Affidavits",
    dek: "Texas school immunization exemptions for medical reasons and reasons of conscience, including the official DSHS affidavit, notarization, two-year validity, outbreak exclusion, and the downloadable-form change effective September 1, 2025.",
    keyTakeaways: [
      "Texas recognizes school immunization exemptions for specified medical circumstances and for reasons of conscience, including religious belief, under state law and DSHS rules.",
      "For a reasons-of-conscience exemption, the parent, guardian, or eligible adult student must use the official DSHS affidavit, complete it, sign it, have it notarized, and submit it to the school or other covered institution.",
      "A properly completed reasons-of-conscience affidavit is generally valid for two years from the notarization date, but an exempted student may be excluded during an official emergency or outbreak as provided by law and rule.",
      "Beginning September 1, 2025, HB 1586 allows a blank DSHS immunization-exemption affidavit to be downloaded from the DSHS website instead of requiring the form to be mailed first.",
    ],
    intro: [
      "Texas school immunization law combines Health and Safety Code requirements with DSHS administrative rules. The process differs depending on whether the exemption is medical or based on conscience, and a general parent note is not a substitute for the official conscience affidavit.",
      "The 2025 Legislature changed the form-access process, making the blank DSHS affidavit directly downloadable while preserving the option to request a mailed form.",
    ],
    sections: [
      { heading: "Texas recognizes medical and conscience-based exemptions", paragraphs: ["DSHS identifies medical exemptions and reasons-of-conscience exemptions, including religious belief, as distinct pathways with different documentation requirements."] },
      { heading: "The conscience exemption uses an official notarized DSHS affidavit", paragraphs: ["The student or responsible adult must use the official form, complete and sign it, have it notarized, and submit it to the school or covered institution. The affidavit generally remains valid for two years from notarization."] },
      { heading: "HB 1586 made the blank form downloadable", paragraphs: ["Beginning September 1, 2025, DSHS posts a blank exemption affidavit that families may download and print. A mailed-form request remains available."] },
      { heading: "An exemption does not guarantee attendance during an outbreak", paragraphs: ["DSHS explains that a student who is not immunized under an exemption may be excluded from attendance during an official emergency or epidemic or outbreak under the applicable state rules."] },
    ],
    faq: [
      { q: "Can I download the Texas conscience-exemption affidavit?", a: "Yes. Beginning September 1, 2025, HB 1586 allows DSHS to make the blank affidavit available for download." },
      { q: "Does the conscience affidavit need to be notarized?", a: "Yes. DSHS instructs that the completed affidavit must be signed and notarized before it is submitted." },
      { q: "How long is a conscience affidavit generally valid?", a: "DSHS states that it is valid for two years from the notarization date." },
    ],
    sources: [
      { label: "Texas Health and Safety Code § 161.0041", url: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.161.htm" },
      { label: "Texas Department of State Health Services — Immunization Exemptions", url: "https://www.dshs.texas.gov/immunizations/school/exemptions" },
      { label: "Texas Legislature — HB 1586 (2025)", url: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB1586" },
    ],
    related: [
      { label: "Texas public-school enrollment", href: "/guides/texas-public-school-enrollment-residency-law" },
      { label: "Texas compulsory attendance", href: "/guides/texas-compulsory-school-attendance-law" },
      { label: "Texas parental rights in public schools", href: "/guides/texas-public-school-parental-rights-law" },
    ],
  },

  "texas-school-psychotropic-drug-law": {
    ...common,
    slug: "texas-school-psychotropic-drug-law",
    title: "Texas School Psychotropic-Drug Law: What School Employees May and May Not Recommend",
    dek: "Texas Education Code Section 38.016 rules on psychotropic drugs and psychiatric evaluations, including limits on school-employee recommendations, parent refusal, appropriate referrals, and permitted behavior discussions.",
    keyTakeaways: [
      "Texas Education Code Section 38.016 generally prohibits a school district employee from recommending that a student use a psychotropic drug or suggesting a particular diagnosis.",
      "A parent's refusal to consent to a psychotropic drug or psychiatric evaluation or examination may not, by itself, be used as grounds to bar the child from a class or school-related activity.",
      "The statute does not block an appropriate Child Find referral or prevent specified licensed health or mental-health professionals from recommending that a child be evaluated by an appropriate professional.",
      "School employees may still discuss a child's behavior or academic progress with the child's parent or another district employee.",
    ],
    intro: [
      "Section 38.016 draws a line between school staff discussing observable behavior or academic progress and school employees recommending a psychotropic drug or particular diagnosis. The law also protects the special-education Child Find process and appropriate professional referrals.",
      "The rule does not prohibit parents from seeking medical advice or schools from responding to immediate safety concerns; it governs specified school-employee recommendations and consequences tied to parent refusal.",
    ],
    sections: [
      { heading: "School employees generally may not recommend psychotropic drugs", paragraphs: ["Section 38.016 states that a school district employee may not recommend that a student use a psychotropic drug and may not suggest a particular diagnosis, subject to the statute's exceptions."] },
      { heading: "Parent refusal cannot be the sole basis for exclusion", paragraphs: ["A parent's refusal to consent to administration of a psychotropic drug or to a psychiatric evaluation or examination cannot, by itself, be used as grounds to prohibit the child from attending class or participating in a school-related activity."] },
      { heading: "Child Find and licensed-professional referrals remain available", paragraphs: ["The statute preserves appropriate special-education Child Find referrals and permits specified licensed or certified health and mental-health professionals to recommend an evaluation by an appropriate professional."] },
      { heading: "Behavior and academic-progress discussions are still allowed", paragraphs: ["Section 38.016 expressly does not prohibit a school employee from discussing any aspect of a child's behavior or academic progress with the child's parent or another district employee."] },
    ],
    faq: [
      { q: "Can a Texas teacher tell a parent that a student should take a psychotropic drug?", a: "Section 38.016 generally prohibits a school district employee from recommending that a student use a psychotropic drug." },
      { q: "Can a school exclude a student solely because a parent refused psychiatric medication?", a: "No. The refusal may not, by itself, be the basis for excluding the child from class or a school-related activity." },
      { q: "Can school staff still discuss behavior concerns?", a: "Yes. The statute allows school employees to discuss behavior and academic progress with the parent or other district employees." },
    ],
    sources: [
      { label: "Texas Education Code § 38.016", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.38.htm" },
      { label: "Texas Education Agency — Special Education Family Resources", url: "https://tea.texas.gov/academics/special-student-populations/special-education/sped-family-resources-0" },
    ],
    related: [
      { label: "Texas special-education evaluation law", href: "/guides/texas-special-education-evaluation-law" },
      { label: "Texas ARD and IEP parent rights", href: "/guides/texas-ard-iep-parent-rights-guide" },
      { label: "Texas parental rights in public schools", href: "/guides/texas-public-school-parental-rights-law" },
    ],
  },

  "texas-school-library-parental-access-law": {
    ...common,
    slug: "texas-school-library-parental-access-law",
    title: "Texas School Library Parent Access Law: Catalogs, Checkout Controls and Records Under SB 13",
    dek: "Texas SB 13 school-library rights beginning with the 2025–26 school year, including parent catalog access, parent-specific checkout restrictions, library-use records through online systems, and local implementation procedures.",
    keyTakeaways: [
      "SB 13 added Education Code Section 33.023 requiring districts and open-enrollment charter schools to provide parents access to school-library catalogs and a way to list materials their own child may not check out or otherwise use outside the library.",
      "The parent restriction list must be accepted through an electronic or physical form or through the district's or school's online library-catalog system.",
      "A school may not allow the parent's child to check out or otherwise use outside the library a material the parent has placed on the child's restriction list.",
      "Section 33.024 requires a district or charter using a learning-management system or online learning portal to provide each parent a record of covered library checkouts or outside-library uses, including specified bibliographic and return information when applicable.",
    ],
    intro: [
      "SB 13 created a new statewide parental-control layer for Texas public-school library materials beginning with the 2025–26 school year. It is separate from the broader process for challenging whether a title should remain in a district library catalog.",
      "The parent-specific restriction mechanism controls the parent's own child's access; the formal challenge process under Section 33.027 addresses catalog-wide treatment of a challenged title.",
    ],
    sections: [
      { heading: "Parents must be able to access the library catalog", paragraphs: ["Section 33.023 requires each covered district or charter to adopt procedures allowing a parent to access the catalog of available library materials at each school library in the system."] },
      { heading: "Parents can restrict their own child's checkout or outside-library use", paragraphs: ["Parents must be able to submit a list of library materials their child may not check out or otherwise access for use outside the school library. The procedure must allow an electronic or physical form or use of the online catalog system."] },
      { heading: "The school must honor the parent-specific restriction", paragraphs: ["A covered district or charter may not allow the child to check out or otherwise use outside the library a material included on the parent's submitted list."] },
      { heading: "Online systems can trigger parent library-use records", paragraphs: ["Section 33.024 requires a district or charter that uses a learning-management system or online learning portal to provide parents a record of each covered checkout or outside-library use, including title, author, genre, and return date as applicable."] },
    ],
    faq: [
      { q: "Can a Texas parent block a specific library book for their own child?", a: "Yes. Section 33.023 requires a process for parents to list materials their child may not check out or otherwise use outside the school library." },
      { q: "Does that remove the book for every student?", a: "No. A parent-specific access list is different from the district-wide challenge process under Section 33.027." },
      { q: "When did the SB 13 library-access rules begin applying?", a: "SB 13 states that its requirements apply beginning with the 2025–2026 school year." },
    ],
    sources: [
      { label: "Texas Legislature — SB 13 (2025, enrolled)", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00013F.HTM" },
      { label: "Texas Education Agency — SB 13 School Library Requirements", url: "https://tea.texas.gov/about-tea/news-and-multimedia/correspondence/taa-letters/senate-bill-13-requirements-related-to-school-library-materials" },
    ],
    related: [
      { label: "Texas school library material challenges", href: "/guides/texas-school-library-material-challenge-law" },
      { label: "Texas parent access to instructional materials", href: "/guides/texas-parent-access-instructional-materials-law" },
      { label: "Texas parental rights in public schools", href: "/guides/texas-public-school-parental-rights-law" },
    ],
  },

  "texas-school-library-material-challenge-law": {
    ...common,
    slug: "texas-school-library-material-challenge-law",
    title: "Texas School Library Book Challenge Law: SB 13 Process, Deadlines and Appeals",
    dek: "How Texas Education Code Section 33.027 handles school-library material challenges and appeals under SB 13, including who may challenge, the TEA form, temporary access restriction, advisory-council timing, board action, and repeat challenges.",
    keyTakeaways: [
      "Under SB 13, a parent or person standing in parental relation to a district student, a district employee, or a district resident may submit a written challenge to a school-library catalog material using the state-required challenge form.",
      "If the district has a local school library advisory council, the district must provide the council a copy of the challenge no later than the fifth day after receiving it, and the council has up to 90 days after receipt to make its recommendation.",
      "A district that receives a challenge must prohibit district students from accessing the challenged library material until the district takes action on the challenge.",
      "Section 33.027 also creates a board appeal path and generally allows the board to decline to act on another challenge to the same retained material submitted before the second anniversary of the board's decision not to remove it.",
    ],
    intro: [
      "SB 13 replaced informal-only library objections with a detailed statewide statutory challenge framework beginning with the 2025–26 school year. The process is different from a parent's right to restrict only their own child's library access.",
      "Local procedures still matter, particularly whether the district has a local school library advisory council, but those procedures must operate within Section 33.027 and the applicable library standards.",
    ],
    sections: [
      { heading: "The statute defines who may file a challenge", paragraphs: ["A parent or person standing in parental relation to an enrolled district student, a district employee, or a district resident may submit a written challenge to a school-library catalog material using the TEA-adopted form. An appeal of district action may be submitted to the board of trustees."] },
      { heading: "Council districts have a 5-day handoff and 90-day recommendation period", paragraphs: ["If the district has established a local school library advisory council, it must provide the council a copy of the challenge no later than the fifth day after receipt. The council must make a recommendation no later than the 90th day after it receives the challenge."] },
      { heading: "Student access is restricted while the challenge is pending", paragraphs: ["Section 33.027(g) directs a district that receives a challenge to prohibit district students from accessing the challenged library material until the district takes action in response to the challenge."] },
      { heading: "Board action and repeat-challenge rules follow", paragraphs: ["The board acts at the open meeting specified by Section 33.027(d). If the board ultimately keeps the material, the statute generally does not require action on another written challenge to the same material submitted before the second anniversary of that decision."] },
    ],
    faq: [
      { q: "Who can challenge a Texas district school-library material under SB 13?", a: "The statute includes a parent or person standing in parental relation to an enrolled district student, a district employee, or a person residing in the district." },
      { q: "Can students access the challenged material while the challenge is pending?", a: "Section 33.027(g) requires the district to prohibit student access until the district takes action on the challenge." },
      { q: "Can a district decision be appealed to the school board?", a: "Yes. Section 33.027 expressly provides an appeal to the district board of trustees from district action on a written challenge." },
    ],
    sources: [
      { label: "Texas Legislature — SB 13 (2025, enrolled)", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/SB00013F.HTM" },
      { label: "Texas Education Agency — SB 13 School Library Requirements", url: "https://tea.texas.gov/about-tea/news-and-multimedia/correspondence/taa-letters/senate-bill-13-requirements-related-to-school-library-materials" },
    ],
    related: [
      { label: "Texas school library parental access", href: "/guides/texas-school-library-parental-access-law" },
      { label: "Texas parent access to instructional materials", href: "/guides/texas-parent-access-instructional-materials-law" },
      { label: "Texas parental rights in public schools", href: "/guides/texas-public-school-parental-rights-law" },
    ],
  },
};
