#!/usr/bin/env node
/**
 * Read-only official-source URL audit for the existing monthly Texas laws review.
 * No credentials, legal interpretation, publishing or reviewed-date mutation.
 * HTTP 404/410 are broken; authorization, throttling and network failures remain
 * inconclusive, not falsely certified as broken or healthy.
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const SOURCE_CONCURRENCY = 8;
export const REQUEST_TIMEOUT_MS = 6500;
const LAW_FILE_RE = /^law-topic-[a-z0-9-]+-authority\.ts$/;

export function extractAuthoritySources(source, file) {
  const marker = source.search(/(?:^|\n)\s*(?:"sources"|sources)\s*:\s*\[/m);
  if (marker < 0) throw new Error(file + ": no sources array");
  const after = source.slice(marker);
  const end = after.search(/\n\s*(?:"related"|related)\s*:/m);
  const block = end < 0 ? after : after.slice(0, end);
  const matches = [...block.matchAll(/(?:url|"url"|'url')\s*:\s*["'](https?:\/\/[^"']+)["']/g)];
  if (matches.length < 3) throw new Error(file + ": missing source URLs (expected >=3)");
  const urls = matches.map((match) => match[1]);
  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") throw new Error(file + ": non-HTTPS official source " + url);
  }
  return [...new Set(urls)];
}

export function collectAuthorityLinks(directory) {
  const files = readdirSync(directory).filter((name) => LAW_FILE_RE.test(name)).sort();
  if (files.length < 18) throw new Error("Expected at least 18 law authority modules; found " + files.length);
  const refs = new Map();
  for (const file of files) {
    const links = extractAuthoritySources(readFileSync(resolve(directory, file), "utf8"), file);
    for (const url of links) {
      if (!refs.has(url)) refs.set(url, []);
      refs.get(url).push(file);
    }
  }
  return { files, refs };
}

export function classifySourceResult(status, error = "") {
  if (status === 404 || status === 410) return "broken";
  if (status >= 200 && status < 400) return "healthy";
  return "inconclusive";
}

export async function probeSource(url, fetchImpl = fetch) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { "User-Agent": "KeepTXRed-Legal-Source-Audit/1.0", "Accept": "text/html,application/pdf;q=0.9,*/*;q=0.8" },
      });
      await response.body?.cancel();
      const status = response.status;
      const state = classifySourceResult(status);
      if ((status >= 500 && status <= 599) && attempt === 1) continue;
      return { url, status, state, attempts: attempt, finalUrl: response.url || url };
    } catch (error) {
      if (attempt === 2) return { url, status: null, state: "inconclusive", attempts: attempt, error: String(error).slice(0, 180) };
    }
  }
}

export async function auditSourceLinks(refs, fetchImpl = fetch) {
  const urls = [...refs.keys()];
  let cursor = 0;
  const results = [];
  await Promise.all(Array.from({ length: Math.min(SOURCE_CONCURRENCY, urls.length) }, async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const result = await probeSource(url, fetchImpl);
      results.push({ ...result, guides: refs.get(url) });
    }
  }));
  return results.sort((a, b) => a.url.localeCompare(b.url));
}

export function formatSourceReport(results, now = new Date()) {
  const broken = results.filter((x) => x.state === "broken");
  const inconclusive = results.filter((x) => x.state === "inconclusive");
  const healthy = results.filter((x) => x.state === "healthy");
  const lines = [
    "### Texas Laws official-source link review — " + now.toISOString().slice(0, 7),
    "Checked " + results.length + " distinct cited source URLs: " + healthy.length + " reachable, " +
      broken.length + " confirmed 404/410, " + inconclusive.length + " inconclusive.",
    "This is a network availability check, not legal-claim verification. No content or review dates changed.",
  ];
  if (broken.length) {
    lines.push("", "#### Source URLs requiring repair");
    for (const item of broken) lines.push("- HTTP " + item.status + " " + item.url + " (guides: " + item.guides.join(", ") + ")");
  }
  if (inconclusive.length) {
    lines.push("", "#### Unverified source availability (not classified as broken)");
    for (const item of inconclusive.slice(0, 30)) {
      lines.push("- " + (item.status ?? item.error ?? "connection failure") + ": " + item.url);
    }
    if (inconclusive.length > 30) lines.push("- " + (inconclusive.length - 30) + " more in saved audit artifact");
  }
  return {
    totals: { checked: results.length, healthy: healthy.length, broken: broken.length, inconclusive: inconclusive.length },
    markdown: lines.join("\n") + "\n",
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/data");
  const { files, refs } = collectAuthorityLinks(directory);
  const rows = await auditSourceLinks(refs);
  const report = formatSourceReport(rows);
  mkdirSync("artifacts", { recursive: true });
  writeFileSync("artifacts/texas-laws-source-links.json", JSON.stringify({
    scannedAt: new Date().toISOString(), modules: files.length, ...report.totals, results: rows,
  }, null, 2) + "\n");
  writeFileSync("/tmp/texas-law-source-links.md", report.markdown);
  process.stdout.write(report.markdown);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, "broken_count=" + report.totals.broken + "\n");
    appendFileSync(process.env.GITHUB_OUTPUT, "inconclusive_count=" + report.totals.inconclusive + "\n");
  }
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report.markdown);
}
