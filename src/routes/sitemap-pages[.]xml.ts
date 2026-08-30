import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { BASE_URL, renderUrlset, xmlResponse, toIsoDate, type UrlEntry } from "@/lib/sitemap-shared";
import { hasEnoughContent, MIN_ARTICLES_DEFAULT } from "@/lib/content-readiness";
import { TEAMS } from "@/lib/texas-teams";
import { ALL_GUIDES } from "@/data/all-guides";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";
import { TEXAS_CASE_POSITIONS } from "@/data/texas-case-all";
import { TEXAS_CASE_FACTS } from "@/data/texas-case-facts";
import { POLITICAL_SEARCH_GUIDES } from "@/data/political-search-guides";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";
import { LAW_TOPICS } from "@/data/law-topics";
import { TEXAS_DATA_SETS } from "@/data/texas-data-catalog";
import { ACCOUNTABILITY_DATA_SETS } from "@/data/accountability-data-catalog";
import { AGENCY_AUTHORITY_PROFILES } from "@/data/agency-authority";
import { issueGuides } from "@/data/issue-guides";
import { isIssueGuideIndexable } from "@/lib/issue-guide-indexability";
import { isPolicyTrackerIndexable } from "@/lib/policy-tracker-indexability";
import { isPoliticalReferenceIndexable } from "@/lib/political-reference-indexability";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";
import { isDataDetailIndexable } from "@/lib/data-detail-indexability";
import { isTexasCaseFactsIndexable } from "@/lib/texas-case-facts-indexability";
import { isTexasCasePositionIndexable } from "@/lib/texas-case-position-indexability";
import { isAgencyAuthorityIndexable } from "@/lib/agency-authority-indexability";

