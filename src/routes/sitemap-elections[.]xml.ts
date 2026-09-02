import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse } from "@/lib/sitemap-shared";

/**
 * Search Console recovery policy: the election-detail inventory remains live and
 * internally linked, but Google is currently declining to crawl/index even the
 * strongest Election Central landing pages. Treat this sitemap as a priority queue
 * and advertise only the durable election hubs until those hubs are consistently
 * indexed. Detail races, candidates, polls, forecasts, and results can be promoted
 * again once crawl demand recovers and they meet the site's unique-value threshold.
 */
const PRIORITY_ELECTION_PATHS = [
  "/elections/2026",
  "/elections/races",
  "/elections/statewide",
  "/elections/legislative",
  "/elections/districts",
  "/elections/candidates",
  "/elections/polls",
  "/elections/forecast",
  "/elections/results",
  "/elections/voting",
  "/elections/voting/polling-hours",
  "/elections/voting/voter-registration-card",
  "/elections/voting/polling-place",
  "/elections/methodology",
] as const;

export const Route = createFileRoute("/sitemap-elections.xml")({
  server: {
    handlers: {
      GET: async () => xmlResponse(renderUrlset(
        PRIORITY_ELECTION_PATHS.map((path) => ({ loc: `${BASE_URL}${path}` })),
      )),
    },
  },
});
