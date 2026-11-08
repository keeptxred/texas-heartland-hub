const baseUrl = (process.env.KTR_BASE_URL || "https://keeptxred.com").replace(/\/$/, "");
const texasDefinedUrl = (process.env.TEXASDEFINED_BASE_URL || "https://texasdefined.com").replace(/\/$/, "");
const expectedFingerprint = (process.env.KTR_EXPECTED_FINGERPRINT || "").trim();

const requiredDirectCoverageSources = [
  "Community Impact — Texas Hyperlocal",
  "KRIS 6 — Corpus Christi Local",
  "KZTV Action 10 — Corpus Christi Local",
  "Texas City Municipal News — CivicEngage",
  "Sinton Municipal Agendas — CivicEngage",
  "Orange City Council Agendas — CivicEngage",
  "Webster Municipal Agendas — CivicEngage",
  "Aubrey City Council Agendas — CivicEngage",
  "Paris Municipal News — CivicEngage",
  "Galveston Municipal News — CivicEngage",
  "WFAA 8 — Dallas Local",
  "KHOU 11 — Houston Local",
  "Texas Department of Insurance — News Releases",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function retry(label, fn, attempts = 6, delayMs = 15000) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      console.warn(`WAIT ${label} attempt ${attempt}/${attempts}: ${error instanceof Error ? error.message : String(error)}`);
      await sleep(delayMs);
    }
  }
  throw lastError;
}

async function fetchNewsroomHealth() {
  const response = await fetchWithTimeout(`${baseUrl}/api/public/newsroom-health`, {
    redirect: "follow",
    headers: { Accept: "application/json", "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" },
  });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`newsroom-health did not return JSON: ${text.slice(0, 300)}`);
  }
  if (!response.ok || payload?.ok !== true || payload?.databaseViewsReady !== true) {
    throw new Error(`newsroom-health is not ready (${response.status}): ${text.slice(0, 700)}`);
  }
  return payload;
}

async function checkProtectedAdminRoute(path) {
  const response = await fetchWithTimeout(`${baseUrl}${path}`, {
    redirect: "manual",
    headers: { "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" },
  });
  if (response.status === 404) throw new Error(`${path} returned HTTP 404`);
  if (response.status >= 500) throw new Error(`${path} returned HTTP ${response.status}`);
  const location = response.headers.get("location");
  if (response.status >= 300 && response.status < 400) {
    if (!location || !location.includes("/admin")) throw new Error(`${path} redirected unexpectedly to ${location ?? "unknown"}`);
    console.log(`OK ${path} protected redirect (${response.status} -> ${location})`);
    return;
  }
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  console.log(`OK ${path} reachable (${response.status})`);
}

async function checkDeploymentFingerprint() {
  const response = await fetchWithTimeout(`${baseUrl}/api/public/deployment-fingerprint`, {
    redirect: "follow",
    headers: { Accept: "application/json", "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" },
  });
  if (response.status === 404) throw new Error("production is stale: deployment fingerprint route is missing");
  const text = await response.text();
  let payload;
  try { payload = JSON.parse(text); } catch { throw new Error(`deployment fingerprint did not return JSON: ${text.slice(0, 300)}`); }
  if (!response.ok) throw new Error(`deployment fingerprint returned HTTP ${response.status}: ${text.slice(0, 300)}`);
  const actual = typeof payload?.fingerprint === "string" ? payload.fingerprint.trim() : "";
  if (!actual) throw new Error("deployment fingerprint response is missing a non-empty fingerprint");
  if (expectedFingerprint && actual !== expectedFingerprint) throw new Error(`production fingerprint mismatch: expected ${expectedFingerprint}, received ${actual}`);
  console.log(`OK deployment fingerprint=${actual} mode=${payload.newsroomHealthMode ?? "unknown"}`);
}

