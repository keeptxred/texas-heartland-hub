type VotingGuideBody = {
  updated?: string;
  intro?: string[];
  sections?: Array<{ heading?: string; paragraphs?: string[]; bullets?: string[]; [key: string]: unknown }>;
  [key: string]: unknown;
};

const INTRO_FINGERPRINT = "This is the Keep TX Red voter guide for 2026";
const REVIEWED = "2026-11-24";
const CALENDAR = "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml";
const PRIMARY_DATES = "https://www.sos.state.tx.us/elections/candidates/guide/2026/dates2026.shtml";
const REGISTRATION = "https://www.votetexas.gov/register-to-vote/";
const REGISTRATION_UPDATE = "https://www.votetexas.gov/register-to-vote/update-voter-registration.html";
const VOTER_ID = "https://www.votetexas.gov/voting/need-id";
const MAIL_ELIGIBILITY = "https://www.votetexas.gov/voting-by-mail/eligibility-requirements.html";
const COUNTYWIDE = "https://www.sos.state.tx.us/elections/laws/countywide-polling-place-program.shtml";
const RESULTS = "https://www.sos.state.tx.us/elections/historical/elections-results-archive.shtml";

export function applyVotingGuide2026Upgrade<T extends VotingGuideBody>(body: T): T {
  const isGuide = body.intro?.some(paragraph => paragraph.includes(INTRO_FINGERPRINT))
    && body.sections?.some(section => section.heading === "The 2026 Calendar")
    && body.sections?.some(section => section.heading?.startsWith("Mail Ballots"));
  if (!isGuide) return body;
  return {
    ...body,
    updated: REVIEWED,
    editorNote: "Historical 2026 election calendar, reviewed November 24, 2026 against official Texas election records. For future elections use the current registration and county election resources, not an elapsed deadline.",
    intro: [
      "Texas held its 2026 party primaries on March 3, primary runoffs on May 26 and general election for state and county officers on November 3. Those dates have passed. This guide preserves the 2026 timetable and explains how registration, identification, mail ballots and polling locations fit together.",
      "For an upcoming election, start with [Texas voter registration](/register-to-vote), [county election offices](/county-elections) and the [official election calendar](" + CALENDAR + "). For research about the completed 2026 contests, use the [state election results archive](" + RESULTS + "). Local runoff and special-election schedules can differ."
    ],
    sections: [
      {
        heading: "The 2026 Calendar",
        paragraphs: ["These dates describe the historical statewide primary and general-election cycle. They are not registration or voting deadlines for future elections. Candidate filing dates are included to distinguish when a candidate can seek a ballot place from when a resident must register to vote."],
        bullets: [
          "Saturday, November 8, 2025 — first day Republican or Democratic Party candidates may file an application for a place on the 2026 primary ballot.",
          "Monday, December 8, 2025 — primary candidate filing deadline at 6 p.m.",
          "Monday, February 2, 2026 — primary registration deadline.",
          "Tuesday, February 17 – Friday, February 27, 2026 — early voting by personal appearance for the March primary.",
          "Tuesday, March 3, 2026 — general primary.",
          "Saturday, May 2, 2026 — limited uniform election date for eligible local elections.",
          "Tuesday, May 26, 2026 — primary runoff.",
          "Monday, October 5, 2026 — registration deadline for the November general election.",
          "Monday, October 19 – Friday, October 30, 2026 — general-election early voting.",
          "Tuesday, November 3, 2026 — general election."
        ]
      },
      {
        heading: "How to Register",
        paragraphs: [
          "Texas generally requires an eligible resident to register in the county of residence by the 30th day before the election; weekends and legal holidays can affect the deadline. The ordinary standalone application must be completed, printed, signed and submitted to the registrar. A properly mailed application has statutory submission and postmark rules; it is not always required to arrive 30 days in advance.",
          "There are limited electronic pathways: qualifying driver-license or state-ID renewals, replacements and updates through DPS can include a registration option. Existing registered voters can use the official state service to change their name or address. See [the detailed Texas voter registration guide](/news/texas-voter-registration-guide) and the [state update service guidance](" + REGISTRATION_UPDATE + ").",
          "Age, citizenship, county residence and individual legal eligibility matter. Applicants may register from age 17 years and 10 months but cannot vote until age 18. A final felony conviction can affect eligibility until the full sentence is discharged or other statutory relief applies; particular court findings of incapacity can also affect eligibility. Contact your county registrar about individual circumstances."
        ]
      },
      {
        heading: "Accepted Photo ID at the Polls",
        paragraphs: [
          "A voter who possesses an accepted photo ID generally presents it for in-person voting. Registration and polling-place identification are separate requirements. Texas identifies seven forms: Texas driver license, election identification certificate, personal identification card or handgun license; U.S. military ID with photo; U.S. citizenship certificate with photo; and U.S. passport book or card.",
          "If a voter does not possess and cannot reasonably obtain an accepted photo ID, the Reasonable Impediment Declaration procedure may allow voting with an eligible supporting document. Simply forgetting an ID or losing it does not automatically qualify someone for this alternative.",
          "A provisional ballot may be available if identification requirements are unresolved. Follow the election official's instructions and any applicable six-calendar-day cure period. The [official ID guidance](" + VOTER_ID + ") explains additional procedures for disability exemptions, certain religious objections and qualifying natural disasters."
        ]
      },
      {
        heading: "Mail Ballots: Eligibility and deadlines",
        paragraphs: [
          "Texas mail voting is limited by statute. The eligibility categories below are distinct from ordinary in-person early voting. Check the current [VoteTexas mail-ballot rules](" + MAIL_ELIGIBILITY + ") and the deadline for the election being held."
        ],
        bullets: [
          "Age 65 or older on Election Day.",
          "Sick or disabled under the Texas Election Code standard.",
          "Expected to give birth within three weeks before or after Election Day.",
          "Absent from the county of registration during the entire in-person early-voting period and on Election Day.",
          "Civilly committed under Chapter 841 of the Texas Health and Safety Code.",
          "Confined in jail, but otherwise eligible to vote."
        ]
      },
      {
        heading: "Primary and general elections decide different things",
        paragraphs: [
          "A party primary selects nominees; the general election fills offices among the candidates who qualified for that ballot. A primary runoff may be necessary when no candidate wins the required majority. Texas does not register voters by party, but participating in a party primary generally creates affiliation for that voting year and limits participation in another party's primary or runoff.",
          "Do not assume every general election is uncontested or that a primary winner necessarily takes office. See [primary versus general elections](/news/primary-vs-general-election) for the legal distinction and [the beginner's guide](/news/beginners-guide-texas-elections) for local, special and proposition elections."
        ]
      },
      {
        heading: "Find a polling place and verify your ballot",
        paragraphs: [
          "During ordinary county-administered early voting, voters generally may choose a location serving their election within their county. Election Day rules depend on whether the county is approved for the Countywide Polling Place Program for that particular election and on local arrangements. Check the [official countywide program list](" + COUNTYWIDE + ") and the administering office before relying on a location.",
          "Use [the county election directory](/county-elections) for official offices and sample-ballot links. A city, school district or special district may administer a separate election, and a statewide date does not guarantee a contest at every address."
        ]
      },
      {
        heading: "How to research the completed 2026 election",
        paragraphs: [
          "Use official results to distinguish nominations from election winners and unofficial election-night totals from certified canvasses. Record the exact jurisdiction, office, election date and reporting stage before calculating turnout or comparing results. A statewide aggregate does not establish the result in a particular district.",
          "Start with the state results archive for statewide and legislative contests and the county or local administering authority for local contests. To identify current officeholders, use [find your representative](/find-representative) and official member directories rather than treating a candidate list or historical result as a current office roster."
        ]
      }
    ],
    faq: [
      {q:"Can I use the 2026 dates for a future election?",a:"No. The November 3 general election and its October 5 registration deadline are historical. Use the official calendar for the election in which you are eligible to participate."},
      {q:"Can I register to vote online in Texas?",a:"A standalone new registration generally requires a printed signed application. Qualifying DPS online transactions may include registration; already registered Texans may update eligible information online."},
      {q:"Does voting in a primary require voting for its nominee in the general election?",a:"No. Party affiliation rules apply to primary participation, not to a voter's choice among qualified candidates in the general election."},
      {q:"Can I vote at any polling place in my county on Election Day?",a:"Check whether the county is approved to use countywide polling for that election and whether the location serves your ballot. The county election office has the applicable locations and rules."},
      {q:"Where are official 2026 results?",a:"Use the Secretary of State's results archive for statewide elections and the local election authority's canvass for local contests. Distinguish preliminary results from certified results."}
    ],
    sources: [
      {label:"Secretary of State — important election dates",url:CALENDAR},
      {label:"Secretary of State — 2026 candidate and primary dates",url:PRIMARY_DATES},
      {label:"VoteTexas — registration",url:REGISTRATION},
      {label:"VoteTexas — update voter registration",url:REGISTRATION_UPDATE},
      {label:"VoteTexas — voter identification",url:VOTER_ID},
      {label:"VoteTexas — mail ballot eligibility",url:MAIL_ELIGIBILITY},
      {label:"Secretary of State — countywide polling places",url:COUNTYWIDE},
      {label:"Secretary of State — official election results archive",url:RESULTS}
    ],
    related: ["texas-voter-registration-guide","primary-vs-general-election","beginners-guide-texas-elections"],
    cta: {label:"Find current county election resources",href:"/county-elections"}
  } as T;
}
