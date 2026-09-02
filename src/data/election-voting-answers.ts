export type VotingAnswerLink = { label: string; href: string; external?: boolean };
export type VotingAnswerSection = { heading: string; paragraphs: string[]; links?: VotingAnswerLink[] };
export type VotingAnswerFaq = { question: string; answer: string };

export type VotingAnswerPageData = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  quickAnswer: string;
  updated: string;
  sections: VotingAnswerSection[];
  faq: VotingAnswerFaq[];
  sources: Array<{ name: string; url: string; note?: string }>;
};

const MY_VOTER_PORTAL = "https://goelect.txelections.civixapps.com/ivis-mvp-ui/";
const VOTE_TEXAS_WHERE = "https://www.votetexas.gov/voting/where.html";
const VOTE_TEXAS_ID = "https://www.votetexas.gov/voting/need-id.html";
const VOTE_TEXAS_CERTIFICATE = "https://www.votetexas.gov/register-to-vote/voter-registration-certificate.html";
const COUNTY_ELECTION_OFFICES = "https://www.sos.state.tx.us/elections/voter/county.shtml";

export const POLLING_HOURS_ANSWER: VotingAnswerPageData = {
  slug: "polling-hours",
  title: "What Time Do Polls Open in Texas?",
  metaTitle: "What Time Do Polls Open in Texas? Election Day & Early Voting Hours | KeepTXRed",
  description: "Texas Election Day polls are open from 7 a.m. to 7 p.m. Early-voting hours vary by date and location. Use official Texas and county resources to verify where and when to vote.",
  quickAnswer: "On Election Day, Texas polling places are open from 7:00 a.m. to 7:00 p.m. Early-voting hours are not one statewide schedule: they vary by date and location, so confirm the current hours through the Texas My Voter Portal or your county election office before you go.",
  updated: "September 1, 2026",
  sections: [
    {
      heading: "Election Day hours are 7 a.m. to 7 p.m.",
      paragraphs: ["VoteTexas states that Election Day polling places in Texas are open from 7:00 a.m. until 7:00 p.m. Local election officials determine the specific polling locations, so verify the address as well as the hours before traveling."],
      links: [{ label: "VoteTexas: Where's my polling place?", href: VOTE_TEXAS_WHERE, external: true }],
    },
    {
      heading: "Early-voting hours vary",
      paragraphs: ["Texas does not use one universal set of early-voting hours for every location and every day. VoteTexas directs voters to official local information for the dates, locations and hours that apply in their county."],
      links: [{ label: "Texas My Voter Portal", href: MY_VOTER_PORTAL, external: true }, { label: "Texas county election offices", href: COUNTY_ELECTION_OFFICES, external: true }],
    },
    {
      heading: "Verify the schedule close to the election",
      paragraphs: ["Election schedules and locations can change between elections. Check the official voter portal or county election authority near the time you plan to vote rather than relying on an old sample ballot, social post or search-result snippet."],
      links: [{ label: "Texas voting dates and ballot research", href: "/elections/voting" }],
    },
  ],
  faq: [
    { question: "What time do Texas polls open on Election Day?", answer: "Texas Election Day polling places open at 7:00 a.m." },
    { question: "What time do Texas polls close on Election Day?", answer: "Texas Election Day polling places close at 7:00 p.m." },
    { question: "Are early-voting hours the same everywhere in Texas?", answer: "No. Early-voting hours vary by date and location. Confirm the current schedule through the Texas My Voter Portal or your county election office." },
  ],
  sources: [
    { name: "VoteTexas — Where's my polling place?", url: VOTE_TEXAS_WHERE, note: "Official Texas Secretary of State guidance for polling locations and Election Day hours." },
    { name: "Texas My Voter Portal", url: MY_VOTER_PORTAL, note: "Official voter-specific polling and election information." },
    { name: "Texas county election offices", url: COUNTY_ELECTION_OFFICES, note: "Official local election authority directory." },
  ],
};

