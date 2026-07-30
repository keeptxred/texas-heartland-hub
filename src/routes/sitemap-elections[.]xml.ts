import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import candidates from "@/data/elections/2026/candidates.json";
import forecasts from "@/data/elections/2026/forecasts.json";
import polls from "@/data/elections/2026/polls.json";
import races from "@/data/elections/2026/races.json";
import results from "@/data/elections/2026/results.json";
import { candidateSeoSlug, raceSeoSlug } from "@/lib/elections/seoSlugs";
import { buildElectionSitemapEntries } from "@/lib/elections/sitemap";
import { renderUrlset, xmlResponse } from "@/lib/sitemap-shared";

export const Route = createFileRoute("/sitemap-elections.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = buildElectionSitemapEntries({
          lastmod: newestElectionUpdate(),
          races: publicRecords(races, "/elections/races/", raceSeoSlug),
          candidates: publicRecords(candidates, "/elections/candidates/", candidateSeoSlug),
          additionalPages: [
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

function publicRecords(
  records: readonly Record<string, unknown>[],
  prefix: string,
  normalizeSlug: (slug: string) => string = (slug) => slug,
) {
  return records
    .filter(
      (record) =>
        record.publicationStatus === "published" &&
        record.verificationStatus === "verified" &&
        typeof record.slug === "string",
    )
    .map((record) => {
      const slug = normalizeSlug(String(record.slug));
      return {
        path: `${prefix}${slug}`,
        canonicalPath: `${prefix}${slug}`,
        updatedAt: String(record.updatedAt ?? record.dataAsOf ?? newestElectionUpdate()),
        indexable: true,
      };
    });
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
