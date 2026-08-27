import { createCsrfMiddleware, createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { isExplicitlyRetiredStaticNewsPath } from "@/lib/retired-static-news";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// SEO URL cleanup: resolve hostname, legacy paths, trailing slashes, topic
// routes, and tracking parameters into one final canonical redirect.
const TOPIC_REDIRECT_PATHS = new Set(["/texas-news", "/texas-business"]);
const LEGACY_ELECTION_PATHS = new Map([
  ["/election", "/elections/2026"],
  ["/election-central", "/elections/2026"],
  ["/texas-elections", "/elections/2026"],
  ["/elections-2026", "/elections/2026"],
  ["/texas-news/elections", "/elections/2026"],
  ["/elections/forecasts", "/elections/forecast"],
  ["/elections/statewide-races", "/elections/statewide"],
  ["/elections/legislative-races", "/elections/legislative"],
  ["/elections/district", "/elections/districts"],
  ["/elections/2026/races", "/elections/races"],
  ["/elections/2026/candidates", "/elections/candidates"],
  ["/elections/2026/polls", "/elections/polls"],
  ["/elections/2026/forecast", "/elections/forecast"],
  ["/elections/2026/forecasts", "/elections/forecast"],
  ["/elections/2026/results", "/elections/results"],
]);
const LEGACY_CONTENT_PATHS = new Map([
  ["/houston-news", "/houston"],
  ["/property-taxes", "/news/texas-property-tax-guide"],
  ["/texas-news/tax-spending", "/texas-economy"],
  ["/texas-news/legislature", "/texas-legislature"],
  ["/texas-news/border", "/texas-border-security"],
  ["/texas-sports/team/aggies", "/texas-sports/team/texas-am"],
  ["/hubs", "/topics"],
  ["/hubs/texas-policy-law", "/laws"],
  ["/hubs/texas-politics", "/texas-politics"],
  ["/hubs/texas-economy", "/texas-economy"],
]);
const EXTERNAL_LEGACY_REDIRECTS = new Map([
  ["/tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  ["/texas-property-tax-protest-guide", "https://texasdefined.com/do/property-tax-protest"],
  ["/texas-financial-tools", "https://texasdefined.com/decide/financial-tools"],
  ["/living-in-texas", "https://texasdefined.com/texas-living"],
]);
const BAD_YEAR_NEWS_REDIRECTS = new Map([
  ["live-2001-01-28-texas-voter-registration-deadline-approaching-essential-guide-for-the--6rien8", "live-2026-01-28-texas-voter-registration-deadline-approaching-essential-guide-for-the--6rien8"],
  ["live-2001-02-11-texas-mail-in-ballot-deadlines-approach-for-march-2026-primary-electio-76tc0a", "live-2026-02-11-texas-mail-in-ballot-deadlines-approach-for-march-2026-primary-electio-76tc0a"],
  ["live-2001-02-17-texas-reaches-record-voter-registration-levels-ahead-of-march-primary--xy6p6f", "live-2026-02-17-texas-reaches-record-voter-registration-levels-ahead-of-march-primary--xy6p6f"],
  ["live-2001-02-24-state-election-officials-record-high-engagement-as-early-voting-for-ma-t31b6w", "live-2026-02-24-state-election-officials-record-high-engagement-as-early-voting-for-ma-t31b6w"],
  ["live-2001-04-29-streamlined-economic-growth-secretary-of-state-launches-texas-express--ovz2ap", "live-2026-04-29-streamlined-economic-growth-secretary-of-state-launches-texas-express--ovz2ap"],
  ["live-2001-05-12-empowering-texas-military-families-secretary-nelson-outlines-direct-vo-ftq1iy", "live-2026-05-12-empowering-texas-military-families-secretary-nelson-outlines-direct-vo-ftq1iy"],
  ["live-2001-05-13-everything-texas-voters-need-to-know-before-the-2026-primary-runoff-el-e2dz9h", "live-2026-05-13-everything-texas-voters-need-to-know-before-the-2026-primary-runoff-el-e2dz9h"],
  ["live-2001-05-22-secretary-of-state-jane-nelson-issues-guidelines-for-upcoming-texas-pr-ckq2qh", "live-2026-05-22-secretary-of-state-jane-nelson-issues-guidelines-for-upcoming-texas-pr-ckq2qh"],
  ["live-2001-06-02-texas-secretary-of-state-jane-nelson-announces-departure-from-governor-an4w84", "live-2026-06-02-texas-secretary-of-state-jane-nelson-announces-departure-from-governor-an4w84"],
  ["live-2001-06-05-secretary-of-state-refers-potential-noncitizen-vote-cases-for-investig-zfcqnz", "live-2025-06-05-secretary-of-state-refers-potential-noncitizen-vote-cases-for-investig-zfcqnz"],
  ["live-2001-06-18-secretary-of-state-jane-nelson-unveils-multi-million-dollar-election-s-dj4rhd", "live-2025-06-18-secretary-of-state-jane-nelson-unveils-multi-million-dollar-election-s-dj4rhd"],
  ["live-2001-06-23-texas-secretary-of-state-finalizes-ballot-order-for-upcoming-constitut-hogsor", "live-2025-06-23-texas-secretary-of-state-finalizes-ballot-order-for-upcoming-constitut-hogsor"],
  ["live-2001-06-25-official-ballot-order-set-for-upcoming-texas-constitutional-amendment--sxct31", "live-2025-06-25-official-ballot-order-set-for-upcoming-texas-constitutional-amendment--sxct31"],
  ["live-2001-07-02-international-consular-leaders-honor-texas-role-in-upcoming-america250-uo497h", "live-2026-07-02-international-consular-leaders-honor-texas-role-in-upcoming-america250-uo497h"],
  ["live-2001-07-14-texas-secretary-of-state-launches-rapid-business-registration-system-s-wd3r5u", "live-2026-07-14-texas-secretary-of-state-launches-rapid-business-registration-system-s-wd3r5u"],
  ["live-2001-07-16-final-oversight-secretary-nelson-reinforces-texas-election-security-pr-l47qrk", "live-2026-07-16-final-oversight-secretary-nelson-reinforces-texas-election-security-pr-l47qrk"],
  ["live-2001-07-17-a-legacy-of-reform-jane-nelson-concludes-tenure-as-texas-secretary-of--k0saf5", "live-2026-07-17-a-legacy-of-reform-jane-nelson-concludes-tenure-as-texas-secretary-of--k0saf5"],
  ["live-2001-07-23-streamlined-documents-texas-secretary-of-state-jane-nelson-launches-ap-c1e3us", "live-2025-07-23-streamlined-documents-texas-secretary-of-state-jane-nelson-launches-ap-c1e3us"],
  ["live-2001-08-12-secretary-of-state-jane-nelson-leads-critical-border-trade-discussions-8m50tf", "live-2025-08-12-secretary-of-state-jane-nelson-leads-critical-border-trade-discussions-8m50tf"],
  ["live-2001-10-03-october-6-deadline-secretary-of-state-nelson-issues-final-call-for-tex-r43bxj", "live-2025-10-03-october-6-deadline-secretary-of-state-nelson-issues-final-call-for-tex-r43bxj"],
  ["live-2001-10-17-a-guide-to-texas-early-voting-secretary-jane-nelson-outlines-key-deadl-arwqgp", "live-2025-10-17-a-guide-to-texas-early-voting-secretary-jane-nelson-outlines-key-deadl-arwqgp"],
  ["live-2001-10-20-secretary-jane-nelson-enhances-texas-election-integrity-with-federal-d-3ocr9t", "live-2025-10-20-secretary-jane-nelson-enhances-texas-election-integrity-with-federal-d-3ocr9t"],
  ["live-2001-10-29-texas-voter-turnout-surges-with-half-a-million-early-ballots-recorded--irss2i", "live-2025-10-29-texas-voter-turnout-surges-with-half-a-million-early-ballots-recorded--irss2i"],
  ["live-2001-10-30-texas-secretary-of-state-defends-constitutionality-of-state-primary-el-fcshc", "live-2025-10-30-texas-secretary-of-state-defends-constitutionality-of-state-primary-el-fcshc"],
  ["live-2001-10-31-voter-preparation-guide-for-the-texas-constitutional-amendment-electio-tgr8b3", "live-2025-10-31-voter-preparation-guide-for-the-texas-constitutional-amendment-electio-tgr8b3"],
  ["live-2001-11-06-texas-breaks-all-time-record-with-3-million-active-business-entities-a-qxu7on", "live-2025-11-06-texas-breaks-all-time-record-with-3-million-active-business-entities-a-qxu7on"],
  ["live-2001-11-25-harris-county-election-procedures-under-fire-after-texas-secretary-of--xfu59l", "live-2025-11-25-harris-county-election-procedures-under-fire-after-texas-secretary-of--xfu59l"],
  ["live-2001-12-18-texas-secretary-of-state-announces-temporary-relocation-of-public-serv-mdazcr", "live-2025-12-18-texas-secretary-of-state-announces-temporary-relocation-of-public-serv-mdazcr"],
]);
const CANONICAL_ORIGIN = "https://keeptxred.com";
const DIRECT_WORKER_HOST = "keeptxred-site.freddy-coppola.workers.dev";

const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "igshid",
  "ref",
  "referrer",
  "source",
]);

