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
    credit: "Junior Ezeonu Campaign",
    license: null,
    permissionBasis: "Candidate headshot published on the official campaign website and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-allison-mitchell-democratic-race-2026-texas-house-108",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67ffddb45703ac4b27b46355/8515d3ed-1157-4002-8a47-fa3cf9875218/AllisonMitchel-109.jpg",
    sourceUrl: "https://www.allisonmitchellfortexas.com/",
    altText: "Allison Mitchell with her family in an official campaign photograph",
    credit: "Allison Mitchell for Texas campaign",
    license: null,
    permissionBasis: "Candidate family photograph published on the official campaign website and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-zach-herbert-democratic-race-2026-texas-house-112",
    imageUrl: "https://i0.wp.com/zach4texas.com/wp-content/uploads/2025/08/BEST-FAMILY-PHOTO.jpg?fit=4300%2C2641&ssl=1",
    sourceUrl: "https://zach4texas.com/",
    altText: "Zach Herbert with his family in an official campaign photograph",
    credit: "Zach Herbert for Texas campaign",
    license: null,
    permissionBasis: "Candidate family photograph published on the official campaign website and used for editorial candidate identification with source attribution.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 43.`);
