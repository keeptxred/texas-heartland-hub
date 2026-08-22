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
    candidateId: "candidate-ronny-jackson-republican-race-2026-us-house-13",
    imageUrl: "https://jackson.house.gov/UploadedPhotos/HighResolution/29506959-b933-4de0-9256-7ad65700f913.jpg",
    sourceUrl: "https://jackson.house.gov/about/",
    altText: "Official portrait of U.S. Representative Ronny Jackson of Texas",
    credit: "Office of U.S. Representative Ronny Jackson",
    license: null,
    permissionBasis: "Official U.S. House member biography portrait used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-us-house-biography"
  },
  {
    candidateId: "candidate-randy-weber-republican-race-2026-us-house-14",
    imageUrl: "https://weber.house.gov/uploadedphotos/mediumresolution/6c96555e-486a-4585-9e8d-d47cb896abe2.png",
    sourceUrl: "https://weber.house.gov/biography/about-randy.htm",
    altText: "Official portrait of U.S. Representative Randy Weber of Texas",
    credit: "Office of U.S. Representative Randy Weber",
    license: null,
    permissionBasis: "Official U.S. House member biography portrait used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-us-house-biography"
  },
  {
    candidateId: "candidate-monica-de-la-cruz-republican-race-2026-us-house-15",
    imageUrl: "https://delacruz.house.gov/images/headshot.jpg",
    sourceUrl: "https://delacruz.house.gov/about/",
    altText: "Official portrait of U.S. Representative Monica De La Cruz of Texas",
    credit: "Office of U.S. Representative Monica De La Cruz",
    license: null,
    permissionBasis: "Official U.S. House member biography page explicitly provides this image as the downloadable official photo; used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-us-house-downloadable-photo"
  },
  {
    candidateId: "candidate-pete-sessions-republican-race-2026-us-house-17",
    imageUrl: "https://sessions.house.gov/index.cfm?File_id=544C8E78-63A9-4FE3-8D3E-2BE6533EF0D0&a=Files.Serve",
    sourceUrl: "https://sessions.house.gov/about",
    altText: "Official biography portrait of U.S. Representative Pete Sessions of Texas",
    credit: "Office of U.S. Representative Pete Sessions",
    license: null,
    permissionBasis: "Portrait hosted directly on the official U.S. House member biography page and used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-us-house-biography"
  },
  {
    candidateId: "candidate-joaquin-castro-democratic-race-2026-us-house-20",
    imageUrl: "https://castro.house.gov/imo/media/image/2023-05-11_NP_0015_re%20%28002%29.jpg",
    sourceUrl: "https://castro.house.gov/about",
    altText: "Official portrait of U.S. Representative Joaquin Castro of Texas",
    credit: "Office of U.S. Representative Joaquin Castro",
    license: null,
    permissionBasis: "Official U.S. House member biography page explicitly provides this image as the downloadable official photo; used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-us-house-downloadable-photo"
  },
  {
    candidateId: "candidate-beth-van-duyne-republican-race-2026-us-house-24",
    imageUrl: "https://vanduyne.house.gov/index.cfm?File_id=15E268CB-4F09-4C86-9622-6A0950770256&a=Files.Serve",
    sourceUrl: "https://vanduyne.house.gov/about",
    altText: "Official biography portrait of U.S. Representative Beth Van Duyne of Texas",
    credit: "Office of U.S. Representative Beth Van Duyne",
    license: null,
    permissionBasis: "Portrait hosted directly on the official U.S. House member biography page and used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-us-house-biography"
  },
  {
    candidateId: "candidate-veronica-escobar-democratic-race-2026-us-house-16",
    imageUrl: "https://www.congress.gov/img/member/e000299_200.jpg",
    sourceUrl: "https://www.congress.gov/member/veronica-escobar/E000299",
    altText: "Official Congress.gov portrait of U.S. Representative Veronica Escobar of Texas",
    credit: "Congress.gov / Library of Congress; image courtesy of the Member",
    license: null,
    permissionBasis: "Official Congress.gov member portrait used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-congress-gov-member-profile"
  },
  {
    candidateId: "candidate-roger-williams-republican-race-2026-us-house-25",
    imageUrl: "https://www.congress.gov/img/member/w000816_200.jpg",
    sourceUrl: "https://www.congress.gov/member/roger-williams/W000816",
    altText: "Official Congress.gov portrait of U.S. Representative Roger Williams of Texas",
    credit: "Congress.gov / Library of Congress; image courtesy of the Member",
    license: null,
    permissionBasis: "Official Congress.gov member portrait used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-congress-gov-member-profile"
  },
  {
    candidateId: "candidate-henry-cuellar-democratic-race-2026-us-house-28",
    imageUrl: "https://www.congress.gov/img/member/116_rp_tx_28_cuellar_henry_200.jpg",
    sourceUrl: "https://www.congress.gov/member/henry-cuellar/C001063",
    altText: "Official Congress.gov portrait of U.S. Representative Henry Cuellar of Texas",
    credit: "Congress.gov / Library of Congress, Congressional Pictorial Directory",
    license: null,
    permissionBasis: "Official Congress.gov member portrait used for informational candidate identification with source attribution.",
    usageStatus: "approved",
    discoveryMethod: "official-congress-gov-member-profile"
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
console.log(`Applied ${applied} verified official federal portraits.`);
