import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { calculatePollingAverage } from "../../src/lib/elections/pollingAverage.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = path.join(ROOT, "src/data/elections/2026");
const asOf = new Date(process.env.ELECTION_POLLING_AS_OF ?? Date.now());

const [polls, candidates, races] = await Promise.all([
  readJson("polls.json"),
  readJson("candidates.json"),
  readJson("races.json"),
]);
const candidateById = new Map(
  candidates
    .filter(isPublic)
    .map((candidate: Record<string, unknown>) => [String(candidate.id), candidate]),
);
const publicRaceIds = new Set(races.filter(isPublic).map((race: Record<string, unknown>) => String(race.id)));
const grouped = new Map<string, Record<string, unknown>[]>();

for (const poll of polls.filter(isPublic)) {
  const raceId = String(poll.raceId ?? "");
  if (!raceId || !publicRaceIds.has(raceId)) continue;
  grouped.set(raceId, [...(grouped.get(raceId) ?? []), poll]);
}

const output = [];
for (const [raceId, racePolls] of grouped) {
  const summaries = racePolls.map(toPollSummary).filter(Boolean);
  const average = calculatePollingAverage(summaries as never, asOf);
  if (!average) continue;
  output.push({
    raceId,
    pollCount: average.pollCount,
    fieldDateFrom: average.fieldDateFrom,
    fieldDateTo: average.fieldDateTo,
    calculatedAt: average.calculatedAt,
    weightedMargin: average.weightedMargin,
    uncertaintyRange: average.uncertaintyRange,
    candidates: average.candidates,
    pollWeights: average.pollWeights,
  });
}

output.sort((left, right) => left.raceId.localeCompare(right.raceId));
await writeFile(
  path.join(DATA_DIR, "polling-averages.json"),
  `${JSON.stringify(output, null, 2)}\n`,
);
console.log(`Generated ${output.length} weighted polling average record(s).`);

async function readJson(filename: string) {
  return JSON.parse(await readFile(path.join(DATA_DIR, filename), "utf8"));
}

function isPublic(record: Record<string, unknown>) {
  return record.publicationStatus === "published" && record.verificationStatus === "verified";
}

function toPollSummary(poll: Record<string, any>) {
  const question = (poll.questions ?? []).find(
    (item: Record<string, unknown>) => item.id === poll.primaryQuestionId,
  );
  if (!question) return null;
  return {
    id: poll.id,
    slug: poll.slug,
    electionCycleId: poll.electionCycleId,
    race: null,
    jurisdictionId: poll.jurisdictionId ?? null,
    jurisdictionName: null,
    title: poll.title,
    status: poll.status,
    pollsterName: poll.pollster?.name ?? "Unknown pollster",
    pollsterGrade: poll.pollster?.grade ?? "unrated",
    sponsors: poll.sponsors ?? [],
    fieldStartDate: poll.fieldStartDate,
    fieldEndDate: poll.fieldEndDate,
    releaseDate: poll.releaseDate ?? null,
    sourceUrl: poll.source?.sourceUrl,
    toplineUrl: poll.toplineUrl ?? null,
    methodology: poll.methodology,
    primaryQuestion: {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      sampleSize: question.sampleSize,
      population: question.population,
      responses: (question.responses ?? []).map((response: Record<string, any>) => {
        const candidate = response.candidateId
          ? candidateById.get(String(response.candidateId))
          : null;
        return {
          ...response,
          candidateSlug: candidate?.slug ?? null,
          candidateName: candidate?.fullName ?? null,
          candidateImageUrl: candidate?.imageUrl ?? null,
          partyLabel: candidate?.partyLabel ?? null,
        };
      }),
      leaderCandidateId:
        question.responses?.find((response: Record<string, unknown>) => response.isLeader)
          ?.candidateId ?? null,
      leaderLabel:
        question.responses?.find((response: Record<string, unknown>) => response.isLeader)?.label ??
        null,
      leaderPercentage:
        question.responses?.find((response: Record<string, unknown>) => response.isLeader)
          ?.percentage ?? null,
      leadMargin: null,
    },
    internalPoll: Boolean(poll.internalPoll),
    partisanPoll: Boolean(poll.partisanPoll),
    trackingPoll: Boolean(poll.trackingPoll),
    freshnessStatus: poll.freshnessStatus,
    verificationStatus: poll.verificationStatus,
    updatedAt: poll.updatedAt,
  };
}
