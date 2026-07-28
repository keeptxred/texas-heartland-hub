import { readFile, writeFile } from "node:fs/promises";

await patch("src/components/elections/navigation/ElectionNavigation.tsx", [
  [
    `            const isActive =\n              currentPath === item.href ||\n              (item.href !== "/elections" && currentPath?.startsWith(\`${"${item.href}"}/\`));`,
    `            const isActive =\n              currentPath === item.href || currentPath?.startsWith(\`${"${item.href}"}/\`);`,
  ],
]);

await patch("src/lib/elections/repositories/static.ts", [
  [
    `  ElectionCycleSummary,\n  ElectionForecast,`,
    `  ElectionCycleSummary,\n  ElectionEntityId,\n  ElectionForecast,`,
  ],
  [
    `  ElectionPollSummary,\n  ElectionResult,`,
    `  ElectionPollSummary,\n  ElectionRace,\n  ElectionResult,`,
  ],
  [
    `type ExtendedRace = ElectionRace & {\n  counties?: readonly { id: string; name: string; slug: string }[];`,
    `type ExtendedRace = ElectionRace & {\n  counties?: readonly { id: ElectionEntityId; name: string; slug: string }[];`,
  ],
  [
    `  issuePositions?: readonly unknown[];\n  recentStatements?: readonly unknown[];\n  votingRecord?: readonly unknown[];`,
    `  issuePositions?: CandidateDetail["issuePositions"];\n  recentStatements?: CandidateDetail["recentStatements"];\n  votingRecord?: CandidateDetail["votingRecord"];`,
  ],
  [
    `function raceCandidate(candidate: ExtendedCandidate) {`,
    `function raceCandidateStatus(\n  status: ElectionCandidate["status"],\n): "active" | "withdrawn" | "disqualified" | "write_in" {\n  if (status === "withdrawn" || status === "disqualified" || status === "write_in") return status;\n  return "active";\n}\n\nfunction raceCandidate(candidate: ExtendedCandidate) {`,
  ],
  [
    `    incumbent: candidate.incumbencyType !== "none",\n    imageUrl: candidate.imageUrl,\n    status: candidate.status,`,
    `    incumbent:\n      candidate.incumbencyType === "incumbent" ||\n      candidate.incumbencyType === "appointed_incumbent",\n    imageUrl: candidate.imageUrl,\n    status: raceCandidateStatus(candidate.status),`,
  ],
  [
    `          rating: forecast.rating,`,
    `          rating: forecast.rating === "safe_other" ? "unrated" : forecast.rating,`,
  ],
]);

await patch("scripts/elections/import-candidates.ts", [
  [
    `const updatedRaces = races.map((race) => ({\n  ...race,\n  candidateIds: [...new Set(candidateIdsByRace.get(race.id) ?? [])].sort(),\n  updatedAt: candidateIdsByRace.has(race.id) ? timestamp : race.updatedAt,\n}));`,
    `const updatedRaces = races.map((race) => {\n  const candidateIds = [...new Set(candidateIdsByRace.get(race.id) ?? [])].sort();\n  const hasOfficialCandidates = candidateIdsByRace.has(race.id);\n  return {\n    ...race,\n    candidateIds,\n    uncontested: hasOfficialCandidates ? candidateIds.length === 1 : race.uncontested,\n    updatedAt: hasOfficialCandidates ? timestamp : race.updatedAt,\n  };\n});`,
  ],
  [
    `  match = office.match(/SUPREME COURT.*PLACE (\\d+)/);`,
    `  if (/^CHIEF JUSTICE,? SUPREME COURT$/.test(office)) {\n    return "race-2026-texas-supreme-court-place-1";\n  }\n  match = office.match(/SUPREME COURT.*PLACE (\\d+)/);`,
  ],
]);

console.log("Applied strict Election Central source and type fixes.");

async function patch(file, replacements) {
  let content = await readFile(file, "utf8");
  let changed = false;
  for (const [before, after] of replacements) {
    const beforeMatches = content.split(before).length - 1;
    const afterMatches = content.split(after).length - 1;
    if (afterMatches === 1) continue;
    if (beforeMatches === 1) {
      content = content.replace(before, after);
      changed = true;
      continue;
    }
    throw new Error(
      `${file}: expected one unapplied or one already-applied target; found before=${beforeMatches}, after=${afterMatches}.`,
    );
  }
  if (changed) await writeFile(file, content);
}
