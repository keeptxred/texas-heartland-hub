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
    candidateId: "candidate-amanda-labrie-republican-race-2026-texas-house-148",
    imageUrl: "https://amandalabrie.com/wp-content/uploads/2025/10/Amanda-LaBrie-min.png",
    sourceUrl: "https://amandalabrie.com/",
    altText: "Amanda LaBrie, Republican candidate for Texas House District 148",
    credit: "Amanda LaBrie campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Amanda LaBrie's official Texas House District 148 campaign website, which explicitly identifies Amanda Elizabeth LaBrie as the 2026 Republican candidate for HD 148. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-website"
  },
  {
    candidateId: "candidate-darlene-breaux-democratic-race-2026-texas-house-149",
    imageUrl: "https://darlenebreaux.com/wp-content/uploads/2025/09/darlene-scaled.png",
    sourceUrl: "https://darlenebreaux.com/",
    altText: "Darlene Breaux, Democratic candidate for Texas House District 149",
    credit: "Darlene Breaux campaign",
    license: null,
    permissionBasis: "Candidate-identifying portrait published on Darlene Breaux's official Texas House District 149 campaign website, where she is explicitly identified as a candidate for Texas State Representative, House District 149. Used only for editorial candidate identification with exact campaign attribution and source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-website"
  },
  {
    candidateId: "candidate-dave-bennett-republican-race-2026-texas-house-149",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9d4fae5e-e981-4c7c-ba88-f0fe61985f17/B1%20-%201500x500%20-%20v3%20-%20RL%20-%20Lone%20Star%20Strategic%20.png/%3A/",
    sourceUrl: "https://bennettforstaterep.com/",
    altText: "Dave Bennett, Republican candidate for Texas House District 149",
    credit: "Dave Bennett campaign",
    license: null,
    permissionBasis: "Candidate-identifying campaign image published on Dave Bennett's official Texas House District 149 campaign website, which names Bennett and identifies the office as Texas House District 149. Used only for editorial candidate identification with exact campaign attribution and source link.",
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 59.`);