const NOINDEX_STATE_PARAMS = new Set([
  "category",
  "filter",
  "sort",
  "order",
  "q",
  "query",
  "search",
  "page",
  "view",
  "tab",
  "status",
  "region",
  "county",
  "district",
  "office",
  "party",
  "year",
]);

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function isTrackingParam(name: string): boolean {
  const normalized = name.toLowerCase();
  return normalized.startsWith("utm_") || TRACKING_PARAMS.has(normalized);
}

function stripTrackingParams(url: URL): void {
  for (const key of Array.from(url.searchParams.keys())) {
    if (isTrackingParam(key)) url.searchParams.delete(key);
  }
}

function isFileLikePath(pathname: string): boolean {
  const finalSegment = pathname.split("/").pop() ?? "";
  return finalSegment.includes(".");
}

function normalizePagePath(pathname: string): string {
  if (pathname === "/" || isFileLikePath(pathname)) return pathname;
  return pathname.endsWith("/") ? pathname.replace(/\/+$/, "") || "/" : pathname;
}

function resolveLegacyPath(pathname: string): string {
  const normalized = normalizePagePath(pathname);
  const lower = normalized.toLowerCase();
  const newsMatch = normalized.match(/^\/news\/([^/]+)$/);
  if (newsMatch) {
    const replacement = BAD_YEAR_NEWS_REDIRECTS.get(newsMatch[1]);
    if (replacement) return `/news/${replacement}`;
  }
  return LEGACY_CONTENT_PATHS.get(lower) ?? LEGACY_ELECTION_PATHS.get(lower) ?? normalized;
}

