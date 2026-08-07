import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { hasEnoughContent, MIN_ARTICLES_DEFAULT } from "@/lib/content-readiness";
import { TEAMS } from "@/lib/texas-teams";

const DEFAULT_STATIC_PAGE_LASTMOD = toIsoDate("2026-08-03T00:00:00-05:00");
const STATIC_PAGE_LASTMOD_OVERRIDES: Record<string, string> = {
  "/news": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/house": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/senate": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/current-session": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/sessions": toIsoDate("2026-08-07T00:00:00-05:00"),
};

const STATIC_PATHS:string[]=[
  "/","/news","/happening-now","/keep-texas-red","/texas-news",
  "/houston","/dallas-fort-worth","/san-antonio","/austin","/el-paso","/texas-sports",
  // NOTE: /elections is a 307 to /elections/2026 and is intentionally absent —
  // the canonical election hub ships in sitemap-elections.xml.
  "/texas-business","/texas-legislature","/texas-legislature/house",
  "/texas-legislature/senate","/texas-legislature/current-session","/texas-legislature/sessions",
  "/about","/representatives","/find-representative","/register-to-vote","/contact-legislators",
  "/get-involved","/county-elections","/candidate-guides","/voting-locations","/laws","/texas-laws",
  "/laws-to-know","/legislative-updates","/contact","/privacy","/terms-of-service",
  "/shipping-policy","/return-refund-policy","/glossary","/editorial-standards","/texas-politics",
  "/authors","/texas-economy","/texas-law-policy","/shop",
  // Representative detail pages live only in sitemap-representatives.xml —
  // listing them here duplicated 250+ URLs across two sitemaps.
];

export const Route=createFileRoute("/sitemap-pages.xml")({server:{handlers:{GET:async()=>{const paths=[...STATIC_PATHS];for(const league of ["nfl","mlb","nba"] as const){if(await hasEnoughContent({kind:`sports-${league}`},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/${league}`)}for(const team of TEAMS){if(await hasEnoughContent({teamSlug:team.slug,league:team.league},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/team/${team.slug}`)}const entries:UrlEntry[]=paths.map((path)=>({loc:`${BASE_URL}${path}`,lastmod:STATIC_PAGE_LASTMOD_OVERRIDES[path] ?? DEFAULT_STATIC_PAGE_LASTMOD}));return xmlResponse(renderUrlset(entries))}}}});
