export type JudicialSelectionRow = {
  court: string;
  selection: string;
  vacancy: string;
  term: string;
  qualifications: string;
  note?: string;
};

export const JUDICIAL_SELECTION_REVIEWED = "2026-09-08";

export const TEXAS_JUDICIAL_SELECTION_MATRIX: JudicialSelectionRow[] = [
  {
    court: "Supreme Court of Texas",
    selection: "Partisan statewide election",
    vacancy: "Governor appoints with advice and consent of the Senate",
    term: "6 years",
    qualifications: "U.S. and Texas citizen; age 35–74; Texas lawyer, or qualifying lawyer/judge combination, for at least 10 years; additional license-standing requirements apply.",
    note: "One chief justice and eight justices. The Court is Texas's civil and juvenile court of last resort.",
  },
  {
    court: "Court of Criminal Appeals",
    selection: "Partisan statewide election",
    vacancy: "Governor appoints with advice and consent of the Senate",
    term: "6 years",
    qualifications: "U.S. and Texas citizen; age 35–74; Texas lawyer, or qualifying lawyer/judge combination, for at least 10 years; additional license-standing requirements apply.",
    note: "One presiding judge and eight judges. The Court is Texas's criminal court of last resort.",
  },
  {
    court: "Courts of Appeals",
    selection: "Partisan election within each court of appeals district",
    vacancy: "Governor appoints with advice and consent of the Senate",
    term: "6 years",
    qualifications: "U.S. and Texas citizen; age 35–74; Texas lawyer, or qualifying lawyer/judge combination, for at least 10 years; residency requirements apply.",
    note: "Includes the 15th Court of Appeals and the regional intermediate appellate courts.",
  },
  {
    court: "District Courts",
    selection: "Partisan district-wide election",
    vacancy: "Governor appoints with advice and consent of the Senate",
    term: "4 years",
    qualifications: "U.S. and Texas citizen; age 25–74; district residency; and at least 8 years of qualifying Texas legal/judicial experience with required license standing.",
  },
  {
    court: "Texas Business Court",
    selection: "Governor appoints with advice and consent of the Senate",
    vacancy: "Filled through the statutory appointment process",
    term: "2 years",
    qualifications: "At least age 35, division-county residency requirements, and at least 10 years of qualifying complex business-law practice or civil judicial experience.",
    note: "The Business Court is an important modern exception to the broad Texas pattern of partisan judicial elections.",
  },
  {
    court: "Constitutional County Courts",
    selection: "Partisan county-wide election",
    vacancy: "County commissioners court fills vacancies",
    term: "4 years",
    qualifications: "The Texas Constitution requires the county judge to be well informed in the law of the state; a law license is not universally required for this constitutional office.",
  },
  {
    court: "Statutory County Courts",
    selection: "Partisan county-wide election",
    vacancy: "County commissioners court fills vacancies",
    term: "4 years",
    qualifications: "Generally age 25 or older, county residency, Texas law license, and at least 5 years of qualifying legal/judicial experience.",
  },
  {
    court: "Statutory Probate Courts",
    selection: "Partisan county-wide election",
    vacancy: "County commissioners court fills vacancies",
    term: "4 years",
    qualifications: "Generally age 25 or older, county residency, Texas law license, and at least 4 years of qualifying legal/judicial experience.",
  },
  {
    court: "Justice Courts",
    selection: "Partisan precinct-wide election",
    vacancy: "Local vacancy rules apply",
    term: "4 years",
    qualifications: "No specific professional qualification is imposed by the judicial-selection chart beyond generally applicable eligibility requirements.",
  },
  {
    court: "Municipal Courts",
    selection: "Most judges are appointed by the city governing body; a smaller number are elected",
    vacancy: "Controlled by applicable city charter, ordinance, and law",
    term: "Usually 2 or 4 years",
    qualifications: "Determined by applicable law and the city governing body; requirements differ by municipality and court type.",
  },
];

