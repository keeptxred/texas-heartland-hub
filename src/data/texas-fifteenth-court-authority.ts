export type FifteenthCourtJustice = {
  place: string;
  name: string;
  role: string;
  appointed: string;
  background: string;
  officialUrl: string;
};

export type FifteenthCourtSource = {
  label: string;
  href: string;
};

export const FIFTEENTH_COURT_REVIEWED = "2026-09-08";

export const FIFTEENTH_COURT_QUICK_FACTS = [
  {
    value: "3",
    label: "current justices",
    text: "The inaugural court currently consists of Chief Justice Scott Brister and Justices Scott Field and April Farris.",
  },
  {
    value: "254",
    label: "counties in its district",
    text: "Unlike Texas's regional courts of appeals, the Fifteenth Court's district covers every county in Texas.",
  },
  {
    value: "Civil",
    label: "specialized appellate jurisdiction",
    text: "The court is a specialized civil appellate court. It does not exercise the ordinary criminal appellate jurisdiction of the First through Fourteenth Courts of Appeals.",
  },
  {
    value: "Austin",
    label: "seat of the court",
    text: "State law places the Fifteenth Court in Austin, while allowing it to transact business elsewhere in its statewide district when necessary and convenient.",
  },
] as const;

export const FIFTEENTH_COURT_JUSTICES: FifteenthCourtJustice[] = [
  {
    place: "Place 1",
    name: "Scott Brister",
    role: "Chief Justice",
    appointed: "Appointed as inaugural Chief Justice effective September 1, 2024",
    background: "Former justice of the Supreme Court of Texas, former chief justice and justice on Houston courts of appeals, and former Harris County district judge.",
    officialUrl: "https://www.txcourts.gov/15thcoa/about-the-court/justices/chief-justice-scott-brister/",
  },
  {
    place: "Place 2",
    name: "Scott Field",
    role: "Justice",
    appointed: "Appointed as an inaugural justice effective September 1, 2024",
    background: "Former judge of the 480th District Court in Williamson County and former justice of the Third Court of Appeals.",
    officialUrl: "https://www.txcourts.gov/15thcoa/about-the-court/justices/justice-scott-field/",
  },
  {
    place: "Place 3",
    name: "April Farris",
    role: "Justice",
    appointed: "Appointed as an inaugural justice effective September 1, 2024",
    background: "Former justice of the First Court of Appeals and former appellate litigator handling complex energy, technology and government matters.",
    officialUrl: "https://www.txcourts.gov/15thcoa/about-the-court/justices/justice-april-farris/",
  },
];

export const FIFTEENTH_COURT_JURISDICTION = [
  {
    title: "Civil cases involving Texas state government",
    text: "The court has exclusive intermediate appellate jurisdiction over specified civil matters brought by or against the State of Texas, executive-branch agencies and certain state officers or employees acting in their official capacities, subject to statutory exceptions.",
  },
  {
    title: "Certain challenges to state statutes and rules",
    text: "The statewide appellate track includes specified civil challenges to the constitutionality or validity of state statutes or rules when the statutory conditions are satisfied. The jurisdiction is defined by law rather than by the county where the case originated.",
  },
  {
    title: "Texas Business Court appeals",
    text: "Except when the Supreme Court of Texas has concurrent or exclusive jurisdiction, the Fifteenth Court has exclusive intermediate appellate jurisdiction over appeals from Business Court orders and judgments and related original proceedings.",
  },
  {
    title: "Original writs tied to its appellate jurisdiction",
    text: "The court may issue writs such as mandamus when the writ arises from a matter within the court's exclusive intermediate appellate jurisdiction. Its original-writ authority is correspondingly specialized.",
  },
] as const;

export const FIFTEENTH_COURT_LIMITS = [
  "It is not Texas's general criminal intermediate appellate court. Ordinary criminal appeals continue through the regional courts of appeals and, when applicable, the Court of Criminal Appeals.",
  "It does not absorb every private civil appeal in Texas. Ordinary civil appeals generally remain with the geographically appropriate regional court unless a statute places the matter in the Fifteenth Court's specialized jurisdiction.",
  "State-related jurisdiction is subject to exceptions written into Government Code Section 22.220(d), so the presence of a state party alone does not automatically resolve jurisdiction.",
  "Matters over which the Supreme Court of Texas has concurrent or exclusive jurisdiction remain subject to the constitutional and statutory rules governing Supreme Court review.",
] as const;

