import { describe, expect, it } from "vitest";
import {
  ELECTION_RESULTS_ARCHIVE_URL,
  ELECTION_TURNOUT_HISTORY_SOURCE_URL,
  TEXAS_GENERAL_ELECTION_TURNOUT,
  VOTER_REGISTRATION_ARCHIVE_URL,
  electionTurnoutCsv,
  turnoutRegistrationGrowthPercent,
} from "@/data/election-turnout-history";

describe("Texas general-election turnout history", () => {
  it("covers every even-year general election from 2000 through 2024", () => {
    expect(TEXAS_GENERAL_ELECTION_TURNOUT).toHaveLength(13);
    expect(TEXAS_GENERAL_ELECTION_TURNOUT.map((row) => row.year)).toEqual([2024, 2022, 2020, 2018, 2016, 2014, 2012, 2010, 2008, 2006, 2004, 2002, 2000]);
  });

  it("preserves current SOS statewide totals", () => {
    const election2024 = TEXAS_GENERAL_ELECTION_TURNOUT[0];
    expect(election2024).toMatchObject({
      year: 2024,
      registeredVoters: 18_623_931,
      turnout: 11_388_674,
      percentTurnoutRegistered: 61.15,
      percentTurnoutVap: 49.65,
    });
  });

  it("keeps presidential and gubernatorial cycles explicitly separated", () => {
    for (const row of TEXAS_GENERAL_ELECTION_TURNOUT) {
      const expected = row.year % 4 === 0 ? "Presidential" : "Gubernatorial";
      expect(row.electionType).toBe(expected);
    }
  });

  it("calculates registration growth without changing the official source values", () => {
    expect(turnoutRegistrationGrowthPercent()).toBeCloseTo(50.62, 1);
  });

  it("exports the displayed series as CSV", () => {
    const csv = electionTurnoutCsv();
    expect(csv.split("\n")).toHaveLength(14);
    expect(csv).toContain("year,election_type,registered_voters");
    expect(csv).toContain("2024,Presidential,18623931");
    expect(csv).toContain("2000,Presidential,12365235");
  });

  it("uses only official Texas Secretary of State archive URLs", () => {
    for (const url of [ELECTION_TURNOUT_HISTORY_SOURCE_URL, ELECTION_RESULTS_ARCHIVE_URL, VOTER_REGISTRATION_ARCHIVE_URL]) {
      expect(url).toMatch(/^https:\/\/www\.sos\.state\.tx\.us\/elections\/historical\//);
    }
  });
});
