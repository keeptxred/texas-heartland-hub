#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const findings = [
  {
    candidateId: "candidate-staci-childs-democratic-race-2026-texas-house-131",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68d302944f2fe0433eb1197f/7e8f5d9a-e35d-4fde-9fd8-5b70593f4884/LANDING-NEW.png",
    sourceUrl: "https://www.childsfortexas.com/",
    altText: "Staci Childs, Democratic candidate for Texas House District 131",
    credit: "Childs For Texas campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Staci Childs's official Texas House District 131 campaign homepage and used for editorial candidate identification with campaign attribution and an exact source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-homepage"
  },
  {
    candidateId: "candidate-danny-rosellini-republican-race-2026-texas-house-115",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/696c5e4530afef534dc64bc7/83061803-5675-4b6c-b21c-53c89a9f73f7/IMG_2111.jpeg",
    sourceUrl: "https://www.rosellinifortx.com/",
    altText: "Danny Rosellini, Republican candidate for Texas House District 115",
    credit: "Rosellini for Texas campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published directly with Danny Rosellini's biography on the official District 115 campaign homepage and used for editorial candidate identification with campaign attribution and an exact source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography"
  },
  {
    candidateId: "candidate-yvonne-davis-democratic-race-2026-texas-house-111",
    imageUrl: "https://house.texas.gov/images/members/2625.jpg?v=1",
    sourceUrl: "https://house.texas.gov/members/member-page/?district=111",
    altText: "Yvonne Davis, Democratic candidate for Texas House District 111",
    credit: "Texas House of Representatives",
    license: null,
    permissionBasis: "Official Texas House member portrait used for informational candidate identification with official-government source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-member-directory"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified candidate portrait(s) from wave 31.`);
