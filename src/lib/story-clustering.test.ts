import { describe, expect, it } from "vitest";
import { buildStoryCluster, combinationScore, likelySameLineage } from "./story-clustering";

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

  it("does not merge a Fort Worth school-calendar story with a Fort Worth soccer preview", () => {
    const school = item(
      "Fort Worth Star-Telegram",
      "Parents grumbled about school starting so early. A Texas school district listened",
      "A Fort Worth-area school district changed its academic calendar after parents objected to the early start date.",
      "https://star-telegram.com/school-calendar",
    );
    const soccer = item(
      "College Sports Wire",
      "UTSA Roadrunners vs. TCU Horned Frogs women's soccer preview",
      "TCU opens its women's soccer schedule in Fort Worth against UTSA.",
      "https://sports.example/tcu-utsa",
    );
    expect(combinationScore(school, soccer).score).toBe(0);
  });

  it("does not merge a Houston Texans roster story with a Houston Dynamo story", () => {
    const texans = item(
      "Houston Texans",
      "Houston Texans Transactions (8-16-2026)",
      "The Houston Texans announced roster transactions as the team works toward its 53-man roster.",
      "https://houstontexans.com/transactions",
    );
    const dynamo = item(
      "Houston Dynamo",
      "Houston Dynamo announce sellout for Sunday match",
      "The Houston Dynamo said the soccer match in Houston is sold out.",
      "https://houstondynamo.com/sellout",
    );
    expect(combinationScore(texans, dynamo).score).toBe(0);
  });

  it("does not merge a Houston Texans roster story with an unrelated Houston recall", () => {
    const texans = item(
      "Houston Texans",
      "Houston Texans Transactions (8-16-2026)",
      "The Houston Texans announced roster transactions as the team works toward its 53-man roster.",
      "https://houstontexans.com/transactions",
    );
    const recall = item(
      "ABC13 Houston",
      "Salmonella recall expands for food sold in Houston stores",
      "Health officials expanded a salmonella recall affecting products sold at Houston-area stores.",
      "https://abc13.com/salmonella-recall",
    );
    expect(combinationScore(texans, recall).score).toBe(0);
  });

  it("does not merge an Aggies NFL roundup with other Texas pro teams just because both are preseason sports", () => {
    const aggies = item(
      "Texas A&M Aggies",
      "Aggies in the NFL: Preseason Week 1",
      "Former Texas A&M Aggies appeared across NFL preseason games in Week 1.",
      "https://12thman.com/aggies-nfl-week-1",
    );
    const cowboys = item(
      "Dallas Cowboys",
      "Cowboys takeaways from NFL Preseason Week 1",
      "Dallas Cowboys players competed in the NFL preseason opener.",
      "https://dallascowboys.com/preseason-week-1",
    );
    const stars = item(
      "Dallas Stars",
      "Dallas Stars offseason roster outlook",
      "The Dallas Stars reviewed their NHL offseason roster in Dallas.",
      "https://dallasstars.com/offseason",
    );
    expect(combinationScore(aggies, cowboys).score).toBe(0);
    expect(combinationScore(aggies, stars).score).toBe(0);
  });

  it("still merges independent reports about the same Houston Texans roster event", () => {
    const official = item(
      "Houston Texans",
      "Houston Texans announce roster transactions before cutdown",
      "The Houston Texans made roster transactions as the club approaches its 53-man roster deadline.",
      "https://houstontexans.com/transactions",
    );
    const local = item(
      "Houston Chronicle",
      "Texans roster transactions reshape team before 53-man cut",
      "Houston's Texans made multiple roster transactions ahead of the 53-man roster deadline.",
      "https://houstonchronicle.com/texans-roster",
    );
    expect(combinationScore(official, local).score).toBeGreaterThanOrEqual(45);
  });

  it("does not merge unrelated Abbott grant and airport stories", () => {
    const education = item(
      "Office of the Governor",
      "Governor Abbott Announces More Than $2 Million In Grants To Expand Free Educational Resources For Texas Students",
      "Governor Greg Abbott announced more than $2 million in grants to nine Texas higher education institutions for open educational resources, nursing and workforce training programs.",
      "https://gov.texas.gov/education-grants",
      "2026-08-17T13:00:00Z",
    );
    const airport = item(
      "Houston Public Media",
      "Greg Abbott threatens Dallas, Houston airports’ grant funds over Islamic washing facilities",
      "DFW said plans to install the religious washing station had been canceled.",
      "https://example.org/airport-grants",
      "2026-08-17T13:20:22Z",
    );
    expect(combinationScore(education, airport).score).toBe(0);
    expect(buildStoryCluster(education, [airport]).members).toHaveLength(0);
  });

  it("does not treat Texans meaning residents as the Houston Texans team", () => {
    const education = item(
      "Office of the Governor",
      "Governor Abbott Announces More Than $2 Million In Grants To Expand Free Educational Resources For Texas Students",
      "The grants support free course materials for nursing and workforce training programs and make education more affordable for Texans.",
      "https://gov.texas.gov/education-grants",
      "2026-08-17T13:00:00Z",
    );
    const football = item(
      "Houston Texans",
      "Harris Hits: C.J. Stroud and the Texans Offense Have Their Best Day of Training Camp",
      "Seven straight completions highlighted the Texans offense at training camp.",
      "https://www.houstontexans.com/training-camp",
      "2026-08-16T22:40:10Z",
    );
    expect(combinationScore(education, football).score).toBe(0);
    expect(buildStoryCluster(education, [football]).members).toHaveLength(0);
  });

  it("still merges government reports sharing an event-specific subject", () => {
    const primary = item(
      "Office of the Governor",
      "Governor Abbott Announces More Than $2 Million In Grants To Expand Free Educational Resources For Texas Students",
      "The Open Educational Resource Grant Program will fund free educational resources for nursing and workforce training programs.",
      "https://gov.texas.gov/education-grants",
      "2026-08-17T13:00:00Z",
    );
    const corroboration = item(
      "Independent News",
      "Abbott awards $2 million in educational resource grants to Texas colleges",
      "Nine colleges will receive open educational resources funding for nursing and workforce training programs.",
      "https://news.example.com/education-resource-grants",
      "2026-08-17T14:00:00Z",
    );
    expect(combinationScore(primary, corroboration).score).toBeGreaterThanOrEqual(45);
    expect(buildStoryCluster(primary, [corroboration]).members).toHaveLength(1);
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

  it("recognizes near-identical syndication copy across different domains", () => {
    const copy = "Texas officials approved the project after a public meeting in Austin. The plan calls for 2,400 megawatts of new capacity over several years and includes new transmission work, environmental review, local permitting, and phased construction beginning next spring.";
    const a = item("Outlet A", "Texas approves major grid project", copy, "https://a.com/grid-project");
    const b = item("Outlet B", "Major Texas grid project approved", copy, "https://b.com/grid-project");
    expect(likelySameLineage(a, b)).toBe(true);
  });

  it("does not count syndicated copies as separate independent cluster sources", () => {
    const primary = item(
      "Official source",
      "Texas approves major grid project",
      "State officials approved a large power-grid project in Austin with new transmission capacity.",
      "https://official.texas.gov/grid-project",
    );
    const wireCopy = "Texas officials approved the project after a public meeting in Austin. The plan calls for 2,400 megawatts of new capacity over several years and includes new transmission work, environmental review, local permitting, and phased construction beginning next spring.";
    const rows = [
      item("Outlet A", "Texas grid project adds 2,400 megawatts", wireCopy, "https://a.com/grid-project"),
      item("Outlet B", "Texas grid project adds 2,400 megawatts", wireCopy, "https://b.com/grid-project"),
      item("Local Reporter", "Austin officials outline local permitting for Texas grid project", "Austin officials described the local permitting timeline and neighborhood construction impacts tied to the same Texas grid project.", "https://local.com/grid-project"),
    ];
    const cluster = buildStoryCluster(primary, rows, 5);
    const syndicated = cluster.members.filter((row) => row.link.includes("a.com") || row.link.includes("b.com"));
    expect(syndicated.length).toBeLessThanOrEqual(1);
  });
});
