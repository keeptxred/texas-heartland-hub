import { describe, expect, it } from "vitest";
import {
  isRoutineGovernmentAppointment,
  publicationInterestScore,
  rankPublicationCandidates,
  releaseSeriesKey,
  type NewsPublishCandidate,
} from "./news-publish-selection";

const now = new Date("2026-08-19T23:30:00.000Z");

function candidate(id: number, title: string, hoursOld: number): NewsPublishCandidate {
  return {
    id,
    title,
    coverage_priority: 100,
    source_reputation_score: 90,
    pub_date: new Date(now.getTime() - hoursOld * 3_600_000).toISOString(),
  };
}

describe("news publish candidate selection", () => {
  it("blocks routine appointments from automated article generation", () => {
    expect(isRoutineGovernmentAppointment("Governor Abbott Appoints Cunningham To State Cemetery Committee")).toBe(true);
    expect(isRoutineGovernmentAppointment("Abbott Appointment Draws Ethics Scrutiny and Lawsuit")).toBe(false);
  });

  it("recognizes repeated data-center compliance releases as one series", () => {
    expect(releaseSeriesKey("Governor Abbott Announces Amazon, Lancium And Cipher Digital Commit To Comply With His Data Center Standards"))
      .toBe("abbott-data-center-standards");
    expect(releaseSeriesKey("Texas counties sue over election security funding conditions")).toBeNull();
  });

  it("prefers fresh, consequential coverage over formulaic government releases", () => {
    const court = candidate(1, "Texas counties sue feds over election security funding conditions", 4);
    const release = candidate(2, "Governor Abbott Announces Data Center Coalition Commits To Comply With His Data Center Standards", 4);
    expect(publicationInterestScore(court, now)).toBeGreaterThan(publicationInterestScore(release, now));
  });

  it("moves on after two recent automated rewrite failures", () => {
    const repeatedlyFailed = candidate(1, "Texas grid reliability funding announcement", 2);
    const freshAlternative = candidate(2, "Texas counties sue over election security funding conditions", 3);
    const ranked = rankPublicationCandidates(
      [repeatedlyFailed, freshAlternative],
      new Map([[1, 2]]),
      now,
    );
    expect(ranked.map((row) => row.id)).toEqual([2]);
  });

  it("keeps only the strongest candidate from a repeated release series", () => {
    const first = candidate(1, "Governor Abbott Announces Prologis, Ecolab And Crusoe Commit To Comply With His Data Center Standards", 8);
    const second = candidate(2, "Governor Abbott Announces Amazon, Lancium And Cipher Digital Commit To Comply With His Data Center Standards", 2);
    const ranked = rankPublicationCandidates([first, second], new Map(), now);
    expect(ranked).toHaveLength(1);
    expect(ranked[0].id).toBe(2);
  });
});
