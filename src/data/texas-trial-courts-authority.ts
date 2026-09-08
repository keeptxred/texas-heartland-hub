export type TexasTrialCourtType = {
  name: string;
  level: string;
  footprint: string;
  count: string;
  jurisdiction: string;
  selection: string;
  appeal: string;
  note?: string;
};

export const TEXAS_TRIAL_COURTS_REVIEWED = "2026-09-08";

export const TEXAS_DISTRICT_COURT_COUNT_AS_OF_REVIEW = 517;

export const TEXAS_TRIAL_COURT_TYPES: TexasTrialCourtType[] = [
  {
    name: "District Courts",
    level: "State trial courts of general jurisdiction",
    footprint: "Every county is served by at least one judicial district; some districts cover multiple counties and populous counties contain many districts.",
    count: "517 active judicial districts as of September 8, 2026",
    jurisdiction: "General original jurisdiction, including felony criminal cases, divorce and many family matters, title-to-land disputes, contested elections, juvenile matters, and civil matters not assigned elsewhere. Some district courts are designated or directed to emphasize criminal, civil, family, or juvenile work.",
    selection: "Partisan district-wide election for four-year terms; covered vacancies are filled by gubernatorial appointment with Senate advice and consent.",
    appeal: "Most civil and criminal appeals go to the applicable regional Court of Appeals. Death-sentence appeals follow the constitutionally specified direct path to the Court of Criminal Appeals, and specialized statutes can create other routes.",
    note: "The Office of Court Administration's December 2025 structure chart reported 510 district courts. House Bill 16 created seven additional districts effective September 1, 2026: the 490th, 492nd, 511th, 513th, 514th, 515th, and 523rd, bringing the count to 517 on this page's review date.",
  },
  {
    name: "Texas Business Court",
    level: "State specialized trial court",
    footprint: "Eleven statutory geographic divisions; five divisions are currently operational in the Dallas, Austin, San Antonio, Fort Worth, and Houston regions.",
    count: "11 statutory divisions; 5 operational divisions with 10 judges",
    jurisdiction: "Defined categories of complex civil business disputes, including qualifying matters that overlap district-court jurisdiction. The Business Court does not replace district courts and is limited by detailed statutory thresholds, exclusions, and removal/transfer rules.",
    selection: "Governor appoints judges with advice and consent of the Senate for two-year terms under the Business Court statute.",
    appeal: "Appeals from the Business Court go to the Fifteenth Court of Appeals, then potentially to the Supreme Court of Texas.",
    note: "The Business Court is the major modern exception to Texas's broad pattern of electing trial judges.",
  },
  {
    name: "Constitutional County Courts",
    level: "County trial courts of limited jurisdiction",
    footprint: "One constitutional county court exists in each of Texas's 254 counties, presided over by the elected county judge, although judicial workload varies greatly by county.",
    count: "254 courts — one in every county",
    jurisdiction: "County-level civil, misdemeanor, probate, mental-health, guardianship, juvenile, and lower-court appellate responsibilities established by the Constitution and statutes. In larger counties, statutory courts may perform much of the judicial work otherwise associated with the constitutional county court.",
    selection: "The county judge is elected countywide in a partisan election for a four-year term; the commissioners court fills covered vacancies.",
    appeal: "Depending on the matter and local statutory structure, appeals can move to a Court of Appeals or the county court may itself hear appeals from justice and municipal courts.",
  },
  {
    name: "Statutory County Courts at Law",
    level: "County trial courts created by statute",
    footprint: "Created by the Legislature in selected counties, with jurisdiction tailored by general law and each court's enabling statute.",
    count: "262 courts in the Office of Court Administration's December 2025 structure chart",
    jurisdiction: "Generally exercise the constitutional county court's civil, criminal, original, and appellate powers, plus additional jurisdiction granted by statute. The general civil concurrent-jurisdiction ceiling was increased to $325,000 for covered cases, while individual courts can have different or broader authority.",
    selection: "Partisan countywide election for four-year terms; county commissioners courts fill covered vacancies.",
    appeal: "Appeal routes depend on the type of case and the particular court's statutory authority; many final judgments are reviewed by a Court of Appeals.",
    note: "County-court-at-law jurisdiction is unusually local. A statewide summary cannot substitute for the statute creating a particular court.",
  },
  {
    name: "Statutory Probate Courts",
    level: "County specialized trial courts",
    footprint: "Created in selected populous counties to concentrate probate-related work.",
    count: "25 courts in 12 counties in the Office of Court Administration's December 2025 structure chart",
    jurisdiction: "Primarily probate, estate, guardianship, and mental-health matters, with additional authority supplied by the Estates Code and the statute governing the particular court.",
    selection: "Partisan countywide election for four-year terms; county commissioners courts fill covered vacancies.",
    appeal: "Appeals generally proceed through the civil appellate system, subject to the governing probate and appellate statutes and rules.",
  },
  {
    name: "Justice Courts",
    level: "Local trial courts of limited jurisdiction",
    footprint: "Texas counties are divided into justice-of-the-peace precincts under constitutional population rules; precincts can have one or more justice positions as authorized by law.",
    count: "796 courts and 797 judges in the Office of Court Administration's December 2025 structure chart",
    jurisdiction: "Civil matters within the statutory limit, small claims, evictions, fine-only misdemeanor cases, and magistrate functions such as certain warrants and criminal-procedure duties.",
    selection: "Partisan precinct-wide election for four-year terms; local vacancy rules apply.",
    appeal: "Justice courts are not courts of record. Appeals are generally by trial de novo in a county-level court and, in some circumstances, a district court.",
  },
  {
    name: "Municipal Courts",
    level: "Local trial courts of limited jurisdiction",
    footprint: "Municipal courts serve incorporated cities; larger cities may operate multiple courts and the Legislature authorizes courts of record under applicable law.",
    count: "953 courts and 1,243 judges in the Office of Court Administration's December 2025 structure chart",
    jurisdiction: "Fine-only criminal misdemeanors, exclusive original jurisdiction over municipal-ordinance criminal cases, limited civil matters, and magistrate functions.",
    selection: "Most municipal judges are appointed by the city's governing body; some are elected. Terms and qualifications depend on applicable law, charter, ordinance, and court type.",
    appeal: "Most municipal courts are not courts of record, so appeals commonly proceed by trial de novo. Appeals from municipal courts of record are taken on the record to the proper county-level court.",
    note: "The OCA chart reported that 212 municipal courts identified themselves as courts of record as of August 2025.",
  },
];

