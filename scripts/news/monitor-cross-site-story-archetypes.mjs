#!/usr/bin/env node
/**
 * Free, read-only KTR + TexasDefined original-source story-category radar.
 * The production ingest cron finds the stories. This scheduled monitor
 * independently verifies coverage by broad topic, never republishing the
 * Flyover newsletter, bypassing editorial approval or generating AI content.
 *
 * No category is guaranteed to have new news every 72 hours. Zeros are
 * documented as investigation leads, NOT reasons to publish thin filler.
 */
import assert from "node:assert/strict";
import { appendFileSync } from "node:fs";

const PROJECT = "ftkznprjljkhymknvhye";
const WINDOW_HOURS = 72;
const PAGE_SIZE = 1000;
const MAX_PAGES = 12;

// Topic categories intentionally reusable; NOT a lookup of one newsletter's
// names or a list of fabricated coverage requirements.
export const STORY_ARCHETYPES = [
  ["Government & elections", /\b(governor|legislat|mayor|election|politic|council|state senate|county commissioner|taxpayer|school district|court ruling)\b/i, "keeptxred"],
  ["Public safety & investigations", /\b(fbi|investigat|arrest|indict|fraud|lawsuit|raid|crime|sheriff|police|charged|suspect)\b/i, "keeptxred"],
  ["Flooding & emergency response", /\b(flood|storm|rescue|tornado|wildfire|hurricane|emergency|heat advisory|swiftwater)\b/i, "keeptxred"],
  ["Local utilities & infrastructure", /\b(water line|water main|water outage|power outage|broken pipe|water service|boil water|road closure|bridge repairs)\b/i, "keeptxred"],
  ["Community giving & volunteers", /\b(turkey drive|food drive|giveaway|gives away|turkeys|hams|donat\w*|charity|volunteer\w*|food bank|food pantry|community support)\b/i, "texasdefined"],
  ["Small businesses opening or closing", /\b(opening|opens|closing|closed after|shutting down|new restaurant|ice cream shop|business expansion|storefront)\b/i, "texasdefined"],
  ["Airports & travel access", /\b(airport|airline|flight route|commercial flight|nonstop|terminal opens|new destination)\b/i, "texasdefined"],
  ["Science, space & research", /\b(starship|spacex|starbase|meteorite|researchers|research study|scientists|university study|astronomy)\b/i, "texasdefined"],
  ["Museums & attractions", /\b(museum|exhibit|water park|waterpark|theme park|attraction|tourism|visitor center|trademark filing)\b/i, "texasdefined"],
  ["Festivals, events & public art", /\b(festival|concert|parade|sculpture|statue|fairground|wiener dog|wurstfest|annual races)\b/i, "texasdefined"],
  ["Texas sports results & people", /\b(football|basketball|baseball|hockey|nascar|championship|longhorns|cougars|aggies|cowboys|texans)\b/i, "texasdefined"],
  ["Local heritage & history", /\b(historic|history|anniversary|centennial|railroad|heritage|commemorat|veteran memorial)\b/i, "texasdefined"],
  ["Texas economy & original rankings", /\b(rank(?:ed|ing)|startup|entrepreneur|employment|business study|economic development|veteran-owned)\b/i, "texasdefined"],
  ["Outdoor recreation & nature", /\b(state park|birding|wildlife|fishing|hunting|river|trail|lake access|beach cleanup)\b/i, "texasdefined"],
];

export function isDirectOriginalUrl(url) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (["news.google.com", "bing.com"].includes(host)) return false;
    if (["lrl.state.tx.us", "lrl.texas.gov"].includes(host) &&
      (parsed.pathname.toLowerCase() === "/cl.cfm" || parsed.pathname.toLowerCase().startsWith("/currentissues/clips/"))) return false;
    if (host.endsWith(".msn.com") || host === "msn.com") return false;
    if (host === "www.keeptxred.com" || host === "keeptxred.com") return false;
    return true;
  } catch {
    return false;
  }
}

export function analyze(rows) {
  const report = STORY_ARCHETYPES.map(([label, matcher, expectedSite]) => {
    const matched = rows.filter(row => matcher.test(row.title || ""));
    const originals = matched.filter(row => isDirectOriginalUrl(row.link));
    const sites = {
      keeptxred: matched.filter(row => row.target_site === "keeptxred").length,
      texasdefined: matched.filter(row => row.target_site === "texasdefined").length,
      review: matched.filter(row => !["keeptxred", "texasdefined"].includes(row.target_site)).length,
    };
    return {
      label, expectedSite, ingested: matched.length, directOriginal: originals.length,
      sites, linkedPublished: matched.filter(row => row.internal_slug || row.texasdefined_slug).length,
      examples: originals.slice(0, 2).map(row => ({
        title: String(row.title).slice(0, 130), site: row.target_site, source: row.source,
      })),
    };
  });
  const totals = {
    scanned: rows.length,
    ktr: rows.filter(row => row.target_site === "keeptxred").length,
    td: rows.filter(row => row.target_site === "texasdefined").length,
    original: rows.filter(row => isDirectOriginalUrl(row.link)).length,
    linkedPublished: rows.filter(row => row.internal_slug || row.texasdefined_slug).length,
  };
  return { report, totals, noDirectCategories: report.filter(r => r.directOriginal === 0).map(r => r.label) };
}

