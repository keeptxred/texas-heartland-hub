import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { safeCandidateExternalUrl } from "@/components/elections/candidates/candidateUrls";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("candidate directory and reusable profile template", () => {
  it("links every directory record to the slug-driven profile route", () => {
    const directory = source("src/routes/elections.candidates.tsx");
    expect(directory).toContain("ELECTION_ROUTES.candidate(candidate.slug)");
    expect(directory).toContain('usageStatus === "approved"');
  });

  it("keeps candidate-card actions on slug-specific detail routes", () => {
    const card = source("src/components/elections/cards/CandidateCard.tsx");
    const raceCandidates = source("src/components/elections/races/RaceCandidateSection.tsx");

    expect(card).toContain("<Link to={profileHref}");
    expect(card).toContain("to={raceHref}");
    expect(raceCandidates).toContain(
      "profileHref={ELECTION_ROUTES.candidate(candidate.slug)}",
    );
    expect(raceCandidates).toContain("raceHref={ELECTION_ROUTES.race(race.slug)}");
  });

  it("renders nested candidate and race detail routes instead of their directories", () => {
    const candidateDirectory = source("src/routes/elections.candidates.tsx");
    const raceDirectory = source("src/routes/elections.races.tsx");

    expect(candidateDirectory).toContain("if (candidateSlug)");
    expect(candidateDirectory).toContain("return <Outlet />");
    expect(raceDirectory).toContain("if (raceSlug)");
    expect(raceDirectory).toContain("return <Outlet />");
    expect(raceDirectory).toContain("raceHref={ELECTION_ROUTES.race(race.slug)}");
    expect(raceDirectory).toContain(
      "candidateHref: ELECTION_ROUTES.candidate(candidate.slug)",
    );
  });

  it("composes required candidate profile sections once", () => {
    const route = source("src/routes/elections.candidates_.$candidateSlug.tsx");
    for (const section of [
      "CandidateBiographySection",
      "CandidateCampaignLinks",
      "CandidateOfficeHistory",
      "CandidateRaceSection",
      "CandidateSourcesSection",
    ]) {
      expect(route).toContain(`<${section}`);
    }
  });

  it("gates deeper coverage through structured profile depth", () => {
    const expanded = source("src/components/elections/candidates/CandidateExpandedProfile.tsx");
    expect(expanded).toContain('candidate.profileDepth !== "expanded"');
  });

  it("keeps restricted candidate images out of profile SEO", () => {
    const seo = source("src/components/elections/candidates/CandidateDetailSeo.tsx");
    expect(seo).toContain('imageRights?.usageStatus === "approved"');
  });

  it("rejects unsafe external candidate links", () => {
    expect(safeCandidateExternalUrl("javascript:alert(1)")).toBeNull();
    expect(safeCandidateExternalUrl("https://example.test/source")).toBe(
      "https://example.test/source",
    );
  });
});
