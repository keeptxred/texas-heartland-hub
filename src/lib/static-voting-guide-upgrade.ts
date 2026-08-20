type VotingGuideSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  [key: string]: unknown;
};

type VotingGuideBody = {
  updated?: string;
  intro?: string[];
  sections?: VotingGuideSection[];
  [key: string]: unknown;
};

const INTRO_FINGERPRINT = "This is the Keep TX Red voter guide for 2026";

const CALENDAR: VotingGuideSection = {
  heading: "The 2026 Calendar",
  paragraphs: [
    "Texas voters encounter several different election calendars in 2026. The March party primaries, May primary runoffs, May local uniform elections and November general election each have separate registration, mail-ballot and early-voting deadlines. The dates below are the statewide dates published by the Texas Secretary of State; local election authorities may add local contests and publish location-specific voting hours and sites.",
    "For the November 3 general election, the registration deadline is October 5, the deadline for the early-voting clerk to receive an application for ballot by mail is October 23, and in-person early voting runs October 19 through October 30. Do not treat a postmark as enough for a mail-ballot application: the application deadline is a received-by deadline.",
  ],
  bullets: [
    "Saturday, November 8, 2025 — first day Republican or Democratic Party candidates may file an application for a place on the 2026 primary ballot.",
    "Monday, February 2, 2026 — last day to register for the March 3 primary election.",
    "Tuesday, February 17 – Friday, February 27, 2026 — early voting by personal appearance for the March primary.",
    "Tuesday, March 3, 2026 — Republican and Democratic primary Election Day.",
    "Monday, April 27, 2026 — last day to register for the May 26 primary runoff.",
    "Saturday, May 2, 2026 — spring uniform election date used by many cities, school districts and other local political subdivisions.",
    "Monday, May 18 – Friday, May 22, 2026 — early voting by personal appearance for the primary runoff.",
    "Tuesday, May 26, 2026 — primary runoff Election Day.",
    "Monday, October 5, 2026 — last day to register for the November 3 general election.",
    "Monday, October 19, 2026 — first day of in-person early voting for the November general election.",
    "Friday, October 23, 2026 — deadline for the early-voting clerk to receive an application for ballot by mail for the November general election.",
    "Friday, October 30, 2026 — last day of in-person early voting for the November general election.",
    "Tuesday, November 3, 2026 — general Election Day; statewide polling places are open 7:00 a.m. to 7:00 p.m.",
  ],
};

const REGISTRATION: VotingGuideSection = {
  heading: "How to Register — and How to Verify It",
  paragraphs: [
    "Texas does not offer same-day voter registration. A registration application must become effective by the statutory deadline for the election you want to vote in, so waiting until the last week creates unnecessary risk. New voters should use the Texas Secretary of State voter-registration application or obtain one from a county voter registrar, then follow the submission instructions on the official form. If you recently moved, changed your name or are unsure whether a prior application was processed, check your record before the deadline instead of assuming it carried forward correctly.",
    "The Secretary of State's My Voter Portal is the best statewide starting point for confirming registration status, county, precinct and voter information. Your county voter registrar is the authoritative local office when the portal does not reflect a recent change or when your eligibility record needs review. Keep a copy or photo of a submitted application and note when and how it was delivered, especially close to a deadline.",
    "Basic eligibility includes United States citizenship, Texas residence in the county of registration and being at least 18 years old on Election Day. Texas law also contains rules involving final felony convictions and court determinations of mental incapacity. Those situations can be fact-specific; use the Secretary of State and your county registrar rather than relying on a social-media summary.",
  ],
  bullets: [
    "Check your registration status before every major election at the Texas Secretary of State My Voter Portal.",
    "If you move within Texas, update your registration promptly; do not assume a driver's-license address change alone resolves every voter-registration issue.",
    "If you moved shortly before an election or your record appears wrong, contact the county voter registrar for the county tied to your residence.",
    "Registration deadlines are separate from ballot-by-mail application deadlines and early-voting dates.",
  ],
};