const GUIDE_LASTMOD = toIsoDate("2026-08-09T00:00:00-05:00");
const ISSUE_GUIDE_REFRESH = toIsoDate("2026-08-19T13:15:00-05:00");
const HANDBOOK_REFRESH = toIsoDate("2026-08-22T10:11:00-05:00");
const ACCOUNTABILITY_HANDBOOK_REFRESH = toIsoDate("2026-08-22T11:00:00-05:00");
const LOCAL_GOVERNMENT_HANDBOOK_REFRESH = toIsoDate("2026-08-22T11:25:00-05:00");
const GSC_CANONICAL_REFRESH = toIsoDate("2026-08-11T12:30:00-05:00");
const CITATION_MAGNET_REFRESH = toIsoDate("2026-08-11T22:00:00-05:00");
const TEXAS_CASE_REFRESH = toIsoDate("2026-08-18T23:00:00-05:00");
const POLITICAL_REFERENCE_REFRESH = toIsoDate("2026-08-18T23:53:00-05:00");
const POLICY_REFRESH = toIsoDate("2026-08-19T06:30:00-05:00");
const LAW_DATA_REFRESH = toIsoDate("2026-08-19T07:15:00-05:00");
const DISTRICT_REFRESH = toIsoDate("2026-08-19T07:35:00-05:00");
const AGENCY_REFRESH = toIsoDate("2026-08-19T07:40:00-05:00");
const CIVIC_TOOLS_REFRESH = toIsoDate("2026-08-19T08:00:00-05:00");
const POLITICAL_HISTORY_REFRESH = toIsoDate("2026-08-30T00:00:00-05:00");
const SPORTS_SITEMAP_LEAGUES = ["nfl", "mlb", "nba", "nhl", "mls", "nwsl", "wnba", "cfb"] as const;
const SPORTS_SITEMAP_TOPICS = ["football", "baseball", "basketball", "hockey", "soccer", "college", "recruiting", "nil", "business-policy", "stadiums", "motorsports", "postseason", "transactions", "injuries", "rivalries"] as const;
const INDEXABLE_GUIDES = Object.values(ALL_GUIDES).filter(isSupportingGuideIndexable);
const INDEXABLE_ISSUE_GUIDES = issueGuides.filter(isIssueGuideIndexable);
const INDEXABLE_POLICY_TRACKERS = ALL_POLICY_TRACKERS.filter(isPolicyTrackerIndexable);
const INDEXABLE_POLITICAL_SEARCH_GUIDES = POLITICAL_SEARCH_GUIDES.filter(isPoliticalReferenceIndexable);
const INDEXABLE_LAW_TOPICS = LAW_TOPICS.filter(isLawTopicIndexable);
const ALL_DATA_SETS = [...TEXAS_DATA_SETS, ...ACCOUNTABILITY_DATA_SETS];
const INDEXABLE_DATA_SETS = ALL_DATA_SETS.filter(isDataDetailIndexable);
const INDEXABLE_TEXAS_CASE_FACTS = TEXAS_CASE_FACTS.filter(isTexasCaseFactsIndexable);
const INDEXABLE_TEXAS_CASE_POSITIONS = TEXAS_CASE_POSITIONS.filter(isTexasCasePositionIndexable);
const INDEXABLE_AGENCY_AUTHORITY_PROFILES = AGENCY_AUTHORITY_PROFILES.filter(isAgencyAuthorityIndexable);
const GUIDE_LASTMOD_BY_PATH = Object.fromEntries(INDEXABLE_GUIDES.map((guide) => [`/guides/${guide.slug}`, GUIDE_LASTMOD]));
const TEXAS_CASE_LASTMOD = Object.fromEntries(INDEXABLE_TEXAS_CASE_POSITIONS.map((position) => [`/texas-case/${position.slug}`, toIsoDate(`${position.updated}T12:00:00-05:00`)]));
const TEXAS_CASE_FACTS_LASTMOD = Object.fromEntries(INDEXABLE_TEXAS_CASE_FACTS.map((facts) => [`/texas-case/facts/${facts.slug}`, toIsoDate(`${facts.reviewed}T12:00:00-05:00`)]));
const POLITICAL_REFERENCE_LASTMOD = Object.fromEntries(INDEXABLE_POLITICAL_SEARCH_GUIDES.map((guide) => [`/texas-political-reference/${guide.slug}`, toIsoDate(`${guide.updated}T12:00:00-05:00`)]));
const POLICY_TRACKER_LASTMOD = Object.fromEntries(INDEXABLE_POLICY_TRACKERS.map((tracker) => [`/policy/${tracker.slug}`, toIsoDate(`${tracker.updated}T12:00:00-05:00`)]));
const LAW_TOPIC_LASTMOD = Object.fromEntries(INDEXABLE_LAW_TOPICS.map((topic) => [`/laws/topic/${topic.slug}`, toIsoDate(`${topic.updated}T12:00:00-05:00`)]));
const DATA_SET_LASTMOD = Object.fromEntries(INDEXABLE_DATA_SETS.map((dataset) => [`/data/${dataset.slug}`, toIsoDate(`${dataset.updated}T12:00:00-05:00`)]));
const AGENCY_LASTMOD = Object.fromEntries(INDEXABLE_AGENCY_AUTHORITY_PROFILES.map((agency) => [`/texas-government/agencies/${agency.slug}`, toIsoDate(`${agency.reviewed}T12:00:00-05:00`)]));
const ISSUE_GUIDE_LASTMOD = Object.fromEntries(INDEXABLE_ISSUE_GUIDES.map((guide) => [`/issues/${guide.slug}`, ISSUE_GUIDE_REFRESH]));

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
  "/texas-government/agencies": AGENCY_REFRESH,
  "/districts": DISTRICT_REFRESH,
  "/laws": LAW_DATA_REFRESH,
  "/laws/topics": LAW_DATA_REFRESH,
  "/laws/constitutional-amendments": CITATION_MAGNET_REFRESH,
  "/laws/effective-dates": CITATION_MAGNET_REFRESH,
  "/data": LAW_DATA_REFRESH,
  "/civic-tools": CIVIC_TOOLS_REFRESH,
  "/civic-tools/government-authority-finder": CIVIC_TOOLS_REFRESH,
  "/civic-tools/texas-law-finder": CIVIC_TOOLS_REFRESH,
  "/civic-tools/bill-finder": CIVIC_TOOLS_REFRESH,
  "/civic-tools/compare-legislators": CIVIC_TOOLS_REFRESH,
  "/topics": GUIDE_LASTMOD,
  "/issues": ISSUE_GUIDE_REFRESH,
  "/issues/texas-policy-handbook": HANDBOOK_REFRESH,
  "/issues/texas-government-accountability-handbook": ACCOUNTABILITY_HANDBOOK_REFRESH,
  "/issues/texas-local-government-handbook": LOCAL_GOVERNMENT_HANDBOOK_REFRESH,
  "/tools": ISSUE_GUIDE_REFRESH,
  "/tools/texas-spending-growth-cap": ISSUE_GUIDE_REFRESH,
  "/tools/texas-tax-structure-comparison": ISSUE_GUIDE_REFRESH,
  "/tools/texas-rainy-day-fund": ISSUE_GUIDE_REFRESH,
  "/tools/texas-budget-headroom": ISSUE_GUIDE_REFRESH,
  "/texas-politics": POLITICAL_HISTORY_REFRESH,
  "/texas-politics/texas-constitutional-history": POLITICAL_HISTORY_REFRESH,
  "/texas-politics/texas-election-history": POLITICAL_HISTORY_REFRESH,
  "/texas-politics/voting-rights-history": POLITICAL_HISTORY_REFRESH,
  "/texas-politics/texas-redistricting-history": POLITICAL_HISTORY_REFRESH,
  "/texas-political-reference": POLITICAL_REFERENCE_REFRESH,
  "/policy": POLICY_REFRESH,
  "/texas-economy": GUIDE_LASTMOD,
  "/texas-border-security": GUIDE_LASTMOD,
  "/texas-energy": GUIDE_LASTMOD,
  "/texas-agriculture": GUIDE_LASTMOD,
  "/texas-veterans": GUIDE_LASTMOD,
  "/texas-law-enforcement": GUIDE_LASTMOD,
  "/texas-case": TEXAS_CASE_REFRESH,
  "/texas-case/facts": TEXAS_CASE_REFRESH,
  ...GUIDE_LASTMOD_BY_PATH,
  ...TEXAS_CASE_LASTMOD,
  ...TEXAS_CASE_FACTS_LASTMOD,
  ...POLITICAL_REFERENCE_LASTMOD,
  ...POLICY_TRACKER_LASTMOD,
  ...LAW_TOPIC_LASTMOD,
  ...DATA_SET_LASTMOD,
  ...AGENCY_LASTMOD,
  ...ISSUE_GUIDE_LASTMOD,
};