export const FIFTEENTH_COURT_PATHS = [
  {
    title: "State-related civil case",
    path: "Trial court anywhere in Texas → Fifteenth Court of Appeals → Supreme Court of Texas",
    text: "When a civil appeal fits Section 22.220(d), the statewide Fifteenth Court replaces the ordinary regional intermediate court for that appeal.",
  },
  {
    title: "Texas Business Court case",
    path: "Texas Business Court → Fifteenth Court of Appeals → Supreme Court of Texas",
    text: "The Business Court and Fifteenth Court were designed as linked specialized trial and appellate tracks for covered complex business disputes.",
  },
  {
    title: "Ordinary regional civil or criminal appeal",
    path: "Trial court → Regional Court of Appeals → Supreme Court or Court of Criminal Appeals, depending on subject matter",
    text: "If a case does not fit the Fifteenth Court's special jurisdiction, Texas's existing regional appellate structure continues to govern.",
  },
] as const;

export const FIFTEENTH_COURT_SELECTION = {
  initial: "Governor Greg Abbott appointed Scott Brister, Scott Field and April Farris as the inaugural members effective September 1, 2024. Their initial terms were set to expire December 31, 2026, or when successors are elected and qualified.",
  elections: "Article V, Section 6 of the Texas Constitution provides that courts-of-appeals justices are elected by the qualified voters of their districts for six-year terms. Because the Fifteenth Court district is statewide, its elections are statewide. The Supreme Court of Texas described the first such general election as November 2026.",
  qualifications: "Fifteenth Court justices are courts-of-appeals justices and therefore must satisfy the constitutional qualifications applicable to that office, including the qualifications prescribed for Supreme Court justices.",
} as const;

export const FIFTEENTH_COURT_EXPANSION = [
  {
    date: "September 1, 2028",
    title: "Place 4 scheduled to be created",
    text: "House Bill 16 from the 89th Legislature's second called session establishes the initial vacancy for Place 4 in the fourth year following the court's creation.",
  },
  {
    date: "September 1, 2029",
    title: "Place 5 scheduled to be created",
    text: "The same law establishes Place 5 in the fifth year following creation, bringing the statutory court to a chief justice and four associate justices after the transition.",
  },
] as const;

export const FIFTEENTH_COURT_TIMELINE = [
  {
    year: "2023",
    title: "Senate Bill 1045 creates the Fifteenth Court",
    text: "The 88th Legislature created a new statewide court of appeals with specialized civil jurisdiction, the first new Texas court of appeals since the Fourteenth Court was created in 1967.",
  },
  {
    year: "June 2024",
    title: "Governor Abbott names the inaugural three justices",
    text: "Scott Brister was appointed Chief Justice, with Scott Field and April Farris appointed to Places 2 and 3, all effective when the new court opened September 1.",
  },
  {
    year: "August 2024",
    title: "Texas Supreme Court upholds the new court",
    text: "In In re Dallas County, 697 S.W.3d 142 (Tex. 2024), the Supreme Court rejected constitutional challenges to the court's statewide district, specialized jurisdiction and initial appointment process.",
  },
  {
    year: "September 2024",
    title: "The Fifteenth Court begins operating",
    text: "The court's initial term began September 1, 2024 in Austin, and qualifying pending appeals were transferred into the new statewide appellate track.",
  },
  {
    year: "2025",
    title: "Legislature sets a five-seat expansion schedule",
    text: "House Bill 16 delayed the transition from three to five justices and scheduled Place 4 for 2028 and Place 5 for 2029. It also treated Fifteenth Court offices as statewide judicial offices for Judicial Campaign Fairness Act purposes.",
  },
  {
    year: "April 2026",
    title: "Michael A. Cruz becomes Clerk of Court",
    text: "The court appointed Michael A. Cruz as Clerk of Court effective April 1, 2026 after he had served as chief deputy clerk since the court's creation.",
  },
] as const;

