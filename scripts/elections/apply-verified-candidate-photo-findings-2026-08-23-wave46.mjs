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
    candidateId: "candidate-pooja-sethi-democratic-race-2026-texas-house-47",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6813097b22fce2334c9dddfb/7eb35c05-608d-4e09-8698-c188a729c8ab/PoojaHS-46.jpg",
    sourceUrl: "https://www.poojafortexas.com/why-im-running",
    altText: "Pooja Sethi, Democratic candidate for Texas House District 47",
    credit: "Pooja Sethi campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait directly hosted on the official Pooja Sethi campaign website in the candidate's 'Why I'm Running' section and used for editorial candidate identification with campaign attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-montserrat-garibay-democratic-race-2026-texas-house-49",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68ed224f5e7bd548437f5a86/833a753d-65c5-45f1-af79-30c96d746d44/MONTSERRAT%2B%281%29.png",
    sourceUrl: "https://www.montserratfortexas.com/",
    altText: "Montserrat Garibay, Democratic candidate for Texas House District 49",
    credit: "Montserrat Garibay Campaign",
    license: null,
    permissionBasis: "Candidate-identifying campaign image directly hosted on the official Montserrat Garibay campaign website, which identifies her as the Texas House District 49 nominee and carries the campaign paid-for-by disclaimer; used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 46.`);
