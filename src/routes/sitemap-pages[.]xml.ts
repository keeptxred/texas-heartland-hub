import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { hasEnoughContent, MIN_ARTICLES_DEFAULT } from "@/lib/content-readiness";
import { TEAMS } from "@/lib/texas-teams";
import { TEXAS_DATASETS } from "@/data/texas-data-center";
import {
  STATE_LEADERSHIP,
  US_HOUSE_DELEGATION,
  US_SENATORS,
  representativeSlug,
} from "@/data/representatives";

/** Static, public, indexable app routes. */
const STATIC_PATHS: string[] = [
  "/", "/news", "/news/non-political", "/happening-now", "/keep-texas-red", "/texas-news",
  "/texas-news/economy", "/texas-news/housing", "/texas-news/migration", "/texas-news/culture",
  "/texas-news/education", "/texas-news/sports-culture", "/houston", "/dallas-fort-worth",
  "/san-antonio", "/austin", "/el-paso", "/texas-sports", "/texas-business",
  "/texas-business/energy", "/texas-business/jobs", "/texas-business/relocations",
  "/texas-business/real-estate", "/texas-business/policy", "/elections", "/texas-legislature",
  "/texas-legislature/house", "/texas-legislature/senate", "/texas-legislature/current-session",
  "/texas-legislature/sessions", "/tax-calculator", "/texas-property-tax-protest-guide",
  "/texas-sales-tax-explained", "/texas-first-time-homebuyer-programs", "/moving-to-texas",
  "/moving-to-texas-checklist", "/find-my-dmv", "/living-in-texas", "/explore",
  "/explore/trip-planner", "/texas-financial-tools", "/texas-mortgage-calculator",
  "/texas-home-affordability-calculator", "/texas-down-payment-calculator",
  "/texas-closing-cost-calculator", "/texas-home-equity-growth-calculator",
  "/texas-mortgage-payoff-calculator", "/texas-homeownership-cost-calculator",
  "/texas-refinance-savings-calculator", "/texas-home-equity-calculator",
  "/texas-rent-vs-buy-calculator", "/texas-cost-of-living-calculator", "/texas-salary-calculator",
  "/texas-budget-planner", "/texas-home-insurance-calculator", "/texas-utility-cost-calculator",
  "/texas-moving-cost-calculator", "/texas-property-tax-increase-calculator",
  "/texas-down-payment-assistance-calculator", "/texas-salary-comparison-by-city", "/about",
  "/representatives", "/find-representative", "/register-to-vote", "/contact-legislators",
  "/get-involved", "/county-elections", "/candidate-guides", "/voting-locations", "/laws",
  "/texas-laws", "/laws-to-know", "/legislative-updates", "/contact", "/privacy", "/terms",
  "/terms-of-service", "/shipping-policy", "/return-refund-policy", "/glossary",
  "/editorial-standards", "/texas-politics", "/authors", "/texas-economy", "/texas-law-policy",
  "/shop", "/texas", "/texas/property-taxes-2026",
  "/texas/moving-to-texas-2026", "/texas-data",
  ...TEXAS_DATASETS.map((dataset) => `/texas-data/${dataset.slug}`),
  ...[...US_SENATORS, ...STATE_LEADERSHIP, ...US_HOUSE_DELEGATION].map(
    (representative) => `/representatives/${representativeSlug(representative.name)}`,
  ),
];

export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = toIsoDate(new Date());
        const paths = [...STATIC_PATHS];
        for (const league of ["nfl", "mlb", "nba"] as const) {
          if (await hasEnoughContent({ kind: `sports-${league}` }, MIN_ARTICLES_DEFAULT)) paths.push(`/texas-sports/${league}`);
        }
        for (const t of TEAMS) {
          if (await hasEnoughContent({ teamSlug: t.slug, league: t.league }, MIN_ARTICLES_DEFAULT)) paths.push(`/texas-sports/team/${t.slug}`);
        }
        const entries: UrlEntry[] = paths.map((p) => ({ loc: `${BASE_URL}${p}`, lastmod }));
        return xmlResponse(renderUrlset(entries));
      },
    },
  },
});
