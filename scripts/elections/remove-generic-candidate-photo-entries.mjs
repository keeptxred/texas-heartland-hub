#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CANDIDATES_PATH = path.join(ROOT, "src/data/elections/2026/candidates.json");
const MANIFEST_PATH = path.join(ROOT, "src/data/elections/2026/candidate-photos.json");
const AUDIT_PATH = path.join(ROOT, "artifacts/elections/candidate-photo-generic-image-audit.json");

const [candidates, manifest] = await Promise.all([
  readJson(CANDIDATES_PATH),
  readJson(MANIFEST_PATH),
]);

const rejectedEntries = manifest.filter((entry) => isKnownGenericImage(entry.imageUrl));
const rejectedCandidateIds = new Set(rejectedEntries.map((entry) => entry.candidateId));
const cleanedManifest = manifest.filter((entry) => !rejectedCandidateIds.has(entry.candidateId));

let clearedCandidateImages = 0;
const cleanedCandidates = candidates.map((candidate) => {
  if (!isKnownGenericImage(candidate.imageUrl) && !rejectedCandidateIds.has(candidate.id)) return candidate;
  const next = { ...candidate };
  delete next.imageUrl;
  delete next.imageAltText;
  delete next.imageRights;
  clearedCandidateImages += 1;
  return next;
});

const duplicateApprovedUrls = [...groupApprovedByImageUrl(cleanedManifest).entries()]
  .filter(([, entries]) => entries.length > 1)
  .map(([imageUrl, entries]) => ({
    imageUrl,
    count: entries.length,
    candidateIds: entries.map((entry) => entry.candidateId),
  }))
  .sort((a, b) => b.count - a.count || a.imageUrl.localeCompare(b.imageUrl));

const audit = {
  generatedAt: new Date().toISOString(),
  removedGenericManifestEntryCount: rejectedEntries.length,
  clearedCandidateImageCount: clearedCandidateImages,
  removedGenericManifestEntries: rejectedEntries.map((entry) => ({
    candidateId: entry.candidateId,
    imageUrl: entry.imageUrl,
    sourceUrl: entry.sourceUrl ?? null,
    discoveryMethod: entry.discoveryMethod ?? null,
  })),
  duplicateApprovedUrls,
};

await writeFile(MANIFEST_PATH, `${JSON.stringify(cleanedManifest, null, 2)}\n`);
await writeFile(CANDIDATES_PATH, `${JSON.stringify(cleanedCandidates, null, 2)}\n`);
await writeFile(AUDIT_PATH, `${JSON.stringify(audit, null, 2)}\n`);

console.log(`Removed ${rejectedEntries.length} generic manifest entr${rejectedEntries.length === 1 ? "y" : "ies"}.`);
console.log(`Cleared ${clearedCandidateImages} stale candidate image assignment(s).`);
console.log(`Flagged ${duplicateApprovedUrls.length} duplicate approved image URL(s) for review.`);

export function isKnownGenericImage(value) {
  if (!value) return false;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return true;
  }
  const host = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  if (host === "senate.texas.gov" && pathname === "/_assets/img/og_image.jpg") return true;
  if (/(?:^|\/)(?:placeholder|default-avatar|default-profile|default-user|no-photo|no_image|no-image)(?:[._/-]|$)/i.test(pathname)) return true;
  if (/\/(?:logo|favicon|seal)(?:[._/-]|$)/i.test(pathname)) return true;
  return false;
}

function groupApprovedByImageUrl(entries) {
  const grouped = new Map();
  for (const entry of entries) {
    if (entry.usageStatus !== "approved" || !entry.imageUrl) continue;
    const list = grouped.get(entry.imageUrl) ?? [];
    list.push(entry);
    grouped.set(entry.imageUrl, list);
  }
  return grouped;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}