export const VOTER_REGISTRATION_CARD_ANSWER: VotingAnswerPageData = {
  slug: "voter-registration-card",
  title: "Do I Need My Voter Registration Card to Vote in Texas?",
  metaTitle: "Do I Need My Voter Registration Card to Vote in Texas? | KeepTXRed",
  description: "Texas voters generally do not need the physical voter registration certificate when they have acceptable voter ID, but the certificate can matter in specific identification situations.",
  quickAnswer: "A registered Texas voter generally does not need to bring the physical voter registration certificate just to vote. In-person voters who possess an acceptable form of photo ID should present it. A voter registration certificate is also one of the supporting documents that may be used with a Reasonable Impediment Declaration when a voter does not possess and cannot reasonably obtain an acceptable photo ID.",
  updated: "September 1, 2026",
  sections: [
    {
      heading: "The certificate is not the normal in-person photo ID",
      paragraphs: ["Texas's in-person voter-identification rules center on the acceptable photo-ID categories published by the Secretary of State. If you possess one of those acceptable forms, that is what the state instructs you to present at the polling place."],
      links: [{ label: "VoteTexas voter ID requirements", href: VOTE_TEXAS_ID, external: true }],
    },
    {
      heading: "The voter registration certificate can still be useful",
      paragraphs: ["VoteTexas lists the voter registration certificate among the supporting identification documents for a voter who does not possess an acceptable photo ID and cannot reasonably obtain one. That process also requires completing a Reasonable Impediment Declaration at the polling place."],
      links: [{ label: "VoteTexas supporting-ID guidance", href: VOTE_TEXAS_ID, external: true }],
    },
    {
      heading: "Your certificate also contains precinct information",
      paragraphs: ["The Texas Secretary of State explains that the voter registration certificate contains information including the voter's precinct. Polling locations can change or be consolidated, however, so use current official election information instead of treating an older certificate as the final word on where to vote."],
      links: [{ label: "VoteTexas voter registration certificate guide", href: VOTE_TEXAS_CERTIFICATE, external: true }, { label: "Where is my Texas polling place?", href: "/elections/voting/polling-place" }],
    },
  ],
  faq: [
    { question: "Can I vote in Texas without my voter registration card?", answer: "Generally, yes, if you are registered and meet the identification requirements that apply to you. The physical voter registration certificate is not the normal photo ID for a voter who possesses an acceptable form of photo identification." },
    { question: "Can a Texas voter registration certificate be used as supporting ID?", answer: "Yes. VoteTexas lists it as one of the supporting documents that may be used with a Reasonable Impediment Declaration when the voter does not possess and cannot reasonably obtain an acceptable photo ID." },
    { question: "Should I use my voter registration card to find my polling place?", answer: "It can show precinct information, but polling places may change or be combined. Verify the current location through the Texas My Voter Portal or your county election office." },
  ],
  sources: [
    { name: "VoteTexas — Identification Requirements for Voting", url: VOTE_TEXAS_ID, note: "Official Texas Secretary of State voter-identification guidance." },
    { name: "VoteTexas — Voter Registration Certificate", url: VOTE_TEXAS_CERTIFICATE, note: "Official explanation of the Texas voter registration certificate." },
    { name: "Texas My Voter Portal", url: MY_VOTER_PORTAL, note: "Official voter-specific status and election information." },
  ],
};

export const POLLING_PLACE_ANSWER: VotingAnswerPageData = {
  slug: "polling-place",
  title: "Where Is My Texas Polling Place?",
  metaTitle: "Where Is My Texas Polling Place? Official Texas Voter Lookup Guide | KeepTXRed",
  description: "Use the official Texas My Voter Portal or your county election office to find current polling locations. Early-voting and Election Day location rules differ by county.",
  quickAnswer: "Use the Texas My Voter Portal or your county election office to confirm your current polling location. During early voting, VoteTexas says you may vote at any early-voting location in your county. On Election Day, counties using the Countywide Polling Place Program allow voting at any county vote center; other counties may assign voters to a specific precinct location.",
  updated: "September 1, 2026",
  sections: [
    {
      heading: "Start with the Texas My Voter Portal",
      paragraphs: ["The Texas Secretary of State's My Voter Portal is the official voter-specific lookup for registration and election information. VoteTexas notes that polling-place information is populated close to an election, so a location may not appear far in advance."],
      links: [{ label: "Texas My Voter Portal", href: MY_VOTER_PORTAL, external: true }, { label: "VoteTexas polling-place guidance", href: VOTE_TEXAS_WHERE, external: true }],
    },
    {
      heading: "Early voting: any early-voting location in your county",
      paragraphs: ["VoteTexas states that during the early-voting period you may vote at any early-voting location in the county where you are registered. Locations and daily hours are set locally, so check the official list for the election you are voting in."],
      links: [{ label: "Texas county election offices", href: COUNTY_ELECTION_OFFICES, external: true }],
    },
    {
      heading: "Election Day rules depend on the county's polling model",
      paragraphs: ["If your county participates in the Countywide Polling Place Program, often called vote centers, VoteTexas says you may vote at any Election Day polling place in that county. In counties that do not use countywide polling, voters may be assigned to a specific precinct polling place."],
      links: [{ label: "VoteTexas: Election Day locations", href: VOTE_TEXAS_WHERE, external: true }],
    },
    {
      heading: "Do not rely on an old location",
      paragraphs: ["Polling places can move between elections, and counties can consolidate locations. Confirm the current address and hours shortly before voting through the official portal or county election authority."],
      links: [{ label: "What time do Texas polls open?", href: "/elections/voting/polling-hours" }, { label: "Texas voting hub", href: "/elections/voting" }],
    },
  ],
  faq: [
    { question: "Can I vote anywhere in my Texas county during early voting?", answer: "VoteTexas says a registered voter may vote at any early-voting location in the county during the early-voting period." },
    { question: "Can I vote anywhere in my Texas county on Election Day?", answer: "Only if the county uses the Countywide Polling Place Program. Otherwise, you may be assigned to a particular precinct polling place." },
    { question: "Why is my polling place not showing yet?", answer: "VoteTexas notes that polling-place information is populated close to the election. Check again nearer Election Day and use your county election office for current local information." },
  ],
  sources: [
    { name: "VoteTexas — Where's my polling place?", url: VOTE_TEXAS_WHERE, note: "Official statewide guidance on early-voting and Election Day polling locations." },
    { name: "Texas My Voter Portal", url: MY_VOTER_PORTAL, note: "Official voter-specific polling and election information." },
    { name: "Texas county election offices", url: COUNTY_ELECTION_OFFICES, note: "Official local election authority directory." },
  ],
};
