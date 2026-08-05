const baseUrl = (process.env.KTR_BASE_URL || "https://keeptxred.com").replace(/\/$/, "");

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkPage(path, expectedText) {
  const response = await fetchWithTimeout(`${baseUrl}${path}`, {
    headers: { "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0" },
  });
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  const body = await response.text();
  if (!body.includes(expectedText)) {
    throw new Error(`${path} did not contain expected marker: ${expectedText}`);
  }
  console.log(`OK ${path} (${response.status})`);
}

async function checkIngestion() {
  const startedAt = Date.now();
  let response;
  try {
    response = await fetchWithTimeout(`${baseUrl}/api/public/hooks/ingest-feeds`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "User-Agent": "KeepTXRed-Newsroom-Smoke/1.0",
      },
    }, 180000);
  } catch (error) {
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    if (error?.name === "AbortError") {
      throw new Error(`ingest-feeds did not finish within ${elapsed}s; endpoint is reachable but ingestion is too slow`);
    }
    throw error;
  }
  if (!response.ok) {
    throw new Error(`ingest-feeds returned HTTP ${response.status}`);
  }
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("ingest-feeds did not return JSON");
  }
  if (payload?.ok !== true) {
    throw new Error(`ingest-feeds returned ok=${String(payload?.ok)}: ${text.slice(0, 500)}`);
  }
  if (typeof payload.fetched !== "number" && typeof payload.inserted !== "number") {
    throw new Error(`ingest-feeds response lacks ingestion counts: ${text.slice(0, 500)}`);
  }
  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  console.log(`OK ingest-feeds elapsed=${elapsed}s fetched=${payload.fetched ?? "n/a"} inserted=${payload.inserted ?? "n/a"}`);
}

const routeResults = await Promise.allSettled([
  checkPage("/admin/coverage-gaps", "Coverage Gaps"),
  checkPage("/admin/source-health", "Source Health"),
]);
for (const result of routeResults) {
  if (result.status === "rejected") throw result.reason;
}

await checkIngestion();
console.log(`Live newsroom smoke check passed for ${baseUrl}`);
