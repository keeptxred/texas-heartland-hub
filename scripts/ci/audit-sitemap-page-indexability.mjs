#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const ORIGIN = (process.env.AUDIT_ORIGIN || "https://keeptxred.com").replace(/\/$/, "");
const ROOT_SITEMAP = new URL(process.env.AUDIT_SITEMAP || "/sitemap.xml", `${ORIGIN}/`).href;
const CONCURRENCY = Math.max(1, Number(process.env.AUDIT_CONCURRENCY || 12));
const RETRIES = Math.max(0, Number(process.env.AUDIT_RETRIES || 2));
const TIMEOUT_MS = Math.max(1000, Number(process.env.AUDIT_TIMEOUT_MS || 15000));
const OUTPUT = process.env.AUDIT_OUTPUT || "tmp/sitemap-page-indexability-audit.json";
const MAX_SITEMAPS = 100;
const MAX_URLS = 100000;
const TRANSIENT = new Set([408, 425, 429, 500, 502, 503, 504, 520, 522, 524]);
const LEGACY_REDIRECTS = new Map([
  ["/hubs", "/topics"],
  ["/hubs/texas-policy-law", "/laws"],
  ["/hubs/texas-politics", "/texas-politics"],
  ["/hubs/texas-economy", "/texas-economy"],
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const decodeXml = (value) => value
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'");
const decodeHtml = decodeXml;

function extractBlockLocs(xml, tag) {
  const blocks = [...xml.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))];
  return blocks.flatMap((match) => {
    const loc = match[1].match(/<loc\b[^>]*>([\s\S]*?)<\/loc>/i)?.[1]?.trim();
    return loc ? [decodeXml(loc)] : [];
  });
}

function htmlAttributes(tag) {
  const attrs = new Map();
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gis)) {
    attrs.set(match[1].toLowerCase(), decodeHtml(match[3].trim()));
  }
  return attrs;
}

function extractCanonicals(html) {
  const values = [];
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = htmlAttributes(match[0]);
    const rel = (attrs.get("rel") || "").toLowerCase().split(/\s+/);
    const href = attrs.get("href");
    if (href && rel.includes("canonical")) values.push(href);
  }
  return values;
}

function hasNoindexMeta(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = htmlAttributes(match[0]);
    const name = (attrs.get("name") || "").toLowerCase();
    if (name !== "robots" && name !== "googlebot") continue;
    const content = (attrs.get("content") || "").toLowerCase();
    if (/\b(noindex|none)\b/.test(content)) return true;
  }
  return false;
}

function extractTitle(html) {
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  return decodeHtml(title.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseRobots(text) {
  const groups = [];
  let agents = [];
  let rules = [];
  const flush = () => {
    if (agents.length) groups.push({ agents, rules });
    agents = [];
    rules = [];
  };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (key === "user-agent") {
      if (rules.length) flush();
      agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && agents.length) {
      rules.push({ type: key, pattern: value });
    }
  }
  flush();
  return groups;
}

function robotsRuleRegex(pattern) {
  const endAnchored = pattern.endsWith("$");
  const raw = endAnchored ? pattern.slice(0, -1) : pattern;
  const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*");
  return new RegExp(`^${escaped}${endAnchored ? "$" : ""}`);
}

function isRobotsAllowed(url, groups, userAgent = "Googlebot") {
  const targetAgent = userAgent.toLowerCase();
  let specificity = -1;
  const applicable = [];
  for (const group of groups) {
    let groupSpecificity = -1;
    for (const agent of group.agents) {
      if (agent === "*") groupSpecificity = Math.max(groupSpecificity, 0);
      else if (targetAgent.startsWith(agent)) groupSpecificity = Math.max(groupSpecificity, agent.length);
    }
    if (groupSpecificity < 0) continue;
    if (groupSpecificity > specificity) {
      specificity = groupSpecificity;
      applicable.length = 0;
    }
    if (groupSpecificity === specificity) applicable.push(...group.rules);
  }

  const path = `${url.pathname}${url.search}`;
  let bestWeight = -1;
  let bestAllows = true;
  for (const rule of applicable) {
    if (!rule.pattern) continue;
    if (!robotsRuleRegex(rule.pattern).test(path)) continue;
    const weight = rule.pattern.replace(/[\*$]/g, "").length;
    if (weight > bestWeight) {
      bestWeight = weight;
      bestAllows = rule.type === "allow";
    } else if (weight === bestWeight && rule.type === "allow") {
      bestAllows = true;
    }
  }
  return bestAllows;
}

async function fetchManual(url, accept = "*/*") {
  let lastError;
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          accept,
          "user-agent": "KeepTXRed-Sitemap-Indexability-Audit/1.0 (+https://keeptxred.com)",
        },
      });
      clearTimeout(timeout);
      if (!TRANSIENT.has(response.status) || attempt === RETRIES) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt === RETRIES) throw error;
    }
    await sleep(300 * (attempt + 1));
  }
  throw lastError;
}

