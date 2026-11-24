// Read-only production probes for historical hostname, redirect and template
// errors. Historical Search Console exclusions are not assumed to be live faults.
import { mkdir, writeFile } from "node:fs/promises";

const apex = "https://keeptxred.com";
const www = "https://www.keeptxred.com";
const allowed = new Set(["keeptxred.com", "www.keeptxred.com", "texasdefined.com", "www.texasdefined.com"]);
const templates = [
  apex + "/texas-sports/team/$team",
  apex + "/texas-business/$topic",
  apex + "/shop/$productId",
  apex + "/authors/$slug",
  www + "/news/$slug",
  www + "/texas-business/$topic",
  apex + "/news/%24slug",
];
const redirects = [
  [www + "/candidate-guides", null],
  [www + "/tax-calculator", "https://texasdefined.com/decide/property-taxes"],
  [www + "/texas-property-tax-protest-guide", "https://texasdefined.com/do/property-tax-protest"],
  ["http://www.keeptxred.com/laws", apex + "/laws"],
  [www + "/texas-financial-tools", "https://texasdefined.com/decide/financial-tools"],
  [www + "/living-in-texas", "https://texasdefined.com/texas-living"],
];
const historicalCanonical = [
  "/county-elections",
  "/news/live-2026-06-28-governor-abbott-announces-axiom-space-redomiciles-in-texas-gcfyg",
  "/authors/liberty-desk",
  "/authors/austin-bureau",
  "/contact-legislators",
  "/get-involved",
  "/news/texas-governor-powers",
  "/find-representative",
  "/authors/civics-desk",
  "/authors/energy-desk",
  "/news/texas-water-rights-explained",
  "/authors/elections-desk",
].map((path) => www + path);
const representatives = [
  "/representatives/angela-paxton",
  "/representatives/bob-hall",
  "/representatives/adam-hinojosa",
  "/representatives/angie-button",
];
const hubs = ["/", "/laws", "/bills", "/texas-politics", "/representatives", "/texas-government", "/contact-legislators", "/find-representative"];
const probes = [
  ...templates.map((url) => ({ url, kind: "template" })),
  ...redirects.map(([url, expected]) => ({ url, kind: "historical-redirect", expected })),
  ...historicalCanonical.map((url) => ({ url, kind: "historical-canonical" })),
  ...representatives.map((path) => ({ url: apex + path, kind: "profile-observation" })),
  ...hubs.map((path) => ({ url: apex + path, kind: "active-hub" })),
  ...["http://keeptxred.com/laws", "https://www.keeptxred.com/laws", "https://keeptxred.com/laws/"].map((url) => ({ url, kind: "historical-redirect", expected: apex + "/laws" })),
  ...["/robots.txt", "/sitemap.xml"].map((path) => ({ url: apex + path, kind: "discovery-file" })),
];

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map((m) => [m[1].toLowerCase(), m[2] ?? m[3] ?? m[4]]));
}

async function check(probe) {
  let current = probe.url;
  const hops = [];
  const visited = new Set();
  try {
    for (let i = 0; i < 7; i++) {
      const parsed = new URL(current);
      if (!allowed.has(parsed.hostname) || !["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Unexpected redirect host or protocol: " + current);
      }
      if (visited.has(current)) throw new Error("Redirect loop: " + current);
      visited.add(current);
      const res = await fetch(current, { redirect: "manual", signal: AbortSignal.timeout(20_000), headers: { "cache-control": "no-cache" } });
      const location = res.headers.get("location");
      hops.push({ url: current, status: res.status, location, robots: res.headers.get("x-robots-tag") });
      if ([301, 302, 303, 307, 308].includes(res.status)) {
        if (!location) throw new Error("Redirect missing Location");
        await res.body?.cancel();
        current = new URL(location, current).href;
        continue;
      }
      const body = await res.text();
      const head = body.match(/<head(?:\s[^>]*)?>[\s\S]*?<\/head>/i)?.[0] || "";
      const canonical = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => attributes(m[0]))
        .filter((link) => /(?:^|\s)canonical(?:\s|$)/i.test(link.rel || "")).map((link) => link.href).filter(Boolean);
      const robots = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => attributes(m[0]))
        .filter((meta) => /^(robots|googlebot)$/i.test(meta.name || "")).map((meta) => meta.content || "");
      const noindex = /\b(?:noindex|none)\b/i.test([res.headers.get("x-robots-tag"), ...robots].join(" "));
      const result = { ...probe, hops, finalUrl: current, status: res.status, canonical, robots, noindex, title: head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || null, problems: [] };
      if (res.status >= 500 || res.status === 429 || res.status === 403) result.problems.push("Unexpected server/access failure");
      if (probe.kind === "template" && ![404, 410].includes(res.status)) result.problems.push("Literal route template must not resolve to an indexable or unrelated page");
      if (probe.expected && (current !== probe.expected || res.status !== 200)) result.problems.push("Legacy redirect did not reach intended live destination");
      if (probe.kind === "active-hub" && (res.status !== 200 || noindex || canonical.length !== 1 || canonical[0] !== probe.url)) result.problems.push("Expected active canonical hub is not cleanly indexable");
      if (probe.kind === "discovery-file" && res.status !== 200) result.problems.push("Discovery file unavailable");
      if (probe.kind === "historical-canonical" && res.status === 200 && new URL(current).hostname === "www.keeptxred.com") result.problems.push("WWW URL still serves an independent HTML document");
      // Retired aliases, historical articles and staged representatives may
      // deliberately be 404/noindex. Do not infer that they need restoration.
      return result;
    }
    throw new Error("Redirect chain exceeded six hops");
  } catch (error) {
    return { ...probe, hops, finalUrl: current, problems: [String(error)] };
  }
}

const results = [];
for (let offset = 0; offset < probes.length; offset += 3) {
  results.push(...await Promise.all(probes.slice(offset, offset + 3).map(check)));
}
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/gsc-recovery-probes.json", JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + "\n");
for (const row of results) console.log(row.kind, row.url, row.status ?? "ERROR", row.finalUrl, row.noindex ? "noindex" : "", row.problems.join("; "));
const failures = results.filter((row) => row.problems.length);
console.log(`Checked ${results.length} URL probes; ${failures.length} with confirmed invariant or transport failures. Historical exclusion alone is not a defect.`);
if (failures.length) process.exitCode = 1;
