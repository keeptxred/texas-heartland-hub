/**
 * Phase 2A read-only production footprint verifier. Reads the 388-URL
 * deduplicated disposition ledger; probes only a bounded 25-URL daily cohort.
 *
 * Verification of robots/canonicals/sitemaps is NOT a Google index verdict,
 * proof of original content, or an automatic editorial/redirect approval.
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const DEFAULT_LEDGER = "docs/recovery/ktr-news-phase2a-disposition-ledger.csv";
const ROOT = "https://keeptxred.com";
const DAY_MS = 86_400_000;
const MAX_BATCH_SIZE = 40;

export function csvRow(line) {
  const fields = [];
  let p = 0;
  while (p < line.length) {
    if (line[p] !== '"') throw new Error("CSV field not quoted at offset " + p);
    p += 1;
    let value = "";
    let closed = false;
    while (p < line.length) {
      if (line[p] === '"' && line[p + 1] === '"') {
        value += '"';
        p += 2;
      } else if (line[p] === '"') {
        p += 1;
        closed = true;
        break;
      } else {
        value += line[p++];
      }
    }
    if (!closed) throw new Error("Unterminated CSV field");
    fields.push(value);
    if (p < line.length && line[p] !== ",") throw new Error("Invalid CSV field separator");
    if (line[p] === ",") p += 1;
  }
  return fields;
}

export function loadLedger(text) {
  const lines = text.trimEnd().split(/\r?\n/);
  const keys = lines.shift()?.split(",") ?? [];
  if (!keys.includes("url") || !keys.includes("expected_indexability") || !keys.includes("disposition")) {
    throw new Error("Missing required disposition ledger columns");
  }
  const seen = new Set();
  return lines.filter(Boolean).map((line, index) => {
    const values = csvRow(line);
    if (values.length !== keys.length) throw new Error("CSV width mismatch at row " + (index + 2));
    const row = Object.fromEntries(keys.map((key, i) => [key, values[i]]));
    const url = new URL(row.url);
    if (url.origin !== ROOT || !url.pathname.startsWith("/news/") || url.search || url.hash) {
      throw new Error("Non-canonical/out-of-scope URL at row " + (index + 2));
    }
    if (seen.has(row.url)) throw new Error("Duplicate canonical URL: " + row.url);
    seen.add(row.url);
    return row;
  });
}

export function selectBatch(rows, batchIndex, batchSize = 25) {
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > MAX_BATCH_SIZE) {
    throw new Error("Batch size must be between 1 and " + MAX_BATCH_SIZE);
  }
  const totalBatches = Math.ceil(rows.length / batchSize);
  if (!totalBatches) throw new Error("Empty archive inventory");
  const index = batchIndex === null || batchIndex === undefined
    ? Math.floor(Date.now() / DAY_MS) % totalBatches
    : Number(batchIndex);
  if (!Number.isInteger(index) || index < 0 || index >= totalBatches) {
    throw new Error("Batch index out of range 0.." + (totalBatches - 1));
  }
  return { index, totalBatches, totalUrls: rows.length, rows: rows.slice(index * batchSize, (index + 1) * batchSize) };
}

function getMeta(html, name) {
  const re = /<meta\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const named = /\bname\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
    if (named?.toLowerCase() !== name.toLowerCase()) continue;
    return /\bcontent\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1] ?? "";
  }
  return "";
}

function canonicalOf(html) {
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel\s*=\s*["']canonical["']/i.test(m[0])) continue;
    return /\bhref\s*=\s*["']([^"']+)["']/i.exec(m[0])?.[1] ?? "";
  }
  return "";
}

function hasArticleSchema(html) {
  for (const script of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    if (/"@type"\s*:\s*"NewsArticle"/i.test(script[1])) return true;
  }
  return false;
}

function isNoindex(robots) {
  return /(?:^|[\s,;])noindex(?:$|[\s,;])/i.test(robots);
}

function isRedirect(status) {
  return status === 301 || status === 308;
}

export function assess(row, response, sitemapXmls = []) {
  const failures = [];
  const cautions = [];
  const status = response.status;
  const html = response.html ?? "";
  const robots = [getMeta(html, "robots"), response.xRobots ?? ""].filter(Boolean).join(",").toLowerCase();
  const canonical = canonicalOf(html);
  const expected = row.expected_indexability;
  const membership = sitemapXmls.map((xml) => xml.includes(row.url));
  const hasSitemapMembership = membership.some(Boolean);

  if (expected === "noindex" || expected === "noindex-or-redirect") {
    if (status === 200) {
      if (!isNoindex(robots)) failures.push("missing-noindex");
      if (canonical && canonical !== row.url) failures.push("unexpected-canonical");
      if (hasArticleSchema(html)) failures.push("noindex-NewsArticle-schema");
    } else if (!(expected === "noindex-or-redirect" && isRedirect(status))) {
      failures.push("expected-public-noindex-status-" + status);
    }
  } else if (expected === "potential-indexable") {
    if (status !== 200) failures.push("expected-indexable-http-" + status);
    if (status === 200 && isNoindex(robots)) failures.push("unexpected-noindex");
    if (status === 200 && canonical !== row.url) failures.push("canonical-mismatch");
  } else if (expected === "redirect") {
    if (!isRedirect(status)) failures.push("missing-permanent-redirect-" + status);
    else if (row.redirect_to) {
      const location = response.location ? new URL(response.location, row.url).href : "";
      if (location !== row.redirect_to) failures.push("redirect-target-mismatch");
    } else {
      cautions.push("redirect-equivalence-not-editorially-certified");
    }
  } else if (expected === "none") {
    if (status !== 404 && status !== 410) failures.push("retired-URL-still-serves-" + status);
  } else if (expected === "pending") {
    if (status === 200 && !isNoindex(robots)) failures.push("unreviewed-candidate-indexable");
    cautions.push("editorial-disposition-pending");
  } else {
    cautions.push("unclassified-indexability-" + expected);
  }

  if (hasSitemapMembership && (
    expected === "noindex" || expected === "noindex-or-redirect" ||
    expected === "redirect" || expected === "none" || expected === "pending"
  )) {
    failures.push("suppressed-URL-advertised-in-sitemap");
  }
  if (row.disposition === "D") cautions.push("semantic-redirect-equivalence-not-certified-by-HTTP");
  if (row.decision_state?.startsWith("PROVISIONAL")) cautions.push("editorial-disposition-still-provisional");
  return {
    url: row.url,
    disposition: row.disposition,
    policy: expected,
    status,
    robots,
    canonical,
    location: response.location ?? "",
    inSitemap: hasSitemapMembership,
    hasNewsArticleSchema: hasArticleSchema(html),
    errors: [...new Set(failures)],
    cautions: [...new Set(cautions)],
    passedHttpPolicy: failures.length === 0,
  };
}

async function fetchOnce(url) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "manual",
    signal: AbortSignal.timeout(15000),
    headers: {
      Accept: "text/html,application/xml;q=0.9",
      "Cache-Control": "no-cache",
      "User-Agent": "KeepTXRed-Phase2A-ReadOnly-Sitemap-Certification/1.0",
    },
  });
  const type = response.headers.get("content-type") ?? "";
  const html = response.status === 200 && /html|xml/i.test(type)
    ? (await response.text()).slice(0, 2_500_000)
    : "";
  return {
    status: response.status,
    html,
    xRobots: response.headers.get("x-robots-tag") ?? "",
    location: response.headers.get("location") ?? "",
  };
}

async function fetchWithRetry(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await fetchOnce(url);
      if (result.status < 500 || attempt === 1) return result;
    } catch (e) {
      if (attempt === 1) throw e;
    }
    await new Promise((resolveTimeout) => setTimeout(resolveTimeout, 350));
  }
  throw new Error("Unreachable " + url);
}

function emitSummary(report) {
  const failed = report.results.filter((row) => !row.passedHttpPolicy);
  const lines = [
    "## KTR Phase 2A read-only archive certification",
    "",
    "- Batch: " + report.batchIndex + " of " + report.totalBatches + " (zero indexed)",
    "- Unique archived URLs inventoried: " + report.totalUrls,
    "- URLs checked: " + report.results.length,
    "- HTTP/robots/canonical mismatches: " + failed.length,
    "- Sitemap request failures: " + report.sitemapErrors.length,
    "- No Google indexing verdict, source authenticity, or redirect equivalence is inferred.",
    "",
    "| URL path | HTTP | Policy | Issues |",
    "| --- | ---: | --- | --- |",
    ...report.results.map((entry) => {
      const p = new URL(entry.url).pathname;
      return "| " + p.slice(0, 90).replace(/[|]/g, "") + " | " + entry.status + " | " + entry.policy + " | " + (entry.errors.join(", ") || "none") + " |";
    }),
  ];
  return lines.join("\n") + "\n";
}

export async function run({ ledgerPath = DEFAULT_LEDGER, outputPath = "", batchIndex, batchSize = 25 } = {}) {
  const rows = loadLedger(readFileSync(resolve(ledgerPath), "utf8"));
  const batch = selectBatch(rows, batchIndex, batchSize);
  const sitemapErrors = [];
  const xmls = [];
  for (const path of ["/sitemap-news.xml", "/sitemap-evergreen.xml"]) {
    try {
      const response = await fetchWithRetry(ROOT + path);
      if (response.status !== 200 || !response.html.includes("<urlset")) {
        sitemapErrors.push(path + ": HTTP " + response.status + " or invalid XML");
      } else {
        xmls.push(response.html);
      }
    } catch (e) {
      sitemapErrors.push(path + ": " + String(e));
    }
  }
  const results = [];
  // Sequential, intentionally bounded requests prevent this from becoming a
  // site-wide crawl and keep Worker CPU/network costs near zero.
  for (const row of batch.rows) {
    try {
      const response = await fetchWithRetry(row.url);
      results.push(assess(row, response, xmls));
    } catch (e) {
      results.push({
        url: row.url, disposition: row.disposition, policy: row.expected_indexability,
        status: 0, errors: ["fetch-failure: " + String(e).slice(0, 180)],
        cautions: [], passedHttpPolicy: false,
      });
    }
  }
  const report = {
    recordedAt: new Date().toISOString(),
    ledgerPath,
    batchIndex: batch.index,
    totalBatches: batch.totalBatches,
    totalUrls: batch.totalUrls,
    sitemapErrors,
    results,
  };
  const filePath = outputPath || "reports/news-archive-certification/batch-" + batch.index + ".json";
  mkdirSync(resolve(filePath, ".."), { recursive: true });
  writeFileSync(resolve(filePath), JSON.stringify(report, null, 2) + "\n");
  const summary = emitSummary(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, summary, { flag: "a" });
  } else {
    process.stdout.write(summary);
  }
  if (sitemapErrors.length || results.some((entry) => !entry.passedHttpPolicy)) {
    process.exitCode = 1;
  }
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const input = process.env.BATCH_INDEX?.trim() || "";
  await run({
    batchIndex: input ? Number(input) : null,
    batchSize: Number(process.env.BATCH_SIZE || "25"),
    ledgerPath: process.env.LEDGER_PATH || DEFAULT_LEDGER,
    outputPath: process.env.OUTPUT_PATH || "",
  });
}