const ID: VotingGuideSection = {
  heading: "Accepted Photo ID, Supporting ID and the Reasonable Impediment Process",
  paragraphs: [
    "Texas asks an in-person voter to present one of seven acceptable forms of photo identification unless the voter has a permanent exemption shown on the voter-registration record. For voters ages 18 through 69, an otherwise acceptable photo ID generally may be expired by no more than four years. For voters 70 or older, an otherwise acceptable photo ID may be expired for any length of time. A United States Citizenship Certificate with a photograph does not expire.",
    "A voter who does not possess an acceptable photo ID and cannot reasonably obtain one may be able to vote a regular ballot by presenting an approved supporting document and completing a Reasonable Impediment Declaration. That process is different from simply forgetting an ID that the voter still possesses. If you possess acceptable photo ID but leave it at home, election officials can explain the options available, including returning with the ID or voting provisionally and curing the ID issue within the statutory period.",
    "The supporting-document route is not a substitute list of ordinary photo IDs. The Secretary of State lists documents such as a voter-registration certificate, qualifying government document showing name and address, current utility bill, bank statement, government check, paycheck, or qualifying birth document. Election workers should apply the official procedure; voters should not be required to invent or defend a political explanation for the reasonable impediment.",
  ],
  bullets: [
    "Texas Driver License issued by DPS.",
    "Texas Election Identification Certificate issued by DPS.",
    "Texas Personal Identification Card issued by DPS.",
    "Texas Handgun License issued by DPS.",
    "United States Military Identification Card containing the voter's photograph.",
    "United States Citizenship Certificate containing the voter's photograph.",
    "United States Passport book or card.",
  ],
};

const MAIL: VotingGuideSection = {
  heading: "Mail Ballots: Eligibility, Application and Return Rules",
  paragraphs: [
    "Texas does not provide universal no-excuse voting by mail. A voter must qualify under a statutory eligibility category, submit the appropriate application to the early-voting clerk and then follow the identification and return instructions that accompany the ballot. The application deadline is based on when the early-voting clerk receives the application, not merely when the voter puts it in the mail.",
    "For the November 3, 2026 general election, the early-voting clerk must receive an Application for Ballot by Mail by Friday, October 23. A domestic mail ballot that is not postmarked must generally be received by 7:00 p.m. on Election Day; a qualifying ballot postmarked by the Election Day deadline can generally arrive by the next business day's statutory deadline. Military and overseas voters can be subject to different federal-postcard and receipt rules, so those voters should use the Secretary of State's military/overseas guidance rather than the ordinary domestic timetable.",
    "Read the carrier-envelope instructions before sealing it. Texas mail-ballot materials require identifying information under the privacy flap, and a mismatch with the identifying information associated with the voter record can create a cure issue. Use the state's ballot tracker after returning the ballot and respond promptly if the county contacts you about a correctable defect.",
  ],
  bullets: [
    "Age 65 or older on Election Day.",
    "Sick or disabled under the Texas Election Code standard.",
    "Expected to give birth within three weeks before or after Election Day.",
    "Absent from the county of registration during the entire in-person early-voting period and on Election Day.",
    "Civilly committed under Chapter 841 of the Texas Health and Safety Code.",
    "Confined in jail, but otherwise eligible to vote.",
  ],
};

const PRIMARY: VotingGuideSection = {
  heading: "Primaries, Party Affiliation and Runoffs",
  paragraphs: [
    "Texas does not register voters by political party. A registered voter chooses which party primary to participate in when voting in a primary election, subject to Texas affiliation rules for that election year. A voter may not vote in both parties' primaries in the same election cycle, and participation in a party primary can affect which party's runoff the voter may participate in. If a primary contest does not produce the result required to nominate a candidate, the top qualifying candidates proceed to the May 26 runoff.",
    "Do not assume the November ballot tells the whole story of political competition. In districts where one party has a large structural advantage, a primary or runoff can be the most competitive stage. In other districts the general election is highly competitive. The useful rule for a voter is simpler: review the actual contests on the ballot available to your address at every stage rather than waiting for November.",
    "Local elections can run on a different calendar from the party primaries. Cities, school districts and special districts frequently use a uniform election date and may have nonpartisan ballots. Party-primary participation does not replace those local elections, and a local ballot can contain tax, bond, trustee, council or district questions with major household impact.",
  ],
  bullets: [
    "March 3: primary Election Day.",
    "May 26: primary runoff Election Day for contests requiring a runoff.",
    "Texas has no permanent party-registration field on the voter roll.",
    "Always check the exact ballot for your address; statewide race lists do not show every local contest.",
  ],
};

