import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { hasEnoughContent, MIN_ARTICLES_DEFAULT } from "@/lib/content-readiness";
import { TEAMS } from "@/lib/texas-teams";
import { SUPPORTING_GUIDE_SLUGS } from "@/data/all-guides";

const GUIDE_LASTMOD = toIsoDate("2026-08-09T00:00:00-05:00");
const GSC_CANONICAL_REFRESH = toIsoDate("2026-08-11T12:30:00-05:00");
const CITATION_MAGNET_REFRESH = toIsoDate("2026-08-11T22:00:00-05:00");
const SPORTS_SITEMAP_LEAGUES = ["nfl", "mlb", "nba", "nhl", "mls", "nwsl", "wnba", "cfb"] as const;
const SPORTS_SITEMAP_TOPICS = ["football", "baseball", "basketball", "hockey", "soccer", "college", "recruiting", "nil", "business-policy", "stadiums", "motorsports", "postseason", "transactions", "injuries", "rivalries"] as const;
const SUPPORTING_GUIDE_LASTMOD = Object.fromEntries(
  SUPPORTING_GUIDE_SLUGS.map((slug) => [`/guides/${slug}`, GUIDE_LASTMOD]),
);

const STATIC_PAGE_LASTMOD_OVERRIDES: Record<string, string> = {
  "/news": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/houston": GSC_CANONICAL_REFRESH,
  "/keep-texas-red": GSC_CANONICAL_REFRESH,
  "/register-to-vote": GSC_CANONICAL_REFRESH,
  "/authors": GSC_CANONICAL_REFRESH,
  "/citation-guide": CITATION_MAGNET_REFRESH,
  "/texas-legislature": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/house": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/senate": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/current-session": CITATION_MAGNET_REFRESH,
  "/texas-legislature/sessions": toIsoDate("2026-08-07T00:00:00-05:00"),
  "/texas-legislature/votes": CITATION_MAGNET_REFRESH,
  "/texas-government": CITATION_MAGNET_REFRESH,
  "/texas-government/agencies": CITATION_MAGNET_REFRESH,
  "/laws": GUIDE_LASTMOD,
  "/laws/constitutional-amendments": CITATION_MAGNET_REFRESH,
  "/laws/effective-dates": CITATION_MAGNET_REFRESH,
  "/topics": GUIDE_LASTMOD,
  "/texas-politics": GUIDE_LASTMOD,
  "/texas-economy": GUIDE_LASTMOD,
  "/texas-border-security": GUIDE_LASTMOD,
  "/texas-energy": GUIDE_LASTMOD,
  "/texas-agriculture": GUIDE_LASTMOD,
  "/texas-veterans": GUIDE_LASTMOD,
  "/texas-law-enforcement": GUIDE_LASTMOD,
  "/guides/texas-agriculture-rural-guide": GUIDE_LASTMOD,
  "/guides/texas-veterans-military-guide": GUIDE_LASTMOD,
  "/guides/texas-law-enforcement-public-safety-guide": GUIDE_LASTMOD,
  ...SUPPORTING_GUIDE_LASTMOD,
};

const STATIC_PATHS:string[]=[
  "/","/news","/happening-now","/keep-texas-red",
  // /texas-news is a permanent alias for /news and is intentionally absent.
  "/houston","/dallas-fort-worth","/san-antonio","/austin","/el-paso","/texas-sports",
  // NOTE: /elections is a redirect to /elections/2026 and is intentionally absent —
  // the canonical election hub ships in sitemap-elections.xml.
  "/texas-business","/texas-legislature","/texas-legislature/house",
  "/texas-legislature/senate","/texas-legislature/current-session","/texas-legislature/sessions",
  "/texas-legislature/votes","/texas-government","/texas-government/agencies",
  "/about","/representatives","/register-to-vote","/contact-legislators",
  "/get-involved","/county-elections","/laws","/laws/constitutional-amendments","/laws/effective-dates",
  // /texas-laws and /texas-law-policy are permanent aliases for /laws.
  // Legacy candidate guides are noindex until rebuilt on verified Election Central data.
  // /legislative-updates redirects to /bills, /laws-to-know redirects to /laws,
  // and /voting-locations redirects to the verified Election Central voting page.
  "/contact","/privacy","/terms-of-service",
  "/shipping-policy","/return-refund-policy","/glossary","/editorial-standards","/citation-guide",
  "/topics","/texas-politics","/texas-economy","/texas-border-security","/texas-energy",
  "/texas-agriculture","/texas-veterans","/texas-law-enforcement",
  "/guides/texas-agriculture-rural-guide","/guides/texas-veterans-military-guide",
  "/guides/texas-law-enforcement-public-safety-guide",
  "/authors","/shop",
  // Representative detail pages live only in sitemap-representatives.xml —
  // listing them here duplicated 250+ URLs across two sitemaps.
];

export const Route=createFileRoute("/sitemap-pages.xml")({server:{handlers:{GET:async()=>{const paths=[...STATIC_PATHS,...SUPPORTING_GUIDE_SLUGS.map((slug)=>`/guides/${slug}`)];for(const league of SPORTS_SITEMAP_LEAGUES){if(await hasEnoughContent({kind:`sports-${league}`},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/${league}`)}for(const team of TEAMS){if(await hasEnoughContent({teamSlug:team.slug,league:team.league},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/team/${team.slug}`)}for(const topic of SPORTS_SITEMAP_TOPICS){if(await hasEnoughContent({keyword:topic},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/topic/${topic}`)}const entries:UrlEntry[]=paths.map((path)=>({loc:`${BASE_URL}${path}`,lastmod:STATIC_PAGE_LASTMOD_OVERRIDES[path] || undefined}));return xmlResponse(renderUrlset(entries))}}}});
