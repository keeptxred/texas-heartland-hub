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
    candidateId: "candidate-bonnie-abadie-republican-race-2026-texas-house-102",
    imageUrl: "https://dallasgop.org/wp-content/uploads/2026/04/Bonnie-Abadie-headshot.jpg",
    sourceUrl: "https://dallasgop.org/meet-the-candidates/",
    altText: "Bonnie Abadie, Republican candidate for Texas House District 102",
    credit: "Dallas County Republican Party candidate directory",
    license: null,
    permissionBasis: "Candidate-identifying portrait published by the Dallas County Republican Party on its current 2026 Meet the Candidates page, where Bonnie Abadie is identified as the Republican candidate for Texas House District 102 and linked to her campaign website. Used only for editorial candidate identification with exact source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-county-party-candidate-directory"
  },
  {
    candidateId: "candidate-will-campbell-republican-race-2026-texas-house-109",
    imageUrl: "https://dallasgop.org/wp-content/uploads/2026/04/Will-Campbell-for-HD-109-headshot.jpg",
    sourceUrl: "https://dallasgop.org/meet-the-candidates/",
    altText: "Will Campbell, Republican candidate for Texas House District 109",
    credit: "Dallas County Republican Party candidate directory",
    license: null,
    permissionBasis: "Candidate-identifying portrait published by the Dallas County Republican Party on its current 2026 Meet the Candidates page, where Will Campbell is identified as the Republican candidate for Texas House District 109 and linked to his campaign website. Used only for editorial candidate identification with exact source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-county-party-candidate-directory"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 34.`);