const STATIC_PATHS:string[]=[
  "/","/news","/happening-now","/keep-texas-red",
  "/houston","/texas-sports",
  "/texas-business","/texas-legislature","/texas-legislature/house",
  "/texas-legislature/senate","/texas-legislature/current-session","/texas-legislature/sessions",
  "/texas-legislature/votes","/texas-government","/texas-government/agencies","/districts",
  "/about","/representatives","/register-to-vote","/contact-legislators",
  "/get-involved","/county-elections","/laws","/laws/topics","/laws/constitutional-amendments","/laws/effective-dates","/data",
  "/civic-tools","/civic-tools/government-authority-finder","/civic-tools/texas-law-finder","/civic-tools/bill-finder","/civic-tools/compare-legislators",
  "/contact","/privacy","/terms-of-service",
  "/shipping-policy","/return-refund-policy","/glossary","/editorial-standards","/citation-guide",
  "/topics","/issues","/issues/texas-policy-handbook","/issues/texas-government-accountability-handbook","/issues/texas-local-government-handbook","/tools","/tools/texas-spending-growth-cap","/tools/texas-tax-structure-comparison","/tools/texas-rainy-day-fund","/tools/texas-budget-headroom","/texas-politics","/texas-politics/texas-constitutional-history","/texas-politics/texas-election-history","/texas-politics/voting-rights-history","/texas-politics/texas-redistricting-history","/texas-political-reference","/policy","/texas-economy","/texas-border-security","/texas-energy",
  "/texas-agriculture","/texas-veterans","/texas-law-enforcement","/texas-case","/texas-case/facts",
  "/authors","/shop",
];

export const Route=createFileRoute("/sitemap-pages.xml")({server:{handlers:{GET:async()=>{const paths=[...STATIC_PATHS,...INDEXABLE_ISSUE_GUIDES.map((guide)=>`/issues/${guide.slug}`),...INDEXABLE_GUIDES.map((guide)=>`/guides/${guide.slug}`),...INDEXABLE_TEXAS_CASE_POSITIONS.map((position)=>`/texas-case/${position.slug}`),...INDEXABLE_TEXAS_CASE_FACTS.map((facts)=>`/texas-case/facts/${facts.slug}`),...INDEXABLE_POLITICAL_SEARCH_GUIDES.map((guide)=>`/texas-political-reference/${guide.slug}`),...INDEXABLE_POLICY_TRACKERS.map((tracker)=>`/policy/${tracker.slug}`),...INDEXABLE_LAW_TOPICS.map((topic)=>`/laws/topic/${topic.slug}`),...INDEXABLE_DATA_SETS.map((dataset)=>`/data/${dataset.slug}`),...INDEXABLE_AGENCY_AUTHORITY_PROFILES.map((agency)=>`/texas-government/agencies/${agency.slug}`)];for(const league of SPORTS_SITEMAP_LEAGUES){if(await hasEnoughContent({kind:`sports-${league}`},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/${league}`)}for(const team of TEAMS){if(await hasEnoughContent({teamSlug:team.slug,league:team.league},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/team/${team.slug}`)}for(const topic of SPORTS_SITEMAP_TOPICS){if(await hasEnoughContent({keyword:topic},MIN_ARTICLES_DEFAULT))paths.push(`/texas-sports/topic/${topic}`)}const entries:UrlEntry[]=paths.map((path)=>({loc:`${BASE_URL}${path}`,lastmod:STATIC_PAGE_LASTMOD_OVERRIDES[path] || undefined}));return xmlResponse(renderUrlset(entries))}}}});