function selfTest() {
  assert.equal(STORY_ARCHETYPES.length, 14);
  assert.equal(isDirectOriginalUrl("https://www.kltv.com/2026/11/07/credit-union-texas-gives-away-turkeys-hams-kilgore/"), true);
  assert.equal(isDirectOriginalUrl("https://www.fox4news.com/news/midlothian-investigation"), true);
  assert.equal(isDirectOriginalUrl("https://news.google.com/rss/articles/xyz"), false);
  assert.equal(isDirectOriginalUrl("https://www.bing.com/news/apiclick.aspx"), false);
  assert.equal(isDirectOriginalUrl("https://lrl.texas.gov/currentissues/clips/example"), false);
  const samples = [
    ["Credit Union of Texas gives away 300 turkeys and 300 hams in Kilgore", "texasdefined"],
    ["FBI agents investigate Midlothian company fraud allegations", "keeptxred"],
    ["SpaceX targets Starship 15 launch at Starbase", "texasdefined"],
    ["Museum meteorite opens a free new Houston science exhibit", "texasdefined"],
    ["McKinney National Airport commercial flights open new destinations", "texasdefined"],
  ].map(([title, target_site]) => ({
    title, target_site, source: "Original local newsroom",
    link: "https://example.org/texas/" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
  const { report, totals } = analyze(samples);
  assert.equal(totals.scanned, 5);
  assert.ok(report.find(r => r.label === "Community giving & volunteers").directOriginal > 0);
  assert.ok(report.find(r => r.label === "Public safety & investigations").directOriginal > 0);
  assert.ok(report.find(r => r.label === "Science, space & research").directOriginal > 0);
  assert.ok(report.find(r => r.label === "Airports & travel access").directOriginal > 0);
  assert.equal(totals.linkedPublished, 0);
  console.log("Cross-site original-source archetype radar self-test passed.");
}

async function fetchAllSince(since, through, key) {
  const rows = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const endpoint = new URL("https://" + PROJECT + ".supabase.co/rest/v1/texas_news_feed");
    endpoint.searchParams.set("select", "id,title,source,link,created_at,target_site,internal_slug,texasdefined_slug");
    endpoint.searchParams.set("created_at", "gte." + since);
    endpoint.searchParams.append("created_at", "lt." + through);
    endpoint.searchParams.set("order", "created_at.desc,id.desc");
    endpoint.searchParams.set("limit", String(PAGE_SIZE));
    endpoint.searchParams.set("offset", String(page * PAGE_SIZE));
    const response = await fetch(endpoint, {
      headers: { apikey: key, ...(key.startsWith("sb_secret_") ? {} : { Authorization: "Bearer " + key }), Accept: "application/json" },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error("Supabase story radar fetch failed: HTTP " + response.status + " " + (await response.text()).slice(0,300));
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error("Supabase story radar returned non-array JSON.");
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
  throw new Error("Story radar exceeded " + (MAX_PAGES * PAGE_SIZE) + " source rows; refusing to report an incomplete coverage sample as comprehensive.");
}

function markdown(pulse, since, through) {
  const { report, totals, noDirectCategories } = pulse;
  const lines = [
    "# KTR + TexasDefined independent-story discovery pulse",
    "",
    "Source collection window: " + since + " to " + through + " (72 hours).",
    "Shared feed candidates: " + totals.scanned + " (KTR " + totals.ktr + ", TexasDefined " + totals.td + ", direct publisher/official URL " + totals.original + ").",
    "",
    "| Reusable story archetype | Original-source leads | All candidates | KTR / TD / review | Linked published |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...report.map(r => "| " + r.label + " | " + r.directOriginal + " | " + r.ingested + " | " +
      r.sites.keeptxred + " / " + r.sites.texasdefined + " / " + r.sites.review + " | " + r.linkedPublished + " |"),
    "",
    "Archetypes with no direct original-URL leads in the window: " + (noDirectCategories.join(", ") || "none") + ".",
    "A zero can mean no relevant recent event; investigate sources before describing it as a failure.",
    "A source URL is only a discovery lead. Source facts, site ownership, independence, article depth, images and publication eligibility still require the existing quality gates.",
    "No newsletter text, Bing RSS, speculative URL, inferred publication, AI call or content write is used by this monitor.",
    "",
  ];
  return lines.join("\n");
}

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.KEEP_TX_RED_SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing Supabase service credential: monitoring cannot silently report zero.");
  const through = new Date().toISOString();
  const since = new Date(Date.now() - WINDOW_HOURS * 3600000).toISOString();
  const rows = await fetchAllSince(since, through, key);
  const report = markdown(analyze(rows), since, through);
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
}
