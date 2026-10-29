import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const file = resolve(process.cwd(), "src/data/texas-legislators.generated.ts");
const source = readFileSync(file, "utf8");
const reviewedMatch = /export const TEXAS_ROSTER_REVIEWED_AT = "(\d{4}-\d{2}-\d{2})";/.exec(source);
if (!reviewedMatch) throw new Error("Generated roster is missing the official-source review date");
const review = reviewedMatch[1];
if (process.env.GITHUB_ACTIONS === "true" && review !== new Date().toISOString().slice(0, 10)) {
  throw new Error(`Generated roster review date ${review} is not today's UTC date; refusing to publish an unrefreshed file`);
}

const section = source.split("export const TEXAS_LEGISLATIVE_SEATS:")[1]?.split("export const TEXAS_HOUSE_SEATS")[0];
if (!section) throw new Error("Generated roster seat collection was not found");
const blocks = section.split(/^  \{\s*$/m).slice(1);
if (blocks.length !== 181) throw new Error(`Expected exactly 181 House/Senate district records, found ${blocks.length}`);

const byChamber = { house: new Map(), senate: new Map() };
for (const block of blocks) {
  const chamber = /^    chamber: "(house|senate)",/m.exec(block)?.[1];
  const district = Number(/^    district: (\d+),/m.exec(block)?.[1]);
  const vacancy = /^    vacant: (true|false),/m.exec(block)?.[1];
  const name = /^    name: (null|".*"),/m.exec(block)?.[1];
  const party = /^    party: (null|"[RD]"),/m.exec(block)?.[1];
  const authority = /^    authority: (null|\{)/m.exec(block)?.[1];
  if (!chamber || !district || !vacancy || !name || !party || !authority)
    throw new Error("Malformed legislator record; refusing to overwrite verified data");
  if (byChamber[chamber].has(district)) throw new Error(`Duplicate ${chamber} district ${district}`);
  const max = chamber === "house" ? 150 : 31;
  if (district < 1 || district > max) throw new Error(`Invalid ${chamber} district ${district}`);
  if (vacancy === "true" && !(name === "null" && party === "null" && authority === "null"))
    throw new Error(`Vacant ${chamber} district ${district} incorrectly lists an officeholder`);
  if (vacancy === "false" && (name === "null" || party === "null" || authority === "null"))
    throw new Error(`Seated ${chamber} district ${district} is missing verified data`);
  byChamber[chamber].set(district, vacancy === "true" ? "vacant" : "seated");
}

for (const [chamber, total] of [["house", 150], ["senate", 31]]) {
  if (byChamber[chamber].size !== total) throw new Error(`Incomplete ${chamber} district coverage`);
  for (let district = 1; district <= total; district++) {
    if (!byChamber[chamber].has(district)) throw new Error(`Missing ${chamber} district ${district}`);
  }
}
const houseVacancies = [...byChamber.house].filter(([, state]) => state === "vacant").map(([id]) => id);
const senateVacancies = [...byChamber.senate].filter(([, state]) => state === "vacant").map(([id]) => id);
if (houseVacancies.length > 10 || senateVacancies.length > 5)
  throw new Error("Implausibly many vacancies; review source parser before automatic publication");
console.log(`Validated all 181 districts; House vacancies: ${houseVacancies.join(", ") || "none"}; Senate vacancies: ${senateVacancies.join(", ") || "none"}; roster verified: ${review}`);
