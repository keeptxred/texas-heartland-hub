import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { hasEnoughContent, MIN_ARTICLES_DEFAULT } from "@/lib/content-readiness";
import { TEAMS } from "@/lib/texas-teams";

const STATIC_PAGE_LASTMOD_OVERRIDES: Record<string, string> = {
  "/news": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/house": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/senate": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/current-session": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/sessions": toIsoDate("2026-08-07T00:00:00-05:00"),
};

const STATIC_PATHS:string[]=[
  "/","/news","/happening-now","/keep-texas-red",
  // /texas-news remains reachable for compatibility, but it is no longer
  // promoted as a first-class sitemap target because its culture/lifestyle
  // framing belongs on TexasDefined after the site split.
  "/houston","/dallas-fort-worth","/san-antonio","/austin","/el-paso","/texas-sports",
  // NOTE: /elections is a 307 to /elections/2026 and is intentionally absent —
  // the canonical election hub ships in sitemap-elections.xml.
  "/texas-business","/texas-legislature","/texas-legislature/house",
  "/texas-legislature/senate","/texas-legislature/current-session","/texas-legislature/sessions",
  "/about","/representatives","/find-representative","/register-to-vote","/contact-legislators",
  "/get-involved","/county-elections","/laws","/texas-laws",
  // Legacy candidate guides are noindex until rebuilt on verified Election Central data.
  // /legislative-updates permanently redirects to the live /bills platform.
  // /voting-locations permanently redirects to the verified Election Central voting page.
  "/laws-to-know","/contact","/privacy","/terms-of-service",
  "/shipping-policy","/return-refund-policy","/glossary","/editorial-standards","/texas-politics",
  "/authors","/texas-economy","/texas-law-policy","/shop",
  // Representative detail pages live only in sitemap-representatives.xml —
  // listing them here duplicated 250+ URLs across two sitemaps.
];

export const Route=createFileRoute("/sitemap-pages.xml")({server:{handlers:{GET:async()=>{const paths=[...STATIC_PATHS];for(const league of ["nfl","mlb","nba"] as const){if(await hasEnoughContent({kind:`sports-${league}`},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/${league}`)}for(const team of TEAMS){if(await hasEnoughContent({teamSlug:team.slug,league:team.league},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/team/${team.slug}`)}const entries:UrlEntry[]=paths.map((path)=>({loc:`${BASE_URL}${path}`,lastmod:STATIC_PAGE_LASTMOD_OVERRIDES[path] || undefined}));return xmlResponse(renderUrlset(entries))}}}});
