import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const key = "f2877f4619069ed6765e12380d28d9e0";
const errors = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing required search-distribution file: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function requireText(source, text, message) {
  if (!source.includes(text)) errors.push(message);
}

const submitter = read("scripts/seo/submit-indexnow.mjs");
const workflow = read(".github/workflows/indexnow.yml");
const runtimeService = read("src/lib/search-distribution.server.ts");
const productionVerifier = read("scripts/seo/verify-search-production.mjs");
const robots = read("src/routes/robots[.]txt.ts");
const keyFile = read(`public/${key}.txt`).trim();

if (keyFile !== key) errors.push("IndexNow ownership key file must exactly match the configured key.");

for (const expected of [
  'const origin = "https://keeptxred.com";',
  'const host = "keeptxred.com";',
  'https://api.indexnow.org/indexnow',
  'Sitemap: ${rootSitemap}',
  'url.origin !== origin',
  'url.search || url.hash',
  'const maxUrls = 10_000;',
  'const batchSize = 1000;',
  'const sitemapConcurrency = 3;',
  'INDEXNOW_FULL === "true"',
  'INDEXNOW_FRESHNESS_HOURS',
  'INDEXNOW_URLS',
  'cosmetic deployment produced no notification',
  'failed without blocking publishing/deployment',
]) requireText(submitter, expected, `IndexNow submitter is missing required contract: ${expected}`);

for (const expected of [
  'workflow_run:',
  'workflows: ["Deploy KeepTXRed to Cloudflare Workers"]',
  'cron: "17 * * * *"',
  'workflow_dispatch:',
  'urls:',
  'INDEXNOW_URLS:',
  'cancel-in-progress: true',
  'node scripts/seo/verify-search-production.mjs',
  'node scripts/seo/submit-indexnow.mjs',
]) requireText(workflow, expected, `IndexNow workflow is missing required contract: ${expected}`);

for (const expected of [
  'type SearchChangeKind = "published" | "updated" | "deleted" | "redirected";',
  'keeptxred.com',
  'texasdefined.com',
  'url.search || url.hash',
  'IndexNow notification failed without blocking publication',
  'INDEXNOW_BATCH_SIZE = 1000',
]) requireText(runtimeService, expected, `Reusable search-distribution service is missing required contract: ${expected}`);

for (const expected of [
  'const SITEMAP_CONCURRENCY = 3;',
  'Googlebot/2.1',
  'bingbot/2.0',
  'Applebot/0.1',
  'DuckDuckBot/1.0',
  'OAI-SearchBot/1.0',
  'Public IndexNow key verification failed.',
  'canonical mismatch',
  'CSS',
  'JavaScript',
  'Image',
]) requireText(productionVerifier, expected, `Production search verifier is missing required contract: ${expected}`);

for (const expected of [
  '"Googlebot"',
  '"Bingbot"',
  '"Applebot"',
  '"DuckDuckBot"',
  '"OAI-SearchBot"',
  '"GPTBot"',
  'TRAINING_EXTENDED_AGENTS',
  'SEARCH_DISCOVERY_AGENTS',
  '"User-agent: *"',
]) requireText(robots, expected, `robots policy is missing required crawler contract: ${expected}`);

if (/\bsecrets\./.test(workflow)) errors.push("IndexNow workflow must not depend on repository secrets; ownership is proven by the public key file.");
if (/^\s*push:\s*$/m.test(workflow)) errors.push("IndexNow must run after verified deployment, not directly on an undeployed push.");
if (!workflow.includes("github.event.workflow_run.conclusion == 'success'")) errors.push("IndexNow workflow must only react to successful production deployments.");
if (!workflow.includes("github.event.workflow_run.head_sha == github.sha")) errors.push("IndexNow workflow must ignore completed deployments that are no longer current main.");

if (errors.length) {
  console.error("KeepTXRed universal search distribution validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("KeepTXRed IndexNow ownership, canonical filtering, lifecycle support, hourly meaningful-change distribution, soft-failure isolation, production crawler verification, explicit OAI search access, and separate training policy are protected.");
