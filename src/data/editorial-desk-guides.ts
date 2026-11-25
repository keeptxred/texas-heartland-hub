type DeskSource = { label: string; href: string; use: string };
type DeskGuide = { focus: string; sources: DeskSource[]; references: { label: string; href: string }[] };
const GUIDES: Record<string, DeskGuide> = {
  "energy-desk": {
    focus: "For an electricity claim, identify the grid region, timestamp and units. Compare actual load with forecast load, and instantaneous megawatts with energy over time. An oil or gas permit is not proof of production; use production records and their reporting periods. These distinctions help readers test claims about reliability, supply and regulation without confusing the grid operator with the regulator.",
    sources: [
      { label: "ERCOT grid information", href: "https://www.ercot.com/gridinfo", use: "Operating conditions, outages and load forecasts versus actual demand." },
      { label: "Railroad Commission production records", href: "https://www.rrc.texas.gov/oil-and-gas/research-and-statistics/production-data/", use: "Reported oil and gas production; check the reporting period and possible revisions." },
      { label: "Railroad Commission research queries", href: "https://www.rrc.texas.gov/resource-center/research/research-queries/", use: "Well, permit, pipeline and other regulatory records." },
    ],
    references: [{ label: "How ERCOT and the Texas grid work", href: "/news/texas-grid-ercot-explained" }, { label: "Texas water rights", href: "/news/texas-water-rights-explained" }],
  },
  "education-desk": {
    focus: "Compare school performance within the applicable accountability year and methodology. Separate a district's adopted tax rate from a state-calculated compression rate, and a program appropriation from an individual award. For a board decision, retrieve the agenda, minutes and recorded action from the district instead of inferring policy from a meeting headline.",
    sources: [
      { label: "TEA academic accountability", href: "https://tea.texas.gov/school-and-district-leaders/accountability/academic-accountability/a-f-accountability", use: "Ratings and applicable school-year accountability materials." },
      { label: "TEA school report cards", href: "https://tea.texas.gov/school-and-district-leaders/accountability/academic-accountability/performance-reporting/school-report-cards", use: "Campus performance, accountability and financial context." },
      { label: "Texas Education Freedom Accounts", href: "https://educationfreedom.texas.gov/families/", use: "Official application-cycle, eligibility and award guidance." },
    ],
    references: [{ label: "School board powers", href: "/news/texas-school-board-powers" }, { label: "Education savings accounts", href: "/news/school-choice-esa-guide" }, { label: "District school tax lookup", href: "/news/isd-tax-burdens" }],
  },
  "elections-desk": {
    focus: "Record the election date, jurisdiction and office before comparing returns. Distinguish preliminary results from canvassed or certified totals, a nomination from a general-election victory, and election-night projections from the legal process that determines the result. For a voting deadline, use the current election-specific calendar rather than a previous year's dates.",
    sources: [
      { label: "Secretary of State election calendars", href: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml", use: "Dates and election-specific official guidance." },
      { label: "Secretary of State historical results", href: "https://www.sos.state.tx.us/elections/historical/elections-results-archive.shtml", use: "Historical results; identify the status and scope of the underlying return." },
      { label: "VoteTexas registration guidance", href: "https://www.votetexas.gov/register-to-vote/", use: "Current registration instructions and official voter services." },
    ],
    references: [{ label: "County election office directory", href: "/county-elections" }, { label: "Primary versus general elections", href: "/news/primary-vs-general-election" }, { label: "Texas voter registration", href: "/register-to-vote" }],
  },
  "civics-desk": {
    focus: "Start with the institution that has jurisdiction over the decision. For a bill, identify the session, bill number, text version, action history and effective date. For a local public meeting, distinguish the posted agenda from the vote and approved minutes. For an open-records request, identify the records sought and the responsible public information officer.",
    sources: [
      { label: "Texas Legislature Online", href: "https://capitol.texas.gov/", use: "Bill text, legislative action history and related official documents." },
      { label: "Texas Constitution and Statutes", href: "https://statutes.capitol.texas.gov/", use: "Current codified legal authority; check effective dates and amendments." },
      { label: "Attorney General public information guidance", href: "https://www.texasattorneygeneral.gov/open-government/members-public/overview-public-information-act", use: "Public-records law, official guidance and access procedures." },
    ],
    references: [{ label: "Read a Texas bill", href: "/texas-government/reference/how-to-read-a-texas-bill" }, { label: "Texas open meetings and public information", href: "/news/texas-open-meetings-public-info" }, { label: "Find your representatives", href: "/find-representative" }],
  },
  "border-bureau": {
    focus: "Separate state public-safety operations from federal immigration administration. Compare statistics only when the geographic area, time period, reporting agency and unit of measurement match; encounters are events, not necessarily a count of distinct people. Arrests, allegations, charges and final court findings must not be treated as the same outcome.",
    sources: [
      { label: "Texas DPS responsibilities", href: "https://www.dps.texas.gov/", use: "Agency organization, official announcements and public-safety functions." },
      { label: "DPS public information requests", href: "https://www.dps.texas.gov/section/general-counsel/public-information-requests", use: "Request underlying state records where disclosure is permitted." },
      { label: "U.S. Customs and Border Protection statistics", href: "https://www.cbp.gov/newsroom/stats", use: "Federal reporting definitions and published encounter data." },
    ],
    references: [{ label: "DPS authority and oversight", href: "/texas-government/agencies/texas-department-public-safety" }, { label: "Texas border geography", href: "/news/texas-border-geography-101" }, { label: "Texas border policy", href: "/news/texas-border-policy-full-guide" }],
  },
};
export function getEditorialDeskGuide(slug: string): DeskGuide | undefined { return GUIDES[slug]; }
