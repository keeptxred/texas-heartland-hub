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
];

export function getRepresentativeAuthority(slug: string) {
  return REPRESENTATIVE_AUTHORITY.find((profile) => profile.slug === slug);
}
