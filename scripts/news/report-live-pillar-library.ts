import { readFileSync, writeFileSync } from "node:fs";
import { CONTENT_PILLARS, classifyContentPillar, type ContentPillarSlug } from "../../src/lib/content-pillars";

type Article = {
  slug: string;
  title: string;
  dek: string | null;
  body: string | null;
  category: string | null;
  published_at: string | null;
  gsc_impressions: number | null;
  gsc_clicks: number | null;
  gsc_ctr: number | null;
  gsc_avg_position: number | null;
  source_url: string | null;
};

type PillarReport = {
  slug: ContentPillarSlug;
  title: string;
  articles: number;
  evergreenGuides: number;
  articles30d: number;
  latestPublishedAt: string | null;
  impressions: number;
  clicks: number;
  ctr: number | null;
  avgPosition: number | null;
};

const envText = readFileSync(".env", "utf8");
const env = Object.fromEntries(
  envText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const eq = line.indexOf("=");
    const key = line.slice(0, eq);
    const value = line.slice(eq + 1).replace(/^"|"$/g, "");
    return [key, value];
  }),
);
const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_PUBLISHABLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Missing public Supabase config in .env");

const pillarGuideSlugs = extractPillarGuideSlugs(readFileSync("src/data/articles.ts", "utf8"));
const all = await fetchAllArticles();
const eligible = all.filter((a) => !String(a.source_url ?? "").toLowerCase().includes("texasdefined.com"));
const cutoff30 = Date.now() - 30 * 24 * 60 * 60 * 1000;

const buckets = new Map<ContentPillarSlug, Article[]>();
const unmatched: Article[] = [];
for (const article of eligible) {
  const pillar = classifyContentPillar({
    title: article.title,
    description: article.dek,
    body: article.body,
    category: article.category,
  });
  if (!pillar) unmatched.push(article);
  else buckets.set(pillar, [...(buckets.get(pillar) ?? []), article]);
}

const reports: PillarReport[] = CONTENT_PILLARS.map((pillar) => {
  const rows = buckets.get(pillar.slug) ?? [];
  const impressions = rows.reduce((s, r) => s + Number(r.gsc_impressions ?? 0), 0);
  const clicks = rows.reduce((s, r) => s + Number(r.gsc_clicks ?? 0), 0);
  const posRows = rows.filter((r) => Number(r.gsc_avg_position ?? 0) > 0);
  const latest = rows.map((r) => r.published_at).filter(Boolean).sort().at(-1) ?? null;
  return {
    slug: pillar.slug,
    title: pillar.shortTitle,
    articles: rows.length,
    evergreenGuides: rows.filter((r) => pillarGuideSlugs.has(r.slug) || looksEvergreenGuide(r)).length,
    articles30d: rows.filter((r) => r.published_at && Date.parse(r.published_at) >= cutoff30).length,
    latestPublishedAt: latest,
    impressions,
    clicks,
    ctr: impressions > 0 ? clicks / impressions : null,
    avgPosition: posRows.length ? posRows.reduce((s, r) => s + Number(r.gsc_avg_position), 0) / posRows.length : null,
  };
});

const suspicious = findSuspicious(reports, buckets);
const output = {
  generatedAt: new Date().toISOString(),
  totalDailyArticles: all.length,
  eligibleKeepTxRedArticles: eligible.length,
  excludedTexasDefined: all.length - eligible.length,
  unmatchedGeneralNews: unmatched.length,
  reports,
  suspicious,
};
writeFileSync("pillar-library-report.json", JSON.stringify(output, null, 2));