async function collectSitemapUrls() {
  const queue = [ROOT_SITEMAP];
  const visited = new Set();
  const pageUrls = new Set();
  const sitemapEntries = new Map();
  const issues = [];

  while (queue.length) {
    const sitemapUrl = queue.shift();
    if (visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);
    if (visited.size > MAX_SITEMAPS) throw new Error(`Sitemap count exceeded ${MAX_SITEMAPS}`);

    const parsed = new URL(sitemapUrl);
    if (parsed.origin !== ORIGIN) {
      issues.push({ type: "sitemap-host", url: sitemapUrl, detail: `Expected origin ${ORIGIN}` });
      continue;
    }

    let response;
    try {
      response = await fetchManual(sitemapUrl, "application/xml,text/xml;q=0.9,*/*;q=0.1");
    } catch (error) {
      issues.push({ type: "sitemap-fetch", url: sitemapUrl, detail: String(error) });
      continue;
    }
    if (response.status !== 200) {
      issues.push({ type: "sitemap-status", url: sitemapUrl, detail: `HTTP ${response.status}; location=${response.headers.get("location") || ""}` });
      continue;
    }
    const xml = await response.text();
    if (/<sitemapindex\b/i.test(xml)) {
      const children = extractBlockLocs(xml, "sitemap");
      if (!children.length) issues.push({ type: "empty-sitemap-index", url: sitemapUrl, detail: "No child sitemaps" });
      for (const child of children) queue.push(new URL(child, sitemapUrl).href);
      continue;
    }
    if (!/<urlset\b/i.test(xml)) {
      issues.push({ type: "unknown-sitemap-format", url: sitemapUrl, detail: "Expected sitemapindex or urlset" });
      continue;
    }
    const urls = extractBlockLocs(xml, "url");
    sitemapEntries.set(sitemapUrl, urls.length);
    for (const value of urls) {
      const absolute = new URL(value, sitemapUrl).href;
      pageUrls.add(absolute);
      if (pageUrls.size > MAX_URLS) throw new Error(`Sitemap URL count exceeded ${MAX_URLS}`);
    }
  }
  return { sitemapUrls: [...visited], pageUrls: [...pageUrls], sitemapEntries: Object.fromEntries(sitemapEntries), issues };
}

async function auditPage(url, robotsGroups) {
  const issues = [];
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return [{ type: "invalid-url", url, detail: "Invalid sitemap URL" }];
  }
  if (parsed.origin !== ORIGIN) {
    issues.push({ type: "page-host", url, detail: `Expected origin ${ORIGIN}` });
    return issues;
  }
  if (!isRobotsAllowed(parsed, robotsGroups, "Googlebot")) {
    issues.push({ type: "robots-blocked", url, detail: "Googlebot is blocked by robots.txt" });
  }

  let response;
  try {
    response = await fetchManual(url, "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1");
  } catch (error) {
    issues.push({ type: "fetch-error", url, detail: String(error) });
    return issues;
  }

  if (response.status !== 200) {
    issues.push({ type: "status", url, detail: `HTTP ${response.status}; location=${response.headers.get("location") || ""}` });
    return issues;
  }
  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("text/html")) {
    issues.push({ type: "content-type", url, detail: contentType || "missing content-type" });
    return issues;
  }
  const xRobots = (response.headers.get("x-robots-tag") || "").toLowerCase();
  if (/\b(noindex|none)\b/.test(xRobots)) issues.push({ type: "x-robots-noindex", url, detail: xRobots });

  const html = await response.text();
  if (hasNoindexMeta(html)) issues.push({ type: "meta-noindex", url, detail: "robots/googlebot meta contains noindex or none" });
  const canonicals = [...new Set(extractCanonicals(html))];
  if (!canonicals.length) issues.push({ type: "missing-canonical", url, detail: "No rel=canonical link found" });
  else {
    if (canonicals.length > 1) issues.push({ type: "conflicting-canonical", url, detail: canonicals.join(", ") });
    if (!canonicals.includes(url)) issues.push({ type: "canonical-mismatch", url, detail: `Found ${canonicals.join(", ")}` });
  }
  const title = extractTitle(html);
  if (!title) issues.push({ type: "missing-title", url, detail: "No document title" });
  else if (/\b(404|not found|page missing|page not found|content unavailable|article not found)\b/i.test(title)) {
    issues.push({ type: "soft-404-title", url, detail: title });
  }
  return issues;
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