const POLLING: VotingGuideSection = {
  heading: "Where to Vote: Early Voting, Countywide Centers and Precinct Sites",
  paragraphs: [
    "Polling locations can change between elections, and early-voting locations are not necessarily the same places used on Election Day. The Secretary of State's My Voter Portal and the county elections office should be your final checks. For a major election, verify the location again shortly before leaving home because counties can update sites, hours or emergency arrangements.",
    "Counties participating in the Countywide Polling Place Program may allow registered voters to vote at any open countywide Election Day vote center. Counties that do not participate generally require voters to use the precinct location assigned to their residence, although precincts can be combined for particular elections. Do not infer countywide voting merely because a neighboring county uses it.",
    "Election Day polling places statewide are open from 7:00 a.m. to 7:00 p.m. A voter in line at the closing time should remain in line and follow election-worker instructions. Early-voting schedules vary by county and election, so use the county's official early-voting notice for exact hours. Allow extra time for parking, a line, ballot check-in and reviewing a long local ballot.",
  ],
  bullets: [
    "Confirm whether your county uses countywide Election Day vote centers or assigned precinct voting.",
    "Check early-voting sites separately from Election Day sites.",
    "Use the county election office for local changes and the Texas My Voter Portal as the statewide lookup starting point.",
    "If a location is unexpectedly closed or inaccessible, contact the county elections office before leaving the area or giving up on voting.",
  ],
};

const PROVISIONAL: VotingGuideSection = {
  heading: "If Something Goes Wrong at Check-In: Provisional Ballots and Cures",
  paragraphs: [
    "A check-in problem does not automatically mean you should leave without voting. Texas provisional-ballot procedures exist for situations in which eligibility, registration or identification cannot be resolved immediately at the polling place. The provisional ballot is kept separately while election officials research whether it can be counted.",
    "Photo-ID problems can require action after Election Day. The Secretary of State explains that a voter using the provisional process for an ID issue generally has six calendar days after the election to present acceptable identification or complete another qualifying cure step at the county voter registrar's office. Other provisional-ballot issues can involve different facts, so ask the election judge what the specific problem is and what follow-up is required before you leave.",
    "If your name is missing from the poll list, first confirm that the poll worker searched the correct spelling and record. If you have a voter-registration certificate or other useful documentation, present it. If the issue cannot be resolved, ask about the provisional process and obtain the written information explaining how to determine whether the ballot was counted.",
  ],
  bullets: [
    "Do not assume a poll-list mismatch is final; ask the election worker to identify the exact issue.",
    "If offered a provisional ballot, ask what cure or documentation is required and the deadline for providing it.",
    "Keep any provisional-ballot notice or receipt supplied at the polling place.",
    "For an ID-related provisional ballot, act immediately rather than waiting until the sixth-day deadline.",
  ],
};

const BALLOT: VotingGuideSection = {
  heading: "How to Find Your Actual Ballot and Districts",
  paragraphs: [
    "A Texas voter's ballot is built from overlapping jurisdictions. Two people in the same ZIP code can have different congressional, Texas House, Texas Senate, county-precinct, school-district, city, municipal-utility-district or special-district contests. That is why a generic statewide candidate list is useful for orientation but cannot substitute for an address-specific official sample ballot.",
    "Start with your voter-registration record and county elections office. Counties publish sample ballots or ballot-style tools as an election approaches. Use those official materials to identify every race and proposition attached to your address. For state and federal legislative districts, Texas Legislature Online and official district lookup tools can help confirm district numbers. Keep TX Red's Find My Races tool is a convenient layer for major tracked races, but it deliberately does not claim to be your complete local ballot.",
    "Read propositions carefully. A local bond proposition, tax-rate election, school measure or constitutional amendment can have legal and financial effects that are not obvious from a short label. Use the full proposition text, explanatory materials from the relevant government and any required voter-information documents before deciding how to vote.",
  ],
  bullets: [
    "Confirm your congressional, Texas House and Texas Senate districts.",
    "Check county offices and commissioner/justice precinct contests.",
    "Check city and school-district contests, which may use place, ward, at-large or trustee-district systems.",
    "Check MUD, water, hospital, emergency-services and other special-district contests that may apply only to part of a county.",
    "Review every proposition and measure on the official sample ballot for your address.",
  ],
};

