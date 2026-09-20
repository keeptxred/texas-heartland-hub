export type TexasGeneralElectionTurnout = {
  year: number;
  electionType: "Presidential" | "Gubernatorial";
  registeredVoters: number;
  votingAgePopulation: number;
  percentVapRegistered: number;
  turnout: number;
  percentTurnoutRegistered: number;
  percentTurnoutVap: number;
};

export const ELECTION_TURNOUT_HISTORY_REVIEWED_AT = "2026-09-06";
export const ELECTION_TURNOUT_HISTORY_SOURCE_URL = "https://www.sos.state.tx.us/elections/historical/70-92.shtml";
export const ELECTION_RESULTS_ARCHIVE_URL = "https://www.sos.state.tx.us/elections/historical/elections-results-archive.shtml";
export const VOTER_REGISTRATION_ARCHIVE_URL = "https://www.sos.state.tx.us/elections/historical/vrfig.shtml";

export const TEXAS_GENERAL_ELECTION_TURNOUT: TexasGeneralElectionTurnout[] = [
  { year: 2024, electionType: "Presidential", registeredVoters: 18_623_931, votingAgePopulation: 22_938_482, percentVapRegistered: 81.19, turnout: 11_388_674, percentTurnoutRegistered: 61.15, percentTurnoutVap: 49.65 },
  { year: 2022, electionType: "Gubernatorial", registeredVoters: 17_672_143, votingAgePopulation: 21_866_700, percentVapRegistered: 80.82, turnout: 8_102_908, percentTurnoutRegistered: 45.85, percentTurnoutVap: 37.06 },
  { year: 2020, electionType: "Presidential", registeredVoters: 16_955_519, votingAgePopulation: 21_596_071, percentVapRegistered: 78.51, turnout: 11_315_056, percentTurnoutRegistered: 66.73, percentTurnoutVap: 52.39 },
  { year: 2018, electionType: "Gubernatorial", registeredVoters: 15_793_257, votingAgePopulation: 19_900_980, percentVapRegistered: 79.36, turnout: 8_371_655, percentTurnoutRegistered: 53.01, percentTurnoutVap: 42.07 },
  { year: 2016, electionType: "Presidential", registeredVoters: 15_101_087, votingAgePopulation: 19_307_355, percentVapRegistered: 78.21, turnout: 8_969_226, percentTurnoutRegistered: 59.39, percentTurnoutVap: 46.45 },
  { year: 2014, electionType: "Gubernatorial", registeredVoters: 14_025_441, votingAgePopulation: 18_915_297, percentVapRegistered: 74.15, turnout: 4_727_208, percentTurnoutRegistered: 33.70, percentTurnoutVap: 24.99 },
  { year: 2012, electionType: "Presidential", registeredVoters: 13_646_226, votingAgePopulation: 18_279_737, percentVapRegistered: 74.65, turnout: 7_993_851, percentTurnoutRegistered: 58.58, percentTurnoutVap: 43.73 },
  { year: 2010, electionType: "Gubernatorial", registeredVoters: 13_269_233, votingAgePopulation: 18_789_238, percentVapRegistered: 71.00, turnout: 4_979_870, percentTurnoutRegistered: 38.00, percentTurnoutVap: 27.00 },
  { year: 2008, electionType: "Presidential", registeredVoters: 13_575_062, votingAgePopulation: 17_735_442, percentVapRegistered: 76.54, turnout: 8_077_795, percentTurnoutRegistered: 59.50, percentTurnoutVap: 45.55 },
  { year: 2006, electionType: "Gubernatorial", registeredVoters: 13_074_279, votingAgePopulation: 16_636_742, percentVapRegistered: 78.58, turnout: 4_399_068, percentTurnoutRegistered: 33.64, percentTurnoutVap: 26.44 },
  { year: 2004, electionType: "Presidential", registeredVoters: 13_098_329, votingAgePopulation: 16_071_153, percentVapRegistered: 81.50, turnout: 7_410_765, percentTurnoutRegistered: 56.57, percentTurnoutVap: 46.11 },
  { year: 2002, electionType: "Gubernatorial", registeredVoters: 12_563_459, votingAgePopulation: 15_514_289, percentVapRegistered: 80.97, turnout: 4_553_979, percentTurnoutRegistered: 36.24, percentTurnoutVap: 29.35 },
  { year: 2000, electionType: "Presidential", registeredVoters: 12_365_235, votingAgePopulation: 14_479_609, percentVapRegistered: 85.39, turnout: 6_407_637, percentTurnoutRegistered: 51.81, percentTurnoutVap: 44.25 },
];

export function electionTurnoutCsv(rows: TexasGeneralElectionTurnout[] = TEXAS_GENERAL_ELECTION_TURNOUT): string {
  const header = ["year", "election_type", "registered_voters", "voting_age_population", "percent_vap_registered", "turnout", "percent_turnout_registered", "percent_turnout_vap"];
  const lines = rows.map((row) => [row.year, row.electionType, row.registeredVoters, row.votingAgePopulation, row.percentVapRegistered, row.turnout, row.percentTurnoutRegistered, row.percentTurnoutVap].join(","));
  return [header.join(","), ...lines].join("\n");
}

export function turnoutRegistrationGrowthPercent(): number {
  const newest = TEXAS_GENERAL_ELECTION_TURNOUT[0];
  const oldest = TEXAS_GENERAL_ELECTION_TURNOUT[TEXAS_GENERAL_ELECTION_TURNOUT.length - 1];
  return ((newest.registeredVoters / oldest.registeredVoters) - 1) * 100;
}
