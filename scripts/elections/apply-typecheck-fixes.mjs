import { readFile, writeFile } from "node:fs/promises";

await patch("src/components/elections/navigation/ElectionNavigation.tsx", [
  [
    `            const isActive =\n              currentPath === item.href ||\n              (item.href !== "/elections" && currentPath?.startsWith(\`${"${item.href}"}/\`));`,
    `            const isActive =\n              currentPath === item.href || currentPath?.startsWith(\`${"${item.href}"}/\`);`,
  ],
]);

await patch("src/lib/elections/repositories/static.ts", [
  [
    `  ElectionPollSummary,\n  ElectionResult,`,
    `  ElectionPollSummary,\n  ElectionRace,\n  ElectionResult,`,
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
]);

await patch("src/routes/elections.2026.tsx", [
  [
    `export const Route = createFileRoute("/elections/2026")({`,
    `export const Route = createFileRoute("/elections/2026" as never)({`,
  ],
]);

await patch("src/routes/elections.tsx", [
  [
    `    throw redirect({ to: "/elections/2026" });`,
    `    throw redirect({ to: "/elections/2026" as never });`,
  ],
]);

console.log("Applied strict Election Central typecheck fixes.");

async function patch(file, replacements) {
  let content = await readFile(file, "utf8");
  let changed = false;
  for (const [before, after] of replacements) {
    const beforeMatches = content.split(before).length - 1;
    const afterMatches = content.split(after).length - 1;
    if (beforeMatches === 1 && afterMatches === 0) {
      content = content.replace(before, after);
      changed = true;
      continue;
    }
    if (beforeMatches === 0 && afterMatches === 1) continue;
    throw new Error(
      `${file}: expected one unapplied or one already-applied target; found before=${beforeMatches}, after=${afterMatches}.`,
    );
  }
  if (changed) await writeFile(file, content);
}
