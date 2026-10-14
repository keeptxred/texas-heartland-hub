import { createFileRoute } from "@tanstack/react-router";
import { POLITICAL_SEARCH_GUIDES, type PoliticalSearchGuideCategory } from "@/data/political-search-guides";
import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { LAW_TOPICS } from "@/data/law-topics";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";
import { ALL_REPRESENTATIVE_AUTHORITY } from "@/data/representative-authority";
import { TEXAS_LEGISLATIVE_SEATS } from "@/data/texas-legislators.generated";
import { stateDistrictSlug } from "@/lib/state-districts";

const POLITICAL_REVIEW_DAYS: Record<PoliticalSearchGuideCategory, number> = {
  races: 7,
  redistricting: 14,
  demographics: 90,
  issues: 30,
  grassroots: 7,
};
const POLICY_REVIEW_DAYS = 30;
const LAW_REVIEW_DAYS = 90;
const DATA_REVIEW_DAYS = 90;
const AGENCY_REVIEW_DAYS = 60;
const DISTRICT_REVIEW_DAYS = 90;
const REPRESENTATIVE_REVIEW_DAYS = 30;

type FreshnessItem = {
  kind: "political-reference" | "policy-tracker" | "law-topic" | "data-source-map" | "agency-authority" | "state-district" | "representative";
  slug: string;
  path: string;
  reviewed: string;
  reviewDays: number;
  dueAt: string;
  overdue: boolean;
};

type ReviewableDataSet = { slug: string; updated: string };

function dueDate(reviewed: string, days: number) {
  const due = new Date(`${reviewed}T12:00:00-05:00`);
  due.setUTCDate(due.getUTCDate() + days);
  return due;
}

function mapDataFreshness(datasets: readonly ReviewableDataSet[], now: Date): FreshnessItem[] {
  return datasets.map((dataset) => {
    const due = dueDate(dataset.updated, DATA_REVIEW_DAYS);
    return {
      kind: "data-source-map",
      slug: dataset.slug,
      path: `/data/${dataset.slug}`,
      reviewed: dataset.updated,
      reviewDays: DATA_REVIEW_DAYS,
      dueAt: due.toISOString(),
      overdue: due.getTime() < now.getTime(),
    };
  });
}

function handler() {
  const now = new Date();
  const dataSetItems: FreshnessItem[] = [
    ...mapDataFreshness(TEXAS_DATA_SETS, now),
    ...mapDataFreshness(ACCOUNTABILITY_DATA_SETS, now),
  ];

  const items: FreshnessItem[] = [
    ...POLITICAL_SEARCH_GUIDES.map((guide) => {
      const reviewDays = POLITICAL_REVIEW_DAYS[guide.category];
      const due = dueDate(guide.updated, reviewDays);
      return { kind: "political-reference" as const, slug: guide.slug, path: `/texas-political-reference/${guide.slug}`, reviewed: guide.updated, reviewDays, dueAt: due.toISOString(), overdue: due.getTime() < now.getTime() };
    }),
    ...POLICY_TRACKERS.map((tracker) => {
      const due = dueDate(tracker.updated, POLICY_REVIEW_DAYS);
      return { kind: "policy-tracker" as const, slug: tracker.slug, path: `/policy/${tracker.slug}`, reviewed: tracker.updated, reviewDays: POLICY_REVIEW_DAYS, dueAt: due.toISOString(), overdue: due.getTime() < now.getTime() };
    }),
    ...LAW_TOPICS.map((topic) => {
      const due = dueDate(topic.updated, LAW_REVIEW_DAYS);
      return { kind: "law-topic" as const, slug: topic.slug, path: `/laws/topic/${topic.slug}`, reviewed: topic.updated, reviewDays: LAW_REVIEW_DAYS, dueAt: due.toISOString(), overdue: due.getTime() < now.getTime() };
    }),
    ...dataSetItems,
    ...AGENCY_AUTHORITY_PROFILES.map((agency) => {
      const due = dueDate(agency.reviewed, AGENCY_REVIEW_DAYS);
      return { kind: "agency-authority" as const, slug: agency.slug, path: `/texas-government/agencies/${agency.slug}`, reviewed: agency.reviewed, reviewDays: AGENCY_REVIEW_DAYS, dueAt: due.toISOString(), overdue: due.getTime() < now.getTime() };
    }),
    ...ALL_REPRESENTATIVE_AUTHORITY.map((profile) => {
      const due = dueDate(profile.reviewedAt, REPRESENTATIVE_REVIEW_DAYS);
      return { kind: "representative" as const, slug: profile.slug, path: `/representatives/${profile.slug}`, reviewed: profile.reviewedAt, reviewDays: REPRESENTATIVE_REVIEW_DAYS, dueAt: due.toISOString(), overdue: due.getTime() < now.getTime() };
    }),
    ...TEXAS_LEGISLATIVE_SEATS.map((seat) => {
      const slug = stateDistrictSlug(seat.chamber, seat.district);
      const reviewed = seat.authority?.reviewedAt ?? "2026-07-31";
      const due = dueDate(reviewed, DISTRICT_REVIEW_DAYS);
      return { kind: "state-district" as const, slug, path: `/districts/${slug}`, reviewed, reviewDays: DISTRICT_REVIEW_DAYS, dueAt: due.toISOString(), overdue: due.getTime() < now.getTime() };
    }),
  ].sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));

  const overdue = items.filter((item) => item.overdue);
  const countsByKind = items.reduce<Record<FreshnessItem["kind"], { total: number; overdue: number }>>((counts, item) => {
    const entry = counts[item.kind] ?? { total: 0, overdue: 0 };
    entry.total += 1;
    if (item.overdue) entry.overdue += 1;
    counts[item.kind] = entry;
    return counts;
  }, {} as Record<FreshnessItem["kind"], { total: number; overdue: number }>);
  const upcoming = items.filter((item) => !item.overdue).slice(0, 40);
  return Response.json({
    ok: true,
    checkedAt: now.toISOString(),
    standard: {
      politicalReference: POLITICAL_REVIEW_DAYS,
      policyTrackerDays: POLICY_REVIEW_DAYS,
      lawTopicDays: LAW_REVIEW_DAYS,
      dataSourceMapDays: DATA_REVIEW_DAYS,
      agencyAuthorityDays: AGENCY_REVIEW_DAYS,
      stateDistrictDays: DISTRICT_REVIEW_DAYS,
      representativeDays: REPRESENTATIVE_REVIEW_DAYS,
      note: "This endpoint identifies pages due for source review. It does not invent or auto-update facts; primary-source refresh remains required before changing dated claims.",
    },
    totalPages: items.length,
    overdueCount: overdue.length,
    countsByKind,
    overdue,
    nextDue: upcoming,
  }, {
    headers: { "cache-control": "public, max-age=900, s-maxage=900" },
  });
}

export const Route = createFileRoute("/api/reference-freshness")({
  server: { handlers: { GET: handler } },
});