export const TEXAS_COMMON_CASE_STARTS = [
  {
    matter: "Felony criminal prosecution",
    starts: "District court",
    explanation: "District courts have original jurisdiction in felony criminal matters. A death sentence has a special direct appellate path to the Court of Criminal Appeals.",
  },
  {
    matter: "Divorce or major family-law case",
    starts: "District court, or a locally authorized statutory county court",
    explanation: "District courts have divorce jurisdiction, but in some counties statutes give county courts at law concurrent family-law authority.",
  },
  {
    matter: "Class A or Class B misdemeanor",
    starts: "County-level court",
    explanation: "Constitutional and statutory county courts ordinarily handle the more serious misdemeanor tier, subject to the county's specific court structure.",
  },
  {
    matter: "Eviction or small civil claim",
    starts: "Justice court",
    explanation: "Justice courts handle evictions, small claims, and other civil matters within their statutory monetary jurisdiction.",
  },
  {
    matter: "Fine-only Class C misdemeanor",
    starts: "Justice court or municipal court",
    explanation: "Both can handle fine-only misdemeanor matters within their jurisdiction; municipal courts also have exclusive original jurisdiction over municipal-ordinance criminal cases.",
  },
  {
    matter: "Probate or guardianship",
    starts: "County-level or statutory probate court, depending on the county",
    explanation: "Texas probate jurisdiction depends heavily on local court structure. Statutory probate courts handle specialized probate work in counties where the Legislature has created them.",
  },
  {
    matter: "Qualifying complex business dispute",
    starts: "District court or Texas Business Court, depending on statutory jurisdiction",
    explanation: "The Business Court has defined concurrent and supplemental jurisdiction rather than replacing the ordinary district-court system.",
  },
] as const;

export const TEXAS_TRIAL_COURT_APPEAL_NOTES = [
  {
    title: "A trial court builds the record",
    text: "Trial courts hear witnesses, receive evidence, make rulings, and enter judgments. Appellate courts generally review what happened in that record rather than conducting a new jury trial.",
  },
  {
    title: "Most district and county-level appeals move upward",
    text: "Most appealable civil and criminal judgments from district and county-level courts proceed to a Court of Appeals. Civil matters can ultimately reach the Supreme Court of Texas; criminal matters can ultimately reach the Court of Criminal Appeals.",
  },
  {
    title: "Justice and municipal appeals can be different",
    text: "Justice courts and most municipal courts are not courts of record, so their appeals commonly proceed by trial de novo — a new trial at the county level. Municipal courts of record use record-based appellate review instead.",
  },
  {
    title: "Specialized courts can have specialized paths",
    text: "Business Court appeals go to the Fifteenth Court of Appeals. Death-sentence review bypasses the regional intermediate courts and goes directly to the Court of Criminal Appeals.",
  },
] as const;