export const FIFTEENTH_COURT_CONSTITUTIONAL_CASE = {
  name: "In re Dallas County, Texas and Marian Brown",
  citation: "697 S.W.3d 142 (Tex. 2024)",
  docket: "No. 24-0426",
  decided: "August 23, 2024",
  holding: "The Supreme Court of Texas held that the Fifteenth Court is a constitutional court of appeals, that Senate Bill 1045's jurisdictional structure does not violate Article V, Section 6(a), and that the inaugural appointment process complied with the Texas Constitution and applicable statutes.",
  significance: "The decision cleared the principal pre-opening constitutional challenge only days before the court began operating and confirmed that the Legislature could create a statewide court-of-appeals district with specialized civil jurisdiction.",
  officialUrl: "https://www.txcourts.gov/media/1459043/240426.pdf",
} as const;

export const FIFTEENTH_COURT_FAQS = [
  {
    question: "What is the Texas Fifteenth Court of Appeals?",
    answer: "It is a statewide Texas intermediate appellate court created in 2023 and operating since September 1, 2024. Unlike the regional courts of appeals, it has specialized civil jurisdiction defined by statute.",
  },
  {
    question: "Does the Fifteenth Court of Appeals cover all of Texas?",
    answer: "Yes. Its district contains all 254 Texas counties, but statewide geography does not mean it hears every appeal. Its jurisdiction is restricted by subject matter and statute.",
  },
  {
    question: "Who are the current Fifteenth Court justices?",
    answer: "As of this guide's September 8, 2026 review, the court lists Chief Justice Scott Brister, Justice Scott Field and Justice April Farris.",
  },
  {
    question: "Does the Fifteenth Court hear criminal appeals?",
    answer: "Not as part of the ordinary Texas criminal appellate system. Its jurisdiction is specialized and civil; criminal appeals continue through Texas's regional courts of appeals and the Court of Criminal Appeals as applicable.",
  },
  {
    question: "Where do Texas Business Court appeals go?",
    answer: "The Fifteenth Court has exclusive intermediate appellate jurisdiction over Business Court orders, judgments and related original proceedings except where the Supreme Court of Texas has concurrent or exclusive jurisdiction.",
  },
  {
    question: "Are Fifteenth Court justices elected statewide?",
    answer: "After the inaugural appointments, yes. The Texas Constitution elects courts-of-appeals justices by the voters of their districts, and the Fifteenth Court district is statewide. The Supreme Court identified November 2026 as the first statewide general election for these offices.",
  },
  {
    question: "How many justices will the Fifteenth Court have?",
    answer: "It currently has three. Under the 2025 House Bill 16 transition schedule, Place 4 is to be created in 2028 and Place 5 in 2029, producing a five-member court after the transition.",
  },
  {
    question: "Was the Fifteenth Court's constitutionality challenged?",
    answer: "Yes. In In re Dallas County in August 2024, the Supreme Court of Texas rejected challenges to the court's statewide reach, specialized jurisdiction and inaugural appointment process.",
  },
];

export const FIFTEENTH_COURT_SOURCES: FifteenthCourtSource[] = [
  { label: "Texas Judicial Branch — Fifteenth Court of Appeals", href: "https://www.txcourts.gov/15thcoa/" },
  { label: "Texas Judicial Branch — Fifteenth Court justices", href: "https://www.txcourts.gov/15thcoa/about-the-court/" },
  { label: "Texas Judicial Branch — Clerk of Court", href: "https://www.txcourts.gov/15thcoa/about-the-court/clerk-of-court/" },
  { label: "Texas Judicial Branch — Courts of Appeals overview", href: "https://www.txcourts.gov/about-texas-courts/courts-of-appeals.aspx" },
  { label: "Texas Government Code — Chapter 22", href: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.22.htm" },
  { label: "Texas Government Code — Chapter 73", href: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.73.htm" },
  { label: "Texas Constitution — Article V", href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm" },
  { label: "Governor Abbott — inaugural Fifteenth Court appointments", href: "https://gov.texas.gov/news/post/governor-abbott-appoints-inaugural-members-to-fifteenth-court-of-appeals" },
  { label: "88th Legislature — Senate Bill 1045 enrolled text", href: "https://capitol.texas.gov/tlodocs/88R/billtext/html/SB01045F.htm" },
  { label: "89th Legislature, 2nd Called Session — House Bill 16 enrolled text", href: "https://capitol.texas.gov/tlodocs/892/billtext/html/HB00016F.htm" },
  { label: "Supreme Court of Texas — In re Dallas County opinion", href: "https://www.txcourts.gov/media/1459043/240426.pdf" },
  { label: "Texas Business Court", href: "https://www.txcourts.gov/businesscourt/" },
] as const;
