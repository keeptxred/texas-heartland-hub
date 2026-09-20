export type TexasBusinessCourtDivision = {
  number: number;
  name: string;
  location: string;
  judges: string[];
  officialUrl: string;
};

export type TexasBusinessCourtSource = {
  label: string;
  href: string;
};

export const TEXAS_BUSINESS_COURT_REVIEWED = "2026-09-08";

export const TEXAS_BUSINESS_COURT_QUICK_FACTS = [
  {
    value: "11",
    label: "statutory divisions",
    text: "The Business Court is organized into eleven geographic divisions tied to Texas's administrative judicial regions.",
  },
  {
    value: "5",
    label: "operational divisions",
    text: "The Texas Judicial Branch currently lists the First, Third, Fourth, Eighth and Eleventh Divisions as operational.",
  },
  {
    value: "10",
    label: "current judges",
    text: "Each currently operational division has two judges listed by the Texas Judicial Branch.",
  },
  {
    value: "$5M",
    label: "major jurisdiction threshold",
    text: "Current law uses a $5 million amount-in-controversy threshold for major categories of organization, transaction, commercial and intellectual-property disputes, subject to statutory rules and exceptions.",
  },
] as const;

export const TEXAS_BUSINESS_COURT_ACTIVE_DIVISIONS: TexasBusinessCourtDivision[] = [
  {
    number: 1,
    name: "First Business Court Division",
    location: "Dallas / McKinney",
    judges: ["Andrea K. Bouressa", "Bill Whitehill"],
    officialUrl: "https://www.txcourts.gov/businesscourt/divisions/first/",
  },
  {
    number: 3,
    name: "Third Business Court Division",
    location: "Austin",
    judges: ["Melissa Davis Andrews", "Patrick K. Sweeten"],
    officialUrl: "https://www.txcourts.gov/businesscourt/divisions/third/",
  },
  {
    number: 4,
    name: "Fourth Business Court Division",
    location: "San Antonio",
    judges: ["Marialyn Barnard", "Stacy Sharp"],
    officialUrl: "https://www.txcourts.gov/businesscourt/divisions/fourth/",
  },
  {
    number: 8,
    name: "Eighth Business Court Division",
    location: "Fort Worth",
    judges: ["Jerry D. Bullard", "Brian Stagner"],
    officialUrl: "https://www.txcourts.gov/businesscourt/divisions/eighth/",
  },
  {
    number: 11,
    name: "Eleventh Business Court Division",
    location: "Houston",
    judges: ["Sofia Adrogué", "Grant Dorfman"],
    officialUrl: "https://www.txcourts.gov/businesscourt/divisions/eleventh/",
  },
];

export const TEXAS_BUSINESS_COURT_NONOPERATIONAL_DIVISIONS = [2, 5, 6, 7, 9, 10] as const;

export const TEXAS_BUSINESS_COURT_JURISDICTION = [
  {
    title: "Organization and internal-affairs disputes",
    threshold: "Generally over $5 million",
    text: "Section 25A.004(b) covers specified derivative, governance, governing-document, internal-affairs, securities/trade-regulation, owner/manager duty, organizational-liability and Business Organizations Code disputes when the statutory amount in controversy exceeds $5 million.",
  },
  {
    title: "Publicly traded company exception",
    threshold: "No amount minimum for the covered subsection (b) categories",
    text: "For an action that falls within the organization-related categories in Section 25A.004(b), subsection (c) provides concurrent jurisdiction regardless of the amount in controversy if a party is a publicly traded company.",
  },
  {
    title: "Qualified transactions and agreed commercial disputes",
    threshold: "Over $5 million",
    text: "Current law covers qualifying transactions and specified business, commercial or investment contract or transaction disputes when the statutory amount exceeds $5 million. The 2025 Legislature reduced this threshold from $10 million to $5 million and broadened the contract language.",
  },
  {
    title: "Finance and commerce-code disputes",
    threshold: "Over $5 million",
    text: "Specified claims under the Finance Code or Business & Commerce Code involving organizations or their officers or governing persons can qualify, subject to exclusions and special rules for financial institutions.",
  },
  {
    title: "Intellectual property and trade secrets",
    threshold: "Over $5 million",
    text: "House Bill 40 added specified disputes involving intellectual property, software, information technology, data and data security, pharmaceuticals, biotechnology, bioscience technologies and trade secrets, as well as actions under the Texas Uniform Trade Secrets Act.",
  },
  {
    title: "Arbitration-related proceedings",
    threshold: "Underlying controversy must qualify",
    text: "Current law gives the Business Court concurrent jurisdiction over specified arbitration-enforcement, arbitrator-appointment and arbitral-award proceedings when a claim in the arbitration is within the covered organization or commercial categories.",
  },
  {
    title: "Injunctive and declaratory relief",
    threshold: "Tied to an otherwise qualifying claim",
    text: "The Business Court can hear specified actions seeking injunctive or declaratory relief when the underlying dispute is one over which the court otherwise has statutory jurisdiction.",
  },
  {
    title: "Supplemental claims",
    threshold: "Agreement required",
    text: "Related claims forming part of the same case or controversy may fall within supplemental jurisdiction, but current law requires agreement of all parties to the supplemental claim and the judge before that claim proceeds in Business Court.",
  },
] as const;