export const JUDICIAL_SELECTION_TIMELINE = [
  {
    year: "1836",
    title: "The Republic begins with an appointment model",
    text: "The Republic of Texas did not begin with today's statewide judicial ballot. Its Supreme Court structure used a chief justice selected through the Republic's political institutions and district judges serving in the appellate structure.",
  },
  {
    year: "1845",
    title: "Statehood creates another judicial-selection system",
    text: "The first state constitution reorganized the judiciary after annexation, continuing the pattern of constitutional redesign rather than establishing one permanent method of judicial selection.",
  },
  {
    year: "1850",
    title: "Texas moves major judgeships toward popular election",
    text: "A constitutional amendment moved Supreme Court and district judges toward direct popular election, making voter selection a central feature of the state judiciary before the Civil War.",
  },
  {
    year: "1866",
    title: "Postwar constitution again uses elections",
    text: "The 1866 constitution provided for an elected Supreme Court, but Reconstruction soon disrupted that bench and reopened the selection question.",
  },
  {
    year: "1869",
    title: "Reconstruction constitution shifts to appointments",
    text: "The 1869 constitution made major judicial offices appointive, closely associating appointment with the Reconstruction government in later Texas political memory.",
  },
  {
    year: "1876",
    title: "The current constitution restores popular judicial elections",
    text: "The Constitution of 1876 returned major judgeships to elections as part of a broader post-Reconstruction effort to disperse governmental power and place more offices directly before voters.",
  },
  {
    year: "1891",
    title: "A larger appellate system multiplies elected judicial offices",
    text: "The judicial amendment reorganized appellate jurisdiction, created intermediate civil appellate courts, and helped establish the two-high-court system whose members remain elected today.",
  },
  {
    year: "1995",
    title: "Judicial Campaign Fairness Act regulates campaign finance",
    text: "Texas enacted campaign-finance rules specifically aimed at judicial races, reflecting long-running concern about the relationship between elected judges, campaign fundraising, and public confidence.",
  },
  {
    year: "2017–2020",
    title: "Straight-party voting is eliminated",
    text: "House Bill 25 was enacted in 2017 and eliminated straight-party voting effective September 1, 2020. Voters must now select individual candidates rather than cast one straight-party ballot choice.",
  },
  {
    year: "2019–2020",
    title: "Texas Commission on Judicial Selection studies alternatives",
    text: "The Legislature created a 15-member commission to study partisan elections, nonpartisan elections, appointments, retention elections, qualifications, campaign finance, and other models. Its final report documented substantial dissatisfaction with the status quo but no consensus replacement system.",
  },
  {
    year: "2021–2025",
    title: "Voters raise experience and license-standing requirements",
    text: "A 2021 constitutional amendment increased experience requirements and added license-standing conditions for specified appellate and district judges. The revised standards apply to covered judges first elected or appointed on or after January 1, 2025.",
  },
  {
    year: "2024",
    title: "The appointed Texas Business Court begins operating",
    text: "Texas's new Business Court adds a prominent appointed-judge model to a judiciary otherwise dominated by partisan elections. Business Court judges serve two-year terms after gubernatorial appointment with Senate confirmation.",
  },
  {
    year: "2026",
    title: "Partisan elections still govern the major constitutional courts",
    text: "Current Texas election guidance continues to list the Supreme Court, Court of Criminal Appeals, courts of appeals, district courts, and many county-level courts as elected offices, while appointments remain important for vacancies and specialized courts.",
  },
] as const;

