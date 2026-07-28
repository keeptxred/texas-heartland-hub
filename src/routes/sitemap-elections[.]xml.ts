import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import candidates from "@/data/elections/2026/candidates.json";
import forecasts from "@/data/elections/2026/forecasts.json";
import polls from "@/data/elections/2026/polls.json";
import races from "@/data/elections/2026/races.json";
import results from "@/data/elections/2026/results.json";
import { buildElectionSitemapEntries } from "@/lib/elections/sitemap";
import { renderUrlset, xmlResponse } from "@/lib/sitemap-shared";

export const Route = createFileRoute("/sitemap-elections.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          ...buildElectionSitemapEntries({
            lastModified: newestElectionUpdate(),
          }),
          ...publicEntries(races, "/elections/races/", 0.8),
          ...publicEntries(candidates, "/elections/candidates/", 0.7),
          ...publicEntries(polls, "/elections/polls/", 0.6),
          ...publicEntries(forecasts, "/elections/forecast/", 0.7),
          ...publicEntries(results, "/elections/results/", 0.7),
        ];
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});

function publicEntries(
  records: readonly Record<string, unknown>[],
  prefix: string,
  priority: number,
) {
  return records
    .filter(
      (record) =>
        record.publicationStatus === "published" &&
        record.verificationStatus === "verified" &&
        typeof record.slug === "string",
    )
    .map((record) => ({
      loc: `https://keeptxred.com${prefix}${record.slug}`,
      lastmod: dateOnly(String(record.updatedAt ?? record.dataAsOf ?? new Date().toISOString())),
      changefreq: prefix.includes("results") ? "hourly" : "daily",
      priority,
    }));
}

function newestElectionUpdate() {
  const dates = [...races, ...candidates, ...polls, ...forecasts, ...results]
    .map((record) => String(record.updatedAt ?? ""))
    .filter(Boolean)
    .sort();
  return dateOnly(dates.at(-1) ?? new Date().toISOString());
}

function dateOnly(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "2026-07-28" : parsed.toISOString().slice(0, 10);
}