export const TEXAS_BUSINESS_COURT_EXCLUSIONS = [
  "Claims arising under Chapter 74 of the Civil Practice and Remedies Code, including covered health-care-liability claims.",
  "Claims seeking monetary damages for bodily injury or death.",
  "Legal-malpractice claims.",
  "Specified consumer-transaction claims involving a Texas consumer and an alleged violation of federal or state law.",
  "Unless supplemental-jurisdiction rules apply, specified claims involving governmental entities, foreclosure on property owned by an individual, estates, family law, insurance, certain property-code matters, farm products, and duties under an insurance policy.",
] as const;

export const TEXAS_BUSINESS_COURT_CASE_PATHS = [
  {
    title: "File directly in Business Court",
    text: "A civil action within Business Court jurisdiction may be filed there initially. The pleadings must establish the statutory jurisdiction and venue/division requirements.",
  },
  {
    title: "Remove a qualifying case from district court",
    text: "A party may use the statutory and rule-based removal process for a qualifying district-court action. Business Court opinions repeatedly address timeliness and subject-matter jurisdiction in removed cases.",
  },
  {
    title: "Agreed transfer of an older case",
    text: "House Bill 40 created a limited path for certain civil actions commenced before September 1, 2024: with an agreed motion and Business Court permission under Supreme Court rules, a qualifying older action may be transferred. The special provision expires September 1, 2035.",
  },
  {
    title: "Appeal to the Fifteenth Court of Appeals",
    text: "Except where the Supreme Court has concurrent or exclusive jurisdiction, the Fifteenth Court of Appeals has exclusive intermediate appellate jurisdiction over Business Court orders and judgments and original proceedings related to Business Court actions or orders.",
  },
] as const;

export const TEXAS_BUSINESS_COURT_JUDGE_SELECTION = {
  selection: "Governor appoints with the advice and consent of the Texas Senate",
  term: "Two-year statutory terms; judges may be reappointed",
  qualifications: [
    "At least 35 years old.",
    "United States citizen.",
    "Resident of a county within the applicable Business Court division for the statutory residency period.",
    "Texas-licensed attorney with at least 10 years of qualifying complex civil business litigation, business-transaction practice, civil judicial service, or a qualifying combination.",
    "Additional license-standing restrictions apply under Chapter 25A.",
  ],
  significance: "The Business Court is a prominent exception to Texas's broader system of partisan judicial elections. Its judges reach the bench through gubernatorial appointment and Senate confirmation rather than a general-election ballot.",
} as const;

export const TEXAS_BUSINESS_COURT_2025_CHANGES = [
  {
    title: "$10 million threshold reduced to $5 million",
    text: "House Bill 40 reduced the amount-in-controversy threshold for the qualified-transaction and covered commercial categories in Section 25A.004(d), bringing that threshold into line with the $5 million threshold used for organization-related categories.",
  },
  {
    title: "Intellectual-property jurisdiction added",
    text: "The Legislature expressly added covered disputes involving software, information technology, data security, pharmaceuticals, biotechnology, bioscience technologies, trade secrets and actions under Chapter 134A of the Civil Practice and Remedies Code.",
  },
  {
    title: "Arbitration jurisdiction added",
    text: "The 2025 law added a specific route for arbitration-agreement enforcement, arbitrator appointments, arbitral-award review and related proceedings when the underlying controversy includes a qualifying Business Court claim.",
  },
  {
    title: "Consumer claims moved into an absolute exclusion",
    text: "Specified consumer-transaction claims involving a Texas consumer were placed among the claims the Business Court may not hear even through supplemental jurisdiction.",
  },
  {
    title: "The six nonoperational divisions were preserved",
    text: "House Bill 40 removed the earlier 2026 abolition/expiration language for the Second, Fifth, Sixth, Seventh, Ninth and Tenth Divisions and repealed the old statutory transition requirement that would have forced gubernatorial appointments to those divisions by September 1, 2026. The Judicial Branch currently still reports five divisions as operational.",
  },
  {
    title: "Older cases received a limited transfer path",
    text: "A new temporary provision allows certain cases commenced before September 1, 2024 to move to Business Court on an agreed motion and with court permission under Supreme Court rules. That authority expires September 1, 2035.",
  },
] as const;

