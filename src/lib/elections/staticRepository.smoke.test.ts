import { describe, expect, it } from "vitest";
import { createElectionRepositories } from "./repositories/factory";

const repositories = createElectionRepositories({ mode: "static" });

describe("static election repository", () => {
  it("loads the verified 2026 Texas election cycle", async () => {
    expect(repositories.mode).toBe("static");
    const cycle = await repositories.cycles.findByYear(2026, "TX");
    expect(cycle?.slug).toBe("texas-2026-general-election");
    expect(cycle?.publicationStatus).toBe("published");
    expect(cycle?.verificationStatus).toBe("verified");
  });

  it("keeps repository interfaces read-only", () => {
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
