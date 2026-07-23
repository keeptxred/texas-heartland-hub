import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { hasEnoughContent, MIN_ARTICLES_DEFAULT } from "@/lib/content-readiness";
import { TEAMS } from "@/lib/texas-teams";
import { calculators } from "@/data/calculators";

/** Static, public, indexable app routes. */
const STATIC_PATHS: string[] = [
  "/",
  "/news",
  "/news/non-political",
  "/happening-now",
  "/keep-texas-red",
  "/texas-news",
  "/texas-news/economy",
  "/texas-news/housing",
  "/texas-news/migration",
  "/texas-news/culture",
  "/texas-news/education",
  "/texas-news/sports-culture",
  "/houston",
  "/texas-sports",
  "/texas-business",
  "/texas-business/energy",
  "/texas-business/jobs",
  "/texas-business/relocations",
  "/texas-business/real-estate",
  "/texas-business/policy",
  "/elections",
  "/tax-calculator",
  "/about",
  "/representatives",
  "/find-representative",
  "/register-to-vote",
  "/contact-legislators",
  "/get-involved",
  "/county-elections",
  "/candidate-guides",
  "/voting-locations",
  "/laws",
  "/texas-laws",
  "/laws-to-know",
  "/legislative-updates",
  "/contact",
  "/privacy",
  "/terms",
  "/glossary",
  "/editorial-standards",
  "/texas-politics",
  "/authors",
  "/texas-economy",
  "/texas-law-policy",
  "/shop",
  "/texas",
  "/texas/no-state-income-tax-2026",
  "/texas/property-taxes-2026",
  "/texas/moving-to-texas-2026",
];

export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = toIsoDate(new Date());
        const paths = [...new Set([...STATIC_PATHS, ...calculators.map((calculator) => calculator.slug)])];

        // Only advertise sports section pages that meet the readiness
        // threshold — otherwise Google indexes thin/soft-404 shells.
        for (const league of ["nfl", "mlb", "nba"] as const) {
          if (await hasEnoughContent({ kind: `sports-${league}` }, MIN_ARTICLES_DEFAULT)) {
            paths.push(`/texas-sports/${league}`);
          }
        }
        for (const t of TEAMS) {
          if (await hasEnoughContent({ teamSlug: t.slug, league: t.league }, MIN_ARTICLES_DEFAULT)) {
            paths.push(`/texas-sports/team/${t.slug}`);
          }
        }

        const entries: UrlEntry[] = paths.map((p) => ({
          loc: `${BASE_URL}${p}`,
          lastmod,
        }));
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
