const baseUrl = (process.env.KTR_BASE_URL || "https://keeptxred.com").replace(/\/$/, "");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal, redirect: "follow" });
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

async function checkPage(path, expectedTexts) {
  const response = await fetchWithTimeout(`${baseUrl}${path}`, {
    headers: { "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" },
  });
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  const body = await response.text();
  for (const expectedText of expectedTexts) {
    if (!body.includes(expectedText)) throw new Error(`${path} did not contain expected marker: ${expectedText}`);
  }
  console.log(`OK ${path} (${response.status})`);
}

async function checkNewsroomHealth() {
  const response = await fetchWithTimeout(`${baseUrl}/api/public/newsroom-health`, {
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
    throw new Error(`newsroom-health is not ready (${response.status}): ${text.slice(0, 500)}`);
  }
  console.log(`OK newsroom-health sources=${payload.sourceCount} gaps=${payload.coverageGapCount} items24h=${payload.items24h}`);
}

async function checkIngestion() {
  const startedAt = Date.now();
  let response;
  try {
    response = await fetchWithTimeout(`${baseUrl}/api/public/hooks/ingest-feeds`, {
      method: "POST",
      headers: { Accept: "application/json", "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" },
    }, 180000);
  } catch (error) {
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    if (error?.name === "AbortError") {
      throw new Error(`ingest-feeds did not finish within ${elapsed}s; endpoint is reachable but ingestion is too slow`);
    }
    throw error;
  }
  if (!response.ok) throw new Error(`ingest-feeds returned HTTP ${response.status}`);
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("ingest-feeds did not return JSON");
  }
  if (payload?.ok !== true) throw new Error(`ingest-feeds returned ok=${String(payload?.ok)}: ${text.slice(0, 500)}`);
  if (typeof payload.fetched !== "number" && typeof payload.inserted !== "number") {
    throw new Error(`ingest-feeds response lacks ingestion counts: ${text.slice(0, 500)}`);
  }
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  console.log(`OK ingest-feeds elapsed=${elapsed}s fetched=${payload.fetched ?? "n/a"} inserted=${payload.inserted ?? "n/a"}`);
}

await retry("newsroom QA route", () => checkPage("/admin/coverage-gaps", ["Coverage Gaps", "Source Health"]));
await retry("newsroom-health endpoint", checkNewsroomHealth);
await checkIngestion();
console.log(`Live newsroom smoke check passed for ${baseUrl}`);
