import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_ROOT = path.join(ROOT, "src");
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"]);
const INTENTIONAL_NOINDEX_PREFIXES = ["/texas-sports"];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, "/");
}

function isAdminTestOrGenerated(file) {
  const name = rel(file);
  return (
    /(?:^|\/)admin(?:\/|\.|-)/i.test(name) ||
    /(?:^|\/)(__tests__|test|tests|fixtures|mocks)(?:\/|\.|-)/i.test(name) ||
    /\.(?:test|spec)\.[^.]+$/i.test(name) ||
    /routeTree\.gen\.ts$/i.test(name)
  );
}

function normalizeRoute(value) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const parsed = new URL(value);
      if (parsed.hostname.replace(/^www\./i, "").toLowerCase() !== "keeptxred.com") return null;
      return parsed.pathname.length > 1 ? parsed.pathname.replace(/\/+$/, "") : parsed.pathname;
    } catch {
      return null;
    }
  }
  if (!value.startsWith("/")) return null;
  const withoutSuffix = value.split(/[?#]/, 1)[0];
  return withoutSuffix.length > 1 ? withoutSuffix.replace(/\/+$/, "") : withoutSuffix;
}

function findRetiredRoutes(files) {
  const retired = new Map();
  const routePattern = /createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/;
  for (const file of files) {
    if (!/src\/routes\//.test(rel(file))) continue;
    const source = fs.readFileSync(file, "utf8");
    const route = source.match(routePattern)?.[1];
    if (!route || route.includes("$")) continue;
    const normalized = normalizeRoute(route);
    if (!normalized) continue;

    const redirects = /beforeLoad\s*:\s*[\s\S]{0,900}?\bredirect\s*\(/m.test(source);
    const alwaysNoindex = /name\s*:\s*["']robots["'][\s\S]{0,160}?noindex/i.test(source);
    if (redirects || alwaysNoindex) {
      retired.set(normalized, { kind: redirects ? "redirect" : "noindex", file: rel(file) });
    }
  }
  return retired;
}

function collectEmittedDestinations(source) {
  const values = [];
  const patterns = [
    /\b(?:href|to)\s*=\s*["'`]([^"'`{}]+)["'`]/g,
    /\b(?:href|to|url)\s*:\s*["'`]([^"'`]+)["'`]/g,
    /\]\(\s*((?:https?:\/\/[^)\s]+)|(?:\/[^)\s]+))\s*\)/g,
    /\[\s*["'`][^/"'`][^"'`]*["'`]\s*,\s*["'`]((?:https?:\/\/[^"'`]+)|(?:\/[^"'`]+))["'`]\s*\]/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) values.push(match[1]);
  }
  return values;
}

const files = walk(SRC_ROOT);
const retired = findRetiredRoutes(files);
const findings = [];
const intentional = [];

for (const file of files) {
  if (isAdminTestOrGenerated(file)) continue;
  const source = fs.readFileSync(file, "utf8");
  for (const rawDestination of collectEmittedDestinations(source)) {
    const destination = normalizeRoute(rawDestination);
    if (!destination) continue;
    const retiredMeta = retired.get(destination);
    if (!retiredMeta) continue;

    const item = {
      file: rel(file),
      destination,
      routeKind: retiredMeta.kind,
      owner: retiredMeta.file,
    };
    if (INTENTIONAL_NOINDEX_PREFIXES.some((prefix) => destination === prefix || destination.startsWith(`${prefix}/`))) {
      intentional.push(item);
    } else {
      findings.push(item);
    }
  }
}

const uniqueByKey = (items) => [...new Map(items.map((item) => [`${item.file}|${item.destination}`, item])).values()];
const publicLeaks = uniqueByKey(findings).sort((a, b) => a.file.localeCompare(b.file) || a.destination.localeCompare(b.destination));
const intentionalNoindex = uniqueByKey(intentional).sort((a, b) => a.file.localeCompare(b.file) || a.destination.localeCompare(b.destination));

console.log(`[seo:crawl-leaks] retired/noindex static routes discovered: ${retired.size}`);
console.log(`[seo:crawl-leaks] actual public emitted links to redirect/noindex routes: ${publicLeaks.length}`);
for (const item of publicLeaks) {
  console.warn(`[seo:crawl-leaks] PUBLIC CRAWL LEAK — FIX: ${item.file} -> ${item.destination} (${item.routeKind}; owner ${item.owner})`);
}

console.log(`[seo:crawl-leaks] intentional noindex link findings: ${intentionalNoindex.length}`);
for (const item of intentionalNoindex) {
  console.log(`[seo:crawl-leaks] INTENTIONAL NOINDEX — VALID: ${item.file} -> ${item.destination}`);
}

if (process.env.SEO_CRAWL_LEAK_STRICT === "1" && publicLeaks.length > 0) {
  process.exitCode = 1;
}
