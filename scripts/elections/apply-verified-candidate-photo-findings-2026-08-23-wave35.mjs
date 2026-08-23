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
    candidateId: "candidate-keenen-colbert-democratic-race-2026-texas-senate-2",
    imageUrl: "https://static.wixstatic.com/media/179174_99fee6173baf4730b082441d26885ba3~mv2.png/v1/fill/w_980%2Ch_445%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/179174_99fee6173baf4730b082441d26885ba3~mv2.png",
    sourceUrl: "https://www.keenenforsd2.com/",
    altText: "Keenen Colbert, Democratic nominee for Texas Senate District 2",
    credit: "Keenen Colbert campaign",
    license: null,
    permissionBasis: "Candidate-identifying image published directly on the official campaign homepage and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-taylor-rehmet-democratic-race-2026-texas-senate-9",
    imageUrl: "https://static.wixstatic.com/media/179174_0159a0ba56bf45f6a371d65af6a1087b~mv2.png/v1/fill/w_532%2Ch_542%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/179174_0159a0ba56bf45f6a371d65af6a1087b~mv2.png",
    sourceUrl: "https://www.taylorfortx.com/",
    altText: "Taylor Rehmet, Democratic candidate for Texas Senate District 9",
    credit: "Taylor for Texas campaign",
    license: null,
    permissionBasis: "Candidate portrait published directly on the official campaign homepage beside the candidate biography and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-dennis-paul-republican-race-2026-texas-senate-11",
    imageUrl: "https://dennispaul.com/wp-content/uploads/2025/05/2014-Dennis-Paul-0298.png",
    sourceUrl: "https://www.dennispaul.com/",
    altText: "Dennis Paul, Republican nominee for Texas Senate District 11",
    credit: "Dennis Paul campaign",
    license: null,
    permissionBasis: "Candidate portrait published directly on the official campaign homepage and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-tom-oliverson-republican-race-2026-texas-house-130",
    imageUrl: "https://house.texas.gov/images/members/3535.jpg?v=1",
    sourceUrl: "https://house.texas.gov/members/3535/biography",
    altText: "Official portrait of Texas Representative Tom Oliverson",
    credit: "Texas House of Representatives",
    license: null,
    permissionBasis: "Official Texas House member portrait used for informational candidate identification with government-source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-profile"
  },
  {
    candidateId: "candidate-shelley-luther-republican-race-2026-texas-house-62",
    imageUrl: "https://house.texas.gov/images/members/4645.jpg?v=1",
    sourceUrl: "https://house.texas.gov/members/4645",
    altText: "Official portrait of Texas Representative Shelley Luther",
    credit: "Texas House of Representatives",
    license: null,
    permissionBasis: "Official Texas House member portrait used for informational candidate identification with government-source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-government-profile"
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
console.log(`Applied ${applied} verified candidate portraits from wave 35.`);