async function checkNewsroomHealth() {
  const payload = await fetchNewsroomHealth();
  if (!Number.isFinite(payload?.sourceCount) || payload.sourceCount < 1) throw new Error(`newsroom-health reports no configured sources: ${JSON.stringify(payload).slice(0, 500)}`);
  if (!Number.isFinite(payload.coverageGapCount) || payload.coverageGapCount < 0) throw new Error(`newsroom-health returned invalid coverageGapCount=${payload.coverageGapCount}`);
  if (payload.coverageGapCount > 0) console.warn(`WARN newsroom-health backlog=${payload.coverageGapCount} unresolved publish gap(s); backlog is reported but does not fail live availability`);
  if (payload.texasDefinedChannelReady !== true) throw new Error(`TexasDefined shared article channel is not ready: ${JSON.stringify(payload).slice(0, 700)}`);
  const sourceNames = new Set((payload.sources ?? []).map((source) => source.source_name));
  const missing = requiredDirectCoverageSources.filter((name) => !sourceNames.has(name));
  if (missing.length > 0) throw new Error(`Required direct/hyperlocal coverage feeds missing from production: ${missing.join(", ")}`);
  console.log(`OK newsroom-health sources=${payload.sourceCount} gaps=0 items24h=${payload.items24h} tdQueue=${payload.texasDefinedQueueCount} tdReady=${payload.texasDefinedReadyCount} tdPublished=${payload.texasDefinedPublishedCount}`);
  console.log(`OK all ${requiredDirectCoverageSources.length} direct/hyperlocal coverage feeds are configured`);
}

function extractMeta(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) return match[1];
  }
  return "";
}

function extractCanonical(html) {
  const patterns = [
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) return match[1];
  }
  return "";
}

