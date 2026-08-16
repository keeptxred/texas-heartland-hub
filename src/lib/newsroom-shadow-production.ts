import { decideNewsroomFormat, type NewsroomDecision } from "./newsroom-decision-engine";
import { selectDailyBriefItems } from "./newsroom-daily-brief";

export type ShadowCandidate = {
  id: string;
  clusterId: string;
  editorialScore: number;
  recommendedFormat: string | null;
  status: string;
  createdAt: string;
};

export type ShadowCluster = {
  id: string;
  canonicalSubject: string;
  pillarSlug: string | null;
  sourceCount: number;
  primarySourceCount: number;
  firstSeenAt: string;
};

export type ShadowMembership = {
  clusterId: string;
  relationshipType: string;
  isPrimarySource: boolean;
};

export type ShadowPacket = { clusterId: string };

export type ShadowDraft = {
  id: string;
  candidateId: string;
  clusterId: string;
  mode: string;
  status: string;
  mainWordCount: number | null;
  validationReasons: string[] | null;
  publishedArticleId: string | null;
  createdAt: string;
};

export type ShadowRow = {
  candidateId: string;
  clusterId: string;
  subject: string;
  pillar: string;
  score: number;
  storedDecision: string | null;
  replayDecision: NewsroomDecision;
  decisionMatches: boolean;
  status: string;
  sourceCount: number;
  primarySourceCount: number;
  trendSignalCount: number;
  hasResearchPacket: boolean;
  firstSeenAt: string;
};

