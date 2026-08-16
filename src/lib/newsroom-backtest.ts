import { decideNewsroomFormat, type NewsroomDecision } from "./newsroom-decision-engine";

export type BacktestCandidate = {
  id: string;
  clusterId: string;
  editorialScore: number;
  recommendedFormat: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
};

export type BacktestCluster = {
  id: string;
  canonicalSubject: string;
  pillarSlug: string | null;
  sourceCount: number;
  primarySourceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  publishedAt: string | null;
};

export type BacktestMembership = {
  clusterId: string;
  relationshipType: string;
  isPrimarySource: boolean;
};

export type BacktestRow = {
  candidateId: string;
  clusterId: string;
  subject: string;
  pillar: string;
  editorialScore: number;
  historicalFormat: string | null;
  replayDecision: NewsroomDecision;
  replayReason: string;
  published: boolean;
  publishedAt: string | null;
  sourceCount: number;
  primarySourceCount: number;
  trendSignalCount: number;
  firstSeenAt: string;
  createdAt: string;
};

export type ThresholdSweepRow = {
  threshold: number;
  advanced: number;
  skipped: number;
  publishedCaptured: number;
  publishedMissed: number;
  captureRate: number;
  yieldRate: number;
};

export type NewsroomBacktestResult = {
  totalCandidates: number;
  publishedCandidates: number;
  replayAdvanced: number;
  replaySkipped: number;
  publishedCaptured: number;
  publishedMissed: number;
  captureRate: number;
  yieldRate: number;
  historicalAgreementRate: number | null;
  decisionCounts: Record<NewsroomDecision, number>;
  pillarCounts: Record<string, number>;
  thresholdSweep: ThresholdSweepRow[];
  rows: BacktestRow[];
};

function pct(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;
}

export function runNewsroomHistoricalBacktest(input: {
  candidates: readonly BacktestCandidate[];
  clusters: readonly BacktestCluster[];
  memberships: readonly BacktestMembership[];
}): NewsroomBacktestResult {
  const clusterById = new Map(input.clusters.map((cluster) => [cluster.id, cluster]));
  const membershipsByCluster = new Map<string, BacktestMembership[]>();
  for (const membership of input.memberships) {
    membershipsByCluster.set(membership.clusterId, [
      ...(membershipsByCluster.get(membership.clusterId) ?? []),
      membership,
    ]);
  }

  const rows = input.candidates.flatMap<BacktestRow>((candidate) => {
    const cluster = clusterById.get(candidate.clusterId);
    if (!cluster) return [];
    const memberships = membershipsByCluster.get(candidate.clusterId) ?? [];
    const primarySourceCount = Math.max(
      cluster.primarySourceCount,
      memberships.filter((membership) => membership.isPrimarySource).length,
    );
    const trendSignalCount = memberships.filter(
      (membership) => membership.relationshipType === "trend-signal",
    ).length;
    const replay = decideNewsroomFormat({
      editorialScore: candidate.editorialScore,
      sourceCount: cluster.sourceCount,
      primarySourceCount,
      trendSignalCount,
    });
    return [{
      candidateId: candidate.id,
      clusterId: candidate.clusterId,
      subject: cluster.canonicalSubject,
      pillar: cluster.pillarSlug ?? "unrouted",
      editorialScore: candidate.editorialScore,
      historicalFormat: candidate.recommendedFormat,
      replayDecision: replay.decision,
      replayReason: replay.reason,
      published: Boolean(candidate.publishedAt || cluster.publishedAt || candidate.status === "PUBLISHED"),
      publishedAt: candidate.publishedAt ?? cluster.publishedAt,
      sourceCount: cluster.sourceCount,
      primarySourceCount,
      trendSignalCount,
      firstSeenAt: cluster.firstSeenAt,
      createdAt: candidate.createdAt,
    }];
  }).sort((a, b) => b.editorialScore - a.editorialScore || Date.parse(a.firstSeenAt) - Date.parse(b.firstSeenAt));

  const publishedCandidates = rows.filter((row) => row.published).length;
  const replayAdvanced = rows.filter((row) => row.replayDecision !== "SKIP").length;
  const publishedCaptured = rows.filter((row) => row.published && row.replayDecision !== "SKIP").length;
  const publishedMissed = publishedCandidates - publishedCaptured;
  const comparable = rows.filter((row) => row.historicalFormat);
  const historicalAgreement = comparable.filter((row) => row.historicalFormat === row.replayDecision).length;

  const decisionCounts: Record<NewsroomDecision, number> = { SKIP: 0, SINGLE: 0, MERGE: 0, SYNTHESIS: 0 };
  const pillarCounts: Record<string, number> = {};
  for (const row of rows) {
    decisionCounts[row.replayDecision] += 1;
    pillarCounts[row.pillar] = (pillarCounts[row.pillar] ?? 0) + 1;
  }

  const thresholdSweep = [35, 40, 45, 50, 55, 60, 65, 70].map((threshold): ThresholdSweepRow => {
    const advancedRows = rows.filter((row) => row.editorialScore >= threshold);
    const publishedCapturedAtThreshold = advancedRows.filter((row) => row.published).length;
    return {
      threshold,
      advanced: advancedRows.length,
      skipped: rows.length - advancedRows.length,
      publishedCaptured: publishedCapturedAtThreshold,
      publishedMissed: publishedCandidates - publishedCapturedAtThreshold,
      captureRate: pct(publishedCapturedAtThreshold, publishedCandidates),
      yieldRate: pct(publishedCapturedAtThreshold, advancedRows.length),
    };
  });

  return {
    totalCandidates: rows.length,
    publishedCandidates,
    replayAdvanced,
    replaySkipped: rows.length - replayAdvanced,
    publishedCaptured,
    publishedMissed,
    captureRate: pct(publishedCaptured, publishedCandidates),
    yieldRate: pct(publishedCaptured, replayAdvanced),
    historicalAgreementRate: comparable.length ? pct(historicalAgreement, comparable.length) : null,
    decisionCounts,
    pillarCounts,
    thresholdSweep,
    rows,
  };
}
