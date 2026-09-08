export type TexasCourtOfAppeals = {
  number: number;
  name: string;
  location: string;
  created: string;
  jurisdiction: string;
  officialUrl: string;
  note?: string;
};

export const TEXAS_COURTS_REVIEWED = "2026-09-08";

export const TEXAS_COURTS_OF_APPEALS: TexasCourtOfAppeals[] = [
  { number: 1, name: "First Court of Appeals", location: "Houston", created: "1892", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/1stcoa/", note: "Originally located in Galveston; moved to Houston in 1892. Shares territory with the Fourteenth Court in the Houston region." },
  { number: 2, name: "Second Court of Appeals", location: "Fort Worth", created: "1892", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/2ndcoa/" },
  { number: 3, name: "Third Court of Appeals", location: "Austin", created: "1892", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/3rdcoa/" },
  { number: 4, name: "Fourth Court of Appeals", location: "San Antonio", created: "1893", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/4thcoa/" },
  { number: 5, name: "Fifth Court of Appeals", location: "Dallas", created: "1893", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/5thcoa/" },
  { number: 6, name: "Sixth Court of Appeals", location: "Texarkana", created: "1907", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/6thcoa/" },
  { number: 7, name: "Seventh Court of Appeals", location: "Amarillo", created: "1911", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/7thcoa/" },
  { number: 8, name: "Eighth Court of Appeals", location: "El Paso", created: "1911", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/8thcoa/" },
  { number: 9, name: "Ninth Court of Appeals", location: "Beaumont", created: "1915", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/9thcoa/" },
  { number: 10, name: "Tenth Court of Appeals", location: "Waco", created: "1923", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/10thcoa/" },
  { number: 11, name: "Eleventh Court of Appeals", location: "Eastland", created: "1925", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/11thcoa/" },
  { number: 12, name: "Twelfth Court of Appeals", location: "Tyler", created: "1963", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/12thcoa/" },
  { number: 13, name: "Thirteenth Court of Appeals", location: "Corpus Christi & Edinburg", created: "1963", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/13thcoa/", note: "Maintains offices in Corpus Christi and Edinburg." },
  { number: 14, name: "Fourteenth Court of Appeals", location: "Houston", created: "1967", jurisdiction: "Regional civil and criminal intermediate appeals", officialUrl: "https://www.txcourts.gov/14thcoa/", note: "Shares territory with the First Court in the Houston region." },
  { number: 15, name: "Fifteenth Court of Appeals", location: "Austin", created: "2023; operating since 2024", jurisdiction: "Statewide specialized civil intermediate appeals", officialUrl: "https://www.txcourts.gov/15thcoa/", note: "Its district comprises all Texas counties. It has specialized jurisdiction over specified state-related civil matters and appeals from the Texas Business Court. The initial court began September 1, 2024." },
];

export const TEXAS_APPELLATE_TIMELINE = [
  { year: "1876", title: "Texas creates a separate Court of Appeals", text: "The Constitution of 1876 divided appellate work between the Supreme Court and a new Court of Appeals, but Texas still did not have the modern regional intermediate courts." },
  { year: "1891", title: "Constitutional amendment authorizes Courts of Civil Appeals", text: "The judicial article was amended to create intermediate civil appellate courts and to reorganize the criminal high court as the Court of Criminal Appeals." },
  { year: "1892", title: "The first three regional courts begin", text: "Legislation created the First, Second, and Third Courts of Civil Appeals at Galveston, Fort Worth, and Austin. The First Court soon moved to Houston." },
  { year: "1893–1925", title: "The regional system expands to eleven courts", text: "San Antonio and Dallas were added in 1893, followed by Texarkana, Amarillo, El Paso, Beaumont, Waco, and Eastland as population and appellate caseloads grew." },
  { year: "1963", title: "Tyler and Corpus Christi join the appellate map", text: "The Twelfth Court at Tyler and Thirteenth Court at Corpus Christi were created as the state continued adding regional appellate capacity." },
  { year: "1967", title: "Houston receives a second intermediate court", text: "The Fourteenth Court of Civil Appeals was created in Houston, producing the overlapping First and Fourteenth Court structure that remains distinctive today." },
  { year: "1978", title: "Larger appellate courts and panel practice are authorized", text: "Constitutional and statutory changes allowed larger courts to hear cases in panels rather than requiring every justice of a larger court to sit on every appeal." },
  { year: "1981", title: "Courts of Appeals receive criminal jurisdiction", text: "Texas shifted most ordinary criminal appeals into the intermediate courts, allowing the Court of Criminal Appeals to concentrate more heavily on discretionary review while retaining special direct-review responsibilities such as death-penalty cases." },
  { year: "1985", title: "Constitutional terminology becomes Courts of Appeals", text: "The modern Court of Appeals naming and justice terminology were embedded in the constitutional structure after the earlier Courts of Civil Appeals era." },
  { year: "2023–2024", title: "Texas creates the Fifteenth Court of Appeals", text: "Senate Bill 1045 created a fifteenth district composed of every Texas county. The court began operating September 1, 2024, from Austin with specialized statewide civil jurisdiction." },
  { year: "2026", title: "The Fifteenth Court reaches its first election cycle", text: "The chief justice and Places 2 and 3 are on the 2026 ballot. Although every county lies in the Fifteenth District, Texas election guidance classifies the offices with the other court-of-appeals district offices rather than as statewide executive-style offices." },
] as const;

export const TEXAS_APPEAL_PATHS = [
  {
    title: "Ordinary civil case",
    path: "Trial court → regional Court of Appeals → Supreme Court of Texas",
    text: "Most civil appeals move first to the applicable intermediate court. Further review by the Supreme Court is generally discretionary and governed by constitutional, statutory, and appellate-rule requirements.",
  },
  {
    title: "Ordinary criminal case",
    path: "Trial court → regional Court of Appeals → Court of Criminal Appeals",
    text: "Most criminal appeals move through a regional Court of Appeals. The Court of Criminal Appeals is the state's court of last resort for criminal matters and generally exercises discretionary review after the intermediate appeal.",
  },
  {
    title: "Death-penalty case",
    path: "Trial court → Court of Criminal Appeals",
    text: "A death sentence has a special direct-review path to the Court of Criminal Appeals rather than following the ordinary regional intermediate-appellate route.",
  },
  {
    title: "Texas Business Court case",
    path: "Business Court → Fifteenth Court of Appeals → Supreme Court of Texas",
    text: "The Fifteenth Court has exclusive intermediate appellate jurisdiction over appeals from the Texas Business Court, placing those specialized civil disputes into the statewide appellate track.",
  },
  {
    title: "Specified state-related civil case",
    path: "Trial court → Fifteenth Court of Appeals → Supreme Court of Texas",
    text: "The Fifteenth Court has exclusive intermediate jurisdiction over specified civil matters involving the state, state agencies, and state officers or employees, subject to statutory exceptions.",
  },
] as const;

export const TEXAS_COURTS_QUICK_FACTS = [
  { value: "15", label: "Courts of Appeals", text: "Fourteen regional courts plus the statewide specialized Fifteenth Court." },
  { value: "83", label: "Authorized appellate justices", text: "The Texas Judicial Branch currently reports 83 authorized justices across the 15 intermediate appellate courts." },
  { value: "3", label: "Typical panel size", text: "Appeals are usually decided by three-justice panels unless a court orders en banc consideration." },
  { value: "6 years", label: "Court-of-appeals terms", text: "Chief justices and justices are elected to six-year terms under the current constitutional system." },
] as const;

export const TEXAS_COURTS_FAQS = [
  { question: "How many Courts of Appeals does Texas have?", answer: "Texas has 15 intermediate Courts of Appeals. The First through Fourteenth Courts primarily serve geographic districts and hear both civil and criminal appeals. The Fifteenth Court has a statewide district and specialized civil jurisdiction." },
  { question: "What is the difference between a Court of Appeals and the Texas Supreme Court?", answer: "A Court of Appeals is an intermediate appellate court. The Supreme Court of Texas is the state's court of last resort for civil and juvenile matters. Most civil cases reach a Court of Appeals before any request for Supreme Court review." },
  { question: "Does the Texas Supreme Court hear criminal appeals?", answer: "No. The Court of Criminal Appeals is Texas's court of last resort for criminal matters. Most ordinary criminal appeals first go through a regional Court of Appeals." },
  { question: "Are Texas Court of Appeals justices elected?", answer: "Yes. Court-of-appeals chief justices and justices are elected in partisan elections for six-year terms, with gubernatorial appointments used to fill covered vacancies. The Fifteenth Court's initial members were appointed before its first election cycle." },
  { question: "Why does Texas have both a First and Fourteenth Court of Appeals in Houston?", answer: "Houston has two overlapping intermediate appellate courts because the Fourteenth Court was created in 1967 alongside the existing First Court. Their shared-territory structure is handled through statutory and court procedures for allocating appeals." },
  { question: "What makes the Fifteenth Court of Appeals different?", answer: "Its district is composed of all Texas counties, but its jurisdiction is specialized rather than a general statewide replacement for the regional courts. It hears specified state-related civil appeals and appeals from the Texas Business Court, subject to the governing statutes and exceptions." },
  { question: "Do Courts of Appeals retry cases or hear juries?", answer: "No. Appellate courts review the trial-court record, legal arguments, and alleged legal or procedural errors. They do not conduct a new jury trial or ordinarily take new witness testimony." },
  { question: "How many justices sit on a Texas Court of Appeals case?", answer: "Appeals are usually heard by a panel of three justices. A court may order en banc consideration, in which the court's eligible justices hear the matter together." },
];

export const TEXAS_COURTS_SOURCES = [
  { href: "https://www.txcourts.gov/about-texas-courts/courts-of-appeals.aspx", label: "Texas Judicial Branch: Courts of Appeals" },
  { href: "https://www.txcourts.gov/courts/appellate-courts/", label: "Texas Judicial Branch: Appellate Courts directory" },
  { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm", label: "Texas Constitution, Article V" },
  { href: "https://statutes.capitol.texas.gov/Docs/GV/htm/GV.22.htm", label: "Texas Government Code, Chapter 22" },
  { href: "https://www.txcourts.gov/5thcoa/about-the-court/history/", label: "Fifth Court of Appeals: History of the appellate courts" },
  { href: "https://www.txcourts.gov/1stcoa/about-the-court/history/", label: "First Court of Appeals: Court history" },
  { href: "https://www.txcourts.gov/4thcoa/about-the-court/history/", label: "Fourth Court of Appeals: Court history" },
  { href: "https://www.txcourts.gov/12thcoa/about-the-court/history.aspx", label: "Twelfth Court of Appeals: Court history and appellate process" },
  { href: "https://www.txcourts.gov/13thcoa/", label: "Thirteenth Court of Appeals" },
  { href: "https://www.txcourts.gov/14thcoa/about-the-court", label: "Fourteenth Court of Appeals: History" },
  { href: "https://www.txcourts.gov/15thcoa/", label: "Fifteenth Court of Appeals" },
  { href: "https://capitol.texas.gov/tlodocs/88R/billtext/html/SB01045F.htm", label: "Texas Legislature: SB 1045 (2023), enrolled" },
  { href: "https://www.sos.state.tx.us/elections/candidates/guide/2026/judicial-office2026.shtml", label: "Texas Secretary of State: Running for a Judicial Office in 2026" },
  { href: "https://www.sos.state.tx.us/elections/laws/advisory2025-24.shtml", label: "Texas Secretary of State: 2026 ballot guidance, including Fifteenth Court" },
] as const;