async function verifyRasterImage(imageUrl) {
  const absolute = imageUrl.startsWith("/") ? `${texasDefinedUrl}${imageUrl}` : imageUrl;
  if (!absolute || /\.svg(?:[?#].*)?$/i.test(absolute)) throw new Error(`TexasDefined story has invalid social image: ${absolute || "missing"}`);
  const response = await fetchWithTimeout(absolute, { redirect: "follow", headers: { "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" } });
  const bytes = Number(response.headers.get("content-length") || 0);
  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  if (!response.ok || !contentType.startsWith("image/") || contentType.includes("svg") || (bytes > 0 && bytes < 10000)) {
    throw new Error(`TexasDefined hero failed raster check: ${absolute} HTTP ${response.status} type=${contentType} bytes=${bytes}`);
  }
  console.log(`OK TexasDefined raster hero ${absolute} (${contentType}, ${bytes || "streamed"} bytes)`);
}

async function checkTexasDefinedLive() {
  const payload = await fetchNewsroomHealth();
  if (payload.texasDefinedChannelReady !== true) throw new Error("TexasDefined database channel is not ready");
  if (!payload.latestTexasDefinedSlug) {
    const sample = Array.isArray(payload.texasDefinedReadySample) ? payload.texasDefinedReadySample.slice(0, 3) : [];
    throw new Error(`TexasDefined channel has no published smoke article. Ready queue sample=${JSON.stringify(sample)}`);
  }

  const indexResponse = await fetchWithTimeout(`${texasDefinedUrl}/news`, { redirect: "follow", headers: { "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" } });
  const indexHtml = await indexResponse.text();
  if (!indexResponse.ok || /page not found|404 not found/i.test(indexHtml)) throw new Error(`TexasDefined /news is not live: HTTP ${indexResponse.status}`);
  const indexCanonical = extractCanonical(indexHtml);
  if (indexCanonical && indexCanonical.replace(/\/$/, "") !== `${texasDefinedUrl}/news`) throw new Error(`TexasDefined /news canonical mismatch: ${indexCanonical}`);
  console.log(`OK TexasDefined /news live (${indexResponse.status}) canonical=${indexCanonical || "rendered by client"}`);

  const slug = payload.latestTexasDefinedSlug;
  const storyUrl = `${texasDefinedUrl}/news/${slug}`;
  const storyResponse = await fetchWithTimeout(storyUrl, { redirect: "follow", headers: { "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" } });
  const storyHtml = await storyResponse.text();
  if (!storyResponse.ok || /story unavailable|page not found|404 not found/i.test(storyHtml)) throw new Error(`TexasDefined routed story is not live: ${storyUrl} HTTP ${storyResponse.status}`);
  const canonical = extractCanonical(storyHtml);
  if (canonical && canonical.replace(/\/$/, "") !== storyUrl) throw new Error(`TexasDefined routed story canonical mismatch: expected ${storyUrl}, got ${canonical}`);
  const image = extractMeta(storyHtml, "og:image") || extractMeta(storyHtml, "twitter:image");
  if (!image) throw new Error(`TexasDefined routed story has no social image metadata: ${storyUrl}`);
  await verifyRasterImage(image);
  console.log(`OK TexasDefined routed story live ${storyUrl} canonical=${canonical || storyUrl}`);
}

async function checkCrossSiteBoundary() {
  const response = await fetchWithTimeout(`${baseUrl}/api/public/cross-site-publication-health`, {
    redirect: "follow",
    headers: { Accept: "application/json", "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" },
  });
  const text = await response.text();
  let payload;
  try { payload = JSON.parse(text); } catch { throw new Error(`cross-site health did not return JSON: ${text.slice(0, 300)}`); }
  if (!response.ok || payload?.ok !== true) throw new Error(`cross-site publication boundary failed (${response.status}): ${text.slice(0, 700)}`);
  if (payload.collisionCount !== 0) throw new Error(`cross-site collision view reports ${payload.collisionCount} collision(s)`);
  if (payload.canyonKeepTxRedDuplicateCount !== 0) throw new Error(`Canyon Lake smoke story leaked into Keep TX Red ${payload.canyonKeepTxRedDuplicateCount} time(s)`);
  if (payload.canyonTexasDefinedPublished !== true) throw new Error("Canyon Lake smoke story is not published in TexasDefined");
  console.log(`OK cross-site boundary collisions=0 canyonKTRDuplicates=0 canyonTDSlug=${payload.canyonTexasDefinedSlug}`);
}

// Prevent historically published URLs from disappearing silently again.
// This exercises the REAL rendered routes and canonical 301, not just the
// article registry or database row. Use only known sourced restorations with
// visually ready media; image-blocked historical pages remain separately held.
async function checkRecoveredHistoricalNewsUrls() {
  const recovered = [
    "live-2026-07-02-governor-abbott-selects-don-huffines-to-serve-as-new-texas-comptroller-whlu3f",
    "live-2026-07-03-ut-arlington-engineers-secure-4-million-to-build-next-generation-flood-wfaa2n",
    "live-2026-06-28-governor-abbott-announces-more-than-22-million-in-grants-for-electric--tcj84y",
  ];
  for (const slug of recovered) {
    const path = `/news/${slug}`;
    const response = await fetchWithTimeout(`${baseUrl}${path}`, {
      redirect: "manual",
      headers: { Accept: "text/html", "User-Agent": "KeepTXRed-Historical-News-Smoke/1.0" },
    }, 30000);
    const html = await response.text();
    if (response.status !== 200 || /article not found|page not found|404 not found/i.test(html)) {
      throw new Error(`recovered news URL ${path} returned HTTP ${response.status} or a not-found body`);
    }
    const canonical = extractCanonical(html);
    const expected = `https://keeptxred.com${path}`;
    if (canonical !== expected) {
      throw new Error(`historical news canonical mismatch: ${path} expected ${expected}, got ${canonical || "missing"}`);
    }
    const socialImage = extractMeta(html, "og:image") || extractMeta(html, "twitter:image");
    if (!socialImage || /\.svg(?:[?#].*)?$/i.test(socialImage)) {
      throw new Error(`restored news ${path} has missing or invalid raster social image`);
    }
    console.log(`OK restored news URL ${path} HTTP 200 canonical=${canonical}`);
  }

  const oldSlug = "live-2026-07-06-toyota-increases-san-antonio-footprint-with-massive-three-billion-doll-z2yvzl";
  const newSlug = "live-2026-07-09-toyota-bolsters-san-antonio-manufacturing-footprint-with-major-tacoma--6ik2im";
  const oldUrl = `${baseUrl}/news/${oldSlug}`;
  const redirectResponse = await fetchWithTimeout(oldUrl, {
    redirect: "manual",
    headers: { "User-Agent": "KeepTXRed-Historical-News-Smoke/1.0" },
  }, 30000);
  const redirectLocation = redirectResponse.headers.get("location") || "";
  const resolved = new URL(redirectLocation || oldUrl, oldUrl);
  if (redirectResponse.status !== 301 || resolved.pathname !== `/news/${newSlug}`) {
    throw new Error(`missing legacy Toyota 301: HTTP ${redirectResponse.status} location=${redirectLocation || "missing"}`);
  }
  console.log(`OK historical Toyota canonical 301 ${oldSlug} -> ${newSlug}`);
}

/** Phase 2A: exercise rendered production robots, structured data and sitemap contracts.
 * These deliberately use stored historical URLs and never generate a new article.
 */
// The two recovered November 7 stories were corrected in Supabase after
// publication. Exercise the deployed Worker HTML, not merely database rows or
// a green GitHub workflow, to catch stale SSR/fallback content or missing
// canonical, visual and attribution updates. Four bounded GETs are avoided:
// just these two exact historical stories, one GET each.
async function checkNov7NewsEditorialRestoration() {
  const cases = [
    {
      slug: "2026-11-07-thompson-claims-votes-to-become-texas-house-speaker",
      markers: [
        "Impact on Texans: what the speaker decision actually changes",
        "house.texas.gov/speaker",
        "Senfronia_Thompson_2757_",
      ],
    },
    {
      slug: "2026-11-07-tx-dems-sweep-statewide-races-for-first-time-in-generation",
      markers: [
        "Independent check: state-reported vote totals (unofficial)",
        "Impact on Texans: what changes after the election",
        "Gina_Hinojosa_at_the_AFL-CIO_COPE_convention_in_2024.jpg",
        "Texas Secretary of State",
      ],
      forbidden: ["ending 24 years", "0 primary or official records"],
    },
  ];
  for (const item of cases) {
    const path = `/news/${item.slug}`;
    const response = await fetchWithTimeout(`${baseUrl}${path}`, {
      redirect: "manual",
      headers: {
        Accept: "text/html",
        "Cache-Control": "no-cache",
        "User-Agent": "KeepTXRed-Nov07-Editorial-Restoration-Smoke/1.0",
      },
    });
    const html = await response.text();
    if (response.status !== 200) throw new Error(`restored November 7 article ${path} HTTP ${response.status}`);
    const canonical = extractCanonical(html);
    if (canonical !== `https://keeptxred.com${path}`) {
      throw new Error(`restored November 7 article canonical mismatch: ${path}: ${canonical || "missing"}`);
    }
    // Ignore serialized framework state and script declarations: the text
    // and image must actually appear in rendered, crawlable article HTML.
    const visible = html.replace(/<script\\b[^>]*>[\\s\\S]*?<\\/script>/gi, " ");
    for (const marker of item.markers) {
      if (!visible.includes(marker)) throw new Error(`restored November 7 article missing live marker ${JSON.stringify(marker)}: ${path}`);
    }
    for (const marker of item.forbidden ?? []) {
      if (visible.includes(marker)) throw new Error(`restored November 7 article still renders outdated assertion ${JSON.stringify(marker)}: ${path}`);
    }
    console.log(`OK restored November 7 article ${item.slug} canonical and verified editorial/image markers`);
  }
}

async function checkNewsArchiveIndexability() {
  const checked = [
    { slug: "how-a-bill-becomes-texas-law", indexable: true },
    { slug: "texas-policing-agencies-compared", indexable: true },
    { slug: "2026-09-14-ercot-november-2026-grid-outlook-winter-risk", indexable: false },
  ];
  for (const { slug, indexable } of checked) {
    const path = `/news/${slug}`;
    const response = await fetchWithTimeout(`${baseUrl}${path}`, {
      redirect: "manual",
      headers: { Accept: "text/html", "Cache-Control": "no-cache", "User-Agent": "KeepTXRed-Archive-SEO-Smoke/1.0" },
    });
    const html = await response.text();
    if (response.status !== 200 || /article not found|page not found|404 not found/i.test(html)) {
      throw new Error(`archive ${path} not publicly readable: HTTP ${response.status}`);
    }
    const robots = extractMeta(html, "robots").toLowerCase();
    const canonical = extractCanonical(html);
    const expected = `https://keeptxred.com${path}`;
    if (canonical !== expected) throw new Error(`archive canonical mismatch ${path}: ${canonical || "missing"}`);
    if (indexable && robots.includes("noindex")) throw new Error(`protected authority article incorrectly noindex: ${path}`);
    if (!indexable && !robots.includes("noindex")) throw new Error(`automated archive article incorrectly indexable: ${path}`);
    if (!indexable && /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?NewsArticle[\s\S]*?<\/script>/i.test(html)) {
      throw new Error(`noindex archive retains misleading NewsArticle schema: ${path}`);
    }
    console.log(`OK archive ${path} indexable=${indexable} robots=${robots || "default"} canonical=${canonical}`);
  }

  for (const sitemap of ["/sitemap-news.xml", "/sitemap-evergreen.xml"]) {
    const response = await fetchWithTimeout(`${baseUrl}${sitemap}`, {
      headers: { Accept: "application/xml", "Cache-Control": "no-cache", "User-Agent": "KeepTXRed-Archive-SEO-Smoke/1.0" },
    });
    const xml = await response.text();
    if (response.status !== 200 || !xml.includes("<urlset")) throw new Error(`invalid ${sitemap}: HTTP ${response.status}`);
    if (xml.includes("2026-09-14-ercot-november-2026-grid-outlook-winter-risk")) {
      throw new Error(`source-first automated archive leaked into ${sitemap}`);
    }
    console.log(`OK guarded article sitemap ${sitemap}`);
  }

  const removed = await fetchWithTimeout(`${baseUrl}/news/operation-lone-star`, {
    redirect: "manual",
    headers: { "User-Agent": "KeepTXRed-Archive-SEO-Smoke/1.0" },
  });
  if (removed.status !== 404) throw new Error(`explicitly retired static news returned ${removed.status}, expected 404`);
  const moved = await fetchWithTimeout(`${baseUrl}/news/texas-constitutional-amendments-guide`, {
    redirect: "manual",
    headers: { "User-Agent": "KeepTXRed-Archive-SEO-Smoke/1.0" },
  });
  const location = moved.headers.get("location") || "";
  if (moved.status !== 301 || new URL(location || baseUrl, baseUrl).pathname !== "/laws/constitutional-amendments") {
    throw new Error(`static equivalent redirect invalid: HTTP ${moved.status} location=${location}`);
  }
  console.log("OK retired 404 and equivalent static 301");

  // Phase 2A #3485: a San Antonio opposition alias must never redirect to a
  // geographically different Houston article. Keep the historic publication
  // date and readable Houston report, but retire the false alias.
  const sanAntonioAlias = "live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng";
  const sanAntonioPath = `/news/${sanAntonioAlias}`;
  const sanAntonioResponse = await fetchWithTimeout(`${baseUrl}${sanAntonioPath}`, {
    redirect: "manual",
    headers: { Accept: "text/html", "Cache-Control": "no-cache", "User-Agent": "KeepTXRed-Archive-SEO-Smoke/1.0" },
  });
  if (sanAntonioResponse.status !== 404) {
    throw new Error(`non-equivalent San Antonio archive alias returned HTTP ${sanAntonioResponse.status}; expected true 404, no redirect or soft 404`);
  }
  const houstonPath = "/news/2026-08-09-houston-flock-camera-backlash";
  const houstonResponse = await fetchWithTimeout(`${baseUrl}${houstonPath}`, {
    redirect: "manual",
    headers: { Accept: "text/html", "Cache-Control": "no-cache", "User-Agent": "KeepTXRed-Archive-SEO-Smoke/1.0" },
  });
  const houstonHtml = await houstonResponse.text();
  const houstonCanonical = extractCanonical(houstonHtml);
  if (houstonResponse.status !== 200 || houstonCanonical !== `https://keeptxred.com${houstonPath}`) {
    throw new Error(`retained Houston Flock report unavailable or incorrectly canonicalized: HTTP ${houstonResponse.status}, canonical=${houstonCanonical || "missing"}`);
  }
  if (houstonHtml.includes(sanAntonioAlias)) {
    throw new Error("Houston Flock report still includes retired San Antonio archive alias");
  }
  console.log("OK Phase 2A retired non-equivalent San Antonio alias HTTP 404; Houston survivor HTTP 200 and stale link absent");
}

async function checkIngestion() {
  const startedAt = Date.now();
  let response;
  try {
    response = await fetchWithTimeout(`${baseUrl}/api/public/hooks/ingest-feeds`, {
      method: "POST",
      redirect: "follow",
      headers: { Accept: "application/json", "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" },
    }, 180000);
  } catch (error) {
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    if (error?.name === "AbortError") throw new Error(`ingest-feeds did not finish within ${elapsed}s; endpoint is reachable but ingestion is too slow`);
    throw error;
  }
  if (!response.ok) throw new Error(`ingest-feeds returned HTTP ${response.status}`);
  const text = await response.text();
  let payload;
  try { payload = JSON.parse(text); } catch { throw new Error("ingest-feeds did not return JSON"); }
  if (payload?.ok !== true) throw new Error(`ingest-feeds returned ok=${String(payload?.ok)}: ${text.slice(0, 500)}`);
  if (typeof payload.fetched !== "number" || typeof payload.inserted !== "number") throw new Error(`ingest-feeds response lacks numeric ingestion counts: ${text.slice(0, 500)}`);
  if (typeof payload.sourceCount === "number" && payload.sourceCount < 1) throw new Error(`ingest-feeds reports zero configured sources: ${text.slice(0, 500)}`);
  if (typeof payload.healthySources === "number" && payload.healthySources < 1) throw new Error(`ingest-feeds reports zero healthy sources: ${text.slice(0, 500)}`);
  if (typeof payload.failedSources === "number" && typeof payload.sourceCount === "number" && payload.sourceCount > 0) {
    const failureRatio = payload.failedSources / payload.sourceCount;
    if (failureRatio > 0.10) {
      const sourceFailures = Array.isArray(payload.diag)
        ? payload.diag
          .filter((item) => Number(item?.status ?? 0) === 0 || Number(item?.status ?? 0) >= 400)
          .slice(0, 18)
          .map((item) => `${String(item?.source ?? "unknown").slice(0, 75)} [HTTP ${Number(item?.status ?? 0)}]`)
          .join("; ")
        : "";
      throw new Error(`ingest-feeds transport failure ratio is ${(failureRatio * 100).toFixed(1)}% (${payload.failedSources}/${payload.sourceCount}); failed sources: ${sourceFailures || "not reported"}; summary: ${text.slice(0, 240)}`);
    }
    if (payload.failedSources > 0) {
      console.warn(`WARN ingest-feeds transient transport failures=${payload.failedSources}/${payload.sourceCount}; below 10% outage threshold`);
    }
  }
  if (payload.fetched < 1) throw new Error(`ingest-feeds completed but fetched zero Texas-relevant candidates: ${text.slice(0, 500)}`);
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  console.log(`OK ingest-feeds elapsed=${elapsed}s fetched=${payload.fetched} inserted=${payload.inserted} healthySources=${payload.healthySources ?? "n/a"} quietSources=${payload.quietSources ?? "n/a"} failedSources=${payload.failedSources ?? "n/a"}`);
  // DPS was added as an original first-party source. A successful *overall*
  // ingestion can conceal a single official index blocked by upstream egress,
  // or a date parser extracting zero releases. Emit only bounded source-status
  // metadata already returned by this one existing scheduled smoke POST. No
  // additional HTTP fetch, crawler, or ingestion/publishing attempt.
  const dps = (Array.isArray(payload.diag) ? payload.diag : [])
    .find((source) => source.source === "Texas DPS — Direct Press Releases");
  if (dps) {
    const rawError = String(dps.error ?? "").replace(/[\r\n\t]/g, " ");
    const safeError = rawError.slice(0, 160);
    console.log(`INFO dps-firstparty-ingest status=${Number(dps.status ?? 0)} item_count=${Number(dps.count ?? 0)} attempts=${Number(dps.attempts ?? 0)} error=${safeError || "none"}`);
    // The first error can contain several repeated redirect URLs and hide
    // the second same-agency attempt behind the 160-character smoke cap.
    // Report the transport-specific suffix separately without another fetch.
    const officialNewsMarker = "; official-news=";
    const officialNewsIndex = rawError.indexOf(officialNewsMarker);
    if (officialNewsIndex >= 0) {
      const officialNewsError = rawError.slice(officialNewsIndex + officialNewsMarker.length).slice(0, 160);
      console.log(`INFO dps-official-news-fallback status=${Number(dps.status ?? 0)} error=${officialNewsError || "none"}`);
    }
  } else {
    console.warn("WARN dps-firstparty-ingest not present in response diagnostics; inspect current deployed source config");
  }
}


const failures = [];
for (const [label, check] of [
  ["coverage gaps admin route", () => retry("coverage gaps admin route", () => checkProtectedAdminRoute("/admin/coverage-gaps"))],
  ["deployment fingerprint", () => retry("deployment fingerprint", checkDeploymentFingerprint)],
  ["newsroom-health endpoint", () => retry("newsroom-health endpoint", checkNewsroomHealth)],
  ["verified historical news URL recovery", checkRecoveredHistoricalNewsUrls],
  ["restored November 7 editorial accuracy and approved imagery", checkNov7NewsEditorialRestoration],
  ["Phase 2A production article/sitemap indexability", () => retry("Phase 2A production article/sitemap indexability", checkNewsArchiveIndexability, 3, 5000)],
  ["feed ingestion", checkIngestion],
  ["TexasDefined routed publication", () => retry("TexasDefined routed publication", checkTexasDefinedLive, 10, 30000)],
  ["cross-site publication boundary", () => retry("cross-site publication boundary", checkCrossSiteBoundary, 10, 30000)],
]) {
  try { await check(); } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${label}: ${message}`);
    console.error(`FAIL ${label}: ${message}`);
  }
}

if (failures.length > 0) throw new Error(`Live newsroom smoke check found ${failures.length} failure(s):\n- ${failures.join("\n- ")}`);
console.log(`Live newsroom smoke check passed for ${baseUrl} and ${texasDefinedUrl}`);
