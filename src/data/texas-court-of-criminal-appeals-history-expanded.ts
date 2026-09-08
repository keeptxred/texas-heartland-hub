export type CcaRosterEntry = {
  name: string;
  service: string;
  selection?: string;
  note?: string;
};

export const CCA_REVIEWED = "2026-09-08";

export const CURRENT_CCA_JUDGES: CcaRosterEntry[] = [
  {
    name: "David J. Schenck",
    service: "Presiding Judge · Place 1 · January 2025–present",
    selection: "Elected statewide in 2024 and took office as presiding judge in 2025.",
    note: "Previously served on Dallas's Fifth Court of Appeals and chaired the Texas State Commission on Judicial Conduct.",
  },
  {
    name: "Mary Lou Keel",
    service: "Judge · Place 2 · January 2017–present",
    selection: "Elected statewide in 2016.",
    note: "Previously served for more than two decades as judge of the 232nd District Court in Harris County.",
  },
  {
    name: "Bert Richardson",
    service: "Judge · Place 3 · January 2015–present",
    selection: "Elected statewide in 2014 and reelected in 2020.",
    note: "Previously served as a state district judge and as a state and federal prosecutor.",
  },
  {
    name: "Kevin P. Yeary",
    service: "Judge · Place 4 · January 2015–present",
    selection: "Elected statewide in 2014.",
    note: "Previously practiced criminal appellate law as both a defense attorney and prosecutor.",
  },
  {
    name: "R. Scott Walker",
    service: "Judge · Place 5 · January 2017–present",
    selection: "Elected statewide in 2016.",
    note: "Previously practiced criminal litigation and appellate advocacy.",
  },
  {
    name: "Jesse F. McClure III",
    service: "Judge · Place 6 · January 2021–present",
    selection: "Appointed to the Court in 2020 and later elected statewide.",
    note: "Previously served as judge of the 339th District Court in Harris County and as a prosecutor.",
  },
  {
    name: "Gina G. Parker",
    service: "Judge · Place 7 · January 2025–present",
    selection: "Elected statewide in 2024.",
    note: "Previously practiced as both a prosecutor and criminal-defense attorney and served on the Texas Department of Licensing and Regulation.",
  },
  {
    name: "Lee Finley",
    service: "Judge · Place 8 · January 2025–present",
    selection: "Elected statewide in 2024.",
    note: "A Marine veteran who practiced state and federal criminal defense before joining the Court.",
  },
  {
    name: "David Newell",
    service: "Judge · Place 9 · January 2015–present",
    selection: "Elected statewide in 2014.",
    note: "Previously served as an appellate prosecutor in Fort Bend and Harris counties.",
  },
];

export const CCA_TIMELINE = [
  {
    year: "1876",
    title: "Texas creates a separate Court of Appeals",
    text: "The Constitution of 1876 creates a three-judge Court of Appeals with exclusive criminal appellate jurisdiction plus some county-court civil appeals, removing criminal appellate jurisdiction from the Supreme Court.",
  },
  {
    year: "1891–1892",
    title: "The Court of Criminal Appeals takes its modern identity",
    text: "Voters approve a judicial amendment in 1891; Gov. Jim Hogg proclaims it part of the constitution on September 22. The reorganized system begins operating in 1892 with James Mann Hurt as the first presiding judge under the Court of Criminal Appeals name.",
  },
  {
    year: "1925",
    title: "A Commission of Appeals is added",
    text: "The Legislature creates a two-member commission to help the three-judge criminal high court handle a growing docket.",
  },
  {
    year: "1966–1967",
    title: "The Court expands from three judges to five",
    text: "A constitutional amendment converts the two commissioner positions into judgeships, extends the Court's session, and sets up direct election of the presiding judge.",
  },
  {
    year: "1970–1971",
    title: "John F. Onion Jr. becomes the first elected presiding judge",
    text: "Voters choose Onion as presiding judge in 1970; he takes office in 1971 and later leads the Court through its expansion and jurisdictional overhaul.",
  },
  {
    year: "1977–1978",
    title: "The modern nine-member Court is created",
    text: "A constitutional amendment expands the Court to one presiding judge and eight judges and permits three-judge panels in noncapital cases.",
  },
  {
    year: "1980–1981",
    title: "Intermediate courts begin hearing criminal appeals",
    text: "Texas expands the courts of appeals into criminal cases. The CCA shifts toward discretionary review while retaining direct review of death-penalty cases and core habeas responsibilities.",
  },
  {
    year: "1985–1986",
    title: "Rulemaking authority expands",
    text: "The Court receives rulemaking authority for criminal evidence and appellate procedure and participates in the development of statewide appellate rules.",
  },
  {
    year: "1990",
    title: "Morris L. Overstreet wins statewide office",
    text: "Overstreet is elected to the CCA, becoming the first Black person elected to statewide office in Texas.",
  },
  {
    year: "1994",
    title: "Sharon Keller becomes the first woman elected to the CCA",
    text: "Keller wins a statewide Court seat and later becomes presiding judge in 2001 after winning the 2000 election.",
  },
  {
    year: "2025",
    title: "A new presiding judge and two new judges take office",
    text: "David Schenck becomes presiding judge and Gina Parker and Lee Finley join the Court after the 2024 statewide elections.",
  },
] as const;