export type ShadowReadinessCheck = {
  key: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type ShadowProductionResult = {
  rows: ShadowRow[];
  totalCandidates: number;
  advancedCandidates: number;
  decisionDriftCount: number;
  decisionAgreementRate: number;
  packetCoverageRate: number;
  primaryBackedRate: number;
  standaloneSelection: ShadowRow[];
  dailyBriefSelection: ShadowRow[];
  draftStats: {
    total: number;
    generated: number;
    rejected: number;
    validationPassRate: number;
    averageWordCount: number;
    publishedFromShadow: number;
  };
  readiness: ShadowReadinessCheck[];
  readyForControlledLaunch: boolean;
};

function pct(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;
}

export function evaluateNewsroomShadowProduction(input: {
  candidates: readonly ShadowCandidate[];
  clusters: readonly ShadowCluster[];
  memberships: readonly ShadowMembership[];
  packets: readonly ShadowPacket[];
  drafts: readonly ShadowDraft[];
}): ShadowProductionResult {
  const clusterById = new Map(input.clusters.map((cluster) => [cluster.id, cluster]));
  const packetClusters = new Set(input.packets.map((packet) => packet.clusterId));
  const membershipsByCluster = new Map<string, ShadowMembership[]>();
  for (const membership of input.memberships) {
    membershipsByCluster.set(membership.clusterId, [
      ...(membershipsByCluster.get(membership.clusterId) ?? []),
      membership,
    ]);
  }

  const rows = input.candidates.flatMap<ShadowRow>((candidate) => {
    const cluster = clusterById.get(candidate.clusterId);
    if (!cluster) return [];
    const memberships = membershipsByCluster.get(cluster.id) ?? [];
    const primarySourceCount = Math.max(
      cluster.primarySourceCount,
      memberships.filter((membership) => membership.isPrimarySource).length,
    );
    const trendSignalCount = memberships.filter((membership) => membership.relationshipType === "trend-signal").length;
    const replay = decideNewsroomFormat({
      editorialScore: candidate.editorialScore,
      sourceCount: cluster.sourceCount,
      primarySourceCount,
      trendSignalCount,
    });
    return [{
      candidateId: candidate.id,
      clusterId: cluster.id,
      subject: cluster.canonicalSubject,
      pillar: cluster.pillarSlug ?? "unrouted",
      score: candidate.editorialScore,
      storedDecision: candidate.recommendedFormat,
      replayDecision: replay.decision,
      decisionMatches: candidate.recommendedFormat === replay.decision,
      status: candidate.status,
      sourceCount: cluster.sourceCount,
      primarySourceCount,
      trendSignalCount,
      hasResearchPacket: packetClusters.has(cluster.id),
      firstSeenAt: cluster.firstSeenAt,
    }];
  }).sort((a, b) => b.score - a.score || Date.parse(a.firstSeenAt) - Date.parse(b.firstSeenAt));

  const comparable = rows.filter((row) => row.storedDecision !== null);
  const drift = comparable.filter((row) => !row.decisionMatches);
  const advanced = rows.filter((row) => row.replayDecision !== "SKIP");
  const packetBacked = advanced.filter((row) => row.hasResearchPacket);
  const primaryBacked = advanced.filter((row) => row.primarySourceCount > 0);

  const eligibleStandalone = rows
    .filter((row) => row.replayDecision !== "SKIP")
    .filter((row) => row.hasResearchPacket)
    .filter((row) => !["SELECTED", "PUBLISHED", "REJECTED"].includes(row.status));
  const standaloneSelection = eligibleStandalone.slice(0, 8);
  const standaloneIds = new Set(standaloneSelection.map((row) => row.candidateId));

  const briefIds = new Set(selectDailyBriefItems(
    rows.map((row) => ({
      id: row.candidateId,
      clusterId: row.clusterId,
      editorialScore: row.score,
      recommendedFormat: row.replayDecision,
      status: standaloneIds.has(row.candidateId) ? "SELECTED" : row.status,
      firstSeenAt: row.firstSeenAt,
      hasResearchPacket: row.hasResearchPacket,
    })),
    { reservedStandaloneSlots: 0 },
  ).map((row) => row.id));
  const dailyBriefSelection = rows.filter((row) => briefIds.has(row.candidateId));

  const shadowDrafts = input.drafts.filter((draft) => draft.mode === "shadow");
  const generatedDrafts = shadowDrafts.filter((draft) => draft.status === "GENERATED");
  const rejectedDrafts = shadowDrafts.filter((draft) => draft.status === "REJECTED");
  const wordCounts = shadowDrafts
    .map((draft) => draft.mainWordCount)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const publishedFromShadow = shadowDrafts.filter((draft) => Boolean(draft.publishedArticleId) || draft.status === "PUBLISHED").length;

  const decisionAgreementRate = pct(comparable.length - drift.length, comparable.length);
  const packetCoverageRate = pct(packetBacked.length, advanced.length);
  const primaryBackedRate = pct(primaryBacked.length, advanced.length);
  const validationPassRate = pct(generatedDrafts.length, generatedDrafts.length + rejectedDrafts.length);
  const averageWordCount = wordCounts.length
    ? Math.round(wordCounts.reduce((sum, value) => sum + value, 0) / wordCounts.length)
    : 0;

  const readiness: ShadowReadinessCheck[] = [
    {
      key: "decision_drift",
      label: "Deterministic decision drift",
      passed: drift.length === 0,
      detail: `${drift.length} of ${comparable.length} comparable live candidates differ from the current decision engine.`,
    },
    {
      key: "packet_coverage",
      label: "Research packet coverage",
      passed: packetCoverageRate >= 95,
      detail: `${packetCoverageRate}% of live non-SKIP candidates have research packets.`,
    },
    {
      key: "shadow_publication",
      label: "Shadow publication isolation",
      passed: publishedFromShadow === 0,
      detail: publishedFromShadow === 0
        ? "No shadow draft has a published article id."
        : `${publishedFromShadow} shadow draft(s) appear to have reached publication.`,
    },
    {
      key: "live_volume",
      label: "Live sample volume",
      passed: rows.length >= 20,
      detail: `${rows.length} live candidates are present in the observation window.`,
    },
  ];

  if (shadowDrafts.length > 0) {
    readiness.push({
      key: "draft_validation",
      label: "Shadow draft validation",
      passed: validationPassRate >= 80,
      detail: `${validationPassRate}% of ${generatedDrafts.length + rejectedDrafts.length} completed shadow drafts passed validation.`,
    });
  }

  return {
    rows,
    totalCandidates: rows.length,
    advancedCandidates: advanced.length,
    decisionDriftCount: drift.length,
    decisionAgreementRate,
    packetCoverageRate,
    primaryBackedRate,
    standaloneSelection,
    dailyBriefSelection,
    draftStats: {
      total: shadowDrafts.length,
      generated: generatedDrafts.length,
      rejected: rejectedDrafts.length,
      validationPassRate,
      averageWordCount,
      publishedFromShadow,
    },
    readiness,
    readyForControlledLaunch: readiness.every((check) => check.passed),
  };
}
