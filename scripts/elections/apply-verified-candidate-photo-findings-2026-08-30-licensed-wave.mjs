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
    candidateId: "candidate-pete-flores-republican-race-2026-texas-senate-24",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pete_Flores.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pete_Flores.jpg",
    altText: "Pete Flores, Republican candidate for Texas Senate District 24",
    credit: "The Trey Blocker Show via Wikimedia Commons",
    license: "CC BY 3.0",
    permissionBasis: "Wikimedia Commons file page documents the image as Creative Commons Attribution 3.0 Unported, sourced from a CC-licensed 2019 video and identifying the subject as Texas State Senator Pete Flores.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-cc-by-3.0",
    discoveredAt: "2026-08-30T16:46:00.000Z"
  },
  {
    candidateId: "candidate-leigh-wambsganss-republican-race-2026-texas-senate-9",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Leigh_Wambsganss_%2853804969676%29.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Leigh_Wambsganss_(53804969676).jpg",
    altText: "Leigh Wambsganss, Republican candidate for Texas Senate District 9",
    credit: "Gage Skidmore via Wikimedia Commons",
    license: "CC BY-SA 2.0",
    permissionBasis: "Wikimedia Commons file page documents the photograph as CC BY-SA 2.0, originally published by photographer Gage Skidmore on Flickr and license-verified by FlickreviewR; the file description identifies Leigh Wambsganss as the subject.",
    usageStatus: "approved",
    discoveryMethod: "wikimedia-verified-cc-by-sa-2.0",
    discoveredAt: "2026-08-30T16:46:00.000Z"
  }
];

let applied = 0;
for (const finding of findings) {
  if (byId.get(finding.candidateId)?.usageStatus === "approved") continue;
  byId.set(finding.candidateId, finding);
  applied += 1;
}

await writeFile(
  manifestPath,
  JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
);
console.log(`Applied ${applied} verified licensed candidate portrait(s).`);
