#!/usr/bin/env node
/**
 * Read-only integrity check for the shared KTR Supabase database.
 * Reconciles the historical URL registry against actual article and redirect
 * records; detects new regressions without treating legacy GSC discoveries
 * or deliberately retired stories as newly deleted publications.
 */
import { createClient } from "@supabase/supabase-js";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";

const project = "ftkznprjljkhymknvhye";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
if (!key) throw new Error("Missing service-role credential: URL integrity was NOT verified.");
if (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY !== "keeptxred/texas-heartland-hub") {
  throw new Error("Unexpected repository for KeepTXRed integrity audit.");
}
const db = createClient("https://" + project + ".supabase.co", key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const baseline = Date.parse("2026-10-14T14:00:00Z");
const pageSize = 500;

async function readAll(table, columns, applyFilters = (query) => query) {
  const rows = [];
  for (let page = 0; page < 200; page++) {
    const { data, error } = await applyFilters(db.from(table).select(columns))
      .range(page * pageSize, (page + 1) * pageSize - 1);
    if (error) throw new Error(table + " read failed (audit cannot pass): " + error.message);
    rows.push(...(data || []));
    if (!data || data.length < pageSize) return rows;
  }
  throw new Error(table + " exceeded audit pagination budget; refusing partial success.");
}

// A restored historical article has an old published_at even when the row
// was created today. Audit recently CREATED records, not recent news dates.
// Read plain text only for the small recent cohort so the full registry scan
// does not download every historical article's prose.
const recentBodyAuditSince = new Date(Math.max(baseline, Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString();
const [registry, articles, redirects, feed, recentlyCreatedBodies] = await Promise.all([
  readAll("article_url_registry", "slug,origin,first_seen_at,recovery_status,redirect_target,retired_reason,had_search_visibility"),
  readAll("daily_articles", "slug,created_at,body_json"),
  readAll("article_slug_redirects", "old_slug,new_slug"),
  readAll("texas_news_feed", "internal_slug", (query) => query.not("internal_slug", "is", null)),
  readAll("daily_articles", "slug,created_at,kind,body", (query) =>
    query.gte("created_at", recentBodyAuditSince)),
]);
const articleBySlug = new Map(articles.map((article) => [article.slug, article]));
const redirectBySlug = new Map(redirects.map((redirect) => [redirect.old_slug, redirect.new_slug]));
const absent = registry.filter((entry) =>
  !articleBySlug.has(entry.slug)
  && !redirectBySlug.has(entry.slug)
  && !entry.redirect_target
);
const isRetired = (entry) =>
  entry.recovery_status === "retired_low_value" && String(entry.retired_reason || "").trim().length > 12;
const pending = absent.filter((entry) => !isRetired(entry) && entry.recovery_status !== "redirect_candidate");
const historicalLive = pending.filter((entry) => entry.slug.startsWith("live-"));
const newMissing = absent.filter((entry) =>
  !isRetired(entry) && (
    entry.origin === "daily_articles"
    || (Date.parse(entry.first_seen_at || "") >= baseline && entry.recovery_status !== "redirect_candidate")
  )
);
const staleFeed = [...new Set(feed.map((row) => row.internal_slug).filter(Boolean))]
  .filter((slug) => !articleBySlug.has(slug));
const missingBody = articles.filter((article) => {
  const body = article.body_json;
  return !body || !Array.isArray(body.intro) || body.intro.length === 0
    || !Array.isArray(body.sections) || body.sections.length === 0;
});
const newMissingBody = missingBody.filter((row) => Date.parse(row.created_at || "") >= baseline);
const recentlyMissingPlainTextBody = recentlyCreatedBodies.filter((row) =>
  row.kind === "news" && String(row.body ?? "").trim().length === 0);


/**
 * Restored in the registry must mean HTTP 200 in production, not merely that
 * a row exists. This daily live check catches the historical false-restored
 * status regression which database-only checks could not observe.
 * All network calls have a timeout, retry bound and request budget.
 */
async function auditLiveRestoredUrls() {
  if (process.env.KTR_VERIFY_LIVE !== "true") {
    return { checked: 0, failures: [], skipped: true };
  }
  const candidates = registry.filter((entry) =>
    entry.recovery_status === "restored" || entry.recovery_status === "redirected");
  if (candidates.length > 1000) throw new Error("Historical live audit URL budget exceeded");
  const allowedHosts = new Set(["keeptxred.com", "texasdefined.com", "www.texasdefined.com"]);
  let requestCount = 0;
  let cursor = 0;
  const failures = [];
  async function request(url) {
    let last;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (++requestCount > 2500) throw new Error("Historical live audit request budget exceeded");
      try {
        const response = await fetch(url, {
          redirect: "manual",
          signal: AbortSignal.timeout(15000),
          headers: { accept: "text/html", "user-agent": "KTR-Historical-URL-Integrity/1.0" },
        });
        if ([408, 429, 500, 502, 503, 504].includes(response.status) && attempt === 0) continue;
        return response;
      } catch (error) {
        last = error;
        if (attempt === 1) throw error;
      }
    }
    throw last || new Error("Historical request failed");
  }
  async function inspect(entry) {
    let url = "https://keeptxred.com/news/" + encodeURIComponent(entry.slug);
    const seen = new Set();
    const redirectExpected = entry.recovery_status === "redirected";
    const intended = entry.redirect_target
      ? new URL(
        (entry.redirect_target.startsWith("https://") || entry.redirect_target.startsWith("http://"))
          ? entry.redirect_target
          : "/news/" + entry.redirect_target,
        "https://keeptxred.com"
      ).href
      : null;
    let redirected = false;
    for (let hop = 0; hop < 6; hop++) {
      if (seen.has(url)) return "redirect-loop";
      seen.add(url);
      if (!allowedHosts.has(new URL(url).hostname)) return "unexpected-host";
      const response = await request(url);
      if ([301, 302, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) return "redirect-missing-location";
        const next = new URL(location, url).href;
        if (!redirected && redirectExpected && intended && next !== intended) return "unexpected-redirect-target";
        if (!redirectExpected && !redirected) return "restored-url-is-redirecting";
        redirected = true;
        url = next;
        continue;
      }
      if (response.status !== 200) return "HTTP " + response.status;
      if (!(response.headers.get("content-type") || "").toLowerCase().includes("text/html")) return "non-html";
      const html = await response.text();
      const title = new RegExp("<title[^>]*>([^<]*)</title>", "i").exec(html)?.[1] || "";
      if (/(404|not found|page missing|article not found)/i.test(title)) return "soft-404";
      if (redirectExpected && !redirected) return "expected-permanent-redirect";
      return null;
    }
    return "redirect-hop-limit";
  }
  await Promise.all(Array.from({ length: 12 }, async () => {
    while (cursor < candidates.length) {
      const row = candidates[cursor++];
      try {
        const problem = await inspect(row);
        if (problem) failures.push({ slug: row.slug, expected: row.recovery_status, problem });
      } catch (error) {
        failures.push({ slug: row.slug, expected: row.recovery_status, problem: String(error) });
      }
    }
  }));
  return { checked: candidates.length, requests: requestCount, failures, skipped: false };
}
const live = await auditLiveRestoredUrls();

const report = {
  checkedAt: new Date().toISOString(),
  project,
  liveVerified: live.checked,
  liveProbeRequests: live.requests || 0,
  liveProbeFailures: live.failures,
  liveProbeSkipped: live.skipped,
  articles: articles.length,
  registeredUrls: registry.length,
  registryMissingContentAndRedirect: absent.length,
  pendingRecovery: pending.length,
  pendingHistoricalLive: historicalLive.length,
  intentionallyRetired: absent.filter(isRetired).length,
  newlyMissing: newMissing.map((entry) => entry.slug),
  danglingFeedSlugs: staleFeed,
  noSectionOrIntro: missingBody.map((article) => article.slug),
  newlyEmptyBodies: newMissingBody.map((article) => article.slug),
  recentlyCreatedNewsWithoutPlainTextBody: recentlyMissingPlainTextBody.map((article) => article.slug),
  samplePendingHistoricalLive: historicalLive.slice(0, 40).map((entry) => entry.slug),
};
mkdirSync("artifacts", { recursive: true });
writeFileSync("artifacts/news-url-integrity.json", JSON.stringify(report, null, 2) + "\n");
const summary = [
  "## KeepTXRed production news URL integrity",
  "",
  "- Database-backed articles: **" + report.articles + "**",
  "- Registry URLs without database article or recorded redirect: **" + report.registryMissingContentAndRedirect + "**",
  "- Open historical recovery classifications: **" + report.pendingRecovery + "**",
  "- Historical \`live-*\` URLs pending recovery: **" + report.pendingHistoricalLive + "**",
  "- New unaccounted-for article losses: **" + report.newlyMissing.length + "**",
  "- Live restored/redirected URLs verified: **" + report.liveVerified + "**",
  "- Live URL regressions: **" + report.liveProbeFailures.length + "**",
  "- Dangling feed article pointers: **" + report.danglingFeedSlugs.length + "**",
  "- Recently published articles missing body structure: **" + report.newlyEmptyBodies.length + "**",
  "- Recently created news articles missing plain-text body: **" + report.recentlyCreatedNewsWithoutPlainTextBody.length + "**",
  "",
  "Historical missing URLs are reported as existing backlog; they must be recovered from evidence or retired with an explicit editorial disposition. The baseline does not re-create or declare their content restored.",
  "",
];
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join("\n"));
console.log(JSON.stringify(report, null, 2));
if (newMissing.length || staleFeed.length || newMissingBody.length || recentlyMissingPlainTextBody.length || live.failures.length) {
  throw new Error("KeepTXRed published-news URL integrity regression detected.");
}