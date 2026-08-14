import { describe, expect, it } from "vitest";
import { classifySportsText, sportsKindForText } from "@/lib/sports-taxonomy";

describe("sports taxonomy", () => {
  it("classifies team, league, city and sport from a pro story", () => {
    const result = classifySportsText("Houston Texans NFL injury report from NRG Stadium in Houston");
    expect(result.teams).toContain("texans");
    expect(result.leagues).toContain("nfl");
    expect(result.topics).toContain("football");
    expect(result.topics).toContain("injuries");
    expect(result.cities).toContain("houston");
    expect(sportsKindForText("Houston Texans NFL injury report")).toBe("sports-nfl");
  });

  it("recognizes college recruiting and NIL coverage", () => {
    const result = classifySportsText("Texas Longhorns recruiting collective discusses NIL revenue sharing in Austin");
    expect(result.teams).toContain("longhorns");
    expect(result.leagues).toContain("cfb");
    expect(result.topics).toEqual(expect.arrayContaining(["recruiting", "nil", "college"]));
  });

  it("recognizes Texas sports business and policy stories", () => {
    const text = "Texas lawmakers debate sports betting legislation in Dallas";
    const result = classifySportsText(text);
    expect(result.topics).toContain("business-policy");
    expect(result.isSports).toBe(true);
    expect(sportsKindForText(text)).toBe("sports-policy");
  });

  it("recognizes motorsports without requiring a team", () => {
    const text = "Formula 1 returns to Circuit of the Americas in Austin as COTA prepares for race weekend";
    const result = classifySportsText(text);
    expect(result.topics).toContain("motorsports");
    expect(result.cities).toContain("austin");
    expect(sportsKindForText(text)).toBe("sports-motorsports");
  });

  it("supports cross-posting stories that mention multiple teams", () => {
    const result = classifySportsText("The Houston Astros and Texas Rangers meet in another Lone Star Series matchup");
    expect(result.teams.sort()).toEqual(["astros", "rangers"]);
    expect(result.topics).toEqual(expect.arrayContaining(["baseball", "rivalries"]));
  });

  it("does not turn generic university coverage into college sports", () => {
    const tamu = classifySportsText("Texas A&M professors challenge classroom restrictions in federal court");
    const tech = classifySportsText("Texas Tech researchers publish a new water study for West Texas communities");
    expect(tamu.teams).not.toContain("texas-am");
    expect(tamu.isSports).toBe(false);
    expect(tech.teams).not.toContain("texas-tech");
    expect(tech.isSports).toBe(false);
  });

  it("does not confuse Texas A&M system campuses with the Aggies", () => {
    const result = classifySportsText("Texas A&M-Texarkana opens a sports complex with a 6,000-seat football stadium");
    expect(result.teams).not.toContain("texas-am");
    expect(result.topics).toEqual(expect.arrayContaining(["football", "stadiums"]));
    expect(result.isSports).toBe(true);
  });

  it("does not treat resident Texans or political recruiting language as sports", () => {
    const residents = classifySportsText("Texans across the state are preparing for tax-free weekend");
    const politics = classifySportsText("Texas lawmakers recruit rivals for a new policy coalition");
    expect(residents.teams).not.toContain("texans");
    expect(residents.isSports).toBe(false);
    expect(politics.topics).toEqual(expect.arrayContaining(["recruiting", "business-policy", "rivalries"]));
    expect(politics.isSports).toBe(false);
  });
});
