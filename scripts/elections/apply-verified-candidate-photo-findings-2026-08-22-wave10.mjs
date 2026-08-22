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
    candidateId: "candidate-amy-taylor-democratic-race-2026-state-board-of-education-14",
    imageUrl: "https://i0.wp.com/amytaylortexas.com/wp-content/uploads/2026/04/AmyTaylor-Headshot-Circle-1.webp?resize=1024%2C1024&ssl=1",
    sourceUrl: "https://amytaylortexas.com/",
    altText: "Amy Taylor, Democratic candidate for Texas State Board of Education District 14",
    credit: "Amy Taylor for State Board of Education District 14 campaign",
    license: null,
    permissionBasis: "Candidate headshot published directly beside the official campaign site's Meet Amy Taylor biography and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-april-williams-moore-republican-race-2026-state-board-of-education-13",
    imageUrl: "https://aprilfortexas.com/_next/image?q=75&url=https%3A%2F%2Fcdn.durable.co%2Fblocks%2F2dDtMzXmsUx4c3jJrsDYkKXtWnMzZgsQfRXVMHnQwjZj3WnuzDJ9MN5lK7HIld9B.jpg&w=1920",
    sourceUrl: "https://aprilfortexas.com/meet-april-williams-moore",
    altText: "April Williams Moore, Republican candidate for Texas State Board of Education District 13",
    credit: "April Williams Moore campaign",
    license: null,
    permissionBasis: "Candidate image published on the official campaign's Meet April biography page and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-kason-huddleston-republican-race-2026-state-board-of-education-9",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68dc133a82d9d77b237c29c0/d49c04b5-d087-44ba-b3c7-43160ad05ed7/Dad%2Bheadshot.png",
    sourceUrl: "https://huddlestonfortexas.com/",
    altText: "Kason Huddleston, Republican candidate for Texas State Board of Education District 9",
    credit: "Kason Huddleston for Texas campaign",
    license: null,
    permissionBasis: "Candidate headshot published prominently on the official campaign homepage beside the campaign message and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-dana-van-de-walker-democratic-race-2026-state-board-of-education-8",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/6907828b5a9d2d481a907164/bf841149-c1d1-4943-9c69-07c304143158/Untitled%2Bdesign%2B%2815%29.png",
    sourceUrl: "https://www.dana4txsboe8.com/about",
    altText: "Dana Van De Walker, Democratic candidate for Texas State Board of Education District 8",
    credit: "Dana for TX State Board of Education, District 8 campaign",
    license: null,
    permissionBasis: "Candidate image published on the official campaign's Meet Dana biography page and used for editorial candidate identification with attribution and a source link.",
    usageStatus: "approved",
    discoveryMethod: "official-campaign-profile"
  },
  {
    candidateId: "candidate-mica-arellano-republican-race-2026-state-board-of-education-5",
    imageUrl: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https%3A//assets.cdn.filesafe.space/ggxeWPIAhnIsXRqvLmwz/media/69f5774d8831cb2c6c9d2582.png",
    sourceUrl: "https://micatx.com/",
    altText: "Mica Arellano, Republican candidate for Texas State Board of Education District 5",
    credit: "Mica Arellano campaign",
    license: null,
    permissionBasis: "Candidate image published at the top of the official campaign homepage immediately with the Meet Mica Arellano introduction and used for editorial candidate identification with attribution and a source link.",
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
console.log(`Applied ${applied} verified SBOE campaign portrait(s) from wave 10.`);
