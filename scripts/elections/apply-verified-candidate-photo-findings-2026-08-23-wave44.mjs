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
    candidateId: "candidate-shelly-nickels-democratic-race-2026-texas-house-122",
    imageUrl: "https://shellynickels.com/images/shelly-grey-portrait.jpg",
    sourceUrl: "https://shellynickels.com/",
    altText: "Dr. Shelly Nickels, Democratic candidate for Texas House District 122",
    credit: "Shelly Nickels for TX HD-122 campaign",
    license: null,
    permissionBasis: "Candidate portrait published directly on the official campaign website and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-sara-mcgee-democratic-race-2026-texas-house-132",
    imageUrl: "https://mcgeefortx.com/wp-content/uploads/2025/02/SaraMcGee.jpg",
    sourceUrl: "https://mcgeefortx.com/about-sara/",
    altText: "Sara McGee, Democratic candidate for Texas House District 132",
    credit: "Sara McGee for Texas campaign",
    license: null,
    permissionBasis: "Candidate portrait published directly on the official campaign website and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-sylvia-soto-republican-race-2026-texas-house-124",
    imageUrl: "https://img1.wsimg.com/isteam/ip/a9035af3-cf57-4157-9bc3-2daad7e3171a/blob-a5cc497.png/%3A/cr%3Dt%3A0%25%2Cl%3A0%25%2Cw%3A100%25%2Ch%3A100%25/rs%3Dw%3A600%2Ccg%3Atrue",
    sourceUrl: "https://sylviasoto.com/",
    altText: "Sylvia Soto, Republican candidate for Texas House District 124",
    credit: "Sylvia Soto campaign",
    license: null,
    permissionBasis: "Candidate-identifying campaign image published directly on the official campaign website and used for editorial candidate identification with source attribution.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 44.`);
