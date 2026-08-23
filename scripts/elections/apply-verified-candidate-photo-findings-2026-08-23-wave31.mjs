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
    imageUrl: "https://static.wixstatic.com/media/0a8871_b84abb8e458e4538b14306836c003da0~mv2.jpeg/v1/fill/w_980%2Ch_968%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/2026%20headshot.jpeg",
    sourceUrl: "https://www.votejuniorezeonu.com/",
    altText: "Junior Ezeonu, Democratic candidate for Texas House District 101",
    credit: "Junior Ezeonu Campaign",
    license: null,
    permissionBasis: "Candidate headshot explicitly labeled 2026 headshot and directly hosted on Junior Ezeonu's official Texas House District 101 campaign homepage; used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-headshot"
  },
  {
    candidateId: "candidate-bonnie-abadie-republican-race-2026-texas-house-102",
    imageUrl: "https://www.northdallasmartialarts.com/uploads/2/1/6/3/21631814/campaign-kickoff_orig.jpg",
    sourceUrl: "https://www.northdallasmartialarts.com/bonnie-abadie.html",
    altText: "Bonnie Abadie, Republican candidate for Texas House District 102",
    credit: "Bonnie Abadie campaign",
    license: null,
    permissionBasis: "Candidate-identifying campaign image directly hosted on Bonnie Abadie's self-declared Texas House District 102 campaign page, which identifies the page as her temporary campaign site; used for editorial candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-candidate-campaign-page"
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
console.log(`Applied ${applied} verified candidate portrait(s) from wave 31.`);