const ACCESS: VotingGuideSection = {
  heading: "Accessibility, Assistance and Curbside Voting",
  paragraphs: [
    "Texas election procedures include accommodations for voters who need assistance or cannot physically enter a polling place without personal assistance or a likelihood of injury. County election offices publish accessibility information, and polling places are required to provide accessible voting options. If you know you will need an accommodation, contacting the county elections office before voting can prevent confusion and help identify the most suitable location and procedure.",
    "Voters who need help reading or marking a ballot may have assistance rights subject to Texas and federal rules. Assistance is regulated, and the person providing assistance can be required to complete forms or take an oath. Because the rules distinguish lawful voter assistance from prohibited influence, ask an election worker to follow the official process rather than improvising inside the voting booth.",
    "Curbside voting is not simply a convenience pickup lane. It is an accommodation for a voter who is physically unable to enter the polling place without personal assistance or likelihood of injury. Procedures and wait times can vary, so use the county's instructions or call the posted polling-place number when available.",
  ],
  bullets: [
    "Contact the county elections office before Election Day if you need a specific accessibility accommodation.",
    "Ask election workers to use the formal assistance procedure if you need help reading or marking the ballot.",
    "Use curbside voting only under the applicable eligibility standard and follow the polling place's posted process.",
    "Report an accessibility barrier to the election judge and county election authority while there is still time to correct it.",
  ],
};

const LOCAL: VotingGuideSection = {
  heading: "Local Elections Matter — and They Are Easy to Miss",
  paragraphs: [
    "Texas voters often focus on governor, Congress and the Legislature while overlooking elections that directly shape property taxes, school governance, municipal services, bonds, water infrastructure and public safety. Cities, independent school districts, counties and special districts can each place candidates or propositions before voters, sometimes on dates when there is no major statewide race drawing attention.",
    "A municipal utility district or other special-purpose district may cover only a neighborhood-scale geography, while a school trustee district may cross familiar city or ZIP-code boundaries. Local ballot language can also differ from campaign shorthand. Before early voting begins, read the official sample ballot and identify every governing body represented on it. If a proposition authorizes debt or changes a tax rate, review the official notice and financial terms rather than relying solely on campaign mailers from either side.",
    "The May uniform election date is particularly important for local contests, but local special elections can also occur when authorized by law. Your county elections office, city secretary, school district and relevant special district are the authoritative sources for the contests they administer.",
  ],
  bullets: [
    "City council, mayoral and charter questions.",
    "School-board trustee elections and school bond or tax propositions.",
    "County and precinct offices when on the cycle.",
    "Municipal utility, water, hospital, emergency-services and other special-district races or measures.",
    "Special elections ordered to fill vacancies or decide measures outside the regular cycle.",
  ],
};

const CHECKLIST: VotingGuideSection = {
  heading: "A Practical 2026 Voting Checklist",
  paragraphs: [
    "The easiest way to avoid an Election Day problem is to complete the administrative work well before voting begins. Treat voting like any other deadline-driven civic task: verify the record, identify the ballot, choose a voting plan and keep enough time to correct an error. The checklist below is intentionally nonpartisan; it is about making sure an eligible Texas voter can cast the ballot the voter intends to cast.",
    "If you use this guide months after it was published, always compare the date-sensitive item to the Texas Secretary of State or your county elections office. Emergency court orders, weather events, polling-place changes or election-specific notices can affect procedures after an evergreen article is written. Keep TX Red updates this guide when official statewide rules or dates change, but the local election authority remains the final source for your local ballot and polling arrangements.",
  ],
  bullets: [
    "At least a month before the deadline: verify registration, residence address, county and name on the voter record.",
    "Before early voting: download or review the official sample ballot for your address and research every contest and proposition.",
    "Choose whether you will vote early or on Election Day and verify the correct official location and hours.",
    "Prepare an acceptable photo ID, or understand the supporting-ID/Reasonable Impediment process if you do not possess and cannot reasonably obtain one.",
    "If voting by mail, apply before the received-by deadline, follow the carrier-envelope ID instructions exactly and track the returned ballot.",
    "If a check-in problem occurs, ask for the election judge and understand the provisional-ballot/cure options before leaving.",
    "After voting, keep any provisional or mail-ballot cure notice and respond before the stated deadline.",
  ],
};