export const TEXAS_BUSINESS_COURT_TIMELINE = [
  {
    year: "2023",
    title: "House Bill 19 creates the Texas Business Court",
    text: "The 88th Legislature created a specialized statewide trial court for defined complex business disputes and paired it with a new statewide appellate path through the Fifteenth Court of Appeals.",
  },
  {
    year: "2024",
    title: "The first five divisions begin operating",
    text: "The Business Court opened September 1, 2024 with two gubernatorially appointed judges in each of the First, Third, Fourth, Eighth and Eleventh Divisions.",
  },
  {
    year: "2025",
    title: "The court builds a body of published precedent",
    text: "The new court began publishing opinions addressing its own jurisdiction, removal rules, corporate governance, commercial contracts and other specialized business-law questions.",
  },
  {
    year: "2025",
    title: "House Bill 40 expands and revises the system",
    text: "The 89th Legislature lowered a major jurisdiction threshold, added intellectual-property and arbitration categories, revised supplemental jurisdiction and exclusions, preserved the nonoperational divisions, and created a transfer route for qualifying older cases.",
  },
  {
    year: "2026",
    title: "Five divisions remain operational statewide",
    text: "As of this guide's review, the Texas Judicial Branch lists five operational divisions—Dallas, Austin, San Antonio, Fort Worth and Houston—with two judges in each, while the statutory court remains organized into eleven geographic divisions.",
  },
] as const;

export const TEXAS_BUSINESS_COURT_FAQS = [
  {
    question: "What is the Texas Business Court?",
    answer: "It is a statewide specialized Texas trial court created by statute to hear defined categories of complex civil business disputes. It is not an appellate court and does not replace district courts generally.",
  },
  {
    question: "How many Texas Business Court divisions are operating?",
    answer: "The Texas Judicial Branch currently lists five operational divisions: First in the Dallas area, Third in Austin, Fourth in San Antonio, Eighth in Fort Worth and Eleventh in Houston. The statutory court is organized into eleven geographic divisions overall.",
  },
  {
    question: "Are Texas Business Court judges elected?",
    answer: "No. Business Court judges are appointed by the governor with the advice and consent of the Senate. Chapter 25A provides two-year terms and permits reappointment.",
  },
  {
    question: "Does every business lawsuit qualify for Texas Business Court?",
    answer: "No. Jurisdiction is category-specific. The case must fit Chapter 25A's subject-matter and amount-in-controversy rules or another statutory basis, and several types of claims are specifically excluded.",
  },
  {
    question: "What is the Texas Business Court's $5 million rule?",
    answer: "Current Chapter 25A uses a greater-than-$5-million amount-in-controversy threshold for important organization-related and commercial categories. Different rules apply to publicly traded-company cases and other statutory categories, so the threshold alone does not establish jurisdiction.",
  },
  {
    question: "Can the Texas Business Court hear intellectual-property or trade-secret cases?",
    answer: "Potentially. House Bill 40 added covered intellectual-property and trade-secret disputes to Section 25A.004(d), subject to the $5 million threshold and the rest of Chapter 25A's jurisdictional requirements and exclusions.",
  },
  {
    question: "Can the Texas Business Court hear personal-injury or legal-malpractice cases?",
    answer: "Chapter 25A expressly excludes claims seeking monetary damages for bodily injury or death and claims of legal malpractice. It also excludes Chapter 74 claims and specified consumer-transaction claims even when supplemental jurisdiction might otherwise be asserted.",
  },
  {
    question: "Where do Texas Business Court appeals go?",
    answer: "The Fifteenth Court of Appeals has exclusive intermediate appellate jurisdiction over Business Court appeals and related original proceedings except where the Supreme Court of Texas has concurrent or exclusive jurisdiction. Further civil review can proceed to the Supreme Court under applicable law and rules.",
  },
  {
    question: "Can a district-court case be moved to the Texas Business Court?",
    answer: "Yes, if the statutory and procedural requirements are met. Current law and rules provide removal procedures for qualifying cases and a limited agreed-transfer mechanism for certain cases commenced before September 1, 2024.",
  },
];

export const TEXAS_BUSINESS_COURT_SOURCES: TexasBusinessCourtSource[] = [
  { label: "Texas Judicial Branch — Business Court", href: "https://www.txcourts.gov/businesscourt/" },
  { label: "Texas Judicial Branch — Business Court divisions", href: "https://www.txcourts.gov/businesscourt/divisions/" },
  { label: "Texas Judicial Branch — About the Business Court judges", href: "https://www.txcourts.gov/businesscourt/about-the-court/" },
  { label: "Texas Judicial Branch — Practice Before the Court", href: "https://www.txcourts.gov/businesscourt/practice-before-the-court/" },
  { label: "Texas Judicial Branch — Business Court opinions", href: "https://www.txcourts.gov/businesscourt/opinions/" },
  { label: "Texas Government Code — Chapter 25A", href: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.25A.htm" },
  { label: "88th Legislature — House Bill 19 enrolled text", href: "https://capitol.texas.gov/tlodocs/88R/billtext/html/HB00019F.htm" },
  { label: "89th Legislature — House Bill 40 enrolled text", href: "https://capitol.texas.gov/tlodocs/89R/billtext/html/HB00040F.HTM" },
  { label: "Fifteenth Court of Appeals", href: "https://www.txcourts.gov/15thcoa/" },
  { label: "Texas Judicial Branch — Business Court jurisdiction maps", href: "https://www.txcourts.gov/judicial-directory/court-jurisdiction-maps/" },
] as const;
