import { describe, expect, it } from "vitest";
import { createElectionRepositories } from "./factory";

const repositories = createElectionRepositories({ mode: "static" });

describe("production static election repositories", () => {
  it("loads the complete verified launch-scope race catalog", async () => {
    const page = await repositories.races.listCore({
      pagination: { page: 1, pageSize: 300 },
    });

    expect(repositories.mode).toBe("static");
    expect(page.totalItems).toBe(227);
    expect(page.items).toHaveLength(227);
    expect(page.items.every((race) => race.publicationStatus === "published")).toBe(true);
    expect(page.items.every((race) => race.verificationStatus === "verified")).toBe(true);
  });

  it("builds race and candidate detail projections from canonical JSON", async () => {
    const races = await repositories.races.listCore({
      pagination: { page: 1, pageSize: 300 },
    });
    const raceWithCandidate = races.items.find((race) => race.candidateIds.length > 0);
    expect(raceWithCandidate).toBeDefined();

    const raceDetail = raceWithCandidate
      ? await repositories.races.findDetailById(raceWithCandidate.id)
      : null;
    expect(raceDetail?.candidates.length).toBeGreaterThan(0);

    const candidates = await repositories.candidates.listCore({
      pagination: { page: 1, pageSize: 500 },
    });
    expect(candidates.totalItems).toBeGreaterThan(0);
    const candidateDetail = await repositories.candidates.findDetailById(candidates.items[0].id);
    expect(candidateDetail?.sources.length).toBeGreaterThan(0);
    expect(candidateDetail?.profileDepth).toMatch(/standard|expanded/);
  });

  it("marks only the declared incumbent candidate as incumbent", async () => {
    const races = await repositories.races.list({
      pagination: { page: 1, pageSize: 300 },
    });

    for (const race of races.items) {
      const marked = race.candidates.filter((candidate) => candidate.incumbent).map((candidate) => candidate.id);
      expect(marked).toEqual(race.incumbentCandidateId ? [race.incumbentCandidateId] : []);
    }
  });

  it("does not expose mutation methods in static production mode", () => {
    for (const repository of [
      repositories.cycles,
      repositories.races,
      repositories.candidates,
      repositories.polls,
      repositories.forecasts,
      repositories.results,
    ]) {
      expect("create" in repository).toBe(false);
      expect("update" in repository).toBe(false);
      expect("delete" in repository).toBe(false);
    }
  });
});
