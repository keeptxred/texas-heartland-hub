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
  "/dallas-fort-worth",
  "/san-antonio",
  "/austin",
  "/el-paso",
  "/texas-sports",
  "/texas-business",
  "/texas-business/energy",
  "/texas-business/jobs",
  "/texas-business/relocations",
  "/texas-business/real-estate",
  "/texas-business/policy",
  "/elections",
  "/tax-calculator",
  "/moving-to-texas",
  "/moving-to-texas-checklist",
  "/find-my-dmv",
  "/living-in-texas",
  "/texas-financial-tools",
  "/texas-mortgage-calculator",
  "/texas-home-affordability-calculator",
  "/texas-down-payment-calculator",
  "/texas-closing-cost-calculator",
  "/texas-home-equity-growth-calculator",
  "/texas-mortgage-payoff-calculator",
  "/texas-homeownership-cost-calculator",
  "/texas-refinance-savings-calculator",
  "/texas-home-equity-calculator",
  "/texas-rent-vs-buy-calculator",
  "/texas-cost-of-living-calculator",
  "/texas-salary-calculator",
  "/texas-budget-planner",
  "/texas-home-insurance-calculator",
  "/texas-utility-cost-calculator",
  "/texas-moving-cost-calculator",
  "/texas-property-tax-increase-calculator",
  "/texas-down-payment-assistance-calculator",
  "/texas-salary-comparison-by-city",
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
        const paths = [...STATIC_PATHS];

        // Only advertise sports section pages that meet the readiness
        // threshold — otherwise Google indexes thin/soft-404 shells.
        for (const league of ["nfl", "mlb", "nba"] as const) {
          if (await hasEnoughContent({ kind: `sports-${league}` }, MIN_ARTICLES_DEFAULT)) {
            paths.push(`/texas-sports/${league}`);
          }
        }
        for (const t of TEAMS) {
          if (
            await hasEnoughContent({ teamSlug: t.slug, league: t.league }, MIN_ARTICLES_DEFAULT)
          ) {
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
