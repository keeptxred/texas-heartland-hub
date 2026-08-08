import { describe, expect, it } from "vitest";
import { buildStoryCluster, combinationScore } from "./story-clustering";

const now = "2026-08-08T14:00:00Z";

function item(source: string, title: string, description: string, link: string, pub_date = now) {
  return { source, title, description, link, pub_date };
}

describe("story clustering", () => {
  it("strongly connects statewide and local data-center angles", () => {
    const statewide = item(
      "Office of the Governor",
      "Texas pauses new data center grid connections",
      "ERCOT is tracking a major increase in large-load power demand from data centers.",
      "https://gov.texas.gov/data-centers",
    );
    const local = item(
      "KSAT",
      "San Antonio council members consider data center moratorium",
      "City leaders are weighing rules for new data centers and their effect on power demand.",
      "https://ksat.com/data-center-moratorium",
    );
    expect(combinationScore(statewide, local).score).toBeGreaterThanOrEqual(65);
  });

  it("connects tax-free weekend, school practice and heat as complementary angles", () => {
    const tax = item(
      "Texas Comptroller",
      "Texas tax-free weekend runs Aug. 7-9",
      "The sales-tax holiday covers qualifying school supplies and clothing for back-to-school shopping.",
      "https://comptroller.texas.gov/taxfree",
    );
    const heat = item(
      "UIL",
      "UIL reminds schools to monitor wet bulb temperatures during fall practice",
      "Football practice and other school athletics must follow heat-safety rules as heat index values rise.",
      "https://uiltexas.org/heat",
      "2026-08-08T10:00:00Z",
    );
    expect(combinationScore(tax, heat).score).toBeGreaterThanOrEqual(65);
  });

  it("does not merge unrelated Texas stories just because they are recent", () => {
    const water = item(
      "Laredo Morning Times",
      "Laredo secures new water supply agreements",
      "The city added long-term water supply capacity.",
      "https://lmtonline.com/water",
    );
    const sports = item(
      "Houston Texans",
      "Texans extend linebacker through 2028",
      "Houston agreed to a two-year contract extension.",
      "https://houstontexans.com/extension",
    );
    expect(combinationScore(water, sports).score).toBeLessThan(45);
  });

  it("limits a cluster to independent source families", () => {
    const primary = item("Outlet A", "Buc-ee's responds to beaver trademark suit", "Buc-ee's discussed the beaver logo lawsuit.", "https://a.com/1");
    const rows = [
      item("Outlet B", "Buc-ee's trademark fight draws response", "The Buc-ee's beaver logo trademark suit is drawing attention.", "https://b.com/1"),
      item("Outlet B", "More on Buc-ee's beaver logo dispute", "Another story about the same trademark suit.", "https://b.com/2"),
      item("Outlet C", "Mayor comments on Buc-ee's trademark case", "The Buc-ee's beaver logo dispute continues.", "https://c.com/1"),
    ];
    const cluster = buildStoryCluster(primary, rows, 5);
    expect(cluster.strongMerge).toBe(true);
    expect(cluster.members.filter((row) => row.link.includes("b.com")).length).toBe(1);
    expect(cluster.sourceCount).toBe(3);
  });
});
