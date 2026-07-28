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

console.log("Applied strict Election Central typecheck fixes.");

async function patch(file, replacements) {
  let content = await readFile(file, "utf8");
  for (const [before, after] of replacements) {
    const matches = content.split(before).length - 1;
    if (matches !== 1) {
      throw new Error(`${file}: expected exactly one replacement target, found ${matches}.`);
    }
    content = content.replace(before, after);
  }
  await writeFile(file, content);
}
