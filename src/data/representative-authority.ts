export type AuthoritySource = {
  label: string;
  url: string;
};

export type ElectionMilestone = {
  year: string;
  result: string;
};

export type RepresentativeAuthority = {
  slug: string;
  reviewedAt: string;
  biography: string;
  career: string[];
  education: string[];
  committees: string[];
  electionHistory: ElectionMilestone[];
  districtOverview: string;
  financeUrl: string;
  financeLabel: string;
  newsKeywords: string[];
  sources: AuthoritySource[];
};

const FEC_SEARCH = "https://www.fec.gov/data/candidates/?search=";
const TEXAS_ETHICS = "https://www.ethics.state.tx.us/search/cf/";

export const REPRESENTATIVE_AUTHORITY: RepresentativeAuthority[] = [
  {
    slug: "john-cornyn",
    reviewedAt: "2026-07-30",
    biography:
      "John Cornyn is a United States senator from Texas. Before joining the Senate, he served as a Texas district judge, a justice of the Supreme Court of Texas and attorney general of Texas.",
    career: [
      "United States senator from Texas since 2002.",
      "Attorney general of Texas from 1999 through 2002.",
      "Justice of the Supreme Court of Texas from 1991 through 1997.",
      "Previously served as a state district judge in Bexar County.",
    ],
    education: [
      "Bachelor's degree from Trinity University.",
      "Juris Doctor from St. Mary's University School of Law.",
      "Master of Laws from the University of Virginia School of Law.",
    ],
    committees: [
      "Senate Committee on Finance.",
      "Senate Committee on the Judiciary.",
      "Senate Select Committee on Intelligence.",
      "Senate Committee on Foreign Relations.",
      "Senate Committee on the Budget.",
    ],
    electionHistory: [
      { year: "2002", result: "First elected to the U.S. Senate." },
      { year: "2008", result: "Reelected to a second term." },
      { year: "2014", result: "Reelected to a third term." },
      { year: "2020", result: "Reelected to a fourth term." },
    ],
    districtOverview:
      "U.S. senators represent the entire state of Texas rather than a single congressional district.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("John Cornyn")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["John Cornyn", "Senator Cornyn"],
    sources: [
      { label: "Official Senate biography", url: "https://www.cornyn.senate.gov/about/about-john-cornyn/" },
      { label: "U.S. Senate Texas delegation", url: "https://www.senate.gov/states/TX/intro.htm" },
      { label: "Official committee assignments", url: "https://www.cornyn.senate.gov/about/committee-assignments/" },
    ],
  },
  {
    slug: "ted-cruz",
    reviewedAt: "2026-07-30",
    biography:
      "Ted Cruz is a United States senator from Texas. His earlier legal career included service as solicitor general of Texas, domestic policy adviser during the George W. Bush administration and a law clerk to Chief Justice William Rehnquist.",
    career: [
      "United States senator from Texas since 2013.",
      "Solicitor general of Texas from 2003 through 2008.",
      "Previously served at the Federal Trade Commission, U.S. Department of Justice and White House.",
      "Former law clerk to Chief Justice William Rehnquist and Judge J. Michael Luttig.",
    ],
    education: [
      "Bachelor's degree from Princeton University.",
      "Juris Doctor from Harvard Law School.",
    ],
    committees: [
      "Senate Committee on Commerce, Science, and Transportation.",
      "Senate Committee on Foreign Relations.",
      "Senate Committee on the Judiciary.",
      "Senate Committee on Rules and Administration.",
      "Joint Economic Committee.",
    ],
    electionHistory: [
      { year: "2012", result: "First elected to the U.S. Senate." },
      { year: "2018", result: "Reelected to a second term." },
      { year: "2024", result: "Reelected to a third term." },
    ],
    districtOverview:
      "U.S. senators represent the entire state of Texas rather than a single congressional district.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Ted Cruz")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Ted Cruz", "Senator Cruz"],
    sources: [
      { label: "Official Senate biography", url: "https://www.cruz.senate.gov/about/about-ted" },
      { label: "U.S. Senate Texas delegation", url: "https://www.senate.gov/states/TX/intro.htm" },
      { label: "Official committee assignments", url: "https://www.cruz.senate.gov/about/committee-assignments" },
    ],
  },
  {
    slug: "greg-abbott",
    reviewedAt: "2026-07-30",
    biography:
      "Greg Abbott is the governor of Texas. He previously served as attorney general of Texas, a justice of the Supreme Court of Texas and a state district judge.",
    career: [
      "Governor of Texas since January 2015.",
      "Attorney general of Texas from 2002 through 2015.",
      "Justice of the Supreme Court of Texas from 1996 through 2001.",
      "Previously served as a state district judge in Harris County.",
    ],
    education: [
      "Bachelor of Business Administration from the University of Texas at Austin.",
      "Juris Doctor from Vanderbilt University Law School.",
    ],
    committees: ["Executive office; the governor does not receive legislative committee assignments."],
    electionHistory: [
      { year: "2014", result: "First elected governor of Texas." },
      { year: "2018", result: "Reelected to a second term." },
      { year: "2022", result: "Reelected to a third term." },
    ],
    districtOverview: "The governor is elected statewide and represents all Texans.",
    financeUrl: TEXAS_ETHICS,
    financeLabel: "Texas Ethics Commission campaign-finance search",
    newsKeywords: ["Greg Abbott", "Governor Abbott", "Texas governor"],
    sources: [
      { label: "Office of the Governor biography", url: "https://gov.texas.gov/governor-abbott" },
      { label: "Texas statewide elected officials", url: "https://www.sos.texas.gov/elections/voter/elected.shtml" },
    ],
  },
  {
    slug: "dan-patrick",
    reviewedAt: "2026-07-30",
    biography:
      "Dan Patrick is the lieutenant governor of Texas and president of the Texas Senate. He previously represented Senate District 7 and worked in broadcasting and business.",
    career: [
      "Lieutenant governor of Texas since January 2015.",
      "Texas senator for District 7 from 2007 through 2015.",
      "Previously worked as a broadcaster and business owner.",
    ],
    education: ["Bachelor's degree from the University of Maryland, Baltimore County."],
    committees: [
      "Presides over the Texas Senate.",
      "Appoints Senate committee chairs and members under Senate rules.",
      "Refers legislation to Senate committees.",
    ],
    electionHistory: [
      { year: "2006", result: "First elected to the Texas Senate." },
      { year: "2014", result: "First elected lieutenant governor." },
      { year: "2018", result: "Reelected lieutenant governor." },
      { year: "2022", result: "Reelected to a third term." },
    ],
    districtOverview: "The lieutenant governor is elected statewide and presides over the 31-member Texas Senate.",
    financeUrl: TEXAS_ETHICS,
    financeLabel: "Texas Ethics Commission campaign-finance search",
    newsKeywords: ["Dan Patrick", "Lieutenant Governor Patrick", "Texas lieutenant governor"],
    sources: [
      { label: "Official lieutenant governor biography", url: "https://www.ltgov.texas.gov/biography/" },
      { label: "Texas statewide elected officials", url: "https://www.sos.texas.gov/elections/voter/elected.shtml" },
      { label: "Texas Senate committees", url: "https://senate.texas.gov/committees.php" },
    ],
  },
  {
    slug: "ken-paxton",
    reviewedAt: "2026-07-30",
    biography:
      "Ken Paxton is the attorney general of Texas. Before winning statewide office, he represented Collin County-area districts in both chambers of the Texas Legislature.",
    career: [
      "Attorney general of Texas since January 2015.",
      "Texas senator for District 8 from 2013 through 2015.",
      "Texas representative for District 70 from 2003 through 2013.",
      "Previously practiced law and worked in business.",
    ],
    education: [
      "Bachelor's degree and Master of Business Administration from Baylor University.",
      "Juris Doctor from the University of Virginia School of Law.",
    ],
    committees: ["Executive office; the attorney general does not receive legislative committee assignments."],
    electionHistory: [
      { year: "2014", result: "First elected attorney general of Texas." },
      { year: "2018", result: "Reelected to a second term." },
      { year: "2022", result: "Reelected to a third term." },
    ],
    districtOverview: "The attorney general is elected statewide and serves as Texas's chief legal officer.",
    financeUrl: TEXAS_ETHICS,
    financeLabel: "Texas Ethics Commission campaign-finance search",
    newsKeywords: ["Ken Paxton", "Attorney General Paxton", "Texas attorney general"],
    sources: [
      { label: "Attorney General biography", url: "https://www.texasattorneygeneral.gov/about-office" },
      { label: "Texas statewide elected officials", url: "https://www.sos.texas.gov/elections/voter/elected.shtml" },
    ],
  },
  {
    slug: "don-huffines",
    reviewedAt: "2026-07-30",
    biography:
      "Don Huffines is the comptroller of public accounts of Texas. Governor Greg Abbott appointed him to the office on July 2, 2026. He previously represented Senate District 16 in the Texas Senate and worked in business.",
    career: [
      "Appointed Texas comptroller of public accounts in July 2026.",
      "Represented Texas Senate District 16 from 2015 through 2019.",
      "Worked in the automotive and real-estate businesses.",
    ],
    education: ["Bachelor of Business Administration from the University of Texas at Austin."],
    committees: ["Executive office; the comptroller does not receive legislative committee assignments."],
    electionHistory: [
      { year: "2014", result: "Elected to Texas Senate District 16." },
      { year: "2026", result: "Appointed comptroller; the office is on the 2026 statewide ballot." },
    ],
    districtOverview: "The comptroller is a statewide office responsible for tax administration, state accounting and revenue estimates.",
    financeUrl: TEXAS_ETHICS,
    financeLabel: "Texas Ethics Commission campaign-finance search",
    newsKeywords: ["Don Huffines", "Texas comptroller", "Comptroller Huffines"],
    sources: [
      { label: "Governor's appointment announcement", url: "https://gov.texas.gov/news/post/governor-abbott-appoints-don-huffines-as-comptroller-of-public-accounts" },
      { label: "Texas Comptroller official website", url: "https://comptroller.texas.gov/" },
      { label: "2026 offices up for election", url: "https://www.sos.texas.gov/elections/candidates/guide/2026/offices2026.shtml" },
    ],
  },
  {
    slug: "sid-miller",
    reviewedAt: "2026-07-30",
    biography:
      "Sid Miller is the Texas commissioner of agriculture. He previously served six terms in the Texas House and has worked as an agricultural producer, nurseryman, educator and rodeo participant.",
    career: [
      "Texas commissioner of agriculture since January 2015.",
      "Texas representative for District 59 from 2001 through 2013.",
      "Previously worked in agriculture, education and business.",
    ],
    education: [
      "Bachelor of Science in vocational agriculture education from Sam Houston State University.",
    ],
    committees: ["Executive office; the agriculture commissioner does not receive legislative committee assignments."],
    electionHistory: [
      { year: "2014", result: "First elected Texas agriculture commissioner." },
      { year: "2018", result: "Reelected to a second term." },
      { year: "2022", result: "Reelected to a third term." },
    ],
    districtOverview: "The agriculture commissioner is elected statewide and leads the Texas Department of Agriculture.",
    financeUrl: TEXAS_ETHICS,
    financeLabel: "Texas Ethics Commission campaign-finance search",
    newsKeywords: ["Sid Miller", "Agriculture Commissioner Miller", "Texas Department of Agriculture"],
    sources: [
      { label: "Texas Department of Agriculture biography", url: "https://texasagriculture.gov/About/TexasAgCommissioner.aspx" },
      { label: "Texas statewide elected officials", url: "https://www.sos.texas.gov/elections/voter/elected.shtml" },
    ],
  },
  {
    slug: "dawn-buckingham",
    reviewedAt: "2026-07-30",
    biography:
      "Dawn Buckingham is the commissioner of the Texas General Land Office. She previously represented Senate District 24 and practiced medicine as an ophthalmologist.",
    career: [
      "Commissioner of the Texas General Land Office since January 2023.",
      "Texas senator for District 24 from 2017 through 2023.",
      "Previously practiced medicine as an ophthalmologist.",
    ],
    education: [
      "Bachelor's degree from the University of Texas at Austin.",
      "Medical degree from the University of Texas Medical Branch at Galveston.",
    ],
    committees: ["Executive office; the land commissioner does not receive legislative committee assignments."],
    electionHistory: [
      { year: "2016", result: "First elected to Texas Senate District 24." },
      { year: "2020", result: "Reelected to the Texas Senate." },
      { year: "2022", result: "Elected commissioner of the Texas General Land Office." },
    ],
    districtOverview: "The land commissioner is elected statewide and manages the Texas General Land Office.",
    financeUrl: TEXAS_ETHICS,
    financeLabel: "Texas Ethics Commission campaign-finance search",
    newsKeywords: ["Dawn Buckingham", "Land Commissioner Buckingham", "Texas General Land Office"],
    sources: [
      { label: "General Land Office leadership", url: "https://www.glo.texas.gov/about/leadership" },
      { label: "Texas statewide elected officials", url: "https://www.sos.texas.gov/elections/voter/elected.shtml" },
    ],
  },
  {
    slug: "wesley-hunt",
    reviewedAt: "2026-07-30",
    biography: "Wesley Hunt represents Texas's 38th Congressional District. A West Point graduate and former Army Apache helicopter pilot, he entered Congress in January 2023.",
    career: ["U.S. representative for Texas District 38 since 2023.", "Served in the U.S. Army as an aviation officer and Apache helicopter pilot.", "Worked in the private sector after military service."],
    education: ["Bachelor of Science from the United States Military Academy at West Point.", "Graduate degrees from Cornell University, including an MBA and public-administration study."],
    committees: ["House Committee on Natural Resources.", "House Committee on the Judiciary."],
    electionHistory: [{ year: "2022", result: "First elected to the U.S. House." }, { year: "2024", result: "Reelected to a second House term." }],
    districtOverview: "Texas District 38 is a Houston-area congressional district. Congressional boundaries may change after redistricting, so voters should verify their address through the official House lookup.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Wesley Hunt")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Wesley Hunt", "Congressman Hunt", "Texas District 38"],
    sources: [{ label: "Official House biography", url: "https://hunt.house.gov/about" }, { label: "Official House directory and committees", url: "https://www.house.gov/representatives" }, { label: "Congressional Biographical Directory", url: "https://bioguide.congress.gov/search/bio/H001095" }],
  },
  {
    slug: "dan-crenshaw",
    reviewedAt: "2026-07-30",
    biography: "Dan Crenshaw represents Texas's 2nd Congressional District. He served as a Navy SEAL before entering Congress in January 2019.",
    career: ["U.S. representative for Texas District 2 since 2019.", "Served as a U.S. Navy SEAL officer, completing five overseas deployments.", "Worked as a congressional military legislative assistant after active military service."],
    education: ["Bachelor's degree from Tufts University.", "Master of Public Administration from Harvard Kennedy School."],
    committees: ["House Committee on Energy and Commerce.", "House Permanent Select Committee on Intelligence."],
    electionHistory: [{ year: "2018", result: "First elected to the U.S. House." }, { year: "2020", result: "Reelected." }, { year: "2022", result: "Reelected." }, { year: "2024", result: "Reelected." }],
    districtOverview: "Texas District 2 is a Houston-area congressional district. Voters should confirm current boundaries and representation through the official House address lookup.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Dan Crenshaw")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Dan Crenshaw", "Congressman Crenshaw", "Texas District 2"],
    sources: [{ label: "Official House biography", url: "https://crenshaw.house.gov/biography" }, { label: "Official House directory and committees", url: "https://www.house.gov/representatives" }],
  },
  {
    slug: "chip-roy",
    reviewedAt: "2026-07-30",
    biography: "Chip Roy represents Texas's 21st Congressional District. His earlier public-service roles included first assistant attorney general of Texas and chief of staff to U.S. Senator Ted Cruz.",
    career: ["U.S. representative for Texas District 21 since 2019.", "Former first assistant attorney general of Texas.", "Former chief of staff to U.S. Senator Ted Cruz.", "Previously worked as a federal prosecutor and in private-sector roles."],
    education: ["Bachelor of Science and Master of Arts from the University of Virginia.", "Juris Doctor from the University of Texas School of Law."],
    committees: ["House Committee on the Budget.", "House Committee on the Judiciary.", "House Committee on Rules."],
    electionHistory: [{ year: "2018", result: "First elected to the U.S. House." }, { year: "2020", result: "Reelected." }, { year: "2022", result: "Reelected." }, { year: "2024", result: "Reelected." }],
    districtOverview: "Texas District 21 includes parts of Central Texas and the Hill Country. Voters should verify current district boundaries through the official House lookup.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Chip Roy")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Chip Roy", "Congressman Roy", "Texas District 21"],
    sources: [{ label: "Official House biography", url: "https://roy.house.gov/about" }, { label: "Official House directory and committees", url: "https://www.house.gov/representatives" }],
  },
  {
    slug: "ronny-jackson",
    reviewedAt: "2026-07-30",
    biography: "Ronny Jackson represents Texas's 13th Congressional District. A physician and retired Navy rear admiral, he served in the White House Medical Unit before entering Congress in January 2021.",
    career: ["U.S. representative for Texas District 13 since 2021.", "Served 25 years in the U.S. Navy and retired as a rear admiral.", "Served as physician to the president and led the White House Medical Unit.", "Practiced emergency and operational medicine during his military career."],
    education: ["Undergraduate degree from Texas A&M University.", "Medical degree from the University of Texas Medical Branch at Galveston."],
    committees: ["House Committee on Agriculture.", "House Committee on Armed Services.", "House Committee on Foreign Affairs.", "House Permanent Select Committee on Intelligence."],
    electionHistory: [{ year: "2020", result: "First elected to the U.S. House." }, { year: "2022", result: "Reelected." }, { year: "2024", result: "Reelected." }],
    districtOverview: "Texas District 13 covers a large portion of the Panhandle and North Texas. Voters should verify current boundaries through the official House lookup.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Ronny Jackson")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Ronny Jackson", "Congressman Jackson", "Texas District 13"],
    sources: [{ label: "Official House biography", url: "https://jackson.house.gov/about/" }, { label: "Official House directory and committees", url: "https://www.house.gov/representatives" }],
  },
  {
    slug: "pat-fallon",
    reviewedAt: "2026-07-30",
    biography: "Pat Fallon represents Texas's 4th Congressional District. He previously served in the Texas House and Texas Senate and was an officer in the U.S. Air Force.",
    career: ["U.S. representative for Texas District 4 since 2021.", "Former member of the Texas Senate and Texas House.", "Served as an officer in the U.S. Air Force.", "Founded and operated a business before entering Congress."],
    education: ["Bachelor's degree from the University of Notre Dame."],
    committees: ["House Committee on Armed Services.", "House Committee on Oversight and Government Reform.", "House Permanent Select Committee on Intelligence."],
    electionHistory: [{ year: "2020", result: "First elected to the U.S. House." }, { year: "2022", result: "Reelected." }, { year: "2024", result: "Reelected." }],
    districtOverview: "Texas District 4 is a North and Northeast Texas congressional district. Voters should verify current boundaries through the official House lookup.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Pat Fallon")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Pat Fallon", "Congressman Fallon", "Texas District 4"],
    sources: [{ label: "Official House biography", url: "https://fallon.house.gov/about/" }, { label: "Official House directory and committees", url: "https://www.house.gov/representatives" }],
  },
  {
    slug: "beth-van-duyne",
    reviewedAt: "2026-07-30",
    biography: "Beth Van Duyne represents Texas's 24th Congressional District. Before entering Congress, she served as mayor of Irving and as a regional administrator at the U.S. Department of Housing and Urban Development.",
    career: ["U.S. representative for Texas District 24 since 2021.", "Former mayor and city council member of Irving, Texas.", "Former regional administrator for the U.S. Department of Housing and Urban Development."],
    education: ["Bachelor's degree from Cornell University."],
    committees: ["House Committee on Small Business.", "House Committee on Ways and Means."],
    electionHistory: [{ year: "2020", result: "First elected to the U.S. House." }, { year: "2022", result: "Reelected." }, { year: "2024", result: "Reelected." }],
    districtOverview: "Texas District 24 is centered in the Dallas–Fort Worth area. Voters should verify current boundaries through the official House lookup.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Beth Van Duyne")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Beth Van Duyne", "Congresswoman Van Duyne", "Texas District 24"],
    sources: [{ label: "Official House biography", url: "https://vanduyne.house.gov/about" }, { label: "Official House directory and committees", url: "https://www.house.gov/representatives" }],
  },
  {
    slug: "lance-gooden",
    reviewedAt: "2026-07-30",
    biography: "Lance Gooden represents Texas's 5th Congressional District. He previously served three terms in the Texas House and worked in the insurance industry.",
    career: ["U.S. representative for Texas District 5 since 2019.", "Served three terms in the Texas House of Representatives.", "Worked in the insurance industry for ten years."],
    education: ["Bachelor of Arts in government and Bachelor of Business Administration in finance from the University of Texas at Austin."],
    committees: ["House Committee on Armed Services.", "House Committee on the Judiciary."],
    electionHistory: [{ year: "2018", result: "First elected to the U.S. House." }, { year: "2020", result: "Reelected." }, { year: "2022", result: "Reelected." }, { year: "2024", result: "Reelected." }],
    districtOverview: "Texas District 5 extends east from the Dallas area into East Texas. Voters should verify current boundaries through the official House lookup.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Lance Gooden")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Lance Gooden", "Congressman Gooden", "Texas District 5"],
    sources: [{ label: "Official House biography", url: "https://gooden.house.gov/about" }, { label: "Official House directory and committees", url: "https://www.house.gov/representatives" }, { label: "Congressional Biographical Directory", url: "https://bioguide.congress.gov/search/bio/G000589" }],
  },
  {
    slug: "monica-de-la-cruz",
    reviewedAt: "2026-07-30",
    biography: "Monica De La Cruz represents Texas's 15th Congressional District. Before entering Congress, she worked as a small-business owner and insurance professional in South Texas.",
    career: ["U.S. representative for Texas District 15 since 2023.", "Previously owned and operated a small business in South Texas.", "Worked in the insurance industry before entering Congress."],
    education: ["Bachelor of Business Administration from the University of Texas at San Antonio."],
    committees: ["House Committee on Agriculture.", "House Committee on Financial Services."],
    electionHistory: [{ year: "2020", result: "Ran for Texas District 15." }, { year: "2022", result: "First elected to the U.S. House." }, { year: "2024", result: "Reelected to a second term." }],
    districtOverview: "Texas District 15 is a South Texas congressional district that includes communities in the Rio Grande Valley. Voters should verify current boundaries through the official House lookup.",
    financeUrl: `${FEC_SEARCH}${encodeURIComponent("Monica De La Cruz")}`,
    financeLabel: "Federal Election Commission candidate records",
    newsKeywords: ["Monica De La Cruz", "Congresswoman De La Cruz", "Texas District 15"],
    sources: [{ label: "Official House biography", url: "https://delacruz.house.gov/about/" }, { label: "Official House directory and committees", url: "https://www.house.gov/representatives" }, { label: "Congressional Biographical Directory", url: "https://bioguide.congress.gov/scripts/biodisplay.pl?index=D000594" }],
  },
];

