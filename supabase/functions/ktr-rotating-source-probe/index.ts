import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type ProbeSource = { source: string; feed: string };

const SOURCES: Record<string, ProbeSource> = {
  "google-region-central-texas": { source: "Central Texas and Brazos Valley — Regional Discovery", feed: "google-region-central-texas" },
  "google-region-east-texas": { source: "East Texas and Piney Woods — Regional Discovery", feed: "google-region-east-texas" },
  "google-region-gulf-coast": { source: "Gulf Coast and Coastal Bend — Regional Discovery", feed: "google-region-gulf-coast" },
  "google-region-hill-country": { source: "Hill Country and San Antonio Region — Regional Discovery", feed: "google-region-hill-country" },
  "google-region-south-texas": { source: "South Texas and Rio Grande Valley — Regional Discovery", feed: "google-region-south-texas" },
  "google-airports-travel": { source: "Texas Airports TSA and Travel — Google News", feed: "google-airports-travel" },
  "google-attorney-general": { source: "Texas Attorney General Actions — Google News", feed: "google-attorney-general" },
  "google-primary-attorney-general": { source: "Texas Attorney General Primary Source — Google News", feed: "google-primary-attorney-general" },
  "google-awards-recognition": { source: "Texas Awards Contests and Recognition — Google News", feed: "google-awards-recognition" },
  "google-city-county-decisions": { source: "Texas City and County Decisions — Google News", feed: "google-city-county-decisions" },
  "google-primary-comptroller": { source: "Texas Comptroller Primary Source — Google News", feed: "google-primary-comptroller" },
  "google-corporate-expansions": { source: "Texas Corporate Partnerships and Expansions — Google News", feed: "google-corporate-expansions" },
  "google-courts-appointments": { source: "Texas Courts and Judicial Appointments — Google News", feed: "google-courts-appointments" },
  "google-primary-courts": { source: "Texas Courts Primary Source — Google News", feed: "google-primary-courts" },
  "google-dps-wanted": { source: "Texas DPS and Wanted Notices — Google News", feed: "google-dps-wanted" },
  "google-primary-dps": { source: "Texas DPS Primary Source — Google News", feed: "google-primary-dps" },
  "google-primary-education": { source: "Texas Education Primary Sources — Google News", feed: "google-primary-education" },
  "google-primary-emergency": { source: "Texas Emergency and Forest Service Primary Sources — Google News", feed: "google-primary-emergency" },
  "google-executive-actions": { source: "Texas Executive Actions — Google News", feed: "google-executive-actions" },
  "google-primary-governor": { source: "Texas Governor Primary Source — Google News", feed: "google-primary-governor" },
  "google-workforce-grants": { source: "Texas Grants and Workforce Investments — Google News", feed: "google-workforce-grants" },
  "google-higher-education": { source: "Texas Higher Education and Campus Actions — Google News", feed: "google-higher-education" },
  "google-human-interest-camera": { source: "Texas Human Interest — Caught on Camera", feed: "google-human-interest-camera" },
  "google-libraries-museums": { source: "Texas Libraries Museums and Community Grants — Google News", feed: "google-libraries-museums" },
  "google-region-panhandle": { source: "Texas Panhandle and South Plains — Regional Discovery", feed: "google-region-panhandle" },
  "google-primary-tpwd": { source: "Texas Parks Wildlife Primary Source — Google News", feed: "google-primary-tpwd" },
  "google-police-fire": { source: "Texas Police Sheriff and Fire Notices — Google News", feed: "google-police-fire" },
  "google-pro-sports": { source: "Texas Pro Sports — Daily Discovery", feed: "google-pro-sports" },
  "google-property-alerts": { source: "Texas Property and Records Alerts — Google News", feed: "google-property-alerts" },
  "google-sports-records": { source: "Texas Sports Records and Honors — Google News", feed: "google-sports-records" },
  "google-sports-recruiting": { source: "Texas Sports Recruiting and Partnerships — Google News", feed: "google-sports-recruiting" },
  "google-primary-txdot": { source: "Texas Transportation Primary Source — Google News", feed: "google-primary-txdot" },
  "google-primary-workforce": { source: "Texas Workforce Primary Source — Google News", feed: "google-primary-workforce" },
  "google-wildlife": { source: "Texas Zoos Wildlife and Conservation — Google News", feed: "google-wildlife" },
  "google-region-west-texas": { source: "West Texas and Permian Basin — Regional Discovery", feed: "google-region-west-texas" },
};

const RELAY_BASE = "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay";
const MAX_FEEDS = 12;
const TRANSIENT = new Set([408, 425, 429, 500, 502, 503, 504]);

function countItems(xml: string) {
  return (xml.match(/<(item|entry)\b/gi) ?? []).length;
}

async function probe(key: string) {
  const configured = SOURCES[key];
  const url = `${RELAY_BASE}?feed=${encodeURIComponent(configured.feed)}&transport=relay`;
  let status = 0;
  let error: string | undefined;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; KeepTXRedBot/1.2; +https://keeptxred.com)",
          Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
          "Cache-Control": "no-cache",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      status = response.status;
      if (response.ok) {
        const xml = await response.text();
        return { source: configured.source, url, status, attempts: attempt, mode: "rss", count: countItems(xml) };
      }
      error = `HTTP ${response.status}`;
      if (!TRANSIENT.has(response.status)) break;
    } catch (err) {
      error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    }
  }
  return { source: configured.source, url, status, attempts: 2, mode: "rss", count: 0, error: error ?? "request failed" };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
  const requested = (new URL(req.url).searchParams.get("feeds") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const keys = [...new Set(requested)];
  if (keys.length === 0 || keys.length > MAX_FEEDS) {
    return Response.json({ ok: false, error: `feeds must contain 1-${MAX_FEEDS} allowlisted keys` }, { status: 400 });
  }
  const unknown = keys.filter((key) => !SOURCES[key]);
  if (unknown.length > 0) return Response.json({ ok: false, error: "unknown feed key", unknown }, { status: 400 });
  const diag = await Promise.all(keys.map(probe));
  return Response.json({
    ok: true,
    sourceCount: keys.length,
    healthySources: diag.filter((item) => item.status >= 200 && item.status < 300 && item.count > 0).length,
    quietSources: diag.filter((item) => item.status >= 200 && item.status < 300 && item.count === 0).length,
    failedSources: diag.filter((item) => !(item.status >= 200 && item.status < 300)).length,
    diag,
  }, { headers: { "Cache-Control": "no-store" } });
});
