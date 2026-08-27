const baseUrl = (process.env.KTR_BASE_URL || "https://keeptxred.com").replace(/\/$/, "");
const texasDefinedUrl = (process.env.TEXASDEFINED_BASE_URL || "https://texasdefined.com").replace(/\/$/, "");
const expectedFingerprint = (process.env.KTR_EXPECTED_FINGERPRINT || "").trim();

const requiredDirectCoverageSources = [
  "Community Impact — Texas Hyperlocal",
  "KRIS 6 — Corpus Christi Local",
  "KZTV Action 10 — Corpus Christi Local",
  "Texas City Municipal Agendas — CivicEngage",
  "Sinton City Council Agendas — CivicEngage",
  "Orange City Council Agendas — CivicEngage",
  "Webster City Council Agendas — CivicEngage",
  "Aubrey City Council Agendas — CivicEngage",
  "Paris Texas City Notices — CivicEngage",
  "Galveston City Council Agendas — CivicEngage",
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
  if (payload.coverageGapCount !== 0) throw new Error(`newsroom-health reports ${payload.coverageGapCount} unresolved source coverage gap(s)`);
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
  if (typeof payload.failedSources === "number" && payload.failedSources > 0) throw new Error(`ingest-feeds reports ${payload.failedSources} transport-failed source(s): ${text.slice(0, 700)}`);
  if (payload.fetched < 1) throw new Error(`ingest-feeds completed but fetched zero Texas-relevant candidates: ${text.slice(0, 500)}`);
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  console.log(`OK ingest-feeds elapsed=${elapsed}s fetched=${payload.fetched} inserted=${payload.inserted} healthySources=${payload.healthySources ?? "n/a"} quietSources=${payload.quietSources ?? "n/a"} failedSources=${payload.failedSources ?? "n/a"}`);
}

const failures = [];
for (const [label, check] of [
  ["coverage gaps admin route", () => retry("coverage gaps admin route", () => checkProtectedAdminRoute("/admin/coverage-gaps"))],
  ["deployment fingerprint", () => retry("deployment fingerprint", checkDeploymentFingerprint)],
  ["newsroom-health endpoint", () => retry("newsroom-health endpoint", checkNewsroomHealth)],
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