export const CCA_LANDMARK_CASES = [
  {
    year: "1966",
    name: "Ruby v. State",
    significance: "The Court reversed Jack Ruby's murder conviction, concluding that an oral confession had been improperly admitted and that the trial court should have granted a change of venue. Ruby died before a retrial.",
  },
  {
    year: "1988",
    name: "Johnson v. State",
    significance: "The Court reversed Gregory Lee Johnson's conviction for burning an American flag during the 1984 Republican National Convention, holding that the conviction violated free-speech protections. The U.S. Supreme Court affirmed in Texas v. Johnson in 1989.",
  },
  {
    year: "1996",
    name: "Ex parte Elizondo",
    significance: "The Court recognized a freestanding actual-innocence claim in Texas post-conviction habeas practice and established a demanding clear-and-convincing-evidence standard for that form of relief.",
  },
  {
    year: "2013",
    name: "Ex parte Lo",
    significance: "The Court struck down a former online-solicitation provision as unconstitutionally overbroad because its sweep reached a substantial amount of protected speech.",
  },
  {
    year: "2014–2016",
    name: "Ex parte Robbins",
    significance: "The case became an important early test of Texas's changed-science habeas statute, Article 11.073, and the treatment of materially changed forensic or scientific testimony after conviction.",
  },
] as const;

export const CCA_HISTORIC_FIRSTS = [
  {
    title: "James Mann Hurt",
    detail: "Hurt became the first presiding judge under the Court of Criminal Appeals name when the reorganized appellate system began operating in 1892.",
  },
  {
    title: "John F. Onion Jr.",
    detail: "Onion was elected in 1970 and became the first presiding judge chosen directly by Texas voters when he took office in 1971.",
  },
  {
    title: "Louis Sturns",
    detail: "Appointed in 1990, Sturns became the first Black judge to serve on the Court of Criminal Appeals.",
  },
  {
    title: "Morris L. Overstreet",
    detail: "Elected to the Court in 1990, Overstreet became the first Black person elected to statewide office in Texas.",
  },
  {
    title: "Sharon Keller",
    detail: "Keller became the first woman elected to the Court in 1994 and later the first woman elected presiding judge in 2000.",
  },
  {
    title: "Nine-member Court",
    detail: "The 1977 constitutional amendment took effect in 1978, producing the presiding judge plus eight judges structure still used today.",
  },
] as const;

