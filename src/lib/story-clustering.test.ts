import { describe, expect, it } from "vitest";
import { buildStoryCluster, combinationScore, likelySameLineage } from "./story-clustering";

const now = "2026-08-08T14:00:00Z";

function item(source: string, title: string, description: string, link: string, pub_date = now) {
  return { source, title, description, link, pub_date };
}

describe("story clustering", () => {
  it("does not merge unrelated statewide and local data-center stories just because they share the beat", () => {
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
    expect(combinationScore(statewide, local).score).toBeLessThan(45);
    expect(buildStoryCluster(statewide, [local]).members).toHaveLength(0);
  });

  it("still merges independent reports about the same data-center permit pause", () => {
    const first = item(
      "Office of the Governor",
      "Abbott orders halt to Texas data center permits pending grid and water audits",
      "The governor directed TCEQ to pause environmental permits while state agencies audit grid and water impacts.",
      "https://gov.texas.gov/data-center-permit-pause",
      "2026-09-22T12:00:00Z",
    );
    const second = item(
      "Independent News",
      "Texas data center permits remain paused during grid, water audits",
      "TCEQ paused environmental permits for new data centers while the state completes grid and water audits.",
      "https://news.example/data-center-permit-pause",
      "2026-09-22T13:00:00Z",
    );
    expect(combinationScore(first, second).score).toBeGreaterThanOrEqual(45);
    expect(buildStoryCluster(first, [second]).members).toHaveLength(1);
  });

  it("does not merge tax-free shopping with an unrelated school heat-practice story", () => {
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
    expect(combinationScore(tax, heat).score).toBeLessThan(45);
    expect(buildStoryCluster(tax, [heat]).members).toHaveLength(0);
  });

  it("does not merge unrelated Fort Worth stories just because the multi-word city name overlaps", () => {
    const shooting = item(
      "Outlet A",
      "Fort Worth police investigate shooting near apartment complex",
      "Detectives are investigating a shooting at an apartment complex.",
      "https://a.example/fort-worth-shooting",
      "2026-09-22T10:00:00Z",
    );
    const garden = item(
      "Outlet B",
      "Fort Worth Botanic Garden opens new enchanted exhibit",
      "The seasonal exhibit opens this weekend at the Fort Worth Botanic Garden.",
      "https://b.example/fort-worth-garden",
      "2026-09-22T11:00:00Z",
    );
    expect(combinationScore(shooting, garden).score).toBe(0);
  });

  it("does not merge unrelated shootings that only share generic crime vocabulary", () => {
    const a = item(
      "Outlet A",
      "Austin police launch investigation after downtown shooting",
      "Police are investigating a shooting in Austin.",
      "https://a.example/austin-shooting",
      "2026-09-22T10:00:00Z",
    );
    const b = item(
      "Outlet B",
      "Nacogdoches shooting investigation continues after man found dead",
      "Police are investigating an unrelated shooting in Nacogdoches.",
      "https://b.example/nacogdoches-shooting",
      "2026-09-22T11:00:00Z",
    );
    expect(combinationScore(a, b).score).toBe(0);
  });

  it("does not merge unrelated border-enforcement stories solely because both mention ICE", () => {
    const a = item(
      "Outlet A",
      "Austin attorney seeks release of Venezuelan man after ICE shooting",
      "The case concerns a Venezuelan man shot by an ICE officer in Austin.",
      "https://a.example/austin-ice-shooting",
      "2026-09-22T10:00:00Z",
    );
    const b = item(
      "Outlet B",
      "Texas landowners sue federal government over border wall plans",
      "Landowners filed suit over federal border wall construction plans.",
      "https://b.example/border-wall-lawsuit",
      "2026-09-22T11:00:00Z",
    );
    expect(combinationScore(a, b).score).toBe(0);
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

  it("keeps an explicitly marked direct primary record even when its headline matches the secondary report", () => {
    const secondary = item(
      "KXAN Austin",
      "Texas Children’s in Austin announces NICU expansion",
      "Texas Children’s in Austin announces NICU expansion.",
      "https://news.google.com/rss/articles/secondary-nicu",
      "2026-08-13T17:53:46Z",
    );
    const primary = {
      ...item(
        "Texas Children’s",
        "Texas Children’s in Austin announces NICU expansion",
        "Texas Children’s announced a $39 million NICU expansion from 14 rooms to 31 rooms using fifth-floor shell space.",
        "https://www.texaschildrens.org/content/news-release/austin-nicu-expansion",
        "2026-08-13T12:00:00Z",
      ),
      viral_signals: { primary_source: true },
    };

    expect(likelySameLineage(secondary, primary)).toBe(false);
    expect(combinationScore(secondary, primary).score).toBeGreaterThanOrEqual(45);
    const storyCluster = buildStoryCluster(secondary, [primary], 5);
    expect(storyCluster.members).toHaveLength(1);
    expect(storyCluster.strongMerge).toBe(true);
  });


  it("does not merge the real voter-registration story with unrelated campaign, tax, or school-award stories", () => {
    const registration = item(
      "Houston Public Media",
      "Texans have less than 3 weeks to register to vote for November 2026 midterm election",
      "Texas law requires eligible citizens to register 30 days before Election Day, meaning Oct. 5 is the last day to register for the Nov. 3, 2026 midterm election.",
      "https://www.houstonpublicmedia.org/elections/registration-deadline",
      "2026-09-17T19:03:31Z",
    );
    const campaignCaption = item(
      "Bryan College Station Eagle",
      "Texas state Rep. Gina Hinojosa, Texas Democratic gubernatorial candidate, speaks at a Lubbock County Democratic candidate rally on July 18, 2026, in Lubbock, Texas. Hinojosa will face Republican Gov. Greg Abbott in the November election.",
      "Gina Hinojosa spoke at a Democratic candidate rally and will face Greg Abbott in the November election.",
      "https://news.google.com/rss/articles/campaign-caption",
      "2026-09-18T12:55:07Z",
    );
    const poll = item(
      "KXAN — Austin",
      "New poll shows Hinojosa ahead of Abbott for first time, Talarico leads Paxton",
      "ReconMR/Siena finds Gina Hinojosa up 4 points on the three-term governor.",
      "https://www.kxan.com/news/texas-politics/poll",
      "2026-09-17T19:48:25Z",
    );
    const tax = item(
      "KPRC 2 Click2Houston",
      "3 Harris County commissioners defend property tax increase, blame Trump and Abbott policies for $250 million in costs",
      "Harris County commissioners approved a property tax rate increase.",
      "https://www.click2houston.com/news/local/harris-county-tax",
      "2026-09-18T02:33:44Z",
    );
    const schools = item(
      "Office of the Governor",
      "Governor Abbott Announces 2026 Lone Star Ribbon Schools",
      "Governor Greg Abbott announced 25 Texas public schools as Lone Star Ribbon Schools.",
      "https://gov.texas.gov/news/post/lone-star-ribbon-schools",
      "2026-09-17T16:37:05Z",
    );

    for (const unrelated of [campaignCaption, poll, tax, schools]) {
      expect(combinationScore(registration, unrelated).score).toBe(0);
    }
    const cluster = buildStoryCluster(registration, [campaignCaption, poll, tax, schools], 5);
    expect(cluster.members).toHaveLength(0);
    expect(cluster.strongMerge).toBe(false);
  });

  it("does not treat a shared candidate plus governor as enough to merge a poll with a campaign-caption story", () => {
    const poll = item(
      "KXAN — Austin",
      "New poll shows Hinojosa ahead of Abbott for first time, Talarico leads Paxton",
      "A statewide poll measured support in the governor and Senate races.",
      "https://kxan.com/poll",
      "2026-09-17T19:48:25Z",
    );
    const caption = item(
      "Bryan College Station Eagle",
      "Texas state Rep. Gina Hinojosa speaks at a Democratic candidate rally and will face Gov. Greg Abbott in the November election",
      "The candidate appeared at a July rally in Lubbock.",
      "https://eagle.example/caption",
      "2026-09-18T12:55:07Z",
    );
    expect(combinationScore(poll, caption).score).toBe(0);
  });

  it("still merges independent reports about the same voter-registration deadline", () => {
    const first = item(
      "Houston Public Media",
      "Texas voters face Oct. 5 registration deadline for Nov. 3 election",
      "Eligible Texans must register by Oct. 5 ahead of the Nov. 3 election.",
      "https://houstonpublicmedia.org/registration",
      "2026-09-17T19:03:31Z",
    );
    const second = item(
      "Independent News",
      "Texas voter registration deadline is Oct. 5 ahead of Nov. 3 election",
      "The voter registration deadline for the November election is Oct. 5.",
      "https://news.example/texas-registration-deadline",
      "2026-09-17T20:03:31Z",
    );
    expect(combinationScore(first, second).score).toBeGreaterThanOrEqual(45);
    expect(buildStoryCluster(first, [second]).members).toHaveLength(1);
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
