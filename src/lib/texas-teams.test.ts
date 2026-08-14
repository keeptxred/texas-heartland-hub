import { describe, expect, it } from "vitest";
import { canonicalTeamSlug, detectTeams, TEAM_BY_SLUG, TEAM_SLUG_ALIASES, TEAMS, teamsForLeague } from "@/lib/texas-teams";

describe("Texas sports team registry", () => {
  it("contains every targeted professional franchise", () => {
    const expected = [
      "cowboys", "texans", "astros", "rangers", "mavericks", "rockets", "spurs", "stars",
      "austin-fc", "fc-dallas", "houston-dynamo", "houston-dash", "dallas-wings",
    ];
    for (const slug of expected) expect(TEAM_BY_SLUG[slug]?.kind).toBe("pro");
  });

  it("contains all ten targeted major Texas college programs", () => {
    const expected = ["longhorns", "texas-am", "tcu", "baylor", "texas-tech", "houston-cougars", "smu", "utsa", "north-texas", "texas-state"];
    for (const slug of expected) expect(TEAM_BY_SLUG[slug]?.kind).toBe("college");
    expect(teamsForLeague("cfb")).toHaveLength(10);
  });

  it("has unique canonical slugs", () => {
    expect(new Set(TEAMS.map((team) => team.slug)).size).toBe(TEAMS.length);
  });

  it("cross-posts a genuine multi-team Texas story", () => {
    expect(detectTeams("Cowboys and Texans prepare for a Texas NFL matchup").sort()).toEqual(["cowboys", "texans"]);
  });

  it("does not tag generic uses of ambiguous words", () => {
    expect(detectTeams("Local stars gathered for a community event")).not.toContain("stars");
    expect(detectTeams("Park rangers opened a new trail")).not.toContain("rangers");
  });
});

describe("Texas sports team URL canonicalization", () => {
  it("redirects historical aliases to canonical slugs", () => {
    expect(TEAM_SLUG_ALIASES.aggies).toBe("texas-am");
    expect(canonicalTeamSlug("aggies")).toBe("texas-am");
    expect(canonicalTeamSlug("mavs")).toBe("mavericks");
    expect(canonicalTeamSlug("unt")).toBe("north-texas");
  });

  it("preserves canonical slugs and rejects unknown teams", () => {
    expect(canonicalTeamSlug("texas-am")).toBe("texas-am");
    expect(canonicalTeamSlug("not-a-team")).toBeNull();
  });
});