export const CCA_PRESIDING_JUDGES: CcaRosterEntry[] = [
  { name: "Mat D. Ector", service: "Presiding Judge, Court of Appeals · May 1876–October 1879" },
  { name: "John P. White", service: "Presiding Judge, Court of Appeals · November 1879–April 1892" },
  { name: "James M. Hurt", service: "Presiding Judge · May 1892–December 1898", note: "First presiding judge under the Court of Criminal Appeals name." },
  { name: "W. L. Davidson", service: "Presiding Judge · January 1899–June 1913" },
  { name: "A. C. Prendergast", service: "Presiding Judge · June 1913–December 1916" },
  { name: "W. L. Davidson", service: "Presiding Judge · January 1917–January 1921" },
  { name: "Wright C. Morrow", service: "Presiding Judge · February 1921–October 1939" },
  { name: "Frank Lee Hawkins", service: "Presiding Judge · October 1939–January 1951" },
  { name: "Harry N. Graves", service: "Presiding Judge · January 1951–December 1954" },
  { name: "W. A. Morrison", service: "Presiding Judge · January 1955–January 1961" },
  { name: "Kenneth K. Woodley", service: "Presiding Judge · January 1961–January 1965" },
  { name: "W. T. McDonald", service: "Presiding Judge · January 1965–June 1966" },
  { name: "W. A. Morrison", service: "Presiding Judge · June–December 1966" },
  { name: "Kenneth K. Woodley", service: "Presiding Judge · January 1967–January 1971" },
  { name: "John F. Onion Jr.", service: "Presiding Judge · January 1971–December 1988", selection: "First presiding judge elected directly to that office by Texas voters." },
  { name: "Michael J. McCormick", service: "Presiding Judge · January 1989–December 2000" },
  { name: "Sharon Keller", service: "Presiding Judge · January 2001–December 2024", selection: "Elected presiding judge in 2000 after first joining the Court through the 1994 election." },
  { name: "David J. Schenck", service: "Presiding Judge · January 2025–present", selection: "Elected statewide in 2024." },
];

export const CCA_NOTABLE_JUDGES = [
  { name: "Offa Shivers Lattimore", note: "Long-serving early twentieth-century judge and author on the history and operation of criminal appellate courts." },
  { name: "William F. Ramsey", note: "Served on the Court of Criminal Appeals before later becoming an associate justice of the Supreme Court of Texas." },
  { name: "Truman Roberts", note: "Served during the transition from the five-member Court toward the modern nine-member structure." },
  { name: "Leon Douglas", note: "Served during the high-volume pre-1981 era when the CCA directly absorbed far more criminal appeals." },
  { name: "Sam Houston Clinton", note: "Long-serving judge whose tenure covered major changes in Texas criminal procedure and discretionary review." },
] as const;

export const CCA_SOURCES = [
  { href: "https://www.txcourts.gov/cca/", label: "Texas Court of Criminal Appeals" },
  { href: "https://www.txcourts.gov/cca/about-the-court/judges/", label: "Texas Court of Criminal Appeals: current judges" },
  { href: "https://www.txcourts.gov/cca/news/court-of-criminal-appeals-celebrates-125th-anniversary/", label: "Texas Court of Criminal Appeals: 125th Anniversary history" },
  { href: "https://tcss.legis.texas.gov/resources/CN/htm/CN.5.htm", label: "Texas Constitution, Article V" },
  { href: "https://txcourts.gov/rules-forms/rules-standards/texas-court-rules-history-process/", label: "Texas Judicial Branch: court-rules history and process" },
  { href: "https://www.txcourts.gov/cca/news/texas-court-of-criminal-appeals-advisory/", label: "Texas Court of Criminal Appeals: John F. Onion Jr. historical advisory" },
  { href: "https://www.tshaonline.org/handbook/entries/texas-court-of-criminal-appeals", label: "Handbook of Texas: Texas Court of Criminal Appeals" },
  { href: "https://cemetery.texas.gov/locate-a-plot/plotholder/sharon-keller", label: "Texas State Cemetery: Sharon Keller biography" },
  { href: "https://www.texasbar.com/AM/Template.cfm?ContentID=9806&Section=Texas_Legal_Legends&Template=%2FCM%2FHTMLDisplay.cfm", label: "State Bar of Texas: Morris L. Overstreet legal legend" },
  { href: "https://www.wichita.edu/academics/fairmount_las/whatshappening/2023hof/Sturns.php", label: "Wichita State University: Louis E. Sturns biography" },
  { href: "https://texashistory.unt.edu/ark:/67531/metapth1760437/m1/479/", label: "Texas Almanac archive: Court of Criminal Appeals presiding-judge history" },
] as const;