const SOURCES: VotingGuideSection = {
  heading: "Official Sources and Verification Links",
  paragraphs: [
    "Use primary sources for deadlines and procedures. The Texas Secretary of State administers statewide election guidance; county voter registrars maintain registration records; county election offices publish local polling places and sample ballots; and the Texas Election Code controls the legal framework. This guide summarizes those rules but does not replace an official election notice or individualized legal advice.",
  ],
  bullets: [
    "Texas Secretary of State voter information: https://www.votetexas.gov/",
    "Texas Secretary of State 2026 important election dates: https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml",
    "Texas Secretary of State candidate/election calendar: https://www.sos.state.tx.us/elections/candidates/guide/2026/dates2026.shtml",
    "Application for Ballot by Mail guidance: https://www.sos.state.tx.us/elections/voter/reqabbm.shtml",
    "VoteTexas polling-place guidance and My Voter Portal links: https://www.votetexas.gov/voting/where.html",
    "VoteTexas voter-ID FAQ and Reasonable Impediment guidance: https://www.votetexas.gov/faq/index.html",
    "Texas Election Code: https://statutes.capitol.texas.gov/Docs/EL/htm/EL.1.htm",
  ],
};

const REPLACEMENTS = new Map<string, VotingGuideSection>([
  ["The 2026 Calendar", CALENDAR],
  ["How to Register", REGISTRATION],
  ["Accepted Photo ID at the Polls", ID],
  ["Mail Ballots: Limited and Specific", MAIL],
  ["Primary vs. General: Why March Decides Most Texas Races", PRIMARY],
  ["How to Find Your Polling Place", POLLING],
  ["Find Your Districts and Representatives", BALLOT],
  ["Official Sources", SOURCES],
]);

const ADDITIONAL_SECTIONS = [PROVISIONAL, ACCESS, LOCAL, CHECKLIST] as const;

export function applyVotingGuide2026Upgrade<T extends VotingGuideBody>(body: T): T {
  const isGuide = body.intro?.some((paragraph) => paragraph.includes(INTRO_FINGERPRINT))
    && body.sections?.some((section) => section.heading === "The 2026 Calendar")
    && body.sections?.some((section) => section.heading?.startsWith("Mail Ballots"));
  if (!isGuide) return body;

  const seen = new Set<string>();
  const sections = (body.sections ?? []).map((section) => {
    const heading = section.heading ?? "";
    const exact = REPLACEMENTS.get(heading);
    const replacement = exact ?? (heading.startsWith("Mail Ballots") ? MAIL : undefined);
    if (!replacement) return section;
    if (replacement.heading) seen.add(replacement.heading);
    return replacement;
  });

  for (const section of [...REPLACEMENTS.values(), ...ADDITIONAL_SECTIONS]) {
    if (!section.heading || seen.has(section.heading)) continue;
    if (sections.some((existing) => existing.heading === section.heading)) continue;
    sections.push(section);
    seen.add(section.heading);
  }

  return {
    ...body,
    updated: "2026-08-20",
    intro: [
      "This is the Keep TX Red voter guide for 2026 — a practical, source-backed guide to registration, identification, early voting, mail ballots, primaries and runoffs, polling places, provisional ballots, local elections and finding the complete ballot tied to your Texas address.",
      "Texas election administration is decentralized: the Secretary of State publishes statewide rules and dates, while counties administer registration records, polling places and local ballot styles. Use this guide to understand the system, then verify time-sensitive and address-specific details with the official source linked in the final section.",
    ],
    sections,
  } as T;
}
