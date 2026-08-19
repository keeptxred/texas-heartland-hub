import { createFileRoute } from "@tanstack/react-router";
import { POLITICAL_SEARCH_GUIDES, type PoliticalSearchGuideCategory } from "@/data/political-search-guides";
import { POLICY_TRACKERS } from "@/data/policy-trackers";
import { LAW_TOPICS } from "@/data/law-topics";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";

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

type FreshnessItem = {
  kind: "political-reference" | "policy-tracker" | "law-topic" | "data-source-map";
  slug: string;
  path: string;
  reviewed: string;
  reviewDays: number;
  dueAt: string;
  overdue: boolean;
};

function dueDate(reviewed: string, days: number) {
  const due = new Date(`${reviewed}T12:00:00-05:00`);
  due.setUTCDate(due.getUTCDate() + days);
  return due;
}

function handler() {
  const now = new Date();
  const items: FreshnessItem[] = [
    ...POLITICAL_SEARCH_GUIDES.map((guide) => {
      const reviewDays = POLITICAL_REVIEW_DAYS[guide.category];
      const due = dueDate(guide.updated, reviewDays);
      return {
        kind: "political-reference" as const,
        slug: guide.slug,
        path: `/texas-political-reference/${guide.slug}`,
        reviewed: guide.updated,
        reviewDays,
        dueAt: due.toISOString(),
        overdue: due.getTime() < now.getTime(),
      };
    }),
    ...POLICY_TRACKERS.map((tracker) => {
      const due = dueDate(tracker.updated, POLICY_REVIEW_DAYS);
      return {
        kind: "policy-tracker" as const,
        slug: tracker.slug,
        path: `/policy/${tracker.slug}`,
        reviewed: tracker.updated,
        reviewDays: POLICY_REVIEW_DAYS,
        dueAt: due.toISOString(),
        overdue: due.getTime() < now.getTime(),
      };
    }),
    ...LAW_TOPICS.map((topic) => {
      const due = dueDate(topic.updated, LAW_REVIEW_DAYS);
      return {
        kind: "law-topic" as const,
        slug: topic.slug,
        path: `/laws/topic/${topic.slug}`,
        reviewed: topic.updated,
        reviewDays: LAW_REVIEW_DAYS,
        dueAt: due.toISOString(),
        overdue: due.getTime() < now.getTime(),
      };
    }),
    ...TEXAS_DATA_SETS.map((dataset) => {
      const due = dueDate(dataset.updated, DATA_REVIEW_DAYS);
      return {
        kind: "data-source-map" as const,
        slug: dataset.slug,
        path: `/data/${dataset.slug}`,
        reviewed: dataset.updated,
        reviewDays: DATA_REVIEW_DAYS,
        dueAt: due.toISOString(),
        overdue: due.getTime() < now.getTime(),
      };
    }),
  ].sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));

  const overdue = items.filter((item) => item.overdue);
  const upcoming = items.filter((item) => !item.overdue).slice(0, 30);
  return Response.json({
    ok: true,
    checkedAt: now.toISOString(),
    standard: {
      politicalReference: POLITICAL_REVIEW_DAYS,
      policyTrackerDays: POLICY_REVIEW_DAYS,
      lawTopicDays: LAW_REVIEW_DAYS,
      dataSourceMapDays: DATA_REVIEW_DAYS,
      note: "This endpoint identifies pages due for source review. It does not invent or auto-update facts; primary-source refresh remains required before changing dated claims.",
    },
    totalPages: items.length,
    overdueCount: overdue.length,
    overdue,
    nextDue: upcoming,
  }, {
    headers: { "cache-control": "public, max-age=900, s-maxage=900" },
  });
}

export const Route = createFileRoute("/api/reference-freshness")({
  server: { handlers: { GET: handler } },
});
