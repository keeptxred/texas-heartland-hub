import { describe, expect, it } from "vitest";
import { TEXAS_LEGISLATIVE_SEATS } from "./texas-legislators.generated";
import {
  TEXAS_HOUSE_MEMBERS, TEXAS_SENATE_MEMBERS, TEXAS_LEGISLATIVE_VACANCIES,
  findRepresentativeBySlug, verifiedOfficialPortraitUrl,
} from "./representatives";

describe("Texas legislative directory integrity", () => {
  it("preserves each of the 181 district seats with no duplicates", () => {
    const keys = TEXAS_LEGISLATIVE_SEATS.map((s) => `${s.chamber}-${s.district}`);
    expect(keys).toHaveLength(181);
    expect(new Set(keys).size).toBe(181);
    expect(TEXAS_LEGISLATIVE_SEATS.filter((s) => s.chamber === "house")).toHaveLength(150);
    expect(TEXAS_LEGISLATIVE_SEATS.filter((s) => s.chamber === "senate")).toHaveLength(31);
  });

  it("never lists vacant seats or former officeholders as current members", () => {
    const occupied = TEXAS_LEGISLATIVE_SEATS.filter((s) => !s.vacant);
    expect(TEXAS_HOUSE_MEMBERS.length + TEXAS_SENATE_MEMBERS.length).toBe(occupied.length);
    expect(TEXAS_LEGISLATIVE_VACANCIES).toHaveLength(TEXAS_LEGISLATIVE_SEATS.length - occupied.length);
    for (const vacancy of TEXAS_LEGISLATIVE_SEATS.filter((s) => s.vacant)) {
      expect(vacancy.name).toBeNull();
      expect(vacancy.party).toBeNull();
      expect(vacancy.authority).toBeNull();
    }
    expect(findRepresentativeBySlug("gary-vandeaver")?.status).toBe("former");
    expect(findRepresentativeBySlug("nate-schatzline")?.status).toBe("former");
    expect(TEXAS_HOUSE_MEMBERS.some((rep) => rep.name === "Gary VanDeaver" || rep.name === "Nate Schatzline")).toBe(false);
  });

  it("rejects non-government hotlinked portrait URLs", () => {
    expect(verifiedOfficialPortraitUrl("https://www.house.texas.gov/images/members/1.jpg")).toBeTruthy();
    expect(verifiedOfficialPortraitUrl("https://randomfirm.com/portrait.jpg")).toBeUndefined();
    expect(verifiedOfficialPortraitUrl("http://house.texas.gov/images/image.jpg")).toBeUndefined();
  });
});
