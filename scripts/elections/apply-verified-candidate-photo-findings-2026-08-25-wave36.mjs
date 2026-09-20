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
    candidateId: "candidate-ricardo-rick-martinez-republican-race-2026-texas-house-125",
    imageUrl: "https://static.wixstatic.com/media/ebdf97_b91a46b8bf514576b5701db2c6cb43ba~mv2.jpg/v1/fill/w_640%2Ch_454%2Cal_c%2Cq_80%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/ebdf97_b91a46b8bf514576b5701db2c6cb43ba~mv2.jpg",
    sourceUrl: "https://www.voterickfortexas.com/",
    altText: "Ricardo 'Rick' Martinez, Republican candidate for Texas House District 125",
    credit: "Rick Martinez campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Ricardo 'Rick' Martinez's official Texas House District 125 campaign website, which identifies Martinez as the HD 125 candidate and states that the site is paid for by the Rick Martinez campaign. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-website"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 36.`);