function buildCanonicalTarget(url: URL): URL {
  const target = new URL(url.toString());
  target.pathname = resolveLegacyPath(target.pathname);

  if (TOPIC_REDIRECT_PATHS.has(target.pathname) && target.searchParams.has("topic")) {
    const topic = target.searchParams.get("topic") ?? "";
    const slug = slugify(topic);
    if (slug) target.pathname = `${target.pathname}/${slug}`;
    target.searchParams.delete("topic");
  }

  stripTrackingParams(target);
  return target;
}

function isIndexableBillPagination(url: URL): boolean {
  const pathname = normalizePagePath(url.pathname);
  const page = url.searchParams.get("page") ?? "";
  if (!/^[2-9]\d*$/.test(page)) return false;
  return pathname === "/bills" || /^\/bills\/texas\/\d+\/[a-z]{1,8}$/i.test(pathname);
}

function hasNoindexState(url: URL): boolean {
  const allowBillPage = isIndexableBillPagination(url);
  for (const key of url.searchParams.keys()) {
    const normalized = key.toLowerCase();
    if (normalized === "page" && allowBillPage) continue;
    if (NOINDEX_STATE_PARAMS.has(normalized)) return true;
  }
  return false;
}

const seoUrlCleanup = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  const requestHost = (forwardedHost || url.host).toLowerCase();
  const requestProto = forwardedProto || url.protocol.replace(":", "").toLowerCase();
  const canRedirect = request.method === "GET" || request.method === "HEAD";
  const isDirectAuthorityReference =
    requestHost === DIRECT_WORKER_HOST
    && (
      url.pathname === "/elections/reference.json"
      || /^\/bills\/texas\/\d+\/[a-zA-Z]+\/\d+\/reference\.json\/?$/.test(url.pathname)
    );
  const excludedPath =
    url.pathname === "/email/unsubscribe"
    || url.pathname === "/api/public/hooks/health"
    || isDirectAuthorityReference;

  if (canRedirect && !excludedPath) {
    const target = buildCanonicalTarget(url);
    const externalTarget = EXTERNAL_LEGACY_REDIRECTS.get(target.pathname.toLowerCase());
    if (externalTarget) {
      const finalUrl = new URL(externalTarget);
      target.searchParams.forEach((value, key) => finalUrl.searchParams.append(key, value));
      return new Response(null, {
        status: 301,
        headers: {
          location: finalUrl.toString(),
          "cache-control": "public, max-age=86400",
        },
      });
    }

    const hostChanged = requestHost !== "keeptxred.com";
    const protocolChanged = requestProto !== "https";
    const pathChanged = target.pathname !== url.pathname;
    const queryChanged = target.search !== url.search;

    if (hostChanged || protocolChanged || pathChanged || queryChanged) {
      const location = `${CANONICAL_ORIGIN}${target.pathname}${target.search}`;
      return new Response(null, {
        status: 301,
        headers: {
          location,
          "cache-control": "public, max-age=86400",
        },
      });
    }
  }

  if (canRedirect && !excludedPath && isExplicitlyRetiredStaticNewsPath(url.pathname)) {
    return new Response(renderErrorPage(), {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex, follow",
        "cache-control": "public, max-age=300",
      },
    });
  }

  if (excludedPath) return next();

  const result = await next();

  const shouldNoindex = hasNoindexState(url) || result.response.status === 404 || result.response.status === 410;
  if (shouldNoindex) {
    try {
      result.response.headers.set("X-Robots-Tag", "noindex, follow");
    } catch {
      // Response headers may be immutable in some runtimes; ignore.
    }
  }
  return result;
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (context) => context.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [csrfMiddleware, seoUrlCleanup, errorMiddleware],
}));