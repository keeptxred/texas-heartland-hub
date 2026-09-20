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
    candidateId: "candidate-junior-ezeonu-democratic-race-2026-texas-house-101",
    imageUrl: "https://static.wixstatic.com/media/0a8871_b84abb8e458e4538b14306836c003da0~mv2.jpeg/v1/fill/w_980,h_968,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2026%20headshot.jpeg",
    sourceUrl: "https://www.votejuniorezeonu.com/",
    altText: "Junior Ezeonu, Democratic candidate for Texas House District 101",
    credit: "Junior Ezeonu campaign",
    license: null,
    permissionBasis: "Candidate headshot directly hosted on the official Junior Ezeonu campaign website and used for editorial candidate identification with campaign attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-will-campbell-republican-race-2026-texas-house-109",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6940b325cdecf430273ee3c7/49611521-a1cf-4e21-857e-06ddcb91b5e6/Me%2Band%2BTx%2BFlag%2BHero%2B3.png",
    sourceUrl: "https://www.willcampbellfortexas.com/",
    altText: "Will Campbell, Republican candidate for Texas House District 109",
    credit: "Will Campbell for Texas campaign",
    license: null,
    permissionBasis: "Candidate-identifying hero image directly hosted on the official Will Campbell for Texas campaign website and used for editorial candidate identification with campaign attribution and a source link.",
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
console.log(`Applied ${applied} verified candidate portraits from wave 39.`);
