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

const [registry, articles, redirects, feed] = await Promise.all([
  readAll("article_url_registry", "slug,origin,first_seen_at,recovery_status,redirect_target,retired_reason,had_search_visibility"),
  readAll("daily_articles", "slug,created_at,body_json"),
  readAll("article_slug_redirects", "old_slug,new_slug"),
  readAll("texas_news_feed", "internal_slug", (query) => query.not("internal_slug", "is", null)),
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
const report = {
  checkedAt: new Date().toISOString(),
  project,
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
  "- Dangling feed article pointers: **" + report.danglingFeedSlugs.length + "**",
  "- Recently published articles missing body structure: **" + report.newlyEmptyBodies.length + "**",
  "",
  "Historical missing URLs are reported as existing backlog; they must be recovered from evidence or retired with an explicit editorial disposition. The baseline does not re-create or declare their content restored.",
  "",
];
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join("\n"));
console.log(JSON.stringify(report, null, 2));
if (newMissing.length || staleFeed.length || newMissingBody.length) {
  throw new Error("KeepTXRed published-news URL integrity regression detected.");
}