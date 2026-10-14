#!/usr/bin/env node
/**
 * Read-only daily newsroom output monitor.  Do not publish filler or reserve
 * AI because a day missed the target; report the shortfall to GitHub Actions.
 * Uses Central calendar dates and the existing Supabase service credential.
 */
import assert from "node:assert/strict";
import { appendFileSync } from "node:fs";

const SITE = "keeptxred";
const PROJECT = "ftkznprjljkhymknvhye";
const MIN_DAILY_ARTICLES = 3;
const TARGET_MAX_ARTICLES = 5;
const timezone = "America/Chicago";
const excludedFlags = new Set([
  "internal_repetition", "seo_low_value_commodity", "source_integrity_failure",
  "seo_false_multisource", "seo_noindex", "duplicate_story", "chatgpt-admin-ignored",
]);

function centralDate(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function publisherFamily(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === "news.google.com" || hostname === "www.news.google.com") return null;
    const parts = hostname.split(".");
    const lastTwo = parts.slice(-2).join(".");
    if (["co.uk", "org.uk", "gov.uk", "com.au", "org.au"].includes(lastTwo) && parts.length > 2) {
      return parts.slice(-3).join(".");
    }
    return lastTwo;
  } catch {
    return null;
  }
}

function hasPrimaryEvidence(article, urls) {
  if ((article.quality_flags ?? []).includes("primary_sources")
    || Number(article.body_json?.authority?.primarySourceCount ?? 0) > 0) return true;
  return urls.some((url) => {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host.endsWith(".gov") || host === "ercot.com" || host.endsWith(".ercot.com");
    } catch { return false; }
  });
}

function repeatedParagraphs(sections) {
  const seen = new Set();
  let repeats = 0;
  for (const section of sections) {
    for (const paragraph of section?.paragraphs ?? []) {
      const normalized = String(paragraph).trim().replace(/\s+/g, " ").toLowerCase();
      if (normalized.length < 100) continue;
      if (seen.has(normalized)) repeats++;
      else seen.add(normalized);
    }
  }
  return repeats;
}

export function evaluatesAsSubstantiveNews(article) {
  if (article.kind !== "news") return false;
  if (!["Keep TX Red Newsroom", "Keep TX Red Editorial Staff"].includes(article.author)) return false;
  if (String(article.body ?? "").trim().length < 1800) return false;
  const sections = article.body_json?.sections;
  if (!Array.isArray(sections) || sections.length < 2 || repeatedParagraphs(sections) > 2) return false;
  if ((article.quality_flags ?? []).some((flag) => excludedFlags.has(flag))) return false;
  const urls = [article.source_url, ...(article.body_json?.sources ?? []).map((source) => source.url)]
    .filter((url) => typeof url === "string" && url.trim());
  const families = new Set(urls.map(publisherFamily).filter(Boolean));
  return families.size >= 2 || hasPrimaryEvidence(article, urls)
    || (families.size >= 1 && (article.quality_flags ?? []).includes("editorial_reviewed"));
}

function selfTest() {
  const paragraph = "Verified public-source reporting with necessary dates, jurisdiction, confirmed actions, and quoted attribution. ".repeat(15);
  const article = {
    slug: "test", kind: "news", author: "Keep TX Red Newsroom", body: paragraph.repeat(2),
    body_json: {
      sections: [
        { heading: "What happened", paragraphs: [paragraph] },
        { heading: "Why it matters", paragraphs: [paragraph + " Independent section."] },
      ],
      sources: [
        { url: "https://www.texastribune.org/news" },
        { url: "https://www.kxan.com/story" },
      ],
    },
    source_url: "https://www.texastribune.org/news",
    quality_flags: ["missing_image"],
  };
  assert.equal(evaluatesAsSubstantiveNews(article), true);
  assert.equal(evaluatesAsSubstantiveNews({ ...article, body: "" }), false);
  assert.equal(evaluatesAsSubstantiveNews({ ...article, quality_flags: ["internal_repetition"] }), false);
  assert.equal(evaluatesAsSubstantiveNews({ ...article,
    body_json: { ...article.body_json, sources: [
      { url: "https://www.texastribune.org/news" },
      { url: "https://news.google.com/rss/articles/abc" },
    ] },
  }), false);
  assert.equal(publisherFamily("https://news.google.com/rss/articles/abc"), null);
  assert.equal(centralDate(new Date("2026-10-14T23:05:00Z")), "2026-10-14");
  console.log("Daily newsroom quality-volume monitor self-test passed.");
}

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing Supabase credential; daily output NOT verified");
  const day = process.env.CHECK_DAY || centralDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(day)) throw new Error("Invalid Central date");
  // Bound the query around the requested Central calendar day, including
  // daylight-saving transitions. Manual checks can inspect historical dates.
  const dayUtc = Date.parse(`${day}T00:00:00Z`);
  const cutoff = new Date(dayUtc - 24 * 60 * 60 * 1000).toISOString();
  const through = new Date(dayUtc + 2 * 24 * 60 * 60 * 1000).toISOString();
  const endpoint = new URL(`https://${PROJECT}.supabase.co/rest/v1/daily_articles`);
  endpoint.searchParams.set("select", "slug,published_at,kind,author,body,body_json,source_url,quality_flags");
  endpoint.searchParams.set("and", `(published_at.gte.${cutoff},published_at.lt.${through})`);
  endpoint.searchParams.set("kind", "eq.news");
  endpoint.searchParams.set("limit", "1000");
  const response = await fetch(endpoint, {
    headers: { apikey: key, authorization: `Bearer ${key}`, accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Supabase news read failed (HTTP ${response.status})`);
  const articles = await response.json();
  if (!Array.isArray(articles) || articles.length >= 1000) {
    throw new Error("Recent publication query is incomplete; cannot pass volume monitor");
  }
  const dayArticles = articles.filter((article) => centralDate(new Date(article.published_at)) === day);
  const qualifying = dayArticles.filter(evaluatesAsSubstantiveNews);
  const pass = qualifying.length >= MIN_DAILY_ARTICLES;
  const result = {
    site: SITE, day, expectedMinimum: MIN_DAILY_ARTICLES, targetMaximum: TARGET_MAX_ARTICLES,
    publishedNews: dayArticles.length, qualifyingNews: qualifying.length,
    qualifyingSlugs: qualifying.map((article) => article.slug),
    excludedSlugs: dayArticles.filter((article) => !evaluatesAsSubstantiveNews(article))
      .map((article) => article.slug),
    pass,
  };
  console.log("DAILY_NEWS_QUALITY_VOLUME " + JSON.stringify(result));
  const summary = [
    `## KeepTXRed substantive publication volume — ${day} (America/Chicago)`,
    `${qualifying.length} qualifying newsroom articles; target ${MIN_DAILY_ARTICLES}–${TARGET_MAX_ARTICLES}.`,
    `Other news items not passing evidence, completeness or repetition checks: ${result.excludedSlugs.length}.`,
    pass ? "Publication minimum met." : "Below minimum: investigate source coverage and publishing health. Do not reduce quality gates or publish filler.",
    "",
  ].join("\n");
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  if (!pass) process.exitCode = 1;
}