export function getRepresentativeAuthority(slug: string) {
  return REPRESENTATIVE_AUTHORITY.find((profile) => profile.slug === slug);
}

/** Current 119th Congress assignments, reviewed against House.gov on 2026-07-30. */
export const US_HOUSE_COMMITTEES: Record<string, string[]> = {
  "nathaniel-moran": ["Ethics", "Ways and Means", "Select Committee on the Strategic Competition Between the United States and the Chinese Communist Party"],
  "dan-crenshaw": ["Energy and Commerce", "Intelligence"],
  "keith-self": ["Foreign Affairs", "Science, Space, and Technology", "Veterans' Affairs"],
  "pat-fallon": ["Armed Services", "Oversight and Government Reform", "Intelligence"],
  "lance-gooden": ["Armed Services", "Judiciary"],
  "jake-ellzey": ["Appropriations", "Small Business"],
  "lizzie-fletcher": ["Energy and Commerce"],
  "morgan-luttrell": ["Armed Services", "Homeland Security", "Veterans' Affairs"],
  "al-green": ["Financial Services", "Homeland Security"],
  "michael-mccaul": ["Foreign Affairs", "Homeland Security"],
  "august-pfluger": ["Homeland Security", "Energy and Commerce"],
  "craig-goldman": ["Energy and Commerce"],
  "ronny-jackson": ["Agriculture", "Armed Services", "Foreign Affairs", "Intelligence"],
  "randy-weber": ["Energy and Commerce", "Science, Space, and Technology"],
  "monica-de-la-cruz": ["Agriculture", "Financial Services"],
  "veronica-escobar": ["Appropriations", "Budget"],
  "pete-sessions": ["Financial Services", "Oversight and Government Reform"],
  "christian-menefee": ["Oversight and Government Reform", "Science, Space, and Technology"],
  "jodey-arrington": ["Budget", "Ways and Means"],
  "joaquin-castro": ["Foreign Affairs", "Intelligence"],
  "chip-roy": ["Budget", "Judiciary", "Rules"],
  "troy-nehls": ["Judiciary", "Transportation and Infrastructure", "Select Subcommittee to Investigate the Remaining Questions Surrounding January 6, 2021"],
  "beth-van-duyne": ["Small Business", "Ways and Means"],
  "roger-williams": ["Financial Services", "Small Business"],
  "brandon-gill": ["Budget", "Oversight and Government Reform", "Judiciary"],
  "michael-cloud": ["Appropriations", "Oversight and Government Reform"],
  "henry-cuellar": ["Appropriations"],
  "sylvia-garcia": ["Financial Services", "Ethics"],
  "jasmine-crockett": ["Oversight and Government Reform", "Judiciary", "Select Subcommittee to Investigate the Remaining Questions Surrounding January 6, 2021"],
  "john-carter": ["Appropriations"],
  "julie-johnson": ["Foreign Affairs", "House Administration", "Homeland Security", "Joint Committee of Congress on the Library"],
  "marc-veasey": ["Energy and Commerce"],
  "vicente-gonzalez": ["Financial Services"],
  "greg-casar": ["Education and Workforce", "Oversight and Government Reform"],
  "brian-babin": ["Transportation and Infrastructure", "Science, Space, and Technology"],
  "lloyd-doggett": ["Budget", "Joint Committee on Taxation", "Ways and Means"],
  "wesley-hunt": ["Natural Resources", "Judiciary"],
};

export function getHouseCommitteeAssignments(slug: string) {
  return US_HOUSE_COMMITTEES[slug] ?? [];
}
