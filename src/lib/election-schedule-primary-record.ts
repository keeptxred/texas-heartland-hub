import cycleJson from "@/data/elections/2026/cycle.json";
import type { ClusterableFeedItem, StoryCluster } from "@/lib/story-clustering";

type ElectionCycleAuthority = {
  year: number;
  active?: boolean;
  verificationStatus?: string | null;
  milestones?: {
    registrationDeadline?: string | null;
    earlyVotingStart?: string | null;
    earlyVotingEnd?: string | null;
    absenteeBallotRequestDeadline?: string | null;
    absenteeBallotReturnDeadline?: string | null;
    generalElectionDate?: string | null;
  } | null;
  source?: {
    sourceName?: string | null;
    sourceType?: string | null;
    sourceUrl?: string | null;
  } | null;
};

export type VerifiedElectionSchedulePrimaryRecord = {
  year: number;
  sourceName: string;
  sourceUrl: string;
  registrationDeadline?: string | null;
  earlyVotingStart?: string | null;
  earlyVotingEnd?: string | null;
  absenteeBallotRequestDeadline?: string | null;
  absenteeBallotReturnDeadline?: string | null;
  generalElectionDate?: string | null;
};

const CYCLES = cycleJson as ElectionCycleAuthority[];
const TEXAS_CONTEXT_RE = /\b(texas|texans|statewide)\b/i;
const ELECTION_SCHEDULE_STORY_RE =
  /\b(voter registration|registration deadline|register(?:ed|ing)? to vote|last day to register|election day|election date|general election|uniform election date|early voting|ballot by mail|mail ballot deadline)\b/i;
const ELECTION_SCHEDULE_FACT_RE =
  /\b(register(?:ed|ing|ation)?|registration|deadline|election day|election date|general election|early voting|ballot by mail|mail ballot)\b/i;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function storyText(item: ClusterableFeedItem): string {
  return `${item.title ?? ""} ${item.description ?? ""} ${item.extracted_body ?? ""}`.trim();
}

export function isTexasElectionScheduleText(text: string): boolean {
  return TEXAS_CONTEXT_RE.test(text) && ELECTION_SCHEDULE_STORY_RE.test(text);
}

export function isElectionScheduleFactText(text: string): boolean {
  return ELECTION_SCHEDULE_FACT_RE.test(text);
}

function formatIsoDate(value?: string | null): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const month = MONTH_NAMES[Number(match[2]) - 1];
  if (!month) return null;
  return `${month} ${Number(match[3])}, ${match[1]}`;
}

export function verifiedElectionSchedulePrimaryRecord(
  item: ClusterableFeedItem,
): VerifiedElectionSchedulePrimaryRecord | null {
  const text = storyText(item);
  if (!isTexasElectionScheduleText(text)) return null;

  const year = Number(text.match(/\b(20\d{2})\b/)?.[1] ?? 0);
  const cycle = CYCLES.find((candidate) =>
    candidate.active !== false &&
    candidate.verificationStatus === "verified" &&
    candidate.source?.sourceType === "official" &&
    Boolean(candidate.source?.sourceUrl) &&
    (!year || candidate.year === year)
  );
  if (!cycle?.milestones || !cycle.source?.sourceUrl) return null;

  return {
    year: cycle.year,
    sourceName: cycle.source.sourceName?.trim() || "Texas Secretary of State",
    sourceUrl: cycle.source.sourceUrl,
    registrationDeadline: cycle.milestones.registrationDeadline,
    earlyVotingStart: cycle.milestones.earlyVotingStart,
    earlyVotingEnd: cycle.milestones.earlyVotingEnd,
    absenteeBallotRequestDeadline: cycle.milestones.absenteeBallotRequestDeadline,
    absenteeBallotReturnDeadline: cycle.milestones.absenteeBallotReturnDeadline,
    generalElectionDate: cycle.milestones.generalElectionDate,
  };
}

export function verifiedElectionSchedulePrimaryRecordForCluster(
  cluster: StoryCluster,
): VerifiedElectionSchedulePrimaryRecord | null {
  return verifiedElectionSchedulePrimaryRecord(cluster.primary);
}

export function electionSchedulePrimaryRecordNote(
  record: VerifiedElectionSchedulePrimaryRecord,
  contextText: string,
): string | null {
  const parts: string[] = [];

  if (/\b(register|registration)\b/i.test(contextText)) {
    const registration = formatIsoDate(record.registrationDeadline);
    const election = formatIsoDate(record.generalElectionDate);
    if (registration) parts.push(`voter registration deadline=${registration}`);
    if (election) parts.push(`general election date=${election}`);
  } else if (/\bearly voting\b/i.test(contextText)) {
    const start = formatIsoDate(record.earlyVotingStart);
    const end = formatIsoDate(record.earlyVotingEnd);
    if (start) parts.push(`early voting starts=${start}`);
    if (end) parts.push(`early voting ends=${end}`);
  } else if (/\b(ballot by mail|mail ballot)\b/i.test(contextText)) {
    const request = formatIsoDate(record.absenteeBallotRequestDeadline);
    const returned = formatIsoDate(record.absenteeBallotReturnDeadline);
    if (request) parts.push(`ballot-by-mail request deadline=${request}`);
    if (returned) parts.push(`ballot return deadline=${returned}`);
  } else if (/\b(election day|election date|general election)\b/i.test(contextText)) {
    const election = formatIsoDate(record.generalElectionDate);
    if (election) parts.push(`general election date=${election}`);
  }

  if (!parts.length) return null;
  return `${record.sourceName} verified primary record: ${parts.join("; ")}. Source: ${record.sourceUrl}`;
}

export function electionSchedulePrimaryRecordNoteForCluster(cluster: StoryCluster): string | null {
  const record = verifiedElectionSchedulePrimaryRecordForCluster(cluster);
  if (!record) return null;
  return electionSchedulePrimaryRecordNote(record, storyText(cluster.primary));
}
