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
    candidateId: "candidate-kathryn-hartmann-democratic-race-2026-texas-house-53",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/698a5a3bcdfb136b871ead18/19ed0fae-8e1e-475c-8009-0a1ae3c9c0d8/Kathryn%2BHartmann%2BHeadshot.jpeg",
    sourceUrl: "https://www.kathrynhartmannhd53.com/",
    altText: "Kathryn Hartmann, Democratic candidate for Texas House District 53",
    credit: "Kathryn Hartmann for HD 53 campaign",
    license: null,
    permissionBasis: "Kathryn Hartmann's official Texas House District 53 campaign website identifies her as the candidate and directly publishes this candidate-specific file named 'Kathryn Hartmann Headshot.jpeg' in the campaign-controlled Meet Kathryn biography. Used only for narrow editorial candidate identification with exact campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography-headshot",
    discoveredAt: "2026-09-05T17:41:00.000Z"
  },
  {
    candidateId: "candidate-sandeep-srivastava-democratic-race-2026-texas-house-66",
    imageUrl: "https://sandeepfortexas.com/images/sub-banner.jpg",
    sourceUrl: "https://sandeepfortexas.com/",
    altText: "Sandeep Srivastava, Democratic candidate for Texas House District 66",
    credit: "Sandeep Srivastava Campaign",
    license: null,
    permissionBasis: "Sandeep Srivastava's official campaign website identifies him as the Democratic candidate for Texas House District 66, states that it is a political advertisement paid for by the Sandeep Srivastava Campaign, and directly publishes this candidate-specific portrait on the campaign site. Used only for narrow editorial candidate identification with exact campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-site-portrait",
    discoveredAt: "2026-09-05T17:41:00.000Z"
  },
  {
    candidateId: "candidate-jordan-wheatley-democratic-race-2026-texas-house-67",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/67bb3e966fdd6f4952de24a2/33ee0ed1-72da-4c49-913f-a63659cd127c/c998a683-ffdf-4cab-93c6-5a8e9ab6c358.jpg",
    sourceUrl: "https://www.jordan4texas.com/",
    altText: "Jordan Wheatley, Democratic candidate for Texas House District 67",
    credit: "Jordan Wheatley For Texas campaign",
    license: null,
    permissionBasis: "Jordan Wheatley's official campaign website identifies him as the candidate for Texas House District 67, states that it is paid for by Jordan Wheatley For Texas, and directly publishes this candidate-specific classroom portrait in the campaign-controlled Meet Jordan section. Used only for narrow editorial candidate identification with exact campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-biography-portrait",
    discoveredAt: "2026-09-05T17:41:00.000Z"
  },
  {
    candidateId: "candidate-leilani-barnett-democratic-race-2026-texas-house-69",
    imageUrl: "https://files.cdn-files-a.com/uploads/11470950/400_69384706284f9.jpg",
    sourceUrl: "https://www.barnettfortexas.org/",
    altText: "Leilani Barnett, Democratic candidate for Texas House District 69",
    credit: "Barnett for Texas HD69 campaign",
    license: null,
    permissionBasis: "Leilani Barnett's official Barnett for Texas HD69 campaign website identifies her as the candidate for Texas House District 69 and directly publishes this candidate-specific portrait as the About Leilani image on the campaign-controlled biography page. Used only for narrow editorial candidate identification with exact campaign attribution and source link; no broader reuse license is asserted.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-about-portrait",
    discoveredAt: "2026-09-05T17:41:00.000Z"
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
console.log(`Applied ${applied} verified official campaign portrait(s).`);

// Replay marker: re-run the protected canonical candidate-photo enrichment pipeline from current main.
// Current-main replay marker: September 5, 2026 after source-expansion merge #1975.