const lines: string[] = [];
lines.push("# Keep TX Red pillar library report", "");
lines.push(`Generated: ${output.generatedAt}`);
lines.push(`Eligible Keep TX Red articles: **${eligible.length}**`);
lines.push(`TexasDefined-excluded rows: **${output.excludedTexasDefined}**`);
lines.push(`General Texas News / unmatched: **${unmatched.length}**`, "");
lines.push("| Pillar | Existing | Evergreen/guide-like | Last 30d | GSC impressions | Clicks | CTR | Avg pos | Latest | Gap recommendation |", "|---|---:|---:|---:|---:|---:|---:|---:|---|---|");
for (const r of reports) {
  lines.push(`| ${r.title} | ${r.articles} | ${r.evergreenGuides} | ${r.articles30d} | ${r.impressions} | ${r.clicks} | ${r.ctr == null ? "—" : (r.ctr * 100).toFixed(2) + "%"} | ${r.avgPosition == null ? "—" : r.avgPosition.toFixed(1)} | ${r.latestPublishedAt?.slice(0, 10) ?? "—"} | ${recommend(r)} |`);
}
lines.push("", "## Suspicious classification patterns", "");
if (!suspicious.length) lines.push("None detected by the deterministic sanity checks.");
else suspicious.forEach((s) => lines.push(`- ${s}`));
lines.push("", "## Sample unmatched headlines", "");
unmatched.slice(0, 20).forEach((a) => lines.push(`- ${a.title}`));
const markdown = lines.join("\n") + "\n";
writeFileSync("pillar-library-report.md", markdown);
console.log(markdown);
if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, markdown, { flag: "a" });

async function fetchAllArticles(): Promise<Article[]> {
  const rows: Article[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const url = new URL(`${SUPABASE_URL}/rest/v1/daily_articles`);
    url.searchParams.set("select", "slug,title,dek,body,category,published_at,gsc_impressions,gsc_clicks,gsc_ctr,gsc_avg_position,source_url");
    url.searchParams.set("order", "published_at.desc.nullslast");
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Range: `${from}-${to}`,
        Prefer: "count=exact",
      },
    });
    if (!res.ok) throw new Error(`Supabase query failed ${res.status}: ${await res.text()}`);
    const batch = (await res.json()) as Article[];
    rows.push(...batch);
    if (batch.length < pageSize) break;
  }
  return rows;
}

function extractPillarGuideSlugs(source: string): Set<string> {
  const out = new Set<string>();
  const objectBlocks = source.match(/\{[\s\S]*?\n\s*\},/g) ?? [];
  for (const block of objectBlocks) {
    if (!/pillar:\s*true/.test(block)) continue;
    const slug = block.match(/slug:\s*["']([^"']+)["']/)?.[1];
    if (slug) out.add(slug);
  }
  return out;
}

function looksEvergreenGuide(a: Article): boolean {
  const text = `${a.slug} ${a.title} ${a.dek ?? ""}`.toLowerCase();
  return /\b(guide|explained|what (?:texans|you) need to know|how (?:texas|to)|faq|frequently asked|rules? and|laws? explained|powers of|benefits|handbook|overview|primer)\b/.test(text)
    && !/\b(today|tonight|breaking|announces?|announced|update|updates|latest|this week|live-)\b/.test(text);
}

function recommend(r: PillarReport): string {
  const target = r.slug === "texas-agriculture-rural" || r.slug === "texas-veterans-military" || r.slug === "texas-law-enforcement-public-safety" ? 20 : r.slug === "texas-border-immigration" || r.slug === "texas-energy-oil" || r.slug === "texas-economy-small-business" ? 25 : 30;
  const guideTarget = 8;
  const guideGap = Math.max(0, guideTarget - r.evergreenGuides);
  if (r.articles < target * 0.4) return `Major gap — add ${Math.max(1, Math.ceil(target * 0.6 - r.articles))} supporting articles and ${guideGap} guide(s)`;
  if (r.articles < target * 0.75) return `Weak — add ${Math.max(1, target - r.articles)} articles; ${guideGap} guide(s) to reach 8 evergreen`;
  if (guideGap > 0) return `Depth is usable; needs ${guideGap} more evergreen guide(s)`;
  if (r.articles30d < 2) return "Strong library; increase fresh publishing cadence";
  return "Strong — maintain cadence and refresh winners";
}

function findSuspicious(reports: PillarReport[], buckets: Map<ContentPillarSlug, Article[]>): string[] {
  const out: string[] = [];
  for (const r of reports) {
    const rows = buckets.get(r.slug) ?? [];
    const legislatureTagged = rows.filter((a) => String(a.category).toLowerCase() === "legislature").length;
    if (rows.length >= 10 && legislatureTagged / rows.length > 0.85 && r.slug !== "texas-laws-legislature") {
      out.push(`${r.title}: ${legislatureTagged}/${rows.length} rows carry the broad legacy Legislature category; pillar assignment is coming from article text rather than that legacy label.`);
    }
  }
  return out;
}
