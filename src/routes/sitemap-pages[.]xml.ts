import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  BASE_URL,
  renderUrlset,
  xmlResponse,
  toIsoDate,
  type UrlEntry,
} from "@/lib/sitemap-shared";
import { hasEnoughContent, MIN_ARTICLES_DEFAULT } from "@/lib/content-readiness";
import { TEAMS } from "@/lib/texas-teams";
import { TEXAS_DATASETS } from "@/data/texas-data-center";
import { entitiesForSite } from "@/shared/texas-platform/entities";
import { journeysForSite, topicsForSite } from "@/shared/texas-platform/registry";
import {
  STATE_LEADERSHIP,
  US_HOUSE_DELEGATION,
  US_SENATORS,
  TEXAS_HOUSE_MEMBERS,
  TEXAS_SENATE_MEMBERS,
  representativeSlug,
} from "@/data/representatives";

const STATIC_PAGE_LASTMOD = toIsoDate("2026-08-03T00:00:00-05:00");
const RESOURCE_SITE = "keeptxred" as const;
const RESOURCE_TYPES = [...new Set(entitiesForSite(RESOURCE_SITE).map((entity) => entity.type))];

const STATIC_PATHS: string[] = [
  "/", "/news", "/news/non-political", "/happening-now", "/keep-texas-red", "/texas-news",
  "/houston", "/dallas-fort-worth", "/san-antonio", "/austin", "/el-paso", "/texas-sports",
  "/texas-business", "/elections", "/texas-legislature", "/texas-legislature/house",
  "/texas-legislature/senate", "/texas-legislature/current-session", "/texas-legislature/sessions",
  "/texas-sales-tax-explained", "/texas-first-time-homebuyer-programs",
  "/find-my-dmv", "/texas-living", "/texas-resources",
  "/texas-mortgage-calculator", "/texas-home-affordability-calculator", "/texas-down-payment-calculator",
  "/texas-closing-cost-calculator", "/texas-home-equity-growth-calculator", "/texas-mortgage-payoff-calculator",
  "/texas-homeownership-cost-calculator", "/texas-refinance-savings-calculator", "/texas-home-equity-calculator",
  "/texas-rent-vs-buy-calculator", "/texas-cost-of-living-calculator", "/texas-salary-calculator",
  "/texas-budget-planner", "/texas-home-insurance-calculator", "/texas-utility-cost-calculator",
  "/texas-moving-cost-calculator", "/texas-down-payment-assistance-calculator",
  "/texas-salary-comparison-by-city", "/about", "/representatives", "/find-representative",
  "/register-to-vote", "/contact-legislators", "/get-involved", "/county-elections", "/candidate-guides",
  "/voting-locations", "/laws", "/texas-laws", "/laws-to-know", "/legislative-updates", "/contact",
  "/privacy", "/terms", "/terms-of-service", "/shipping-policy", "/return-refund-policy", "/glossary",
  "/editorial-standards", "/texas-politics", "/authors", "/texas-economy", "/texas-law-policy", "/shop",
  "/texas", "/texas/property-taxes-2026", "/texas/moving-to-texas-2026", "/texas-data",
  ...topicsForSite(RESOURCE_SITE).map((topic) => `/texas-resources/topic/${topic.id}`),
  ...journeysForSite(RESOURCE_SITE).map((journey) => `/texas-resources/journey/${journey.id}`),
  ...RESOURCE_TYPES.map((type) => `/texas-resources/type/${type}`),
  ...TEXAS_DATASETS.map((dataset) => `/texas-data/${dataset.slug}`),
  ...[
    ...US_SENATORS,
    ...STATE_LEADERSHIP,
    ...US_HOUSE_DELEGATION,
    ...TEXAS_SENATE_MEMBERS,
    ...TEXAS_HOUSE_MEMBERS,
  ].map((representative) => `/representatives/${representativeSlug(representative.name)}`),
];

export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [...STATIC_PATHS];
        for (const league of ["nfl", "mlb", "nba"] as const) {
          if (await hasEnoughContent({ kind: `sports-${league}` }, MIN_ARTICLES_DEFAULT)) paths.push(`/texas-sports/${league}`);
        }
        for (const team of TEAMS) {
          if (await hasEnoughContent({ teamSlug: team.slug, league: team.league }, MIN_ARTICLES_DEFAULT)) paths.push(`/texas-sports/team/${team.slug}`);
        }
        const entries: UrlEntry[] = paths.map((path) => ({ loc: `${BASE_URL}${path}`, lastmod: STATIC_PAGE_LASTMOD }));
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
