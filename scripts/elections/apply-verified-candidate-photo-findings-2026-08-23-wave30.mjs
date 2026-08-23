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
    candidateId: "candidate-chris-spencer-republican-race-2026-texas-house-1",
    imageUrl: "https://irp.cdn-website.com/e481f125/dms3rep/multi/opt/chris-cutout-66f61142-1920w.png",
    sourceUrl: "https://www.chrisspencer.com/",
    altText: "Chris Spencer, Republican candidate for Texas House District 1",
    credit: "Chris Spencer for Texas House",
    license: null,
    permissionBasis: "Candidate-identifying portrait directly hosted on Chris Spencer's official Texas House campaign website and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-will-campbell-republican-race-2026-texas-house-109",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6940b325cdecf430273ee3c7/49611521-a1cf-4e21-857e-06ddcb91b5e6/Me%2Band%2BTx%2BFlag%2BHero%2B3.png",
    sourceUrl: "https://www.willcampbellfortexas.com/",
    altText: "Will Campbell, Republican candidate for Texas House District 109",
    credit: "Will Campbell for Texas",
    license: null,
    permissionBasis: "Candidate-identifying hero image directly hosted on Will Campbell's official Texas House District 109 campaign website and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-stephen-w-stanley-republican-race-2026-texas-house-113",
    imageUrl: "https://stanleyfortexashouse.com/wp-content/uploads/2024/08/stephen2.jpg",
    sourceUrl: "https://stanleyfortexashouse.com/?page_id=150",
    altText: "Stephen W. Stanley, Republican candidate for Texas House District 113",
    credit: "Committee to Elect Stephen Stanley",
    license: null,
    permissionBasis: "Candidate-identifying portrait directly hosted on Stephen Stanley's official campaign biography page and used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography"
  },
  {
    candidateId: "candidate-danny-rosellini-republican-race-2026-texas-house-115",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/696c5e4530afef534dc64bc7/83061803-5675-4b6c-b21c-53c89a9f73f7/IMG_2111.jpeg",
    sourceUrl: "https://www.rosellinifortx.com/",
    altText: "Danny Rosellini, Republican candidate for Texas House District 115",
    credit: "Rosellini for Texas",
    license: null,
    permissionBasis: "Candidate-identifying photograph directly hosted in the Who I am section of Danny Rosellini's official Texas House District 115 campaign website and used for editorial candidate identification with source attribution.",
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
console.log(`Applied ${applied} verified official-campaign portrait(s) from wave 30.`);
