#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const byId = new Map(manifest.map((entry) => [entry.candidateId, entry]));

const finding = {
  candidateId: "candidate-yolanda-r-prince-democratic-race-2026-us-house-1",
  imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Yolanda_Prince.jpg",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Yolanda_Prince.jpg",
  altText: "Portrait of Yolanda R. Prince, Democratic nominee for Texas's 1st Congressional District",
  credit: "WikiBunny2K1 via Wikimedia Commons",
  license: "CC0 1.0 Universal",
  permissionBasis: "Wikimedia Commons identifies the subject as Yolanda Prince and states the photograph was taken May 7, 2026 before an East Texas Now interview during her TX-1 campaign; the photographer and copyright holder released the work under the CC0 1.0 public-domain dedication.",
  usageStatus: "approved",
  discoveryMethod: "wikimedia-verified-cc0-candidate-photo"
};

if (byId.get(finding.candidateId)?.usageStatus !== "approved") {
  byId.set(finding.candidateId, { ...finding, discoveredAt: new Date().toISOString() });
  await writeFile(
    manifestPath,
    JSON.stringify([...byId.values()].sort((a, b) => a.candidateId.localeCompare(b.candidateId)), null, 2) + "\n"
  );
  console.log("Applied verified CC0 Yolanda Prince portrait.");
} else {
  console.log("Yolanda Prince already has an approved portrait.");
}
