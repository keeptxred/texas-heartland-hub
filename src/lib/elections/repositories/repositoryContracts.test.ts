import { describe, expect, it } from "vitest";
import { electionIds } from "@/types/elections";
import { createElectionRepositories } from "./factory";

describe("read-only election repository contracts", () => {
  const repositories = createElectionRepositories({ mode: "mock" });

  it.each([
    ["races", repositories.races, electionIds.race("race-contract")],
    ["candidates", repositories.candidates, electionIds.candidate("candidate-contract")],
    ["polls", repositories.polls, electionIds.poll("poll-contract")],
    ["forecasts", repositories.forecasts, electionIds.forecast("forecast-contract")],
    ["results", repositories.results, electionIds.result("result-contract")],
  ] as const)("%s exposes stable empty read operations", async (_name, repository, id) => {
    const page = await repository.list();

    expect(page).toMatchObject({
      items: [],
      page: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    expect(await repository.count()).toBe(0);
    expect(await repository.exists({ id } as never)).toBe(false);
    expect(await repository.findById(id as never)).toBeNull();
  });

  it("keeps public repository bundles read-only", () => {
    for (const repository of [
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
