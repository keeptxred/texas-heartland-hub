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
    candidateId: "candidate-michael-myers-democratic-race-2026-texas-house-10",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/69b9a6310ed93c290eab215b/1165976c-3fef-4faf-a281-31de5377c0c8/IMG_0467.jpg",
    sourceUrl: "https://www.michaelmyersforhd10.com/",
    altText: "Michael Myers, Democratic candidate for Texas House District 10",
    credit: "Michael Myers for HD 10 campaign",
    license: null,
    permissionBasis: "Candidate-identifying image directly hosted on the official Michael Myers for HD 10 campaign website and used for editorial candidate identification with campaign attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-danny-rosellini-republican-race-2026-texas-house-115",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/696c5e4530afef534dc64bc7/83061803-5675-4b6c-b21c-53c89a9f73f7/IMG_2111.jpeg",
    sourceUrl: "https://www.rosellinifortx.com/",
    altText: "Danny Rosellini, Republican candidate for Texas House District 115",
    credit: "Rosellini for Texas campaign",
    license: null,
    permissionBasis: "Candidate-identifying image directly hosted in the 'Who I am' section of the official Rosellini for Texas campaign website and used for editorial candidate identification with campaign attribution and a source link.",
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
console.log(`Applied ${applied} verified candidate portraits from wave 38.`);
