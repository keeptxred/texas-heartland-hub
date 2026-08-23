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
    candidateId: "candidate-erica-gillum-democratic-race-2026-texas-senate-18",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/696fd99c4b85ae156690a39f/1768937885488-WG1PG41SM5BQNDSQXW21/IMG_2368%2B%281%29%2B%281%29%2B-%2BERICA%2BGILLUM.jpg",
    sourceUrl: "https://www.gillumfortexas.com/",
    altText: "Erica Gillum, Democratic candidate for Texas Senate District 18",
    credit: "Erica Gillum campaign",
    license: null,
    permissionBasis: "Candidate portrait published on the official campaign homepage beside campaign biography text identifying Gillum as a Texas Senate District 18 candidate; used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-marcus-cardenas-republican-race-2026-texas-senate-19",
    imageUrl: "https://www.marcusfortexas.com/hero.webp",
    sourceUrl: "https://www.marcusfortexas.com/",
    altText: "Marcus Cardenas, Republican candidate for Texas Senate District 19",
    credit: "Marcus for Texas campaign",
    license: null,
    permissionBasis: "Candidate portrait published directly on the official campaign homepage for Texas Senate District 19 and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-chris-spencer-republican-race-2026-texas-house-1",
    imageUrl: "https://irp.cdn-website.com/e481f125/dms3rep/multi/opt/chris-cutout-66f61142-1920w.png",
    sourceUrl: "https://www.chrisspencer.com/",
    altText: "Chris Spencer, Republican candidate for Texas House District 1",
    credit: "Chris Spencer campaign",
    license: null,
    permissionBasis: "Candidate portrait published directly in the hero section of the official campaign website, which identifies Spencer as a candidate for the Texas House; used for editorial candidate identification with attribution and a source link.",
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
console.log(`Applied ${applied} verified candidate portraits from wave 36.`);
