import type { CornerstoneGuide } from "@/data/cornerstone-guides";

const common = {
  updated: "2026-08-14",
  pillarLabel: "Texas Laws",
  pillarHref: "/laws",
  guideLabel: "Texas Law Guide",
} as const;

export const EDUCATION_BATCH17_GUIDES: Record<string, CornerstoneGuide> = {
  "texas-compulsory-school-attendance-law": {
    ...common,
    slug: "texas-compulsory-school-attendance-law",
    title: "Texas Compulsory School Attendance Law: Ages, Enrollment and Excused Absences",
    dek: "How Texas compulsory-attendance law works, including the basic attendance duty, statutory exemptions, school attendance enforcement, and why excused absences do not erase every course-credit attendance rule.",
    keyTakeaways: [
      "Texas Education Code Section 25.085 generally requires a child who is at least six years old, or younger and previously enrolled in first grade, to attend school for the period required by law unless a statutory exemption applies.",
      "Compulsory attendance generally continues through the child's 19th birthday, subject to the statute's exceptions and special rules for students who voluntarily remain enrolled.",
      "Section 25.086 lists exemptions, including qualifying private-school and home-school instruction and several other specific circumstances.",
      "Attendance enforcement and course-credit attendance requirements are related but distinct; a legally excused absence can still count toward a course's attendance percentage unless another rule provides otherwise.",
    ],
    intro: ["Texas compulsory attendance is governed primarily by Education Code Chapter 25. It sets a statewide attendance duty but also contains detailed exemptions and separate rules for enrollment, absences, truancy prevention, and credit or final-grade attendance.", "This guide summarizes the statewide framework; district calendars, attendance procedures, and documentation requirements still matter."],
    sections: [
      { heading: "Section 25.085 creates the basic attendance duty", paragraphs: ["The statute identifies the age and enrollment circumstances that trigger compulsory attendance and generally requires attendance each school day for the period the program of instruction is provided." ] },
      { heading: "The law contains specific exemptions", paragraphs: ["Section 25.086 exempts several categories of children, including qualifying private-school students and children instructed at home in a manner recognized under Texas law. Other exemptions are fact-specific and should be checked directly." ] },
      { heading: "Excused absences and compulsory attendance are not identical questions", paragraphs: ["Section 25.087 recognizes excused-absence situations, while Section 25.092 separately addresses minimum attendance for credit or a final grade. Families should not assume that an excused absence automatically disappears from every attendance calculation." ] },
      { heading: "District procedures still matter", paragraphs: ["Districts administer attendance records, notices, documentation, make-up work, and local truancy-prevention measures within the state framework. Parents should review the district handbook and attendance policy together with Chapter 25." ] },
    ],
    faq: [
      { q: "When does Texas compulsory attendance generally begin?", a: "Section 25.085 generally begins the duty at age six, with additional rules for a younger child who has previously been enrolled in first grade." },
      { q: "Does compulsory attendance generally continue after age 18?", a: "Texas law generally extends the duty through the student's 19th birthday, subject to statutory exceptions and enrollment circumstances." },
      { q: "Can an excused absence still affect course credit?", a: "Yes. The compulsory-attendance, excused-absence, and credit-attendance provisions are separate rules and should be checked together." },
    ],
    sources: [
      { label: "Texas Education Code Chapter 25", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.25.htm" },
      { label: "Texas Education Agency — Attendance, Admission, Enrollment Records and Tuition", url: "https://tea.texas.gov/texas-schools/general-information/attendance-admission-enrollment-records-and-tuition" },
    ],
    related: [
      { label: "Texas homeschool law", href: "/guides/texas-homeschool-law" },
      { label: "Texas public-school enrollment and residency", href: "/guides/texas-public-school-enrollment-residency-law" },
      { label: "Texas school transfer law", href: "/guides/texas-school-transfer-law" },
    ],
  },

  "texas-homeschool-law": {
    ...common,
    slug: "texas-homeschool-law",
    title: "Texas Homeschool Law: Compulsory Attendance, Curriculum and Public-School Transfers",
    dek: "Texas homeschool rules, including the compulsory-attendance exemption, the Leeper standard, required course-of-study elements, lack of TEA registration, and what happens when a homeschooled student enters public school.",
    keyTakeaways: [
      "Texas recognizes home schooling as a legal alternative to public-school attendance when the program satisfies the standards recognized by Texas law.",
      "TEA states that it does not regulate, index, monitor, approve, register, or accredit Texas home-school programs.",
      "Under the Texas Supreme Court's Leeper framework, a qualifying home-school program must be bona fide and use a written curriculum covering reading, spelling, grammar, mathematics, and good citizenship.",
      "A school district that becomes aware of a student who may be home schooled may request a written letter of assurance from the parent that the student is being home schooled.",
    ],
    intro: ["Texas does not run a state homeschool-registration system. The legal framework comes from the compulsory-attendance statute and the Texas Supreme Court's Leeper decision, as summarized by TEA.", "Families returning to public school should also expect the receiving district to apply its placement and credit policies rather than assuming private homeschool records automatically control grade placement."],
    sections: [
      { heading: "Home schooling is a recognized compulsory-attendance exemption", paragraphs: ["Education Code Section 25.086 exempts qualifying students attending a private or parochial school, and Texas courts have treated bona fide home schools within that framework." ] },
      { heading: "Texas does not require TEA registration", paragraphs: ["TEA expressly states that it does not regulate, register, approve, monitor, or accredit home-school programs." ] },
      { heading: "The curriculum must be bona fide", paragraphs: ["TEA's summary of Leeper states that the curriculum must be in visual form and include reading, spelling, grammar, mathematics, and good citizenship, with instruction pursued in a bona fide manner." ] },
      { heading: "Public-school reentry is a separate process", paragraphs: ["When a homeschooled student transfers to public school, the receiving district may evaluate records and use reasonable assessment or placement procedures consistent with state guidance and local policy." ] },
    ],
    faq: [
      { q: "Do I register my Texas homeschool with TEA?", a: "No. TEA says it does not register or approve home-school programs." },
      { q: "Does Texas require a particular commercial homeschool curriculum?", a: "No particular vendor is required, but the program must satisfy the bona fide written-curriculum standard recognized by Texas law." },
      { q: "Can a district ask whether my child is actually being home schooled?", a: "Yes. TEA says a district may request a written letter of assurance from the parent when it becomes aware a student may be home schooled." },
    ],
    sources: [
      { label: "Texas Education Code § 25.086", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.25.htm" },
      { label: "Texas Education Agency — Home Schooling", url: "https://tea.texas.gov/families-and-students/finding-school-your-child/home-schooling" },
    ],
    related: [
      { label: "Texas compulsory attendance", href: "/guides/texas-compulsory-school-attendance-law" },
      { label: "Texas public-school enrollment", href: "/guides/texas-public-school-enrollment-residency-law" },
      { label: "Texas student-record access", href: "/guides/texas-parent-access-student-records-law" },
    ],
  },

  "texas-public-school-enrollment-residency-law": {
    ...common,
    slug: "texas-public-school-enrollment-residency-law",
    title: "Texas Public-School Enrollment and Residency Law: Who Is Entitled to Admission",
    dek: "The statewide rules for public-school admission based on residence and other qualifying circumstances, enrollment documentation, district residency disputes, and transfers between school districts.",
    keyTakeaways: [
      "Texas Education Code Section 25.001 defines the circumstances under which a school-age person is entitled to admission to a district's public schools.",
      "Residence in the district is a central admission path, but the statute also covers several situations involving a parent, guardian, other person with lawful control, foster placement, homelessness, and other circumstances.",
      "Districts may request enrollment documentation allowed by law, but enrollment cannot be conditioned on requirements that conflict with state or federal protections.",
      "If residency is disputed, TEA guidance directs families to the district's grievance process; the facts of where the child and responsible adult reside can control the analysis.",
    ],
    intro: ["Public-school enrollment is not governed only by a utility bill or lease. Section 25.001 contains multiple statutory paths to admission, and federal law adds protections for students experiencing homelessness and certain other circumstances.", "Families facing a residency dispute should preserve documents and use the district's formal grievance procedure rather than relying only on informal campus conversations."],
    sections: [
      { heading: "Section 25.001 controls entitlement to admission", paragraphs: ["The statute identifies several circumstances under which a person is entitled to attend a district, including residence-based categories and specific situations involving the adult responsible for the child." ] },
      { heading: "Enrollment documentation has legal limits", paragraphs: ["Districts can require records permitted by Chapter 25, but state and federal law can restrict how identification, immigration status, homelessness, guardianship, and similar issues are handled." ] },
      { heading: "Boundary and residency disputes use district processes", paragraphs: ["TEA's district-locator guidance states that when residence is disputed, a grievance may be filed with the district by or on behalf of the student." ] },
      { heading: "A transfer is different from entitlement based on residence", paragraphs: ["A student who is not entitled to admission based on Section 25.001 may still seek an interdistrict transfer under Section 25.036 or another specific transfer program, subject to the receiving district's lawful policies." ] },
    ],
    faq: [
      { q: "Is residence the only way to qualify for Texas public-school admission?", a: "No. Section 25.001 contains several qualifying circumstances in addition to the most common residence-based rule." },
      { q: "Who decides a disputed district-boundary enrollment question?", a: "The district applies the statutory admission rules and its grievance process; TEA advises using that grievance process when residency is disputed." },
      { q: "Is an interdistrict transfer the same as being legally entitled to enroll?", a: "No. A transfer under Section 25.036 is a separate mechanism from entitlement to admission under Section 25.001." },
    ],
    sources: [
      { label: "Texas Education Code § 25.001", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.25.htm" },
      { label: "Texas Education Agency — School District Locator FAQ", url: "https://tea.texas.gov/families-and-students/school-district-locator/school-district-locator-faq" },
    ],
    related: [
      { label: "Texas school transfers", href: "/guides/texas-school-transfer-law" },
      { label: "Texas compulsory attendance", href: "/guides/texas-compulsory-school-attendance-law" },
      { label: "Texas homeschool law", href: "/guides/texas-homeschool-law" },
    ],
  },

  "texas-parent-access-student-records-law": {
    ...common,
    slug: "texas-parent-access-student-records-law",
    title: "Texas Parent Access to Student Records: Education Code and FERPA Rights",
    dek: "How Texas parental-access rights interact with FERPA, including access to attendance, test, grade, disciplinary and other education records and the limits created by confidentiality laws.",
    keyTakeaways: [
      "Texas Education Code Chapter 26 gives a parent access rights to records concerning the parent's child, subject to applicable confidentiality laws.",
      "The Family Educational Rights and Privacy Act (FERPA) separately gives eligible parents and students federal rights to inspect and review education records maintained by covered schools.",
      "A school may protect information about other students and records that fall outside the applicable definition of education records or within a legal exception.",
      "Texas transfer law requires specified student records, including disciplinary records and threat-assessment information, to follow a student to a new district as provided by law.",
    ],
    intro: ["Parents often need records to understand grades, attendance, discipline, special services, or a school dispute. Texas law and FERPA overlap, so the strongest request identifies the student and records sought rather than demanding unrestricted access to every school document.", "When a record contains information about multiple students, privacy rules can require redaction or limit access to the portion directly related to the requesting parent's child."],
    sections: [
      { heading: "Chapter 26 creates a Texas parental-access right", paragraphs: ["Education Code Section 26.004 gives parents access to records concerning their child, including categories identified by the statute, subject to law." ] },
      { heading: "FERPA provides a parallel federal framework", paragraphs: ["FERPA applies to education records maintained by covered educational agencies and institutions and establishes inspection, amendment-request, and disclosure protections." ] },
      { heading: "Access is not unlimited access to other students' information", paragraphs: ["Schools must also comply with confidentiality protections. Records involving multiple students can require separation or redaction of information that does not concern the requesting parent's child." ] },
      { heading: "Records follow students when they transfer", paragraphs: ["Texas law requires districts to transfer specified student records. TEA has explained that current transfer requirements include the student's discipline record and certain threat-assessment information." ] },
    ],
    faq: [
      { q: "Can a Texas parent request school records about their child?", a: "Yes. Chapter 26 and FERPA provide overlapping access rights, subject to statutory exceptions and confidentiality protections." },
      { q: "Can a parent automatically see another student's information because it appears in the same report?", a: "Not necessarily. The school must protect information that belongs to other students under applicable privacy law." },
      { q: "Do discipline records transfer when a student changes districts?", a: "Texas law requires specified discipline records to be transferred, and TEA updated its transfer system to implement those requirements." },
    ],
    sources: [
      { label: "Texas Education Code Chapter 26", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.26.htm" },
      { label: "U.S. Department of Education — FERPA", url: "https://studentprivacy.ed.gov/ferpa" },
      { label: "Texas Education Agency — HB 3 Transfer of Student Records", url: "https://tea.texas.gov/taa-letters/house-bill-3-transfer-student-records" },
    ],
    related: [
      { label: "Texas instructional-material access", href: "/guides/texas-parent-access-instructional-materials-law" },
      { label: "Texas parental rights in public schools", href: "/guides/texas-public-school-parental-rights-law" },
      { label: "Texas school enrollment", href: "/guides/texas-public-school-enrollment-residency-law" },
    ],
  },

  "texas-parent-access-instructional-materials-law": {
    ...common,
    slug: "texas-parent-access-instructional-materials-law",
    title: "Texas Parent Access to Instructional Materials: Curriculum, Teaching Materials and Reviews",
    dek: "Texas parental rights to review instructional materials, including Chapter 26 access rights and the transparency framework created by HB 1605 for classroom and state-approved materials.",
    keyTakeaways: [
      "Texas Education Code Chapter 26 gives parents rights to review teaching materials, instructional materials, and certain tests used with their child, subject to statutory procedures and exceptions.",
      "HB 1605 expanded Texas instructional-material transparency and requires local school systems to maintain processes for classroom instructional-material review.",
      "Publishers of instructional materials approved through the state review process are subject to online-access and transparency requirements described by TEA.",
      "A parent's access right is not the same as a unilateral right to dictate every curriculum decision; districts and the State Board of Education retain statutory curriculum and adoption responsibilities.",
    ],
    intro: ["Texas has increasingly formalized parent access to classroom materials. Chapter 26 provides longstanding parental rights, while HB 1605 created newer review and transparency mechanisms around instructional materials.", "A useful records or materials request should identify the course, teacher, unit, title, or material sought and invoke the applicable district review procedure."],
    sections: [
      { heading: "Chapter 26 protects access to teaching materials", paragraphs: ["Education Code Chapter 26 gives parents rights to review teaching materials, instructional materials, and certain tests associated with their child, within the statute's procedures." ] },
      { heading: "HB 1605 added a classroom review framework", paragraphs: ["TEA explains that HB 1605 requires local school systems to establish a classroom instructional-material review process and supports parent transparency." ] },
      { heading: "State-approved materials have additional transparency rules", paragraphs: ["TEA states that publishers of materials approved through the Instructional Materials Review and Approval process must make qualifying textbooks available online to parents." ] },
      { heading: "Access and curriculum control are different rights", paragraphs: ["The right to inspect or review material does not eliminate the statutory roles of local boards, educators, TEA, and the State Board of Education in curriculum and instructional-material decisions." ] },
    ],
    faq: [
      { q: "Can a Texas parent ask to review classroom instructional materials?", a: "Yes. Chapter 26 provides parental review rights, and HB 1605 added local instructional-material review requirements." },
      { q: "Are state-approved textbooks supposed to be accessible online to parents?", a: "TEA states that HB 1605 requires publishers of IMRA-approved textbooks to provide online parent access." },
      { q: "Does access to materials let a parent personally set the district curriculum?", a: "No. Access rights coexist with state and local curriculum and adoption authority." },
    ],
    sources: [
      { label: "Texas Education Code Chapter 26", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.26.htm" },
      { label: "Texas Education Agency — HB 1605 and IMRA", url: "https://tea.texas.gov/curriculum-and-instruction/instructional-materials/house-bill-1605/house-bill-1605-and-imra" },
    ],
    related: [
      { label: "Texas parent access to student records", href: "/guides/texas-parent-access-student-records-law" },
      { label: "Texas public-school parental rights", href: "/guides/texas-public-school-parental-rights-law" },
      { label: "Texas compulsory attendance", href: "/guides/texas-compulsory-school-attendance-law" },
    ],
  },

  "texas-public-school-parental-rights-law": {
    ...common,
    slug: "texas-public-school-parental-rights-law",
    title: "Texas Public-School Parental Rights: Education Code Chapter 26",
    dek: "A practical overview of Texas Education Code Chapter 26, including parent access to records and materials, participation rights, notice and consent provisions, and the limits of those rights.",
    keyTakeaways: [
      "Texas Education Code Chapter 26 declares that parents are partners with educators and administrators in their child's education and protects specific statutory rights.",
      "Chapter 26 includes rights involving access to records and teaching materials, certain consent and notice matters, board participation, and requests concerning the child's educational environment.",
      "Parental rights are specific statutory rights, not an unlimited veto over every school decision; other state and federal laws can create duties or exceptions.",
      "School districts must adopt procedures that allow parents to exercise Chapter 26 rights without unlawfully restricting those rights.",
    ],
    intro: ["Texas parental-rights disputes are easiest to evaluate by identifying the exact Chapter 26 provision involved. The chapter covers many different subjects, and the remedy or procedure can vary depending on the right asserted.", "The chapter should be read together with special-education law, FERPA, student-discipline law, health and safety requirements, and district grievance policies when those subjects overlap."],
    sections: [
      { heading: "Chapter 26 treats parents as education partners", paragraphs: ["The chapter's policy language recognizes a parent's role while preserving the statutory responsibilities assigned to districts, educators, and state education authorities." ] },
      { heading: "Access rights are a major part of the chapter", paragraphs: ["Parents have specific rights involving student records, teaching materials, and other school information. Those rights are implemented through the particular sections of Chapter 26." ] },
      { heading: "Some decisions require notice, consent, or an opportunity to participate", paragraphs: ["Chapter 26 and other Education Code provisions identify situations in which schools must provide notice, obtain consent, or allow parent participation. The exact rule depends on the activity involved." ] },
      { heading: "District grievance procedures remain important", paragraphs: ["When a parent believes a statutory right has been denied, written requests and the district's grievance process can preserve the issue and create a record for any further administrative review." ] },
    ],
    faq: [
      { q: "Does Chapter 26 give Texas parents rights in public schools?", a: "Yes. It protects multiple specific rights involving information, records, materials, participation, and certain decisions." },
      { q: "Can a parent use Chapter 26 to override every school rule?", a: "No. The rights are statutory and specific; other laws and lawful district authority still apply." },
      { q: "What should a parent do if a school denies a Chapter 26 request?", a: "Use a written request identifying the specific right and follow the district's grievance procedure when appropriate." },
    ],
    sources: [
      { label: "Texas Education Code Chapter 26", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.26.htm" },
      { label: "Texas Education Agency — Parents and Families", url: "https://tea.texas.gov/texas-schools/health-safety-discipline/parental-rights-and-responsibilities" },
    ],
    related: [
      { label: "Texas parent access to student records", href: "/guides/texas-parent-access-student-records-law" },
      { label: "Texas parent access to instructional materials", href: "/guides/texas-parent-access-instructional-materials-law" },
      { label: "Texas school transfer law", href: "/guides/texas-school-transfer-law" },
    ],
  },

  "texas-school-transfer-law": {
    ...common,
    slug: "texas-school-transfer-law",
    title: "Texas School Transfer Law: Interdistrict Agreements and Public Education Grants",
    dek: "How Texas families can seek public-school transfers outside their home district, including Education Code Section 25.036 agreements, receiving-district discretion, tuition limits, PEG transfers, and record transfer requirements.",
    keyTakeaways: [
      "Texas Education Code Section 25.036 allows a student to transfer annually from the district of residence to another district by agreement of the affected districts or under the receiving district's transfer process.",
      "A general Section 25.036 transfer is not an unconditional statewide open-enrollment entitlement; the receiving district applies lawful transfer policies.",
      "Section 25.038 limits tuition that may be charged for certain transfers.",
      "Separate programs, including the Public Education Grant program, create additional transfer opportunities for qualifying students and campuses.",
    ],
    intro: ["Texas does not have a single universal transfer rule. General interdistrict transfers, PEG transfers, special-program transfers, safety-related transfers, and transfers involving military or foster students can operate under different statutes.", "Families should identify which transfer authority applies before assuming a district's ordinary transfer deadline or criteria control."],
    sections: [
      { heading: "Section 25.036 is the general interdistrict-transfer statute", paragraphs: ["TEA explains that a parent may make a transfer agreement with another district under Section 25.036, subject to the receiving district's lawful acceptance process." ] },
      { heading: "The receiving district can accept or reject many transfer applications", paragraphs: ["Unlike entitlement to admission based on residence, an ordinary transfer application can be subject to district policy, capacity, deadlines, and other lawful criteria." ] },
      { heading: "Tuition is limited by statute", paragraphs: ["Education Code Section 25.038 limits tuition that a district may charge in covered transfer circumstances." ] },
      { heading: "PEG is a separate statutory transfer route", paragraphs: ["TEA's Public Education Grant program permits qualifying students assigned to listed campuses to seek intradistrict or interdistrict transfers under Chapter 29, Subchapter G, with specific nondiscrimination rules for receiving districts." ] },
    ],
    faq: [
      { q: "Can any Texas student automatically transfer to any district?", a: "No. General interdistrict transfers depend on the applicable statute and receiving district's lawful policies; special transfer statutes can create different rights." },
      { q: "Can a receiving district ever charge tuition?", a: "Yes in some circumstances, but Section 25.038 limits the amount for covered transfers." },
      { q: "What is a PEG transfer?", a: "The Public Education Grant program provides transfer options for qualifying students assigned to campuses on the state's PEG list." },
    ],
    sources: [
      { label: "Texas Education Code §§ 25.036–25.038", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.25.htm" },
      { label: "Texas Education Agency — School District Locator FAQ", url: "https://tea.texas.gov/families-and-students/school-district-locator/school-district-locator-faq" },
      { label: "Texas Education Agency — Public Education Grant information", url: "https://tea.texas.gov/about-tea/news-and-multimedia/correspondence/taa-letters/final-2024-2025-accountability-ratings-2025-federal-report-cards-2026-27-peg-list-available" },
    ],
    related: [
      { label: "Texas public-school enrollment", href: "/guides/texas-public-school-enrollment-residency-law" },
      { label: "Texas compulsory attendance", href: "/guides/texas-compulsory-school-attendance-law" },
      { label: "Texas student records", href: "/guides/texas-parent-access-student-records-law" },
    ],
  },

  "texas-school-suspension-law": {
    ...common,
    slug: "texas-school-suspension-law",
    title: "Texas School Suspension Law After HB 6: In-School and Out-of-School Suspension",
    dek: "Current Texas suspension rules after the 2025 HB 6 discipline changes, including the three-school-day cap on out-of-school suspension, in-school suspension reviews and services, younger students, homelessness protections, and parent notice.",
    keyTakeaways: [
      "HB 6 amended Education Code Section 37.005 beginning with the 2025–26 school year and now expressly distinguishes in-school from out-of-school suspension.",
      "An out-of-school suspension under Section 37.005 may not exceed three school days.",
      "HB 6 provides that in-school suspension is not subject to that three-day limit, but the principal or appropriate administrator must review it at least once every 10 school days and document continuation when appropriate.",
      "Students in in-school suspension must receive appropriate behavioral supports and comparable educational services; special-education students must continue receiving required IEP services and access to the general curriculum.",
    ],
    intro: ["Texas suspension law materially changed for the 2025–26 school year. Older summaries that simply say a suspension cannot exceed three days are incomplete because HB 6 now distinguishes out-of-school suspension from in-school suspension.", "District student codes of conduct still determine which local violations are suspension-eligible within the statutory framework."],
    sections: [
      { heading: "The three-day limit applies to out-of-school suspension", paragraphs: ["HB 6 amended Section 37.005 to state that an out-of-school suspension may not exceed three school days." ] },
      { heading: "In-school suspension can last longer but requires review", paragraphs: ["HB 6 provides no fixed statutory time cap for in-school suspension, while requiring an administrator to review the placement at least every 10 school days and document a decision to continue it." ] },
      { heading: "Educational and behavioral services continue", paragraphs: ["A school must provide appropriate behavioral support and comparable educational services during in-school suspension, with additional protections for students receiving special-education services." ] },
      { heading: "Young and homeless students have additional protections", paragraphs: ["Section 37.005 restricts out-of-school suspension for students below grade three and for students who are homeless, subject to specified serious-conduct exceptions." ] },
    ],
    faq: [
      { q: "Can a Texas out-of-school suspension exceed three school days?", a: "Section 37.005 says an out-of-school suspension under that section may not exceed three school days." },
      { q: "Is in-school suspension also capped at three days?", a: "No. HB 6 expressly says in-school suspension is not subject to a time limit, but it requires periodic review and educational services." },
      { q: "Did this rule change in 2025?", a: "Yes. HB 6 applies beginning with the 2025–26 school year and materially revised Section 37.005." },
    ],
    sources: [
      { label: "Texas Education Code Chapter 37", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.37.htm" },
      { label: "Texas Legislature — HB 6, 89th Legislature, enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00006F.HTM" },
    ],
    related: [
      { label: "Texas DAEP placement law", href: "/guides/texas-daep-placement-law" },
      { label: "Texas school expulsion law", href: "/guides/texas-school-expulsion-law" },
      { label: "Texas parental rights", href: "/guides/texas-public-school-parental-rights-law" },
    ],
  },

  "texas-daep-placement-law": {
    ...common,
    slug: "texas-daep-placement-law",
    title: "Texas DAEP Placement Law: Disciplinary Alternative Education Programs After HB 6",
    dek: "When Texas students can or must be placed in a disciplinary alternative education program, the conference and notice process, HB 6's 2025 changes, placement length, reviews, and parent participation.",
    keyTakeaways: [
      "Education Code Section 37.006 identifies conduct that requires or permits removal to a disciplinary alternative education program (DAEP), and HB 6 expanded and revised several triggers beginning with the 2025–26 school year.",
      "Before a DAEP placement, Section 37.009 requires a conference process that gives the student notice of the reasons, an explanation of the basis, and an opportunity to respond.",
      "The administrator must consider statutory factors such as self-defense, intent, disciplinary history, qualifying disability, foster-care status, and homelessness when making covered discipline decisions.",
      "If a DAEP placement extends beyond 60 days or the end of the next grading period, whichever is earlier, the parent or guardian is entitled to notice and an opportunity to participate in the proceeding required by Section 37.009.",
    ],
    intro: ["DAEP is a formal disciplinary placement, not simply detention or in-school suspension. State law controls mandatory and discretionary triggers, while each district's student code of conduct supplies additional local detail within those boundaries.", "HB 6 changed significant parts of Chapter 37 for the 2025–26 school year, so current decisions should not rely on older DAEP charts."],
    sections: [
      { heading: "Section 37.006 defines mandatory and discretionary placement", paragraphs: ["The statute lists conduct that requires DAEP placement and circumstances in which placement may be ordered. HB 6 amended the list, including rules concerning certain harassment, disruption, and e-cigarette conduct." ] },
      { heading: "A conference precedes the placement order", paragraphs: ["Section 37.009 gives the student notice of the reasons and basis for removal and an opportunity to respond at the required conference." ] },
      { heading: "The decision must consider statutory factors", paragraphs: ["For covered discipline decisions, Chapter 37 requires consideration of self-defense, intent, disciplinary history, specified disability, DFPS conservatorship, and homelessness." ] },
      { heading: "Longer placements create additional parent-participation rights", paragraphs: ["When a placement extends beyond 60 days or the end of the next grading period, whichever is earlier, the statute provides a parent or guardian notice and an opportunity to participate in a board or board-designee proceeding." ] },
    ],
    faq: [
      { q: "Is every DAEP placement discretionary?", a: "No. Section 37.006 contains both mandatory and discretionary placement provisions." },
      { q: "Does a student get a chance to respond before placement?", a: "Section 37.009 provides a conference process with notice, an explanation of the basis, and an opportunity to respond." },
      { q: "Did HB 6 change DAEP law?", a: "Yes. HB 6 amended multiple Chapter 37 provisions beginning with the 2025–26 school year." },
    ],
    sources: [
      { label: "Texas Education Code Chapter 37", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.37.htm" },
      { label: "Texas Legislature — HB 6, 89th Legislature, enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00006F.HTM" },
    ],
    related: [
      { label: "Texas school suspension law", href: "/guides/texas-school-suspension-law" },
      { label: "Texas school expulsion law", href: "/guides/texas-school-expulsion-law" },
      { label: "Texas student-record access", href: "/guides/texas-parent-access-student-records-law" },
    ],
  },

  "texas-school-expulsion-law": {
    ...common,
    slug: "texas-school-expulsion-law",
    title: "Texas School Expulsion Law: Mandatory, Discretionary and Due-Process Rules",
    dek: "Texas public-school expulsion law under Education Code Chapter 37, including mandatory and discretionary grounds, the hearing requirement, parent participation, statutory factors, appeals, and the 2025 HB 6 changes.",
    keyTakeaways: [
      "Education Code Section 37.007 identifies conduct for which expulsion is mandatory and conduct for which expulsion is permitted.",
      "Before expulsion, Section 37.009 requires a hearing with appropriate due process and written invitation to the student's parent or guardian.",
      "At the expulsion hearing, the student may be represented by a parent, guardian, or another adult who can provide guidance and who is not a district employee.",
      "HB 6 revised Chapter 37 beginning with the 2025–26 school year, so current expulsion decisions should be checked against the amended statute and enrolled bill rather than older discipline summaries.",
    ],
    intro: ["Expulsion is one of the most serious school-discipline actions and has a more formal procedure than ordinary classroom discipline. Whether expulsion is required, permitted, or unavailable depends heavily on the exact conduct and where it occurred.", "Students receiving special-education services also have separate federal and Texas protections that can affect disciplinary changes in placement."],
    sections: [
      { heading: "Section 37.007 separates required and permitted expulsions", paragraphs: ["The statute specifies serious conduct that requires expulsion and other conduct for which a district may choose expulsion. The details should be matched to the current statute because HB 6 amended the chapter in 2025." ] },
      { heading: "Expulsion requires a due-process hearing", paragraphs: ["Section 37.009 requires the board or its designee to provide a hearing with appropriate constitutional due process and invite the parent or guardian in writing." ] },
      { heading: "The student may have an adult representative", paragraphs: ["At the hearing, the student is entitled to representation by a parent, guardian, or another adult who can provide guidance and is not employed by the district." ] },
      { heading: "Appeal rights depend on who made the decision", paragraphs: ["Section 37.009 provides an appeal to the board when a board designee orders expulsion and allows the board's final expulsion decision to be appealed by trial de novo to district court in the county where the district's central administrative office is located." ] },
    ],
    faq: [
      { q: "Does every serious school violation require expulsion?", a: "No. Section 37.007 distinguishes mandatory-expulsion conduct from conduct for which expulsion is discretionary." },
      { q: "Is a hearing required before a Texas public-school expulsion?", a: "Yes. Section 37.009 requires a hearing with appropriate due process and written invitation to the parent or guardian." },
      { q: "Can an expulsion decision be appealed?", a: "The statute provides board review of a designee's decision and further judicial review of the board's expulsion decision as specified in Section 37.009." },
    ],
    sources: [
      { label: "Texas Education Code Chapter 37", url: "https://statutes.capitol.texas.gov/Docs/ED/htm/ED.37.htm" },
      { label: "Texas Legislature — HB 6, 89th Legislature, enrolled", url: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00006F.HTM" },
    ],
    related: [
      { label: "Texas DAEP placement law", href: "/guides/texas-daep-placement-law" },
      { label: "Texas school suspension law", href: "/guides/texas-school-suspension-law" },
      { label: "Texas parent access to student records", href: "/guides/texas-parent-access-student-records-law" },
    ],
  },
};