export const JUDICIAL_SELECTION_REFORM_FINDINGS = [
  {
    title: "Partisan elections",
    result: "A majority recommended against continuing the partisan judicial-selection system.",
    context: "The commission discussed voter accountability, party cues, low-information races, partisan sweeps, candidate quality, and campaign pressures.",
  },
  {
    title: "Nonpartisan elections",
    result: "A majority also recommended against replacing the system with nonpartisan judicial elections.",
    context: "Opposition to partisan elections did not translate into majority support for simply removing party labels from the ballot.",
  },
  {
    title: "Appointment plus retention election",
    result: "The commission split 7–7, with one abstention, on an appointive system followed by retention elections.",
    context: "The tie illustrates why Texas reform debates have repeatedly failed to produce a consensus constitutional replacement.",
  },
  {
    title: "Judicial qualifications",
    result: "Commissioners overwhelmingly supported increasing minimum qualifications.",
    context: "Texas voters subsequently approved a 2021 constitutional amendment increasing experience and license-standing requirements for specified judges.",
  },
  {
    title: "Campaign money",
    result: "Commissioners overwhelmingly supported additional regulation of money in judicial elections.",
    context: "Campaign finance remains one of the recurring arguments in debates over elected judges and public confidence.",
  },
  {
    title: "Term limits",
    result: "The commission rejected judicial term limits unanimously, with two abstentions.",
    context: "The report favored neither a blanket replacement of elections nor term limits as a simple solution to judicial-selection concerns.",
  },
] as const;

export const JUDICIAL_SELECTION_VOTER_GUIDE = [
  {
    title: "Read the office name carefully",
    text: "Texas has two statewide high courts. A Supreme Court race is a civil/juvenile high-court race; a Court of Criminal Appeals race concerns the state's criminal court of last resort.",
  },
  {
    title: "Distinguish appointment from election",
    text: "A judge may have first entered office through a vacancy appointment and later won election. Coverage should identify both events rather than treating an appointee as if the original appointment were an election.",
  },
  {
    title: "Know whether the race is statewide or local",
    text: "Supreme Court and Court of Criminal Appeals races are statewide. Courts of appeals are elected within appellate districts, district judges within judicial districts, and county-level judges within their counties or precincts.",
  },
  {
    title: "Party labels remain on judicial ballots",
    text: "Texas still uses partisan elections for many judgeships, but straight-party voting has been gone since 2020. Voters select judicial candidates individually on the ballot.",
  },
  {
    title: "Qualifications changed for newer judges",
    text: "The 2021 constitutional amendment strengthened experience and license-standing requirements for specified appellate and district judges first elected or appointed beginning in 2025.",
  },
  {
    title: "Specialized courts can use different selection systems",
    text: "Do not assume every Texas judge is elected. Municipal judges are often appointed, and Business Court judges are appointed by the governor with Senate confirmation.",
  },
] as const;

export const JUDICIAL_SELECTION_SOURCES = [
  { href: "https://www.txcourts.gov/statistics/information-on-texas-judges/", label: "Texas Judicial Branch: Information on Texas Judges" },
  { href: "https://www.txcourts.gov/media/1461301/judge-qualifications-and-selection-chart-2025.pdf", label: "Texas Judicial Branch: Judge Qualifications and Selection chart" },
  { href: "https://www.sos.state.tx.us/elections/candidates/guide/2026/qualifications2026.shtml", label: "Texas Secretary of State: 2026 candidate qualifications" },
  { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm", label: "Texas Constitution, Article V" },
  { href: "https://www.txcourts.gov/supreme/about-the-court/court-history/supreme-court-judicial-election-history.aspx", label: "Supreme Court of Texas: Judicial Election History" },
  { href: "https://www.txcourts.gov/tcjs/", label: "Texas Commission on Judicial Selection" },
  { href: "https://www.txcourts.gov/tcjs/reports/", label: "Texas Commission on Judicial Selection: Reports" },
  { href: "https://www.txcourts.gov/media/1450219/201230_tcjs-final-report_compressed.pdf", label: "Texas Commission on Judicial Selection: 2020 Final Report" },
  { href: "https://www.sos.state.tx.us/elections/laws/advisory2020-29.shtml", label: "Texas Secretary of State: elimination of straight-party voting" },
  { href: "https://lrl.texas.gov/committees/reportDisplay.cfm?passSearchParams=&subject=Judicial+selection&subjectID=4246", label: "Legislative Reference Library: judicial-selection studies" },
] as const;