export const TEXAS_TRIAL_COURT_2026_CHANGES = [
  {
    date: "September 1, 2026",
    title: "Seven additional district courts take effect",
    text: "House Bill 16 created the 490th Judicial District in Brazoria County, the 492nd in Colorado and Lavaca counties, the 511th in Comal County, the 513th through 515th in Harris County, and the 523rd in Montgomery County on September 1, 2026.",
  },
  {
    date: "October 1, 2026",
    title: "Two more Harris County district courts are scheduled",
    text: "The same enacted legislation creates the 516th and 517th Judicial Districts in Harris County on October 1, 2026, each directed to give preference to civil cases.",
  },
  {
    date: "Current 2026 directory",
    title: "Use the Judicial Directory for live judge and court contacts",
    text: "The Texas Judicial Branch's Judicial Directory was updated July 20, 2026 and says its published directory information is current as of April 2026 unless otherwise noted, while its live database provides more current court-level records.",
  },
] as const;

export const TEXAS_TRIAL_COURTS_FAQS = [
  {
    question: "How many types of trial courts does Texas have?",
    answer: "The Texas Judicial Branch identifies seven types: district courts, the Texas Business Court, constitutional county courts, statutory county courts at law, statutory probate courts, justice of the peace courts, and municipal courts.",
  },
  {
    question: "How many district courts does Texas have in September 2026?",
    answer: "The Office of Court Administration reported 510 district courts in December 2025. House Bill 16 created seven additional judicial districts effective September 1, 2026, bringing the statutory active count to 517 as of September 8, 2026. Two more Harris County districts are scheduled to be created October 1, 2026.",
  },
  {
    question: "What is the difference between a district court and a county court in Texas?",
    answer: "District courts are state trial courts of general jurisdiction and handle matters such as felonies, divorce, land-title disputes, and broad civil litigation. County-level courts have more limited or locally tailored jurisdiction, including misdemeanors, probate, lower-court appeals, and civil matters assigned by the Constitution or statute.",
  },
  {
    question: "Is a Texas county judge always acting as a judge in court?",
    answer: "No. The constitutional county judge presides over the county's constitutional county court but also presides over the commissioners court and has major county-government responsibilities. In populous counties, statutory courts often perform much of the county-level judicial workload.",
  },
  {
    question: "Where does a Texas eviction case start?",
    answer: "Eviction cases generally begin in justice court. The precise precinct and procedures depend on the property location and governing rules.",
  },
  {
    question: "Are Texas justice courts and municipal courts courts of record?",
    answer: "Justice courts and most municipal courts are not courts of record. Their appeals commonly proceed by trial de novo. Municipal courts designated as courts of record use record-based appellate review.",
  },
  {
    question: "Are all Texas trial judges elected?",
    answer: "No. District, constitutional county, statutory county, statutory probate, and justice-court judges are generally elected in partisan elections. Business Court judges are appointed by the governor with Senate confirmation, and most municipal judges are appointed by city governing bodies, although municipal selection varies.",
  },
];

export const TEXAS_TRIAL_COURTS_SOURCES = [
  { href: "https://www.txcourts.gov/about-texas-courts/trial-courts/", label: "Texas Judicial Branch: Trial Courts" },
  { href: "https://www.txcourts.gov/about-texas-courts/juror-information/basics-of-the-texas-judicial-system/", label: "Texas Judicial Branch: Basics of the Texas Judicial System" },
  { href: "https://www.txcourts.gov/media/1461638/court-structure-chart-dec-2025.pdf", label: "Office of Court Administration: Court Structure of Texas, December 2025" },
  { href: "https://www.txcourts.gov/judicial-directory/", label: "Texas Judicial Branch: Judicial Directory" },
  { href: "https://www.txcourts.gov/judicial-directory/court-jurisdiction-maps/", label: "Texas Judicial Branch: Court Jurisdiction Maps" },
  { href: "https://www.txcourts.gov/businesscourt/", label: "Texas Judicial Branch: Texas Business Court" },
  { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm", label: "Texas Constitution, Article V" },
  { href: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.24.htm", label: "Texas Government Code, Chapter 24: District Courts" },
  { href: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.25.htm", label: "Texas Government Code, Chapter 25: Statutory County Courts" },
  { href: "https://capitol.texas.gov/tlodocs/892/billtext/html/HB00016F.htm", label: "89th Legislature, Second Called Session: HB 16 enrolled text" },
] as const;
