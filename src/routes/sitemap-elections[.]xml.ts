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
        const entries = buildElectionSitemapEntries({
          lastmod: newestElectionUpdate(),
          races: publicRecords(races, "/elections/races/"),
          candidates: publicRecords(candidates, "/elections/candidates/"),
          additionalPages: [
            ...publicDistrictRecords(races),
            ...publicRecords(polls, "/elections/polls/"),
            ...publicRecords(forecasts, "/elections/forecast/"),
            ...publicRecords(results, "/elections/results/"),
          ],
        });
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});

function districtPathForRaceSlug(slug: string): string | null {
  const patterns: Array<[RegExp, string]> = [
    [/^2026-us-house-district-(\d{1,2})$/, "congressional-district"],
    [/^2026-texas-house-district-(\d{1,3})$/, "texas-house-district"],
    [/^2026-texas-senate-district-(\d{1,2})$/, "texas-senate-district"],
  ];
  for (const [pattern, prefix] of patterns) {
    const match = pattern.exec(slug);
    if (match) return `/elections/districts/${prefix}-${match[1]}`;
  }
  return null;
}

function publicDistrictRecords(records: readonly Record<string, unknown>[]) {
  return records.flatMap((record) => {
    if (
      record.publicationStatus !== "published" ||
      record.verificationStatus !== "verified" ||
      typeof record.slug !== "string"
    ) return [];
    const path = districtPathForRaceSlug(record.slug);
    return path
      ? [{
          path,
          canonicalPath: path,
          updatedAt: String(record.updatedAt ?? record.dataAsOf ?? newestElectionUpdate()),
          indexable: true,
        }]
      : [];
  });
}

function publicRecords(records: readonly Record<string, unknown>[], prefix: string) {
  return records
    .filter(
      (record) =>
        record.publicationStatus === "published" &&
        record.verificationStatus === "verified" &&
        typeof record.slug === "string",
    )
    .map((record) => ({
      path: `${prefix}${record.slug}`,
      canonicalPath: `${prefix}${record.slug}`,
      updatedAt: String(record.updatedAt ?? record.dataAsOf ?? newestElectionUpdate()),
      indexable: true,
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