async function auditLegacyRedirects(robotsGroups, sitemapPages) {
  const issues = [];
  for (const [source, target] of LEGACY_REDIRECTS) {
    const sourceUrl = new URL(source, `${ORIGIN}/`);
    if (!isRobotsAllowed(sourceUrl, robotsGroups, "Googlebot")) {
      issues.push({ type: "legacy-redirect-robots-blocked", url: sourceUrl.href, detail: "Googlebot cannot observe the redirect" });
    }
    if (sitemapPages.has(sourceUrl.href)) {
      issues.push({ type: "legacy-redirect-in-sitemap", url: sourceUrl.href, detail: "Redirect source must not be submitted as canonical" });
    }
    try {
      const response = await fetchManual(sourceUrl.href, "text/html,*/*;q=0.1");
      const expected = new URL(target, `${ORIGIN}/`).href;
      const location = response.headers.get("location");
      const resolved = location ? new URL(location, sourceUrl).href : "";
      if (![301, 308].includes(response.status) || resolved !== expected) {
        issues.push({ type: "legacy-redirect", url: sourceUrl.href, detail: `Expected permanent redirect to ${expected}; got HTTP ${response.status} -> ${resolved || "(no location)"}` });
      }
    } catch (error) {
      issues.push({ type: "legacy-redirect-fetch", url: sourceUrl.href, detail: String(error) });
    }
  }
  return issues;
}

const startedAt = new Date().toISOString();
const discovered = await collectSitemapUrls();
const issues = [...discovered.issues];

let robotsText = "";
let robotsGroups = [];
try {
  const robotsResponse = await fetchManual(`${ORIGIN}/robots.txt`, "text/plain,*/*;q=0.1");
  if (robotsResponse.status !== 200) issues.push({ type: "robots-status", url: `${ORIGIN}/robots.txt`, detail: `HTTP ${robotsResponse.status}` });
  robotsText = await robotsResponse.text();
  robotsGroups = parseRobots(robotsText);
  if (!robotsText.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) {
    issues.push({ type: "robots-sitemap", url: `${ORIGIN}/robots.txt`, detail: "Canonical sitemap index is not advertised" });
  }
} catch (error) {
  issues.push({ type: "robots-fetch", url: `${ORIGIN}/robots.txt`, detail: String(error) });
}

const uniquePages = discovered.pageUrls.sort();
console.log(`Auditing ${uniquePages.length.toLocaleString()} unique sitemap page URL(s) across ${discovered.sitemapUrls.length} sitemap file(s) with concurrency ${CONCURRENCY}.`);
if (robotsGroups.length) {
  const pageResults = await mapLimit(uniquePages, CONCURRENCY, (url) => auditPage(url, robotsGroups));
  for (const pageIssues of pageResults) issues.push(...pageIssues);
  issues.push(...await auditLegacyRedirects(robotsGroups, new Set(uniquePages)));
}

const report = {
  startedAt,
  finishedAt: new Date().toISOString(),
  origin: ORIGIN,
  rootSitemap: ROOT_SITEMAP,
  sitemapCount: discovered.sitemapUrls.length,
  uniquePageCount: uniquePages.length,
  sitemapEntries: discovered.sitemapEntries,
  legacyRedirectCount: LEGACY_REDIRECTS.size,
  issueCount: issues.length,
  issues,
};
await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Wrote audit report to ${OUTPUT}.`);

if (issues.length) {
  console.error(`Sitemap page indexability audit FAILED with ${issues.length} issue(s).`);
  for (const issue of issues.slice(0, 100)) console.error(`- [${issue.type}] ${issue.url}: ${issue.detail}`);
  if (issues.length > 100) console.error(`... ${issues.length - 100} additional issue(s) in ${OUTPUT}`);
  process.exit(1);
}

console.log(`Sitemap page indexability audit passed: ${uniquePages.length.toLocaleString()} unique submitted URLs returned HTTP 200 HTML, self-canonicals, indexable robots directives, crawlable Googlebot policy, and non-soft-404 titles; ${LEGACY_REDIRECTS.size} legacy hub redirects are crawlable permanent redirects.`);
